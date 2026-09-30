// ============================================================
// app/api/mobile/campagne/lier/route.ts
// Rattache une publication de campagne à un post déjà en ligne (publié depuis
// Facebook / Meta Business Suite : Reel, vidéo Flow, post programmé…), pour
// suivre ses chiffres et ses commentaires.
//
// POST { id, facebook_post_id } — `facebook_post_id` : id choisi dans la liste
// renvoyée par /posts-page, ou id / lien collé (les liens `pfbid…` ne
// contiennent pas l'id : choisir alors le post dans la liste).
// Réponse : { ok, facebook_post_id, permalink_url }
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/mobile-auth';
import { ApiError, editorialDb, routeErrorResponse } from '@/lib/mobile-api';
import { facebookPageConfig } from '@/lib/facebook-graph';
import { extractFacebookId, fetchFacebookObject } from '@/lib/campagne-facebook';
import { isUniqueViolation, loadPublicationWithCampagne, parsePublicationId } from '@/lib/campagne-db';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const id = parsePublicationId(b.id);
    const input = String(b.facebook_post_id ?? '').trim();
    if (!input) throw new ApiError('facebook_post_id manquant.', 400);

    const { publication: p, campagne: c } = await loadPublicationWithCampagne(id);
    const page = facebookPageConfig(c.marche);

    const fbId = extractFacebookId(input, page.pageId);
    if (!fbId) {
      throw new ApiError(
        "Ce lien ne contient pas l'identifiant du post (format pfbid). Choisis plutôt le post dans la liste.",
        422,
      );
    }

    const info = await fetchFacebookObject(page, fbId);
    if (info.fromId && info.fromId !== page.pageId) {
      throw new ApiError("Ce post n'a pas été publié par la Page de la campagne.", 422);
    }

    const { error } = await editorialDb()
      .from('campagne_publications')
      .update({
        statut: 'publie',
        facebook_post_id: info.id,
        permalink_url: info.permalink,
        // L'heure réelle du post fait foi (« Publiée ailleurs » enregistre l'heure du geste).
        date_publication: info.createdTime ?? p.date_publication ?? new Date().toISOString(),
      })
      .eq('id', p.id);
    if (isUniqueViolation(error)) {
      throw new ApiError('Ce post Facebook est déjà rattaché à une autre publication.', 409);
    }
    if (error) throw new ApiError(`Enregistrement impossible : ${error.message}`, 502);

    return NextResponse.json({ ok: true, facebook_post_id: info.id, permalink_url: info.permalink });
  } catch (e) {
    return routeErrorResponse(e);
  }
}
