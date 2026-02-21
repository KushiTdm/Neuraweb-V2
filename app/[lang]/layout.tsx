import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Syne } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/contexts/language-context';
import Chatbot from '@/components/chatbot';
import {
  organizationSchema,
  websiteSchema,
  localBusinessSchema,
} from '@/lib/structured-data';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { notFound } from 'next/navigation';

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

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

// ── Metadata du layout : MINIMAL
// Le layout ne doit gérer que le template de titre et les meta globales.
// Tout le reste (title, description, og, keywords) est géré par chaque page.tsx via l'IA.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = 'https://neuraweb.tech';

  return {
    metadataBase: new URL(baseUrl),
    // Le template s'applique UNIQUEMENT si la page fournit un titre sans "NeuraWeb"
    // Les titres générés par l'IA incluent déjà "NeuraWeb", donc %s sera le titre complet
    title: {
      default: 'NeuraWeb — Agence Web, IA & Automatisation',
      template: '%s', // ← PAS de "| NeuraWeb" ajouté : l'IA gère le titre complet
    },
    authors: [{ name: 'NeuraWeb' }],
    creator: 'NeuraWeb',
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
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
    // description, openGraph, twitter, alternates, keywords :
    // gérés par chaque page.tsx individuellement via generateAISEO()
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#050510' },
  ],
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!SUPPORTED_LANGUAGES.includes(lang as any)) {
    notFound();
  }

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${syne.variable}`}
    >
      <head>
        {/* Organization Schema — représente l'entreprise globalement */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* WebSite Schema — pour les Sitelinks Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* LocalBusiness Schema — relie le site à Google Business Profile */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className={geist.className}>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider initialLanguage={lang as any}>
            {children}
            <Chatbot />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}