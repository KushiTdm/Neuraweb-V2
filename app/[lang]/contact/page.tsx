import { Metadata } from 'next';
import ContactPageClient from '@/components/contact-page-client';
import { JsonLd } from '@/components/json-ld';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { generateAISEO } from '@/lib/seo-ai-server';
import { localBusinessSchema, generateBreadcrumbSchema } from '@/lib/structured-data';

// Juste après les imports, avant generateStaticParams()
export const revalidate = 3600; // Cache SEO 24h — évite les appels IA à chaque crawl

// Génération des paramètres statiques
export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

// Métadonnées dynamiques par langue - IA server-side
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = (lang as 'fr' | 'en' | 'es') || 'fr';
  const baseUrl = 'https://neuraweb.fr';

  // L'IA génère les meta tags optimisés — résultat injecté dans le <head> statique
  const seo = await generateAISEO({
    pageType: 'contact',
    language,
    path: `/${lang}/contact`,
  });

  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${baseUrl}/${lang}/contact`,
      languages: {
        fr: `${baseUrl}/fr/contact`,
        en: `${baseUrl}/en/contact`,
        es: `${baseUrl}/es/contact`,
        'x-default': `${baseUrl}/fr/contact`,
      },
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: `${baseUrl}/${lang}/contact`,
      siteName: 'NeuraWeb',
      images: [
        {
          url: `${baseUrl}/assets/og-image.png`,
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
      images: [`${baseUrl}/assets/og-image.png`],
      creator: '@neurawebtech',
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Breadcrumb pour navigation SERP
  const breadcrumbData = generateBreadcrumbSchema([
    { name: lang === 'fr' ? 'Accueil' : lang === 'es' ? 'Inicio' : 'Home', url: `/${lang}` },
    { name: 'Contact', url: `/${lang}/contact` },
  ]);

  return (
    <>
      {/* LocalBusiness — porte l'aggregateRating (étoiles SERP). Restreint aux pages
          "fiche entreprise" : home, /contact, /equipe. */}
      <JsonLd id="localbusiness-schema" data={localBusinessSchema} />
      <JsonLd id="breadcrumb-schema" data={breadcrumbData} />
      <main id="main-content">
        <ContactPageClient />
      </main>
    </>
  );
}