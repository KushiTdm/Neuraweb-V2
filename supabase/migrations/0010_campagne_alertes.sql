-- ============================================================
-- Migration 0010 — Alertes « commentaire sans réponse » (app fermée)
--
-- 1. Table editorial.campagne_alertes : commentaires Facebook déjà signalés,
--    pour ne jamais notifier deux fois le même. Service role uniquement.
-- 2. pg_cron + pg_net : toutes les 15 minutes, Supabase appelle
--    https://neuraweb.fr/api/cron/campagne-alertes avec le secret rangé dans
--    Vault (nom : campagne_cron_secret). La même valeur doit être dans la
--    variable Vercel CRON_SECRET.
--
-- Appliquée en base le 2026-10-05 via le connecteur Supabase. Le secret
-- n'est PAS dans ce fichier : il a été créé directement dans Vault.
-- Arrêter les alertes : select cron.unschedule('campagne-alertes');
-- ============================================================

create table if not exists editorial.campagne_alertes (
  comment_id      text primary key,
  publication_id  bigint references editorial.campagne_publications (id) on delete cascade,
  created_time    timestamptz,
  notified_at     timestamptz not null default now()
);

alter table editorial.campagne_alertes enable row level security;
revoke all on editorial.campagne_alertes from anon, authenticated;

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

-- (Secret créé hors fichier :)
-- select vault.create_secret('<valeur de CRON_SECRET>', 'campagne_cron_secret');

do $$
begin
  if exists (select 1 from cron.job where jobname = 'campagne-alertes') then
    perform cron.unschedule('campagne-alertes');
  end if;
end $$;

select cron.schedule(
  'campagne-alertes',
  '*/15 * * * *',
  $job$
  select net.http_post(
    url := 'https://neuraweb.fr/api/cron/campagne-alertes',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'campagne_cron_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 55000
  );
  $job$
);
