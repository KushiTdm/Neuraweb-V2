'use client';

import React, { useState } from 'react';
import {
  Brain,
  Bot,
  MessageSquare,
  Cpu,
  Database,
  Shield,
  ArrowRight,
  Check,
  X as XIcon,
  CheckCircle,
  Star,
  Sparkles,
  ChevronDown,
  Code2,
  Search,
  Layers,
  Zap,
  Users,
  TrendingUp,
  Lock,
  Globe,
  FileText,
  BarChart3,
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LocalizedLink } from '@/components/localized-link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// ═══════════════════════════════════════════════════════════════════════════
// DONNÉES
// ═══════════════════════════════════════════════════════════════════════════

const STATS = [
  { value: '70%', label: 'des demandes clients traitées automatiquement', color: 'text-[#5db8f0]' },
  { value: '24/7', label: 'disponibilité des assistants IA', color: 'text-[#5db8f0]' },
  { value: '3×', label: 'plus de conversions avec un chatbot qualifiant', color: 'text-[#22d3ee]' },
];

const PROBLEMS = [
  {
    icon: MessageSquare,
    title: 'Votre équipe répond manuellement aux mêmes questions',
    text: "FAQ, tarifs, disponibilités, processus de commande : 70% des questions sont identiques. Un assistant IA les traite instantanément, 24h/24.",
    color: 'text-[#5db8f0] bg-[#5db8f0]/10',
  },
  {
    icon: Users,
    title: 'Vos leads ne sont pas qualifiés avant de passer en vente',
    text: "Budget, besoin, timing, autorité décisionnelle : un agent IA pose les bonnes questions et vous livre uniquement les prospects chauds.",
    color: 'text-[#5db8f0] bg-[#5db8f0]/10',
  },
  {
    icon: Database,
    title: 'Votre site ne tire pas parti de vos données internes',
    text: "Documentation, catalogue produits, FAQ, cas clients : un assistant RAG indexe vos contenus et répond avec précision à toutes les questions.",
    color: 'text-[#22d3ee] bg-[#22d3ee]/10',
  },
  {
    icon: TrendingUp,
    title: "L'IA vous semble complexe ou risquée",
    text: "Pas besoin de data scientists. Nous intégrons des LLM (Claude, Mistral, GPT) directement dans vos outils existants, avec des garde-fous stricts.",
    color: 'text-rose-400 bg-rose-400/10',
  },
];

