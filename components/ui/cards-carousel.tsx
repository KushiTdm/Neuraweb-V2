'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ResponsiveCards : wrapper qui rend une grille sur desktop et un carousel sur mobile.
 * Plus pratique que de dupliquer les enfants.
 * - breakpoint: le breakpoint à partir duquel on bascule en grille (default 'sm' = 640px)
 * - gridClass: classes Tailwind pour la grille desktop
 */
interface ResponsiveCardsProps {
  children: React.ReactNode[];
  /** Breakpoint à partir duquel la grille s'affiche (default 'sm') */
  breakpoint?: 'sm' | 'md' | 'lg';
  /** Classes Tailwind pour la grille desktop (sans le préfixe responsive) */
  gridClass?: string;
  /** Gap entre les items en grille (default 'gap-6') */
  gridGap?: string;
  /** Couleur des dots actifs */
  dotColor?: string;
  /** Padding latéral du conteneur en rem (default 1) */
  carouselPadding?: number;
  className?: string;
  /** Affiche les flèches de navigation */
  showArrows?: boolean;
  /** Active le slide automatique */
  autoPlay?: boolean;
  /** Intervalle entre slides en ms (default 4000) */
  autoPlayInterval?: number;
}

export function ResponsiveCards({
  children,
  breakpoint = 'sm',
  gridClass = 'grid-cols-2 lg:grid-cols-4',
  gridGap = 'gap-6',
  dotColor = '#5DB8F0',
  carouselPadding = 1,
  className,
  showArrows = false,
  autoPlay = false,
  autoPlayInterval = 4000,
}: ResponsiveCardsProps) {
  // Mappings pour les classes responsive (Tailwind a besoin de classes complètes pour purge)
  const hideOnMobile = breakpoint === 'sm' ? 'hidden sm:grid' : breakpoint === 'md' ? 'hidden md:grid' : 'hidden lg:grid';
  const showOnMobile = breakpoint === 'sm' ? 'sm:hidden' : breakpoint === 'md' ? 'md:hidden' : 'lg:hidden';
  const negativeMargin = breakpoint === 'sm' ? '-mx-4 sm:mx-0' : breakpoint === 'md' ? '-mx-4 md:mx-0' : '-mx-4 lg:mx-0';

  return (
    <>
      {/* Desktop : grille */}
      <div className={cn(hideOnMobile, gridClass, gridGap, className)}>
        {children}
      </div>

      {/* Mobile : carousel */}
      <div className={cn(showOnMobile, negativeMargin)}>
        <CardsCarousel
          slideWidth="snap"
          padding={carouselPadding}
          gap={1}
          dotColor={dotColor}
          showArrows={showArrows}
          autoPlay={autoPlay}
          autoPlayInterval={autoPlayInterval}
        >
          {children}
        </CardsCarousel>
      </div>
    </>
  );
}


interface CardsCarouselProps {
  children: React.ReactNode[];
  /** Largeur des slides : 'full' = pleine largeur, 'snap' = 85vw, 'auto' = laisse libre */
  slideWidth?: 'full' | 'snap' | 'auto';
  /** Affiche les dots de progression */
  showDots?: boolean;
  /** Affiche les flèches gauche/droite */
  showArrows?: boolean;
  /** Active le slide automatique infini */
  autoPlay?: boolean;
  /** Délai entre chaque slide automatique en ms (default 4000) */
  autoPlayInterval?: number;
  /** Classes additionnelles pour le wrapper */
  className?: string;
  /** Couleur des dots actifs */
  dotColor?: string;
  /** Espacement entre slides en rem (default 1) */
  gap?: number;
  /** Padding latéral du conteneur en rem (default 1) */
  padding?: number;
}

/**
 * Carousel horizontal avec scroll-snap CSS, indicateurs minimalistes et flèches.
 * Auto-slide infini optionnel. Optimisé mobile.
 */
