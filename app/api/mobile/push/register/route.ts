// ============================================================
// app/api/mobile/push/register/route.ts
// L'app enregistre (ou renouvelle) le jeton FCM de l'appareil.
// POST { token, platform? } — JWT Supabase requis.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/mobile-auth';
import { ApiError, editorialDb, routeErrorResponse } from '@/lib/mobile-api';

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const token = typeof b.token === 'string' ? b.token.trim() : '';
    if (token.length < 20 || token.length > 4096) throw new ApiError('Jeton de notification invalide.', 400);
    const platform = b.platform === 'ios' ? 'ios' : 'android';

    const { error } = await editorialDb()
      .from('push_tokens')
      .upsert({ token, user_id: user.id, platform, updated_at: new Date().toISOString() }, { onConflict: 'token' });
    if (error) throw new ApiError(`Enregistrement impossible : ${error.message}`, 502);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return routeErrorResponse(e);
  }
}
