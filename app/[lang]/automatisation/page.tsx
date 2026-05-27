import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { AutomatisationPageClient } from '@/components/automatisation-page-client';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

const BASE_URL = 'https://neuraweb.tech';
const PAGE_SLUG = 'automatisation';

type Lang = 'fr' | 'en' | 'es';

export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'es' }];
}

const META: Record<Lang, {
  title: string;
  description: string;
  keywords: string[];
  locale: string;
}> = {
  fr: {
    title: 'Automatisation n8n, Make, Zapier & Agents IA pour PME | NeuraWeb',
    description: "Automatisez vos processus avec n8n, Make ou Zapier. Workflows sur mesure, agents IA, sync CRM. Audit gratuit, ROI mesurable en 30 jours. Dès 999 € HT.",
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
    locale: 'fr_FR',
  },
  en: {
    title: 'n8n, Make & Zapier Automation Agency for SMBs | NeuraWeb',
    description: 'Automate your business processes with n8n, Make or Zapier. Custom workflows, AI agents, CRM sync. Free audit, measurable ROI in 30 days. From €999.',
    keywords: [
      'n8n automation agency',
      'Make automation SMB',
      'business workflow automation',
      'AI agent lead qualification',
      'process automation France',
      'n8n agency Europe',
      'make integromat agency',
      'CRM automation',
      'automation ROI',
      'no-code automation',
      'zapier agency France',
      'AI commercial agent',
    ],
    locale: 'en_US',
  },
  es: {
    title: 'Automatización n8n, Make, Zapier y Agentes IA para PYMES | NeuraWeb',
    description: 'Automatiza tus procesos con n8n, Make o Zapier. Flujos de trabajo personalizados, agentes IA, sincronización CRM. Auditoría gratuita, ROI medible en 30 días. Desde 999 €.',
    keywords: [
      'automatización n8n empresa',
      'automatización Make PYME',
      'workflow automatización negocio',
      'agente IA calificación leads',
      'automatización procesos negocio',
      'n8n agencia Europa',
      'make integromat agencia',
      'automatización CRM',
      'ROI automatización PYME',
      'automatización sin código',
      'zapier agencia Francia',
      'agente IA comercial',
    ],
    locale: 'es_ES',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l: Lang = (lang as Lang) in META ? (lang as Lang) : 'fr';
  const meta = META[l];
  const pagePath = `/${l}/${PAGE_SLUG}`;
  const ogImage = `${BASE_URL}/assets/og-image.png`;

  return {
    title: { absolute: meta.title },
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${BASE_URL}${pagePath}`,
      languages: {
        fr: `${BASE_URL}/fr/${PAGE_SLUG}`,
        en: `${BASE_URL}/en/${PAGE_SLUG}`,
        es: `${BASE_URL}/es/${PAGE_SLUG}`,
        'x-default': `${BASE_URL}/fr/${PAGE_SLUG}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${BASE_URL}${pagePath}`,
      siteName: 'NeuraWeb',
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.title }],
      locale: meta.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [ogImage],
      creator: '@neurawebtech',
    },
  };
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Business Process Automation — NeuraWeb',
  description:
    'Agency specialised in n8n, Make and Zapier automation for SMBs. Custom workflows, AI agents, CRM/ERP sync. Free audit included.',
  url: `${BASE_URL}/fr/${PAGE_SLUG}`,
  provider: {
    '@type': 'Organization',
    name: 'NeuraWeb',
    url: BASE_URL,
  },
  areaServed: { '@type': 'Country', name: 'France' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Automation Packs',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Pack Starter Auto',
        price: '999',
        priceCurrency: 'EUR',
        description: 'Audit + 1 complex workflow delivered and tested. From €999 ex. VAT.',
      },
      {
        '@type': 'Offer',
        name: 'Pack Business Auto',
        price: '2999',
        priceCurrency: 'EUR',
        description: '3 to 5 workflows + 1 AI agent. Monthly monitoring included.',
      },
      {
        '@type': 'Offer',
        name: 'Pack Full Automation',
        price: '5999',
        priceCurrency: 'EUR',
        description: 'Unlimited workflows, multi-source AI agents, real-time monitoring.',
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

const BREADCRUMB_NAMES: Record<Lang, [string, string]> = {
  fr: ['Accueil', 'Automatisation'],
  en: ['Home', 'Automation'],
  es: ['Inicio', 'Automatización'],
};

export default async function AutomatisationPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l: Lang = (lang as Lang) in META ? (lang as Lang) : 'fr';
  const pagePath = `/${l}/${PAGE_SLUG}`;

  const breadcrumbData = generateBreadcrumbSchema([
    { name: BREADCRUMB_NAMES[l][0], url: `/${l}` },
    { name: BREADCRUMB_NAMES[l][1], url: pagePath },
  ]);

  return (
    <>
      <JsonLd id="automatisation-service" data={serviceSchema} />
      <JsonLd id="automatisation-faq" data={faqSchema} />
      <JsonLd id="automatisation-breadcrumb" data={breadcrumbData} />
      <AutomatisationPageClient lang={l} />
    </>
  );
}
