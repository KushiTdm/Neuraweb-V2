'use client';

import { useEffect, useRef, useState } from 'react';
import { RetroGrid } from '@/components/ui/retro-grid';

interface ServicesProcessProps {
  language?: 'fr' | 'en' | 'es';
  onScrollToPricing?: () => void;
}

const STEP_DATA = {
  fr: [
    {
      title: 'Audit & Analyse',
      description: 'Appel découverte gratuit de 30 minutes. Analyse de votre marché, concurrents et cibles. Cahier des charges détaillé et roadmap sur mesure.',
      icon: '🔍',
      colorHex: '#3b82f6',
      accentClass: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
      badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      dotClass: 'bg-blue-500',
      glowClass: 'shadow-blue-500/20',
    },
    {
      title: 'Design & UX',
      description: 'Wireframes interactifs validés avec vous. Design system sur Figma. Maquettes responsive testées sur utilisateurs réels.',
      icon: '🎨',
      colorHex: '#a855f7',
      accentClass: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
      badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      dotClass: 'bg-purple-500',
      glowClass: 'shadow-purple-500/20',
    },
    {
      title: 'Développement',
      description: 'Stack moderne : React, Next.js 15, TypeScript, Tailwind CSS. Sprints de 2 semaines avec démos. Code versionné sur GitHub.',
      icon: '⚡',
      colorHex: '#f97316',
      accentClass: 'from-orange-500/20 to-orange-600/5 border-orange-500/30',
      badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      dotClass: 'bg-orange-500',
      glowClass: 'shadow-orange-500/20',
    },
    {
      title: 'Tests & Optimisation',
      description: 'Tests automatisés et manuels. Score Lighthouse 90+ garanti. Optimisation Core Web Vitals et SEO technique.',
      icon: '✅',
      colorHex: '#10b981',
      accentClass: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      dotClass: 'bg-emerald-500',
      glowClass: 'shadow-emerald-500/20',
    },
    {
      title: 'Livraison & Support',
      description: 'Déploiement sur Vercel ou votre serveur. Formation équipe incluse. Support réactif 3 mois inclus dans tous les packs.',
      icon: '🚀',
      colorHex: '#eab308',
      accentClass: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30',
      badgeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      dotClass: 'bg-yellow-500',
      glowClass: 'shadow-yellow-500/20',
    },
  ],
  en: [
    {
      title: 'Audit & Analysis',
      description: 'Free 30-minute discovery call. Market, competitor and target analysis. Detailed specifications and tailored roadmap.',
      icon: '🔍',
      colorHex: '#3b82f6',
      accentClass: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
      badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      dotClass: 'bg-blue-500',
      glowClass: 'shadow-blue-500/20',
    },
    {
      title: 'Design & UX',
      description: 'Interactive wireframes validated with you. Figma design system. Responsive mockups tested with real users.',
      icon: '🎨',
      colorHex: '#a855f7',
      accentClass: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
      badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      dotClass: 'bg-purple-500',
      glowClass: 'shadow-purple-500/20',
    },
    {
      title: 'Development',
      description: 'Modern stack: React, Next.js 15, TypeScript, Tailwind CSS. 2-week sprints with demos. Code versioned on GitHub.',
      icon: '⚡',
      colorHex: '#f97316',
      accentClass: 'from-orange-500/20 to-orange-600/5 border-orange-500/30',
      badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      dotClass: 'bg-orange-500',
      glowClass: 'shadow-orange-500/20',
    },
    {
      title: 'Testing & Optimization',
      description: 'Automated and manual testing. Lighthouse score 90+ guaranteed. Core Web Vitals and technical SEO optimization.',
      icon: '✅',
      colorHex: '#10b981',
      accentClass: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      dotClass: 'bg-emerald-500',
      glowClass: 'shadow-emerald-500/20',
    },
    {
      title: 'Delivery & Support',
      description: 'Deployment on Vercel or your server. Team training included. Responsive 3-month support included in all packs.',
      icon: '🚀',
      colorHex: '#eab308',
      accentClass: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30',
      badgeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      dotClass: 'bg-yellow-500',
      glowClass: 'shadow-yellow-500/20',
    },
  ],
  es: [
    {
      title: 'Auditoría y Análisis',
      description: 'Llamada gratuita de 30 minutos. Análisis de mercado, competidores y público. Pliego de condiciones y roadmap personalizado.',
      icon: '🔍',
      colorHex: '#3b82f6',
      accentClass: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
      badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      dotClass: 'bg-blue-500',
      glowClass: 'shadow-blue-500/20',
    },
    {
      title: 'Diseño y UX',
      description: 'Wireframes interactivos validados contigo. Design system en Figma. Mockups responsive testeados con usuarios reales.',
      icon: '🎨',
      colorHex: '#a855f7',
      accentClass: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
      badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      dotClass: 'bg-purple-500',
      glowClass: 'shadow-purple-500/20',
    },
    {
      title: 'Desarrollo',
      description: 'Stack moderno: React, Next.js 15, TypeScript, Tailwind CSS. Sprints de 2 semanas con demos. Código versionado en GitHub.',
      icon: '⚡',
      colorHex: '#f97316',
      accentClass: 'from-orange-500/20 to-orange-600/5 border-orange-500/30',
      badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      dotClass: 'bg-orange-500',
      glowClass: 'shadow-orange-500/20',
    },
    {
      title: 'Pruebas y Optimización',
      description: 'Tests automatizados y manuales. Lighthouse 90+ garantizado. Optimización Core Web Vitals y SEO técnico.',
      icon: '✅',
      colorHex: '#10b981',
      accentClass: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      dotClass: 'bg-emerald-500',
      glowClass: 'shadow-emerald-500/20',
    },
    {
      title: 'Entrega y Soporte',
      description: 'Despliegue en Vercel o tu servidor. Formación del equipo incluida. Soporte reactivo 3 meses incluido en todos los paquetes.',
      icon: '🚀',
      colorHex: '#eab308',
      accentClass: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30',
      badgeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      dotClass: 'bg-yellow-500',
      glowClass: 'shadow-yellow-500/20',
    },
  ],
};

