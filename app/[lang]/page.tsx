import type { Metadata } from 'next';
import { HomePageClient } from '@/components/home-page-client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { JsonLd } from '@/components/json-ld';
import { professionalServiceSchema, generateFaqSchema, HOME_FAQ_ITEMS, localBusinessSchema } from '@/lib/structured-data';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { generateAISEO } from '@/lib/seo-ai-server';

// ✅ AJOUTÉ : force le caching statique 24h — évite les appels IA à chaque crawl Google
export const revalidate = 3600;

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = (lang as 'fr' | 'en' | 'es') || 'fr';
  const baseUrl = 'https://neuraweb.tech';

  // ✅ CORRIGÉ : chemin de l'image OG (était /og-image.png)
  const ogImage = `${baseUrl}/assets/logo/neuraweb-agence_tech.png`;

  const seo = await generateAISEO({
    pageType: 'home',
    language,
    path: `/${lang}`,
  });

  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      // ✅ CORRIGÉ : format hreflang court ('fr' pas 'fr-FR') — cohérent avec layout.tsx
      languages: {
        fr: `${baseUrl}/fr`,
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
        'x-default': `${baseUrl}/fr`,
      },
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: `${baseUrl}/${lang}`,
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const language = (lang as 'fr' | 'en' | 'es') || 'fr';

  return (
    <>
      <JsonLd id="professional-service-schema" data={professionalServiceSchema} />
      {/* FAQ localisée — même source que la section FAQ visible (HOME_FAQ_ITEMS) */}
      <JsonLd id="home-faq-schema" data={generateFaqSchema(HOME_FAQ_ITEMS[language] ?? HOME_FAQ_ITEMS.fr)} />
      {/* LocalBusiness — porte l'aggregateRating (étoiles SERP). Restreint aux pages
          "fiche entreprise" : home, /contact, /equipe. */}
      <JsonLd id="localbusiness-schema" data={localBusinessSchema} />
      <Header />
      <main id="main-content">
        <HomePageClient />
      </main>
      <Footer />
    </>
  );
}