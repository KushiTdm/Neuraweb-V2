// ============================================================
// PACKAGES TARIFAIRES NEURAWEB
// 4 packs visibles + 3 packs cachés (via chatbot uniquement)
// ============================================================

export interface Package {
  id: string;
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
  hidden?: boolean; // true = accessible uniquement via chatbot ou URL directe
  href: string;
}

// ============================================================
// PACKS VISIBLES — Affichés sur la page /services
// ============================================================
export const visiblePackages: Package[] = [
  {
    id: 'starter',
    name: 'Pack Starter',
    tagline: 'Lancez votre présence en ligne',
    price: { from: 1500, currency: '€', note: 'site vitrine' },
    duration: '2–3 semaines',
    includes: [
      'Site vitrine 5 pages responsive',
      'Design personnalisé',
      'SEO optimisé',
      'Formulaire de contact',
      'Hébergement 1 an inclus',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    ideal: 'Auto-entrepreneurs, TPE, première présence en ligne',
    cta: 'Choisir ce pack',
    href: '/contact?pack=starter',
  },
  {
    id: 'business',
    name: 'Pack Business',
    tagline: 'Développez votre activité en ligne',
    price: { from: 4900, currency: '€', note: 'selon complexité' },
    duration: '4–6 semaines',
    includes: [
      'Tout le Pack Starter',
      'Espace administrateur',
      'Blog intégré',
      'Analytics avancés (GA4)',
      'Support prioritaire',
      'Formation incluse (2h)',
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    ideal: 'PME, startups en croissance, besoin de contenu régulier',
    cta: 'Choisir ce pack',
    featured: true,
    href: '/contact?pack=business',
  },
  {
    id: 'premium',
    name: 'Pack Premium',
    tagline: 'Solution complète pour projets ambitieux',
    price: { from: 9000, currency: '€', note: 'selon complexité' },
    duration: '6–8 semaines',
    includes: [
      'Tout le Pack Business',
      'E-commerce complet (Stripe)',
      'Intégrations API tierces',
      'Performance optimale (95+ Lighthouse)',
      'Support 24/7',
      'Maintenance 3 mois incluse',
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'OpenAI'],
    ideal: 'E-commerce, projets complexes, entreprises établies',
    cta: 'Choisir ce pack',
    href: '/contact?pack=premium',
  },
  {
    id: 'ai',
    name: 'Pack IA',
    tagline: 'Automatisez et innovez avec l\'IA',
    price: { from: 0, currency: '€', note: 'sur devis' },
    duration: 'Variable',
    includes: [
      'Chatbot IA entraîné sur vos données',
      'Automatisation n8n',
      'Machine Learning sur mesure',
      'Analyse de données',
      'Intégration dans votre stack existant',
      'Support dédié',
    ],
    stack: ['OpenAI', 'n8n', 'Python', 'LangChain', 'Pinecone'],
    ideal: 'Entreprises voulant automatiser, startups IA',
    cta: 'Demander un devis',
    href: '/contact?pack=ai',
  },
];

// ============================================================
// PACKS CACHÉS — Accessibles uniquement via chatbot ou URL directe
// Ne pas afficher sur la page /services
// ============================================================
export const hiddenPackages: Package[] = [
  {
    id: 'landing',
    name: 'Pack Landing Page',
    tagline: 'Une page, un objectif, maximum de conversions',
    price: { from: 790, currency: '€', note: 'prix fixe' },
    duration: '1 semaine',
    includes: [
      '1 page de conversion optimisée',
      'Design premium mobile-first',
      'A/B testing ready',
      'Formulaire + CTA optimisés',
      'Analytics de conversion',
      'Hébergement 6 mois',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    ideal: 'Lancement produit, campagne publicitaire, budget serré',
    cta: 'Choisir ce pack',
    hidden: true,
    href: '/contact?pack=landing',
  },
  {
    id: 'mvp',
    name: 'Pack MVP SaaS',
    tagline: 'Votre idée en produit réel en 6 semaines',
    price: { from: 4900, currency: '€', note: 'selon complexité' },
    duration: '4–6 semaines',
    includes: [
      'Authentification sécurisée',
      'Dashboard utilisateur',
      'Base de données + API REST',
      'Paiement Stripe',
      'Déploiement Vercel',
      '2 semaines de support post-livraison',
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Stripe'],
    ideal: 'Startups pre-seed, lever des fonds, valider une idée',
    cta: 'Choisir ce pack',
    hidden: true,
    href: '/contact?pack=mvp',
  },
  {
    id: 'refonte',
    name: 'Pack Refonte',
    tagline: 'Modernisez votre site sans perdre votre SEO',
    price: { from: 2900, currency: '€', note: 'selon complexité' },
    duration: '3–4 semaines',
    includes: [
      'Migration complète vers Next.js',
      'Design modernisé',
      'SEO 100% préservé + amélioré',
      '+50 points Lighthouse garantis',
      'Redirections 301 configurées',
      'Formation équipe incluse',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    ideal: 'Site WordPress lent, vieux site à moderniser',
    cta: 'Choisir ce pack',
    hidden: true,
    href: '/contact?pack=refonte',
  },
];

// Tous les packs (utile pour les pages de détail dynamiques)
export const packages: Package[] = [...visiblePackages, ...hiddenPackages];

// Helpers
export function getPackById(id: string): Package | undefined {
  return packages.find(p => p.id === id);
}

export function getVisiblePackages(): Package[] {
  return visiblePackages;
}

// ============================================================
// OFFRE D'ENTRÉE — Audit IA Gratuit
// ============================================================
export const auditOffer = {
  name: 'Audit IA Gratuit',
  tagline: 'Valeur 490€ — Offre de lancement',
  duration: '45 minutes',
  includes: [
    'Analyse de votre workflow actuel',
    'Identification des tâches automatisables',
    'Estimation ROI chiffrée',
    "Roadmap d'implémentation prioritaire",
  ],
  cta: 'Réserver mon audit gratuit',
  href: '/contact?booking=true&service=audit-ia',
  note: 'Aucune obligation. 100% actionnable.',
};