'use client';

import React, { useState } from 'react';
import {
  Zap,
  Bot,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Shield,
  Database,
  RefreshCw,
  Target,
  BarChart3,
  Workflow,
  ChevronDown,
  Check,
  X as XIcon,
  Sparkles,
  Mail,
  Users,
  MessageSquare,
  GitBranch,
  Cpu,
  Star,
  AlertTriangle,
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LocalizedLink } from '@/components/localized-link';
import { Button } from '@/components/ui/button';
import { ResponsiveCards } from '@/components/ui/cards-carousel';
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
  { value: '12h', label: 'économisées / semaine en moyenne', color: 'text-white' },
  { value: '3×', label: 'plus de leads qualifiés traités', color: 'text-white' },
  { value: '94%', label: 'de réduction des tâches manuelles', color: 'text-white' },
];

const PROBLEMS = [
  {
    icon: Clock,
    title: 'Vos équipes passent des heures sur des tâches répétitives',
    text: "Saisie manuelle, copier-coller entre outils, relances email, transferts de données : chaque minute perdue est une minute en moins pour votre cœur de métier.",
    color: 'text-white bg-white/5',
  },
  {
    icon: AlertTriangle,
    title: 'Des leads tombent dans les failles entre vos outils',
    text: "Un formulaire rempli le soir, une relance oubliée, un CRM non synchronisé : vous perdez des opportunités sans même le savoir.",
    color: 'text-rose-400 bg-rose-400/10',
  },
  {
    icon: Database,
    title: 'Vos données sont éparpillées entre 5, 10, 15 outils',
    text: "Google Sheets, HubSpot, Notion, Airtable, Slack, Gmail... la circulation de l'information coûte cher en énergie et génère des erreurs.",
    color: 'text-white bg-white/5',
  },
  {
    icon: TrendingUp,
    title: "Vous ne savez pas par quoi commencer",
    text: "L'automatisation fait peur. Vous ne savez pas quels workflows ont le meilleur ROI, ni quel outil choisir entre n8n, Make et Zapier.",
    color: 'text-white bg-white/5',
  },
];

const SERVICES = [
  {
    icon: Target,
    title: 'Audit des processus automatisables',
    desc: 'Nous cartographions vos flux, identifions les tâches répétitives à fort volume et calculons le ROI potentiel de chaque automatisation. Résultat : une feuille de route priorisée.',
    details: ['Cartographie complète de vos workflows existants', 'Matrice impact / complexité / coût', 'ROI estimé par processus', 'Recommandation Make vs n8n vs Zapier'],
    badge: 'Offert',
    badgeColor: 'bg-emerald-500',
    accentColor: 'border-emerald-400',
  },
  {
    icon: Workflow,
    title: 'Workflows n8n / Make / Zapier',
    desc: 'Nous construisons vos automatisations sur mesure : formulaire→CRM, qualification de leads, synchronisation d\'outils, notifications, relances automatiques, reporting.',
    details: ['Connexion formulaire → CRM / Airtable / Notion', 'Relances automatiques par email ou SMS', 'Synchronisation multi-outils (Slack, Gmail, Drive)', 'Alertes et notifications en temps réel'],
    badge: 'À partir de 999 €',
    badgeColor: 'bg-gray-900',
    accentColor: 'border-white',
  },
  {
    icon: Bot,
    title: 'Agent IA commercial',
    desc: 'Un agent IA autonome qualifie vos leads entrants 24h/24, répond aux questions fréquentes, prend les rendez-vous et transmet les prospects chauds à votre équipe.',
    details: ['Qualification automatique des leads entrants', 'Réponses aux questions fréquentes (FAQ)', 'Intégration calendrier (Calendly, Google Agenda)', 'Handoff vers CRM avec scoring'],
    badge: 'À partir de 2 499 €',
    badgeColor: 'bg-violet-500',
    accentColor: 'border-gray-400',
  },
  {
    icon: Mail,
    title: 'Automatisation marketing & nurturing',
    desc: 'Séquences email intelligentes, lead scoring, personnalisation dynamique, segmentation automatique : votre marketing travaille même quand vous dormez.',
    details: ['Séquences de nurturing multi-étapes', 'Lead scoring automatique', 'Segmentation comportementale', 'Intégration Brevo, Mailchimp, ActiveCampaign'],
    badge: 'À partir de 1 499 €',
    badgeColor: 'bg-gray-700',
    accentColor: 'border-gray-400',
  },
  {
    icon: RefreshCw,
    title: 'Synchronisation CRM / ERP / Facturation',
    desc: "Connectez HubSpot, Notion, Airtable, Pennylane, Sellsy, QuickBooks et tous vos outils métier. Fini les doubles saisies et les données incohérentes.",
    details: ['Connexion bidirectionnelle CRM ↔ outils', 'Synchronisation devis / facturation automatique', 'Mise à jour temps réel des fiches contacts', 'Archivage et traçabilité des échanges'],
    badge: 'À partir de 1 499 €',
    badgeColor: 'bg-rose-500',
    accentColor: 'border-rose-400',
  },
  {
    icon: BarChart3,
    title: 'Monitoring & optimisation continue',
    desc: 'Vos workflows sont surveillés, les erreurs détectées en temps réel, les volumes analysés. Un rapport mensuel vous indique les performances et les pistes d\'amélioration.',
    details: ['Surveillance des workflows 24h/24', 'Alertes en cas d\'erreur ou d\'anomalie', 'Rapport mensuel de performance', 'Optimisation continue sur suggestion'],
    badge: 'Abonnement mensuel',
    badgeColor: 'bg-slate-500',
    accentColor: 'border-slate-400',
  },
];

