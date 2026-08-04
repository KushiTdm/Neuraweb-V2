import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { JsonLd } from '@/components/json-ld';
import { generateBreadcrumbSchema } from '@/lib/structured-data';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LocalizedLink } from '@/components/localized-link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Globe,
  Smartphone,
  Brain,
  Zap,
  Check,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Users,
  ChevronRight,
  Shield,
  Lock,
  Layers,
  RefreshCw,
  Handshake,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const BASE_URL = 'https://neuraweb.fr';
const PAGE_PATH = '/fr/sous-traitance-web-lille';

// Page FR uniquement — page B2B agences (ISR 1h)
export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ lang: 'fr' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang !== 'fr') {
    return {
      title: 'Sous-traitance développement web à Lille — NeuraWeb',
      alternates: { canonical: `${BASE_URL}${PAGE_PATH}` },
    };
  }

  const ogImage = `${BASE_URL}/assets/og-image.png`;
  const title = 'Sous-traitance Développement Web à Lille — Marque Blanche';
  const description =
    'Partenaire technique en marque blanche pour agences web et studios : développement Next.js, apps mobiles, IA. Basé à Lille. NDA signé, votre marque protégée.';

  return {
    title: { absolute: title },
    description,
    keywords: [
      'sous traitance developpement web lille',
      'sous-traitance web marque blanche',
      'partenaire technique agence web',
      'développeur Next.js sous-traitance',
      'sous-traitance site internet agence',
      'white label développement web France',
      'prestataire technique agence communication',
      'externalisation développement web Lille',
      'sous-traitance application mobile',
      'freelance Next.js Hauts-de-France',
    ],
    alternates: {
      canonical: `${BASE_URL}${PAGE_PATH}`,
      languages: {
        fr: `${BASE_URL}${PAGE_PATH}`,
        'x-default': `${BASE_URL}${PAGE_PATH}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${PAGE_PATH}`,
      siteName: 'NeuraWeb',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'NeuraWeb — Sous-traitance développement web en marque blanche, Lille',
        },
      ],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@neurawebtech',
    },
  };
}

// ── JSON-LD : Service (sous-traitance en marque blanche) ─────────────────────
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${BASE_URL}${PAGE_PATH}#service`,
  name: 'Sous-traitance développement web en marque blanche',
  description:
    "Prestation technique en marque blanche pour agences web, agences de communication et studios de design : développement Next.js, applications mobiles, intégration IA et automatisation. NeuraWeb intervient sous NDA, sans contact direct avec le client final.",
  url: `${BASE_URL}${PAGE_PATH}`,
  serviceType: 'Sous-traitance développement web',
  provider: {
    '@type': 'ProfessionalService',
    name: 'NeuraWeb',
    email: 'contact@neuraweb.fr',
    url: BASE_URL,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
      addressLocality: 'Lille',
      addressRegion: 'Hauts-de-France',
      postalCode: '59000',
    },
  },
  areaServed: [
    { '@type': 'City', name: 'Lille' },
    { '@type': 'AdministrativeArea', name: 'Hauts-de-France' },
    { '@type': 'Country', name: 'France' },
  ],
  audience: {
    '@type': 'BusinessAudience',
    audienceType: 'Agences web, agences de communication, studios de design, freelances',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Prestations sous-traitées',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Développement de site Next.js en marque blanche' },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '1490',
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Application web sur mesure en marque blanche' },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '3990',
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Plateforme digitale et intégration IA en marque blanche' },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '7990',
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
        },
      },
    ],
  },
};

