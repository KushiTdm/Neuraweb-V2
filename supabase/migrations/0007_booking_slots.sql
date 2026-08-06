-- ============================================================
-- Booking slots — gabarit + exceptions par jour, gérées depuis l'app mobile.
-- Défaut (aucune ligne) : lundi-vendredi, 10:00/12:00/14:00/18:00.
--   is_open = false → ferme un créneau du gabarit ce jour-là.
--   is_open = true sur un jour/heure hors gabarit → ajoute un créneau.
--
-- À exécuter dans le SQL editor Supabase (même projet que bookings).
-- Idempotent : ré-exécutable sans casse.
-- ============================================================

create table if not exists public.booking_slots (
  id          uuid primary key default gen_random_uuid(),
  date        date not null,
  time        text not null,                 -- "HH:MM"
  is_open     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (date, time)
);

create index if not exists booking_slots_date_idx on public.booking_slots (date);

-- réutilise public.set_updated_at() défini dans 0001_mobile_cockpit.sql
drop trigger if exists booking_slots_set_updated_at on public.booking_slots;
create trigger booking_slots_set_updated_at
  before update on public.booking_slots
  for each row execute function public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────
-- Écriture serveur (GET /api/booking) passe par la SERVICE ROLE KEY → bypass RLS.
-- L'app mobile lit/gère les créneaux avec un JWT utilisateur authentifié.
alter table public.booking_slots enable row level security;

drop policy if exists "booking_slots_select_auth" on public.booking_slots;
create policy "booking_slots_select_auth" on public.booking_slots
  for select to authenticated using (true);

drop policy if exists "booking_slots_write_auth" on public.booking_slots;
create policy "booking_slots_write_auth" on public.booking_slots
  for all to authenticated using (true) with check (true);

-- ── Realtime ────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'booking_slots'
  ) then
    alter publication supabase_realtime add table public.booking_slots;
  end if;
end $$;

-- ── Anti double-réservation ─────────────────────────────────
-- Empêche deux RDV actifs (non annulés) sur le même date+heure.
create unique index if not exists bookings_date_time_active_uidx
  on public.bookings (date, time)
  where status <> 'cancelled';