type PackId = 'starter' | 'business' | 'full';

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
    id: 'starter',
    name: 'Starter Auto',
    tagline: 'Votre premier workflow. ROI en 30 jours.',
    price: 999,
    monthly: 29,
    delivery: '1 à 2 semaines',
    borderColor: 'border-white/10',
    bullets: [
      'Audit des processus (jusqu\'à 5 workflows identifiés)',
      '1 workflow complexe livré et testé',
      'Formation 30 min + documentation',
      'Support email 30 jours',
    ],
    included: [
      'Audit initial et cartographie',
      '1 workflow n8n ou Make (jusqu\'à 8 étapes)',
      'Connexion à 3 outils maximum',
      'Tests et validation en production',
      'Documentation du workflow',
      'Formation 30 min en visio',
      'Support email 30 jours post-livraison',
    ],
    notIncluded: [
      'Agents IA autonomes',
      'Plus de 1 workflow',
      'Connexion à plus de 3 outils',
      'Monitoring continu',
      'Rapport mensuel',
    ],
    options: [
      { label: 'Workflow supplémentaire', price: '+690 € HT' },
      { label: 'Intégration outil supplémentaire', price: '+190 € HT' },
      { label: 'Extension support 3 mois', price: '+149 € HT' },
    ],
    maintenanceItems: [
      'Surveillance mensuelle du workflow',
      'Mises à jour compatibilité',
      'Support email (délai 72h)',
    ],
  },
  {
    id: 'business',
    name: 'Business Auto',
    tagline: 'Plusieurs processus connectés. 1 agent IA inclus.',
    price: 2999,
    monthly: 79,
    delivery: '3 à 5 semaines',
    badge: 'Le plus populaire',
    badgeColor: 'bg-gray-900',
    popular: true,
    borderColor: 'border-white',
    bullets: [
      'Audit complet (processus illimités)',
      '3 à 5 workflows sur mesure',
      '1 agent IA qualification leads',
      'Monitoring mensuel inclus',
    ],
    included: [
      'Audit complet de tous vos processus',
      '3 à 5 workflows n8n ou Make (jusqu\'à 20 étapes chacun)',
      'Connexion à 8 outils maximum',
      '1 agent IA qualification / réponse leads',
      'Intégration CRM (HubSpot, Notion, Airtable)',
      'Séquence de nurturing email (jusqu\'à 5 étapes)',
      'Tests et validation en production',
      'Formation 1h en visio + guide PDF',
      'Monitoring mensuel + rapport de performance',
      'Support prioritaire email (délai 48h)',
    ],
    notIncluded: [
      'Plus de 5 workflows',
      'Connexion à plus de 8 outils',
      'Agents IA avancés multi-sources',
      'Développement IA sur mesure',
      'Intégration ERP / logiciel legacy',
    ],
    options: [
      { label: 'Workflow supplémentaire', price: '+590 € HT' },
      { label: 'Agent IA supplémentaire', price: '+1 490 € HT' },
      { label: 'Intégration ERP / logiciel legacy', price: 'Sur devis' },
      { label: 'Formation équipe (jusqu\'à 5 personnes)', price: '+390 € HT' },
    ],
    maintenanceItems: [
      'Surveillance 24/7 des workflows',
      'Alertes en temps réel',
      'Mises à jour et corrections',
      'Rapport mensuel de performance',
      'Support prioritaire (délai 48h)',
      '2 modifications de workflow / mois',
    ],
  },
  {
    id: 'full',
    name: 'Full Automation',
    tagline: 'Infrastructure complète. Agents IA. ROI garanti.',
    price: 5999,
    monthly: 149,
    delivery: '6 à 10 semaines',
    borderColor: 'border-white/10',
    bullets: [
      'Audit + roadmap 6 mois',
      'Workflows illimités',
      'Agents IA multi-sources',
      'Monitoring temps réel + accompagnement',
    ],
    included: [
      'Audit complet + roadmap d\'automatisation 6 mois',
      'Workflows illimités (n8n self-hosted ou cloud)',
      'Connexion illimitée à vos outils',
      'Jusqu\'à 3 agents IA (leads, SEO, contenu, support)',
      'Intégration CRM + ERP + facturation',
      'Séquences marketing automation complètes',
      'Dashboard de pilotage personnalisé',
      'Formation équipe 4h + documentation vidéo',
      'Hébergement n8n self-hosted inclus (si besoin)',
      'Monitoring temps réel + alertes',
      'Rapport mensuel avancé + réunion de suivi',
      'Support dédié (délai 24h)',
      '1 séance stratégie IA / mois pendant 3 mois',
    ],
    notIncluded: [
      'Budget publicitaire (Ads)',
      'Community management',
      'Développements backend complexes hors workflow',
      'Intégrations legacy sans API (sur devis)',
    ],
    options: [
      { label: 'Hébergement n8n self-hosted dédié', price: '+390 € HT / an' },
      { label: 'Agent IA supplémentaire', price: '+990 € HT' },
      { label: 'Intégration legacy (sans API)', price: 'Sur devis' },
      { label: 'Accompagnement 6 mois supplémentaires', price: '+990 € HT' },
    ],
    maintenanceItems: [
      'Surveillance temps réel + alertes immédiates',
      'Mises à jour proactives',
      'Rapport mensuel avancé',
      'Réunion mensuelle de suivi (30 min)',
      'Support dédié 7j/7 (délai 24h)',
      'Modifications illimitées',
      'Optimisation continue sur suggestion',
    ],
  },
];

