// ============================================================
// lib/campagne-db.ts
// Accès aux tables de campagne (schéma `editorial`, migration 0009) pour les
// routes /api/mobile/campagne/*. Service role : serveur uniquement.
// ============================================================

import { ApiError, editorialDb } from '@/lib/mobile-api';

export interface CampagneRow {
  id: number;
  slug: string;
  nom: string;
  marche: string;
  plateforme: string;
  langue: string;
  statut: string;
  brief: string;
  date_debut: string;
  date_fin: string | null;
}

export interface PublicationRow {
  id: number;
  campagne_id: number;
  semaine_numero: number | null;
  date_prevue: string;
  heure_prevue: string | null;
  role: string;
  format: string;
  titre: string;
  texte_publication: string;
  traduction_fr: string | null;
  commentaire_epingle: string | null;
  texte_visuel: string | null;
  visuel_type: string;
  prompt_image: string | null;
  prompt_video: string | null;
  format_visuel: string | null;
  statut: string;
  facebook_post_id: string | null;
  permalink_url: string | null;
  date_publication: string | null;
}

export async function loadCampagne(id: number): Promise<CampagneRow> {
  const { data, error } = await editorialDb().from('campagnes').select('*').eq('id', id).maybeSingle();
  if (error) throw new ApiError(`Lecture de la campagne impossible : ${error.message}`, 502);
  if (!data) throw new ApiError('Campagne introuvable.', 404);
  return data as CampagneRow;
}

export async function loadActiveCampagnes(): Promise<CampagneRow[]> {
  const { data, error } = await editorialDb()
    .from('campagnes')
    .select('*')
    .eq('statut', 'active')
    .order('date_debut', { ascending: false });
  if (error) throw new ApiError(`Lecture des campagnes impossible : ${error.message}`, 502);
  return (data ?? []) as CampagneRow[];
}

export async function loadPublicationWithCampagne(
  id: number,
): Promise<{ publication: PublicationRow; campagne: CampagneRow }> {
  const { data, error } = await editorialDb().from('campagne_publications').select('*').eq('id', id).maybeSingle();
  if (error) throw new ApiError(`Lecture de la publication impossible : ${error.message}`, 502);
  if (!data) throw new ApiError('Publication introuvable.', 404);
  const publication = data as PublicationRow;
  const campagne = await loadCampagne(publication.campagne_id);
  return { publication, campagne };
}

/** `id` numérique strictement positif, ou erreur 400. */
export function parsePublicationId(raw: unknown): number {
  const n = Number(String(raw ?? '').trim());
  if (!Number.isInteger(n) || n <= 0) throw new ApiError('id de publication invalide.', 400);
  return n;
}

/** Violation d'unicité Postgres (post Facebook déjà rattaché à une autre publication). */
export function isUniqueViolation(error: { code?: string } | null | undefined): boolean {
  return error?.code === '23505';
}
