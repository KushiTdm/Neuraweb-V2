// ============================================================
// app/api/mobile/analytics/route.ts
// GET → résumé d'activité du site (GA4 + Search Console).
// Param ?days=7|28|90 (défaut 28). Réservé à l'app mobile (JWT requis).
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/mobile-auth";
import { getAnalyticsSummary } from "@/lib/analytics-core";

export async function GET(req: NextRequest) {
  try {
    await requireUser(req);
    const { searchParams } = new URL(req.url);
    const days = Math.min(Math.max(parseInt(searchParams.get("days") || "28", 10), 1), 365);
    const summary = await getAnalyticsSummary(days);
    return NextResponse.json(summary);
  } catch (e) {
    return authErrorResponse(e);
  }
}
