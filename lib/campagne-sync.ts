// ============================================================
// lib/campagne-sync.ts
// Relevé des chiffres Facebook, partagé par :
//   - POST /api/mobile/campagne/sync (bouton « Actualiser » de l'app)
//   - GET  /api/cron/campagne-metriques (relevé automatique chaque nuit)
//
// syncCampagne : Page (abonnés) → rattachement automatique des publications
//   « publiées ailleurs » → métriques des publications rattachées.
// syncOtherPagePosts : TOUS les autres posts de la Page (publiés à la main,
//   hors campagne) → editorial.page_posts / page_posts_metriques, pour que
//   l'IA voie aussi ce qui n'a pas été publié depuis l'app.
// ============================================================

import { ApiError, editorialDb } from '@/lib/mobile-api';
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
import type { CampagneRow, PublicationRow } from '@/lib/campagne-db';

const METRICS_WINDOW_DAYS = 21;
const MAX_PUBLICATIONS = 25;
const MATCH_THRESHOLD = 0.6;
const CONCURRENCY = 4;


export interface CampagneSyncResult {
  id: number;
  nom: string;
  page: PageInfo | null;
  liees_auto: number;
  synchronisees: number;
  erreurs: string[];
}

/** Exécute `fn` sur chaque élément, `limit` à la fois. */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
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

export async function syncCampagne(campagne: CampagneRow): Promise<CampagneSyncResult> {
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


// ── Posts de la Page hors campagne (publiés à la main) ──────

const OTHER_POSTS_WINDOW_DAYS = 30;
const MAX_OTHER_POSTS = 20;

export interface OtherPostsSyncResult {
  vus: number;
  releves: number;
  erreurs: string[];
}

/**
 * Relève les posts récents de la Page qui ne sont rattachés à aucune
 * publication de campagne, et en garde un instantané de chiffres par jour.
 * Les posts rattachés sont seulement référencés (leurs chiffres sont dans
 * campagne_metriques).
 */
export async function syncOtherPagePosts(campagne: CampagneRow): Promise<OtherPostsSyncResult> {
  const result: OtherPostsSyncResult = { vus: 0, releves: 0, erreurs: [] };
  const page = facebookPageConfig(campagne.marche);
  const db = editorialDb();

  const posts = await listRecentPagePosts(page, 40);
  const cutoff = Date.now() - OTHER_POSTS_WINDOW_DAYS * 86_400_000;
  const recent = posts.filter((p) => !p.createdTime || new Date(p.createdTime).getTime() >= cutoff);
  result.vus = recent.length;
  if (recent.length === 0) return result;

  const { data: linked, error: linkErr } = await db
    .from('campagne_publications')
    .select('id, facebook_post_id')
    .in('facebook_post_id', recent.map((p) => p.id));
  if (linkErr) throw new ApiError(`Lecture des publications rattachées impossible : ${linkErr.message}`, 502);
  const publicationByPost = new Map((linked ?? []).map((r) => [String(r.facebook_post_id), Number(r.id)]));

  const { error: upErr } = await db.from('page_posts').upsert(
    recent.map((p) => ({
      post_id: p.id,
      page_id: page.pageId,
      kind: p.kind,
      message: p.message || null,
      permalink_url: p.permalink,
      created_time: p.createdTime,
      publication_id: publicationByPost.get(p.id) ?? null,
    })),
    { onConflict: 'post_id' },
  );
  if (upErr) throw new ApiError(`Écriture des posts de la Page impossible : ${upErr.message}`, 502);

  const toSync = recent.filter((p) => !publicationByPost.has(p.id)).slice(0, MAX_OTHER_POSTS);
  const errors = await mapLimit(toSync, CONCURRENCY, async (p) => {
    try {
      const stats = await fetchPostStats(page, p.id, { isVideo: p.kind === 'reel' });
      const { error } = await db.from('page_posts_metriques').insert({
        post_id: p.id,
        vues: stats.vues,
        personnes_atteintes: stats.personnes_atteintes,
        reactions: stats.reactions,
        commentaires: stats.commentaires,
        partages: stats.partages,
        clics: stats.clics,
        vues_video: stats.vues_video,
        brut: { indisponibles: stats.indisponibles },
      });
      return error ? `Post ${p.id} : ${error.message}` : null;
    } catch (e) {
      return `Post ${p.id} : ${e instanceof Error ? e.message : String(e)}`;
    }
  });
  result.releves = errors.filter((e) => e === null).length;
  result.erreurs.push(...errors.filter((e): e is string => e !== null));
  return result;
}
