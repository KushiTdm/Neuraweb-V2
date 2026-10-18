'use client';

import React from 'react';
import { ArrowRight, ChevronDown, type LucideIcon } from 'lucide-react';
import { LocalizedLink } from '@/components/localized-link';
import { SectorTag } from '@/components/sector-tag';

// Héros commun des pages sectorielles (Santé, Restaurants & hôtels, Collectivités).
// Même gabarit que `ServiceHero` : fond = couleur du thème de la page, 100 % de la hauteur d'écran (svh),
// colonne unique sur mobile. Le visuel de droite est posé sur une surface claire (`ctx-light`).
export interface SectorHeroProps {
  badgeIcon: React.ReactNode;
  badge: string;
  h1: string;
  highlight?: string;
  subtitle: React.ReactNode;
  primary: { label: string; onClick?: () => void; href?: string };
  secondary: { label: string; onClick?: () => void; href?: string };
  trust: { icon: LucideIcon; label: string; longLabel?: string }[];
  visual: React.ReactNode;
}

const PRIMARY_CLS =
  'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-gray-900 transition-opacity hover:opacity-90 sm:px-8';
const SECONDARY_CLS =
  'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/30 bg-transparent px-6 py-3.5 text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5 sm:px-8';

function Cta({ cta, className, icon }: { cta: SectorHeroProps['primary']; className: string; icon: React.ReactNode }) {
  if (cta.href) {
    return (
      <LocalizedLink href={cta.href} className={className}>
        {cta.label}
        {icon}
      </LocalizedLink>
    );
  }
  return (
    <button type="button" onClick={cta.onClick} className={className}>
      {cta.label}
      {icon}
    </button>
  );
}

export function SectorHero({ badgeIcon, badge, h1, highlight, subtitle, primary, secondary, trust, visual }: SectorHeroProps) {
  return (
    <section
      className="sec-dark-base ctx-dark relative flex min-h-[100svh] items-center overflow-hidden pb-14 pt-24 sm:pb-16 sm:pt-28"
      aria-labelledby="sector-hero-title"
    >
      <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(var(--c-white) / 0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="pointer-events-none absolute left-1/2 top-0 -ml-[300px] h-[360px] w-[600px] rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:px-8">
        <div className="text-left">
          <SectorTag tone="dark" />
          <div className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium text-white sm:mb-5">
            {badgeIcon}
            <span>{badge}</span>
          </div>
          <h1 id="sector-hero-title" className="mb-4 text-[2rem] leading-[1.1] text-white sm:mb-5 sm:text-5xl xl:text-[3.5rem]">
            {h1}
            {highlight ? <> <span className="text-white">{highlight}</span></> : null}
          </h1>
          <p className="mb-6 max-w-xl text-base leading-relaxed text-slate-200 sm:mb-7 sm:text-lg [&_strong]:font-semibold [&_strong]:text-white">{subtitle}</p>

          <div className="mb-6 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:gap-4">
            <Cta cta={primary} className={PRIMARY_CLS} icon={<ArrowRight size={16} aria-hidden="true" />} />
            <Cta cta={secondary} className={SECONDARY_CLS} icon={<ChevronDown size={16} aria-hidden="true" />} />
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-200">
            {trust.map(({ icon: Icon, label, longLabel }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-white sm:h-5 sm:w-5" aria-hidden="true" />
                <span className="sm:hidden">{label}</span>
                <span className="hidden sm:inline">{longLabel ?? label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ctx-light mx-auto w-full max-w-md lg:max-w-none">{visual}</div>
      </div>
    </section>
  );
}
