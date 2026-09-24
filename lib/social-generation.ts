// ============================================================
// lib/social-generation.ts
// Générations IA (Mistral) de l'app mobile — portage des anciens workflows
// n8n `Generation_Tweets_IA`, `Edition_IA_v2` et `Backfill_contenu_social_v2`,
// plus la génération de prompts visuels (Gemini / ChatGPT).
//
// Aucune écriture en base ici : les fonctions renvoient des propositions,
// les routes décident quoi persister.
// ============================================================

import { mistralChat } from '@/lib/mistral-mobile';
import { NEURAWEB_BRAND } from '@/lib/neuraweb-context';
import { ApiError } from '@/lib/mobile-api';
import {
  CONTENT_MODEL,
  TWEET_MAX,
  TWEET_TARGET,
  parseLooseJson,
  stripMarkdown,
  stripQuotes,
  tweetLength,
} from '@/lib/social-text';

/** JSON de l'IA illisible → erreur 502 explicite (au lieu d'un « Erreur serveur » générique). */
function parseJson<T = unknown>(raw: string, label: string): T {
  try {
    return parseLooseJson<T>(raw, label);
  } catch {
    throw new ApiError("Réponse de l'IA illisible (JSON invalide) — réessaie.", 502);
  }
}

// ── Types ───────────────────────────────────────────────────

export interface TweetProposal {
  contenu: string;
  sujet: string;
  angle: string;
  hashtags: string[];
}

interface VeilleRow {
  date_veille: string;
  grok_brut?: unknown;
  gemini_brut?: unknown;
  perplexity_brut?: unknown;
  reddit_brut?: unknown;
}

// ── Tweets depuis la veille ─────────────────────────────────

/**
 * Condense chaque source (schémas différents et verbeux) en une ligne par
 * sujet : titre + angle. Divise le prompt par ~10 par rapport au JSON brut.
 */
function condenseVeille(items: unknown): string {
  if (items == null) return '';
  if (!Array.isArray(items)) return JSON.stringify(items).slice(0, 1000);
  return items
    .slice(0, 6)
    .map((raw, i) => {
      if (typeof raw === 'string') return `${i + 1}. ${raw.slice(0, 200)}`;
      const it = (raw ?? {}) as Record<string, unknown>;
      const str = (v: unknown) => (typeof v === 'string' ? v : '');
      const title = str(it.titre_sujet) || str(it.sujet) || str(it.requete_exacte) || str(it.title);
      const detail =
        str(it.angle_agence_ia_france) ||
        str(it.exemple_angle_neuraweb) ||
        str(it.opportunite) ||
        str(it.snippet_ideal) ||
        str(it.pertinence_aujourd_hui);
      const line = `${title}${detail ? ' — ' + detail : ''}`.trim().slice(0, 220);
      return `${i + 1}. ${line || JSON.stringify(it).slice(0, 200)}`;
    })
    .join('\n');
}

function shapeTweets(list: unknown[]): TweetProposal[] {
  const contentOf = (t: Record<string, unknown>) =>
    t.contenu ?? t.tweet ?? t.texte ?? t.text ?? t.content ?? t.message ?? '';
  return list
    .map((raw) => {
      const t = (raw ?? {}) as Record<string, unknown>;
      return {
        contenu: String(contentOf(t)).trim(),
        sujet: String(t.sujet ?? t.sujet_tweet ?? '').trim(),
        angle: String(t.angle ?? '').trim(),
        hashtags: Array.isArray(t.hashtags)
          ? t.hashtags.map((h) => String(h).trim()).filter(Boolean)
          : [],
      };
    })
    .filter((t) => t.contenu);
}

/** Tolère les variations de schéma que Mistral peut produire malgré la consigne. */
function extractTweetList(parsed: unknown): unknown[] {
  if (Array.isArray(parsed)) return parsed;
  const p = (parsed ?? {}) as { tweets?: unknown; result?: { tweets?: unknown } };
  if (Array.isArray(p.tweets)) return p.tweets;
  const nested = p.result?.tweets;
  if (Array.isArray(nested)) return nested;
  return [];
}

