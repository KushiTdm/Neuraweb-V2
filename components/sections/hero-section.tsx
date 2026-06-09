'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';

interface HeroSectionProps {
  onScrollToNext?: () => void;
}

interface Slide {
  title: Record<string, string>;
  titleHighlight: Record<string, string>;
  subtitle: Record<string, string>;
  image: string;
  showKpi?: boolean;
}

const SLIDES: Slide[] = [
  {
    title:          { fr: 'Automatisation',       en: 'Intelligent',    es: 'Automatización'    },
    titleHighlight: { fr: 'Intelligente',          en: 'Automation',     es: 'Inteligente'       },
    subtitle: {
      fr: 'Workflows n8n, intégration API, productivité multipliée — libérez votre équipe des tâches répétitives.',
      en: 'n8n workflows, API integration, multiplied productivity — free your team from repetitive tasks.',
      es: 'Flujos n8n, integración API, productividad multiplicada — libera tu equipo de tareas repetitivas.',
    },
    image: '/assets/services/automation_n8n.webp',
    showKpi: true,
  },
  {
    title:          { fr: 'Agence Web,',           en: 'Web Agency,',    es: 'Agencia Web,'      },
    titleHighlight: { fr: 'IA & Mobile',            en: 'AI & Mobile',    es: 'IA & Móvil'        },
    subtitle: {
      fr: 'Développement web sur mesure, intégration IA et applications mobiles pour propulser votre entreprise.',
      en: 'Custom web development, AI integration and mobile apps to propel your business forward.',
      es: 'Desarrollo web a medida, integración IA y apps móviles para impulsar tu empresa.',
    },
    image: '/assets/services/development_web-macbook.webp',
    showKpi: false,
  },
  {
    title:          { fr: 'Intégration IA',        en: 'AI Integration',  es: 'Integración IA'   },
    titleHighlight: { fr: 'de Pointe',              en: 'Cutting-Edge',    es: 'de Vanguardia'    },
    subtitle: {
      fr: 'ChatGPT, LLM et agents IA intégrés directement dans vos produits et processus métier.',
      en: 'ChatGPT, LLM and AI agents integrated directly into your products and business processes.',
      es: 'ChatGPT, LLM y agentes IA integrados directamente en tus productos y procesos de negocio.',
    },
    image: '/assets/services/ia_integration.webp',
    showKpi: false,
  },
  {
    title:          { fr: 'Solutions Mobiles',     en: 'Mobile Solutions', es: 'Soluciones Móviles' },
    titleHighlight: { fr: 'iOS & Android',          en: 'iOS & Android',    es: 'iOS & Android'      },
    subtitle: {
      fr: 'React Native, Flutter — MVP livré en 6 semaines, prêt pour le marché.',
      en: 'React Native, Flutter — MVP delivered in 6 weeks, market-ready.',
      es: 'React Native, Flutter — MVP entregado en 6 semanas, listo para el mercado.',
    },
    image: '/assets/services/developement_mobile.webp',
    showKpi: false,
  },
];

const KPI_ITEMS = [
  { label: 'API connectées',   value: '12'      },
  { label: 'Workflows actifs', value: '47'      },
  { label: 'Gain de temps',    value: '−4h/sem' },
];

const SLIDE_DURATION = 5500;

