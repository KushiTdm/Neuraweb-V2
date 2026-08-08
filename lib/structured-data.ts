// ============================================================
// STRUCTURED DATA FOR SEO - Schema.org JSON-LD
// ✅ CORRIGÉ :
//   - URL og-image → /assets/og-image.png
//   - Champs adresse vides supprimés (streetAddress, postalCode)
//     → des champs vides invalident le LocalBusiness schema pour Google
//   - URL Google Maps dans sameAs : remplace par l'URL réelle de ta fiche GBP
//     (la précédente contenait des coordonnées GPS erronées : océan Pacifique)
// ============================================================

const BASE_URL = 'https://neuraweb.fr';

const REAL_PHONE = '+33749775654'; // identique à la fiche Google Business
const REAL_ADDRESS_LOCALITY = 'Lille';
const REAL_ADDRESS_REGION = 'Hauts-de-France';
const REAL_ADDRESS_COUNTRY = 'FR';
const GEO_LAT = '50.6292';
const GEO_LNG = '3.0573';

const OG_IMAGE = `${BASE_URL}/assets/og-image.png`;

// ── Organization Schema ─────────────────────────────────────────────────────
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
    // ✅ CORRIGÉ : streetAddress et postalCode supprimés — champs vides invalident le schema
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: REAL_PHONE,
    contactType: 'customer service',
    email: 'contact@neuraweb.fr',
    availableLanguage: ['French', 'English', 'Spanish', 'Vietnamese'],
  },
  // Zone d'intervention — signal GEO / citation LLM. Volontairement global
  // (toutes langues) : une requête « agence web à Hanoï » peut être posée en
  // français ou en anglais, la citation par un LLM n'est pas filtrée par langue.
  areaServed: [
    { '@type': 'Country', name: 'France' },
    { '@type': 'AdministrativeArea', name: 'Hauts-de-France' },
    { '@type': 'Country', name: 'Vietnam' },
    { '@type': 'City', name: 'Hanoï' },
  ],
  sameAs: [
    'https://www.linkedin.com/company/neuraweb',
    'https://github.com/neuraweb',
    'https://x.com/neurawebtech',
    'https://www.facebook.com/people/Neuraweb/61587416320627/',
    'https://maps.app.goo.gl/DUkC3mSovCR8cpRz5', // Google Business Profile
  ],
  foundingDate: '2024',
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    minValue: 1,
    maxValue: 10,
  },
};

// ── LocalBusiness Schema ────────────────────────────────────────────────────
// CRITIQUE : connecte ton site à Google Business Profile
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'NeuraWeb',
  description:
    'Agence digitale spécialisée en développement web sur mesure, intégration IA et automatisation n8n. Startups, PME et grandes entreprises.',
  url: BASE_URL,
  telephone: REAL_PHONE,
  email: 'contact@neuraweb.fr',
  image: OG_IMAGE,
  logo: `${BASE_URL}/assets/neurawebW.webp`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: REAL_ADDRESS_LOCALITY,
    addressRegion: REAL_ADDRESS_REGION,
    addressCountry: REAL_ADDRESS_COUNTRY,
    // ✅ CORRIGÉ : streetAddress et postalCode supprimés — mieux vaut ne pas les mettre
    // que de les laisser vides (Google peut pénaliser les champs vides dans LocalBusiness)
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
  areaServed: [
    { '@type': 'City', name: 'Paris' },
    { '@type': 'City', name: 'Lille' },
    { '@type': 'City', name: 'Lyon' },
    { '@type': 'City', name: 'Marseille' },
    { '@type': 'City', name: 'Bordeaux' },
    { '@type': 'City', name: 'Toulouse' },
    { '@type': 'AdministrativeArea', name: 'Île-de-France' },
    { '@type': 'AdministrativeArea', name: 'Hauts-de-France' },
    { '@type': 'Country', name: 'France' },
    { '@type': 'Country', name: 'Belgium' },
    { '@type': 'Country', name: 'Switzerland' },
    // Implantation Hanoï — signal GEO global (cf. organizationSchema)
    { '@type': 'Country', name: 'Vietnam' },
    { '@type': 'City', name: 'Hanoï' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 5,
    reviewCount: 16,
    bestRating: 5,
    worstRating: 1,
  },
  sameAs: [
    'https://www.linkedin.com/company/neuraweb',
    'https://x.com/neurawebtech',
    'https://www.facebook.com/people/Neuraweb/61587416320627/',
    'https://maps.app.goo.gl/DUkC3mSovCR8cpRz5', // Google Business Profile
  ],
  parentOrganization: {
    '@id': `${BASE_URL}/#organization`,
  },
};

