import { Metadata } from 'next';
import ContactPageClient from '@/components/contact-page-client';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { generateAISEO } from '@/lib/seo-ai-server';

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
  const baseUrl = 'https://neuraweb.tech';

  // L'IA génère les meta tags optimisés — résultat injecté dans le <head> statique
  const seo = await generateAISEO({
    pageType: 'contact',
    language,
    path: `/${lang}/contact`,
  });

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${baseUrl}/${lang}/contact`,
      languages: {
        'fr-FR': `${baseUrl}/fr/contact`,
        'en-US': `${baseUrl}/en/contact`,
        'es-ES': `${baseUrl}/es/contact`,
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
          url: `${baseUrl}/og-image.png`,
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
      images: [`${baseUrl}/og-image.png`],
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

  return (
    <main id="main-content">
      <ContactPageClient />
    </main>
  );
}