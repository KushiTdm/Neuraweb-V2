// lib/newsletter-campaigns.ts
//
// Logique partagée des campagnes newsletter, appelée par 3 déclencheurs :
//   1. app/api/newsletter/campaigns/route.ts   — n8n crée la campagne après publication.
//   2. app/api/mobile/newsletter/campaigns/[id]/route.ts — approbation manuelle (envoi immédiat).
//   3. app/api/newsletter/process-scheduled/route.ts — cron n8n, envoi à l'heure programmée.
//
// Aucun envoi n'a lieu sans création explicite + validation humaine (mobile).

import { getServiceSupabase } from '@/lib/supabase-server';
import { getPostBySlug } from '@/lib/mdx';
import { sendNewsletterArticleEmail } from '@/lib/email-service';

const BASE_URL = 'https://neuraweb.fr';
const CONCURRENCY = 5;
export const SUPPORTED_LANGUAGES = ['fr', 'en', 'es'] as const;
export type CampaignLang = (typeof SUPPORTED_LANGUAGES)[number];

function unsubscribeUrl(token: string): string {
  return `${BASE_URL}/api/newsletter?token=${encodeURIComponent(token)}`;
}

export interface CreateCampaignResult {
  ok: boolean;
  error?: string;
  campaign?: Record<string, any>;
  alreadyExists?: boolean;
}

/**
 * Crée une campagne `pending_review` à partir d'un article publié.
 * N'envoie aucun email — l'envoi nécessite une validation explicite
 * (approbation immédiate ou programmation) depuis l'app mobile.
 */
export async function createCampaignFromPost(slug: string, lang: CampaignLang): Promise<CreateCampaignResult> {
  const post = getPostBySlug(slug, lang);
  if (!post) {
    return { ok: false, error: `Article introuvable : ${lang}/${slug}` };
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return { ok: false, error: 'Supabase indisponible.' };
  }

  const { count } = await supabase
    .from('newsletter_subscribers')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'subscribed')
    .eq('language', lang);

  const { data, error } = await supabase
    .from('newsletter_campaigns')
    .insert({
      slug,
      lang,
      title: post.title,
      excerpt: post.excerpt,
      url: `${BASE_URL}/${lang}/blog/${slug}`,
      image: post.image,
      total_subscribers: count ?? 0,
    })
    .select()
    .single();

  if (error) {
    // Conflit sur l'index unique (slug,lang) actif → une campagne est déjà en cours pour cet article.
    if (error.code === '23505') {
      return { ok: true, alreadyExists: true };
    }
    console.error('createCampaignFromPost error:', error);
    return { ok: false, error: error.message };
  }

  return { ok: true, campaign: data };
}

export interface SendCampaignResult {
  ok: boolean;
  error?: string;
  alreadySent?: boolean;
  sent?: number;
  failed?: number;
  total?: number;
}

/**
 * Envoie réellement les emails d'une campagne à tous les abonnés actifs de
 * sa langue, puis marque la campagne `sent` (ou `failed` si la lecture des
 * abonnés échoue). Idempotent : un appel sur une campagne déjà `sent` est
 * un no-op.
 */
export async function sendCampaign(campaignId: string): Promise<SendCampaignResult> {
  const supabase = getServiceSupabase();
  if (!supabase) return { ok: false, error: 'Supabase indisponible.' };

  const { data: campaign, error: fetchErr } = await supabase
    .from('newsletter_campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();

  if (fetchErr || !campaign) return { ok: false, error: 'Campagne introuvable.' };
  if (campaign.status === 'sent') return { ok: true, alreadySent: true };

  await supabase.from('newsletter_campaigns').update({ status: 'sending' }).eq('id', campaignId);

  const { data: subscribers, error: subErr } = await supabase
    .from('newsletter_subscribers')
    .select('email, unsubscribe_token')
    .eq('status', 'subscribed')
    .eq('language', campaign.lang);

  if (subErr) {
    await supabase.from('newsletter_campaigns').update({ status: 'failed' }).eq('id', campaignId);
    console.error('sendCampaign — lecture abonnés échouée:', subErr);
    return { ok: false, error: subErr.message };
  }

  const list = subscribers ?? [];
  const article = {
    title: campaign.title as string,
    excerpt: (campaign.excerpt as string) ?? '',
    url: campaign.url as string,
    image: (campaign.image as string) ?? undefined,
  };

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < list.length; i += CONCURRENCY) {
    const batch = list.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map((sub) =>
        sendNewsletterArticleEmail({
          email: sub.email,
          language: campaign.lang,
          unsubscribeUrl: unsubscribeUrl(sub.unsubscribe_token),
          article,
        })
      )
    );
    for (const r of results) (r.success ? sent++ : failed++);
  }

  await supabase
    .from('newsletter_campaigns')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      sent_count: sent,
      failed_count: failed,
      total_subscribers: list.length,
    })
    .eq('id', campaignId);

  return { ok: true, sent, failed, total: list.length };
}
