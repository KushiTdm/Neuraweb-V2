'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { LocalizedLink } from '@/components/localized-link';
import { useLanguage } from '@/contexts/language-context';

const T = {
  fr: {
    eyebrow: '● NOS RÉSULTATS',
    label1: 'Projets livrés avec succès',
    desc1: 'Applications web, mobiles et automatisations livrées dans les délais convenus.',
    label2: 'Clients satisfaits',
    desc2: 'Taux de satisfaction mesuré après chaque livraison — notre priorité absolue.',
    label3: 'ROI moyen client',
    desc3: 'Retour sur investissement constaté sur nos projets d\'automatisation et IA.',
    heading1: 'Des chiffres qui parlent',
    heading2: 'd\'eux-mêmes',
    sub: 'Depuis notre création, nous avons aidé des dizaines d\'entreprises à accélérer leur croissance grâce à des solutions web, IA et automatisation.',
    learn: 'À propos de NeuraWeb',
  },
  en: {
    eyebrow: '● OUR RESULTS',
    label1: 'Projects delivered',
    desc1: 'Web, mobile and automation projects delivered on time and within agreed deadlines.',
    label2: 'Satisfied clients',
    desc2: 'Satisfaction rate measured after each delivery — our absolute priority.',
    label3: 'Average client ROI',
    desc3: 'Return on investment observed on our automation and AI projects.',
    heading1: 'Numbers that speak',
    heading2: 'for themselves',
    sub: 'Since our creation, we have helped dozens of companies accelerate their growth.',
    learn: 'About NeuraWeb',
  },
  es: {
    eyebrow: '● NUESTROS RESULTADOS',
    label1: 'Proyectos entregados',
    desc1: 'Proyectos web, móviles y de automatización entregados a tiempo.',
    label2: 'Clientes satisfechos',
    desc2: 'Tasa de satisfacción medida después de cada entrega — nuestra prioridad absoluta.',
    label3: 'ROI promedio',
    desc3: 'Retorno de inversión observado en nuestros proyectos de automatización e IA.',
    heading1: 'Cifras que hablan',
    heading2: 'por sí solas',
    sub: 'Desde nuestra creación, hemos ayudado a docenas de empresas a acelerar su crecimiento.',
    learn: 'Sobre NeuraWeb',
  },
};

const STATS = [
  { value: 150, suffix: '+', key: 'label1', descKey: 'desc1', color: 'sky' as const },
  { value: 98,  suffix: '%', key: 'label2', descKey: 'desc2', color: 'cyan' as const },
  { value: 3.2, suffix: 'x', key: 'label3', descKey: 'desc3', color: 'sky' as const },
];

const STAT_COLORS = {
  sky:  { gradient: 'linear-gradient(90deg, #5DB8F0, #22D3EE)', icon: '#5DB8F0' },
  cyan: { gradient: 'linear-gradient(90deg, #22D3EE, #5DB8F0)', icon: '#22D3EE' },
};

function useCountUp(target: number, started: boolean, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const isDecimal = target % 1 !== 0;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      const current = isDecimal
        ? Math.round(target * ease * 10) / 10
        : Math.floor(target * ease);
      setCount(current);
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return count;
}

function StatCard({
  value,
  suffix,
  label,
  desc,
  color,
  started,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  desc: string;
  color: keyof typeof STAT_COLORS;
  started: boolean;
  index: number;
}) {
  const count = useCountUp(value, started);
  const isDecimal = value % 1 !== 0;
  const displayValue = isDecimal ? count.toFixed(1) : count;
  const colorConfig = STAT_COLORS[color];

  const numberStyle = {
    background: colorConfig.gradient,
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
    backgroundClip: 'text' as const,
  };

  return (
    <div
      className="rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1"
      style={{
        background: '#1E2A4A',
        borderColor: '#1E3A6B',
        opacity: 0,
        animation: started ? `fadeInUp 0.6s ${index * 0.15}s ease forwards` : 'none',
      }}
    >
      {/* Icône tendance */}
      <TrendingUp className="w-5 h-5 mb-4" style={{ color: colorConfig.icon }} />

      {/* Nombre */}
      <div
        className="font-display font-bold leading-none mb-3"
        style={{ fontSize: 'clamp(3.5rem, 7vw, 4.5rem)', ...numberStyle }}
        aria-label={`${value}${suffix} ${label}`}
      >
        {displayValue}{suffix}
      </div>

      {/* Label */}
      <p className="text-white font-semibold text-base mb-2">{label}</p>

      {/* Description */}
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.8)' }}>{desc}</p>
    </div>
  );
}

export function StatsSection() {
  const { language } = useLanguage();
  const t = T[(language as keyof typeof T)] ?? T.fr;
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32" style={{ background: '#070F26' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-[40fr_60fr] gap-16 items-start">

          {/* ── Colonne gauche — texte ────────────────────────── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-sky-400 mb-6">
              {t.eyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              <span className="text-white">{t.heading1} </span>
              <span
                style={{
                  background: 'linear-gradient(90deg, #5DB8F0, #22D3EE)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {t.heading2}
              </span>
            </h2>
            <p className="text-base leading-relaxed mb-10 max-w-md" style={{ color: 'rgba(148,163,184,0.8)' }}>
              {t.sub}
            </p>
            <LocalizedLink
              href="/equipe"
              className="inline-flex items-center gap-2 font-semibold text-white border border-white/20 rounded-full px-6 py-3 hover:bg-white/5 transition-colors duration-200 group"
            >
              {t.learn}
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-200">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </LocalizedLink>
          </div>

          {/* ── Colonne droite — 3 cartes ────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STATS.map((s, i) => (
              <StatCard
                key={s.key}
                value={s.value}
                suffix={s.suffix}
                label={t[s.key as keyof typeof t] as string}
                desc={t[s.descKey as keyof typeof t] as string}
                color={s.color}
                started={started}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

export default StatsSection;
