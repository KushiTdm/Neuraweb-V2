// ============================================================
// app/api/mobile/campagne/posts-page/route.ts
// Posts récents de la Page d'une campagne, pour rattacher une publication
// faite hors de l'app (« Lier un post »).
//
// GET ?campagne_id=1 → { ok, posts: [{ id, message, created_time, permalink_url,
//                         picture, kind, publication_id }] }
// `publication_id` : publication déjà rattachée à ce post (sinon null).
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/mobile-auth';
import { ApiError, editorialDb, routeErrorResponse } from '@/lib/mobile-api';
import { facebookPageConfig } from '@/lib/facebook-graph';
import { listRecentPagePosts } from '@/lib/campagne-facebook';
import { loadCampagne } from '@/lib/campagne-db';

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  try {
    await requireUser(req);
    const campagneId = Number(req.nextUrl.searchParams.get('campagne_id') ?? '');
    if (!Number.isInteger(campagneId) || campagneId <= 0) throw new ApiError('campagne_id invalide.', 400);

    const campagne = await loadCampagne(campagneId);
    const page = facebookPageConfig(campagne.marche);
    const posts = await listRecentPagePosts(page, 25);

    const ids = posts.map((p) => p.id);
    const linked = new Map<string, number>();
    if (ids.length) {
      const { data, error } = await editorialDb()
        .from('campagne_publications')
        .select('id, facebook_post_id')
        .in('facebook_post_id', ids);
      if (error) throw new ApiError(`Lecture des publications impossible : ${error.message}`, 502);
      for (const r of data ?? []) if (r.facebook_post_id) linked.set(String(r.facebook_post_id), Number(r.id));
    }

    return NextResponse.json({
      ok: true,
      posts: posts.map((p) => ({
        id: p.id,
        message: p.message,
        created_time: p.createdTime,
        permalink_url: p.permalink,
        picture: p.picture,
        kind: p.kind,
        publication_id: linked.get(p.id) ?? null,
      })),
    });
  } catch (e) {
    return routeErrorResponse(e);
  }
}
