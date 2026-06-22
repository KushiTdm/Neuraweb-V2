-- ============================================================
-- Mobile Cockpit — schéma Supabase
-- Tables : bookings (prise de RDV) + chat_logs (historique chatbot site)
--
-- À exécuter dans le SQL editor Supabase (même projet que
-- generated_social_posts). Idempotent : ré-exécutable sans casse.
--
-- Auth modèle :
--   - Écritures serveur (insert RDV depuis /api/booking, log chat depuis
--     /api/chat) passent par la SERVICE ROLE KEY → bypass RLS.
--   - L'app mobile lit/modifie avec un JWT utilisateur authentifié.
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Table : bookings ────────────────────────────────────────
create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  service     text,
  date        date not null,
  time        text not null,                 -- "HH:MM" (cohérent avec les créneaux Sheets)
  message     text,
  language    text default 'fr',
  company     text,
  status      text not null default 'pending'
              check (status in ('pending','confirmed','cancelled','completed')),
  source      text not null default 'website', -- website | mobile | manual
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists bookings_date_idx   on public.bookings (date);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_created_idx on public.bookings (created_at desc);

-- maj automatique de updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ── Table : chat_logs ───────────────────────────────────────
create table if not exists public.chat_logs (
  id                  uuid primary key default gen_random_uuid(),
  session_id          text,
  ip                  text,
  lang                text,
  user_message        text,
  assistant_response  text,
  intent              text default 'normal'
                      check (intent in ('normal','booking','qualification')),
  created_at          timestamptz not null default now()
);

create index if not exists chat_logs_created_idx on public.chat_logs (created_at desc);
create index if not exists chat_logs_session_idx on public.chat_logs (session_id);

-- ── RLS ─────────────────────────────────────────────────────
alter table public.bookings  enable row level security;
alter table public.chat_logs enable row level security;

-- Les utilisateurs authentifiés de l'app peuvent tout lire / mettre à jour les RDV.
drop policy if exists "bookings_select_auth" on public.bookings;
create policy "bookings_select_auth" on public.bookings
  for select to authenticated using (true);

drop policy if exists "bookings_update_auth" on public.bookings;
create policy "bookings_update_auth" on public.bookings
  for update to authenticated using (true) with check (true);

-- chat_logs : lecture seule pour l'app (analyse), insert via service-role.
drop policy if exists "chat_logs_select_auth" on public.chat_logs;
create policy "chat_logs_select_auth" on public.chat_logs
  for select to authenticated using (true);

-- ── Realtime ────────────────────────────────────────────────
-- Permet à l'app mobile de recevoir les nouveaux RDV en direct.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'bookings'
  ) then
    alter publication supabase_realtime add table public.bookings;
  end if;
end $$;