const SERVICES = [
  {
    icon: MessageSquare,
    title: 'Chatbot IA / Assistant RAG',
    desc: 'Un chatbot intelligent connecté à votre base de connaissances (site, PDF, docs, FAQ). Il répond aux questions précises de vos visiteurs et qualifie les leads entrants.',
    details: [
      'Indexation de vos contenus (site, PDF, Notion, docs)',
      'Réponses précises basées sur VOS données uniquement',
      'Qualification des leads (budget, besoin, urgence)',
      'Handoff vers CRM ou équipe commerciale',
      'Disponible sur site, WhatsApp, email',
    ],
    badge: 'À partir de 1 999 €',
    badgeColor: 'bg-[#5db8f0]',
    accentColor: 'border-[#5db8f0]',
  },
  {
    icon: Code2,
    title: 'Intégration LLM dans vos outils',
    desc: 'Nous connectons Claude, Mistral ou GPT-4 à vos outils existants via API : CRM, site web, back-office, ERP. Prompts métier robustes, tests sur données réelles.',
    details: [
      'Sélection du modèle adapté (Claude, Mistral, GPT)',
      'Configuration de prompts métier robustes',
      'Tests sur vos données réelles',
      'Documentation et transfert de compétences',
      'Intégration dans n8n / Make si besoin',
    ],
    badge: 'À partir de 699 €',
    badgeColor: 'bg-[#5db8f0]',
    accentColor: 'border-[#5db8f0]',
  },
  {
    icon: Bot,
    title: 'Agent IA commercial autonome',
    desc: 'Un agent IA qui prospecte, qualifie, répond aux objections et planifie les rendez-vous sans intervention humaine. Vos commerciaux ne traitent que des leads chauds.',
    details: [
      'Qualification BANT automatique (budget, autorité, besoin, timing)',
      'Réponses aux objections fréquentes',
      'Prise de rendez-vous automatique (Calendly, Google Agenda)',
      'Scoring et transfert vers CRM',
      'Suivi multicanal (email, chat, WhatsApp)',
    ],
    badge: 'À partir de 2 999 €',
    badgeColor: 'bg-cyan-500',
    accentColor: 'border-cyan-400',
  },
  {
    icon: FileText,
    title: 'Génération de contenu IA',
    desc: "Agent IA qui rédige vos articles SEO, fiches produits, newsletters et posts réseaux sociaux en respectant votre ton éditorial. Humain en révision finale.",
    details: [
      'Brief automatique depuis mot-clé ou sujet',
      'Respect de votre charte éditoriale',
      'Articles optimisés SEO + schema FAQ',
      'Publication automatisée (WordPress, Notion, CMS)',
      'Rapport de performance mensuel',
    ],
    badge: 'À partir de 1 499 €',
    badgeColor: 'bg-amber-500',
    accentColor: 'border-amber-400',
  },
  {
    icon: Search,
    title: 'Automatisation SEO & AEO',
    desc: "Stack complète : analyse GSC, génération de mots-clés, rédaction d'articles, balisage schema.org, monitoring positions. Apparaître dans les réponses IA (Google AI Overviews).",
    details: [
      'Connexion Google Search Console',
      'Détection des opportunités de contenu manquées',
      'Génération et publication automatique d\'articles',
      'Balisage schema.org FAQ / HowTo / Article',
      'Monitoring mensuel + rapport de performance',
    ],
    badge: 'À partir de 1 999 €',
    badgeColor: 'bg-emerald-500',
    accentColor: 'border-emerald-400',
  },
  {
    icon: Layers,
    title: 'Développement IA sur mesure',
    desc: "Système multi-agents, assistant interne RAG, SaaS métier IA, fine-tuning de modèle, intégration profonde dans votre SI. Pour les projets ambitieux.",
    details: [
      'Architecture multi-agents (orchestration LangChain / n8n)',
      'RAG sur base documentaire volumineuse',
      'Fine-tuning de modèle open source (Mistral, LLama)',
      'Hébergement souverain France, RGPD',
      'Intégration profonde dans votre SI existant',
    ],
    badge: 'À partir de 3 000 €',
    badgeColor: 'bg-rose-500',
    accentColor: 'border-rose-400',
  },
];

type PackId = 'essentiel' | 'business' | 'premium';

interface Pack {
  id: PackId;
  name: string;
  tagline: string;
  price: number;
  monthly: number;
  delivery: string;
  badge?: string;
  badgeColor?: string;
  borderColor: string;
  popular?: boolean;
  bullets: string[];
  included: string[];
  notIncluded: string[];
  options: { label: string; price: string }[];
  maintenanceItems: string[];
}