// ── WebSite Schema ──────────────────────────────────────────────────────────
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'NeuraWeb',
  url: BASE_URL,
  description:
    'Agence digitale premium spécialisée en développement web sur mesure, intégration IA et automatisation.',
  inLanguage: ['fr-FR', 'en-US', 'es-ES', 'vi-VN'],
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
  telephone: REAL_PHONE,
  email: 'contact@neuraweb.fr',
  image: OG_IMAGE,
  address: {
    '@type': 'PostalAddress',
    addressLocality: REAL_ADDRESS_LOCALITY,
    addressRegion: REAL_ADDRESS_REGION,
    addressCountry: REAL_ADDRESS_COUNTRY,
  },
  areaServed: [
    { '@type': 'City', name: 'Paris' },
    { '@type': 'City', name: 'Lille' },
    { '@type': 'City', name: 'Lyon' },
    { '@type': 'City', name: 'Marseille' },
    { '@type': 'AdministrativeArea', name: 'Île-de-France' },
    { '@type': 'AdministrativeArea', name: 'Hauts-de-France' },
    { '@type': 'Country', name: 'France' },
    { '@type': 'Country', name: 'Belgium' },
    { '@type': 'Country', name: 'Switzerland' },
    // Implantation Hanoï — signal GEO global (cf. organizationSchema)
    { '@type': 'Country', name: 'Vietnam' },
    { '@type': 'City', name: 'Hanoï' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Packs NeuraWeb',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Pack Starter',
        description: 'Site vitrine responsive avec SEO optimisé',
        price: '1490',
        priceCurrency: 'EUR',
      },
      {
        '@type': 'Offer',
        name: 'Pack Business',
        description: 'Solution complète avec espace admin, blog et analytics',
        price: '3990',
        priceCurrency: 'EUR',
      },
      {
        '@type': 'Offer',
        name: 'Pack Premium',
        description: 'E-commerce, API tierces, support 24/7',
        price: '7990',
        priceCurrency: 'EUR',
      },
    ],
  },
  provider: {
    '@id': `${BASE_URL}/#organization`,
  },
};

/**
 * Variante lang-aware du ProfessionalService schema.
 *
 * La version vietnamienne du site est commercialisée en mode devis (les prix
 * EUR fixes des packs ne s'y appliquent pas) : on retire donc entièrement
 * `hasOfferCatalog` — donc `price` / `priceCurrency` — pour `lang === 'vi'`,
 * plutôt que d'exposer un tarif inapplicable aux visiteurs et aux crawlers.
 * Les autres langues reçoivent le schéma inchangé.
 */
export function getProfessionalServiceSchema(lang: string): Record<string, unknown> {
  if (lang === 'vi') {
    const { hasOfferCatalog: _omitted, ...withoutOffers } = professionalServiceSchema;
    return withoutOffers;
  }
  return professionalServiceSchema;
}

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

