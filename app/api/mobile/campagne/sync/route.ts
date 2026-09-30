// ============================================================
// app/api/mobile/campagne/sync/route.ts
// Bouton « Actualiser » de l'onglet Campagne : relève les chiffres Facebook
// des campagnes actives et les écrit en base, où l'app ET Claude routine les
// lisent (vue editorial.campagne_suivi).
//
// POST { campagne_id? } (sans id : toutes les campagnes actives)
//   1. Page : abonnés → editorial.campagne_page_stats (une ligne par relevé).
//   2. Rattachement automatique : une publication marquée « publiée ailleurs »
//      (statut publie, sans facebook_post_id) est reliée au post de la Page
//      dont le texte est le plus proche (≥ 60 % de mots communs) et publié
//      entre la veille et J+3 de sa date prévue.
//   3. Métriques des publications rattachées des 21 derniers jours (25 max) :
//      vues, personnes atteintes, réactions, commentaires, partages, clics,
//      vues vidéo, commentaires conformes (posts d'appel) et commentaires
//      sans réponse de la Page → editorial.campagne_metriques.
// Jamais planifié : c'est l'humain qui déclenche (lecture Graph gratuite,
// mais inutile de solliciter l'API en continu).
// Réponse : { ok, campagnes: [{ id, nom, page, liees_auto, synchronisees, erreurs }] }
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/mobile-auth';
import { ApiError, editorialDb, routeErrorResponse } from '@/lib/mobile-api';
import { facebookPageConfig, type FacebookPageConfig } from '@/lib/facebook-graph';
import {
  countUnanswered,
  fetchComments,
  fetchPageInfo,
  fetchPostStats,
  listRecentPagePosts,
  textSimilarity,
  type PageInfo,
} from '@/lib/campagne-facebook';
import { loadActiveCampagnes, loadCampagne, type CampagneRow, type PublicationRow } from '@/lib/campagne-db';

export const maxDuration = 60;

const METRICS_WINDOW_DAYS = 21;
const MAX_PUBLICATIONS = 25;
const MATCH_THRESHOLD = 0.6;
const CONCURRENCY = 4;

interface CampagneSyncResult {
  id: number;
  nom: string;
  page: PageInfo | null;
  liees_auto: number;
  synchronisees: number;
  erreurs: string[];
}

/** Exécute `fn` sur chaque élément, `limit` à la fois. */
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return out;
}

function daysBetween(isoA: string, dateB: string): number {
  const a = new Date(isoA).getTime();
  const b = new Date(`${dateB}T12:00:00+07:00`).getTime();
  return (a - b) / 86_400_000;
}

async function autoLink(
  page: FacebookPageConfig,
  campagne: CampagneRow,
  erreurs: string[],
): Promise<number> {
  const db = editorialDb();
  const { data: unlinked, error } = await db
    .from('campagne_publications')
    .select('id, date_prevue, texte_publication')
    .eq('campagne_id', campagne.id)
    .eq('statut', 'publie')
    .is('facebook_post_id', null)
    .order('date_prevue', { ascending: false })
    .limit(20);
  if (error) {
    erreurs.push(`Lecture des publications à rattacher : ${error.message}`);
    return 0;
  }
  if (!unlinked?.length) return 0;

  const posts = await listRecentPagePosts(page, 30);
  if (posts.length === 0) return 0;
  const { data: taken } = await db
    .from('campagne_publications')
    .select('facebook_post_id')
    .in('facebook_post_id', posts.map((p) => p.id));
  const used = new Set((taken ?? []).map((r) => String(r.facebook_post_id)));

  let linked = 0;
  for (const u of unlinked) {
    let best: { id: string; permalink: string | null; created: string | null; score: number } | null = null;
    for (const post of posts) {
      if (used.has(post.id) || !post.createdTime || !post.message) continue;
      const delta = daysBetween(post.createdTime, String(u.date_prevue));
      if (delta < -1.5 || delta > 3.5) continue;
      const score = textSimilarity(String(u.texte_publication ?? ''), post.message);
      if (score >= MATCH_THRESHOLD && (!best || score > best.score)) {
        best = { id: post.id, permalink: post.permalink, created: post.createdTime, score };
      }
    }
    if (!best) continue;
    const { error: upErr } = await db
      .from('campagne_publications')
      .update({ facebook_post_id: best.id, permalink_url: best.permalink, date_publication: best.created })
      .eq('id', u.id);
    if (upErr) {
      erreurs.push(`Rattachement de la publication ${u.id} : ${upErr.message}`);
      continue;
    }
    used.add(best.id);
    linked++;
  }
  return linked;
}

