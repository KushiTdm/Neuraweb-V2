import type { Metadata } from 'next';
import { HomePageClient } from '@/components/home-page-client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { generatePageMetadata, generateJsonLd } from '@/lib/seo-service';

// Génération des métadonnées SEO optimisées
export const metadata: Metadata = generatePageMetadata({
  pageType: 'home',
  language: 'fr',
  path: '/',
  customKeywords: [
    'agence web Paris',
    'développement web France',
    'intégration IA',
    'automatisation business',
    'React Next.js',
  ],
});

// JSON-LD structured data for Google - généré dynamiquement
const jsonLd = generateJsonLd('ProfessionalService', {
  pageType: 'home',
  language: 'fr',
  path: '/',
}, {
  name: 'NeuraWeb',
  url: 'https://neuraweb.tech',
  logo: 'https://neuraweb.tech/assets/neurawebW.webp',
  description:
    'Agence digitale premium spécialisée en développement web sur mesure, intégration IA et automatisation.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'FR',
    addressLocality: 'Paris',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@neuraweb.tech',
    contactType: 'customer service',
    availableLanguage: ['French', 'English', 'Spanish'],
  },
  sameAs: ['https://neuraweb.tech'],
  serviceType: ['Web Development', 'AI Integration', 'Automation', 'Digital Marketing'],
  priceRange: '€€',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '120',
    bestRating: '5',
  },
});

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <HomePageClient />
      <Footer />
    </>
  );
}
