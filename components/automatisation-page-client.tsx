'use client';

import React, { useRef, useState } from 'react';
import { useGsapReveal } from '@/hooks/use-gsap-reveal';
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

type Lang = 'fr' | 'en' | 'es';

interface Props { lang: Lang }

// ═══════════════════════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════════════════════

const CONTENT: Record<Lang, {
  hero: { badge: string; h1: string; h1highlight: string; p: string; ctaAudit: string; ctaPricing: string };
  stats: { label: string }[];
  problems: { h2: string; subtitle: string; items: { title: string; text: string }[] };
  services: { h2: string; subtitle: string; items: { title: string; desc: string; details: string[]; badge: string }[] };
  tools: { label: string };
  useCases: { h2: string; subtitle: string; items: { sector: string; context: string; solution: string; result: string; pack: string }[] };
  packs: {
    h2: string; subtitle: string; popular: string; ht: string; monthly: string; delivery: string;
    items: { name: string; tagline: string; bullets: string[]; included: string[]; notIncluded: string[]; options: { label: string; price: string }[]; maintenanceItems: string[] }[];
  };
  process: { h2: string; subtitle: string; steps: { title: string; duration: string; desc: string; bring: string; bringLabel: string }[] };
  testimonials: { h2: string; items: { quote: string; name: string; role: string; company: string; initials: string; color: string }[] };
  faq: { h2: string; items: { q: string; a: string }[] };
  more: { h3: string; items: { label: string; href: string }[] };
  cta: { badge: string; h2: string; p: string; ctaAudit: string; ctaBlog: string; ctaBlogHref: string };
  detail: { included: string; notIncluded: string; options: string; maintenance: string; choose: string; payment: string };
  showDetails: string; hideDetails: string;
}> = {
  fr: {
    hero: {
      badge: 'Automatisation n8n · Make · Zapier · Agents IA',
      h1: 'Automatisez vos processus,',
      h1highlight: 'libérez votre potentiel',
      p: "Nous construisons vos workflows sur mesure avec n8n, Make ou Zapier, déployons des agents IA autonomes et connectons tous vos outils. Audit gratuit inclus, ROI mesurable en 30 jours.",
      ctaAudit: "Demander l'audit gratuit",
      ctaPricing: 'Voir les tarifs',
    },
    stats: [
      { label: 'économisées / semaine en moyenne' },
      { label: 'plus de leads qualifiés traités' },
      { label: 'de réduction des tâches manuelles' },
    ],
    problems: {
      h2: 'Ça vous parle ?',
      subtitle: "Les PME françaises perdent en moyenne <strong>12h par semaine</strong> sur des tâches que l'automatisation peut traiter en quelques secondes.",
      items: [
        { title: 'Vos équipes passent des heures sur des tâches répétitives', text: "Saisie manuelle, copier-coller entre outils, relances email, transferts de données : chaque minute perdue est une minute en moins pour votre cœur de métier." },
        { title: 'Des leads tombent dans les failles entre vos outils', text: "Un formulaire rempli le soir, une relance oubliée, un CRM non synchronisé : vous perdez des opportunités sans même le savoir." },
        { title: 'Vos données sont éparpillées entre 5, 10, 15 outils', text: "Google Sheets, HubSpot, Notion, Airtable, Slack, Gmail... la circulation de l'information coûte cher en énergie et génère des erreurs." },
        { title: "Vous ne savez pas par quoi commencer", text: "L'automatisation fait peur. Vous ne savez pas quels workflows ont le meilleur ROI, ni quel outil choisir entre n8n, Make et Zapier." },
      ],
    },
    services: {
      h2: 'Ce que nous construisons pour vous',
      subtitle: "De l'audit initial au monitoring mensuel, nous couvrons toute la chaîne d'automatisation.",
      items: [
        { title: 'Audit des processus automatisables', desc: 'Nous cartographions vos flux, identifions les tâches répétitives à fort volume et calculons le ROI potentiel de chaque automatisation. Résultat : une feuille de route priorisée.', details: ['Cartographie complète de vos workflows existants', 'Matrice impact / complexité / coût', 'ROI estimé par processus', 'Recommandation Make vs n8n vs Zapier'], badge: 'Offert' },
        { title: 'Workflows n8n / Make / Zapier', desc: "Nous construisons vos automatisations sur mesure : formulaire→CRM, qualification de leads, synchronisation d'outils, notifications, relances automatiques, reporting.", details: ['Connexion formulaire → CRM / Airtable / Notion', 'Relances automatiques par email ou SMS', 'Synchronisation multi-outils (Slack, Gmail, Drive)', 'Alertes et notifications en temps réel'], badge: 'À partir de 999 €' },
        { title: 'Agent IA commercial', desc: 'Un agent IA autonome qualifie vos leads entrants 24h/24, répond aux questions fréquentes, prend les rendez-vous et transmet les prospects chauds à votre équipe.', details: ['Qualification automatique des leads entrants', 'Réponses aux questions fréquentes (FAQ)', 'Intégration calendrier (Calendly, Google Agenda)', 'Handoff vers CRM avec scoring'], badge: 'À partir de 2 499 €' },
        { title: 'Automatisation marketing & nurturing', desc: 'Séquences email intelligentes, lead scoring, personnalisation dynamique, segmentation automatique : votre marketing travaille même quand vous dormez.', details: ['Séquences de nurturing multi-étapes', 'Lead scoring automatique', 'Segmentation comportementale', 'Intégration Brevo, Mailchimp, ActiveCampaign'], badge: 'À partir de 1 499 €' },
        { title: 'Synchronisation CRM / ERP / Facturation', desc: "Connectez HubSpot, Notion, Airtable, Pennylane, Sellsy, QuickBooks et tous vos outils métier. Fini les doubles saisies et les données incohérentes.", details: ['Connexion bidirectionnelle CRM ↔ outils', 'Synchronisation devis / facturation automatique', 'Mise à jour temps réel des fiches contacts', 'Archivage et traçabilité des échanges'], badge: 'À partir de 1 499 €' },
        { title: 'Monitoring & optimisation continue', desc: "Vos workflows sont surveillés, les erreurs détectées en temps réel, les volumes analysés. Un rapport mensuel vous indique les performances et les pistes d'amélioration.", details: ['Surveillance des workflows 24h/24', "Alertes en cas d'erreur ou d'anomalie", 'Rapport mensuel de performance', 'Optimisation continue sur suggestion'], badge: 'Abonnement mensuel' },
      ],
    },
    tools: { label: 'Nous connectons vos outils' },
    useCases: {
      h2: "Cas d'usage par métier",
      subtitle: 'Des scénarios concrets, avec le pack adapté et le gain mesurable que vous pouvez en attendre.',
      items: [
        { sector: 'Cabinet (avocat, expert-comptable, conseil)', context: 'Chaque lead entrant est traité à la main : email, saisie Excel, devis, relances — 45 min par dossier.', solution: 'Workflow formulaire → qualification IA → CRM → prise de RDV Calendly → devis généré automatiquement.', result: 'Traitement d\'un lead : 45 min → 3 min · +10 pts de taux de conversion · 0 oubli de relance', pack: 'Starter Auto' },
        { sector: 'Agence / PME B2B', context: 'Prospection LinkedIn manuelle, CRM mis à jour à 60%, nurturing fait au coup par coup.', solution: '3 à 5 workflows + agent IA de qualification (scoring BANT) + séquence de nurturing + reporting automatique.', result: 'Prospection 15h → 3h/semaine · CRM 100% à jour · taux de réponse ×2 (IA personnalisée)', pack: 'Business Auto' },
        { sector: 'E-commerce / Retail', context: 'Commandes, SAV et stock gérés dans des outils non connectés, doubles saisies et erreurs.', solution: 'Synchronisation commandes ↔ CRM ↔ facturation + alertes de stock + relances panier automatiques.', result: 'Erreurs de saisie quasi nulles · relances panier 24/7 · suivi commande sans intervention', pack: 'Business Auto' },
        { sector: 'ETI / multi-sites', context: '10 à 15 outils non connectés (CRM, ERP, compta, RH), reporting consolidé à la main sur 3 jours.', solution: 'Infrastructure n8n self-hosted + 3 agents IA (leads, support, contenu) + dashboard de pilotage temps réel.', result: '−28h/semaine de saisie · ruptures de stock −87% · reporting 3 jours → 10 min', pack: 'Full Automation' },
      ],
    },
    packs: {
      h2: 'Nos packs automatisation',
      subtitle: 'Des prix transparents, sans surprise. TVA non applicable (art. 293B du CGI).',
      popular: 'Le plus populaire',
      ht: 'HT',
      monthly: '€/mois maintenance',
      delivery: 'Délai',
      items: [
        {
          name: 'Starter Auto', tagline: 'Votre premier workflow. ROI en 30 jours.',
          bullets: ["Audit des processus (jusqu'à 5 workflows identifiés)", '1 workflow complexe livré et testé', 'Formation 30 min + documentation', 'Support email 30 jours'],
          included: ['Audit initial et cartographie', "1 workflow n8n ou Make (jusqu'à 8 étapes)", 'Connexion à 3 outils maximum', 'Tests et validation en production', 'Documentation du workflow', 'Formation 30 min en visio', 'Support email 30 jours post-livraison'],
          notIncluded: ['Agents IA autonomes', 'Plus de 1 workflow', 'Connexion à plus de 3 outils', 'Monitoring continu', 'Rapport mensuel'],
          options: [{ label: 'Workflow supplémentaire', price: '+690 € HT' }, { label: 'Intégration outil supplémentaire', price: '+190 € HT' }, { label: 'Extension support 3 mois', price: '+149 € HT' }],
          maintenanceItems: ['Surveillance mensuelle du workflow', 'Mises à jour compatibilité', 'Support email (délai 72h)'],
        },
        {
          name: 'Business Auto', tagline: "Plusieurs processus connectés. 1 agent IA inclus.",
          bullets: ['Audit complet (processus illimités)', '3 à 5 workflows sur mesure', '1 agent IA qualification leads', 'Monitoring mensuel inclus'],
          included: ['Audit complet de tous vos processus', "3 à 5 workflows n8n ou Make (jusqu'à 20 étapes chacun)", 'Connexion à 8 outils maximum', '1 agent IA qualification / réponse leads', 'Intégration CRM (HubSpot, Notion, Airtable)', "Séquence de nurturing email (jusqu'à 5 étapes)", 'Tests et validation en production', 'Formation 1h en visio + guide PDF', 'Monitoring mensuel + rapport de performance', 'Support prioritaire email (délai 48h)'],
          notIncluded: ['Plus de 5 workflows', 'Connexion à plus de 8 outils', 'Agents IA avancés multi-sources', 'Développement IA sur mesure', 'Intégration ERP / logiciel legacy'],
          options: [{ label: 'Workflow supplémentaire', price: '+590 € HT' }, { label: 'Agent IA supplémentaire', price: '+1 490 € HT' }, { label: 'Intégration ERP / logiciel legacy', price: 'Sur devis' }, { label: "Formation équipe (jusqu'à 5 personnes)", price: '+390 € HT' }],
          maintenanceItems: ['Surveillance 24/7 des workflows', 'Alertes en temps réel', 'Mises à jour et corrections', 'Rapport mensuel de performance', 'Support prioritaire (délai 48h)', '2 modifications de workflow / mois'],
        },
        {
          name: 'Full Automation', tagline: 'Infrastructure complète. Agents IA. ROI garanti.',
          bullets: ['Audit + roadmap 6 mois', 'Workflows illimités', 'Agents IA multi-sources', 'Monitoring temps réel + accompagnement'],
          included: ["Audit complet + roadmap d'automatisation 6 mois", 'Workflows illimités (n8n self-hosted ou cloud)', 'Connexion illimitée à vos outils', "Jusqu'à 3 agents IA (leads, SEO, contenu, support)", 'Intégration CRM + ERP + facturation', 'Séquences marketing automation complètes', 'Dashboard de pilotage personnalisé', 'Formation équipe 4h + documentation vidéo', 'Hébergement n8n self-hosted inclus (si besoin)', 'Monitoring temps réel + alertes', 'Rapport mensuel avancé + réunion de suivi', 'Support dédié (délai 24h)', '1 séance stratégie IA / mois pendant 3 mois'],
          notIncluded: ['Budget publicitaire (Ads)', 'Community management', 'Développements backend complexes hors workflow', 'Intégrations legacy sans API (sur devis)'],
          options: [{ label: 'Hébergement n8n self-hosted dédié', price: '+390 € HT / an' }, { label: 'Agent IA supplémentaire', price: '+990 € HT' }, { label: 'Intégration legacy (sans API)', price: 'Sur devis' }, { label: 'Accompagnement 6 mois supplémentaires', price: '+990 € HT' }],
          maintenanceItems: ['Surveillance temps réel + alertes immédiates', 'Mises à jour proactives', 'Rapport mensuel avancé', 'Réunion mensuelle de suivi (30 min)', 'Support dédié 7j/7 (délai 24h)', 'Modifications illimitées', 'Optimisation continue sur suggestion'],
        },
      ],
    },
    process: {
      h2: 'Notre méthode en 4 étapes',
      subtitle: 'Du premier appel à la mise en production : un processus éprouvé, des livrables clairs à chaque étape.',
      steps: [
        { title: 'Audit gratuit', duration: '30 à 60 min', desc: 'On analyse vos outils, vos processus et vos douleurs. Vous repartez avec une liste des workflows à automatiser en priorité et leur ROI estimé.', bring: 'Vos outils, vos processus', bringLabel: 'Vous apportez :' },
        { title: 'Conception', duration: '3 à 5 jours', desc: "Nous modélisons chaque workflow, choisissons les bons outils et validons l'architecture avec vous avant de coder la moindre ligne.", bring: 'Vos accès outils (lecture seule)', bringLabel: 'Vous apportez :' },
        { title: 'Construction & tests', duration: '1 à 8 semaines', desc: 'Nous développons les workflows, les connectons à vos outils et les testons sur des données réelles. Vous validez chaque étape.', bring: 'Vos données de test', bringLabel: 'Vous apportez :' },
        { title: 'Mise en production', duration: '1 jour', desc: 'Basculement en production avec surveillance renforcée les 7 premiers jours. Formation de votre équipe incluse.', bring: '30 min pour la formation', bringLabel: 'Vous apportez :' },
      ],
    },
    testimonials: {
      h2: 'Ce que disent nos clients',
      items: [
        { quote: "En 3 semaines, NeuraWeb a automatisé notre traitement des devis entrants. On a récupéré 8h par semaine, et notre taux de réponse est passé de 6h à 12 minutes.", name: 'Alexandre D.', role: 'Directeur commercial', company: 'Agence immobilière, Paris', initials: 'AD', color: 'bg-white/10 text-white' },
        { quote: "Le workflow de qualification de leads n8n a transformé notre équipe commerciale. Les commerciaux ne traitent plus que des leads chauds. Le CA a augmenté de 34% en 2 mois.", name: 'Sophie M.', role: 'CEO', company: 'SaaS B2B, Lyon', initials: 'SM', color: 'bg-white/10 text-white' },
        { quote: "J'avais peur que ce soit compliqué. L'audit gratuit a tout clarifié. On est partis sur le pack Business, livré en 4 semaines. La synchro Airtable-Gmail-Slack fonctionne impeccablement.", name: 'Thomas R.', role: 'Fondateur', company: 'Cabinet de conseil, Bordeaux', initials: 'TR', color: 'bg-emerald-400/20 text-emerald-400' },
      ],
    },
    faq: {
      h2: 'Questions fréquentes',
      items: [
        { q: 'Quelle est la différence entre n8n, Make et Zapier ?', a: "Les trois sont des plateformes d'automatisation no-code. Zapier est le plus simple mais le plus cher à l'échelle. Make (ex-Integromat) est notre recommandation par défaut : 12€/mois pour 10 000 opérations, serveurs EU, connecteurs IA natifs. n8n est indispensable si vous déployez des agents IA autonomes ou traitez des données sensibles — l'édition Community est open-source et gratuite en self-hosted. Nous choisissons l'outil adapté à votre cas d'usage, pas celui qui coûte le plus cher." },
        { q: 'Combien de temps avant de voir un ROI ?', a: "Pour un workflow simple (formulaire→CRM→notification), le ROI est immédiat dès la mise en production : 0 saisie manuelle, 0 lead raté. Pour un agent IA de qualification, comptez 2 à 4 semaines pour affiner les prompts et les seuils de scoring. La plupart de nos clients amortissent leur investissement en moins de 3 mois." },
        { q: 'Mes données passent-elles par vos serveurs ?', a: "Non. Nous configurons les automatisations directement dans Make cloud (serveurs AWS EU) ou dans votre propre instance n8n self-hosted. Vos données ne transitent pas par nos serveurs — elles circulent entre vos outils via leurs API. Pour les données sensibles (santé, données clients critiques), nous recommandons le self-hosting n8n sur un VPS en France." },
        { q: 'Puis-je modifier les workflows après livraison ?', a: "Oui. Les workflows sont documentés et vous êtes formés pour les comprendre. En Pack Starter, 2 modifications mineures sont incluses dans les 30 jours post-livraison. En Pack Business, 2 modifications par mois sont incluses dans l'abonnement. En Full Automation, les modifications sont illimitées." },
        { q: "Que se passe-t-il si un workflow plante ?", a: "En Pack Business et Full Automation, la surveillance est continue. Vous recevez une alerte automatique (email ou Slack) dès qu'une exécution échoue, avec le détail de l'erreur. Nous intervenons dans les 48h (Business) ou 24h (Full Automation) pour corriger." },
        { q: 'Peut-on automatiser des processus métier très spécifiques ?', a: "Oui, c'est justement notre valeur ajoutée. Nous avons automatisé des processus dans des secteurs très variés : cabinets médicaux, agences immobilières, e-commerce, SaaS, cabinets d'avocats, restaurants. Si votre outil a une API (ou même un webhook), nous pouvons l'intégrer." },
        { q: "Comment se déroule l'audit gratuit ?", a: "Un appel de 30 à 60 minutes avec vous (ou votre équipe). On passe en revue vos outils, vos processus quotidiens et les tâches qui vous prennent le plus de temps. Vous repartez avec une liste priorisée des workflows à automatiser, l'outil recommandé et une estimation de ROI. Sans engagement de votre part." },
      ],
    },
    more: {
      h3: 'Pour aller plus loin',
      items: [
        { label: 'Agent IA relance factures PME : guide n8n + Claude', href: '/blog/agent-ia-relance-factures-pme' },
        { label: 'Make vs n8n vs Zapier : comparatif 2026 pour PME françaises', href: '/blog/make-n8n-zapier-2026-pme-france' },
        { label: 'Guide complet n8n : automatiser sans coder', href: '/blog/automatisation-n8n-guide' },
        { label: 'Automatisation IA pour PME : prix réels 2026', href: '/blog/automatisation-ia-pme-prix-2026' },
        { label: '3 workflows agents IA pour PME : ROI réel 2026', href: '/blog/3-workflows-agents-ia-pme' },
      ],
    },
    cta: { badge: 'Audit gratuit · Sans engagement', h2: 'Prêt à automatiser vos processus ?', p: "30 minutes d'appel, une liste des workflows à automatiser en priorité et leur ROI estimé. Sans engagement, sans jargon technique.", ctaAudit: "Demander l'audit gratuit", ctaBlog: 'Lire notre guide n8n', ctaBlogHref: '/blog/automatisation-n8n-guide' },
    detail: { included: 'Inclus', notIncluded: 'Non inclus', options: 'Options disponibles', maintenance: 'Maintenance', choose: 'Choisir', payment: 'Paiement échelonné disponible · 40% à la commande, 30% à la validation, 30% à la livraison' },
    showDetails: 'Voir les détails ↓', hideDetails: 'Masquer les détails ↑',
  },

  en: {
    hero: {
      badge: 'n8n · Make · Zapier · AI Agents Automation',
      h1: 'Automate your workflows,',
      h1highlight: 'unlock your business potential',
      p: "We build custom workflows with n8n, Make or Zapier, deploy autonomous AI agents and connect all your tools. Free audit included, measurable ROI within 30 days.",
      ctaAudit: 'Get the free audit',
      ctaPricing: 'See pricing',
    },
    stats: [
      { label: 'hours saved per week on average' },
      { label: 'more qualified leads processed' },
      { label: 'reduction in manual tasks' },
    ],
    problems: {
      h2: 'Sound familiar?',
      subtitle: "Businesses lose an average of <strong>12 hours per week</strong> on tasks automation can handle in seconds.",
      items: [
        { title: 'Your team spends hours on repetitive tasks', text: "Manual data entry, copy-pasting between tools, email follow-ups, data transfers: every minute lost is a minute away from your core business." },
        { title: 'Leads fall through the cracks between your tools', text: "A form filled in the evening, a missed follow-up, an out-of-sync CRM: you're losing opportunities without even knowing it." },
        { title: 'Your data is scattered across 5, 10, 15 tools', text: "Google Sheets, HubSpot, Notion, Airtable, Slack, Gmail... moving information between tools costs energy and creates errors." },
        { title: "You don't know where to start", text: "Automation feels daunting. You're unsure which workflows have the best ROI or which tool to choose between n8n, Make and Zapier." },
      ],
    },
    services: {
      h2: 'What we build for you',
      subtitle: "From initial audit to monthly monitoring, we cover the entire automation chain.",
      items: [
        { title: 'Process automation audit', desc: 'We map your workflows, identify high-volume repetitive tasks and calculate the ROI potential of each automation. Result: a prioritised roadmap.', details: ['Complete mapping of your existing workflows', 'Impact / complexity / cost matrix', 'Estimated ROI per process', 'Tool recommendation: Make vs n8n vs Zapier'], badge: 'Free' },
        { title: 'n8n / Make / Zapier workflows', desc: "We build your custom automations: form→CRM, lead qualification, tool synchronisation, notifications, automated follow-ups, reporting.", details: ['Form → CRM / Airtable / Notion connection', 'Automated email or SMS follow-ups', 'Multi-tool sync (Slack, Gmail, Drive)', 'Real-time alerts and notifications'], badge: 'From €999' },
        { title: 'AI sales agent', desc: '24/7 autonomous AI agent that qualifies incoming leads, answers FAQs, books appointments and hands warm prospects to your team.', details: ['Automatic qualification of incoming leads', 'FAQ and common question handling', 'Calendar integration (Calendly, Google Calendar)', 'CRM handoff with lead scoring'], badge: 'From €2,499' },
        { title: 'Marketing automation & nurturing', desc: 'Smart email sequences, lead scoring, dynamic personalisation, automatic segmentation — your marketing works even while you sleep.', details: ['Multi-step nurturing sequences', 'Automatic lead scoring', 'Behavioural segmentation', 'Brevo, Mailchimp, ActiveCampaign integration'], badge: 'From €1,499' },
        { title: 'CRM / ERP / Billing sync', desc: "Connect HubSpot, Notion, Airtable, Pennylane, Sellsy, QuickBooks and all your business tools. No more double data entry or inconsistent records.", details: ['Two-way CRM ↔ tools connection', 'Automatic quote / invoice sync', 'Real-time contact record updates', 'Exchange archiving and traceability'], badge: 'From €1,499' },
        { title: 'Monitoring & continuous optimisation', desc: "Your workflows are monitored, errors detected in real time, volumes analysed. A monthly report shows performance and improvement areas.", details: ['24/7 workflow monitoring', 'Error and anomaly alerts', 'Monthly performance report', 'Continuous optimisation on suggestion'], badge: 'Monthly subscription' },
      ],
    },
    tools: { label: 'We connect your tools' },
    useCases: {
      h2: 'Use cases by profession',
      subtitle: 'Concrete scenarios, with the right pack and the measurable gain you can expect.',
      items: [
        { sector: 'Firm (law, accounting, consulting)', context: 'Every incoming lead is handled by hand: email, Excel entry, quote, follow-ups — 45 min per case.', solution: 'Form → AI qualification → CRM → Calendly booking → automatically generated quote workflow.', result: 'Lead handling: 45 min → 3 min · +10 pts conversion rate · zero missed follow-up', pack: 'Starter Auto' },
        { sector: 'Agency / B2B SMB', context: 'Manual LinkedIn prospecting, CRM only 60% up to date, ad-hoc nurturing.', solution: '3 to 5 workflows + AI qualification agent (BANT scoring) + nurturing sequence + automatic reporting.', result: 'Prospecting 15h → 3h/week · CRM 100% up to date · reply rate ×2 (personalised AI)', pack: 'Business Auto' },
        { sector: 'E-commerce / Retail', context: 'Orders, support and stock managed in disconnected tools, double entry and errors.', solution: 'Orders ↔ CRM ↔ billing sync + stock alerts + automatic cart recovery.', result: 'Near-zero data-entry errors · 24/7 cart recovery · order tracking with no manual work', pack: 'Business Auto' },
        { sector: 'Mid-market / multi-site', context: '10 to 15 disconnected tools (CRM, ERP, accounting, HR), consolidated reporting done by hand over 3 days.', solution: 'Self-hosted n8n infrastructure + 3 AI agents (leads, support, content) + real-time management dashboard.', result: '−28h/week of data entry · stockouts −87% · reporting 3 days → 10 min', pack: 'Full Automation' },
      ],
    },
    packs: {
      h2: 'Our automation packages',
      subtitle: 'Transparent pricing, no surprises. VAT not applicable.',
      popular: 'Most popular',
      ht: 'excl. VAT',
      monthly: '€/month maintenance',
      delivery: 'Delivery',
      items: [
        {
          name: 'Starter Auto', tagline: 'Your first workflow. ROI in 30 days.',
          bullets: ['Process audit (up to 5 workflows identified)', '1 complex workflow delivered and tested', '30-min training + documentation', '30-day email support'],
          included: ['Initial audit and mapping', '1 n8n or Make workflow (up to 8 steps)', 'Connection to 3 tools maximum', 'Testing and production validation', 'Workflow documentation', '30-min video training', '30-day post-delivery email support'],
          notIncluded: ['Autonomous AI agents', 'More than 1 workflow', 'More than 3 tool connections', 'Continuous monitoring', 'Monthly report'],
          options: [{ label: 'Additional workflow', price: '+€690 excl. VAT' }, { label: 'Additional tool integration', price: '+€190 excl. VAT' }, { label: '3-month support extension', price: '+€149 excl. VAT' }],
          maintenanceItems: ['Monthly workflow monitoring', 'Compatibility updates', 'Email support (72h response)'],
        },
        {
          name: 'Business Auto', tagline: "Multiple connected processes. 1 AI agent included.",
          bullets: ['Full audit (unlimited processes)', '3 to 5 custom workflows', '1 AI lead qualification agent', 'Monthly monitoring included'],
          included: ['Full audit of all your processes', '3 to 5 n8n or Make workflows (up to 20 steps each)', 'Connection to 8 tools maximum', '1 AI lead qualification / response agent', 'CRM integration (HubSpot, Notion, Airtable)', 'Email nurturing sequence (up to 5 steps)', 'Testing and production validation', '1h video training + PDF guide', 'Monthly monitoring + performance report', 'Priority email support (48h response)'],
          notIncluded: ['More than 5 workflows', 'More than 8 tool connections', 'Advanced multi-source AI agents', 'Custom AI development', 'ERP / legacy software integration'],
          options: [{ label: 'Additional workflow', price: '+€590 excl. VAT' }, { label: 'Additional AI agent', price: '+€1,490 excl. VAT' }, { label: 'ERP / legacy software integration', price: 'Custom quote' }, { label: 'Team training (up to 5 people)', price: '+€390 excl. VAT' }],
          maintenanceItems: ['24/7 workflow monitoring', 'Real-time alerts', 'Updates and fixes', 'Monthly performance report', 'Priority support (48h response)', '2 workflow changes per month'],
        },
        {
          name: 'Full Automation', tagline: 'Complete infrastructure. AI agents. Guaranteed ROI.',
          bullets: ['Audit + 6-month roadmap', 'Unlimited workflows', 'Multi-source AI agents', 'Real-time monitoring + coaching'],
          included: ['Full audit + 6-month automation roadmap', 'Unlimited workflows (n8n self-hosted or cloud)', 'Unlimited tool connections', 'Up to 3 AI agents (leads, SEO, content, support)', 'CRM + ERP + billing integration', 'Complete marketing automation sequences', 'Custom management dashboard', '4h team training + video documentation', 'n8n self-hosted hosting included (if needed)', 'Real-time monitoring + alerts', 'Advanced monthly report + review meeting', 'Dedicated support (24h response)', '1 AI strategy session / month for 3 months'],
          notIncluded: ['Advertising budget (Ads)', 'Community management', 'Complex backend dev outside workflows', 'Legacy integrations without API (custom quote)'],
          options: [{ label: 'Dedicated self-hosted n8n hosting', price: '+€390 excl. VAT / year' }, { label: 'Additional AI agent', price: '+€990 excl. VAT' }, { label: 'Legacy integration (no API)', price: 'Custom quote' }, { label: 'Additional 6-month coaching', price: '+€990 excl. VAT' }],
          maintenanceItems: ['Real-time monitoring + immediate alerts', 'Proactive updates', 'Advanced monthly report', 'Monthly review meeting (30 min)', 'Dedicated 7-day support (24h response)', 'Unlimited changes', 'Continuous optimisation'],
        },
      ],
    },
    process: {
      h2: 'Our 4-step process',
      subtitle: 'From the first call to go-live: a proven process with clear deliverables at every stage.',
      steps: [
        { title: 'Free audit', duration: '30 to 60 min', desc: "We review your tools, processes and pain points. You leave with a prioritised list of workflows to automate and their estimated ROI.", bring: 'Your tools, your processes', bringLabel: 'You bring:' },
        { title: 'Design', duration: '3 to 5 days', desc: "We model each workflow, choose the right tools and validate the architecture with you before writing a single line of code.", bring: 'Tool access (read-only)', bringLabel: 'You bring:' },
        { title: 'Build & test', duration: '1 to 8 weeks', desc: "We build the workflows, connect them to your tools and test them on real data. You validate each step.", bring: 'Your test data', bringLabel: 'You bring:' },
        { title: 'Go live', duration: '1 day', desc: "Production switch with enhanced monitoring for the first 7 days. Team training included.", bring: '30 min for training', bringLabel: 'You bring:' },
      ],
    },
    testimonials: {
      h2: 'What our clients say',
      items: [
        { quote: "In 3 weeks, NeuraWeb automated our incoming quote processing. We recovered 8 hours per week and our response time went from 6 hours to 12 minutes.", name: 'Alexander D.', role: 'Sales Director', company: 'Real estate agency, Paris', initials: 'AD', color: 'bg-white/10 text-white' },
        { quote: "The n8n lead qualification workflow transformed our sales team. Reps now only handle warm leads. Revenue grew 34% in 2 months.", name: 'Sophie M.', role: 'CEO', company: 'B2B SaaS, Lyon', initials: 'SM', color: 'bg-white/10 text-white' },
        { quote: "I was worried it would be complicated. The free audit clarified everything. We went with the Business pack, delivered in 4 weeks. The Airtable-Gmail-Slack sync works flawlessly.", name: 'Thomas R.', role: 'Founder', company: 'Consulting firm, Bordeaux', initials: 'TR', color: 'bg-emerald-400/20 text-emerald-400' },
      ],
    },
    faq: {
      h2: 'Frequently asked questions',
      items: [
        { q: "What's the difference between n8n, Make and Zapier?", a: "All three are no-code automation platforms. Zapier is the simplest but most expensive at scale. Make (formerly Integromat) is our default recommendation: €12/month for 10,000 operations, EU servers, native AI connectors. n8n is essential if you deploy autonomous AI agents or handle sensitive data — the Community edition is open-source and free when self-hosted. We always choose the tool that fits your use case, not the most expensive one." },
        { q: 'How long before seeing ROI?', a: "For a simple workflow (form→CRM→notification), ROI is immediate from go-live: zero manual entry, zero missed leads. For an AI qualification agent, allow 2 to 4 weeks to fine-tune prompts and scoring thresholds. Most of our clients recoup their investment in under 3 months." },
        { q: 'Does my data pass through your servers?', a: "No. We configure automations directly in Make cloud (AWS EU servers) or in your own self-hosted n8n instance. Your data does not transit through our servers — it flows between your tools via their APIs. For sensitive data (healthcare, critical client data), we recommend self-hosting n8n on a VPS in France." },
        { q: 'Can I modify workflows after delivery?', a: "Yes. Workflows are documented and you are trained to understand them. In the Starter pack, 2 minor changes are included in the 30 days post-delivery. In the Business pack, 2 changes per month are included in the subscription. In Full Automation, changes are unlimited." },
        { q: 'What happens if a workflow breaks?', a: "In Business and Full Automation packs, monitoring is continuous. You receive an automatic alert (email or Slack) when an execution fails, with error details. We respond within 48h (Business) or 24h (Full Automation)." },
        { q: 'Can you automate very specific business processes?', a: "Yes, that's exactly our added value. We've automated processes across very diverse sectors: medical practices, real estate agencies, e-commerce, SaaS, law firms, restaurants. If your tool has an API (or even a webhook), we can integrate it." },
        { q: 'How does the free audit work?', a: "A 30 to 60-minute call with you (or your team). We review your tools, daily processes and most time-consuming tasks. You leave with a prioritised list of workflows to automate, the recommended tool and an ROI estimate. No commitment required." },
      ],
    },
    more: {
      h3: 'Learn more',
      items: [
        { label: 'AI agent for invoice chasing: n8n + Claude guide', href: '/blog/agent-ia-relance-factures-pme' },
        { label: 'Make vs n8n vs Zapier: 2026 comparison', href: '/blog/make-n8n-zapier-2026-pme-france' },
        { label: 'Complete n8n guide: automate without coding', href: '/blog/automatisation-n8n-guide' },
        { label: 'AI automation for SMBs: real prices 2026', href: '/blog/automatisation-ia-pme-prix-2026' },
        { label: '3 AI agent workflows: real ROI 2026', href: '/blog/3-workflows-agents-ia-pme' },
      ],
    },
    cta: { badge: 'Free audit · No commitment', h2: 'Ready to automate your workflows?', p: "30 minutes, a prioritised list of workflows to automate and their estimated ROI. No commitment, no technical jargon.", ctaAudit: 'Get the free audit', ctaBlog: 'Read our n8n guide', ctaBlogHref: '/blog/automatisation-n8n-guide' },
    detail: { included: 'Included', notIncluded: 'Not included', options: 'Available options', maintenance: 'Maintenance', choose: 'Choose', payment: 'Staged payment available · 40% on order, 30% on validation, 30% on delivery' },
    showDetails: 'Show details ↓', hideDetails: 'Hide details ↑',
  },

  es: {
    hero: {
      badge: 'Automatización n8n · Make · Zapier · Agentes IA',
      h1: 'Automatiza tus procesos,',
      h1highlight: 'libera el potencial de tu negocio',
      p: "Construimos tus flujos de trabajo personalizados con n8n, Make o Zapier, desplegamos agentes IA autónomos y conectamos todas tus herramientas. Auditoría gratuita incluida, ROI medible en 30 días.",
      ctaAudit: 'Solicitar la auditoría gratuita',
      ctaPricing: 'Ver precios',
    },
    stats: [
      { label: 'horas ahorradas por semana de media' },
      { label: 'más leads cualificados procesados' },
      { label: 'de reducción de tareas manuales' },
    ],
    problems: {
      h2: '¿Te suena familiar?',
      subtitle: "Las empresas pierden una media de <strong>12 horas semanales</strong> en tareas que la automatización puede realizar en segundos.",
      items: [
        { title: 'Tu equipo pasa horas en tareas repetitivas', text: "Entrada de datos manual, copiar y pegar entre herramientas, seguimiento por email, transferencias de datos: cada minuto perdido es un minuto menos para tu negocio principal." },
        { title: 'Los leads caen en los huecos entre tus herramientas', text: "Un formulario rellenado por la noche, un seguimiento olvidado, un CRM desincronizado: pierdes oportunidades sin saberlo." },
        { title: 'Tus datos están dispersos entre 5, 10, 15 herramientas', text: "Google Sheets, HubSpot, Notion, Airtable, Slack, Gmail... mover información entre herramientas cuesta energía y genera errores." },
        { title: "No sabes por dónde empezar", text: "La automatización parece complicada. No sabes qué flujos tienen mejor ROI ni qué herramienta elegir entre n8n, Make y Zapier." },
      ],
    },
    services: {
      h2: 'Lo que construimos para ti',
      subtitle: "Desde la auditoría inicial hasta el seguimiento mensual, cubrimos toda la cadena de automatización.",
      items: [
        { title: 'Auditoría de procesos automatizables', desc: 'Mapeamos tus flujos, identificamos tareas repetitivas de alto volumen y calculamos el ROI potencial de cada automatización. Resultado: una hoja de ruta priorizada.', details: ['Mapeo completo de tus flujos de trabajo existentes', 'Matriz impacto / complejidad / coste', 'ROI estimado por proceso', 'Recomendación Make vs n8n vs Zapier'], badge: 'Gratis' },
        { title: 'Flujos de trabajo n8n / Make / Zapier', desc: "Construimos tus automatizaciones a medida: formulario→CRM, cualificación de leads, sincronización de herramientas, notificaciones, seguimientos automáticos, reporting.", details: ['Conexión formulario → CRM / Airtable / Notion', 'Seguimientos automáticos por email o SMS', 'Sincronización multi-herramienta (Slack, Gmail, Drive)', 'Alertas y notificaciones en tiempo real'], badge: 'Desde 999 €' },
        { title: 'Agente IA comercial', desc: 'Un agente IA autónomo que cualifica tus leads entrantes 24h/7, responde preguntas frecuentes, agenda citas y transfiere prospectos calientes a tu equipo.', details: ['Cualificación automática de leads entrantes', 'Respuesta a preguntas frecuentes (FAQ)', 'Integración de calendario (Calendly, Google Calendar)', 'Handoff al CRM con scoring'], badge: 'Desde 2.499 €' },
        { title: 'Automatización de marketing y nurturing', desc: 'Secuencias de email inteligentes, lead scoring, personalización dinámica, segmentación automática — tu marketing trabaja mientras duermes.', details: ['Secuencias de nurturing multi-etapa', 'Lead scoring automático', 'Segmentación comportamental', 'Integración Brevo, Mailchimp, ActiveCampaign'], badge: 'Desde 1.499 €' },
        { title: 'Sincronización CRM / ERP / Facturación', desc: "Conecta HubSpot, Notion, Airtable, Pennylane, Sellsy, QuickBooks y todas tus herramientas de negocio. Adiós a la doble entrada de datos e incoherencias.", details: ['Conexión bidireccional CRM ↔ herramientas', 'Sincronización automática de presupuestos y facturas', 'Actualización en tiempo real de fichas de contacto', 'Archivo y trazabilidad de intercambios'], badge: 'Desde 1.499 €' },
        { title: 'Monitorización y optimización continua', desc: "Tus flujos están vigilados, los errores detectados en tiempo real, los volúmenes analizados. Un informe mensual muestra el rendimiento y áreas de mejora.", details: ['Monitorización 24/7 de flujos de trabajo', 'Alertas de errores y anomalías', 'Informe mensual de rendimiento', 'Optimización continua bajo sugerencia'], badge: 'Suscripción mensual' },
      ],
    },
    tools: { label: 'Conectamos tus herramientas' },
    useCases: {
      h2: 'Casos de uso por sector',
      subtitle: 'Escenarios concretos, con el pack adecuado y la ganancia medible que puedes esperar.',
      items: [
        { sector: 'Despacho (abogado, asesor, consultoría)', context: 'Cada lead entrante se trata a mano: email, Excel, presupuesto, seguimientos — 45 min por expediente.', solution: 'Flujo formulario → cualificación IA → CRM → cita Calendly → presupuesto generado automáticamente.', result: 'Tratamiento de un lead: 45 min → 3 min · +10 pts de conversión · 0 seguimiento olvidado', pack: 'Starter Auto' },
        { sector: 'Agencia / Pyme B2B', context: 'Prospección LinkedIn manual, CRM actualizado al 60%, nurturing puntual.', solution: '3 a 5 flujos + agente IA de cualificación (scoring BANT) + secuencia de nurturing + reporting automático.', result: 'Prospección 15h → 3h/semana · CRM 100% actualizado · tasa de respuesta ×2 (IA personalizada)', pack: 'Business Auto' },
        { sector: 'E-commerce / Retail', context: 'Pedidos, atención y stock en herramientas no conectadas, doble entrada y errores.', solution: 'Sincronización pedidos ↔ CRM ↔ facturación + alertas de stock + recuperación de carrito automática.', result: 'Errores de entrada casi nulos · recuperación de carrito 24/7 · seguimiento de pedido sin intervención', pack: 'Business Auto' },
        { sector: 'Mediana empresa / multisede', context: '10 a 15 herramientas no conectadas (CRM, ERP, contabilidad, RRHH), reporting consolidado a mano en 3 días.', solution: 'Infraestructura n8n self-hosted + 3 agentes IA (leads, soporte, contenido) + dashboard de gestión en tiempo real.', result: '−28h/semana de entrada de datos · roturas de stock −87% · reporting 3 días → 10 min', pack: 'Full Automation' },
      ],
    },
    packs: {
      h2: 'Nuestros paquetes de automatización',
      subtitle: 'Precios transparentes, sin sorpresas. IVA no incluido.',
      popular: 'El más popular',
      ht: 's/IVA',
      monthly: '€/mes mantenimiento',
      delivery: 'Plazo',
      items: [
        {
          name: 'Starter Auto', tagline: 'Tu primer flujo de trabajo. ROI en 30 días.',
          bullets: ['Auditoría de procesos (hasta 5 flujos identificados)', '1 flujo de trabajo complejo entregado y probado', 'Formación de 30 min + documentación', 'Soporte por email 30 días'],
          included: ['Auditoría inicial y mapeo', '1 flujo de trabajo n8n o Make (hasta 8 pasos)', 'Conexión a 3 herramientas máximo', 'Pruebas y validación en producción', 'Documentación del flujo', 'Formación de 30 min por videollamada', 'Soporte por email 30 días post-entrega'],
          notIncluded: ['Agentes IA autónomos', 'Más de 1 flujo de trabajo', 'Conexión a más de 3 herramientas', 'Monitorización continua', 'Informe mensual'],
          options: [{ label: 'Flujo de trabajo adicional', price: '+690 € s/IVA' }, { label: 'Integración de herramienta adicional', price: '+190 € s/IVA' }, { label: 'Extensión soporte 3 meses', price: '+149 € s/IVA' }],
          maintenanceItems: ['Monitorización mensual del flujo', 'Actualizaciones de compatibilidad', 'Soporte por email (72h de respuesta)'],
        },
        {
          name: 'Business Auto', tagline: "Varios procesos conectados. 1 agente IA incluido.",
          bullets: ['Auditoría completa (procesos ilimitados)', '3 a 5 flujos de trabajo a medida', '1 agente IA de cualificación de leads', 'Monitorización mensual incluida'],
          included: ['Auditoría completa de todos tus procesos', '3 a 5 flujos n8n o Make (hasta 20 pasos cada uno)', 'Conexión a 8 herramientas máximo', '1 agente IA de cualificación / respuesta de leads', 'Integración CRM (HubSpot, Notion, Airtable)', 'Secuencia de nurturing por email (hasta 5 pasos)', 'Pruebas y validación en producción', 'Formación 1h por videollamada + guía PDF', 'Monitorización mensual + informe de rendimiento', 'Soporte prioritario por email (48h de respuesta)'],
          notIncluded: ['Más de 5 flujos de trabajo', 'Conexión a más de 8 herramientas', 'Agentes IA avanzados multi-fuente', 'Desarrollo IA a medida', 'Integración ERP / software legacy'],
          options: [{ label: 'Flujo de trabajo adicional', price: '+590 € s/IVA' }, { label: 'Agente IA adicional', price: '+1.490 € s/IVA' }, { label: 'Integración ERP / software legacy', price: 'Presupuesto a medida' }, { label: 'Formación equipo (hasta 5 personas)', price: '+390 € s/IVA' }],
          maintenanceItems: ['Monitorización 24/7 de flujos', 'Alertas en tiempo real', 'Actualizaciones y correcciones', 'Informe mensual de rendimiento', 'Soporte prioritario (48h de respuesta)', '2 modificaciones de flujo / mes'],
        },
        {
          name: 'Full Automation', tagline: 'Infraestructura completa. Agentes IA. ROI garantizado.',
          bullets: ['Auditoría + hoja de ruta 6 meses', 'Flujos de trabajo ilimitados', 'Agentes IA multi-fuente', 'Monitorización en tiempo real + acompañamiento'],
          included: ['Auditoría completa + hoja de ruta de automatización 6 meses', 'Flujos ilimitados (n8n self-hosted o cloud)', 'Conexiones ilimitadas a tus herramientas', 'Hasta 3 agentes IA (leads, SEO, contenido, soporte)', 'Integración CRM + ERP + facturación', 'Secuencias completas de marketing automation', 'Dashboard de gestión personalizado', 'Formación equipo 4h + documentación en vídeo', 'Alojamiento n8n self-hosted incluido (si necesario)', 'Monitorización en tiempo real + alertas', 'Informe mensual avanzado + reunión de seguimiento', 'Soporte dedicado (24h de respuesta)', '1 sesión de estrategia IA / mes durante 3 meses'],
          notIncluded: ['Presupuesto publicitario (Ads)', 'Community management', 'Desarrollo backend complejo fuera de flujos', 'Integraciones legacy sin API (presupuesto a medida)'],
          options: [{ label: 'Alojamiento n8n self-hosted dedicado', price: '+390 € s/IVA / año' }, { label: 'Agente IA adicional', price: '+990 € s/IVA' }, { label: 'Integración legacy (sin API)', price: 'Presupuesto a medida' }, { label: 'Acompañamiento 6 meses adicionales', price: '+990 € s/IVA' }],
          maintenanceItems: ['Monitorización en tiempo real + alertas inmediatas', 'Actualizaciones proactivas', 'Informe mensual avanzado', 'Reunión mensual de seguimiento (30 min)', 'Soporte dedicado 7 días (24h de respuesta)', 'Modificaciones ilimitadas', 'Optimización continua'],
        },
      ],
    },
    process: {
      h2: 'Nuestro proceso en 4 pasos',
      subtitle: 'Desde la primera llamada hasta la puesta en producción: un proceso probado con entregables claros en cada etapa.',
      steps: [
        { title: 'Auditoría gratuita', duration: '30 a 60 min', desc: "Analizamos tus herramientas, procesos y puntos de dolor. Te vas con una lista priorizada de flujos a automatizar y su ROI estimado.", bring: 'Tus herramientas, tus procesos', bringLabel: 'Tú aportas:' },
        { title: 'Diseño', duration: '3 a 5 días', desc: "Modelamos cada flujo, elegimos las herramientas adecuadas y validamos la arquitectura contigo antes de escribir una sola línea de código.", bring: 'Acceso a herramientas (solo lectura)', bringLabel: 'Tú aportas:' },
        { title: 'Construcción y pruebas', duration: '1 a 8 semanas', desc: "Construimos los flujos, los conectamos a tus herramientas y los probamos con datos reales. Tú validas cada paso.", bring: 'Tus datos de prueba', bringLabel: 'Tú aportas:' },
        { title: 'Puesta en producción', duration: '1 día', desc: "Lanzamiento a producción con monitorización reforzada los primeros 7 días. Formación del equipo incluida.", bring: '30 min para la formación', bringLabel: 'Tú aportas:' },
      ],
    },
    testimonials: {
      h2: 'Lo que dicen nuestros clientes',
      items: [
        { quote: "En 3 semanas, NeuraWeb automatizó el procesamiento de nuestros presupuestos entrantes. Recuperamos 8 horas semanales y nuestro tiempo de respuesta pasó de 6 horas a 12 minutos.", name: 'Alexandre D.', role: 'Director comercial', company: 'Agencia inmobiliaria, París', initials: 'AD', color: 'bg-white/10 text-white' },
        { quote: "El flujo de cualificación de leads n8n transformó nuestro equipo de ventas. Los comerciales solo tratan leads calientes. El revenue creció un 34% en 2 meses.", name: 'Sophie M.', role: 'CEO', company: 'SaaS B2B, Lyon', initials: 'SM', color: 'bg-white/10 text-white' },
        { quote: "Tenía miedo de que fuera complicado. La auditoría gratuita lo aclaró todo. Elegimos el pack Business, entregado en 4 semanas. La sincronización Airtable-Gmail-Slack funciona perfectamente.", name: 'Thomas R.', role: 'Fundador', company: 'Consultora, Burdeos', initials: 'TR', color: 'bg-emerald-400/20 text-emerald-400' },
      ],
    },
    faq: {
      h2: 'Preguntas frecuentes',
      items: [
        { q: '¿Cuál es la diferencia entre n8n, Make y Zapier?', a: "Las tres son plataformas de automatización no-code. Zapier es la más sencilla pero la más cara a escala. Make (ex-Integromat) es nuestra recomendación por defecto: 12€/mes para 10.000 operaciones, servidores en la UE, conectores IA nativos. n8n es indispensable si despliegas agentes IA autónomos o gestionas datos sensibles — la edición Community es open-source y gratuita en self-hosted. Siempre elegimos la herramienta adecuada para tu caso de uso, no la más cara." },
        { q: '¿Cuánto tiempo tarda en verse el ROI?', a: "Para un flujo simple (formulario→CRM→notificación), el ROI es inmediato desde la puesta en producción: cero entrada manual, cero leads perdidos. Para un agente IA de cualificación, cuenta 2 a 4 semanas para afinar los prompts y los umbrales de scoring. La mayoría de nuestros clientes recuperan su inversión en menos de 3 meses." },
        { q: '¿Mis datos pasan por vuestros servidores?', a: "No. Configuramos las automatizaciones directamente en Make cloud (servidores AWS EU) o en tu propia instancia n8n self-hosted. Tus datos no transitan por nuestros servidores — fluyen entre tus herramientas a través de sus APIs. Para datos sensibles, recomendamos self-hosting n8n en un VPS en Francia." },
        { q: '¿Puedo modificar los flujos de trabajo después de la entrega?', a: "Sí. Los flujos están documentados y recibirás formación para entenderlos. En el pack Starter, 2 modificaciones menores están incluidas en los 30 días post-entrega. En el pack Business, 2 modificaciones al mes están incluidas en la suscripción. En Full Automation, las modificaciones son ilimitadas." },
        { q: '¿Qué pasa si un flujo de trabajo falla?', a: "En los packs Business y Full Automation, la monitorización es continua. Recibes una alerta automática (email o Slack) cuando una ejecución falla, con el detalle del error. Respondemos en 48h (Business) o 24h (Full Automation)." },
        { q: '¿Podéis automatizar procesos de negocio muy específicos?', a: "Sí, esa es exactamente nuestra propuesta de valor. Hemos automatizado procesos en sectores muy variados: consultas médicas, agencias inmobiliarias, e-commerce, SaaS, despachos de abogados, restaurantes. Si tu herramienta tiene una API (o incluso un webhook), podemos integrarla." },
        { q: '¿Cómo funciona la auditoría gratuita?', a: "Una llamada de 30 a 60 minutos contigo (o tu equipo). Revisamos tus herramientas, procesos diarios y las tareas que más tiempo te consumen. Te vas con una lista priorizada de flujos a automatizar, la herramienta recomendada y una estimación de ROI. Sin compromiso." },
      ],
    },
    more: {
      h3: 'Saber más',
      items: [
        { label: 'Agente IA para cobros impagados: guía n8n + Claude', href: '/blog/agent-ia-relance-factures-pme' },
        { label: 'Make vs n8n vs Zapier: comparativa 2026', href: '/blog/make-n8n-zapier-2026-pme-france' },
        { label: 'Guía completa n8n: automatizar sin programar', href: '/blog/automatisation-n8n-guide' },
        { label: 'Automatización IA para pymes: precios reales 2026', href: '/blog/automatisation-ia-pme-prix-2026' },
        { label: '3 flujos de agentes IA para pymes: ROI real 2026', href: '/blog/3-workflows-agents-ia-pme' },
      ],
    },
    cta: { badge: 'Auditoría gratuita · Sin compromiso', h2: '¿Listo para automatizar tus procesos?', p: "30 minutos, una lista priorizada de flujos a automatizar y su ROI estimado. Sin compromiso, sin jerga técnica.", ctaAudit: 'Solicitar la auditoría gratuita', ctaBlog: 'Leer nuestra guía n8n', ctaBlogHref: '/blog/automatisation-n8n-guide' },
    detail: { included: 'Incluido', notIncluded: 'No incluido', options: 'Opciones disponibles', maintenance: 'Mantenimiento', choose: 'Elegir', payment: 'Pago fraccionado disponible · 40% al pedido, 30% a la validación, 30% a la entrega' },
    showDetails: 'Ver detalles ↓', hideDetails: 'Ocultar detalles ↑',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// STATIC DATA (unchanged across languages)
// ═══════════════════════════════════════════════════════════════════════════

const STATS_VALUES = ['12h', '3×', '94%'];

const SERVICE_ICONS = [Target, Workflow, Bot, Mail, RefreshCw, BarChart3];
const SERVICE_BADGE_COLORS = ['bg-emerald-500', 'bg-gray-900', 'bg-violet-500', 'bg-gray-700', 'bg-rose-500', 'bg-slate-500'];
const SERVICE_ACCENT_COLORS = ['border-emerald-400', 'border-white', 'border-gray-400', 'border-gray-400', 'border-rose-400', 'border-slate-400'];

const PACK_PRICES = [999, 2999, 5999];
const PACK_MONTHLY = [29, 79, 149];
const PACK_DELIVERY: Record<Lang, string[]> = {
  fr: ['1 à 2 semaines', '3 à 5 semaines', '6 à 10 semaines'],
  en: ['1 to 2 weeks', '3 to 5 weeks', '6 to 10 weeks'],
  es: ['1 a 2 semanas', '3 a 5 semanas', '6 a 10 semanas'],
};
const PACK_IDS = ['starter', 'business', 'full'] as const;
type PackId = (typeof PACK_IDS)[number];

const TOOLS = [
  { name: 'n8n', cat: { fr: 'Orchestration', en: 'Orchestration', es: 'Orquestación' } },
  { name: 'Make', cat: { fr: 'Orchestration', en: 'Orchestration', es: 'Orquestación' } },
  { name: 'Zapier', cat: { fr: 'Orchestration', en: 'Orchestration', es: 'Orquestación' } },
  { name: 'HubSpot', cat: { fr: 'CRM', en: 'CRM', es: 'CRM' } },
  { name: 'Notion', cat: { fr: 'CRM', en: 'CRM', es: 'CRM' } },
  { name: 'Airtable', cat: { fr: 'CRM', en: 'CRM', es: 'CRM' } },
  { name: 'Brevo', cat: { fr: 'Email', en: 'Email', es: 'Email' } },
  { name: 'Mailchimp', cat: { fr: 'Email', en: 'Email', es: 'Email' } },
  { name: 'Slack', cat: { fr: 'Communication', en: 'Communication', es: 'Comunicación' } },
  { name: 'Gmail / Outlook', cat: { fr: 'Communication', en: 'Communication', es: 'Comunicación' } },
  { name: 'Google Drive', cat: { fr: 'Stockage', en: 'Storage', es: 'Almacenamiento' } },
  { name: 'Calendly', cat: { fr: 'Agenda', en: 'Calendar', es: 'Agenda' } },
  { name: 'Claude / GPT', cat: { fr: 'IA', en: 'AI', es: 'IA' } },
  { name: 'Pennylane', cat: { fr: 'Facturation', en: 'Billing', es: 'Facturación' } },
  { name: 'Stripe', cat: { fr: 'Paiement', en: 'Payment', es: 'Pago' } },
  { name: 'Doctolib', cat: { fr: 'Santé', en: 'Healthcare', es: 'Salud' } },
];

const PROCESS_BG = ['bg-white/5', 'bg-white/5', 'bg-white/5', 'bg-white/5'];

// Délais d'apparition échelonnés pour les grilles de cartes (reveal au scroll)
const DELAY_CLASSES = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export function AutomatisationPageClient({ lang }: Props) {
  const [selectedPack, setSelectedPack] = useState<PackId>('business');
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const c = CONTENT[lang];
  const packIdx = PACK_IDS.indexOf(selectedPack);
  const activePack = c.packs.items[packIdx];

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
              <Zap size={14} />
              <span>{c.hero.badge}</span>
            </div>
            <h1 className="animate-on-scroll fade-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {c.hero.h1}{' '}
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{c.hero.h1highlight}</span>
            </h1>
            <p className="animate-on-scroll fade-up delay-200 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">{c.hero.p}</p>
            <div className="animate-on-scroll fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <LocalizedLink href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-gray-900 transition-all duration-300 hover:opacity-90" style={{ background: '#ffffff', boxShadow: '0 4px 20px rgba(255,255,255,0.2)' }}>
                <Zap size={18} />{c.hero.ctaAudit}<ArrowRight size={16} />
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
              <p className="text-slate-600 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: c.problems.subtitle }} />
            </div>
            <div className="animate-on-scroll fade-up delay-100">
            <ResponsiveCards breakpoint="sm" gridClass="grid-cols-2 lg:grid-cols-4" gridGap="gap-6">
              {c.problems.items.map((p, i) => {
                const icons = [Clock, AlertTriangle, Database, TrendingUp];
                const colors = ['text-white bg-white/5', 'text-rose-400 bg-rose-400/10', 'text-white bg-white/5', 'text-white bg-white/5'];
                const Icon = icons[i];
                return (
                  <div key={i} className="rounded-xl border border-slate-200 shadow-sm bg-white p-6 hover:shadow-md transition-shadow h-full">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colors[i]}`}>
                      <Icon size={22} />
                    </div>
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
                      <div className="w-10 h-10 rounded-lg bg-[#0e1b3d]/40 flex items-center justify-center">
                        <Icon size={20} className="text-slate-300" />
                      </div>
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
                    <button className="mt-2 text-xs text-gray-500 hover:text-gray-300 font-medium">
                      {isExpanded ? c.hideDetails : c.showDetails}
                    </button>
                  </div>
                );
              })}
            </ResponsiveCards>
            </div>
          </div>
        </section>

        {/* ── OUTILS ────────────────────────────────────────────────────── */}
        <section className="py-14 border-y border-slate-200" style={{ background: '#F7FAFD' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="animate-on-scroll fade-up text-center text-sm text-slate-500 font-medium mb-8 uppercase tracking-wider">{c.tools.label}</p>
            <div className="animate-on-scroll fade-up delay-100 flex flex-wrap justify-center gap-3">
              {TOOLS.map((tool, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm text-slate-600 font-medium hover:border-slate-400 transition-colors">
                  {tool.name}
                  <span className="text-xs text-slate-500">{tool.cat[lang]}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CAS D'USAGE ───────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: '#0B1430' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{c.useCases.h2}</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">{c.useCases.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {c.useCases.items.map((uc, i) => (
                <article key={i} className={`animate-on-scroll fade-up ${DELAY_CLASSES[Math.min(i, 5)]} rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 h-full flex flex-col`}>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-lg font-bold text-white">{uc.sector}</h3>
                    <span className="text-xs bg-white/10 text-white px-3 py-1 rounded-full font-medium whitespace-nowrap">{uc.pack}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3 leading-relaxed">{uc.context}</p>
                  <p className="text-sm text-slate-200 mb-4 leading-relaxed">{uc.solution}</p>
                  <div className="mt-auto flex items-start gap-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20 p-3">
                    <TrendingUp size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-emerald-300">{uc.result}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────────────────────────── */}
        <section id="pricing" className="py-20" style={{ background: '#070F26' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{c.packs.h2}</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">{c.packs.subtitle}</p>
            </div>

            {/* Sélecteur mobile */}
            <div className="flex gap-2 mb-8 justify-center sm:hidden">
              {PACK_IDS.map((id, i) => (
                <button key={id} onClick={() => setSelectedPack(id)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${selectedPack === id ? 'bg-white text-gray-900' : 'bg-[#0e1b3d]/40 text-slate-300'}`}>
                  {c.packs.items[i].name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Cards desktop */}
            <div className="animate-on-scroll fade-up delay-100 hidden sm:grid grid-cols-3 gap-6 mb-10">
              {PACK_IDS.map((id, i) => {
                const pack = c.packs.items[i];
                const borders = ['border-white/10', 'border-white', 'border-white/10'];
                return (
                  <div key={id} onClick={() => setSelectedPack(id)} className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ${borders[i]} ${selectedPack === id ? 'shadow-xl bg-[#0e1b3d]/30 scale-[1.02]' : 'bg-[#0e1b3d]/30 hover:shadow-md'}`}>
                    {i === 1 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-4 py-1 rounded-full">{c.packs.popular}</span>}
                    <h3 className="font-bold text-white text-lg mb-1">{pack.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{pack.tagline}</p>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-white">{PACK_PRICES[i].toLocaleString('fr-FR')} €</span>
                      <span className="text-slate-400 text-sm ml-1">{c.packs.ht}</span>
                      <div className="text-sm text-slate-400">+ {PACK_MONTHLY[i]} {c.packs.monthly}</div>
                    </div>
                    <div className="text-xs text-slate-400 mb-4">⏱ {c.packs.delivery} : {PACK_DELIVERY[lang][i]}</div>
                    <ul className="space-y-2">
                      {pack.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                          <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* Détails pack sélectionné */}
            <div className="animate-on-scroll fade-up delay-200 rounded-2xl border border-white/10 bg-[#0e1b3d]/30 p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{activePack.name}</h3>
                  <p className="text-slate-400 text-sm">{activePack.tagline}</p>
                </div>
                <LocalizedLink href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-gray-900 transition-all duration-300" style={{ background: '#ffffff', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                  {c.detail.choose} {activePack.name}<ArrowRight size={14} />
                </LocalizedLink>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2"><Check size={16} className="text-emerald-500" /> {c.detail.included}</h4>
                  <ul className="space-y-2">
                    {activePack.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <Check size={13} className="text-emerald-500 mt-0.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2"><XIcon size={16} className="text-rose-500" /> {c.detail.notIncluded}</h4>
                  <ul className="space-y-2">
                    {activePack.notIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                        <XIcon size={13} className="text-rose-400 mt-0.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">{c.detail.options}</h4>
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
                      {c.detail.maintenance} {PACK_MONTHLY[packIdx]} €/{lang === 'fr' ? 'mois' : lang === 'es' ? 'mes' : 'month'}
                    </div>
                    <ul className="space-y-1">
                      {activePack.maintenanceItems.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle size={11} className="text-emerald-500 shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-slate-400 mt-6">{c.detail.payment}</p>
          </div>
        </section>

        {/* ── PROCESSUS ─────────────────────────────────────────────────── */}
        <section className="py-20" style={{ background: '#F7FAFD' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0e1b3d] mb-4">{c.process.h2}</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">{c.process.subtitle}</p>
            </div>
            <div className="animate-on-scroll fade-up delay-100">
            <ResponsiveCards breakpoint="sm" gridClass="grid-cols-2 lg:grid-cols-4" gridGap="gap-6">
              {c.process.steps.map((step, i) => (
                <div key={i} className="rounded-xl border border-slate-200 shadow-sm bg-white p-6 h-full">
                  <div className="text-3xl font-black text-[#0e1b3d] mb-3 opacity-60">0{i + 1}</div>
                  <h3 className="font-bold text-[#0e1b3d] mb-1">{step.title}</h3>
                  <div className="text-xs font-medium text-[#0e1b3d] mb-3">⏱ {step.duration}</div>
                  <p className="text-slate-500 text-sm mb-3">{step.desc}</p>
                  <div className="text-xs text-slate-500 border-t border-slate-200 pt-3">
                    <strong>{step.bringLabel}</strong> {step.bring}
                  </div>
                </div>
              ))}
            </ResponsiveCards>
            </div>
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
              <LocalizedLink href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all duration-300" style={{ background: '#ffffff', boxShadow: '0 4px 20px rgba(255,255,255,0.2)' }}>
                <Zap size={18} className="text-gray-900" />
                <span className="text-gray-900">{c.cta.ctaAudit}</span>
                <ArrowRight size={16} className="text-gray-900" />
              </LocalizedLink>
              <LocalizedLink href={c.cta.ctaBlogHref} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-300 border border-white/20 hover:border-white/40 hover:text-white transition-all duration-300">
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
