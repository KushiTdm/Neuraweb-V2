'use client';

import { useCallback, useEffect, useRef } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

// Types pour les événements
interface PackEventProps {
  pack_id: string;
  pack_name: string;
  pack_price: string;
  language: string;
}

interface ContactEventProps {
  contact_type: 'whatsapp' | 'chatbot' | 'form';
  language: string;
  pack_id?: string;
}

interface BlogEventProps {
  blog_title: string;
  blog_slug: string;
  language: string;
}

interface ScrollDepthEventProps {
  depth_percentage: number;
  page_path: string;
}

interface TimingEventProps {
  name: string;
  value: number;
  category: string;
}

interface FormEventProps {
  form_name: string;
  form_step?: number;
  pack_selected?: string;
  budget_selected?: string;
  language: string;
}

interface CTAEventProps {
  cta_name: string;
  cta_location: string;
  language: string;
  destination?: string;
}

interface NavigationEventProps {
  link_text: string;
  link_url: string;
  link_location: string;
  language: string;
}

interface EngagementEventProps {
  engagement_type: 'scroll' | 'time_on_page' | 'returning_visitor';
  value?: number;
  page_path: string;
}

// Vérifier si GA est disponible
const isGAAvailable = (): boolean => {
  return typeof window !== 'undefined' && 'gtag' in window;
};