async function shortenTweetProposals(tweets: TweetProposal[]): Promise<TweetProposal[]> {
  const raw = await mistralChat(
    [
      {
        role: 'user',
        content:
          `Réécris ces tweets pour que CHACUN fasse ${TWEET_TARGET} caractères maximum, sans perdre le message ni le ton, ` +
          `en gardant le même nombre de tweets, le même ordre, et les mêmes champs sujet/angle/hashtags. ` +
          `Tweets actuels (JSON) : ${JSON.stringify(tweets)}. ` +
          `Réponds STRICTEMENT en JSON : {"tweets":[{"contenu":"...","sujet":"...","angle":"...","hashtags":["..."]}]}`,
      },
    ],
    { model: CONTENT_MODEL, temperature: 0.4, json: true, maxTokens: 1800 },
  );
  return shapeTweets(extractTweetList(parseJson(raw, 'correction')));
}

/**
 * Propose 5 tweets ≤ 260 car. depuis la veille la plus récente ≤ `today`.
 * Contrat métier : ce qui est collé un jour J sert à la génération de J+1
 * (voir `veilleTargetDate()` côté app) → on lit `date_veille <= aujourd'hui`,
 * avec repli sur une veille plus ancienne (`isStale`).
 */
export async function generateTweetsFromVeille(
  row: VeilleRow | undefined,
  today: string,
): Promise<{ tweets: TweetProposal[]; veilleDate: string; isStale: boolean }> {
  if (!row) {
    throw new ApiError(
      "Aucune veille disponible (ni aujourd'hui ni avant) — colle-la depuis l'app (Social · X · Veille) avant de générer des tweets.",
      404,
    );
  }
  const isStale = row.date_veille !== today;

  const sources: [string, unknown][] = [
    ['grok', row.grok_brut],
    ['gemini', row.gemini_brut],
    ['perplexity', row.perplexity_brut],
    ['reddit', row.reddit_brut],
  ];
  const present = sources.filter(([, v]) => v != null);
  if (present.length === 0) {
    throw new ApiError(
      `La veille du ${row.date_veille} existe mais aucune source (Grok/Gemini/Perplexity/Reddit) n'est renseignée.`,
      404,
    );
  }

  const bloc = present.map(([name, v]) => `--- ${name} ---\n${condenseVeille(v)}`).join('\n\n');

  const prompt =
    `Tu es responsable des réseaux sociaux chez NeuraWeb, agence IA française pour PME (automatisation, sites web, agents IA). ` +
    `À partir de la veille du jour ci-dessous (plusieurs sources, une ligne = un sujet), rédige 5 tweets COURTS et autonomes pour X, en français.\n\n` +
    `RÈGLES STRICTES :\n` +
    `- Chaque tweet fait ${TWEET_TARGET} caractères MAXIMUM (limite dure du compte gratuit : ${TWEET_MAX}).\n` +
    `- Un tweet = une idée complète, jamais de thread, jamais de "1/5".\n` +
    `- Ton direct, concret, orienté PME françaises. Pas de jargon creux, pas d'emoji en excès (0 ou 1 max).\n` +
    `- Varie les angles entre les 5 tweets (pas 5 fois le même sujet).\n` +
    `- hashtags : 0 à 2 par tweet, pertinents, sans les inventer si aucun n'est naturel.\n` +
    `- N'invente AUCUN chiffre, pourcentage, montant, nom ni fait qui ne figure pas dans la veille.\n\n` +
    (isStale
      ? `Note : cette veille date du ${row.date_veille} (pas d'aujourd'hui) — reste factuel, évite les tournures "aujourd'hui"/"ce matin".\n\n`
      : '') +
    `=== VEILLE (condensée) ===\n${bloc}\n=== FIN VEILLE ===\n\n` +
    `Réponds STRICTEMENT avec ce JSON (rien d'autre, pas de markdown, pas de \`\`\`) :\n` +
    `{"tweets":[{"contenu":"...","sujet":"...","angle":"...","hashtags":["..."]}]}`;

  const raw = await mistralChat([{ role: 'user', content: prompt }], {
    model: CONTENT_MODEL,
    temperature: 0.8,
    json: true,
    maxTokens: 1800,
  });
  if (!raw) throw new ApiError("Mistral n'a renvoyé aucun contenu.", 502);

  let tweets = shapeTweets(extractTweetList(parseJson(raw, 'Mistral')));
  if (tweets.length === 0) {
    throw new ApiError(`Mistral n'a proposé aucun tweet exploitable — réponse : ${raw.slice(0, 200)}`, 502);
  }

  if (tweets.some((t) => tweetLength(t.contenu) > 275)) {
    tweets = await shortenTweetProposals(tweets);
  }
  // Ceux qui dépassent encore après correction sont écartés plutôt que de
  // faire échouer toute la génération (la publication est manuelle de toute façon).
  tweets = tweets.filter((t) => tweetLength(t.contenu) <= TWEET_MAX);
  if (tweets.length === 0) {
    throw new ApiError('Tous les tweets dépassent 280 caractères après correction — relance la génération.', 502);
  }

  return { tweets, veilleDate: row.date_veille, isStale };
}

