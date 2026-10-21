'use client';

import '@/app/[lang]/themes/dev-web.css';
import { SourcedStats } from '@/components/sourced-stats';
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
import { ServiceHero } from '@/components/service-hero';
import { LocalizedLink } from '@/components/localized-link';
import { DemoCTA } from '@/components/demo-cta';
import { ResponsiveCards } from '@/components/ui/cards-carousel';
import { MobileCollapse } from '@/components/ui/mobile-collapse';
import { PageAnchorNav } from '@/components/page-anchor-nav';
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
  tools: { label: string };
  useCases: { h2: string; subtitle: string; items: { sector: string; context: string; solution: string; result: string; pack: string }[] };
  packs: {
    h2: string; subtitle: string; popular: string; ht: string; monthly: string; delivery: string;
    // Premium = sur mesure (pas de prix affiché) ; Starter / Business = prix sur maquettes prédéfinies
    custom: string; customNote: string; customDetail: string; customCta: string;
    // Maintenance : selon le temps alloué et la complexité (dès 59 / 89 / 119 €/mois) ; 12 mois offerts UNIQUEMENT sur le Pack Premium
    monthlyFrom: string; maintenanceFree: string; maintenanceAfterFree: string; maintenanceRule: string;
    // Tous les prix sont « à partir de » ; statique ≠ backend + CMS ; l'architecture sur mesure est chiffrée à part, sur devis
    priceFrom: string; types: [string, string, string];
    mockupNote: string; mockupDetail: string;
    items: { name: string; tagline: string; bullets: string[]; included: string[]; notIncluded: string[]; options: { label: string; price: string }[]; maintenanceItems: string[] }[];
    // Options à la carte (issues du devis), valables sur tous les packs
    extras: { title: string; subtitle: string; items: { label: string; desc: string; price: string }[]; hourly: string; tools: string };
  };
  seo: { h2: string; subtitle: string; levels: { name: string; badge: string; goal: string; items: string[]; price: string }[]; note: string };
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
      p: "Nous concevons des sites vitrine, professionnels et e-commerce en Next.js : rapides, optimisés SEO et au design sur-mesure. Devis gratuit sous 48h, mise en ligne en quelques semaines.",
      ctaAudit: 'Demander un devis gratuit',
      ctaPricing: 'Voir les tarifs',
    },
    stats: [
      { label: 'score PageSpeed visé à la livraison (mobile)' },
      { label: 'sur Google, 14 avis clients publiés' },
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
        { title: 'Refonte & design sur-mesure', desc: 'Maquettes sur-mesure, identité visuelle cohérente, expérience utilisateur soignée : un site qui vous ressemble et qui convertit.', details: ['Maquettes validées avant dev', 'Charte graphique et composants UI', 'Animations et micro-interactions', 'Accessibilité (WCAG) et contrastes'], badge: 'Sur devis' },
        { title: 'SEO technique & on-page', desc: 'Structure optimisée, balises, données structurées, sitemap : votre site est conçu pour grimper dans Google dès la mise en ligne.', details: ['Balises title / meta uniques par page', 'Données structurées Schema.org', 'Sitemap & robots.txt', 'Optimisation Core Web Vitals'], badge: 'Inclus' },
        { title: 'E-commerce & paiement', desc: 'Boutiques en ligne complètes avec catalogue, panier, paiement Stripe et gestion des commandes — prêtes à vendre.', details: ['Catalogue produits & variantes', 'Paiement Stripe sécurisé', 'Gestion des commandes & stocks', 'Tunnel de conversion optimisé'], badge: 'Pack Premium' },
        { title: 'Performance & Core Web Vitals', desc: 'Chargement instantané, images optimisées, objectif de score 90+ : un site rapide qui ravit vos visiteurs et plaît à Google.', details: ['Score Lighthouse 90+ garanti', 'Optimisation images & lazy-loading', 'Rendu statique / ISR Next.js', 'CDN et mise en cache avancée'], badge: 'Garanti' },
        { title: 'Hébergement & maintenance', desc: "Déploiement, hébergement, sauvegardes et mises à jour : on s'occupe de tout pour que votre site reste rapide et sécurisé.", details: ['Hébergement Vercel haute disponibilité', 'Sauvegardes automatiques', 'Mises à jour de sécurité', 'Support et corrections'], badge: 'Abonnement mensuel' },
      ],
    },
    tools: { label: 'Notre stack technique' },
    useCases: {
      h2: "Cas d'usage par profil",
      subtitle: 'Des scénarios types, avec le pack adapté. À titre indicatif : les résultats varient selon le contexte et ne sont pas garantis.',
      items: [
        { sector: 'Artisan / Indépendant local', context: 'Aucune présence en ligne, devis demandés par téléphone, invisible sur Google.', solution: 'Vitrine 8 pages responsive + SEO technique + fiche Google Business + formulaire de contact.', result: 'Visible sur Google Maps · demandes de contact qualifiées · retour sur investissement rapide', pack: 'Pack Starter' },
        { sector: 'PME / Commerce local', context: 'Vieux site non responsive, 40 % d\'abandons sur mobile, aucun contenu pour le référencement.', solution: 'Refonte sur maquettes prédéfinies adaptées à votre charte + blog CMS + espace client + analytics avancés + SEO on-page.', result: 'Trafic organique en hausse · moins de temps passé en support · image professionnelle restaurée', pack: 'Pack Business' },
        { sector: 'Startup / Scale-up', context: 'Site vitrine limité, besoin d\'e-commerce, d\'intégrations et de performance pour scaler.', solution: 'Design sur mesure + e-commerce + intégrations API + A/B testing + Core Web Vitals 90+.', result: 'Conversion améliorée grâce aux tests A/B · site rapide qui soutient la croissance et le SEO', pack: 'Pack Premium' },
      ],
    },
    packs: {
      h2: 'Nos packs web',
      subtitle: 'Des prix transparents, sans surprise. TVA non applicable (art. 293B du CGI). Les prix Starter et Business s\'appliquent à des maquettes déjà déterminées ; le Pack Premium est entièrement sur mesure, sur devis.',
      popular: 'Le plus populaire',
      ht: 'HT',
      monthly: '€/mois maintenance',
      delivery: 'Délai',
      custom: 'Sur mesure',
      customNote: 'Prix défini à part, uniquement sur devis',
      customDetail: 'Pack entièrement sur mesure : design, périmètre, fonctionnalités et prix sont définis ensemble dans un devis personnalisé, gratuit et sans engagement, livré sous 48 h. Maintenance offerte pendant 12 mois, puis chiffrée à part, sur devis.',
      customCta: 'Demander un devis sur mesure',
      monthlyFrom: 'à partir de',
      priceFrom: 'À partir de',
      types: ['Site statique', 'Backend + CMS', 'Architecture sur mesure'],
      maintenanceFree: 'Maintenance offerte 12 mois',
      maintenanceAfterFree: 'Puis sur devis : l\'architecture sur mesure est chiffrée à part.',
      maintenanceRule: 'Le prix suit le temps alloué et la complexité : site statique (≈ 0,5 h/mois) à partir de 59 € · backend + CMS (≈ 1 h/mois) à partir de 89 € · comptes, accès privé ou paiement (≈ 1,5 h/mois) à partir de 119 €. Au-delà du temps alloué : 85 €/h.',
      mockupNote: 'Sur maquettes prédéfinies',
      mockupDetail: 'Le prix de ce pack s\'applique à des maquettes déjà déterminées (structure et design de base définis à l\'avance, adaptés à votre charte). Tout design sur mesure fait l\'objet d\'un devis : c\'est le Pack Premium.',
      extras: {
        title: 'Options à la carte, valables sur tous les packs',
        subtitle: 'Prix HT, tels que proposés dans nos devis. Chaque option est chiffrée précisément dans votre devis.',
        items: [
          { label: 'Version anglaise', desc: 'Site bilingue FR / EN, les deux langues déclarées pour le référencement.', price: 'À partir de 490 € HT' },
          { label: 'Mesure d\'audience + consentement', desc: 'Compte, balises, bandeau de consentement conforme (refuser est aussi simple qu\'accepter), événements, conversions et tableau de bord.', price: 'À partir de 490 € HT' },
          { label: 'Espace d\'administration (CMS)', desc: 'Ajoute un CMS à un site statique : modifiez textes et visuels vous-même : 2 rôles (éditeur, validateur), 3 comptes nominatifs, statuts brouillon / à valider / publié, formation en visio et guide PDF.', price: 'À partir de 890 € HT' },
          { label: 'Liste d\'attente partenaires (backend)', desc: 'Développement backend : formulaire dédié (société, type de partenariat, budget), base de données en Europe, un statut par demande, export en un clic.', price: 'À partir de 590 € HT' },
          { label: 'Catalogue filtrable', desc: 'Vos contenus (épisodes, produits, réalisations) classés et filtrables par catégorie.', price: 'À partir de 990 € HT' },
          { label: 'Page de marque habillée', desc: 'Page dédiée à un partenaire ou à une marque, avec la mention « avec [marque] » conforme.', price: 'À partir de 590 € HT (150 € la suivante)' },
          { label: 'Espace partenaires privé', desc: 'Offres et chiffres partagés sur accès, sans les publier.', price: 'À partir de 1 490 € HT' },
          { label: 'SEO · Pack de lancement', desc: 'Contrôle du nom et des homonymes, choix du domaine, balisage et données structurées, requêtes de marque, redirections, rapport de visibilité Google + IA à 30 jours.', price: 'À partir de 990 € HT' },
          { label: 'SEO · Accompagnement 3 mois', desc: 'Pages par usage, plan éditorial, kit presse, suivi mensuel avec 3 rapports de visibilité Google + IA.', price: 'À partir de 2 490 € HT' },
        ],
        hourly: 'Travail hors périmètre : 85 € HT de l\'heure, toujours après devis écrit.',
        tools: 'Les outils tiers (domaine, emailing, mesure d\'audience, base de données) sont ouverts à votre nom : environ 80 à 200 € par an en version économe, 400 à 1 000 € par an en version confortable. L\'hébergement du site est inclus la première année.',
      },
      items: [
        {
          name: 'Pack Starter', tagline: 'Votre vitrine sur le web, sur template personnalisé. En ligne en 3 semaines.',
          bullets: ['Template Next.js personnalisé, jusqu\'à 8 pages', 'Design responsive moderne', 'SEO de base inclus', 'Hébergement 1 an offert'],
          included: ['Template Next.js premium personnalisé (logo, couleurs, polices, contenus) — jusqu\'à 8 pages', 'Design responsive mobile-first', 'SEO de base (balises uniques, sitemap, robots.txt, Schema.org, Search Console)', 'Formulaire de contact connecté', 'Fiche Google Business optimisée', 'Hébergement 1 an inclus', 'Google Analytics configuré', 'Formation 30 min + documentation'],
          notIncluded: ['Design sur-mesure', 'Blog / CMS', 'Espace client', 'E-commerce', 'SEO on-page, SEO local et GEO (en option)'],
          options: [{ label: 'Page supplémentaire (template)', price: 'À partir de 190 € HT' }, { label: 'Rédaction de contenu (par page)', price: 'À partir de 120 € HT' }, { label: 'SEO on-page (mots-clés, structure, maillage)', price: 'À partir de 590 € HT' }, { label: 'SEO local (Google Business, annuaires, avis)', price: 'À partir de 390 € HT' }, { label: 'GEO — visibilité dans les IA (ChatGPT, Perplexity…)', price: 'À partir de 690 € HT' }, { label: 'Chatbot IA (FAQ du site, 1 langue) + 29 €/mois', price: 'À partir de 890 € HT' }],
          maintenanceItems: ['≈ 0,5 h de maintenance / mois', 'Hébergement & nom de domaine', 'Mises à jour de sécurité', 'Sauvegardes mensuelles', 'Support email (délai 72h)'],
        },
        {
          name: 'Pack Business', tagline: 'Votre plateforme de croissance. Blog & espace client.',
          bullets: ['Site jusqu\'à 20 pages', 'Maquettes prédéfinies validées avant développement', 'Blog + CMS léger', 'Espace client intégré'],
          included: ['Site jusqu\'à 20 pages', 'Maquettes prédéfinies adaptées à votre charte, validées avant développement', 'Espace client intégré', 'Blog + CMS léger', 'SEO on-page complet', 'Analytics avancés & événements', 'Formulaires & tunnels de conversion', 'Hébergement 1 an inclus', 'Formation 1h en visio + guide PDF', 'Support prioritaire email (délai 48h)'],
          notIncluded: ['Design sur-mesure (Pack Premium)', 'E-commerce complet', 'Intégrations API complexes', 'A/B testing', 'Support 24/7'],
          options: [{ label: 'Module e-commerce', price: 'À partir de 2 490 € HT' }, { label: 'Page supplémentaire (maquette prédéfinie)', price: 'À partir de 250 € HT' }, { label: 'Intégration API tierce', price: 'À partir de 590 € HT' }, { label: 'SEO local (Google Business, annuaires, avis)', price: 'À partir de 390 € HT' }, { label: '3 articles de blog SEO (800 mots)', price: 'À partir de 490 € HT' }, { label: 'GEO — visibilité dans les IA (ChatGPT, Perplexity…)', price: 'À partir de 690 € HT' }, { label: 'Chatbot IA (FAQ du site, 1 langue) + 29 €/mois', price: 'À partir de 790 € HT' }],
          maintenanceItems: ['≈ 1 h de maintenance / mois', 'Hébergement & nom de domaine', 'Mises à jour de sécurité & CMS', 'Sauvegardes hebdomadaires', 'Support prioritaire (délai 48h)', '2 modifications de contenu / mois'],
        },
        {
          name: 'Pack Premium', tagline: 'Solution complète & évolutive, entièrement sur mesure. E-commerce & API.',
          bullets: ['Design et fonctionnalités sur mesure', 'E-commerce complet', 'Intégrations API tierces', 'Performance Core Web Vitals 90+'],
          included: ['Pages illimitées', 'E-commerce complet (catalogue, panier, Stripe)', 'Intégrations API tierces sur-mesure', 'Sécurité avancée', 'Performance Core Web Vitals 90+', 'Reporting & A/B testing', 'Design sur-mesure premium', 'SEO technique avancé + on-page complet', 'GEO inclus (llms.txt, FAQ structurées, entités, suivi des citations IA)', 'Hébergement haute disponibilité inclus', 'Formation équipe + documentation vidéo', 'Support dédié 24/7 (délai 24h)'],
          notIncluded: ['Budget publicitaire (Ads)', 'Community management', 'Production photo / vidéo'],
          options: [{ label: 'Application mobile', price: 'Sur devis' }, { label: 'Intégration ERP / legacy', price: 'Sur devis' }, { label: 'Chatbot IA (FAQ du site, 1 langue)', price: 'Sur devis' }, { label: 'Suivi mensuel SEO + GEO (rapport, 2 contenus)', price: 'Sur devis' }, { label: 'Maintenance évolutive renforcée', price: 'Sur devis' }],
          maintenanceItems: ['Temps alloué et niveau de service définis au devis', 'Hébergement haute disponibilité', 'Mises à jour de sécurité proactives', 'Sauvegardes quotidiennes', 'Monitoring & rapport mensuel', 'Support dédié 24/7 (délai 24h)', 'Modifications illimitées'],
        },
      ],
    },
    seo: {"h2": "SEO, SEO local, GEO : ce que chaque niveau contient", "subtitle": "Le SEO vise à être bien classé sur Google ; le GEO vise à être cité dans les réponses de ChatGPT, Perplexity, Gemini et des AI Overviews. Voici ce qui est inclus dans chaque pack, et ce qui se commande en option.", "levels": [{"name": "SEO de base", "badge": "Inclus dans Starter", "goal": "Rendre le site propre, indexable et lisible par Google. Aucun travail sur les mots-clés.", "items": ["Balises title / meta uniques, hiérarchie Hn", "Sitemap, robots.txt, URLs propres", "Schema.org Organization / LocalBusiness", "Google Search Console + Analytics configurés", "Site rapide et responsive (mobile-first)"], "price": "Inclus"}, {"name": "SEO on-page", "badge": "Inclus dans Business · option Starter", "goal": "Positionner chaque page sur une requête précise et améliorer le contenu existant.", "items": ["Recherche de mots-clés (1 requête principale par page)", "Structure de contenu et optimisation des textes", "Maillage interne et balises images", "Schema.org par page (Service, FAQ, Article)"], "price": "À partir de 590 € HT sur Starter"}, {"name": "SEO local", "badge": "Option Starter / Business", "goal": "Apparaître dans Google Maps et les recherches « près de moi ».", "items": ["Fiche Google Business optimisée et complétée", "Cohérence NAP et inscription sur 10 annuaires", "Stratégie de collecte d'avis", "Pages ville / zone d'intervention"], "price": "À partir de 390 € HT"}, {"name": "SEO technique avancé", "badge": "Inclus dans Premium", "goal": "Garantir performance, indexation et robustesse à grande échelle.", "items": ["Core Web Vitals 90+", "Audit crawl / indexation, redirections", "hreflang et sites multilingues", "Données structurées avancées, monitoring"], "price": "Inclus"}, {"name": "SEO éditorial", "badge": "Option", "goal": "Produire les contenus qui captent le trafic dans la durée.", "items": ["3 articles de 800 mots optimisés (lancement)", "Brief mots-clés, maillage vers les pages offre", "Suivi mensuel : 2 contenus + rapport"], "price": "À partir de 490 € HT · suivi à partir de 290 €/mois"}, {"name": "GEO (Generative Engine Optimization)", "badge": "Inclus dans Premium · option Starter / Business", "goal": "Être cité comme source par les IA génératives : ChatGPT, Perplexity, Gemini, Google AI Overviews.", "items": ["llms.txt et autorisation des robots IA (robots.txt)", "Contenus « réponse d'abord » + FAQ balisées FAQPage", "Entités et sameAs (Organization, auteurs, profils)", "Bing Webmaster + IndexNow (alimente ChatGPT Search)", "Test de citations sur vos requêtes clés"], "price": "À partir de 690 € HT"}], "note": "Le SEO classique mesure des positions ; le GEO mesure des citations dans les réponses IA. Les deux se complètent : un site bien référencé et bien structuré est aussi plus souvent cité. Aucun résultat de classement ou de citation n'est garanti."},
    process: {
      h2: 'Notre méthode en 4 étapes',
      subtitle: 'Du premier brief à la mise en ligne : un processus éprouvé, des livrables clairs à chaque étape.',
      steps: [
        { title: 'Brief & devis', duration: '48h', desc: 'On cerne vos objectifs, votre cible et vos besoins. Vous recevez un devis détaillé et un calendrier clair sous 48h.', bring: 'Vos objectifs et références', bringLabel: 'Vous apportez :' },
        { title: 'Maquettes', duration: '3 à 7 jours', desc: 'Nous concevons les maquettes et les validons avec vous avant d\'écrire la moindre ligne de code.', bring: 'Logo, textes, visuels', bringLabel: 'Vous apportez :' },
        { title: 'Développement', duration: '1 à 6 semaines', desc: 'Nous développons le site en Next.js, intégrons le contenu, le SEO et les fonctionnalités, puis le testons sur tous les écrans.', bring: 'Vos contenus définitifs', bringLabel: 'Vous apportez :' },
        { title: 'Mise en ligne & suivi', duration: '1 jour', desc: 'Déploiement, configuration du domaine et de l\'analytics, puis suivi renforcé les premiers jours. Formation incluse.', bring: '30 min pour la formation', bringLabel: 'Vous apportez :' },
      ],
    },
    testimonials: {
      h2: 'Ce que disent nos clients',
      items: [
        { quote: "Notre nouveau site charge en moins d'une seconde et on est enfin visibles sur Google. En 2 mois, le nombre de demandes de devis a doublé.", name: 'Julien P.', role: 'Gérant', company: 'Artisan, Lille', initials: 'JP', color: 'bg-white/10 text-white' },
        { quote: "La refonte a complètement changé notre image. Le design est superbe, l'espace client adoré par nos équipes. Le trafic organique a bondi de 40 %.", name: 'Camille R.', role: 'Directrice marketing', company: 'PME B2B, Lyon', initials: 'CR', color: 'bg-white/10 text-white' },
        { quote: "Boutique e-commerce livrée en 6 semaines, paiement Stripe nickel, site ultra rapide. Notre taux de conversion a pris 25 % grâce à l'A/B testing.", name: 'Sofia M.', role: 'Fondatrice', company: 'E-commerce, Bordeaux', initials: 'SM', color: 'bg-white/10 text-white' },
      ],
    },
    faq: {
      h2: 'Questions fréquentes',
      items: [
        { q: 'Combien coûte un site web ?', a: "Nos packs démarrent à 1 490 € HT pour une vitrine professionnelle (Pack Starter) et 3 990 € HT pour un site complet avec blog et espace client (Pack Business). Ces prix s'appliquent à des maquettes déjà déterminées, adaptées à votre charte. Le Pack Premium (design sur mesure, e-commerce, intégrations API) est entièrement sur mesure et chiffré sur devis. Les options à la carte (version anglaise, mesure d'audience, administration, SEO…) se chiffrent séparément, et tout travail hors périmètre est facturé 85 € HT de l'heure, toujours après devis écrit. Le devis est gratuit et livré sous 48h." },
        { q: 'En combien de temps mon site sera-t-il en ligne ?', a: "Comptez 2 à 3 semaines pour un Pack Starter, 4 à 6 semaines pour un Pack Business et au moins 6 semaines pour un Pack Premium, selon le périmètre défini au devis. Le délai dépend surtout de la rapidité avec laquelle vous nous fournissez vos contenus (textes, visuels, logo)." },
        { q: 'Pourquoi Next.js plutôt que WordPress ?', a: "Next.js produit des sites bien plus rapides, plus sûrs et mieux référencés que WordPress, sans les plugins à maintenir ni les failles de sécurité. Vous obtenez des scores de performance 90+ et un SEO technique impeccable dès la mise en ligne. Pour un blog très simple sans exigence de performance, WordPress reste possible — on vous conseille selon votre cas." },
        { q: 'Le référencement SEO est-il inclus ?', a: "Oui, à trois niveaux. Le Pack Starter inclut le SEO de base (balises uniques, sitemap, robots.txt, Schema.org, Search Console). Le Pack Business ajoute le SEO on-page complet (mots-clés, structure de contenu, maillage interne). Le Pack Premium ajoute le SEO technique avancé (Core Web Vitals 90+, crawl, hreflang) et le GEO, c'est-à-dire l'optimisation pour être cité par ChatGPT, Perplexity ou Google AI Overviews. SEO local, GEO et contenus éditoriaux se commandent aussi en option sur les autres packs." },
        { q: 'Pourrai-je modifier le site moi-même ?', a: "Oui. Les Packs Business et Premium incluent un CMS léger qui vous permet de modifier vos textes, images et articles de blog sans toucher au code. Vous êtes formé à la livraison. Pour le Pack Starter, les modifications sont incluses dans la maintenance mensuelle." },
        { q: 'Que comprend la maintenance mensuelle ?', a: "L'hébergement, le nom de domaine, les mises à jour de sécurité, les sauvegardes et le support. Selon le pack, elle inclut aussi des modifications de contenu mensuelles et un monitoring. C'est optionnel mais recommandé pour garder un site rapide et sécurisé dans le temps. Le tarif suit le temps alloué et la complexité : à partir de 59 €/mois pour un site statique (environ 0,5 h/mois), à partir de 89 €/mois pour un site avec backend ou CMS (environ 1 h/mois), à partir de 119 €/mois avec comptes, accès privé ou paiement (environ 1,5 h/mois). Au-delà du temps alloué, 85 € HT de l'heure. Seul le Pack Premium (architecture sur mesure) inclut la maintenance offerte pendant 12 mois, puis chiffrée à part, sur devis." },
        { q: 'Proposez-vous des sites e-commerce ?', a: "Oui, avec le Pack Premium : catalogue produits, panier, paiement Stripe sécurisé, gestion des commandes et tunnel de conversion optimisé. On peut aussi intégrer Shopify si vous le préférez. Le devis dépend du nombre de produits et des intégrations souhaitées." },
      ],
    },
    more: {
      h3: 'Pour aller plus loin',
      items: [
        { label: 'WordPress vs Next.js : quel choix en 2026 ?', href: '/blog/nextjs-vs-wordpress-2026' },
        { label: 'Notre expertise Next.js et React (migration WordPress, SEO technique)', href: '/agence-nextjs' },
        { label: 'Comment intégrer l\'IA dans un site web en 2025', href: '/blog/integrer-ia-site-web-2025' },
        { label: 'Ajouter un chatbot IA à votre site', href: '/integration-ia' },
        { label: 'Automatiser vos process métier', href: '/automatisation' },
        { label: 'Développement d\'applications mobiles', href: '/mobile-app-development' },
      ],
    },
    cta: { badge: 'Devis gratuit · Sans engagement', h2: 'Prêt à lancer votre nouveau site ?', p: "Décrivez-nous votre projet et recevez un devis détaillé sous 48h, avec un calendrier clair. Sans engagement, sans jargon technique.", ctaAudit: 'Demander un devis gratuit', ctaBlog: 'Lire : Next.js vs WordPress', ctaBlogHref: '/blog/nextjs-vs-wordpress-2026' },
    detail: { included: 'Inclus', notIncluded: 'Non inclus', options: 'Options disponibles', maintenance: 'Maintenance', choose: 'Choisir', payment: 'Paiement échelonné disponible · 40% à la commande, 30% à la validation, 30% à la livraison' },
    showDetails: 'Voir les détails ↓', hideDetails: 'Masquer les détails ↑',
  },

  en: {
    hero: {
      badge: 'Next.js · React · SEO · Custom design websites',
      h1: 'Websites that',
      h1highlight: 'convert your visitors',
      p: "We build showcase, professional and e-commerce websites in Next.js: fast, SEO-optimised and with custom design. Free quote within 48h, live in a few weeks.",
      ctaAudit: 'Get a free quote',
      ctaPricing: 'See pricing',
    },
    stats: [
      { label: 'PageSpeed score targeted at delivery (mobile)' },
      { label: 'on Google, 14 published client reviews' },
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
        { title: 'Redesign & custom design', desc: 'Custom mockups, consistent visual identity, polished UX: a site that looks like you and converts.', details: ['Mockups validated before dev', 'Brand guidelines and UI components', 'Animations and micro-interactions', 'Accessibility (WCAG) and contrast'], badge: 'On quote' },
        { title: 'Technical & on-page SEO', desc: 'Optimised structure, tags, structured data, sitemap: your site is built to climb Google from launch day.', details: ['Unique title / meta tags per page', 'Schema.org structured data', 'Sitemap & robots.txt', 'Core Web Vitals optimisation'], badge: 'Included' },
        { title: 'E-commerce & payment', desc: 'Complete online stores with catalogue, cart, Stripe payment and order management — ready to sell.', details: ['Product catalogue & variants', 'Secure Stripe payment', 'Order & stock management', 'Optimised conversion funnel'], badge: 'Premium Pack' },
        { title: 'Performance & Core Web Vitals', desc: 'Instant loading, optimised images, 90+ score: a fast site that delights visitors and pleases Google.', details: ['Guaranteed Lighthouse score 90+', 'Image optimisation & lazy-loading', 'Static rendering / Next.js ISR', 'CDN and advanced caching'], badge: 'Guaranteed' },
        { title: 'Hosting & maintenance', desc: "Deployment, hosting, backups and updates: we handle everything so your site stays fast and secure.", details: ['High-availability Vercel hosting', 'Automatic backups', 'Security updates', 'Support and fixes'], badge: 'Monthly subscription' },
      ],
    },
    tools: { label: 'Our tech stack' },
    useCases: {
      h2: 'Use cases by profile',
      subtitle: 'Typical scenarios, with the right pack. For guidance only: results vary with context and are not guaranteed.',
      items: [
        { sector: 'Local tradesperson / Freelancer', context: 'No online presence, quotes requested by phone, invisible on Google.', solution: '8-page responsive showcase site + technical SEO + Google Business profile + contact form.', result: 'Visible on Google Maps · qualified contact requests · fast return on investment', pack: 'Starter Pack' },
        { sector: 'SMB / Local business', context: 'Old non-responsive site, 40% mobile drop-off, no content for search ranking.', solution: 'Redesign on pre-defined mockups adapted to your brand + CMS blog + client area + advanced analytics + on-page SEO.', result: 'Growing organic traffic · less time spent on support · professional image restored', pack: 'Business Pack' },
        { sector: 'Startup / Scale-up', context: 'Limited showcase site, needs e-commerce, integrations and performance to scale.', solution: 'Tailor-made design + e-commerce + API integrations + A/B testing + Core Web Vitals 90+.', result: 'Better conversion through A/B testing · fast site that supports growth and SEO', pack: 'Premium Pack' },
      ],
    },
    packs: {
      h2: 'Our web packages',
      subtitle: 'Transparent pricing, no surprises. VAT not applicable. Starter and Business prices apply to pre-defined mockups; the Premium Pack is fully tailor-made, on quote.',
      popular: 'Most popular',
      ht: 'excl. VAT',
      monthly: '€/month maintenance',
      delivery: 'Delivery',
      custom: 'Tailor-made',
      customNote: 'Priced separately, on quote only',
      customDetail: 'Fully tailor-made pack: design, scope, features and price are defined together in a personalised quote, free and with no commitment, delivered within 48h. Maintenance free for 12 months, then priced separately, on quote.',
      customCta: 'Request a tailor-made quote',
      monthlyFrom: 'from',
      priceFrom: 'From',
      types: ['Static site', 'Backend + CMS', 'Tailor-made architecture'],
      maintenanceFree: 'Maintenance free for 12 months',
      maintenanceAfterFree: 'Then on quote: a tailor-made architecture is priced separately.',
      maintenanceRule: 'The price follows the time allocated and the complexity: static site (≈ 0.5 h/month) from €59 · backend + CMS (≈ 1 h/month) from €89 · accounts, private access or payment (≈ 1.5 h/month) from €119. Beyond the allocated time: €85/h.',
      mockupNote: 'On pre-defined mockups',
      mockupDetail: 'The price of this pack applies to pre-defined mockups (base structure and design set in advance, adapted to your brand). Any custom design is quoted separately: that is the Premium Pack.',
      extras: {
        title: 'Add-on options, available on every pack',
        subtitle: 'Prices excl. VAT, as offered in our quotes. Each option is priced precisely in your quote.',
        items: [
          { label: 'English version', desc: 'Bilingual FR / EN site, both languages declared for search engines.', price: 'From €490 excl. VAT' },
          { label: 'Audience measurement + consent', desc: 'Account, tags, compliant consent banner (refusing is as easy as accepting), events, conversions and dashboard.', price: 'From €490 excl. VAT' },
          { label: 'Administration area (CMS)', desc: 'Adds a CMS to a static site: edit texts and visuals yourself: 2 roles (editor, approver), 3 named accounts, draft / to approve / published statuses, video training and PDF guide.', price: 'From €890 excl. VAT' },
          { label: 'Partner waiting list (backend)', desc: 'Backend development: dedicated form (company, partnership type, budget), database hosted in Europe, one status per request, one-click export.', price: 'From €590 excl. VAT' },
          { label: 'Filterable catalogue', desc: 'Your content (episodes, products, projects) sorted and filterable by category.', price: 'From €990 excl. VAT' },
          { label: 'Branded partner page', desc: 'A page dedicated to a partner or brand, with the compliant “with [brand]” label.', price: 'From €590 excl. VAT (€150 for each additional)' },
          { label: 'Private partner area', desc: 'Offers and figures shared behind access, without publishing them.', price: 'From €1,490 excl. VAT' },
          { label: 'SEO · Launch pack', desc: 'Name and homonym check, domain choice, markup and structured data, brand queries, redirects, Google + AI visibility report at 30 days.', price: 'From €990 excl. VAT' },
          { label: 'SEO · 3-month coaching', desc: 'Pages by use case, editorial plan, press kit, monthly follow-up with 3 Google + AI visibility reports.', price: 'From €2,490 excl. VAT' },
        ],
        hourly: 'Out-of-scope work: €85 excl. VAT per hour, always after a written quote.',
        tools: 'Third-party tools (domain, emailing, analytics, database) are opened in your name: about €80 to €200 per year in the economy version, €400 to €1,000 per year in the comfortable version. Site hosting is included for the first year.',
      },
      items: [
        {
          name: 'Starter Pack', tagline: 'Your showcase on the web, on a customised template. Live in 3 weeks.',
          bullets: ['Customised Next.js template, up to 8 pages', 'Modern responsive design', 'Basic SEO included', '1-year hosting included'],
          included: ['Premium Next.js template customised to you (logo, colours, fonts, content) — up to 8 pages', 'Mobile-first responsive design', 'Basic SEO (unique tags, sitemap, robots.txt, Schema.org, Search Console)', 'Connected contact form', 'Optimised Google Business profile', '1-year hosting included', 'Google Analytics setup', '30-min training + documentation'],
          notIncluded: ['Custom design', 'Blog / CMS', 'Client area', 'E-commerce', 'On-page SEO, local SEO and GEO (optional)'],
          options: [{ label: 'Additional page (template)', price: 'From €190 excl. VAT' }, { label: 'Content writing (per page)', price: 'From €120 excl. VAT' }, { label: 'On-page SEO (keywords, structure, internal links)', price: 'From €590 excl. VAT' }, { label: 'Local SEO (Google Business, directories, reviews)', price: 'From €390 excl. VAT' }, { label: 'GEO — visibility in AI answers (ChatGPT, Perplexity…)', price: 'From €690 excl. VAT' }, { label: 'AI chatbot (site FAQ, 1 language) + €29/month', price: 'From €890 excl. VAT' }],
          maintenanceItems: ['≈ 0.5 h of maintenance / month', 'Hosting & domain name', 'Security updates', 'Monthly backups', 'Email support (72h response)'],
        },
        {
          name: 'Business Pack', tagline: 'Your growth platform. Blog & client area.',
          bullets: ['Site up to 20 pages', 'Pre-defined mockups validated before development', 'Blog + light CMS', 'Integrated client area'],
          included: ['Site up to 20 pages', 'Pre-defined mockups adapted to your brand, validated before development', 'Integrated client area', 'Blog + light CMS', 'Full on-page SEO', 'Advanced analytics & events', 'Forms & conversion funnels', '1-year hosting included', '1h video training + PDF guide', 'Priority email support (48h response)'],
          notIncluded: ['Custom design (Premium Pack)', 'Full e-commerce', 'Complex API integrations', 'A/B testing', '24/7 support'],
          options: [{ label: 'E-commerce module', price: 'From €2,490 excl. VAT' }, { label: 'Additional page (pre-defined mockup)', price: 'From €250 excl. VAT' }, { label: 'Third-party API integration', price: 'From €590 excl. VAT' }, { label: 'Local SEO (Google Business, directories, reviews)', price: 'From €390 excl. VAT' }, { label: '3 SEO blog articles (800 words)', price: 'From €490 excl. VAT' }, { label: 'GEO — visibility in AI answers (ChatGPT, Perplexity…)', price: 'From €690 excl. VAT' }, { label: 'AI chatbot (site FAQ, 1 language) + €29/month', price: 'From €790 excl. VAT' }],
          maintenanceItems: ['≈ 1 h of maintenance / month', 'Hosting & domain name', 'Security & CMS updates', 'Weekly backups', 'Priority support (48h response)', '2 content changes / month'],
        },
        {
          name: 'Premium Pack', tagline: 'Complete & scalable, fully tailor-made solution. E-commerce & APIs.',
          bullets: ['Tailor-made design and features', 'Full e-commerce', 'Third-party API integrations', 'Core Web Vitals 90+ performance'],
          included: ['Unlimited pages', 'Full e-commerce (catalogue, cart, Stripe)', 'Custom third-party API integrations', 'Advanced security', 'Core Web Vitals 90+ performance', 'Reporting & A/B testing', 'Premium custom design', 'Advanced technical SEO + full on-page SEO', 'GEO included (llms.txt, structured FAQs, entities, AI citation tracking)', 'High-availability hosting included', 'Team training + video documentation', 'Dedicated 24/7 support (24h response)'],
          notIncluded: ['Advertising budget (Ads)', 'Community management', 'Photo / video production'],
          options: [{ label: 'Mobile app', price: 'Custom quote' }, { label: 'ERP / legacy integration', price: 'Custom quote' }, { label: 'AI chatbot (site FAQ, 1 language)', price: 'Custom quote' }, { label: 'Monthly SEO + GEO follow-up (report, 2 contents)', price: 'Custom quote' }, { label: 'Enhanced evolutive maintenance', price: 'Custom quote' }],
          maintenanceItems: ['Allocated time and service level defined in the quote', 'High-availability hosting', 'Proactive security updates', 'Daily backups', 'Monitoring & monthly report', 'Dedicated 24/7 support (24h response)', 'Unlimited changes'],
        },
      ],
    },
    seo: {"h2": "SEO, local SEO, GEO: what each level includes", "subtitle": "SEO aims to rank well on Google; GEO aims to get you cited in ChatGPT, Perplexity, Gemini and Google AI Overviews answers. Here is what each pack includes and what can be added as an option.", "levels": [{"name": "Basic SEO", "badge": "Included in Starter", "goal": "Make the site clean, indexable and readable by Google. No keyword work.", "items": ["Unique title / meta tags, Hn hierarchy", "Sitemap, robots.txt, clean URLs", "Schema.org Organization / LocalBusiness", "Google Search Console + Analytics set up", "Fast, mobile-first responsive site"], "price": "Included"}, {"name": "On-page SEO", "badge": "Included in Business · Starter option", "goal": "Target one precise query per page and improve existing content.", "items": ["Keyword research (1 main query per page)", "Content structure and copy optimisation", "Internal linking and image tags", "Per-page Schema.org (Service, FAQ, Article)"], "price": "From €590 excl. VAT on Starter"}, {"name": "Local SEO", "badge": "Starter / Business option", "goal": "Appear in Google Maps and “near me” searches.", "items": ["Optimised, complete Google Business profile", "NAP consistency and 10 directory listings", "Review collection strategy", "City / service-area pages"], "price": "From €390 excl. VAT"}, {"name": "Advanced technical SEO", "badge": "Included in Premium", "goal": "Guarantee performance, indexing and robustness at scale.", "items": ["Core Web Vitals 90+", "Crawl / indexing audit, redirects", "hreflang and multilingual sites", "Advanced structured data, monitoring"], "price": "Included"}, {"name": "Editorial SEO", "badge": "Option", "goal": "Produce the content that captures traffic over time.", "items": ["3 optimised 800-word articles (launch)", "Keyword brief, links to offer pages", "Monthly follow-up: 2 contents + report"], "price": "From €490 excl. VAT · follow-up from €290/month"}, {"name": "GEO (Generative Engine Optimization)", "badge": "Included in Premium · Starter / Business option", "goal": "Be cited as a source by generative AI: ChatGPT, Perplexity, Gemini, Google AI Overviews.", "items": ["llms.txt and AI crawlers allowed (robots.txt)", "Answer-first content + FAQPage-marked FAQs", "Entities and sameAs (Organization, authors, profiles)", "Bing Webmaster + IndexNow (feeds ChatGPT Search)", "Citation test on your key queries"], "price": "From €690 excl. VAT"}], "note": "Classic SEO measures rankings; GEO measures citations in AI answers. They complement each other: a well-ranked, well-structured site is also cited more often. No ranking or citation result is guaranteed."},
    process: {
      h2: 'Our 4-step process',
      subtitle: 'From the first brief to go-live: a proven process with clear deliverables at every stage.',
      steps: [
        { title: 'Brief & quote', duration: '48h', desc: 'We pin down your goals, audience and needs. You receive a detailed quote and clear timeline within 48h.', bring: 'Your goals and references', bringLabel: 'You bring:' },
        { title: 'Mockups', duration: '3 to 7 days', desc: 'We design the mockups and validate them with you before writing a single line of code.', bring: 'Logo, copy, visuals', bringLabel: 'You bring:' },
        { title: 'Development', duration: '1 to 6 weeks', desc: 'We build the site in Next.js, integrate content, SEO and features, then test it on every screen.', bring: 'Your final content', bringLabel: 'You bring:' },
        { title: 'Go live & follow-up', duration: '1 day', desc: 'Deployment, domain and analytics setup, then enhanced follow-up the first days. Training included.', bring: '30 min for training', bringLabel: 'You bring:' },
      ],
    },
    testimonials: {
      h2: 'What our clients say',
      items: [
        { quote: "Our new site loads in under a second and we're finally visible on Google. Within 2 months, quote requests doubled.", name: 'Julien P.', role: 'Owner', company: 'Tradesperson, Lille', initials: 'JP', color: 'bg-white/10 text-white' },
        { quote: "The redesign completely changed our image. The design is gorgeous, the client area loved by our teams. Organic traffic jumped 40%.", name: 'Camille R.', role: 'Marketing Director', company: 'B2B SMB, Lyon', initials: 'CR', color: 'bg-white/10 text-white' },
        { quote: "E-commerce store delivered in 6 weeks, flawless Stripe payment, ultra-fast site. Our conversion rate gained 25% thanks to A/B testing.", name: 'Sofia M.', role: 'Founder', company: 'E-commerce, Bordeaux', initials: 'SM', color: 'bg-white/10 text-white' },
      ],
    },
    faq: {
      h2: 'Frequently asked questions',
      items: [
        { q: 'How much does a website cost?', a: "Our packs start at €1,490 excl. VAT for a professional showcase site (Starter Pack) and €3,990 excl. VAT for a full site with blog and client area (Business Pack). These prices apply to pre-defined mockups adapted to your brand. The Premium Pack (custom design, e-commerce, API integrations) is fully tailor-made and priced on quote. Add-on options (English version, audience measurement, administration, SEO…) are priced separately, and any out-of-scope work is billed at €85 excl. VAT per hour, always after a written quote. The quote is free and delivered within 48h." },
        { q: 'How long until my site is live?', a: "Allow 2 to 3 weeks for a Starter Pack, 4 to 6 weeks for a Business Pack and at least 6 weeks for a Premium Pack, depending on the scope defined in the quote. The timeline mostly depends on how quickly you provide your content (copy, visuals, logo)." },
        { q: 'Why Next.js rather than WordPress?', a: "Next.js produces much faster, safer and better-ranked sites than WordPress, without plugins to maintain or security holes. You get 90+ performance scores and impeccable technical SEO from launch. For a very simple blog with no performance requirement, WordPress is still possible — we advise based on your case." },
        { q: 'Is SEO included?', a: "Yes, at three levels. The Starter Pack includes basic SEO (unique tags, sitemap, robots.txt, Schema.org, Search Console). The Business Pack adds full on-page SEO (keywords, content structure, internal linking). The Premium Pack adds advanced technical SEO (Core Web Vitals 90+, crawl, hreflang) and GEO, i.e. optimisation to be cited by ChatGPT, Perplexity or Google AI Overviews. Local SEO, GEO and editorial content can also be added as options to the other packs." },
        { q: 'Will I be able to edit the site myself?', a: "Yes. The Business and Premium packs include a light CMS that lets you edit your copy, images and blog posts without touching code. You're trained at delivery. For the Starter Pack, changes are included in the monthly maintenance." },
        { q: 'What does monthly maintenance include?', a: "Hosting, domain name, security updates, backups and support. Depending on the pack, it also includes monthly content changes and monitoring. It's optional but recommended to keep a fast, secure site over time. Pricing follows the time allocated and the complexity: from €59/month for a static site (about 0.5 h/month), from €89/month for a site with a backend or CMS (about 1 h/month), from €119/month with accounts, private access or payment (about 1.5 h/month). Beyond the allocated time, €85 excl. VAT per hour. Only the Premium Pack (tailor-made architecture) includes 12 months of free maintenance, then priced separately, on quote." },
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
    cta: { badge: 'Free quote · No commitment', h2: 'Ready to launch your new site?', p: "Tell us about your project and get a detailed quote within 48h, with a clear timeline. No commitment, no technical jargon.", ctaAudit: 'Get a free quote', ctaBlog: 'Read: Next.js vs WordPress', ctaBlogHref: '/blog/nextjs-vs-wordpress-2026' },
    detail: { included: 'Included', notIncluded: 'Not included', options: 'Available options', maintenance: 'Maintenance', choose: 'Choose', payment: 'Staged payment available · 40% on order, 30% on validation, 30% on delivery' },
    showDetails: 'Show details ↓', hideDetails: 'Hide details ↑',
  },

  es: {
    hero: {
      badge: 'Webs Next.js · React · SEO · Diseño a medida',
      h1: 'Sitios web que',
      h1highlight: 'convierten a tus visitantes',
      p: "Diseñamos sitios vitrina, profesionales y e-commerce en Next.js: rápidos, optimizados para SEO y con diseño a medida. Presupuesto gratis en 48h, online en pocas semanas.",
      ctaAudit: 'Solicitar presupuesto gratis',
      ctaPricing: 'Ver precios',
    },
    stats: [
      { label: 'puntuación PageSpeed objetivo en la entrega (móvil)' },
      { label: 'en Google, 14 reseñas de clientes publicadas' },
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
        { title: 'Rediseño y diseño a medida', desc: 'Maquetas a medida, identidad visual coherente, experiencia de usuario cuidada: una web que te representa y convierte.', details: ['Maquetas validadas antes del desarrollo', 'Guía de estilo y componentes UI', 'Animaciones y microinteracciones', 'Accesibilidad (WCAG) y contrastes'], badge: 'Con presupuesto' },
        { title: 'SEO técnico y on-page', desc: 'Estructura optimizada, etiquetas, datos estructurados, sitemap: tu web está hecha para subir en Google desde el primer día.', details: ['Etiquetas title / meta únicas por página', 'Datos estructurados Schema.org', 'Sitemap y robots.txt', 'Optimización Core Web Vitals'], badge: 'Incluido' },
        { title: 'E-commerce y pago', desc: 'Tiendas online completas con catálogo, carrito, pago Stripe y gestión de pedidos — listas para vender.', details: ['Catálogo de productos y variantes', 'Pago Stripe seguro', 'Gestión de pedidos y stock', 'Embudo de conversión optimizado'], badge: 'Pack Premium' },
        { title: 'Rendimiento y Core Web Vitals', desc: 'Carga instantánea, imágenes optimizadas, objetivo de puntuación 90+: una web rápida que encanta a tus visitantes y gusta a Google.', details: ['Puntuación Lighthouse 90+ garantizada', 'Optimización de imágenes y lazy-loading', 'Renderizado estático / ISR Next.js', 'CDN y caché avanzada'], badge: 'Garantizado' },
        { title: 'Alojamiento y mantenimiento', desc: "Despliegue, alojamiento, copias de seguridad y actualizaciones: nos ocupamos de todo para que tu web siga rápida y segura.", details: ['Alojamiento Vercel de alta disponibilidad', 'Copias de seguridad automáticas', 'Actualizaciones de seguridad', 'Soporte y correcciones'], badge: 'Suscripción mensual' },
      ],
    },
    tools: { label: 'Nuestro stack técnico' },
    useCases: {
      h2: 'Casos de uso por perfil',
      subtitle: 'Escenarios tipo, con el pack adecuado. A título orientativo: los resultados varían según el contexto y no están garantizados.',
      items: [
        { sector: 'Autónomo / Profesional local', context: 'Sin presencia online, presupuestos pedidos por teléfono, invisible en Google.', solution: 'Web vitrina de 8 páginas responsive + SEO técnico + ficha Google Business + formulario de contacto.', result: 'Visible en Google Maps · solicitudes de contacto cualificadas · retorno de la inversión rápido', pack: 'Pack Starter' },
        { sector: 'Pyme / Comercio local', context: 'Web antigua no responsive, 40 % de abandonos en móvil, sin contenido para posicionar.', solution: 'Rediseño sobre maquetas predefinidas adaptadas a tu identidad + blog CMS + área de cliente + analytics avanzados + SEO on-page.', result: 'Más tráfico orgánico · menos tiempo dedicado a soporte · imagen profesional recuperada', pack: 'Pack Business' },
        { sector: 'Startup / Scale-up', context: 'Web vitrina limitada, necesita e-commerce, integraciones y rendimiento para escalar.', solution: 'Diseño a medida + e-commerce + integraciones API + A/B testing + Core Web Vitals 90+.', result: 'Mejor conversión gracias a las pruebas A/B · web rápida que impulsa el crecimiento y el SEO', pack: 'Pack Premium' },
      ],
    },
    packs: {
      h2: 'Nuestros packs web',
      subtitle: 'Precios transparentes, sin sorpresas. IVA no incluido. Los precios Starter y Business se aplican a maquetas ya determinadas; el Pack Premium es totalmente a medida, con presupuesto.',
      popular: 'El más popular',
      ht: 's/IVA',
      monthly: '€/mes mantenimiento',
      delivery: 'Plazo',
      custom: 'A medida',
      customNote: 'Precio aparte, solo con presupuesto',
      customDetail: 'Pack totalmente a medida: diseño, alcance, funcionalidades y precio se definen juntos en un presupuesto personalizado, gratuito y sin compromiso, entregado en 48 h. Mantenimiento gratuito durante 12 meses, después presupuestado aparte.',
      customCta: 'Pedir un presupuesto a medida',
      monthlyFrom: 'desde',
      priceFrom: 'Desde',
      types: ['Sitio estático', 'Backend + CMS', 'Arquitectura a medida'],
      maintenanceFree: 'Mantenimiento gratuito 12 meses',
      maintenanceAfterFree: 'Después con presupuesto: una arquitectura a medida se presupuesta aparte.',
      maintenanceRule: 'El precio sigue el tiempo asignado y la complejidad: sitio estático (≈ 0,5 h/mes) desde 59 € · backend + CMS (≈ 1 h/mes) desde 89 € · cuentas, acceso privado o pago (≈ 1,5 h/mes) desde 119 €. Más allá del tiempo asignado: 85 €/h.',
      mockupNote: 'Sobre maquetas predefinidas',
      mockupDetail: 'El precio de este pack se aplica a maquetas ya determinadas (estructura y diseño base definidos de antemano, adaptados a tu identidad). Cualquier diseño a medida se presupuesta aparte: es el Pack Premium.',
      extras: {
        title: 'Opciones a la carta, disponibles en todos los packs',
        subtitle: 'Precios sin IVA, tal como se proponen en nuestros presupuestos. Cada opción se calcula con precisión en tu presupuesto.',
        items: [
          { label: 'Versión en inglés', desc: 'Sitio bilingüe FR / EN, ambos idiomas declarados para el posicionamiento.', price: 'Desde 490 € s/IVA' },
          { label: 'Medición de audiencia + consentimiento', desc: 'Cuenta, etiquetas, banner de consentimiento conforme (rechazar es tan sencillo como aceptar), eventos, conversiones y panel de control.', price: 'Desde 490 € s/IVA' },
          { label: 'Espacio de administración (CMS)', desc: 'Añade un CMS a un sitio estático: modifica textos e imágenes tú mismo: 2 roles (editor, validador), 3 cuentas nominativas, estados borrador / por validar / publicado, formación por videollamada y guía PDF.', price: 'Desde 890 € s/IVA' },
          { label: 'Lista de espera de socios (backend)', desc: 'Desarrollo backend: formulario específico (empresa, tipo de colaboración, presupuesto), base de datos en Europa, un estado por solicitud, exportación en un clic.', price: 'Desde 590 € s/IVA' },
          { label: 'Catálogo filtrable', desc: 'Tus contenidos (episodios, productos, proyectos) clasificados y filtrables por categoría.', price: 'Desde 990 € s/IVA' },
          { label: 'Página de marca personalizada', desc: 'Página dedicada a un socio o a una marca, con la mención conforme « con [marca] ».', price: 'Desde 590 € s/IVA (150 € la siguiente)' },
          { label: 'Espacio privado de socios', desc: 'Ofertas y cifras compartidas con acceso restringido, sin publicarlas.', price: 'Desde 1.490 € s/IVA' },
          { label: 'SEO · Pack de lanzamiento', desc: 'Control del nombre y homónimos, elección del dominio, marcado y datos estructurados, búsquedas de marca, redirecciones, informe de visibilidad Google + IA a 30 días.', price: 'Desde 990 € s/IVA' },
          { label: 'SEO · Acompañamiento 3 meses', desc: 'Páginas por uso, plan editorial, kit de prensa, seguimiento mensual con 3 informes de visibilidad Google + IA.', price: 'Desde 2.490 € s/IVA' },
        ],
        hourly: 'Trabajo fuera de alcance: 85 € s/IVA por hora, siempre tras presupuesto por escrito.',
        tools: 'Las herramientas de terceros (dominio, emailing, medición de audiencia, base de datos) se abren a tu nombre: unos 80 a 200 € al año en versión económica, 400 a 1.000 € al año en versión cómoda. El alojamiento del sitio está incluido el primer año.',
      },
      items: [
        {
          name: 'Pack Starter', tagline: 'Tu vitrina en la web, sobre plantilla personalizada. Online en 3 semanas.',
          bullets: ['Plantilla Next.js personalizada, hasta 8 páginas', 'Diseño responsive moderno', 'SEO básico incluido', 'Alojamiento 1 año incluido'],
          included: ['Plantilla Next.js premium personalizada (logo, colores, tipografías, contenidos) — hasta 8 páginas', 'Diseño responsive mobile-first', 'SEO básico (etiquetas únicas, sitemap, robots.txt, Schema.org, Search Console)', 'Formulario de contacto conectado', 'Ficha Google Business optimizada', 'Alojamiento 1 año incluido', 'Google Analytics configurado', 'Formación 30 min + documentación'],
          notIncluded: ['Diseño a medida', 'Blog / CMS', 'Área de cliente', 'E-commerce', 'SEO on-page, SEO local y GEO (opcionales)'],
          options: [{ label: 'Página adicional (plantilla)', price: 'Desde 190 € s/IVA' }, { label: 'Redacción de contenido (por página)', price: 'Desde 120 € s/IVA' }, { label: 'SEO on-page (palabras clave, estructura, enlazado)', price: 'Desde 590 € s/IVA' }, { label: 'SEO local (Google Business, directorios, reseñas)', price: 'Desde 390 € s/IVA' }, { label: 'GEO — visibilidad en las IA (ChatGPT, Perplexity…)', price: 'Desde 690 € s/IVA' }, { label: 'Chatbot IA (FAQ del sitio, 1 idioma) + 29 €/mes', price: 'Desde 890 € s/IVA' }],
          maintenanceItems: ['≈ 0,5 h de mantenimiento / mes', 'Alojamiento y nombre de dominio', 'Actualizaciones de seguridad', 'Copias de seguridad mensuales', 'Soporte por email (72h de respuesta)'],
        },
        {
          name: 'Pack Business', tagline: 'Tu plataforma de crecimiento. Blog y área de cliente.',
          bullets: ['Sitio hasta 20 páginas', 'Maquetas predefinidas validadas antes del desarrollo', 'Blog + CMS ligero', 'Área de cliente integrada'],
          included: ['Sitio hasta 20 páginas', 'Maquetas predefinidas adaptadas a tu identidad, validadas antes del desarrollo', 'Área de cliente integrada', 'Blog + CMS ligero', 'SEO on-page completo', 'Analytics avanzados y eventos', 'Formularios y embudos de conversión', 'Alojamiento 1 año incluido', 'Formación 1h por videollamada + guía PDF', 'Soporte prioritario por email (48h de respuesta)'],
          notIncluded: ['Diseño a medida (Pack Premium)', 'E-commerce completo', 'Integraciones API complejas', 'A/B testing', 'Soporte 24/7'],
          options: [{ label: 'Módulo e-commerce', price: 'Desde 2.490 € s/IVA' }, { label: 'Página adicional (maqueta predefinida)', price: 'Desde 250 € s/IVA' }, { label: 'Integración API externa', price: 'Desde 590 € s/IVA' }, { label: 'SEO local (Google Business, directorios, reseñas)', price: 'Desde 390 € s/IVA' }, { label: '3 artículos de blog SEO (800 palabras)', price: 'Desde 490 € s/IVA' }, { label: 'GEO — visibilidad en las IA (ChatGPT, Perplexity…)', price: 'Desde 690 € s/IVA' }, { label: 'Chatbot IA (FAQ del sitio, 1 idioma) + 29 €/mes', price: 'Desde 790 € s/IVA' }],
          maintenanceItems: ['≈ 1 h de mantenimiento / mes', 'Alojamiento y nombre de dominio', 'Actualizaciones de seguridad y CMS', 'Copias de seguridad semanales', 'Soporte prioritario (48h de respuesta)', '2 modificaciones de contenido / mes'],
        },
        {
          name: 'Pack Premium', tagline: 'Solución completa y escalable, totalmente a medida. E-commerce y APIs.',
          bullets: ['Diseño y funcionalidades a medida', 'E-commerce completo', 'Integraciones API externas', 'Rendimiento Core Web Vitals 90+'],
          included: ['Páginas ilimitadas', 'E-commerce completo (catálogo, carrito, Stripe)', 'Integraciones API externas a medida', 'Seguridad avanzada', 'Rendimiento Core Web Vitals 90+', 'Reporting y A/B testing', 'Diseño a medida premium', 'SEO técnico avanzado + on-page completo', 'GEO incluido (llms.txt, FAQ estructuradas, entidades, seguimiento de citas en IA)', 'Alojamiento de alta disponibilidad incluido', 'Formación del equipo + documentación en vídeo', 'Soporte dedicado 24/7 (24h de respuesta)'],
          notIncluded: ['Presupuesto publicitario (Ads)', 'Community management', 'Producción foto / vídeo'],
          options: [{ label: 'Aplicación móvil', price: 'Presupuesto a medida' }, { label: 'Integración ERP / legacy', price: 'Presupuesto a medida' }, { label: 'Chatbot IA (FAQ del sitio, 1 idioma)', price: 'Presupuesto a medida' }, { label: 'Seguimiento mensual SEO + GEO (informe, 2 contenidos)', price: 'Presupuesto a medida' }, { label: 'Mantenimiento evolutivo reforzado', price: 'Presupuesto a medida' }],
          maintenanceItems: ['Tiempo asignado y nivel de servicio definidos en el presupuesto', 'Alojamiento de alta disponibilidad', 'Actualizaciones de seguridad proactivas', 'Copias de seguridad diarias', 'Monitorización e informe mensual', 'Soporte dedicado 24/7 (24h de respuesta)', 'Modificaciones ilimitadas'],
        },
      ],
    },
    seo: {"h2": "SEO, SEO local, GEO: qué incluye cada nivel", "subtitle": "El SEO busca posicionarte en Google; el GEO busca que te citen en las respuestas de ChatGPT, Perplexity, Gemini y los AI Overviews de Google. Esto incluye cada pack y lo que se puede añadir como opción.", "levels": [{"name": "SEO básico", "badge": "Incluido en Starter", "goal": "Dejar el sitio limpio, indexable y legible para Google. Sin trabajo de palabras clave.", "items": ["Etiquetas title / meta únicas, jerarquía Hn", "Sitemap, robots.txt, URLs limpias", "Schema.org Organization / LocalBusiness", "Google Search Console + Analytics configurados", "Sitio rápido y responsive (mobile-first)"], "price": "Incluido"}, {"name": "SEO on-page", "badge": "Incluido en Business · opción Starter", "goal": "Posicionar cada página en una consulta precisa y mejorar el contenido existente.", "items": ["Investigación de palabras clave (1 consulta principal por página)", "Estructura de contenido y optimización de textos", "Enlazado interno y etiquetas de imágenes", "Schema.org por página (Service, FAQ, Article)"], "price": "Desde 590 € s/IVA en Starter"}, {"name": "SEO local", "badge": "Opción Starter / Business", "goal": "Aparecer en Google Maps y en las búsquedas « cerca de mí ».", "items": ["Ficha Google Business optimizada y completa", "Coherencia NAP y alta en 10 directorios", "Estrategia de captación de reseñas", "Páginas de ciudad / zona de actuación"], "price": "Desde 390 € s/IVA"}, {"name": "SEO técnico avanzado", "badge": "Incluido en Premium", "goal": "Garantizar rendimiento, indexación y robustez a gran escala.", "items": ["Core Web Vitals 90+", "Auditoría de rastreo / indexación, redirecciones", "hreflang y sitios multilingües", "Datos estructurados avanzados, monitorización"], "price": "Incluido"}, {"name": "SEO editorial", "badge": "Opción", "goal": "Producir los contenidos que captan tráfico a largo plazo.", "items": ["3 artículos de 800 palabras optimizados (lanzamiento)", "Brief de palabras clave, enlaces a páginas de oferta", "Seguimiento mensual: 2 contenidos + informe"], "price": "Desde 490 € s/IVA · seguimiento desde 290 €/mes"}, {"name": "GEO (Generative Engine Optimization)", "badge": "Incluido en Premium · opción Starter / Business", "goal": "Ser citado como fuente por las IA generativas: ChatGPT, Perplexity, Gemini, Google AI Overviews.", "items": ["llms.txt y robots de IA permitidos (robots.txt)", "Contenidos « respuesta primero » + FAQ con FAQPage", "Entidades y sameAs (Organization, autores, perfiles)", "Bing Webmaster + IndexNow (alimenta ChatGPT Search)", "Prueba de citas en tus consultas clave"], "price": "Desde 690 € s/IVA"}], "note": "El SEO clásico mide posiciones; el GEO mide citas en las respuestas de IA. Se complementan: un sitio bien posicionado y bien estructurado también se cita más. No se garantiza ningún resultado de posicionamiento ni de citas."},
    process: {
      h2: 'Nuestro proceso en 4 pasos',
      subtitle: 'Desde el primer brief hasta la puesta online: un proceso probado con entregables claros en cada etapa.',
      steps: [
        { title: 'Brief y presupuesto', duration: '48h', desc: 'Definimos tus objetivos, tu público y tus necesidades. Recibes un presupuesto detallado y un calendario claro en 48h.', bring: 'Tus objetivos y referencias', bringLabel: 'Tú aportas:' },
        { title: 'Maquetas', duration: '3 a 7 días', desc: 'Diseñamos las maquetas y las validamos contigo antes de escribir una sola línea de código.', bring: 'Logo, textos, imágenes', bringLabel: 'Tú aportas:' },
        { title: 'Desarrollo', duration: '1 a 6 semanas', desc: 'Construimos el sitio en Next.js, integramos el contenido, el SEO y las funcionalidades, y lo probamos en todas las pantallas.', bring: 'Tus contenidos definitivos', bringLabel: 'Tú aportas:' },
        { title: 'Puesta online y seguimiento', duration: '1 día', desc: 'Despliegue, configuración del dominio y la analítica, y seguimiento reforzado los primeros días. Formación incluida.', bring: '30 min para la formación', bringLabel: 'Tú aportas:' },
      ],
    },
    testimonials: {
      h2: 'Lo que dicen nuestros clientes',
      items: [
        { quote: "Nuestra nueva web carga en menos de un segundo y por fin somos visibles en Google. En 2 meses, las solicitudes de presupuesto se duplicaron.", name: 'Julien P.', role: 'Gerente', company: 'Autónomo, Lille', initials: 'JP', color: 'bg-white/10 text-white' },
        { quote: "El rediseño cambió por completo nuestra imagen. El diseño es precioso, el área de cliente encantó a nuestros equipos. El tráfico orgánico subió un 40 %.", name: 'Camille R.', role: 'Directora de marketing', company: 'Pyme B2B, Lyon', initials: 'CR', color: 'bg-white/10 text-white' },
        { quote: "Tienda e-commerce entregada en 6 semanas, pago Stripe impecable, web ultrarrápida. Nuestra tasa de conversión ganó un 25 % gracias al A/B testing.", name: 'Sofia M.', role: 'Fundadora', company: 'E-commerce, Burdeos', initials: 'SM', color: 'bg-white/10 text-white' },
      ],
    },
    faq: {
      h2: 'Preguntas frecuentes',
      items: [
        { q: '¿Cuánto cuesta un sitio web?', a: "Nuestros packs empiezan en 1.490 € s/IVA para una vitrina profesional (Pack Starter) y 3.990 € s/IVA para un sitio completo con blog y área de cliente (Pack Business). Estos precios se aplican a maquetas ya determinadas, adaptadas a tu identidad. El Pack Premium (diseño a medida, e-commerce, integraciones API) es totalmente a medida y se presupuesta. Las opciones a la carta (versión en inglés, medición de audiencia, administración, SEO…) se calculan aparte, y cualquier trabajo fuera de alcance se factura a 85 € s/IVA la hora, siempre tras presupuesto por escrito. El presupuesto es gratis y se entrega en 48h." },
        { q: '¿En cuánto tiempo estará online mi sitio?', a: "Cuenta 2 a 3 semanas para un Pack Starter, 4 a 6 semanas para un Pack Business y al menos 6 semanas para un Pack Premium, según el alcance definido en el presupuesto. El plazo depende sobre todo de la rapidez con que nos facilites tus contenidos (textos, imágenes, logo)." },
        { q: '¿Por qué Next.js en lugar de WordPress?', a: "Next.js produce sitios mucho más rápidos, seguros y mejor posicionados que WordPress, sin plugins que mantener ni fallos de seguridad. Obtienes puntuaciones de rendimiento 90+ y un SEO técnico impecable desde el lanzamiento. Para un blog muy simple sin exigencia de rendimiento, WordPress sigue siendo posible — te asesoramos según tu caso." },
        { q: '¿El SEO está incluido?', a: "Sí, en tres niveles. El Pack Starter incluye SEO básico (etiquetas únicas, sitemap, robots.txt, Schema.org, Search Console). El Pack Business añade el SEO on-page completo (palabras clave, estructura de contenido, enlazado interno). El Pack Premium añade SEO técnico avanzado (Core Web Vitals 90+, rastreo, hreflang) y GEO, es decir, la optimización para que te citen ChatGPT, Perplexity o Google AI Overviews. El SEO local, el GEO y los contenidos editoriales también se pueden añadir como opción a los otros packs." },
        { q: '¿Podré modificar el sitio yo mismo?', a: "Sí. Los packs Business y Premium incluyen un CMS ligero que te permite modificar tus textos, imágenes y artículos de blog sin tocar el código. Recibes formación en la entrega. Para el Pack Starter, las modificaciones están incluidas en el mantenimiento mensual." },
        { q: '¿Qué incluye el mantenimiento mensual?', a: "El alojamiento, el nombre de dominio, las actualizaciones de seguridad, las copias de seguridad y el soporte. Según el pack, también incluye modificaciones de contenido mensuales y monitorización. Es opcional pero recomendable para mantener un sitio rápido y seguro en el tiempo. La tarifa sigue el tiempo asignado y la complejidad: desde 59 €/mes para un sitio estático (unas 0,5 h/mes), desde 89 €/mes para un sitio con backend o CMS (unas 1 h/mes), desde 119 €/mes con cuentas, acceso privado o pago (unas 1,5 h/mes). Más allá del tiempo asignado, 85 € s/IVA la hora. Solo el Pack Premium (arquitectura a medida) incluye mantenimiento gratuito durante 12 meses y después se presupuesta aparte." },
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
    cta: { badge: 'Presupuesto gratis · Sin compromiso', h2: '¿Listo para lanzar tu nuevo sitio?', p: "Cuéntanos tu proyecto y recibe un presupuesto detallado en 48h, con un calendario claro. Sin compromiso, sin jerga técnica.", ctaAudit: 'Solicitar presupuesto gratis', ctaBlog: 'Leer: Next.js vs WordPress', ctaBlogHref: '/blog/nextjs-vs-wordpress-2026' },
    detail: { included: 'Incluido', notIncluded: 'No incluido', options: 'Opciones disponibles', maintenance: 'Mantenimiento', choose: 'Elegir', payment: 'Pago fraccionado disponible · 40% al pedido, 30% a la validación, 30% a la entrega' },
    showDetails: 'Ver detalles ↓', hideDetails: 'Ocultar detalles ↑',
  },
  // vi — mode devis intégral (cf. Stage C du plan vi) : aucun montant EUR affiché.
  // L'offre d'appel à prix fixe (Landing Page Express, 1.290.000 VND) vit dans son
  // encart dédié de `components/services/services-pricing.tsx`, pas ici.
  vi: {
    hero: {
      badge: 'Website Next.js · React · SEO · Thiết kế riêng',
      h1: 'Website giúp bạn',
      h1highlight: 'biến người xem thành khách hàng',
      p: 'Chúng tôi thiết kế website giới thiệu, website doanh nghiệp và thương mại điện tử bằng Next.js: tải nhanh, chuẩn SEO và thiết kế riêng. Báo giá miễn phí trong 48 giờ, làm việc được bằng tiếng Việt, tiếng Anh và tiếng Pháp.',
      ctaAudit: 'Nhận báo giá miễn phí',
      ctaPricing: 'Xem các gói dịch vụ',
    },
    stats: [
      { label: 'điểm PageSpeed mục tiêu khi bàn giao (di động)' },
      { label: 'trên Google, 14 đánh giá của khách hàng' },
      { label: 'để nhận báo giá riêng của bạn' },
    ],
    problems: {
      h2: 'Website đang kìm chân bạn?',
      subtitle: 'Một website chậm hoặc lỗi thời khiến <strong>53% người dùng điện thoại rời đi</strong> trước cả khi họ kịp xem bạn bán gì.',
      items: [
        { title: 'Website tải chậm và hiển thị lỗi trên điện thoại', text: 'Chờ mãi mới tải xong, bố cục vỡ trên màn hình nhỏ: ở Việt Nam phần lớn khách vào website bằng điện thoại, mỗi giây chậm là mất khách và tụt hạng trên Google.' },
        { title: 'Bạn không xuất hiện trên Google', text: 'Không có cấu trúc SEO, nội dung chưa tối ưu, thiếu thẻ mô tả: khách tìm thấy đối thủ chứ không tìm thấy bạn.' },
        { title: 'Giao diện cũ khiến khách thiếu tin tưởng', text: 'Một website lỗi thời gửi đi tín hiệu xấu. Khách đánh giá mức độ chuyên nghiệp của bạn trong vài giây — thường là trước khi họ kịp đọc.' },
        { title: 'Không chuyển đổi được và cũng không đo được', text: 'Không có biểu mẫu hiệu quả, không có nút liên hệ rõ ràng, không gắn công cụ đo lường: bạn không biết khách đến từ đâu và vì sao họ rời đi.' },
      ],
    },
    services: {
      h2: 'Những gì chúng tôi xây dựng cho bạn',
      subtitle: 'Từ website giới thiệu đến thương mại điện tử theo yêu cầu riêng, chúng tôi lo trọn chuỗi: thiết kế, lập trình, SEO và hiệu năng.',
      items: [
        { title: 'Website giới thiệu & website doanh nghiệp', desc: 'Website Next.js nhanh và đẹp để giới thiệu hoạt động của bạn, thu hút khách hàng và tạo niềm tin ngay từ giây đầu tiên.', details: ['Tối đa 8 hoặc 20 trang tuỳ theo gói', 'Thiết kế ưu tiên điện thoại', 'Biểu mẫu liên hệ đã kết nối sẵn', 'Tối ưu hồ sơ Google Business'], badge: 'Theo báo giá' },
        { title: 'Làm lại website & thiết kế riêng', desc: 'Bản thiết kế riêng, bộ nhận diện nhất quán, trải nghiệm người dùng được chăm chút: một website đúng chất bạn và biết chuyển đổi.', details: ['Duyệt bản thiết kế trước khi lập trình', 'Bộ nhận diện và thư viện giao diện', 'Hiệu ứng và tương tác nhỏ', 'Khả năng tiếp cận (WCAG) và độ tương phản'], badge: 'Theo báo giá' },
        { title: 'SEO kỹ thuật & SEO on-page', desc: 'Cấu trúc tối ưu, thẻ mô tả, dữ liệu có cấu trúc, sitemap: website được thiết kế để lên hạng Google ngay từ lúc ra mắt.', details: ['Thẻ tiêu đề / mô tả riêng cho từng trang', 'Dữ liệu có cấu trúc Schema.org', 'Sitemap & robots.txt', 'Tối ưu Core Web Vitals'], badge: 'Đã bao gồm' },
        { title: 'Thương mại điện tử & thanh toán', desc: 'Cửa hàng trực tuyến đầy đủ với danh mục, giỏ hàng, thanh toán và quản lý đơn hàng — sẵn sàng bán.', details: ['Danh mục sản phẩm & phân loại', 'Thanh toán an toàn (Stripe hoặc cổng thanh toán nội địa)', 'Quản lý đơn hàng & tồn kho', 'Luồng mua hàng được tối ưu'], badge: 'Gói Premium' },
        { title: 'Hiệu năng & Core Web Vitals', desc: 'Tải gần như tức thì, hình ảnh được tối ưu, điểm 90+: một website nhanh làm hài lòng khách và được Google ưu ái.', details: ['Cam kết điểm Lighthouse 90+', 'Tối ưu hình ảnh & tải theo nhu cầu', 'Kết xuất tĩnh / ISR của Next.js', 'CDN và bộ nhớ đệm nâng cao'], badge: 'Cam kết' },
        { title: 'Hosting & bảo trì', desc: 'Triển khai, hosting, sao lưu và cập nhật: chúng tôi lo hết để website của bạn luôn nhanh và an toàn.', details: ['Hosting Vercel độ sẵn sàng cao', 'Sao lưu tự động', 'Cập nhật bảo mật', 'Hỗ trợ và sửa lỗi'], badge: 'Thuê bao hằng tháng' },
      ],
    },
    tools: { label: 'Công nghệ chúng tôi sử dụng' },
    useCases: {
      h2: 'Tình huống thực tế theo từng mô hình',
      subtitle: 'Các kịch bản mẫu, với gói phù hợp. Chỉ mang tính tham khảo: kết quả thay đổi theo từng trường hợp và không được cam kết.',
      items: [
        { sector: 'Hộ kinh doanh cá thể / cửa hàng địa phương', context: 'Chưa có website, khách chỉ biết qua truyền miệng, thông tin nằm rải rác trên Facebook và Zalo.', solution: 'Website giới thiệu tối đa 8 trang + SEO kỹ thuật + hồ sơ Google Business + biểu mẫu liên hệ. Nếu bạn chỉ cần một trang duy nhất, hãy xem gói Landing Page Express.', result: 'Xuất hiện trên Google Maps · khách chủ động liên hệ · chi phí thu hồi nhanh', pack: 'Gói Starter' },
        { sector: 'Khách sạn / nhà hàng tại Hà Nội', context: 'Phụ thuộc nặng vào Agoda, Booking, Traveloka và GrabFood với mức hoa hồng 18–30%, không có kênh đặt trực tiếp.', solution: 'Website song ngữ Việt – Anh – Pháp + đặt chỗ trực tiếp + blog + khu vực khách hàng + SEO on-page.', result: 'Giảm phụ thuộc vào OTA · khách phương Tây được phục vụ bằng chính ngôn ngữ của họ · hình ảnh chuyên nghiệp hơn', pack: 'Gói Business' },
        { sector: 'Doanh nghiệp SME / startup', context: 'Website hiện tại quá hạn chế, cần thương mại điện tử, tích hợp API và hiệu năng đủ tốt để mở rộng.', solution: 'Thiết kế riêng + thương mại điện tử + tích hợp API + A/B testing + Core Web Vitals 90+.', result: 'Tăng tỷ lệ chuyển đổi nhờ A/B testing · website nhanh, hỗ trợ tăng trưởng và SEO', pack: 'Gói Premium' },
      ],
    },
    packs: {
      h2: 'Các gói website',
      subtitle: 'Mỗi dự án có số trang và tính năng khác nhau, nên chúng tôi báo giá riêng theo nhu cầu thực tế. Miễn phí và gửi trong vòng 48 giờ, không có chi phí ẩn. Gói Starter và Business dựa trên các bản thiết kế mẫu (maquette) đã xác định trước; gói Premium hoàn toàn theo yêu cầu riêng.',
      popular: 'Được chọn nhiều nhất',
      // `ht` et `monthly` ne sont pas rendus en mode devis (voir QUOTE_ONLY_LANGS).
      ht: '',
      monthly: 'bảo trì hằng tháng',
      delivery: 'Thời gian bàn giao',
      custom: 'Theo yêu cầu',
      customNote: 'Giá tính riêng, chỉ theo báo giá',
      customDetail: 'Gói hoàn toàn theo yêu cầu riêng: thiết kế, phạm vi, tính năng và chi phí được xác định cùng bạn trong một báo giá riêng, miễn phí, không ràng buộc và gửi trong vòng 48 giờ. Miễn phí bảo trì trong 12 tháng, sau đó được báo giá riêng.',
      customCta: 'Nhận báo giá theo yêu cầu riêng',
      monthlyFrom: '',
      priceFrom: '',
      types: ['Website tĩnh', 'Backend + CMS', 'Kiến trúc theo yêu cầu riêng'],
      maintenanceFree: 'Miễn phí bảo trì 12 tháng',
      maintenanceAfterFree: 'Sau đó theo báo giá: kiến trúc theo yêu cầu riêng được tính riêng.',
      maintenanceRule: '',
      mockupNote: 'Theo mẫu thiết kế xác định trước',
      mockupDetail: 'Báo giá của gói này dựa trên các bản thiết kế mẫu (maquette) đã xác định trước — cấu trúc và thiết kế cơ bản được định sẵn, điều chỉnh theo nhận diện thương hiệu của bạn. Mọi thiết kế riêng đều được báo giá riêng: đó là gói Premium.',
      // Mode devis (vi) : aucun montant EUR affiché, le détail chiffré est donné dans le devis.
      extras: {
        title: 'Tuỳ chọn thêm, áp dụng cho mọi gói',
        subtitle: 'Mỗi tuỳ chọn được báo giá cụ thể trong báo giá của bạn.',
        items: [
          { label: 'Phiên bản tiếng Anh', desc: 'Website song ngữ Pháp – Anh, cả hai ngôn ngữ đều được khai báo cho công cụ tìm kiếm.', price: 'Theo báo giá' },
          { label: 'Đo lường truy cập + đồng ý cookie', desc: 'Tài khoản, thẻ theo dõi, banner đồng ý tuân thủ quy định (từ chối dễ như chấp nhận), sự kiện, chuyển đổi và bảng điều khiển.', price: 'Theo báo giá' },
          { label: 'Khu vực quản trị (CMS)', desc: 'Thêm CMS cho website tĩnh: tự chỉnh sửa chữ và hình ảnh: 2 vai trò (biên tập, duyệt), 3 tài khoản định danh, trạng thái nháp / chờ duyệt / đã đăng, hướng dẫn qua video call và tài liệu PDF.', price: 'Theo báo giá' },
          { label: 'Danh sách chờ đối tác (backend)', desc: 'Phát triển backend: biểu mẫu riêng (công ty, loại hợp tác, ngân sách), cơ sở dữ liệu đặt tại châu Âu, mỗi yêu cầu một trạng thái, xuất dữ liệu bằng một cú nhấp.', price: 'Theo báo giá' },
          { label: 'Danh mục có bộ lọc', desc: 'Nội dung của bạn (tập phim, sản phẩm, dự án) được phân loại và lọc theo danh mục.', price: 'Theo báo giá' },
          { label: 'Trang thương hiệu đối tác', desc: 'Trang riêng cho một đối tác hoặc thương hiệu, kèm dòng ghi chú « cùng với [thương hiệu] » theo đúng quy định.', price: 'Theo báo giá' },
          { label: 'Khu vực đối tác riêng tư', desc: 'Chia sẻ ưu đãi và số liệu qua tài khoản truy cập, không công khai.', price: 'Theo báo giá' },
          { label: 'SEO · Gói khởi động', desc: 'Kiểm tra tên thương hiệu và tên trùng, chọn tên miền, đánh dấu và dữ liệu có cấu trúc, từ khoá thương hiệu, chuyển hướng, báo cáo hiển thị trên Google + AI sau 30 ngày.', price: 'Theo báo giá' },
          { label: 'SEO · Đồng hành 3 tháng', desc: 'Trang theo mục đích sử dụng, kế hoạch nội dung, bộ tài liệu báo chí, theo dõi hằng tháng với 3 báo cáo hiển thị Google + AI.', price: 'Theo báo giá' },
        ],
        hourly: 'Công việc ngoài phạm vi được tính theo giờ, luôn có báo giá bằng văn bản trước khi thực hiện.',
        tools: 'Các công cụ bên thứ ba (tên miền, email marketing, đo lường truy cập, cơ sở dữ liệu) được mở dưới tên bạn; chi phí cụ thể được nêu trong báo giá. Hosting website đã bao gồm trong năm đầu.',
      },
      items: [
        {
          name: 'Gói Starter', tagline: 'Sự hiện diện chuyên nghiệp đầu tiên. Lên sóng sau 3 tuần.',
          bullets: ['Website giới thiệu tối đa 8 trang', 'Thiết kế responsive hiện đại', 'Đã bao gồm SEO cơ bản', 'Tặng 1 năm hosting'],
          included: ['Template Next.js cao cấp được tuỳ biến theo thương hiệu (logo, màu sắc, nội dung) — tối đa 8 trang', 'Thiết kế ưu tiên điện thoại', 'SEO cơ bản (thẻ mô tả, sitemap, Schema, Search Console)', 'Biểu mẫu liên hệ đã kết nối', 'Tối ưu hồ sơ Google Business', 'Đã bao gồm 1 năm hosting', 'Cài đặt Google Analytics', 'Hướng dẫn 30 phút + tài liệu'],
          notIncluded: ['Thiết kế riêng', 'Blog / CMS', 'Khu vực khách hàng', 'Thương mại điện tử', 'SEO on-page, SEO địa phương và GEO (tuỳ chọn)'],
          options: [{ label: 'Thêm một trang', price: 'Theo báo giá' }, { label: 'Viết nội dung (mỗi trang)', price: 'Theo báo giá' }, { label: 'SEO on-page', price: 'Theo báo giá' }, { label: 'SEO địa phương (Google Business)', price: 'Theo báo giá' }, { label: 'GEO — hiện diện trong câu trả lời của AI', price: 'Theo báo giá' }, { label: 'Chatbot AI', price: 'Theo báo giá' }],
          maintenanceItems: ['≈ 0,5 giờ bảo trì mỗi tháng', 'Hosting & tên miền', 'Cập nhật bảo mật', 'Sao lưu hằng tháng', 'Hỗ trợ qua email (phản hồi trong 72 giờ)'],
        },
        {
          name: 'Gói Business', tagline: 'Nền tảng tăng trưởng của bạn. Có blog & khu vực khách hàng.',
          bullets: ['Website tối đa 20 trang', 'Bản thiết kế mẫu xác định trước, duyệt trước khi lập trình', 'Blog + CMS gọn nhẹ', 'Khu vực khách hàng tích hợp'],
          included: ['Website tối đa 20 trang', 'Bản thiết kế mẫu xác định trước, điều chỉnh theo thương hiệu và duyệt trước khi lập trình', 'Khu vực khách hàng tích hợp', 'Blog + CMS gọn nhẹ', 'SEO on-page toàn diện', 'Đo lường nâng cao & sự kiện', 'Biểu mẫu & luồng chuyển đổi', 'Đã bao gồm 1 năm hosting', 'Hướng dẫn 1 giờ qua video call + tài liệu PDF', 'Hỗ trợ email ưu tiên (phản hồi trong 48 giờ)'],
          notIncluded: ['Thiết kế riêng (gói Premium)', 'Thương mại điện tử đầy đủ', 'Tích hợp API phức tạp', 'A/B testing', 'Hỗ trợ 24/7'],
          options: [{ label: 'Mô-đun thương mại điện tử', price: 'Theo báo giá' }, { label: 'Thêm một trang', price: 'Theo báo giá' }, { label: 'Tích hợp API bên thứ ba', price: 'Theo báo giá' }, { label: 'Chatbot AI', price: 'Theo báo giá' }],
          maintenanceItems: ['≈ 1 giờ bảo trì mỗi tháng', 'Hosting & tên miền', 'Cập nhật bảo mật & CMS', 'Sao lưu hằng tuần', 'Hỗ trợ ưu tiên (phản hồi trong 48 giờ)', '2 lần chỉnh sửa nội dung mỗi tháng'],
        },
        {
          name: 'Gói Premium', tagline: 'Giải pháp toàn diện & mở rộng được, hoàn toàn theo yêu cầu riêng. Thương mại điện tử & API.',
          bullets: ['Thiết kế và tính năng theo yêu cầu riêng', 'Thương mại điện tử đầy đủ', 'Tích hợp API bên thứ ba', 'Hiệu năng Core Web Vitals 90+'],
          included: ['Số trang không giới hạn', 'Thương mại điện tử đầy đủ (danh mục, giỏ hàng, thanh toán)', 'Tích hợp API bên thứ ba theo yêu cầu', 'Bảo mật nâng cao', 'Hiệu năng Core Web Vitals 90+', 'Báo cáo & A/B testing', 'Thiết kế riêng cao cấp', 'SEO kỹ thuật & on-page toàn diện', 'Đã bao gồm hosting độ sẵn sàng cao', 'Đào tạo đội ngũ + tài liệu video', 'Hỗ trợ riêng 24/7 (phản hồi trong 24 giờ)'],
          notIncluded: ['Ngân sách quảng cáo', 'Quản trị mạng xã hội', 'Sản xuất ảnh / video'],
          options: [{ label: 'Ứng dụng di động', price: 'Theo báo giá' }, { label: 'Kết nối phần mềm quản lý / hệ thống cũ', price: 'Theo báo giá' }, { label: 'Bảo trì và phát triển tăng cường', price: 'Theo báo giá' }],
          maintenanceItems: ['Thời gian bảo trì và mức dịch vụ được xác định trong báo giá', 'Hosting độ sẵn sàng cao', 'Cập nhật bảo mật chủ động', 'Sao lưu hằng ngày', 'Giám sát & báo cáo hằng tháng', 'Hỗ trợ riêng 24/7 (phản hồi trong 24 giờ)', 'Chỉnh sửa không giới hạn'],
        },
      ],
    },
    seo: {"h2": "SEO, SEO địa phương, GEO: mỗi cấp độ gồm những gì", "subtitle": "SEO giúp website lên hạng trên Google; GEO giúp thương hiệu được trích dẫn trong câu trả lời của ChatGPT, Perplexity, Gemini và Google AI Overviews. Dưới đây là phần đã bao gồm trong từng gói và phần có thể thêm.", "levels": [{"name": "SEO cơ bản", "badge": "Đã bao gồm trong Starter", "goal": "Giúp website sạch, được Google lập chỉ mục và đọc được. Chưa làm việc trên từ khoá.", "items": ["Thẻ title / meta riêng, cấu trúc Hn", "Sitemap, robots.txt, URL gọn", "Schema.org Organization / LocalBusiness", "Cài Google Search Console + Analytics", "Website nhanh, ưu tiên điện thoại"], "price": "Đã bao gồm"}, {"name": "SEO on-page", "badge": "Đã bao gồm trong Business · tuỳ chọn cho Starter", "goal": "Mỗi trang nhắm một truy vấn cụ thể và cải thiện nội dung hiện có.", "items": ["Nghiên cứu từ khoá (1 truy vấn chính mỗi trang)", "Cấu trúc và tối ưu nội dung", "Liên kết nội bộ và thẻ hình ảnh", "Schema.org theo từng trang"], "price": "Theo báo giá"}, {"name": "SEO địa phương", "badge": "Tuỳ chọn Starter / Business", "goal": "Xuất hiện trên Google Maps và các tìm kiếm « gần tôi ».", "items": ["Hồ sơ Google Business đầy đủ, tối ưu", "Thông tin NAP nhất quán, đăng ký 10 danh bạ", "Chiến lược thu thập đánh giá", "Trang theo khu vực phục vụ"], "price": "Theo báo giá"}, {"name": "SEO kỹ thuật nâng cao", "badge": "Đã bao gồm trong Premium", "goal": "Bảo đảm hiệu năng, chỉ mục và độ ổn định ở quy mô lớn.", "items": ["Core Web Vitals 90+", "Kiểm tra thu thập / lập chỉ mục, chuyển hướng", "hreflang và website đa ngôn ngữ", "Dữ liệu có cấu trúc nâng cao, giám sát"], "price": "Đã bao gồm"}, {"name": "SEO nội dung", "badge": "Tuỳ chọn", "goal": "Tạo nội dung thu hút lượt truy cập lâu dài.", "items": ["3 bài viết 800 từ đã tối ưu (giai đoạn ra mắt)", "Brief từ khoá, liên kết tới trang dịch vụ", "Theo dõi hằng tháng: 2 nội dung + báo cáo"], "price": "Theo báo giá"}, {"name": "GEO (Generative Engine Optimization)", "badge": "Đã bao gồm trong Premium · tuỳ chọn Starter / Business", "goal": "Được các AI tạo sinh trích dẫn làm nguồn: ChatGPT, Perplexity, Gemini, Google AI Overviews.", "items": ["llms.txt và cho phép robot AI (robots.txt)", "Nội dung trả lời trước + FAQ đánh dấu FAQPage", "Thực thể và sameAs (tổ chức, tác giả, hồ sơ)", "Bing Webmaster + IndexNow (nuôi ChatGPT Search)", "Kiểm tra trích dẫn trên các truy vấn chính"], "price": "Theo báo giá"}], "note": "SEO truyền thống đo thứ hạng; GEO đo số lần được trích dẫn trong câu trả lời của AI. Hai phần bổ trợ nhau. Chúng tôi không cam kết kết quả xếp hạng hay trích dẫn."},
    process: {
      h2: 'Quy trình 4 bước của chúng tôi',
      subtitle: 'Từ buổi trao đổi đầu tiên đến lúc lên sóng: một quy trình đã được kiểm chứng, mỗi bước đều có kết quả bàn giao rõ ràng.',
      steps: [
        { title: 'Trao đổi & báo giá', duration: '48 giờ', desc: 'Chúng tôi làm rõ mục tiêu, đối tượng khách hàng và nhu cầu của bạn. Bạn nhận được báo giá chi tiết và lịch trình rõ ràng trong vòng 48 giờ.', bring: 'Mục tiêu và website bạn thích', bringLabel: 'Bạn chuẩn bị:' },
        { title: 'Thiết kế mẫu', duration: '3 đến 7 ngày', desc: 'Chúng tôi dựng bản thiết kế và cùng bạn duyệt trước khi viết dòng lệnh đầu tiên.', bring: 'Logo, nội dung, hình ảnh', bringLabel: 'Bạn chuẩn bị:' },
        { title: 'Lập trình', duration: '1 đến 6 tuần', desc: 'Chúng tôi lập trình website bằng Next.js, đưa nội dung, SEO và tính năng vào, rồi kiểm thử trên mọi kích thước màn hình.', bring: 'Nội dung bản cuối', bringLabel: 'Bạn chuẩn bị:' },
        { title: 'Lên sóng & theo dõi', duration: '1 ngày', desc: 'Triển khai, cấu hình tên miền và công cụ đo lường, rồi theo dõi sát trong những ngày đầu. Đã bao gồm hướng dẫn sử dụng.', bring: '30 phút cho buổi hướng dẫn', bringLabel: 'Bạn chuẩn bị:' },
      ],
    },
    testimonials: {
      h2: 'Khách hàng nói gì về chúng tôi',
      items: [
        { quote: 'Website mới tải trong chưa đến một giây và chúng tôi cuối cùng cũng xuất hiện trên Google. Sau 2 tháng, số yêu cầu báo giá tăng gấp đôi.', name: 'Julien P.', role: 'Chủ doanh nghiệp', company: 'Đơn vị thi công, Lille (Pháp)', initials: 'JP', color: 'bg-white/10 text-white' },
        { quote: 'Việc làm lại website đã thay đổi hoàn toàn hình ảnh của chúng tôi. Thiết kế rất đẹp, khu vực khách hàng được cả đội yêu thích. Lượng truy cập tự nhiên tăng 40%.', name: 'Camille R.', role: 'Giám đốc marketing', company: 'Doanh nghiệp B2B, Lyon (Pháp)', initials: 'CR', color: 'bg-white/10 text-white' },
        { quote: 'Cửa hàng trực tuyến bàn giao sau 6 tuần, thanh toán chạy mượt, website rất nhanh. Tỷ lệ chuyển đổi tăng 25% nhờ A/B testing.', name: 'Sofia M.', role: 'Nhà sáng lập', company: 'Thương mại điện tử, Bordeaux (Pháp)', initials: 'SM', color: 'bg-white/10 text-white' },
      ],
    },
    faq: {
      h2: 'Câu hỏi thường gặp',
      items: [
        { q: 'Làm một website hết bao nhiêu tiền?', a: 'Chúng tôi báo giá riêng cho từng dự án, vì chi phí phụ thuộc vào số trang, mức độ thiết kế riêng và các tính năng bạn cần (blog, khu vực khách hàng, bán hàng trực tuyến, tích hợp hệ thống). Báo giá chi tiết là miễn phí và được gửi trong vòng 48 giờ, kèm phạm vi công việc và lịch bàn giao. Bạn có thể đặt lịch trao đổi tại neuraweb.fr/vi/booking. Nếu bạn là hộ kinh doanh nhỏ và chỉ cần một trang duy nhất, gói Landing Page Express có mức giá cố định 1.290.000 VND.' },
        { q: 'Bao lâu thì website của tôi lên sóng?', a: 'Khoảng 2 đến 3 tuần cho gói Starter, 4 đến 6 tuần cho gói Business và ít nhất 6 tuần cho gói Premium, tuỳ phạm vi được xác định trong báo giá. Thời gian chủ yếu phụ thuộc vào việc bạn gửi nội dung nhanh hay chậm (chữ, hình ảnh, logo).' },
        { q: 'Vì sao chọn Next.js thay vì WordPress?', a: 'Next.js cho ra website nhanh hơn, an toàn hơn và lên hạng tốt hơn WordPress, mà không phải nuôi hàng loạt plugin hay lo lỗ hổng bảo mật. Bạn có điểm hiệu năng 90+ và nền tảng SEO kỹ thuật vững ngay từ lúc ra mắt. Với một blog rất đơn giản và không đòi hỏi hiệu năng, WordPress vẫn là lựa chọn được — chúng tôi tư vấn theo đúng trường hợp của bạn.' },
        { q: 'Có bao gồm SEO không?', a: 'Có, theo ba cấp độ. Gói Starter gồm SEO cơ bản (thẻ riêng, sitemap, robots.txt, Schema.org, Search Console). Gói Business bổ sung SEO on-page toàn diện (từ khoá, cấu trúc nội dung, liên kết nội bộ). Gói Premium bổ sung SEO kỹ thuật nâng cao (Core Web Vitals 90+, hreflang) và GEO, tức tối ưu để được ChatGPT, Perplexity hoặc Google AI Overviews trích dẫn. SEO địa phương, GEO và nội dung có thể thêm dưới dạng tuỳ chọn cho các gói còn lại.' },
        { q: 'Tôi có tự chỉnh sửa website được không?', a: 'Được. Gói Business và Premium đi kèm một CMS gọn nhẹ cho phép bạn sửa chữ, ảnh và bài blog mà không cần đụng đến mã nguồn. Bạn được hướng dẫn khi bàn giao. Với gói Starter, các chỉnh sửa nằm trong phần bảo trì hằng tháng.' },
        { q: 'Bảo trì hằng tháng gồm những gì?', a: 'Hosting, tên miền, cập nhật bảo mật, sao lưu và hỗ trợ. Tuỳ theo gói, còn có thêm số lần chỉnh sửa nội dung hằng tháng và giám sát vận hành. Đây là phần tuỳ chọn, nhưng nên có để website luôn nhanh và an toàn theo thời gian. Chi phí bảo trì phụ thuộc vào thời gian dành cho website và độ phức tạp. Chỉ gói Premium (kiến trúc theo yêu cầu riêng) được miễn phí bảo trì trong 12 tháng đầu, sau đó được báo giá riêng.' },
        { q: 'Các bạn có làm website bán hàng không?', a: 'Có, với gói Premium: danh mục sản phẩm, giỏ hàng, thanh toán an toàn, quản lý đơn hàng và luồng mua hàng được tối ưu. Chúng tôi cũng có thể tích hợp Shopify nếu bạn muốn. Báo giá phụ thuộc vào số lượng sản phẩm và các kết nối bạn cần.' },
      ],
    },
    more: {
      h3: 'Tìm hiểu thêm',
      items: [
        { label: 'WordPress hay Next.js: nên chọn gì năm 2026?', href: '/blog/nextjs-vs-wordpress-2026' },
        { label: 'Cách tích hợp AI vào website năm 2025', href: '/blog/integrer-ia-site-web-2025' },
        { label: 'Thêm chatbot AI vào website của bạn', href: '/integration-ia' },
        { label: 'Tự động hoá quy trình kinh doanh', href: '/automatisation' },
        { label: 'Phát triển ứng dụng di động', href: '/mobile-app-development' },
      ],
    },
    cta: { badge: 'Báo giá miễn phí · Không ràng buộc', h2: 'Sẵn sàng khởi động website mới?', p: 'Hãy kể cho chúng tôi về dự án của bạn và nhận báo giá chi tiết kèm lịch trình rõ ràng trong vòng 48 giờ. Không ràng buộc, không thuật ngữ khó hiểu.', ctaAudit: 'Nhận báo giá miễn phí', ctaBlog: 'Đọc: Next.js hay WordPress', ctaBlogHref: '/blog/nextjs-vs-wordpress-2026' },
    detail: { included: 'Đã bao gồm', notIncluded: 'Chưa bao gồm', options: 'Tuỳ chọn thêm', maintenance: 'Bảo trì', choose: 'Nhận báo giá cho gói', payment: 'Có thể thanh toán theo tiến độ · 40% khi khởi động, 30% khi duyệt thiết kế, 30% khi bàn giao' },
    showDetails: 'Xem chi tiết ↓', hideDetails: 'Ẩn chi tiết ↑',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// STATIC DATA (unchanged across languages)
// ═══════════════════════════════════════════════════════════════════════════

const STATS_VALUES = ['90+', '5/5', '48h'];

const SERVICE_ICONS = [Layout, Palette, Search, ShoppingCart, Gauge, Server];
const SERVICE_BADGE_COLORS = ['bg-emerald-500', 'bg-gray-900', 'bg-violet-500', 'bg-gray-700', 'bg-rose-500', 'bg-slate-500'];
const SERVICE_ACCENT_COLORS = ['border-emerald-400', 'border-white', 'border-gray-400', 'border-gray-400', 'border-rose-400', 'border-slate-400'];

// Premium = sur mesure : pas de prix ni de maintenance affichés (null → libellé « sur mesure »)
const PACK_PRICES: (number | null)[] = [1490, 3990, null];
const PACK_MONTHLY: (number | null)[] = [59, 89, null]; // « à partir de » : statique 59, backend 89 ; Premium offert 12 mois
const PACK_DELIVERY: Record<Lang, string[]> = {
  fr: ['2 à 3 semaines', '4 à 6 semaines', '6 semaines et plus'],
  en: ['2 to 3 weeks', '4 to 6 weeks', '6 weeks and more'],
  es: ['2 a 3 semanas', '4 a 6 semanas', '6 semanas o más'],
  vi: ['2 đến 3 tuần', '4 đến 6 tuần', 'Từ 6 tuần'],
};

// ── Mode devis (vi) ────────────────────────────────────────────────────────
// Sur la version vietnamienne, aucun montant EUR n'est affiché (cf. les pages
// automatisation / intégration IA et services-pricing.tsx).
const QUOTE_ONLY_LANGS: readonly Lang[] = ['vi'];
const QUOTE_PRICE_LABEL = 'Theo báo giá';
const QUOTE_PRICE_NOTE = 'Báo giá miễn phí trong 48 giờ';
const QUOTE_MAINTENANCE_LABEL = 'Bảo trì hằng tháng theo báo giá';
// Sommaire mobile collant (ancres de la page)
const ANCHOR_LABEL: Record<Lang, string> = { fr: 'Sommaire de la page', en: 'Page contents', es: 'Contenido de la página', vi: 'Mục lục trang' };
const ANCHORS: Record<Lang, [string, string, string, string]> = {
  fr: ['Packs', 'SEO', 'Méthode', 'FAQ'],
  en: ['Packs', 'SEO', 'Process', 'FAQ'],
  es: ['Packs', 'SEO', 'Método', 'FAQ'],
  vi: ['Gói', 'SEO', 'Quy trình', 'FAQ'],
};
const PACK_IDS = ['starter', 'business', 'premium'] as const;
type PackId = (typeof PACK_IDS)[number];

const TOOLS = [
  { name: 'Next.js', cat: { fr: 'Framework', en: 'Framework', es: 'Framework', vi: 'Framework' } },
  { name: 'React', cat: { fr: 'Framework', en: 'Framework', es: 'Framework', vi: 'Framework' } },
  { name: 'TypeScript', cat: { fr: 'Langage', en: 'Language', es: 'Lenguaje', vi: 'Langage' } },
  { name: 'Tailwind CSS', cat: { fr: 'Design', en: 'Design', es: 'Diseño', vi: 'Design' } },
  { name: 'Vercel', cat: { fr: 'Hébergement', en: 'Hosting', es: 'Alojamiento', vi: 'Hébergement' } },
  { name: 'Supabase', cat: { fr: 'Backend', en: 'Backend', es: 'Backend', vi: 'Backend' } },
  { name: 'Stripe', cat: { fr: 'Paiement', en: 'Payment', es: 'Pago', vi: 'Paiement' } },
  { name: 'Sanity', cat: { fr: 'CMS', en: 'CMS', es: 'CMS', vi: 'CMS' } },
  { name: 'WordPress', cat: { fr: 'CMS', en: 'CMS', es: 'CMS', vi: 'CMS' } },
  { name: 'Shopify', cat: { fr: 'E-commerce', en: 'E-commerce', es: 'E-commerce', vi: 'E-commerce' } },
  { name: 'Google Analytics', cat: { fr: 'Analytics', en: 'Analytics', es: 'Analytics', vi: 'Analytics' } },
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
  const isQuoteOnly = QUOTE_ONLY_LANGS.includes(lang);
  const isCustomPack = PACK_PRICES[packIdx] === null;

  // Bloc prix d'un pack (cartes desktop + résumé mobile)
  const renderPrice = (i: number) => (
          <div className="mb-4">
            {isQuoteOnly ? (
              <>
                <span className="text-3xl font-bold text-white">{QUOTE_PRICE_LABEL}</span>
                <div className="text-sm text-slate-400">{QUOTE_PRICE_NOTE}</div>
              </>
            ) : PACK_PRICES[i] === null ? (
              <>
                <span className="text-3xl font-bold text-white">{c.packs.custom}</span>
                <div className="text-sm text-slate-400">{c.packs.customNote}</div>
              </>
            ) : (
              <>
                <div className="text-xs text-slate-400">{c.packs.priceFrom}</div>
                <span className="text-3xl font-bold text-white">{PACK_PRICES[i]!.toLocaleString('fr-FR')} €</span>
                <span className="text-slate-400 text-sm ml-1">{c.packs.ht}</span>
                <div className="text-sm text-slate-400">+ {c.packs.monthlyFrom} {PACK_MONTHLY[i]} {c.packs.monthly}</div>
              </>
            )}
            {PACK_PRICES[i] !== null && (
              <div className="text-xs text-slate-400 mt-1">{c.packs.mockupNote}</div>
            )}
            {PACK_PRICES[i] === null && (
              <div className="text-sm text-slate-300 font-medium mt-1">{c.packs.maintenanceFree}</div>
            )}
          </div>
  );

  // Animations au scroll (GSAP ScrollTrigger) + parallaxe — voir useGsapReveal
  const containerRef = useRef<HTMLElement>(null);
  useGsapReveal(containerRef, [lang]);

  return (
    <>
      <div className="theme-dev-web">
      <Header />
      <main ref={containerRef} id="main-content" className="min-h-screen">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <ServiceHero
          badgeIcon={<Code size={14} aria-hidden="true" />}
          badge={c.hero.badge}
          h1={c.hero.h1}
          highlight={c.hero.h1highlight}
          subtitle={c.hero.p}
          primary={{ href: '/contact', label: c.hero.ctaAudit, icon: <Code size={18} aria-hidden="true" /> }}
          secondary={{ href: '#pricing', label: c.hero.ctaPricing }}
          stats={c.stats.map((stat, i) => ({ value: String(STATS_VALUES[i]), label: stat.label }))}
          visual={{ src: "/assets/redesign/pages/dev-web-hero.webp", alts: {"fr": "Illustration d'une fenêtre de navigateur dont les blocs de contenu s'assemblent, avec un curseur qui clique sur un bouton", "en": "Illustration of a browser window whose content blocks snap together, with a cursor clicking a button", "es": "Ilustración de una ventana de navegador cuyos bloques de contenido se ensamblan, con un cursor que hace clic en un botón", "vi": "Minh họa cửa sổ trình duyệt với các khối nội dung đang ghép lại và con trỏ nhấp vào một nút"} }}
        />

        <PageAnchorNav
          label={ANCHOR_LABEL[lang]}
          items={[
            { href: '#pricing', label: ANCHORS[lang][0] },
            { href: '#seo-geo', label: ANCHORS[lang][1] },
            { href: '#process', label: ANCHORS[lang][2] },
            { href: '#faq', label: ANCHORS[lang][3] },
          ]}
        />

        {/* ── PROBLEMS ──────────────────────────────────────────────────── */}
        <section className="py-12 md:py-20 sec-screen ctx-light" style={{ background: 'rgb(var(--c-surface-DEFAULT))' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-8 md:mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">{c.problems.h2}</h2>
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
                    <h3 className="font-semibold text-navy-900 mb-2 text-sm leading-snug">{p.title}</h3>
                    <p className="text-slate-500 text-sm">{p.text}</p>
                  </div>
                );
              })}
            </ResponsiveCards>
            </div>
          </div>
        </section>

        {/* ── SERVICES ──────────────────────────────────────────────────── */}
        <section className="py-12 md:py-20 sec-pat sec-waves sec-dark-base sec-screen ctx-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-8 md:mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{c.services.h2}</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">{c.services.subtitle}</p>
            </div>
            <div className="animate-on-scroll fade-up delay-100">
            <ResponsiveCards breakpoint="md" gridClass="grid-cols-2 lg:grid-cols-3" gridGap="gap-6">
              {c.services.items.map((service, i) => {
                const Icon = SERVICE_ICONS[i];
                const isExpanded = expandedService === i;
                return (
                  <div key={i} className={`rounded-xl border-2 ${SERVICE_ACCENT_COLORS[i]} bg-navy-900/30 p-6 cursor-pointer hover:shadow-lg transition-all duration-300 h-full`} onClick={() => setExpandedService(isExpanded ? null : i)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-navy-900/40 flex items-center justify-center">
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
        <section className="py-8 md:py-14 border-y border-slate-200 sec-tint ctx-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="animate-on-scroll fade-up text-center text-sm text-slate-500 font-medium mb-8 uppercase tracking-wider">{c.tools.label}</p>
            <div className="animate-on-scroll fade-up delay-100 flex flex-wrap justify-center gap-3">
              {TOOLS.map((tool, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm text-slate-600 font-medium hover:border-slate-400 transition-colors">
                  {tool.name}
                  <span className="hidden text-xs text-slate-500 sm:inline">{tool.cat[lang]}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CAS D'USAGE ───────────────────────────────────────────────── */}
        <section className="py-12 md:py-20 sec-screen ctx-dark" style={{ background: 'rgb(var(--c-navy-950))' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-8 md:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{c.useCases.h2}</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">{c.useCases.subtitle}</p>
            </div>
            <ResponsiveCards breakpoint="md" gridClass="grid-cols-2 lg:grid-cols-3" gridGap="gap-6">
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
            </ResponsiveCards>
            <SourcedStats ids={['speed53','speed84','site65']} tone="dark" className="mt-14" />
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────────────────────────── */}
        <section id="pricing" className="scroll-mt-28 py-12 md:py-20 sec-flip sec-flip-light sec-screen ctx-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-8 md:mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{c.packs.h2}</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">{c.packs.subtitle}</p>
            </div>

            {/* Sélecteur mobile */}
            <div className="flex gap-2 mb-8 justify-center sm:hidden">
              {PACK_IDS.map((id, i) => (
                <button key={id} onClick={() => setSelectedPack(id)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${selectedPack === id ? 'bg-white text-gray-900' : 'bg-navy-900/40 text-slate-300'}`}>
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
                  <div key={id} onClick={() => setSelectedPack(id)} className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ${borders[i]} ${selectedPack === id ? 'shadow-xl bg-navy-900/30 scale-[1.02]' : 'bg-navy-900/30 hover:shadow-md'}`}>
                    {i === 1 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-4 py-1 rounded-full">{c.packs.popular}</span>}
                    <h3 className="font-bold text-white text-lg mb-1">{pack.name}</h3>
                    <p className="text-slate-400 text-sm mb-3">{pack.tagline}</p>
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/10 text-white mb-4">{c.packs.types[i]}</span>
                    {renderPrice(i)}
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
            <div className="animate-on-scroll fade-up delay-100 rounded-2xl border border-white/10 bg-navy-900/30 p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{activePack.name}</h3>
                  <p className="text-slate-400 text-sm">{activePack.tagline}</p>
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/10 text-white mt-3">{c.packs.types[packIdx]}</span>
                  <div className="mt-4 sm:hidden">
                    {renderPrice(packIdx)}
                    <div className="mt-2 text-xs text-slate-400">⏱ {c.packs.delivery} : {PACK_DELIVERY[lang][packIdx]}</div>
                  </div>
                </div>
                <LocalizedLink href={`/booking?pack=${selectedPack}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-gray-900 transition-all duration-300" style={{ background: 'rgb(var(--c-white))', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                  {isCustomPack ? c.packs.customCta : `${c.detail.choose} ${activePack.name}`}<ArrowRight size={14} />
                </LocalizedLink>
              </div>
              <MobileCollapse openLabel={c.hideDetails.replace(/\s*[↓↑]/, '')} closedLabel={c.showDetails.replace(/\s*[↓↑]/, '')} className="lg:mt-0 mt-5" headerClassName="justify-center rounded-xl border border-white/20 px-4 py-3">
                <div className="mb-6 mt-5 lg:mt-0">
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">{isCustomPack ? c.packs.customDetail : c.packs.mockupDetail}</p>
                </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
                <div>
                  <h4 className="mb-3 font-semibold text-white flex items-center gap-2"><Check size={16} className="text-emerald-500" /> {c.detail.included}</h4>
                  <ul className="space-y-2">
                    {activePack.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <Check size={13} className="text-emerald-500 mt-0.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 font-semibold text-white flex items-center gap-2"><XIcon size={16} className="text-rose-500" /> {c.detail.notIncluded}</h4>
                  <ul className="space-y-2">
                    {activePack.notIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                        <XIcon size={13} className="text-rose-400 mt-0.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 font-semibold text-white">{c.detail.options}</h4>
                  <ul className="space-y-2 mb-6">
                    {activePack.options.map((opt, i) => (
                      <li key={i} className="flex items-start justify-between gap-2 text-sm">
                        <span className="text-slate-300">{opt.label}</span>
                        <span className="text-white font-medium text-right max-w-[48%]">{opt.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-navy-900/40 rounded-xl p-4 border border-white/10">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {PACK_MONTHLY[packIdx] === null
                        ? c.packs.maintenanceFree
                        : isQuoteOnly
                          ? QUOTE_MAINTENANCE_LABEL
                          : `${c.detail.maintenance} ${c.packs.monthlyFrom} ${PACK_MONTHLY[packIdx]} €/${lang === 'fr' ? 'mois' : lang === 'es' ? 'mes' : 'month'}`}
                    </div>
                    {PACK_MONTHLY[packIdx] === null && (
                      <p className="text-xs text-slate-400 mb-2">{c.packs.maintenanceAfterFree}</p>
                    )}
                    {PACK_MONTHLY[packIdx] !== null && !isQuoteOnly && (
                      <p className="text-xs text-slate-400 mb-2">{c.packs.maintenanceRule}</p>
                    )}
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
              </MobileCollapse>
            </div>

            {/* Options à la carte (issues du devis), valables sur tous les packs */}
            <div className="animate-on-scroll fade-up mt-6 sm:mt-8 rounded-2xl border border-white/10 bg-navy-900/30 p-5 sm:p-8">
              <MobileCollapse title={<h3 className="text-lg sm:text-xl font-bold text-white">{c.packs.extras.title}</h3>}>
              <p className="text-slate-400 text-sm mt-1 mb-6">{c.packs.extras.subtitle}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {c.packs.extras.items.map((opt) => (
                  <li key={opt.label} className="rounded-xl border border-white/10 bg-navy-900/40 p-4 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold text-white text-sm">{opt.label}</span>
                      <span className="text-white font-medium text-sm min-w-0 max-w-[55%] text-right">{opt.price}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{opt.desc}</p>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-400 mt-6">{c.packs.extras.hourly}</p>
              <p className="text-xs text-slate-400 mt-1">{c.packs.extras.tools}</p>
              </MobileCollapse>
            </div>

            <p className="text-center text-sm text-slate-400 mt-6">{c.detail.payment}</p>
          </div>
        </section>

        {/* ── SEO / GEO : niveaux et contenus ───────────────────────────── */}
        <section id="seo-geo" className="scroll-mt-28 py-12 md:py-20 sec-pat sec-dots sec-dark-base sec-screen ctx-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-8 md:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{c.seo.h2}</h2>
              <p className="text-slate-400 max-w-3xl mx-auto">{c.seo.subtitle}</p>
            </div>
            <ResponsiveCards breakpoint="md" gridClass="grid-cols-2 lg:grid-cols-3" gridGap="gap-6">
              {c.seo.levels.map((lvl) => (
                <article key={lvl.name} className="rounded-2xl border border-white/10 bg-navy-900/40 p-6 flex flex-col h-full">
                  <span className="self-start text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white mb-3">{lvl.badge}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{lvl.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{lvl.goal}</p>
                  <div className="mb-5">
                    <ul className="space-y-2 mt-3">
                      {lvl.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                          <Check size={13} className="text-emerald-500 mt-0.5 shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/10 text-sm font-semibold text-white">{lvl.price}</div>
                </article>
              ))}
            </ResponsiveCards>
            <p className="text-center text-sm text-slate-400 mt-8 max-w-3xl mx-auto">{c.seo.note}</p>
          </div>
        </section>

        {/* ── PROCESSUS ─────────────────────────────────────────────────── */}
        <section id="process" className="scroll-mt-28 py-12 md:py-20 sec-tint sec-screen ctx-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-8 md:mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">{c.process.h2}</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">{c.process.subtitle}</p>
            </div>
            <div className="animate-on-scroll fade-up delay-100">
            <ResponsiveCards breakpoint="sm" gridClass="grid-cols-2 lg:grid-cols-4" gridGap="gap-6">
              {c.process.steps.map((step, i) => (
                <div key={i} className="rounded-xl border border-slate-200 shadow-sm bg-white p-6 h-full">
                  <div className="text-3xl font-black text-navy-900 mb-3 opacity-60">0{i + 1}</div>
                  <h3 className="font-bold text-navy-900 mb-1">{step.title}</h3>
                  <div className="text-xs font-medium text-navy-900 mb-3">⏱ {step.duration}</div>
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
        <section className="py-12 md:py-20 sec-pat sec-waves sec-dark-base sec-screen ctx-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-8 md:mb-12">
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
        <section id="faq" className="scroll-mt-28 py-12 md:py-20 sec-screen ctx-light" style={{ background: 'rgb(var(--c-surface-DEFAULT))' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-on-scroll fade-up text-center mb-8 md:mb-12">
              <h2 className="text-3xl font-bold text-navy-900 mb-4">{c.faq.h2}</h2>
            </div>
            <Accordion type="single" collapsible className="animate-on-scroll fade-up delay-100 space-y-3">
              {c.faq.items.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 text-left text-sm font-semibold text-navy-900 hover:no-underline">{item.q}</AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-sm text-slate-600 leading-relaxed">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="animate-on-scroll fade-up mt-10 rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-navy-900 mb-4">{c.more.h3}</h3>
              <ul className="space-y-3">
                {c.more.items.map((item, i) => (
                  <li key={i}>
                    <LocalizedLink href={item.href} className="flex items-center gap-2 text-sm text-slate-700 hover:text-navy-900 hover:underline">
                      <ArrowRight size={14} />{item.label}
                    </LocalizedLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ─────────────────────────────────────────────────── */}
        <section className="py-14 md:py-24 ctx-dark" style={{ background: 'rgb(var(--c-navy-950))' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-on-scroll fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20 text-white text-sm font-medium mb-6">
              <Sparkles size={14} />{c.cta.badge}
            </div>
            <h2 className="animate-on-scroll fade-up delay-100 text-3xl sm:text-4xl font-bold text-white mb-6">{c.cta.h2}</h2>
            <p className="animate-on-scroll fade-up delay-200 text-slate-300 text-lg mb-10 max-w-2xl mx-auto">{c.cta.p}</p>
            <div className="animate-on-scroll fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center">
              <LocalizedLink href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all duration-300" style={{ background: 'rgb(var(--c-white))', boxShadow: '0 4px 20px rgb(var(--c-white) / 0.2)' }}>
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
      </div>
    </>
  );
}
