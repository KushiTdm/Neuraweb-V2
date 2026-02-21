// ============================================================
// STRUCTURED DATA FOR SEO - Schema.org JSON-LD
// CORRIGÉ : NAP cohérent, LocalBusiness actif, SearchAction retiré
// ============================================================

const BASE_URL = 'https://neuraweb.tech';

const REAL_PHONE = '+33749775654'; // ← identique à la fiche Google Business
const REAL_ADDRESS_LOCALITY = 'Paris';
const REAL_ADDRESS_REGION = 'Île-de-France';
const REAL_ADDRESS_COUNTRY = 'FR';
// Pour les coordonnées GPS exactes : https://www.google.com/maps → clic droit sur votre adresse
const GEO_LAT = '48.8566';
const GEO_LNG = '2.3522';

// ── Organization Schema ─────────────────────────────────────────────────────
// Utilisé dans layout.tsx — représente l'entreprise globalement
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'NeuraWeb',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/assets/neurawebW.webp`,
    width: 200,
    height: 60,
  },
  description:
    'Agence de développement web full-stack, intégration IA et automatisation n8n pour startups et PME.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: REAL_ADDRESS_COUNTRY,
    addressLocality: REAL_ADDRESS_LOCALITY,
    addressRegion: REAL_ADDRESS_REGION,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: REAL_PHONE,
    contactType: 'customer service',
    email: 'contact@neuraweb.tech',
    availableLanguage: ['French', 'English', 'Spanish'],
  },
  sameAs: [
    'https://www.linkedin.com/company/neuraweb',
    'https://github.com/neuraweb',
    'https://x.com/neurawebtech',
    // ⚠️ Ajoutez l'URL exacte de votre fiche Google Business ici :
    // 'https://www.google.com/maps/place/NeuraWeb/...'
  ],
  foundingDate: '2024',
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    minValue: 1,
    maxValue: 10,
  },
};

// ── LocalBusiness Schema ────────────────────────────────────────────────────
// CRITIQUE : C'est ce schema qui connecte votre site à Google Business Profile
// Il DOIT être injecté dans le layout.tsx (voir instructions ci-dessous)
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'NeuraWeb',
  description:
    'Agence digitale spécialisée en développement web sur mesure, intégration IA et automatisation n8n. Startups, PME et grandes entreprises.',
  url: BASE_URL,
  telephone: REAL_PHONE,
  email: 'contact@neuraweb.tech',
  image: `${BASE_URL}/og-image.png`,
  logo: `${BASE_URL}/assets/neurawebW.webp`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '', // ← Ajoutez votre adresse si vous en avez une
    addressLocality: REAL_ADDRESS_LOCALITY,
    addressRegion: REAL_ADDRESS_REGION,
    postalCode: '',    // ← Ajoutez votre code postal
    addressCountry: REAL_ADDRESS_COUNTRY,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: GEO_LAT,
    longitude: GEO_LNG,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  priceRange: '€€',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '11',
    bestRating: '5',
    worstRating: '1',
  },
  sameAs: [
    'https://www.linkedin.com/company/neuraweb',
    'https://x.com/neurawebtech',
    // ⚠️ L'URL de votre fiche Google Business est INDISPENSABLE ici
    // Récupérez-la depuis votre tableau de bord GBP
  ],
  parentOrganization: {
    '@id': `${BASE_URL}/#organization`,
  },
};

// ── WebSite Schema ──────────────────────────────────────────────────────────
// CORRIGÉ : SearchAction retirée car /recherche n'existe pas
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'NeuraWeb',
  url: BASE_URL,
  description:
    'Agence digitale premium spécialisée en développement web sur mesure, intégration IA et automatisation.',
  inLanguage: ['fr-FR', 'en-US', 'es-ES'],
  publisher: {
    '@id': `${BASE_URL}/#organization`,
  },
};

