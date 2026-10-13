'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';
import { CardsCarousel } from '@/components/ui/cards-carousel';

const SECTION_LABELS: Record<string, { chip: string; title1: string; title2: string; cta: string }> = {
  fr: { chip: 'NOS SERVICES', title1: 'Ce que nous construisons', title2: 'pour les PME et commerces locaux', cta: 'Voir tous nos services' },
  en: { chip: 'OUR SERVICES',  title1: 'What we build',       title2: 'for small and local businesses',    cta: 'View all services'      },
  es: { chip: 'NUESTROS SERVICIOS', title1: 'Lo que construimos', title2: 'para pymes y comercios locales', cta: 'Ver todos los servicios' },
  vi: { chip: 'DỊCH VỤ CỦA CHÚNG TÔI', title1: 'Những gì chúng tôi xây dựng', title2: 'cho doanh nghiệp nhỏ và cửa hàng địa phương', cta: 'Xem tất cả dịch vụ' },
};

// SVG constellation pour la carte IA

export function ServicesSection() {
  const { language, t } = useTranslation();
  const labels = SECTION_LABELS[(language as string)] ?? SECTION_LABELS.fr;

  return (
    <section className="py-24 lg:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-xl">
              <span className="text-navy-900">{labels.title1}</span>
              <br />
              <span style={{ color: '#1E3A6B' }}>
                {labels.title2}
              </span>
            </h2>
          </div>
          <LocalizedLink href="/services" className="flex-shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-navy-900 border border-navy-900/20 rounded-full px-6 py-3 hover:bg-navy-900 hover:text-white transition-all duration-200 group">
            {labels.cta}
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </LocalizedLink>
        </div>

        {/* ── Bento Grid Desktop ─────────────────────────────── */}
        {/*
          Layout 12 cols × 2 rows :
          Col 1-7 row 1-2 : Développement Web (grande carte)
          Col 8-12 row 1  : Applications Mobiles (moyenne)
          Col 8-10 row 2  : Intégration IA (petite)
          Col 11-12 row 2 : Automatisation (la plus petite)
        */}
        <div className="hidden md:grid grid-cols-12 grid-rows-2 gap-4" style={{ minHeight: '560px' }}>

          {/* Carte 1 — Développement Web (héroïne) — col 1-7 / row 1-2 */}
          <LocalizedLink href="/services" className="relative col-span-7 row-span-2 rounded-3xl overflow-hidden group bg-white">
            {/* Liseré gradient top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 z-10" style={{ background: '#ffffff' }} />
            {/* Photo pleine carte */}
            <div className="absolute inset-0">
              <Image
                src="/assets/services/development_web-macbook.webp"
                alt="MacBook affichant du code TypeScript dans un éditeur sombre"
                fill sizes="(max-width:1280px) 58vw, 740px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay gradient bottom pour lisibilité du texte */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,15,38,0.92) 0%, rgba(7,15,38,0.5) 45%, transparent 75%)' }} />
            </div>
            {/* Label numéro */}
            {/* Texte en bas */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">
                {t('services.web.title')}
              </h3>
              <p className="text-sm leading-relaxed max-w-sm text-white/70">
                {t('services.web.desc')}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:gap-2.5 transition-all duration-200">
                {t('common.learnMore')} <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </LocalizedLink>

          {/* Carte 2 — Applications Mobiles — col 8-12 / row 1 */}
          <LocalizedLink href="/mobile-app-development" className="relative col-span-5 rounded-3xl overflow-hidden bg-frost group">
            <Image
              src="/assets/services/nw_card_mobile_app.webp"
              alt="Une main tient un smartphone affichant une application de réservation dans un commerce"
              fill sizes="(max-width:1280px) 42vw, 540px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Overlay pour lisibilité */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(250,250,247,0.92) 70%, rgba(250,250,247,0.98) 100%)' }} />
            {/* Badge */}
            <div className="absolute top-5 right-5 z-10">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-navy-900" style={{ background: '#ffffff' }}>
                MVP 6 sem.
              </span>
            </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <h3 className="font-display text-xl font-bold text-navy-900 mb-1.5">
                {t('services.mobile.title')}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t('services.mobile.desc')}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-navy-900 group-hover:gap-2 transition-all duration-200">
                {t('common.learnMore')} <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </LocalizedLink>

          {/* Carte 3 — Intégration IA — col 8-10 / row 2 */}
          <LocalizedLink href="/integration-ia" className="relative col-span-3 rounded-3xl overflow-hidden group" style={{ background: '#0E1B3D' }}>
            <Image
              src="/assets/services/nw_card_ia_integration.webp"
              alt="Bureau d'un dirigeant de PME avec un ordinateur portable et un carnet de notes"
              fill sizes="(max-width:1280px) 25vw, 320px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,27,61,0.95) 0%, rgba(14,27,61,0.75) 45%, rgba(14,27,61,0.35) 100%)' }} />
            <div className="relative z-10 p-6 h-full flex flex-col justify-end">
              <div>
                <h3 className="font-display text-lg font-bold text-white mb-1 leading-tight">
                  {t('services.ai.title')}
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  {t('services.ai.desc')}
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white group-hover:gap-1.5 transition-all duration-200">
                  {t('common.learnMore')} <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </LocalizedLink>

          {/* Carte 4 — Automatisation — col 11-12 / row 2 (la plus petite) */}
          <LocalizedLink href="/automatisation" className="relative col-span-2 rounded-3xl overflow-hidden group" style={{ background: '#070F26' }}>
            <Image
              src="/assets/services/automation_n8n.webp"
              alt="Workflow d'automatisation n8n"
              fill sizes="20vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ opacity: 0.6 }}
              loading="lazy"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,15,38,0.88) 0%, rgba(7,15,38,0.35) 55%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <h3 className="font-display text-sm font-bold text-white leading-tight mb-1">
                {t('services.automation.title')}
              </h3>
              <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-3">
                {t('services.automation.desc')}
              </p>
            </div>
          </LocalizedLink>
        </div>

        {/* ── Mobile : carousel snap horizontal — 4 cards défilantes ─────── */}
        <div className="md:hidden -mx-4 sm:-mx-6">
          <CardsCarousel slideWidth="snap" padding={1} gap={1} dotColor="#0E1B3D" showArrows autoPlay autoPlayInterval={4500}>
            {/* Carte 1 — Dev Web */}
            <LocalizedLink href="/services" className="relative rounded-3xl overflow-hidden group block h-[340px]">
              <Image src="/assets/services/development_web-macbook.webp" alt="Développement Web" fill sizes="85vw" className="object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,15,38,0.95) 0%, rgba(7,15,38,0.4) 60%, transparent 100%)' }} />
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: '#ffffff' }} />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl font-bold text-white mb-2">{t('services.web.title')}</h3>
                <p className="text-sm text-white/70">{t('services.web.desc')}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  {t('common.learnMore')} <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </LocalizedLink>

            {/* Carte 2 — Mobile */}
            <LocalizedLink href="/mobile-app-development" className="relative rounded-3xl overflow-hidden bg-frost group block h-[340px]">
              <Image src="/assets/services/nw_card_mobile_app.webp" alt="Application mobile de réservation sur smartphone" fill sizes="85vw" className="object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(250,250,247,0.96) 70%)' }} />
              <div className="absolute top-5 right-5 z-10">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-navy-900" style={{ background: '#ffffff' }}>
                  MVP 6 sem.
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="font-display text-2xl font-bold text-navy-900 mb-2">{t('services.mobile.title')}</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{t('services.mobile.desc')}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                  {t('common.learnMore')} <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </LocalizedLink>

            {/* Carte 3 — IA */}
            <LocalizedLink href="/integration-ia" className="relative rounded-3xl overflow-hidden group block h-[340px]" style={{ background: '#0E1B3D' }}>
              <Image src="/assets/services/nw_card_ia_integration.webp" alt="Bureau d'un dirigeant de PME avec ordinateur portable et carnet de notes" fill sizes="85vw" className="object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,27,61,0.96) 0%, rgba(14,27,61,0.55) 100%)' }} />
              <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                <h3 className="font-display text-2xl font-bold text-white mb-2">{t('services.ai.title')}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{t('services.ai.desc')}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  {t('common.learnMore')} <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </LocalizedLink>

            {/* Carte 4 — Automatisation */}
            <LocalizedLink href="/automatisation" className="relative rounded-3xl overflow-hidden group block h-[340px]" style={{ background: '#070F26' }}>
              <Image src="/assets/services/automation_n8n.webp" alt="Automatisation" fill sizes="85vw" className="object-cover" style={{ opacity: 0.65 }} loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,15,38,0.88) 0%, transparent 60%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl font-bold text-white mb-2">{t('services.automation.title')}</h3>
                <p className="text-sm text-white/70">{t('services.automation.desc')}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  {t('common.learnMore')} <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </LocalizedLink>
          </CardsCarousel>
        </div>
      </div>
    </section>
  );
}
