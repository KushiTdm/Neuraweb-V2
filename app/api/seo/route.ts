import { NextRequest, NextResponse } from 'next/server';
import { 
  PageSEOContext, 
  GeneratedSEO, 
  generatePageMetadata,
  generateJsonLd,
  SEO_CONTEXTS_BY_LANG,
  SEO_BOOST_KEYWORDS
} from '@/lib/seo-service';

// ============================================================
// API SEO BOOST VIA IA
// Génère dynamiquement les métadonnées SEO optimisées
// ============================================================

const AI_MODEL = 'glm-4.5-flash';
const MAX_TOKENS = 800;

// Prompt système pour la génération SEO
const SEO_PROMPTS = {
  fr: `Tu es un expert SEO spécialisé dans l'optimisation des métadonnées web. Tu dois générer des balises SEO optimisées pour les moteurs de recherche.

RÈGLES:
1. Titre: 50-60 caractères, inclure le mot-clé principal, accrocheur
2. Description: 150-160 caractères, incitative, inclure call-to-action
3. Mots-clés: 5-10 mots-clés pertinents, inclure variations et synonymes
4. Optimiser pour Google, Bing et réseaux sociaux

RÉPONSE EN JSON:
{
  "title": "Titre optimisé",
  "description": "Description optimisée",
  "keywords": ["mot1", "mot2"],
  "ogTitle": "Titre pour réseaux sociaux",
  "ogDescription": "Description pour réseaux sociaux",
  "suggestedTags": ["tag1", "tag2"]
}`,

  en: `You are an SEO expert specialized in web metadata optimization. Generate SEO-optimized tags for search engines.

RULES:
1. Title: 50-60 characters, include main keyword, compelling
2. Description: 150-160 characters, inciting, include call-to-action
3. Keywords: 5-10 relevant keywords, include variations and synonyms
4. Optimize for Google, Bing and social networks

RESPONSE IN JSON:
{
  "title": "Optimized title",
  "description": "Optimized description",
  "keywords": ["keyword1", "keyword2"],
  "ogTitle": "Social media title",
  "ogDescription": "Social media description",
  "suggestedTags": ["tag1", "tag2"]
}`,

  es: `Eres un experto SEO especializado en optimización de metadatos web. Genera etiquetas SEO optimizadas para motores de búsqueda.

REGLAS:
1. Título: 50-60 caracteres, incluir palabra clave principal, atractivo
2. Descripción: 150-160 caracteres, incitante, incluir llamada a la acción
3. Palabras clave: 5-10 palabras relevantes, incluir variaciones y sinónimos
4. Optimizar para Google, Bing y redes sociales

RESPUESTA EN JSON:
{
  "title": "Título optimizado",
  "description": "Descripción optimizada",
  "keywords": ["palabra1", "palabra2"],
  "ogTitle": "Título para redes sociales",
  "ogDescription": "Descripción para redes sociales",
  "suggestedTags": ["etiqueta1", "etiqueta2"]
}`
};

// Génère le contexte de page pour l'IA
function buildPageContextForAI(context: PageSEOContext): string {
  const langContext = SEO_CONTEXTS_BY_LANG[context.language];
  const pageContext = langContext[context.pageType];
  
  let contextStr = `
INFORMATIONS SUR LA PAGE:
- Type: ${context.pageType}
- URL: https://neuraweb.tech${context.path}
- Titre actuel: ${pageContext.title}
- Description actuelle: ${pageContext.description}
- Mots-clés actuels: ${pageContext.keywords.join(', ')}
`;

  if (context.customContext) {
    contextStr += `- Contexte personnalisé: ${context.customContext}\n`;
  }

  if (context.customKeywords && context.customKeywords.length > 0) {
    contextStr += `- Mots-clés supplémentaires: ${context.customKeywords.join(', ')}\n`;
  }

  // Ajouter les mots-clés boostés disponibles
  contextStr += `
MOTS-CLÉS DISPONIBLES POUR BOOST:
- Technique: ${SEO_BOOST_KEYWORDS.technical.join(', ')}
- Business: ${SEO_BOOST_KEYWORDS.business.join(', ')}
- IA: ${SEO_BOOST_KEYWORDS.ai.join(', ')}
- Design: ${SEO_BOOST_KEYWORDS.design.join(', ')}
- Local: ${SEO_BOOST_KEYWORDS.local.join(', ')}
`;

  return contextStr;
}

