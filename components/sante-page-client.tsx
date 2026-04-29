'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ShieldCheck,
  Clock,
  Globe,
  ThumbsUp,
  Lock,
  RefreshCcw,
  UserCheck,
  MessageCircle,
  Code2,
  Rocket,
  Phone,
  Check,
  X as XIcon,
  Star,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Stethoscope,
  HeartPulse,
  Truck,
  Plus,
  Repeat,
} from 'lucide-react';

import { gsap, ScrollTrigger } from '@/lib/gsap-setup';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// ═══════════════════════════════════════════════════════════════════════════
// DONNÉES — constantes en haut de fichier
// ═══════════════════════════════════════════════════════════════════════════

type PackId = 'vitrine' | 'pro-blog' | 'pro-sante' | 'premium';

interface Pack {
  id: PackId;
  name: string;
  tagline: string;
  profil: string;
  price: number;
  monthly: number;
  bullets: string[];
  badge?: string;
  badgeColor?: string;
  borderColor: string;
  ringColor: string;
  bgAccent: string;
  hds: boolean;
  delivery: string;
  included: string[];
  notIncluded: string[];
  options: { label: string; price: string }[];
  abonnement: { included: string[]; notIncluded: string[] };
}

const PACKS: Pack[] = [
  {
    id: 'vitrine',
    name: 'Vitrine Santé',
    tagline: 'Le site essentiel. Présent en ligne en 1 semaine.',
    profil: 'Libéral solo, début d’activité',
    price: 990,
    monthly: 29,
    delivery: '5 à 8 jours',
    hds: false,
    borderColor: 'border-slate-200',
    ringColor: 'ring-slate-300',
    bgAccent: 'bg-white',
    bullets: [
      'Site one-page ou 5 pages responsive',
      'Lien Doctolib / KelDoc / Maiia intégré',
      'Hébergement France + SSL inclus',
      'SEO local + Google Business Profile',
    ],
    included: [
      'Pages : Accueil, Le Praticien, Spécialités, Tarifs & Horaires, Contact',
      'Design responsive mobile-first',
      'Charte graphique personnalisée',
      'Logo simple inclus si besoin',
      'Bouton Doctolib/KelDoc/Maiia (header sticky + hero + contact)',
      'Carte Google Maps interactive',
      'Formulaire de contact sécurisé (sans stockage)',
      'Mentions légales & RGPD santé',
      'Schema.org LocalBusiness + MedicalBusiness',
      'Certificat SSL (HTTPS) inclus',
      'Nom de domaine .fr ou .com (1ère année)',
      'Hébergement mutualisé France/Europe',
      'Formation 30 min + guide PDF SEO local',
    ],
    notIncluded: [
      'Pas de CMS éditorial',
      'Pas de blog',
      'Pas de réservation intégrée (lien Doctolib uniquement)',
      'Pas de stockage de données patients',
      'Pas de rappels SMS / Email',
      'Pas d’espace patient',
      'Pas de multilingue',
      'Rédaction des textes par le client (option dispo)',
      'Photos pro fournies par le client',
    ],
    options: [
      { label: 'Rédaction SEO des 5 pages', price: '+290 € HT' },
      { label: 'Shooting photo pro (15 photos)', price: '+550 € HT' },
      { label: 'Page supplémentaire', price: '+120 € HT / page' },
      { label: 'Multilingue (FR + EN ou ES)', price: '+350 € HT' },
      { label: 'Blog intégré (module CMS)', price: '+490 € HT' },
    ],
    abonnement: {
      included: [
        'Hébergement + nom de domaine',
        'Certificat SSL renouvelé',
        'Sauvegardes mensuelles automatiques',
        'Mises à jour de sécurité (CMS, plugins)',
        'Support email (délai 72h)',
        'Monitoring uptime basique',
      ],
      notIncluded: [
        'Refonte graphique',
        'Ajout de pages ou fonctionnalités',
        'Rédaction de contenu',
        'Modifications de texte / tarif / horaire',
        'Intervention urgente (< 24h)',
        'SEO continu',
      ],
    },
  },
  {
    id: 'pro-blog',
    name: 'Vitrine Pro + Blog',
    tagline: 'Le site qui travaille pour vous. Référencement et autorité.',
    profil: 'Cabinet établi, 1 à 2 praticiens',
    price: 1490,
    monthly: 49,
    delivery: '3 à 4 semaines',
    hds: false,
    badge: 'Le plus choisi',
    badgeColor: 'bg-amber-500',
    borderColor: 'border-teal-500',
    ringColor: 'ring-teal-500',
    bgAccent: 'bg-teal-50/40',
    bullets: [
      'Jusqu’à 10 pages + Blog CMS autonome',
      '3 articles SEO de lancement (800 mots)',
      'Newsletter (Mailchimp/Brevo) + reCAPTCHA',
      '2 modifs/mois incluses dans l’abonnement',
    ],
    included: [
      'Toutes les pages du Pack Vitrine Santé',
      'Pages : Témoignages modérés, FAQ par spécialité, page expertise métier',
      'Design sur-mesure (maquettes Figma validées)',
      'Blog intégré avec CMS — autonomie complète du client',
      '3 articles SEO de lancement (800 mots chacun)',
      'Catégories, tags, sitemap XML',
      'Newsletter / capture d’emails RGPD compliant',
      'Intégration réseaux sociaux (flux Instagram/Facebook)',
      'SEO on-page complet + rich snippets',
      'Google Analytics 4 + Search Console connectés',
      'Formulaire avancé (honeypot + reCAPTCHA v3)',
      'Hébergement premium + CDN, < 2s de chargement',
      'Formation 1h CMS + guide rédactionnel SEO',
    ],
    notIncluded: [
      'Module de réservation intégré (lien Doctolib uniquement)',
      'Stockage de données patients',
      'Rappels SMS / Email',
      'Espace patient sécurisé',
      'Paiement en ligne',
      'Application mobile native',
      'Hébergement HDS',
      'Rédaction au-delà des 3 articles de lancement',
      'Photos pro (option disponible)',
    ],
    options: [
      { label: 'Prise de RDV intégrée (synchro agenda)', price: '+390 € HT' },
      { label: 'Rappels SMS/Email', price: '+490 € HT + 0,08 €/SMS' },
      { label: 'Paiement en ligne (Stripe)', price: '+390 € HT' },
      { label: 'Rédaction 2 articles SEO/mois (800 mots)', price: '+290 € HT/mois' },
      { label: 'Shooting photo pro (20 + 5 portraits)', price: '+650 € HT' },
      { label: 'Setup campagne Google Ads', price: '+790 € HT' },
      { label: 'Espace patient basique (RDV uniquement)', price: '+990 € HT' },
    ],
    abonnement: {
      included: [
        'Hébergement premium + CDN',
        'Nom de domaine + SSL',
        'Sauvegardes hebdomadaires + stockage externe',
        'Mises à jour sécurité & performance',
        'Support prioritaire email (délai 48h)',
        '2 modifications de contenu / mois',
        'Monitoring uptime 24/7',
        'Rapport mensuel de performance',
      ],
      notIncluded: [
        'Refonte graphique',
        'Fonctionnalités complexes',
        'Rédaction d’articles de blog',
        'Campagnes publicitaires',
        'Modifications structurelles',
        'SEO off-page (netlinking)',
      ],
    },
  },
  {
    id: 'pro-sante',
    name: 'Pro Santé',
    tagline: 'La plateforme pour cabinets structurés. HDS inclus.',
    profil: 'Cabinet multi-praticiens, centre paramédical',
    price: 4490,
    monthly: 129,
    delivery: '6 à 8 semaines',
    hds: true,
    badge: 'HDS Inclus',
    badgeColor: 'bg-emerald-600',
    borderColor: 'border-emerald-500',
    ringColor: 'ring-emerald-500',
    bgAccent: 'bg-emerald-50/50',
    bullets: [
      'Réservation en ligne intégrée multi-praticiens',
      'Espace patient sécurisé + rappels SMS/Email',
      'Hébergement HDS certifié (OVH Healthcare)',
      'Tableau de bord admin + multilingue',
    ],
    included: [
      'Architecture multi-praticiens (fiches individuelles)',
      'Toutes les fonctionnalités du Pack Vitrine Pro + Blog',
      'Réservation en ligne intégrée — créneaux par praticien',
      'Espace patient sécurisé (historique RDV, factures)',
      'Rappels SMS + Email paramétrables (J-1/J-2/J-3)',
      'Blog avec calendrier de publication',
      'Chatbot FAQ intelligent',
      'Agrégation Google Reviews + Doctolib',
      'Multilingue (FR + 1 langue au choix)',
      'Tableau de bord administrateur complet',
      'RGPD renforcé (registre des traitements, droit à l’oubli)',
      'Hébergement HDS certifié (agrément Ministère Santé)',
      'Chiffrement AES-256 / TLS 1.3',
      'Pseudonymisation des logs + traçabilité accès',
      'Sauvegardes 3-2-1',
      'Formation 2h en visio',
    ],
    notIncluded: [
      'Téléconsultation vidéo',
      'Dossiers médicaux complets',
      'Intégrations logiciel médical non API-ready',
      'Application mobile native',
      'Paiement en ligne (option)',
      'Rédaction au-delà des articles de lancement',
      'Community management',
      'Budget publicitaire',
    ],
    options: [
      { label: 'Paiement en ligne (Stripe ou PayZen)', price: '+490 € HT' },
      { label: 'Téléconsultation vidéo sécurisée', price: '+1 590 € HT' },
      { label: 'Application mobile PWA', price: '+1 990 € HT' },
      { label: 'Intégration logiciel cabinet (API)', price: 'Sur devis (dès 1 500 € HT)' },
      { label: 'Rédaction 2 articles SEO santé/mois', price: '+390 € HT/mois' },
      { label: 'Community management (8 posts/mois)', price: '+590 € HT/mois' },
      { label: 'Formation complémentaire (1h)', price: '+190 € HT' },
    ],
    abonnement: {
      included: [
        'Hébergement HDS certifié + nom de domaine',
        'Certificat SSL EV (Extended Validation)',
        'Sauvegardes temps réel + stockage géo-redondant',
        'Mises à jour sécurité critiques sous 24h',
        'Support prioritaire 7j/7 (délai 4h)',
        '5 modifications de contenu / mois',
        'Monitoring + alertes temps réel',
        'Rapport mensuel avancé (SEO, conversions, sécurité)',
        'Licences plugins premium incluses',
        'Audit de conformité trimestriel',
      ],
      notIncluded: [
        'Refonte graphique majeure',
        'Nouvelles fonctionnalités hors scope',
        'Rédaction de contenu régulier',
        'Campagnes marketing payantes',
        'Modifications structurelles',
        'Formation récurrente',
      ],
    },
  },
  {
    id: 'premium',
    name: 'Premium Santé',
    tagline: 'L’écosystème digital complet. Automatisation et BI.',
    profil: 'Réseau de cabinets, clinique, groupement',
    price: 8900,
    monthly: 219,
    delivery: '8 à 12 semaines',
    hds: true,
    badge: 'Sur-mesure',
    badgeColor: 'bg-violet-600',
    borderColor: 'border-violet-500',
    ringColor: 'ring-violet-500',
    bgAccent: 'bg-violet-50/50',
    bullets: [
      'Architecture multi-sites + CRM patient',
      'Marketing automation + business intelligence',
      'HDS + ISO 27001 + pentest initial',
      'DPO externe 3 mois + accompagnement stratégique',
    ],
    included: [
      'Toutes les fonctionnalités du Pack Pro Santé',
      'Architecture multi-sites (plusieurs cabinets/lieux)',
      'CRM patient intégré avec segmentation',
      'Marketing automation (anniversaire, réactivation, avis)',
      'Espace patient avancé (documents, messagerie)',
      'Plan éditorial 6 mois + 6 articles de lancement rédigés',
      'Gestion réputation en ligne (veille avis)',
      'Tableaux de bord BI personnalisés',
      'A/B testing sur les pages de conversion',
      'DPO externe disponible 3 mois',
      'Intégrations Doctolib Pro / Google Calendar / Outlook',
      'Formation 4h + documentation vidéo personnalisée',
      '2 séances stratégie digitale / mois pendant 3 mois',
      'Hébergement HDS + ISO 27001',
      'Pentest initial à la livraison',
      'MFA admin + espaces patients',
      'Plan de continuité d’activité (RTO < 4h, RPO < 1h)',
    ],
    notIncluded: [
      'Budget média publicitaire',
      'Shooting vidéo corporate',
      'Application mobile native (PWA incluse)',
      'Intégrations legacy sans API',
      'Traductions au-delà de 2 langues',
      'Rédaction illimitée (option disponible)',
      'Community management quotidien',
      'Développements sur-mesure hors scope',
    ],
    options: [
      { label: 'Application mobile native iOS + Android', price: '+4 490 € HT' },
      { label: 'Vidéo corporate + 5 témoignages filmés', price: '+2 900 € HT' },
      { label: 'Community management complet', price: '+890 € HT/mois' },
      { label: 'Gestion campagnes Ads', price: '15% du media (min 490 €/mois)' },
      { label: 'Rédaction illimitée (jusqu’à 8 articles/mois)', price: '+790 € HT/mois' },
      { label: 'DPO externe dédié continu', price: '+390 € HT/mois' },
      { label: 'Pentest annuel récurrent', price: '+1 200 € HT/an' },
    ],
    abonnement: {
      included: [
        'Hébergement cloud dédié HDS + CDN global',
        'Domaine + SSL EV + sécurité renforcée',
        'Sauvegardes temps réel + PRA',
        'Mises à jour proactives + patchs immédiats',
        'Support dédié 7j/7 (délai 2h)',
        'Modifications de contenu illimitées',
        'Optimisation continue SEO technique',
        'Rapport hebdomadaire + alertes',
        'Réunion mensuelle de suivi stratégique (1h)',
        'Licences enterprise incluses',
        'Veille sécurité mensuelle + alertes CVE',
      ],
      notIncluded: [
        'Refonte graphique majeure',
        'Fonctionnalités hors scope',
        'Budget publicitaire',
        'Rédaction illimitée (option)',
        'Community management',
        'Formation au-delà de 4h initiales',
      ],
    },
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Mon site doit-il être HDS ?',
    a: "L'hébergement HDS est obligatoire dès que votre site stocke des données de santé à caractère personnel (identité + historique de soins, dossiers patients, comptes-rendus). Pour un site vitrine simple avec lien Doctolib et formulaire de contact sans base de données, l'HDS n'est pas requis. Les Packs Pro Santé et Premium incluent systématiquement l'hébergement HDS certifié.",
  },
  {
    q: 'Puis-je garder mon Doctolib ?',
    a: "Oui, et c'est même recommandé. Doctolib est un excellent moteur de réservation, mais ce n'est pas votre vitrine. Votre site web référence votre nom propre sur Google et présente votre expertise. Nous intégrons un bouton Doctolib (header sticky, hero, page contact) pour faciliter la prise de rendez-vous, tout en valorisant votre identité de praticien.",
  },
  {
    q: 'Qui rédige les textes du site ?',
    a: 'Par défaut, vous fournissez les textes — vous connaissez votre métier mieux que personne. Nous proposons une option "Rédaction SEO" pour confier la production à nos rédacteurs spécialisés santé (briefs collaboratifs, optimisation pour Google, ton adapté au monde médical).',
  },
  {
    q: 'Et si je veux changer un tarif ou un horaire après livraison ?',
    a: 'Les modifications de contenu (texte, tarif, horaire, photo) sont incluses selon votre pack : 2/mois en Vitrine Pro, 5/mois en Pro Santé, illimitées en Premium. Pour le Pack Vitrine Santé de base, ces modifications sont facturées en dehors de l\'abonnement (formule économique pour les libéraux qui ne touchent presque jamais à leur site).',
  },
  {
    q: 'Combien de temps dure la création ?',
    a: 'De 5 à 8 jours pour le Pack Vitrine Santé, 3 à 4 semaines pour le Vitrine Pro + Blog, 6 à 8 semaines pour le Pro Santé, 8 à 12 semaines pour le Premium. Les délais courent à compter de la réception de tous vos contenus et validations.',
  },
  {
    q: 'Mes données et celles de mes patients sont-elles sécurisées ?',
    a: 'Oui : SSL/HTTPS systématique, hébergement France/Europe, sauvegardes automatiques, mises à jour de sécurité incluses dans tous les packs. Pour les Packs Pro Santé et Premium qui stockent des données patients, nous utilisons un hébergement HDS certifié (agrément du Ministère de la Santé), avec chiffrement AES-256, TLS 1.3, traçabilité des accès et pseudonymisation des logs.',
  },
  {
    q: 'Puis-je payer en plusieurs fois ?',
    a: 'Oui : 40% à la commande, 30% à la validation des maquettes, 30% à la livraison. L\'abonnement maintenance est ensuite prélevé automatiquement chaque mois (SEPA ou CB).',
  },
  {
    q: 'Que se passe-t-il si je veux arrêter l\'abonnement ?',
    a: 'Après les 12 mois d\'engagement initial, l\'abonnement est résiliable à tout moment avec un préavis de 30 jours. Vous récupérez l\'export complet de votre site (fichiers + base de données) et restez propriétaire de votre nom de domaine.',
  },
  {
    q: 'Le site sera-t-il bien référencé sur Google ?',
    a: 'Oui : optimisation SEO locale incluse dans tous les packs, schema.org MedicalBusiness, connexion à votre Google Business Profile, balises meta optimisées, sitemap XML. Pour aller plus loin (rédaction d\'articles SEO réguliers, netlinking santé), nous proposons des options dédiées.',
  },
  {
    q: 'Proposez-vous la prise de rendez-vous en ligne ?',
    a: 'Oui : à partir du Pack Pro Santé, la réservation en ligne est intégrée nativement au site (créneaux par praticien, durées variables, rappels SMS/Email). Pour les Packs Vitrine et Vitrine Pro, nous intégrons un lien fluide vers Doctolib/KelDoc/Maiia (header sticky, hero, contact).',
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Avant, je passais 30 minutes par jour au téléphone à gérer les rendez-vous. Maintenant, mes patients réservent directement en ligne. J'ai gagné 2 heures par semaine.",
    name: 'Marie L.',
    role: 'Ostéopathe D.O.',
    city: 'Lyon',
    initials: 'ML',
    color: 'bg-rose-100 text-rose-700',
  },
  {
    quote:
      "Le site était en ligne en 8 jours. La formation de 30 minutes m'a suffi pour comprendre comment changer un horaire ou une photo. Très simple à utiliser.",
    name: 'Thomas B.',
    role: 'Kinésithérapeute',
    city: 'Marseille',
    initials: 'TB',
    color: 'bg-cyan-100 text-cyan-700',
  },
  {
    quote:
      'Nous sommes 4 praticiens dans la maison de santé. La gestion des plannings et les rappels SMS ont vraiment changé notre quotidien.',
    name: 'Dr. Sarah K.',
    role: 'Maison de santé',
    city: 'Nantes',
    initials: 'SK',
    color: 'bg-emerald-100 text-emerald-700',
  },
];

