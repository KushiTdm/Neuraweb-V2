// ============================================================
// app/api/cron/campagne-metriques/route.ts
// Relevé automatique des chiffres Facebook, chaque nuit (vercel.json : 06:30
// UTC = 13:30 à Hanoi, juste avant la routine Claude de 14h).
//
// Pour chaque campagne active :
//   1. syncCampagne : abonnés de la Page, rattachement automatique des
//      publications « publiées ailleurs », métriques des publications de campagne.
//   2. syncOtherPagePosts : posts de la Page publiés à la main (hors campagne).
// L'IA lit ensuite campagne_suivi, campagne_page_stats et page_posts_suivi.
//
// Auth : `Authorization: Bearer ${CRON_SECRET}` — Vercel l'ajoute tout seul
// aux appels de cron quand la variable CRON_SECRET existe.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { loadActiveCampagnes } from '@/lib/campagne-db';
import { syncCampagne, syncOtherPagePosts } from '@/lib/campagne-sync';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return (req.headers.get('authorization') ?? '') === `Bearer ${secret}`;
}

async function handle(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });

  const campagnes = await loadActiveCampagnes();
  const out: unknown[] = [];
  for (const c of campagnes) {
    const entry: Record<string, unknown> = { id: c.id, nom: c.nom };
    try {
      const r = await syncCampagne(c);
      entry.liees_auto = r.liees_auto;
      entry.synchronisees = r.synchronisees;
      entry.abonnes = r.page?.abonnes ?? null;
      entry.erreurs = r.erreurs;
    } catch (e) {
      entry.erreurs = [e instanceof Error ? e.message : String(e)];
    }
    try {
      entry.autres_posts = await syncOtherPagePosts(c);
    } catch (e) {
      entry.autres_posts = { erreur: e instanceof Error ? e.message : String(e) };
    }
    out.push(entry);
  }
  return NextResponse.json({ ok: true, campagnes: out });
}

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