// Génère les métadonnées SEO via IA
async function generateSEOWithAI(context: PageSEOContext): Promise<GeneratedSEO> {
  const apiKey = process.env.ZAI_API_KEY;
  
  if (!apiKey) {
    console.warn('ZAI_API_KEY not set, using fallback SEO');
    return generateFallbackSEO(context);
  }

  const systemPrompt = SEO_PROMPTS[context.language];
  const pageContext = buildPageContextForAI(context);

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Génère les métadonnées SEO optimisées pour cette page:\n\n${pageContext}` }
        ],
        max_tokens: MAX_TOKENS,
        temperature: 0.3, // Plus bas pour des réponses plus cohérentes
        stream: false
      })
    });

    if (!response.ok) {
      console.error('AI SEO API error:', response.status);
      return generateFallbackSEO(context);
    }

    const completion = await response.json();
    const content = completion?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return generateFallbackSEO(context);
    }

    // Parser la réponse JSON
    try {
      // Extraire le JSON de la réponse (peut être entouré de markdown)
      let jsonStr = content;
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      } else if (content.includes('{')) {
        jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
      }

      const parsed = JSON.parse(jsonStr);

      // Valider et nettoyer les données
      const seo: GeneratedSEO = {
        title: sanitizeTitle(parsed.title, context),
        description: sanitizeDescription(parsed.description, context),
        keywords: sanitizeKeywords(parsed.keywords),
        ogTitle: sanitizeTitle(parsed.ogTitle || parsed.title, context),
        ogDescription: sanitizeDescription(parsed.ogDescription || parsed.description, context),
        jsonLd: generateJsonLd('WebPage', context),
        suggestedTags: Array.isArray(parsed.suggestedTags) ? parsed.suggestedTags.slice(0, 10) : [],
      };

      return seo;
    } catch (parseError) {
      console.error('Failed to parse AI SEO response:', parseError);
      return generateFallbackSEO(context);
    }
  } catch (error) {
    console.error('AI SEO generation error:', error);
    return generateFallbackSEO(context);
  }
}

// Génère un SEO de fallback
function generateFallbackSEO(context: PageSEOContext): GeneratedSEO {
  const langContext = SEO_CONTEXTS_BY_LANG[context.language];
  const pageContext = langContext[context.pageType];

  return {
    title: pageContext.title,
    description: pageContext.description,
    keywords: [...pageContext.keywords, ...(context.customKeywords || [])],
    ogTitle: pageContext.title,
    ogDescription: pageContext.description,
    jsonLd: generateJsonLd('WebPage', context),
    suggestedTags: Object.values(SEO_BOOST_KEYWORDS).flat().slice(0, 10),
  };
}

// Sanitize le titre
function sanitizeTitle(title: unknown, context: PageSEOContext): string {
  if (typeof title !== 'string' || !title.trim()) {
    return SEO_CONTEXTS_BY_LANG[context.language][context.pageType].title;
  }
  
  // Limiter à 60 caractères
  let sanitized = title.trim();
  if (sanitized.length > 60) {
    const lastSpace = sanitized.substring(0, 57).lastIndexOf(' ');
    sanitized = sanitized.substring(0, lastSpace > 0 ? lastSpace : 57) + '...';
  }
  
  return sanitized;
}

// Sanitize la description
function sanitizeDescription(description: unknown, context: PageSEOContext): string {
  if (typeof description !== 'string' || !description.trim()) {
    return SEO_CONTEXTS_BY_LANG[context.language][context.pageType].description;
  }
  
  // Limiter à 160 caractères
  let sanitized = description.trim();
  if (sanitized.length > 160) {
    const lastSpace = sanitized.substring(0, 157).lastIndexOf(' ');
    sanitized = sanitized.substring(0, lastSpace > 0 ? lastSpace : 157) + '...';
  }
  
  return sanitized;
}

// Sanitize les mots-clés
function sanitizeKeywords(keywords: unknown): string[] {
  if (!Array.isArray(keywords)) {
    return [];
  }
  
  return keywords
    .filter((k): k is string => typeof k === 'string')
    .map(k => k.trim().toLowerCase())
    .filter(k => k.length > 0)
    .slice(0, 15);
}

// POST /api/seo - Génère des métadonnées SEO
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      pageType, 
      language = 'fr', 
      customKeywords = [], 
      customContext,
      path = '/' 
    } = body;

    // Valider le type de page
    const validPageTypes = ['home', 'services', 'contact', 'portfolio', 'blog', 'custom'];
    if (!validPageTypes.includes(pageType)) {
      return NextResponse.json(
        { error: 'Type de page invalide' },
        { status: 400 }
      );
    }

    // Valider la langue
    const validLanguages = ['fr', 'en', 'es'];
    if (!validLanguages.includes(language)) {
      return NextResponse.json(
        { error: 'Langue invalide' },
        { status: 400 }
      );
    }

    const context: PageSEOContext = {
      pageType,
      language,
      customKeywords,
      customContext,
      path,
    };

    // Générer les métadonnées SEO via IA
    const seoData = await generateSEOWithAI(context);

    // Générer les métadonnées Next.js
    const metadata = generatePageMetadata(context, seoData);

    return NextResponse.json({
      success: true,
      seo: seoData,
      metadata,
      cached: false,
    });

  } catch (error) {
    console.error('SEO API error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération SEO' },
      { status: 500 }
    );
  }
}

// GET /api/seo - Récupère les métadonnées SEO pour une page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get('pageType') || 'home';
    const language = searchParams.get('language') || 'fr';
    const path = searchParams.get('path') || '/';

    // Valider les paramètres
    const validPageTypes = ['home', 'services', 'contact', 'portfolio', 'blog', 'custom'];
    if (!validPageTypes.includes(pageType)) {
      return NextResponse.json(
        { error: 'Type de page invalide' },
        { status: 400 }
      );
    }

    const validLanguages = ['fr', 'en', 'es'];
    if (!validLanguages.includes(language)) {
      return NextResponse.json(
        { error: 'Langue invalide' },
        { status: 400 }
      );
    }

    const context: PageSEOContext = {
      pageType: pageType as PageSEOContext['pageType'],
      language: language as PageSEOContext['language'],
      path,
    };

    // Générer les métadonnées de base (sans IA pour GET)
    const metadata = generatePageMetadata(context);

    return NextResponse.json({
      success: true,
      metadata,
      jsonLd: generateJsonLd('WebPage', context),
    });

  } catch (error) {
    console.error('SEO API error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération SEO' },
      { status: 500 }
    );
  }
}