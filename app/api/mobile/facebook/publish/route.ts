// ============================================================
// app/api/mobile/facebook/publish/route.ts
// Remplace les workflows n8n `Publication_Facebook_Editorial` (contenu Claude
// routine, schéma editorial) et `publication_facebook` (posts d'articles,
// table public.generated_social_posts).
//
// POST, deux formats acceptés :
//   - multipart/form-data : champs `source`, `id`, [`skip_article_image`],
//     [`image` = fichier du visuel choisi dans l'app]
//   - application/json    : { source, id, skip_article_image? } (sans visuel uploadé)
//
// `source` :
//   - 'editorial' : editorial.contenus_generes (id numérique, plateforme Facebook)
//   - 'blog'      : public.generated_social_posts (id uuid) — accroche + post ;
//                   sans visuel uploadé, l'image de l'article est utilisée sauf
//                   si `skip_article_image` vaut "true".
//
// Réponse : { ok, facebook_post_id, with_image, warning? }.
// `warning` = le post est bien parti sur Facebook mais la mise à jour du
// statut en base a échoué (ne PAS republier).
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/mobile-auth';
import { ApiError, editorialDb, publicDb, routeErrorResponse } from '@/lib/mobile-api';
import { absoluteImageUrl, publishToFacebookPage } from '@/lib/facebook-graph';

export const maxDuration = 60;

interface PublishRequest {
  source: string;
  id: string;
  skipArticleImage: boolean;
  imageFile: File | null;
}

async function parseRequest(req: NextRequest): Promise<PublishRequest> {
  const contentType = req.headers.get('content-type') ?? '';
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const image = form.get('image');
    return {
      source: String(form.get('source') ?? ''),
      id: String(form.get('id') ?? ''),
      skipArticleImage: String(form.get('skip_article_image') ?? '') === 'true',
      imageFile: image instanceof File && image.size > 0 ? image : null,
    };
  }
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  return {
    source: String(b.source ?? ''),
    id: String(b.id ?? ''),
    skipArticleImage: b.skip_article_image === true || b.skip_article_image === 'true',
    imageFile: null,
  };
}

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
    const { source, id, skipArticleImage, imageFile } = await parseRequest(req);
    if (!id) return NextResponse.json({ error: 'id manquant.' }, { status: 400 });

    if (source === 'editorial') {
      return await publishEditorial(id, imageFile);
    }
    if (source === 'blog') {
      return await publishBlogPost(id, skipArticleImage, imageFile);
    }
    return NextResponse.json({ error: "source invalide (attendu : 'editorial' ou 'blog')." }, { status: 400 });
  } catch (e) {
    return routeErrorResponse(e);
  }
}

async function publishEditorial(id: string, imageFile: File | null) {
  const db = editorialDb();
  const { data: row, error } = await db.from('contenus_generes').select('*').eq('id', id).maybeSingle();
  if (error) throw new ApiError(`Lecture du contenu impossible : ${error.message}`, 502);
  if (!row) throw new ApiError('Contenu introuvable pour cet id.', 404);

  if (String(row.plateforme ?? '').trim().toLowerCase() !== 'facebook') {
    throw new ApiError(`Ce contenu n'est pas destiné à Facebook (plateforme : "${row.plateforme}").`, 422);
  }
  if (row.statut === 'Publié') throw new ApiError('Ce contenu est déjà publié.', 409);
  if (row.statut === 'Rejeté') throw new ApiError('Ce contenu a été rejeté — impossible de le publier.', 409);
  const message = String(row.contenu ?? '').trim();
  if (!message) throw new ApiError('Le contenu de ce post est vide.', 422);

  const { postId, withImage } = await publishToFacebookPage({ message, imageFile });

  const { error: patchError } = await db
    .from('contenus_generes')
    .update({ statut: 'Publié', date_publication: new Date().toISOString(), valide_par_humain: true })
    .eq('id', id);

  return NextResponse.json({
    ok: true,
    facebook_post_id: postId,
    with_image: withImage,
    ...(patchError
      ? { warning: `Publié sur Facebook mais statut non mis à jour (${patchError.message}) — marque-le publié à la main.` }
      : {}),
  });
}

async function publishBlogPost(id: string, skipArticleImage: boolean, imageFile: File | null) {
  const db = publicDb();
  const { data: row, error } = await db.from('generated_social_posts').select('*').eq('id', id).maybeSingle();
  if (error) throw new ApiError(`Lecture du post impossible : ${error.message}`, 502);
  if (!row) throw new ApiError('Post introuvable pour cet id.', 404);

  if (row.status === 'published') throw new ApiError('Ce post est déjà publié.', 409);
  if (row.status === 'rejected') throw new ApiError('Ce post a été rejeté — impossible de le publier.', 409);

  const hook = String(row.facebook_hook ?? '').trim();
  const body = String(row.facebook_post ?? '').trim();
  const message = hook ? `${hook}\n\n${body}` : body;
  if (!message.trim()) throw new ApiError('Le post Facebook de cet article est vide.', 422);

  const imageUrl = imageFile || skipArticleImage ? null : absoluteImageUrl(row.image);
  const { postId, withImage } = await publishToFacebookPage({ message, imageFile, imageUrl });

  const { error: patchError } = await db
    .from('generated_social_posts')
    .update({ status: 'published', facebook_post_id: postId })
    .eq('id', id);

  return NextResponse.json({
    ok: true,
    facebook_post_id: postId,
    with_image: withImage,
    ...(patchError
      ? { warning: `Publié sur Facebook mais statut non mis à jour (${patchError.message}) — marque-le publié à la main.` }
      : {}),
  });
}
