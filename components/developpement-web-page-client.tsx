'use client';

import React, { useRef, useState } from 'react';
import { useGsapReveal } from '@/hooks/use-gsap-reveal';
import {
  Code,
  Layout,
  Palette,
  Search,
  ShoppingCart,
  Gauge,
  Server,
  ArrowRight,
  ChevronDown,
  Check,
  X as XIcon,
  Sparkles,
  Star,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LocalizedLink } from '@/components/localized-link';
import { DemoCTA } from '@/components/demo-cta';
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
      badge: 'Sites Next.js · React · SEO · Design sur-mesure',
      h1: 'Des sites web qui',
      h1highlight: 'convertissent vos visiteurs',
      p: "Nous concevons des sites vitrine, professionnels et e-commerce en Next.js : rapides, optimisés SEO et au design sur-mesure. Devis gratuit sous 24h, mise en ligne en quelques semaines.",
      ctaAudit: 'Demander un devis gratuit',
      ctaPricing: 'Voir les tarifs',
    },
    stats: [
      { label: 'de score Core Web Vitals (performance)' },
      { label: 'de trafic organique en moyenne après refonte' },
      { label: 'pour recevoir votre devis personnalisé' },
    ],
    problems: {
      h2: 'Votre site vous freine ?',
      subtitle: "Un site lent ou daté fait fuir <strong>53 % des visiteurs mobiles</strong> avant même qu'ils aient vu votre offre.",
      items: [
        { title: 'Votre site est lent et pas responsive', text: "Temps de chargement interminable, affichage cassé sur mobile : chaque seconde de retard fait perdre des visiteurs et pénalise votre référencement Google." },
        { title: 'Vous êtes invisible sur Google', text: "Aucune structure SEO, pas de contenu optimisé, balises absentes : vos prospects trouvent vos concurrents, pas vous." },
        { title: 'Un design daté qui ne rassure pas', text: "Une vitrine vieillissante envoie un mauvais signal. Vos visiteurs jugent votre sérieux en quelques secondes — souvent avant de vous lire." },
        { title: 'Impossible de convertir ou de mesurer', text: "Pas de formulaire efficace, pas d'appel à l'action clair, aucun suivi analytics : vous ne savez ni d'où viennent vos contacts, ni pourquoi ils partent." },
      ],
    },
    services: {
      h2: 'Ce que nous construisons pour vous',
      subtitle: "Du site vitrine à l'e-commerce sur-mesure, nous couvrons toute la chaîne : design, développement, SEO et performance.",
      items: [
        { title: 'Sites vitrine & professionnels', desc: 'Des sites Next.js rapides et élégants pour présenter votre activité, capter des leads et inspirer confiance dès la première seconde.', details: ['Jusqu\'à 8 ou 20 pages selon le pack', 'Design responsive mobile-first', 'Formulaires de contact connectés', 'Fiche Google Business optimisée'], badge: 'À partir de 1 490 €' },
        { title: 'Refonte & design sur-mesure', desc: 'Maquettes Figma sur-mesure, identité visuelle cohérente, expérience utilisateur soignée : un site qui vous ressemble et qui convertit.', details: ['Maquettes Figma validées avant dev', 'Charte graphique et composants UI', 'Animations et micro-interactions', 'Accessibilité (WCAG) et contrastes'], badge: 'Design inclus' },
        { title: 'SEO technique & on-page', desc: 'Structure optimisée, balises, données structurées, sitemap : votre site est conçu pour grimper dans Google dès la mise en ligne.', details: ['Balises title / meta uniques par page', 'Données structurées Schema.org', 'Sitemap & robots.txt', 'Optimisation Core Web Vitals'], badge: 'Inclus' },
        { title: 'E-commerce & paiement', desc: 'Boutiques en ligne complètes avec catalogue, panier, paiement Stripe et gestion des commandes — prêtes à vendre.', details: ['Catalogue produits & variantes', 'Paiement Stripe sécurisé', 'Gestion des commandes & stocks', 'Tunnel de conversion optimisé'], badge: 'Pack Premium' },
        { title: 'Performance & Core Web Vitals', desc: 'Chargement instantané, images optimisées, score 90+ : un site rapide qui ravit vos visiteurs et plaît à Google.', details: ['Score Lighthouse 90+ garanti', 'Optimisation images & lazy-loading', 'Rendu statique / ISR Next.js', 'CDN et mise en cache avancée'], badge: 'Garanti' },
        { title: 'Hébergement & maintenance', desc: "Déploiement, hébergement, sauvegardes et mises à jour : on s'occupe de tout pour que votre site reste rapide et sécurisé.", details: ['Hébergement Vercel haute disponibilité', 'Sauvegardes automatiques', 'Mises à jour de sécurité', 'Support et corrections'], badge: 'Abonnement mensuel' },
      ],
    },
    tools: { label: 'Notre stack technique' },
    useCases: {
      h2: "Cas d'usage par profil",
      subtitle: 'Des scénarios concrets, avec le pack adapté et le résultat mesurable que vous pouvez en attendre.',
      items: [
        { sector: 'Artisan / Indépendant local', context: 'Aucune présence en ligne, devis demandés par téléphone, invisible sur Google.', solution: 'Vitrine 8 pages responsive + SEO technique + fiche Google Business + formulaire de contact.', result: 'Visible sur Google Maps · +15 à 20 contacts qualifiés/mois · ROI souvent < 2 mois', pack: 'Pack Starter' },
        { sector: 'PME / Commerce local', context: 'Vieux site non responsive, 40 % d\'abandons sur mobile, aucun contenu pour le référencement.', solution: 'Refonte design Figma sur-mesure + blog CMS + espace client + analytics avancés + SEO on-page.', result: '+35 % de trafic organique · −8h/semaine de support · image professionnelle restaurée', pack: 'Pack Business' },
        { sector: 'Startup / Scale-up', context: 'Site vitrine limité, besoin d\'e-commerce, d\'intégrations et de performance pour scaler.', solution: 'Pages illimitées + e-commerce + intégrations API + A/B testing + Core Web Vitals 90+.', result: '+25 % de conversion (A/B testing) · site rapide qui soutient la croissance et le SEO', pack: 'Pack Premium' },
      ],
    },
    packs: {
      h2: 'Nos packs web',
      subtitle: 'Des prix transparents, sans surprise. TVA non applicable (art. 293B du CGI).',
      popular: 'Le plus populaire',
      ht: 'HT',
      monthly: '€/mois maintenance',
      delivery: 'Délai',
      items: [
        {
          name: 'Pack Starter', tagline: 'Votre vitrine sur le web. En ligne en 3 semaines.',
          bullets: ['Site vitrine jusqu\'à 8 pages', 'Design responsive moderne', 'SEO technique inclus', 'Hébergement 1 an offert'],
          included: ['Site vitrine jusqu\'à 8 pages', 'Design responsive mobile-first', 'SEO technique (balises, sitemap, Schema)', 'Formulaire de contact connecté', 'Fiche Google Business optimisée', 'Hébergement 1 an inclus', 'Google Analytics configuré', 'Formation 30 min + documentation'],
          notIncluded: ['Blog / CMS', 'Espace client', 'E-commerce', 'Design Figma sur-mesure', 'Intégrations API tierces'],
          options: [{ label: 'Page supplémentaire', price: '+150 € HT' }, { label: 'Rédaction de contenu (par page)', price: '+90 € HT' }, { label: 'Chatbot IA', price: '+490 € HT' }],
          maintenanceItems: ['Hébergement & nom de domaine', 'Mises à jour de sécurité', 'Sauvegardes mensuelles', 'Support email (délai 72h)'],
        },
        {
          name: 'Pack Business', tagline: 'Votre plateforme de croissance. Blog & espace client.',
          bullets: ['Site jusqu\'à 20 pages', 'Design sur-mesure Figma', 'Blog + CMS léger', 'Espace client intégré'],
          included: ['Site jusqu\'à 20 pages', 'Design sur-mesure validé sur Figma', 'Espace client intégré', 'Blog + CMS léger', 'SEO on-page complet', 'Analytics avancés & événements', 'Formulaires & tunnels de conversion', 'Hébergement 1 an inclus', 'Formation 1h en visio + guide PDF', 'Support prioritaire email (délai 48h)'],
          notIncluded: ['E-commerce complet', 'Intégrations API complexes', 'A/B testing', 'Support 24/7'],
          options: [{ label: 'Module e-commerce', price: 'Sur devis' }, { label: 'Page supplémentaire', price: '+120 € HT' }, { label: 'Intégration API tierce', price: '+390 € HT' }, { label: 'Chatbot IA', price: '+490 € HT' }],
          maintenanceItems: ['Hébergement & nom de domaine', 'Mises à jour de sécurité & CMS', 'Sauvegardes hebdomadaires', 'Support prioritaire (délai 48h)', '2 modifications de contenu / mois'],
        },
        {
          name: 'Pack Premium', tagline: 'Solution complète & évolutive. E-commerce & API.',
          bullets: ['Pages illimitées', 'E-commerce complet', 'Intégrations API tierces', 'Performance Core Web Vitals 90+'],
          included: ['Pages illimitées', 'E-commerce complet (catalogue, panier, Stripe)', 'Intégrations API tierces sur-mesure', 'Sécurité avancée', 'Performance Core Web Vitals 90+', 'Reporting & A/B testing', 'Design sur-mesure premium', 'SEO technique & on-page complet', 'Hébergement haute disponibilité inclus', 'Formation équipe + documentation vidéo', 'Support dédié 24/7 (délai 24h)'],
          notIncluded: ['Budget publicitaire (Ads)', 'Community management', 'Production photo / vidéo'],
          options: [{ label: 'Application mobile', price: 'Sur devis' }, { label: 'Intégration ERP / legacy', price: 'Sur devis' }, { label: 'Maintenance évolutive renforcée', price: '+390 € HT / mois' }],
          maintenanceItems: ['Hébergement haute disponibilité', 'Mises à jour de sécurité proactives', 'Sauvegardes quotidiennes', 'Monitoring & rapport mensuel', 'Support dédié 24/7 (délai 24h)', 'Modifications illimitées'],
        },
      ],
    },
    process: {
      h2: 'Notre méthode en 4 étapes',
      subtitle: 'Du premier brief à la mise en ligne : un processus éprouvé, des livrables clairs à chaque étape.',
      steps: [
        { title: 'Brief & devis', duration: '24 à 48h', desc: 'On cerne vos objectifs, votre cible et vos besoins. Vous recevez un devis détaillé et un calendrier clair sous 24h.', bring: 'Vos objectifs et références', bringLabel: 'Vous apportez :' },
        { title: 'Design Figma', duration: '3 à 7 jours', desc: 'Nous concevons les maquettes sur Figma et les validons avec vous avant d\'écrire la moindre ligne de code.', bring: 'Logo, textes, visuels', bringLabel: 'Vous apportez :' },
        { title: 'Développement', duration: '1 à 6 semaines', desc: 'Nous développons le site en Next.js, intégrons le contenu, le SEO et les fonctionnalités, puis le testons sur tous les écrans.', bring: 'Vos contenus définitifs', bringLabel: 'Vous apportez :' },
        { title: 'Mise en ligne & suivi', duration: '1 jour', desc: 'Déploiement, configuration du domaine et de l\'analytics, puis suivi renforcé les premiers jours. Formation incluse.', bring: '30 min pour la formation', bringLabel: 'Vous apportez :' },
      ],
    },
    testimonials: {
      h2: 'Ce que disent nos clients',
      items: [
        { quote: "Notre nouveau site charge en moins d'une seconde et on est enfin visibles sur Google. En 2 mois, le nombre de demandes de devis a doublé.", name: 'Julien P.', role: 'Gérant', company: 'Artisan, Lille', initials: 'JP', color: 'bg-white/10 text-white' },
        { quote: "La refonte a complètement changé notre image. Le design est superbe, l'espace client adoré par nos équipes. Le trafic organique a bondi de 40 %.", name: 'Camille R.', role: 'Directrice marketing', company: 'PME B2B, Lyon', initials: 'CR', color: 'bg-white/10 text-white' },
        { quote: "Boutique e-commerce livrée en 6 semaines, paiement Stripe nickel, site ultra rapide. Notre taux de conversion a pris 25 % grâce à l'A/B testing.", name: 'Sofia M.', role: 'Fondatrice', company: 'E-commerce, Bordeaux', initials: 'SM', color: 'bg-emerald-400/20 text-emerald-400' },
      ],
    },
    faq: {
      h2: 'Questions fréquentes',
      items: [
        { q: 'Combien coûte un site web ?', a: "Nos packs démarrent à 1 490 € HT pour une vitrine professionnelle (Pack Starter), 3 990 € HT pour un site complet avec blog et espace client (Pack Business), et 7 990 € HT pour une solution e-commerce sur-mesure (Pack Premium). Le devis exact dépend du nombre de pages et des fonctionnalités — il est gratuit et livré sous 24h." },
        { q: 'En combien de temps mon site sera-t-il en ligne ?', a: "Comptez 2 à 3 semaines pour un Pack Starter, 4 à 6 semaines pour un Pack Business et 6 à 8 semaines pour un Pack Premium. Le délai dépend surtout de la rapidité avec laquelle vous nous fournissez vos contenus (textes, visuels, logo)." },
        { q: 'Pourquoi Next.js plutôt que WordPress ?', a: "Next.js produit des sites bien plus rapides, plus sûrs et mieux référencés que WordPress, sans les plugins à maintenir ni les failles de sécurité. Vous obtenez des scores de performance 90+ et un SEO technique impeccable dès la mise en ligne. Pour un blog très simple sans exigence de performance, WordPress reste possible — on vous conseille selon votre cas." },
        { q: 'Le référencement SEO est-il inclus ?', a: "Oui. Tous nos packs incluent le SEO technique : balises uniques par page, données structurées Schema.org, sitemap, robots.txt et optimisation des Core Web Vitals. Le Pack Business ajoute le SEO on-page complet (structure de contenu, maillage interne). Le référencement éditorial sur la durée peut faire l'objet d'un accompagnement séparé." },
        { q: 'Pourrai-je modifier le site moi-même ?', a: "Oui. Les Packs Business et Premium incluent un CMS léger qui vous permet de modifier vos textes, images et articles de blog sans toucher au code. Vous êtes formé à la livraison. Pour le Pack Starter, les modifications sont incluses dans la maintenance mensuelle." },
        { q: 'Que comprend la maintenance mensuelle ?', a: "L'hébergement, le nom de domaine, les mises à jour de sécurité, les sauvegardes et le support. Selon le pack, elle inclut aussi des modifications de contenu mensuelles et un monitoring. C'est optionnel mais recommandé pour garder un site rapide et sécurisé dans le temps." },
        { q: 'Proposez-vous des sites e-commerce ?', a: "Oui, avec le Pack Premium : catalogue produits, panier, paiement Stripe sécurisé, gestion des commandes et tunnel de conversion optimisé. On peut aussi intégrer Shopify si vous le préférez. Le devis dépend du nombre de produits et des intégrations souhaitées." },
      ],
    },
    more: {
      h3: 'Pour aller plus loin',
      items: [
        { label: 'WordPress vs Next.js : quel choix en 2026 ?', href: '/blog/nextjs-vs-wordpress-2026' },
        { label: 'Comment intégrer l\'IA dans un site web en 2025', href: '/blog/integrer-ia-site-web-2025' },
        { label: 'Ajouter un chatbot IA à votre site', href: '/integration-ia' },
        { label: 'Automatiser vos process métier', href: '/automatisation' },
        { label: 'Développement d\'applications mobiles', href: '/mobile-app-development' },
      ],
    },
    cta: { badge: 'Devis gratuit · Sans engagement', h2: 'Prêt à lancer votre nouveau site ?', p: "Décrivez-nous votre projet et recevez un devis détaillé sous 24h, avec un calendrier clair. Sans engagement, sans jargon technique.", ctaAudit: 'Demander un devis gratuit', ctaBlog: 'Lire : Next.js vs WordPress', ctaBlogHref: '/blog/nextjs-vs-wordpress-2026' },
    detail: { included: 'Inclus', notIncluded: 'Non inclus', options: 'Options disponibles', maintenance: 'Maintenance', choose: 'Choisir', payment: 'Paiement échelonné disponible · 40% à la commande, 30% à la validation, 30% à la livraison' },
    showDetails: 'Voir les détails ↓', hideDetails: 'Masquer les détails ↑',
  },

  en: {
    hero: {
      badge: 'Next.js · React · SEO · Custom design websites',
      h1: 'Websites that',
      h1highlight: 'convert your visitors',
      p: "We build showcase, professional and e-commerce websites in Next.js: fast, SEO-optimised and with custom design. Free quote within 24h, live in a few weeks.",
      ctaAudit: 'Get a free quote',
      ctaPricing: 'See pricing',
    },
    stats: [
      { label: 'Core Web Vitals performance score' },
      { label: 'more organic traffic on average after redesign' },
      { label: 'to receive your custom quote' },
    ],
    problems: {
      h2: 'Is your website holding you back?',
      subtitle: "A slow or dated site drives away <strong>53% of mobile visitors</strong> before they even see your offer.",
      items: [
        { title: 'Your site is slow and not responsive', text: "Endless load times, broken display on mobile: every second of delay loses visitors and hurts your Google ranking." },
        { title: "You're invisible on Google", text: "No SEO structure, no optimised content, missing tags: your prospects find your competitors, not you." },
        { title: 'A dated design that fails to reassure', text: "An ageing website sends the wrong signal. Visitors judge your credibility in seconds — often before reading a word." },
        { title: 'No way to convert or measure', text: "No effective form, no clear call to action, no analytics tracking: you don't know where your leads come from or why they leave." },
      ],
    },
    services: {
      h2: 'What we build for you',
      subtitle: "From showcase sites to custom e-commerce, we cover the whole chain: design, development, SEO and performance.",
      items: [
        { title: 'Showcase & professional sites', desc: 'Fast, elegant Next.js sites to present your business, capture leads and inspire trust from the first second.', details: ['Up to 8 or 20 pages depending on the pack', 'Mobile-first responsive design', 'Connected contact forms', 'Optimised Google Business profile'], badge: 'From €1,490' },
        { title: 'Redesign & custom design', desc: 'Custom Figma mockups, consistent visual identity, polished UX: a site that looks like you and converts.', details: ['Figma mockups validated before dev', 'Brand guidelines and UI components', 'Animations and micro-interactions', 'Accessibility (WCAG) and contrast'], badge: 'Design included' },
        { title: 'Technical & on-page SEO', desc: 'Optimised structure, tags, structured data, sitemap: your site is built to climb Google from launch day.', details: ['Unique title / meta tags per page', 'Schema.org structured data', 'Sitemap & robots.txt', 'Core Web Vitals optimisation'], badge: 'Included' },
        { title: 'E-commerce & payment', desc: 'Complete online stores with catalogue, cart, Stripe payment and order management — ready to sell.', details: ['Product catalogue & variants', 'Secure Stripe payment', 'Order & stock management', 'Optimised conversion funnel'], badge: 'Premium Pack' },
        { title: 'Performance & Core Web Vitals', desc: 'Instant loading, optimised images, 90+ score: a fast site that delights visitors and pleases Google.', details: ['Guaranteed Lighthouse score 90+', 'Image optimisation & lazy-loading', 'Static rendering / Next.js ISR', 'CDN and advanced caching'], badge: 'Guaranteed' },
        { title: 'Hosting & maintenance', desc: "Deployment, hosting, backups and updates: we handle everything so your site stays fast and secure.", details: ['High-availability Vercel hosting', 'Automatic backups', 'Security updates', 'Support and fixes'], badge: 'Monthly subscription' },
      ],
    },
    tools: { label: 'Our tech stack' },
    useCases: {
      h2: 'Use cases by profile',
      subtitle: 'Concrete scenarios, with the right pack and the measurable result you can expect.',
      items: [
        { sector: 'Local tradesperson / Freelancer', context: 'No online presence, quotes requested by phone, invisible on Google.', solution: '8-page responsive showcase site + technical SEO + Google Business profile + contact form.', result: 'Visible on Google Maps · +15 to 20 qualified contacts/month · ROI often < 2 months', pack: 'Starter Pack' },
        { sector: 'SMB / Local business', context: 'Old non-responsive site, 40% mobile drop-off, no content for search ranking.', solution: 'Custom Figma redesign + CMS blog + client area + advanced analytics + on-page SEO.', result: '+35% organic traffic · −8h/week of support · professional image restored', pack: 'Business Pack' },
        { sector: 'Startup / Scale-up', context: 'Limited showcase site, needs e-commerce, integrations and performance to scale.', solution: 'Unlimited pages + e-commerce + API integrations + A/B testing + Core Web Vitals 90+.', result: '+25% conversion (A/B testing) · fast site that supports growth and SEO', pack: 'Premium Pack' },
      ],
    },
    packs: {
      h2: 'Our web packages',
      subtitle: 'Transparent pricing, no surprises. VAT not applicable.',
      popular: 'Most popular',
      ht: 'excl. VAT',
      monthly: '€/month maintenance',
      delivery: 'Delivery',
      items: [
        {
          name: 'Starter Pack', tagline: 'Your showcase on the web. Live in 3 weeks.',
          bullets: ['Showcase site up to 8 pages', 'Modern responsive design', 'Technical SEO included', '1-year hosting included'],
          included: ['Showcase site up to 8 pages', 'Mobile-first responsive design', 'Technical SEO (tags, sitemap, Schema)', 'Connected contact form', 'Optimised Google Business profile', '1-year hosting included', 'Google Analytics setup', '30-min training + documentation'],
          notIncluded: ['Blog / CMS', 'Client area', 'E-commerce', 'Custom Figma design', 'Third-party API integrations'],
          options: [{ label: 'Additional page', price: '+€150 excl. VAT' }, { label: 'Content writing (per page)', price: '+€90 excl. VAT' }, { label: 'AI chatbot', price: '+€490 excl. VAT' }],
          maintenanceItems: ['Hosting & domain name', 'Security updates', 'Monthly backups', 'Email support (72h response)'],
        },
        {
          name: 'Business Pack', tagline: 'Your growth platform. Blog & client area.',
          bullets: ['Site up to 20 pages', 'Custom Figma design', 'Blog + light CMS', 'Integrated client area'],
          included: ['Site up to 20 pages', 'Custom design validated on Figma', 'Integrated client area', 'Blog + light CMS', 'Full on-page SEO', 'Advanced analytics & events', 'Forms & conversion funnels', '1-year hosting included', '1h video training + PDF guide', 'Priority email support (48h response)'],
          notIncluded: ['Full e-commerce', 'Complex API integrations', 'A/B testing', '24/7 support'],
          options: [{ label: 'E-commerce module', price: 'Custom quote' }, { label: 'Additional page', price: '+€120 excl. VAT' }, { label: 'Third-party API integration', price: '+€390 excl. VAT' }, { label: 'AI chatbot', price: '+€490 excl. VAT' }],
          maintenanceItems: ['Hosting & domain name', 'Security & CMS updates', 'Weekly backups', 'Priority support (48h response)', '2 content changes / month'],
        },
        {
          name: 'Premium Pack', tagline: 'Complete & scalable solution. E-commerce & APIs.',
          bullets: ['Unlimited pages', 'Full e-commerce', 'Third-party API integrations', 'Core Web Vitals 90+ performance'],
          included: ['Unlimited pages', 'Full e-commerce (catalogue, cart, Stripe)', 'Custom third-party API integrations', 'Advanced security', 'Core Web Vitals 90+ performance', 'Reporting & A/B testing', 'Premium custom design', 'Full technical & on-page SEO', 'High-availability hosting included', 'Team training + video documentation', 'Dedicated 24/7 support (24h response)'],
          notIncluded: ['Advertising budget (Ads)', 'Community management', 'Photo / video production'],
          options: [{ label: 'Mobile app', price: 'Custom quote' }, { label: 'ERP / legacy integration', price: 'Custom quote' }, { label: 'Enhanced evolutive maintenance', price: '+€390 excl. VAT / month' }],
          maintenanceItems: ['High-availability hosting', 'Proactive security updates', 'Daily backups', 'Monitoring & monthly report', 'Dedicated 24/7 support (24h response)', 'Unlimited changes'],
        },
      ],
    },
    process: {
      h2: 'Our 4-step process',
      subtitle: 'From the first brief to go-live: a proven process with clear deliverables at every stage.',
      steps: [
        { title: 'Brief & quote', duration: '24 to 48h', desc: 'We pin down your goals, audience and needs. You receive a detailed quote and clear timeline within 24h.', bring: 'Your goals and references', bringLabel: 'You bring:' },
        { title: 'Figma design', duration: '3 to 7 days', desc: 'We design the mockups in Figma and validate them with you before writing a single line of code.', bring: 'Logo, copy, visuals', bringLabel: 'You bring:' },
        { title: 'Development', duration: '1 to 6 weeks', desc: 'We build the site in Next.js, integrate content, SEO and features, then test it on every screen.', bring: 'Your final content', bringLabel: 'You bring:' },
        { title: 'Go live & follow-up', duration: '1 day', desc: 'Deployment, domain and analytics setup, then enhanced follow-up the first days. Training included.', bring: '30 min for training', bringLabel: 'You bring:' },
      ],
    },
    testimonials: {
      h2: 'What our clients say',
      items: [
        { quote: "Our new site loads in under a second and we're finally visible on Google. Within 2 months, quote requests doubled.", name: 'Julien P.', role: 'Owner', company: 'Tradesperson, Lille', initials: 'JP', color: 'bg-white/10 text-white' },
        { quote: "The redesign completely changed our image. The design is gorgeous, the client area loved by our teams. Organic traffic jumped 40%.", name: 'Camille R.', role: 'Marketing Director', company: 'B2B SMB, Lyon', initials: 'CR', color: 'bg-white/10 text-white' },
        { quote: "E-commerce store delivered in 6 weeks, flawless Stripe payment, ultra-fast site. Our conversion rate gained 25% thanks to A/B testing.", name: 'Sofia M.', role: 'Founder', company: 'E-commerce, Bordeaux', initials: 'SM', color: 'bg-emerald-400/20 text-emerald-400' },
      ],
    },
    faq: {
      h2: 'Frequently asked questions',
      items: [
        { q: 'How much does a website cost?', a: "Our packs start at €1,490 excl. VAT for a professional showcase site (Starter Pack), €3,990 excl. VAT for a full site with blog and client area (Business Pack), and €7,990 excl. VAT for a custom e-commerce solution (Premium Pack). The exact quote depends on the number of pages and features — it's free and delivered within 24h." },
        { q: 'How long until my site is live?', a: "Allow 2 to 3 weeks for a Starter Pack, 4 to 6 weeks for a Business Pack and 6 to 8 weeks for a Premium Pack. The timeline mostly depends on how quickly you provide your content (copy, visuals, logo)." },
        { q: 'Why Next.js rather than WordPress?', a: "Next.js produces much faster, safer and better-ranked sites than WordPress, without plugins to maintain or security holes. You get 90+ performance scores and impeccable technical SEO from launch. For a very simple blog with no performance requirement, WordPress is still possible — we advise based on your case." },
        { q: 'Is SEO included?', a: "Yes. All our packs include technical SEO: unique tags per page, Schema.org structured data, sitemap, robots.txt and Core Web Vitals optimisation. The Business Pack adds full on-page SEO (content structure, internal linking). Ongoing editorial SEO can be a separate engagement." },
        { q: 'Will I be able to edit the site myself?', a: "Yes. The Business and Premium packs include a light CMS that lets you edit your copy, images and blog posts without touching code. You're trained at delivery. For the Starter Pack, changes are included in the monthly maintenance." },
        { q: 'What does monthly maintenance include?', a: "Hosting, domain name, security updates, backups and support. Depending on the pack, it also includes monthly content changes and monitoring. It's optional but recommended to keep a fast, secure site over time." },
        { q: 'Do you build e-commerce sites?', a: "Yes, with the Premium Pack: product catalogue, cart, secure Stripe payment, order management and optimised conversion funnel. We can also integrate Shopify if you prefer. The quote depends on the number of products and integrations needed." },
      ],
    },
    more: {
      h3: 'Learn more',
      items: [
        { label: 'WordPress vs Next.js: which choice in 2026?', href: '/blog/nextjs-vs-wordpress-2026' },
        { label: 'How to integrate AI into a website in 2025', href: '/blog/integrer-ia-site-web-2025' },
        { label: 'Add an AI chatbot to your site', href: '/integration-ia' },
        { label: 'Automate your business processes', href: '/automatisation' },
        { label: 'Mobile app development', href: '/mobile-app-development' },
      ],
    },
    cta: { badge: 'Free quote · No commitment', h2: 'Ready to launch your new site?', p: "Tell us about your project and get a detailed quote within 24h, with a clear timeline. No commitment, no technical jargon.", ctaAudit: 'Get a free quote', ctaBlog: 'Read: Next.js vs WordPress', ctaBlogHref: '/blog/nextjs-vs-wordpress-2026' },
    detail: { included: 'Included', notIncluded: 'Not included', options: 'Available options', maintenance: 'Maintenance', choose: 'Choose', payment: 'Staged payment available · 40% on order, 30% on validation, 30% on delivery' },
    showDetails: 'Show details ↓', hideDetails: 'Hide details ↑',
  },

  es: {
    hero: {
      badge: 'Webs Next.js · React · SEO · Diseño a medida',
      h1: 'Sitios web que',
      h1highlight: 'convierten a tus visitantes',
      p: "Diseñamos sitios vitrina, profesionales y e-commerce en Next.js: rápidos, optimizados para SEO y con diseño a medida. Presupuesto gratis en 24h, online en pocas semanas.",
      ctaAudit: 'Solicitar presupuesto gratis',
      ctaPricing: 'Ver precios',
    },
    stats: [
      { label: 'de puntuación Core Web Vitals (rendimiento)' },
      { label: 'más tráfico orgánico de media tras el rediseño' },
      { label: 'para recibir tu presupuesto personalizado' },
    ],
    problems: {
      h2: '¿Tu web te frena?',
      subtitle: "Un sitio lento o anticuado ahuyenta al <strong>53 % de los visitantes móviles</strong> antes de que vean tu oferta.",
      items: [
        { title: 'Tu web es lenta y no responsive', text: "Tiempos de carga interminables, visualización rota en móvil: cada segundo de retraso pierde visitantes y penaliza tu posicionamiento en Google." },
        { title: 'Eres invisible en Google', text: "Sin estructura SEO, sin contenido optimizado, etiquetas ausentes: tus prospectos encuentran a tus competidores, no a ti." },
        { title: 'Un diseño anticuado que no transmite confianza', text: "Una web envejecida da mala impresión. Tus visitantes juzgan tu seriedad en segundos — a menudo antes de leerte." },
        { title: 'Imposible convertir o medir', text: "Sin formulario eficaz, sin llamada a la acción clara, sin analítica: no sabes de dónde vienen tus contactos ni por qué se van." },
      ],
    },
    services: {
      h2: 'Lo que construimos para ti',
      subtitle: "Desde el sitio vitrina hasta el e-commerce a medida, cubrimos toda la cadena: diseño, desarrollo, SEO y rendimiento.",
      items: [
        { title: 'Sitios vitrina y profesionales', desc: 'Sitios Next.js rápidos y elegantes para presentar tu actividad, captar leads e inspirar confianza desde el primer segundo.', details: ['Hasta 8 o 20 páginas según el pack', 'Diseño responsive mobile-first', 'Formularios de contacto conectados', 'Ficha Google Business optimizada'], badge: 'Desde 1.490 €' },
        { title: 'Rediseño y diseño a medida', desc: 'Maquetas Figma a medida, identidad visual coherente, experiencia de usuario cuidada: una web que te representa y convierte.', details: ['Maquetas Figma validadas antes del desarrollo', 'Guía de estilo y componentes UI', 'Animaciones y microinteracciones', 'Accesibilidad (WCAG) y contrastes'], badge: 'Diseño incluido' },
        { title: 'SEO técnico y on-page', desc: 'Estructura optimizada, etiquetas, datos estructurados, sitemap: tu web está hecha para subir en Google desde el primer día.', details: ['Etiquetas title / meta únicas por página', 'Datos estructurados Schema.org', 'Sitemap y robots.txt', 'Optimización Core Web Vitals'], badge: 'Incluido' },
        { title: 'E-commerce y pago', desc: 'Tiendas online completas con catálogo, carrito, pago Stripe y gestión de pedidos — listas para vender.', details: ['Catálogo de productos y variantes', 'Pago Stripe seguro', 'Gestión de pedidos y stock', 'Embudo de conversión optimizado'], badge: 'Pack Premium' },
        { title: 'Rendimiento y Core Web Vitals', desc: 'Carga instantánea, imágenes optimizadas, puntuación 90+: una web rápida que encanta a tus visitantes y gusta a Google.', details: ['Puntuación Lighthouse 90+ garantizada', 'Optimización de imágenes y lazy-loading', 'Renderizado estático / ISR Next.js', 'CDN y caché avanzada'], badge: 'Garantizado' },
        { title: 'Alojamiento y mantenimiento', desc: "Despliegue, alojamiento, copias de seguridad y actualizaciones: nos ocupamos de todo para que tu web siga rápida y segura.", details: ['Alojamiento Vercel de alta disponibilidad', 'Copias de seguridad automáticas', 'Actualizaciones de seguridad', 'Soporte y correcciones'], badge: 'Suscripción mensual' },
      ],
    },
    tools: { label: 'Nuestro stack técnico' },
    useCases: {
      h2: 'Casos de uso por perfil',
      subtitle: 'Escenarios concretos, con el pack adecuado y el resultado medible que puedes esperar.',
      items: [
        { sector: 'Autónomo / Profesional local', context: 'Sin presencia online, presupuestos pedidos por teléfono, invisible en Google.', solution: 'Web vitrina de 8 páginas responsive + SEO técnico + ficha Google Business + formulario de contacto.', result: 'Visible en Google Maps · +15 a 20 contactos cualificados/mes · ROI a menudo < 2 meses', pack: 'Pack Starter' },
        { sector: 'Pyme / Comercio local', context: 'Web antigua no responsive, 40 % de abandonos en móvil, sin contenido para posicionar.', solution: 'Rediseño Figma a medida + blog CMS + área de cliente + analytics avanzados + SEO on-page.', result: '+35 % de tráfico orgánico · −8h/semana de soporte · imagen profesional recuperada', pack: 'Pack Business' },
        { sector: 'Startup / Scale-up', context: 'Web vitrina limitada, necesita e-commerce, integraciones y rendimiento para escalar.', solution: 'Páginas ilimitadas + e-commerce + integraciones API + A/B testing + Core Web Vitals 90+.', result: '+25 % de conversión (A/B testing) · web rápida que impulsa el crecimiento y el SEO', pack: 'Pack Premium' },
      ],
    },
    packs: {
      h2: 'Nuestros packs web',
      subtitle: 'Precios transparentes, sin sorpresas. IVA no incluido.',
      popular: 'El más popular',
      ht: 's/IVA',
      monthly: '€/mes mantenimiento',
      delivery: 'Plazo',
      items: [
        {
          name: 'Pack Starter', tagline: 'Tu vitrina en la web. Online en 3 semanas.',
          bullets: ['Sitio vitrina hasta 8 páginas', 'Diseño responsive moderno', 'SEO técnico incluido', 'Alojamiento 1 año incluido'],
          included: ['Sitio vitrina hasta 8 páginas', 'Diseño responsive mobile-first', 'SEO técnico (etiquetas, sitemap, Schema)', 'Formulario de contacto conectado', 'Ficha Google Business optimizada', 'Alojamiento 1 año incluido', 'Google Analytics configurado', 'Formación 30 min + documentación'],
          notIncluded: ['Blog / CMS', 'Área de cliente', 'E-commerce', 'Diseño Figma a medida', 'Integraciones API externas'],
          options: [{ label: 'Página adicional', price: '+150 € s/IVA' }, { label: 'Redacción de contenido (por página)', price: '+90 € s/IVA' }, { label: 'Chatbot IA', price: '+490 € s/IVA' }],
          maintenanceItems: ['Alojamiento y nombre de dominio', 'Actualizaciones de seguridad', 'Copias de seguridad mensuales', 'Soporte por email (72h de respuesta)'],
        },
        {
          name: 'Pack Business', tagline: 'Tu plataforma de crecimiento. Blog y área de cliente.',
          bullets: ['Sitio hasta 20 páginas', 'Diseño a medida Figma', 'Blog + CMS ligero', 'Área de cliente integrada'],
          included: ['Sitio hasta 20 páginas', 'Diseño a medida validado en Figma', 'Área de cliente integrada', 'Blog + CMS ligero', 'SEO on-page completo', 'Analytics avanzados y eventos', 'Formularios y embudos de conversión', 'Alojamiento 1 año incluido', 'Formación 1h por videollamada + guía PDF', 'Soporte prioritario por email (48h de respuesta)'],
          notIncluded: ['E-commerce completo', 'Integraciones API complejas', 'A/B testing', 'Soporte 24/7'],
          options: [{ label: 'Módulo e-commerce', price: 'Presupuesto a medida' }, { label: 'Página adicional', price: '+120 € s/IVA' }, { label: 'Integración API externa', price: '+390 € s/IVA' }, { label: 'Chatbot IA', price: '+490 € s/IVA' }],
          maintenanceItems: ['Alojamiento y nombre de dominio', 'Actualizaciones de seguridad y CMS', 'Copias de seguridad semanales', 'Soporte prioritario (48h de respuesta)', '2 modificaciones de contenido / mes'],
        },
        {
          name: 'Pack Premium', tagline: 'Solución completa y escalable. E-commerce y APIs.',
          bullets: ['Páginas ilimitadas', 'E-commerce completo', 'Integraciones API externas', 'Rendimiento Core Web Vitals 90+'],
          included: ['Páginas ilimitadas', 'E-commerce completo (catálogo, carrito, Stripe)', 'Integraciones API externas a medida', 'Seguridad avanzada', 'Rendimiento Core Web Vitals 90+', 'Reporting y A/B testing', 'Diseño a medida premium', 'SEO técnico y on-page completo', 'Alojamiento de alta disponibilidad incluido', 'Formación del equipo + documentación en vídeo', 'Soporte dedicado 24/7 (24h de respuesta)'],
          notIncluded: ['Presupuesto publicitario (Ads)', 'Community management', 'Producción foto / vídeo'],
          options: [{ label: 'Aplicación móvil', price: 'Presupuesto a medida' }, { label: 'Integración ERP / legacy', price: 'Presupuesto a medida' }, { label: 'Mantenimiento evolutivo reforzado', price: '+390 € s/IVA / mes' }],
          maintenanceItems: ['Alojamiento de alta disponibilidad', 'Actualizaciones de seguridad proactivas', 'Copias de seguridad diarias', 'Monitorización e informe mensual', 'Soporte dedicado 24/7 (24h de respuesta)', 'Modificaciones ilimitadas'],
        },
      ],
    },
    process: {
      h2: 'Nuestro proceso en 4 pasos',
      subtitle: 'Desde el primer brief hasta la puesta online: un proceso probado con entregables claros en cada etapa.',
      steps: [
        { title: 'Brief y presupuesto', duration: '24 a 48h', desc: 'Definimos tus objetivos, tu público y tus necesidades. Recibes un presupuesto detallado y un calendario claro en 24h.', bring: 'Tus objetivos y referencias', bringLabel: 'Tú aportas:' },
        { title: 'Diseño Figma', duration: '3 a 7 días', desc: 'Diseñamos las maquetas en Figma y las validamos contigo antes de escribir una sola línea de código.', bring: 'Logo, textos, imágenes', bringLabel: 'Tú aportas:' },
        { title: 'Desarrollo', duration: '1 a 6 semanas', desc: 'Construimos el sitio en Next.js, integramos el contenido, el SEO y las funcionalidades, y lo probamos en todas las pantallas.', bring: 'Tus contenidos definitivos', bringLabel: 'Tú aportas:' },
        { title: 'Puesta online y seguimiento', duration: '1 día', desc: 'Despliegue, configuración del dominio y la analítica, y seguimiento reforzado los primeros días. Formación incluida.', bring: '30 min para la formación', bringLabel: 'Tú aportas:' },
      ],
    },
    testimonials: {
      h2: 'Lo que dicen nuestros clientes',
      items: [
        { quote: "Nuestra nueva web carga en menos de un segundo y por fin somos visibles en Google. En 2 meses, las solicitudes de presupuesto se duplicaron.", name: 'Julien P.', role: 'Gerente', company: 'Autónomo, Lille', initials: 'JP', color: 'bg-white/10 text-white' },
        { quote: "El rediseño cambió por completo nuestra imagen. El diseño es precioso, el área de cliente encantó a nuestros equipos. El tráfico orgánico subió un 40 %.", name: 'Camille R.', role: 'Directora de marketing', company: 'Pyme B2B, Lyon', initials: 'CR', color: 'bg-white/10 text-white' },
        { quote: "Tienda e-commerce entregada en 6 semanas, pago Stripe impecable, web ultrarrápida. Nuestra tasa de conversión ganó un 25 % gracias al A/B testing.", name: 'Sofia M.', role: 'Fundadora', company: 'E-commerce, Burdeos', initials: 'SM', color: 'bg-emerald-400/20 text-emerald-400' },
      ],
    },
    faq: {
      h2: 'Preguntas frecuentes',
      items: [
        { q: '¿Cuánto cuesta un sitio web?', a: "Nuestros packs empiezan en 1.490 € s/IVA para una vitrina profesional (Pack Starter), 3.990 € s/IVA para un sitio completo con blog y área de cliente (Pack Business), y 7.990 € s/IVA para una solución e-commerce a medida (Pack Premium). El presupuesto exacto depende del número de páginas y funcionalidades — es gratis y se entrega en 24h." },
        { q: '¿En cuánto tiempo estará online mi sitio?', a: "Cuenta 2 a 3 semanas para un Pack Starter, 4 a 6 semanas para un Pack Business y 6 a 8 semanas para un Pack Premium. El plazo depende sobre todo de la rapidez con que nos facilites tus contenidos (textos, imágenes, logo)." },
        { q: '¿Por qué Next.js en lugar de WordPress?', a: "Next.js produce sitios mucho más rápidos, seguros y mejor posicionados que WordPress, sin plugins que mantener ni fallos de seguridad. Obtienes puntuaciones de rendimiento 90+ y un SEO técnico impecable desde el lanzamiento. Para un blog muy simple sin exigencia de rendimiento, WordPress sigue siendo posible — te asesoramos según tu caso." },
        { q: '¿El SEO está incluido?', a: "Sí. Todos nuestros packs incluyen SEO técnico: etiquetas únicas por página, datos estructurados Schema.org, sitemap, robots.txt y optimización de Core Web Vitals. El Pack Business añade el SEO on-page completo (estructura de contenido, enlazado interno). El SEO editorial a largo plazo puede ser un acompañamiento aparte." },
        { q: '¿Podré modificar el sitio yo mismo?', a: "Sí. Los packs Business y Premium incluyen un CMS ligero que te permite modificar tus textos, imágenes y artículos de blog sin tocar el código. Recibes formación en la entrega. Para el Pack Starter, las modificaciones están incluidas en el mantenimiento mensual." },
        { q: '¿Qué incluye el mantenimiento mensual?', a: "El alojamiento, el nombre de dominio, las actualizaciones de seguridad, las copias de seguridad y el soporte. Según el pack, también incluye modificaciones de contenido mensuales y monitorización. Es opcional pero recomendable para mantener un sitio rápido y seguro en el tiempo." },
        { q: '¿Ofrecéis sitios e-commerce?', a: "Sí, con el Pack Premium: catálogo de productos, carrito, pago Stripe seguro, gestión de pedidos y embudo de conversión optimizado. También podemos integrar Shopify si lo prefieres. El presupuesto depende del número de productos e integraciones necesarias." },
      ],
    },
    more: {
      h3: 'Saber más',
      items: [
        { label: 'WordPress vs Next.js: ¿qué elegir en 2026?', href: '/blog/nextjs-vs-wordpress-2026' },
        { label: 'Cómo integrar IA en un sitio web en 2025', href: '/blog/integrer-ia-site-web-2025' },
        { label: 'Añade un chatbot IA a tu sitio', href: '/integration-ia' },
        { label: 'Automatiza tus procesos de negocio', href: '/automatisation' },
        { label: 'Desarrollo de aplicaciones móviles', href: '/mobile-app-development' },
      ],
    },
    cta: { badge: 'Presupuesto gratis · Sin compromiso', h2: '¿Listo para lanzar tu nuevo sitio?', p: "Cuéntanos tu proyecto y recibe un presupuesto detallado en 24h, con un calendario claro. Sin compromiso, sin jerga técnica.", ctaAudit: 'Solicitar presupuesto gratis', ctaBlog: 'Leer: Next.js vs WordPress', ctaBlogHref: '/blog/nextjs-vs-wordpress-2026' },
    detail: { included: 'Incluido', notIncluded: 'No incluido', options: 'Opciones disponibles', maintenance: 'Mantenimiento', choose: 'Elegir', payment: 'Pago fraccionado disponible · 40% al pedido, 30% a la validación, 30% a la entrega' },
    showDetails: 'Ver detalles ↓', hideDetails: 'Ocultar detalles ↑',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// STATIC DATA (unchanged across languages)
// ═══════════════════════════════════════════════════════════════════════════

const STATS_VALUES = ['90+', '+35%', '24h'];

const SERVICE_ICONS = [Layout, Palette, Search, ShoppingCart, Gauge, Server];
const SERVICE_BADGE_COLORS = ['bg-emerald-500', 'bg-gray-900', 'bg-violet-500', 'bg-gray-700', 'bg-rose-500', 'bg-slate-500'];
const SERVICE_ACCENT_COLORS = ['border-emerald-400', 'border-white', 'border-gray-400', 'border-gray-400', 'border-rose-400', 'border-slate-400'];

const PACK_PRICES = [1490, 3990, 7990];
const PACK_MONTHLY = [49, 89, 149];
const PACK_DELIVERY: Record<Lang, string[]> = {
  fr: ['2 à 3 semaines', '4 à 6 semaines', '6 à 8 semaines'],
  en: ['2 to 3 weeks', '4 to 6 weeks', '6 to 8 weeks'],
  es: ['2 a 3 semanas', '4 a 6 semanas', '6 a 8 semanas'],
};
const PACK_IDS = ['starter', 'business', 'premium'] as const;
type PackId = (typeof PACK_IDS)[number];

const TOOLS = [
  { name: 'Next.js', cat: { fr: 'Framework', en: 'Framework', es: 'Framework' } },
  { name: 'React', cat: { fr: 'Framework', en: 'Framework', es: 'Framework' } },
  { name: 'TypeScript', cat: { fr: 'Langage', en: 'Language', es: 'Lenguaje' } },
  { name: 'Tailwind CSS', cat: { fr: 'Design', en: 'Design', es: 'Diseño' } },
  { name: 'Figma', cat: { fr: 'Design', en: 'Design', es: 'Diseño' } },
  { name: 'Vercel', cat: { fr: 'Hébergement', en: 'Hosting', es: 'Alojamiento' } },
  { name: 'Supabase', cat: { fr: 'Backend', en: 'Backend', es: 'Backend' } },
  { name: 'Stripe', cat: { fr: 'Paiement', en: 'Payment', es: 'Pago' } },
  { name: 'Sanity', cat: { fr: 'CMS', en: 'CMS', es: 'CMS' } },
  { name: 'WordPress', cat: { fr: 'CMS', en: 'CMS', es: 'CMS' } },
  { name: 'Shopify', cat: { fr: 'E-commerce', en: 'E-commerce', es: 'E-commerce' } },
  { name: 'Google Analytics', cat: { fr: 'Analytics', en: 'Analytics', es: 'Analytics' } },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

// Délai de stagger par index (classes définies dans globals.css)
const DELAY_CLASSES = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];

export function DeveloppementWebPageClient({ lang }: Props) {
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
              <Code size={14} />
              <span>{c.hero.badge}</span>
            </div>
            <h1 className="animate-on-scroll fade-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {c.hero.h1}{' '}
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{c.hero.h1highlight}</span>
            </h1>
            <p className="animate-on-scroll fade-up delay-200 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">{c.hero.p}</p>
            <div className="animate-on-scroll fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <LocalizedLink href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-gray-900 transition-all duration-300 hover:opacity-90" style={{ background: '#ffffff', boxShadow: '0 4px 20px rgba(255,255,255,0.2)' }}>
                <Code size={18} />{c.hero.ctaAudit}<ArrowRight size={16} />
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
                const icons = [Gauge, Search, AlertTriangle, TrendingUp];
                const colors = ['text-white bg-white/5', 'text-white bg-white/5', 'text-rose-400 bg-rose-400/10', 'text-white bg-white/5'];
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {c.useCases.items.map((uc, i) => (
                <article key={i} className={`animate-on-scroll fade-up ${DELAY_CLASSES[i]} rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 h-full flex flex-col`}>
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
                  {c.packs.items[i].name.split(' ')[1] ?? c.packs.items[i].name}
                </button>
              ))}
            </div>

            {/* Cards desktop */}
            <div className="animate-on-scroll fade-up hidden sm:grid grid-cols-3 gap-6 mb-10">
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
            <div className="animate-on-scroll fade-up delay-100 rounded-2xl border border-white/10 bg-[#0e1b3d]/30 p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{activePack.name}</h3>
                  <p className="text-slate-400 text-sm">{activePack.tagline}</p>
                </div>
                <LocalizedLink href={`/booking?pack=${selectedPack}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-gray-900 transition-all duration-300" style={{ background: '#ffffff', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
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
            <div className="animate-on-scroll fade-up mt-10 rounded-xl border border-slate-200 bg-white p-6">
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
                <Code size={18} className="text-gray-900" />
                <span className="text-gray-900">{c.cta.ctaAudit}</span>
                <ArrowRight size={16} className="text-gray-900" />
              </LocalizedLink>
              <LocalizedLink href={c.cta.ctaBlogHref} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-300 border border-white/20 hover:border-white/40 hover:text-white transition-all duration-300">
                {c.cta.ctaBlog}<ArrowRight size={16} />
              </LocalizedLink>
            </div>
          </div>
        </section>

        <DemoCTA sector="web" />
      </main>
      <Footer />
    </>
  );
}
