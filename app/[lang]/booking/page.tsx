import { Metadata } from 'next';
import { BookingPageClient } from '@/components/booking-page-client';
import { JsonLd } from '@/components/json-ld';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { generateAISEO } from '@/lib/seo-ai-server';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

// Juste après les imports, avant generateStaticParams()
export const revalidate = 3600; // Cache SEO 24h — évite les appels IA à chaque crawl

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
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${baseUrl}/${lang}/booking`,
      languages: {
        fr: `${baseUrl}/fr/booking`,
        en: `${baseUrl}/en/booking`,
        es: `${baseUrl}/es/booking`,
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

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ service?: string; pack?: string }>;
}) {
  const { lang } = await params;
  const { service, pack } = await searchParams;

  const breadcrumbData = generateBreadcrumbSchema([
    { name: lang === 'fr' ? 'Accueil' : lang === 'es' ? 'Inicio' : 'Home', url: `/${lang}` },
    { name: lang === 'fr' ? 'Réservation' : lang === 'es' ? 'Reserva' : 'Booking', url: `/${lang}/booking` },
  ]);

  const bookingServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: lang === 'fr' ? 'Consultation gratuite NeuraWeb' : lang === 'es' ? 'Consulta gratuita NeuraWeb' : 'Free consultation NeuraWeb',
    description: lang === 'fr'
      ? 'Réservez un rendez-vous gratuit de 30 minutes pour discuter de votre projet web, application mobile ou intégration IA.'
      : lang === 'es'
      ? 'Reserve una consulta gratuita de 30 minutos para hablar de su proyecto web, app móvil o integración IA.'
      : 'Book a free 30-minute consultation to discuss your web project, mobile app or AI integration.',
    provider: { '@type': 'Organization', name: 'NeuraWeb', url: 'https://neuraweb.tech' },
    serviceType: lang === 'fr' ? 'Développement web et IA' : lang === 'es' ? 'Desarrollo web e IA' : 'Web development and AI',
    areaServed: { '@type': 'Country', name: 'France' },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      description: lang === 'fr' ? 'Consultation gratuite' : lang === 'es' ? 'Consulta gratuita' : 'Free consultation',
    },
  };

  return (
    <>
      <JsonLd id="breadcrumb-schema" data={breadcrumbData} />
      <JsonLd id="booking-service-schema" data={bookingServiceSchema} />
      <BookingPageClient
        lang={lang as 'fr' | 'en' | 'es'}
        preselectedService={service}
        preselectedPack={pack}
      />
    </>
  );
}