const PROCESS_STEPS = [
  {
    id: '01',
    title: 'Audit gratuit',
    duration: '30 à 60 min',
    desc: 'On analyse vos outils, vos processus et vos douleurs. Vous repartez avec une liste des workflows à automatiser en priorité et leur ROI estimé.',
    bring: 'Vos outils, vos processus',
    bg: 'bg-white/5',
    text: 'text-white',
    border: 'border-white/20',
  },
  {
    id: '02',
    title: 'Conception',
    duration: '3 à 5 jours',
    desc: 'Nous modélisons chaque workflow, choisissons les bons outils et validons l\'architecture avec vous avant de coder la moindre ligne.',
    bring: 'Vos accès outils (lecture seule)',
    bg: 'bg-white/5',
    text: 'text-white',
    border: 'border-white/20',
  },
  {
    id: '03',
    title: 'Construction & tests',
    duration: '1 à 8 semaines',
    desc: 'Nous développons les workflows, les connectons à vos outils et les testons sur des données réelles. Vous validez chaque étape.',
    bring: 'Vos données de test',
    bg: 'bg-white/5',
    text: 'text-white',
    border: 'border-white/20',
  },
  {
    id: '04',
    title: 'Mise en production',
    duration: '1 jour',
    desc: 'Basculement en production avec surveillance renforcée les 7 premiers jours. Formation de votre équipe incluse.',
    bring: '30 min pour la formation',
    bg: 'bg-white/5',
    text: 'text-white',
    border: 'border-white/20',
  },
];

