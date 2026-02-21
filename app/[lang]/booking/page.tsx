import { Metadata } from 'next';
import { BookingPageClient } from '@/components/booking-page-client';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { generateAISEO } from '@/lib/seo-ai-server';

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

  // L'IA génère les meta tags optimisés
  const seo = await generateAISEO({
    pageType: 'custom',
    language,
    path: `/${lang}/booking`,
    customContext: 'Page de réservation de rendez-vous pour discuter d\'un projet web. Créneaux disponibles, confirmation immédiate.',
    customKeywords: ['rendez-vous', 'booking', 'consultation', 'devis', 'réunion', 'projet web'],
  });

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${baseUrl}/${lang}/booking`,
      languages: {
        'fr-FR': `${baseUrl}/fr/booking`,
        'en-US': `${baseUrl}/en/booking`,
        'es-ES': `${baseUrl}/es/booking`,
        'x-default': `${baseUrl}/fr/booking`,
      },
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: `${baseUrl}/${lang}/booking`,
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

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ service?: string; pack?: string }>;
}) {
  const { lang } = await params;
  const { service, pack } = await searchParams;

  return (
    <BookingPageClient 
      lang={lang as 'fr' | 'en' | 'es'} 
      preselectedService={service}
      preselectedPack={pack}
    />
  );
}