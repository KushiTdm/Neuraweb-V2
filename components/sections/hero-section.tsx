'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';

// ── Détection mobile (pour choisir la bonne vidéo) ──────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => {
      const mq = window.matchMedia('(max-width: 768px)').matches;
      const conn = (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
      setIsMobile(mq || conn?.saveData === true || conn?.effectiveType === '2g');
    };
    check();
  }, []);
  return isMobile;
}

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
    title:          { fr: 'Automatisation',       en: 'Intelligent',   es: 'Automatización'    },
    titleHighlight: { fr: 'Intelligente',          en: 'Automation',    es: 'Inteligente'       },
    subtitle: {
      fr: 'Workflows n8n, intégration API, productivité multipliée — libérez votre équipe des tâches répétitives.',
      en: 'n8n workflows, API integration, multiplied productivity — free your team from repetitive tasks.',
      es: 'Flujos n8n, integración API, productividad multiplicada — libera tu equipo de tareas repetitivas.',
    },
    image: '/assets/services/automation.webp',
    showKpi: true,
  },
  {
    title:          { fr: 'Agence Web,',           en: 'Web Agency,',   es: 'Agencia Web,'      },
    titleHighlight: { fr: 'IA & Mobile',            en: 'AI & Mobile',   es: 'IA & Móvil'        },
    subtitle: {
      fr: 'Développement web sur mesure, intégration IA et applications mobiles pour propulser votre entreprise.',
      en: 'Custom web development, AI integration and mobile apps to propel your business forward.',
      es: 'Desarrollo web a medida, integración IA y apps móviles para impulsar tu empresa.',
    },
    image: '/assets/services/web_dev.webp',
    showKpi: false,
  },
  {
    title:          { fr: 'Intégration IA',        en: 'AI Integration', es: 'Integración IA'   },
    titleHighlight: { fr: 'de Pointe',              en: 'Cutting-Edge',   es: 'de Vanguardia'    },
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
    image: '/assets/equipe.webp',
    showKpi: false,
  },
];

const KPI_ITEMS = [
  { label: 'API connectées',  value: '12' },
  { label: 'Workflows actifs', value: '47' },
  { label: 'Gain de temps',   value: '−4h/sem' },
];

const SLIDE_DURATION = 5500;

// ── Cercle SVG pour le bouton skip ──────────────────────────────────────────
const C = 2 * Math.PI * 16;

