import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Syne } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/contexts/language-context';
import Script from 'next/script';
import ChatbotWrapper from '@/components/chatbot-wrapper';

import {
  organizationSchema,
  websiteSchema,
  localBusinessSchema,
} from '@/lib/structured-data';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { notFound } from 'next/navigation';

// ─── Fonts ────────────────────────────────────────────────────────────────────
const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
  weight: ['400', '500', '600', '700', '800'],
  preload: true,
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
  weight: ['400', '500'],
  preload: false,
});

const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
  weight: ['700', '800'],
  preload: true,
});

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

// ─── Métadonnées par langue ───────────────────────────────────────────────────
const META_BY_LANG: Record<
  string,
  { title: string; description: string; locale: string }
> = {
  fr: {
    title: 'NeuraWeb — Agence Web, IA & Automatisation',
    description:
      'Agence digitale premium spécialisée en développement web sur mesure, intégration IA et automatisation. Transformez votre vision en solutions digitales innovantes.',
    locale: 'fr_FR',
  },
  en: {
    title: 'NeuraWeb — Web Agency, AI & Automation',
    description:
      'Premium digital agency specialized in custom web development, AI integration and automation. Transform your vision into innovative digital solutions.',
    locale: 'en_US',
  },
  es: {
    title: 'NeuraWeb — Agencia Web, IA & Automatización',
    description:
      'Agencia digital premium especializada en desarrollo web personalizado, integración IA y automatización. Transforma tu visión en soluciones digitales innovadoras.',
    locale: 'es_ES',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = 'https://neuraweb.tech';

  // ✅ CORRIGÉ : image à la bonne URL
  const ogImage = `${baseUrl}/assets/og-image.png`;

  const meta = META_BY_LANG[lang] ?? META_BY_LANG.fr;
  const pageUrl = `${baseUrl}/${lang}`;

  return {
    metadataBase: new URL(baseUrl),

    // ─── Titre & description ───────────────────────────────────────────────
    title: {
      default: meta.title,
      template: '%s | NeuraWeb',
    },
    description: meta.description,

    // ─── Auteur & créateur ─────────────────────────────────────────────────
    authors: [{ name: 'NeuraWeb', url: baseUrl }],
    creator: 'NeuraWeb',
    publisher: 'NeuraWeb',

    // ─── Icônes ────────────────────────────────────────────────────────────
    icons: {
      icon: '/assets/neurawebB.png',
      shortcut: '/assets/neurawebB.png',
      apple: '/assets/neurawebB.png',
    },

    // ─── Open Graph ────────────────────────────────────────────────────────
    // ✅ AJOUTÉ : sans ça, aucun réseau social n'affiche de preview
    openGraph: {
      type: 'website',
      url: pageUrl,
      siteName: 'NeuraWeb',
      title: meta.title,
      description: meta.description,
      locale: meta.locale,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'NeuraWeb — Agence Web, IA & Automatisation',
          type: 'image/png',
        },
      ],
    },

    // ─── Twitter / X Card ──────────────────────────────────────────────────
    // ✅ AJOUTÉ : summary_large_image pour WhatsApp + Twitter + LinkedIn
    twitter: {
      card: 'summary_large_image',
      site: '@neurawebtech',
      creator: '@neurawebtech',
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },

    // ─── Canonical + hreflang ──────────────────────────────────────────────
    // ✅ AJOUTÉ : indispensable pour le SEO multilingue
    alternates: {
      canonical: pageUrl,
      languages: {
        fr: `${baseUrl}/fr`,
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
        'x-default': `${baseUrl}/fr`,
      },
    },

    // ─── Robots ────────────────────────────────────────────────────────────
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
        {/* Préconnexion aux origines tierces critiques */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch pour les origines non-critiques */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://client.crisp.chat" />

        {/* Préchargement poster vidéo */}
        <link
          rel="preload"
          as="image"
          href="/assets/ampoulePoster.webp"
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
        {/* Google Analytics — lazyOnload pour ne pas bloquer le rendu */}
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
            <ChatbotWrapper />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}