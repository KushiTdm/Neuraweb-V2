-- ============================================================
-- Migration 0012 — Notifications push instantanées (app fermée)
--
-- Chaque événement important appelle https://neuraweb.fr/api/cron/push-event
-- (pg_net), qui envoie la notification Firebase au téléphone :
--   nouveau RDV · nouvelle sollicitation démo · alerte chatbot « high» ·
--   publication de campagne à valider.
--
-- Prérequis : migration 0010 (pg_net) + secret Vault `campagne_cron_secret`
-- (le même que la variable Vercel CRON_SECRET) + FIREBASE_SERVICE_ACCOUNT_JSON.
-- Le trigger ne peut JAMAIS faire échouer l'insertion d'origine : toute
-- erreur (réseau, secret absent) est avalée.
-- Arrêter : drop trigger trg_push_booking on public.bookings; (idem pour les 3 autres)
-- ============================================================

create or replace function public.push_notify()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, vault, net
as $$
declare
  v_secret text;
begin
  select decrypted_secret into v_secret
    from vault.decrypted_secrets where name = 'campagne_cron_secret';
  if v_secret is null then
    return new;
  end if;
  perform net.http_post(
    url := 'https://neuraweb.fr/api/cron/push-event',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || v_secret),
    body := jsonb_build_object('type', tg_argv[0], 'record', to_jsonb(new)),
    timeout_milliseconds := 10000
  );
  return new;
exception when others then
  return new;
end;
$$;

revoke all on function public.push_notify() from public, anon, authenticated;

drop trigger if exists trg_push_booking on public.bookings;
create trigger trg_push_booking
  after insert on public.bookings
  for each row execute function public.push_notify('booking');

drop trigger if exists trg_push_lead on public.demo_leads;
create trigger trg_push_lead
  after insert on public.demo_leads
  for each row execute function public.push_notify('lead');

drop trigger if exists trg_push_security on public.chat_security_events;
create trigger trg_push_security
  after insert on public.chat_security_events
  for each row when (new.severity = 'high')
  execute function public.push_notify('security');

drop trigger if exists trg_push_publication on editorial.campagne_publications;
create trigger trg_push_publication
  after insert on editorial.campagne_publications
  for each row when (new.statut = 'a_valider')
  execute function public.push_notify('publication');
