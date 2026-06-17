/**
 * blog-cta-mapping.ts
 *
 * Détermine, pour un article donné (catégorie + tags + slug), le service
 * NeuraWeb le plus pertinent à mettre en avant dans la sidebar CTA.
 *
 * Trois CTA possibles par article :
 *   1. Service principal (lien vers la page service correspondante)
 *   2. Audit gratuit  → /booking?service=audit-ia
 *   3. Prendre RDV    → /booking
 *
 * Le mapping prioritaire repose sur le slug (cas particuliers restau/hôtel),
 * puis sur la catégorie. Les tags servent de fallback.
 */

export type ServiceKey =
  | 'automatisation'
  | 'integration-ia'
  | 'developpement-web'
  | 'restaurants'
  | 'mobile-app'
  | 'services';

export interface ServiceCTAContent {
  key: ServiceKey;
  href: string;
  /** Petit eyebrow ("Service en lien", etc.) */
  eyebrow: { fr: string; en: string; es: string };
  /** Titre de la carte service */
  title: { fr: string; en: string; es: string };
  /** Description courte 1-2 lignes */
  description: { fr: string; en: string; es: string };
  /** Label du bouton */
  cta: { fr: string; en: string; es: string };
}

const SERVICES: Record<ServiceKey, ServiceCTAContent> = {
  automatisation: {
    key: 'automatisation',
    href: '/automatisation',
    eyebrow: {
      fr: 'Service en lien',
      en: 'Related service',
      es: 'Servicio relacionado',
    },
    title: {
      fr: 'Automatisation IA & workflows',
      en: 'AI automation & workflows',
      es: 'Automatización IA y flujos',
    },
    description: {
      fr: 'n8n, Make, agents IA : automatisez vos relances, vos leads et vos process. Setup en quelques jours.',
      en: 'n8n, Make, AI agents: automate follow-ups, leads and processes. Setup in days.',
      es: 'n8n, Make, agentes IA: automatiza seguimientos, leads y procesos. Configuración en días.',
    },
    cta: {
      fr: 'Découvrir le service',
      en: 'Discover the service',
      es: 'Descubrir el servicio',
    },
  },
  'integration-ia': {
    key: 'integration-ia',
    href: '/integration-ia',
    eyebrow: {
      fr: 'Service en lien',
      en: 'Related service',
      es: 'Servicio relacionado',
    },
    title: {
      fr: 'Intégration IA sur votre site',
      en: 'AI integration on your site',
      es: 'Integración IA en tu sitio',
    },
    description: {
      fr: 'Chatbot, recommandations, recherche sémantique : transformez votre site en machine à conversions.',
      en: 'Chatbot, recommendations, semantic search: turn your site into a conversion machine.',
      es: 'Chatbot, recomendaciones, búsqueda semántica: convierte tu sitio en una máquina de conversiones.',
    },
    cta: {
      fr: 'Découvrir le service',
      en: 'Discover the service',
      es: 'Descubrir el servicio',
    },
  },
  'developpement-web': {
    key: 'developpement-web',
    href: '/developpement-web',
    eyebrow: {
      fr: 'Service en lien',
      en: 'Related service',
      es: 'Servicio relacionado',
    },
    title: {
      fr: 'Sites web sur-mesure',
      en: 'Tailor-made websites',
      es: 'Sitios web a medida',
    },
    description: {
      fr: 'Next.js, performance Core Web Vitals, SEO technique. Packs à partir de 1 490 €.',
      en: 'Next.js, Core Web Vitals performance, technical SEO. Packs from €1,490.',
      es: 'Next.js, rendimiento Core Web Vitals, SEO técnico. Packs desde 1.490 €.',
    },
    cta: {
      fr: 'Voir les packs',
      en: 'See the packs',
      es: 'Ver los packs',
    },
  },
  restaurants: {
    key: 'restaurants',
    href: '/restaurants',
    eyebrow: {
      fr: 'Service en lien',
      en: 'Related service',
      es: 'Servicio relacionado',
    },
    title: {
      fr: 'Sites pour restaurants',
      en: 'Restaurant websites',
      es: 'Sitios para restaurantes',
    },
    description: {
      fr: 'Réservations directes, click & collect, fidélité : reprenez la main sur vos commissions.',
      en: 'Direct bookings, click & collect, loyalty: take back control of your commissions.',
      es: 'Reservas directas, click & collect, fidelización: recupera el control de tus comisiones.',
    },
    cta: {
      fr: 'Voir l’offre restauration',
      en: 'See the restaurant offer',
      es: 'Ver la oferta restauración',
    },
  },
  'mobile-app': {
    key: 'mobile-app',
    href: '/mobile-app-development',
    eyebrow: {
      fr: 'Service en lien',
      en: 'Related service',
      es: 'Servicio relacionado',
    },
    title: {
      fr: 'Applications mobiles',
      en: 'Mobile applications',
      es: 'Aplicaciones móviles',
    },
    description: {
      fr: 'Apps iOS & Android natives ou cross-platform, conçues pour vos clients et vos équipes.',
      en: 'Native or cross-platform iOS & Android apps, designed for your customers and teams.',
      es: 'Apps iOS y Android nativas o multiplataforma, diseñadas para tus clientes y equipos.',
    },
    cta: {
      fr: 'Découvrir le service',
      en: 'Discover the service',
      es: 'Descubrir el servicio',
    },
  },
  services: {
    key: 'services',
    href: '/services',
    eyebrow: {
      fr: 'Service en lien',
      en: 'Related service',
      es: 'Servicio relacionado',
    },
    title: {
      fr: 'Web, IA & automatisation',
      en: 'Web, AI & automation',
      es: 'Web, IA y automatización',
    },
    description: {
      fr: 'Découvrez l’ensemble de nos prestations sur-mesure pour PME et indépendants.',
      en: 'Discover our full range of tailor-made services for SMBs and freelancers.',
      es: 'Descubre toda nuestra gama de servicios a medida para pymes y autónomos.',
    },
    cta: {
      fr: 'Voir nos services',
      en: 'See our services',
      es: 'Ver nuestros servicios',
    },
  },
};

