// ============================================================
// app/api/mobile/ai/social/route.ts
// Conseil social (Mistral) : optimise un message pour une plateforme
// donnée selon son algorithme. Body : { platform, message, goal? }.
// Renvoie { optimized, advice }.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/mobile-auth";
import { getPlaybook } from "@/lib/social-playbook";
import { NEURAWEB_BRAND } from "@/lib/neuraweb-context";
import { mistralChat, MistralError, type ChatMessage } from "@/lib/mistral-mobile";

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
    const { platform, message, goal } = await req.json();
    if (!platform || !message || typeof message !== "string" || message.trim().length < 2) {
      return NextResponse.json({ error: "platform et message requis." }, { status: 400 });
    }

    const playbook = getPlaybook(String(platform));
    const system = `Tu es expert en stratégie de contenu social pour l'agence NeuraWeb.
On te donne un message brut et une plateforme cible. Tu dois :
1) Réécrire le message en version optimisée pour cette plateforme et son algorithme.
2) Donner 3 à 5 conseils courts et concrets (format, hook, longueur, hashtags, CTA, placement du lien).

Réponds en français, au format EXACT :
### Version optimisée
<le post réécrit, prêt à publier>

### Conseils
- <conseil 1>
- <conseil 2>
...

━━━ MARQUE ━━━
${NEURAWEB_BRAND}

━━━ ALGORITHME / BONNES PRATIQUES ━━━
${playbook}`;

    const user = `Plateforme cible : ${platform}.${goal ? `\nObjectif : ${goal}.` : ""}\n\nMessage brut :\n${message}`;
    const messages: ChatMessage[] = [
      { role: "system", content: system },
      { role: "user", content: user },
    ];

    const raw = await mistralChat(messages, { maxTokens: 900, temperature: 0.6 });

    // Découpe optionnelle en { optimized, advice } à partir des sections markdown.
    let optimized = raw;
    let advice = "";
    const adviceIdx = raw.indexOf("### Conseils");
    if (adviceIdx !== -1) {
      optimized = raw.slice(0, adviceIdx).replace(/^###\s*Version optimis[ée]e\s*/i, "").trim();
      advice = raw.slice(adviceIdx).replace(/^###\s*Conseils\s*/i, "").trim();
    }

    return NextResponse.json({ raw, optimized, advice, platform });
  } catch (e) {
    if (e instanceof MistralError) return NextResponse.json({ error: e.message }, { status: e.status });
    return authErrorResponse(e);
  }
}
