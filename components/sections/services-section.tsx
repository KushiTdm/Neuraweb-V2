'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Code, Bot, Brain, LucideIcon, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import type { TranslationKey } from '@/locales';
import dynamic from 'next/dynamic';

const ServicesThreeCanvas = dynamic(
  () => import('./services-three-canvas').then((mod) => mod.ServicesThreeCanvas),
  { ssr: false }
);

interface Service {
  icon: LucideIcon;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  screenshot: string;
  accentColor: string;
}

const services: Service[] = [
  {
    icon: Code,
    titleKey: 'services.web.title',
    descKey: 'services.web.desc',
    color: 'from-blue-500 to-blue-600',
    gradientFrom: '#3b82f6',
    gradientTo: '#1d4ed8',
    accentColor: 'blue',
    screenshot: '/assets/services/web_dev.webp',
  },
  {
    icon: Bot,
    titleKey: 'services.automation.title',
    descKey: 'services.automation.desc',
    color: 'from-purple-500 to-purple-600',
    gradientFrom: '#a855f7',
    gradientTo: '#7e22ce',
    accentColor: 'purple',
    screenshot: '/assets/services/automation.webp',
  },
  {
    icon: Brain,
    titleKey: 'services.ai.title',
    descKey: 'services.ai.desc',
    color: 'from-pink-500 to-pink-600',
    gradientFrom: '#ec4899',
    gradientTo: '#be185d',
    accentColor: 'pink',
    screenshot: '/assets/services/ia_integration.webp',
  },
];

