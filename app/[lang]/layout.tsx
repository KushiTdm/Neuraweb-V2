import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Syne } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/contexts/language-context';
import dynamic from 'next/dynamic';
import Script from 'next/script';

// FIX: Tous les composants non-critiques en dynamic import
const Chatbot = dynamic(() => import('@/components/chatbot'), {
  loading: () => null,
  ssr: false, // Le chatbot n'a pas besoin de SSR
});

import {
  organizationSchema,
  websiteSchema,
  localBusinessSchema,
} from '@/lib/structured-data';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { notFound } from 'next/navigation';

// ─── Fonts : display: 'swap' pour éviter le blocage du rendu ─────────────────
// FIX: Charger uniquement les poids nécessaires
const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
  // FIX: Réduire les poids chargés — on n'a pas besoin de tous les poids
  weight: ['400', '500', '600', '700', '800'],
  preload: true,
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
  weight: ['400', '500'],
  preload: false, // Mono n'est pas critique pour le rendu initial
});

const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
  weight: ['700', '800'], // FIX: Syne utilisé uniquement pour les titres (bold)
  preload: true,
});

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = 'https://neuraweb.tech';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: 'NeuraWeb — Agence Web, IA & Automatisation',
      template: '%s',
    },
    authors: [{ name: 'NeuraWeb' }],
    creator: 'NeuraWeb',
    icons: {
      icon: '/assets/neurawebB.png',
      shortcut: '/assets/neurawebB.png',
      apple: '/assets/neurawebB.png',
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

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${syne.variable}`}
    >
      <head>
        {/*
          FIX CSS RENDER-BLOCKING :
          Les CSS Next.js sont injectées automatiquement dans <head>.
          Pour réduire leur impact sur le FCP/LCP, on ajoute des resource hints
          pour les origines tierces critiques uniquement.

          ⚠️ Ne pas ajouter de <link rel="stylesheet"> manuellement ici —
          Next.js les gère. Utiliser next.config.js pour le split CSS.
        */}

        {/* Préconnexion aux origines tierces critiques uniquement */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch pour les origines non-critiques */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://client.crisp.chat" />

        {/*
          FIX POSTER IMAGE (Desktop -49 KiB) :
          Préchargement du poster vidéo avec les dimensions correctes.
          L'image affichée fait 1582x940px → on précharge la version optimisée.
          À créer : /assets/ampoulePoster-1600w.webp (redimensionné côté serveur)
        */}
        <link
          rel="preload"
          as="image"
          href="/assets/ampoulePoster.webp"
          // imagesrcset permet au navigateur de choisir la bonne taille
          // À utiliser quand vous aurez créé les variantes redimensionnées :
          // imageSrcSet="/assets/ampoulePoster-800w.webp 800w, /assets/ampoulePoster-1600w.webp 1600w"
          // imageSizes="100vw"
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className={geist.className}>
        {/*
          FIX GOOGLE ANALYTICS RENDER-BLOCKING :
          Remplacement de <GoogleAnalytics> par next/script avec strategy="lazyOnload"
          
          GoogleAnalytics de @next/third-parties injecte le script de façon synchrone
          ce qui bloque le thread principal (146ms CPU selon Lighthouse).
          
          strategy="lazyOnload" charge le script après que la page est interactive,
          ce qui améliore le TBT sans perdre le tracking.
        */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                  send_page_view: true
                });
              `}
            </Script>
          </>
        )}

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