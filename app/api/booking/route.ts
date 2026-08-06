// app/api/booking/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { sendBookingConfirmationEmail, sendBookingNotificationEmail } from '@/lib/email-service';
import { rateLimitRequest, isValidEmail, isHoneypotFilled } from '@/lib/rate-limit';
import { getServiceSupabase } from '@/lib/supabase-server';
import { getAvailableSlots } from '@/lib/booking-slots';

/**
 * Normalise une valeur "heure" qui peut provenir du formulaire sous
 * plusieurs formats :
 *   - string propre   : "09:00"          → "09:00"
 *   - string ISO      : "1899-12-30T08:00:00.000Z" (bug Sheets timezone, legacy)
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

// ─────────────────────────────────────────────
// GET — Récupérer les créneaux disponibles
//
// Source : table Supabase `booking_slots` (gabarit lundi-vendredi + exceptions
// gérées depuis l'app mobile), voir lib/booking-slots.ts. Remplace l'ancienne
// lecture live du Google Sheet (cf. git history) qui ajoutait 1-3s, non mis
// en cache, à chaque chargement de /booking.
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const limit = rateLimitRequest(request, 'booking-slots', { max: 60, windowMs: 60_000 });
    if (!limit.allowed) {
      return NextResponse.json(
        { slots: [], error: 'Trop de requêtes.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter ?? 60) } }
      );
    }

    const slots = await getAvailableSlots();
    return NextResponse.json({ slots });

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
    const limit = rateLimitRequest(request, 'booking', { max: 5, windowMs: 60_000 });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Trop de réservations. Réessayez dans une minute.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter ?? 60) } }
      );
    }

    const body = await request.json();

    // Support { action: 'bookSlot', data: { … } } ou payload plat
    const fields = body.data ?? body;
    const { name, email, phone, service, date, time, message, language } = fields;

    // Honeypot : champ leurre rempli = bot → on acquitte sans rien traiter.
    if (isHoneypotFilled(body) || isHoneypotFilled(fields)) {
      return NextResponse.json({ success: true, emailSent: false });
    }

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants : name, email, date, time' },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 });
    }

    // S'assurer que l'heure stockée est bien "HH:MM"
    const normalizedTime = parseSheetTime(String(time));

    // ─────────────────────────────────────────────────────────
    // Stockage de la réservation → Supabase (source de vérité).
    // L'app mobile lit/gère les RDV depuis cette table en Realtime.
    //
    // Attendu seul (pas en Promise.all avec les emails) : un conflit de
    // créneau (contrainte unique bookings_date_time_active_uidx, deux
    // personnes réservant le même date+heure) doit être détecté avant
    // d'envoyer une confirmation par email qui mentirait sur la réussite.
    // ─────────────────────────────────────────────────────────
    const supabase = getServiceSupabase();
    let supabaseError: { code?: string; message?: string } | null = null;

    if (supabase) {
      const { error } = await supabase.from('bookings').insert({
        name,
        email,
        phone:    phone   ?? null,
        service:  service ?? null,
        date,
        time:     normalizedTime,
        message:  message ?? null,
        language: language ?? 'fr',
        source:   'website',
        status:   'pending',
      });
      supabaseError = error;
    }

    if (supabaseError?.code === '23505') {
      return NextResponse.json(
        { error: 'Ce créneau vient d\'être réservé par quelqu\'un d\'autre. Merci d\'en choisir un autre.' },
        { status: 409 }
      );
    }

    // ─────────────────────────────────────────────────────────
    // FALLBACK Google Sheets — conservé en commentaire pour rollback.
    // Réactiver ce bloc (et le rajouter au Promise.all ci-dessous) si
    // l'on souhaite revenir à un stockage Sheets.
    // ─────────────────────────────────────────────────────────
    // const googlePromise = fetch(GOOGLE_SCRIPT_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     action:   'book',
    //     name,
    //     email,
    //     phone:    phone    ?? '',
    //     service:  service  ?? '',
    //     date,
    //     time:     normalizedTime,
    //     message:  message  ?? '',
    //     language: language ?? 'fr',
    //   }),
    //   redirect: 'follow',
    // });

    // Préparer les données pour les emails
    const bookingData = {
      name,
      email,
      phone: phone ?? undefined,
      service: service ?? undefined,
      date,
      time: normalizedTime,
      message: message ?? undefined,
      language: language ?? 'fr',
    };

    // Réservation sauvegardée (ou Supabase indisponible/erreur non-bloquante) :
    // envoyer les emails via Resend (confirmation client + notification équipe).
    if (supabaseError) {
      console.warn('Supabase booking insert warning:', supabaseError);
    }

    const [emailNotificationResult, emailConfirmationResult] = await Promise.all([
      sendBookingNotificationEmail(bookingData),
      sendBookingConfirmationEmail(bookingData),
    ]);

    // Log les résultats des emails (non bloquant)
    if (!emailNotificationResult.success) {
      console.warn('Email notification warning:', emailNotificationResult.error);
    }

    if (!emailConfirmationResult.success) {
      console.warn('Email confirmation warning:', emailConfirmationResult.error);
    }

    // Retourner succès même si les emails échouent (la réservation est sauvegardée)
    return NextResponse.json({ 
      success: true,
      emailSent: emailNotificationResult.success && emailConfirmationResult.success 
    });

  } catch (error: any) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la réservation : ' + error.message },
      { status: 500 }
    );
  }
}
