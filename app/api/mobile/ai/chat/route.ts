// ============================================================
// app/api/mobile/ai/chat/route.ts
// Copilote de gestion (Mistral) : répond à Nacer avec le contexte
// NeuraWeb + un snapshot d'activité réel (RDV, posts en attente,
// analytics). Body : { message, history?: [{role,content}] }.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/mobile-auth";
import { getServiceSupabase } from "@/lib/supabase-server";
import { getAnalyticsSummary, summarizeForPrompt } from "@/lib/analytics-core";
import { buildAssistantSystemPrompt } from "@/lib/neuraweb-context";
import { mistralChat, MistralError, type ChatMessage } from "@/lib/mistral-mobile";

/** Construit un instantané texte de l'activité (best-effort). */
async function buildActivitySnapshot(): Promise<string> {
  const parts: string[] = [];
  const supabase = getServiceSupabase();

  if (supabase) {
    const todayIso = new Date().toISOString().split("T")[0];
    const weekAhead = new Date();
    weekAhead.setDate(weekAhead.getDate() + 7);
    const weekIso = weekAhead.toISOString().split("T")[0];

    const [pending, confirmed, upcoming, posts] = await Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "confirmed"),
      supabase
        .from("bookings")
        .select("name,service,date,time,status")
        .gte("date", todayIso)
        .lte("date", weekIso)
        .order("date", { ascending: true })
        .limit(10),
      supabase.from("generated_social_posts").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ]);

    parts.push(
      `RDV : ${pending.count ?? 0} en attente, ${confirmed.count ?? 0} confirmés.`,
    );
    if (upcoming.data?.length) {
      const list = upcoming.data
        .map((b: any) => `${b.date} ${b.time} — ${b.name}${b.service ? ` (${b.service})` : ""} [${b.status}]`)
        .join("; ");
      parts.push(`RDV des 7 prochains jours : ${list}.`);
    } else {
      parts.push("Aucun RDV dans les 7 prochains jours.");
    }
    parts.push(`Posts sociaux générés en attente de validation : ${posts.count ?? 0}.`);
  }

  try {
    const analytics = await getAnalyticsSummary(28);
    parts.push(summarizeForPrompt(analytics));
  } catch {
    parts.push("Analytics indisponible.");
  }

  return parts.join("\n");
}

export async function POST(req: NextRequest) {
  try {
    await requireUser(req);
    const { message, history = [] } = await req.json();
    if (!message || typeof message !== "string" || message.trim().length < 2) {
      return NextResponse.json({ error: "Message requis." }, { status: 400 });
    }

    const snapshot = await buildActivitySnapshot();
    const messages: ChatMessage[] = [{ role: "system", content: buildAssistantSystemPrompt(snapshot) }];

    for (const m of (history as ChatMessage[]).slice(-8)) {
      if (m?.role === "user" || m?.role === "assistant") {
        messages.push({ role: m.role, content: String(m.content) });
      }
    }
    messages.push({ role: "user", content: message });

    const response = await mistralChat(messages, { maxTokens: 800, temperature: 0.5 });
    return NextResponse.json({ response });
  } catch (e) {
    if (e instanceof MistralError) return NextResponse.json({ error: e.message }, { status: e.status });
    return authErrorResponse(e);
  }
}
