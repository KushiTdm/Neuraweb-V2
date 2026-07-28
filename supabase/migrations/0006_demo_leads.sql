-- ============================================================
-- Migration 0006 : demo_leads
-- Sollicitations issues de la démo (demo.neuraweb.fr) : formulaire
-- « Discuter de votre projet » + escalade depuis l'assistant.
--
-- À exécuter dans le SQL editor Supabase (même projet que bookings /
-- chat_security_events). Idempotent : ré-exécutable sans casse.
--
-- Auth modèle (identique à chat_security_events) :
--   - Écritures via SERVICE ROLE KEY (Demo/app/api/lead/route.ts) → bypass RLS.
--   - L'app mobile lit avec un JWT authentifié, s'abonne en Realtime pour
--     notifier d'une nouvelle sollicitation, et peut marquer « traité ».
-- ============================================================

create extension if not exists "pgcrypto";

-- ── Table : demo_leads ──────────────────────────────────────
create table if not exists public.demo_leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  sector      text not null default 'general'
              check (sector in ('collectivite','restaurant','hotel','general')),
  source      text not null default 'contact'
              check (source in ('contact','assistant')),
  context     text,
  status      text not null default 'new'
              check (status in ('new','handled')),
  ip          text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists demo_leads_created_idx on public.demo_leads (created_at desc);
create index if not exists demo_leads_status_idx  on public.demo_leads (status);

-- maj automatique de updated_at (réutilise la fonction de la migration 0001)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists demo_leads_set_updated_at on public.demo_leads;
create trigger demo_leads_set_updated_at
  before update on public.demo_leads
  for each row execute function public.set_updated_at();

-- ── RLS ─────────────────────────────────────────────────────
alter table public.demo_leads enable row level security;

-- Lecture pour l'app mobile (liste + notifications).
drop policy if exists "demo_leads_select_auth" on public.demo_leads;
create policy "demo_leads_select_auth" on public.demo_leads
  for select to authenticated using (true);

-- Mise à jour du statut (« Marquer traité ») pour l'app mobile.
drop policy if exists "demo_leads_update_auth" on public.demo_leads;
create policy "demo_leads_update_auth" on public.demo_leads
  for update to authenticated using (true) with check (true);

-- Aucune policy insert → insert réservé au service-role (route /api/lead).

-- ── Realtime ────────────────────────────────────────────────
-- Permet à l'app cockpit de recevoir les nouvelles sollicitations en direct.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'demo_leads'
  ) then
    alter publication supabase_realtime add table public.demo_leads;
  end if;
end $$;
