// ============================================================
// app/api/mobile/emails/draft/route.ts
// POST → rédige une PROPOSITION de réponse (Mistral) à un e-mail reçu.
// Body : { uid? , subject?, from?, body, instruction? }.
// N'envoie RIEN : renvoie juste un brouillon { draft } à relire/éditer.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/mobile-auth";
import { getEmail } from "@/lib/email-imap";
import { NEURAWEB_BRAND } from "@/lib/neuraweb-context";
import { mistralChat, MistralError, type ChatMessage } from "@/lib/mistral-mobile";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
    const { uid, subject, from, body, instruction } = await req.json();

    // Récupère le contenu : soit fourni directement, soit chargé via IMAP.
    let mailSubject = subject || "";
    let mailFrom = from || "";
    let mailBody = body || "";
    if (uid && !mailBody) {
      const email = await getEmail(parseInt(String(uid), 10));
      if (!email) return NextResponse.json({ error: "E-mail introuvable." }, { status: 404 });
      mailSubject = email.subject;
      mailFrom = email.fromName || email.from;
      mailBody = email.text;
    }
    if (!mailBody || mailBody.trim().length < 2) {
      return NextResponse.json({ error: "Contenu de l'e-mail requis." }, { status: 400 });
    }

    const system = `Tu rédiges des réponses e-mail professionnelles pour NeuraWeb, au nom de l'équipe.
Ton : courtois, clair, chaleureux et concis. Français. Signe « L'équipe NeuraWeb ».
Adapte la réponse au message reçu : réponds aux questions, propose la prochaine étape (ex. réserver un appel via https://neuraweb.tech, ou écrire à contact@neuraweb.tech).
Ne promets rien d'irréaliste, ne donne pas de prix faux. Renvoie UNIQUEMENT le corps de l'e-mail (sans objet).

━━━ CONTEXTE ━━━
${NEURAWEB_BRAND}`;

    const user = `E-mail reçu de : ${mailFrom}
Objet : ${mailSubject}

Message :
${mailBody}
${instruction ? `\nConsigne particulière pour la réponse : ${instruction}` : ""}`;

    const messages: ChatMessage[] = [
      { role: "system", content: system },
      { role: "user", content: user },
    ];
    const draft = await mistralChat(messages, { maxTokens: 700, temperature: 0.5 });
    return NextResponse.json({ draft, subject: mailSubject?.startsWith("Re:") ? mailSubject : `Re: ${mailSubject}` });
  } catch (e) {
    if (e instanceof MistralError) return NextResponse.json({ error: e.message }, { status: e.status });
    return authErrorResponse(e);
  }
}
