'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Clock, Code2, Handshake, Cpu, Monitor, BarChart3, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';

const COMMITMENT_KEYS = [
  'about.commitments.1',
  'about.commitments.2',
  'about.commitments.3',
  'about.commitments.4',
  'about.commitments.5',
  'about.commitments.6',
] as const;

const COMMITMENT_ICONS = [Clock, Code2, Handshake, Cpu, Monitor, BarChart3];

const SECTION_LABELS: Record<string, { chip: string; learnMore: string }> = {
  fr: { chip: 'QUI SOMMES-NOUS ?', learnMore: 'Rencontrer l\'équipe ↗' },
  en: { chip: 'ABOUT US',          learnMore: 'Meet the team ↗'        },
  es: { chip: 'QUIÉNES SOMOS',     learnMore: 'Conocer el equipo ↗'    },
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
      className="py-24 lg:py-32 overflow-hidden"
      style={{ background: '#F7FAFD' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-24 items-center">

          {/* ── Colonne gauche — mini-bento photos ────────────── */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-32px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <div className="grid grid-cols-2 grid-rows-2 gap-3" style={{ height: '480px' }}>
              {/* Photo principale — col 1 / row 1-2 */}
              <div className="relative row-span-2 rounded-3xl overflow-hidden">
                <Image
                  src="/assets/equipe.webp"
                  alt={t('about.image.alt')}
                  fill
                  sizes="(max-width: 1024px) 45vw, 25vw"
                  className="object-cover"
                  quality={85}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              {/* Photo secondaire — col 2 / row 1 */}
              <div className="relative rounded-3xl overflow-hidden">
                <Image
                  src="/assets/equipe.jpeg"
                  alt="Équipe NeuraWeb en session créative"
                  fill
                  sizes="(max-width: 1024px) 45vw, 25vw"
                  className="object-cover"
                  quality={80}
                  loading="lazy"
                />
              </div>
              {/* Carte texte — col 2 / row 2 */}
              <div
                className="relative rounded-3xl overflow-hidden flex items-end p-5"
                style={{ background: '#0E1B3D' }}
              >
                {/* Petite constellation décorative */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 200" aria-hidden="true">
                  <circle cx="40" cy="50" r="2" fill="#5DB8F0" />
                  <circle cx="120" cy="30" r="2" fill="#5DB8F0" />
                  <circle cx="160" cy="90" r="2" fill="#22D3EE" />
                  <circle cx="80" cy="140" r="2" fill="#5DB8F0" />
                  <circle cx="170" cy="160" r="2" fill="#22D3EE" />
                  <line x1="40" y1="50" x2="120" y2="30" stroke="#5DB8F0" strokeWidth="0.5" />
                  <line x1="120" y1="30" x2="160" y2="90" stroke="#22D3EE" strokeWidth="0.5" />
                  <line x1="160" y1="90" x2="80" y2="140" stroke="#5DB8F0" strokeWidth="0.5" />
                  <line x1="80" y1="140" x2="170" y2="160" stroke="#22D3EE" strokeWidth="0.5" />
                </svg>
                <div className="relative z-10">
                  <p className="text-2xl font-bold text-white font-display">150+</p>
                  <p className="text-xs" style={{ color: 'rgba(93,184,240,0.8)' }}>Projets livrés</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Colonne droite — texte ─────────────────────────── */}
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(32px)',
              transition: 'opacity 0.7s 0.15s ease, transform 0.7s 0.15s ease',
            }}
          >
            {/* Eyebrow badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest bg-frost text-navy-900 border border-sky-400/20 mb-6">
              {labels.chip}
            </span>

            {/* Titre */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight mb-5">
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
            <p className="text-slate-600 text-base leading-relaxed mb-10 max-w-lg">
              {t('about.description')}
            </p>

            {/* Liste engagements avec vignettes circulaires */}
            <div className="space-y-4 mb-10">
              {COMMITMENT_KEYS.map((key, i) => {
                const Icon = COMMITMENT_ICONS[i] ?? Clock;
                return (
                  <div
                    key={key}
                    className="flex items-start gap-4 group"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                      transition: `opacity 0.5s ${300 + i * 80}ms ease, transform 0.5s ${300 + i * 80}ms ease`,
                    }}
                  >
                    {/* Vignette circulaire */}
                    <span
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 mt-0.5"
                      style={{ background: '#E8F4FD' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#5DB8F0';
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) icon.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#E8F4FD';
                        const icon = e.currentTarget.querySelector('svg');
                        if (icon) icon.style.color = '#5DB8F0';
                      }}
                    >
                      <Icon className="w-[18px] h-[18px]" style={{ color: '#5DB8F0' }} />
                    </span>
                    <span className="text-slate-700 text-sm font-medium leading-snug pt-2.5">
                      {t(key)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <LocalizedLink
              href="/equipe"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 transition-colors duration-200 group"
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
