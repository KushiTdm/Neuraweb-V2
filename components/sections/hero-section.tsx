'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
  
  // Traductions (à remplacer par ton système de traduction)
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
    <section className="section-snap relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 overflow-hidden">
      {/* Particules d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-on-scroll fade-up">
            {t('hero.main.title')}{' '}
            <span className="gradient-text">
              {t('hero.title.highlight')}
            </span>{' '}
            {t('hero.title.end')}
          </h1>

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-on-scroll fade-up delay-200">
            {t('hero.subtitle')}
          </p>

          {/* Boutons CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-on-scroll fade-up delay-400">
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
              className="border-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 font-semibold px-8 py-4 rounded-full hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:border-purple-500 transition-all duration-300 inline-flex items-center justify-center"
            >
              {t('hero.cta.services')}
            </Link>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll (optionnel) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
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