const TOTAL_STEPS = 5;

export function ServicesProcess({ language = 'fr', onScrollToPricing }: ServicesProcessProps) {
  const steps = STEP_DATA[language] ?? STEP_DATA.fr;

  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const activeStepRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const viewH = window.innerHeight;
      const scrollable = sectionH - viewH;
      const scrolled = -rect.top;
      targetProgressRef.current = scrollable > 0
        ? Math.max(0, Math.min(1, scrolled / scrollable))
        : 0;
    };

    const tick = () => {
      scrollProgressRef.current += (targetProgressRef.current - scrollProgressRef.current) * 0.08;
      const progress = scrollProgressRef.current;
      const newActive = Math.min(TOTAL_STEPS - 1, Math.max(0, Math.round(progress * (TOTAL_STEPS - 1))));
      if (newActive !== activeStepRef.current) {
        activeStepRef.current = newActive;
        setActiveStep(newActive);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mounted]);

  // SEO-friendly SSR fallback — full content rendered server-side
  if (!mounted) {
    return (
      <section className="relative bg-[#050510] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold text-white">
            {language === 'fr' ? 'Notre Processus' : language === 'es' ? 'Nuestro Proceso' : 'Our Process'}
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map((step, i) => (
            <div key={i} className={`rounded-2xl border bg-gradient-to-br p-6 ${step.accentClass}`}>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-3xl">{step.icon}</span>
                <div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${step.badgeClass}`}>
                    {language === 'fr' ? `Étape ${i + 1}` : language === 'es' ? `Paso ${i + 1}` : `Step ${i + 1}`}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{step.title}</h3>
                </div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#050510]"
      style={{ height: `${TOTAL_STEPS * 100 + 100}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* RetroGrid background */}
        <div className="absolute inset-0 bg-[#050510]">
          <RetroGrid
            angle={55}
            cellSize={50}
            opacity={0.35}
            lightLineColor="indigo"
            darkLineColor="indigo"
            className="absolute inset-0"
          />
          {/* Radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_30%,rgba(2,6,23,0.7)_70%,rgba(2,6,23,1)_100%)]" />
        </div>

        {/* Top overlay: title */}
        <div className="absolute top-0 left-0 right-0 z-10 pt-6 pb-6 md:pt-10 md:pb-8 px-4 text-center pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.6) 65%, transparent 100%)' }}
        >
          <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-5 py-1.5 md:py-2 mb-3 md:mb-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] md:text-xs font-semibold tracking-widest uppercase text-white/70">
              {language === 'fr' ? 'Méthode éprouvée' : language === 'es' ? 'Método probado' : 'Proven method'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
            {language === 'fr' ? 'Notre Processus' : language === 'es' ? 'Nuestro Proceso' : 'Our Process'}
          </h2>
          <p className="mt-2 text-sm md:text-lg text-white/40">
            {language === 'fr'
              ? 'Une méthode éprouvée pour votre succès'
              : language === 'es'
                ? 'Un método probado para tu éxito'
                : 'A proven method for your success'}
          </p>
        </div>

        {/* Center: step cards that appear one by one */}
        {/* FIX 1: pt réduit + pb augmenté pour remonter le centre de la card vers le titre */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none px-4 md:px-6 pt-32 pb-52 sm:pt-36 sm:pb-56 md:pt-44 md:pb-52">
          <div className="relative w-full max-w-2xl">
            {steps.map((step, i) => {
              const isActive = i === activeStep;
              const isPast = i < activeStep;

              return (
                <div
                  key={i}
                  className={`absolute inset-x-0 transition-all duration-700 ease-out`}
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? 'translateY(0px) scale(1)'
                      : isPast
                        ? 'translateY(-60px) scale(0.92)'
                        : 'translateY(60px) scale(0.95)',
                    zIndex: isActive ? 10 : 1,
                    pointerEvents: isActive ? 'auto' : 'none',
                  }}
                >
                  <div
                    className={`relative rounded-2xl border overflow-hidden shadow-2xl ${step.accentClass} ${step.glowClass}`}
                    style={{ boxShadow: isActive ? `0 0 60px 10px ${step.colorHex}18` : undefined }}
                  >
                    {/* FIX 2: backdrop-blur conditionnel à isActive pour éviter les silhouettes ghost */}
                    <div className={`absolute inset-0 bg-[#050510]/95 ${isActive ? 'backdrop-blur-md' : ''}`} />
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.accentClass}`} />

                    {/* Content above background */}
                    <div className="relative p-5 sm:p-6 md:p-8">
                      {/* Step header */}
                      <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
                        <div
                          className="w-11 h-11 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl flex-shrink-0"
                          style={{ backgroundColor: `${step.colorHex}22`, border: `1px solid ${step.colorHex}44` }}
                        >
                          {step.icon}
                        </div>
                        <div className="min-w-0">
                          <span className={`inline-block text-[10px] md:text-xs font-bold tracking-widest uppercase px-2 md:px-3 py-0.5 md:py-1 rounded-full border ${step.badgeClass}`}>
                            {language === 'fr' ? `Étape ${i + 1} / ${steps.length}` : language === 'es' ? `Paso ${i + 1} / ${steps.length}` : `Step ${i + 1} / ${steps.length}`}
                          </span>
                          <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-white mt-1.5 md:mt-2 leading-tight">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px mb-4 md:mb-5" style={{ background: `linear-gradient(to right, ${step.colorHex}55, transparent)` }} />

                      {/* Description */}
                      <p className="text-white/75 text-sm md:text-base lg:text-lg leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom overlay: progress + hint — FIX 3: pt réduit pour moins couvrir la card */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 pb-6 md:pb-10 pt-6 md:pt-8"
          style={{ background: 'linear-gradient(to top, rgb(2,6,23) 0%, rgba(2,6,23,0.95) 40%, rgba(2,6,23,0.7) 70%, transparent 100%)' }}
        >
          {/* Progress dots */}
          <div className="flex justify-center items-center gap-2 md:gap-3 mb-4 md:mb-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="transition-all duration-500 rounded-full"
                style={{
                  width: i === activeStep ? '24px' : '8px',
                  height: '8px',
                  backgroundColor: i === activeStep ? step.colorHex : 'rgba(255,255,255,0.2)',
                  boxShadow: i === activeStep ? `0 0 10px ${step.colorHex}` : 'none',
                }}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <div
              className="flex flex-col items-center gap-1 transition-opacity duration-500"
              style={{ opacity: activeStep >= steps.length - 1 ? 0 : 0.5 }}
            >
              <span className="text-[10px] md:text-xs text-white/40 tracking-widest uppercase">
                {language === 'fr' ? 'Scrollez pour explorer' : language === 'es' ? 'Desliza para explorar' : 'Scroll to explore'}
              </span>
              <div className="w-px h-5 md:h-6 bg-gradient-to-b from-white/35 to-transparent animate-pulse" />
            </div>

            {/* CTA at last step */}
            {onScrollToPricing && (
              <button
                onClick={onScrollToPricing}
                className="pointer-events-auto px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs md:text-sm rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30"
                style={{
                  opacity: activeStep >= steps.length - 1 ? 1 : 0,
                  transform: activeStep >= steps.length - 1 ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
              >
                <span className="flex items-center gap-2">
                  {language === 'fr' ? 'Voir nos packs' : language === 'es' ? 'Ver nuestros paquetes' : 'View our packages'}
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}