// ── JSON-LD : FAQPage ─────────────────────────────────────────────────────────
// ⚠️ Doit rester synchrone avec le tableau FAQ_ITEMS ci-dessous
//    (Google exige que le contenu balisé soit visible sur la page).
const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Qu'est-ce que la sous-traitance web en marque blanche ?",
    a: "La sous-traitance en marque blanche est un modèle où un prestataire technique réalise les développements pour le compte d'une agence, qui les livre ensuite à son client sous sa propre marque. Concrètement : votre client ne connaît jamais notre existence, vous restez l'unique interlocuteur commercial, et nous fournissons le code, la documentation et les livrables à votre nom. C'est le moyen le plus rapide d'ajouter une capacité technique à votre agence sans recruter.",
  },
  {
    q: 'Comment garantissez-vous la confidentialité vis-à-vis de mes clients ?',
    a: "Chaque collaboration démarre par la signature d'un accord de confidentialité (NDA) et d'une clause de non-sollicitation. Nous n'entrons jamais en contact direct avec votre client final, nous n'apparaissons ni dans les mentions légales, ni dans le code livré, ni dans le footer du site, et nous ne publions aucun projet sous-traité dans notre portfolio sans votre autorisation écrite.",
  },
  {
    q: 'Quels sont vos tarifs de sous-traitance pour une agence ?',
    a: "Nous travaillons principalement au forfait, sur la base de nos packs : à partir de 1 490 € HT pour un site vitrine jusqu'à 8 pages, 3 990 € HT pour un site ou une application jusqu'à 20 pages avec fonctions avancées, et 7 990 € HT pour une plateforme sur mesure avec IA et automatisation. Un tarif partenaire dégressif s'applique à partir du troisième projet confié dans l'année. Les missions en régie ou les reprises de projet font l'objet d'un devis spécifique.",
  },
  {
    q: 'Quelles technologies prenez-vous en charge ?',
    a: "Notre cœur de métier est l'écosystème JavaScript moderne : Next.js, React, TypeScript, Node.js, Tailwind CSS, avec déploiement sur Vercel. Nous couvrons aussi les applications mobiles (Flutter, React Native), l'intégration d'API IA (OpenAI, Claude, Mistral), l'automatisation via n8n et Make, et les bases de données Supabase ou PostgreSQL. Nous ne prenons pas en charge les projets WordPress sur-mesure ni le développement natif Swift ou Kotlin.",
  },
  {
    q: 'Pouvez-vous reprendre un projet déjà commencé par un autre prestataire ?',
    a: "Oui, c'est une demande fréquente. Nous commençons systématiquement par un audit technique de 2 à 3 jours pour évaluer l'état du code, la dette technique et la faisabilité de la reprise. Cet audit vous est livré sous forme de rapport écrit avec une estimation chiffrée. Dans certains cas, nous recommandons honnêtement une reconstruction plutôt qu'une reprise : nous vous le disons avant que vous vous engagiez auprès de votre client.",
  },
  {
    q: 'Quels sont les délais sur un projet sous-traité ?',
    a: "Comptez 1 à 2 semaines pour une landing page, 3 à 5 semaines pour un site vitrine multi-pages, et 6 à 10 semaines pour une application web ou une plateforme sur mesure. Nous nous engageons sur un planning ferme dès la validation du cadrage, avec des livraisons intermédiaires pour que vous puissiez faire valider les étapes par votre client au fil de l'eau plutôt qu'à la fin.",
  },
  {
    q: 'Travaillez-vous uniquement avec les agences lilloises ?',
    a: "Non. Nous sommes basés à Lille et rencontrons volontiers les agences des Hauts-de-France en présentiel, mais la majorité de nos collaborations se déroulent à distance avec des agences partout en France, en Belgique et en Suisse. Le processus est identique : cadrage en visioconférence, suivi sur votre outil de gestion de projet, livraisons sur votre dépôt Git.",
  },
  {
    q: 'Comment se passe la communication pendant le projet ?',
    a: "Nous nous adaptons à vos outils plutôt que l'inverse : Slack, Notion, Jira, Trello ou simplement e-mail. Vous disposez d'un point de contact technique unique, d'un compte-rendu hebdomadaire écrit et d'un accès en lecture au dépôt Git pour suivre l'avancement réel. Aucune réunion imposée : nous privilégions l'asynchrone pour ne pas consommer votre temps de gestion.",
  },
  {
    q: 'Proposez-vous de la maintenance sur les projets livrés en marque blanche ?',
    a: "Oui. Chaque livraison inclut 30 jours de corrections de bugs sans surcoût. Au-delà, nous proposons des contrats de maintenance mensuels en marque blanche : surveillance de sécurité, mises à jour de dépendances, corrections et petites évolutions. Vous refacturez cette prestation à votre client avec votre propre marge, ce qui transforme un projet ponctuel en revenu récurrent pour votre agence.",
  },
  {
    q: 'Que se passe-t-il si mon client demande une évolution après la livraison ?',
    a: "Vous restez maître de la relation commerciale : vous chiffrez l'évolution avec votre marge, et nous vous fournissons une estimation technique sous 48 heures pour vous permettre de répondre vite. Le code étant documenté et livré sur votre dépôt, vous gardez aussi la liberté de faire réaliser l'évolution en interne ou par un autre prestataire — nous ne créons volontairement aucune dépendance technique.",
  },
];

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

