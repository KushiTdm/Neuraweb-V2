// ============================================================
// app/api/mobile/campagne/sync/route.ts
// Bouton « Actualiser » de l'onglet Campagne : relève les chiffres Facebook
// des campagnes actives et les écrit en base, où l'app ET Claude routine les
// lisent (vue editorial.campagne_suivi).
//
// POST { campagne_id? } (sans id : toutes les campagnes actives)
//   1. Page : abonnés → editorial.campagne_page_stats (une ligne par relevé).
//   2. Rattachement automatique : une publication marquée « publiée ailleurs »
//      (statut publie, sans facebook_post_id) est reliée au post de la Page
//      dont le texte est le plus proche (≥ 60 % de mots communs) et publié
//      entre la veille et J+3 de sa date prévue.
//   3. Métriques des publications rattachées des 21 derniers jours (25 max) :
//      vues, personnes atteintes, réactions, commentaires, partages, clics,
//      vues vidéo, commentaires conformes (posts d'appel) et commentaires
//      sans réponse de la Page → editorial.campagne_metriques.
// Déclenché à la main ici ; la même logique tourne chaque nuit via
// /api/cron/campagne-metriques (lib/campagne-sync.ts).
// Réponse : { ok, campagnes: [{ id, nom, page, liees_auto, synchronisees, erreurs }] }
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/mobile-auth';
import { ApiError, routeErrorResponse } from '@/lib/mobile-api';
import { loadActiveCampagnes, loadCampagne, type CampagneRow } from '@/lib/campagne-db';
import { syncCampagne, type CampagneSyncResult } from '@/lib/campagne-sync';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const raw = b.campagne_id;
    let campagnes: CampagneRow[];
    if (raw !== undefined && raw !== null && String(raw).trim() !== '') {
      const id = Number(raw);
      if (!Number.isInteger(id) || id <= 0) throw new ApiError('campagne_id invalide.', 400);
      campagnes = [await loadCampagne(id)];
    } else {
      campagnes = await loadActiveCampagnes();
    }
    if (campagnes.length === 0) throw new ApiError('Aucune campagne active à synchroniser.', 404);

    const results: CampagneSyncResult[] = [];
    for (const c of campagnes) results.push(await syncCampagne(c));
    return NextResponse.json({ ok: true, campagnes: results });
  } catch (e) {
    return routeErrorResponse(e);
  }
}
