// ============================================================
// CASE STUDIES / ÉTUDES DE CAS NEURAWEB
// Preuves sociales avec métriques concrètes
// ============================================================

export interface CaseStudyResult {
  metric: string;
  before: string;
  after: string;
  delta: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  sector: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  stack: string[];
  duration: string;
  testimonial?: CaseStudyTestimonial;
  image?: string;
  featured?: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'saas-onboarding',
    client: 'SaaS B2B (confidentiel)',
    sector: 'Fintech',
    challenge: 'Onboarding trop long, 68% d\'abandon en étape 3',
    solution: 'Refonte UX + agent IA guidant l\'utilisateur',
    results: [
      { metric: 'Taux d\'abandon', before: '68%', after: '23%', delta: '-45pts' },
      { metric: 'Temps d\'onboarding', before: '47min', after: '12min', delta: '-74%' },
      { metric: 'Activation J7', before: '31%', after: '67%', delta: '+116%' },
    ],
    stack: ['Next.js', 'OpenAI', 'Vercel', 'Stripe'],
    duration: '6 semaines',
    testimonial: {
      quote: 'L\'équipe NeuraWeb a transformé notre onboarding. Les résultats ont dépassé toutes nos attentes.',
      author: 'CTO',
      role: 'Fintech startup (Series A)',
    },
    featured: true,
  },
  {
    id: 'ecommerce-automation',
    client: 'E-commerce mode',
    sector: 'Retail',
    challenge: 'Support client saturé, 200+ tickets/jour sans réponse auto',
    solution: 'Agent IA n8n + intégration Zendesk + base de connaissances vectorielle',
    results: [
      { metric: 'Tickets auto-résolus', before: '0%', after: '73%', delta: '+73pts' },
      { metric: 'Temps de réponse', before: '4h', after: '< 2min', delta: '-98%' },
      { metric: 'Satisfaction client (CSAT)', before: '3.2/5', after: '4.7/5', delta: '+47%' },
    ],
    stack: ['n8n', 'OpenAI', 'Zendesk', 'Pinecone'],
    duration: '3 semaines',
    testimonial: {
      quote: 'Incroyable. En 3 semaines nous avons libéré 2 ETP en support client.',
      author: 'Directeur Opérations',
      role: 'E-commerce 5M€/an',
    },
    featured: true,
  },
  {
    id: 'startup-mvp',
    client: 'Startup EdTech',
    sector: 'Education',
    challenge: 'Besoin d\'un MVP en 5 semaines pour lever des fonds',
    solution: 'Développement full-stack Next.js avec dashboard analytics et système de paiement',
    results: [
      { metric: 'Délai de livraison', before: 'Non estimé', after: '5 semaines', delta: '✓' },
      { metric: 'Utilisateurs beta', before: '0', after: '500+', delta: '+500' },
      { metric: 'Levée de fonds', before: 'Non levée', after: '400k€', delta: '✓' },
    ],
    stack: ['Next.js', 'Prisma', 'Stripe', 'Chart.js'],
    duration: '5 semaines',
    testimonial: {
      quote: 'Le MVP a été prêt juste à temps pour notre présentation aux investisseurs. Qualité professionnelle.',
      author: 'Fondateur',
      role: 'EdTech startup',
    },
  },
  {
    id: 'marketing-automation',
    client: 'Agence marketing',
    sector: 'Marketing',
    challenge: 'Reporting manuel chronophage pour 50+ clients',
    solution: 'Automatisation n8n avec agrégation multi-sources et envoi automatique',
    results: [
      { metric: 'Temps reporting', before: '15h/semaine', after: '30min/semaine', delta: '-97%' },
      { metric: 'Erreurs manuelles', before: '8%', after: '0.1%', delta: '-99%' },
      { metric: 'Satisfaction clients', before: '3.8/5', after: '4.8/5', delta: '+26%' },
    ],
    stack: ['n8n', 'Google Sheets', 'HubSpot', 'Slack'],
    duration: '2 semaines',
  },
];

// Fonction utilitaire pour récupérer un case study par ID
export function getCaseStudyById(id: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.id === id);
}

// Fonction pour récupérer les case studies en vedette
export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((cs) => cs.featured);
}