const PACKS: Pack[] = [
  {
    id: 'essentiel',
    name: 'Essentiel IA',
    tagline: 'Votre premier assistant IA. En ligne en 2 semaines.',
    price: 1499,
    monthly: 39,
    delivery: '1 à 2 semaines',
    borderColor: 'border-white/10',
    bullets: [
      'Chatbot IA FAQ (jusqu\'à 5 intentions)',
      'Indexation de votre site + 1 PDF ou doc',
      '1 langue, jusqu\'à 500 conversations/mois',
      'Design personnalisé intégré à votre site',
    ],
    included: [
      'Chatbot RAG connecté à votre site et 1 document',
      'Jusqu\'à 5 intentions de conversation configurées',
      'Design chatbot adapté à votre charte graphique',
      'Intégration sur votre site (widget ou page dédiée)',
      '1 langue (français)',
      '500 conversations / mois incluses',
      'Historique des conversations (30 jours)',
      'Formation 30 min + documentation',
      'Support email 30 jours',
    ],
    notIncluded: [
      'Agent IA qualifiant (BANT scoring)',
      'Intégration CRM / handoff commercial',
      'Plus d\'une langue',
      'Plus de 500 conversations / mois',
      'Génération de contenu IA',
      'Automatisation workflow n8n',
    ],
    options: [
      { label: 'Langue supplémentaire', price: '+290 € HT' },
      { label: '500 conversations supplémentaires / mois', price: '+29 € HT/mois' },
      { label: 'Intégration CRM basique', price: '+490 € HT' },
      { label: 'Indexation de 5 documents supplémentaires', price: '+190 € HT' },
    ],
    maintenanceItems: [
      'Surveillance mensuelle du chatbot',
      'Mise à jour de la base de connaissances (sur demande)',
      'Support email (délai 72h)',
    ],
  },
  {
    id: 'business',
    name: 'Business IA',
    tagline: 'Agent IA complet. Qualification automatique. CRM connecté.',
    price: 3999,
    monthly: 89,
    delivery: '3 à 5 semaines',
    badge: 'Le plus populaire',
    badgeColor: 'bg-[#5db8f0]',
    popular: true,
    borderColor: 'border-[#5db8f0] dark:border-[#5db8f0]',
    bullets: [
      'Agent IA qualifiant (jusqu\'à 10 intentions)',
      'Indexation illimitée (site + docs + CRM)',
      '3 langues, jusqu\'à 800 conversations/mois',
      'Intégration CRM + handoff commercial',
    ],
    included: [
      'Agent IA avec qualification BANT automatique',
      'Jusqu\'à 10 intentions de conversation',
      'Indexation illimitée (site, PDF, Notion, CRM)',
      '3 langues au choix',
      '800 conversations / mois incluses',
      'Intégration CRM (HubSpot, Notion, Airtable)',
      'Handoff vers équipe commerciale (email + Slack)',
      'Prise de rendez-vous automatique (Calendly)',
      'Reporting mensuel (volume, intentions, taux de résolution)',
      '1h d\'optimisation / mois incluse',
      'Support prioritaire email (délai 48h)',
    ],
    notIncluded: [
      'Architecture multi-agents',
      'Fine-tuning de modèle',
      'Intégration ERP / SI legacy',
      'Génération de contenu IA',
      'Hébergement souverain self-hosted',
    ],
    options: [
      { label: 'Langue supplémentaire', price: '+290 € HT' },
      { label: '500 conversations supplémentaires / mois', price: '+24 € HT/mois' },
      { label: 'Génération contenu IA (blog, RS)', price: '+990 € HT' },
      { label: 'Automatisation workflow n8n intégrée', price: '+990 € HT' },
      { label: 'Formation équipe (jusqu\'à 5 personnes)', price: '+390 € HT' },
    ],
    maintenanceItems: [
      'Surveillance 24/7 + alertes',
      'Mise à jour base de connaissances (2×/mois)',
      'Rapport mensuel de performance',
      '1h d\'optimisation incluse / mois',
      'Support prioritaire (délai 48h)',
    ],
  },
  {
    id: 'premium',
    name: 'Premium IA',
    tagline: 'Système multi-agents. Développement sur mesure. RGPD souverain.',
    price: 7999,
    monthly: 189,
    delivery: '6 à 12 semaines',
    borderColor: 'border-[#5db8f0] dark:border-indigo-500',
    bullets: [
      'Jusqu\'à 3 agents IA spécialisés (vente, support, SEO)',
      'Architecture RAG sur données volumineuses',
      'Hébergement souverain France, RGPD',
      'Intégration profonde dans votre SI',
    ],
    included: [
      'Jusqu\'à 3 agents IA spécialisés (vente, support, contenu, SEO)',
      'Architecture multi-agents avec orchestration',
      'RAG sur base documentaire volumineuse (illimité)',
      'Fine-tuning de modèle open source si pertinent',
      'Hébergement souverain France (serveurs OVH)',
      'Conformité RGPD complète + DPA',
      'Intégration profonde SI (API, webhooks, connecteurs)',
      'Dashboard BI de pilotage',
      'Formation équipe 4h + documentation vidéo',
      'Accompagnement stratégique 3 mois',
      'Support dédié 7j/7 (délai 24h)',
      'Réunion mensuelle de suivi',
    ],
    notIncluded: [
      'Budget publicitaire (Ads)',
      'Community management',
      'Développements backend hors IA',
      'Application mobile native (sur devis)',
    ],
    options: [
      { label: 'Agent IA supplémentaire', price: '+1 990 € HT' },
      { label: 'Application mobile avec IA intégrée', price: 'Sur devis' },
      { label: 'Accompagnement 6 mois supplémentaires', price: '+1 490 € HT' },
      { label: 'Audit de sécurité IA (pentest)', price: '+990 € HT' },
    ],
    maintenanceItems: [
      'Surveillance temps réel + alertes immédiates',
      'Mise à jour base de connaissances illimitée',
      'Fine-tuning mensuel du modèle',
      'Rapport mensuel avancé + réunion de suivi',
      'Support dédié 7j/7 (délai 24h)',
      'Optimisation continue sur suggestion',
    ],
  },
];