// ── Édition IA d'un texte ───────────────────────────────────

export interface RefineInput {
  platform: string;
  field: string;
  lang: string;
  current: string;
  instruction: string;
  title: string;
  excerpt: string;
}

const LANG_LABELS: Record<string, string> = { fr: 'français', en: 'English', es: 'español' };

function refineRules(platform: string, field: string): string {
  if (platform === 'x') {
    return `Il s'agit d'un tweet (élément d'un thread X). LIMITE ABSOLUE : ${TWEET_MAX} caractères, vise ${TWEET_TARGET} maximum (une URL compte pour 23 caractères). Conserve les URLs présentes. 2 hashtags maximum. Ton direct et percutant.`;
  }
  if (platform === 'linkedin') {
    return field === 'hook'
      ? `Il s'agit de l'accroche d'un post LinkedIn : 1 à 2 phrases percutantes.`
      : `Il s'agit d'un post LinkedIn : 300 à 500 mots, ton expert, structure aérée, question d'ouverture, CTA final.`;
  }
  return field === 'hook'
    ? `Il s'agit de l'accroche d'un post Facebook : 1 phrase courte et percutante.`
    : `Il s'agit d'un post Facebook : 120 à 180 mots, ton professionnel accessible PME, CTA clair, 4 hashtags maximum.`;
}

/** Réécrit `current` selon `instruction` ; pour un tweet, garantit ≤ 280 (auto-raccourcissement). */
export async function refineText(input: RefineInput): Promise<string> {
  const platform = input.platform.toLowerCase();
  const field = input.field.toLowerCase();
  const langLabel = LANG_LABELS[input.lang.toLowerCase()] ?? 'français';

  const prompt =
    `Tu es responsable marketing chez NeuraWeb (agence web + IA pour PME françaises).\n` +
    `Révise le texte ci-dessous en ${langLabel}, selon l'instruction de l'utilisateur.\n` +
    `${refineRules(platform, field)}\n\n` +
    (input.title ? `Contexte — sujet : ${input.title}\n` : '') +
    (input.excerpt ? `Contexte additionnel : ${input.excerpt}\n` : '') +
    `\nTEXTE ACTUEL :\n${input.current}\n\n` +
    `INSTRUCTION : ${input.instruction}\n\n` +
    `Texte brut uniquement : pas de markdown (pas de **gras**, pas de titres). N'invente aucun chiffre, nom ni fait absent du texte d'origine, ` +
    `et ne change pas le sens au-delà de l'instruction.\n` +
    `Réponds UNIQUEMENT avec le texte révisé, sans guillemets, sans préambule, sans commentaire.`;

  const raw = await mistralChat([{ role: 'user', content: prompt }], {
    model: CONTENT_MODEL,
    temperature: 0.6,
    maxTokens: 1400,
  });
  let revised = stripMarkdown(stripQuotes(raw));
  if (!revised) throw new ApiError("Le service IA n'a renvoyé aucun texte.", 502);

  if (platform === 'x' && tweetLength(revised) > TWEET_MAX) {
    const shorter = stripQuotes(
      await mistralChat(
        [
          {
            role: 'user',
            content: `Raccourcis ce tweet à ${TWEET_TARGET} caractères maximum (une URL compte pour 23 caractères), sans perdre le message ni les URLs. Réponds uniquement avec le tweet, sans guillemets : ${revised}`,
          },
        ],
        { model: CONTENT_MODEL, temperature: 0.4, maxTokens: 400 },
      ),
    );
    if (!shorter || tweetLength(shorter) > TWEET_MAX) {
      throw new ApiError('Tweet toujours > 280 caractères après correction — reformule manuellement.', 422);
    }
    revised = shorter;
  }
  return revised;
}

