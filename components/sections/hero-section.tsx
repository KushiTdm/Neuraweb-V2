'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/hooks/use-translation';

const HeroThreeBackground = dynamic(
  () => import('@/components/hero-three-background').then((mod) => ({ default: mod.HeroThreeBackground })),
  { ssr: false }
);

interface HeroSectionProps {
  mousePosition: { x: number; y: number };
  onScrollToNext?: () => void;
}

export function HeroSection({ mousePosition, onScrollToNext }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleVideoEnd = () => {
      setTimeout(() => setHeroVisible(true), 200);
    };
    window.addEventListener('hero:reveal', handleVideoEnd);
    return () => window.removeEventListener('hero:reveal', handleVideoEnd);
  }, []);

  const handleStartProject = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onScrollToNext) onScrollToNext();
  };

  return (
    <section
      className="section-snap relative overflow-hidden"
      style={{ background: '#050510' }}
    >
      {mounted && <HeroThreeBackground />}

      {/* Masque opaque disparaît après vidéo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#050510',
          zIndex: 50,
          opacity: heroVisible ? 0 : 1,
          transition: heroVisible ? 'opacity 0.6s ease' : 'none',
          pointerEvents: heroVisible ? 'none' : 'auto',
        }}
      />

      {/*
        FIX LAYOUT THRASHING :
        Les 20 divs `.particle` animées en JS causent des "forced layout reflows"
        car chaque modification de style invalide le layout.
        
        Remplacement par un seul élément <canvas> via CSS animations pures
        ou suppression totale — le HeroThreeBackground gère déjà les particules.
        
        AVANT : 20 × <div class="particle"> = 20 éléments DOM animés par JS
        APRÈS : supprimé — les particules sont dans le canvas Three.js/2D
      */}

      {/* Contenu principal */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 py-8 sm:py-12">
        <div
          className="transform transition-transform duration-300"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-cyan-500/30 mb-8"
            style={{
              background: 'rgba(6, 182, 212, 0.08)',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-medium text-cyan-300">
              NeuraWeb — Web &amp; AI
            </span>
          </div>

          {/* Titre principal — LCP element */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 px-2 sm:px-0"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.9s ease, transform 0.9s ease',
              transitionDelay: '0.15s',
              textShadow: '0 0 40px rgba(139, 92, 246, 0.4)',
            }}
          >
            {t('hero.main.title')}{' '}
            <span className="gradient-text">
              {t('hero.title.highlight')}
            </span>{' '}
            {t('hero.title.end')}
          </h1>

          {/* Sous-titre */}
          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 sm:px-0"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.9s ease, transform 0.9s ease',
              transitionDelay: '0.35s',
            }}
          >
            {t('hero.subtitle')}
          </p>

          {/* Boutons CTA */}
          <div
            className="flex flex-col xs:flex-row sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(25px)',
              transition: 'opacity 0.9s ease, transform 0.9s ease',
              transitionDelay: '0.55s',
            }}
          >
            <button
              onClick={handleStartProject}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center group text-sm sm:text-base"
              aria-label={t('hero.cta.start')}
            >
              <span>{t('hero.cta.start')}</span>
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              href="/services"
              className="border-2 border-purple-400 text-purple-300 font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300 inline-flex items-center justify-center text-sm sm:text-base"
            >
              {t('hero.cta.services')}
            </Link>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        style={{
          opacity: heroVisible ? 1 : 0,
          transition: 'opacity 0.9s ease',
          transitionDelay: '1s',
        }}
      >
        <button
          onClick={handleStartProject}
          className="text-gray-400 hover:text-gray-300 transition-colors"
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
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
}