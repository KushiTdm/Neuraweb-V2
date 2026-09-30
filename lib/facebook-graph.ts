// ============================================================
// lib/facebook-graph.ts
// Publication sur la Page Facebook NeuraWeb via l'API Graph — portage des
// anciens workflows n8n `Publication_Facebook_Editorial` et
// `publication_facebook` (posts d'articles).
//
// Trois modes selon le visuel :
//   - fichier uploadé depuis l'app  → POST /{page}/photos (multipart `source`)
//   - URL publique (image d'article) → POST /{page}/photos (`url`)
//   - aucun visuel                   → POST /{page}/feed (texte seul)
//
// Variables d'environnement (Vercel) :
//   FACEBOOK_PAGE_ACCESS_TOKEN     Page Access Token (obligatoire, jamais côté app)
//   FACEBOOK_PAGE_ID               id de la Page (défaut : celui des anciens workflows)
//   FACEBOOK_GRAPH_VERSION         version Graph (défaut v23.0)
//   FACEBOOK_PAGE_ID_VN            Page des campagnes Hanoi (onglet Campagne) —
//   FACEBOOK_PAGE_ACCESS_TOKEN_VN  obligatoires pour marche='hanoi', voir facebookPageConfig()
// ============================================================

import { ApiError } from '@/lib/mobile-api';

const DEFAULT_PAGE_ID = '955253197673721';
const DEFAULT_GRAPH_VERSION = 'v23.0';

/** Taille max d'un visuel accepté (les fonctions Vercel plafonnent le corps à ~4,5 Mo). */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export interface FacebookPublishResult {
  /** Id du post sur la Page (`post_id` pour une photo, `id` pour un post texte). */
  postId: string;
  withImage: boolean;
}

/** Page Facebook visée par un appel Graph. */
export interface FacebookPageConfig {
  token: string;
  pageId: string;
  version: string;
}

/** Corps d'erreur renvoyé par l'API Graph (`{ error: { message, code, … } }`). */
export interface GraphErrorBody {
  message?: string;
  code?: number;
  error_subcode?: number;
  type?: string;
}

function config(): FacebookPageConfig {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!token) {
    throw new ApiError('FACEBOOK_PAGE_ACCESS_TOKEN non configuré côté serveur (Vercel).', 503);
  }
  return {
    token,
    pageId: process.env.FACEBOOK_PAGE_ID || DEFAULT_PAGE_ID,
    version: process.env.FACEBOOK_GRAPH_VERSION || DEFAULT_GRAPH_VERSION,
  };
}

/**
 * Page d'un marché. `france` (ou toute autre valeur) → la Page historique.
 * `hanoi` → FACEBOOK_PAGE_ID_VN, avec FACEBOOK_PAGE_ACCESS_TOKEN_VN.
 *
 * Aucun repli silencieux sur la Page France : publier une campagne en
 * vietnamien sur la mauvaise Page est une erreur publique, donc la
 * configuration doit être explicite. Si Hanoi et France partagent la même
 * Page, il suffit de mettre son id dans FACEBOOK_PAGE_ID_VN : le token
 * principal est alors réutilisé.
 */
export function facebookPageConfig(marche: string): FacebookPageConfig {
  if (marche !== 'hanoi') return config();

  const version = process.env.FACEBOOK_GRAPH_VERSION || DEFAULT_GRAPH_VERSION;
  const pageId = (process.env.FACEBOOK_PAGE_ID_VN ?? '').trim();
  if (!pageId) {
    throw new ApiError(
      "Page Facebook Vietnam non configurée : ajoute FACEBOOK_PAGE_ID_VN (et FACEBOOK_PAGE_ACCESS_TOKEN_VN si ce n'est pas la Page France) dans Vercel, puis redéploie.",
      503,
    );
  }
  const mainPageId = process.env.FACEBOOK_PAGE_ID || DEFAULT_PAGE_ID;
  const token =
    (process.env.FACEBOOK_PAGE_ACCESS_TOKEN_VN ?? '').trim() ||
    (pageId === mainPageId ? (process.env.FACEBOOK_PAGE_ACCESS_TOKEN ?? '').trim() : '');
  if (!token) {
    throw new ApiError(
      'FACEBOOK_PAGE_ACCESS_TOKEN_VN non configuré : la Page Vietnam est différente de la Page France, elle a besoin de son propre token (Vercel).',
      503,
    );
  }
  return { token, pageId, version };
}

