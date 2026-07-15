import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { JsonLd } from '@/components/json-ld';
import { CollectivitesPageClient } from '@/components/collectivites-page-client';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

const BASE_URL = 'https://neuraweb.fr';
const PAGE_PATH = '/fr/collectivites';

// Page FR uniquement — canal de conversion B2G (marchés publics), non traduit (ISR 1h)
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
      title: 'Site web mairie & collectivité — NeuraWeb',
      alternates: { canonical: `${BASE_URL}${PAGE_PATH}` },
    };
  }

  const ogImage = `${BASE_URL}/assets/og-image.png`;
  const title =
    'Site web mairie & collectivité : RGAA, RGPD, IA — NeuraWeb';
  const description =
    'Agence web pour mairies et collectivités : sites conformes RGAA & RGPD, démarches en ligne, chatbot IA et app citoyenne. Audit gratuit, hébergement France.';

  return {
    title: { absolute: title },
    description,
    keywords: [
      'site internet mairie',
      'site web collectivité territoriale',
      'agence web collectivités',
      'accessibilité RGAA site public',
      'mise en conformité site mairie',
      'démarches en ligne commune',
      'chatbot mairie IA',
      'application mobile citoyenne',
      'site web commune RGPD',
      'marché public site internet',
      'refonte site mairie',
      'transformation numérique collectivité',
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
          alt: 'Sites web et services numériques pour collectivités par NeuraWeb',
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

// ── JSON-LD : ProfessionalService (spécialisé collectivités / B2G) ──
const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${BASE_URL}${PAGE_PATH}#collectivites`,
  name: 'NeuraWeb — Sites web & services numériques pour collectivités',
  description:
    'Agence web spécialisée dans les sites internet et services numériques des collectivités : mairies, intercommunalités, CCAS, offices de tourisme. Mise en conformité accessibilité RGAA et ARCOM, conformité RGPD/CNIL, démarches en ligne, chatbot IA conforme à l’AI Act, application mobile citoyenne, visibilité numérique des commerces locaux.',
  url: `${BASE_URL}${PAGE_PATH}`,
  email: 'contact@neuraweb.tech',
  logo: `${BASE_URL}/assets/neurawebW.webp`,
  priceRange: '€€€',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'Lille',
    addressRegion: 'Hauts-de-France',
    postalCode: '59000',
  },
  areaServed: { '@type': 'Country', name: 'France' },
  serviceType: [
    'Création et refonte de site internet de collectivité',
    'Mise en conformité accessibilité RGAA',
    'Conformité RGPD et cookies',
    'Démarches en ligne et espace citoyen',
    'Chatbot IA pour services à la population',
    'Application mobile citoyenne',
    'Visibilité numérique des commerces locaux',
  ],
};

