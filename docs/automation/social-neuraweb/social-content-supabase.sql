-- Table de stockage des publications sociales générées (LinkedIn / Facebook)
-- à partir des articles de blog. Une ligne par (slug, lang).
-- À exécuter dans Supabase > SQL Editor.

create table if not exists public.generated_social_posts (
  id            uuid primary key default gen_random_uuid(),

  slug          text not null,
  lang          text not null default 'fr' check (lang in ('fr', 'en', 'es')),

  title         text,
  image         text,

  facebook_hook text,
  facebook_post text,

  linkedin_hook text,
  linkedin_post text,

  -- pending -> approved -> published | rejected
  status        text not null default 'pending'
                check (status in ('pending', 'approved', 'published', 'rejected')),

  source_path   text,   -- ex. project/content/blog/agents-ia.mdx
  source_commit text,   -- SHA du commit qui a déclenché la génération

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- Un seul jeu de contenus par article et par langue : permet l'upsert idempotent
  -- (la GitHub Action peut renvoyer le même article sans créer de doublon).
  unique (slug, lang)
);

create index if not exists generated_social_posts_status_idx
  on public.generated_social_posts (status);

-- Tient updated_at à jour à chaque modification.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_generated_social_posts_updated_at on public.generated_social_posts;
create trigger trg_generated_social_posts_updated_at
  before update on public.generated_social_posts
  for each row execute function public.set_updated_at();

-- RLS : on garde la table fermée. n8n écrit avec la SERVICE ROLE key (bypass RLS).
-- Si une UI d'admin lit cette table côté client avec l'anon key, ajouter une policy select dédiée.
alter table public.generated_social_posts enable row level security;