export function CardsCarousel({
  children,
  slideWidth = 'snap',
  showDots = true,
  showArrows = false,
  autoPlay = false,
  autoPlayInterval = 4000,
  className,
  dotColor = '#5DB8F0',
  gap = 1,
  padding = 1,
}: CardsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);          // toujours à jour pour les timers
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = React.Children.count(children);

  // Sync ref avec state pour accès dans les callbacks/timers sans re-créer les effets
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Détection du slide actif via Intersection Observer pour fiabilité
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const slides = Array.from(scroller.querySelectorAll<HTMLElement>('[data-carousel-slide]'));
    if (slides.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = slides.indexOf(visible.target as HTMLElement);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      { root: scroller, threshold: [0.5, 0.75, 1] }
    );

    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [count]);

  // Scroll vers un index donné — utilise scrollTo() sur le conteneur pour ne PAS
  // faire scroller la page (contrairement à scrollIntoView)
  const scrollTo = useCallback((idx: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slides = Array.from(scroller.querySelectorAll<HTMLElement>('[data-carousel-slide]'));
    const target = slides[idx];
    if (!target) return;
    const containerRect = scroller.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const currentLeft = scroller.scrollLeft;
    const targetLeft = currentLeft + targetRect.left - containerRect.left
      - (containerRect.width - targetRect.width) / 2;
    scroller.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  }, []);

  // Démarre / redémarre le timer d'auto-play
  const startAutoPlay = useCallback(() => {
    if (!autoPlay) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = (activeIndexRef.current + 1) % count;
      scrollTo(next);
    }, autoPlayInterval);
  }, [autoPlay, autoPlayInterval, count, scrollTo]);

  useEffect(() => {
    startAutoPlay();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startAutoPlay]);

  // Navigation manuelle (réinitialise le timer)
  const goTo = useCallback((idx: number) => {
    scrollTo(idx);
    startAutoPlay();
  }, [scrollTo, startAutoPlay]);

  const goPrev = useCallback(() => {
    goTo((activeIndexRef.current - 1 + count) % count);
  }, [count, goTo]);

  const goNext = useCallback(() => {
    goTo((activeIndexRef.current + 1) % count);
  }, [count, goTo]);

  const slideClass =
    slideWidth === 'full'
      ? 'w-full shrink-0 snap-center'
      : slideWidth === 'snap'
        ? 'w-[83vw] max-w-[380px] shrink-0 snap-center'
        : 'shrink-0 snap-center';

  return (
    <div className={cn('relative', className)}>
      {/* Zone scrollable + flèches superposées */}
      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
          style={{
            gap: `${gap}rem`,
            paddingInline: `${padding}rem`,
            scrollPaddingInline: `${padding}rem`,
            WebkitOverflowScrolling: 'touch',
          }}
          role="region"
          aria-roledescription="carousel"
        >
          {React.Children.map(children, (child, i) => (
            <div
              key={i}
              data-carousel-slide
              className={slideClass}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} sur ${count}`}
            >
              {child}
            </div>
          ))}
        </div>

        {/* Flèches de navigation */}
        {showArrows && count > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full backdrop-blur-sm transition-all duration-200 active:scale-95 touch-manipulation"
              style={{
                background: 'rgba(7,15,38,0.72)',
                border: '1px solid rgba(255,255,255,0.18)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
              }}
              aria-label="Slide précédent"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full backdrop-blur-sm transition-all duration-200 active:scale-95 touch-manipulation"
              style={{
                background: 'rgba(7,15,38,0.72)',
                border: '1px solid rgba(255,255,255,0.18)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
              }}
              aria-label="Slide suivant"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Indicateurs minimalistes — <div> pour éviter le min-height navigateur des <button> */}
      {showDots && count > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4" role="tablist" aria-label="Navigation du carousel">
          {Array.from({ length: count }).map((_, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={i}
                role="tab"
                tabIndex={0}
                aria-selected={isActive}
                aria-label={`Aller au slide ${i + 1}`}
                onClick={() => goTo(i)}
                onKeyDown={(e) => e.key === 'Enter' && goTo(i)}
                className="rounded-sm transition-all duration-300 cursor-pointer"
                style={{
                  width: isActive ? '20px' : '5px',
                  height: '3px',
                  background: isActive ? dotColor : 'rgba(148,163,184,0.3)',
                  flexShrink: 0,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
