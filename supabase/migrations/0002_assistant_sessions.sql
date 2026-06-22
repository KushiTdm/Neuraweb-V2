-- ============================================================
-- Historique des conversations avec le copilote IA du cockpit.
-- Une session = un fil de discussion ; les messages sont stockés en JSONB
-- (faible volume attendu, usage mono-utilisateur) plutôt que dans une table
-- de messages normalisée à part.
--
-- Dépend de la fonction public.set_updated_at() créée dans 0001_mobile_cockpit.sql.
-- ============================================================

create table if not exists public.assistant_sessions (
  id          uuid primary key default gen_random_uuid(),
  title       text not null default 'Nouvelle discussion',
  messages    jsonb not null default '[]'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists assistant_sessions_updated_idx
  on public.assistant_sessions (updated_at desc);

drop trigger if exists assistant_sessions_set_updated_at on public.assistant_sessions;
create trigger assistant_sessions_set_updated_at
  before update on public.assistant_sessions
  for each row execute function public.set_updated_at();

alter table public.assistant_sessions enable row level security;

-- Modèle mono-admin (cf. bookings/generated_social_posts) : un utilisateur
-- authentifié a un accès complet (lecture/écriture/suppression) à ses
-- propres conversations avec le copilote.
drop policy if exists "assistant_sessions_all_auth" on public.assistant_sessions;
create policy "assistant_sessions_all_auth" on public.assistant_sessions
  for all to authenticated using (true) with check (true);
