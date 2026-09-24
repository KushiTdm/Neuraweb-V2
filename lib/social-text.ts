// ============================================================
// lib/social-text.ts
// Helpers texte partagés par les routes sociales de l'app mobile.
// ============================================================

/**
 * Modèle Mistral utilisé pour rédiger. Par défaut `ministral-3b-latest`, comme le
 * reste de l'app : `mistral-small-latest` renvoie 429 (« Rate limit exceeded »)
 * sur la clé gratuite — c'est pour ça que le chatbot et la route mobile avaient
 * été basculés dessus le 2026-09-09. Surchargeable via `MISTRAL_MODEL_CONTENT`
 * (ex. `mistral-small-latest` si le quota le permet, pour une meilleure rédaction).
 */
export const CONTENT_MODEL = process.env.MISTRAL_MODEL_CONTENT || 'ministral-3b-latest';

/** Limite dure d'un tweet (compte gratuit). */
export const TWEET_MAX = 280;

/** Cible de rédaction : marge de sécurité sous la limite dure. */
export const TWEET_TARGET = 260;

/**
 * Longueur d'un tweet façon X : toute URL compte pour 23 caractères (t.co),
 * les caractères sont comptés par point de code.
 */
export function tweetLength(text: string): number {
  let len = 0;
  let last = 0;
  const re = /https?:\/\/\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    len += [...text.slice(last, m.index)].length + 23;
    last = m.index + m[0].length;
  }
  return len + [...text.slice(last)].length;
}

/** Retire les clôtures ```json … ``` que certains modèles ajoutent malgré la consigne. */
export function stripFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/, '')
    .trim();
}

/** Retire les guillemets englobants d'une réponse « texte seul ». */
export function stripQuotes(text: string): string {
  const t = stripFences(text);
  return /^".*"$/s.test(t) ? t.slice(1, -1).trim() : t;
}

/**
 * Retire le markdown d'emphase que les petits modèles ajoutent malgré la consigne
 * (**gras**, *italique*, `code`, titres `# `) : les textes sont collés tels quels
 * dans X / Facebook / Gemini. Les hashtags (`#mot`, sans espace) sont conservés.
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/gs, '$1')
    .replace(/(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])/gs, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .trim();
}

/** Parse un JSON renvoyé par un LLM ; l'erreur embarque un extrait pour le diagnostic. */
export function parseLooseJson<T = unknown>(raw: string, label: string): T {
  const cleaned = stripFences(raw);
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(`JSON ${label} invalide : ${cleaned.slice(0, 300)}`);
  }
}

/** Date du jour (YYYY-MM-DD) à Paris — cohérent avec la saisie de la veille dans l'app. */
export function parisDate(d: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/** Numéro de semaine ISO-8601 (cohérent avec le schéma `metriques_posts`). */
export function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
