-- ============================================================
-- Newsletter — abonnés au footer du site (actualités / nouveaux articles).
--
-- Opt-in simple (pas de double opt-in) : l'inscription est immédiate, un
-- email de bienvenue contenant le lien de désinscription est envoyé tout
-- de suite. RLS : aucune policy pour anon/authenticated — seule la
-- SERVICE ROLE KEY (routes serveur) peut lire/écrire cette table, qui
-- contient des emails (PII).
-- ============================================================

create table if not exists public.newsletter_subscribers (
  id                  uuid primary key default gen_random_uuid(),
  email               text not null unique,
  language            text not null default 'fr' check (language in ('fr','en','es')),
  status              text not null default 'subscribed'
                      check (status in ('subscribed','unsubscribed')),
  unsubscribe_token   text not null unique,
  source              text not null default 'footer',
  subscribed_at       timestamptz not null default now(),
  unsubscribed_at     timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists newsletter_subscribers_status_lang_idx
  on public.newsletter_subscribers (status, language);

drop trigger if exists newsletter_subscribers_set_updated_at on public.newsletter_subscribers;
create trigger newsletter_subscribers_set_updated_at
  before update on public.newsletter_subscribers
  for each row execute function public.set_updated_at();

alter table public.newsletter_subscribers enable row level security;
-- Aucune policy : table accessible uniquement via la service role key
-- (routes /api/newsletter/*), jamais depuis l'app mobile ni le client web.
