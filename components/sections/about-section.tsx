'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  Zap,
  Shield,
  Users,
  Award,
  TrendingUp,
  Clock,
  Star,
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { AboutThreeCanvas } from './about-three-canvas';

// ── Hook : compteur animé ──────────────────────────────────────
function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing : ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [start, target, duration]);

  return count;
}

// ── Données des statistiques ───────────────────────────────────
// Les valeurs numériques sont séparées du suffixe pour l'animation
const STATS_DATA = [
  {
    numericValue: 100,
    suffix: '%',
    labelKey: 'about.stat.satisfaction' as const,
    icon: Award,
    gradient: 'from-blue-500 to-indigo-600',
    glow: '#3b82f6',
    duration: 1800,
  },
  {
    numericValue: null, // valeur non numérique
    display: '24/7',
    labelKey: 'about.stat.support' as const,
    icon: Clock,
    gradient: 'from-purple-500 to-pink-600',
    glow: '#a855f7',
    duration: 0,
  },
  {
    numericValue: 120,
    suffix: '+',
    labelKey: 'about.stat.projects' as const,
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-teal-600',
    glow: '#10b981',
    duration: 2000,
  },
  {
    numericValue: 3,
    suffix: '×',
    labelKey: 'about.stat.growth' as const,
    icon: Zap,
    gradient: 'from-orange-500 to-amber-500',
    glow: '#f59e0b',
    duration: 1400,
  },
] as const;

// ── Valeurs de l'agence ────────────────────────────────────────
const VALUES_DATA = [
  {
    icon: Zap,
    labelKey: 'about.values.performance.label' as const,
    descKey: 'about.values.performance.desc' as const,
    color: '#f59e0b',
  },
  {
    icon: Shield,
    labelKey: 'about.values.reliability.label' as const,
    descKey: 'about.values.reliability.desc' as const,
    color: '#10b981',
  },
  {
    icon: Users,
    labelKey: 'about.values.collaboration.label' as const,
    descKey: 'about.values.collaboration.desc' as const,
    color: '#3b82f6',
  },
  {
    icon: Star,
    labelKey: 'about.values.excellence.label' as const,
    descKey: 'about.values.excellence.desc' as const,
    color: '#a855f7',
  },
] as const;

const COMMITMENT_KEYS = [
  'about.commitments.1',
  'about.commitments.2',
  'about.commitments.3',
  'about.commitments.4',
  'about.commitments.5',
  'about.commitments.6',
] as const;

// ── Composant carte statistique avec compteur ──────────────────
function StatCard({
  stat,
  isVisible,
  delay,
}: {
  stat: (typeof STATS_DATA)[number];
  isVisible: boolean;
  delay: number;
}) {
  const { t } = useTranslation();
  const IconComponent = stat.icon;

  // Compteur animé uniquement pour les valeurs numériques
  const count = useCountUp(
    stat.numericValue ?? 0,
    stat.duration ?? 0,
    isVisible && stat.numericValue !== null
  );

  const displayValue =
    stat.numericValue !== null
      ? `${count}${'suffix' in stat ? stat.suffix : ''}`
      : ('display' in stat ? stat.display : '');

  return (
    <div
      className="relative group"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
        transition: `all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
      }}
    >
      {/* Glow au hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ background: `${stat.glow}25` }}
      />

      <div className="relative p-6 rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:border-transparent hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
        {/* Icône */}
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg`}
        >
          <IconComponent className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>

        {/* Valeur animée */}
        <div
          className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1 tabular-nums`}
        >
          {displayValue}
        </div>

        {/* Label traduit */}
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {t(stat.labelKey)}
        </div>
      </div>
    </div>
  );
}

// ── Section principale ─────────────────────────────────────────
export function AboutSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          entry.target.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
            setTimeout(() => el.classList.add('animate-in'), i * 100);
          });
        }
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative section-snap bg-white dark:bg-gray-900 py-24 overflow-hidden"
    >
      {/* Canvas Three.js en arrière-plan */}
      <AboutThreeCanvas />

      {/* Dégradés décoratifs */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
          transform: 'translate(-30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
          transform: 'translate(30%, 30%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── En-tête ────────────────────────────────────────── */}
        <div className="text-center mb-12 md:mb-20 animate-on-scroll fade-up">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            {t('about.badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
            {t('about.title').split('NeuraWeb')[0]}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              NeuraWeb
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            {t('about.description')}
          </p>
        </div>

        {/* ── Statistiques avec compteurs animés ─────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {STATS_DATA.map((stat, i) => (
            <StatCard key={stat.labelKey} stat={stat} isVisible={isVisible} delay={i * 130} />
          ))}
        </div>

        {/* ── Layout principal : image + contenu ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* Colonne gauche : image + badges flottants */}
          <div className="animate-on-scroll fade-left">
            <div className="relative">
              {/* Halo gradient derrière l'image */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-30"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #a855f7, #ec4899)',
                  filter: 'blur(20px)',
                }}
              />

              {/* Image principale */}
              <div className="relative rounded-3xl shadow-2xl overflow-hidden aspect-[7/5] border border-white/20">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&h=500&fit=crop"
                  alt={t('about.image.alt')}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
                  className="object-cover"
                  quality={80}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-transparent" />
              </div>

              {/* Badge flottant – haut gauche (masqué sur très petit mobile) */}
              <div className="hidden xs:block absolute -top-4 sm:-top-5 -left-2 sm:-left-5 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 border border-gray-100 dark:border-gray-700 animate-on-scroll scale-up delay-300 z-10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {t('about.badge.certified')}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                      {t('about.badge.topRated')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge flottant – bas droite (masqué sur très petit mobile) */}
              <div className="hidden xs:block absolute -bottom-4 sm:-bottom-5 -right-2 sm:-right-5 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 border border-gray-100 dark:border-gray-700 animate-on-scroll scale-up delay-400 z-10">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {t('about.badge.growth')}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                      {t('about.badge.growthValue')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Décoration circulaire */}
              <div
                className="absolute -top-8 -right-8 w-24 h-24 rounded-full -z-10 opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #ec4899, #f97316)',
                  filter: 'blur(2px)',
                }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Colonne droite : valeurs + engagements */}
          <div className="animate-on-scroll fade-right space-y-8">

            {/* Valeurs fondamentales */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
                {t('about.values.title')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {VALUES_DATA.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.labelKey}
                      className="group flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 hover:border-transparent hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: `${v.color}20`,
                          border: `1px solid ${v.color}40`,
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: v.color }} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {t(v.labelKey)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {t(v.descKey)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Engagements */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">
                {t('about.commitments.title')}
              </h3>
              <div className="space-y-3">
                {COMMITMENT_KEYS.map((key, i) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 group"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                      transition: `all 0.5s ease ${350 + i * 90}ms`,
                    }}
                  >
                    <CheckCircle2
                      className="flex-shrink-0 w-5 h-5 text-indigo-500 group-hover:text-indigo-600 transition-colors"
                      strokeWidth={2}
                    />
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                      {t(key)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
