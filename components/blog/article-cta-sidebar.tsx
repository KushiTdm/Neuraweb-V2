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
      className="hidden xl:block"
    >
      <div className="sticky top-28 flex flex-col gap-4">
        {/* ─── Carte 1 : Service en lien ─────────────────────────────────── */}
        <LocalizedLink
          href={service.href}
          onClick={() => onTrack?.('service', service.href)}
          className="lift group block rounded-3xl border border-chypre/20 bg-creme p-5 transition-all duration-300 hover:border-chypre/50 hover:shadow-[0_12px_40px_rgba(0,70,67,0.14)]"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-chypre/10">
              <Zap className="w-4 h-4 text-chypre" aria-hidden="true" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-chypre">
              {service.eyebrow}
            </span>
          </div>
          <h3 className="text-base font-bold text-chypre leading-snug mb-2">
            {service.title}
          </h3>
          <p className="text-sm text-chypre/85 leading-relaxed mb-4">
            {service.description}
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-chypre group-hover:gap-2.5 transition-all">
            {service.cta}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </span>
        </LocalizedLink>

        {/* ─── Carte 2 : Prise de RDV (mise en avant) ────────────────────── */}
        <LocalizedLink
          href="/booking"
          onClick={() => onTrack?.('booking', '/booking')}
          className="lift ctx-dark group relative block overflow-hidden rounded-3xl bg-chypre p-5 transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,70,67,0.35)]"
        >
<div className="relative flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-creme/15">
              <Calendar className="w-4 h-4 text-creme" aria-hidden="true" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-creme/90">
              {booking.eyebrow}
            </span>
          </div>

          <h3 className="relative text-base font-bold text-creme leading-snug mb-2">
            {booking.title}
          </h3>
          <p className="relative text-sm text-creme/85 leading-relaxed mb-3">
            {booking.description}
          </p>
          <p className="relative text-[11px] font-medium text-creme/80 mb-4 flex items-center gap-1.5">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            {booking.duration}
          </p>

          <span className="relative inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl bg-creme text-chypre text-sm font-bold shadow-sm group-hover:shadow-md transition-shadow">
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
    <div className="xl:hidden my-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {/* Prise de RDV (mise en avant) */}
      <LocalizedLink
        href="/booking"
        onClick={() => onTrack?.('booking', '/booking')}
        className="ctx-dark relative block overflow-hidden rounded-3xl bg-chypre p-5 transition-transform active:scale-[.99]"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-creme/15">
            <Calendar className="w-4 h-4 text-creme" aria-hidden="true" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-creme/90">
            {booking.eyebrow}
          </span>
        </div>
        <h3 className="text-base font-bold text-creme leading-snug mb-2">{booking.title}</h3>
        <p className="text-sm text-creme/85 leading-relaxed mb-3">{booking.description}</p>
        <p className="text-[11px] font-medium text-creme/80 mb-3 flex items-center gap-1.5">
          <Calendar className="w-3 h-3" aria-hidden="true" />
          {booking.duration}
        </p>
        <span className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl bg-creme text-chypre text-sm font-bold">
          <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
          {booking.cta}
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </LocalizedLink>

      {/* Service en lien */}
      <LocalizedLink
        href={service.href}
        onClick={() => onTrack?.('service', service.href)}
        className="block rounded-3xl border border-chypre/20 bg-creme p-5 active:scale-[.99] transition-transform"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-chypre/10">
            <Zap className="w-4 h-4 text-chypre" aria-hidden="true" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-chypre">
            {service.eyebrow}
          </span>
        </div>
        <h3 className="text-base font-bold text-chypre leading-snug mb-2">
          {service.title}
        </h3>
        <p className="text-sm text-chypre/85 leading-relaxed mb-3">
          {service.description}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-chypre">
          {service.cta}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </span>
      </LocalizedLink>
    </div>
  );
}