const METIERS = [
  'Ostéopathes',
  'Kinésithérapeutes',
  'Infirmiers à domicile',
  'Sage-femmes',
  'Podologues',
  'Psychomotriciens',
];

const COMPLIANCE_BADGES = [
  { label: 'RGPD Santé', icon: ShieldCheck },
  { label: 'HDS Hébergement', icon: Lock },
  { label: 'Hébergement France', icon: Globe },
  { label: 'Doctolib-ready', icon: HeartPulse },
];

const PROCESSUS = [
  {
    icon: MessageCircle,
    title: 'Cadrage',
    duration: '30 min',
    desc: 'Vous nous parlez de votre cabinet. On vous conseille le bon pack et on définit le périmètre.',
    bring: 'Vos besoins, votre vision',
  },
  {
    icon: Code2,
    title: 'Création',
    duration: '5 à 15 jours',
    desc: 'On construit votre site. Vous validez 2-3 captures d’écran intermédiaires. Pas de surprise à la fin.',
    bring: 'Vos textes, photos, logo',
  },
  {
    icon: Rocket,
    title: 'Mise en ligne',
    duration: '1 jour',
    desc: 'Formation incluse pour votre équipe. Votre site est vivant. On reste disponible pour le suivi.',
    bring: '30 min de votre temps',
  },
];

