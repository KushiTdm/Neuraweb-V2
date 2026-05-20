'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { LocalizedLink } from '@/components/localized-link';
import { useLanguage } from '@/contexts/language-context';

const T = {
  fr: {
    label1: 'Projets livrés avec succès',
    desc1: 'Applications web, mobiles et automatisations livrées à temps, dans les délais convenus.',
    label2: 'Clients satisfaits',
    desc2: 'Taux de satisfaction mesuré après chaque livraison — notre priorité absolue.',
    label3: 'ROI moyen client',
    desc3: 'Retour sur investissement constaté sur nos projets d\'automatisation et IA.',
    heading1: 'Des chiffres qui',
    heading2: 'parlent d\'eux-mêmes',
    sub: 'Depuis notre création, nous avons aidé des dizaines d\'entreprises à accélérer leur croissance grâce à des solutions web, IA et automatisation.',
    learn: 'À propos de NeuraWeb',
    imgAlt: 'Équipe NeuraWeb au travail',
  },
  en: {
    label1: 'Projects delivered',
    desc1: 'Web, mobile and automation projects delivered on time and within agreed deadlines.',
    label2: 'Satisfied clients',
    desc2: 'Satisfaction rate measured after each delivery — our absolute priority.',
    label3: 'Average client ROI',
    desc3: 'Return on investment observed on our automation and AI projects.',
    heading1: 'Numbers that',
    heading2: 'speak for themselves',
    sub: 'Since our creation, we have helped dozens of companies accelerate their growth through web, AI and automation solutions.',
    learn: 'About NeuraWeb',
    imgAlt: 'NeuraWeb team at work',
  },
  es: {
    label1: 'Proyectos entregados',
    desc1: 'Proyectos web, móviles y de automatización entregados a tiempo.',
    label2: 'Clientes satisfechos',
    desc2: 'Tasa de satisfacción medida después de cada entrega — nuestra prioridad absoluta.',
    label3: 'ROI promedio cliente',
    desc3: 'Retorno de inversión observado en nuestros proyectos de automatización e IA.',
    heading1: 'Cifras que',
    heading2: 'hablan por sí solas',
    sub: 'Desde nuestra creación, hemos ayudado a docenas de empresas a acelerar su crecimiento.',
    learn: 'Sobre NeuraWeb',
    imgAlt: 'Equipo NeuraWeb trabajando',
  },
};

const STATS = [
  { value: 150, suffix: '+', key: 'label1', descKey: 'desc1' },
  { value: 98,  suffix: '%', key: 'label2', descKey: 'desc2' },
  { value: 3.2, suffix: 'x', key: 'label3', descKey: 'desc3' },
];

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
  started,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  desc: string;
  started: boolean;
  index: number;
}) {
  const count = useCountUp(value, started);
  const isDecimal = value % 1 !== 0;
  const displayValue = isDecimal ? count.toFixed(1) : count;

  return (
    <div
      className="bg-[#F2F2F0] rounded-2xl p-8 transition-all duration-300 hover:shadow-lg"
      style={{
        opacity: 0,
        animation: started ? `fadeInUp 0.6s ${index * 0.15}s ease forwards` : 'none',
      }}
    >
      {/* Nombre métallique */}
      <div className="metallic-text font-display font-bold leading-none mb-3"
        style={{ fontSize: 'clamp(4rem, 8vw, 5.5rem)' }}
        aria-label={`${value}${suffix} ${label}`}
      >
        {displayValue}{suffix}
      </div>

      {/* Label */}
      <p className="text-gray-900 font-semibold text-base mb-2">{label}</p>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
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
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28" style={{ background: '#F7F7F5' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-lg">
            {t.heading1}{' '}
            <span className="text-gray-400">{t.heading2}</span>
          </h2>

          <LocalizedLink
            href="/equipe"
            className="inline-flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-200 group flex-shrink-0"
          >
            {t.learn}
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white group-hover:scale-110 transition-transform duration-200">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </LocalizedLink>
        </div>

        {/* ── Sous-titre ── */}
        <p className="text-gray-500 text-base leading-relaxed max-w-xl mb-14">{t.sub}</p>

        {/* ── Cartes stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {STATS.map((s, i) => (
            <StatCard
              key={s.key}
              value={s.value}
              suffix={s.suffix}
              label={t[s.key as keyof typeof t] as string}
              desc={t[s.descKey as keyof typeof t] as string}
              started={started}
              index={i}
            />
          ))}
        </div>

        {/* ── Photo d'équipe ── */}
        <div className="relative rounded-3xl overflow-hidden" style={{ height: 'clamp(280px, 40vw, 500px)' }}>
          <Image
            src="/assets/equipe.webp"
            alt={t.imgAlt}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
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
