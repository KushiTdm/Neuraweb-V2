import { Metadata } from 'next';
import { EquipePageClient } from '@/components/equipe-page-client';
import { SUPPORTED_LANGUAGES } from '@/proxy';

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
    fr: 'Équipe - Notre équipe expérimentée | NeuraWeb',
    en: 'Team - Our experienced team | NeuraWeb',
    es: 'Equipo - Nuestro equipo experimentado | NeuraWeb',
  };

  const descriptions: Record<string, string> = {
    fr: "Découvrez l'équipe NeuraWeb, des développeurs passionnés qui construisent le futur avec l'IA. On code, l'IA amplifie, vous scalez.",
    en: "Meet the NeuraWeb team, passionate developers building the future with AI. We code, AI amplifies, you scale.",
    es: "Conozca al equipo de NeuraWeb, desarrolladores apasionados que construyen el futuro con IA. Nosotros programamos, la IA amplifica, usted escala.",
  };

  const baseUrl = 'https://neuraweb.tech';

  return {
    title: titles[lang] || titles.fr,
    description: descriptions[lang] || descriptions.fr,
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
      title: titles[lang] || titles.fr,
      description: descriptions[lang] || descriptions.fr,
      url: `${baseUrl}/${lang}/equipe`,
      siteName: 'NeuraWeb',
      images: [
        {
          url: '/og-image.jpeg',
          width: 1200,
          height: 630,
          alt: 'NeuraWeb Équipe',
        },
      ],
      locale: lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
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