'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { PillButton } from '@/components/ui/pill-button';
import type { TranslationKey } from '@/locales';

interface Testimonial {
  nameKey: TranslationKey;
  companyKey: TranslationKey;
  textKey: TranslationKey;
  roleKey?: TranslationKey;
  rating: number;
  initials: string;
  color: string;
}

const TESTIMONIALS: Testimonial[] = [
  { nameKey: 'testimonials.maria.name',    companyKey: 'testimonials.maria.company',    textKey: 'testimonials.maria.text',    rating: 5, initials: 'MP', color: '#374151' },
  { nameKey: 'testimonials.sanji.name',    companyKey: 'testimonials.sanji.company',    textKey: 'testimonials.sanji.text',    rating: 5, initials: 'SS', color: '#1F2937' },
  { nameKey: 'testimonials.hermes.name',   companyKey: 'testimonials.hermes.company',   textKey: 'testimonials.hermes.text',   rating: 5, initials: 'HT', color: '#4B5563' },
  { nameKey: 'testimonials.ludwik.name',   companyKey: 'testimonials.ludwik.company',   textKey: 'testimonials.ludwik.text',   rating: 5, initials: 'LB', color: '#374151' },
  { nameKey: 'testimonials.christian.name',companyKey: 'testimonials.christian.company',textKey: 'testimonials.christian.text',rating: 5, initials: 'CB', color: '#1F2937' },
  { nameKey: 'testimonials.leila.name',    companyKey: 'testimonials.leila.company',    textKey: 'testimonials.leila.text',    rating: 5, initials: 'LM', color: '#4B5563' },
];

const SECTION_LABELS: Record<string, { chip: string; title: string; cta: string }> = {
  fr: { chip: 'Témoignages', title: 'Ce que nos clients disent de NeuraWeb', cta: 'Démarrer un projet' },
  en: { chip: 'Testimonials', title: 'What our clients say about NeuraWeb',  cta: 'Start a project'   },
  es: { chip: 'Testimonios',  title: 'Lo que nuestros clientes dicen de NeuraWeb', cta: 'Iniciar un proyecto' },
};

function TestimonialCard({ testimonial, visible }: { testimonial: Testimonial; visible: boolean }) {
  const { t } = useTranslation();

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200/60 p-7 flex flex-col gap-4 flex-shrink-0 w-[340px] sm:w-[380px] shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1.5"
    >
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-gray-200" strokeWidth={1.5} />

      {/* Stars */}
      <div className="flex gap-1" aria-label={`${testimonial.rating} étoiles`}>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      {/* Texte */}
      <p className="text-gray-700 text-sm leading-relaxed flex-1 line-clamp-4">
        &ldquo;{t(testimonial.textKey)}&rdquo;
      </p>

      {/* Auteur */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: testimonial.color }}
          aria-hidden="true"
        >
          {testimonial.initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{t(testimonial.nameKey)}</p>
          <p className="text-gray-400 text-xs">{t(testimonial.companyKey)}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const { language } = useTranslation();
  const labels = SECTION_LABELS[(language as string)] ?? SECTION_LABELS.fr;
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    trackRef.current?.scrollBy({ left: dir === 'right' ? 400 : -400, behavior: 'smooth' });
  };

  // Autoplay doux
  useEffect(() => {
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8;
      el.scrollBy({ left: atEnd ? -(el.scrollWidth) : 400, behavior: 'smooth' });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-20 lg:py-28 overflow-hidden" style={{ background: '#F7F7F5' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <span className="section-chip section-chip-light mb-4 inline-flex">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {labels.chip}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-xl">
              {labels.title}
            </h2>
          </div>
          <div className="flex-shrink-0">
            <PillButton href="/contact" variant="light">{labels.cta}</PillButton>
          </div>
        </div>
      </div>

      {/* ── Slider pleine largeur ── */}
      <div className="relative">
        {/* Navigation */}
        <div className="flex justify-end gap-3 max-w-7xl mx-auto px-6 lg:px-12 mb-6">
          <button
            onClick={() => scroll('left')}
            className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200"
            aria-label="Suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Masques dégradés */}
        <div className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to right, #F7F7F5, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to left, #F7F7F5, transparent)' }} />

        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto px-6 lg:px-12 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.nameKey} testimonial={t} visible />
          ))}
          <div className="flex-shrink-0 w-2" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
