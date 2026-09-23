// ============================================================
// app/api/mobile/social/refine/route.ts
// Remplace le workflow n8n `Edition_IA_v2` (webhook ai-refine, Gemini).
//
// POST { platform: 'facebook'|'linkedin'|'x', field: 'hook'|'post'|'tweet',
//        lang, current, instruction, title, excerpt }
// → { ok: true, revised }
// Pour un tweet, la limite de 280 caractères est garantie (raccourcissement
// automatique). N'écrit jamais en base : l'app persiste après validation.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/mobile-auth';
import { routeErrorResponse } from '@/lib/mobile-api';
import { refineText } from '@/lib/social-generation';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const str = (v: unknown) => String(v ?? '').trim();

    const current = str(b.current);
    const instruction = str(b.instruction);
    if (!current) return NextResponse.json({ error: 'current (texte à réviser) manquant.' }, { status: 400 });
    if (!instruction) return NextResponse.json({ error: 'instruction manquante.' }, { status: 400 });

    const revised = await refineText({
      platform: str(b.platform),
      field: str(b.field),
      lang: str(b.lang) || 'fr',
      current,
      instruction,
      title: str(b.title),
      excerpt: str(b.excerpt),
    });
    return NextResponse.json({ ok: true, revised });
  } catch (e) {
    return routeErrorResponse(e);
  }
}
