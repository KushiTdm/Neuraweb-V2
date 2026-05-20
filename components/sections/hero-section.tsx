'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PillButton } from '@/components/ui/pill-button';
import { useTranslation } from '@/hooks/use-translation';

interface HeroSectionProps {
  mousePosition?: { x: number; y: number };
  onScrollToNext?: () => void;
}

interface Slide {
  title: Record<string, string>;
  subtitle: Record<string, string>;
  image: string;
}

const SLIDES: Slide[] = [
  {
    title: {
      fr: 'Agence Web, IA & Applications Mobiles',
      en: 'Web Agency, AI & Mobile Apps',
      es: 'Agencia Web, IA & Apps Móviles',
    },
    subtitle: {
      fr: 'Développement web sur mesure, intégration IA et automatisation pour propulser votre entreprise.',
      en: 'Custom web development, AI integration and automation to propel your business forward.',
      es: 'Desarrollo web a medida, integración IA y automatización para impulsar tu empresa.',
    },
    image: '/assets/services/web_dev.webp',
  },
  {
    title: {
      fr: 'Automatisation Intelligente',
      en: 'Smart Automation',
      es: 'Automatización Inteligente',
    },
    subtitle: {
      fr: 'Workflows n8n, intégration API, productivité multipliée — libérez votre équipe des tâches répétitives.',
      en: 'n8n workflows, API integration, multiplied productivity — free your team from repetitive tasks.',
      es: 'Flujos n8n, integración API, productividad multiplicada — libera tu equipo de tareas repetitivas.',
    },
    image: '/assets/services/automation.webp',
  },
  {
    title: {
      fr: 'Intégration IA de Pointe',
      en: 'Cutting-Edge AI Integration',
      es: 'Integración IA de Vanguardia',
    },
    subtitle: {
      fr: 'ChatGPT, LLM et agents IA intégrés directement dans vos produits et processus métier.',
      en: 'ChatGPT, LLM and AI agents integrated directly into your products and business processes.',
      es: 'ChatGPT, LLM y agentes IA integrados directamente en tus productos y procesos de negocio.',
    },
    image: '/assets/services/ia_integration.webp',
  },
  {
    title: {
      fr: 'Solutions Mobiles iOS & Android',
      en: 'iOS & Android Mobile Solutions',
      es: 'Soluciones Móviles iOS & Android',
    },
    subtitle: {
      fr: 'React Native, Flutter — MVP livré en 6 semaines, prêt pour le marché.',
      en: 'React Native, Flutter — MVP delivered in 6 weeks, market-ready.',
      es: 'React Native, Flutter — MVP entregado en 6 semanas, listo para el mercado.',
    },
    image: '/assets/equipe.webp',
  },
];

const SLIDE_DURATION = 5500;

