// app/api/mobile/newsletter/campaigns/[id]/route.ts
//
// GET   → détail d'une campagne.
// PATCH → action de validation humaine, body { action, scheduledAt? } :
//   - 'approve'  : envoie immédiatement (déclenche les emails réels).
//   - 'schedule' : programme l'envoi à `scheduledAt` (ISO, dans le futur).
//   - 'cancel'   : annule la campagne (aucun envoi).
//
// JWT mobile requis. C'est le SEUL chemin qui déclenche un envoi réel —
// la création par n8n (/api/newsletter/campaigns) ne fait jamais d'envoi.

import { NextRequest, NextResponse } from 'next/server';
import { requireUser, authErrorResponse } from '@/lib/mobile-auth';
import { getServiceSupabase } from '@/lib/supabase-server';
import { sendCampaign } from '@/lib/newsletter-campaigns';

export const maxDuration = 60;

const MUTABLE_STATUSES = ['pending_review', 'scheduled'];

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUser(req);
    const { id } = await params;
    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase indisponible.' }, { status: 503 });

    const { data, error } = await supabase.from('newsletter_campaigns').select('*').eq('id', id).maybeSingle();
    if (error) return NextResponse.json({ error: 'Lecture impossible.' }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'Campagne introuvable.' }, { status: 404 });
    return NextResponse.json({ campaign: data });
  } catch (e) {
    return authErrorResponse(e);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUser(req);
    const { id } = await params;
    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ error: 'Supabase indisponible.' }, { status: 503 });

    const { action, scheduledAt } = await req.json();

    const { data: campaign, error: fetchErr } = await supabase
      .from('newsletter_campaigns')
      .select('id, status')
      .eq('id', id)
      .maybeSingle();
    if (fetchErr) return NextResponse.json({ error: 'Lecture impossible.' }, { status: 500 });
    if (!campaign) return NextResponse.json({ error: 'Campagne introuvable.' }, { status: 404 });

    if (!MUTABLE_STATUSES.includes(campaign.status)) {
      return NextResponse.json(
        { error: `Action impossible : campagne déjà "${campaign.status}".` },
        { status: 409 }
      );
    }

    if (action === 'approve') {
      await supabase
        .from('newsletter_campaigns')
        .update({ approved_at: new Date().toISOString() })
        .eq('id', id);
      const result = await sendCampaign(id);
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
      return NextResponse.json({ success: true, ...result });
    }

    if (action === 'schedule') {
      const when = new Date(scheduledAt);
      if (!scheduledAt || isNaN(when.getTime()) || when.getTime() <= Date.now()) {
        return NextResponse.json({ error: 'scheduledAt invalide (doit être une date future).' }, { status: 400 });
      }
      const { data, error } = await supabase
        .from('newsletter_campaigns')
        .update({ status: 'scheduled', scheduled_at: when.toISOString(), approved_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: 'Programmation impossible.' }, { status: 500 });
      return NextResponse.json({ success: true, campaign: data });
    }

    if (action === 'cancel') {
      const { data, error } = await supabase
        .from('newsletter_campaigns')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();
      if (error) return NextResponse.json({ error: 'Annulation impossible.' }, { status: 500 });
      return NextResponse.json({ success: true, campaign: data });
    }

    return NextResponse.json({ error: "action invalide (approve|schedule|cancel)." }, { status: 400 });
  } catch (e) {
    return authErrorResponse(e);
  }
}