const PROBLEMS = [
  {
    icon: ShieldCheck,
    title: 'Je ne veux pas faire d’erreur avec les données patients',
    text: 'Nous connaissons la réglementation HDS. Vous n’avez pas besoin de devenir expert en conformité — on s’occupe de tout, du bon hébergement aux mentions légales santé.',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: Clock,
    title: 'Je n’ai pas le temps de gérer un site',
    text: 'Maintenance, sauvegardes, mises à jour de sécurité : tout est inclus dans l’abonnement mensuel. Vous ne touchez à rien, vous restez concentré sur vos patients.',
    color: 'text-teal-600 bg-teal-50',
  },
  {
    icon: Globe,
    title: 'Doctolib me suffit, non ?',
    text: 'Doctolib est un annuaire. Votre site, c’est VOTRE vitrine. Google référence votre nom, pas celui de Doctolib. Un site pro = plus de crédibilité + meilleur référencement local.',
    color: 'text-cyan-600 bg-cyan-50',
  },
  {
    icon: ThumbsUp,
    title: 'J’ai déjà eu une mauvaise expérience',
    text: 'Devis transparent, livraison garantie, 3 révisions de maquettes incluses. Pas de surprise, pas de frais cachés, un interlocuteur dédié du début à la fin.',
    color: 'text-violet-600 bg-violet-50',
  },
];