/**
 * Traduit une erreur Graph en message affichable dans l'app. `action` complète
 * la phrase (« la publication », « la lecture des commentaires »…).
 */
export function graphApiError(status: number, err: GraphErrorBody | undefined, action: string): ApiError {
  const detail = err?.message ?? `HTTP ${status}`;
  const code = err?.code;
  if (code === 190) {
    return new ApiError('Token Facebook expiré ou invalide — régénère le Page Access Token (Vercel).', 502);
  }
  if (code === 10 || (code !== undefined && code >= 200 && code < 300)) {
    return new ApiError(
      `Permission Facebook manquante pour ${action} (${detail}). Régénère le Page Access Token avec pages_manage_posts, pages_read_engagement, read_insights, pages_read_user_content et pages_manage_engagement.`,
      502,
    );
  }
  if (code === 4 || code === 17 || code === 32 || code === 613) {
    return new ApiError("Limite de l'API Facebook atteinte — réessaie dans quelques minutes.", 429);
  }
  return new ApiError(`Facebook a refusé ${action} : ${detail}`, 502);
}

/** Chemin d'image relatif d'un article (`/assets/blog/x.webp`) → URL absolue canonique. */
export function absoluteImageUrl(image: string | null | undefined): string | null {
  const v = (image ?? '').trim();
  if (!v) return null;
  return /^https?:\/\//.test(v) ? v : `https://neuraweb.fr${v.startsWith('/') ? '' : '/'}${v}`;
}

export async function publishToFacebookPage(input: {
  message: string;
  /** Visuel uploadé depuis l'app (prioritaire sur `imageUrl`). */
  imageFile?: File | null;
  /** Visuel déjà en ligne (image d'article). */
  imageUrl?: string | null;
  /** Page cible (défaut : Page historique). Voir facebookPageConfig(). */
  page?: FacebookPageConfig;
}): Promise<FacebookPublishResult> {
  const { token, pageId, version } = input.page ?? config();
  const base = `https://graph.facebook.com/${version}/${pageId}`;

  const form = new FormData();
  form.append('access_token', token);

  let endpoint: string;
  let withImage = true;
  if (input.imageFile && input.imageFile.size > 0) {
    if (input.imageFile.size > MAX_IMAGE_BYTES) {
      throw new ApiError('Visuel trop lourd (4 Mo max) — choisis une image plus légère.', 413);
    }
    endpoint = `${base}/photos`;
    form.append('caption', input.message);
    form.append('source', input.imageFile, input.imageFile.name || 'visuel.jpg');
  } else if (input.imageUrl) {
    endpoint = `${base}/photos`;
    form.append('caption', input.message);
    form.append('url', input.imageUrl);
  } else {
    endpoint = `${base}/feed`;
    form.append('message', input.message);
    withImage = false;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    body: form,
    signal: AbortSignal.timeout(45_000),
  });
  const json = (await res.json().catch(() => ({}))) as {
    id?: string;
    post_id?: string;
    error?: GraphErrorBody;
  };

  if (!res.ok || json.error) {
    console.error('[facebook-graph] échec publication', res.status, json.error?.message ?? '');
    // Token expiré (190), permission manquante, quota : message explicite plutôt que le brut Graph.
    throw graphApiError(res.status, json.error, 'la publication');
  }

  // /photos → { id (photo), post_id (post sur le mur) } ; /feed → { id } (= id du post).
  const postId = json.post_id || json.id;
  if (!postId) throw new ApiError('Réponse Facebook inattendue (pas d\'id de post).', 502);
  return { postId, withImage };
}
