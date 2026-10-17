'use client';

import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { LocalizedLink } from '@/components/localized-link';
import { HeroVisual } from '@/components/hero-visual';

// Héros commun des pages de services (Dev web, Mobile, Automatisation, Intégration IA).
// Même gabarit partout : pastille, H1 (Fraunces), sous-titre, deux boutons, 3 chiffres
// optionnels, visuel du thème. 100 % de la hauteur d'écran (svh), colonne unique sur mobile.
// Les couleurs viennent du thème de la page (classes `theme-*` posées par la page parente).
export interface ServiceHeroProps {
  badgeIcon: React.ReactNode;
  badge: string;
  h1: string;
  highlight?: string;
  subtitle: string;
  primary: { href: string; label: string; icon?: React.ReactNode };
  secondary: { href: string; label: string };
  stats?: { value: string; label: string }[];
  visual: { src: string; alts: Record<'fr' | 'en' | 'es' | 'vi', string> };
}

export function ServiceHero({ badgeIcon, badge, h1, highlight, subtitle, primary, secondary, stats, visual }: ServiceHeroProps) {
  return (
    <section
      className="sec-dark-base ctx-dark relative flex min-h-[100svh] items-center overflow-hidden pb-14 pt-28 sm:pb-16 sm:pt-32"
      aria-labelledby="service-hero-title"
    >
      <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(var(--c-white) / 0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div data-parallax="-50" className="pointer-events-none absolute left-1/2 top-0 -ml-[300px] h-[360px] w-[600px] rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:px-8">
        <div className="text-left">
          <div className="animate-on-scroll fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-medium text-white">
            {badgeIcon}
            <span>{badge}</span>
          </div>
          <h1 id="service-hero-title" className="animate-on-scroll fade-up delay-100 mb-5 text-[2rem] leading-[1.1] text-white sm:text-5xl xl:text-6xl">
            {h1}
            {highlight ? <> <span className="text-white">{highlight}</span></> : null}
          </h1>
          <p className="animate-on-scroll fade-up delay-200 mb-8 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">{subtitle}</p>

          <div className="animate-on-scroll fade-up delay-300 mb-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <LocalizedLink
              href={primary.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-gray-900 transition-opacity hover:opacity-90 sm:px-8"
            >
              {primary.icon}
              {primary.label}
              <ArrowRight size={16} aria-hidden="true" />
            </LocalizedLink>
            <a
              href={secondary.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5 sm:px-8"
            >
              {secondary.label}
              <ChevronDown size={16} aria-hidden="true" />
            </a>
          </div>

          {stats && stats.length > 0 && (
            <dl className="animate-on-scroll fade-up delay-400 grid max-w-xl grid-cols-3 gap-2 sm:gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/15 bg-white/5 px-3 py-3 sm:px-4 sm:py-4">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-xl font-bold leading-none text-white sm:text-2xl">{stat.value}</dd>
                  <p className="mt-1.5 text-[11px] leading-snug text-slate-300 sm:text-xs" aria-hidden="true">{stat.label}</p>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="animate-on-scroll fade-up delay-300">
          <HeroVisual src={visual.src} alts={visual.alts} />
        </div>
      </div>
    </section>
  );
}
