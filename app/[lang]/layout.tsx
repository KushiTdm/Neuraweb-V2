import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Syne } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/contexts/language-context';
import Chatbot from '@/components/chatbot';
import { organizationSchema, websiteSchema } from '@/lib/structured-data';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/proxy';
import { notFound } from 'next/navigation';

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

// ── Génération des paramètres statiques ─────────────────────────
export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

// ── Métadonnées dynamiques par langue ───────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  
  const titles: Record<string, string> = {
    fr: 'NeuraWeb — Agence Web, IA & Automatisation',
    en: 'NeuraWeb — Web Agency, AI & Automation',
    es: 'NeuraWeb — Agencia Web, IA & Automatización',
  };

  const descriptions: Record<string, string> = {
    fr: 'Agence digitale premium spécialisée en développement web sur mesure, intégration IA et automatisation. Transformez votre vision en solutions digitales innovantes.',
    en: 'Premium digital agency specializing in custom web development, AI integration and automation. Transform your vision into innovative digital solutions.',
    es: 'Agencia digital premium especializada en desarrollo web personalizado, integración de IA y automatización. Transforme su visión en soluciones digitales innovadoras.',
  };

  const locales: Record<string, string> = {
    fr: 'fr_FR',
    en: 'en_US',
    es: 'es_ES',
  };

  const baseUrl = 'https://neuraweb.tech';
  const currentLang = lang;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: titles[currentLang] || titles[DEFAULT_LANGUAGE],
      template: `%s | NeuraWeb`,
    },
    description: descriptions[currentLang] || descriptions[DEFAULT_LANGUAGE],
    authors: [{ name: 'NeuraWeb' }],
    creator: 'NeuraWeb',
    alternates: {
      canonical: `${baseUrl}/${currentLang}`,
      languages: {
        'fr-FR': `${baseUrl}/fr`,
        'en-US': `${baseUrl}/en`,
        'es-ES': `${baseUrl}/es`,
        'x-default': `${baseUrl}/fr`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locales[currentLang] || locales[DEFAULT_LANGUAGE],
      url: `${baseUrl}/${currentLang}`,
      siteName: 'NeuraWeb',
      title: titles[currentLang] || titles[DEFAULT_LANGUAGE],
      description: descriptions[currentLang] || descriptions[DEFAULT_LANGUAGE],
      images: [
        {
          url: '/og-image.jpeg',
          width: 1200,
          height: 630,
          alt: 'NeuraWeb — Agence Digitale Premium',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[currentLang] || titles[DEFAULT_LANGUAGE],
      description: descriptions[currentLang] || descriptions[DEFAULT_LANGUAGE],
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

  // Vérifier que la langue est supportée
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
        {/* Hreflang links - Crucial pour le SEO multilingue */}
        <link rel="alternate" hrefLang="fr" href={`https://neuraweb.tech/fr`} />
        <link rel="alternate" hrefLang="en" href={`https://neuraweb.tech/en`} />
        <link rel="alternate" hrefLang="es" href={`https://neuraweb.tech/es`} />
        <link rel="alternate" hrefLang="x-default" href={`https://neuraweb.tech/fr`} />
      </head>
      <body className={geist.className}>
        {/* Google Analytics 4 - Suivi des performances et comportement utilisateur */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
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
          <LanguageProvider initialLanguage={lang as any}>
            {children}
            <Chatbot />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}