const TOOLS = [
  { name: 'n8n', category: 'Orchestration' },
  { name: 'Make', category: 'Orchestration' },
  { name: 'Zapier', category: 'Orchestration' },
  { name: 'HubSpot', category: 'CRM' },
  { name: 'Notion', category: 'CRM' },
  { name: 'Airtable', category: 'CRM' },
  { name: 'Brevo', category: 'Email' },
  { name: 'Mailchimp', category: 'Email' },
  { name: 'Slack', category: 'Communication' },
  { name: 'Gmail / Outlook', category: 'Communication' },
  { name: 'Google Drive', category: 'Stockage' },
  { name: 'Calendly', category: 'Agenda' },
  { name: 'Claude / GPT', category: 'IA' },
  { name: 'Pennylane', category: 'Facturation' },
  { name: 'Stripe', category: 'Paiement' },
  { name: 'Doctolib', category: 'Santé' },
];

const FAQ = [
  {
    q: 'Quelle est la différence entre n8n, Make et Zapier ?',
    a: 'Les trois sont des plateformes d\'automatisation no-code. Zapier est le plus simple mais le plus cher à l\'échelle. Make (ex-Integromat) est notre recommandation par défaut : 12€/mois pour 10 000 opérations, serveurs EU, connecteurs IA natifs. n8n est indispensable si vous déployez des agents IA autonomes ou traitez des données sensibles — l\'édition Community est open-source et gratuite en self-hosted. Nous choisissons l\'outil adapté à votre cas d\'usage, pas celui qui coûte le plus cher.',
  },
  {
    q: 'Combien de temps avant de voir un ROI ?',
    a: 'Pour un workflow simple (formulaire→CRM→notification), le ROI est immédiat dès la mise en production : 0 saisie manuelle, 0 lead raté. Pour un agent IA de qualification, comptez 2 à 4 semaines pour affiner les prompts et les seuils de scoring. La plupart de nos clients amortissent leur investissement en moins de 3 mois.',
  },
  {
    q: 'Mes données passent-elles par vos serveurs ?',
    a: 'Non. Nous configurons les automatisations directement dans Make cloud (serveurs AWS EU) ou dans votre propre instance n8n self-hosted. Vos données ne transitent pas par nos serveurs — elles circulent entre vos outils via leurs API. Pour les données sensibles (santé, données clients critiques), nous recommandons le self-hosting n8n sur un VPS en France.',
  },
  {
    q: 'Puis-je modifier les workflows après livraison ?',
    a: 'Oui. Les workflows sont documentés et vous êtes formés pour les comprendre. En Pack Starter, 2 modifications mineures sont incluses dans les 30 jours post-livraison. En Pack Business, 2 modifications par mois sont incluses dans l\'abonnement. En Full Automation, les modifications sont illimitées. Pour des ajouts majeurs, nous établissons un devis.',
  },
  {
    q: 'Que se passe-t-il si un workflow plante ?',
    a: 'En Pack Business et Full Automation, la surveillance est continue. Vous recevez une alerte automatique (email ou Slack) dès qu\'une exécution échoue, avec le détail de l\'erreur. Nous intervenons dans les 48h (Business) ou 24h (Full Automation) pour corriger. En Pack Starter, vous êtes alerté par email et nous intervenons sur demande.',
  },
  {
    q: 'Peut-on automatiser des processus métier très spécifiques ?',
    a: 'Oui, c\'est justement notre valeur ajoutée. Nous avons automatisé des processus dans des secteurs très variés : cabinets médicaux, agences immobilières, e-commerce, SaaS, cabinets d\'avocats, restaurants. Si votre outil a une API (ou même un webhook), nous pouvons l\'intégrer. Pour les logiciels legacy sans API, nous évaluons des solutions alternatives (scraping, export CSV automatisé, RPA).',
  },
  {
    q: 'Comment se déroule l\'audit gratuit ?',
    a: 'Un appel de 30 à 60 minutes avec vous (ou votre équipe). On passe en revue vos outils, vos processus quotidiens et les tâches qui vous prennent le plus de temps. Vous repartez avec une liste priorisée des workflows à automatiser, l\'outil recommandé et une estimation de ROI. Sans engagement de votre part.',
  },
];