// ── FAQ de la home ───────────────────────────────────────────────────────────
// Source unique : alimente le schéma FAQPage (page.tsx) ET la section FAQ
// visible (components/sections/faq-section.tsx). Google exige que le contenu
// balisé soit affiché sur la page — garder les deux synchronisés.
export const HOME_FAQ_ITEMS: Record<'fr' | 'en' | 'es' | 'vi', Array<{ question: string; answer: string }>> = {
  fr: [
    {
      question: 'Quels sont les délais pour un projet web ?',
      answer: "Un MVP peut être livré en 4 à 6 semaines. Un site vitrine prend généralement 2 à 4 semaines. Les projets complexes sont évalués au cas par cas lors d'un appel découverte gratuit.",
    },
    {
      question: 'Proposez-vous des forfaits tout inclus ?',
      answer: 'Oui, nous proposons 3 packs web : Starter (à partir de 1 490€), Business (à partir de 3 990€), et Premium (à partir de 7 990€). Nous proposons aussi des packs Automatisation (à partir de 999€) et Intégration IA (à partir de 1 499€). Chaque pack est personnalisable.',
    },
    {
      question: 'Intégrez-vous des solutions IA dans les sites web ?',
      answer: "Oui, nous intégrons des chatbots IA, des agents conversationnels, des systèmes de recommandation et des workflows automatisés avec OpenAI (ChatGPT), Anthropic (Claude) ou des modèles open-source.",
    },
    {
      question: 'NeuraWeb travaille-t-elle uniquement avec des startups ?',
      answer: "Non, nous travaillons avec des startups, des PME et des grandes entreprises. Notre approche agile s'adapte à tous les types de projets.",
    },
    {
      question: "Proposez-vous de l'automatisation n8n ?",
      answer: "Oui, l'automatisation n8n est l'un de nos services phares. Nous concevons des workflows automatisés pour vos processus métier : emails, CRM, facturation, réseaux sociaux, et bien plus.",
    },
  ],
  en: [
    {
      question: 'How long does a web project take?',
      answer: 'An MVP can be delivered in 4 to 6 weeks. A showcase website usually takes 2 to 4 weeks. Complex projects are assessed case by case during a free discovery call.',
    },
    {
      question: 'Do you offer all-inclusive packages?',
      answer: 'Yes, we offer 3 web packs: Starter (from €1,490), Business (from €3,990), and Premium (from €7,990). We also offer Automation packs (from €999) and AI Integration packs (from €1,499). Every pack is customizable.',
    },
    {
      question: 'Do you integrate AI solutions into websites?',
      answer: 'Yes, we integrate AI chatbots, conversational agents, recommendation systems and automated workflows with OpenAI (ChatGPT), Anthropic (Claude) or open-source models.',
    },
    {
      question: 'Does NeuraWeb only work with startups?',
      answer: 'No, we work with startups, SMBs and large companies. Our agile approach adapts to every type of project.',
    },
    {
      question: 'Do you offer n8n automation?',
      answer: 'Yes, n8n automation is one of our flagship services. We design automated workflows for your business processes: emails, CRM, invoicing, social media, and much more.',
    },
  ],
  es: [
    {
      question: '¿Cuáles son los plazos para un proyecto web?',
      answer: 'Un MVP puede entregarse en 4 a 6 semanas. Un sitio vitrina suele tardar de 2 a 4 semanas. Los proyectos complejos se evalúan caso por caso en una llamada de descubrimiento gratuita.',
    },
    {
      question: '¿Ofrecéis paquetes todo incluido?',
      answer: 'Sí, ofrecemos 3 packs web: Starter (desde 1.490€), Business (desde 3.990€) y Premium (desde 7.990€). También ofrecemos packs de Automatización (desde 999€) e Integración IA (desde 1.499€). Cada pack es personalizable.',
    },
    {
      question: '¿Integráis soluciones de IA en los sitios web?',
      answer: 'Sí, integramos chatbots de IA, agentes conversacionales, sistemas de recomendación y workflows automatizados con OpenAI (ChatGPT), Anthropic (Claude) o modelos open-source.',
    },
    {
      question: '¿NeuraWeb trabaja solo con startups?',
      answer: 'No, trabajamos con startups, pymes y grandes empresas. Nuestro enfoque ágil se adapta a todo tipo de proyectos.',
    },
    {
      question: '¿Ofrecéis automatización con n8n?',
      answer: 'Sí, la automatización con n8n es uno de nuestros servicios estrella. Diseñamos workflows automatizados para tus procesos de negocio: emails, CRM, facturación, redes sociales y mucho más.',
    },
  ],
  // Version vi : rédigée pour le marché vietnamien (Hanoï). Règle prix du
  // chantier vi — seul le tarif Landing Page Express (1.290.000 VND) est
  // affiché ; tout le reste reste en mode devis, aucun montant EUR.
  vi: [
    {
      question: 'Làm một website mất bao lâu?',
      answer: 'Gói Landing Page Express (một trang) thường được bàn giao trong vài ngày làm việc. Một website giới thiệu đầy đủ mất khoảng 2 đến 4 tuần. Các dự án phức tạp hơn — bán hàng online, đặt phòng, tích hợp AI — được ước lượng riêng trong buổi tư vấn 30 phút miễn phí.',
    },
    {
      question: 'NeuraWeb báo giá dịch vụ như thế nào?',
      answer: 'Chỉ gói Landing Page Express có giá niêm yết: 1.290.000 VND, ưu đãi ra mắt dành cho 30 khách hàng đầu tiên — một trang gọn gàng cho hộ kinh doanh và cửa hàng nhỏ. Mọi dịch vụ khác (website doanh nghiệp, thương mại điện tử, chatbot AI, tự động hóa, ứng dụng di động) đều được báo giá riêng theo phạm vi thực tế của dự án. Báo giá miễn phí và không ràng buộc.',
    },
    {
      question: 'Các bạn có tích hợp AI vào website không?',
      answer: 'Có. Chúng tôi triển khai chatbot AI trả lời khách 24/7, AI agent tư vấn và sàng lọc khách hàng tiềm năng, hệ thống gợi ý sản phẩm và các quy trình tự động, dựa trên OpenAI (ChatGPT), Anthropic (Claude) hoặc mô hình mã nguồn mở. Chatbot có thể trả lời đồng thời bằng tiếng Việt, tiếng Anh và tiếng Pháp.',
    },
    {
      question: 'NeuraWeb có nhận dự án của cửa hàng nhỏ không?',
      answer: 'Có. Chúng tôi làm việc với cả hộ kinh doanh và cửa hàng nhỏ — thông qua gói Landing Page Express — lẫn doanh nghiệp, khách sạn và nhà hàng phục vụ khách quốc tế. Đội ngũ người Pháp có mặt tại Hà Nội, bàn giao song ngữ Việt – Anh – Pháp theo tiêu chuẩn kỹ thuật châu Âu.',
    },
    {
      question: 'Các bạn có làm tự động hóa quy trình với n8n không?',
      answer: 'Có, tự động hóa n8n là một trong những dịch vụ chủ lực của NeuraWeb. Chúng tôi kết nối các công cụ bạn đang dùng và tự động hóa những việc lặp đi lặp lại: tiếp nhận đơn hàng, chăm sóc khách, hóa đơn, báo cáo, đăng bài mạng xã hội. Chi phí được báo giá riêng theo số lượng và độ phức tạp của quy trình.',
    },
  ],
};

