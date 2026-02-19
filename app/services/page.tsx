import { Metadata } from 'next';
import { ServicesPageClient } from '@/components/services-page-client';
import { generatePageMetadata, generateJsonLd } from '@/lib/seo-service';

// Génération des métadonnées SEO optimisées via le service SEO
export const metadata: Metadata = generatePageMetadata({
  pageType: 'services',
  language: 'fr',
  path: '/services',
  customKeywords: [
    'services web',
    'développement web',
    'intégration IA',
    'automatisation',
    'pack starter',
    'pack business',
    'pack premium',
    'tarifs développement',
    'agence web',
    'devis gratuit',
  ],
}, {
  ogImage: '/og-services.png',
});

// JSON-LD structuré généré dynamiquement
const jsonLd = generateJsonLd('Service', {
  pageType: 'services',
  language: 'fr',
  path: '/services',
}, {
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
});

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesPageClient />
    </>
  );
}