// ── JSON-LD : FAQPage ──────────────────────────────────────────────────────
// ⚠️ Doit rester synchrone avec le tableau FAQ de collectivites-page-client.tsx
//    (Google exige que le contenu balisé soit visible sur la page).
const FAQ_DATA: { q: string; a: string }[] = [
  {
    q: 'Une commune peut-elle nous confier un projet sans appel d’offres ?',
    a: "Oui, dans la plupart des cas. Depuis le 1er avril 2026, un marché de fournitures ou de services peut être conclu sans publicité ni mise en concurrence sous 60 000 € HT (le seuil était de 40 000 € HT auparavant). La grande majorité des projets web, chatbot ou application pour une commune de taille moyenne entre dans cette fenêtre. Au-delà, on passe en procédure adaptée (MAPA), dont la collectivité définit librement les modalités. Nous maîtrisons le Code de la commande publique et accompagnons vos services sur la procédure la plus adaptée au périmètre retenu.",
  },
  {
    q: 'Notre site est-il vraiment exposé à une sanction d’accessibilité ?',
    a: "Oui. L’article 47 de la loi de 2005 impose l’accessibilité (RGAA 4.1.2) aux sites publics, et le décret n° 2023-931 du 9 octobre 2023 a confié à l’ARCOM un pouvoir de sanction. Après une mise en demeure laissant 3 mois pour corriger, l’ARCOM peut prononcer une amende pouvant aller jusqu’à 50 000 € par service numérique non conforme, reconductible. L’absence de déclaration d’accessibilité ou de schéma pluriannuel est elle aussi sanctionnable. Nous réalisons un audit d’accessibilité gracieux pour situer votre site.",
  },
  {
    q: 'Que comprend exactement la mise en conformité RGAA ?',
    a: "Un audit sur les 106 critères du RGAA 4.1.2, une remise à niveau du site (structure sémantique, contrastes, navigation clavier, formulaires accessibles, médias sous-titrés, PDF balisés), la rédaction de la déclaration d’accessibilité à afficher dès la page d’accueil, l’état des non-conformités, un plan de correction priorisé et l’aide à la rédaction du schéma pluriannuel sur 3 ans. L’accessibilité est intégrée dès la conception, pas ajoutée après coup.",
  },
  {
    q: 'Le chatbot pour la mairie est-il conforme au RGPD et à l’AI Act ?',
    a: "Oui, par conception. L’usager est clairement informé qu’il dialogue avec une IA — c’est l’obligation de transparence de l’article 50 de l’AI Act, juridiquement contraignante depuis le 2 août 2026. Les données sont hébergées en France ou dans l’UE, le traitement est documenté (base légale, information des personnes) et une escalade vers un agent humain reste toujours possible. Le chatbot oriente vers la bonne démarche 24h/24 et désengorge l’accueil sur les questions fréquentes.",
  },
  {
    q: 'Où sont hébergées les données des administrés ?',
    a: "En France ou dans l’Union européenne, avec SSL/HTTPS systématique, sauvegardes automatiques, chiffrement et gestion des accès. Pour les données les plus sensibles, nous privilégions un hébergement souverain. La collectivité reste propriétaire de ses contenus, de son code source et de ses données, et nous contractualisons la réversibilité dès le départ.",
  },
  {
    q: 'Peut-on commencer petit puis élargir le projet ?',
    a: "Oui, c’est même recommandé pour une collectivité. Le projet se phase : on peut démarrer par la refonte du site et sa mise en conformité, puis ajouter les démarches en ligne, le chatbot, l’application mobile citoyenne (réservation de salles, signalement, agenda) et la visibilité des commerces locaux, sans rien refaire. Chaque brique est indépendante et budgétée séparément.",
  },
  {
    q: 'Quelles retombées concrètes pour la commune ?',
    a: "Une réduction de la charge d’accueil téléphonique et physique sur les demandes répétitives, un meilleur taux de remplissage des salles et ateliers grâce à la réservation 24h/24, des données d’usage anonymisées pour ajuster les ressources, un lien renforcé entre habitants et mairie via le signalement citoyen, et une image modernisée utile à l’attractivité du territoire.",
  },
  {
    q: 'En combien de temps un projet est-il livré ?',
    a: "Comptez 4 à 8 semaines pour une refonte de site conforme RGAA, 6 à 10 semaines en ajoutant les démarches en ligne et un chatbot, et un planning dédié pour une application mobile citoyenne ou un dispositif multi-services. Nous proposons systématiquement un audit et un échange gracieux d’environ 30 minutes avant toute proposition chiffrée.",
  },
];

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_DATA.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default async function CollectivitesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'fr') {
    permanentRedirect('/fr/collectivites');
  }

  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/fr' },
    { name: 'Collectivités & secteur public', url: PAGE_PATH },
  ]);

  return (
    <>
      <JsonLd id="collectivites-professional-service" data={professionalServiceSchema} />
      <JsonLd id="collectivites-faq" data={faqPageSchema} />
      <JsonLd id="collectivites-breadcrumb" data={breadcrumbData} />
      <main id="main-content">
        <CollectivitesPageClient />
      </main>
    </>
  );
}
