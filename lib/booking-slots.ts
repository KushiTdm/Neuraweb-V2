// lib/booking-slots.ts
//
// Calcule les créneaux de RDV disponibles à partir de Supabase :
//   - gabarit par défaut (lundi-vendredi, DEFAULT_SLOT_TIMES)
//   - exceptions jour par jour dans `booking_slots` (fermetures/ajouts,
//     gérées depuis l'app mobile)
//   - moins les créneaux déjà pris dans `bookings` (statut ≠ cancelled)
//
// Remplace l'ancienne lecture live du Google Apps Script/Sheet (voir git
// history de app/api/booking/route.ts) qui ajoutait 1-3s, non mis en cache,
// à chaque chargement de /booking.
//
// ⚠️ Server-only (utilise la service role key) — ne jamais importer depuis
// un composant client.

import { getServiceSupabase } from '@/lib/supabase-server';

export interface Slot {
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  available: true;
}

export const DEFAULT_SLOT_TIMES = ['10:00', '12:00', '14:00', '18:00'];
const DEFAULT_SLOT_WEEKDAYS = new Set([1, 2, 3, 4, 5]); // lundi-vendredi (0 = dimanche, via getUTCDay)
const DAYS_AHEAD = 30;

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

function addDaysKey(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function weekdayOf(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/**
 * Créneaux disponibles pour les DAYS_AHEAD prochains jours (à partir de demain).
 */
export async function getAvailableSlots(): Promise<Slot[]> {
  const supabase = getServiceSupabase();
  if (!supabase) return [];

  const today = todayKeyParis();
  const startDate = addDaysKey(today, 1);
  const endDate = addDaysKey(today, DAYS_AHEAD);

  const [{ data: overrides }, { data: taken }] = await Promise.all([
    supabase
      .from('booking_slots')
      .select('date, time, is_open')
      .gte('date', startDate)
      .lte('date', endDate),
    supabase
      .from('bookings')
      .select('date, time')
      .neq('status', 'cancelled')
      .gte('date', startDate)
      .lte('date', endDate),
  ]);

  const openOverridesByDate = new Map<string, Set<string>>();
  const closedOverridesByDate = new Map<string, Set<string>>();
  for (const row of overrides ?? []) {
    const byDate = row.is_open ? openOverridesByDate : closedOverridesByDate;
    if (!byDate.has(row.date)) byDate.set(row.date, new Set());
    byDate.get(row.date)!.add(row.time);
  }

  const takenByDate = new Map<string, Set<string>>();
  for (const row of taken ?? []) {
    if (!takenByDate.has(row.date)) takenByDate.set(row.date, new Set());
    takenByDate.get(row.date)!.add(row.time);
  }

  const slots: Slot[] = [];
  for (let date = startDate; date <= endDate; date = addDaysKey(date, 1)) {
    const times = new Set<string>(
      DEFAULT_SLOT_WEEKDAYS.has(weekdayOf(date)) ? DEFAULT_SLOT_TIMES : []
    );
    for (const t of closedOverridesByDate.get(date) ?? []) times.delete(t);
    for (const t of openOverridesByDate.get(date) ?? []) times.add(t);

    const bookedTimes = takenByDate.get(date);
    for (const time of times) {
      if (bookedTimes?.has(time)) continue;
      slots.push({ date, time, available: true });
    }
  }

  return slots;
}
