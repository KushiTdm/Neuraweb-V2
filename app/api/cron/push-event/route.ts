// ============================================================
// app/api/cron/push-event/route.ts
// Reçoit les événements de la base (triggers pg_net, migration 0012) et les
// transforme en notification sur le téléphone, app fermée :
//   booking     → nouveau RDV (public.bookings)
//   lead        → nouvelle sollicitation démo (public.demo_leads)
//   security    → alerte chatbot de gravité « high » (public.chat_security_events)
//   publication → publication de campagne à valider (editorial.campagne_publications)
//   test        → notification d'essai
//
// POST { type, record } — `Authorization: Bearer ${CRON_SECRET}`.
// `tag` identique à celui des notifications locales de l'app : si les deux
// arrivent (app ouverte puis en arrière-plan), Android n'en affiche qu'une.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { sendPush, pushConfigured } from '@/lib/push';
import type { PushMessage } from '@/lib/fcm';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

type Rec = Record<string, unknown>;

const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));
const cut = (s: string, n: number) => {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n)}…` : t;
};

const SECTORS: Record<string, string> = { collectivite: 'Collectivité', restaurant: 'Restaurant', hotel: 'Hôtel' };
const SECURITY: Record<string, string> = {
  injection: 'Tentative de prompt injection',
  probe: 'Sonde technique',
  off_topic: 'Trolling répété',
  rate_limit: 'Rate limit dépassé',
  blocked: 'IP bloquée',
};
const ROLES: Record<string, string> = {
  appel: 'Appel', relance: 'Relance', demo: 'Démo', educatif: 'Éducatif', coulisses: 'Coulisses',
  livraison: 'Livraison', avant_apres: 'Avant/après', annonce: 'Annonce', report: 'Report', offre: 'Offre', autre: 'Autre',
};

function build(type: string, r: Rec): PushMessage | null {
  switch (type) {
    case 'booking': {
      const service = str(r.service);
      return {
        title: `Nouveau RDV — ${str(r.name)}`,
        body: `${str(r.date)} à ${str(r.time)}${service ? ` · ${service}` : ''}`,
        channel: 'cockpit',
        tag: `booking-${str(r.id)}`,
        data: { type, id: str(r.id) },
      };
    }
    case 'lead':
      return {
        title: `Nouvelle sollicitation démo — ${str(r.name)}`,
        body: `${SECTORS[str(r.sector)] ?? 'Général'} · ${cut(str(r.message), 80)}`,
        channel: 'leads',
        tag: `lead-${str(r.id)}`,
        data: { type, id: str(r.id) },
      };
    case 'security': {
      if (str(r.severity) !== 'high') return null; // les rate limits simples restent sans bruit
      const um = cut(str(r.user_message), 80);
      return {
        title: `⚠️ Alerte chatbot — ${SECURITY[str(r.event_type)] ?? str(r.event_type)}`,
        body: `IP ${str(r.ip)}${um ? ` · « ${um} »` : ''}`,
        channel: 'security',
        tag: `secu-${str(r.id)}`,
        data: { type, id: str(r.id) },
      };
    }
    case 'publication': {
      if (str(r.statut) !== 'a_valider') return null;
      const heure = str(r.heure_prevue);
      return {
        title: 'Campagne — publication à valider',
        body: `${ROLES[str(r.role)] ?? str(r.role)} · ${str(r.titre)}${heure ? ` · ${heure}` : ''}`,
        channel: 'campagne',
        tag: `pub-${str(r.id)}`,
        data: { type, id: str(r.id) },
      };
    }
    case 'test':
      return { title: 'Notification de test', body: 'Les notifications du cockpit fonctionnent, app fermée comprise. ✅', channel: 'cockpit', data: { type } };
    default:
      return null;
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || (req.headers.get('authorization') ?? '') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  if (!pushConfigured()) {
    return NextResponse.json({ error: 'FIREBASE_SERVICE_ACCOUNT_JSON non configuré (Vercel).' }, { status: 503 });
  }
  const b = (await req.json().catch(() => ({}))) as { type?: unknown; record?: unknown };
  const type = typeof b.type === 'string' ? b.type : '';
  const record = (b.record && typeof b.record === 'object' ? b.record : {}) as Rec;
  const msg = build(type, record);
  if (!msg) return NextResponse.json({ ok: true, ignore: true });

  const r = await sendPush(msg);
  return NextResponse.json({ ok: r.envoyes > 0, ...r }, { status: r.envoyes > 0 ? 200 : 502 });
}
