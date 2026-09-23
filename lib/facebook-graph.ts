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
//   FACEBOOK_PAGE_ACCESS_TOKEN  Page Access Token (obligatoire, jamais côté app)
//   FACEBOOK_PAGE_ID            id de la Page (défaut : celui des anciens workflows)
//   FACEBOOK_GRAPH_VERSION      version Graph (défaut v23.0)
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

function config() {
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
}): Promise<FacebookPublishResult> {
  const { token, pageId, version } = config();
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
    error?: { message?: string; code?: number };
  };

  if (!res.ok || json.error) {
    const detail = json.error?.message ?? `HTTP ${res.status}`;
    console.error('[facebook-graph] échec publication', res.status, detail);
    // Token expiré/invalide (code 190) : message explicite plutôt que le brut Graph.
    if (json.error?.code === 190) {
      throw new ApiError('Token Facebook expiré ou invalide — régénère le Page Access Token (Vercel).', 502);
    }
    throw new ApiError(`Facebook a refusé la publication : ${detail}`, 502);
  }

  // /photos → { id (photo), post_id (post sur le mur) } ; /feed → { id } (= id du post).
  const postId = json.post_id || json.id;
  if (!postId) throw new ApiError('Réponse Facebook inattendue (pas d\'id de post).', 502);
  return { postId, withImage };
}
