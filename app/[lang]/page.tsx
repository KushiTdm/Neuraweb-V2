import { Metadata } from 'next';
import { ServicesPageClient } from '@/components/services-page-client';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { generateAISEO } from '@/lib/seo-ai-server';

// Génération des paramètres statiques
export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

// ✅ AJOUTÉ : force le caching statique 24h — évite les appels IA à chaque crawl Google
// C'est la cause probable du statut "Détectée, non indexée" : Google tombait sur des
// temps de réponse lents dus à l'appel API externe dans generateMetadata.
export const revalidate = 86400;

// Métadonnées dynamiques par langue - IA server-side
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = (lang as 'fr' | 'en' | 'es') || 'fr';
  const baseUrl = 'https://neuraweb.tech';

  // ✅ CORRIGÉ : chemin de l'image OG (était /og-image.png)
  const ogImage = `${baseUrl}/assets/og-image.png`;

  // L'IA génère les meta tags optimisés — résultat injecté dans le <head> statique
  const seo = await generateAISEO({
    pageType: 'services',
    language,
    path: `/${lang}/services`,
  });

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${baseUrl}/${lang}/services`,
      // ✅ CORRIGÉ : format hreflang court ('fr' pas 'fr-FR') — cohérent avec layout.tsx
      languages: {
        fr: `${baseUrl}/fr/services`,
        en: `${baseUrl}/en/services`,
        es: `${baseUrl}/es/services`,
        'x-default': `${baseUrl}/fr/services`,
      },
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: `${baseUrl}/${lang}/services`,
      siteName: 'NeuraWeb',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seo.ogTitle,
        },
      ],
      locale: language === 'fr' ? 'fr_FR' : language === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [ogImage],
      creator: '@neurawebtech',
    },
  };
}

// JSON-LD structuré
const generateServiceJsonLd = (lang: string) => ({
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
});

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateServiceJsonLd(lang)) }}
      />
      <main id="main-content">
        <ServicesPageClient />
      </main>
    </>
  );
}