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
// 4. Une seule notification groupée : push Firebase dans l'app (si
//    FIREBASE_SERVICE_ACCOUNT_JSON est configuré), sinon ntfy.
// 5. Même passage : nouveaux e-mails de la boîte contact → push (l'UID du
//    dernier e-mail vu est gardé dans editorial.push_state).
//
// Heures calmes : de 22h30 à 7h (heure de Hanoi), rien n'est envoyé ; les
// commentaires restent en attente et partent au premier passage après 7h.
//
// Variables (Vercel) : CRON_SECRET, FIREBASE_SERVICE_ACCOUNT_JSON ; ntfy en
// secours : NTFY_TOPIC, [NTFY_SERVER], [NTFY_TOKEN].
// Test : GET ?test=1 envoie une notification d'essai.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { editorialDb } from '@/lib/mobile-api';
import { facebookPageConfig } from '@/lib/facebook-graph';
import { fetchComments, type CampagneComment } from '@/lib/campagne-facebook';
import { loadActiveCampagnes } from '@/lib/campagne-db';
import { pushConfigured, sendPush } from '@/lib/push';
import { listEmails } from '@/lib/email-imap';

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

/** Push Firebase si configuré, sinon ntfy. Lève une erreur si rien n'est parti. */
async function notify(input: { title: string; message: string; click?: string | null; channel: string; tag?: string }) {
  if (pushConfigured()) {
    const r = await sendPush({ title: input.title, body: input.message, channel: input.channel, tag: input.tag, data: { url: input.click } });
    if (r.envoyes === 0) throw new Error(r.erreurs[0] ?? 'Aucun appareil joignable.');
    return;
  }
  await sendNtfy(input);
}

/**
 * Nouveaux e-mails de la boîte contact depuis le dernier passage.
 * Au tout premier passage on ne notifie rien : on mémorise seulement le point de départ.
 */
async function checkEmails(): Promise<{ nouveaux: number; erreur?: string }> {
  try {
    const db = editorialDb();
    const emails = await listEmails(15);
    if (emails.length === 0) return { nouveaux: 0 };
    const maxUid = Math.max(...emails.map((e) => e.uid));
    const { data: state } = await db.from('push_state').select('value').eq('key', 'dernier_email_uid').maybeSingle();
    const last = state ? Number((state.value as { uid?: number }).uid ?? -1) : -1;
    const fresh = last >= 0 ? emails.filter((e) => e.uid > last) : [];
    if (fresh.length > 0) {
      const first = fresh[0];
      await notify({
        title: fresh.length === 1 ? `Nouvel e-mail — ${first.fromName || first.from}` : `${fresh.length} nouveaux e-mails`,
        message: fresh.length === 1 ? first.subject : fresh.slice(0, 3).map((e) => `${e.fromName || e.from} : ${e.subject}`).join('\n'),
        channel: 'cockpit',
        tag: `mail-${first.uid}`,
      });
    }
    if (maxUid !== last) {
      await db.from('push_state').upsert({ key: 'dernier_email_uid', value: { uid: maxUid }, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    }
    return { nouveaux: fresh.length };
  } catch (e) {
    return { nouveaux: 0, erreur: e instanceof Error ? e.message : String(e) };
  }
}

async function handle(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });

  if (req.nextUrl.searchParams.get('test') === '1') {
    try {
      await notify({ title: 'Notification de test', message: 'Les alertes du cockpit fonctionnent, app fermée comprise. ✅', channel: 'cockpit' });
      return NextResponse.json({ ok: true, test: true, via: pushConfigured() ? 'firebase' : 'ntfy' });
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 });
    }
  }

  const now = Date.now();
  if (isQuietHours(new Date(now))) return NextResponse.json({ ok: true, skipped: 'heures calmes' });

  const emails = await checkEmails();
  const res = await commentAlerts(now);
  const body = (await res.json()) as Record<string, unknown>;
  return NextResponse.json({ ...body, emails }, { status: res.status });
}

async function commentAlerts(now: number): Promise<NextResponse> {
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
    await notify({
      title: `${fresh.length} commentaire${fresh.length > 1 ? 's' : ''} sans réponse depuis plus d'1 h`,
      message: lines.join('\n'),
      click: fresh[0].comment.permalink,
      channel: 'campagne',
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
