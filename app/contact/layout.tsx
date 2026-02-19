import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-service';

// Génération des métadonnées SEO optimisées via le service SEO
export const metadata: Metadata = generatePageMetadata({
  pageType: 'contact',
  language: 'fr',
  path: '/contact',
  customKeywords: [
    'contact',
    'agence web contact',
    'devis gratuit',
    'développement web',
    'intégration IA',
    'automatisation',
    'NeuraWeb',
    'consultation gratuite',
    'projet web',
    'réponse rapide',
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
