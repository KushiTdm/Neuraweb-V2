// app/api/booking/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { sendBookingConfirmationEmail, sendBookingNotificationEmail } from '@/lib/email-service';
import { rateLimitRequest, isValidEmail, isHoneypotFilled } from '@/lib/rate-limit';
import { getServiceSupabase } from '@/lib/supabase-server';

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

/**
 * Extrait la partie "YYYY-MM-DD" d'une valeur date de la feuille, qui peut
 * arriver soit en "YYYY-MM-DD", soit en ISO datetime ("…T00:00:00.000Z").
 */
function parseSheetDate(raw: string): string {
  if (!raw) return '';
  return raw.includes('T') ? raw.split('T')[0] : raw.substring(0, 10);
}

/**
 * Date du jour (YYYY-MM-DD) dans le fuseau Europe/Paris — fuseau de l'agence.
 * Évite que les créneaux passés restent réservables si le serveur tourne en UTC.
 */
function todayKeyParis(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

// ─────────────────────────────────────────────
// GET — Récupérer les créneaux disponibles
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

      // Écarter les créneaux dont la date est passée (la feuille conserve les
      // anciennes lignes). Comparaison de clés "YYYY-MM-DD" en fuseau Paris.
      const today = todayKeyParis();
      result.slots = result.slots.filter(
        (slot: any) => parseSheetDate(String(slot.date ?? '')) >= today
      );

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
    // ─────────────────────────────────────────────────────────
    const supabase = getServiceSupabase();
    const supabasePromise = supabase
      ? supabase.from('bookings').insert({
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
        })
      : Promise.resolve({ error: null });

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

    // Envoyer les emails via Resend (confirmation client + notification équipe)
    const emailNotificationPromise = sendBookingNotificationEmail(bookingData);
    const emailConfirmationPromise = sendBookingConfirmationEmail(bookingData);

    // Exécuter tout en parallèle (stockage + emails)
    const [supabaseResult, emailNotificationResult, emailConfirmationResult] = await Promise.all([
      supabasePromise,
      emailNotificationPromise,
      emailConfirmationPromise,
    ]);

    // Vérifier l'enregistrement Supabase (non bloquant : les emails partent quand même)
    if ((supabaseResult as { error?: unknown })?.error) {
      console.warn('Supabase booking insert warning:', (supabaseResult as { error: unknown }).error);
    }

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
