// ============================================================
// lib/mobile-auth.ts
// Garde d'authentification pour les routes /api/mobile/*.
//
// L'app Flutter envoie son access token Supabase dans l'en-tête
//   Authorization: Bearer <jwt>
// On le valide via supabase.auth.getUser(jwt). Les routes mobiles
// sont réservées à l'admin de l'agence (un seul compte authentifié).
// ============================================================

import { NextResponse, type NextRequest } from 'next/server';
import { createClient, type User } from '@supabase/supabase-js';

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

function bearer(req: NextRequest): string | null {
  const h = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!h) return null;
  const [scheme, token] = h.split(' ');
  return scheme?.toLowerCase() === 'bearer' && token ? token.trim() : null;
}

/**
 * Vérifie le JWT Supabase de la requête. Renvoie l'utilisateur ou lève
 * une AuthError (401/503). Utilise l'URL + anon key publiques pour valider.
 */
export async function requireUser(req: NextRequest): Promise<User> {
  const token = bearer(req);
  if (!token) throw new AuthError('Token manquant (Authorization: Bearer …).');

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new AuthError('Supabase non configuré côté serveur.', 503);

  const supabase = createClient(url, anon, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) throw new AuthError('Session invalide ou expirée.');
  return data.user;
}

/** Convertit une AuthError (ou autre) en réponse JSON normalisée. */
export function authErrorResponse(e: unknown): NextResponse {
  if (e instanceof AuthError) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  console.error('[mobile-auth] erreur inattendue:', e);
  return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
}
