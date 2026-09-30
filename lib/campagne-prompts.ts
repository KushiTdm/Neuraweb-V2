// ============================================================
// lib/campagne-prompts.ts
// Prompts visuels d'une publication de campagne, générés À LA DEMANDE depuis
// l'app (bouton « Régénérer les prompts ») — en secours de ceux que Claude
// routine écrit chaque jour (§18 de ses instructions), avec les mêmes règles :
//   - prompt_image : image photoréaliste pour Gemini ou ChatGPT ;
//   - prompt_video : animation de CETTE image dans Google Flow (Veo, mode
//     « Frames to Video » : l'image générée sert de première image).
// Les prompts sont en anglais : c'est la langue la mieux suivie par Veo et
// par les générateurs d'images. Le texte à incruster n'est jamais dans
// l'image (les générateurs cassent les diacritiques vietnamiens) : il est
// posé ensuite dans Canva.
// ============================================================

import { mistralChat } from '@/lib/mistral-mobile';
import { ApiError } from '@/lib/mobile-api';
import { CONTENT_MODEL, parseLooseJson, stripMarkdown, stripQuotes } from '@/lib/social-text';

export interface CampagnePrompts {
  prompt_image: string;
  prompt_video: string;
  format_visuel: '4:5' | '9:16';
}

const IMAGE_ENDING = 'No text, no letters, no numbers, no logos, no watermark anywhere in the image.';
const VIDEO_START = 'Use the provided image as the first frame.';
const VIDEO_ENDING = 'No on-screen text, no subtitles, no logos.';

const SYSTEM = `You write prompts for AI image generators (Gemini, ChatGPT) and for Google Flow (Veo, "Frames to Video" mode).
Context: a Facebook marketing campaign run by Neuraweb, a small web studio based in Hanoi, Vietnam. The audience is local business owners (cafés, street-food restaurants, hair salons, spas, boutiques, homestays).
You receive one Facebook post (Vietnamese text + French translation). Return STRICTLY this JSON, nothing else:
{"prompt_image": "...", "prompt_video": "..."}

prompt_image rules:
- English, one paragraph, 70 to 120 words, no lists, no markdown.
- Photorealistic: candid smartphone photo look, natural light, realistic textures, an authentic Hanoi setting that illustrates the precise idea of the post (Old Quarter alley, small café with low plastic stools, neighbourhood hair salon, boutique, homestay room...).
- People only from behind, in profile or out of focus. No identifiable close-up face. Never a real, named business. Never a readable phone or laptop screen showing a website.
- Composition: one clear main subject, plus a calm empty area (plain wall, sky, table top) in the upper third where text will be added later.
- Palette: light, airy background, one deep accent (emerald green or navy blue), subtle warm gold touches. Avoid saturated red-and-yellow promo colours and black-and-white dominance.
- Avoid stock-photo clichés: smiling team around a laptop, handshakes, robots, glowing brains.
- State the format given in the request.
- End with exactly: "${IMAGE_ENDING}"

prompt_video rules:
- English, 40 to 90 words, one paragraph.
- Start with exactly: "${VIDEO_START}"
- Describe only motion: one subtle camera move (slow push-in, gentle handheld drift or slow pan) and natural motion in the scene (rising steam, leaves, blurred scooters passing in the background, a hand setting down a cup). Realistic, lighting consistent with the image, no morphing, no new characters, 8 seconds, vertical 9:16.
- Audio: ambient sound only (Hanoi street, cups, light rain). No voice, no dialogue, no music with lyrics.
- End with exactly: "${VIDEO_ENDING}"`;

function ensureEnding(text: string, ending: string): string {
  const t = text.trim();
  return t.toLowerCase().includes(ending.toLowerCase().slice(0, 24)) ? t : `${t} ${ending}`;
}

function ensureStart(text: string, start: string): string {
  const t = text.trim();
  return t.toLowerCase().startsWith(start.toLowerCase().slice(0, 20)) ? t : `${start} ${t}`;
}

export async function generateCampagnePrompts(input: {
  titre: string;
  role: string;
  format: string;
  texte: string;
  traduction?: string | null;
  texteVisuel?: string | null;
}): Promise<CampagnePrompts> {
  const video = input.format === 'video';
  const formatVisuel: CampagnePrompts['format_visuel'] = video ? '9:16' : '4:5';
  const formatLabel = video
    ? 'vertical 9:16 (1080x1920), main subject centred inside the central 4:5 area so the image can also be cropped for the feed'
    : 'portrait 4:5 (1080x1350)';

  const user =
    `Post role: ${input.role} | Post format: ${input.format} | Internal title: ${input.titre}\n` +
    `Image format to state in prompt_image: ${formatLabel}\n\n` +
    `Post text (Vietnamese):\n${input.texte.slice(0, 2500)}\n\n` +
    (input.traduction ? `French translation:\n${input.traduction.slice(0, 2500)}\n\n` : '') +
    (input.texteVisuel
      ? `Text that will be overlaid later in Canva (do NOT render it, just keep room for it):\n${input.texteVisuel.slice(0, 400)}\n`
      : '');

  const raw = await mistralChat(
    [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: user },
    ],
    { model: CONTENT_MODEL, temperature: 0.6, json: true, maxTokens: 900 },
  );

  let parsed: { prompt_image?: unknown; prompt_video?: unknown };
  try {
    parsed = parseLooseJson(raw, 'prompts campagne');
  } catch {
    throw new ApiError("Réponse de l'IA illisible (JSON invalide) — réessaie.", 502);
  }
  const image = stripMarkdown(stripQuotes(String(parsed.prompt_image ?? '')));
  const clip = stripMarkdown(stripQuotes(String(parsed.prompt_video ?? '')));
  if (!image || !clip) throw new ApiError("L'IA n'a pas renvoyé les deux prompts — réessaie.", 502);

  return {
    prompt_image: ensureEnding(image, IMAGE_ENDING),
    prompt_video: ensureEnding(ensureStart(clip, VIDEO_START), VIDEO_ENDING),
    format_visuel: formatVisuel,
  };
}