// ── FAQ Schema (rétro-compat : version FR) ──────────────────────────────────
export const faqSchema = generateFaqSchema(HOME_FAQ_ITEMS.fr);

// ── FAQ Schema Generator ────────────────────────────────────────────────────
export function generateFaqSchema(
  items: Array<{ question: string; answer: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

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

// Converts "YYYY-MM-DD" → "YYYY-MM-DDT08:00:00+02:00" (CEST Apr–Sep) or "+01:00" (CET Oct–Mar)
function toIso8601DateTime(dateStr: string): string {
  const month = parseInt(dateStr.substring(5, 7), 10);
  const tz = month >= 4 && month <= 9 ? '+02:00' : '+01:00';
  return `${dateStr}T08:00:00${tz}`;
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  authorUrl?: string;
  url: string;
  image?: string;
}): Record<string, unknown> {
  const authorUrl = article.authorUrl || `${BASE_URL}/fr/equipe`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': article.author ? 'Person' : 'Organization',
      name: article.author || 'NeuraWeb',
      url: authorUrl,
    },
    datePublished: toIso8601DateTime(article.datePublished),
    dateModified: toIso8601DateTime(article.dateModified || article.datePublished),
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url.startsWith('http') ? article.url : `${BASE_URL}${article.url}`,
    },
    image: article.image ? `${BASE_URL}${article.image}` : OG_IMAGE,
  };
}

// ── Combine all schemas ──────────────────────────────────────────────────────
export function getAllSchemas(): Record<string, unknown>[] {
  return [organizationSchema, websiteSchema, localBusinessSchema];
}

export function getServiceSchemas(): Record<string, unknown>[] {
  return [organizationSchema, serviceSchema, professionalServiceSchema];
}