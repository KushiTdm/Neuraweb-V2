// app/api/newsletter/route.ts
//
// POST → inscription depuis le formulaire du footer (opt-in simple).
// GET  → désinscription via le lien envoyé dans chaque email (?token=...).

import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sendNewsletterWelcomeEmail } from '@/lib/email-service';
import { rateLimitRequest, isValidEmail, isHoneypotFilled } from '@/lib/rate-limit';
import { getServiceSupabase } from '@/lib/supabase-server';

const BASE_URL = 'https://neuraweb.fr';
const SUPPORTED_LANGUAGES = ['fr', 'en', 'es', 'vi'];

function unsubscribeUrl(token: string): string {
  return `${BASE_URL}/api/newsletter?token=${encodeURIComponent(token)}`;
}

// ─────────────────────────────────────────────
// POST — Inscription
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const limit = rateLimitRequest(request, 'newsletter-subscribe', { max: 5, windowMs: 60_000 });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez dans une minute.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter ?? 60) } }
      );
    }

    const body = await request.json();
    const { email, language } = body;

    // Honeypot : champ leurre rempli = bot → on acquitte sans rien traiter.
    if (isHoneypotFilled(body)) {
      return NextResponse.json({ success: true });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 });
    }

    const lang = SUPPORTED_LANGUAGES.includes(language) ? language : 'fr';
    const normalizedEmail = String(email).trim().toLowerCase();

    const supabase = getServiceSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Service indisponible.' }, { status: 503 });
    }

    // Déjà abonné (et toujours actif) → pas de doublon, pas de nouvel email.
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status, unsubscribe_token')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existing?.status === 'subscribed') {
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

    const token = randomBytes(24).toString('hex');

    if (existing) {
      // Ré-inscription après désinscription : on réactive la ligne existante.
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          status: 'subscribed',
          language: lang,
          unsubscribe_token: token,
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
        })
        .eq('id', existing.id);
      if (error) {
        console.error('Newsletter resubscribe error:', error);
        return NextResponse.json({ error: 'Inscription impossible.' }, { status: 500 });
      }
    } else {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: normalizedEmail,
        language: lang,
        unsubscribe_token: token,
        source: 'footer',
      });
      if (error) {
        console.error('Newsletter subscribe error:', error);
        return NextResponse.json({ error: 'Inscription impossible.' }, { status: 500 });
      }
    }

    const emailResult = await sendNewsletterWelcomeEmail({
      email: normalizedEmail,
      language: lang,
      unsubscribeUrl: unsubscribeUrl(token),
    });
    if (!emailResult.success) {
      console.warn('Newsletter welcome email warning:', emailResult.error);
    }

    return NextResponse.json({ success: true, emailSent: emailResult.success });
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription : ' + error.message },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────
// GET — Désinscription (lien cliqué depuis un email)
// Renvoie une page HTML autonome (pas de page Next.js : évite d'avoir à
// référencer cette URL utilitaire dans le sitemap/SEO).
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const token = new URL(request.url).searchParams.get('token');

  const page = (message: string, ok: boolean) => `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>NeuraWeb — Newsletter</title>
<style>
  body { background:#050510; color:#e5e7eb; font-family:system-ui,-apple-system,sans-serif;
         display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; padding:24px; }
  .card { max-width:420px; text-align:center; background:#0f0f1a; border:1px solid rgba(255,255,255,0.08);
          border-radius:16px; padding:40px 32px; }
  h1 { font-size:20px; margin:0 0 12px; color:${ok ? '#22d3ee' : '#f43f5e'}; }
  p { font-size:15px; color:#9ca3af; line-height:1.6; margin:0; }
  a { color:#6366f1; text-decoration:none; font-weight:600; }
</style></head>
<body><div class="card"><h1>${ok ? '✓' : '✗'} ${ok ? 'Désinscription confirmée' : 'Lien invalide'}</h1>
<p>${message}</p><p style="margin-top:20px"><a href="${BASE_URL}">Retour à neuraweb.fr</a></p>
</div></body></html>`;

  if (!token) {
    return new NextResponse(page('Lien de désinscription invalide ou incomplet.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return new NextResponse(page('Service indisponible pour le moment. Réessayez plus tard.', false), {
      status: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
    .eq('unsubscribe_token', token)
    .select('email')
    .maybeSingle();

  if (error || !data) {
    return new NextResponse(page('Ce lien de désinscription n\'est plus valide.', false), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new NextResponse(
    page(`${data.email} a bien été retiré de la newsletter NeuraWeb.`, true),
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
