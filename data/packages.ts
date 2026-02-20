// ============================================================
// PACKAGES TARIFAIRES NEURAWEB
// Prix clairs et transparents pour les clients
// ============================================================

export interface Package {
  name: string;
  tagline: string;
  price: {
    from: number;
    currency: string;
    note: string;
  };
  duration: string;
  includes: string[];
  stack: string[];
  ideal: string;
  cta: string;
  featured?: boolean;
  href: string;
}

export const packages: Package[] = [
  {
    name: 'Pack Starter',
    tagline: 'Idéal pour démarrer votre présence en ligne',
    price: { from: 1500, currency: '€', note: 'site vitrine' },
    duration: '2–3 semaines',
    includes: [
      'Site vitrine responsive',
      'Design personnalisé',
      'Optimisation SEO de base',
      'Formulaire de contact',
      'Hébergement 1 an inclus',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    ideal: 'TPE/PME, entrepreneurs',
    cta: 'Choisir ce pack',
    href: '/contact?pack=starter',
  },
  {
    name: 'Pack Business',
    tagline: 'Solution complète pour entreprises en croissance',
    price: { from: 4900, currency: '€', note: 'selon complexité' },
    duration: '4–6 semaines',
    includes: [
      'Tout le Pack Starter',
      'Espace administrateur',
      'Blog intégré',
      'Analytics avancés',
      'Support prioritaire',
      'Formation incluse',
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    ideal: 'PME, startups en croissance',
    cta: 'Choisir ce pack',
    featured: true,
    href: '/contact?pack=business',
  },
  {
    name: 'Pack Premium',
    tagline: 'Solution premium pour projets ambitieux',
    price: { from: 9000, currency: '€', note: 'selon complexité' },
    duration: '6–8 semaines',
    includes: [
      'Tout le Pack Business',
      'E-commerce complet',
      'Intégration API tierces',
      'Optimisation avancée',
      'Support 24/7',
      'Maintenance 3 mois',
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'OpenAI'],
    ideal: 'Entreprises, e-commerce',
    cta: 'Choisir ce pack',
    href: '/contact?pack=premium',
  },
];

// Package pour l'audit IA gratuit (offre d'entrée)
export const auditOffer = {
  name: 'Audit IA Gratuit',
  tagline: 'Valeur 490€ — Offre de lancement',
  duration: '45 minutes',
  includes: [
    'Analyse de votre workflow actuel',
    'Identification des tâches automatisables',
    'Estimation ROI chiffrée',
    'Roadmap d\'implémentation prioritaire',
  ],
  cta: 'Réserver mon audit gratuit',
  href: '/contact?booking=true&service=audit-ia',
  note: 'Aucune obligation. 100% actionnable.',
};
