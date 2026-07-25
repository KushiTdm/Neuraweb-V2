// ============================================================
// LIB/CHAT-GUARD.TS
// Garde-fous du chatbot public (/api/chat) :
//   - détection de prompt injection / sondes techniques (regex FR/EN/ES)
//   - strikes hors-sujet (marqueur [HS] renvoyé par le modèle)
//   - blocage temporaire d'IP avec escalade basée sur l'historique
//     durable en base (table chat_security_events)
//   - journalisation des événements + alerte email throttlée (Resend)
//
// État en mémoire (Maps module-level) : perdu à chaque cold start —
// même limitation assumée que lib/rate-limit.ts. La table
// chat_security_events sert de mémoire durable pour l'escalade :
// une IP qui insiste re-déclenche des signaux, qui re-consultent la base.
// ============================================================

import { getServiceSupabase } from '@/lib/supabase-server';
import { sendSecurityAlertEmail } from '@/lib/email-service';

export type SecurityEventType = 'injection' | 'probe' | 'off_topic' | 'rate_limit' | 'blocked';
export type SecuritySeverity = 'low' | 'medium' | 'high';

// ────────────────────────────────────────────────────────────
// Détection — prompt injection & sondes techniques
// ────────────────────────────────────────────────────────────

function normalize(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Patterns évalués sur le message NORMALISÉ (minuscules, sans accents).
// Volontairement étroits pour éviter les faux positifs sur des questions
// commerciales légitimes ("mot de passe espace patient" ne matche pas).
const INJECTION_PATTERNS: RegExp[] = [
  // Tentatives de réécriture des consignes
  /ignore (all |your |the )?(previous |above )?(instructions|rules|prompt)/,
  /(oublie|ignore) (tes|les|toutes les) (instructions|consignes|regles)/,
  /(olvida|ignora) (tus|las) (instrucciones|reglas)/,
  /instructions? precedentes?/,
  /previous instructions/,
  // Extraction du prompt système
  /(system|systeme) ?prompt/,
  /(ton|votre|your|tu|su) prompt/,
  /(reveal|show|print|repeat|affiche|montre|repete|revele|muestra) (me )?(ton|tes|your|the|el|tu) (prompt|instructions|consignes|system|contexte)/,
  /quelles sont tes (instructions|consignes|regles)/,
  /what are your (instructions|rules)/,
  // Contournement de rôle
  /jailbreak/,
  /\bdan mode\b/,
  /developer mode/,
  /mode developpeur/,
  /(you are now|tu es maintenant|ahora eres) /,
  /(act as|pretend to be|agis comme|fais semblant d etre|haz de cuenta) /,
  /roleplay as/,
  // Pêche aux secrets
  /(your|ta|tes|votre|vos) (api ?key|cle api|token|secret|credentials)/,
  /(service ?role|env(ironment)? variable|variable d environnement)/,
  /database password/,
];

// Sondes techniques : quelqu'un teste des failles, pas un prospect.
const PROBE_PATTERNS: RegExp[] = [
  /<script[\s>]/,
  /<\?php/,
  /\bunion select\b/,
  /\bdrop table\b/,
  /select .{1,60} from .{1,60}(where|;|--)/,
  /\.\.\/\.\.\//,
  /\$\{.+\}/,
  /\{\{.+\}\}/,
  /(curl|wget) +https?:\/\//,
  /etc\/passwd/,
];

/** Renvoie le type d'abus détecté dans le message visiteur, ou null. */
export function detectAbuse(message: string): 'injection' | 'probe' | null {
  const msg = normalize(message);
  if (INJECTION_PATTERNS.some((p) => p.test(msg))) return 'injection';
  if (PROBE_PATTERNS.some((p) => p.test(msg))) return 'probe';
  return null;
}

// ────────────────────────────────────────────────────────────
// Strikes hors-sujet (par IP — le troll peut changer de sessionId)
// ────────────────────────────────────────────────────────────

const STRIKE_TTL_MS = 30 * 60 * 1000;
const offTopicStrikes = new Map<string, { count: number; expiresAt: number }>();

/** Incrémente et renvoie le nombre de strikes hors-sujet de l'IP (fenêtre 30 min). */
export function registerOffTopicStrike(ip: string): number {
  const now = Date.now();
  const entry = offTopicStrikes.get(ip);
  if (!entry || now >= entry.expiresAt) {
    offTopicStrikes.set(ip, { count: 1, expiresAt: now + STRIKE_TTL_MS });
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

export function getOffTopicStrikes(ip: string): number {
  const entry = offTopicStrikes.get(ip);
  if (!entry || Date.now() >= entry.expiresAt) return 0;
  return entry.count;
}

// ────────────────────────────────────────────────────────────
// Blocage temporaire d'IP
// ────────────────────────────────────────────────────────────

const blockedIps = new Map<string, number>(); // ip → timestamp de fin de blocage

export function blockIp(ip: string, minutes: number): void {
  blockedIps.set(ip, Date.now() + minutes * 60 * 1000);
}

export function isIpBlocked(ip: string): boolean {
  const until = blockedIps.get(ip);
  if (!until) return false;
  if (Date.now() >= until) {
    blockedIps.delete(ip);
    return false;
  }
  return true;
}

/**
 * Escalade durable : compte les événements de sécurité de cette IP sur la
 * dernière heure (en base, survit aux cold starts). À partir de 3, blocage
 * 60 min. N'est appelée QUE sur signal suspect — jamais sur le chemin normal.
 */
export async function shouldEscalateToBlock(ip: string): Promise<boolean> {
  const supabase = getServiceSupabase();
  if (!supabase) return false;
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from('chat_security_events')
    .select('id', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', oneHourAgo);
  if (error || count === null) return false;
  return count >= 3;
}

// ────────────────────────────────────────────────────────────
// Journalisation + alerte email throttlée
// ────────────────────────────────────────────────────────────

const ALERT_THROTTLE_MS = 30 * 60 * 1000; // 1 email max par IP+type / 30 min
const GLOBAL_ALERT_CAP = 10; // plafond global d'emails / heure (anti mail-bombing)
const alertThrottle = new Map<string, number>();
let globalAlertWindow = { resetAt: 0, count: 0 };

function canSendAlert(key: string): boolean {
  const now = Date.now();
  if (now >= globalAlertWindow.resetAt) {
    globalAlertWindow = { resetAt: now + 60 * 60 * 1000, count: 0 };
  }
  if (globalAlertWindow.count >= GLOBAL_ALERT_CAP) return false;
  const last = alertThrottle.get(key);
  if (last && now - last < ALERT_THROTTLE_MS) return false;
  alertThrottle.set(key, now);
  globalAlertWindow.count += 1;
  return true;
}

// Dédoublonnage des inserts en base pour les événements répétitifs
// (rate_limit notamment) : 1 ligne par IP+type / 10 min.
const DB_LOG_THROTTLE_MS = 10 * 60 * 1000;
const dbLogThrottle = new Map<string, number>();

function canLogToDb(key: string): boolean {
  const now = Date.now();
  const last = dbLogThrottle.get(key);
  if (last && now - last < DB_LOG_THROTTLE_MS) return false;
  dbLogThrottle.set(key, now);
  return true;
}

export interface SecurityEvent {
  ip: string;
  sessionId: string;
  lang: string;
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  userMessage?: string;
  details?: string;
}

/**
 * Journalise un événement de sécurité (fire-and-forget, ne bloque jamais la
 * réponse au visiteur) : insert dans chat_security_events — l'app mobile est
 * notifiée via Realtime — et, si severity 'high', email d'alerte throttlé.
 */
export function reportSecurityEvent(event: SecurityEvent): void {
  const dedupeKey = `${event.ip}:${event.eventType}`;

  // Les événements répétitifs (rate_limit) ne créent pas une ligne par requête.
  if (event.eventType === 'rate_limit' && !canLogToDb(dedupeKey)) return;

  const supabase = getServiceSupabase();
  if (supabase) {
    void supabase
      .from('chat_security_events')
      .insert({
        ip: event.ip,
        session_id: event.sessionId,
        lang: event.lang,
        event_type: event.eventType,
        severity: event.severity,
        user_message: event.userMessage?.slice(0, 500) ?? null,
        details: event.details?.slice(0, 500) ?? null,
      })
      .then(({ error }) => {
        if (error) console.warn('[chat_security_events] insert warning:', error.message);
      });
  }

  if (event.severity === 'high' && canSendAlert(dedupeKey)) {
    void sendSecurityAlertEmail({
      eventType: event.eventType,
      ip: event.ip,
      sessionId: event.sessionId,
      lang: event.lang,
      userMessage: event.userMessage,
      details: event.details,
    }).catch((err) => console.warn('[chat-guard] alert email failed:', err?.message));
  }
}

// ────────────────────────────────────────────────────────────
// Nettoyage périodique des Maps (mêmes conventions que rate-limit.ts)
// ────────────────────────────────────────────────────────────

const cleanup = setInterval(() => {
  const now = Date.now();
  Array.from(offTopicStrikes.entries()).forEach(([k, v]) => {
    if (now >= v.expiresAt) offTopicStrikes.delete(k);
  });
  Array.from(blockedIps.entries()).forEach(([k, until]) => {
    if (now >= until) blockedIps.delete(k);
  });
  Array.from(alertThrottle.entries()).forEach(([k, t]) => {
    if (now - t >= ALERT_THROTTLE_MS) alertThrottle.delete(k);
  });
  Array.from(dbLogThrottle.entries()).forEach(([k, t]) => {
    if (now - t >= DB_LOG_THROTTLE_MS) dbLogThrottle.delete(k);
  });
}, 10 * 60 * 1000);
if (typeof (cleanup as { unref?: () => void }).unref === 'function') {
  (cleanup as { unref: () => void }).unref();
}
