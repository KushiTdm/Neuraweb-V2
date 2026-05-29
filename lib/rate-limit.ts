// ============================================================
// LIB/RATE-LIMIT.TS
// Rate limiting + anti-spam mutualisé pour les routes API.
// Stockage en mémoire (Map module-level) : l'état est perdu à chaque
// cold start / redeploy serverless — acceptable à l'échelle actuelle,
// à remplacer par un store distribué (Upstash/Redis) si besoin.
// ============================================================

import type { NextRequest } from 'next/server';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Nombre max de requêtes autorisées dans la fenêtre. */
  max: number;
  /** Durée de la fenêtre, en millisecondes. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Secondes à attendre avant la prochaine tentative (si bloqué). */
  retryAfter?: number;
}

/** Extrait l'IP cliente derrière le proxy (Vercel/Netlify renseignent x-forwarded-for). */
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/** Fenêtre fixe par clé. Renvoie { allowed } et, si bloqué, retryAfter en secondes. */
export function rateLimit(key: string, { max, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= max) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true };
}

/** Raccourci : limite par couple route + IP cliente. */
export function rateLimitRequest(req: NextRequest, route: string, opts: RateLimitOptions): RateLimitResult {
  return rateLimit(`${route}:${getClientIp(req)}`, opts);
}

/** Validation d'email basique (format + longueur RFC). */
export function isValidEmail(email: unknown): boolean {
  return typeof email === 'string'
    && email.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Honeypot : les bots remplissent les champs cachés. On considère la soumission
 * comme spam si l'un de ces champs leurres est non vide. Sûr si le champ est absent.
 */
const HONEYPOT_FIELDS = ['_gotcha', 'website', 'company_website', 'honeypot', 'fax'];
export function isHoneypotFilled(body: Record<string, unknown> | null | undefined): boolean {
  if (!body) return false;
  return HONEYPOT_FIELDS.some((f) => typeof body[f] === 'string' && (body[f] as string).trim() !== '');
}

// Nettoyage périodique des buckets expirés (toutes les 10 min).
const cleanup = setInterval(() => {
  const now = Date.now();
  Array.from(buckets.entries()).forEach(([k, b]) => {
    if (now >= b.resetAt) buckets.delete(k);
  });
}, 10 * 60 * 1000);
// Ne pas maintenir le process actif uniquement pour ce timer.
if (typeof (cleanup as { unref?: () => void }).unref === 'function') {
  (cleanup as { unref: () => void }).unref();
}
