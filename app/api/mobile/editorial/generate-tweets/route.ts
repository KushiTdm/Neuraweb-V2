// ============================================================
// app/api/mobile/editorial/generate-tweets/route.ts
// Remplace le workflow n8n `Generation_Tweets_IA` (webhook x-generer-tweets).
//
// POST (sans body) : lit la veille la plus récente ≤ aujourd'hui dans
// editorial.veille_quotidienne, demande 5 tweets à Mistral et les renvoie
// SANS rien écrire en base — c'est l'app qui insère chaque proposition une
// fois relue par l'humain.
// Réponse : { ok, tweets: [{ contenu, sujet, angle, hashtags }], veilleDate, isStale }
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/mobile-auth';
import { ApiError, editorialDb, routeErrorResponse } from '@/lib/mobile-api';
import { generateTweetsFromVeille } from '@/lib/social-generation';
import { parisDate } from '@/lib/social-text';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);

    const today = parisDate();
    const { data, error } = await editorialDb()
      .from('veille_quotidienne')
      .select('*')
      .lte('date_veille', today)
      .order('date_veille', { ascending: false })
      .limit(1);
    if (error) throw new ApiError(`Lecture de la veille impossible : ${error.message}`, 502);

    const result = await generateTweetsFromVeille(data?.[0], today);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return routeErrorResponse(e);
  }
}
