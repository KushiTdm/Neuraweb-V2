'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/contexts/language-context';

// ── Translations ───────────────────────────────────────────────────────────
const translations = {
  fr: {
    title: 'Des résultats qui parlent',
    subtitle: 'Depuis notre création, nous avons aidé des dizaines d\'entreprises à accélérer leur croissance grâce à l\'IA et l\'automatisation.',
    projects: 'Produits livrés',
    satisfaction: 'Clients satisfaits',
    roi: 'ROI moyen clients',
    delay: 'Délai MVP moyen',
    trustGoogle: '4.9/5 sur Google',
    trustDelivered: '100% Projets livrés',
    trustResponse: 'Réponse sous 24h',
  },
  en: {
    title: 'Results that speak for themselves',
    subtitle: 'Since our creation, we have helped dozens of companies accelerate their growth thanks to AI and automation.',
    projects: 'Products delivered',
    satisfaction: 'Satisfied clients',
    roi: 'Average client ROI',
    delay: 'Average MVP timeline',
    trustGoogle: '4.9/5 on Google',
    trustDelivered: '100% Projects delivered',
    trustResponse: 'Response within 24h',
  },
  es: {
    title: 'Resultados que hablan por sí mismos',
    subtitle: 'Desde nuestra creación, hemos ayudado a docenas de empresas a acelerar su crecimiento gracias a la IA y la automatización.',
    projects: 'Productos entregados',
    satisfaction: 'Clientes satisfechos',
    roi: 'ROI promedio clientes',
    delay: 'Plazo MVP promedio',
    trustGoogle: '4.9/5 en Google',
    trustDelivered: '100% Proyectos entregados',
    trustResponse: 'Respuesta en 24h',
  },
};

// ── Stat Data ───────────────────────────────────────────────────────────────
const getStats = (t: typeof translations.fr) => [
  { value: 150, suffix: '+', label: t.projects, icon: '🚀' },
  { value: 98, suffix: '%', label: t.satisfaction, icon: '⭐' },
  { value: 3.2, suffix: 'x', label: t.roi, icon: '📈' },
  { value: 72, suffix: 'h', label: t.delay, icon: '⚡' },
];

// ── Animated Counter Hook ───────────────────────────────────────────────────
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = Date.now();
    const isDecimal = end % 1 !== 0;

    const animate = () => {
      const currentTime = Date.now();
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = easeOut * end;
      
      setCount(isDecimal ? parseFloat(currentCount.toFixed(1)) : Math.floor(currentCount));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [hasStarted, end, duration]);

  return { count, ref };
}

// ── Individual Stat Component ───────────────────────────────────────────────
function StatItem({ stat, index }: { stat: ReturnType<typeof getStats>[0]; index: number }) {
  const { count, ref } = useCountUp(stat.value, 2000 + index * 200);
  const isDecimal = stat.value % 1 !== 0;

  return (
    <div 
      ref={ref}
      className="text-center group"
      style={{
        opacity: 0,
        animation: 'fadeInUp 0.6s ease forwards',
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="relative">
        {/* Icon background glow */}
        <div 
          className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, var(--color-primary, #6366f1) 0%, transparent 70%)`,
          }}
        />
        
        {/* Icon */}
        <span 
          className="text-3xl mb-3 block"
          role="img"
          aria-hidden="true"
        >
          {stat.icon}
        </span>
        
        {/* Counter */}
        <div className="relative">
          <span 
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
            aria-label={`${count}${stat.suffix} ${stat.label}`}
          >
            {isDecimal ? count.toFixed(1) : count}
            <span className="text-2xl sm:text-3xl">{stat.suffix}</span>
          </span>
        </div>
        
        {/* Label */}
        <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500 mt-2 font-medium">
          {stat.label}
        </p>
      </div>
    </div>
  );
}

// ── Stats Section Component ─────────────────────────────────────────────────
export function StatsSection() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.fr;
  const stats = getStats(t);

  return (
    <section 
      className="py-16 sm:py-20 px-4 relative overflow-hidden"
      aria-label="Chiffres clés NeuraWeb"
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Stats grid */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12"
          role="list"
          aria-label="Statistiques NeuraWeb"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} role="listitem">
              <StatItem stat={stat} index={index} />
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 items-center opacity-60">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span>{t.trustGoogle}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>{t.trustDelivered}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t.trustResponse}</span>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export default StatsSection;