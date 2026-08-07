-- ============================================================
-- Autorise l'app mobile à créer des RDV manuels (source = 'manual') :
-- RDV pris par téléphone/en personne, ou créneau volontairement "simulé"
-- comme pris pour créer de la rareté sur /booking.
--
-- La table `bookings` (0001_mobile_cockpit.sql) n'avait que des policies
-- select/update pour le rôle authenticated — les écritures publiques
-- passaient uniquement par la service role key (POST /api/booking).
-- ============================================================

drop policy if exists "bookings_insert_auth" on public.bookings;
create policy "bookings_insert_auth" on public.bookings
  for insert to authenticated with check (true);
