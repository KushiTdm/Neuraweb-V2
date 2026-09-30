// ============================================================
// app/api/mobile/campagne/commentaires/route.ts
// Commentaires d'une publication rattachée à Facebook — pour un post d'appel,
// ce sont les candidatures de la semaine. Chaque commentaire est marqué
// « conforme » ou non au format demandé (heuristique d'aide à la
// présélection : la décision reste humaine) et « répondu » ou non par la Page
// (règle des 2 heures).
//
// GET ?id=<publication> → { ok, total, conformes, sans_reponse, approx, comments: [...] }
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/mobile-auth';
import { ApiError, routeErrorResponse } from '@/lib/mobile-api';
import { facebookPageConfig } from '@/lib/facebook-graph';
import { countUnanswered, fetchComments } from '@/lib/campagne-facebook';
import { loadPublicationWithCampagne, parsePublicationId } from '@/lib/campagne-db';

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  try {
    await requireUser(req);
    const id = parsePublicationId(req.nextUrl.searchParams.get('id'));
    const { publication: p, campagne: c } = await loadPublicationWithCampagne(id);
    if (!p.facebook_post_id) {
      throw new ApiError("Cette publication n'est pas rattachée à un post Facebook (« Lier un post »).", 409);
    }

    const page = facebookPageConfig(c.marche);
    const { comments, approx } = await fetchComments(page, p.facebook_post_id, 5);

    return NextResponse.json({
      ok: true,
      total: comments.length,
      conformes: comments.filter((x) => x.conforme).length,
      sans_reponse: countUnanswered(comments),
      approx,
      comments: comments.map((x) => ({
        id: x.id,
        message: x.message,
        created_time: x.createdTime,
        auteur: x.auteur,
        permalink_url: x.permalink,
        reponses: x.reponses,
        repondu: x.repondu,
        conforme: x.conforme,
        raison: x.raison,
      })),
    });
  } catch (e) {
    return routeErrorResponse(e);
  }
}
