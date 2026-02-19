'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageType, Language, GeneratedSEO } from '@/lib/seo-service';

// ============================================================
// HOOK USESEO - Gestion dynamique du SEO côté client
// ============================================================

interface UseSEOOptions {
  pageType: PageType;
  language?: Language;
  customKeywords?: string[];
  customContext?: string;
  path?: string;
  autoGenerate?: boolean;
}

interface UseSEOReturn {
  seo: GeneratedSEO | null;
  isLoading: boolean;
  error: string | null;
  generateSEO: (options?: Partial<UseSEOOptions>) => Promise<void>;
  updateMetaTags: () => void;
}

// Cache client-side
const clientCache = new Map<string, { data: GeneratedSEO; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export function useSEO(options: UseSEOOptions): UseSEOReturn {
  const {
    pageType,
    language = 'fr',
    customKeywords = [],
    customContext,
    path = typeof window !== 'undefined' ? window.location.pathname : '/',
    autoGenerate = true,
  } = options;

  const [seo, setSeo] = useState<GeneratedSEO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Générer le SEO via l'API
  const generateSEO = useCallback(async (overrideOptions?: Partial<UseSEOOptions>) => {
    const finalOptions = { ...options, ...overrideOptions };
    const cacheKey = `${finalOptions.pageType}-${finalOptions.language}-${finalOptions.path}`;

    // Vérifier le cache
    const cached = clientCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setSeo(cached.data);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageType: finalOptions.pageType,
          language: finalOptions.language || 'fr',
          customKeywords: finalOptions.customKeywords || [],
          customContext: finalOptions.customContext,
          path: finalOptions.path || '/',
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération SEO');
      }

      const data = await response.json();
      
      if (data.success && data.seo) {
        setSeo(data.seo);
        clientCache.set(cacheKey, { data: data.seo, timestamp: Date.now() });
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error('SEO generation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  // Mettre à jour les balises meta dynamiquement
  const updateMetaTags = useCallback(() => {
    if (!seo || typeof document === 'undefined') return;

    // Mettre à jour le titre
    if (seo.title) {
      document.title = seo.title;
    }

    // Fonction helper pour mettre à jour/créer une balise meta
    const updateMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (meta) {
        meta.content = content;
      } else {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.name = name;
        }
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // Meta tags standards
    updateMeta('description', seo.description);
    if (seo.keywords.length > 0) {
      updateMeta('keywords', seo.keywords.join(', '));
    }

    // Open Graph
    updateMeta('og:title', seo.ogTitle, true);
    updateMeta('og:description', seo.ogDescription, true);
    updateMeta('og:type', 'website', true);

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', seo.ogTitle);
    updateMeta('twitter:description', seo.ogDescription);

    // Ajouter les tags suggérés comme data attributes
    if (seo.suggestedTags.length > 0) {
      const tagsAttr = seo.suggestedTags.join(',');
      document.documentElement.setAttribute('data-seo-tags', tagsAttr);
    }
  }, [seo]);

  // Générer automatiquement au montage si autoGenerate est activé
  useEffect(() => {
    if (autoGenerate) {
      generateSEO();
    }
  }, [autoGenerate, generateSEO]);

  // Mettre à jour les meta tags quand le SEO change
  useEffect(() => {
    updateMetaTags();
  }, [seo, updateMetaTags]);

  return {
    seo,
    isLoading,
    error,
    generateSEO,
    updateMetaTags,
  };
}

// Hook simplifié pour récupérer les métadonnées de base
export function useBasicSEO(pageType: PageType, language: Language = 'fr') {
  const [metadata, setMetadata] = useState<{
    title: string;
    description: string;
    jsonLd: Record<string, unknown>;
  } | null>(null);

  useEffect(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    
    fetch(`/api/seo?pageType=${pageType}&language=${language}&path=${path}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMetadata({
            title: data.metadata.title as string,
            description: data.metadata.description as string,
            jsonLd: data.jsonLd,
          });
        }
      })
      .catch(console.error);
  }, [pageType, language]);

  return metadata;
}

// Export par défaut
export default useSEO;