// Hook principal pour les analytics
export function useAnalytics() {
  const packViewTimers = useRef<Record<string, number>>({});

  // Événement générique
  const trackEvent = useCallback((
    action: string,
    category: string,
    label?: string,
    value?: number,
    params?: Record<string, unknown>
  ) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...params,
    });
  }, []);

  // === TRACKING DES PACKS ===

  // Quand un pack devient visible (impression)
  const trackPackView = useCallback((props: PackEventProps) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', 'pack_view', {
      event_category: 'Pack',
      event_label: props.pack_name,
      pack_id: props.pack_id,
      pack_name: props.pack_name,
      pack_price: props.pack_price,
      language: props.language,
    });

    // Démarrer le timer pour ce pack
    packViewTimers.current[props.pack_id] = Date.now();
  }, []);

  // Quand un pack est cliqué (ouverture modal)
  const trackPackClick = useCallback((props: PackEventProps) => {
    if (!isGAAvailable()) return;

    // Calculer le temps passé avant le clic
    const timeSpent = packViewTimers.current[props.pack_id]
      ? Math.round((Date.now() - packViewTimers.current[props.pack_id]) / 1000)
      : 0;

    sendGAEvent('event', 'pack_click', {
      event_category: 'Pack',
      event_label: props.pack_name,
      pack_id: props.pack_id,
      pack_name: props.pack_name,
      pack_price: props.pack_price,
      language: props.language,
      time_before_click_seconds: timeSpent,
    });
  }, []);

  // Quand "Choisir ce pack" est cliqué (conversion)
  const trackPackChoose = useCallback((props: PackEventProps) => {
    if (!isGAAvailable()) return;

    // Calculer le temps total passé sur ce pack
    const timeSpent = packViewTimers.current[props.pack_id]
      ? Math.round((Date.now() - packViewTimers.current[props.pack_id]) / 1000)
      : 0;

    sendGAEvent('event', 'pack_choose', {
      event_category: 'Pack',
      event_label: props.pack_name,
      pack_id: props.pack_id,
      pack_name: props.pack_name,
      pack_price: props.pack_price,
      language: props.language,
      time_spent_seconds: timeSpent,
    });

    // Événement de conversion (pour Google Ads)
    sendGAEvent('event', 'conversion', {
      event_category: 'Pack',
      event_label: props.pack_name,
      value: 1,
    });
  }, []);

  // Quand la modal du pack est fermée
  const trackPackModalClose = useCallback((props: PackEventProps & { time_spent_seconds: number }) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', 'pack_modal_close', {
      event_category: 'Pack',
      event_label: props.pack_name,
      pack_id: props.pack_id,
      pack_name: props.pack_name,
      time_spent_seconds: props.time_spent_seconds,
    });
  }, []);

  // === TRACKING DES CONTACTS ===

  const trackContact = useCallback((props: ContactEventProps) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', 'contact_click', {
      event_category: 'Contact',
      event_label: props.contact_type,
      contact_type: props.contact_type,
      language: props.language,
      pack_id: props.pack_id || 'none',
    });
  }, []);

  // === TRACKING DU BLOG ===

  const trackBlogView = useCallback((props: BlogEventProps) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', 'blog_view', {
      event_category: 'Blog',
      event_label: props.blog_title,
      blog_title: props.blog_title,
      blog_slug: props.blog_slug,
      language: props.language,
    });
  }, []);

  const trackBlogClick = useCallback((props: BlogEventProps) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', 'blog_click', {
      event_category: 'Blog',
      event_label: props.blog_title,
      blog_title: props.blog_title,
      blog_slug: props.blog_slug,
      language: props.language,
    });
  }, []);

  // === TRACKING SCROLL DEPTH ===

  const trackScrollDepth = useCallback((props: ScrollDepthEventProps) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', 'scroll_depth', {
      event_category: 'Engagement',
      event_label: `${props.depth_percentage}%`,
      depth_percentage: props.depth_percentage,
      page_path: props.page_path,
    });
  }, []);

  // === TRACKING TEMPS PASSÉ ===

  const trackTiming = useCallback((props: TimingEventProps) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', 'timing_complete', {
      name: props.name,
      value: props.value,
      event_category: props.category,
    });
  }, []);

  // === TRACKING DES FORMULAIRES ===

  // Début de saisie dans un formulaire
  const trackFormStart = useCallback((props: FormEventProps) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', 'form_start', {
      event_category: 'Form',
      event_label: props.form_name,
      form_name: props.form_name,
      language: props.language,
    });
  }, []);

  // Progression dans le formulaire
  const trackFormProgress = useCallback((props: FormEventProps) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', 'form_progress', {
      event_category: 'Form',
      event_label: props.form_name,
      form_name: props.form_name,
      form_step: props.form_step,
      pack_selected: props.pack_selected,
      budget_selected: props.budget_selected,
      language: props.language,
    });
  }, []);

  // Soumission du formulaire
  const trackFormSubmit = useCallback((props: FormEventProps) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', 'form_submit', {
      event_category: 'Form',
      event_label: props.form_name,
      form_name: props.form_name,
      pack_selected: props.pack_selected,
      budget_selected: props.budget_selected,
      language: props.language,
    });

    // Événement de conversion
    sendGAEvent('event', 'generate_lead', {
      event_category: 'Lead',
      event_label: props.form_name,
      value: 1,
    });
  }, []);

  // Erreur de formulaire
  const trackFormError = useCallback((props: FormEventProps & { error_field: string }) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', 'form_error', {
      event_category: 'Form',
      event_label: props.form_name,
      form_name: props.form_name,
      error_field: props.error_field,
      language: props.language,
    });
  }, []);

  // === TRACKING DES CTA ===

  const trackCTA = useCallback((props: CTAEventProps) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', 'cta_click', {
      event_category: 'CTA',
      event_label: props.cta_name,
      cta_name: props.cta_name,
      cta_location: props.cta_location,
      destination: props.destination,
      language: props.language,
    });
  }, []);

  // === TRACKING NAVIGATION ===

  const trackNavigation = useCallback((props: NavigationEventProps) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', 'navigation_click', {
      event_category: 'Navigation',
      event_label: props.link_text,
      link_text: props.link_text,
      link_url: props.link_url,
      link_location: props.link_location,
      language: props.language,
    });
  }, []);

  // === TRACKING ENGAGEMENT ===

  const trackEngagement = useCallback((props: EngagementEventProps) => {
    if (!isGAAvailable()) return;

    sendGAEvent('event', 'user_engagement', {
      event_category: 'Engagement',
      event_label: props.engagement_type,
      engagement_type: props.engagement_type,
      value: props.value,
      page_path: props.page_path,
    });
  }, []);

  return {
    trackEvent,
    trackPackView,
    trackPackClick,
    trackPackChoose,
    trackPackModalClose,
    trackContact,
    trackBlogView,
    trackBlogClick,
    trackScrollDepth,
    trackTiming,
    trackFormStart,
    trackFormProgress,
    trackFormSubmit,
    trackFormError,
    trackCTA,
    trackNavigation,
    trackEngagement,
  };
}

// Hook pour tracker automatiquement le temps passé sur une page
export function usePageTimeTracking(pageName: string) {
  const startTime = useRef<number>(Date.now());
  const { trackTiming } = useAnalytics();

  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      trackTiming({
        name: `page_view_time_${pageName}`,
        value: timeSpent,
        category: 'Page Time',
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pageName, trackTiming]);
}

// Hook pour tracker la profondeur de scroll
export function useScrollDepthTracking() {
  const { trackScrollDepth } = useAnalytics();
  const trackedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // Tracker à 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100];
      
      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !trackedDepths.current.has(milestone)) {
          trackedDepths.current.add(milestone);
          trackScrollDepth({
            depth_percentage: milestone,
            page_path: window.location.pathname,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth]);
}

export default useAnalytics;