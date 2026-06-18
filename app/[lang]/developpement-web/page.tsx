import { Metadata } from 'next';
import { DeveloppementWebPageClient } from '@/components/developpement-web-page-client';
import { JsonLd } from '@/components/json-ld';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { generateAISEO } from '@/lib/seo-ai-server';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = (lang as 'fr' | 'en' | 'es') || 'fr';
  const baseUrl = 'https://neuraweb.tech';
  const ogImage = `${baseUrl}/assets/og-image.png`;

  const seo = await generateAISEO({
    pageType: 'developpement-web',
    language,
    path: `/${lang}/developpement-web`,
  });

  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${baseUrl}/${lang}/developpement-web`,
      languages: {
        fr: `${baseUrl}/fr/developpement-web`,
        en: `${baseUrl}/en/developpement-web`,
        es: `${baseUrl}/es/developpement-web`,
        'x-default': `${baseUrl}/fr/developpement-web`,
      },
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: `${baseUrl}/${lang}/developpement-web`,
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

const generateServiceJsonLd = (lang: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name:
    lang === 'fr'
      ? 'Développement Web Sur Mesure'
      : lang === 'es'
        ? 'Desarrollo Web a Medida'
        : 'Custom Web Development',
  provider: {
    '@type': 'Organization',
    name: 'NeuraWeb',
    url: 'https://neuraweb.tech',
  },
  areaServed: 'Worldwide',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name:
      lang === 'fr'
        ? 'Packs de développement web'
        : lang === 'es'
          ? 'Paquetes de desarrollo web'
          : 'Web development packages',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: lang === 'fr' ? 'Pack Starter' : 'Starter Package',
          description:
            lang === 'fr'
              ? 'Site vitrine professionnel jusqu\'à 8 pages, design responsive, SEO technique, hébergement 1 an'
              : 'Professional showcase site up to 8 pages, responsive design, technical SEO, 1-year hosting',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '1490',
          priceCurrency: 'EUR',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: lang === 'fr' ? 'Pack Business' : 'Business Package',
          description:
            lang === 'fr'
              ? 'Site professionnel jusqu\'à 20 pages, blog, espace client, analytics avancés'
              : 'Professional site up to 20 pages, blog, client area, advanced analytics',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '3990',
          priceCurrency: 'EUR',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: lang === 'fr' ? 'Pack Premium' : 'Premium Package',
          description:
            lang === 'fr'
              ? 'E-commerce complet, intégrations API, sécurité avancée, performance maximale'
              : 'Full e-commerce, API integrations, advanced security, maximum performance',
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: '7990',
          priceCurrency: 'EUR',
        },
      },
    ],
  },
});

export default async function DeveloppementWebPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const breadcrumbNames = {
    fr: { home: 'Accueil', page: 'Développement Web' },
    en: { home: 'Home', page: 'Web Development' },
    es: { home: 'Inicio', page: 'Desarrollo Web' },
  };
  const names = breadcrumbNames[lang as keyof typeof breadcrumbNames] ?? breadcrumbNames.fr;

  const breadcrumbData = generateBreadcrumbSchema([
    { name: names.home, url: `/${lang}` },
    { name: names.page, url: `/${lang}/developpement-web` },
  ]);

  return (
    <>
      <JsonLd id="services-schema" data={generateServiceJsonLd(lang)} />
      <JsonLd id="breadcrumb-schema" data={breadcrumbData} />
      <DeveloppementWebPageClient lang={lang as 'fr' | 'en' | 'es'} />

    </>
  );
}
