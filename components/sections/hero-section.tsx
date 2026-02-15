'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

// Import dynamique pour éviter les erreurs SSR avec Three.js
const ThreeBackground = dynamic(
  () => import('@/components/three-background').then((mod) => ({ default: mod.ThreeBackground })),
  { ssr: false }
);

interface HeroSectionProps {
  mousePosition: { x: number; y: number };
  onScrollToNext?: () => void;
  language?: 'fr' | 'en';
}

export function HeroSection({ 
  mousePosition, 
  onScrollToNext,
  language = 'fr' 
}: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Traductions
  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      fr: {
        'hero.main.title': 'Transformez vos idées en',
        'hero.title.highlight': 'solutions digitales',
        'hero.title.end': 'innovantes',
        'hero.subtitle': 'Développement web sur mesure, intégration IA et automatisation pour propulser votre entreprise vers le futur',
        'hero.cta.start': 'Démarrer un projet',
        'hero.cta.services': 'Nos services',
      },
      en: {
        'hero.main.title': 'Transform your ideas into',
        'hero.title.highlight': 'digital solutions',
        'hero.title.end': 'innovative',
        'hero.subtitle': 'Custom web development, AI integration and automation to propel your business into the future',
        'hero.cta.start': 'Start a project',
        'hero.cta.services': 'Our services',
      },
    };
    return translations[language][key] || key;
  };

  const handleStartProject = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onScrollToNext) {
      onScrollToNext();
    }
  };

  return (
    <section className="section-snap relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden min-h-screen flex items-center justify-center">
      {/* Animation Three.js 3D - Fond spatial avec voyage spatial */}
      {mounted && <ThreeBackground />}

      {/* Overlay gradient pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/60 pointer-events-none z-[1]" />

      {/* Particules d'arrière-plan supplémentaires */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 py-20">
        <div 
          className="transform transition-transform duration-300"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        >
          {/* Titre principal */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-on-scroll fade-up drop-shadow-2xl">
            {t('hero.main.title')}{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
              {t('hero.title.highlight')}
            </span>{' '}
            {t('hero.title.end')}
          </h1>

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto animate-on-scroll fade-up delay-200 drop-shadow-lg">
            {t('hero.subtitle')}
          </p>

          {/* Boutons CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll fade-up delay-400">
            <button
              onClick={handleStartProject}
              className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-full hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center group relative overflow-hidden"
              aria-label={t('hero.cta.start')}
            >
              {/* Effet de brillance au hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span className="relative z-10">{t('hero.cta.start')}</span>
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform relative z-10" />
            </button>
            
            <Link 
              href="/services" 
              className="border-2 border-cyan-400 text-cyan-300 hover:text-white font-semibold px-8 py-4 rounded-full hover:bg-cyan-500/20 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm"
            >
              {t('hero.cta.services')}
            </Link>
          </div>

          {/* Badges de confiance */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-300 animate-on-scroll fade-up delay-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>100% Satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span>Support 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <span>Technologies Modernes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll animé */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <button
          onClick={handleStartProject}
          className="text-cyan-400 hover:text-cyan-300 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full p-2"
          aria-label="Scroll to next section"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </button>
      </div>
    </section>
  );
}