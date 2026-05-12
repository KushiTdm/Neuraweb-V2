'use client';

/**
 * use-blog-analytics.ts
 * ─────────────────────────────────────────────────────────────
 * Hook de tracking enrichi pour les articles de blog NeuraWeb.
 *
 * Usage :
 * ```tsx
 * const { trackTagClick, trackRelatedArticleClick, trackCTAClick, trackShareClick } =
 *   useBlogPostAnalytics({
 *     slug: post.slug,
 *     title: post.title,
 *     category: post.category,
 *     tags: post.tags,
 *     author: post.author,
 *     language: lang,
 *     estimatedReadTimeMin: parseInt(post.readTime),
 *   });
 * ```
 */

import { useEffect, useRef, useCallback } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

// ── Types ────────────────────────────────────────────────────────────────────

interface BlogAnalyticsConfig {
  slug: string;
  title: string;
  category: string;
  tags?: string[];
  author?: string;
  language: string;
  estimatedReadTimeMin?: number;
}

interface BlogAnalyticsReturn {
  trackTagClick: (tag: string) => void;
  trackRelatedArticleClick: (relatedSlug: string, relatedTitle: string) => void;
  trackCTAClick: (ctaLabel: string, destination: string) => void;
  trackShareClick: (method: 'copy' | 'native' | 'twitter' | 'linkedin') => void;
}

// ── Constantes ───────────────────────────────────────────────────────────────

const SCROLL_MILESTONES = [25, 50, 75, 90, 100] as const;
const QUALIFIED_READ_THRESHOLD_S = 30;
const RETURN_READER_KEY = (slug: string) => `nw_read_${slug}`;

// ── Helpers ──────────────────────────────────────────────────────────────────

function gaReady(): boolean {
  return typeof window !== 'undefined' && 'gtag' in window;
}

function getReadingTimeSlot(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 9) return 'early_morning';
  if (h >= 9 && h < 12) return 'morning';
  if (h >= 12 && h < 14) return 'lunch';
  if (h >= 14 && h < 18) return 'afternoon';
  if (h >= 18 && h < 21) return 'evening';
  return 'night';
}

function getDayOfWeek(): string {
  return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
    new Date().getDay()
  ];
}

function getScrollDepthInArticle(articleEl: HTMLElement | null): number {
  if (!articleEl) {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 100;
    return Math.min(100, Math.round((scrollTop / docHeight) * 100));
  }
  const rect = articleEl.getBoundingClientRect();
  const articleHeight = articleEl.offsetHeight;
  if (articleHeight <= 0) return 0;
  const scrolledIntoArticle = window.innerHeight - rect.top;
  return Math.min(100, Math.max(0, Math.round((scrolledIntoArticle / articleHeight) * 100)));
}

/**
 * Retourne le max d'un Set<number> sans le spread (compatible TS strict / ES5 target).
 * Math.max(...set) provoque TS2802 quand downlevelIteration n'est pas activé.
 */
function maxFromSet(set: Set<number>, fallback = 0): number {
  if (set.size === 0) return fallback;
  let max = fallback;
  set.forEach((v) => {
    if (v > max) max = v;
  });
  return max;
}

// ── Hook principal ────────────────────────────────────────────────────────────

