import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { JsonLd } from '@/components/json-ld';
import { SantePageClient } from '@/components/sante-page-client';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

const BASE_URL = 'https://neuraweb.fr';
const PAGE_PATH = '/fr/sante';

// Page FR uniquement — généreration statique 24h
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
    // Les autres langues redirigent côté next.config.js — fallback metadata minimale
    return {
      title: 'Création site web santé — Neuraweb',
      alternates: { canonical: `${BASE_URL}${PAGE_PATH}` },
    };
  }

  const ogImage = `${BASE_URL}/assets/site_osteo.png`;
  const title =
    'Création site web santé libéral | RGPD/HDS, Doctolib — NeuraWeb';
  const description =
    'Sites web pour professionnels de santé libéraux. Hébergement France, RGPD/HDS, intégration Doctolib, livraison en 1 semaine. Devis gratuit. Dès 990 €.';

  return {
    title: { absolute: title },
    description,
    keywords: [
      'création site internet ostéopathe',
      'site web kinésithérapeute',
      'site internet infirmier libéral',
      'site web professionnel de santé',
      'agence web santé HDS',
      'site internet sage-femme',
      'site web cabinet médical',
      'site internet podologue',
      'hébergement HDS site santé',
      'site web conforme RGPD santé',
      'création site libéral santé',
      'site doctolib personnalisé',
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
          alt: 'Exemple de site web pour ostéopathe créé par Neuraweb',
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

// ── JSON-LD : MedicalBusiness (override le LocalBusiness global pour cette page santé) ──
const medicalBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'ProfessionalService'],
  '@id': `${BASE_URL}${PAGE_PATH}#medicalbusiness`,
  name: 'Neuraweb — Sites web pour professionnels de santé',
  description:
    'Agence web spécialisée dans la création de sites internet pour ostéopathes, kinésithérapeutes, infirmiers libéraux, sages-femmes et professionnels de santé. Hébergement France, conformité RGPD et HDS, intégration Doctolib.',
  url: `${BASE_URL}${PAGE_PATH}`,
  telephone: '+33749775654',
  email: 'contact@neuraweb.fr',
  image: `${BASE_URL}/assets/site_osteo.png`,
  logo: `${BASE_URL}/assets/neurawebW.webp`,
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'Lille',
    addressRegion: 'Hauts-de-France',
  },
  areaServed: {
    '@type': 'Country',
    name: 'France',
  },
  serviceType: [
    'Création de site internet pour professionnels de santé',
    'Hébergement HDS',
    'Intégration Doctolib',
    'Référencement local santé',
  ],
};

// ── JSON-LD : OfferCatalog (les 4 packs) ──
const offerCatalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Packs de création de site web pour professionnels de santé',
  itemListElement: [
    {
      '@type': 'Offer',
      name: 'Pack Vitrine Santé',
      description:
        'Site vitrine essentiel pour libéral solo (ostéopathe, kiné, infirmier). Hébergement France, lien Doctolib, SEO local. Livraison en 1 semaine.',
      price: '990',
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '29',
        priceCurrency: 'EUR',
        billingIncrement: 1,
        unitCode: 'MON',
      },
      itemOffered: {
        '@type': 'Service',
        name: 'Création site web santé Vitrine',
      },
    },
    {
      '@type': 'Offer',
      name: 'Pack Vitrine Pro + Blog',
      description:
        'Site professionnel avec blog autonome, 3 articles SEO de lancement, newsletter, intégrations sociales. Pour cabinets établis.',
      price: '1490',
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '49',
        priceCurrency: 'EUR',
        billingIncrement: 1,
        unitCode: 'MON',
      },
      itemOffered: {
        '@type': 'Service',
        name: 'Création site web santé avec blog',
      },
    },
    {
      '@type': 'Offer',
      name: 'Pack Pro Santé',
      description:
        'Plateforme multi-praticiens avec réservation en ligne, espace patient, rappels SMS, hébergement HDS certifié. Pour cabinets structurés.',
      price: '4490',
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '129',
        priceCurrency: 'EUR',
        billingIncrement: 1,
        unitCode: 'MON',
      },
      itemOffered: {
        '@type': 'Service',
        name: 'Plateforme web santé HDS multi-praticiens',
      },
    },
    {
      '@type': 'Offer',
      name: 'Pack Premium Santé',
      description:
        'Écosystème digital complet pour réseaux et cliniques : multi-sites, CRM patient, marketing automation, BI, HDS + ISO 27001.',
      price: '8900',
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '219',
        priceCurrency: 'EUR',
        billingIncrement: 1,
        unitCode: 'MON',
      },
      itemOffered: {
        '@type': 'Service',
        name: 'Écosystème digital santé Premium',
      },
    },
  ],
};

