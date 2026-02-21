import { Metadata } from 'next';
import { EquipePageClient } from '@/components/equipe-page-client';
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

  // L'IA génère les meta tags optimisés
  const seo = await generateAISEO({
    pageType: 'custom',
    language,
    path: `/${lang}/equipe`,
    customContext: 'Présentation de l\'équipe NeuraWeb : développeurs passionnés, experts en IA et automatisation. On code, l\'IA amplifie, vous scalez.',
    customKeywords: ['équipe', 'team', 'développeurs', 'experts IA', 'agence web Paris', 'NeuraWeb'],
  });

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: `${baseUrl}/${lang}/equipe`,
      languages: {
        'fr-FR': `${baseUrl}/fr/equipe`,
        'en-US': `${baseUrl}/en/equipe`,
        'es-ES': `${baseUrl}/es/equipe`,
        'x-default': `${baseUrl}/fr/equipe`,
      },
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: `${baseUrl}/${lang}/equipe`,
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

export default async function EquipePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <main id="main-content">
      <EquipePageClient />
    </main>
  );
}