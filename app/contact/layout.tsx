import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — NeuraWeb',
  description:
    'Contactez NeuraWeb pour votre projet web, intégration IA ou automatisation. Réponse sous 24h, devis gratuit et sans engagement.',
  keywords: [
    'contact',
    'agence web contact',
    'devis gratuit',
    'développement web',
    'intégration IA',
    'automatisation',
    'NeuraWeb',
  ],
  openGraph: {
    title: 'Contact — NeuraWeb',
    description:
      'Contactez NeuraWeb pour votre projet web, intégration IA ou automatisation. Réponse sous 24h, devis gratuit et sans engagement.',
    url: 'https://neuraweb.tech/contact',
    siteName: 'NeuraWeb',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact — NeuraWeb',
    description:
      'Contactez NeuraWeb pour votre projet web, intégration IA ou automatisation. Réponse sous 24h, devis gratuit et sans engagement.',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
