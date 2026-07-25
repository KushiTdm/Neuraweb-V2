-- ============================================================
-- Migration 0005 : chat_security_events
-- Journal des événements de sécurité du chatbot public (/api/chat) :
-- prompt injection, sondes techniques, trolling répété, rate limit, blocages.
--
-- À exécuter dans le SQL editor Supabase (même projet que chat_logs).
-- Idempotent : ré-exécutable sans casse.
--
-- Auth modèle (identique à chat_logs) :
--   - Écritures serveur via SERVICE ROLE KEY (lib/chat-guard.ts) → bypass RLS.
--   - L'app mobile lit avec un JWT authentifié, et s'abonne en Realtime
--     pour notifier d'une tentative d'abus.
-- ============================================================

create extension if not exists "pgcrypto";

-- ── Table : chat_security_events ────────────────────────────
create table if not exists public.chat_security_events (
  id            uuid primary key default gen_random_uuid(),
  ip            text,
  session_id    text,
  lang          text,
  event_type    text not null
                check (event_type in ('injection','probe','off_topic','rate_limit','blocked')),
  severity      text not null default 'medium'
                check (severity in ('low','medium','high')),
  user_message  text,
  details       text,
  created_at    timestamptz not null default now()
);

create index if not exists chat_security_events_created_idx
  on public.chat_security_events (created_at desc);
create index if not exists chat_security_events_ip_idx
  on public.chat_security_events (ip, created_at desc);

-- ── RLS ─────────────────────────────────────────────────────
alter table public.chat_security_events enable row level security;

-- Lecture seule pour l'app mobile (analyse + notifications).
-- Insert uniquement via service-role (aucune policy insert → bloqué pour anon/auth).
drop policy if exists "chat_security_events_select_auth" on public.chat_security_events;
create policy "chat_security_events_select_auth" on public.chat_security_events
  for select to authenticated using (true);

-- ── Realtime ────────────────────────────────────────────────
-- Permet à l'app cockpit de recevoir les alertes de sécurité en direct.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'chat_security_events'
  ) then
    alter publication supabase_realtime add table public.chat_security_events;
  end if;
end $$;
