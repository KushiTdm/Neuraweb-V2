'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';
import { MultiStepLoader } from '@/components/ui/multi-step-loader';

const COMMITMENT_KEYS = [
  'about.commitments.1',
  'about.commitments.2',
  'about.commitments.3',
  'about.commitments.4',
  'about.commitments.5',
  'about.commitments.6',
] as const;

const SECTION_LABELS: Record<string, { chip: string; learnMore: string }> = {
  fr: { chip: 'QUI SOMMES-NOUS ?', learnMore: "Rencontrer l'équipe" },
  en: { chip: 'ABOUT US',          learnMore: 'Meet the team'       },
  es: { chip: 'QUIÉNES SOMOS',     learnMore: 'Conocer el equipo'   },
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
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-8 sm:py-24 lg:py-32 overflow-hidden"
      style={{ background: '#F7FAFD' }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[52%_48%] gap-6 sm:gap-14 xl:gap-20 items-center">

          {/* ── Colonne gauche — image unique ────────────────── */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-32px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl h-[175px] sm:h-[300px] lg:h-[460px] xl:h-[520px]">
              <Image
                src="/assets/equipe.webp"
                alt={t('about.image.alt')}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 90vw, 52vw"
                className="object-cover object-top"
                quality={85}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
            </div>
          </div>

          {/* ── Colonne droite — texte ────────────────────────── */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(32px)',
              transition: 'opacity 0.7s 0.15s ease, transform 0.7s 0.15s ease',
            }}
          >
            {/* Eyebrow badge */}
            <span className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs font-semibold tracking-widest bg-frost text-navy-900 border border-sky-400/20 mb-3 sm:mb-6">
              {labels.chip}
            </span>

            {/* Titre */}
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight mb-3 sm:mb-5">
              {t('about.title').split('NeuraWeb')[0]}
              <span
                style={{
                  background: 'linear-gradient(90deg, #5DB8F0, #22D3EE)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                NeuraWeb
              </span>
            </h2>

            {/* Description */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-10 max-w-lg">
              {t('about.description')}
            </p>

            {/* Engagements animés */}
            <div className="mb-4 sm:mb-10">
              <MultiStepLoader
                steps={COMMITMENT_KEYS.map((key) => ({ text: t(key) }))}
                active={isVisible}
                duration={2200}
              />
            </div>

            {/* CTA */}
            <LocalizedLink
              href="/equipe"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 transition-colors duration-200 group mx-auto sm:mx-0 block w-fit"
            >
              {labels.learnMore}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </LocalizedLink>
          </div>

        </div>
      </div>
    </section>
  );
}