// ── JSON-LD : FAQPage (10 questions) ──
const FAQ_DATA: { q: string; a: string }[] = [
  {
    q: 'Mon site doit-il être HDS ?',
    a: "L'hébergement HDS est obligatoire dès que votre site stocke des données de santé à caractère personnel (identité + historique de soins, dossiers patients). Pour un site vitrine simple avec lien Doctolib et formulaire de contact sans base de données, l'HDS n'est pas requis. Les Packs Pro Santé et Premium incluent systématiquement l'hébergement HDS certifié.",
  },
  {
    q: 'Puis-je garder mon Doctolib ?',
    a: "Oui, et c'est même recommandé. Doctolib est un excellent moteur de réservation, mais ce n'est pas votre vitrine. Votre site web référence votre nom propre sur Google et présente votre expertise.",
  },
  {
    q: 'Qui rédige les textes du site ?',
    a: 'Par défaut, vous fournissez les textes. Nous proposons une option Rédaction SEO pour confier la production à nos rédacteurs spécialisés santé.',
  },
  {
    q: 'Et si je veux changer un tarif ou un horaire après livraison ?',
    a: 'Les modifications de contenu sont incluses selon votre pack : 2/mois en Vitrine Pro, 5/mois en Pro Santé, illimitées en Premium. Pour le Pack Vitrine, ces modifications sont facturées hors abonnement.',
  },
  {
    q: 'Combien de temps dure la création ?',
    a: 'De 5 à 8 jours pour le Pack Vitrine Santé, 3 à 4 semaines pour le Vitrine Pro + Blog, 6 à 8 semaines pour le Pro Santé, 8 à 12 semaines pour le Premium.',
  },
  {
    q: 'Mes données et celles de mes patients sont-elles sécurisées ?',
    a: 'Oui : SSL/HTTPS systématique, hébergement France/Europe, sauvegardes automatiques. Pour les Packs Pro Santé et Premium qui stockent des données patients, nous utilisons un hébergement HDS certifié avec chiffrement AES-256 et TLS 1.3.',
  },
  {
    q: 'Puis-je payer en plusieurs fois ?',
    a: 'Oui : 40% à la commande, 30% à la validation des maquettes, 30% à la livraison. L\'abonnement maintenance est ensuite prélevé automatiquement chaque mois.',
  },
  {
    q: "Que se passe-t-il si je veux arrêter l'abonnement ?",
    a: "Après les 12 mois d'engagement initial, l'abonnement est résiliable à tout moment avec un préavis de 30 jours. Vous récupérez l'export complet de votre site et restez propriétaire de votre nom de domaine.",
  },
  {
    q: 'Le site sera-t-il bien référencé sur Google ?',
    a: 'Oui : optimisation SEO locale incluse dans tous les packs, schema.org MedicalBusiness, connexion à votre Google Business Profile, balises meta optimisées, sitemap XML.',
  },
  {
    q: 'Proposez-vous la prise de rendez-vous en ligne ?',
    a: 'Oui : à partir du Pack Pro Santé, la réservation en ligne est intégrée nativement. Pour les Packs Vitrine et Vitrine Pro, nous intégrons un lien fluide vers Doctolib/KelDoc/Maiia.',
  },
];

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_DATA.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default async function SantePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'fr') {
    permanentRedirect('/fr/sante');
  }

  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/fr' },
    { name: 'Santé & Paramédical', url: PAGE_PATH },
  ]);

  return (
    <>
      <JsonLd id="sante-medical-business" data={medicalBusinessSchema} />
      <JsonLd id="sante-offer-catalog" data={offerCatalogSchema} />
      <JsonLd id="sante-faq" data={faqPageSchema} />
      <JsonLd id="sante-breadcrumb" data={breadcrumbData} />
      <main id="main-content">
        <SantePageClient />
      </main>
    </>
  );
}
