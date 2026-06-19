'use client';

import { useEffect, type RefObject } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-setup';

/**
 * useGsapReveal — révélations au scroll pilotées par GSAP ScrollTrigger
 * (animations fluides, compositées GPU) + parallaxe douce sur les halos décoratifs.
 *
 * Pilote les marqueurs déjà présents dans le JSX :
 *   - `.animate-on-scroll`            → élément révélé à l'entrée dans le viewport
 *   - variante de direction via une classe additionnelle :
 *       `.fade-up` (défaut) · `.fade-left` · `.fade-right` · `.scale-up`
 *   - `[data-parallax="<yPercent>"]`  → parallaxe scrub liée au scroll (halos, fonds)
 *
 * GSAP prend la main complète : on neutralise la transition CSS sur les éléments
 * concernés pour éviter toute double animation. Respecte prefers-reduced-motion.
 */
const REVEAL_DISTANCE = 40;

type RevealVariant = 'fade-left' | 'fade-right' | 'scale-up';
const FROM_BY_VARIANT: Record<RevealVariant | 'fade-up', gsap.TweenVars> = {
  'fade-up': { y: REVEAL_DISTANCE },
  'fade-left': { x: -REVEAL_DISTANCE },
  'fade-right': { x: REVEAL_DISTANCE },
  'scale-up': { scale: 0.92 },
};

export function useGsapReveal(
  containerRef: RefObject<HTMLElement | null>,
  deps: unknown[] = []
) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = containerRef.current;
    if (!root) return;

    const els = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.animate-on-scroll'));
    if (!els.length) return;

    // Accessibilité : aucune animation, tout est visible immédiatement.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(els, { clearProps: 'transition,transform' });
      gsap.set(els, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // GSAP pilote tout : on coupe la transition CSS pour éviter une double animation.
      els.forEach((el) => {
        el.style.transition = 'none';
      });

      // 1) Révélations — chaque élément s'anime lorsqu'il entre dans le viewport.
      els.forEach((el) => {
        const variant: RevealVariant | 'fade-up' =
          (['fade-left', 'fade-right', 'scale-up'] as const).find((v) =>
            el.classList.contains(v)
          ) ?? 'fade-up';

        gsap.fromTo(
          el,
          { opacity: 0, ...FROM_BY_VARIANT[variant] },
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: variant === 'scale-up' ? 'back.out(1.5)' : 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });

      // 2) Parallaxe douce sur les halos / fonds décoratifs (scrub lié au scroll).
      gsap.utils
        .toArray<HTMLElement>(root.querySelectorAll('[data-parallax]'))
        .forEach((el) => {
          const depth = parseFloat(el.dataset.parallax || '60');
          gsap.to(el, {
            yPercent: depth,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('section') ?? el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
