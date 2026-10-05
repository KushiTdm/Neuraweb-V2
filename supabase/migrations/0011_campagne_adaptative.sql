-- ============================================================
-- Migration 0011 — Campagne adaptative (remise à zéro, 2026-10-05)
--
-- 1. push_tokens / push_state : notifications Firebase (app fermée).
--    Service role uniquement (aucun droit anon / authenticated).
-- 2. page_posts + page_posts_metriques (+ vue page_posts_suivi) : TOUS les
--    posts de la Page — y compris ceux publiés à la main — relevés chaque nuit.
-- 3. campagne_apprentissages : le carnet d'apprentissages de l'IA. Elle le
--    relit avant chaque génération (c'est ce qui la fait « se corriger »).
-- 4. campagne_taches : actions à mener par l'humain (Page, groupes, réponses…),
--    cochables depuis l'app.
-- 5. Colonnes supplémentaires : pilier de contenu, hypothèse testée, canal
--    (page / groupe), boost conseillé.
--
-- Idempotente (if not exists / drop policy if exists) : ré-exécutable.
-- ============================================================

-- ── 1. Push ─────────────────────────────────────────────────
create table if not exists editorial.push_tokens (
  token       text primary key,
  user_id     uuid,
  platform    text not null default 'android',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create table if not exists editorial.push_state (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);
alter table editorial.push_tokens enable row level security;
alter table editorial.push_state  enable row level security;
revoke all on editorial.push_tokens, editorial.push_state from anon, authenticated;

-- ── 2. Posts de la Page (relevé nocturne) ───────────────────
create table if not exists editorial.page_posts (
  post_id         text primary key,
  page_id         text,
  kind            text not null default 'post',
  message         text,
  permalink_url   text,
  created_time    timestamptz,
  publication_id  bigint references editorial.campagne_publications (id) on delete set null,
  first_seen      timestamptz not null default now()
);
create index if not exists page_posts_created_idx on editorial.page_posts (created_time desc);

create table if not exists editorial.page_posts_metriques (
  id                   bigint generated always as identity primary key,
  post_id              text not null references editorial.page_posts (post_id) on delete cascade,
  date_collecte        timestamptz not null default now(),
  vues                 integer,
  personnes_atteintes  integer,
  reactions            integer,
  commentaires         integer,
  partages             integer,
  clics                integer,
  vues_video           integer,
  brut                 jsonb
);
create index if not exists page_posts_metriques_post_idx
  on editorial.page_posts_metriques (post_id, date_collecte desc);

create or replace view editorial.page_posts_suivi
with (security_invoker = true) as
select
  p.post_id, p.kind, p.message, p.permalink_url, p.created_time, p.publication_id,
  m.date_collecte, m.vues, m.personnes_atteintes, m.reactions, m.commentaires,
  m.partages, m.clics, m.vues_video
from editorial.page_posts p
left join lateral (
  select * from editorial.page_posts_metriques pm
  where pm.post_id = p.post_id
  order by pm.date_collecte desc
  limit 1
) m on true;

-- ── 3. Carnet d'apprentissages ──────────────────────────────
create table if not exists editorial.campagne_apprentissages (
  id             bigint generated always as identity primary key,
  campagne_id    bigint not null references editorial.campagnes (id) on delete cascade,
  semaine_numero integer,
  pilier         text,
  hypothese      text not null,          -- ce qu'on pensait
  resultat       text,                   -- ce qui s'est passé (chiffres + date de collecte)
  enseignement   text,                   -- ce qu'on en retient
  confiance      text not null default 'faible'
                 check (confiance in ('faible', 'moyenne', 'forte')),
  regle          text,                   -- consigne actionnable pour les prochaines générations
  actif          boolean not null default true,
  confirmations  integer not null default 1,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists campagne_apprentissages_idx
  on editorial.campagne_apprentissages (campagne_id, actif, created_at desc);

-- ── 4. Actions à mener ──────────────────────────────────────
create table if not exists editorial.campagne_taches (
  id           bigint generated always as identity primary key,
  campagne_id  bigint not null references editorial.campagnes (id) on delete cascade,
  categorie    text not null default 'page'
               check (categorie in ('page', 'groupes', 'contenu', 'reponses', 'budget', 'autre')),
  titre        text not null,
  detail       text,
  ordre        integer not null default 100,
  echeance     date,
  fait         boolean not null default false,
  fait_le      timestamptz,
  genere_par   text not null default 'claude_routine'
               check (genere_par in ('claude_routine', 'app', 'humain')),
  created_at   timestamptz not null default now()
);
create index if not exists campagne_taches_idx on editorial.campagne_taches (campagne_id, fait, ordre);

-- ── 5. Colonnes supplémentaires ─────────────────────────────
alter table editorial.campagne_publications
  add column if not exists pilier           text,
  add column if not exists hypothese        text,
  add column if not exists canal            text not null default 'page',
  add column if not exists groupe_cible     text,
  add column if not exists boost_recommande boolean not null default false,
  add column if not exists boost_budget_usd numeric(6, 2),
  add column if not exists boost_note       text,
  add column if not exists boost_fait       boolean not null default false;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'campagne_publications_canal_check') then
    alter table editorial.campagne_publications
      add constraint campagne_publications_canal_check check (canal in ('page', 'groupe'));
  end if;
end $$;

alter table editorial.campagne_semaines
  add column if not exists experience        text,
  add column if not exists pilier_teste      text,
  add column if not exists budget_boost_usd  numeric(6, 2);

-- Vue de suivi : colonnes ajoutées EN FIN (create or replace l'impose).
create or replace view editorial.campagne_suivi
with (security_invoker = true) as
select
  p.id as publication_id, p.campagne_id, p.semaine_numero, p.date_prevue, p.heure_prevue,
  p.role, p.format, p.titre, p.statut, p.date_publication, p.facebook_post_id,
  m.date_collecte, m.vues, m.personnes_atteintes, m.reactions, m.commentaires,
  m.partages, m.clics, m.vues_video, m.commentaires_conformes, m.commentaires_sans_reponse,
  p.pilier, p.hypothese, p.canal, p.boost_recommande, p.boost_fait
from editorial.campagne_publications p
left join lateral (
  select * from editorial.campagne_metriques cm
  where cm.publication_id = p.id
  order by cm.date_collecte desc
  limit 1
) m on true;

-- ── 6. Droits ───────────────────────────────────────────────
alter table editorial.page_posts               enable row level security;
alter table editorial.page_posts_metriques     enable row level security;
alter table editorial.campagne_apprentissages  enable row level security;
alter table editorial.campagne_taches          enable row level security;

revoke all on editorial.page_posts, editorial.page_posts_metriques,
              editorial.campagne_apprentissages, editorial.campagne_taches from anon;

drop policy if exists "authenticated read" on editorial.page_posts;
create policy "authenticated read" on editorial.page_posts for select to authenticated using (true);
drop policy if exists "authenticated read" on editorial.page_posts_metriques;
create policy "authenticated read" on editorial.page_posts_metriques for select to authenticated using (true);
drop policy if exists "authenticated read" on editorial.campagne_apprentissages;
create policy "authenticated read" on editorial.campagne_apprentissages for select to authenticated using (true);
drop policy if exists "authenticated read" on editorial.campagne_taches;
create policy "authenticated read" on editorial.campagne_taches for select to authenticated using (true);

-- L'app coche / décoche une tâche et en ajoute à la main.
drop policy if exists "authenticated update" on editorial.campagne_taches;
create policy "authenticated update" on editorial.campagne_taches
  for update to authenticated using (true) with check (true);
drop policy if exists "authenticated insert" on editorial.campagne_taches;
create policy "authenticated insert" on editorial.campagne_taches
  for insert to authenticated with check (genere_par = 'humain' or genere_par = 'app');

grant usage on schema editorial to authenticated;
grant select on editorial.page_posts, editorial.page_posts_metriques,
                editorial.campagne_apprentissages, editorial.campagne_taches,
                editorial.page_posts_suivi, editorial.campagne_suivi to authenticated;
grant update, insert on editorial.campagne_taches to authenticated;

-- Realtime : les tâches cochées sur un appareil apparaissent sur l'autre.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'editorial' and tablename = 'campagne_taches'
  ) then
    alter publication supabase_realtime add table editorial.campagne_taches;
  end if;
end $$;
