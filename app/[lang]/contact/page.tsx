import { Metadata } from 'next';
import ContactPageClient from '@/components/contact-page-client';
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
    fr: 'Contact - Parlons de votre projet | NeuraWeb',
    en: 'Contact - Let\'s talk about your project | NeuraWeb',
    es: 'Contacto - Hablemos de su proyecto | NeuraWeb',
  };

  const descriptions: Record<string, string> = {
    fr: 'Contactez notre équipe pour discuter de votre projet. Réponse sous 24h, devis gratuit.',
    en: 'Contact our team to discuss your project. Response within 24h, free quote.',
    es: 'Contacte a nuestro equipo para discutir su proyecto. Respuesta en 24h, presupuesto gratis.',
  };

  const baseUrl = 'https://neuraweb.tech';

  return {
    title: titles[lang] || titles.fr,
    description: descriptions[lang] || descriptions.fr,
    alternates: {
      canonical: `${baseUrl}/${lang}/contact`,
      languages: {
        'fr-FR': `${baseUrl}/fr/contact`,
        'en-US': `${baseUrl}/en/contact`,
        'es-ES': `${baseUrl}/es/contact`,
        'x-default': `${baseUrl}/fr/contact`,
      },
    },
    openGraph: {
      title: titles[lang] || titles.fr,
      description: descriptions[lang] || descriptions.fr,
      url: `${baseUrl}/${lang}/contact`,
      siteName: 'NeuraWeb',
      images: [
        {
          url: '/og-image.jpeg',
          width: 1200,
          height: 630,
          alt: 'Contact NeuraWeb',
        },
      ],
      locale: lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <main id="main-content">
      <ContactPageClient />
    </main>
  );
}