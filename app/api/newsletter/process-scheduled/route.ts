// app/api/newsletter/process-scheduled/route.ts
//
// POST → traite les campagnes `scheduled` dont l'heure programmée est
// atteinte et déclenche leur envoi réel. Appelée périodiquement par un
// schedule trigger n8n (voir docs/automation/n8n-newsletter-scheduler-workflow.json).
// Même secret partagé que /api/newsletter/campaigns.

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-server';
import { sendCampaign } from '@/lib/newsletter-campaigns';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.NEWSLETTER_NOTIFY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'NEWSLETTER_NOTIFY_SECRET non configuré.' }, { status: 503 });
    }
    if (request.headers.get('x-webhook-secret') !== secret) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const supabase = getServiceSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase indisponible.' }, { status: 503 });
    }

    const { data: due, error } = await supabase
      .from('newsletter_campaigns')
      .select('id')
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString());

    if (error) {
      console.error('process-scheduled — lecture campagnes échouée:', error);
      return NextResponse.json({ error: 'Lecture des campagnes impossible.' }, { status: 500 });
    }

    const results = [];
    for (const c of due ?? []) {
      results.push({ id: c.id, ...(await sendCampaign(c.id)) });
    }

    return NextResponse.json({ processed: due?.length ?? 0, results });
  } catch (error: any) {
    console.error('process-scheduled error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement des campagnes programmées : ' + error.message },
      { status: 500 }
    );
  }
}
