'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap-setup';
import { ChevronDown } from 'lucide-react';

interface ServicesHeroProps {
  language?: 'fr' | 'en';
}

export function ServicesHero({ language = 'fr' }: ServicesHeroProps) {
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      fr: {
        'servicePage.hero.title': 'Services Professionnels',
        'servicePage.hero.subtitle':
          'Des solutions sur mesure pour transformer votre vision en réalité digitale',
      },
      en: {
        'servicePage.hero.title': 'Professional Services',
        'servicePage.hero.subtitle':
          'Tailored solutions to transform your vision into digital reality',
      },
    };
    return translations[language][key] || key;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      // Animations d'entrée
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

  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="letter inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  if (!mounted) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-6xl text-white font-bold">Services</div>
      </section>
    );
  }

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
          className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
        >
          {splitText(t('servicePage.hero.title'))}
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-3xl text-white/90 mb-12 font-light"
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