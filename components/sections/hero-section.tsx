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

  // Écoute l'événement custom émis par la vidéo quand elle se termine
  useEffect(() => {
    const handleVideoEnd = () => {
      // Petit délai pour laisser le fade-out de la vidéo se terminer
      setTimeout(() => setHeroVisible(true), 200);
    };

    window.addEventListener('hero:reveal', handleVideoEnd);
    return () => window.removeEventListener('hero:reveal', handleVideoEnd);
  }, []);

  const handleStartProject = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onScrollToNext) {
      onScrollToNext();
    }
  };

  return (
    <section
      className="section-snap relative overflow-hidden"
      style={{
        background: '#050510',
      }}
    >
      {/* Animation Three.js 3D neuronale — toujours montée pour que l'animation tourne */}
      {mounted && <HeroThreeBackground />}

      {/* Masque opaque qui disparaît quand la vidéo se termine */}
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

      {/* Particules d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 5.3 + 7) % 100}%`,
              animationDelay: `${(i * 0.37) % 3}s`,
              animationDuration: `${3 + (i * 0.23) % 2}s`
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
          {/* Badge animé */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border border-cyan-500/30 mb-8"
            style={{
              background: 'rgba(6, 182, 212, 0.08)',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
              transitionDelay: '0s',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-medium text-cyan-300">
              NeuraWeb — Web &amp; AI
            </span>
          </div>

          {/* Titre principal */}
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6"
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
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
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
            className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(25px)',
              transition: 'opacity 0.9s ease, transform 0.9s ease',
              transitionDelay: '0.55s',
            }}
          >
            <button
              onClick={handleStartProject}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center group"
              aria-label={t('hero.cta.start')}
            >
              <span>{t('hero.cta.start')}</span>
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </button>

            <Link
              href="/services"
              className="border-2 border-purple-400 text-purple-300 font-semibold px-8 py-4 rounded-full hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300 inline-flex items-center justify-center"
            >
              {t('hero.cta.services')}
            </Link>
          </div>

          {/* Stats rapides */}
          <div
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.9s ease, transform 0.9s ease',
              transitionDelay: '0.75s',
            }}
          >
            {[
              { value: '50+', label: 'Projets' },
              { value: '100%', label: 'Satisfaction' },
              { value: '24/7', label: 'Support' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
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
          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
