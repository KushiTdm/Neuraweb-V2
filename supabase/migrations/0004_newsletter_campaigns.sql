-- ============================================================
-- Newsletter — campagnes d'envoi liées à un article de blog publié.
--
-- Flux : n8n crée une ligne `pending_review` juste après la publication
-- (commit GitHub + redeploy Vercel) → l'app mobile la valide (envoi
-- immédiat ou programmation jour/heure) → l'envoi réel est déclenché soit
-- par l'action mobile (immédiat), soit par le cron n8n
-- (`process-scheduled`) qui traite les campagnes `scheduled` arrivées à
-- échéance. Aucun envoi n'a lieu sans validation humaine.
-- ============================================================

create table if not exists public.newsletter_campaigns (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null,
  lang                text not null check (lang in ('fr','en','es')),
  title               text not null,
  excerpt             text,
  url                 text not null,
  image               text,
  status              text not null default 'pending_review'
                      check (status in ('pending_review','scheduled','sending','sent','failed','cancelled')),
  scheduled_at        timestamptz,
  approved_at         timestamptz,
  sent_at             timestamptz,
  total_subscribers   integer not null default 0,
  sent_count          integer not null default 0,
  failed_count        integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Évite les doublons si n8n republie/relance avant qu'une campagne
-- précédente pour le même article ait été traitée.
create unique index if not exists newsletter_campaigns_slug_lang_active_idx
  on public.newsletter_campaigns (slug, lang)
  where status in ('pending_review','scheduled','sending');

create index if not exists newsletter_campaigns_status_idx on public.newsletter_campaigns (status);
create index if not exists newsletter_campaigns_scheduled_idx
  on public.newsletter_campaigns (scheduled_at) where status = 'scheduled';
create index if not exists newsletter_campaigns_created_idx on public.newsletter_campaigns (created_at desc);

-- Réutilise public.set_updated_at(), créée dans 0001_mobile_cockpit.sql.
drop trigger if exists newsletter_campaigns_set_updated_at on public.newsletter_campaigns;
create trigger newsletter_campaigns_set_updated_at
  before update on public.newsletter_campaigns
  for each row execute function public.set_updated_at();

alter table public.newsletter_campaigns enable row level security;

-- L'app mobile lit/observe les campagnes (Realtime) mais ne les modifie
-- jamais directement : l'approbation/programmation/annulation passe par
-- les routes /api/mobile/newsletter/campaigns/[id] (service role), qui
-- déclenchent aussi l'envoi réel des emails.
drop policy if exists "newsletter_campaigns_select_auth" on public.newsletter_campaigns;
create policy "newsletter_campaigns_select_auth" on public.newsletter_campaigns
  for select to authenticated using (true);

-- Realtime : l'app mobile est notifiée dès qu'une nouvelle campagne arrive
-- (push local "nouvel article à valider").
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'newsletter_campaigns'
  ) then
    alter publication supabase_realtime add table public.newsletter_campaigns;
  end if;
end $$;
