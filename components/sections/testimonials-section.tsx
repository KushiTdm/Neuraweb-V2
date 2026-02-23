'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import type { TranslationKey } from '@/locales';

interface Testimonial {
  nameKey: TranslationKey;
  companyKey: TranslationKey;
  textKey: TranslationKey;
  rating: number;
  initials: string;
  roleKey?: TranslationKey;
}

export function TestimonialsSection() {
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const { t } = useTranslation();

  const testimonials: Testimonial[] = [
    {
      nameKey: 'testimonials.lucas.name',
      companyKey: 'testimonials.lucas.company',
      textKey: 'testimonials.lucas.text',
      rating: 5,
      initials: 'LB',
    },
    {
      nameKey: 'testimonials.amelie.name',
      companyKey: 'testimonials.amelie.company',
      textKey: 'testimonials.amelie.text',
      rating: 5,
      initials: 'AC',
    },
    {
      nameKey: 'testimonials.thomas.name',
      companyKey: 'testimonials.thomas.company',
      textKey: 'testimonials.thomas.text',
      rating: 5,
      initials: 'TM',
    },
    {
      nameKey: 'testimonials.emma.name',
      companyKey: 'testimonials.emma.company',
      textKey: 'testimonials.emma.text',
      rating: 5,
      initials: 'ED',
    },
    {
      nameKey: 'testimonials.hugo.name',
      companyKey: 'testimonials.hugo.company',
      textKey: 'testimonials.hugo.text',
      rating: 5,
      initials: 'HL',
    },
    {
      nameKey: 'testimonials.lea.name',
      companyKey: 'testimonials.lea.company',
      textKey: 'testimonials.lea.text',
      rating: 5,
      initials: 'LM',
    },
  ];

  const goTo = useCallback((index: number, dir: 'next' | 'prev') => {
    if (animating) return;
    setAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 350);
  }, [animating]);

  const next = useCallback(() => {
    goTo((current + 1) % testimonials.length, 'next');
  }, [current, testimonials.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + testimonials.length) % testimonials.length, 'prev');
  }, [current, testimonials.length, goTo]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [mounted, next]);

  const testimonial = testimonials[current]!;

  if (!mounted) {
    return (
      <section className="section-snap bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-2xl text-gray-400">Chargement...</div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden relative min-h-screen sm:min-h-0 py-12 sm:py-16 md:py-20">

      {/* Décoration fond */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 sm:w-96 h-64 sm:h-96 rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />
        <div className="absolute -bottom-32 -right-32 w-64 sm:w-96 h-64 sm:h-96 rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {t('testimonials.title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Card principale */}
        <div className="relative">
          {/* Guillemet décoratif */}
          <div className="absolute -top-4 -left-2 sm:-top-6 sm:-left-4 z-10">
            <Quote className="w-10 h-10 sm:w-14 sm:h-14 text-purple-200 dark:text-purple-800/60" strokeWidth={1} />
          </div>

          {/* Carte testimonial avec animation slide */}
          <div
            className="relative bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50 p-6 sm:p-8 md:p-10 overflow-hidden"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${direction === 'next' ? '-40px' : '40px'})`
                : 'translateX(0)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            {/* Gradient accent en haut */}
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)' }} />

            {/* Étoiles */}
            <div className="flex items-center gap-1 mb-4 sm:mb-6" role="img" aria-label={`${testimonial.rating} étoiles`}>
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400"
                  aria-hidden="true"
                />
              ))}
              <span className="ml-2 text-xs font-semibold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                {testimonial.rating}.0
              </span>
            </div>

            {/* Texte */}
            <blockquote className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed mb-6 sm:mb-8 italic">
              &ldquo;{t(testimonial.textKey)}&rdquo;
            </blockquote>

            {/* Auteur */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full ring-2 ring-purple-200 dark:ring-purple-700 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base">
                      {testimonial.initials}
                    </span>
                  </div>
                  {/* Badge vérifié */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                    {t(testimonial.nameKey)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {t(testimonial.companyKey)}
                  </div>
                </div>
              </div>

              {/* Compteur discret - centré sur mobile */}
              <div className="sm:ml-auto text-center sm:text-right text-xs font-mono text-gray-300 dark:text-gray-600 select-none">
                {String(current + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Flèches uniquement */}
        <div className="flex items-center justify-center gap-8 mt-8 sm:mt-10">
          {/* Bouton précédent */}
          <button
            onClick={prev}
            disabled={animating}
            className="group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center disabled:opacity-40 shadow-lg hover:shadow-xl hover:scale-105"
            aria-label={t('portfolio.nav.previous')}
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Indicateur de position */}
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {current + 1} / {testimonials.length}
          </div>

          {/* Bouton suivant */}
          <button
            onClick={next}
            disabled={animating}
            className="group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center disabled:opacity-40 shadow-lg hover:shadow-xl hover:scale-105"
            aria-label={t('portfolio.nav.next')}
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
