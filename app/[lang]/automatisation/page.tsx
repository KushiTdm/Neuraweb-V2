import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { JsonLd } from '@/components/json-ld';
import { AutomatisationPageClient } from '@/components/automatisation-page-client';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

const BASE_URL = 'https://neuraweb.tech';
const PAGE_PATH = '/fr/automatisation';

export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ lang: 'fr' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (lang !== 'fr') {
    return {
      title: 'Automatisation n8n Make Zapier — Neuraweb',
      alternates: { canonical: `${BASE_URL}${PAGE_PATH}` },
    };
  }

  const title = 'Automatisation n8n, Make, Zapier & Agents IA pour PME | NeuraWeb';
  const description =
    "Automatisez vos processus avec n8n, Make ou Zapier. Workflows sur mesure, agents IA, sync CRM. Audit gratuit, ROI mesurable en 30 jours. Dès 999 € HT.";
  const ogImage = `${BASE_URL}/assets/og-image.png`;

  return {
    title: { absolute: title },
    description,
    keywords: [
      'automatisation n8n France',
      'automatisation Make PME',
      'workflow automatisation entreprise',
      'agent IA qualification leads',
      'automatisation processus métier',
      'n8n agence France',
      'make integromat agence',
      'automatisation CRM France',
      'ROI automatisation PME',
      'automatisation sans code',
      'zapier agence française',
      'agent IA commercial',
    ],
    alternates: {
      canonical: `${BASE_URL}${PAGE_PATH}`,
      languages: {
        fr: `${BASE_URL}${PAGE_PATH}`,
        'x-default': `${BASE_URL}${PAGE_PATH}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${PAGE_PATH}`,
      siteName: 'NeuraWeb',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@neurawebtech',
    },
  };
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Automatisation de processus — NeuraWeb',
  description:
    'Agence spécialisée en automatisation n8n, Make et Zapier pour PME françaises. Workflows sur mesure, agents IA, synchronisation CRM/ERP. Audit gratuit inclus.',
  url: `${BASE_URL}${PAGE_PATH}`,
  provider: {
    '@type': 'Organization',
    name: 'NeuraWeb',
    url: BASE_URL,
  },
  areaServed: { '@type': 'Country', name: 'France' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Packs automatisation',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Pack Starter Auto',
        price: '999',
        priceCurrency: 'EUR',
        description: 'Audit + 1 workflow complexe livré et testé. À partir de 999 € HT.',
      },
      {
        '@type': 'Offer',
        name: 'Pack Business Auto',
        price: '2999',
        priceCurrency: 'EUR',
        description: '3 à 5 workflows + 1 agent IA. Monitoring mensuel inclus.',
      },
      {
        '@type': 'Offer',
        name: 'Pack Full Automation',
        price: '5999',
        priceCurrency: 'EUR',
        description: 'Workflows illimités, agents IA multi-sources, monitoring temps réel.',
      },
    ],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quelle est la différence entre n8n, Make et Zapier ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Make est notre recommandation par défaut pour la plupart des PME : 12€/mois pour 10 000 opérations, serveurs AWS EU. n8n est indispensable pour les agents IA autonomes ou les données sensibles — l'édition Community est gratuite en self-hosted. Zapier convient pour démarrer vite mais devient cher à l'échelle.",
      },
    },
    {
      '@type': 'Question',
      name: 'Combien de temps avant de voir un ROI ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pour un workflow simple, le ROI est immédiat. Pour un agent IA de qualification, comptez 2 à 4 semaines. La plupart de nos clients amortissent leur investissement en moins de 3 mois.',
      },
    },
    {
      '@type': 'Question',
      name: "Comment se déroule l'audit gratuit ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Un appel de 30 à 60 minutes. On analyse vos outils, vos processus et les tâches chronophages. Vous repartez avec une liste priorisée des workflows à automatiser, l'outil recommandé et une estimation de ROI. Sans engagement.",
      },
    },
  ],
};

export default async function AutomatisationPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'fr') {
    redirect(PAGE_PATH);
  }

  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/fr' },
    { name: 'Automatisation', url: PAGE_PATH },
  ]);

  return (
    <>
      <JsonLd id="automatisation-service" data={serviceSchema} />
      <JsonLd id="automatisation-faq" data={faqSchema} />
      <JsonLd id="automatisation-breadcrumb" data={breadcrumbData} />
      <AutomatisationPageClient />
    </>
  );
}