// Mapping explicite par slug — gagne sur la catégorie
const SLUG_TO_SERVICE: Record<string, ServiceKey> = {
  '3-workflows-agents-ia-pme': 'automatisation',
  'agent-ia-commercial-pme': 'automatisation',
  'agent-ia-relance-factures-pme': 'automatisation',
  'ai-act-pme-conformite-2026': 'integration-ia',
  'automatisation-ia-pme-prix-2026': 'automatisation',
  'automatisation-n8n-guide': 'automatisation',
  'automatisation-processus-roi': 'automatisation',
  'chatbot-ia-restaurant-hotel': 'restaurants',
  'checklist-site-hotelier-performant': 'developpement-web',
  'google-ai-mode-seo-2026': 'developpement-web',
  'ia-agents-remplacent-equipes-2026': 'automatisation',
  'integrer-ia-site-web-2025': 'integration-ia',
  'make-n8n-zapier-2026-pme-france': 'automatisation',
  'marketing-digital-ia-automations': 'automatisation',
  'nextjs-vs-wordpress-2026': 'developpement-web',
  'refonte-site-web-pme-guide-2026': 'developpement-web',
  'reservations-directes-hotel-sans-commission-ota': 'developpement-web',
  'seo-ia-aeo-automatisation-neuraweb-fr': 'developpement-web',
  'site-restaurant-sans-commission-2026': 'restaurants',
  'site-vitrine-ia-machine-leads': 'integration-ia',
  'site-web-hotel-design-reservations': 'developpement-web',
};

// Fallback par catégorie si le slug n'est pas mappé
const CATEGORY_TO_SERVICE: Record<string, ServiceKey> = {
  Automatisation: 'automatisation',
  IA: 'integration-ia',
  'Intelligence Artificielle': 'integration-ia',
  'Développement Web': 'developpement-web',
  'Sites Web': 'developpement-web',
  SEO: 'developpement-web',
  'Marketing Digital': 'automatisation',
  Stratégie: 'services',
};

