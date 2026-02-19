'use client';

import { useEffect } from 'react';
import { useSEO } from '@/hooks/use-seo';
import { PageType, Language } from '@/lib/seo-service';

// ============================================================
// COMPOSANT DYNAMIC HEAD SEO
// Met à jour dynamiquement les balises meta côté client
// ============================================================

interface DynamicHeadProps {
  pageType: PageType;
  language?: Language;
  customKeywords?: string[];
  customContext?: string;
  children?: React.ReactNode;
}

export function DynamicHead({
  pageType,
  language = 'fr',
  customKeywords = [],
  customContext,
  children,
}: DynamicHeadProps) {
  const { seo, isLoading, error } = useSEO({
    pageType,
    language,
    customKeywords,
    customContext,
    autoGenerate: true,
  });

  // Log les erreurs en développement
  useEffect(() => {
    if (error && process.env.NODE_ENV === 'development') {
      console.warn('SEO generation warning:', error);
    }
  }, [error]);

  // Le composant ne rend rien visuellement
  return (
    <>
      {/* Indicateur de chargement SEO (uniquement en dev) */}
      {process.env.NODE_ENV === 'development' && isLoading && (
        <span data-seo-loading="true" style={{ display: 'none' }} />
      )}
      {children}
    </>
  );
}

// ============================================================
// COMPOSANT JSON-LD INJECTOR
// Injecte les données structurées JSON-LD dans la page
// ============================================================

interface JsonLdInjectorProps {
  data: Record<string, unknown>;
}

export function JsonLdInjector({ data }: JsonLdInjectorProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ============================================================
// COMPOSANT SEO BOOSTER
// Composant utilitaire pour booster le SEO d'une section
// ============================================================

interface SEOBoosterProps {
  keywords: string[];
  context?: string;
  children: React.ReactNode;
}

export function SEOBooster({ keywords, context, children }: SEOBoosterProps) {
  useEffect(() => {
    // Ajouter des mots-clés suggérés au data attribute du body
    if (keywords.length > 0) {
      const existingKeywords = document.body.getAttribute('data-seo-keywords') || '';
      const allKeywords = existingKeywords 
        ? Array.from(new Set([...existingKeywords.split(','), ...keywords]))
        : keywords;
      document.body.setAttribute('data-seo-keywords', allKeywords.join(','));
    }

    // Ajouter le contexte sémantique
    if (context) {
      document.body.setAttribute('data-seo-context', context);
    }
  }, [keywords, context]);

  return <>{children}</>;
}

// ============================================================
// COMPOSANT CANONICAL URL
// Gère l'URL canonique de la page
// ============================================================

interface CanonicalUrlProps {
  url: string;
  alternates?: {
    fr?: string;
    en?: string;
    es?: string;
  };
}

export function CanonicalUrl({ url, alternates }: CanonicalUrlProps) {
  useEffect(() => {
    // Mettre à jour ou créer le link canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (link) {
      link.href = url;
    } else {
      link = document.createElement('link');
      link.rel = 'canonical';
      link.href = url;
      document.head.appendChild(link);
    }

    // Ajouter les alternate links pour le multilingue
    if (alternates) {
      Object.entries(alternates).forEach(([lang, href]) => {
        if (!href) return;
        
        let altLink = document.querySelector(
          `link[rel="alternate"][hreflang="${lang}"]`
        ) as HTMLLinkElement;
        
        if (altLink) {
          altLink.href = href;
        } else {
          altLink = document.createElement('link');
          altLink.rel = 'alternate';
          altLink.setAttribute('hreflang', lang);
          altLink.href = href;
          document.head.appendChild(altLink);
        }
      });
    }
  }, [url, alternates]);

  return null;
}

// Export par défaut
export default DynamicHead;