// ============================================================
// LIB/SEO-AI-SERVER.TS
// Génération SEO via IA CÔTÉ SERVEUR uniquement
// À utiliser dans generateMetadata() des pages — jamais côté client
// ============================================================

import {
  PageSEOContext,
  GeneratedSEO,
  SEO_CONTEXTS_BY_LANG,
  SEO_BOOST_KEYWORDS,
  generateJsonLd,
} from './seo-service';

const AI_MODEL = 'glm-3-turbo';
const MAX_TOKENS = 600;
// Cache en mémoire serveur (survivra entre requêtes en production)
const serverCache = new Map<string, { data: GeneratedSEO; timestamp: number }>();
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 heures

// ── Prompt SEO par langue ────────────────────────────────────────────────────
const SYSTEM_PROMPTS: Record<string, string> = {
  fr: `Tu es un expert SEO. Génère des métadonnées SEO optimisées pour une agence web française.
Réponds UNIQUEMENT en JSON valide, sans markdown ni explication.
Format exact :
{"title":"...","description":"...","keywords":["..."],"ogTitle":"...","ogDescription":"..."}

Règles strictes :
- title : 50-60 caractères, mot-clé principal au début, inclure "NeuraWeb"
- description : 140-155 caractères, verbe d'action, chiffre si possible, CTA
- keywords : 6-8 mots-clés longue traîne français
- ogTitle : peut être légèrement différent du title, plus accrocheur
- ogDescription : 100-125 caractères, orienté conversion`,

  en: `You are an SEO expert. Generate optimized SEO metadata for a French web agency.
Reply ONLY in valid JSON, no markdown, no explanation.
Exact format:
{"title":"...","description":"...","keywords":["..."],"ogTitle":"...","ogDescription":"..."}

Strict rules:
- title: 50-60 chars, main keyword first, include "NeuraWeb"
- description: 140-155 chars, action verb, number if possible, CTA
- keywords: 6-8 English long-tail keywords
- ogTitle: slightly different from title, more engaging
- ogDescription: 100-125 chars, conversion-focused`,

  es: `Eres un experto SEO. Genera metadatos SEO optimizados para una agencia web francesa.
Responde ÚNICAMENTE en JSON válido, sin markdown ni explicación.
Formato exacto:
{"title":"...","description":"...","keywords":["..."],"ogTitle":"...","ogDescription":"..."}

Reglas estrictas:
- title: 50-60 caracteres, palabra clave principal primero, incluir "NeuraWeb"
- description: 140-155 caracteres, verbo de acción, número si posible, CTA
- keywords: 6-8 palabras clave long-tail en español
- ogTitle: ligeramente diferente del title, más atractivo
- ogDescription: 100-125 caracteres, orientado a conversión`,
};

