// ============================================================
// lib/campagne-facebook.ts
// Lectures / écritures Graph API de l'onglet « Campagne » de l'app mobile :
// infos de la Page, posts récents (pour rattacher une publication faite
// ailleurs), métriques d'un post, commentaires (= candidatures du jeu) avec
// une heuristique de conformité au format demandé, commentaire de la Page.
//
// Métriques : le 15/06/2026, Meta a retiré les impressions et la portée
// (post_impressions*, post_impressions_unique, post_video_views_unique…) au
// profit des « vues ». On lit donc :
//   post_media_view               → vues (affichages / lectures)
//   post_total_media_view_unique  → personnes atteintes (spectateurs uniques)
//   post_clicks, post_video_views → clics, vues vidéo 3 s
// Si une requête groupée est refusée (métrique inconnue pour ce type de post,
// permission), chaque métrique est redemandée seule : une métrique absente ne
// doit pas effacer les autres. Les absentes sont listées dans `indisponibles`.
//
// ⚠️ Serveur uniquement (Page Access Token).
// ============================================================

import { ApiError } from '@/lib/mobile-api';
import { graphApiError, type FacebookPageConfig, type GraphErrorBody } from '@/lib/facebook-graph';

const GRAPH_TIMEOUT_MS = 20_000;

/** Erreur Graph brute, convertie en ApiError au moment où l'action est connue. */
export class GraphRequestError extends Error {
  status: number;
  body: GraphErrorBody | undefined;
  constructor(status: number, body: GraphErrorBody | undefined) {
    super(body?.message ?? `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }

  /** Token invalide ou quota : inutile d'insister sur les autres appels. */
  get isFatal(): boolean {
    const c = this.body?.code;
    return c === 190 || c === 4 || c === 17 || c === 32 || c === 613;
  }

  get isPermission(): boolean {
    const c = this.body?.code;
    return c === 10 || (c !== undefined && c >= 200 && c < 300);
  }
}

/** Convertit n'importe quelle erreur d'appel Graph en message affichable. */
export function toApiError(e: unknown, action: string): ApiError {
  if (e instanceof ApiError) return e;
  if (e instanceof GraphRequestError) return graphApiError(e.status, e.body, action);
  const msg = e instanceof Error ? e.message : String(e);
  return new ApiError(`Facebook injoignable pendant ${action} (${msg}).`, 502);
}

async function graphRequest<T>(
  page: FacebookPageConfig,
  path: string,
  opts: { params?: Record<string, string>; method?: 'GET' | 'POST'; form?: Record<string, string> } = {},
): Promise<T> {
  const url = new URL(`https://graph.facebook.com/${page.version}/${path}`);
  for (const [k, v] of Object.entries(opts.params ?? {})) url.searchParams.set(k, v);

  let body: FormData | undefined;
  if (opts.method === 'POST') {
    body = new FormData();
    body.append('access_token', page.token);
    for (const [k, v] of Object.entries(opts.form ?? {})) body.append(k, v);
  } else {
    url.searchParams.set('access_token', page.token);
  }

  const res = await fetch(url, {
    method: opts.method ?? 'GET',
    body,
    cache: 'no-store',
    signal: AbortSignal.timeout(GRAPH_TIMEOUT_MS),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: GraphErrorBody };
  if (!res.ok || json.error) throw new GraphRequestError(res.status, json.error);
  return json as T;
}

// ── Page ────────────────────────────────────────────────────

export interface PageInfo {
  id: string;
  nom: string;
  lien: string | null;
  abonnes: number | null;
  fans: number | null;
}

export async function fetchPageInfo(page: FacebookPageConfig): Promise<PageInfo> {
  type Raw = { id?: string; name?: string; link?: string; followers_count?: number; fan_count?: number };
  let raw: Raw;
  try {
    raw = await graphRequest<Raw>(page, page.pageId, {
      params: { fields: 'id,name,link,followers_count,fan_count' },
    });
  } catch (e) {
    // `fan_count` peut être refusé (métriques « fans » retirées fin 2025) : on retente sans.
    if (e instanceof GraphRequestError && !e.isFatal) {
      try {
        raw = await graphRequest<Raw>(page, page.pageId, { params: { fields: 'id,name,link,followers_count' } });
      } catch (e2) {
        throw toApiError(e2, 'la lecture de la Page');
      }
    } else {
      throw toApiError(e, 'la lecture de la Page');
    }
  }
  return {
    id: raw.id ?? page.pageId,
    nom: raw.name ?? '',
    lien: raw.link ?? null,
    abonnes: typeof raw.followers_count === 'number' ? raw.followers_count : null,
    fans: typeof raw.fan_count === 'number' ? raw.fan_count : null,
  };
}

// ── Posts récents de la Page ────────────────────────────────

export interface PagePost {
  id: string;
  message: string;
  createdTime: string | null;
  permalink: string | null;
  picture: string | null;
  kind: 'post' | 'reel';
}

export async function listRecentPagePosts(page: FacebookPageConfig, limit = 25): Promise<PagePost[]> {
  type RawPost = { id: string; message?: string; created_time?: string; permalink_url?: string; full_picture?: string };
  let posts: { data?: RawPost[] };
  try {
    posts = await graphRequest<{ data?: RawPost[] }>(page, `${page.pageId}/posts`, {
      params: { fields: 'id,message,created_time,permalink_url,full_picture', limit: String(limit) },
    });
  } catch (e) {
    throw toApiError(e, 'la lecture des posts de la Page');
  }

  const out: PagePost[] = (posts.data ?? []).map((p) => ({
    id: p.id,
    message: p.message ?? '',
    createdTime: p.created_time ?? null,
    permalink: p.permalink_url ?? null,
    picture: p.full_picture ?? null,
    kind: 'post' as const,
  }));

  // Reels : selon les Pages ils n'apparaissent pas dans /posts. Best-effort.
  try {
    type RawReel = { id: string; description?: string; created_time?: string; permalink_url?: string; picture?: string };
    const reels = await graphRequest<{ data?: RawReel[] }>(page, `${page.pageId}/video_reels`, {
      params: { fields: 'id,description,created_time,permalink_url,picture', limit: '10' },
    });
    for (const r of reels.data ?? []) {
      if (out.some((p) => p.id === r.id || p.id.endsWith(`_${r.id}`))) continue;
      out.push({
        id: r.id,
        message: r.description ?? '',
        createdTime: r.created_time ?? null,
        permalink: r.permalink_url ? absoluteFacebookUrl(r.permalink_url) : null,
        picture: r.picture ?? null,
        kind: 'reel',
      });
    }
  } catch {
    // Pas de Reels ou pas la permission : la liste des posts suffit.
  }

  return out.sort((a, b) => (b.createdTime ?? '').localeCompare(a.createdTime ?? ''));
}

/** Les permalinks de vidéos sont parfois relatifs (`/reel/123`). */
function absoluteFacebookUrl(u: string): string {
  return /^https?:\/\//.test(u) ? u : `https://www.facebook.com${u.startsWith('/') ? '' : '/'}${u}`;
}

/** Identifiant Facebook d'un objet : post de Page (`page_post`) ou vidéo / Reel (numérique). */
export function isValidFacebookId(id: string): boolean {
  return /^\d+(_\d+)?$/.test(id);
}

/**
 * Extrait un identifiant exploitable d'un lien ou d'un id collé. Les liens
 * `pfbid…` (format actuel des URL de posts) ne contiennent pas l'id numérique :
 * dans ce cas on renvoie null et l'app propose de choisir le post dans la liste.
 */
export function extractFacebookId(input: string, pageId: string): string | null {
  const v = input.trim();
  if (isValidFacebookId(v)) return v;
  const reel = v.match(/\/(?:reel|videos)\/(\d+)/);
  if (reel) return reel[1];
  const story = v.match(/story_fbid=(\d+)/);
  if (story) return `${pageId}_${story[1]}`;
  const posts = v.match(/\/posts\/(\d+)/);
  if (posts) return `${pageId}_${posts[1]}`;
  const fbid = v.match(/[?&]fbid=(\d+)/);
  if (fbid) return fbid[1];
  return null;
}

export interface FacebookObjectInfo {
  id: string;
  permalink: string | null;
  createdTime: string | null;
  fromId: string | null;
}

/** Lit un post ou une vidéo pour vérifier qu'il existe et qu'il appartient à la Page. */
export async function fetchFacebookObject(page: FacebookPageConfig, id: string): Promise<FacebookObjectInfo> {
  type Raw = { id?: string; permalink_url?: string; created_time?: string; from?: { id?: string } };
  let raw: Raw;
  try {
    raw = await graphRequest<Raw>(page, id, { params: { fields: 'id,permalink_url,created_time,from' } });
  } catch (e) {
    if (e instanceof GraphRequestError && !e.isFatal) {
      try {
        raw = await graphRequest<Raw>(page, id, { params: { fields: 'id,permalink_url,created_time' } });
      } catch (e2) {
        throw toApiError(e2, 'la lecture de ce post');
      }
    } else {
      throw toApiError(e, 'la lecture de ce post');
    }
  }
  return {
    id: raw.id ?? id,
    permalink: raw.permalink_url ? absoluteFacebookUrl(raw.permalink_url) : null,
    createdTime: raw.created_time ?? null,
    fromId: raw.from?.id ?? null,
  };
}

/** Commentaire publié au nom de la Page (liens du « commentaire épinglé »). */
export async function commentAsPage(page: FacebookPageConfig, postId: string, message: string): Promise<string> {
  try {
    const res = await graphRequest<{ id?: string }>(page, `${postId}/comments`, {
      method: 'POST',
      form: { message },
    });
    return res.id ?? '';
  } catch (e) {
    throw toApiError(e, "l'ajout du commentaire");
  }
}

// ── Métriques ───────────────────────────────────────────────

export interface PostStats {
  vues: number | null;
  personnes_atteintes: number | null;
  reactions: number | null;
  commentaires: number | null;
  partages: number | null;
  clics: number | null;
  vues_video: number | null;
  permalink: string | null;
  /** Métriques refusées par Graph (type de post, permission) — stockées pour diagnostic. */
  indisponibles: string[];
}

type InsightsResponse = {
  data?: Array<{
    name: string;
    values?: Array<{ value?: unknown }>;
    total_value?: { value?: unknown };
  }>;
};

function readInsights(json: InsightsResponse, into: Record<string, number>) {
  for (const d of json.data ?? []) {
    const v = d.values?.[0]?.value ?? d.total_value?.value;
    if (typeof v === 'number') {
      into[d.name] = v;
    } else if (v && typeof v === 'object') {
      // Métriques ventilées (par type, par réaction) : on garde le total.
      into[d.name] = Object.values(v as Record<string, unknown>).reduce<number>(
        (sum, x) => sum + (typeof x === 'number' ? x : 0),
        0,
      );
    }
  }
}

async function fetchInsights(
  page: FacebookPageConfig,
  id: string,
  edge: 'insights' | 'video_insights',
  metrics: string[],
): Promise<{ values: Record<string, number>; unavailable: string[] }> {
  const values: Record<string, number> = {};
  const unavailable: string[] = [];
  try {
    readInsights(
      await graphRequest<InsightsResponse>(page, `${id}/${edge}`, {
        params: { metric: metrics.join(','), period: 'lifetime' },
      }),
      values,
    );
  } catch (e) {
    if (e instanceof GraphRequestError && e.isFatal) throw e;
    for (const m of metrics) {
      try {
        readInsights(
          await graphRequest<InsightsResponse>(page, `${id}/${edge}`, { params: { metric: m, period: 'lifetime' } }),
          values,
        );
      } catch (err) {
        if (err instanceof GraphRequestError && err.isFatal) throw err;
        unavailable.push(m);
      }
    }
  }
  for (const m of metrics) if (!(m in values) && !unavailable.includes(m)) unavailable.push(m);
  return { values, unavailable };
}

const POST_METRICS = ['post_media_view', 'post_total_media_view_unique', 'post_clicks'];
const VIDEO_POST_METRICS = ['post_video_views'];
/** Reels / vidéos rattachés par leur id de vidéo : noms de métriques propres aux vidéos. */
const REEL_METRICS = ['fb_reels_total_plays', 'blue_reels_play_count', 'total_video_views'];

export async function fetchPostStats(
  page: FacebookPageConfig,
  fbId: string,
  opts: { isVideo: boolean },
): Promise<PostStats> {
  const isPagePost = fbId.includes('_');
  const stats: PostStats = {
    vues: null,
    personnes_atteintes: null,
    reactions: null,
    commentaires: null,
    partages: null,
    clics: null,
    vues_video: null,
    permalink: null,
    indisponibles: [],
  };

  // 1. Compteurs publics (réactions, commentaires, partages).
  type Summary = { summary?: { total_count?: number } };
  type Raw = { permalink_url?: string; shares?: { count?: number }; comments?: Summary; reactions?: Summary };
  const fullFields = isPagePost
    ? 'permalink_url,shares,comments.limit(0).summary(true),reactions.limit(0).summary(true)'
    : 'permalink_url,comments.limit(0).summary(true),reactions.limit(0).summary(true)';
  try {
    let raw: Raw;
    try {
      raw = await graphRequest<Raw>(page, fbId, { params: { fields: fullFields } });
    } catch (e) {
      if (e instanceof GraphRequestError && e.isFatal) throw e;
      stats.indisponibles.push('reactions', 'commentaires');
      raw = await graphRequest<Raw>(page, fbId, { params: { fields: isPagePost ? 'permalink_url,shares' : 'permalink_url' } });
    }
    stats.permalink = raw.permalink_url ? absoluteFacebookUrl(raw.permalink_url) : null;
    stats.partages = isPagePost ? (raw.shares?.count ?? 0) : null;
    stats.commentaires = raw.comments?.summary?.total_count ?? stats.commentaires;
    stats.reactions = raw.reactions?.summary?.total_count ?? stats.reactions;
  } catch (e) {
    throw toApiError(e, 'la lecture des compteurs du post');
  }

  // 2. Insights (vues, personnes atteintes, clics, vues vidéo).
  try {
    if (isPagePost) {
      const metrics = opts.isVideo ? [...POST_METRICS, ...VIDEO_POST_METRICS] : POST_METRICS;
      const { values, unavailable } = await fetchInsights(page, fbId, 'insights', metrics);
      stats.vues = values.post_media_view ?? null;
      stats.personnes_atteintes = values.post_total_media_view_unique ?? null;
      stats.clics = values.post_clicks ?? null;
      stats.vues_video = values.post_video_views ?? null;
      stats.indisponibles.push(...unavailable);
    } else {
      const { values, unavailable } = await fetchInsights(page, fbId, 'video_insights', REEL_METRICS);
      const plays = REEL_METRICS.map((m) => values[m]).find((v) => typeof v === 'number');
      stats.vues_video = plays ?? null;
      stats.vues = plays ?? null;
      // Une seule des trois suffit : ne signaler que si aucune n'a répondu.
      if (plays === undefined) stats.indisponibles.push(...unavailable);
    }
  } catch (e) {
    throw toApiError(e, 'la lecture des statistiques du post');
  }

  return stats;
}

// ── Commentaires (candidatures) ─────────────────────────────

export interface CampagneComment {
  id: string;
  message: string;
  createdTime: string | null;
  auteur: string | null;
  permalink: string | null;
  reponses: number;
  /** La Page a répondu. `null` si la permission manque pour le savoir. */
  repondu: boolean | null;
  conforme: boolean;
  raison: string;
}

const MAPS_RE = /(maps\.app\.goo\.gl|goo\.gl\/maps|google\.[a-z.]+\/maps|maps\.google\.)/i;

/**
 * Mot de voie suivi d'un nom propre ou d'un numéro, sur le texte d'origine
 * (avec accents) : « phố Huế », « ngõ 13 Lò Đúc », « quận Hoàn Kiếm ». Sans
 * les accents, ces mots se confondent avec du vocabulaire courant (« quán »
 * et « quận » donnent tous deux « quan », « phở » et « phố » donnent « pho »),
 * d'où l'exigence d'accents ET d'une majuscule ou d'un chiffre ensuite.
 */
const STREET_WORD_RE = /(?:^|[\s,(])(?:phố|ngõ|ngách|đường|quận|phường|huyện|Phố|Ngõ|Ngách|Đường|Quận|Phường|Huyện)\s+(?:\p{Lu}|\d)/u;

/**
 * Numéro suivi d'un nom de rue en majuscule : « 12 Hàng Bạc », « 68 Kim Mã ».
 * Un chiffre suivi d'un mot courant (« 2 tầng », « 2 ly ») ne compte pas.
 */
const HOUSE_NUMBER_RE = /(?:^|[\s,(])\d{1,4}[A-Za-z]?(?:\/\d{1,3})*\s+\p{Lu}\p{Ll}/u;

/** Villes et arrondissements de Hà Nội, comparés sans accents (noms sans homonyme courant). */
const PLACE_HINTS = [
  'ha noi', 'hanoi', 'hoan kiem', 'ba dinh', 'tay ho', 'cau giay', 'dong da', 'hai ba trung',
  'long bien', 'hoang mai', 'thanh xuan', 'tu liem', 'ha dong', 'gia lam', 'dong anh', 'soc son',
];

/** Minuscules sans diacritiques (le vietnamien s'écrit souvent sans accents en commentaire). */
export function foldVietnamese(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * Le commentaire respecte-t-il le format « Tên cơ sở – Địa chỉ (ou lien
 * Google Maps) – une phrase » ? Heuristique d'aide à la présélection, réglée
 * pour éviter les faux positifs : un commentaire écrit sans accents et sans
 * lien Maps peut être marqué « incomplet » à tort. La décision reste humaine,
 * et l'adresse doit de toute façon être vérifiée (§9 du dossier).
 */
export function evaluateComment(message: string): { conforme: boolean; raison: string } {
  // Certains claviers envoient les accents décomposés (NFD) : on recompose d'abord.
  const text = message.normalize('NFC').trim();
  if (text.length < 20) return { conforme: false, raison: 'Trop court' };

  const folded = ` ${foldVietnamese(text).replace(/[^a-z0-9]+/g, ' ')} `;
  const hasMaps = MAPS_RE.test(text);
  const hasAddress =
    hasMaps ||
    STREET_WORD_RE.test(text) ||
    HOUSE_NUMBER_RE.test(text) ||
    PLACE_HINTS.some((w) => folded.includes(` ${w} `));

  if (!hasAddress) return { conforme: false, raison: 'Adresse ou lien Maps manquant' };

  const segments = (re: RegExp) =>
    text
      .split(re)
      .map((p) => p.trim())
      .filter((p) => p.length >= 2).length;
  const parts = segments(/\s+[–—-]\s+|\s*\|\s*|\n+/);
  const looseParts = segments(/\s+[–—-]\s+|\s*[|,;]\s*|\n+/);

  if (parts >= 3 || looseParts >= 3 || (hasMaps && parts >= 2) || text.length >= 70) {
    return { conforme: true, raison: hasMaps ? 'Lien Google Maps' : 'Adresse détectée' };
  }
  return { conforme: false, raison: 'Format incomplet (nom – adresse – phrase)' };
}

type RawComment = {
  id: string;
  message?: string;
  created_time?: string;
  permalink_url?: string;
  comment_count?: number;
  from?: { id?: string; name?: string };
  comments?: { data?: Array<{ from?: { id?: string } }> };
};

/**
 * Commentaires de 1er niveau d'un post (du plus récent au plus ancien), jusqu'à
 * `maxPages` × 100. `approx` = la permission de lire l'auteur des réponses
 * manque : « répondu » n'est alors qu'une estimation (a au moins une réponse).
 */
export async function fetchComments(
  page: FacebookPageConfig,
  fbId: string,
  maxPages = 5,
): Promise<{ comments: CampagneComment[]; approx: boolean }> {
  const richFields = 'id,message,created_time,permalink_url,comment_count,from{id,name},comments.limit(25){from{id}}';
  const poorFields = 'id,message,created_time,permalink_url,comment_count';

  const fetchAll = async (fields: string) => {
    const rows: RawComment[] = [];
    let after: string | undefined;
    for (let i = 0; i < maxPages; i++) {
      const params: Record<string, string> = {
        fields,
        filter: 'toplevel',
        order: 'reverse_chronological',
        limit: '100',
      };
      if (after) params.after = after;
      const res = await graphRequest<{ data?: RawComment[]; paging?: { cursors?: { after?: string }; next?: string } }>(
        page,
        `${fbId}/comments`,
        { params },
      );
      rows.push(...(res.data ?? []));
      after = res.paging?.next ? res.paging.cursors?.after : undefined;
      if (!after) break;
    }
    return rows;
  };

  let rows: RawComment[];
  let approx = false;
  try {
    rows = await fetchAll(richFields);
  } catch (e) {
    if (e instanceof GraphRequestError && e.isPermission) {
      approx = true;
      try {
        rows = await fetchAll(poorFields);
      } catch (e2) {
        throw toApiError(e2, 'la lecture des commentaires');
      }
    } else {
      throw toApiError(e, 'la lecture des commentaires');
    }
  }

  // Sans la permission adéquate, Graph omet parfois `from` sans erreur : si des
  // réponses existent mais qu'aucune ne porte d'auteur, « répondu » devient une estimation.
  const anyReplies = rows.some((c) => (c.comment_count ?? 0) > 0 || (c.comments?.data?.length ?? 0) > 0);
  const anyReplyAuthor = rows.some((c) => (c.comments?.data ?? []).some((r) => r.from?.id));
  if (anyReplies && !anyReplyAuthor) approx = true;

  const comments = rows
    // Les commentaires de la Page elle-même (liens épinglés) ne sont pas des candidatures.
    .filter((c) => c.from?.id !== page.pageId)
    .map((c) => {
      const message = c.message ?? '';
      const { conforme, raison } = evaluateComment(message);
      const replies = c.comments?.data ?? [];
      return {
        id: c.id,
        message,
        createdTime: c.created_time ?? null,
        auteur: c.from?.name ?? null,
        permalink: c.permalink_url ? absoluteFacebookUrl(c.permalink_url) : null,
        reponses: c.comment_count ?? replies.length,
        repondu: approx ? null : replies.some((r) => r.from?.id === page.pageId),
        conforme,
        raison,
      };
    });

  return { comments, approx };
}

/** Commentaires de 1er niveau restés sans réponse (estimation si `approx`). */
export function countUnanswered(comments: CampagneComment[]): number {
  return comments.filter((c) => (c.repondu === null ? c.reponses === 0 : !c.repondu)).length;
}

// ── Rattachement automatique ────────────────────────────────

function words(s: string): string[] {
  return foldVietnamese(s)
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 80);
}

/**
 * Proximité de deux textes (coefficient de recouvrement des mots, sans
 * diacritiques) : robuste aux retouches de relecture et aux hashtags ajoutés.
 */
export function textSimilarity(a: string, b: string): number {
  const A = new Set(words(a));
  const B = new Set(words(b));
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / Math.min(A.size, B.size);
}
