import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/contexts/language-context';
import { CookieConsentProvider } from '@/contexts/cookie-consent-context';
import ChatbotWrapper from '@/components/chatbot-wrapper';
import { ScrollToTopOnNavigate } from '@/components/scroll-to-top-on-navigate';
import { GoogleAnalyticsLoader } from '@/components/google-analytics-loader';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';

import {
  organizationSchema,
  websiteSchema,
} from '@/lib/structured-data';
import { JsonLd } from '@/components/json-ld';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { notFound } from 'next/navigation';

// ─── Fonts ────────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '700'],
  preload: true,
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight',
  weight: ['700', '800'],
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-jetbrains-mono',
  weight: ['400'],
  preload: false,
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
  const ogImage = `${baseUrl}/assets/logo/neuraweb-agence_tech.png`;

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

    // ─── Géo-référencement (Bing local search) ─────────────────────────────
    other: {
      'geo.region': 'FR-HDF',
      'geo.placename': 'Lille, Hauts-de-France',
      'geo.position': '50.6292;3.0573',
      'ICBM': '50.6292, 3.0573',
      'msvalidate.01': '903d41e843804b97832bf4616b07f8a7',
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7FAFD' },
    { media: '(prefers-color-scheme: dark)', color: '#070F26' },
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
      className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Préconnexion aux origines tierces critiques */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch pour les origines non-critiques */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://api.mistral.ai" />

        {/* Le preload du poster vidéo est dans app/[lang]/page.tsx (home seulement) */}

        {/* Organization + WebSite injectés via JsonLd (Client Component) pour éviter
            le doublon RSC payload de Next.js qui faisait apparaître chaque schéma
            deux fois dans le HTML (Google : "Champ en double" + "Élément sans nom"). */}
        <JsonLd id="organization-schema" data={organizationSchema} />
        <JsonLd id="website-schema" data={websiteSchema} />
        {/* LocalBusiness Schema injecté uniquement sur les pages "fiche entreprise"
            (home, /contact, /equipe) — pas globalement, sinon son aggregateRating
            pollue les pages article (Google : "Reviews snippet invalide"). */}
      </head>
      <body className={`${inter.className} font-sans`}>
        <a href="#main-content" className="skip-link">
          {({'fr': 'Aller au contenu principal', 'en': 'Skip to main content', 'es': 'Ir al contenido principal'} as Record<string, string>)[lang] ?? 'Skip to main content'}
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider initialLanguage={lang as any}>
            <CookieConsentProvider>
              {/* Google Analytics n'est chargé qu'après consentement explicite (RGPD/CNIL) */}
              <GoogleAnalyticsLoader gaId={gaId} />
              <ScrollToTopOnNavigate />
              {children}
              <ChatbotWrapper />
              <CookieConsentBanner />
            </CookieConsentProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}