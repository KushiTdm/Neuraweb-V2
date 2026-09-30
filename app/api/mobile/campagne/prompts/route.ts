// ============================================================
// app/api/mobile/campagne/prompts/route.ts
// (Re)génère les prompts visuels d'une publication de campagne (Mistral) :
// image photoréaliste (Gemini / ChatGPT) + animation de cette image dans
// Google Flow (Veo, Frames to Video). Secours des prompts écrits par Claude
// routine ; les nouveaux remplacent les anciens dans la ligne.
//
// POST { id } → { ok, prompt_image, prompt_video, format_visuel }
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/mobile-auth';
import { ApiError, editorialDb, routeErrorResponse } from '@/lib/mobile-api';
import { generateCampagnePrompts } from '@/lib/campagne-prompts';
import { loadPublicationWithCampagne, parsePublicationId } from '@/lib/campagne-db';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const id = parsePublicationId(b.id);
    const { publication: p } = await loadPublicationWithCampagne(id);

    const prompts = await generateCampagnePrompts({
      titre: p.titre,
      role: p.role,
      format: p.format,
      texte: p.texte_publication,
      traduction: p.traduction_fr,
      texteVisuel: p.texte_visuel,
    });

    const { error } = await editorialDb()
      .from('campagne_publications')
      .update({
        prompt_image: prompts.prompt_image,
        prompt_video: prompts.prompt_video,
        format_visuel: p.format_visuel ?? prompts.format_visuel,
        // Un post prévu sans visuel devient un visuel IA. Une « photo réelle »
        // reste une photo réelle (annonce, avant/après) : le prompt n'est qu'une option.
        ...(p.visuel_type === 'aucun' ? { visuel_type: 'ia' } : {}),
      })
      .eq('id', p.id);
    if (error) throw new ApiError(`Prompts générés mais non enregistrés : ${error.message}`, 502);

    return NextResponse.json({ ok: true, ...prompts, format_visuel: p.format_visuel ?? prompts.format_visuel });
  } catch (e) {
    return routeErrorResponse(e);
  }
}
