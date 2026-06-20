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
  Search,
  Check,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Building2,
  Users,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const BASE_URL = 'https://neuraweb.tech';
const PAGE_PATH = '/fr/agence-web-lille';

// Page FR uniquement — page locale SEO (ISR 1h)
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
      title: 'Agence Web à Lille — NeuraWeb',
      alternates: { canonical: `${BASE_URL}${PAGE_PATH}` },
    };
  }

  const ogImage = `${BASE_URL}/assets/og-image.png`;
  const title = 'Agence Web à Lille — Sites Next.js & IA pour PME | NeuraWeb';
  const description =
    'Agence web & IA basée à Lille : création site Next.js, apps mobiles, automatisation n8n. PME des Hauts-de-France. Devis gratuit sous 24h.';

  return {
    title: { absolute: title },
    description,
    keywords: [
      'agence web Lille',
      'création site internet Lille',
      'agence digitale Lille',
      'développeur web Lille',
      'agence web Nord',
      'agence web Hauts-de-France',
      'création site web PME Lille',
      'agence Next.js Lille',
      'site internet entreprise Lille',
      'devis site web Lille gratuit',
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
          alt: 'NeuraWeb — Agence web & IA à Lille, Hauts-de-France',
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

// ── JSON-LD : ProfessionalService (agence web Lille) ─────────────────────────
const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${BASE_URL}${PAGE_PATH}#agence`,
  name: 'NeuraWeb — Agence Web & IA à Lille',
  description:
    "Agence web et IA basée à Lille, spécialisée dans la création de sites Next.js sur mesure, applications mobiles iOS/Android, intégration IA et automatisation n8n pour PME et hôteliers des Hauts-de-France.",
  url: `${BASE_URL}${PAGE_PATH}`,
  email: 'contact@neuraweb.tech',
  logo: `${BASE_URL}/assets/neurawebW.webp`,
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'Lille',
    addressRegion: 'Hauts-de-France',
    postalCode: '59000',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '50.6292',
    longitude: '3.0573',
  },
  areaServed: [
    { '@type': 'City', name: 'Lille' },
    { '@type': 'AdministrativeArea', name: 'Hauts-de-France' },
    { '@type': 'Country', name: 'France' },
  ],
  serviceType: [
    'Création site web Next.js',
    'Développement web sur mesure',
    'Application mobile iOS Android',
    'Intégration IA',
    'Automatisation n8n',
    'Site web PME',
  ],
};