// Tags qui basculent vers un service spécifique (priorité haute)
const TAG_OVERRIDES: { tags: string[]; service: ServiceKey }[] = [
  {
    tags: ['Restaurant', 'Restauration', 'Click and Collect'],
    service: 'restaurants',
  },
];

export function getServiceForPost(
  slug: string,
  category: string,
  tags: string[] = []
): ServiceCTAContent {
  // 1. Slug explicite
  const fromSlug = SLUG_TO_SERVICE[slug];
  if (fromSlug) return SERVICES[fromSlug];

  // 2. Tag override (ex: restaurant)
  for (const override of TAG_OVERRIDES) {
    if (tags.some((t) => override.tags.includes(t))) {
      return SERVICES[override.service];
    }
  }

  // 3. Catégorie
  const fromCategory = CATEGORY_TO_SERVICE[category];
  if (fromCategory) return SERVICES[fromCategory];

  // 4. Fallback global
  return SERVICES.services;
}

export type SidebarLanguage = 'fr' | 'en' | 'es';

export interface SidebarTranslations {
  service: ServiceCTAContent;
  audit: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    badge: string;
    value: string;
  };
  booking: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    duration: string;
  };
}

export const SIDEBAR_COPY = {
  audit: {
    fr: {
      eyebrow: 'Offert',
      title: 'Audit IA & web gratuit',
      description:
        '30 min avec un expert NeuraWeb : on identifie vos 3 leviers prioritaires sur SEO, IA et conversion.',
      cta: 'Réserver mon audit',
      badge: 'Gratuit',
      value: 'Valeur 490 €',
    },
    en: {
      eyebrow: 'Free',
      title: 'Free AI & web audit',
      description:
        '30 min with a NeuraWeb expert: we identify your top 3 levers on SEO, AI and conversion.',
      cta: 'Book my audit',
      badge: 'Free',
      value: '€490 value',
    },
    es: {
      eyebrow: 'Gratis',
      title: 'Auditoría IA y web gratuita',
      description:
        '30 min con un experto NeuraWeb: identificamos tus 3 palancas prioritarias en SEO, IA y conversión.',
      cta: 'Reservar mi auditoría',
      badge: 'Gratis',
      value: 'Valor 490 €',
    },
  },
  booking: {
    fr: {
      eyebrow: 'Échange direct',
      title: 'Discutons de votre projet',
      description:
        'Appel découverte de 30 min : posez vos questions, on chiffre une première piste concrète.',
      cta: 'Prendre rendez-vous',
      duration: '30 min · sans engagement',
    },
    en: {
      eyebrow: 'Talk to us',
      title: 'Let’s discuss your project',
      description:
        '30-min discovery call: ask your questions, we sketch a concrete first plan with rough numbers.',
      cta: 'Book a meeting',
      duration: '30 min · no commitment',
    },
    es: {
      eyebrow: 'Hablemos',
      title: 'Hablemos de tu proyecto',
      description:
        'Llamada de descubrimiento de 30 min: haz tus preguntas, esbozamos una primera vía concreta.',
      cta: 'Reservar una cita',
      duration: '30 min · sin compromiso',
    },
  },
} as const;

export function getSidebarContent(
  slug: string,
  category: string,
  tags: string[],
  lang: SidebarLanguage
): {
  service: {
    href: string;
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    key: ServiceKey;
  };
  audit: (typeof SIDEBAR_COPY.audit)[SidebarLanguage];
  booking: (typeof SIDEBAR_COPY.booking)[SidebarLanguage];
} {
  const svc = getServiceForPost(slug, category, tags);
  return {
    service: {
      key: svc.key,
      href: svc.href,
      eyebrow: svc.eyebrow[lang],
      title: svc.title[lang],
      description: svc.description[lang],
      cta: svc.cta[lang],
    },
    audit: SIDEBAR_COPY.audit[lang],
    booking: SIDEBAR_COPY.booking[lang],
  };
}
