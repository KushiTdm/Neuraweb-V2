'use client';

import React, { useRef, useState } from 'react';
import { useGsapReveal } from '@/hooks/use-gsap-reveal';
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
import { ResponsiveCards } from '@/components/ui/cards-carousel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type Lang = 'fr' | 'en' | 'es' | 'vi';
interface Props { lang: Lang }

// ═══════════════════════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════════════════════

const CONTENT: Record<Lang, {
  hero: { badge: string; h1: string; h1highlight: string; p: string; ctaAudit: string; ctaPricing: string };
  stats: { label: string }[];
  problems: { h2: string; subtitle: string; items: { title: string; text: string }[] };
  services: { h2: string; subtitle: string; items: { title: string; desc: string; details: string[]; badge: string }[] };
  models: { label: string; note: string };
  useCases: { h2: string; subtitle: string; items: { sector: string; context: string; solution: string; result: string; pack: string }[] };
  packs: {
    h2: string; subtitle: string; popular: string; ht: string; monthly: string; delivery: string;
    items: { name: string; tagline: string; bullets: string[]; included: string[]; notIncluded: string[]; options: { label: string; price: string }[]; maintenanceItems: string[] }[];
  };
  testimonials: { h2: string; items: { quote: string; name: string; role: string; company: string; initials: string; color: string }[] };
  faq: { h2: string; items: { q: string; a: string }[] };
  more: { h3: string; items: { label: string; href: string }[] };
  cta: { badge: string; h2: string; p: string; ctaAudit: string; ctaBlog: string; ctaBlogHref: string };
  detail: { included: string; notIncluded: string; options: string; maintenance: string; choose: string; payment: string };
  showDetails: string; hideDetails: string;
}> = {
  fr: {
    hero: {
      badge: 'Chatbots IA · Agents RAG · LLM · Claude · Mistral · GPT',
      h1: "L'IA intégrée dans votre site",
      h1highlight: 'et vos outils métier',
      p: "Chatbots IA, agents RAG, intégration LLM, génération de contenu, automatisation SEO. Nous déployons des solutions IA concrètes, connectées à vos données, avec un ROI mesurable.",
      ctaAudit: 'Audit IA gratuit',
      ctaPricing: 'Voir les tarifs',
    },
    stats: [
      { label: 'des demandes clients traitées automatiquement' },
      { label: 'disponibilité des assistants IA' },
      { label: 'plus de conversions avec un chatbot qualifiant' },
    ],
    problems: {
      h2: 'Vos défis actuels',
      subtitle: "Les entreprises qui n'intègrent pas l'IA en 2026 laissent leurs concurrents gagner en efficacité à chaque interaction client.",
      items: [
        { title: 'Votre équipe répond manuellement aux mêmes questions', text: "FAQ, tarifs, disponibilités, processus de commande : 70% des questions sont identiques. Un assistant IA les traite instantanément, 24h/24." },
        { title: 'Vos leads ne sont pas qualifiés avant de passer en vente', text: "Budget, besoin, timing, autorité décisionnelle : un agent IA pose les bonnes questions et vous livre uniquement les prospects chauds." },
        { title: 'Votre site ne tire pas parti de vos données internes', text: "Documentation, catalogue produits, FAQ, cas clients : un assistant RAG indexe vos contenus et répond avec précision à toutes les questions." },
        { title: "L'IA vous semble complexe ou risquée", text: "Pas besoin de data scientists. Nous intégrons des LLM (Claude, Mistral, GPT) directement dans vos outils existants, avec des garde-fous stricts." },
      ],
    },
    services: {
      h2: "Nos solutions d'intégration IA",
      subtitle: "Du chatbot FAQ simple à l'architecture multi-agents complexe, nous avons une solution adaptée à votre maturité IA.",
      items: [
        { title: 'Chatbot IA / Assistant RAG', desc: 'Un chatbot intelligent connecté à votre base de connaissances (site, PDF, docs, FAQ). Il répond aux questions précises de vos visiteurs et qualifie les leads entrants.', details: ['Indexation de vos contenus (site, PDF, Notion, docs)', 'Réponses précises basées sur VOS données uniquement', 'Qualification des leads (budget, besoin, urgence)', 'Handoff vers CRM ou équipe commerciale', 'Disponible sur site, WhatsApp, email'], badge: 'À partir de 1 999 €' },
        { title: 'Intégration LLM dans vos outils', desc: 'Nous connectons Claude, Mistral ou GPT-4 à vos outils existants via API : CRM, site web, back-office, ERP. Prompts métier robustes, tests sur données réelles.', details: ['Sélection du modèle adapté (Claude, Mistral, GPT)', 'Configuration de prompts métier robustes', 'Tests sur vos données réelles', 'Documentation et transfert de compétences', 'Intégration dans n8n / Make si besoin'], badge: 'À partir de 699 €' },
        { title: 'Agent IA commercial autonome', desc: 'Un agent IA qui prospecte, qualifie, répond aux objections et planifie les rendez-vous sans intervention humaine. Vos commerciaux ne traitent que des leads chauds.', details: ['Qualification BANT automatique (budget, autorité, besoin, timing)', 'Réponses aux objections fréquentes', 'Prise de rendez-vous automatique (Calendly, Google Agenda)', 'Scoring et transfert vers CRM', 'Suivi multicanal (email, chat, WhatsApp)'], badge: 'À partir de 2 999 €' },
        { title: 'Génération de contenu IA', desc: "Agent IA qui rédige vos articles SEO, fiches produits, newsletters et posts réseaux sociaux en respectant votre ton éditorial. Humain en révision finale.", details: ['Brief automatique depuis mot-clé ou sujet', 'Respect de votre charte éditoriale', 'Articles optimisés SEO + schema FAQ', 'Publication automatisée (WordPress, Notion, CMS)', 'Rapport de performance mensuel'], badge: 'À partir de 1 499 €' },
        { title: 'Automatisation SEO & AEO', desc: "Stack complète : analyse GSC, génération de mots-clés, rédaction d'articles, balisage schema.org, monitoring positions. Apparaître dans les réponses IA (Google AI Overviews).", details: ['Connexion Google Search Console', "Détection des opportunités de contenu manquées", "Génération et publication automatique d'articles", 'Balisage schema.org FAQ / HowTo / Article', 'Monitoring mensuel + rapport de performance'], badge: 'À partir de 1 999 €' },
        { title: 'Développement IA sur mesure', desc: "Système multi-agents, assistant interne RAG, SaaS métier IA, fine-tuning de modèle, intégration profonde dans votre SI. Pour les projets ambitieux.", details: ['Architecture multi-agents (orchestration LangChain / n8n)', 'RAG sur base documentaire volumineuse', 'Fine-tuning de modèle open source (Mistral, LLama)', 'Hébergement souverain France, RGPD', 'Intégration profonde dans votre SI existant'], badge: 'À partir de 3 000 €' },
      ],
    },
    models: {
      label: 'Modèles IA que nous maîtrisons',
      note: "Nous choisissons toujours le modèle le plus adapté à votre cas d'usage — pas le plus cher.",
    },
    useCases: {
      h2: "Cas d'usage par secteur",
      subtitle: "Des scénarios concrets, avec le pack adapté et le résultat mesurable que vous pouvez en attendre.",
      items: [
        { sector: 'Commerce / Boutique locale', context: '40% des questions sont répétitives (horaires, stock, localisation) et mobilisent le personnel en boutique.', solution: 'Chatbot RAG connecté au site + FAQ + catalogue, 5 intentions, réponses 24/7 dans votre charte.', result: '−7h/semaine de questions répétitives · +6 pts de conversion grâce à la réponse immédiate', pack: 'Essentiel IA' },
        { sector: 'Agence immobilière', context: 'Leads SeLoger/Figaro traités à la main, réponse > 24h, CRM mis à jour à 70%.', solution: 'Agent IA de qualification BANT + indexation des biens + prise de RDV Calendly + handoff CRM/Slack.', result: 'Qualification 20 min → 2 min · réponse < 1h passée de 35% à 85% · RDV pris +87%', pack: 'Business IA' },
        { sector: 'E-commerce', context: 'SAV débordé, mêmes questions sur les commandes, abandons faute de réponse rapide.', solution: 'Assistant RAG sur tout le catalogue + suivi de commande + recommandations produits, 3 langues.', result: 'Jusqu\'à 68% des demandes traitées sans agent · SAV recentré sur les cas complexes', pack: 'Business IA' },
        { sector: 'Cabinet médical / Réseau de santé', context: 'Documentation interne volumineuse, données sensibles, conformité RGPD/HDS exigeante.', solution: 'Architecture multi-agents (RDV, support, contenu) + RAG sur 500+ documents + hébergement souverain OVH + DPA.', result: 'Recherche documentaire instantanée · 100% conforme RGPD santé · support patient 24/7', pack: 'Premium IA' },
        { sector: 'SaaS / B2B tech', context: 'Onboarding chronophage, support de niveau 1 saturé, blog SEO à l\'arrêt.', solution: 'Assistant onboarding IA + support tier 1 RAG sur la doc + agent de génération de contenu SEO.', result: 'Time-to-value réduit · tickets niveau 1 absorbés · production de contenu SEO continue', pack: 'Premium IA' },
        { sector: 'Restaurant / Hôtellerie', context: 'Réservations par téléphone hors service, questions FAQ en boucle, PMS non connecté.', solution: 'Chatbot réservation + FAQ + synchronisation PMS, multilingue pour la clientèle internationale.', result: 'Réservations captées 24/7 · standard téléphonique allégé · clientèle étrangère mieux servie', pack: 'Essentiel IA' },
      ],
    },
    packs: {
      h2: 'Nos packs intégration IA',
      subtitle: 'Des prix transparents, sans surprise. TVA non applicable (art. 293B du CGI).',
      popular: 'Le plus populaire',
      ht: 'HT',
      monthly: '€/mois maintenance',
      delivery: 'Délai',
      items: [
        {
          name: 'Essentiel IA', tagline: 'Votre premier assistant IA. En ligne en 2 semaines.',
          bullets: ["Chatbot IA FAQ (jusqu'à 5 intentions)", 'Indexation de votre site + 1 PDF ou doc', "1 langue, jusqu'à 500 conversations/mois", 'Design personnalisé intégré à votre site'],
          included: ['Chatbot RAG connecté à votre site et 1 document', "Jusqu'à 5 intentions de conversation configurées", 'Design chatbot adapté à votre charte graphique', 'Intégration sur votre site (widget ou page dédiée)', '1 langue (français)', '500 conversations / mois incluses', 'Historique des conversations (30 jours)', 'Formation 30 min + documentation', 'Support email 30 jours'],
          notIncluded: ['Agent IA qualifiant (BANT scoring)', 'Intégration CRM / handoff commercial', "Plus d'une langue", 'Plus de 500 conversations / mois', 'Génération de contenu IA', 'Automatisation workflow n8n'],
          options: [{ label: 'Langue supplémentaire', price: '+290 € HT' }, { label: '500 conversations supplémentaires / mois', price: '+29 € HT/mois' }, { label: 'Intégration CRM basique', price: '+490 € HT' }, { label: 'Indexation de 5 documents supplémentaires', price: '+190 € HT' }],
          maintenanceItems: ['Surveillance mensuelle du chatbot', 'Mise à jour de la base de connaissances (sur demande)', 'Support email (délai 72h)'],
        },
        {
          name: 'Business IA', tagline: 'Agent IA complet. Qualification automatique. CRM connecté.',
          bullets: ["Agent IA qualifiant (jusqu'à 10 intentions)", 'Indexation illimitée (site + docs + CRM)', "3 langues, jusqu'à 800 conversations/mois", 'Intégration CRM + handoff commercial'],
          included: ['Agent IA avec qualification BANT automatique', "Jusqu'à 10 intentions de conversation", 'Indexation illimitée (site, PDF, Notion, CRM)', '3 langues au choix', '800 conversations / mois incluses', 'Intégration CRM (HubSpot, Notion, Airtable)', 'Handoff vers équipe commerciale (email + Slack)', 'Prise de rendez-vous automatique (Calendly)', 'Reporting mensuel (volume, intentions, taux de résolution)', "1h d'optimisation / mois incluse", 'Support prioritaire email (délai 48h)'],
          notIncluded: ['Architecture multi-agents', 'Fine-tuning de modèle', 'Intégration ERP / SI legacy', 'Génération de contenu IA', 'Hébergement souverain self-hosted'],
          options: [{ label: 'Langue supplémentaire', price: '+290 € HT' }, { label: '500 conversations supplémentaires / mois', price: '+24 € HT/mois' }, { label: 'Génération contenu IA (blog, RS)', price: '+990 € HT' }, { label: 'Automatisation workflow n8n intégrée', price: '+990 € HT' }, { label: "Formation équipe (jusqu'à 5 personnes)", price: '+390 € HT' }],
          maintenanceItems: ['Surveillance 24/7 + alertes', 'Mise à jour base de connaissances (2×/mois)', 'Rapport mensuel de performance', "1h d'optimisation incluse / mois", 'Support prioritaire (délai 48h)'],
        },
        {
          name: 'Premium IA', tagline: 'Système multi-agents. Développement sur mesure. RGPD souverain.',
          bullets: ["Jusqu'à 3 agents IA spécialisés (vente, support, SEO)", 'Architecture RAG sur données volumineuses', 'Hébergement souverain France, RGPD', 'Intégration profonde dans votre SI'],
          included: ["Jusqu'à 3 agents IA spécialisés (vente, support, contenu, SEO)", 'Architecture multi-agents avec orchestration', 'RAG sur base documentaire volumineuse (illimité)', 'Fine-tuning de modèle open source si pertinent', 'Hébergement souverain France (serveurs OVH)', 'Conformité RGPD complète + DPA', 'Intégration profonde SI (API, webhooks, connecteurs)', 'Dashboard BI de pilotage', 'Formation équipe 4h + documentation vidéo', 'Accompagnement stratégique 3 mois', 'Support dédié 7j/7 (délai 24h)', 'Réunion mensuelle de suivi'],
          notIncluded: ['Budget publicitaire (Ads)', 'Community management', 'Développements backend hors IA', 'Application mobile native (sur devis)'],
          options: [{ label: 'Agent IA supplémentaire', price: '+1 990 € HT' }, { label: 'Application mobile avec IA intégrée', price: 'Sur devis' }, { label: 'Accompagnement 6 mois supplémentaires', price: '+1 490 € HT' }, { label: 'Audit de sécurité IA (pentest)', price: '+990 € HT' }],
          maintenanceItems: ['Surveillance temps réel + alertes immédiates', 'Mise à jour base de connaissances illimitée', 'Fine-tuning mensuel du modèle', 'Rapport mensuel avancé + réunion de suivi', 'Support dédié 7j/7 (délai 24h)', 'Optimisation continue sur suggestion'],
        },
      ],
    },
    testimonials: {
      h2: 'Ce que disent nos clients',
      items: [
        { quote: "Le chatbot IA a réduit notre charge de support de 68%. Les clients obtiennent une réponse précise en 3 secondes, 24h/24. Nos agents se concentrent désormais sur les cas complexes.", name: 'Claire M.', role: 'Directrice Customer Success', company: 'SaaS B2B, Bordeaux', initials: 'CM', color: 'bg-gray-200 text-gray-800' },
        { quote: "L'agent IA qualifiant a transformé notre prospection. On ne parle plus qu'à des leads chauds. Le taux de closing est passé de 12% à 31% en 6 semaines.", name: 'Marc L.', role: 'Directeur commercial', company: 'Agence immobilière, Paris', initials: 'ML', color: 'bg-gray-200 text-gray-800' },
        { quote: "L'assistant RAG connaît tous nos 800 produits par cœur. Les clients trouvent exactement ce qu'ils cherchent sans passer par notre SAV. Remarquable.", name: 'Anne-Sophie T.', role: 'CEO', company: 'E-commerce mode, Lyon', initials: 'AT', color: 'bg-gray-200 text-gray-800' },
      ],
    },
    faq: {
      h2: 'Questions fréquentes',
      items: [
        { q: 'Quelle est la différence entre un chatbot classique et un agent IA RAG ?', a: "Un chatbot classique répond à partir d'un arbre de décision figé. Un agent IA RAG (Retrieval-Augmented Generation) indexe votre contenu réel — site, PDF, Notion, CRM — et génère des réponses précises basées sur VOS données. Il comprend les questions en langage naturel, gère les nuances et apprend de votre base. Le résultat : zéro réponse générique, 100% pertinente." },
        { q: "Mes données restent-elles confidentielles avec l'IA ?", a: "Oui. Nous configurons les modèles pour que vos données ne servent jamais à entraîner des modèles tiers. Pour les projets sensibles (santé, juridique, données clients critiques), nous recommandons un modèle open source self-hosted (Mistral ou LLama) sur des serveurs en France. Les données ne quittent jamais votre infrastructure." },
        { q: 'Quelle est la différence entre Claude, GPT et Mistral ?', a: "Claude (Anthropic) excelle dans le raisonnement complexe et la conformité — c'est notre recommandation pour les agents IA critiques. GPT-4o est multimodal et a l'écosystème le plus large. Mistral est open source, souverain et disponible en self-hosted — idéal pour les données sensibles et les budgets serrés. Nous choisissons toujours le modèle adapté à votre cas, pas le plus cher." },
        { q: 'Le chatbot IA peut-il parler plusieurs langues ?', a: "Oui. Les LLM modernes (Claude, GPT, Mistral) sont nativement multilingues. Nous configurons la détection automatique de la langue et les réponses dans la langue de l'utilisateur. Le Pack Essentiel inclut 1 langue, le Business inclut 3 langues, le Premium en langues illimitées." },
        { q: "Comment l'agent IA est-il maintenu et amélioré dans le temps ?", a: "L'agent IA s'améliore avec l'usage. Chaque mois, nous analysons les conversations (questions sans réponse, taux de satisfaction, handoffs non nécessaires) et optimisons les prompts, ajoutons des sources et affinons le scoring. En Pack Business, 1h d'optimisation est incluse chaque mois." },
        { q: "Peut-on intégrer l'IA dans mon site existant sans le refaire ?", a: "Oui. Nous intégrons l'assistant IA dans votre site existant via un widget (quelques lignes de JavaScript) ou une API. Pas besoin de refaire votre site — l'IA s'adapte à votre charte graphique et votre identité." },
        { q: 'Quel budget prévoir pour un projet IA de A à Z ?', a: "Un chatbot FAQ simple : 1 499 € HT + 39 €/mois. Un agent IA commercial complet avec CRM : 3 999 € HT + 89 €/mois. Un système multi-agents avec hébergement souverain : à partir de 9 999 € HT (contre 12 000 à 20 000 € pour un développement sur mesure équivalent en France). Notre audit gratuit vous donne une estimation précise." },
      ],
    },
    more: {
      h3: 'Pour aller plus loin',
      items: [
        { label: 'Audit qualité des données : pourquoi vos projets IA échouent', href: '/blog/audit-qualite-donnees-projet-ia' },
        { label: 'Comment intégrer une IA dans votre site web', href: '/blog/integrer-ia-site-web-2025' },
        { label: 'IA agentique : ce que font déjà vos concurrents', href: '/blog/ia-agents-remplacent-equipes-2026' },
        { label: "7 façons d'utiliser l'IA pour générer des leads", href: '/blog/site-vitrine-ia-machine-leads' },
        { label: 'Automatisation IA pour PME : prix réels 2026', href: '/blog/automatisation-ia-pme-prix-2026' },
      ],
    },
    cta: { badge: 'Audit IA gratuit · Valorisé 490 € · Sans engagement', h2: "Prêt à intégrer l'IA dans votre activité ?", p: "30 minutes pour identifier vos 3 cas d'usage IA prioritaires et leur ROI estimé. Gratuit, sans engagement, sans jargon technique.", ctaAudit: "Demander l'audit IA gratuit", ctaBlog: 'Lire notre guide IA', ctaBlogHref: '/blog/integrer-ia-site-web-2025' },
    detail: { included: 'Inclus', notIncluded: 'Non inclus', options: 'Options disponibles', maintenance: 'Maintenance', choose: 'Choisir', payment: 'Paiement échelonné disponible · 40% à la commande, 30% à la validation, 30% à la livraison' },
    showDetails: 'Voir les détails ↓', hideDetails: 'Masquer les détails ↑',
  },

  en: {
    hero: {
      badge: 'AI Chatbots · RAG Agents · LLM · Claude · Mistral · GPT',
      h1: 'AI integrated into your website',
      h1highlight: 'and your business tools',
      p: "AI chatbots, RAG agents, LLM integration, content generation, SEO automation. We deploy concrete AI solutions connected to your data, with measurable ROI.",
      ctaAudit: 'Free AI audit',
      ctaPricing: 'See pricing',
    },
    stats: [
      { label: 'of customer requests handled automatically' },
      { label: 'AI assistant availability' },
      { label: 'more conversions with a qualifying chatbot' },
    ],
    problems: {
      h2: 'Your current challenges',
      subtitle: "Businesses that don't integrate AI in 2026 let their competitors gain efficiency with every customer interaction.",
      items: [
        { title: 'Your team manually answers the same questions over and over', text: "FAQs, pricing, availability, order processes: 70% of questions are identical. An AI assistant handles them instantly, 24/7." },
        { title: 'Your leads are not qualified before reaching sales', text: "Budget, need, timing, decision authority: an AI agent asks the right questions and delivers only warm prospects to your team." },
        { title: "Your website doesn't leverage your internal data", text: "Documentation, product catalogue, FAQs, case studies: a RAG assistant indexes your content and answers any question with precision." },
        { title: 'AI feels complex or risky', text: "No data scientists needed. We integrate LLMs (Claude, Mistral, GPT) directly into your existing tools with strict guardrails." },
      ],
    },
    services: {
      h2: 'Our AI integration solutions',
      subtitle: "From a simple FAQ chatbot to a complex multi-agent architecture, we have a solution matched to your AI maturity.",
      items: [
        { title: 'AI Chatbot / RAG Assistant', desc: 'A smart chatbot connected to your knowledge base (website, PDFs, docs, FAQs). It answers precise visitor questions and qualifies incoming leads.', details: ['Indexing your content (website, PDF, Notion, docs)', 'Precise answers based solely on YOUR data', 'Lead qualification (budget, need, urgency)', 'CRM handoff or sales team escalation', 'Available on website, WhatsApp, email'], badge: 'From €1,999' },
        { title: 'LLM integration into your tools', desc: 'We connect Claude, Mistral or GPT-4 to your existing tools via API: CRM, website, back-office, ERP. Robust business prompts, tested on real data.', details: ['Best model selection (Claude, Mistral, GPT)', 'Robust business prompt configuration', 'Testing on your real data', 'Documentation and knowledge transfer', 'Integration into n8n / Make if needed'], badge: 'From €699' },
        { title: 'Autonomous AI sales agent', desc: 'An AI agent that prospects, qualifies, handles objections and schedules appointments without human intervention. Your sales team only handles warm leads.', details: ['Automatic BANT qualification (budget, authority, need, timing)', 'Responses to common objections', 'Automatic appointment booking (Calendly, Google Calendar)', 'Lead scoring and CRM transfer', 'Multi-channel follow-up (email, chat, WhatsApp)'], badge: 'From €2,999' },
        { title: 'AI content generation', desc: "AI agent that writes your SEO articles, product sheets, newsletters and social posts while respecting your editorial tone. Human final review.", details: ['Automatic brief from keyword or topic', 'Your editorial guidelines respected', 'SEO-optimised articles + FAQ schema', 'Automated publishing (WordPress, Notion, CMS)', 'Monthly performance report'], badge: 'From €1,499' },
        { title: 'SEO & AEO automation', desc: "Full stack: GSC analysis, keyword generation, article writing, schema.org markup, position monitoring. Appear in AI answers (Google AI Overviews).", details: ['Google Search Console connection', 'Detection of missed content opportunities', 'Automatic article generation and publishing', 'FAQ / HowTo / Article schema.org markup', 'Monthly monitoring + performance report'], badge: 'From €1,999' },
        { title: 'Custom AI development', desc: "Multi-agent systems, internal RAG assistant, AI SaaS product, model fine-tuning, deep integration into your information system. For ambitious projects.", details: ['Multi-agent architecture (LangChain / n8n orchestration)', 'RAG on large document bases', 'Open-source model fine-tuning (Mistral, LLama)', 'Sovereign France hosting, GDPR compliant', 'Deep integration into your existing IT system'], badge: 'From €3,000' },
      ],
    },
    models: {
      label: 'AI models we master',
      note: "We always choose the model best suited to your use case — not the most expensive one.",
    },
    useCases: {
      h2: 'Use cases by industry',
      subtitle: 'Concrete scenarios, with the right pack and the measurable result you can expect.',
      items: [
        { sector: 'Local shop / Retail', context: '40% of questions are repetitive (hours, stock, location) and tie up in-store staff.', solution: 'RAG chatbot connected to your site + FAQ + catalog, 5 intents, 24/7 answers in your brand style.', result: '−7h/week of repetitive questions · +6 pts conversion thanks to instant answers', pack: 'Essential AI' },
        { sector: 'Real estate agency', context: 'Portal leads handled by hand, replies > 24h, CRM only 70% up to date.', solution: 'BANT qualification AI agent + listing indexing + Calendly booking + CRM/Slack handoff.', result: 'Qualification 20 min → 2 min · sub-1h reply rate from 35% to 85% · bookings +87%', pack: 'Business AI' },
        { sector: 'E-commerce', context: 'Overwhelmed support, the same order questions, drop-offs for lack of a fast answer.', solution: 'RAG assistant over the full catalog + order tracking + product recommendations, 3 languages.', result: 'Up to 68% of requests handled without an agent · support refocused on complex cases', pack: 'Business AI' },
        { sector: 'Medical practice / Healthcare network', context: 'Large internal documentation, sensitive data, demanding GDPR/HDS compliance.', solution: 'Multi-agent architecture (booking, support, content) + RAG over 500+ documents + sovereign OVH hosting + DPA.', result: 'Instant document search · 100% health-GDPR compliant · 24/7 patient support', pack: 'Premium AI' },
        { sector: 'SaaS / B2B tech', context: 'Time-consuming onboarding, saturated tier-1 support, SEO blog at a standstill.', solution: 'AI onboarding assistant + tier-1 RAG support over the docs + SEO content generation agent.', result: 'Reduced time-to-value · tier-1 tickets absorbed · continuous SEO content output', pack: 'Premium AI' },
        { sector: 'Restaurant / Hospitality', context: 'After-hours phone bookings, looping FAQ questions, PMS not connected.', solution: 'Booking chatbot + FAQ + PMS synchronisation, multilingual for international guests.', result: 'Bookings captured 24/7 · lighter phone load · international guests better served', pack: 'Essential AI' },
      ],
    },
    packs: {
      h2: 'Our AI integration packages',
      subtitle: 'Transparent pricing, no surprises. VAT not applicable.',
      popular: 'Most popular',
      ht: 'excl. VAT',
      monthly: '€/month maintenance',
      delivery: 'Delivery',
      items: [
        {
          name: 'Essential AI', tagline: 'Your first AI assistant. Live in 2 weeks.',
          bullets: ['AI FAQ chatbot (up to 5 intents)', 'Indexing your website + 1 PDF or doc', '1 language, up to 500 conversations/month', 'Custom design integrated into your website'],
          included: ['RAG chatbot connected to your website and 1 document', 'Up to 5 conversation intents configured', 'Chatbot design matching your brand guidelines', 'Integration on your website (widget or dedicated page)', '1 language (English)', '500 conversations / month included', 'Conversation history (30 days)', '30-min training + documentation', '30-day email support'],
          notIncluded: ['Qualifying AI agent (BANT scoring)', 'CRM integration / sales handoff', 'More than one language', 'More than 500 conversations / month', 'AI content generation', 'n8n workflow automation'],
          options: [{ label: 'Additional language', price: '+€290 excl. VAT' }, { label: '500 extra conversations / month', price: '+€29 excl. VAT/month' }, { label: 'Basic CRM integration', price: '+€490 excl. VAT' }, { label: 'Indexing 5 additional documents', price: '+€190 excl. VAT' }],
          maintenanceItems: ['Monthly chatbot monitoring', 'Knowledge base updates (on request)', 'Email support (72h response)'],
        },
        {
          name: 'Business AI', tagline: 'Complete AI agent. Automatic qualification. CRM connected.',
          bullets: ['Qualifying AI agent (up to 10 intents)', 'Unlimited indexing (website + docs + CRM)', '3 languages, up to 800 conversations/month', 'CRM integration + sales handoff'],
          included: ['AI agent with automatic BANT qualification', 'Up to 10 conversation intents', 'Unlimited indexing (website, PDF, Notion, CRM)', '3 languages of your choice', '800 conversations / month included', 'CRM integration (HubSpot, Notion, Airtable)', 'Sales team handoff (email + Slack)', 'Automatic appointment booking (Calendly)', 'Monthly reporting (volume, intents, resolution rate)', '1h optimisation / month included', 'Priority email support (48h response)'],
          notIncluded: ['Multi-agent architecture', 'Model fine-tuning', 'ERP / legacy system integration', 'AI content generation', 'Self-hosted sovereign hosting'],
          options: [{ label: 'Additional language', price: '+€290 excl. VAT' }, { label: '500 extra conversations / month', price: '+€24 excl. VAT/month' }, { label: 'AI content generation (blog, social)', price: '+€990 excl. VAT' }, { label: 'Integrated n8n workflow automation', price: '+€990 excl. VAT' }, { label: 'Team training (up to 5 people)', price: '+€390 excl. VAT' }],
          maintenanceItems: ['24/7 monitoring + alerts', 'Knowledge base updates (2×/month)', 'Monthly performance report', '1h optimisation included / month', 'Priority support (48h response)'],
        },
        {
          name: 'Premium AI', tagline: 'Multi-agent system. Custom development. Sovereign GDPR.',
          bullets: ['Up to 3 specialised AI agents (sales, support, SEO)', 'RAG architecture on large datasets', 'Sovereign France hosting, GDPR compliant', 'Deep integration into your IT system'],
          included: ['Up to 3 specialised AI agents (sales, support, content, SEO)', 'Multi-agent architecture with orchestration', 'RAG on large document base (unlimited)', 'Open-source model fine-tuning if relevant', 'Sovereign France hosting (OVH servers)', 'Full GDPR compliance + DPA', 'Deep IT system integration (API, webhooks, connectors)', 'BI management dashboard', '4h team training + video documentation', '3-month strategic coaching', 'Dedicated 7-day support (24h response)', 'Monthly review meeting'],
          notIncluded: ['Advertising budget (Ads)', 'Community management', 'Backend development outside AI', 'Native mobile app (custom quote)'],
          options: [{ label: 'Additional AI agent', price: '+€1,990 excl. VAT' }, { label: 'Mobile app with integrated AI', price: 'Custom quote' }, { label: 'Additional 6-month coaching', price: '+€1,490 excl. VAT' }, { label: 'AI security audit (pentest)', price: '+€990 excl. VAT' }],
          maintenanceItems: ['Real-time monitoring + immediate alerts', 'Unlimited knowledge base updates', 'Monthly model fine-tuning', 'Advanced monthly report + review meeting', 'Dedicated 7-day support (24h response)', 'Continuous optimisation'],
        },
      ],
    },
    testimonials: {
      h2: 'What our clients say',
      items: [
        { quote: "The AI chatbot reduced our support load by 68%. Customers get a precise answer in 3 seconds, 24/7. Our agents now focus on complex cases only.", name: 'Claire M.', role: 'Customer Success Director', company: 'B2B SaaS, Bordeaux', initials: 'CM', color: 'bg-gray-200 text-gray-800' },
        { quote: "The qualifying AI agent transformed our prospecting. We now only talk to warm leads. Our closing rate went from 12% to 31% in 6 weeks.", name: 'Marc L.', role: 'Sales Director', company: 'Real estate agency, Paris', initials: 'ML', color: 'bg-gray-200 text-gray-800' },
        { quote: "The RAG assistant knows all our 800 products perfectly. Customers find exactly what they need without going through customer service. Remarkable.", name: 'Anne-Sophie T.', role: 'CEO', company: 'Fashion e-commerce, Lyon', initials: 'AT', color: 'bg-gray-200 text-gray-800' },
      ],
    },
    faq: {
      h2: 'Frequently asked questions',
      items: [
        { q: "What's the difference between a classic chatbot and a RAG AI agent?", a: "A classic chatbot responds from a fixed decision tree. A RAG AI agent (Retrieval-Augmented Generation) indexes your real content — website, PDFs, Notion, CRM — and generates precise answers based on YOUR data. It understands natural language questions, handles nuances and learns from your knowledge base. Result: zero generic answers, 100% relevant." },
        { q: 'Does my data remain confidential with AI?', a: "Yes. We configure models so your data is never used to train third-party models. For sensitive projects (healthcare, legal, critical client data), we recommend a self-hosted open-source model (Mistral or LLama) on servers in France. Data never leaves your infrastructure." },
        { q: "What's the difference between Claude, GPT and Mistral?", a: "Claude (Anthropic) excels at complex reasoning and compliance — it's our recommendation for critical AI agents. GPT-4o is multimodal and has the largest ecosystem. Mistral is open-source, sovereign and available self-hosted — ideal for sensitive data and tighter budgets. We always choose the model suited to your case, not the most expensive." },
        { q: 'Can the AI chatbot speak multiple languages?', a: "Yes. Modern LLMs (Claude, GPT, Mistral) are natively multilingual. We configure automatic language detection and responses in the user's language. The Essential pack includes 1 language, Business includes 3 languages, Premium has unlimited languages." },
        { q: 'How is the AI agent maintained and improved over time?', a: "The AI agent improves with use. Every month we analyse conversations (unanswered questions, satisfaction rate, unnecessary handoffs) and optimise prompts, add sources and refine scoring. In the Business pack, 1h of optimisation is included each month." },
        { q: 'Can you integrate AI into my existing website without rebuilding it?', a: "Yes. We integrate the AI assistant into your existing website via a widget (a few lines of JavaScript) or an API. No need to rebuild your site — the AI adapts to your brand guidelines and identity." },
        { q: 'What budget should I plan for an end-to-end AI project?', a: "A simple FAQ chatbot: €1,499 excl. VAT + €39/month. A complete AI sales agent with CRM: €3,999 excl. VAT + €89/month. A multi-agent system with sovereign hosting: from €9,999 excl. VAT (vs €12,000 to €20,000 for an equivalent custom build in France). Our free audit gives you a precise estimate." },
      ],
    },
    more: {
      h3: 'Learn more',
      items: [
        { label: 'Data quality audit: why most AI projects fail', href: '/blog/audit-qualite-donnees-projet-ia' },
        { label: 'How to integrate AI into your website', href: '/blog/integrer-ia-site-web-2025' },
        { label: 'Agentic AI: what your competitors are already doing', href: '/blog/ia-agents-remplacent-equipes-2026' },
        { label: '7 ways to use AI to generate leads', href: '/blog/site-vitrine-ia-machine-leads' },
        { label: 'AI automation for SMBs: real prices 2026', href: '/blog/automatisation-ia-pme-prix-2026' },
      ],
    },
    cta: { badge: 'Free AI audit · Worth €490 · No commitment', h2: 'Ready to integrate AI into your business?', p: "30 minutes to identify your top 3 AI use cases and their estimated ROI. Free, no commitment, no technical jargon.", ctaAudit: 'Get the free AI audit', ctaBlog: 'Read our AI guide', ctaBlogHref: '/blog/integrer-ia-site-web-2025' },
    detail: { included: 'Included', notIncluded: 'Not included', options: 'Available options', maintenance: 'Maintenance', choose: 'Choose', payment: 'Staged payment available · 40% on order, 30% on validation, 30% on delivery' },
    showDetails: 'Show details ↓', hideDetails: 'Hide details ↑',
  },

  es: {
    hero: {
      badge: 'Chatbots IA · Agentes RAG · LLM · Claude · Mistral · GPT',
      h1: 'IA integrada en tu sitio web',
      h1highlight: 'y tus herramientas de negocio',
      p: "Chatbots IA, agentes RAG, integración LLM, generación de contenido, automatización SEO. Desplegamos soluciones IA concretas, conectadas a tus datos, con ROI medible.",
      ctaAudit: 'Auditoría IA gratuita',
      ctaPricing: 'Ver precios',
    },
    stats: [
      { label: 'de solicitudes de clientes gestionadas automáticamente' },
      { label: 'disponibilidad de los asistentes IA' },
      { label: 'más conversiones con un chatbot cualificador' },
    ],
    problems: {
      h2: 'Tus desafíos actuales',
      subtitle: "Las empresas que no integran IA en 2026 dejan que sus competidores ganen eficiencia en cada interacción con el cliente.",
      items: [
        { title: 'Tu equipo responde manualmente las mismas preguntas', text: "FAQ, precios, disponibilidad, procesos de pedido: el 70% de las preguntas son idénticas. Un asistente IA las gestiona al instante, 24h/7." },
        { title: 'Tus leads no están cualificados antes de pasar a ventas', text: "Presupuesto, necesidad, timing, autoridad de decisión: un agente IA hace las preguntas correctas y solo te entrega prospectos calientes." },
        { title: 'Tu sitio web no aprovecha tus datos internos', text: "Documentación, catálogo de productos, FAQ, casos de clientes: un asistente RAG indexa tus contenidos y responde cualquier pregunta con precisión." },
        { title: 'La IA te parece compleja o arriesgada', text: "No necesitas data scientists. Integramos LLMs (Claude, Mistral, GPT) directamente en tus herramientas existentes con salvaguardas estrictas." },
      ],
    },
    services: {
      h2: 'Nuestras soluciones de integración IA',
      subtitle: "Desde un chatbot FAQ simple hasta una arquitectura multi-agente compleja, tenemos una solución adaptada a tu madurez en IA.",
      items: [
        { title: 'Chatbot IA / Asistente RAG', desc: 'Un chatbot inteligente conectado a tu base de conocimiento (sitio web, PDFs, docs, FAQ). Responde preguntas precisas de tus visitantes y cualifica los leads entrantes.', details: ['Indexación de tus contenidos (sitio, PDF, Notion, docs)', 'Respuestas precisas basadas únicamente en TUS datos', 'Cualificación de leads (presupuesto, necesidad, urgencia)', 'Handoff al CRM o al equipo comercial', 'Disponible en sitio web, WhatsApp, email'], badge: 'Desde 1.999 €' },
        { title: 'Integración LLM en tus herramientas', desc: 'Conectamos Claude, Mistral o GPT-4 a tus herramientas existentes vía API: CRM, sitio web, back-office, ERP. Prompts de negocio robustos, probados con datos reales.', details: ['Selección del modelo adecuado (Claude, Mistral, GPT)', 'Configuración de prompts de negocio robustos', 'Pruebas con tus datos reales', 'Documentación y transferencia de conocimiento', 'Integración en n8n / Make si es necesario'], badge: 'Desde 699 €' },
        { title: 'Agente IA comercial autónomo', desc: 'Un agente IA que prospecta, cualifica, responde objeciones y agenda citas sin intervención humana. Tu equipo de ventas solo trata leads calientes.', details: ['Cualificación BANT automática (presupuesto, autoridad, necesidad, timing)', 'Respuesta a objeciones frecuentes', 'Cita automática (Calendly, Google Calendar)', 'Scoring y transferencia al CRM', 'Seguimiento multicanal (email, chat, WhatsApp)'], badge: 'Desde 2.999 €' },
        { title: 'Generación de contenido IA', desc: "Agente IA que redacta tus artículos SEO, fichas de producto, newsletters y posts en redes respetando tu tono editorial. Revisión humana final.", details: ['Brief automático desde keyword o tema', 'Respeto de tu guía editorial', 'Artículos optimizados SEO + schema FAQ', 'Publicación automatizada (WordPress, Notion, CMS)', 'Informe mensual de rendimiento'], badge: 'Desde 1.499 €' },
        { title: 'Automatización SEO & AEO', desc: "Stack completa: análisis GSC, generación de keywords, redacción de artículos, marcado schema.org, monitorización de posiciones. Aparecer en respuestas IA (Google AI Overviews).", details: ['Conexión Google Search Console', 'Detección de oportunidades de contenido perdidas', 'Generación y publicación automática de artículos', 'Marcado schema.org FAQ / HowTo / Article', 'Monitorización mensual + informe de rendimiento'], badge: 'Desde 1.999 €' },
        { title: 'Desarrollo IA a medida', desc: "Sistema multi-agente, asistente interno RAG, SaaS de negocio IA, fine-tuning de modelo, integración profunda en tu sistema de información. Para proyectos ambiciosos.", details: ['Arquitectura multi-agente (orquestación LangChain / n8n)', 'RAG sobre base documental voluminosa', 'Fine-tuning de modelo open source (Mistral, LLama)', 'Alojamiento soberano Francia, RGPD', 'Integración profunda en tu sistema existente'], badge: 'Desde 3.000 €' },
      ],
    },
    models: {
      label: 'Modelos IA que dominamos',
      note: "Siempre elegimos el modelo más adecuado para tu caso de uso — no el más caro.",
    },
    useCases: {
      h2: 'Casos de uso por sector',
      subtitle: 'Escenarios concretos, con el pack adecuado y el resultado medible que puedes esperar.',
      items: [
        { sector: 'Comercio / Tienda local', context: 'El 40% de las preguntas son repetitivas (horarios, stock, ubicación) y ocupan al personal de tienda.', solution: 'Chatbot RAG conectado a tu web + FAQ + catálogo, 5 intenciones, respuestas 24/7 con tu identidad.', result: '−7h/semana de preguntas repetitivas · +6 pts de conversión por la respuesta inmediata', pack: 'Esencial IA' },
        { sector: 'Agencia inmobiliaria', context: 'Leads de portales tratados a mano, respuesta > 24h, CRM actualizado al 70%.', solution: 'Agente IA de cualificación BANT + indexación de inmuebles + cita Calendly + handoff CRM/Slack.', result: 'Cualificación 20 min → 2 min · respuesta < 1h del 35% al 85% · citas +87%', pack: 'Business IA' },
        { sector: 'E-commerce', context: 'Atención desbordada, las mismas preguntas sobre pedidos, abandonos por falta de respuesta rápida.', solution: 'Asistente RAG sobre todo el catálogo + seguimiento de pedidos + recomendaciones, 3 idiomas.', result: 'Hasta el 68% de las consultas resueltas sin agente · atención centrada en casos complejos', pack: 'Business IA' },
        { sector: 'Consulta médica / Red de salud', context: 'Documentación interna voluminosa, datos sensibles, conformidad RGPD/HDS exigente.', solution: 'Arquitectura multi-agente (citas, soporte, contenido) + RAG sobre 500+ documentos + alojamiento soberano OVH + DPA.', result: 'Búsqueda documental instantánea · 100% conforme RGPD salud · soporte al paciente 24/7', pack: 'Premium IA' },
        { sector: 'SaaS / B2B tech', context: 'Onboarding lento, soporte de nivel 1 saturado, blog SEO parado.', solution: 'Asistente de onboarding IA + soporte tier 1 RAG sobre la documentación + agente de generación de contenido SEO.', result: 'Menor time-to-value · tickets de nivel 1 absorbidos · producción de contenido SEO continua', pack: 'Premium IA' },
        { sector: 'Restaurante / Hostelería', context: 'Reservas por teléfono fuera de horario, preguntas FAQ en bucle, PMS no conectado.', solution: 'Chatbot de reservas + FAQ + sincronización PMS, multilingüe para la clientela internacional.', result: 'Reservas captadas 24/7 · centralita aliviada · clientela extranjera mejor atendida', pack: 'Esencial IA' },
      ],
    },
    packs: {
      h2: 'Nuestros paquetes de integración IA',
      subtitle: 'Precios transparentes, sin sorpresas. IVA no incluido.',
      popular: 'El más popular',
      ht: 's/IVA',
      monthly: '€/mes mantenimiento',
      delivery: 'Plazo',
      items: [
        {
          name: 'Esencial IA', tagline: 'Tu primer asistente IA. En línea en 2 semanas.',
          bullets: ['Chatbot IA FAQ (hasta 5 intenciones)', 'Indexación de tu sitio + 1 PDF o doc', '1 idioma, hasta 500 conversaciones/mes', 'Diseño personalizado integrado en tu sitio'],
          included: ['Chatbot RAG conectado a tu sitio y 1 documento', 'Hasta 5 intenciones de conversación configuradas', 'Diseño del chatbot adaptado a tu imagen de marca', 'Integración en tu sitio (widget o página dedicada)', '1 idioma (español)', '500 conversaciones / mes incluidas', 'Historial de conversaciones (30 días)', 'Formación de 30 min + documentación', 'Soporte por email 30 días'],
          notIncluded: ['Agente IA cualificador (scoring BANT)', 'Integración CRM / handoff comercial', 'Más de un idioma', 'Más de 500 conversaciones / mes', 'Generación de contenido IA', 'Automatización de flujos n8n'],
          options: [{ label: 'Idioma adicional', price: '+290 € s/IVA' }, { label: '500 conversaciones adicionales / mes', price: '+29 € s/IVA/mes' }, { label: 'Integración CRM básica', price: '+490 € s/IVA' }, { label: 'Indexación de 5 documentos adicionales', price: '+190 € s/IVA' }],
          maintenanceItems: ['Monitorización mensual del chatbot', 'Actualización de la base de conocimiento (bajo demanda)', 'Soporte por email (72h de respuesta)'],
        },
        {
          name: 'Business IA', tagline: 'Agente IA completo. Cualificación automática. CRM conectado.',
          bullets: ['Agente IA cualificador (hasta 10 intenciones)', 'Indexación ilimitada (sitio + docs + CRM)', '3 idiomas, hasta 800 conversaciones/mes', 'Integración CRM + handoff comercial'],
          included: ['Agente IA con cualificación BANT automática', 'Hasta 10 intenciones de conversación', 'Indexación ilimitada (sitio, PDF, Notion, CRM)', '3 idiomas a elegir', '800 conversaciones / mes incluidas', 'Integración CRM (HubSpot, Notion, Airtable)', 'Handoff al equipo comercial (email + Slack)', 'Cita automática (Calendly)', 'Reporting mensual (volumen, intenciones, tasa de resolución)', '1h de optimización / mes incluida', 'Soporte prioritario por email (48h de respuesta)'],
          notIncluded: ['Arquitectura multi-agente', 'Fine-tuning de modelo', 'Integración ERP / sistema legacy', 'Generación de contenido IA', 'Alojamiento soberano self-hosted'],
          options: [{ label: 'Idioma adicional', price: '+290 € s/IVA' }, { label: '500 conversaciones adicionales / mes', price: '+24 € s/IVA/mes' }, { label: 'Generación de contenido IA (blog, redes)', price: '+990 € s/IVA' }, { label: 'Automatización de flujo n8n integrada', price: '+990 € s/IVA' }, { label: 'Formación equipo (hasta 5 personas)', price: '+390 € s/IVA' }],
          maintenanceItems: ['Monitorización 24/7 + alertas', 'Actualización base de conocimiento (2×/mes)', 'Informe mensual de rendimiento', '1h de optimización incluida / mes', 'Soporte prioritario (48h de respuesta)'],
        },
        {
          name: 'Premium IA', tagline: 'Sistema multi-agente. Desarrollo a medida. RGPD soberano.',
          bullets: ['Hasta 3 agentes IA especializados (ventas, soporte, SEO)', 'Arquitectura RAG sobre datos voluminosos', 'Alojamiento soberano Francia, RGPD', 'Integración profunda en tu sistema de información'],
          included: ['Hasta 3 agentes IA especializados (ventas, soporte, contenido, SEO)', 'Arquitectura multi-agente con orquestación', 'RAG sobre base documental voluminosa (ilimitado)', 'Fine-tuning de modelo open source si es relevante', 'Alojamiento soberano Francia (servidores OVH)', 'Cumplimiento RGPD completo + DPA', 'Integración profunda SI (API, webhooks, conectores)', 'Dashboard BI de gestión', 'Formación equipo 4h + documentación en vídeo', 'Acompañamiento estratégico 3 meses', 'Soporte dedicado 7 días (24h de respuesta)', 'Reunión mensual de seguimiento'],
          notIncluded: ['Presupuesto publicitario (Ads)', 'Community management', 'Desarrollo backend fuera de IA', 'App móvil nativa (presupuesto a medida)'],
          options: [{ label: 'Agente IA adicional', price: '+1.990 € s/IVA' }, { label: 'App móvil con IA integrada', price: 'Presupuesto a medida' }, { label: 'Acompañamiento 6 meses adicionales', price: '+1.490 € s/IVA' }, { label: 'Auditoría de seguridad IA (pentest)', price: '+990 € s/IVA' }],
          maintenanceItems: ['Monitorización en tiempo real + alertas inmediatas', 'Actualización base de conocimiento ilimitada', 'Fine-tuning mensual del modelo', 'Informe mensual avanzado + reunión de seguimiento', 'Soporte dedicado 7 días (24h de respuesta)', 'Optimización continua'],
        },
      ],
    },
    testimonials: {
      h2: 'Lo que dicen nuestros clientes',
      items: [
        { quote: "El chatbot IA redujo nuestra carga de soporte en un 68%. Los clientes obtienen una respuesta precisa en 3 segundos, 24h al día. Nuestros agentes ahora se centran en casos complejos.", name: 'Claire M.', role: 'Directora de Customer Success', company: 'SaaS B2B, Burdeos', initials: 'CM', color: 'bg-gray-200 text-gray-800' },
        { quote: "El agente IA cualificador transformó nuestra prospección. Solo hablamos con leads calientes. Nuestra tasa de cierre pasó del 12% al 31% en 6 semanas.", name: 'Marc L.', role: 'Director comercial', company: 'Agencia inmobiliaria, París', initials: 'ML', color: 'bg-gray-200 text-gray-800' },
        { quote: "El asistente RAG conoce a la perfección nuestros 800 productos. Los clientes encuentran exactamente lo que buscan sin pasar por el servicio de atención al cliente. Extraordinario.", name: 'Anne-Sophie T.', role: 'CEO', company: 'E-commerce de moda, Lyon', initials: 'AT', color: 'bg-gray-200 text-gray-800' },
      ],
    },
    faq: {
      h2: 'Preguntas frecuentes',
      items: [
        { q: '¿Cuál es la diferencia entre un chatbot clásico y un agente IA RAG?', a: "Un chatbot clásico responde desde un árbol de decisión fijo. Un agente IA RAG (Retrieval-Augmented Generation) indexa tu contenido real — sitio web, PDFs, Notion, CRM — y genera respuestas precisas basadas en TUS datos. Entiende preguntas en lenguaje natural, gestiona matices y aprende de tu base. Resultado: cero respuestas genéricas, 100% relevantes." },
        { q: '¿Mis datos permanecen confidenciales con la IA?', a: "Sí. Configuramos los modelos para que tus datos nunca se usen para entrenar modelos de terceros. Para proyectos sensibles (salud, legal, datos críticos de clientes), recomendamos un modelo open source self-hosted (Mistral o LLama) en servidores en Francia. Los datos nunca salen de tu infraestructura." },
        { q: '¿Cuál es la diferencia entre Claude, GPT y Mistral?', a: "Claude (Anthropic) destaca en razonamiento complejo y conformidad — es nuestra recomendación para agentes IA críticos. GPT-4o es multimodal y tiene el ecosistema más amplio. Mistral es open source, soberano y disponible en self-hosted — ideal para datos sensibles y presupuestos ajustados. Siempre elegimos el modelo adecuado para tu caso, no el más caro." },
        { q: '¿El chatbot IA puede hablar varios idiomas?', a: "Sí. Los LLMs modernos (Claude, GPT, Mistral) son multilingües de forma nativa. Configuramos la detección automática del idioma y las respuestas en el idioma del usuario. El Pack Esencial incluye 1 idioma, Business incluye 3 idiomas, Premium idiomas ilimitados." },
        { q: '¿Cómo se mantiene y mejora el agente IA con el tiempo?', a: "El agente IA mejora con el uso. Cada mes analizamos las conversaciones (preguntas sin respuesta, tasa de satisfacción, handoffs innecesarios) y optimizamos los prompts, añadimos fuentes y refinamos el scoring. En el Pack Business, 1h de optimización está incluida cada mes." },
        { q: '¿Podéis integrar la IA en mi sitio existente sin rehacerlo?', a: "Sí. Integramos el asistente IA en tu sitio existente mediante un widget (unas pocas líneas de JavaScript) o una API. No es necesario rehacer tu sitio — la IA se adapta a tu imagen de marca e identidad." },
        { q: '¿Qué presupuesto prever para un proyecto IA de principio a fin?', a: "Un chatbot FAQ simple: 1.499 € s/IVA + 39 €/mes. Un agente IA comercial completo con CRM: 3.999 € s/IVA + 89 €/mes. Un sistema multi-agente con alojamiento soberano: desde 9.999 € s/IVA (frente a 12.000 a 20.000 € por un desarrollo a medida equivalente en Francia). Nuestra auditoría gratuita te da una estimación precisa." },
      ],
    },
    more: {
      h3: 'Saber más',
      items: [
        { label: 'Auditoría de datos: por qué fracasan los proyectos de IA', href: '/blog/audit-qualite-donnees-projet-ia' },
        { label: 'Cómo integrar IA en tu sitio web', href: '/blog/integrer-ia-site-web-2025' },
        { label: 'IA agéntica: lo que ya hacen tus competidores', href: '/blog/ia-agents-remplacent-equipes-2026' },
        { label: '7 formas de usar la IA para generar leads', href: '/blog/site-vitrine-ia-machine-leads' },
        { label: 'Automatización IA para pymes: precios reales 2026', href: '/blog/automatisation-ia-pme-prix-2026' },
      ],
    },
    cta: { badge: 'Auditoría IA gratuita · Valorada en 490 € · Sin compromiso', h2: '¿Listo para integrar la IA en tu negocio?', p: "30 minutos para identificar tus 3 casos de uso IA prioritarios y su ROI estimado. Gratis, sin compromiso, sin jerga técnica.", ctaAudit: 'Solicitar la auditoría IA gratuita', ctaBlog: 'Leer nuestra guía IA', ctaBlogHref: '/blog/integrer-ia-site-web-2025' },
    detail: { included: 'Incluido', notIncluded: 'No incluido', options: 'Opciones disponibles', maintenance: 'Mantenimiento', choose: 'Elegir', payment: 'Pago fraccionado disponible · 40% al pedido, 30% a la validación, 30% a la entrega' },
    showDetails: 'Ver detalles ↓', hideDetails: 'Ocultar detalles ↑',
  },
  // vi — mode devis intégral (cf. Stage C du plan vi) : aucun montant EUR affiché,
  // ni dans les badges de services, ni dans les options, ni dans la FAQ budget.
  vi: {
    hero: {
      badge: 'Chatbot AI · RAG Agent · LLM · Claude · Mistral · GPT',
      h1: 'Đưa AI vào website',
      h1highlight: 'và công cụ nghiệp vụ của bạn',
      p: 'Chatbot AI, RAG agent, tích hợp LLM, tạo nội dung, tự động hoá SEO. Chúng tôi triển khai những giải pháp AI cụ thể, kết nối với chính dữ liệu của bạn, và đo được hiệu quả.',
      ctaAudit: 'Tư vấn AI miễn phí',
      ctaPricing: 'Xem các gói dịch vụ',
    },
    stats: [
      { label: 'yêu cầu của khách được xử lý tự động' },
      { label: 'thời gian trợ lý AI luôn sẵn sàng' },
      { label: 'tăng chuyển đổi nhờ chatbot biết sàng lọc' },
    ],
    problems: {
      h2: 'Những khó khăn bạn đang gặp',
      subtitle: 'Doanh nghiệp không đưa AI vào vận hành sẽ dần tụt lại: đối thủ trả lời khách nhanh hơn trong mọi lượt tương tác.',
      items: [
        { title: 'Nhân viên trả lời tay cùng những câu hỏi giống nhau', text: 'Giờ mở cửa, giá, tình trạng còn hàng, cách đặt hàng: khoảng 70% câu hỏi là giống nhau. Một trợ lý AI xử lý ngay lập tức, 24/7, trên website và Zalo.' },
        { title: 'Khách hàng chưa được sàng lọc trước khi đến tay đội bán hàng', text: 'Ngân sách, nhu cầu, thời điểm, người ra quyết định: một AI agent hỏi đúng những điều cần biết và chỉ chuyển cho bạn khách đã thực sự sẵn sàng.' },
        { title: 'Website chưa tận dụng được dữ liệu nội bộ của bạn', text: 'Tài liệu, danh mục sản phẩm, câu hỏi thường gặp, hồ sơ khách hàng: một trợ lý RAG lập chỉ mục toàn bộ nội dung và trả lời chính xác mọi câu hỏi.' },
        { title: 'AI nghe có vẻ phức tạp hoặc rủi ro', text: 'Bạn không cần đội ngũ khoa học dữ liệu. Chúng tôi tích hợp các mô hình LLM (Claude, Mistral, GPT) thẳng vào công cụ bạn đang dùng, kèm những ràng buộc kiểm soát chặt chẽ.' },
      ],
    },
    services: {
      h2: 'Các giải pháp tích hợp AI',
      subtitle: 'Từ chatbot trả lời câu hỏi thường gặp cho đến kiến trúc nhiều AI agent, luôn có giải pháp phù hợp với mức độ sẵn sàng của bạn.',
      items: [
        { title: 'Chatbot AI / trợ lý RAG', desc: 'Một chatbot thông minh kết nối với kho kiến thức của bạn (website, PDF, tài liệu, câu hỏi thường gặp). Nó trả lời chính xác câu hỏi của khách và sàng lọc khách hàng tiềm năng.', details: ['Lập chỉ mục nội dung của bạn (website, PDF, Notion, tài liệu)', 'Trả lời chỉ dựa trên dữ liệu CỦA BẠN', 'Sàng lọc khách hàng (ngân sách, nhu cầu, mức độ gấp)', 'Chuyển tiếp sang CRM hoặc đội kinh doanh', 'Hoạt động trên website, Zalo và email'], badge: 'Theo báo giá' },
        { title: 'Tích hợp LLM vào công cụ của bạn', desc: 'Chúng tôi kết nối Claude, Mistral hoặc GPT-4 vào các công cụ sẵn có qua API: CRM, website, hệ thống quản trị nội bộ, phần mềm quản lý. Câu lệnh nghiệp vụ chắc chắn, kiểm thử trên dữ liệu thật.', details: ['Chọn mô hình phù hợp (Claude, Mistral, GPT)', 'Cấu hình câu lệnh nghiệp vụ chắc chắn', 'Kiểm thử trên dữ liệu thật của bạn', 'Tài liệu hoá và chuyển giao kỹ năng', 'Tích hợp vào n8n / Make nếu cần'], badge: 'Theo báo giá' },
        { title: 'AI agent bán hàng tự vận hành', desc: 'Một AI agent tiếp cận, sàng lọc, trả lời thắc mắc và đặt lịch hẹn mà không cần người can thiệp. Đội kinh doanh của bạn chỉ tiếp những khách đã sẵn sàng.', details: ['Tự động sàng lọc theo ngân sách, quyền quyết định, nhu cầu, thời điểm', 'Trả lời các thắc mắc thường gặp', 'Tự động đặt lịch hẹn (Calendly, Google Calendar)', 'Chấm điểm và chuyển sang CRM', 'Theo dõi đa kênh (email, chat, Zalo)'], badge: 'Theo báo giá' },
        { title: 'Tạo nội dung bằng AI', desc: 'AI agent viết bài chuẩn SEO, mô tả sản phẩm, bản tin và bài đăng mạng xã hội theo đúng giọng văn thương hiệu của bạn. Người thật vẫn duyệt lần cuối.', details: ['Tự động lập dàn ý từ một từ khoá hoặc chủ đề', 'Tôn trọng giọng văn và quy chuẩn của bạn', 'Bài viết chuẩn SEO + đánh dấu FAQ', 'Tự động đăng bài (WordPress, Notion, CMS)', 'Báo cáo hiệu quả hằng tháng'], badge: 'Theo báo giá' },
        { title: 'Tự động hoá SEO & AEO', desc: 'Một quy trình hoàn chỉnh: phân tích Google Search Console, tìm từ khoá, viết bài, đánh dấu schema.org, theo dõi thứ hạng. Mục tiêu: xuất hiện trong các câu trả lời do AI tạo ra.', details: ['Kết nối Google Search Console', 'Phát hiện những chủ đề bạn đang bỏ lỡ', 'Tự động tạo và đăng bài viết', 'Đánh dấu schema.org FAQ / HowTo / Article', 'Theo dõi hằng tháng + báo cáo hiệu quả'], badge: 'Theo báo giá' },
        { title: 'Phát triển AI theo yêu cầu riêng', desc: 'Hệ thống nhiều AI agent, trợ lý nội bộ RAG, phần mềm nghiệp vụ tích hợp AI, tinh chỉnh mô hình, tích hợp sâu vào hệ thống của bạn. Dành cho những dự án tham vọng.', details: ['Kiến trúc nhiều agent (điều phối bằng LangChain / n8n)', 'RAG trên kho tài liệu lớn', 'Tinh chỉnh mô hình mã nguồn mở (Mistral, LLama)', 'Máy chủ riêng do bạn kiểm soát, tuân thủ quy định bảo vệ dữ liệu cá nhân', 'Tích hợp sâu vào hệ thống hiện có'], badge: 'Theo báo giá' },
      ],
    },
    models: {
      label: 'Các mô hình AI chúng tôi thành thạo',
      note: 'Chúng tôi luôn chọn mô hình phù hợp nhất với bài toán của bạn — không phải mô hình đắt nhất.',
    },
    useCases: {
      h2: 'Tình huống thực tế theo từng ngành',
      subtitle: 'Những kịch bản cụ thể, với gói phù hợp và kết quả đo lường được mà bạn có thể kỳ vọng.',
      items: [
        { sector: 'Cửa hàng / hộ kinh doanh địa phương', context: 'Phần lớn câu hỏi lặp đi lặp lại (giờ mở cửa, còn hàng không, ở đâu) và chiếm hết thời gian của nhân viên bán hàng.', solution: 'Chatbot RAG kết nối website + câu hỏi thường gặp + danh mục hàng, 5 tình huống, trả lời 24/7 trên website và Zalo.', result: 'Giảm mạnh thời gian trả lời câu hỏi lặp lại · khách được phản hồi ngay nên chốt nhanh hơn', pack: 'Essentiel IA' },
        { sector: 'Khách sạn tại Hà Nội', context: 'Yêu cầu đặt phòng đến từ Agoda, Booking, Traveloka và Zalo, trả lời chậm, khách quốc tế phải chờ qua đêm.', solution: 'AI agent trả lời tiếng Việt, Anh, Pháp 24/7 + lập chỉ mục thông tin phòng, dịch vụ, chính sách + đặt phòng trực tiếp.', result: 'Trả lời ngay trong vài phút · giảm phụ thuộc vào OTA · khách phương Tây được phục vụ bằng chính ngôn ngữ của họ', pack: 'Business IA' },
        { sector: 'Thương mại điện tử', context: 'Bộ phận chăm sóc khách quá tải, cùng những câu hỏi về đơn hàng, khách bỏ giỏ vì không được trả lời kịp.', solution: 'Trợ lý RAG trên toàn bộ danh mục + tra cứu đơn hàng + gợi ý sản phẩm, hỗ trợ 3 ngôn ngữ.', result: 'Phần lớn yêu cầu được xử lý không cần nhân viên · đội chăm sóc khách tập trung vào ca khó', pack: 'Business IA' },
        { sector: 'Phòng khám / cơ sở y tế', context: 'Tài liệu nội bộ nhiều, dữ liệu nhạy cảm, yêu cầu bảo mật cao.', solution: 'Kiến trúc nhiều agent (đặt lịch, hỗ trợ, nội dung) + RAG trên hơn 500 tài liệu + máy chủ riêng do cơ sở kiểm soát.', result: 'Tra cứu tài liệu tức thì · dữ liệu không rời khỏi hệ thống của bạn · hỗ trợ bệnh nhân 24/7', pack: 'Premium IA' },
        { sector: 'Công ty phần mềm / B2B', context: 'Onboarding tốn thời gian, hỗ trợ cấp 1 quá tải, blog SEO bỏ không.', solution: 'Trợ lý onboarding bằng AI + hỗ trợ cấp 1 dạng RAG trên tài liệu + agent tạo nội dung SEO.', result: 'Khách dùng được sản phẩm nhanh hơn · phiếu hỗ trợ cấp 1 được hấp thụ · nội dung SEO ra đều', pack: 'Premium IA' },
        { sector: 'Nhà hàng / quán ăn', context: 'Đặt bàn qua điện thoại ngoài giờ không ai nghe, cùng những câu hỏi về thực đơn, đơn GrabFood và ShopeeFood nằm rời rạc.', solution: 'Chatbot đặt bàn + câu hỏi thường gặp + đồng bộ lịch bàn, đa ngôn ngữ cho khách nước ngoài.', result: 'Nhận đặt bàn 24/7 · giảm tải cho tổng đài · khách nước ngoài được phục vụ tốt hơn', pack: 'Essentiel IA' },
      ],
    },
    packs: {
      h2: 'Các gói tích hợp AI',
      subtitle: 'Mỗi dự án AI có khối lượng dữ liệu và số kênh khác nhau, nên chúng tôi báo giá riêng theo nhu cầu thực tế. Miễn phí và gửi trong vòng 24 giờ, không có chi phí ẩn.',
      popular: 'Được chọn nhiều nhất',
      // `ht` et `monthly` ne sont pas rendus en mode devis (voir QUOTE_ONLY_LANGS).
      ht: '',
      monthly: 'bảo trì hằng tháng',
      delivery: 'Thời gian triển khai',
      items: [
        {
          name: 'Essentiel IA', tagline: 'Trợ lý AI đầu tiên của bạn. Lên sóng trong 2 tuần.',
          bullets: ['Chatbot AI trả lời câu hỏi thường gặp (tối đa 5 tình huống)', 'Lập chỉ mục website + 1 tài liệu PDF', '1 ngôn ngữ, tối đa 500 lượt trò chuyện mỗi tháng', 'Giao diện thiết kế riêng, gắn thẳng vào website'],
          included: ['Chatbot RAG kết nối website và 1 tài liệu', 'Tối đa 5 tình huống hội thoại được cấu hình', 'Giao diện chatbot theo bộ nhận diện của bạn', 'Gắn vào website (widget hoặc trang riêng)', '1 ngôn ngữ (tiếng Việt hoặc tiếng Anh)', '500 lượt trò chuyện mỗi tháng', 'Lưu lịch sử hội thoại (30 ngày)', 'Hướng dẫn 30 phút + tài liệu', 'Hỗ trợ qua email trong 30 ngày'],
          notIncluded: ['AI agent biết sàng lọc khách hàng', 'Kết nối CRM / chuyển tiếp cho đội kinh doanh', 'Nhiều hơn một ngôn ngữ', 'Quá 500 lượt trò chuyện mỗi tháng', 'Tạo nội dung bằng AI', 'Tự động hoá workflow n8n'],
          options: [{ label: 'Thêm một ngôn ngữ', price: 'Theo báo giá' }, { label: 'Thêm 500 lượt trò chuyện mỗi tháng', price: 'Theo báo giá' }, { label: 'Kết nối CRM cơ bản', price: 'Theo báo giá' }, { label: 'Lập chỉ mục thêm 5 tài liệu', price: 'Theo báo giá' }],
          maintenanceItems: ['Kiểm tra chatbot hằng tháng', 'Cập nhật kho kiến thức (theo yêu cầu)', 'Hỗ trợ qua email (phản hồi trong 72 giờ)'],
        },
        {
          name: 'Business IA', tagline: 'AI agent đầy đủ. Tự động sàng lọc. Đã kết nối CRM.',
          bullets: ['AI agent biết sàng lọc (tối đa 10 tình huống)', 'Lập chỉ mục không giới hạn (website + tài liệu + CRM)', '3 ngôn ngữ, tối đa 800 lượt trò chuyện mỗi tháng', 'Kết nối CRM + chuyển tiếp cho đội kinh doanh'],
          included: ['AI agent tự động sàng lọc theo ngân sách, quyền quyết định, nhu cầu, thời điểm', 'Tối đa 10 tình huống hội thoại', 'Lập chỉ mục không giới hạn (website, PDF, Notion, CRM)', '3 ngôn ngữ tuỳ chọn (ví dụ Việt – Anh – Pháp)', '800 lượt trò chuyện mỗi tháng', 'Kết nối CRM (HubSpot, Notion, Airtable)', 'Chuyển tiếp cho đội kinh doanh (email + Zalo)', 'Tự động đặt lịch hẹn (Calendly)', 'Báo cáo hằng tháng (khối lượng, tình huống, tỷ lệ giải quyết)', 'Bao gồm 1 giờ tối ưu mỗi tháng', 'Hỗ trợ email ưu tiên (phản hồi trong 48 giờ)'],
          notIncluded: ['Kiến trúc nhiều AI agent', 'Tinh chỉnh mô hình', 'Kết nối phần mềm quản lý / hệ thống cũ', 'Tạo nội dung bằng AI', 'Máy chủ riêng tự vận hành'],
          options: [{ label: 'Thêm một ngôn ngữ', price: 'Theo báo giá' }, { label: 'Thêm 500 lượt trò chuyện mỗi tháng', price: 'Theo báo giá' }, { label: 'Tạo nội dung bằng AI (blog, mạng xã hội)', price: 'Theo báo giá' }, { label: 'Tích hợp thêm workflow tự động n8n', price: 'Theo báo giá' }, { label: 'Đào tạo đội ngũ (tối đa 5 người)', price: 'Theo báo giá' }],
          maintenanceItems: ['Theo dõi 24/7 + cảnh báo', 'Cập nhật kho kiến thức (2 lần/tháng)', 'Báo cáo hiệu quả hằng tháng', 'Bao gồm 1 giờ tối ưu mỗi tháng', 'Hỗ trợ ưu tiên (phản hồi trong 48 giờ)'],
        },
        {
          name: 'Premium IA', tagline: 'Hệ thống nhiều AI agent. Phát triển riêng. Dữ liệu do bạn kiểm soát.',
          bullets: ['Tối đa 3 AI agent chuyên biệt (bán hàng, hỗ trợ, SEO)', 'Kiến trúc RAG trên khối lượng dữ liệu lớn', 'Máy chủ riêng, dữ liệu không rời khỏi hệ thống của bạn', 'Tích hợp sâu vào hệ thống hiện có'],
          included: ['Tối đa 3 AI agent chuyên biệt (bán hàng, hỗ trợ, nội dung, SEO)', 'Kiến trúc nhiều agent có điều phối', 'RAG trên kho tài liệu lớn (không giới hạn)', 'Tinh chỉnh mô hình mã nguồn mở nếu phù hợp', 'Máy chủ riêng do bạn kiểm soát (đặt tại Việt Nam hoặc châu Âu tuỳ nhu cầu)', 'Tuân thủ đầy đủ quy định bảo vệ dữ liệu cá nhân + thoả thuận xử lý dữ liệu', 'Tích hợp sâu (API, webhook, connector)', 'Bảng điều hành số liệu', 'Đào tạo đội ngũ 4 giờ + tài liệu video', 'Đồng hành chiến lược trong 3 tháng', 'Hỗ trợ riêng 7 ngày/tuần (phản hồi trong 24 giờ)', 'Họp theo dõi hằng tháng'],
          notIncluded: ['Ngân sách quảng cáo', 'Quản trị mạng xã hội', 'Phát triển backend ngoài phạm vi AI', 'Ứng dụng di động gốc (báo giá riêng)'],
          options: [{ label: 'Thêm một AI agent', price: 'Theo báo giá' }, { label: 'Ứng dụng di động có tích hợp AI', price: 'Theo báo giá' }, { label: 'Đồng hành thêm 6 tháng', price: 'Theo báo giá' }, { label: 'Kiểm thử bảo mật hệ thống AI', price: 'Theo báo giá' }],
          maintenanceItems: ['Giám sát thời gian thực + cảnh báo tức thì', 'Cập nhật kho kiến thức không giới hạn', 'Tinh chỉnh mô hình hằng tháng', 'Báo cáo nâng cao hằng tháng + buổi họp theo dõi', 'Hỗ trợ riêng 7 ngày/tuần (phản hồi trong 24 giờ)', 'Tối ưu liên tục theo đề xuất'],
        },
      ],
    },
    testimonials: {
      h2: 'Khách hàng nói gì về chúng tôi',
      items: [
        { quote: 'Chatbot AI đã giảm 68% khối lượng hỗ trợ của chúng tôi. Khách nhận được câu trả lời chính xác trong 3 giây, 24/7. Nhân viên giờ chỉ tập trung vào những ca phức tạp.', name: 'Claire M.', role: 'Giám đốc chăm sóc khách hàng', company: 'Công ty phần mềm B2B, Bordeaux (Pháp)', initials: 'CM', color: 'bg-gray-200 text-gray-800' },
        { quote: 'AI agent biết sàng lọc đã thay đổi hẳn cách chúng tôi tìm khách. Giờ chúng tôi chỉ nói chuyện với khách thực sự sẵn sàng. Tỷ lệ chốt tăng từ 12% lên 31% trong 6 tuần.', name: 'Marc L.', role: 'Giám đốc kinh doanh', company: 'Công ty bất động sản, Paris (Pháp)', initials: 'ML', color: 'bg-gray-200 text-gray-800' },
        { quote: 'Trợ lý RAG nắm rõ cả 800 sản phẩm của chúng tôi. Khách tìm đúng thứ họ cần mà không phải liên hệ bộ phận chăm sóc khách hàng. Rất ấn tượng.', name: 'Anne-Sophie T.', role: 'Giám đốc điều hành', company: 'Thương mại điện tử thời trang, Lyon (Pháp)', initials: 'AT', color: 'bg-gray-200 text-gray-800' },
      ],
    },
    faq: {
      h2: 'Câu hỏi thường gặp',
      items: [
        { q: 'Chatbot thông thường và AI agent RAG khác nhau thế nào?', a: 'Chatbot thông thường trả lời theo một cây kịch bản cố định. AI agent RAG (Retrieval-Augmented Generation) lập chỉ mục nội dung thật của bạn — website, PDF, Notion, CRM — rồi tạo ra câu trả lời chính xác dựa trên chính DỮ LIỆU CỦA BẠN. Nó hiểu câu hỏi viết theo ngôn ngữ tự nhiên, xử lý được các sắc thái và học từ kho dữ liệu của bạn. Kết quả: không còn câu trả lời chung chung.' },
        { q: 'Dữ liệu của tôi có được giữ bí mật khi dùng AI không?', a: 'Có. Chúng tôi cấu hình các mô hình sao cho dữ liệu của bạn không bao giờ được dùng để huấn luyện mô hình của bên thứ ba. Với những dự án nhạy cảm (y tế, pháp lý, dữ liệu khách hàng quan trọng), chúng tôi khuyến nghị dùng mô hình mã nguồn mở tự cài (Mistral hoặc LLama) trên máy chủ riêng do bạn kiểm soát. Khi đó dữ liệu không rời khỏi hệ thống của bạn.' },
        { q: 'Claude, GPT và Mistral khác nhau ra sao?', a: 'Claude (Anthropic) mạnh ở suy luận phức tạp và tuân thủ quy tắc — đây là lựa chọn chúng tôi khuyến nghị cho những AI agent quan trọng. GPT-4o xử lý được nhiều loại dữ liệu và có hệ sinh thái rộng nhất. Mistral là mã nguồn mở, có thể tự cài trên máy chủ riêng — phù hợp với dữ liệu nhạy cảm và ngân sách chặt. Chúng tôi luôn chọn mô hình hợp với bài toán của bạn, không phải mô hình đắt nhất.' },
        { q: 'Chatbot AI có nói được nhiều ngôn ngữ không?', a: 'Có. Các mô hình LLM hiện nay (Claude, GPT, Mistral) vốn đã đa ngôn ngữ. Chúng tôi cấu hình để chatbot tự nhận diện ngôn ngữ và trả lời đúng ngôn ngữ của người dùng — rất hữu ích với khách quốc tế tại Hà Nội. Gói Essentiel gồm 1 ngôn ngữ, gói Business gồm 3 ngôn ngữ (ví dụ Việt – Anh – Pháp), gói Premium không giới hạn.' },
        { q: 'AI agent được bảo trì và cải thiện theo thời gian như thế nào?', a: 'AI agent tốt lên theo mức độ sử dụng. Mỗi tháng, chúng tôi phân tích các cuộc hội thoại (câu hỏi chưa có lời giải, mức độ hài lòng, những lần chuyển tiếp không cần thiết) rồi tối ưu câu lệnh, bổ sung nguồn dữ liệu và tinh chỉnh cách chấm điểm. Gói Business đã bao gồm 1 giờ tối ưu mỗi tháng.' },
        { q: 'Có tích hợp AI vào website hiện tại mà không cần làm lại website không?', a: 'Có. Chúng tôi gắn trợ lý AI vào website sẵn có của bạn bằng một widget (vài dòng JavaScript) hoặc qua API. Không cần làm lại website — AI sẽ khớp với bộ nhận diện và phong cách của bạn.' },
        { q: 'Chi phí cho một dự án AI trọn gói là bao nhiêu?', a: 'Chúng tôi không áp một bảng giá cố định: chi phí phụ thuộc vào số tình huống hội thoại, khối lượng tài liệu cần lập chỉ mục, số ngôn ngữ và mức độ tích hợp vào hệ thống của bạn. Sau buổi tư vấn miễn phí, bạn nhận được báo giá chi tiết theo đúng nhu cầu thực tế, kèm phạm vi công việc và thời gian triển khai, trong vòng 24 giờ. Bạn có thể đặt lịch trực tiếp tại neuraweb.fr/vi/booking hoặc gửi yêu cầu qua trang liên hệ.' },
      ],
    },
    more: {
      h3: 'Tìm hiểu thêm',
      items: [
        { label: 'Rà soát chất lượng dữ liệu: vì sao dự án AI thất bại', href: '/blog/audit-qualite-donnees-projet-ia' },
        { label: 'Cách tích hợp AI vào website của bạn', href: '/blog/integrer-ia-site-web-2025' },
        { label: 'AI tác tử: điều đối thủ của bạn đã làm', href: '/blog/ia-agents-remplacent-equipes-2026' },
        { label: '7 cách dùng AI để có thêm khách hàng', href: '/blog/site-vitrine-ia-machine-leads' },
        { label: 'Tự động hoá bằng AI cho doanh nghiệp SME: chi phí thực tế 2026', href: '/blog/automatisation-ia-pme-prix-2026' },
      ],
    },
    cta: { badge: 'Tư vấn AI miễn phí · Không ràng buộc', h2: 'Sẵn sàng đưa AI vào hoạt động kinh doanh?', p: '30 phút để xác định 3 tình huống nên áp dụng AI trước và lợi ích ước tính. Miễn phí, không ràng buộc, không thuật ngữ khó hiểu.', ctaAudit: 'Nhận tư vấn AI miễn phí', ctaBlog: 'Đọc hướng dẫn về AI', ctaBlogHref: '/blog/integrer-ia-site-web-2025' },
    detail: { included: 'Đã bao gồm', notIncluded: 'Chưa bao gồm', options: 'Tuỳ chọn thêm', maintenance: 'Bảo trì', choose: 'Nhận báo giá cho gói', payment: 'Có thể thanh toán theo tiến độ · 40% khi khởi động, 30% khi duyệt, 30% khi bàn giao' },
    showDetails: 'Xem chi tiết ↓', hideDetails: 'Ẩn chi tiết ↑',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════════════════════

const STATS_VALUES = ['70%', '24/7', '3×'];
const SERVICE_ICONS = [MessageSquare, Code2, Bot, FileText, Search, Layers];
const SERVICE_BADGE_COLORS = ['bg-gray-900', 'bg-gray-900', 'bg-gray-700', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500'];
const SERVICE_ACCENT_COLORS = ['border-white', 'border-white', 'border-gray-400', 'border-amber-400', 'border-emerald-400', 'border-rose-400'];

const PACK_PRICES = [1499, 3999, 9999];
const PACK_MONTHLY = [39, 89, 189];
const PACK_DELIVERY: Record<Lang, string[]> = {
  fr: ['1 à 2 semaines', '3 à 5 semaines', '6 à 12 semaines'],
  en: ['1 to 2 weeks', '3 to 5 weeks', '6 to 12 weeks'],
  es: ['1 a 2 semanas', '3 a 5 semanas', '6 a 12 semanas'],
  vi: ['1–2 tuần', '3–5 tuần', '6–12 tuần'],
};
const PACK_IDS = ['essentiel', 'business', 'premium'] as const;
type PackId = (typeof PACK_IDS)[number];

// ── Mode devis (vi) ────────────────────────────────────────────────────────
// Sur la version vietnamienne, aucun montant EUR n'est affiché : les 3 paliers
// passent en devis (Stage C du plan vi). Le seul prix visible du site vi est
// celui de l'offre Landing Page Express, dans son encart de services-pricing.tsx.
const QUOTE_ONLY_LANGS: readonly Lang[] = ['vi'];
const QUOTE_PRICE_LABEL = 'Theo báo giá';
const QUOTE_PRICE_NOTE = 'Báo giá miễn phí trong 24 giờ';
const QUOTE_MAINTENANCE_LABEL = 'Bảo trì hằng tháng theo báo giá';

const MODELS = [
  { name: 'Claude (Anthropic)', strength: { fr: 'Raisonnement complexe, conformité', en: 'Complex reasoning, compliance', es: 'Razonamiento complejo, conformidad', vi: 'Suy luận phức tạp, tuân thủ quy tắc' }, color: 'text-orange-600 dark:text-orange-400' },
  { name: 'Mistral', strength: { fr: 'Open source, souveraineté, français', en: 'Open source, sovereignty, French', es: 'Open source, soberanía, francés', vi: 'Mã nguồn mở, tự chủ dữ liệu, tiếng Pháp' }, color: 'text-gray-700 dark:text-gray-300' },
  { name: 'GPT-4o (OpenAI)', strength: { fr: 'Multimodal, éco-système vaste', en: 'Multimodal, vast ecosystem', es: 'Multimodal, ecosistema amplio', vi: 'Đa phương thức, hệ sinh thái rộng' }, color: 'text-green-600 dark:text-green-400' },
  { name: 'LLama 3 (Meta)', strength: { fr: 'Self-hosted gratuit, RGPD total', en: 'Free self-hosted, full GDPR', es: 'Self-hosted gratuito, RGPD total', vi: 'Tự cài miễn phí, dữ liệu do bạn kiểm soát' }, color: 'text-purple-600 dark:text-purple-400' },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

// Délais d'apparition échelonnés pour les grilles de cartes (reveal au scroll)
const DELAY_CLASSES = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];

export function IntegrationIAPageClient({ lang }: Props) {
  const [selectedPack, setSelectedPack] = useState<PackId>('business');
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const c = CONTENT[lang];
  const packIdx = PACK_IDS.indexOf(selectedPack);
  const activePack = c.packs.items[packIdx];
  const isQuoteOnly = QUOTE_ONLY_LANGS.includes(lang);

  // Animations au scroll (GSAP ScrollTrigger) + parallaxe — voir useGsapReveal
  const containerRef = useRef<HTMLElement>(null);
  useGsapReveal(containerRef, [lang]);

  return (
    <>
      <Header />
      <main ref={containerRef} id="main-content" className="min-h-screen">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-24 overflow-hidden" style={{ background: '#070F26' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div data-parallax="-50" className="absolute top-0 left-1/2 -ml-[400px] w-[800px] h-[400px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div data-parallax="80" className="absolute top-20 right-1/4 w-[400px] h-[300px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-on-scroll fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20 text-white text-sm font-medium mb-6">
              <Brain size={14} /><span>{c.hero.badge}</span>
            </div>
            <h1 className="animate-on-scroll fade-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {c.hero.h1}{' '}
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{c.hero.h1highlight}</span>
            </h1>
            <p className="animate-on-scroll fade-up delay-200 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">{c.hero.p}</p>
            <div className="animate-on-scroll fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <LocalizedLink href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-gray-900 transition-all duration-300 hover:opacity-90" style={{ background: '#ffffff', boxShadow: '0 4px 20px rgba(255,255,255,0.2)' }}>
                <Brain size={18} />{c.hero.ctaAudit}<ArrowRight size={16} />
              </LocalizedLink>
              <a href="#pricing" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300">
                {c.hero.ctaPricing}<ChevronDown size={16} />
              </a>
            </div>
            <div className="animate-on-scroll fade-up delay-400">
            <ResponsiveCards breakpoint="sm" gridClass="grid-cols-3 max-w-3xl mx-auto" gridGap="gap-6">
              {c.stats.map((stat, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 h-full">
                  <div className="text-3xl font-bold mb-1 text-white">{STATS_VALUES[i]}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </ResponsiveCards>
            </div>
          </div>
        </section>

        {/* ── PROBLEMS ──────────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: '#F7FAFD' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0e1b3d] mb-4">{c.problems.h2}</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">{c.problems.subtitle}</p>
            </div>
            <div className="animate-on-scroll fade-up delay-100">
            <ResponsiveCards breakpoint="sm" gridClass="grid-cols-2 lg:grid-cols-4" gridGap="gap-6">
              {c.problems.items.map((p, i) => {
                const icons = [MessageSquare, Users, Database, TrendingUp];
                const colors = ['text-white bg-white/5', 'text-white bg-white/5', 'text-white bg-white/5', 'text-rose-400 bg-rose-400/10'];
                const Icon = icons[i];
                return (
                  <div key={i} className="rounded-xl border border-slate-200 shadow-sm bg-white p-6 hover:shadow-md transition-shadow h-full">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[i]}`}><Icon size={22} /></div>
                    <h3 className="font-semibold text-[#0e1b3d] mb-2 text-sm leading-snug">{p.title}</h3>
                    <p className="text-slate-500 text-sm">{p.text}</p>
                  </div>
                );
              })}
            </ResponsiveCards>
            </div>
          </div>
        </section>

        {/* ── SERVICES ──────────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: '#070F26' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{c.services.h2}</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">{c.services.subtitle}</p>
            </div>
            <div className="animate-on-scroll fade-up delay-100">
            <ResponsiveCards breakpoint="md" gridClass="grid-cols-2 lg:grid-cols-3" gridGap="gap-6">
              {c.services.items.map((service, i) => {
                const Icon = SERVICE_ICONS[i];
                const isExpanded = expandedService === i;
                return (
                  <div key={i} className={`rounded-xl border-2 ${SERVICE_ACCENT_COLORS[i]} bg-[#0e1b3d]/30 p-6 cursor-pointer hover:shadow-lg transition-all duration-300 h-full`} onClick={() => setExpandedService(isExpanded ? null : i)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center"><Icon size={20} className="text-slate-300" /></div>
                      <span className={`${SERVICE_BADGE_COLORS[i]} text-white text-xs font-semibold px-3 py-1 rounded-full`}>{service.badge}</span>
                    </div>
                    <h3 className="font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-slate-400 text-sm mb-3">{service.desc}</p>
                    {isExpanded && (
                      <ul className="mt-3 space-y-2 border-t border-slate-700 pt-3">
                        {service.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                            <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />{d}
                          </li>
                        ))}
                      </ul>
                    )}
                    <button className="mt-2 text-xs text-gray-600 hover:text-gray-300 font-medium">
                      {isExpanded ? c.hideDetails : c.showDetails}
                    </button>
                  </div>
                );
              })}
            </ResponsiveCards>
            </div>
          </div>
        </section>

        {/* ── MODÈLES IA ────────────────────────────────────────────────── */}
        <section className="py-14 border-y border-slate-200" style={{ background: '#F7FAFD' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="animate-on-scroll fade-up text-center text-sm text-slate-500 font-medium mb-8 uppercase tracking-wider">{c.models.label}</p>
            <div className="animate-on-scroll fade-up delay-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {MODELS.map((model, i) => (
                <div key={i} className="rounded-xl bg-white border border-slate-200 p-4 text-center">
                  <div className={`font-bold text-sm mb-1 ${model.color}`}>{model.name}</div>
                  <div className="text-xs text-slate-500">{model.strength[lang]}</div>
                </div>
              ))}
            </div>
            <p className="animate-on-scroll fade-up delay-200 text-center text-xs text-slate-500 mt-6">{c.models.note}</p>
          </div>
        </section>

        {/* ── CAS D'USAGE ───────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: '#070F26' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">{c.useCases.h2}</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">{c.useCases.subtitle}</p>
            </div>
            <div className="animate-on-scroll fade-up delay-100">
            <ResponsiveCards breakpoint="sm" gridClass="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" gridGap="gap-4">
              {c.useCases.items.map((uc, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 h-full flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="text-sm font-bold text-white">{uc.sector}</div>
                    <span className="text-xs bg-white/10 text-white px-2.5 py-1 rounded-full font-medium whitespace-nowrap">{uc.pack}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2 leading-relaxed">{uc.context}</p>
                  <p className="text-sm text-slate-200 mb-3 leading-relaxed">{uc.solution}</p>
                  <div className="mt-auto flex items-start gap-2 rounded-lg bg-emerald-400/10 border border-emerald-400/20 p-2.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-emerald-300 leading-snug">{uc.result}</span>
                  </div>
                </div>
              ))}
            </ResponsiveCards>
            </div>
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────────────────────────── */}
        <section id="pricing" className="py-20" style={{ background: '#F7FAFD' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0e1b3d] mb-4">{c.packs.h2}</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">{c.packs.subtitle}</p>
            </div>

            {/* Sélecteur mobile */}
            <div className="flex gap-2 mb-8 justify-center sm:hidden">
              {PACK_IDS.map((id, i) => (
                <button key={id} onClick={() => setSelectedPack(id)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${selectedPack === id ? 'bg-gray-900 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                  {c.packs.items[i].name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Cards desktop */}
            <div className="animate-on-scroll fade-up delay-100 hidden sm:grid grid-cols-3 gap-6 mb-10">
              {PACK_IDS.map((id, i) => {
                const pack = c.packs.items[i];
                const borders = ['border-white/10', 'border-gray-900 dark:border-white', 'border-gray-900 dark:border-white'];
                return (
                  <div key={id} onClick={() => setSelectedPack(id)} className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ${borders[i]} ${selectedPack === id ? 'shadow-xl bg-white scale-[1.02]' : 'bg-white hover:shadow-md'}`}>
                    {i === 1 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-4 py-1 rounded-full">{c.packs.popular}</span>}
                    <h3 className="font-bold text-[#0e1b3d] text-lg mb-1">{pack.name}</h3>
                    <p className="text-slate-500 text-sm mb-4">{pack.tagline}</p>
                    <div className="mb-4">
                      {isQuoteOnly ? (
                        <>
                          <span className="text-3xl font-bold text-[#0e1b3d]">{QUOTE_PRICE_LABEL}</span>
                          <div className="text-sm text-slate-500">{QUOTE_PRICE_NOTE}</div>
                        </>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-[#0e1b3d]">{PACK_PRICES[i].toLocaleString('fr-FR')} €</span>
                          <span className="text-slate-500 text-sm ml-1">{c.packs.ht}</span>
                          <div className="text-sm text-slate-500">+ {PACK_MONTHLY[i]} {c.packs.monthly}</div>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mb-4">⏱ {c.packs.delivery} : {PACK_DELIVERY[lang][i]}</div>
                    <ul className="space-y-2">
                      {pack.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                          <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Détails pack sélectionné */}
            <div className="animate-on-scroll fade-up delay-200 rounded-2xl border border-slate-200 shadow-sm bg-white p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-[#0e1b3d] mb-1">{activePack.name}</h3>
                  <p className="text-slate-500 text-sm">{activePack.tagline}</p>
                </div>
                <LocalizedLink href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:opacity-90" style={{ background: '#111827', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                  {c.detail.choose} {activePack.name}<ArrowRight size={14} />
                </LocalizedLink>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold text-[#0e1b3d] mb-3 flex items-center gap-2"><Check size={16} className="text-emerald-500" /> {c.detail.included}</h4>
                  <ul className="space-y-2">
                    {activePack.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check size={13} className="text-emerald-500 mt-0.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0e1b3d] mb-3 flex items-center gap-2"><XIcon size={16} className="text-rose-400" /> {c.detail.notIncluded}</h4>
                  <ul className="space-y-2">
                    {activePack.notIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                        <XIcon size={13} className="text-rose-400 mt-0.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0e1b3d] mb-3">{c.detail.options}</h4>
                  <ul className="space-y-2 mb-6">
                    {activePack.options.map((opt, i) => (
                      <li key={i} className="flex items-start justify-between gap-2 text-sm">
                        <span className="text-slate-600">{opt.label}</span>
                        <span className="text-[#0e1b3d] font-medium shrink-0">{opt.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      {isQuoteOnly
                        ? QUOTE_MAINTENANCE_LABEL
                        : `${c.detail.maintenance} ${PACK_MONTHLY[packIdx]} €/${lang === 'fr' ? 'mois' : lang === 'es' ? 'mes' : 'month'}`}
                    </div>
                    <ul className="space-y-1">
                      {activePack.maintenanceItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle size={11} className="text-emerald-500 shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-slate-500 mt-6">{c.detail.payment}</p>
          </div>
        </section>

        {/* ── TÉMOIGNAGES ───────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: '#070F26' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">{c.testimonials.h2}</h2>
            </div>
            <div className="animate-on-scroll fade-up delay-100">
            <ResponsiveCards breakpoint="md" gridClass="grid-cols-3" gridGap="gap-6">
              {c.testimonials.items.map((t, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6 h-full">
                  <div className="flex mb-3">{[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}</div>
                  <p className="text-slate-300 text-sm mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-xs font-bold`}>{t.initials}</div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.role} · {t.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </ResponsiveCards>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: '#F7FAFD' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0e1b3d] mb-4">{c.faq.h2}</h2>
            </div>
            <Accordion type="single" collapsible className="animate-on-scroll fade-up delay-100 space-y-3">
              {c.faq.items.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 text-left text-sm font-semibold text-[#0e1b3d] hover:no-underline">{item.q}</AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-sm text-slate-600 leading-relaxed">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="animate-on-scroll fade-up delay-200 mt-10 rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-[#0e1b3d] mb-4">{c.more.h3}</h3>
              <ul className="space-y-3">
                {c.more.items.map((item, i) => (
                  <li key={i}>
                    <LocalizedLink href={item.href} className="flex items-center gap-2 text-sm text-slate-700 hover:text-[#0e1b3d] hover:underline">
                      <ArrowRight size={14} />{item.label}
                    </LocalizedLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ─────────────────────────────────────────────────── */}
        <section className="py-24" style={{ background: '#070F26' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-on-scroll fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20 text-white text-sm font-medium mb-6">
              <Sparkles size={14} />{c.cta.badge}
            </div>
            <h2 className="animate-on-scroll fade-up delay-100 text-3xl sm:text-4xl font-bold text-white mb-6">{c.cta.h2}</h2>
            <p className="animate-on-scroll fade-up delay-200 text-slate-300 text-lg mb-10 max-w-2xl mx-auto">{c.cta.p}</p>
            <div className="animate-on-scroll fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center">
              <LocalizedLink href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300" style={{ background: '#ffffff', boxShadow: '0 4px 20px rgba(255,255,255,0.2)' }}>
                <Brain size={18} className="text-[#050510]" />
                <span className="text-[#050510]">{c.cta.ctaAudit}</span>
                <ArrowRight size={16} className="text-[#050510]" />
              </LocalizedLink>
              <LocalizedLink href={c.cta.ctaBlogHref} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white transition-all duration-300">
                {c.cta.ctaBlog}<ArrowRight size={16} />
              </LocalizedLink>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