// ── JSON-LD : FAQPage ─────────────────────────────────────────────────────────
// ⚠️ Doit rester synchrone avec le tableau FAQ_ITEMS ci-dessous
//    (Google exige que le contenu balisé soit visible sur la page).
const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Pourquoi choisir une agence web à Lille plutôt qu'une agence nationale ?",
    a: "Une agence locale connaît le tissu économique lillois, les besoins des PME du Nord et les spécificités des secteurs dominants (commerce, industrie, services B2B). Vous bénéficiez de réunions en présentiel, d'une réactivité accrue et d'une relation sur le long terme. NeuraWeb est basée à Lille et intervient aussi bien en métropole lilloise que dans tout le Nord-Pas-de-Calais et les Hauts-de-France.",
  },
  {
    q: 'Quel est le délai pour créer un site web avec NeuraWeb à Lille ?',
    a: 'Les délais varient selon la complexité du projet : 1 à 2 semaines pour une landing page, 3 à 5 semaines pour un site vitrine multi-pages, 6 à 10 semaines pour une application web ou un site e-commerce. Nous établissons un planning précis dès la phase de cadrage et vous tenons informé à chaque étape.',
  },
  {
    q: 'Quels types de sites web créez-vous pour les PME lilloises ?',
    a: 'Nous créons des sites vitrines, des boutiques e-commerce, des applications web sur mesure, des plateformes de réservation, des sites multi-langues et des portails B2B. Tous nos sites sont développés avec Next.js pour garantir des performances optimales (Core Web Vitals), un SEO technique solide et une expérience utilisateur irréprochable.',
  },
  {
    q: 'Proposez-vous un devis gratuit pour les entreprises de Lille ?',
    a: 'Oui, le devis est gratuit et sans engagement. Il vous suffit de décrire votre projet via notre formulaire en ligne ou de prendre rendez-vous directement. Nous vous répondons sous 24h avec une estimation détaillée et un appel de cadrage pour affiner vos besoins.',
  },
  {
    q: "Quel est le prix d'un site web pour une PME à Lille ?",
    a: "Nos packs web sont transparents et adaptés aux PME : le pack Starter démarre à 1 490 €, le pack Business à 3 990 € et le pack Premium à 7 990 €. Chaque pack inclut design sur mesure, développement Next.js, optimisation SEO, hébergement configurable et accompagnement post-lancement. Les projets sur mesure font l'objet d'un devis personnalisé.",
  },
  {
    q: 'Intervenez-vous uniquement à Lille ou dans toute la France ?',
    a: "NeuraWeb intervient dans toute la France et à l'international, mais nous sommes particulièrement bien positionnés pour accompagner les entreprises de Lille, du Nord (59), du Pas-de-Calais (62) et des Hauts-de-France. La majorité de nos réunions clients sont réalisables en visioconférence, avec possibilité de rendez-vous en présentiel à Lille.",
  },
  {
    q: "Qu'est-ce qu'un site Next.js et pourquoi choisir cette technologie ?",
    a: "Next.js est le framework React le plus performant du marché, utilisé par Vercel, Netflix et de nombreuses grandes marques. Par rapport à WordPress, il offre des temps de chargement 3 à 5 fois plus rapides, une sécurité renforcée (absence de CMS vulnérable), un SEO technique de haut niveau et une flexibilité totale pour intégrer des fonctions IA ou des API tierces. Tous nos sites dépassent 90/100 sur PageSpeed Insights.",
  },
  {
    q: "Comment NeuraWeb intègre-t-elle l'IA dans les sites web ?",
    a: "Nous intégrons l'IA à plusieurs niveaux : chatbot intelligent pour qualifier les leads et répondre aux visiteurs 24h/24, génération de contenu SEO assistée, personnalisation de l'expérience utilisateur et analyse des comportements. Ces fonctions sont développées sur mesure et reliées à vos outils existants (CRM, agenda, e-mail).",
  },
  {
    q: 'Proposez-vous un suivi après la mise en ligne du site ?',
    a: 'Oui. Tous nos packs incluent un accompagnement post-lancement : formation à la gestion du site, suivi des performances (Google Search Console, Analytics), corrections mineures pendant 30 jours et support par e-mail. Des contrats de maintenance mensuelle sont disponibles pour la mise à jour de contenu, l\'évolution des fonctionnalités et la surveillance de sécurité.',
  },
  {
    q: 'Comment fonctionne l\'automatisation n8n proposée par NeuraWeb ?',
    a: "n8n est un outil d'automatisation open-source qui connecte vos applications entre elles sans code. Concrètement, nous pouvons automatiser : la synchronisation CRM / agenda / e-mail, l'envoi de devis ou de relances automatiques, la publication de contenu sur vos réseaux sociaux, la génération de rapports hebdomadaires et bien plus. Résultat : vous gagnez plusieurs heures par semaine sur des tâches répétitives.",
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

const SERVICES = [
  {
    icon: Globe,
    title: 'Développement web',
    desc: 'Sites vitrines, e-commerce, applications web — développés en Next.js pour des performances maximales (90+/100 PageSpeed).',
    link: '/fr/developpement-web',
    linkLabel: 'Voir nos packs web',
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    icon: Smartphone,
    title: 'Apps mobiles iOS & Android',
    desc: 'Applications natives et cross-platform pour étendre votre présence digitale au-delà du web.',
    link: '/fr/mobile-app-development',
    linkLabel: 'Découvrir les apps',
    color: 'text-violet-600 bg-violet-50',
  },
  {
    icon: Brain,
    title: 'Intégration IA',
    desc: 'Chatbot IA, génération de contenu, personnalisation UX, qualification de leads 24h/24 — intégrés directement dans votre site.',
    link: '/fr/integration-ia',
    linkLabel: "Voir l'intégration IA",
    color: 'text-cyan-600 bg-cyan-50',
  },
  {
    icon: Zap,
    title: 'Automatisation n8n',
    desc: 'Connectez vos outils (CRM, agenda, e-mail, réseaux sociaux) et automatisez les tâches répétitives pour gagner des heures chaque semaine.',
    link: '/fr/automatisation',
    linkLabel: "Voir l'automatisation",
    color: 'text-rose-600 bg-rose-50',
  },
  {
    icon: Search,
    title: 'SEO & référencement local',
    desc: 'Optimisation technique, données structurées schema.org, Google Business Profile — pour apparaître en tête sur « agence web Lille » et vos mots-clés cibles.',
    link: '/fr/developpement-web',
    linkLabel: 'Notre approche SEO',
    color: 'text-indigo-600 bg-indigo-50',
  },
];

const PACKS = [
  {
    name: 'Starter',
    price: '1 490 €',
    tagline: 'Être trouvé et crédible en ligne',
    profil: 'TPE, artisans, indépendants',
    color: 'border-indigo-200',
    chipColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    featured: false,
    bullets: [
      'Site vitrine jusqu\'à 8 pages',
      'Design sur mesure (mobile-first)',
      'Optimisation SEO de base',
      'Intégration Google Analytics',
      'Formulaire de contact',
      'Hébergement Vercel inclus 1 an',
    ],
  },
  {
    name: 'Business',
    price: '3 990 €',
    tagline: 'Générer des leads et convertir',
    profil: 'PME, commerces, cabinets',
    featured: true,
    color: 'border-violet-400 ring-2 ring-violet-400',
    chipColor: 'bg-violet-600 text-white border-violet-600',
    bullets: [
      'Site jusqu\'à 20 pages',
      'Blog / actualités intégré',
      'SEO avancé + données structurées',
      'Chatbot IA de qualification',
      'Intégration CRM & outils métier',
      'Tableau de bord analytics',
      'Support 6 mois inclus',
    ],
  },
  {
    name: 'Premium',
    price: '7 990 €',
    tagline: 'Plateforme digitale sur mesure',
    profil: 'ETI, franchise, e-commerce',
    color: 'border-cyan-200',
    chipColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    featured: false,
    bullets: [
      'Application web ou e-commerce',
      'IA & automatisation n8n intégrées',
      'Multi-langue (FR / EN / ES)',
      'API & intégrations tierces',
      'Design system complet',
      'Performance garantie 90+/100',
      'Support 12 mois inclus',
    ],
  },
];

const STATS = [
  { value: '120 000', label: 'entreprises dans la métropole lilloise', icon: Building2 },
  { value: '7 656', label: 'nouvelles entreprises créées à Lille en 2025', icon: TrendingUp },
  { value: '84 %', label: 'des PME françaises ont une présence en ligne', icon: Globe },
  { value: '26 %', label: "des entreprises utilisent déjà l'IA en 2026", icon: Brain },
];

// ═════════════════════════════════════════════════════════════════════════════
// PAGE (Server Component)
// ═════════════════════════════════════════════════════════════════════════════

export default async function AgenceWebLillePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'fr') {
    permanentRedirect('/fr/agence-web-lille');
  }

  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/fr' },
    { name: 'Agence web Lille', url: PAGE_PATH },
  ]);

  return (
    <>
      <JsonLd id="agence-lille-professional-service" data={professionalServiceSchema} />
      <JsonLd id="agence-lille-faq" data={faqPageSchema} />
      <JsonLd id="agence-lille-breadcrumb" data={breadcrumbData} />

      <Header />
      <main id="main-content" className="bg-white text-slate-800 overflow-x-hidden">

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 pt-24 pb-12 md:pt-32 md:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.10),transparent_60%)] pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Fil d'Ariane */}
            <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 md:mb-8">
              <LocalizedLink href="/" className="hover:text-indigo-600 transition-colors">Accueil</LocalizedLink>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-600 font-medium">Agence web Lille</span>
            </nav>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-medium mb-4 md:mb-6">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Agence web basée à Lille, Hauts-de-France
                </div>

                <h1 className="font-display text-[2rem] leading-[1.1] sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
                  Agence web à Lille —{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                    Sites Next.js & IA
                  </span>{' '}
                  pour votre PME
                </h1>

                <p className="mt-4 md:mt-6 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl">
                  NeuraWeb conçoit des{' '}
                  <strong>sites web haute performance en Next.js</strong>, des applications
                  mobiles et des automatisations IA pour les PME et entreprises des Hauts-de-France.{' '}
                  <strong>Devis gratuit sous 24h</strong>, accompagnement local.
                </p>

                <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-600/20 h-12 px-6 sm:px-8"
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
                    className="bg-white border-indigo-300 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 h-12 px-6 sm:px-8"
                  >
                    <LocalizedLink href="/developpement-web">
                      Voir nos services
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </LocalizedLink>
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="mt-6 md:mt-10 flex flex-wrap gap-x-4 gap-y-2 sm:grid sm:grid-cols-3 sm:gap-4">
                  {[
                    { icon: Clock, label: 'Réponse 24h', longLabel: 'Réponse sous 24h', color: 'text-indigo-600' },
                    { icon: MapPin, label: 'Basé à Lille', longLabel: 'Basé à Lille (59)', color: 'text-violet-600' },
                    { icon: TrendingUp, label: '90+/100', longLabel: 'PageSpeed 90+/100', color: 'text-cyan-600' },
                  ].map(({ icon: Icon, label, longLabel, color }) => (
                    <div key={label} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-slate-700">
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
                      <span className="sm:hidden">{label}</span>
                      <span className="hidden sm:inline">{longLabel}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carte stats hero */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-indigo-600/15 border border-slate-200/60 bg-white p-6 sm:p-8">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                    Marché digital Hauts-de-France
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {STATS.map((s) => {
                      const Icon = s.icon;
                      return (
                        <div key={s.value} className="flex flex-col gap-1">
                          <Icon className="w-5 h-5 text-indigo-500 mb-1" />
                          <span className="font-display text-2xl font-extrabold text-slate-900">{s.value}</span>
                          <span className="text-xs text-slate-500 leading-snug">{s.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <p className="text-sm text-slate-600">
                      La métropole lilloise est l&apos;un des bassins économiques les plus dynamiques de France —{' '}
                      <strong className="text-slate-800">votre site web est votre premier commercial.</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── POURQUOI LILLE ──────────────────────────────────────────────── */}
        <section className="bg-slate-50 py-14 md:py-24 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">
                Pourquoi travailler avec une{' '}
                <span className="text-indigo-600">agence web locale à Lille</span> ?
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                La Métropole Européenne de Lille regroupe{' '}
                <strong>120 000 entreprises</strong> et un tissu économique varié — commerce,
                industrie, services, santé, hôtellerie. Une agence ancrée localement comprend
                vos enjeux mieux qu&apos;une agence parisienne ou nationale.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {[
                {
                  icon: Users,
                  title: 'Connaissance du tissu local',
                  desc: 'Nous connaissons les secteurs porteurs du Nord : commerce, industrie, santé, hôtellerie, restauration. Nos recommandations sont adaptées au marché lillois.',
                },
                {
                  icon: MapPin,
                  title: 'Réunions en présentiel possibles',
                  desc: "Contrairement aux agences nationales, nous pouvons vous rencontrer à Lille, à la MEL ou dans toute la région Hauts-de-France. La relation humaine est au cœur de notre approche.",
                },
                {
                  icon: Clock,
                  title: 'Réactivité & suivi personnalisé',
                  desc: 'Un interlocuteur dédié, joignable directement. Pas de ticket support perdu dans un helpdesk. Réponse garantie sous 4 heures ouvrées.',
                },
                {
                  icon: Search,
                  title: 'SEO local Hauts-de-France',
                  desc: 'Nous optimisons vos pages pour les requêtes locales (« [service] + Lille », « [service] + Nord »), le Local Pack Google et votre fiche Google Business Profile.',
                },
                {
                  icon: TrendingUp,
                  title: 'Croissance du marché digital',
                  desc: "En 2026, 26 % des entreprises utilisent déjà l'IA. Les Hauts-de-France comptent parmi les régions qui digitalisent le plus vite leur tissu de PME.",
                },
                {
                  icon: Building2,
                  title: 'Secteurs porteurs à Lille',
                  desc: 'Commerce & retail (Auchan, Decathlon, Leroy Merlin ont leur siège ici), industries de pointe, BTP, services B2B, hôtellerie, restauration — nous les connaissons tous.',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Lien interne blog */}
            <div className="mt-8 md:mt-10 text-center">
              <LocalizedLink
                href="/blog/nextjs-vs-wordpress-2026"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Pourquoi choisir Next.js plutôt que WordPress en 2026 ?
                <ArrowRight className="w-4 h-4" />
              </LocalizedLink>
            </div>
          </div>
        </section>

        {/* ── NOS SERVICES ──────────────────────────────────────────────────── */}
        <section className="py-14 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">
                Nos services pour les{' '}
                <span className="text-violet-600">PME de Lille</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                De la création de site vitrine à l&apos;application web complexe, en passant par
                l&apos;intégration IA et l&apos;automatisation — nous couvrons tout le spectre digital
                des entreprises des Hauts-de-France.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {SERVICES.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.title}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
                  >
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">{s.desc}</p>
                    <LocalizedLink
                      href={s.link}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors mt-auto"
                    >
                      {s.linkLabel}
                      <ArrowRight className="w-4 h-4" />
                    </LocalizedLink>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── NOS PACKS ──────────────────────────────────────────────────────── */}
        <section id="packs" className="py-14 md:py-28 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">
                Tarifs transparents pour{' '}
                <span className="text-indigo-600">PME lilloises</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                Pas de mauvaise surprise : des prix fixes, clairs et adaptés aux budgets
                des entreprises du Nord. Devis personnalisé gratuit pour les projets sur mesure.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {PACKS.map((pack) => (
                <div
                  key={pack.name}
                  className={`flex flex-col rounded-2xl bg-white p-6 sm:p-8 border shadow-sm ${pack.color} ${pack.featured ? 'shadow-lg' : ''}`}
                >
                  {pack.featured && (
                    <div className="text-center mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-bold">
                        <Sparkles className="w-3 h-3" />
                        Le plus populaire
                      </span>
                    </div>
                  )}
                  <div className="mb-4 md:mb-5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${pack.chipColor}`}>
                      {pack.name}
                    </span>
                  </div>
                  <div className="mb-1">
                    <span className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">{pack.price}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">{pack.tagline}</p>
                  <p className="text-xs text-slate-400 mb-5 md:mb-6">{pack.profil}</p>
                  <ul className="space-y-2.5 mb-6 md:mb-8 flex-1">
                    {pack.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={pack.featured
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white w-full'
                      : 'w-full'
                    }
                    variant={pack.featured ? 'default' : 'outline'}
                  >
                    <LocalizedLink href="/booking">
                      Demander un devis gratuit
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </LocalizedLink>
                  </Button>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-slate-400 mt-6 md:mt-8">
              Tous les prix sont HT. Hébergement Vercel inclus la première année. Projets sur mesure sur devis.
            </p>

            {/* Lien vers la page dev web */}
            <div className="mt-6 text-center">
              <LocalizedLink
                href="/developpement-web"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Voir le détail complet de nos packs web
                <ArrowRight className="w-4 h-4" />
              </LocalizedLink>
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
                { href: '/fr/integration-ia', label: 'Intégration IA sur mesure', sub: 'Chatbot, génération de contenu, personnalisation' },
                { href: '/fr/automatisation', label: 'Automatisation n8n', sub: 'Connectez vos outils, gagnez des heures' },
                { href: '/fr/equipe', label: "L'équipe NeuraWeb", sub: 'Qui nous sommes, notre vision' },
                { href: '/fr/contact', label: 'Nous contacter', sub: 'Par e-mail ou formulaire, réponse rapide' },
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
                Tout ce que les PME lilloises nous demandent avant de lancer leur projet web.
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
              Votre projet à Lille mérite le meilleur
            </span>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-5 leading-tight">
              Lancez votre projet web à Lille
            </h2>
            <p className="text-base sm:text-xl text-white/90 mb-6 md:mb-10 max-w-2xl mx-auto">
              Devis gratuit sous 24h. Sans engagement. On échange sur votre projet,
              vos objectifs et on vous propose la solution adaptée à votre budget.
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
