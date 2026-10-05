// ============================================================
// app/api/cron/campagne-alertes/route.ts
// Alerte téléphone (app fermée) quand un commentaire Facebook d'une
// publication de campagne reste sans réponse de la Page depuis plus d'une
// heure — règle des 2 heures du jeu « Mỗi tuần một trang ».
//
// Appelée toutes les 15 minutes par pg_cron + pg_net depuis Supabase
// (migration 0010), avec `Authorization: Bearer <CRON_SECRET>`.
//
// 1. Publications publiées et rattachées des 7 derniers jours (campagnes actives).
// 2. Commentaires de 1er niveau sans réponse de la Page, postés il y a
//    plus d'1 h et moins de 72 h.
// 3. Ceux déjà signalés (table editorial.campagne_alertes) sont ignorés.
// 4. Une seule notification groupée via ntfy (app gratuite Android / iOS).
//
// Heures calmes : de 22h30 à 7h (heure de Hanoi), rien n'est envoyé ; les
// commentaires restent en attente et partent au premier passage après 7h.
//
// Variables (Vercel) : CRON_SECRET, NTFY_TOPIC, [NTFY_SERVER], [NTFY_TOKEN].
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { editorialDb } from '@/lib/mobile-api';
import { facebookPageConfig } from '@/lib/facebook-graph';
import { fetchComments, type CampagneComment } from '@/lib/campagne-facebook';
import { loadActiveCampagnes } from '@/lib/campagne-db';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const MIN_AGE_MS = 60 * 60 * 1000;
const MAX_AGE_MS = 72 * 60 * 60 * 1000;
const PUBLICATION_WINDOW_DAYS = 7;

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const h = req.headers.get('authorization') ?? '';
  return h === `Bearer ${secret}`;
}

/** Heures calmes à Hanoi (UTC+7, sans heure d'été) : 22h30 → 7h00. */
function isQuietHours(now = new Date()): boolean {
  const minutes = (now.getUTCHours() * 60 + now.getUTCMinutes() + 7 * 60) % (24 * 60);
  return minutes >= 22 * 60 + 30 || minutes < 7 * 60;
}

function excerpt(s: string, n = 90): string {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

async function sendNtfy(input: { title: string; message: string; click?: string | null }) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) throw new Error('NTFY_TOPIC non configuré (Vercel).');
  const server = (process.env.NTFY_SERVER || 'https://ntfy.sh').replace(/\/+$/, '');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (process.env.NTFY_TOKEN) headers.Authorization = `Bearer ${process.env.NTFY_TOKEN}`;
  const res = await fetch(server, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      topic,
      title: input.title,
      message: input.message,
      priority: 4,
      tags: ['speech_balloon'],
      ...(input.click ? { click: input.click } : {}),
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`ntfy a refusé la notification (HTTP ${res.status}).`);
}

async function handle(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });

  const now = Date.now();
  if (isQuietHours(new Date(now))) return NextResponse.json({ ok: true, skipped: 'heures calmes' });

  const db = editorialDb();
  const campagnes = await loadActiveCampagnes();
  const since = new Date(now - PUBLICATION_WINDOW_DAYS * 86_400_000).toISOString();
  const found: { comment: CampagneComment; publicationId: number; titre: string }[] = [];
  const errors: string[] = [];

  for (const c of campagnes) {
    let page;
    try {
      page = facebookPageConfig(c.marche);
    } catch (e) {
      errors.push(`${c.nom} : ${e instanceof Error ? e.message : String(e)}`);
      continue;
    }
    const { data: pubs, error } = await db
      .from('campagne_publications')
      .select('id, titre, facebook_post_id')
      .eq('campagne_id', c.id)
      .eq('statut', 'publie')
      .not('facebook_post_id', 'is', null)
      .gte('date_publication', since);
    if (error) {
      errors.push(`${c.nom} : ${error.message}`);
      continue;
    }
    for (const p of pubs ?? []) {
      try {
        const { comments } = await fetchComments(page, String(p.facebook_post_id), 2);
        for (const cm of comments) {
          const unanswered = cm.repondu === null ? cm.reponses === 0 : !cm.repondu;
          const created = cm.createdTime ? new Date(cm.createdTime).getTime() : NaN;
          if (!unanswered || !Number.isFinite(created)) continue;
          const age = now - created;
          if (age >= MIN_AGE_MS && age <= MAX_AGE_MS) found.push({ comment: cm, publicationId: Number(p.id), titre: String(p.titre) });
        }
      } catch (e) {
        errors.push(`« ${p.titre} » : ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  if (found.length === 0) return NextResponse.json({ ok: true, nouveaux: 0, erreurs: errors });

  const { data: already, error: readErr } = await db
    .from('campagne_alertes')
    .select('comment_id')
    .in('comment_id', found.map((f) => f.comment.id));
  if (readErr) return NextResponse.json({ error: `Lecture des alertes impossible : ${readErr.message}` }, { status: 502 });
  const done = new Set((already ?? []).map((r) => String(r.comment_id)));
  const fresh = found.filter((f) => !done.has(f.comment.id));
  if (fresh.length === 0) return NextResponse.json({ ok: true, nouveaux: 0, erreurs: errors });

  const lines = fresh.slice(0, 3).map((f) => `« ${excerpt(f.comment.message)} » sur ${excerpt(f.titre, 40)}`);
  if (fresh.length > 3) lines.push(`… et ${fresh.length - 3} autre(s).`);
  try {
    await sendNtfy({
      title: `${fresh.length} commentaire${fresh.length > 1 ? 's' : ''} sans réponse depuis plus d'1 h`,
      message: lines.join('\n'),
      click: fresh[0].comment.permalink,
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e), erreurs: errors }, { status: 502 });
  }

  // Marqués après l'envoi : un échec d'envoi sera retenté au passage suivant.
  const { error: insErr } = await db.from('campagne_alertes').upsert(
    fresh.map((f) => ({
      comment_id: f.comment.id,
      publication_id: f.publicationId,
      created_time: f.comment.createdTime,
    })),
    { onConflict: 'comment_id' },
  );
  if (insErr) errors.push(`Alertes envoyées mais non mémorisées : ${insErr.message}`);

  return NextResponse.json({ ok: true, nouveaux: fresh.length, erreurs: errors });
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