// ── Contexte enrichi pour l'IA ───────────────────────────────────────────────
function buildRichContext(context: PageSEOContext): string {
  const langCtx = SEO_CONTEXTS_BY_LANG[context.language];
  const pageCtx = langCtx[context.pageType];

  // Sélectionner les boost keywords pertinents pour la page
  const relevantBoosts: string[] = [];
  if (context.pageType === 'home') {
    relevantBoosts.push(...SEO_BOOST_KEYWORDS.local.slice(0, 4));
    relevantBoosts.push(...SEO_BOOST_KEYWORDS.mobile.slice(0, 3));
    relevantBoosts.push(...SEO_BOOST_KEYWORDS.technical.slice(0, 2));
  }
  if (context.pageType === 'services') {
    relevantBoosts.push(...SEO_BOOST_KEYWORDS.services.slice(0, 3));
    relevantBoosts.push(...SEO_BOOST_KEYWORDS.mobile.slice(0, 3));
    relevantBoosts.push(...SEO_BOOST_KEYWORDS.ai.slice(0, 2));
    relevantBoosts.push(...SEO_BOOST_KEYWORDS.business.slice(0, 2));
  }
  if (context.pageType === 'blog') {
    relevantBoosts.push(...SEO_BOOST_KEYWORDS.technical.slice(0, 4));
    relevantBoosts.push(...SEO_BOOST_KEYWORDS.ai.slice(0, 4));
  }
  if (context.pageType === 'contact') {
    relevantBoosts.push(...SEO_BOOST_KEYWORDS.local.slice(0, 3));
    relevantBoosts.push(...SEO_BOOST_KEYWORDS.services.slice(0, 3));
  }

  return `CONTEXTE DE LA PAGE :
- Type : ${context.pageType}
- Langue : ${context.language}
- URL : https://neuraweb.tech${context.path}
- Titre actuel : ${pageCtx.title}
- Description actuelle : ${pageCtx.description}
- Mots-clés actuels : ${pageCtx.keywords.join(', ')}

ENTREPRISE :
- Nom : NeuraWeb
- Services : Développement web Next.js/React, Intégration IA (ChatGPT/Claude), Automatisation n8n
- Cible : Startups, PME, entrepreneurs français
- Localisation : Lille, France (clients internationaux)
- Prix : À partir de 1 500€
- Délais : 2-8 semaines selon le projet
- Points forts : 16 avis 5 étoiles, réponse sous 24h, devis gratuit
${context.customContext ? `- Contexte additionnel : ${context.customContext}` : ''}

MOTS-CLÉS PRIORITAIRES À UTILISER :
${relevantBoosts.join(', ')}
${context.customKeywords?.length ? `\nMOTS-CLÉS FOURNIS : ${context.customKeywords.join(', ')}` : ''}

Génère des métadonnées MEILLEURES que les actuelles, plus précises et plus orientées conversion.`;
}

// ── Appel IA ─────────────────────────────────────────────────────────────────
async function callAI(context: PageSEOContext): Promise<GeneratedSEO | null> {
  const apiKey = process.env.ZAI_API_KEY;
  if (!apiKey) return null;

  // Skip en dev : Next.js dev ignore revalidate → chaque refresh déclenche un appel bloquant.
  // En prod/ISR, l'appel tourne en arrière-plan et n'est jamais visible.
  if (process.env.NODE_ENV === 'development') return null;

  // Skip pendant le build : 40+ appels parallèles saturent le quota Z.AI.
  if (process.env.NEXT_PHASE === 'phase-production-build') return null;

  try {
    // ✅ Endpoint api.z.ai (international) — moins de latence depuis l'Europe que open.bigmodel.cn (Chine)
    const response = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS[context.language] || SYSTEM_PROMPTS.fr },
          { role: 'user', content: buildRichContext(context) },
        ],
        max_tokens: MAX_TOKENS,
        temperature: 0.2,
        stream: false,
      }),
      // 25s timeout — avec ISR, ce call tourne en arrière-plan, jamais bloquant pour l'utilisateur
      signal: AbortSignal.timeout(25000),
    });

    if (!response.ok) {
      console.warn(`[SEO-AI] API error ${response.status} for ${context.path}`);
      return null;
    }

    const completion = await response.json();
    const raw = completion?.choices?.[0]?.message?.content?.trim();
    if (!raw) return null;

    // Extraire le JSON (parfois l'IA ajoute du texte autour)
    let jsonStr = raw;
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) jsonStr = match[0];

    const parsed = JSON.parse(jsonStr);

    // Validation et nettoyage
    const title = typeof parsed.title === 'string' && parsed.title.length >= 20
      ? parsed.title.substring(0, 65)
      : null;
    const description = typeof parsed.description === 'string' && parsed.description.length >= 80
      ? parsed.description.substring(0, 165)
      : null;

    if (!title || !description) return null;

    return {
      title,
      description,
      keywords: Array.isArray(parsed.keywords)
        ? parsed.keywords.filter((k: unknown) => typeof k === 'string').slice(0, 12)
        : [],
      ogTitle: typeof parsed.ogTitle === 'string' ? parsed.ogTitle.substring(0, 70) : title,
      ogDescription: typeof parsed.ogDescription === 'string'
        ? parsed.ogDescription.substring(0, 130)
        : description,
      jsonLd: generateJsonLd('WebPage', context),
      suggestedTags: [],
    };
  } catch (err) {
    console.warn(`[SEO-AI] Fallback to static SEO for ${context.path}:`, (err as Error).message);
    return null;
  }
}

