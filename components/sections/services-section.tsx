'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Code, Bot, Brain, Smartphone, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { PillButton } from '@/components/ui/pill-button';
import { LocalizedLink } from '@/components/localized-link';

interface Service {
  titleKey: string;
  descKey: string;
  image: string;
  icon: React.ElementType;
  link: string;
}

const SERVICES: Service[] = [
  {
    titleKey: 'services.web.title',
    descKey: 'services.web.desc',
    image: '/assets/services/web_dev.webp',
    icon: Code,
    link: '/services',
  },
  {
    titleKey: 'services.mobile.title',
    descKey: 'services.mobile.desc',
    image: '/assets/services/web_dev.jpeg',
    icon: Smartphone,
    link: '/mobile-app-development',
  },
  {
    titleKey: 'services.automation.title',
    descKey: 'services.automation.desc',
    image: '/assets/services/automation.webp',
    icon: Bot,
    link: '/automatisation',
  },
  {
    titleKey: 'services.ai.title',
    descKey: 'services.ai.desc',
    image: '/assets/services/ia_integration.webp',
    icon: Brain,
    link: '/integration-ia',
  },
];

const SECTION_LABELS: Record<string, { chip: string; title: string; cta: string; readMore: string }> = {
  fr: { chip: 'Nos Services', title: 'Des solutions digitales pour maximiser votre potentiel', cta: 'Voir tous nos services', readMore: 'En savoir plus' },
  en: { chip: 'Our Services', title: 'Digital solutions to maximize your business potential',   cta: 'View all services',      readMore: 'Read more'       },
  es: { chip: 'Nuestros Servicios', title: 'Soluciones digitales para maximizar tu potencial',  cta: 'Ver todos los servicios', readMore: 'Leer más'       },
};

function ServiceCard({ service, readMore }: { service: Service; readMore: string }) {
  const { t } = useTranslation();
  const Icon = service.icon;

  return (
    <div className="service-card-v2 bg-white rounded-2xl overflow-visible flex-shrink-0 w-[320px] sm:w-[360px]">
      {/* Image + cercle icône */}
      <div className="relative">
        <div className="relative h-52 rounded-t-2xl overflow-hidden">
          <Image
            src={service.image}
            alt={t(service.titleKey as Parameters<typeof t>[0])}
            fill
            sizes="360px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
        </div>

        {/* Cercle icône flottant (chevauche image et contenu) */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-10"
          style={{ background: '#0B1220' }}>
          <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
        </div>
      </div>

      {/* Contenu texte */}
      <div className="px-6 pt-10 pb-7">
        <h3 className="font-display font-bold text-gray-900 text-lg text-center mb-2">
          {t(service.titleKey as Parameters<typeof t>[0])}
        </h3>

        {/* Séparateur */}
        <div className="card-separator mx-auto" />

        <p className="text-gray-500 text-sm leading-relaxed text-center mb-5">
          {t(service.descKey as Parameters<typeof t>[0])}
        </p>

        {/* Read more */}
        <div className="flex justify-center">
          <LocalizedLink
            href={service.link}
            className="read-more-link group"
          >
            <span>{readMore}</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </LocalizedLink>
        </div>
      </div>
    </div>
  );
}

export function ServicesSection() {
  const { language, t } = useTranslation();
  const labels = SECTION_LABELS[(language as string)] ?? SECTION_LABELS.fr;

  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 380 : -380, behavior: 'smooth' });
  };

  // Auto-play scroll
  useEffect(() => {
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8;
      el.scrollBy({ left: atEnd ? -(el.scrollWidth) : 380, behavior: 'smooth' });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-20 lg:py-28 overflow-hidden" style={{ background: '#0B1220' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <span className="section-chip section-chip-dark mb-4 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              {labels.chip}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-xl">
              {labels.title}
            </h2>
          </div>
          <div className="flex-shrink-0">
            <PillButton href="/services" variant="dark">{labels.cta}</PillButton>
          </div>
        </div>

        {/* ── Slider ── */}
        <div className="relative group">
          {/* Piste de cartes */}
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto pb-6 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.titleKey}
                service={service}
                readMore={labels.readMore}
              />
            ))}
            {/* Padding ghost à droite */}
            <div className="flex-shrink-0 w-2" aria-hidden="true" />
          </div>

          {/* Flèche gauche */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-900 hover:scale-110 transition-transform duration-200 z-10"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Flèche droite */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-900 hover:scale-110 transition-transform duration-200 z-10"
              aria-label="Suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