// ── Données page ─────────────────────────────────────────────────────────────

const PAIN_POINTS = [
  {
    title: 'Un appel d\'offres technique que vous ne pouvez pas honorer',
    desc: "Votre client demande une application web, une intégration IA ou une refonte Next.js. Refuser, c'est laisser partir le budget — et souvent tout le compte — chez un concurrent.",
  },
  {
    title: 'Un pic de charge que votre équipe ne peut pas absorber',
    desc: "Trois projets signés le même mois. Recruter prend trois mois et engage sur des années : la sous-traitance absorbe le pic sans coût fixe.",
  },
  {
    title: 'Un projet en difficulté à récupérer',
    desc: "Un prestataire qui abandonne, un code impossible à maintenir, un client qui s'impatiente. Nous auditons et reprenons, ou nous vous disons franchement qu'il faut reconstruire.",
  },
];

const SERVICES = [
  {
    icon: Globe,
    title: 'Développement web Next.js',
    desc: "Sites vitrines, e-commerce et applications web en Next.js et TypeScript. Performance 90+/100 sur PageSpeed, SEO technique et données structurées inclus par défaut.",
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    icon: Smartphone,
    title: 'Applications mobiles',
    desc: 'Applications iOS et Android en Flutter ou React Native, du prototype à la publication sur les stores sous votre compte développeur ou celui de votre client.',
    color: 'text-violet-600 bg-violet-50',
  },
  {
    icon: Brain,
    title: 'Intégration IA',
    desc: "Chatbots de qualification, agents conversationnels, génération de contenu, recherche sémantique — branchés sur les API OpenAI, Claude ou Mistral et sur les outils métier du client.",
    color: 'text-cyan-600 bg-cyan-50',
  },
  {
    icon: Zap,
    title: 'Automatisation n8n & Make',
    desc: 'Synchronisation CRM, relances automatiques, publication multi-canal, reporting. Des workflows documentés que votre équipe peut reprendre en main après livraison.',
    color: 'text-rose-600 bg-rose-50',
  },
  {
    icon: RefreshCw,
    title: 'Audit et reprise de projet',
    desc: "Diagnostic technique écrit en 2 à 3 jours : état du code, dette technique, risques de sécurité et estimation chiffrée de la reprise ou de la reconstruction.",
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    icon: Layers,
    title: 'Renfort en régie',
    desc: "Un développeur intégré à votre équipe pour une durée définie, sur vos outils et vos rituels, quand vous avez besoin de capacité plutôt que d'un projet clé en main.",
    color: 'text-violet-600 bg-violet-50',
  },
];