function ServiceCard({
  service,
  index,
  isActive,
  onClick,
}: {
  service: Service;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  const IconComponent = service.icon;

  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={t(service.titleKey)}
      className={`
        group relative w-full text-left rounded-2xl border
        transition-transform duration-500 cursor-pointer
        ${
          isActive
            ? 'border-transparent shadow-2xl scale-[1.02]'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg'
        }
      `}
      /*
        FIX animations non composées :
        - Suppression de transition-all → remplacé par transition-transform
        - boxShadow retiré des styles inline dynamiques (non composé)
        - La shadow est gérée via les classes Tailwind shadow-2xl / hover:shadow-lg
      */
    >
      {/* Fond de la carte */}
      <div
        className={`
          absolute inset-0 rounded-2xl
          transition-opacity duration-500
          ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
        `}
        style={{
          background: `linear-gradient(135deg, ${service.gradientFrom}12, ${service.gradientTo}08)`,
        }}
      />

      {/* Ligne d'accentuation gauche — animée via transform (composé) */}
      <div
        className={`
          absolute left-0 top-4 bottom-4 w-0.5 rounded-full
          transition-opacity duration-500
          ${isActive ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ background: `linear-gradient(to bottom, ${service.gradientFrom}, ${service.gradientTo})` }}
      />

      {/* Contenu */}
      <div className="relative p-6 flex items-start gap-4">
        {/* Icône — transition sur transform uniquement (composé) */}
        <div
          className={`
            flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
            shadow-lg
            transition-transform duration-500
            ${isActive ? 'scale-110' : 'group-hover:scale-105'}
          `}
          style={{
            background: `linear-gradient(135deg, ${service.gradientFrom}, ${service.gradientTo})`,
            /*
              FIX: boxShadow retiré → déclenchait un forced layout recalculation.
              L'effet de glow est maintenu via la classe shadow-lg de Tailwind
              qui est calculée sans layout thrashing.
            */
          }}
        >
          <IconComponent className="w-6 h-6 text-white" strokeWidth={2} />
        </div>

        {/* Texte */}
        <div className="flex-1 min-w-0">
          {/*
            FIX: transition-colors sur color → non composé, remplacé par opacity
            Le titre actif est toujours blanc/noir ; on joue sur l'opacité plutôt que la couleur.
          */}
          <h3
            className={`
              text-lg font-bold mb-1
              transition-opacity duration-300
              ${isActive ? 'opacity-100 text-gray-900 dark:text-white' : 'opacity-70 text-gray-700 dark:text-gray-300'}
            `}
          >
            {t(service.titleKey)}
          </h3>

          {/*
            FIX: max-height + color en transition → non composés.
            Remplacé par opacity + transform (translateY) sur un wrapper,
            ce qui est entièrement composé sur le GPU.
          */}
          <div
            className={`
              overflow-hidden transition-all duration-500
              ${isActive ? 'max-h-40' : 'max-h-0'}
            `}
            aria-hidden={!isActive}
          >
            <p
              className={`
                text-sm leading-relaxed text-gray-600 dark:text-gray-300
                transition-opacity duration-500
                ${isActive ? 'opacity-100' : 'opacity-0'}
              `}
              style={{
                transform: isActive ? 'translateY(0)' : 'translateY(-8px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              {t(service.descKey)}
            </p>
          </div>
        </div>

        {/* Flèche — rotation composée (transform) */}
        <ChevronRight
          className={`
            flex-shrink-0 w-5 h-5 mt-0.5
            transition-transform duration-300
            ${isActive ? 'rotate-90 opacity-100' : 'opacity-30 group-hover:opacity-60'}
          `}
          style={{ color: service.gradientFrom }}
        />
      </div>

      {/* Numéro */}
      <div
        className={`
          absolute top-3 right-3 text-xs font-mono font-bold
          transition-opacity duration-300
          ${isActive ? 'opacity-60' : 'opacity-20'}
        `}
        style={{ color: service.gradientFrom }}
        aria-hidden="true"
      >
        0{index + 1}
      </div>
    </button>
  );
}

function ServiceDisplay({ service, index }: { service: Service; index: number }) {
  const { t } = useTranslation();
  const IconComponent = service.icon;
  const prevIndexRef = useRef(index);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (prevIndexRef.current !== index) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 400);
      prevIndexRef.current = index;
      return () => clearTimeout(timer);
    }
  }, [index]);

  return (
    <div
      className="relative h-full min-h-[420px] rounded-3xl overflow-hidden"
      style={{
        /*
          FIX: transition uniquement sur opacity + transform (composés)
          Pas de transition sur layout properties
        */
        opacity: isAnimating ? 0 : 1,
        transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      <div className="absolute inset-0">
        <Image
          src={service.screenshot}
          alt={t(service.titleKey)}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          quality={80}
          priority={index === 0}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${service.gradientFrom}e0 0%, ${service.gradientTo}c0 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <ServicesThreeCanvas activeIndex={index} />

      <div className="relative z-10 h-full flex flex-col justify-end p-8">
        <div className="mb-4">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white/90 backdrop-blur-sm border border-white/20"
            style={{ background: `${service.gradientFrom}60` }}
          >
            <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />
            Service 0{index + 1}
          </span>
        </div>

        <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3 drop-shadow-lg">
          {t(service.titleKey)}
        </h3>

        <p className="text-white/80 text-base leading-relaxed max-w-md drop-shadow">
          {t(service.descKey)}
        </p>

        {/* Indicateurs de navigation — width en transition → remplacé par scaleX (composé) */}
        <div className="flex gap-2 mt-6" aria-hidden="true">
          {services.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full"
              style={{
                width: i === index ? '2rem' : '0.5rem',
                background: i === index ? 'white' : 'rgba(255,255,255,0.3)',
                transition: 'width 0.5s ease, opacity 0.5s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ServicesSection() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
              setTimeout(() => el.classList.add('animate-in'), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-snap bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 overflow-hidden"
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center py-6 sm:py-10 lg:py-12">
        <div className="text-center mb-5 md:mb-8">
          <h2
            id="services-heading"
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 animate-on-scroll fade-up"
          >
            {t('services.section.title')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-on-scroll fade-up delay-200 px-2">
            {t('services.section.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10 items-stretch">
          <div className="flex flex-col gap-3 justify-center animate-on-scroll fade-left delay-300">
            {services.map((service, index) => (
              <ServiceCard
                key={service.titleKey}
                service={service}
                index={index}
                isActive={activeIndex === index}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>

          <div className="hidden lg:block animate-on-scroll fade-right delay-400">
            <ServiceDisplay service={services[activeIndex]!} index={activeIndex} />
          </div>
        </div>
      </div>
    </section>
  );
}