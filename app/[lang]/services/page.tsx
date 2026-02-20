import { Metadata } from 'next';
import { ServicesPageClient } from '@/components/services-page-client';
import { generatePageMetadata, generateJsonLd } from '@/lib/seo-service';
import { SUPPORTED_LANGUAGES } from '@/middleware';

// Génération des paramètres statiques
export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

// Métadonnées dynamiques par langue
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<string, string> = {
    fr: 'Services - Solutions Web Sur Mesure | NeuraWeb',
    en: 'Services - Custom Web Solutions | NeuraWeb',
    es: 'Servicios - Soluciones Web Personalizadas | NeuraWeb',
  };

  const descriptions: Record<string, string> = {
    fr: 'Découvrez nos services de développement web, intégration IA et automatisation. Packs adaptés à vos besoins. Devis gratuit.',
    en: 'Discover our web development services, AI integration and automation. Packs tailored to your needs. Free quote.',
    es: 'Descubra nuestros servicios de desarrollo web, integración de IA y automatización. Paquetes adaptados a sus necesidades. Presupuesto gratis.',
  };

  const baseUrl = 'https://neuraweb.tech';

  return {
    title: titles[lang] || titles.fr,
    description: descriptions[lang] || descriptions.fr,
    alternates: {
      canonical: `${baseUrl}/${lang}/services`,
      languages: {
        'fr-FR': `${baseUrl}/fr/services`,
        'en-US': `${baseUrl}/en/services`,
        'es-ES': `${baseUrl}/es/services`,
        'x-default': `${baseUrl}/fr/services`,
      },
    },
    openGraph: {
      title: titles[lang] || titles.fr,
      description: descriptions[lang] || descriptions.fr,
      url: `${baseUrl}/${lang}/services`,
      siteName: 'NeuraWeb',
      images: [
        {
          url: '/og-services.png',
          width: 1200,
          height: 630,
          alt: 'NeuraWeb Services',
        },
      ],
      locale: lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
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