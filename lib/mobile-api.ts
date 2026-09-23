// ============================================================
// lib/mobile-api.ts
// Utilitaires communs aux routes /api/mobile/* qui ont remplacé les
// webhooks n8n (génération de tweets, édition IA, publication Facebook,
// métriques X, backfill des articles).
//
// - ApiError : erreur métier avec un statut HTTP et un message affichable
//   tel quel dans l'app Flutter (champ `error` de la réponse).
// - routeErrorResponse : convertit ApiError / MistralError / AuthError en
//   réponse JSON normalisée `{ error }`.
// - editorialDb / publicDb : clients Supabase service-role ciblant le
//   schéma `editorial` (pipeline Claude routine) ou `public`.
//
// ⚠️ Serveur uniquement (service role → contourne la RLS).
// ============================================================

import { NextResponse } from 'next/server';
import { authErrorResponse } from '@/lib/mobile-auth';
import { MistralError } from '@/lib/mistral-mobile';
import { getServiceSupabase } from '@/lib/supabase-server';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export function routeErrorResponse(e: unknown): NextResponse {
  if (e instanceof ApiError) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  if (e instanceof MistralError) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  return authErrorResponse(e);
}

function serviceClient() {
  const client = getServiceSupabase();
  if (!client) {
    throw new ApiError(
      'Supabase non configuré côté serveur (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants).',
      503,
    );
  }
  return client;
}

/** Schéma `editorial` : contenus_generes, veille_quotidienne, metriques_posts… */
export function editorialDb() {
  return serviceClient().schema('editorial');
}

/** Schéma `public` : generated_social_posts. */
export function publicDb() {
  return serviceClient();
}