export function HeroSection({ onScrollToNext }: HeroSectionProps) {
  const isMobile = useIsMobile();

  // ── Mode : 'video' d'abord, puis 'slides' ────────────────────────────────
  const [mode, setMode] = useState<'video' | 'slides'>('video');
  const [videoFading, setVideoFading] = useState(false);
  const [barsIn, setBarsIn]         = useState(false);
  const [titleIn, setTitleIn]       = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [skipHovered, setSkipHovered] = useState(false);
  const [skipPct, setSkipPct]       = useState(0);
  const [holding, setHolding]       = useState(false);

  const videoRef    = useRef<HTMLVideoElement>(null);
  const holdTimer   = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasEnded    = useRef(false);

  // ── Slides state ─────────────────────────────────────────────────────────
  const [mounted, setMounted]       = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [kpiVisible, setKpiVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [nextSlide, setNextSlide]   = useState<number | null>(null);
  const [animating, setAnimating]   = useState(false);
  const [progress, setProgress]     = useState(0);

  const { language, t } = useTranslation();
  const lang = (language as string) in SLIDES[0].title ? (language as string) : 'fr';

  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Init ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);

    // Si la vidéo a déjà été vue dans cette session → passer directement aux slides
    if (typeof window !== 'undefined' && sessionStorage.getItem('video-intro-seen') === 'true') {
      hasEnded.current = true;
      setMode('slides');
      setTimeout(() => {
        setHeroVisible(true);
        setTimeout(() => setKpiVisible(true), 600);
      }, 100);
    }
  }, []);

  // ── Dismiss vidéo → transition vers slides ────────────────────────────────
  const dismissVideo = useCallback(() => {
    if (videoFading || hasEnded.current) return;
    hasEnded.current = true;

    const v = videoRef.current;
    if (v) {
      v.pause();
      if (v.duration && isFinite(v.duration)) v.currentTime = v.duration;
    }

    setVideoFading(true);
    setTimeout(() => {
      setMode('slides');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('video-intro-seen', 'true');
      }
      setTimeout(() => {
        setHeroVisible(true);
        setTimeout(() => setKpiVisible(true), 600);
      }, 50);
    }, 800);
  }, [videoFading]);

  // ── Hold-to-skip ──────────────────────────────────────────────────────────
  const startHold = useCallback(() => {
    if (videoFading) return;
    setHolding(true);
    setSkipPct(0);
    let elapsed = 0;
    holdTimer.current = setInterval(() => {
      elapsed += 50;
      const pct = Math.min((elapsed / 1500) * 100, 100);
      setSkipPct(pct);
      if (pct >= 100) {
        clearInterval(holdTimer.current!);
        setHolding(false);
        setSkipPct(0);
        dismissVideo();
      }
    }, 50);
  }, [videoFading, dismissVideo]);

  const cancelHold = useCallback(() => {
    if (holdTimer.current) clearInterval(holdTimer.current);
    setHolding(false);
    setSkipPct(0);
  }, []);

  // ── Init vidéo ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted || mode !== 'video' || hasEnded.current) return;
    const v = videoRef.current;
    if (!v) return;

    const play = async () => {
      try {
        if (v.readyState >= 1 && isFinite(v.duration || 0)) v.currentTime = 0;
        await v.play();
        setTimeout(() => setBarsIn(true), 100);
        setTimeout(() => setTitleIn(true), 600);
      } catch {
        dismissVideo();
      }
    };

    const onTime = () => {
      if (hasEnded.current) return;
      if (v.duration && isFinite(v.duration) && v.duration > 0) {
        const pct = (v.currentTime / v.duration) * 100;
        setVideoProgress(pct);
        if (v.currentTime >= v.duration - 0.8 && !v.paused) {
          v.pause();
          dismissVideo();
        }
      }
    };

    const onEnded = () => { if (!hasEnded.current) { v.pause(); dismissVideo(); } };

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('ended', onEnded);
    v.loop = false;

    if (v.readyState >= 2) {
      play();
    } else {
      v.addEventListener('loadedmetadata', play, { once: true });
      const fb = setTimeout(dismissVideo, 500);
      v.addEventListener('loadedmetadata', () => clearTimeout(fb), { once: true });
      v.load();
    }

    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('ended', onEnded);
      if (holdTimer.current) clearInterval(holdTimer.current);
    };
  }, [mounted, mode, dismissVideo]);

  // ── Slides autoplay ───────────────────────────────────────────────────────
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
    if (mode === 'slides' && heroVisible) startAutoplay();
    return clearTimers;
  }, [mode, heroVisible, startAutoplay, clearTimers, activeSlide]);

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
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-sky-400 mb-6">NEURAWEB — AGENCE TECH</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[5rem] font-bold text-white leading-tight mb-6">
              {SLIDES[0].title[lang]}{' '}
              <span style={{ background: 'linear-gradient(90deg,#5DB8F0,#22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {SLIDES[0].titleHighlight[lang]}
              </span>
            </h1>
          </div>
        </div>
      </section>
    );
  }

  // ── Mode vidéo ────────────────────────────────────────────────────────────
  if (mode === 'video') {
    return (
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#000',
          opacity: videoFading ? 0 : 1,
          transition: videoFading ? 'opacity 0.8s ease-out' : 'none',
          pointerEvents: videoFading ? 'none' : 'auto',
        }}
      >
        <video
          ref={videoRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          muted playsInline preload="none"
          poster="/assets/ampoulePoster.webp"
          title="Animation d'introduction NeuraWeb"
          aria-label="Animation d'introduction : idée lumineuse — NeuraWeb"
        >
          {isMobile ? (
            <>
              <source src="/assets/light_idea_to_reality_mobile.webm" type="video/webm" />
              <source src="/assets/light_idea_to_reality_mobile.mp4" type="video/mp4" />
            </>
          ) : (
            <>
              <source src="/assets/light_idea_to_reality.webm" type="video/webm" />
              <source src="/assets/light_idea_to_reality.mp4" type="video/mp4" />
            </>
          )}
          <track kind="captions" src="/assets/captions-empty.vtt" srcLang="fr" label="Français" default />
        </video>

        {/* Letterbox top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '7vh', background: '#000', zIndex: 10, transform: barsIn ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 0.9s cubic-bezier(0.4,0,0.2,1)' }} />
        {/* Letterbox bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '7vh', background: '#000', zIndex: 10, transform: barsIn ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.9s cubic-bezier(0.4,0,0.2,1)' }} />

        {/* Vignette */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 11, pointerEvents: 'none', background: 'radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.7) 100%)' }} />

        {/* Titre */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond','Garamond',serif", fontSize: 'clamp(1.8rem,5vw,4.5rem)', fontWeight: 300, color: '#fff', textAlign: 'center', letterSpacing: '0.35em', textTransform: 'uppercase', textShadow: '0 2px 40px rgba(0,0,0,.9)', userSelect: 'none', margin: 0, opacity: titleIn ? 1 : 0, transform: titleIn ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 1.2s ease,transform 1.2s ease' }}>
            {t('video.title')}
          </h2>
        </div>

        {/* Barre de progression */}
        <div style={{ position: 'absolute', bottom: '7vh', left: 0, right: 0, zIndex: 30, padding: '0 2rem', pointerEvents: 'none' }}>
          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,.15)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: '0 auto 0 0', background: 'rgba(255,255,255,.55)', width: `${videoProgress}%`, transition: 'width 0.3s linear' }} />
          </div>
        </div>

        {/* Bouton Skip */}
        <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 40 }}>
          <button
            aria-label="Passer l'introduction"
            onMouseEnter={() => setSkipHovered(true)}
            onMouseLeave={() => { setSkipHovered(false); cancelHold(); }}
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onTouchStart={(e) => { e.preventDefault(); startHold(); }}
            onTouchEnd={() => cancelHold()}
            onClick={() => { if (!holding && !videoFading) dismissVideo(); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0, userSelect: 'none' }}
          >
            <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
              <svg style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" />
                <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C - (C * skipPct) / 100} style={{ transition: holding ? 'none' : 'stroke-dashoffset 0.1s' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: '#fff', transform: skipHovered ? 'translateX(2px)' : 'translateX(0)', transition: 'transform 0.2s ease' }}>
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 300, color: '#fff', whiteSpace: 'nowrap', opacity: skipHovered || holding ? 1 : 0.55, transition: 'opacity 0.25s ease' }}>
              {holding ? 'Patienter…' : 'Passer'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // ── Mode slides ───────────────────────────────────────────────────────────
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
          <div key={i} aria-hidden={!isActiveSlide} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: isActiveSlide || isNextSlide ? 1 : 0, zIndex: isNextSlide ? 2 : isActiveSlide ? 1 : 0 }}>
            <Image src={slide.image} alt={slide.title[lang] ?? ''} fill sizes="100vw" className={`object-cover ${isActiveSlide && !animating ? 'ken-burns' : ''}`} priority={i === 0} aria-hidden />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(7,15,38,.88) 0%,rgba(7,15,38,.6) 55%,rgba(7,15,38,.95) 100%)' }} />
          </div>
        );
      })}

      {/* Contenu texte */}
      <div className="relative z-10 flex items-center min-h-screen max-w-7xl mx-auto px-6 lg:px-12">
        <div className="w-full lg:w-[55%] pt-28 pb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-sky-400 mb-6" style={{ opacity: heroVisible ? 1 : 0, transition: 'opacity 0.6s ease' }}>
            NEURAWEB — AGENCE TECH
          </p>

          <h1
            key={`title-${activeSlide}`}
            className="font-display font-bold text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', letterSpacing: '-0.02em', opacity: heroVisible ? 1 : 0, animation: heroVisible ? 'fadeInUp 0.7s ease forwards' : 'none' }}
          >
            {currentSlide.title[lang]}{' '}
            <span style={{ background: 'linear-gradient(90deg,#5DB8F0,#22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
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
            <LocalizedLink href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5" style={{ background: 'linear-gradient(90deg,#5DB8F0,#22D3EE)', boxShadow: '0 4px 20px rgba(93,184,240,.35)' }}>
              Démarrer un projet
            </LocalizedLink>
            <LocalizedLink href="/services" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-white border transition-all duration-300 hover:bg-white/10" style={{ borderColor: 'rgba(255,255,255,.2)' }}>
              Voir nos services
            </LocalizedLink>
          </div>
        </div>

        {/* KPI flottant — uniquement sur le slide Automatisation */}
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

      {/* Navigation flèches */}
      {heroVisible && (
        <div className="absolute bottom-8 right-8 z-20 flex items-center gap-3">
          <button onClick={() => { clearTimers(); prev(); startAutoplay(); }} className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all duration-200" aria-label="Slide précédent">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => { clearTimers(); next(); startAutoplay(); }} className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-all duration-200" aria-label="Slide suivant">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Dots de navigation */}
      {heroVisible && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => { clearTimers(); goToSlide(i); startAutoplay(); }} className="relative h-1 rounded-full overflow-hidden transition-all duration-300" style={{ width: i === activeSlide ? '2.5rem' : '0.5rem', background: i === activeSlide ? 'rgba(93,184,240,.3)' : 'rgba(255,255,255,.2)' }} aria-label={`Aller au slide ${i + 1}`}>
              {i === activeSlide && <span className="absolute inset-y-0 left-0 slide-progress" style={{ background: '#5DB8F0', animationDuration: `${SLIDE_DURATION}ms`, width: '100%' }} />}
            </button>
          ))}
        </div>
      )}

      {/* Barre de progression */}
      {heroVisible && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          <div className="h-full transition-none" style={{ width: `${progress}%`, background: '#5DB8F0' }} />
        </div>
      )}

      {/* Scroll indicator */}
      {heroVisible && onScrollToNext && (
        <button onClick={onScrollToNext} className="absolute bottom-8 left-8 z-20 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity duration-200" style={{ color: 'rgba(255,255,255,.4)' }} aria-label="Défiler vers le bas">
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