const USE_CASES = [
  { sector: 'Cabinet médical / Paramédical', useCase: 'Chatbot FAQ + prise de rendez-vous + conformité HDS', pack: 'Essentiel IA' },
  { sector: 'Agence immobilière', useCase: 'Qualification des acheteurs/vendeurs + scoring + transfert CRM', pack: 'Business IA' },
  { sector: 'E-commerce', useCase: 'SAV automatisé 24/7 + recommandations produits + suivi commande', pack: 'Business IA' },
  { sector: 'SaaS / B2B tech', useCase: 'Onboarding IA + support tier 1 + génération de contenu', pack: 'Premium IA' },
  { sector: 'Cabinet d\'avocats', useCase: 'Qualification des demandes + assistant juridique RAG interne', pack: 'Business IA' },
  { sector: 'Restaurant / Hôtellerie', useCase: 'Chatbot réservation + FAQ + synchronisation PMS', pack: 'Essentiel IA' },
];

const MODELS = [
  { name: 'Claude (Anthropic)', strength: 'Raisonnement complexe, conformité', color: 'text-orange-600 dark:text-orange-400' },
  { name: 'Mistral', strength: 'Open source, souveraineté, français', color: 'text-blue-600 dark:text-blue-400' },
  { name: 'GPT-4o (OpenAI)', strength: 'Multimodal, éco-système vaste', color: 'text-green-600 dark:text-green-400' },
  { name: 'LLama 3 (Meta)', strength: 'Self-hosted gratuit, RGPD total', color: 'text-purple-600 dark:text-purple-400' },
];

