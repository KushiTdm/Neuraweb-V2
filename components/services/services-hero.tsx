'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap-setup';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

// ─── Contenu statique par langue ─────────────────────────────────────────────
// Dupliqué ici pour le SSR : permet à Google de voir le vrai contenu H1
// sans attendre l'hydratation JS. Doit rester synchronisé avec locales/*.ts
const SSR_CONTENT: Record<string, { title: string; subtitle: string }> = {
  fr: {
    title: 'Services Professionnels',
    subtitle: 'Des solutions sur mesure pour transformer votre vision en réalité digitale',
  },
  en: {
    title: 'Professional Services',
    subtitle: 'Custom solutions to transform your vision into digital reality',
  },
  es: {
    title: 'Servicios Profesionales',
    subtitle: 'Soluciones a medida para transformar tu visión en realidad digital',
  },
};

export function ServicesHero() {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { t, language } = useTranslation();

  const ssrContent = SSR_CONTENT[language] ?? SSR_CONTENT.fr;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });

      gsap.from(subtitleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });

      gsap.from(ctaRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out',
      });

      // Animation flottante du CTA
      gsap.to(ctaRef.current, {
        y: -10,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: 'power1.inOut',
      });

      // Parallax du fond
      gsap.to(bgRef.current, {
        yPercent: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Animation des lettres
      const letters = titleRef.current?.querySelectorAll('.letter');
      if (letters) {
        gsap.from(letters, {
          opacity: 0,
          y: 50,
          rotateX: -90,
          stagger: 0.05,
          duration: 0.8,
          ease: 'back.out(1.7)',
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [mounted]);

  // ─── Fallback SSR ────────────────────────────────────────────────────────
  // ✅ CORRIGÉ : le fallback contient le vrai contenu textuel (H1 + sous-titre)
  // Google crawle ce HTML statique — il voit maintenant le titre et la description
  // de la page au lieu d'un simple placeholder vide.
  // Les animations GSAP s'activent après hydratation sans impact SEO.
  if (!mounted) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight">
            {ssrContent.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 font-light max-w-3xl mx-auto">
            {ssrContent.subtitle}
          </p>
          <div className="flex justify-center">
            <div className="animate-bounce">
              <ChevronDown
                className="w-12 h-12 text-white"
                strokeWidth={1.5}
                aria-label="Scroll down"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Version hydratée (avec animations GSAP) ─────────────────────────────
  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background animé */}
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1000ms' }}
          />
        </div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight"
          style={{ wordSpacing: '0.25em' }}
        >
          {t('servicePage.hero.title')}
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 font-light max-w-3xl mx-auto"
        >
          {t('servicePage.hero.subtitle')}
        </p>
        <div ref={ctaRef} className="flex justify-center">
          <div className="cursor-pointer animate-bounce">
            <ChevronDown
              className="w-12 h-12 text-white"
              strokeWidth={1.5}
              aria-label="Scroll down"
            />
          </div>
        </div>
      </div>
    </section>
  );
}