export function HeroSection({ onScrollToNext }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [nextSlide, setNextSlide] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { language } = useTranslation();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lang = (language as string) in SLIDES[0].title ? (language as string) : 'fr';

  const clearTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (animating || index === activeSlide) return;
      setAnimating(true);
      setNextSlide(index);
      setProgress(0);

      setTimeout(() => {
        setActiveSlide(index);
        setNextSlide(null);
        setAnimating(false);
      }, 700);
    },
    [animating, activeSlide]
  );

  const next = useCallback(() => {
    goToSlide((activeSlide + 1) % SLIDES.length);
  }, [activeSlide, goToSlide]);

  const prev = useCallback(() => {
    goToSlide((activeSlide - 1 + SLIDES.length) % SLIDES.length);
  }, [activeSlide, goToSlide]);

  const startAutoplay = useCallback(() => {
    clearTimers();
    setProgress(0);

    const step = 50;
    let elapsed = 0;
    progressRef.current = setInterval(() => {
      elapsed += step;
      setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100));
      if (elapsed >= SLIDE_DURATION) {
        clearTimers();
        setActiveSlide((prev) => {
          const nextIdx = (prev + 1) % SLIDES.length;
          setNextSlide(nextIdx);
          setAnimating(true);
          setTimeout(() => {
            setActiveSlide(nextIdx);
            setNextSlide(null);
            setAnimating(false);
          }, 700);
          return prev;
        });
        elapsed = 0;
      }
    }, step);
  }, [clearTimers]);

  useEffect(() => {
    setMounted(true);

    const fallback = setTimeout(() => setHeroVisible(true), 2500);
    const handleReveal = () => {
      clearTimeout(fallback);
      setTimeout(() => setHeroVisible(true), 200);
    };
    window.addEventListener('hero:reveal', handleReveal);

    return () => {
      clearTimeout(fallback);
      window.removeEventListener('hero:reveal', handleReveal);
    };
  }, []);

  useEffect(() => {
    if (heroVisible) startAutoplay();
    return clearTimers;
  }, [heroVisible, startAutoplay, clearTimers, activeSlide]);

  const currentSlide = SLIDES[activeSlide]!;

  // ── SSR / non-hydraté ───────────────────────────────────────────────────────
  if (!mounted) {
    return (
      <section className="relative w-full min-h-screen overflow-hidden" style={{ background: '#0B1220' }}>
        <div className="absolute inset-0">
          <Image
            src={SLIDES[0].image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
            aria-hidden="true"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(11,18,32,0.85) 0%, rgba(11,18,32,0.45) 60%, rgba(11,18,32,0.2) 100%)' }} />
        </div>
        <div className="relative z-10 flex flex-col justify-center min-h-screen max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl pt-28 pb-20">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/60 mb-6">NeuraWeb — Agence digitale</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
              {SLIDES[0].title[lang] ?? SLIDES[0].title.fr}
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-lg">
              {SLIDES[0].subtitle[lang] ?? SLIDES[0].subtitle.fr}
            </p>
            <PillButton href="/contact" variant="dark">Démarrer un projet</PillButton>
          </div>
        </div>
      </section>
    );
  }

  // ── Version hydratée ─────────────────────────────────────────────────────────
  return (
    <section
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: '#0B1220' }}
      aria-label="Hero NeuraWeb"
    >
      {/* ── Overlay masque avant reveal (vidéo intro) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-40 pointer-events-none transition-opacity duration-700"
        style={{ background: '#0B1220', opacity: heroVisible ? 0 : 1 }}
      />

      {/* ── Slides images ─────────────────────────────────────── */}
      {SLIDES.map((slide, i) => {
        const isActive = i === activeSlide;
        const isNext = i === nextSlide;
        return (
          <div
            key={i}
            aria-hidden={!isActive}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: isActive || isNext ? 1 : 0, zIndex: isNext ? 2 : isActive ? 1 : 0 }}
          >
            <Image
              src={slide.image}
              alt={slide.title[lang] ?? ''}
              fill
              sizes="100vw"
              className={`object-cover ${isActive && !animating ? 'ken-burns' : ''}`}
              priority={i === 0}
              aria-hidden="true"
            />
            {/* Dégradé overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, rgba(11,18,32,0.88) 0%, rgba(11,18,32,0.55) 55%, rgba(11,18,32,0.2) 100%)',
              }}
            />
          </div>
        );
      })}

      {/* ── Contenu texte ─────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen max-w-7xl mx-auto px-6 lg:px-12">
        <div
          className="max-w-2xl pt-28 pb-20"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
          }}
        >
          {/* Kicker */}
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-6"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            NeuraWeb — Agence digitale
          </p>

          {/* Title */}
          <h1
            key={`title-${activeSlide}`}
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6"
            style={{
              animation: heroVisible ? 'fadeInUp 0.7s ease forwards' : 'none',
            }}
          >
            {currentSlide.title[lang] ?? currentSlide.title.fr}
          </h1>

          {/* Subtitle */}
          <p
            key={`sub-${activeSlide}`}
            className="text-lg text-white/70 leading-relaxed mb-10 max-w-lg"
            style={{
              animation: heroVisible ? 'fadeInUp 0.7s 0.15s ease forwards' : 'none',
              opacity: 0,
            }}
          >
            {currentSlide.subtitle[lang] ?? currentSlide.subtitle.fr}
          </p>

          {/* CTA */}
          <div
            className="flex flex-wrap items-center gap-4"
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: 'opacity 0.9s 0.5s ease',
            }}
          >
            <PillButton href="/contact" variant="dark">
              Démarrer un projet
            </PillButton>
            <PillButton href="/services" variant="dark">
              Nos services
            </PillButton>
          </div>
        </div>
      </div>

      {/* ── Contrôles navigation (flèches) ───────────────────── */}
      {heroVisible && (
        <div className="absolute bottom-8 right-8 z-20 flex items-center gap-3">
          <button
            onClick={() => { clearTimers(); prev(); startAutoplay(); }}
            className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/70 transition-all duration-200"
            aria-label="Slide précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => { clearTimers(); next(); startAutoplay(); }}
            className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/70 transition-all duration-200"
            aria-label="Slide suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ── Points de navigation ──────────────────────────────── */}
      {heroVisible && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { clearTimers(); goToSlide(i); startAutoplay(); }}
              className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
              style={{
                width: i === activeSlide ? '2.5rem' : '0.5rem',
                background: i === activeSlide ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.25)',
              }}
              aria-label={`Aller au slide ${i + 1}`}
            >
              {i === activeSlide && (
                <span
                  className="absolute inset-y-0 left-0 bg-white slide-progress"
                  style={{ animationDuration: `${SLIDE_DURATION}ms`, width: '100%' }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Barre de progression en haut ─────────────────────── */}
      {heroVisible && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          <div
            className="h-full bg-white/60 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* ── Scroll indicator ─────────────────────────────────── */}
      {heroVisible && onScrollToNext && (
        <button
          onClick={onScrollToNext}
          className="absolute bottom-8 left-8 z-20 flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors duration-200"
          aria-label="Défiler vers le bas"
        >
          <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
          <span className="w-px h-8 bg-white/30 animate-pulse" />
        </button>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