// ── Prompt visuel (Gemini / ChatGPT) ────────────────────────

/**
 * Prompt prêt à coller dans Gemini ou ChatGPT pour générer le visuel d'un
 * post. L'app n'appelle jamais de générateur d'image : l'humain génère
 * l'image lui-même puis l'ajoute au post (upload dans l'app ou à la main).
 */
export async function generateImagePrompt(input: {
  text: string;
  sujet?: string;
  platform?: string;
}): Promise<string> {
  const platform = input.platform?.trim() || 'Facebook';
  // Format d'image conseillé par plateforme : X affiche en 16:9, Facebook en 1,91:1.
  const format =
    platform.toLowerCase() === 'x'
      ? 'paysage 1200×675 (ratio 16:9)'
      : 'paysage 1200×630 (ratio 1,91:1)';
  const system =
    `Tu écris des prompts pour des générateurs d'images IA (Gemini, ChatGPT). ` +
    `On te donne le texte d'un post ${platform} de l'agence NeuraWeb (pour un thread : l'ensemble du thread, ` +
    `le visuel accompagne le premier tweet) ; tu produis UN SEUL prompt, prêt à coller, qui décrit un visuel d'accompagnement.\n\n` +
    `RÈGLES :\n` +
    `- Rédige le prompt en français, 100 mots MAXIMUM (idéalement 70 à 90), en un seul paragraphe (pas de liste, pas de titre).\n` +
    `- Décris : le sujet/la scène principale, la composition, le style, l'ambiance, la lumière.\n` +
    `- Aucun texte, logo, lettre ni chiffre dans l'image (les générateurs les rendent mal) : ne décris donc aucun libellé, statut ni chiffre affiché à l'écran, et précise-le à la fin.\n` +
    `- Format ${format}, sujet centré, marges de sécurité sur les bords : indique-le dans le prompt.\n` +
    `- Identité visuelle NeuraWeb : fond sombre quasi noir (#050510), dégradés indigo (#6366f1), violet (#8b5cf6) et cyan (#22d3ee), ` +
    `petites touches de rose (#f43f5e) ; ambiance studio de motion design / interface de dashboard SaaS, moderne et épurée.\n` +
    `- Le visuel doit illustrer l'idée du post (concret, PME), pas une image générique de robot ou de cerveau.\n` +
    `Texte brut : pas de markdown (pas d'astérisques), pas d'emojis, pas de guillemets autour de mots à afficher.\n` +
    `Réponds UNIQUEMENT avec le prompt, sans guillemets ni commentaire.\n\n` +
    `━━━ MARQUE ━━━\n${NEURAWEB_BRAND}`;

  const user = `${input.sujet ? `Sujet : ${input.sujet}\n\n` : ''}Texte du post :\n${input.text.slice(0, 3000)}`;
  const raw = await mistralChat(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    { model: CONTENT_MODEL, temperature: 0.7, maxTokens: 500 },
  );
  const prompt = stripMarkdown(stripQuotes(raw));
  if (!prompt) throw new ApiError("Le service IA n'a renvoyé aucun prompt.", 502);
  return prompt;
}

// ── Posts d'un article de blog (FB + LinkedIn + thread X) ───

export interface ArticlePosts {
  facebook_hook: string;
  facebook_post: string;
  linkedin_hook: string;
  linkedin_post: string;
  x_thread: string[];
}