export function HeroSection({ onScrollToNext }: HeroSectionProps) {
  const [mounted,     setMounted]     = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [kpiVisible,  setKpiVisible]  = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [nextSlide,   setNextSlide]   = useState<number | null>(null);
  const [animating,   setAnimating]   = useState(false);
  const [progress,    setProgress]    = useState(0);

  const { language, t } = useTranslation();
  const lang = (language as string) in SLIDES[0].title ? (language as string) : 'fr';

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Montage : afficher directement le hero ────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const t1 = setTimeout(() => {
      setHeroVisible(true);
      const t2 = setTimeout(() => setKpiVisible(true), 600);
      return () => clearTimeout(t2);
    }, 80);
    return () => clearTimeout(t1);
  }, []);

  // ── Navigation entre slides ───────────────────────────────────────────────
  const clearTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (animating || index === activeSlide) return;
    setAnimating(true);
    setNextSlide(index);
    setProgress(0);
    setTimeout(() => {
      setActiveSlide(index);
      setNextSlide(null);
      setAnimating(false);
    }, 700);
  }, [animating, activeSlide]);

  const next = useCallback(() => goToSlide((activeSlide + 1) % SLIDES.length), [activeSlide, goToSlide]);
  const prev = useCallback(() => goToSlide((activeSlide - 1 + SLIDES.length) % SLIDES.length), [activeSlide, goToSlide]);

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
          setTimeout(() => { setActiveSlide(nextIdx); setNextSlide(null); setAnimating(false); }, 700);
          return prev;
        });
        elapsed = 0;
      }
    }, step);
  }, [clearTimers]);

  useEffect(() => {
    if (heroVisible) startAutoplay();
    return clearTimers;
  }, [heroVisible, startAutoplay, clearTimers, activeSlide]);

  const currentSlide = SLIDES[activeSlide]!;

  // ── SSR skeleton ──────────────────────────────────────────────────────────
  if (!mounted) {
    return (
      <section className="relative w-full min-h-screen overflow-hidden" style={{ background: '#070F26' }}>
        <div className="absolute inset-0">
          <Image src={SLIDES[0].image} alt="" fill sizes="100vw" className="object-cover" priority aria-hidden />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(7,15,38,.88) 0%,rgba(7,15,38,.6) 55%,rgba(7,15,38,.95) 100%)' }} />
        </div>
        <div className="relative z-10 flex items-center min-h-screen max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl pt-28 pb-20">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/70 mb-6">{t('hero.tagline')}</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[5rem] font-bold text-white leading-tight mb-6">
              {SLIDES[0].title[lang]}{' '}
              <span style={{ background: 'linear-gradient(90deg,#ffffff,#e5e7eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {SLIDES[0].titleHighlight[lang]}
              </span>
            </h1>
          </div>
        </div>
      </section>
    );
  }

  // ── Hero slides ───────────────────────────────────────────────────────────
  return (
    <section className="relative w-full min-h-screen overflow-hidden" style={{ background: '#070F26' }} aria-label="Hero NeuraWeb">
      {/* Overlay de fondu au reveal */}
      <div
        aria-hidden
        className="absolute inset-0 z-40 pointer-events-none transition-opacity duration-700"
        style={{ background: '#070F26', opacity: heroVisible ? 0 : 1 }}
      />

      {/* Slides photos */}
      {SLIDES.map((slide, i) => {
        const isActiveSlide = i === activeSlide;
        const isNextSlide   = i === nextSlide;
        return (
          <div
            key={i}
            aria-hidden={!isActiveSlide}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: isActiveSlide || isNextSlide ? 1 : 0, zIndex: isNextSlide ? 2 : isActiveSlide ? 1 : 0 }}
          >
            <Image
              src={slide.image}
              alt={slide.title[lang] ?? ''}
              fill
              sizes="100vw"
              className={`object-cover ${isActiveSlide && !animating ? 'ken-burns' : ''}`}
              priority={i === 0}
              aria-hidden
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(7,15,38,.88) 0%,rgba(7,15,38,.6) 55%,rgba(7,15,38,.95) 100%)' }} />
          </div>
        );
      })}

      {/* Contenu texte */}
      <div className="relative z-10 flex items-center min-h-screen max-w-7xl mx-auto px-6 lg:px-12">
        <div className="w-full lg:w-[55%] pt-28 pb-20">
          <p
            className="text-xs font-semibold uppercase tracking-[0.1em] text-white/70 mb-6"
            style={{ opacity: heroVisible ? 1 : 0, transition: 'opacity 0.6s ease' }}
          >
            {t('hero.tagline')}
          </p>

          <h1
            key={`title-${activeSlide}`}
            className="font-display font-bold text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', letterSpacing: '-0.02em', opacity: heroVisible ? 1 : 0, animation: heroVisible ? 'fadeInUp 0.7s ease forwards' : 'none' }}
          >
            {currentSlide.title[lang]}{' '}
            <span style={{ background: 'linear-gradient(90deg,#ffffff,#e5e7eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {currentSlide.titleHighlight[lang]}
            </span>
          </h1>

          <p
            key={`sub-${activeSlide}`}
            className="text-lg leading-relaxed mb-10 max-w-[520px]"
            style={{ color: 'rgba(232,244,253,.75)', animation: heroVisible ? 'fadeInUp 0.7s 0.15s ease forwards' : 'none', opacity: 0 }}
          >
            {currentSlide.subtitle[lang]}
          </p>

          <div className="flex flex-wrap items-center gap-4" style={{ opacity: heroVisible ? 1 : 0, transition: 'opacity 0.9s 0.5s ease' }}>
            <LocalizedLink
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-gray-900 transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: '#ffffff', boxShadow: '0 4px 20px rgba(255,255,255,.2)' }}
            >
              {t('hero.cta.start')}
            </LocalizedLink>
            <LocalizedLink
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-white border transition-all duration-300 hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,.2)' }}
            >
              {t('hero.cta.services')}
            </LocalizedLink>
          </div>
        </div>

        {/* KPI flottant — uniquement sur le slide Automatisation, desktop seulement */}
        {currentSlide.showKpi && (
          <div
            className="hidden lg:flex absolute right-12 xl:right-20 top-1/2 -translate-y-1/2 flex-col gap-3 w-52"
            style={{ opacity: kpiVisible ? 1 : 0, transform: kpiVisible ? 'translateX(0) translateY(-50%)' : 'translateX(24px) translateY(-50%)', transition: 'opacity 0.8s ease,transform 0.8s ease' }}
          >
            {KPI_ITEMS.map((kpi, i) => (
              <div key={i} className="rounded-2xl px-5 py-4 flex flex-col gap-1" style={{ background: 'rgba(255,255,255,.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.1)' }}>
                <span className="text-2xl font-bold text-white">{kpi.value}</span>
                <span className="text-xs" style={{ color: 'rgba(232,244,253,.6)' }}>{kpi.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flèches de navigation — masquées sur xs */}
      {heroVisible && (
        <div className="hidden sm:flex absolute bottom-8 right-6 sm:right-8 z-20 items-center gap-3">
          <button
            onClick={() => { clearTimers(); prev(); startAutoplay(); }}
            className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all duration-200"
            aria-label="Slide précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => { clearTimers(); next(); startAutoplay(); }}
            className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all duration-200"
            aria-label="Slide suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Indicateurs de slides — fines barres minimalistes */}
      {heroVisible && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              role="tab"
              tabIndex={0}
              onClick={() => { clearTimers(); goToSlide(i); startAutoplay(); }}
              onKeyDown={(e) => e.key === 'Enter' && goToSlide(i)}
              aria-label={`Aller au slide ${i + 1}`}
              aria-selected={i === activeSlide}
              className="cursor-pointer relative overflow-hidden"
              style={{
                width: i === activeSlide ? '22px' : '5px',
                height: '3px',
                borderRadius: '2px',
                background: i === activeSlide ? 'rgba(93,184,240,.35)' : 'rgba(255,255,255,.22)',
                transition: 'width 0.3s ease, background 0.3s ease',
                flexShrink: 0,
              }}
            >
              {i === activeSlide && (
                <span
                  className="absolute inset-y-0 left-0 slide-progress"
                  style={{ background: '#ffffff', animationDuration: `${SLIDE_DURATION}ms`, width: '100%' }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Barre de progression (desktop) */}
      {heroVisible && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          <div className="h-full transition-none" style={{ width: `${progress}%`, background: '#ffffff' }} />
        </div>
      )}

      {/* Scroll indicator — masqué sur xs */}
      {heroVisible && onScrollToNext && (
        <button
          onClick={onScrollToNext}
          className="hidden sm:flex absolute bottom-8 left-6 sm:left-8 z-20 flex-col items-center gap-2 hover:opacity-80 transition-opacity duration-200"
          style={{ color: 'rgba(255,255,255,.4)' }}
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
