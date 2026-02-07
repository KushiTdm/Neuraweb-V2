import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://neuraweb.tech'),
  title: {
    default: 'NeuraWeb - Développement Web & Intégration IA',
    template: '%s | NeuraWeb',
  },
  description: 'Agence spécialisée en développement web sur mesure, intégration IA et automatisation. Transformez votre présence digitale avec des solutions innovantes.',
  keywords: ['développement web', 'intégration IA', 'automatisation', 'Next.js', 'React', 'TypeScript'],
  authors: [{ name: 'NeuraWeb' }],
  creator: 'NeuraWeb',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://neuraweb.tech',
    siteName: 'NeuraWeb',
    title: 'NeuraWeb - Développement Web & Intégration IA',
    description: 'Solutions web innovantes et automatisation intelligente pour votre entreprise.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeuraWeb - Développement Web & IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeuraWeb - Développement Web & Intégration IA',
    description: 'Solutions web innovantes et automatisation intelligente.',
    images: ['/og-image.png'],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}