const COMPARE_ROWS: { label: string; values: (string | boolean)[] }[] = [
  { label: 'Pages livrées', values: ['5 pages', '10 pages', '20+ pages', 'Multi-sites'] },
  { label: 'Blog CMS autonome', values: [false, true, true, true] },
  { label: 'Réservation en ligne intégrée', values: [false, false, true, true] },
  { label: 'Espace patient sécurisé', values: [false, false, true, true] },
  { label: 'Rappels SMS / Email', values: [false, false, true, true] },
  { label: 'Hébergement HDS', values: [false, false, true, true] },
  { label: 'Multi-praticiens', values: [false, false, true, true] },
  { label: 'CRM + Marketing automation', values: [false, false, false, true] },
  { label: 'Multi-sites', values: [false, false, false, true] },
  { label: 'Modifs incluses / mois', values: ['—', '2', '5', 'Illimité'] },
];

// ═══════════════════════════════════════════════════════════════════════════
// SCHÉMA ZOD du formulaire de devis
// ═══════════════════════════════════════════════════════════════════════════

const PHONE_REGEX = /^(?:\+33|0)[1-9](?:[ .-]?\d{2}){4}$/;

const quoteSchema = z.object({
  fullName: z.string().min(2, 'Au moins 2 caractères'),
  metier: z.enum(['osteopathe', 'kine', 'infirmier', 'sage-femme', 'autre'], {
    errorMap: () => ({ message: 'Sélectionnez votre métier' }),
  }),
  ville: z.string().min(2, 'Indiquez votre ville'),
  phone: z.string().regex(PHONE_REGEX, 'Numéro de téléphone invalide'),
  email: z.string().email('Email invalide'),
  pack: z.enum(['vitrine', 'pro-blog', 'pro-sante', 'premium']).optional().or(z.literal('')),
  message: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Consentement requis' }),
  }),
});

type QuoteFormValues = z.input<typeof quoteSchema>;

// ═══════════════════════════════════════════════════════════════════════════
// SIMULATEUR — logique
// ═══════════════════════════════════════════════════════════════════════════