async function syncPublication(
  page: FacebookPageConfig,
  p: Pick<PublicationRow, 'id' | 'titre' | 'role' | 'format' | 'facebook_post_id' | 'permalink_url'>,
): Promise<string | null> {
  const fbId = p.facebook_post_id as string;
  try {
    const stats = await fetchPostStats(page, fbId, { isVideo: p.format === 'video' });

    let conformes: number | null = null;
    let sansReponse: number | null = null;
    let approx = false;
    try {
      const { comments, approx: a } = await fetchComments(page, fbId, 3);
      approx = a;
      sansReponse = countUnanswered(comments);
      if (p.role === 'appel') conformes = comments.filter((c) => c.conforme).length;
    } catch (e) {
      stats.indisponibles.push(`commentaires (${e instanceof Error ? e.message : String(e)})`);
    }

    const db = editorialDb();
    const { error } = await db.from('campagne_metriques').insert({
      publication_id: p.id,
      vues: stats.vues,
      personnes_atteintes: stats.personnes_atteintes,
      reactions: stats.reactions,
      commentaires: stats.commentaires,
      partages: stats.partages,
      clics: stats.clics,
      vues_video: stats.vues_video,
      commentaires_conformes: conformes,
      commentaires_sans_reponse: sansReponse,
      brut: {
        indisponibles: stats.indisponibles,
        reponses_estimees: approx,
      },
    });
    if (error) return `« ${p.titre} » : écriture des métriques impossible (${error.message}).`;

    if (stats.permalink && stats.permalink !== p.permalink_url) {
      await db.from('campagne_publications').update({ permalink_url: stats.permalink }).eq('id', p.id);
    }
    return null;
  } catch (e) {
    return `« ${p.titre} » : ${e instanceof Error ? e.message : String(e)}`;
  }
}

async function syncCampagne(campagne: CampagneRow): Promise<CampagneSyncResult> {
  const result: CampagneSyncResult = {
    id: campagne.id,
    nom: campagne.nom,
    page: null,
    liees_auto: 0,
    synchronisees: 0,
    erreurs: [],
  };
  const page = facebookPageConfig(campagne.marche);
  const db = editorialDb();

  // 1. Page — si elle échoue (token, permission), inutile d'aller plus loin.
  result.page = await fetchPageInfo(page);
  const { error: statsErr } = await db.from('campagne_page_stats').insert({
    campagne_id: campagne.id,
    page_id: result.page.id,
    page_nom: result.page.nom,
    page_lien: result.page.lien,
    abonnes: result.page.abonnes,
    fans: result.page.fans,
  });
  if (statsErr) result.erreurs.push(`Statistiques de la Page non enregistrées : ${statsErr.message}`);

  // 2. Rattachement automatique des publications faites hors de l'app.
  try {
    result.liees_auto = await autoLink(page, campagne, result.erreurs);
  } catch (e) {
    result.erreurs.push(`Rattachement automatique : ${e instanceof Error ? e.message : String(e)}`);
  }

  // 3. Métriques des publications rattachées récentes.
  const since = new Date(Date.now() - METRICS_WINDOW_DAYS * 86_400_000).toISOString();
  const { data: pubs, error } = await db
    .from('campagne_publications')
    .select('id, titre, role, format, facebook_post_id, permalink_url, date_publication')
    .eq('campagne_id', campagne.id)
    .eq('statut', 'publie')
    .not('facebook_post_id', 'is', null)
    .gte('date_publication', since)
    .order('date_publication', { ascending: false })
    .limit(MAX_PUBLICATIONS);
  if (error) throw new ApiError(`Lecture des publications impossible : ${error.message}`, 502);

  const errors = await mapLimit(pubs ?? [], CONCURRENCY, (p) => syncPublication(page, p));
  result.synchronisees = errors.filter((e) => e === null).length;
  result.erreurs.push(...errors.filter((e): e is string => e !== null));
  return result;
}

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const raw = b.campagne_id;
    let campagnes: CampagneRow[];
    if (raw !== undefined && raw !== null && String(raw).trim() !== '') {
      const id = Number(raw);
      if (!Number.isInteger(id) || id <= 0) throw new ApiError('campagne_id invalide.', 400);
      campagnes = [await loadCampagne(id)];
    } else {
      campagnes = await loadActiveCampagnes();
    }
    if (campagnes.length === 0) throw new ApiError('Aucune campagne active à synchroniser.', 404);

    const results: CampagneSyncResult[] = [];
    for (const c of campagnes) results.push(await syncCampagne(c));
    return NextResponse.json({ ok: true, campagnes: results });
  } catch (e) {
    return routeErrorResponse(e);
  }
}
