import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { JsonLd } from '@/components/json-ld';
import { IntegrationIAPageClient } from '@/components/integration-ia-page-client';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

const BASE_URL = 'https://neuraweb.tech';
const PAGE_PATH = '/fr/integration-ia';

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
      title: 'Intégration IA, Chatbot RAG & Agents IA — Neuraweb',
      alternates: { canonical: `${BASE_URL}${PAGE_PATH}` },
    };
  }

  const title = 'Intégration IA, Chatbot RAG, Agents Autonomes | NeuraWeb';
  const description =
    "Intégrez l'IA dans votre site : chatbot RAG, agents IA, LLM (Claude, Mistral, GPT), génération de contenu. Audit gratuit 490 €. Dès 1 499 € HT.";
  const ogImage = `${BASE_URL}/assets/og-image.png`;

  return {
    title: { absolute: title },
    description,
    keywords: [
      'intégration IA site web',
      'chatbot IA entreprise',
      'agent IA commercial',
      'RAG chatbot France',
      'intégration Claude GPT France',
      'agent IA autonome PME',
      'chatbot intelligent site web',
      'IA agentique entreprise',
      'génération contenu IA',
      'intégration LLM',
      'agence IA France',
      'chatbot FAQ intelligent',
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
  name: 'Intégration IA & Chatbots — NeuraWeb',
  description:
    'Agence spécialisée en intégration IA pour PME : chatbots RAG, agents IA commerciaux, LLM (Claude, Mistral, GPT), génération de contenu, automatisation SEO. Audit gratuit inclus.',
  url: `${BASE_URL}${PAGE_PATH}`,
  provider: {
    '@type': 'Organization',
    name: 'NeuraWeb',
    url: BASE_URL,
  },
  areaServed: { '@type': 'Country', name: 'France' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Packs intégration IA',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Pack Essentiel IA',
        price: '1499',
        priceCurrency: 'EUR',
        description: 'Chatbot IA FAQ, indexation site + 1 doc, 500 conversations/mois.',
      },
      {
        '@type': 'Offer',
        name: 'Pack Business IA',
        price: '3999',
        priceCurrency: 'EUR',
        description: 'Agent IA qualifiant, CRM connecté, 800 conversations/mois, 3 langues.',
      },
      {
        '@type': 'Offer',
        name: 'Pack Premium IA',
        price: '7999',
        priceCurrency: 'EUR',
        description: 'Système multi-agents, RAG volumineuse, hébergement souverain France.',
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
      name: "Quelle est la différence entre un chatbot classique et un agent IA RAG ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Un chatbot classique répond depuis un arbre de décision figé. Un agent IA RAG indexe vos contenus réels et génère des réponses précises basées sur VOS données. Il comprend les questions en langage naturel et gère les nuances.",
      },
    },
    {
      '@type': 'Question',
      name: "Mes données restent-elles confidentielles avec l'IA ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Les modèles sont configurés pour que vos données ne servent pas à entraîner des modèles tiers. Pour les données sensibles, nous recommandons un modèle open source self-hosted (Mistral ou LLama) sur serveurs France.",
      },
    },
    {
      '@type': 'Question',
      name: "Quel budget prévoir pour un projet IA ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Un chatbot FAQ simple : 1 499 € HT + 39 €/mois. Un agent IA commercial avec CRM : 3 999 € HT + 89 €/mois. Un système multi-agents souverain : à partir de 7 999 € HT. L'audit gratuit donne une estimation précise.",
      },
    },
  ],
};

export default async function IntegrationIAPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (lang !== 'fr') {
    permanentRedirect(PAGE_PATH);
  }

  const breadcrumbData = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/fr' },
    { name: 'Intégration IA', url: PAGE_PATH },
  ]);

  return (
    <>
      <JsonLd id="integration-ia-service" data={serviceSchema} />
      <JsonLd id="integration-ia-faq" data={faqSchema} />
      <JsonLd id="integration-ia-breadcrumb" data={breadcrumbData} />
      <IntegrationIAPageClient />
    </>
  );
}
