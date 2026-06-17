'use client';

import { ArrowRight, Calendar, Zap } from 'lucide-react';
import { LocalizedLink } from '@/components/localized-link';
import { getSidebarContent, type SidebarLanguage } from '@/lib/blog-cta-mapping';

interface ArticleCTASidebarProps {
  slug: string;
  category: string;
  tags: string[];
  language: SidebarLanguage;
  onTrack?: (kind: 'service' | 'booking', href: string) => void;
}

/**
 * ArticleCTASidebar — colonne CTA sticky à gauche d'un article blog.
 *
 * Deux cartes empilées : service en lien (carte sobre) et prise de RDV
 * (carte mise en avant avec gradient). Sticky sur ≥lg, masquée en dessous
 * (le composant ArticleCTAMobile prend le relais).
 */
export function ArticleCTASidebar({
  slug,
  category,
  tags,
  language,
  onTrack,
}: ArticleCTASidebarProps) {
  const { service, booking } = getSidebarContent(slug, category, tags, language);

  return (
    <aside
      aria-label={
        language === 'en'
          ? 'Related services and actions'
          : language === 'es'
            ? 'Servicios y acciones relacionados'
            : 'Services et actions liés'
      }
      className="hidden lg:block"
    >
      <div className="sticky top-24 flex flex-col gap-4">
        {/* ─── Carte 1 : Service en lien ─────────────────────────────────── */}
        <LocalizedLink
          href={service.href}
          onClick={() => onTrack?.('service', service.href)}
          className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-5 transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-100/40 dark:hover:shadow-indigo-900/20 hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {service.eyebrow}
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-2">
            {service.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {service.description}
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:gap-2.5 transition-all">
            {service.cta}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </span>
        </LocalizedLink>

        {/* ─── Carte 2 : Prise de RDV (mise en avant) ────────────────────── */}
        <LocalizedLink
          href="/booking"
          onClick={() => onTrack?.('booking', '/booking')}
          className="group relative block rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200/40 dark:hover:shadow-indigo-900/30"
          style={{
            background:
              'linear-gradient(135deg, rgb(79, 70, 229) 0%, rgb(124, 58, 237) 50%, rgb(34, 211, 238) 100%)',
          }}
        >
          {/* Glow décoratif */}
          <div
            className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-40 pointer-events-none"
            style={{ background: 'rgba(255,255,255,0.4)' }}
            aria-hidden="true"
          />

          <div className="relative flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90">
              {booking.eyebrow}
            </span>
          </div>

          <h3 className="relative text-base font-bold text-white leading-snug mb-2">
            {booking.title}
          </h3>
          <p className="relative text-sm text-white/85 leading-relaxed mb-3">
            {booking.description}
          </p>
          <p className="relative text-[11px] font-medium text-white/70 mb-4 flex items-center gap-1.5">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            {booking.duration}
          </p>

          <span className="relative inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl bg-white text-indigo-700 text-sm font-bold shadow-sm group-hover:shadow-md transition-shadow">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            {booking.cta}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </span>
        </LocalizedLink>
      </div>
    </aside>
  );
}

/**
 * Variante mobile : grid affichée inline dans le flux du contenu
 * (visible sur < lg). Reprend les mêmes deux cartes.
 */
export function ArticleCTAMobile({
  slug,
  category,
  tags,
  language,
  onTrack,
}: ArticleCTASidebarProps) {
  const { service, booking } = getSidebarContent(slug, category, tags, language);

  return (
    <div className="lg:hidden my-10 grid grid-cols-1 gap-3">
      {/* Prise de RDV (mise en avant) */}
      <LocalizedLink
        href="/booking"
        onClick={() => onTrack?.('booking', '/booking')}
        className="relative block rounded-2xl p-5 overflow-hidden transition-transform active:scale-[.99]"
        style={{
          background:
            'linear-gradient(135deg, rgb(79, 70, 229) 0%, rgb(124, 58, 237) 50%, rgb(34, 211, 238) 100%)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm">
            <Calendar className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90">
            {booking.eyebrow}
          </span>
        </div>
        <h3 className="text-base font-bold text-white leading-snug mb-2">{booking.title}</h3>
        <p className="text-sm text-white/85 leading-relaxed mb-3">{booking.description}</p>
        <p className="text-[11px] font-medium text-white/70 mb-3 flex items-center gap-1.5">
          <Calendar className="w-3 h-3" aria-hidden="true" />
          {booking.duration}
        </p>
        <span className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl bg-white text-indigo-700 text-sm font-bold">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          {booking.cta}
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </LocalizedLink>

      {/* Service en lien */}
      <LocalizedLink
        href={service.href}
        onClick={() => onTrack?.('service', service.href)}
        className="block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-5 active:scale-[.99] transition-transform"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {service.eyebrow}
          </span>
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-2">
          {service.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          {service.description}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          {service.cta}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </span>
      </LocalizedLink>
    </div>
  );
}
