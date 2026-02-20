import type { Metadata } from 'next';
import { HomePageClient } from '@/components/home-page-client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { professionalServiceSchema, faqSchema } from '@/lib/structured-data';
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
    fr: 'NeuraWeb — Agence Web & IA pour Startups | Développement Next.js',
    en: 'NeuraWeb — Web & AI Agency for Startups | Next.js Development',
    es: 'NeuraWeb — Agencia Web & IA para Startups | Desarrollo Next.js',
  };

  const descriptions: Record<string, string> = {
    fr: 'Studio de développement full-stack spécialisé IA et automatisation n8n. Nous construisons vos MVPs, intégrons des agents IA, et automatisons vos workflows. Devis gratuit.',
    en: 'Full-stack development studio specialized in AI and n8n automation. We build your MVPs, integrate AI agents, and automate your workflows. Free quote.',
    es: 'Estudio de desarrollo full-stack especializado en IA y automatización n8n. Construimos sus MVPs, integramos agentes de IA y automatizamos sus workflows. Presupuesto gratis.',
  };

  const baseUrl = 'https://neuraweb.tech';

  return {
    title: titles[lang] || titles.fr,
    description: descriptions[lang] || descriptions.fr,
    keywords: [
      'agence web IA',
      'développement next.js',
      'intégration IA startup',
      'automatisation n8n',
      'développeur react france',
      'agence web Paris',
      'développement web France',
      'MVP startup',
      'chatbot IA',
      'automatisation workflow',
    ],
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'fr-FR': `${baseUrl}/fr`,
        'en-US': `${baseUrl}/en`,
        'es-ES': `${baseUrl}/es`,
        'x-default': `${baseUrl}/fr`,
      },
    },
    openGraph: {
      title: titles[lang] || titles.fr,
      description: descriptions[lang] || descriptions.fr,
      url: `${baseUrl}/${lang}`,
      siteName: 'NeuraWeb',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'NeuraWeb — Agence Web & IA pour Startups',
        },
      ],
      locale: lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang] || titles.fr,
      description: descriptions[lang] || descriptions.fr,
      images: ['/og-image.png'],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      {/* Professional Service Schema - Rich snippets pour l'agence */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      {/* FAQ Schema - Pour les questions fréquentes */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <main id="main-content">
        <HomePageClient />
      </main>
      <Footer />
    </>
  );
}