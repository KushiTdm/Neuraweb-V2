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
    name: 'MVP Sprint',
    tagline: 'Validez votre idée en 6 semaines',
    price: { from: 4500, currency: '€', note: 'selon complexité' },
    duration: '4–6 semaines',
    includes: [
      'Application Next.js production-ready',
      'Authentification & base de données',
      'Intégration 1 service IA (chatbot, recommandation, etc.)',
      'Déploiement Vercel + monitoring',
      '2 semaines de support post-livraison',
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'OpenAI'],
    ideal: 'Startups pre-seed à seed',
    cta: 'Démarrer mon MVP',
    href: '/contact?pack=mvp',
  },
  {
    name: 'AI Integration',
    tagline: 'Boostez votre app existante avec l\'IA',
    price: { from: 2800, currency: '€', note: 'par intégration' },
    duration: '2–4 semaines',
    includes: [
      'Audit de votre stack existante',
      'Intégration agent IA sur mesure',
      'Pipeline de données + RAG si nécessaire',
      'Tests de performance & sécurité',
      'Formation équipe (2h)',
    ],
    stack: ['OpenAI', 'LangChain', 'Pinecone', 'n8n'],
    ideal: 'Entreprises avec app existante',
    cta: 'Intégrer l\'IA',
    featured: true,
    href: '/contact?pack=ai',
  },
  {
    name: 'Automation Pack',
    tagline: 'Automatisez vos workflows métier',
    price: { from: 1800, currency: '€', note: 'par workflow' },
    duration: '1–2 semaines',
    includes: [
      'Analyse et mapping de vos processus',
      'Automatisation n8n / Make personnalisée',
      'Intégrations CRM, email, Slack, etc.',
      'Documentation complète',
      '1 mois de monitoring inclus',
    ],
    stack: ['n8n', 'Make', 'Zapier', 'API REST'],
    ideal: 'TPE/PME et startups',
    cta: 'Automatiser mon business',
    href: '/contact?pack=automation',
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
  href: 'https://cal.com/neuraweb/audit-ia',
  note: 'Aucune obligation. 100% actionnable.',
};