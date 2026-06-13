import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { JsonLd } from '@/components/json-ld';
import { RestaurantsPageClient } from '@/components/restaurants-page-client';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

const BASE_URL = 'https://neuraweb.tech';
const PAGE_PATH = '/fr/restaurants';

// Page FR uniquement — canal de conversion vertical, non traduit (ISR 1h)
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
      title: 'Création site web restaurant — NeuraWeb',
      alternates: { canonical: `${BASE_URL}${PAGE_PATH}` },
    };
  }

  const ogImage = `${BASE_URL}/assets/og-image.png`;
  const title =
    'Site web restaurant : réservation, commande sans commission — NeuraWeb';
  const description =
    'Sites web pour restaurants : réservation en ligne, click & collect, paiement Stripe sans commission (vs 30 % Uber Eats), fidélité. 7 démos en ligne. Devis gratuit.';

  return {
    title: { absolute: title },
    description,
    keywords: [
      'création site internet restaurant',
      'site web restaurant',
      'site réservation restaurant en ligne',
      'click and collect restaurant',
      'site commande restaurant sans commission',
      'site web brasserie bistrot',
      'agence web restauration',
      'site internet food truck',
      'fidélisation client restaurant',
      'paiement en ligne restaurant Stripe',
      'site web restaurant gastronomique',
      'site multi-restaurants franchise',
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
          alt: 'Sites web pour restaurants créés par NeuraWeb',
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

// ── JSON-LD : ProfessionalService (spécialisé restauration) ──
const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${BASE_URL}${PAGE_PATH}#restaurants`,
  name: 'NeuraWeb — Sites web pour restaurants',
  description:
    'Agence web spécialisée dans la création de sites internet pour restaurants, bistrots, brasseries et réseaux de restauration : réservation en ligne, commande et click & collect avec paiement Stripe sans commission, programme de fidélité, pilotage multi-sites.',
  url: `${BASE_URL}${PAGE_PATH}`,
  telephone: '+33749775654',
  email: 'contact@neuraweb.tech',
  logo: `${BASE_URL}/assets/neurawebW.webp`,
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'Paris',
    addressRegion: 'Île-de-France',
  },
  areaServed: { '@type': 'Country', name: 'France' },
  serviceType: [
    'Création de site internet pour restaurant',
    'Réservation en ligne',
    'Commande & click and collect',
    'Paiement en ligne Stripe',
    'Programme de fidélité restaurant',
    'Référencement local restauration',
  ],
};

// ── JSON-LD : FAQPage ──────────────────────────────────────────────────────
// ⚠️ Doit rester synchrone avec le tableau FAQ de restaurants-page-client.tsx
//    (Google exige que le contenu balisé soit visible sur la page).
const FAQ_DATA: { q: string; a: string }[] = [
  {
    q: 'Combien coûte un site web pour restaurant ?',
    a: "Cela dépend de vos besoins. Une landing page soignée démarre autour de 990 à 1 490 €. Un site vitrine pro (multi-pages, avis, galerie) se situe entre 1 490 et 2 490 €. Un site avec réservation en ligne, commande et paiement Stripe va de 2 990 à 3 990 €. La formule fidélité + compte client se situe entre 4 990 et 7 990 €. Pour un réseau multi-restaurants ou une franchise, c'est sur devis. À chaque fois, vous restez propriétaire de votre site et de vos données.",
  },
  {
    q: 'Pourquoi un site direct plutôt qu’Uber Eats ou Deliveroo ?',
    a: "Les plateformes de livraison prélèvent 20 à 30 % de commission sur chaque commande. Un paiement encaissé directement sur votre site via Stripe coûte environ 1,4 % + 0,25 € par transaction en Europe. Pour 5 000 € de ventes en ligne par mois, l'écart représente environ 1 400 € économisés chaque mois, soit près de 17 000 €/an. En plus, vous récupérez la donnée client (e-mail, historique) que les plateformes confisquent.",
  },
  {
    q: 'Quels sont les frais mensuels en plus du développement ?',
    a: "Les frais d'infrastructure dépendent de la formule : 10 à 20 €/mois pour une vitrine simple (domaine + hébergement), 20 à 40 €/mois avec CMS et avis, 40 à 80 €/mois dès qu'on ajoute réservation, commande et paiement (base de données + e-mail/SMS), 80 à 150 €/mois pour la fidélité avec volume marketing. S'ajoutent les frais Stripe (1,4 % + 0,25 €) uniquement sur les paiements réellement encaissés.",
  },
  {
    q: 'Puis-je commencer petit et faire évoluer le site ?',
    a: "Oui. Chaque formule inclut tout le niveau précédent. On peut démarrer par une vitrine pour être trouvable et réservable, puis ajouter la commande en ligne, puis la fidélité, sans tout refaire. Votre investissement initial n'est jamais perdu : le site grandit avec votre activité.",
  },
  {
    q: 'Comment fonctionne le click & collect ?',
    a: "Le client choisit ses plats, paie en ligne, sélectionne un créneau de retrait et reçoit un code à 4 chiffres. Il suit sa commande en direct (Reçue → En préparation → Prête à retirer). Côté cuisine, un tableau reçoit les commandes en temps réel avec un bouton pour faire avancer chaque statut. Résultat : moins d'appels « c'est prêt ? », moins d'erreurs, et un panier souvent supérieur grâce aux suggestions intégrées.",
  },
  {
    q: 'Vais-je pouvoir mettre à jour ma carte moi-même ?',
    a: "Oui. Dès la formule Vitrine Pro, vous modifiez vos plats, vos prix et vos horaires en autonomie via une interface simple. Sur les formules avec commande, vous appliquez aussi en un clic des promotions anti-gaspillage (« dernière heure », « invendu du jour », −20 à −50 %) : le prix se met à jour en direct sur la carte vue par vos clients.",
  },
  {
    q: 'Le site sera-t-il bien référencé sur Google ?',
    a: "Oui : optimisation SEO local incluse dans toutes les formules, données structurées schema.org (Restaurant, menu, horaires, avis), connexion à votre fiche Google Business Profile, sitemap XML. Objectif : apparaître quand on cherche « restaurant + quartier » et être repris par les réponses IA de Google et des assistants.",
  },
  {
    q: 'En combien de temps mon site est-il livré ?',
    a: "Comptez 1 à 2 semaines pour une landing page, 2 à 4 semaines pour une vitrine pro, 4 à 6 semaines pour un site avec réservation, commande et paiement, et 6 à 10 semaines pour une plateforme de fidélité complète. Un réseau multi-sites est planifié selon le périmètre.",
  },
  {
    q: 'À qui appartient le site et les données clients ?',
    a: "À vous, intégralement. Vous êtes propriétaire de votre nom de domaine, du code de votre site et de votre base clients (e-mails, historique de commandes, points de fidélité). Contrairement aux plateformes de livraison, personne ne s'interpose entre vous et vos clients.",
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

export default async function RestaurantsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'fr') {
    permanentRedirect('/fr/restaurants');
  }

  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/fr' },
    { name: 'Sites web pour restaurants', url: PAGE_PATH },
  ]);

  return (
    <>
      <JsonLd id="restaurants-professional-service" data={professionalServiceSchema} />
      <JsonLd id="restaurants-faq" data={faqPageSchema} />
      <JsonLd id="restaurants-breadcrumb" data={breadcrumbData} />
      <main id="main-content">
        <RestaurantsPageClient />
      </main>
    </>
  );
}