// ── Fallback statique enrichi ─────────────────────────────────────────────────
function buildFallbackSEO(context: PageSEOContext): GeneratedSEO {
  // Defensive : si lang ou pageType inconnus (ex: requête /sw.js routée comme [lang]=sw.js),
  // on retombe sur fr/home pour ne pas crasher la chaîne generateMetadata.
  const langCtx = SEO_CONTEXTS_BY_LANG[context.language] ?? SEO_CONTEXTS_BY_LANG.fr;
  const pageCtx = langCtx[context.pageType] ?? langCtx.home;

  // Pour les articles de blog : extraire le vrai titre depuis customContext
  // Format : 'Article de blog intitulé "Titre". Résumé : ...'
  let title = pageCtx.title;
  let description = pageCtx.description;

  if (context.pageType === 'blog' && context.customContext) {
    const titleMatch = context.customContext.match(/intitulé "([^"]+)"/);
    const summaryMatch = context.customContext.match(/Résumé : (.+)$/s);
    if (context.seoTitle) {
      title = `${context.seoTitle} | NeuraWeb`;
    } else if (titleMatch?.[1]) {
      const suffix = ' | NeuraWeb';
      const maxRaw = 65 - suffix.length;
      const raw = titleMatch[1];
      const trimmed = raw.length > maxRaw
        ? raw.substring(0, raw.lastIndexOf(' ', maxRaw) || maxRaw)
        : raw;
      title = `${trimmed}${suffix}`;
    }
    if (summaryMatch?.[1]) {
      description = summaryMatch[1].substring(0, 160);
    }
  }

  // Mots-clés enrichis avec boost keywords pertinents
  const boostedKeywords = [
    ...pageCtx.keywords,
    ...(context.customKeywords || []),
    ...SEO_BOOST_KEYWORDS.local.slice(0, 2),
    ...SEO_BOOST_KEYWORDS.technical.slice(0, 2),
  ];

  return {
    title,
    description,
    keywords: Array.from(new Set(boostedKeywords)),
    ogTitle: title,
    ogDescription: description,
    jsonLd: generateJsonLd('WebPage', context),
    suggestedTags: [],
  };
}

// ── Export principal : à appeler dans generateMetadata() ─────────────────────
/**
 * Génère des métadonnées SEO optimisées via IA (avec fallback statique).
 *
 * USAGE dans une page Next.js :
 * ```ts
 * export async function generateMetadata({ params }) {
 *   const seo = await generateAISEO({ pageType: 'services', language: params.lang, path: '/fr/services' });
 *   return {
 *     title: seo.title,
 *     description: seo.description,
 *     keywords: seo.keywords,
 *     openGraph: { title: seo.ogTitle, description: seo.ogDescription, ... }
 *   };
 * }
 * ```
 */
export async function generateAISEO(context: PageSEOContext): Promise<GeneratedSEO> {
  // ✅ CORRIGÉ : cache key inclut le path pour éviter les collisions entre pages de même type
  // (ex: deux pages 'blog' de langues différentes ne partagent plus le même cache)
  const cacheKey = `${context.pageType}-${context.language}-${context.path}`;
  const cached = serverCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Tenter la génération IA
  const aiResult = await callAI(context);
  const result = aiResult ?? buildFallbackSEO(context);

  serverCache.set(cacheKey, { data: result, timestamp: Date.now() });
  return result;
}

// ── Export pour les articles de blog (contexte enrichi) ──────────────────────
export async function generateBlogPostAISEO(params: {
  lang: string;
  title: string;
  seoTitle?: string;
  excerpt: string;
  tags: string[];
  slug: string;
}): Promise<GeneratedSEO> {
  const seoHint = params.seoTitle ? ` Titre SEO court : "${params.seoTitle}".` : '';
  return generateAISEO({
    pageType: 'blog',
    language: (params.lang as 'fr' | 'en' | 'es') || 'fr',
    path: `/${params.lang}/blog/${params.slug}`,
    customContext: `Article de blog intitulé "${params.title}".${seoHint} Résumé : ${params.excerpt.substring(0, 200)}`,
    customKeywords: params.tags,
    seoTitle: params.seoTitle,
  });
}