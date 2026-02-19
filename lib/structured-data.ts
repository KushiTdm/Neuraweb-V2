// ============================================================
// STRUCTURED DATA FOR SEO - Schema.org JSON-LD
// Rich snippets pour Google et autres moteurs de recherche
// ============================================================

const BASE_URL = 'https://neuraweb.tech';

// ── Organization Schema ─────────────────────────────────────────────────────
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NeuraWeb',
  url: BASE_URL,
  logo: `${BASE_URL}/assets/neurawebW.webp`,
  description: 'Agence de développement web full-stack, intégration IA et automatisation n8n pour startups.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'Paris',
  },
  sameAs: [
    'https://www.linkedin.com/company/neuraweb',
    'https://github.com/neuraweb',
    'https://twitter.com/neuraweb',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'contact@neuraweb.tech',
    availableLanguage: ['French', 'English', 'Spanish'],
  },
  foundingDate: '2024',
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    minValue: 1,
    maxValue: 10,
  },
};

// ── Service Schema ──────────────────────────────────────────────────────────
export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Web Development & AI Integration',
  provider: {
    '@type': 'Organization',
    name: 'NeuraWeb',
    url: BASE_URL,
  },
  areaServed: {
    '@type': 'Country',
    name: 'France',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services NeuraWeb',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Développement Web Full-Stack React/Next.js',
          description: 'Création d\'applications web modernes avec React, Next.js et TypeScript.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Intégration IA & LLM',
          description: 'Intégration de solutions d\'intelligence artificielle et de modèles de langage.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Automatisation n8n / Make',
          description: 'Automatisation des workflows métier avec n8n et Make (ex-Integromat).',
        },
      },
    ],
  },
};

// ── Professional Service Schema (pour l'agence) ─────────────────────────────
export const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'NeuraWeb',
  description: 'Agence digitale premium spécialisée en développement web sur mesure, intégration IA et automatisation.',
  url: BASE_URL,
  logo: `${BASE_URL}/assets/neurawebW.webp`,
  image: `${BASE_URL}/og-image.png`,
  telephone: '+33 1 23 45 67 89',
  email: 'contact@neuraweb.tech',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'Paris',
  },
  priceRange: '€€',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '47',
    bestRating: '5',
    worstRating: '1',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  sameAs: [
    'https://www.linkedin.com/company/neuraweb',
    'https://github.com/neuraweb',
    'https://twitter.com/neuraweb',
  ],
};

// ── WebSite Schema ──────────────────────────────────────────────────────────
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NeuraWeb',
  url: BASE_URL,
  description: 'Agence digitale premium spécialisée en développement web sur mesure, intégration IA et automatisation.',
  publisher: {
    '@type': 'Organization',
    name: 'NeuraWeb',
    url: BASE_URL,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/recherche?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// ── FAQ Schema ──────────────────────────────────────────────────────────────
export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quels sont les délais pour un projet web ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Un MVP peut être livré en 4 à 6 semaines. Un site vitrine prend généralement 2 à 4 semaines. Les projets complexes sont évalués au cas par cas.',
      },
    },
    {
      '@type': 'Question',
      name: 'Proposez-vous des forfaits tout inclus ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, nous proposons 3 packs : MVP Sprint (à partir de 4500€), AI Integration (à partir de 2800€), et Automation Pack (à partir de 1800€). Chaque pack est personnalisable selon vos besoins.',
      },
    },
    {
      '@type': 'Question',
      name: 'Intégrez-vous des solutions IA ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolument ! Nous intégrons des chatbots IA, des agents conversationnels, des systèmes de recommandation, et des workflows automatisés avec OpenAI, Claude, ou des modèles open-source.',
      },
    },
    {
      '@type': 'Question',
      name: 'Travaillez-vous uniquement avec des startups ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Non, nous travaillons avec des startups, des PME et des grandes entreprises. Notre approche agile s\'adapte à tous les types de projets et de structures.',
      },
    },
  ],
};

// ── Breadcrumb Schema Generator ─────────────────────────────────────────────
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

// ── Article Schema Generator ────────────────────────────────────────────────
export function generateArticleSchema(article: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
  image?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': article.author ? 'Person' : 'Organization',
      name: article.author || 'NeuraWeb',
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'NeuraWeb',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/assets/neurawebW.webp`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url.startsWith('http') ? article.url : `${BASE_URL}${article.url}`,
    },
    image: article.image ? `${BASE_URL}${article.image}` : `${BASE_URL}/og-image.png`,
  };
}

// ── Local Business Schema ───────────────────────────────────────────────────
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${BASE_URL}/#business`,
  name: 'NeuraWeb',
  description: 'Agence digitale spécialisée développement web, IA et automatisation.',
  url: BASE_URL,
  telephone: '+33 1 23 45 67 89',
  email: 'contact@neuraweb.tech',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'Paris',
    addressRegion: 'Île-de-France',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '48.8566',
    longitude: '2.3522',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  priceRange: '€€',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '47',
  },
};

// ── Combine all schemas for the main pages ──────────────────────────────────
export function getAllSchemas(): Record<string, unknown>[] {
  return [
    organizationSchema,
    websiteSchema,
    professionalServiceSchema,
  ];
}

// ── Service-specific schemas ────────────────────────────────────────────────
export function getServiceSchemas(): Record<string, unknown>[] {
  return [
    organizationSchema,
    serviceSchema,
  ];
}