// ── Professional Service Schema ─────────────────────────────────────────────
export const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${BASE_URL}/#service`,
  name: 'NeuraWeb — Services Digitaux',
  description:
    'Développement web full-stack React/Next.js, intégration IA (ChatGPT, Claude), automatisation n8n et Make pour startups et PME.',
  url: BASE_URL,
  telephone: REAL_PHONE, // +33749775654 — identique fiche GBP
  email: 'contact@neuraweb.tech',
  image: `${BASE_URL}/og-image.png`,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '11',
    bestRating: '5',
    worstRating: '1',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: REAL_ADDRESS_LOCALITY,
    addressRegion: REAL_ADDRESS_REGION,
    addressCountry: REAL_ADDRESS_COUNTRY,
  },
  areaServed: [
    { '@type': 'Country', name: 'France' },
    { '@type': 'Country', name: 'Belgium' },
    { '@type': 'Country', name: 'Switzerland' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Packs NeuraWeb',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Pack Starter',
        description: 'Site vitrine responsive avec SEO optimisé',
        price: '1500',
        priceCurrency: 'EUR',
      },
      {
        '@type': 'Offer',
        name: 'Pack Business',
        description: 'Solution complète avec espace admin, blog et analytics',
        price: '3500',
        priceCurrency: 'EUR',
      },
      {
        '@type': 'Offer',
        name: 'Pack Premium',
        description: 'E-commerce, API tierces, support 24/7',
        price: '6000',
        priceCurrency: 'EUR',
      },
    ],
  },
  provider: {
    '@id': `${BASE_URL}/#organization`,
  },
};

// ── Service Schema ──────────────────────────────────────────────────────────
export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${BASE_URL}/#webdev-service`,
  serviceType: 'Web Development & AI Integration',
  provider: {
    '@id': `${BASE_URL}/#organization`,
  },
  areaServed: { '@type': 'Country', name: 'France' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services NeuraWeb',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Développement Web Full-Stack React/Next.js',
          description: "Création d'applications web modernes avec React, Next.js et TypeScript.",
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Intégration IA & LLM',
          description:
            "Intégration de solutions d'intelligence artificielle : ChatGPT, Claude, agents IA.",
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Automatisation n8n / Make',
          description: "Automatisation des workflows métier avec n8n et Make (ex-Integromat).",
        },
      },
    ],
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
        text: 'Un MVP peut être livré en 4 à 6 semaines. Un site vitrine prend généralement 2 à 4 semaines. Les projets complexes sont évalués au cas par cas lors d\'un appel découverte gratuit.',
      },
    },
    {
      '@type': 'Question',
      name: 'Proposez-vous des forfaits tout inclus ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, nous proposons 3 packs : Starter (à partir de 1 500€), Business (à partir de 3 500€), et Premium (à partir de 6 000€). Un Pack IA sur devis est aussi disponible. Chaque pack est personnalisable.',
      },
    },
    {
      '@type': 'Question',
      name: 'Intégrez-vous des solutions IA dans les sites web ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui, nous intégrons des chatbots IA, des agents conversationnels, des systèmes de recommandation et des workflows automatisés avec OpenAI (ChatGPT), Anthropic (Claude) ou des modèles open-source.",
      },
    },
    {
      '@type': 'Question',
      name: 'NeuraWeb travaille-t-elle uniquement avec des startups ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Non, nous travaillons avec des startups, des PME et des grandes entreprises. Notre approche agile s'adapte à tous les types de projets.",
      },
    },
    {
      '@type': 'Question',
      name: "Proposez-vous de l'automatisation n8n ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui, l'automatisation n8n est l'un de nos services phares. Nous concevons des workflows automatisés pour vos processus métier : emails, CRM, facturation, réseaux sociaux, et bien plus.",
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
      '@id': `${BASE_URL}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url.startsWith('http') ? article.url : `${BASE_URL}${article.url}`,
    },
    image: article.image ? `${BASE_URL}${article.image}` : `${BASE_URL}/og-image.png`,
  };
}

// ── Combine all schemas for the main pages ──────────────────────────────────
export function getAllSchemas(): Record<string, unknown>[] {
  return [organizationSchema, websiteSchema, localBusinessSchema];
}

export function getServiceSchemas(): Record<string, unknown>[] {
  return [organizationSchema, serviceSchema, professionalServiceSchema];
}