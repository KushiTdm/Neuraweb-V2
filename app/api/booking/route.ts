// app/api/booking/route.ts

import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!;

// Normalise une valeur "heure" retournée par Google Sheets
// Google Sheets stocke les heures comme des dates: "1899-12-30T14:00:00.000Z"
// On extrait HH:MM et on ajoute available:true
function normalizeSlots(slots: any[]): any[] {
  return slots.map(slot => {
    let time = slot.time;
    // Si c'est une date ISO (Google Sheets time bug)
    if (typeof time === 'string' && time.includes('T')) {
      const d = new Date(time);
      time = String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
    }
    return {
      ...slot,
      time,
      available: slot.status === 'disponible' // composant filtre sur .available
    };
  });
}

// GET — Récupérer les créneaux disponibles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || '';

    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.set('action', 'slots');
    if (date) url.searchParams.set('date', date);

    const response = await fetch(url.toString(), { redirect: 'follow' });

    if (!response.ok) throw new Error(`Google Script error: ${response.status}`);

    const result = await response.json();

    // Normaliser les créneaux avant de les retourner
    if (result.slots && Array.isArray(result.slots)) {
      result.slots = normalizeSlots(result.slots);
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Slots error:', error);
    return NextResponse.json({ slots: [] });
  }
}

// POST — Confirmer une réservation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Le composant envoie { action: 'bookSlot', data: { ...fields } }
    const fields = body.data || body;
    const { name, email, phone, service, date, time, message, language } = fields;

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants: name, email, date, time' },
        { status: 400 }
      );
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'book',
        name, email,
        phone:    phone    || '',
        service:  service  || '',
        date, time,
        message:  message  || '',
        language: language || 'fr'
      }),
      redirect: 'follow',
    });

    if (!response.ok) throw new Error(`Google Script error: ${response.status}`);

    const result = await response.json();

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réservation: ' + error.message },
      { status: 500 }
    );
  }
}