const TESTIMONIALS = [
  {
    quote: "En 3 semaines, NeuraWeb a automatisé notre traitement des devis entrants. On a récupéré 8h par semaine, et notre taux de réponse est passé de 6h à 12 minutes.",
    name: 'Alexandre D.',
    role: 'Directeur commercial',
    company: 'Agence immobilière, Paris',
    initials: 'AD',
    color: 'bg-white/10 text-white',
  },
  {
    quote: "Le workflow de qualification de leads n8n a transformé notre équipe commerciale. Les commerciaux ne traitent plus que des leads chauds. Le CA a augmenté de 34% en 2 mois.",
    name: 'Sophie M.',
    role: 'CEO',
    company: 'SaaS B2B, Lyon',
    initials: 'SM',
    color: 'bg-white/10 text-white',
  },
  {
    quote: "J'avais peur que ce soit compliqué. L'audit gratuit a tout clarifié. On est partis sur le pack Business, livré en 4 semaines. La synchro Airtable-Gmail-Slack fonctionne impeccablement.",
    name: 'Thomas R.',
    role: 'Fondateur',
    company: 'Cabinet de conseil, Bordeaux',
    initials: 'TR',
    color: 'bg-emerald-400/20 text-emerald-400',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export function AutomatisationPageClient() {
  const [selectedPack, setSelectedPack] = useState<PackId>('business');
  const [expandedService, setExpandedService] = useState<number | null>(null);

  const activePack = PACKS.find((p) => p.id === selectedPack)!;

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: '#070F26' }}>
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20 text-white text-sm font-medium mb-6">
              <Zap size={14} />
              <span>Automatisation n8n · Make · Zapier · Agents IA</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Automatisez vos processus,{' '}
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                libérez votre potentiel
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Nous construisons vos workflows sur mesure avec n8n, Make ou Zapier, déployons des agents IA
              autonomes et connectons tous vos outils. Audit gratuit inclus, ROI mesurable en 30 jours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <LocalizedLink
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-gray-900 transition-all duration-300 hover:opacity-90"
                style={{ background: '#ffffff', boxShadow: '0 4px 20px rgba(255,255,255,0.2)' }}
              >
                <Zap size={18} />
                Demander l'audit gratuit
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
            <ResponsiveCards
              breakpoint="sm"
              gridClass="grid-cols-3 max-w-3xl mx-auto"
              gridGap="gap-6"
            >
              {STATS.map((stat, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 h-full">
                  <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </ResponsiveCards>
          </div>
        </section>

        {/* ── PROBLEMS ──────────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: '#F7FAFD' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0e1b3d] mb-4">
                Ça vous parle ?
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Les PME françaises perdent en moyenne <strong>12h par semaine</strong> sur des tâches que l'automatisation peut traiter en quelques secondes.
              </p>
            </div>
            <ResponsiveCards
              breakpoint="sm"
              gridClass="grid-cols-2 lg:grid-cols-4"
              gridGap="gap-6"
            >
              {PROBLEMS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="rounded-xl border border-slate-200 shadow-sm bg-white p-6 hover:shadow-md transition-shadow h-full">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${p.color}`}>
                      <Icon size={22} />
                    </div>
                    <h3 className="font-semibold text-[#0e1b3d] mb-2 text-sm leading-snug">{p.title}</h3>
                    <p className="text-slate-500 text-sm">{p.text}</p>
                  </div>
                );
              })}
            </ResponsiveCards>
          </div>
        </section>

        {/* ── SERVICES ──────────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: '#070F26' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ce que nous construisons pour vous
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                De l'audit initial au monitoring mensuel, nous couvrons toute la chaîne d'automatisation.
              </p>
            </div>
            <ResponsiveCards
              breakpoint="md"
              gridClass="grid-cols-2 lg:grid-cols-3"
              gridGap="gap-6"
            >
              {SERVICES.map((service, i) => {
                const Icon = service.icon;
                const isExpanded = expandedService === i;
                return (
                  <div
                    key={i}
                    className={`rounded-xl border-2 ${service.accentColor} bg-[#0e1b3d]/30 p-6 cursor-pointer hover:shadow-lg transition-all duration-300 h-full`}
                    onClick={() => setExpandedService(isExpanded ? null : i)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0e1b3d]/40 flex items-center justify-center">
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
                    <button className="mt-2 text-xs text-gray-500 hover:text-gray-800 font-medium">
                      {isExpanded ? 'Masquer les détails ↑' : 'Voir les détails ↓'}
                    </button>
                  </div>
                );
              })}
            </ResponsiveCards>
          </div>
        </section>

        {/* ── OUTILS ────────────────────────────────────────────────────── */}
        <section className="py-14 border-y border-slate-200" style={{ background: '#F7FAFD' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-500 font-medium mb-8 uppercase tracking-wider">
              Nous connectons vos outils
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {TOOLS.map((tool, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm text-slate-600 font-medium hover:border-white/40 transition-colors"
                >
                  {tool.name}
                  <span className="text-xs text-slate-500">{tool.category}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────────────────────────── */}
        <section id="pricing" className="py-20" style={{ background: '#070F26' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Nos packs automatisation
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
                      ? 'bg-white text-gray-900'
                      : 'bg-[#0e1b3d]/40 text-slate-300'
                  }`}
                >
                  {pack.name.replace(' Auto', '').replace(' Automation', '')}
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
                      ? 'shadow-xl bg-[#0e1b3d]/30 scale-[1.02]'
                      : 'bg-[#0e1b3d]/30 hover:shadow-md'
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
            <div className="rounded-2xl border border-white/10 bg-[#0e1b3d]/30 p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{activePack.name}</h3>
                  <p className="text-slate-400 text-sm">{activePack.tagline}</p>
                </div>
                <LocalizedLink
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300"
                  style={{ background: '#ffffff', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
                >
                  Choisir {activePack.name}
                  <ArrowRight size={14} />
                </LocalizedLink>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inclus */}
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

                {/* Non inclus */}
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <XIcon size={16} className="text-rose-500" /> Non inclus
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

                {/* Options + Maintenance */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Options disponibles</h4>
                  <ul className="space-y-2 mb-6">
                    {activePack.options.map((opt, i) => (
                      <li key={i} className="flex items-start justify-between gap-2 text-sm">
                        <span className="text-slate-300">{opt.label}</span>
                        <span className="text-white font-medium shrink-0">{opt.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-[#0e1b3d]/40 rounded-xl p-4 border border-white/10">
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

        {/* ── PROCESSUS ─────────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: '#F7FAFD' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0e1b3d] mb-4">
                Notre méthode en 4 étapes
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Du premier appel à la mise en production : un processus éprouvé, des livrables clairs à chaque étape.
              </p>
            </div>
            <ResponsiveCards
              breakpoint="sm"
              gridClass="grid-cols-2 lg:grid-cols-4"
              gridGap="gap-6"
            >
              {PROCESS_STEPS.map((step, i) => (
                <div key={i} className="rounded-xl border border-slate-200 shadow-sm bg-white p-6 h-full">
                  <div className={`text-3xl font-black ${step.text} mb-3 opacity-60`}>{step.id}</div>
                  <h3 className="font-bold text-[#0e1b3d] mb-1">{step.title}</h3>
                  <div className={`text-xs font-medium ${step.text} mb-3`}>⏱ {step.duration}</div>
                  <p className="text-slate-500 text-sm mb-3">{step.desc}</p>
                  <div className="text-xs text-slate-500 border-t border-slate-200 pt-3">
                    <strong>Vous apportez :</strong> {step.bring}
                  </div>
                </div>
              ))}
            </ResponsiveCards>
          </div>
        </section>

        {/* ── TÉMOIGNAGES ───────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: '#070F26' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Ce que disent nos clients</h2>
            </div>
            <ResponsiveCards
              breakpoint="md"
              gridClass="grid-cols-3"
              gridGap="gap-6"
            >
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6 h-full">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-xs font-bold`}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.role} · {t.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </ResponsiveCards>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: '#F7FAFD' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0e1b3d] mb-4">Questions fréquentes</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 text-left text-sm font-semibold text-[#0e1b3d] hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-sm text-slate-600 leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Lien vers articles liés */}
            <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-[#0e1b3d] mb-4">Pour aller plus loin</h3>
              <ul className="space-y-3">
                <li>
                  <LocalizedLink href="/blog/make-n8n-zapier-2026-pme-france" className="flex items-center gap-2 text-sm text-white hover:underline">
                    <ArrowRight size={14} />
                    Make vs n8n vs Zapier : comparatif 2026 pour PME françaises
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/blog/automatisation-n8n-guide" className="flex items-center gap-2 text-sm text-white hover:underline">
                    <ArrowRight size={14} />
                    Guide complet n8n : automatiser sans coder
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/blog/automatisation-ia-pme-prix-2026" className="flex items-center gap-2 text-sm text-white hover:underline">
                    <ArrowRight size={14} />
                    Automatisation IA pour PME : prix réels 2026
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/blog/3-workflows-agents-ia-pme" className="flex items-center gap-2 text-sm text-white hover:underline">
                    <ArrowRight size={14} />
                    3 workflows agents IA pour PME : ROI réel 2026
                  </LocalizedLink>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ─────────────────────────────────────────────────── */}
        <section className="py-24" style={{ background: '#070F26' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20 text-white text-sm font-medium mb-6">
              <Sparkles size={14} />
              Audit gratuit · Sans engagement
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Prêt à automatiser vos processus ?
            </h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
              30 minutes d'appel, une liste des workflows à automatiser en priorité et leur ROI estimé.
              Sans engagement, sans jargon technique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LocalizedLink
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all duration-300"
                style={{ background: '#ffffff', boxShadow: '0 4px 20px rgba(255,255,255,0.2)' }}
              >
                <Zap size={18} />
                Demander l'audit gratuit
                <ArrowRight size={16} />
              </LocalizedLink>
              <LocalizedLink
                href="/blog/automatisation-n8n-guide"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-300 border border-white/20 hover:border-white/40 hover:text-white transition-all duration-300"
              >
                Lire notre guide n8n
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