export function useBlogPostAnalytics(config: BlogAnalyticsConfig): BlogAnalyticsReturn {
  const {
    slug,
    title,
    category,
    tags = [],
    author = 'NeuraWeb',
    language,
    estimatedReadTimeMin = 5,
  } = config;

  const startTime = useRef<number>(Date.now());
  const activeTime = useRef<number>(0);
  const lastActiveStart = useRef<number>(Date.now());
  const reachedMilestones = useRef<Set<number>>(new Set());
  const completionTracked = useRef(false);
  const qualifiedReadTracked = useRef(false);
  const articleRef = useRef<HTMLElement | null>(null);

  // Paramètres communs envoyés avec chaque event
  const commonParams = {
    blog_slug: slug,
    blog_title: title,
    blog_category: category,
    blog_author: author,
    blog_language: language,
    blog_tags: tags.join(','),
    blog_estimated_read_min: estimatedReadTimeMin,
    reading_time_slot: getReadingTimeSlot(),
    day_of_week: getDayOfWeek(),
  };

  // ── article_view ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!gaReady()) return;

    let isReturnReader = false;
    try {
      isReturnReader = !!localStorage.getItem(RETURN_READER_KEY(slug));
    } catch {
      // localStorage bloqué (mode privé strict)
    }

    sendGAEvent('event', 'article_view', {
      ...commonParams,
      is_return_reader: isReturnReader,
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    });

    try {
      localStorage.setItem(RETURN_READER_KEY(slug), String(Date.now()));
    } catch {
      // silencieux
    }

    articleRef.current = document.querySelector('article') ?? null;
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Gestion visibilité (pause timer si onglet caché) ──────────────────────

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        activeTime.current += Date.now() - lastActiveStart.current;
      } else {
        lastActiveStart.current = Date.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // ── Scroll depth ──────────────────────────────────────────────────────────

  useEffect(() => {
    const handleScroll = () => {
      const depth = getScrollDepthInArticle(articleRef.current);

      SCROLL_MILESTONES.forEach((milestone) => {
        if (depth >= milestone && !reachedMilestones.current.has(milestone)) {
          reachedMilestones.current.add(milestone);

          if (!gaReady()) return;

          sendGAEvent('event', 'article_scroll_depth', {
            ...commonParams,
            scroll_depth_pct: milestone,
            time_to_milestone_s: Math.round((Date.now() - startTime.current) / 1000),
          });

          if (milestone === 90 && !completionTracked.current) {
            completionTracked.current = true;
            sendGAEvent('event', 'article_read_complete', {
              ...commonParams,
              completion_time_s: Math.round((Date.now() - startTime.current) / 1000),
              estimated_read_min: estimatedReadTimeMin,
            });
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Temps de lecture à la fermeture ──────────────────────────────────────

  useEffect(() => {
    const sendTimeEvent = () => {
      if (!gaReady()) return;

      const finalActiveMs =
        activeTime.current + (document.hidden ? 0 : Date.now() - lastActiveStart.current);
      const activeSeconds = Math.round(finalActiveMs / 1000);
      const totalSeconds = Math.round((Date.now() - startTime.current) / 1000);
      const isQualifiedRead = activeSeconds >= QUALIFIED_READ_THRESHOLD_S;

      sendGAEvent('event', 'article_time_spent', {
        ...commonParams,
        active_time_s: activeSeconds,
        total_time_s: totalSeconds,
        is_qualified_read: isQualifiedRead,
        max_scroll_depth_pct: maxFromSet(reachedMilestones.current),
      });

      if (totalSeconds < 10) {
        sendGAEvent('event', 'article_bounce_unqualified', {
          ...commonParams,
          time_s: totalSeconds,
        });
      }
    };

    window.addEventListener('beforeunload', sendTimeEvent);
    window.addEventListener('pagehide', sendTimeEvent);

    return () => {
      sendTimeEvent();
      window.removeEventListener('beforeunload', sendTimeEvent);
      window.removeEventListener('pagehide', sendTimeEvent);
    };
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Lecture engagée (timer 30 s) ──────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!gaReady() || qualifiedReadTracked.current) return;
      qualifiedReadTracked.current = true;
      sendGAEvent('event', 'article_engaged_read', {
        ...commonParams,
        threshold_s: QUALIFIED_READ_THRESHOLD_S,
      });
    }, QUALIFIED_READ_THRESHOLD_S * 1000);

    return () => clearTimeout(timer);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Callbacks manuels ────────────────────────────────────────────────────

  const trackTagClick = useCallback(
    (tag: string) => {
      if (!gaReady()) return;
      sendGAEvent('event', 'article_tag_click', {
        ...commonParams,
        tag_name: tag,
        time_on_page_s: Math.round((Date.now() - startTime.current) / 1000),
      });
    },
    [slug], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const trackRelatedArticleClick = useCallback(
    (relatedSlug: string, relatedTitle: string) => {
      if (!gaReady()) return;
      sendGAEvent('event', 'article_related_click', {
        ...commonParams,
        related_slug: relatedSlug,
        related_title: relatedTitle,
        time_on_page_s: Math.round((Date.now() - startTime.current) / 1000),
        scroll_depth_at_click: maxFromSet(reachedMilestones.current),
      });
    },
    [slug], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const trackCTAClick = useCallback(
    (ctaLabel: string, destination: string) => {
      if (!gaReady()) return;
      sendGAEvent('event', 'article_cta_click', {
        ...commonParams,
        cta_label: ctaLabel,
        cta_destination: destination,
        time_on_page_s: Math.round((Date.now() - startTime.current) / 1000),
        scroll_depth_at_click: maxFromSet(reachedMilestones.current),
      });
    },
    [slug], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const trackShareClick = useCallback(
    (method: 'copy' | 'native' | 'twitter' | 'linkedin') => {
      if (!gaReady()) return;
      sendGAEvent('event', 'article_share', {
        ...commonParams,
        share_method: method,
        time_on_page_s: Math.round((Date.now() - startTime.current) / 1000),
      });
    },
    [slug], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    trackTagClick,
    trackRelatedArticleClick,
    trackCTAClick,
    trackShareClick,
  };
}