import { NextRequest, NextResponse } from "next/server";

// ============================================
// CONFIGURATION GOOGLE APPS SCRIPT
// ============================================
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || '';

// Stockage local des réservations (fallback si pas de Google Script)
const localBookings = new Map<string, { date: string; time: string; clientInfo: Record<string, string> }>();

// Générer des créneaux locaux pour les 14 prochains jours
function generateLocalSlots() {
  const slots: { date: string; time: string; available: boolean }[] = [];
  const today = new Date();
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  for (let day = 1; day <= 14; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);

    // Ignorer les weekends (samedi = 6, dimanche = 0)
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dateStr = date.toISOString().split('T')[0];

    timeSlots.forEach(time => {
      const bookingKey = `${dateStr}-${time}`;
      slots.push({
        date: dateStr,
        time,
        available: !localBookings.has(bookingKey)
      });
    });
  }

  return slots;
}

// Réservation locale
function bookLocalSlot(data: { 
  date: string; 
  time: string; 
  name: string; 
  email: string; 
  phone?: string; 
  whatsapp?: string; 
  company?: string; 
  service?: string; 
  message?: string;
  language?: string;
}) {
  const bookingKey = `${data.date}-${data.time}`;

  if (localBookings.has(bookingKey)) {
    return { success: false, error: 'Ce créneau est déjà réservé' };
  }

  localBookings.set(bookingKey, {
    date: data.date,
    time: data.time,
    clientInfo: {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      whatsapp: data.whatsapp || '',
      company: data.company || '',
      service: data.service || '',
      message: data.message || '',
      language: data.language || 'fr'
    }
  });

  console.log('📅 Nouvelle réservation:', bookingKey, data);
  return { success: true, message: 'Rendez-vous réservé avec succès' };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  // Si pas de Google Script configuré, utiliser le système local
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
    if (action === 'getAvailableSlots') {
      const slots = generateLocalSlots();
      console.log(`📅 Créneaux générés: ${slots.length} créneaux disponibles`);
      return NextResponse.json({ slots });
    }
    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 });
  }

  // Sinon, utiliser Google Sheets
  try {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.set('action', action || 'getAvailableSlots');

    const response = await fetch(url.toString());
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Google Sheets API error:', error);
    // Fallback sur système local en cas d'erreur
    if (action === 'getAvailableSlots') {
      return NextResponse.json({ slots: generateLocalSlots() });
    }
    return NextResponse.json({ error: 'Failed to fetch from Google Sheets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    // Si pas de Google Script configuré, utiliser le système local
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
      if (action === 'bookSlot') {
        const result = bookLocalSlot(data);
        return NextResponse.json(result);
      }
      return NextResponse.json({ error: 'Action inconnue' }, { status: 400 });
    }

    // Sinon, utiliser Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Erreur lors de la réservation' }, { status: 500 });
  }
}
