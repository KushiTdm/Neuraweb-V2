// app/api/mobile/newsletter/campaigns/route.ts
// GET → liste des campagnes newsletter (filtre ?status=). JWT mobile requis.

import { NextRequest, NextResponse } from 'next/server';
import { requireUser, authErrorResponse } from '@/lib/mobile-auth';
import { getServiceSupabase } from '@/lib/supabase-server';

const VALID_STATUS = ['pending_review', 'scheduled', 'sending', 'sent', 'failed', 'cancelled'];

export async function GET(req: NextRequest) {
  try {
    await requireUser(req);
    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ campaigns: [] });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 300);

    let query = supabase
      .from('newsletter_campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status && VALID_STATUS.includes(status)) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) {
      console.error('[mobile/newsletter/campaigns] GET error:', error);
      return NextResponse.json({ error: 'Lecture des campagnes impossible.' }, { status: 500 });
    }
    return NextResponse.json({ campaigns: data ?? [] });
  } catch (e) {
    return authErrorResponse(e);
  }
}
