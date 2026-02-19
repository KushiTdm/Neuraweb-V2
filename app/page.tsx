import type { Metadata } from 'next';
import { HomePageClient } from '@/components/home-page-client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { generatePageMetadata } from '@/lib/seo-service';
import { professionalServiceSchema, faqSchema } from '@/lib/structured-data';

// Génération des métadonnées SEO optimisées - Enrichies pour la page d'accueil
export const metadata: Metadata = {
  title: 'NeuraWeb — Agence Web & IA pour Startups | Développement Next.js',
  description: 'Studio de développement full-stack spécialisé IA et automatisation n8n. Nous construisons vos MVPs, intégrons des agents IA, et automatisons vos workflows. Devis gratuit.',
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
  authors: [{ name: 'NeuraWeb' }],
  creator: 'NeuraWeb',
  openGraph: {
    title: 'NeuraWeb — Build smarter, ship faster',
    description: 'Studio IA-first pour startups. React, Next.js, n8n, LLM.',
    url: 'https://neuraweb.tech',
    siteName: 'NeuraWeb',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeuraWeb — Agence Web & IA pour Startups',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeuraWeb — Agence Web & IA',
    description: 'Studio de développement IA-first pour startups ambitieuses.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://neuraweb.tech',
    languages: {
      'fr-FR': 'https://neuraweb.tech',
      'en-US': 'https://neuraweb.tech/en',
      'es-ES': 'https://neuraweb.tech/es',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Home() {
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
      <HomePageClient />
      <Footer />
    </>
  );
}