const FAQ = [
  {
    q: 'Quelle est la différence entre un chatbot classique et un agent IA RAG ?',
    a: "Un chatbot classique répond à partir d'un arbre de décision figé. Un agent IA RAG (Retrieval-Augmented Generation) indexe votre contenu réel — site, PDF, Notion, CRM — et génère des réponses précises basées sur VOS données. Il comprend les questions en langage naturel, gère les nuances et apprend de votre base. Le résultat : zéro réponse générique, 100% pertinente.",
  },
  {
    q: 'Mes données restent-elles confidentielles avec l\'IA ?',
    a: "Oui. Nous configurons les modèles pour que vos données ne servent jamais à entraîner des modèles tiers. Pour les projets sensibles (santé, juridique, données clients critiques), nous recommandons un modèle open source self-hosted (Mistral ou LLama) sur des serveurs en France. Les données ne quittent jamais votre infrastructure.",
  },
  {
    q: 'Quelle est la différence entre Claude, GPT et Mistral ?',
    a: "Claude (Anthropic) excelle dans le raisonnement complexe et la conformité — c'est notre recommandation pour les agents IA critiques. GPT-4o est multimodal et a l'écosystème le plus large. Mistral est open source, souverain et disponible en self-hosted — idéal pour les données sensibles et les budgets serrés. Nous choisissons toujours le modèle adapté à votre cas, pas le plus cher.",
  },
  {
    q: 'Le chatbot IA peut-il parler plusieurs langues ?',
    a: "Oui. Les LLM modernes (Claude, GPT, Mistral) sont nativement multilingues. Nous configurons la détection automatique de la langue et les réponses dans la langue de l'utilisateur. Le Pack Essentiel inclut 1 langue, le Business inclut 3 langues, le Premium en langues illimitées.",
  },
  {
    q: 'Comment l\'agent IA est-il maintenu et amélioré dans le temps ?',
    a: "L'agent IA s'améliore avec l'usage. Chaque mois, nous analysons les conversations (questions sans réponse, taux de satisfaction, handoffs non nécessaires) et optimisons les prompts, ajoutons des sources et affinons le scoring. En Pack Business, 1h d'optimisation est incluse chaque mois. En Pack Premium, l'optimisation est continue.",
  },
  {
    q: 'Peut-on intégrer l\'IA dans mon site existant sans le refaire ?',
    a: "Oui. Nous intégrons l'assistant IA dans votre site existant via un widget (quelques lignes de JavaScript) ou une API. Pas besoin de refaire votre site — l'IA s'adapte à votre charte graphique et votre identité. Pour les intégrations plus profondes (personnalisation dynamique, recommandations), nous travaillons directement dans votre CMS ou backend.",
  },
  {
    q: 'Quel budget prévoir pour un projet IA de A à Z ?',
    a: "Un chatbot FAQ simple : 1 499 € HT + 39 €/mois. Un agent IA commercial complet avec CRM : 3 999 € HT + 89 €/mois. Un système multi-agents avec hébergement souverain : à partir de 7 999 € HT. Notre audit gratuit vous donne une estimation précise adaptée à votre cas d'usage.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Le chatbot IA a réduit notre charge de support de 68%. Les clients obtiennent une réponse précise en 3 secondes, 24h/24. Nos agents se concentrent désormais sur les cas complexes.",
    name: 'Claire M.',
    role: 'Directrice Customer Success',
    company: 'SaaS B2B, Bordeaux',
    initials: 'CM',
    color: 'bg-violet-100 text-[#22d3ee]',
  },
  {
    quote: "L'agent IA qualifiant a transformé notre prospection. On ne parle plus qu'à des leads chauds. Le taux de closing est passé de 12% à 31% en 6 semaines.",
    name: 'Marc L.',
    role: 'Directeur commercial',
    company: 'Agence immobilière, Paris',
    initials: 'ML',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    quote: "L'assistant RAG connaît tous nos 800 produits par cœur. Les clients trouvent exactement ce qu'ils cherchent sans passer par notre SAV. Remarquable.",
    name: 'Anne-Sophie T.',
    role: 'CEO',
    company: 'E-commerce mode, Lyon',
    initials: 'AT',
    color: 'bg-cyan-100 text-cyan-700',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export function IntegrationIAPageClient() {
  const [selectedPack, setSelectedPack] = useState<PackId>('business');
  const [expandedService, setExpandedService] = useState<number | null>(null);

  const activePack = PACKS.find((p) => p.id === selectedPack)!;

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[#050510]">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-24 overflow-hidden bg-slate-950">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#5db8f0]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[300px] bg-[#5db8f0]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5db8f0]/10 border border-[#5db8f0]/20 text-[#5db8f0] text-sm font-medium mb-6">
              <Brain size={14} />
              <span>Chatbots IA · Agents RAG · LLM · Claude · Mistral · GPT</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              L'IA intégrée dans votre site{' '}
              <span className="bg-gradient-to-r from-[#5db8f0] to-[#22d3ee] bg-clip-text text-transparent">
                et vos outils métier
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Chatbots IA, agents RAG, intégration LLM, génération de contenu, automatisation SEO.
              Nous déployons des solutions IA concrètes, connectées à vos données, avec un ROI mesurable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <LocalizedLink
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-[#050510] transition-all duration-300"
                style={{ background: 'linear-gradient(90deg, #5db8f0, #22d3ee)', boxShadow: '0 4px 20px rgba(93,184,240,0.35)' }}
              >
                <Brain size={18} />
                Audit IA gratuit
                <ArrowRight size={16} />
              </LocalizedLink>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              >
                Voir les tarifs
                <ChevronDown size={16} />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {STATS.map((stat, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                  <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEMS ──────────────────────────────────────────────────── */}
        <section className="py-20 bg-[#0e1b3d]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Vos défis actuels
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Les entreprises qui n'intègrent pas l'IA en 2026 laissent leurs concurrents gagner en efficacité
                à chaque interaction client.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROBLEMS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="rounded-xl border border-white/10 bg-[#0e1b3d]/40 p-6 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${p.color}`}>
                      <Icon size={22} />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-sm leading-snug">{p.title}</h3>
                    <p className="text-slate-400 text-sm">{p.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SERVICES ──────────────────────────────────────────────────── */}
        <section className="py-20 bg-[#050510]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Nos solutions d'intégration IA
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Du chatbot FAQ simple à l'architecture multi-agents complexe, nous avons une solution adaptée à votre maturité IA.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((service, i) => {
                const Icon = service.icon;
                const isExpanded = expandedService === i;
                return (
                  <div
                    key={i}
                    className={`rounded-xl border-2 ${service.accentColor} bg-[#0e1b3d]/30 p-6 cursor-pointer hover:shadow-lg transition-all duration-300`}
                    onClick={() => setExpandedService(isExpanded ? null : i)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Icon size={20} className="text-slate-300" />
                      </div>
                      <span className={`${service.badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                        {service.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-slate-400 text-sm mb-3">{service.desc}</p>
                    {isExpanded && (
                      <ul className="mt-3 space-y-2 border-t border-slate-100 dark:border-slate-700 pt-3">
                        {service.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                            <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                    <button className="mt-2 text-xs text-[#5db8f0] hover:text-[#22d3ee] font-medium">
                      {isExpanded ? 'Masquer les détails ↑' : 'Voir les détails ↓'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── MODÈLES IA ────────────────────────────────────────────────── */}
        <section className="py-14 bg-[#0e1b3d]/30 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-400 font-medium mb-8 uppercase tracking-wider">
              Modèles IA que nous maîtrisons
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {MODELS.map((model, i) => (
                <div key={i} className="rounded-xl bg-[#0e1b3d]/40 border border-white/10 p-4 text-center">
                  <div className={`font-bold text-sm mb-1 ${model.color}`}>{model.name}</div>
                  <div className="text-xs text-slate-400">{model.strength}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 mt-6">
              Nous choisissons toujours le modèle le plus adapté à votre cas d'usage — pas le plus cher.
            </p>
          </div>
        </section>

        {/* ── CAS D'USAGE ───────────────────────────────────────────────── */}
        <section className="py-20 bg-[#050510]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Exemples par secteur</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Voici comment nous intégrons l'IA dans différents secteurs.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {USE_CASES.map((uc, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-[#0e1b3d]/30 p-5">
                  <div className="text-xs font-semibold text-[#22d3ee] dark:text-[#5db8f0] uppercase tracking-wider mb-2">{uc.sector}</div>
                  <p className="text-sm text-slate-300 mb-3">{uc.useCase}</p>
                  <span className="inline-block text-xs bg-violet-100 dark:bg-violet-900/30 text-[#22d3ee] dark:text-[#5db8f0] px-3 py-1 rounded-full font-medium">
                    {uc.pack}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────────────────────────── */}
        <section id="pricing" className="py-20 bg-[#0e1b3d]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Nos packs intégration IA
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Des prix transparents, sans surprise. TVA non applicable (art. 293B du CGI).
              </p>
            </div>

            {/* Sélecteur mobile */}
            <div className="flex gap-2 mb-8 justify-center sm:hidden">
              {PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => setSelectedPack(pack.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPack === pack.id
                      ? 'bg-[#5db8f0] text-[#050510]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {pack.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Cards desktop */}
            <div className="hidden sm:grid grid-cols-3 gap-6 mb-10">
              {PACKS.map((pack) => (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPack(pack.id)}
                  className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ${pack.borderColor} ${
                    selectedPack === pack.id
                      ? 'shadow-xl bg-[#0e1b3d]/40 scale-[1.02]'
                      : 'bg-[#0e1b3d]/40 hover:shadow-md'
                  }`}
                >
                  {pack.badge && (
                    <span className={`absolute -top-3 left-1/2 -translate-x-1/2 ${pack.badgeColor} text-white text-xs font-bold px-4 py-1 rounded-full`}>
                      {pack.badge}
                    </span>
                  )}
                  <h3 className="font-bold text-white text-lg mb-1">{pack.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{pack.tagline}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">{pack.price.toLocaleString('fr-FR')} €</span>
                    <span className="text-slate-400 text-sm ml-1">HT</span>
                    <div className="text-sm text-slate-400">+ {pack.monthly} €/mois maintenance</div>
                  </div>
                  <div className="text-xs text-slate-400 mb-4">⏱ Délai : {pack.delivery}</div>
                  <ul className="space-y-2">
                    {pack.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Détails pack sélectionné */}
            <div className="rounded-2xl border border-white/10 bg-[#0e1b3d]/40 p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{activePack.name}</h3>
                  <p className="text-slate-400 text-sm">{activePack.tagline}</p>
                </div>
                <LocalizedLink
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#050510] transition-all duration-300"
                  style={{ background: 'linear-gradient(90deg, #5db8f0, #22d3ee)', boxShadow: '0 4px 15px rgba(93,184,240,0.3)' }}
                >
                  Choisir {activePack.name}
                  <ArrowRight size={14} />
                </LocalizedLink>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Check size={16} className="text-emerald-500" /> Inclus
                  </h4>
                  <ul className="space-y-2">
                    {activePack.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <Check size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <XIcon size={16} className="text-rose-400" /> Non inclus
                  </h4>
                  <ul className="space-y-2">
                    {activePack.notIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                        <XIcon size={13} className="text-rose-400 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Options disponibles</h4>
                  <ul className="space-y-2 mb-6">
                    {activePack.options.map((opt, i) => (
                      <li key={i} className="flex items-start justify-between gap-2 text-sm">
                        <span className="text-slate-300">{opt.label}</span>
                        <span className="text-[#22d3ee] dark:text-[#5db8f0] font-medium shrink-0">{opt.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-[#0e1b3d]/30 rounded-xl p-4 border border-white/10">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Maintenance {activePack.monthly} €/mois
                    </div>
                    <ul className="space-y-1">
                      {activePack.maintenanceItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle size={11} className="text-emerald-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-slate-400 mt-6">
              Paiement échelonné disponible · 40% à la commande, 30% à la validation, 30% à la livraison
            </p>
          </div>
        </section>

        {/* ── TÉMOIGNAGES ───────────────────────────────────────────────── */}
        <section className="py-20 bg-[#050510]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Ce que disent nos clients</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-[#0e1b3d]/30 p-6">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className="text-[#22d3ee] fill-[#22d3ee]" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-xs font-bold`}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role} · {t.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-20 bg-[#0e1b3d]/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Questions fréquentes</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-xl border border-white/10 bg-[#0e1b3d]/40 overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 text-left text-sm font-semibold text-white hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Lien vers articles liés */}
            <div className="mt-10 rounded-xl border border-white/10 bg-[#0e1b3d]/40 p-6">
              <h3 className="font-semibold text-white mb-4">Pour aller plus loin</h3>
              <ul className="space-y-3">
                <li>
                  <LocalizedLink href="/blog/integrer-ia-site-web-2025" className="flex items-center gap-2 text-sm text-[#22d3ee] dark:text-[#5db8f0] hover:underline">
                    <ArrowRight size={14} />
                    Comment intégrer une IA dans votre site web
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/blog/ia-agents-remplacent-equipes-2026" className="flex items-center gap-2 text-sm text-[#22d3ee] dark:text-[#5db8f0] hover:underline">
                    <ArrowRight size={14} />
                    IA agentique : ce que font déjà vos concurrents
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/blog/site-vitrine-ia-machine-leads" className="flex items-center gap-2 text-sm text-[#22d3ee] dark:text-[#5db8f0] hover:underline">
                    <ArrowRight size={14} />
                    7 façons d'utiliser l'IA pour générer des leads
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/blog/automatisation-ia-pme-prix-2026" className="flex items-center gap-2 text-sm text-[#22d3ee] dark:text-[#5db8f0] hover:underline">
                    <ArrowRight size={14} />
                    Automatisation IA pour PME : prix réels 2026
                  </LocalizedLink>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-slate-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5db8f0]/10 border border-[#5db8f0]/20 text-[#5db8f0] text-sm font-medium mb-6">
              <Sparkles size={14} />
              Audit IA gratuit · Valorisé 490 € · Sans engagement
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Prêt à intégrer l'IA dans votre activité ?
            </h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
              30 minutes pour identifier vos 3 cas d'usage IA prioritaires et leur ROI estimé.
              Gratuit, sans engagement, sans jargon technique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LocalizedLink
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-[#050510] transition-all duration-300"
                style={{ background: 'linear-gradient(90deg, #5db8f0, #22d3ee)', boxShadow: '0 4px 20px rgba(93,184,240,0.35)' }}
              >
                <Brain size={18} />
                Demander l'audit IA gratuit
                <ArrowRight size={16} />
              </LocalizedLink>
              <LocalizedLink
                href="/blog/integrer-ia-site-web-2025"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white transition-all duration-300"
              >
                Lire notre guide IA
                <ArrowRight size={16} />
              </LocalizedLink>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
