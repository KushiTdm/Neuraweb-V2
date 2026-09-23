// ============================================================
// app/api/mobile/social/image-prompt/route.ts
// Génère le prompt d'un visuel à coller dans Gemini ou ChatGPT.
//
// POST { text, sujet?, platform? } → { ok: true, prompt }
// N'écrit rien en base : l'app affiche le prompt avec un bouton « Copier ».
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/mobile-auth';
import { routeErrorResponse } from '@/lib/mobile-api';
import { generateImagePrompt } from '@/lib/social-generation';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const text = String(b.text ?? '').trim();
    if (text.length < 10) {
      return NextResponse.json({ error: 'text (contenu du post) requis.' }, { status: 400 });
    }
    const prompt = await generateImagePrompt({
      text,
      sujet: b.sujet ? String(b.sujet) : undefined,
      platform: b.platform ? String(b.platform) : undefined,
    });
    return NextResponse.json({ ok: true, prompt });
  } catch (e) {
    return routeErrorResponse(e);
  }
}
