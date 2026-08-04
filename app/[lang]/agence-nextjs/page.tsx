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
  Brain,
  Zap,
  Search,
  Check,
  X,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
  RefreshCw,
  Rocket,
  Gauge,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const BASE_URL = 'https://neuraweb.fr';
const PAGE_PATH = '/fr/agence-nextjs';

// Page FR uniquement — page technologie / SEO (ISR 1h)
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
      title: 'Agence Next.js — NeuraWeb',
      alternates: { canonical: `${BASE_URL}${PAGE_PATH}` },
    };
  }

  const ogImage = `${BASE_URL}/assets/og-image.png`;
  const title = 'Agence Next.js — Sites & Apps Web Performants | NeuraWeb';
  const description =
    'Agence spécialisée Next.js et React : sites vitrines, applications web et migrations WordPress. Score PageSpeed 90+, SEO technique natif. Devis sous 24h.';

  return {
    title: { absolute: title },
    description,
    keywords: [
      'agence Next.js',
      'agence next js France',
      'développeur Next.js',
      'agence React Next.js',
      'création site Next.js',
      'migration WordPress vers Next.js',
      'agence Next.js Lille',
      'développement application Next.js',
      'expert Next.js France',
      'agence web React TypeScript',
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
          alt: 'NeuraWeb — Agence Next.js, sites et applications web performants',
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

// ── JSON-LD : Service (agence Next.js) ───────────────────────────────────────
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${BASE_URL}${PAGE_PATH}#service`,
  name: 'Développement Next.js sur mesure',
  description:
    "Agence spécialisée dans le framework Next.js : création de sites vitrines, d'applications web et migration depuis WordPress. Rendu serveur, SEO technique natif et score PageSpeed supérieur à 90.",
  url: `${BASE_URL}${PAGE_PATH}`,
  serviceType: 'Développement web Next.js',
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
    { '@type': 'Country', name: 'France' },
    { '@type': 'Country', name: 'Belgique' },
    { '@type': 'Country', name: 'Suisse' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Prestations Next.js',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Site vitrine Next.js' },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '1490',
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Site Next.js avancé avec blog et chatbot IA' },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '3990',
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Application web Next.js sur mesure' },
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
    q: "Qu'est-ce que Next.js et pourquoi choisir ce framework en 2026 ?",
    a: "Next.js est un framework basé sur React, maintenu par Vercel, qui ajoute le rendu côté serveur, la génération statique et l'optimisation automatique des images et des polices. Concrètement, il combine la richesse d'interface d'une application React avec le référencement d'un site statique. C'est aujourd'hui le standard pour les sites qui doivent être à la fois rapides, bien référencés et évolutifs — il est utilisé par Netflix, Notion, TikTok et OpenAI.",
  },
  {
    q: 'Quelle est la différence entre Next.js et WordPress ?',
    a: "WordPress est un CMS reposant sur PHP et une base de données interrogée à chaque visite, avec un écosystème de plugins qui alourdit le site et multiplie les failles. Next.js génère les pages en amont ou les rend côté serveur, sans plugin tiers. En pratique, un site Next.js charge 3 à 5 fois plus vite, obtient un meilleur score Core Web Vitals, et n'expose pas la surface d'attaque d'un CMS. La contrepartie : l'édition de contenu passe par un CMS headless ou des fichiers, pas par un back-office WordPress classique.",
  },
  {
    q: "Combien coûte la création d'un site Next.js par une agence ?",
    a: "Chez NeuraWeb, un site vitrine Next.js jusqu'à 8 pages démarre à 1 490 € HT. Un site plus complet jusqu'à 20 pages, avec blog, SEO avancé et chatbot IA, est à 3 990 € HT. Une application web sur mesure avec IA, automatisation et multi-langue est à 7 990 € HT. Sur le marché français, les agences Next.js facturent généralement entre 50 et 150 € de l'heure en régie ; nous privilégions le forfait pour éviter les dérives de budget.",
  },
  {
    q: 'Combien de temps faut-il pour développer un site avec Next.js ?',
    a: "Une landing page est livrée en 1 à 2 semaines, un site vitrine multi-pages en 3 à 5 semaines, et une application web sur mesure en 6 à 10 semaines. Ces délais incluent le cadrage, le design, le développement, les tests et la mise en production. Nous livrons par lots sur un environnement de préproduction pour que vous validiez au fil de l'eau.",
  },
  {
    q: 'Peut-on migrer un site WordPress existant vers Next.js sans perdre son référencement ?',
    a: "Oui, à condition de traiter la migration comme un projet SEO à part entière. Nous cartographions les URL existantes, mettons en place des redirections 301 chemin par chemin, reproduisons les balises title, meta description et données structurées, puis surveillons la Search Console pendant les semaines qui suivent. Correctement menée, une migration se traduit généralement par un gain de positions grâce à l'amélioration des Core Web Vitals, pas par une perte.",
  },
  {
    q: 'Next.js est-il adapté au SEO ?',
    a: "C'est même l'un de ses principaux atouts. Le rendu côté serveur garantit que les robots reçoivent du HTML complet plutôt qu'une page vide à hydrater, contrairement à une application React classique. Next.js gère nativement les balises métadonnées, les sitemaps, le fichier robots.txt, les balises hreflang multilingues et les données structurées. Ce point devient déterminant pour les moteurs de réponse IA comme ChatGPT Search ou Perplexity, dont les robots n'exécutent pas JavaScript.",
  },
  {
    q: 'Puis-je modifier le contenu de mon site Next.js sans développeur ?',
    a: "Oui. Selon vos besoins, nous connectons un CMS headless (Sanity, Contentful, Strapi) qui vous donne une interface d'édition comparable à WordPress, ou nous mettons en place une gestion par fichiers Markdown pour les équipes techniques. Le choix se fait au cadrage en fonction du volume de contenu et du nombre de contributeurs.",
  },
  {
    q: 'Où héberge-t-on un site Next.js et combien cela coûte-t-il ?',
    a: "Vercel, l'éditeur du framework, est l'hébergeur de référence : déploiement automatique à chaque mise à jour, réseau de diffusion mondial et certificat SSL inclus. Le plan gratuit suffit à de nombreux sites vitrines ; le plan Pro est à 20 $ par mois et par utilisateur. Netlify et un serveur Node.js auto-hébergé sont des alternatives que nous mettons en place quand l'hébergement doit rester en France ou chez un fournisseur imposé.",
  },
  {
    q: 'Travaillez-vous avec des clients partout en France ?',
    a: "Oui. NeuraWeb est basée à Lille, dans les Hauts-de-France, et intervient dans toute la France ainsi qu'en Belgique et en Suisse. Le cadrage et le suivi se font en visioconférence, avec possibilité de rendez-vous en présentiel dans la métropole lilloise. Nous accompagnons aussi d'autres agences en sous-traitance technique.",
  },
  {
    q: 'Que se passe-t-il après la mise en ligne ?',
    a: "Chaque projet inclut une formation à la gestion du site, le suivi des performances via Search Console et Analytics, et 30 jours de corrections. Au-delà, des contrats de maintenance mensuels couvrent les mises à jour de dépendances, la surveillance de sécurité et les évolutions fonctionnelles. Le code reste votre propriété et vous est livré sur votre dépôt Git.",
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

const BENEFITS = [
  {
    icon: Gauge,
    title: 'Chargement 3 à 5× plus rapide',
    desc: "Rendu serveur, génération statique et optimisation automatique des images. Tous nos sites dépassent 90/100 sur PageSpeed Insights, mobile comme desktop.",
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    icon: Search,
    title: 'SEO technique natif',
    desc: "HTML complet servi aux robots, métadonnées, sitemap, hreflang et données structurées gérés par le framework — sans plugin ni extension à maintenir.",
    color: 'text-violet-600 bg-violet-50',
  },
  {
    icon: Shield,
    title: 'Surface d\'attaque réduite',
    desc: "Pas de CMS exposé, pas de plugins tiers à mettre à jour dans l'urgence. L'essentiel des vulnérabilités WordPress vient de son écosystème d'extensions.",
    color: 'text-cyan-600 bg-cyan-50',
  },
  {
    icon: Brain,
    title: 'Prêt pour l\'IA',
    desc: "Routes API intégrées pour brancher OpenAI, Claude ou Mistral : chatbot de qualification, recherche sémantique, génération de contenu directement dans le site.",
    color: 'text-rose-600 bg-rose-50',
  },
  {
    icon: Layers,
    title: 'Évolutif sans refonte',
    desc: "Un site vitrine peut devenir une application, un espace client ou une plateforme multi-langue sans repartir de zéro. L'architecture suit la croissance.",
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    icon: Rocket,
    title: 'Déploiement continu',
    desc: 'Chaque modification est déployée automatiquement avec un environnement de préproduction et un retour arrière immédiat en cas de problème.',
    color: 'text-violet-600 bg-violet-50',
  },
];

const COMPARISON: { criterion: string; nextjs: string; wordpress: string; nextWins: boolean }[] = [
  { criterion: 'Temps de chargement moyen', nextjs: '0,5 à 1,5 s', wordpress: '3 à 6 s', nextWins: true },
  { criterion: 'Score PageSpeed mobile', nextjs: '90 à 100', wordpress: '35 à 70', nextWins: true },
  { criterion: 'Maintenance sécurité', nextjs: 'Dépendances uniquement', wordpress: 'Cœur + thème + plugins', nextWins: true },
  { criterion: 'Lecture par les robots IA', nextjs: 'HTML complet servi', wordpress: 'Variable selon le thème', nextWins: true },
  { criterion: 'Édition de contenu', nextjs: 'CMS headless ou fichiers', wordpress: 'Back-office intégré', nextWins: false },
  { criterion: 'Coût d\'entrée', nextjs: 'Développement sur mesure', wordpress: 'Thème préfait bon marché', nextWins: false },
];

const USE_CASES = [
  {
    icon: Globe,
    title: 'Site vitrine et institutionnel',
    desc: "Pour les entreprises dont le site est un canal d'acquisition : vitesse et référencement priment sur la richesse fonctionnelle.",
  },
  {
    icon: Zap,
    title: 'Application web métier',
    desc: "Espace client, tableau de bord, outil interne, plateforme de réservation — avec authentification, base de données et rôles utilisateurs.",
  },
  {
    icon: RefreshCw,
    title: 'Migration depuis WordPress',
    desc: "Refonte technique à contenu constant, avec plan de redirections 301 et conservation des positions acquises sur Google.",
  },
  {
    icon: Brain,
    title: 'Produit augmenté par l\'IA',
    desc: "Sites intégrant chatbot, recommandation, génération de contenu ou recherche sémantique nativement plutôt que via un widget tiers.",
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// PAGE (Server Component)
// ═════════════════════════════════════════════════════════════════════════════

export default async function AgenceNextjsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'fr') {
    permanentRedirect('/fr/agence-nextjs');
  }

  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/fr' },
    { name: 'Agence Next.js', url: PAGE_PATH },
  ]);

  return (
    <>
      <JsonLd id="agence-nextjs-service" data={serviceSchema} />
      <JsonLd id="agence-nextjs-faq" data={faqPageSchema} />
      <JsonLd id="agence-nextjs-breadcrumb" data={breadcrumbData} />

      <Header />
      <main id="main-content" className="bg-white text-slate-800 overflow-x-hidden">

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 pt-24 pb-12 md:pt-32 md:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.10),transparent_60%)] pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 md:mb-8">
              <LocalizedLink href="/" className="hover:text-indigo-600 transition-colors">Accueil</LocalizedLink>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-600 font-medium">Agence Next.js</span>
            </nav>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-cyan-200 text-cyan-700 text-xs sm:text-sm font-medium mb-4 md:mb-6">
                  <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Next.js, React &amp; TypeScript
                </div>

                <h1 className="font-display text-[2rem] leading-[1.1] sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
                  Agence{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                    Next.js
                  </span>{' '}
                  — des sites que Google et les IA adorent
                </h1>

                <p className="mt-4 md:mt-6 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl">
                  Nous concevons des sites et applications web en <strong>Next.js</strong> :
                  chargement en moins d&apos;une seconde, <strong>score PageSpeed 90+</strong> et
                  référencement technique natif. Basés à Lille, nous intervenons partout en France.
                </p>

                <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white shadow-lg shadow-cyan-600/20 h-12 px-6 sm:px-8"
                  >
                    <LocalizedLink href="/booking">
                      <Sparkles className="mr-2 w-4 h-4" />
                      Devis gratuit
                    </LocalizedLink>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="bg-white border-cyan-300 text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800 h-12 px-6 sm:px-8"
                  >
                    <LocalizedLink href="/blog/nextjs-vs-wordpress-2026">
                      Next.js vs WordPress
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </LocalizedLink>
                  </Button>
                </div>

                <div className="mt-6 md:mt-10 flex flex-wrap gap-x-4 gap-y-2 sm:grid sm:grid-cols-3 sm:gap-4">
                  {[
                    { icon: Gauge, label: '90+/100', longLabel: 'PageSpeed 90+/100', color: 'text-indigo-600' },
                    { icon: Clock, label: 'Réponse 24h', longLabel: 'Réponse sous 24h', color: 'text-violet-600' },
                    { icon: MapPin, label: 'Lille · France', longLabel: 'Lille, partout en France', color: 'text-cyan-600' },
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
                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-cyan-600/15 border border-slate-200/60 bg-white p-6 sm:p-8">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-100 to-indigo-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
                  <p className="relative text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                    En résumé
                  </p>
                  <p className="relative text-sm sm:text-base text-slate-700 leading-relaxed">
                    <strong>Next.js est un framework React qui ajoute le rendu côté serveur</strong>,
                    la génération statique et l&apos;optimisation automatique des ressources.
                    Un site Next.js charge 3 à 5 fois plus vite qu&apos;un site WordPress équivalent
                    et sert du HTML complet aux robots de Google comme à ceux des moteurs IA.
                    Chez NeuraWeb, un site Next.js démarre à <strong>1 490 € HT</strong>.
                  </p>
                  <div className="relative mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 gap-4">
                    {[
                      { value: '< 1 s', label: 'Temps de chargement' },
                      { value: '90+', label: 'Score PageSpeed' },
                      { value: '3-5 sem.', label: 'Délai site vitrine' },
                      { value: '1 490 €', label: 'À partir de (HT)' },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="text-xl sm:text-2xl font-extrabold text-cyan-600">{s.value}</p>
                        <p className="text-xs text-slate-500">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BÉNÉFICES ───────────────────────────────────────────────────── */}
        <section className="py-12 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8 md:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                Pourquoi choisir <span className="text-cyan-600">Next.js</span> pour votre site
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Next.js n&apos;est pas un choix esthétique mais un choix de performance et de
                référencement. Voici ce que le framework apporte concrètement.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {BENEFITS.map(({ icon: Icon, title, desc, color }) => (
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

        {/* ── COMPARATIF ──────────────────────────────────────────────────── */}
        <section className="py-12 md:py-24 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8 md:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                Next.js ou <span className="text-cyan-600">WordPress</span> ?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Les deux ont leur place. WordPress reste pertinent pour un budget serré avec un
                thème existant et beaucoup de contributeurs non techniques. Voilà comment ils se
                comparent point par point.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th scope="col" className="text-left font-semibold text-slate-700 px-4 sm:px-6 py-3">Critère</th>
                    <th scope="col" className="text-left font-semibold text-cyan-700 px-4 sm:px-6 py-3">Next.js</th>
                    <th scope="col" className="text-left font-semibold text-slate-500 px-4 sm:px-6 py-3">WordPress</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, idx) => (
                    <tr key={row.criterion} className={idx % 2 === 1 ? 'bg-slate-50/60' : ''}>
                      <th scope="row" className="text-left font-medium text-slate-700 px-4 sm:px-6 py-3.5">
                        {row.criterion}
                      </th>
                      <td className="px-4 sm:px-6 py-3.5 text-slate-700">
                        <span className="inline-flex items-center gap-2">
                          {row.nextWins ? (
                            <Check className="w-4 h-4 text-cyan-600 shrink-0" aria-hidden="true" />
                          ) : (
                            <X className="w-4 h-4 text-slate-300 shrink-0" aria-hidden="true" />
                          )}
                          {row.nextjs}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 text-slate-500">{row.wordpress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-5 text-sm text-slate-600">
              Analyse détaillée dans notre article{' '}
              <LocalizedLink
                href="/blog/nextjs-vs-wordpress-2026"
                className="text-cyan-700 font-medium hover:underline"
              >
                Next.js vs WordPress en 2026
              </LocalizedLink>
              .
            </p>
          </div>
        </section>

        {/* ── CAS D'USAGE ─────────────────────────────────────────────────── */}
        <section className="py-12 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8 md:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                Les projets que nous développons en{' '}
                <span className="text-cyan-600">Next.js</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {USE_CASES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
                >
                  <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-600 text-white">
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

        {/* ── LIENS INTERNES ───────────────────────────────────────────────── */}
        <section className="py-10 md:py-14 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 md:mb-6">
              Aller plus loin
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { href: '/fr/developpement-web', label: 'Nos packs web', sub: 'Starter, Business, Premium — tarifs détaillés' },
                { href: '/fr/agence-web-lille', label: 'Agence web à Lille', sub: 'Notre ancrage local dans les Hauts-de-France' },
                { href: '/fr/sous-traitance-web-lille', label: 'Sous-traitance agences', sub: 'Next.js en marque blanche pour votre agence' },
                { href: '/fr/integration-ia', label: 'Intégration IA', sub: 'Chatbots et agents branchés sur votre site' },
              ].map((item) => (
                <LocalizedLink
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col rounded-xl border border-slate-200 bg-slate-50 hover:bg-cyan-50 hover:border-cyan-200 p-4 transition-all"
                >
                  <span className="text-sm font-semibold text-slate-900 group-hover:text-cyan-700 mb-1 transition-colors">
                    {item.label}
                  </span>
                  <span className="text-xs text-slate-500">{item.sub}</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400 mt-3 group-hover:translate-x-1 transition-transform" />
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
                Questions <span className="text-cyan-600">fréquentes</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Tout ce qu&apos;on nous demande avant de lancer un projet Next.js.
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
              <Gauge className="w-3.5 h-3.5" />
              Site actuel trop lent ? On mesure, on vous dit
            </span>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-5 leading-tight">
              Passez à Next.js
            </h2>
            <p className="text-base sm:text-xl text-white/90 mb-6 md:mb-10 max-w-2xl mx-auto">
              Nouveau projet ou migration depuis WordPress : nous auditons votre existant
              et vous remettons un chiffrage sous 24h, sans engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-slate-50 text-indigo-700 h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold shadow-2xl shadow-indigo-900/30 w-full sm:w-auto"
              >
                <LocalizedLink href="/booking">
                  <Sparkles className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Demander mon devis gratuit
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
