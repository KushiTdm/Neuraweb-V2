'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Check, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { PillButton } from '@/components/ui/pill-button';

const COMMITMENT_KEYS = [
  'about.commitments.1',
  'about.commitments.2',
  'about.commitments.3',
  'about.commitments.4',
  'about.commitments.5',
  'about.commitments.6',
] as const;

const SECTION_LABELS: Record<string, { chip: string; learnMore: string }> = {
  fr: { chip: 'Qui sommes-nous ?', learnMore: 'Rencontrer l\'équipe' },
  en: { chip: 'About us',          learnMore: 'Meet the team'        },
  es: { chip: 'Quiénes somos',     learnMore: 'Conocer el equipo'    },
};

export function AboutSection() {
  const { t, language } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const labels = SECTION_LABELS[(language as string)] ?? SECTION_LABELS.fr;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Layout : image gauche, contenu droite ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-24 items-center">

          {/* Colonne gauche — photo */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-32px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <Image
                src="/assets/equipe.webp"
                alt={t('about.image.alt')}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                quality={85}
                loading="lazy"
              />
              {/* Légère vignette bas */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          </div>

          {/* Colonne droite — texte */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(32px)',
              transition: 'opacity 0.7s 0.15s ease, transform 0.7s 0.15s ease',
            }}
          >
            {/* Chip */}
            <span className="section-chip section-chip-light mb-5 inline-flex">
              {labels.chip}
            </span>

            {/* Titre */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-5">
              {t('about.title').split('NeuraWeb')[0]}
              <span className="text-gray-400">NeuraWeb</span>
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-lg">
              {t('about.description')}
            </p>

            {/* Liste engagements */}
            <div className="space-y-3.5 mb-10">
              {COMMITMENT_KEYS.map((key, i) => (
                <div
                  key={key}
                  className="flex items-start gap-3"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                    transition: `opacity 0.5s ${300 + i * 80}ms ease, transform 0.5s ${300 + i * 80}ms ease`,
                  }}
                >
                  {/* Icône check */}
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-gray-700 text-sm font-medium leading-snug">
                    {t(key)}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <PillButton href="/equipe" variant="light">
              {labels.learnMore}
            </PillButton>
          </div>

        </div>
      </div>
    </section>
  );
}