function recommendPack(
  exercice: 'solo' | 'duo' | 'trio' | 'centre',
  besoin: 'simple' | 'blog' | 'multi',
  donnees: 'oui' | 'non'
): PackId {
  if (donnees === 'oui' || besoin === 'multi' || exercice === 'centre') {
    if (exercice === 'centre' && besoin === 'multi') return 'premium';
    return 'pro-sante';
  }
  if (besoin === 'blog' || exercice === 'duo' || exercice === 'trio') return 'pro-blog';
  return 'vitrine';
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export function SantePageClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [prefilledPack, setPrefilledPack] = useState<PackId | undefined>(undefined);
  const [highlightedPack, setHighlightedPack] = useState<PackId | null>(null);

  const openQuote = (pack?: PackId) => {
    setPrefilledPack(pack);
    setQuoteOpen(true);
  };

  const scrollToPacks = () => {
    document.getElementById('packs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSimulatorResult = (pack: PackId) => {
    setHighlightedPack(pack);
    setTimeout(() => {
      document.getElementById(`pack-${pack}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
    setTimeout(() => setHighlightedPack(null), 3500);
  };

  // GSAP : reveal au scroll + parallax mockup hero + float
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      reveals.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      const slidesL = gsap.utils.toArray<HTMLElement>('[data-slide-left]');
      slidesL.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          x: -50,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });
      const slidesR = gsap.utils.toArray<HTMLElement>('[data-slide-right]');
      slidesR.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          x: 50,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      // Parallax léger sur l'image héro
      const mockup = containerRef.current?.querySelector<HTMLElement>('.hero-mockup');
      if (mockup) {
        gsap.to(mockup, {
          y: -50,
          ease: 'none',
          scrollTrigger: { trigger: mockup, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }

      // Float infinite (subtil) sur le mockup hero
      const floater = containerRef.current?.querySelector<HTMLElement>('.hero-float');
      if (floater) {
        gsap.to(floater, {
          y: 12,
          duration: 3.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Header />
      <div ref={containerRef} className="bg-white text-slate-800 overflow-x-hidden">
        <HeroSection onOpenQuote={() => openQuote()} onScrollToPacks={scrollToPacks} />
        <TrustBar />
        <ProblemSolutionSection />
        <SimulatorSection onResult={handleSimulatorResult} onChoose={(p) => openQuote(p)} />
        <PacksSection
          highlightedPack={highlightedPack}
          onChoosePack={(p) => openQuote(p)}
        />
        <ExampleSiteSection />
        <TestimonialsCarousel />
        <ProcessTimeline />
        <FaqSection />
        <GuaranteesSection />
        <FinalCTA onOpenQuote={() => openQuote()} />
      </div>
      <Footer />
      <QuoteModal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        prefilledPack={prefilledPack}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1 — HERO
// ═══════════════════════════════════════════════════════════════════════════

function HeroSection({
  onOpenQuote,
  onScrollToPacks,
}: {
  onOpenQuote: () => void;
  onScrollToPacks: () => void;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-emerald-50 pt-28 pb-20 md:pt-32 md:pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.10),transparent_60%)] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7" data-reveal>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-teal-200 text-teal-700 text-sm font-medium mb-6">
            <Stethoscope className="w-4 h-4" />
            Spécialiste santé & paramédical
          </span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-slate-900">
            Votre cabinet mérite un site à la{' '}
            <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-500 bg-clip-text text-transparent">
              hauteur de votre expertise
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
            Sites web conçus pour les <strong>ostéopathes, kinésithérapeutes et infirmiers
            libéraux</strong>. Conformes RGPD/HDS, hébergés en France, livrés en{' '}
            <strong>1 semaine</strong>.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onScrollToPacks}
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-lg shadow-teal-600/20 h-12 px-8"
            >
              Voir les forfaits
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              onClick={onOpenQuote}
              variant="outline"
              size="lg"
              className="bg-white border-teal-300 text-teal-700 hover:bg-teal-50 hover:text-teal-800 h-12 px-8"
            >
              Demander un devis gratuit
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, label: 'Conforme RGPD Santé', color: 'text-emerald-600' },
              { icon: Globe, label: 'Hébergement France', color: 'text-teal-600' },
              { icon: HeartPulse, label: 'Intégration Doctolib', color: 'text-cyan-600' },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <Icon className={cn('w-5 h-5', color)} />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5" data-reveal>
          <div className="hero-mockup relative">
            <div className="hero-float relative rounded-3xl overflow-hidden shadow-2xl shadow-teal-600/20 border border-white/60 bg-white">
              <Image
                src="/assets/site_osteo.png"
                alt="Aperçu d'un site web pour ostéopathe créé par Neuraweb"
                width={800}
                height={1200}
                priority
                className="w-full h-auto"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-emerald-200 hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700">En ligne en 8 jours</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 border border-teal-200 hidden sm:flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-xs font-semibold text-slate-700">SEO local inclus</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2 — TRUST BAR
// ═══════════════════════════════════════════════════════════════════════════

function TrustBar() {
  return (
    <section className="bg-slate-50 py-12 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-reveal>
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500 mb-8">
          Conçu pour les professionnels de santé
        </p>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-3 mb-10 px-1">
            {METIERS.map((m) => (
              <span
                key={m}
                className="shrink-0 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-medium text-sm shadow-sm"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {COMPLIANCE_BADGES.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-teal-600" />
              </div>
              <span className="font-semibold text-sm text-slate-800">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3 — PROBLÈME / SOLUTION
// ═══════════════════════════════════════════════════════════════════════════

function ProblemSolutionSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16" data-reveal>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Pourquoi une agence{' '}
            <span className="text-teal-600">spécialisée santé</span> ?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Nous comprenons les contraintes spécifiques de votre métier — réglementation, temps,
            crédibilité, confiance.
          </p>
        </div>

        <div className="space-y-12 md:space-y-16">
          {PROBLEMS.map(({ icon: Icon, title, text, color }, idx) => (
            <div
              key={title}
              className={cn(
                'grid md:grid-cols-12 gap-8 items-center',
                idx % 2 === 1 && 'md:[&>div:first-child]:order-2'
              )}
            >
              <div
                className="md:col-span-5"
                {...(idx % 2 === 0 ? { 'data-slide-left': true } : { 'data-slide-right': true })}
              >
                <div
                  className={cn(
                    'inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-4',
                    color
                  )}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">{title}</h3>
              </div>
              <div
                className="md:col-span-7"
                {...(idx % 2 === 0 ? { 'data-slide-right': true } : { 'data-slide-left': true })}
              >
                <p className="text-lg text-slate-600 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4 — SIMULATEUR
// ═══════════════════════════════════════════════════════════════════════════

function SimulatorSection({
  onResult,
  onChoose,
}: {
  onResult: (pack: PackId) => void;
  onChoose: (pack: PackId) => void;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [exercice, setExercice] = useState<'solo' | 'duo' | 'trio' | 'centre' | null>(null);
  const [besoin, setBesoin] = useState<'simple' | 'blog' | 'multi' | null>(null);
  const [donnees, setDonnees] = useState<'oui' | 'non' | null>(null);
  const [result, setResult] = useState<PackId | null>(null);

  const reset = () => {
    setStep(1);
    setExercice(null);
    setBesoin(null);
    setDonnees(null);
    setResult(null);
  };

  const computeResult = (d: 'oui' | 'non') => {
    if (!exercice || !besoin) return;
    const pack = recommendPack(exercice, besoin, d);
    setResult(pack);
  };

  const recommendedPack = result ? PACKS.find((p) => p.id === result) : null;

  return (
    <section className="py-20 md:py-24 bg-gradient-to-br from-teal-50 via-cyan-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" data-reveal>
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-sm font-semibold mb-4">
            Outil interactif
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Quel pack vous correspond ?
          </h2>
          <p className="text-slate-600">
            3 questions, 30 secondes — recommandation personnalisée.
          </p>
        </div>

        {!open ? (
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => setOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg h-12 px-8"
            >
              <Sparkles className="mr-2 w-5 h-5" />
              Trouver mon pack en 30 secondes
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-teal-100 p-6 sm:p-10">
            {!result && (
              <div className="mb-6 flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      'h-1.5 rounded-full flex-1 transition-colors',
                      s <= step ? 'bg-teal-600' : 'bg-slate-200'
                    )}
                  />
                ))}
                <span className="ml-3 text-sm font-medium text-slate-500">
                  Étape {step}/3
                </span>
              </div>
            )}

            {!result && step === 1 && (
              <SimulatorStep
                question="Vous exercez..."
                options={[
                  { value: 'solo', label: 'Seul(e)' },
                  { value: 'duo', label: 'À 2' },
                  { value: 'trio', label: 'À 3 ou plus' },
                  { value: 'centre', label: 'Centre médical' },
                ]}
                onSelect={(v) => {
                  setExercice(v as typeof exercice extends infer T ? Exclude<T, null> : never);
                  setStep(2);
                }}
              />
            )}
            {!result && step === 2 && (
              <SimulatorStep
                question="Vous souhaitez..."
                options={[
                  { value: 'simple', label: 'Un site simple avec lien Doctolib' },
                  { value: 'blog', label: 'Un site avec blog et réservation' },
                  { value: 'multi', label: 'Une plateforme complète multi-praticiens' },
                ]}
                onSelect={(v) => {
                  setBesoin(v as typeof besoin extends infer T ? Exclude<T, null> : never);
                  setStep(3);
                }}
              />
            )}
            {!result && step === 3 && (
              <SimulatorStep
                question="Vous stockez des données patients sur le site ?"
                options={[
                  { value: 'non', label: 'Non, jamais' },
                  { value: 'oui', label: 'Oui, historique et documents' },
                ]}
                onSelect={(v) => {
                  setDonnees(v as 'oui' | 'non');
                  computeResult(v as 'oui' | 'non');
                }}
              />
            )}

            {result && recommendedPack && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-sm mb-6">
                  <Check className="w-4 h-4" />
                  Pack recommandé pour vous
                </div>
                <h3 className="font-display text-3xl font-bold text-slate-900 mb-3">
                  {recommendedPack.name}
                </h3>
                <p className="text-slate-600 mb-2">{recommendedPack.tagline}</p>
                <div className="flex items-baseline justify-center gap-2 mb-6">
                  <span className="text-4xl font-extrabold text-teal-600">
                    {recommendedPack.price.toLocaleString('fr-FR')} €
                  </span>
                  <span className="text-slate-500">HT + {recommendedPack.monthly} €/mois</span>
                </div>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Basé sur vos réponses, le <strong>{recommendedPack.name}</strong> correspond le
                  mieux à votre situation.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    size="lg"
                    onClick={() => {
                      onResult(result);
                      onChoose(result);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Choisir ce pack
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={reset}
                    className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Recommencer
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function SimulatorStep({
  question,
  options,
  onSelect,
}: {
  question: string;
  options: { value: string; label: string }[];
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-2xl font-bold text-slate-900 mb-6">{question}</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className="group flex items-center justify-between text-left p-4 rounded-xl border-2 border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all"
          >
            <span className="font-medium text-slate-800">{opt.label}</span>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 5 — PACKS
// ═══════════════════════════════════════════════════════════════════════════

function PacksSection({
  highlightedPack,
  onChoosePack,
}: {
  highlightedPack: PackId | null;
  onChoosePack: (id: PackId) => void;
}) {
  const [showCompare, setShowCompare] = useState(false);
  const [detailsPack, setDetailsPack] = useState<Pack | null>(null);

  return (
    <section id="packs" className="py-16 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14" data-reveal>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Choisissez votre <span className="text-teal-600">pack</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            4 forfaits pensés pour les professionnels de santé. Engagement 12 mois, prix HT,
            tout est inclus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {PACKS.map((pack) => {
            const highlighted = highlightedPack === pack.id;
            return (
              <div
                key={pack.id}
                id={`pack-${pack.id}`}
                data-reveal
                className={cn(
                  'relative rounded-2xl md:rounded-3xl border-2 p-5 sm:p-6 flex flex-col bg-white transition-all duration-300',
                  pack.borderColor,
                  pack.bgAccent,
                  highlighted && 'ring-4 ring-offset-2 animate-pulse',
                  highlighted && pack.ringColor
                )}
              >
                {pack.badge && (
                  <div
                    className={cn(
                      'absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md whitespace-nowrap',
                      pack.badgeColor
                    )}
                  >
                    {pack.badge}
                  </div>
                )}

                <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                  {pack.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4">{pack.profil}</p>

                <div className="mb-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                    {pack.price.toLocaleString('fr-FR')} €
                  </span>
                  <span className="ml-1 text-sm text-slate-500">HT</span>
                </div>
                <div className="text-sm text-slate-600 mb-1">
                  + <strong>{pack.monthly} €</strong>
                  <span className="text-slate-500"> HT / mois</span>
                </div>
                <p className="text-xs text-slate-400 mb-5 sm:mb-6">Engagement 12 mois</p>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {pack.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => onChoosePack(pack.id)}
                  className={cn(
                    'w-full mb-2 text-white shadow-md',
                    pack.id === 'vitrine' && 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20',
                    pack.id === 'pro-blog' && 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20',
                    pack.id === 'pro-sante' && 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
                    pack.id === 'premium' && 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 shadow-cyan-600/20'
                  )}
                >
                  Choisir ce pack
                </Button>

                <button
                  type="button"
                  onClick={() => setDetailsPack(pack)}
                  className="w-full text-sm font-medium text-slate-600 hover:text-teal-700 py-2 transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  Voir les détails complets
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12 md:mt-14" data-reveal>
          <button
            type="button"
            onClick={() => setShowCompare((v) => !v)}
            className="inline-flex items-center gap-2 text-teal-700 font-semibold hover:text-teal-800 transition-colors"
          >
            {showCompare ? 'Masquer le comparatif' : 'Voir le tableau comparatif détaillé'}
            <ChevronRight
              className={cn(
                'w-4 h-4 transition-transform',
                showCompare && 'rotate-90'
              )}
            />
          </button>

          {showCompare && (
            <div className="mt-8 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[640px] text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-700"></th>
                    {PACKS.map((p) => (
                      <th
                        key={p.id}
                        className="p-3 font-bold text-center text-slate-900 border-l border-slate-200"
                      >
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, idx) => (
                    <tr key={row.label} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="p-3 text-left font-medium text-slate-700">{row.label}</td>
                      {row.values.map((v, i) => (
                        <td
                          key={i}
                          className="p-3 text-center text-slate-700 border-l border-slate-200"
                        >
                          {typeof v === 'boolean' ? (
                            v ? (
                              <Check className="w-5 h-5 text-emerald-600 inline" />
                            ) : (
                              <XIcon className="w-5 h-5 text-slate-300 inline" />
                            )
                          ) : (
                            <span className="font-medium">{v}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <PackDetailsModal
        pack={detailsPack}
        onClose={() => setDetailsPack(null)}
        onChoose={(id) => {
          setDetailsPack(null);
          onChoosePack(id);
        }}
      />
    </section>
  );
}

function PackDetailsModal({
  pack,
  onClose,
  onChoose,
}: {
  pack: Pack | null;
  onClose: () => void;
  onChoose: (id: PackId) => void;
}) {
  return (
    <Dialog open={!!pack} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white text-slate-900 border border-slate-200">
        {pack && (
          <>
            <DialogHeader
              className={cn(
                'sticky top-0 z-10 px-5 sm:px-7 py-5 border-b border-slate-200 bg-gradient-to-br from-white to-cyan-50/60 rounded-t-lg'
              )}
            >
              <div className="flex items-start gap-3 pr-8">
                <div className="flex-1 min-w-0">
                  {pack.badge && (
                    <span
                      className={cn(
                        'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white mb-2',
                        pack.badgeColor
                      )}
                    >
                      {pack.badge}
                    </span>
                  )}
                  <DialogTitle className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                    {pack.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-600 mt-1">
                    {pack.profil} — {pack.tagline}
                  </DialogDescription>
                  <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {pack.price.toLocaleString('fr-FR')} €
                    </span>
                    <span className="text-sm text-slate-500">HT</span>
                    <span className="text-sm text-slate-600">
                      + <strong>{pack.monthly} €</strong> HT / mois
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="px-5 sm:px-7 py-5 bg-white">
              <PackDetails pack={pack} />
            </div>

            <div className="sticky bottom-0 z-10 px-5 sm:px-7 py-4 border-t border-slate-200 bg-white rounded-b-lg flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                Fermer
              </Button>
              <Button
                onClick={() => onChoose(pack.id)}
                className={cn(
                  'text-white shadow-md',
                  pack.id === 'vitrine' && 'bg-teal-600 hover:bg-teal-700',
                  pack.id === 'pro-blog' && 'bg-cyan-600 hover:bg-cyan-700',
                  pack.id === 'pro-sante' && 'bg-emerald-600 hover:bg-emerald-700',
                  pack.id === 'premium' && 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700'
                )}
              >
                Choisir ce pack
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

type PackTabId = 'included' | 'notIncluded' | 'options' | 'subscription';

const PACK_TABS: {
  id: PackTabId;
  label: string;
  shortLabel: string;
  icon: typeof Check;
  accent: string;
  activeClass: string;
}[] = [
  {
    id: 'included',
    label: 'Inclus',
    shortLabel: 'Inclus',
    icon: Check,
    accent: 'emerald',
    activeClass: 'bg-emerald-600 text-white shadow-sm',
  },
  {
    id: 'notIncluded',
    label: 'Non inclus',
    shortLabel: 'Non inclus',
    icon: XIcon,
    accent: 'rose',
    activeClass: 'bg-rose-500 text-white shadow-sm',
  },
  {
    id: 'options',
    label: 'Options',
    shortLabel: 'Options',
    icon: Plus,
    accent: 'teal',
    activeClass: 'bg-teal-600 text-white shadow-sm',
  },
  {
    id: 'subscription',
    label: 'Abonnement',
    shortLabel: 'Abonnement',
    icon: Repeat,
    accent: 'cyan',
    activeClass: 'bg-cyan-600 text-white shadow-sm',
  },
];

function PackDetails({ pack }: { pack: Pack }) {
  const [activeTab, setActiveTab] = useState<PackTabId>('included');
  const activeIndex = PACK_TABS.findIndex((t) => t.id === activeTab);

  const goPrev = () => {
    const i = Math.max(0, activeIndex - 1);
    setActiveTab(PACK_TABS[i].id);
  };
  const goNext = () => {
    const i = Math.min(PACK_TABS.length - 1, activeIndex + 1);
    setActiveTab(PACK_TABS[i].id);
  };

  return (
    <div className="text-sm text-left">
      {/* Bandeau livraison + HDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 border border-slate-200">
            <Truck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Livraison
            </p>
            <p className="text-sm font-semibold text-slate-900 truncate">{pack.delivery}</p>
          </div>
        </div>
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 border',
            pack.hds
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-slate-50 border-slate-200'
          )}
        >
          <div
            className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border',
              pack.hds ? 'bg-white border-emerald-200' : 'bg-white border-slate-200'
            )}
          >
            <Lock className={cn('w-4 h-4', pack.hds ? 'text-emerald-600' : 'text-slate-400')} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Conformité
            </p>
            <p className="text-sm font-semibold text-slate-900 truncate">
              {pack.hds ? 'Hébergement HDS inclus' : 'RGPD santé conforme'}
            </p>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div
        role="tablist"
        aria-label="Détails du pack"
        className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 mb-4"
      >
        {PACK_TABS.map((t) => {
          const Icon = t.icon;
          const counts = {
            included: pack.included.length,
            notIncluded: pack.notIncluded.length,
            options: pack.options.length,
            subscription:
              pack.abonnement.included.length + pack.abonnement.notIncluded.length,
          }[t.id];
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={cn(
                'group flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all',
                isActive
                  ? t.activeClass
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              )}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t.shortLabel}</span>
              <span
                className={cn(
                  'ml-0 sm:ml-1 hidden sm:inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1',
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                )}
              >
                {counts}
              </span>
            </button>
          );
        })}
      </div>

      {/* Conteneur slide animé */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div
          className="flex transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {/* Inclus */}
          <div className="w-full shrink-0 p-4 sm:p-5" aria-hidden={activeTab !== 'included'}>
            <ul className="space-y-2">
              {pack.included.map((i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg p-2 -mx-2 hover:bg-emerald-50/60 transition-colors"
                >
                  <span className="mt-0.5 inline-flex w-5 h-5 rounded-full bg-emerald-100 items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-700" />
                  </span>
                  <span className="text-slate-700 leading-snug">{i}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Non inclus */}
          <div className="w-full shrink-0 p-4 sm:p-5" aria-hidden={activeTab !== 'notIncluded'}>
            <p className="text-xs text-slate-500 mb-3">
              Ces éléments ne sont pas couverts par ce pack — voir l’onglet{' '}
              <button
                type="button"
                onClick={() => setActiveTab('options')}
                className="font-semibold text-teal-700 hover:underline"
              >
                Options
              </button>{' '}
              pour les ajouts disponibles.
            </p>
            <ul className="space-y-2">
              {pack.notIncluded.map((i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg p-2 -mx-2"
                >
                  <span className="mt-0.5 inline-flex w-5 h-5 rounded-full bg-rose-50 items-center justify-center shrink-0">
                    <XIcon className="w-3 h-3 text-rose-600" />
                  </span>
                  <span className="text-slate-600 leading-snug">{i}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Options */}
          <div className="w-full shrink-0 p-4 sm:p-5" aria-hidden={activeTab !== 'options'}>
            <p className="text-xs text-slate-500 mb-3">
              Ajouts à la carte facturés une fois, en supplément du pack.
            </p>
            <ul className="space-y-2">
              {pack.options.map((o) => (
                <li
                  key={o.label}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5"
                >
                  <span className="text-slate-700 leading-snug">{o.label}</span>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    {o.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Abonnement */}
          <div className="w-full shrink-0 p-4 sm:p-5" aria-hidden={activeTab !== 'subscription'}>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-extrabold text-cyan-700">
                {pack.monthly} €
              </span>
              <span className="text-xs text-slate-500">HT / mois — engagement 12 mois</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-2 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Comprend
                </p>
                <ul className="space-y-1.5">
                  {pack.abonnement.included.map((i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700 leading-snug">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1">
                  <XIcon className="w-3 h-3" /> Hors abonnement
                </p>
                <ul className="space-y-1.5">
                  {pack.abonnement.notIncluded.map((i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-slate-500 leading-snug">
                      <XIcon className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Flèches navigation entre onglets */}
        <div className="flex items-center justify-between border-t border-slate-200 px-2 py-1.5 bg-slate-50/60">
          <button
            type="button"
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-teal-700 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-colors"
            aria-label="Onglet précédent"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {activeIndex > 0 ? PACK_TABS[activeIndex - 1].shortLabel : 'Précédent'}
          </button>
          <div className="flex items-center gap-1">
            {PACK_TABS.map((t, i) => (
              <span
                key={t.id}
                aria-hidden
                className={cn(
                  'h-1 rounded-full transition-all',
                  i === activeIndex ? 'w-5 bg-teal-600' : 'w-1.5 bg-slate-300'
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={goNext}
            disabled={activeIndex === PACK_TABS.length - 1}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-teal-700 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-colors"
            aria-label="Onglet suivant"
          >
            {activeIndex < PACK_TABS.length - 1 ? PACK_TABS[activeIndex + 1].shortLabel : 'Suivant'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Réassurance bas de modal — boost conversion */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="flex items-center gap-2 rounded-lg bg-teal-50 border border-teal-100 px-3 py-2 text-xs text-teal-800">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Devis gratuit sous 24h</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-cyan-50 border border-cyan-100 px-3 py-2 text-xs text-cyan-800">
          <Globe className="w-4 h-4 shrink-0" />
          <span>Hébergement France</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2 text-xs text-emerald-800">
          <HeartPulse className="w-4 h-4 shrink-0" />
          <span>Spécialiste santé</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 6 — SITE EXEMPLE (Arthur P.)
// ═══════════════════════════════════════════════════════════════════════════

function ExampleSiteSection() {
  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div data-slide-left>
            <span className="inline-block px-3 py-1.5 rounded-full bg-cyan-100 text-cyan-700 text-sm font-semibold mb-4">
              Cas concret
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Le site d’<span className="text-teal-600">Arthur P.</span>, ostéopathe à Paris
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Un site vitrine élégant, livré en <strong>8 jours</strong>, optimisé pour le
              référencement local parisien et connecté à Doctolib. Découvrez un exemple concret de
              ce que nous pouvons construire pour votre cabinet.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Design sur-mesure adapté à l’univers santé',
                'Hébergement France + RGPD',
                'Connexion Google Business Profile',
                'Référencement local Paris (Pack Vitrine)',
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-slate-700">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://neuraweb-sante.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors shadow-lg shadow-teal-600/20"
            >
              Voir le site en ligne
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div data-slide-right>
            <a
              href="https://neuraweb-sante.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="block group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/30 to-cyan-500/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group-hover:scale-[1.02] transition-transform duration-500">
                <Image
                  src="/assets/site_osteo.png"
                  alt="Aperçu du site web d'Arthur P., ostéopathe à Paris — exemple Neuraweb"
                  width={800}
                  height={1200}
                  className="w-full h-auto"
                  sizes="(min-width: 1024px) 50vw, 90vw"
                />
              </div>
              <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <ExternalLink className="w-3 h-3" />
                Cliquer pour voir
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 7 — TÉMOIGNAGES
// ═══════════════════════════════════════════════════════════════════════════

function TestimonialsCarousel() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14" data-reveal>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Ils nous font <span className="text-teal-600">confiance</span>
          </h2>
          <p className="text-lg text-slate-600">
            Des praticiens libéraux qui ont gagné du temps grâce à leur site.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              data-reveal
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex gap-1 mb-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-slate-700 leading-relaxed flex-1 mb-6 italic">
                &laquo; {t.quote} &raquo;
              </blockquote>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm',
                    t.color
                  )}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-sm text-slate-500">
                    {t.role} — {t.city}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 8 — PROCESSUS
// ═══════════════════════════════════════════════════════════════════════════

function ProcessTimeline() {
  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14" data-reveal>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Comment ça <span className="text-teal-600">se passe</span> ?
          </h2>
          <p className="text-lg text-slate-600">3 étapes claires, du cadrage à la mise en ligne.</p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8">
          <div
            className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-teal-200 via-cyan-200 to-emerald-200"
            aria-hidden
          />
          {PROCESSUS.map(({ icon: Icon, title, duration, desc, bring }, idx) => (
            <div key={title} data-reveal className="relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold shadow-lg">
                {idx + 1}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-4 mt-2">
                <Icon className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-1">{title}</h3>
              <p className="text-sm font-semibold text-teal-600 mb-3">{duration}</p>
              <p className="text-slate-600 leading-relaxed mb-4">{desc}</p>
              <p className="text-xs text-slate-500">
                <strong className="text-slate-700">À fournir :</strong> {bring}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 9 — FAQ
// ═══════════════════════════════════════════════════════════════════════════

function FaqSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-reveal>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Questions <span className="text-teal-600">fréquentes</span>
          </h2>
          <p className="text-lg text-slate-600">
            Tout ce que les libéraux nous demandent avant de se lancer.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full" data-reveal>
          {FAQ.map((item, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="border border-slate-200 rounded-xl mb-3 overflow-hidden bg-white shadow-sm data-[state=open]:shadow-md"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline text-left font-semibold text-slate-900">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 text-slate-600 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 10 — GARANTIES
// ═══════════════════════════════════════════════════════════════════════════

function GuaranteesSection() {
  const items = [
    {
      icon: RefreshCcw,
      title: 'Satisfait ou refait',
      text: '3 révisions de maquettes incluses sans frais. On affine jusqu’à ce que ça vous plaise.',
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      icon: Lock,
      title: 'Pas de surprise',
      text: 'Devis signé = prix final. Aucun frais caché, conditions claires dès le départ.',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: UserCheck,
      title: 'Accompagnement humain',
      text: 'Pas de chatbot opaque. Un interlocuteur dédié, joignable, qui connaît votre projet.',
      color: 'text-violet-600 bg-violet-50',
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, title, text, color }) => (
            <div
              key={title}
              data-reveal
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-4', color)}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 11 — CTA FINAL
// ═══════════════════════════════════════════════════════════════════════════

function FinalCTA({ onOpenQuote }: { onOpenQuote: () => void }) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-teal-700 via-cyan-600 to-emerald-500 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-reveal>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
          Prêt à faire découvrir votre cabinet sur Google ?
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Devis gratuit sous 24h. Sans engagement.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={onOpenQuote}
            className="bg-white hover:bg-slate-50 text-teal-700 h-14 px-8 text-base font-bold shadow-2xl shadow-teal-900/30"
          >
            <Sparkles className="mr-2 w-5 h-5" />
            Demander mon devis gratuit
          </Button>
          <a
            href="tel:+33749775654"
            className="inline-flex items-center gap-2 text-white font-semibold hover:underline"
          >
            <Phone className="w-5 h-5" />
            Ou appelez-nous au 07 49 77 56 54
          </a>
        </div>

        <p className="mt-8 text-sm text-white/80">
          ⚡ Réponse garantie sous 4 heures ouvrées
        </p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MODAL DEVIS — RHF + Zod
// ═══════════════════════════════════════════════════════════════════════════

function QuoteModal({
  open,
  onClose,
  prefilledPack,
}: {
  open: boolean;
  onClose: () => void;
  prefilledPack?: PackId;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      fullName: '',
      ville: '',
      phone: '',
      email: '',
      pack: prefilledPack ?? '',
      message: '',
      consent: false as unknown as true,
    },
  });

  // Reset / prefill quand on ouvre la modal
  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setServerError(null);
      setValue('pack', prefilledPack ?? '');
    }
  }, [open, prefilledPack, setValue]);

  const handleClose = () => {
    onClose();
    setTimeout(() => reset(), 200);
  };

  const onSubmit = async (data: QuoteFormValues) => {
    setServerError(null);
    try {
      const res = await fetch('/api/sante-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error ?? 'Erreur réseau');
      }
      setSubmitted(true);
      setTimeout(() => handleClose(), 4000);
    } catch (err) {
      setServerError(
        'Impossible d’envoyer le devis. Contactez-nous au 07 49 77 56 54.'
      );
      // Log silencieux côté navigateur
      if (process.env.NODE_ENV !== 'production') console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : handleClose())}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg max-h-[90vh] overflow-y-auto bg-white text-slate-900 border border-slate-200">
        {submitted ? (
          <div className="py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900 mb-2">
              Merci ! 🎉
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              Votre devis arrive sous 24h. Nous vous recontactons par email ou téléphone.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-900">
                Demander un devis
              </DialogTitle>
              <DialogDescription className="text-slate-600">
                Réponse garantie sous 24h. Sans engagement.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Nom et prénom *
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  {...register('fullName')}
                  className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-rose-600">{errors.fullName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="metier"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Métier *
                  </label>
                  <select
                    id="metier"
                    {...register('metier')}
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Sélectionner
                    </option>
                    <option value="osteopathe">Ostéopathe</option>
                    <option value="kine">Kinésithérapeute</option>
                    <option value="infirmier">Infirmier(e)</option>
                    <option value="sage-femme">Sage-femme</option>
                    <option value="autre">Autre</option>
                  </select>
                  {errors.metier && (
                    <p className="mt-1 text-xs text-rose-600">{errors.metier.message}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="ville"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Ville *
                  </label>
                  <input
                    id="ville"
                    type="text"
                    autoComplete="address-level2"
                    {...register('ville')}
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  {errors.ville && (
                    <p className="mt-1 text-xs text-rose-600">{errors.ville.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Téléphone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="06 12 34 56 78"
                    {...register('phone')}
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="pack"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Pack qui m’intéresse
                </label>
                <select
                  id="pack"
                  {...register('pack')}
                  className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Je ne sais pas encore</option>
                  <option value="vitrine">Vitrine Santé — 990 € HT</option>
                  <option value="pro-blog">Vitrine Pro + Blog — 1 490 € HT</option>
                  <option value="pro-sante">Pro Santé — 4 490 € HT</option>
                  <option value="premium">Premium Santé — 8 900 € HT</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Message (optionnel)
                </label>
                <textarea
                  id="message"
                  rows={3}
                  {...register('message')}
                  className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                  placeholder="Parlez-nous de votre cabinet, vos besoins, vos contraintes..."
                />
              </div>

              <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('consent')}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>
                  J’accepte d’être recontacté(e) par Neuraweb au sujet de ma demande. Mes données
                  ne seront pas partagées.
                </span>
              </label>
              {errors.consent && (
                <p className="-mt-2 text-xs text-rose-600">{errors.consent.message}</p>
              )}

              {serverError && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-700">
                  {serverError}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white h-11 shadow-md shadow-teal-600/20"
              >
                {isSubmitting ? 'Envoi en cours…' : 'Envoyer ma demande'}
              </Button>

              <p className="text-xs text-center text-slate-500">
                ⚡ Réponse garantie sous 4h ouvrées
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