const GUARANTEES = [
  {
    icon: Lock,
    title: 'NDA signé avant le premier échange',
    desc: "Accord de confidentialité et clause de non-sollicitation systématiques, signés avant même de recevoir votre cahier des charges.",
  },
  {
    icon: Shield,
    title: 'Invisibles pour votre client',
    desc: "Aucune mention de NeuraWeb dans le code livré, le footer, les mentions légales ou les métadonnées. Vous livrez sous votre marque, point.",
  },
  {
    icon: Handshake,
    title: 'Zéro sollicitation de vos comptes',
    desc: "Nous ne contactons jamais votre client final, ni pendant le projet, ni après. Aucun projet sous-traité n'entre dans notre portfolio sans votre accord écrit.",
  },
  {
    icon: Rocket,
    title: 'Code livré sur votre dépôt',
    desc: "Documentation technique, README d'installation et code commenté sur votre Git. Vous gardez la main : aucune dépendance technique créée volontairement.",
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Prise de brief et NDA',
    desc: "Vous nous transmettez le besoin du client. NDA signé sous 24h, avant tout échange de détail. Nous vous disons immédiatement si le projet entre dans notre périmètre.",
  },
  {
    step: '02',
    title: 'Cadrage et devis ferme',
    desc: "Estimation chiffrée et planning sous 48h ouvrées, avec le découpage en lots. Vous appliquez votre marge et présentez la proposition à votre client sous votre marque.",
  },
  {
    step: '03',
    title: 'Développement par lots',
    desc: "Livraisons intermédiaires sur environnement de préproduction pour que votre client valide au fil de l'eau. Compte-rendu écrit chaque semaine, aucune réunion imposée.",
  },
  {
    step: '04',
    title: 'Livraison et transfert',
    desc: "Mise en production, documentation, transfert du dépôt et session de passation avec votre équipe. 30 jours de corrections incluses, maintenance en option.",
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// PAGE (Server Component)
// ═════════════════════════════════════════════════════════════════════════════

export default async function SousTraitanceWebLillePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'fr') {
    permanentRedirect('/fr/sous-traitance-web-lille');
  }

  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/fr' },
    { name: 'Sous-traitance web Lille', url: PAGE_PATH },
  ]);

  return (
    <>
      <JsonLd id="sous-traitance-service" data={serviceSchema} />
      <JsonLd id="sous-traitance-faq" data={faqPageSchema} />
      <JsonLd id="sous-traitance-breadcrumb" data={breadcrumbData} />

      <Header />
      <main id="main-content" className="bg-white text-slate-800 overflow-x-hidden">

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 pt-24 pb-12 md:pt-32 md:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.10),transparent_60%)] pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 md:mb-8">
              <LocalizedLink href="/" className="hover:text-indigo-600 transition-colors">Accueil</LocalizedLink>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-600 font-medium">Sous-traitance web Lille</span>
            </nav>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-medium mb-4 md:mb-6">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Réservé aux agences, studios et freelances
                </div>

                <h1 className="font-display text-[2rem] leading-[1.1] sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
                  Sous-traitance web à Lille —{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                    votre équipe technique
                  </span>{' '}
                  en marque blanche
                </h1>

                <p className="mt-4 md:mt-6 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl">
                  NeuraWeb développe vos projets <strong>Next.js, mobiles et IA</strong> pour
                  le compte de votre agence. <strong>NDA signé sous 24h</strong>, aucun contact
                  avec votre client, code livré sur votre dépôt sous votre marque.
                </p>

                <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-600/20 h-12 px-6 sm:px-8"
                  >
                    <LocalizedLink href="/booking">
                      <Sparkles className="mr-2 w-4 h-4" />
                      Discuter d&apos;un projet
                    </LocalizedLink>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="bg-white border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 h-12 px-6 sm:px-8"
                  >
                    <LocalizedLink href="/developpement-web">
                      Voir nos compétences
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </LocalizedLink>
                  </Button>
                </div>

                <div className="mt-6 md:mt-10 flex flex-wrap gap-x-4 gap-y-2 sm:grid sm:grid-cols-3 sm:gap-4">
                  {[
                    { icon: Lock, label: 'NDA 24h', longLabel: 'NDA signé sous 24h', color: 'text-indigo-600' },
                    { icon: Shield, label: 'Marque blanche', longLabel: 'Marque blanche stricte', color: 'text-violet-600' },
                    { icon: Clock, label: 'Devis 48h', longLabel: 'Devis ferme sous 48h', color: 'text-cyan-600' },
                  ].map(({ icon: Icon, label, longLabel, color }) => (
                    <div key={label} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-slate-700">
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
                      <span className="sm:hidden">{label}</span>
                      <span className="hidden sm:inline">{longLabel}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carte réponse directe (optimisée extraction IA) */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-indigo-600/15 border border-slate-200/60 bg-white p-6 sm:p-8">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
                  <p className="relative text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                    En résumé
                  </p>
                  <p className="relative text-sm sm:text-base text-slate-700 leading-relaxed">
                    <strong>NeuraWeb est un partenaire technique en marque blanche basé à Lille</strong>,
                    qui développe des sites Next.js, des applications mobiles et des intégrations IA
                    pour le compte d&apos;agences web et d&apos;agences de communication.
                    Les projets démarrent à <strong>1 490 € HT</strong>, sont livrés sur votre dépôt Git
                    sous votre marque, et chaque collaboration commence par la signature d&apos;un NDA
                    et d&apos;une clause de non-sollicitation.
                  </p>
                  <div className="relative mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 gap-4">
                    {[
                      { value: '24h', label: 'NDA signé' },
                      { value: '48h', label: 'Devis ferme' },
                      { value: '30 j', label: 'Corrections incluses' },
                      { value: '90+', label: 'Score PageSpeed' },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="text-xl sm:text-2xl font-extrabold text-indigo-600">{s.value}</p>
                        <p className="text-xs text-slate-500">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PAIN POINTS ─────────────────────────────────────────────────── */}
        <section className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8 md:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                Quand une agence a besoin d&apos;un{' '}
                <span className="text-indigo-600">sous-traitant technique</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Trois situations reviennent systématiquement chez les agences web et les agences
                de communication qui nous contactent.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
              {PAIN_POINTS.map((p) => (
                <div
                  key={p.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors"
                >
                  <h3 className="font-semibold text-slate-900 mb-2 text-base leading-snug">{p.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES ────────────────────────────────────────────────────── */}
        <section className="py-12 md:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8 md:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                Ce que nous développons{' '}
                <span className="text-indigo-600">pour votre compte</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Notre périmètre couvre l&apos;écosystème JavaScript moderne, le mobile et l&apos;IA.
                Nous refusons les projets hors périmètre plutôt que d&apos;improviser sur une
                technologie que nous ne maîtrisons pas.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {SERVICES.map(({ icon: Icon, title, desc, color }) => (
                <div
                  key={title}
                  className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2 text-base">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GARANTIES MARQUE BLANCHE ────────────────────────────────────── */}
        <section className="py-12 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8 md:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                Comment fonctionne la{' '}
                <span className="text-indigo-600">marque blanche</span> chez NeuraWeb
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                La crainte légitime d&apos;une agence qui sous-traite est de se faire prendre son
                client. Voici les quatre engagements contractuels qui l&apos;empêchent.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {GUARANTEES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
                >
                  <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-600 text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1.5 text-base">{title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS ─────────────────────────────────────────────────────── */}
        <section className="py-12 md:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8 md:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                Le déroulé d&apos;une <span className="text-indigo-600">collaboration</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                De la prise de brief au transfert final, quatre étapes conçues pour ne pas
                consommer votre temps de gestion.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {PROCESS.map((p) => (
                <div key={p.step} className="relative rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                  <span className="text-3xl font-extrabold text-indigo-100 absolute top-4 right-4 select-none">
                    {p.step}
                  </span>
                  <h3 className="relative font-semibold text-slate-900 mb-2 text-base pr-10">{p.title}</h3>
                  <p className="relative text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TARIFS ──────────────────────────────────────────────────────── */}
        <section className="py-12 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                Tarifs <span className="text-indigo-600">partenaires</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Nous travaillons au forfait pour que vous puissiez chiffrer votre proposition
                client sans risque de dérive. Tarif dégressif à partir du troisième projet
                confié dans l&apos;année.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {[
                { name: 'Site vitrine', scope: "Jusqu'à 8 pages, design sur mesure, SEO de base", price: '1 490 € HT' },
                { name: 'Site ou application avancée', scope: "Jusqu'à 20 pages, blog, chatbot IA, intégrations métier", price: '3 990 € HT' },
                { name: 'Plateforme sur mesure', scope: 'Application web, IA et automatisation, multi-langue, API tierces', price: '7 990 € HT' },
                { name: 'Audit ou reprise de projet', scope: 'Diagnostic technique écrit, estimation de reprise', price: 'Sur devis' },
                { name: 'Renfort en régie', scope: 'Développeur intégré à votre équipe, durée définie', price: 'Sur devis' },
              ].map((row, idx) => (
                <div
                  key={row.name}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 sm:px-6 sm:py-5 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                  }`}
                >
                  <div className="sm:max-w-md">
                    <p className="font-semibold text-slate-900 text-sm sm:text-base">{row.name}</p>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{row.scope}</p>
                  </div>
                  <p className="font-bold text-indigo-600 text-base sm:text-lg shrink-0">{row.price}</p>
                </div>
              ))}
            </div>

            <ul className="mt-6 grid sm:grid-cols-2 gap-2.5">
              {[
                'Facturation à votre agence, jamais au client final',
                'Vous appliquez librement votre marge',
                '30 jours de corrections incluses après livraison',
                'Maintenance mensuelle en marque blanche en option',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── LIENS INTERNES ───────────────────────────────────────────────── */}
        <section className="py-10 md:py-14 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 md:mb-6">
              Aller plus loin
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { href: '/fr/agence-web-lille', label: 'Agence web à Lille', sub: 'Notre offre pour les entreprises finales' },
                { href: '/fr/developpement-web', label: 'Développement web', sub: 'Nos packs, notre stack, nos garanties' },
                { href: '/fr/integration-ia', label: 'Intégration IA', sub: 'Chatbots, agents, génération de contenu' },
                { href: '/fr/automatisation', label: 'Automatisation n8n', sub: 'Workflows métier documentés' },
              ].map((item) => (
                <LocalizedLink
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 p-4 transition-all"
                >
                  <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 mb-1 transition-colors">
                    {item.label}
                  </span>
                  <span className="text-xs text-slate-500">{item.sub}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-400 mt-3 group-hover:translate-x-1 transition-transform" />
                </LocalizedLink>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section className="py-12 md:py-24 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                Questions <span className="text-indigo-600">fréquentes</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Ce que les agences nous demandent avant de confier un premier projet.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="border border-slate-200 rounded-lg mb-2 overflow-hidden bg-white shadow-sm data-[state=open]:shadow-md"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline text-left font-semibold text-slate-900 text-base">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-slate-600 leading-relaxed text-sm">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ── CTA FINAL ──────────────────────────────────────────────────────── */}
        <section className="relative py-14 md:py-28 overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-600 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-white text-xs sm:text-sm font-medium mb-5 md:mb-6">
              <MapPin className="w-3.5 h-3.5" />
              Basés à Lille, disponibles partout en France
            </span>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-5 leading-tight">
              Un projet à confier ? Parlons-en.
            </h2>
            <p className="text-base sm:text-xl text-white/90 mb-6 md:mb-10 max-w-2xl mx-auto">
              Décrivez le besoin de votre client : nous vous disons sous 48h si nous le prenons,
              à quel prix et dans quel délai. NDA signé avant tout échange de détail.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-slate-50 text-indigo-700 h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold shadow-2xl shadow-indigo-900/30 w-full sm:w-auto"
              >
                <LocalizedLink href="/booking">
                  <Sparkles className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Soumettre un projet
                </LocalizedLink>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto"
              >
                <LocalizedLink href="/contact">
                  Nous contacter
                </LocalizedLink>
              </Button>
            </div>

            <p className="mt-6 md:mt-8 inline-flex items-center gap-2 text-xs sm:text-sm text-white/80">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Réponse garantie sous 4 heures ouvrées
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