/** Retire imports MDX et balises pour ne garder que le texte de l'article. */
export function cleanArticleBody(body: string): string {
  return body
    .replace(/import\s+.*?from\s+['"].*?['"];?/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim()
    .substring(0, 12000);
}

/**
 * Extrait les tweets d'un thread quel que soit le format renvoyé par le modèle :
 * chaînes, ou objets `{ tweet | texte | text | contenu | content | message }`
 * (les petits modèles dévient du schéma demandé — sans ça, `String(objet)`
 * écrivait « [object Object] » en base).
 */
function threadItems(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((t) => {
      if (typeof t === 'string') return t.trim();
      if (t && typeof t === 'object') {
        const o = t as Record<string, unknown>;
        const v = o.tweet ?? o.texte ?? o.text ?? o.contenu ?? o.content ?? o.message;
        return typeof v === 'string' ? v.trim() : '';
      }
      return '';
    })
    .filter(Boolean);
}

/**
 * Garantit le lien de l'article dans le thread (le dernier tweet doit porter le
 * CTA + lien) : ajouté en fin de dernier tweet si le modèle l'a oublié, ou
 * remplacé par un CTA court si le tweet est déjà trop long pour l'accueillir.
 */
function ensureArticleLink(tweets: string[], url: string): string[] {
  if (tweets.some((t) => t.includes(url))) return tweets;
  const out = [...tweets];
  const last = out[out.length - 1];
  const withLink = `${last} ${url}`;
  out[out.length - 1] = tweetLength(withLink) <= TWEET_MAX ? withLink : `Lire l'article : ${url}`;
  return out;
}

async function shortenThread(tweets: string[]): Promise<string[]> {
  const raw = await mistralChat(
    [
      {
        role: 'user',
        content:
          `Réécris ces tweets pour que CHACUN fasse ${TWEET_TARGET} caractères maximum (une URL compte pour 23 caractères), ` +
          `sans perdre le message, le lien ni le ton, en gardant le même nombre de tweets et le même ordre. ` +
          `Tweets actuels (JSON) : ${JSON.stringify(tweets)}. Réponds STRICTEMENT en JSON : {"tweets":["..."]}`,
      },
    ],
    { model: CONTENT_MODEL, temperature: 0.4, json: true, maxTokens: 1500 },
  );
  const fixed = parseJson<{ tweets?: unknown }>(raw, 'correction');
  return threadItems(fixed.tweets);
}

/**
 * Génère l'accroche + post Facebook, l'accroche + post LinkedIn et un thread X
 * (3 à 5 tweets, dernier tweet = CTA + lien) à partir d'un article.
 */
export async function generateArticlePosts(article: {
  slug: string;
  lang: 'fr' | 'en' | 'es';
  title: string;
  excerpt: string;
  body: string;
}): Promise<{ posts: ArticlePosts; articleUrl: string }> {
  const langLabel = LANG_LABELS[article.lang] ?? 'français';
  // Domaine canonique : neuraweb.fr (migration juillet 2026).
  const articleUrl = `https://neuraweb.fr/${article.lang}/blog/${article.slug}`;

  const prompt =
    `Tu es responsable marketing chez NeuraWeb (agence web + IA / automatisation pour PME).\n` +
    `À partir de l'article ci-dessous, crée des publications pour Facebook, LinkedIn et un thread X (Twitter).\n` +
    `IMPORTANT : rédige TOUT le contenu en ${langLabel} (la langue de l'article).\n\n` +
    `=== ARTICLE ===\nTitre : ${article.title}\nRésumé : ${article.excerpt}\nURL : ${articleUrl}\nContenu :\n${cleanArticleBody(article.body)}\n=== FIN ===\n\n` +
    `Ne cite que des chiffres et faits présents dans l'article. Texte brut, sans markdown.\n` +
    `Règles Facebook : 120-180 mots (compte-les, ni moins de 120), ton professionnel et accessible aux PME, un CTA clair, maximum 4 hashtags.\n` +
    `Règles LinkedIn : 300-500 mots, ton expert, structure aérée, une question d'ouverture, un CTA final.\n` +
    `Règles X (thread) : 3 à 5 tweets. Tweet 1 = accroche forte sans lien. Dernier tweet = CTA + lien vers l'article : ${articleUrl}. ` +
    `CHAQUE tweet fait ${TWEET_TARGET} caractères MAXIMUM (une URL compte pour 23 caractères) — contrainte absolue. 2 hashtags maximum sur tout le thread.\n` +
    `Le champ "hook" est une première phrase d'accroche courte et percutante.\n\n` +
    `Réponds avec un JSON STRICTEMENT conforme à ce schéma :\n` +
    `{"facebook":{"hook":"","post":""},"linkedin":{"hook":"","post":""},"x_thread":["",""]}`;

  // Le petit modèle gratuit respecte mal les longueurs demandées (Facebook à 44 mots
  // au lieu de 120-180, LinkedIn à 22 au lieu de 300-500, selon les essais) : on
  // relance jusqu'à 3 fois si les textes sont nettement trop courts et on garde le
  // meilleur essai. Budget de temps borné (routes limitées à 60 s).
  const started = Date.now();
  let best: ArticlePosts | null = null;
  let bestScore = -1;
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= ARTICLE_MAX_ATTEMPTS; attempt++) {
    try {
      const posts = await generateArticlePostsOnce(prompt, article.slug, articleUrl);
      const fb = wordCount(posts.facebook_post);
      const li = wordCount(posts.linkedin_post);
      const score = Math.min(fb, 120) + Math.min(li, 300);
      if (score > bestScore) {
        best = posts;
        bestScore = score;
      }
      if (fb >= ARTICLE_MIN_FB_WORDS && li >= ARTICLE_MIN_LI_WORDS) break;
    } catch (e) {
      lastError = e;
    }
    if (Date.now() - started > 35_000) break;
  }
  if (!best) throw lastError instanceof Error ? lastError : new ApiError('Génération impossible pour cet article.', 502);
  return { posts: best, articleUrl };
}

const ARTICLE_MAX_ATTEMPTS = 3;
/** Seuils de relance (un peu sous les cibles 120-180 / 300-500 mots). */
const ARTICLE_MIN_FB_WORDS = 100;
const ARTICLE_MIN_LI_WORDS = 250;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Une génération complète (FB + LinkedIn + thread X validé) ; lève ApiError si inexploitable. */
async function generateArticlePostsOnce(prompt: string, slug: string, articleUrl: string): Promise<ArticlePosts> {
  const raw = await mistralChat([{ role: 'user', content: prompt }], {
    model: CONTENT_MODEL,
    temperature: 0.7,
    json: true,
    maxTokens: 3500,
  });
  const social = parseJson<{
    facebook?: { hook?: string; post?: string };
    linkedin?: { hook?: string; post?: string };
    x_thread?: unknown;
  }>(raw, 'Mistral');

  let tweets = threadItems(social.x_thread);
  if (tweets.length === 0) throw new ApiError('x_thread manquant ou illisible dans la réponse Mistral.', 502);

  if (tweets.some((t) => tweetLength(t) > 275)) {
    tweets = await shortenThread(tweets);
    if (tweets.length === 0 || tweets.some((t) => tweetLength(t) > TWEET_MAX)) {
      throw new ApiError(`Thread toujours > 280 caractères après correction (${slug}).`, 502);
    }
  }

  tweets = ensureArticleLink(tweets, articleUrl);
  if (tweets.some((t) => tweetLength(t) > TWEET_MAX)) {
    throw new ApiError(`Thread toujours > 280 caractères après ajout du lien (${slug}).`, 502);
  }

  return {
    facebook_hook: stripMarkdown(social.facebook?.hook ?? ''),
    facebook_post: stripMarkdown(social.facebook?.post ?? ''),
    linkedin_hook: stripMarkdown(social.linkedin?.hook ?? ''),
    linkedin_post: stripMarkdown(social.linkedin?.post ?? ''),
    x_thread: tweets,
  };
}
