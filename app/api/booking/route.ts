// app/api/booking/route.ts

import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;

/**
 * Normalise une valeur "heure" qui peut provenir de Google Sheets sous
 * plusieurs formats :
 *   - string propre   : "09:00"          → "09:00"
 *   - string ISO      : "1899-12-30T08:00:00.000Z" (bug Sheets timezone)
 *   - string longue   : "09:00:00"       → "09:00"
 *
 * ⚠️  NE PAS utiliser getUTCHours() : Paris était UTC+0:09:21 avant 1911,
 *     ce qui provoque le décalage de 14 minutes observé.
 *     On parse manuellement depuis la partie "T" de l'ISO string.
 */
function parseSheetTime(raw: string): string {
  if (!raw) return '';

  // Cas ISO : "1899-12-30T09:00:00.000Z" ou "…T09:14:00.000Z"
  if (raw.includes('T')) {
    // Extraire la partie après le T et avant le Z/.
    const timePart = raw.split('T')[1]; // "09:00:00.000Z"
    return timePart.substring(0, 5);    // "09:00"
  }

  // Cas "HH:MM:SS" → tronquer
  return raw.substring(0, 5);
}

function normalizeSlots(slots: any[]): any[] {
  return slots.map(slot => ({
    ...slot,
    time: parseSheetTime(String(slot.time ?? '')),
    available: slot.status === 'disponible',
  }));
}

// ─────────────────────────────────────────────
// GET — Récupérer les créneaux disponibles
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || '';

    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.set('action', 'slots');
    if (date) url.searchParams.set('date', date);

    const response = await fetch(url.toString(), { redirect: 'follow' });

    if (!response.ok) {
      throw new Error(`Google Script error: ${response.status}`);
    }

    const result = await response.json();

    if (result.slots && Array.isArray(result.slots)) {
      result.slots = normalizeSlots(result.slots);

      // Supprimer les éventuels doublons date+time (clé React unique)
      const seen = new Set<string>();
      result.slots = result.slots.filter((slot: any) => {
        const key = `${slot.date}_${slot.time}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Slots error:', error);
    return NextResponse.json({ slots: [] });
  }
}

// ─────────────────────────────────────────────
// POST — Confirmer une réservation
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Support { action: 'bookSlot', data: { … } } ou payload plat
    const fields = body.data ?? body;
    const { name, email, phone, service, date, time, message, language } = fields;

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants : name, email, date, time' },
        { status: 400 }
      );
    }

    // S'assurer que l'heure envoyée à Google est bien "HH:MM"
    const normalizedTime = parseSheetTime(String(time));

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action:   'book',
        name,
        email,
        phone:    phone    ?? '',
        service:  service  ?? '',
        date,
        time:     normalizedTime,
        message:  message  ?? '',
        language: language ?? 'fr',
      }),
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Google Script error: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réservation : ' + error.message },
      { status: 500 }
    );
  }
}