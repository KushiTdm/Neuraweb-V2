// ============================================================
// app/api/mobile/bookings/route.ts
// GET   → liste des RDV (filtres ?status= &date= &limit=)
// PATCH → met à jour le statut d'un RDV { id, status }
// Réservé à l'app mobile (JWT Supabase requis).
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { requireUser, authErrorResponse } from "@/lib/mobile-auth";
import { getServiceSupabase } from "@/lib/supabase-server";

const VALID_STATUS = ["pending", "confirmed", "cancelled", "completed"];

export async function GET(req: NextRequest) {
  try {
    await requireUser(req);
    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ bookings: [] });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const date = searchParams.get("date");
    const limit = Math.min(parseInt(searchParams.get("limit") || "200", 10), 500);

    let query = supabase
      .from("bookings")
      .select("*")
      .order("date", { ascending: true })
      .order("time", { ascending: true })
      .limit(limit);

    if (status && VALID_STATUS.includes(status)) query = query.eq("status", status);
    if (date) query = query.eq("date", date);

    const { data, error } = await query;
    if (error) {
      console.error("[mobile/bookings] GET error:", error);
      return NextResponse.json({ error: "Lecture des RDV impossible." }, { status: 500 });
    }
    return NextResponse.json({ bookings: data ?? [] });
  } catch (e) {
    return authErrorResponse(e);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireUser(req);
    const supabase = getServiceSupabase();
    if (!supabase) return NextResponse.json({ error: "Supabase indisponible." }, { status: 503 });

    const { id, status } = await req.json();
    if (!id || !status || !VALID_STATUS.includes(status)) {
      return NextResponse.json({ error: "id et status (valide) requis." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[mobile/bookings] PATCH error:", error);
      return NextResponse.json({ error: "Mise à jour impossible." }, { status: 500 });
    }
    return NextResponse.json({ booking: data });
  } catch (e) {
    return authErrorResponse(e);
  }
}
