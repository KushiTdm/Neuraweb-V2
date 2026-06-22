// ============================================================
// app/api/mobile/emails/route.ts
// GET            → liste des derniers e-mails (?limit=)
// GET ?uid=123   → détail complet d'un e-mail
// Lecture IMAP de contact@neuraweb.tech. JWT mobile requis.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/mobile-auth";
import { listEmails, getEmail } from "@/lib/email-imap";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  try {
    await requireUser(req);
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (uid) {
      const email = await getEmail(parseInt(uid, 10));
      if (!email) return NextResponse.json({ error: "E-mail introuvable." }, { status: 404 });
      return NextResponse.json({ email });
    }

    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "30", 10), 1), 100);
    const emails = await listEmails(limit);
    return NextResponse.json({ emails });
  } catch (e) {
    return authErrorResponse(e);
  }
}
