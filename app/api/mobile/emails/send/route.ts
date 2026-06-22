// ============================================================
// app/api/mobile/emails/send/route.ts
// POST → envoie une réponse e-mail validée par l'utilisateur (SMTP).
// Body : { to, subject, text, inReplyTo? }.
// Action explicite uniquement (jamais d'envoi automatique).
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/mobile-auth";
import { isValidEmail } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email-imap";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
    const { to, subject, text, inReplyTo } = await req.json();

    if (!to || !isValidEmail(to)) {
      return NextResponse.json({ error: "Destinataire invalide." }, { status: 400 });
    }
    if (!text || String(text).trim().length < 2) {
      return NextResponse.json({ error: "Corps du message requis." }, { status: 400 });
    }

    const result = await sendEmail({
      to,
      subject: subject || "Réponse de NeuraWeb",
      text: String(text),
      inReplyTo,
    });
    if (!result.ok) return NextResponse.json({ error: result.error || "Envoi impossible." }, { status: 502 });
    return NextResponse.json({ sent: true });
  } catch (e) {
    return authErrorResponse(e);
  }
}
