import { Metadata } from 'next';
import { HomePageClient } from '@/components/home-page-client';

export const metadata: Metadata = {
  title: 'Accueil - NeuraWeb | Développement Web & Intégration IA',
  description: 'Agence spécialisée en développement web sur mesure, intégration IA et automatisation. Transformez votre présence digitale avec des solutions innovantes et performantes.',
  keywords: [
    'développement web',
    'intégration IA',
    'automatisation',
    'Next.js',
    'React',
    'TypeScript',
    'agence web',
    'site web professionnel',
    'application web',
    'intelligence artificielle'
  ],
  openGraph: {
    title: 'NeuraWeb - Développement Web & Intégration IA',
    description: 'Solutions web innovantes et automatisation intelligente pour votre entreprise.',
    url: 'https://neuraweb.tech',
    siteName: 'NeuraWeb',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeuraWeb - Solutions Web Innovantes',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeuraWeb - Développement Web & Intégration IA',
    description: 'Solutions web innovantes et automatisation intelligente.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://neuraweb.tech',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}