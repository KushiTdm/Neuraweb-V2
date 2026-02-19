// ============================================================
// SERVICE SEO AUTOMATISÉ VIA IA
// Génère dynamiquement les métadonnées optimisées pour chaque page
// ============================================================

import { Metadata } from 'next';

// Types pour le service SEO
export interface SEOTemplate {
  titleTemplate: string;
  descriptionTemplate: string;
  keywords: string[];
  ogImage?: string;
}

export type PageType = 'home' | 'services' | 'contact' | 'portfolio' | 'blog' | 'custom';
export type Language = 'fr' | 'en' | 'es';

export interface PageSEOContext {
  pageType: PageType;
  language: Language;
  customKeywords?: string[];
  customContext?: string;
  path: string;
}

export interface GeneratedSEO {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  jsonLd: Record<string, unknown>;
  suggestedTags: string[];
}

// Cache pour les métadonnées générées
const seoCache = new Map<string, { data: GeneratedSEO; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 heure

// Type pour le contexte de page SEO
interface PageSEOConfig {
  title: string;
  description: string;
  keywords: string[];
}

// Contextes SEO multilingues
const SEO_CONTEXTS_BY_LANG: Record<Language, Record<PageType, PageSEOConfig>> = {
  fr: {
    home: {
      title: 'NeuraWeb — Agence Web, IA & Automatisation',
      description: 'Agence digitale premium spécialisée en développement web sur mesure, intégration IA et automatisation. Transformez votre vision en solutions digitales innovantes.',
      keywords: ['agence web', 'développement web', 'intégration IA', 'automatisation', 'Next.js', 'React', 'marketing digital'],
    },
    services: {
      title: 'Services - Solutions Web Sur Mesure | NeuraWeb',
      description: 'Découvrez nos services de développement web, intégration IA et automatisation. Packs adaptés à vos besoins.',
      keywords: ['services web', 'développement web', 'intégration IA', 'automatisation', 'tarifs web'],
    },
    contact: {
      title: 'Contact - Parlons de votre projet | NeuraWeb',
      description: 'Contactez notre équipe pour discuter de votre projet. Réponse sous 24h, devis gratuit.',
      keywords: ['contact', 'devis gratuit', 'projet web'],
    },
    portfolio: {
      title: 'Portfolio - Nos Réalisations | NeuraWeb',
      description: 'Découvrez nos projets web, applications et solutions IA. Portfolio de réalisations pour nos clients.',
      keywords: ['portfolio', 'réalisations', 'projets web', 'cas client'],
    },
    blog: {
      title: 'Blog - Actualités & Conseils | NeuraWeb',
      description: 'Articles et conseils sur le développement web, l\'IA et l\'automatisation. Restez informé des dernières tendances.',
      keywords: ['blog', 'articles', 'conseils web', 'tutoriels'],
    },
    custom: {
      title: 'NeuraWeb — Agence Web & IA',
      description: 'Solutions web innovantes et automatisation intelligente pour votre entreprise.',
      keywords: ['neuraweb', 'agence web', 'digital'],
    },
  },
  en: {
    home: {
      title: 'NeuraWeb — Web Agency, AI & Automation',
      description: 'Premium digital agency specialized in custom web development, AI integration and automation. Transform your vision into innovative digital solutions.',
      keywords: ['web agency', 'web development', 'AI integration', 'automation', 'Next.js', 'React', 'digital marketing'],
    },
    services: {
      title: 'Services - Custom Web Solutions | NeuraWeb',
      description: 'Discover our web development, AI integration and automation services. Packages tailored to your needs.',
      keywords: ['web services', 'web development', 'AI integration', 'automation', 'web pricing'],
    },
    contact: {
      title: 'Contact - Let\'s talk about your project | NeuraWeb',
      description: 'Contact our team to discuss your project. Response within 24h, free quote.',
      keywords: ['contact', 'free quote', 'web project'],
    },
    portfolio: {
      title: 'Portfolio - Our Work | NeuraWeb',
      description: 'Discover our web projects, applications and AI solutions. Client portfolio showcase.',
      keywords: ['portfolio', 'work', 'web projects', 'case studies'],
    },
    blog: {
      title: 'Blog - News & Tips | NeuraWeb',
      description: 'Articles and tips on web development, AI and automation. Stay informed about latest trends.',
      keywords: ['blog', 'articles', 'web tips', 'tutorials'],
    },
    custom: {
      title: 'NeuraWeb — Web & AI Agency',
      description: 'Innovative web solutions and intelligent automation for your business.',
      keywords: ['neuraweb', 'web agency', 'digital'],
    },
  },
  es: {
    home: {
      title: 'NeuraWeb — Agencia Web, IA & Automatización',
      description: 'Agencia digital premium especializada en desarrollo web personalizado, integración IA y automatización. Transforma tu visión en soluciones digitales innovadoras.',
      keywords: ['agencia web', 'desarrollo web', 'integración IA', 'automatización', 'Next.js', 'React', 'marketing digital'],
    },
    services: {
      title: 'Servicios - Soluciones Web a Medida | NeuraWeb',
      description: 'Descubre nuestros servicios de desarrollo web, integración IA y automatización. Paquetes adaptados a tus necesidades.',
      keywords: ['servicios web', 'desarrollo web', 'integración IA', 'automatización', 'precios web'],
    },
    contact: {
      title: 'Contacto - Hablemos de tu proyecto | NeuraWeb',
      description: 'Contacta con nuestro equipo para discutir tu proyecto. Respuesta en 24h, presupuesto gratis.',
      keywords: ['contacto', 'presupuesto gratis', 'proyecto web'],
    },
    portfolio: {
      title: 'Portafolio - Nuestros Proyectos | NeuraWeb',
      description: 'Descubre nuestros proyectos web, aplicaciones y soluciones IA. Portafolio de clientes.',
      keywords: ['portafolio', 'proyectos', 'proyectos web', 'casos de clientes'],
    },
    blog: {
      title: 'Blog - Noticias y Consejos | NeuraWeb',
      description: 'Artículos y consejos sobre desarrollo web, IA y automatización. Mantente informado de las últimas tendencias.',
      keywords: ['blog', 'artículos', 'consejos web', 'tutoriales'],
    },
    custom: {
      title: 'NeuraWeb — Agencia Web & IA',
      description: 'Soluciones web innovadoras y automatización inteligente para tu empresa.',
      keywords: ['neuraweb', 'agencia web', 'digital'],
    },
  },
};

// Mots-clés SEO boostés par catégorie
const SEO_BOOST_KEYWORDS = {
  technical: ['Next.js', 'React', 'TypeScript', 'Node.js', 'API REST', 'GraphQL', 'SSR', 'SSG'],
  business: ['transformation digitale', 'croissance', 'ROI', 'conversion', 'leads', 'ventes'],
  ai: ['intelligence artificielle', 'machine learning', 'chatbot', 'automatisation', 'GPT', 'IA générative'],
  design: ['UX/UI', 'responsive', 'accessibilité', 'design moderne', 'interface utilisateur'],
  local: ['Paris', 'France', 'agence française', 'freelance France', 'agence Île-de-France'],
};

// Helper pour obtenir le contexte SEO d'une page
function getPageSEOContext(context: PageSEOContext): PageSEOConfig {
  const langContext = SEO_CONTEXTS_BY_LANG[context.language];
  return langContext[context.pageType] || langContext.home;
}

// Génère un JSON-LD optimisé
export function generateJsonLd(
  type: 'Organization' | 'Service' | 'ProfessionalService' | 'WebPage',
  context: PageSEOContext,
  additionalData?: Record<string, unknown>
): Record<string, unknown> {
  const baseUrl = 'https://neuraweb.tech';
  const pageContext = getPageSEOContext(context);
  
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  const organizationSchema = {
    ...baseSchema,
    name: 'NeuraWeb',
    url: baseUrl,
    logo: `${baseUrl}/assets/neurawebW.webp`,
    description: SEO_CONTEXTS_BY_LANG[context.language].home.description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
      addressLocality: 'Paris',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@neuraweb.tech',
      contactType: 'customer service',
      availableLanguage: ['French', 'English', 'Spanish'],
    },
    sameAs: [
      'https://twitter.com/neuraweb',
      'https://linkedin.com/company/neuraweb',
    ],
    ...additionalData,
  };

  const serviceSchema = {
    ...baseSchema,
    name: 'Services de Développement Web NeuraWeb',
    provider: {
      '@type': 'Organization',
      name: 'NeuraWeb',
      url: baseUrl,
    },
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Packs de développement web',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pack Starter',
            description: 'Solution idéale pour démarrer votre présence en ligne',
            offers: {
              '@type': 'Offer',
              price: '1500',
              priceCurrency: 'EUR',
            },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pack Business',
            description: 'Solution complète pour entreprises en croissance',
            offers: {
              '@type': 'Offer',
              price: '3500',
              priceCurrency: 'EUR',
            },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pack Premium',
            description: 'Solution premium pour projets ambitieux',
            offers: {
              '@type': 'Offer',
              price: '6000',
              priceCurrency: 'EUR',
            },
          },
        },
      ],
    },
    ...additionalData,
  };

  const webPageSchema = {
    ...baseSchema,
    name: pageContext.title,
    description: pageContext.description,
    url: `${baseUrl}${context.path}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'NeuraWeb',
      url: baseUrl,
    },
    ...additionalData,
  };

  switch (type) {
    case 'Organization':
      return organizationSchema;
    case 'Service':
    case 'ProfessionalService':
      return serviceSchema;
    case 'WebPage':
    default:
      return webPageSchema;
  }
}

// Génère les métadonnées SEO complètes
export function generatePageMetadata(
  context: PageSEOContext,
  customData?: Partial<GeneratedSEO>
): Metadata {
  const pageContext = getPageSEOContext(context);

  // Fusionner avec les données personnalisées
  const title = customData?.title || pageContext.title;
  const description = customData?.description || pageContext.description;
  const keywords = [...(pageContext.keywords || []), ...(context.customKeywords || [])];

  // Générer les mots-clés boostés
  const boostedKeywords = generateBoostedKeywords(context);

  const baseUrl = 'https://neuraweb.tech';
  const pageUrl = `${baseUrl}${context.path}`;

  // Convertir le Set en tableau avec Array.from
  const uniqueKeywords = Array.from(new Set([...keywords, ...boostedKeywords]));

  return {
    title,
    description,
    keywords: uniqueKeywords,
    authors: [{ name: 'NeuraWeb' }],
    creator: 'NeuraWeb',
    openGraph: {
      type: 'website',
      locale: context.language === 'fr' ? 'fr_FR' : context.language === 'en' ? 'en_US' : 'es_ES',
      url: pageUrl,
      siteName: 'NeuraWeb',
      title: customData?.ogTitle || title,
      description: customData?.ogDescription || description,
      images: [
        {
          url: customData?.ogImage || '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${title} - NeuraWeb`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: customData?.ogTitle || title,
      description: customData?.ogDescription || description,
      images: [customData?.ogImage || '/og-image.png'],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        'fr-FR': `${baseUrl}/fr${context.path}`,
        'en-US': `${baseUrl}/en${context.path}`,
        'es-ES': `${baseUrl}/es${context.path}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Génère des mots-clés boostés selon le contexte
function generateBoostedKeywords(context: PageSEOContext): string[] {
  const keywords: string[] = [];

  // Ajouter les mots-clés techniques
  keywords.push(...SEO_BOOST_KEYWORDS.technical.slice(0, 3));

  // Ajouter selon le type de page
  if (context.pageType === 'services') {
    keywords.push(...SEO_BOOST_KEYWORDS.business);
    keywords.push(...SEO_BOOST_KEYWORDS.ai);
  }

  if (context.pageType === 'home') {
    keywords.push(...SEO_BOOST_KEYWORDS.local);
  }

  // Ajouter les mots-clés personnalisés
  if (context.customKeywords) {
    keywords.push(...context.customKeywords);
  }

  return keywords;
}

// Optimise un titre pour le SEO
export function optimizeTitle(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) return title;

  // Tronquer intelligemment au dernier espace
  const truncated = title.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated.substring(0, maxLength - 3) + '...';
}

// Optimise une description pour le SEO
export function optimizeDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;

  // Tronquer intelligemment
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated.substring(0, maxLength - 3) + '...';
}

// Génère les balises meta dynamiques
export function generateMetaTags(
  context: PageSEOContext,
  customData?: Partial<GeneratedSEO>
): Array<{ name: string; content: string }> {
  const pageContext = getPageSEOContext(context);

  const tags: Array<{ name: string; content: string }> = [
    { name: 'description', content: customData?.description || pageContext.description },
    { name: 'keywords', content: [...(pageContext.keywords || []), ...(context.customKeywords || [])].join(', ') },
    { name: 'author', content: 'NeuraWeb' },
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    { name: 'googlebot', content: 'index, follow' },
    { name: 'language', content: context.language === 'fr' ? 'French' : context.language === 'en' ? 'English' : 'Spanish' },
    { name: 'revisit-after', content: '7 days' },
    { name: 'generator', content: 'Next.js with NeuraWeb SEO Boost' },
  ];

  // Tags Open Graph
  tags.push(
    { name: 'og:title', content: customData?.ogTitle || customData?.title || pageContext.title },
    { name: 'og:description', content: customData?.ogDescription || customData?.description || pageContext.description },
    { name: 'og:type', content: 'website' },
    { name: 'og:site_name', content: 'NeuraWeb' },
    { name: 'og:locale', content: context.language === 'fr' ? 'fr_FR' : context.language === 'en' ? 'en_US' : 'es_ES' },
  );

  // Tags Twitter
  tags.push(
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: customData?.ogTitle || customData?.title || pageContext.title },
    { name: 'twitter:description', content: customData?.ogDescription || customData?.description || pageContext.description },
  );

  return tags;
}

// Récupère ou génère les données SEO (avec cache)
export async function getSEOData(
  context: PageSEOContext,
  aiGenerator?: (ctx: PageSEOContext) => Promise<GeneratedSEO>
): Promise<GeneratedSEO> {
  const cacheKey = `${context.pageType}-${context.language}-${context.path}`;
  const cached = seoCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Si un générateur IA est fourni, l'utiliser
  if (aiGenerator) {
    try {
      const generated = await aiGenerator(context);
      seoCache.set(cacheKey, { data: generated, timestamp: Date.now() });
      return generated;
    } catch (error) {
      console.error('AI SEO generation failed, using fallback:', error);
    }
  }

  // Fallback vers les données par défaut
  const pageContext = getPageSEOContext(context);

  const defaultSEO: GeneratedSEO = {
    title: pageContext.title,
    description: pageContext.description,
    keywords: pageContext.keywords || [],
    ogTitle: pageContext.title,
    ogDescription: pageContext.description,
    jsonLd: generateJsonLd('WebPage', context),
    suggestedTags: generateBoostedKeywords(context),
  };

  seoCache.set(cacheKey, { data: defaultSEO, timestamp: Date.now() });
  return defaultSEO;
}

// Exporte les configurations par défaut
export { SEO_CONTEXTS_BY_LANG, SEO_BOOST_KEYWORDS };