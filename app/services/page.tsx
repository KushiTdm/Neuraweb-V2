import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ServicesPageClient } from '@/components/services-page-client';

export const metadata: Metadata = {
  title: 'Services - Solutions Web Sur Mesure | NeuraWeb',
  description: 'Découvrez nos services de développement web, intégration IA et automatisation. Packs starter, business, premium et IA adaptés à vos besoins. Devis gratuit.',
  keywords: [
    'services web',
    'développement web',
    'intégration IA',
    'automatisation',
    'pack starter',
    'pack business',
    'pack premium',
    'tarifs développement',
    'agence web',
  ],
  openGraph: {
    title: 'Services Web Professionnels - NeuraWeb',
    description: 'Solutions complètes de développement web avec des packs adaptés à chaque besoin',
    url: 'https://neuraweb.tech/services',
    siteName: 'NeuraWeb',
    images: [
      {
        url: '/og-services.png',
        width: 1200,
        height: 630,
        alt: 'NeuraWeb Services',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services Web Professionnels - NeuraWeb',
    description: 'Solutions complètes de développement web',
    images: ['/og-services.png'],
  },
  alternates: {
    canonical: 'https://neuraweb.tech/services',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Services de Développement Web',
  provider: {
    '@type': 'Organization',
    name: 'NeuraWeb',
    url: 'https://neuraweb.tech',
  },
  areaServed: 'Worldwide',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Packs de développement web',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Pack Starter',
          description: 'Solution idéale pour démarrer votre présence en ligne',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Pack Business',
          description: 'Solution complète pour entreprises en croissance',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Pack Premium',
          description: 'Solution premium pour projets ambitieux',
        },
      },
    ],
  },
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <ServicesPageClient />
      <Footer />
    </>
  );
}