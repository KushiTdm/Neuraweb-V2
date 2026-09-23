// ============================================================
// app/api/mobile/x/metrics/route.ts
// Remplace le workflow n8n `Métriques_X_Supabase` (webhook neuraweb-metriques-x).
//
// POST (sans body) : lit les ~20 derniers tweets du compte NeuraWeb (API X v2,
// lecture PAYANTE) et upsert leurs métriques dans editorial.metriques_posts
// (clé plateforme + id_post). Uniquement déclenché par le bouton
// « Récupérer » de l'app — jamais planifié, pour ne pas facturer de lectures
// inutiles. Réponse : { ok, count }.
//
// Variables d'environnement (Vercel) :
//   X_BEARER_TOKEN  Bearer token de l'app X (lecture seule suffit)
//   X_USER_ID       id numérique du compte (défaut : compte NeuraWeb)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/mobile-auth';
import { ApiError, editorialDb, routeErrorResponse } from '@/lib/mobile-api';
import { isoWeek } from '@/lib/social-text';

export const maxDuration = 30;

const DEFAULT_X_USER_ID = '2015243377755754496';

interface XTweet {
  id: string;
  text?: string;
  created_at?: string;
  public_metrics?: {
    impression_count?: number;
    like_count?: number;
    reply_count?: number;
    retweet_count?: number;
    quote_count?: number;
    bookmark_count?: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);

    const bearer = process.env.X_BEARER_TOKEN;
    if (!bearer) throw new ApiError('X_BEARER_TOKEN non configuré côté serveur (Vercel).', 503);
    const userId = process.env.X_USER_ID || DEFAULT_X_USER_ID;

    const url = new URL(`https://api.twitter.com/2/users/${userId}/tweets`);
    url.searchParams.set('max_results', '20');
    url.searchParams.set('tweet.fields', 'public_metrics,created_at');
    url.searchParams.set('exclude', 'retweets,replies');

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${bearer}` },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[x-metrics] API X', res.status, detail.slice(0, 300));
      if (res.status === 401) throw new ApiError('Token X invalide ou expiré (X_BEARER_TOKEN).', 502);
      if (res.status === 402 || res.status === 403) {
        throw new ApiError("L'API X a refusé la lecture (crédits épuisés ou accès non autorisé sur ton plan).", 502);
      }
      if (res.status === 429) throw new ApiError("Limite de requêtes de l'API X atteinte — réessaie plus tard.", 429);
      throw new ApiError(`Erreur de l'API X (${res.status}).`, 502);
    }

    const body = (await res.json()) as { data?: XTweet[] };
    const tweets = body.data ?? [];
    if (tweets.length === 0) return NextResponse.json({ ok: true, count: 0 });

    const now = new Date();
    const rows = tweets.map((t) => {
      const m = t.public_metrics ?? {};
      const createdAt = t.created_at ?? now.toISOString();
      const created = new Date(createdAt);
      return {
        id_post: t.id,
        plateforme: 'X',
        contenu_resume: (t.text ?? '').slice(0, 280),
        impressions: m.impression_count ?? 0,
        likes: m.like_count ?? 0,
        commentaires: m.reply_count ?? 0,
        partages: (m.retweet_count ?? 0) + (m.quote_count ?? 0),
        // Les clics sur lien ne sont pas dans public_metrics (API Analytics/Ads,
        // niveau payant différent) : null plutôt qu'une valeur inventée.
        clics: null,
        saves_bookmarks: m.bookmark_count ?? 0,
        url_post: `https://x.com/i/web/status/${t.id}`,
        date_publication: createdAt,
        date_collecte: now.toISOString(),
        semaine_numero: isoWeek(created),
        annee: created.getUTCFullYear(),
        // score_editorial / abonnes_moment volontairement absents : renseignés
        // par Claude routine (rétro du dimanche), l'upsert ne les écrase pas.
      };
    });

    const { error } = await editorialDb()
      .from('metriques_posts')
      .upsert(rows, { onConflict: 'plateforme,id_post' });
    if (error) throw new ApiError(`Écriture des métriques impossible : ${error.message}`, 502);

    return NextResponse.json({ ok: true, count: rows.length });
  } catch (e) {
    return routeErrorResponse(e);
  }
}
