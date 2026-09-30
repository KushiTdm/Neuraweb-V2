// ============================================================
// app/api/mobile/campagne/publier/route.ts
// Publie une publication de campagne (editorial.campagne_publications) sur la
// Page Facebook de son marché — onglet « Campagne » de l'app.
//
// POST multipart/form-data : `id`, [`image` = visuel choisi dans la galerie]
//      ou application/json : { id } (texte seul)
//
// Après publication : le « commentaire à épingler » (liens) est ajouté au nom
// de la Page (best-effort — l'épinglage reste un geste manuel dans Facebook),
// puis la ligne passe en `publie` avec l'id et le lien du post.
// Réponse : { ok, facebook_post_id, permalink_url, with_image, comment_posted, warning? }
// `warning` : le post est bien parti mais une étape annexe a échoué (ne PAS republier).
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/mobile-auth';
import { ApiError, editorialDb, routeErrorResponse } from '@/lib/mobile-api';
import { facebookPageConfig, publishToFacebookPage } from '@/lib/facebook-graph';
import { commentAsPage, fetchFacebookObject } from '@/lib/campagne-facebook';
import { loadPublicationWithCampagne, parsePublicationId } from '@/lib/campagne-db';

export const maxDuration = 60;

async function parseRequest(req: NextRequest): Promise<{ id: number; imageFile: File | null }> {
  const contentType = req.headers.get('content-type') ?? '';
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const image = form.get('image');
    return {
      id: parsePublicationId(form.get('id')),
      imageFile: image instanceof File && image.size > 0 ? image : null,
    };
  }
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  return { id: parsePublicationId(b.id), imageFile: null };
}

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
    const { id, imageFile } = await parseRequest(req);
    const { publication: p, campagne: c } = await loadPublicationWithCampagne(id);

    if (p.statut === 'publie') throw new ApiError('Cette publication est déjà publiée.', 409);
    if (p.statut === 'rejete') throw new ApiError('Publication rejetée — impossible de la publier.', 409);
    const message = (p.texte_publication ?? '').trim();
    if (!message) throw new ApiError('Le texte de la publication est vide.', 422);

    const page = facebookPageConfig(c.marche);
    const { postId, withImage } = await publishToFacebookPage({ message, imageFile, page });

    const warnings: string[] = [];
    let commentPosted = false;
    const pin = (p.commentaire_epingle ?? '').trim();
    if (pin) {
      try {
        await commentAsPage(page, postId, pin);
        commentPosted = true;
      } catch (e) {
        const detail = e instanceof Error ? e.message : String(e);
        warnings.push(`Commentaire non ajouté (${detail}) : colle-le à la main puis épingle-le.`);
      }
    }

    let permalink: string | null = null;
    try {
      permalink = (await fetchFacebookObject(page, postId)).permalink;
    } catch {
      // Le lien n'est qu'un confort : la synchro le complétera.
    }

    const { error } = await editorialDb()
      .from('campagne_publications')
      .update({
        statut: 'publie',
        facebook_post_id: postId,
        permalink_url: permalink,
        date_publication: new Date().toISOString(),
      })
      .eq('id', p.id);
    if (error) {
      warnings.push(`Publié sur Facebook mais statut non mis à jour (${error.message}) — ne republie pas, utilise « Lier un post ».`);
    }

    return NextResponse.json({
      ok: true,
      facebook_post_id: postId,
      permalink_url: permalink,
      with_image: withImage,
      comment_posted: commentPosted,
      ...(warnings.length ? { warning: warnings.join(' ') } : {}),
    });
  } catch (e) {
    return routeErrorResponse(e);
  }
}
