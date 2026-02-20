import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { generateBreadcrumbSchema } from '@/lib/structured-data';
import { EquipePageClient } from '@/components/equipe-page-client';

// ── Metadata SEO ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Notre Équipe | NeuraWeb — Développeurs & Experts IA',
  description: 'Rencontrez les développeurs et experts IA derrière NeuraWeb. Une équipe passionnée qui construit le futur avec l\'intelligence artificielle.',
  keywords: [
    'équipe NeuraWeb',
    'développeurs IA',
    'experts automatisation',
    'agence web équipe',
    'développeur React Next.js',
  ],
  openGraph: {
    title: 'Notre Équipe | NeuraWeb — Développeurs & Experts IA',
    description: 'Rencontrez les développeurs et experts IA derrière NeuraWeb.',
    url: 'https://neuraweb.tech/equipe',
    siteName: 'NeuraWeb',
    images: [
      {
        url: '/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'Équipe NeuraWeb',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://neuraweb.tech/equipe',
  },
};

// ── Breadcrumb Schema ───────────────────────────────────────────────────────
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Accueil', url: 'https://neuraweb.tech' },
  { name: 'Équipe', url: 'https://neuraweb.tech/equipe' },
]);

// ── Page Component ──────────────────────────────────────────────────────────
export default function EquipePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />
      <EquipePageClient />
      <Footer />
    </>
  );
}