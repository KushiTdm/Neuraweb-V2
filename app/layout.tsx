import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Syne } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/contexts/language-context';
import Chatbot from '@/components/chatbot';
import { SEO_BOOST_KEYWORDS } from '@/lib/seo-service';
import { organizationSchema, websiteSchema } from '@/lib/structured-data';

// ── Fonts premium 2026 ─────────────────────────────────────────
const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
  weight: ['400', '500', '600'],
});

const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
});

// ── SEO Metadata optimisé avec le service SEO Boost ────────────
export const metadata: Metadata = {
  metadataBase: new URL('https://neuraweb.tech'),
  title: {
    default: 'NeuraWeb — Agence Web, IA & Automatisation',
    template: '%s | NeuraWeb',
  },
  description:
    'Agence digitale premium spécialisée en développement web sur mesure, intégration IA et automatisation. Transformez votre vision en solutions digitales innovantes.',
  keywords: [
    // Keywords de base
    'agence web',
    'développement web',
    'intégration IA',
    'automatisation',
    'Next.js',
    'React',
    'marketing digital',
    'agence digitale',
    // Keywords boostés depuis le service SEO
    ...SEO_BOOST_KEYWORDS.technical.slice(0, 3),
    ...SEO_BOOST_KEYWORDS.business.slice(0, 2),
    ...SEO_BOOST_KEYWORDS.ai.slice(0, 2),
    ...SEO_BOOST_KEYWORDS.local,
  ],
  authors: [{ name: 'NeuraWeb' }],
  creator: 'NeuraWeb',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://neuraweb.tech',
    siteName: 'NeuraWeb',
    title: 'NeuraWeb — Agence Web, IA & Automatisation',
    description:
      'Agence digitale premium spécialisée en développement web sur mesure, intégration IA et automatisation.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NeuraWeb — Agence Digitale Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeuraWeb — Agence Web, IA & Automatisation',
    description:
      'Agence digitale premium spécialisée en développement web sur mesure, intégration IA et automatisation.',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#050510' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${syne.variable}`}
    >
      <head>
        {/* Organization Schema - Rich snippets pour Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* WebSite Schema - Pour la recherche site links */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={geist.className}>
        {/* Skip Link — Accessibilité WCAG AA */}
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <Chatbot />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
