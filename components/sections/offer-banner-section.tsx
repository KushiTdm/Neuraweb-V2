'use client';

import React from 'react';
import { HeartPulse, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';

export function OfferBannerSection() {
  const { t } = useTranslation();

  const bullets = [
    t('offer.banner.bullet1'),
    t('offer.banner.bullet2'),
    t('offer.banner.bullet3'),
  ];

  return (
    <section
      className="relative py-12 sm:py-16 px-4 overflow-hidden"
      aria-label={t('offer.banner.title')}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div
          className="relative rounded-3xl overflow-hidden border border-rose-200/40 dark:border-rose-500/20
            bg-gradient-to-br from-rose-50 via-white to-gray-50
            dark:from-[#1a0a1a] dark:via-[#0a0a1a] dark:to-[#0a0f1f]
            shadow-xl shadow-rose-500/5 dark:shadow-rose-500/10"
        >
          {/* Décor — taches gradient */}
          <div
            className="absolute inset-0 opacity-60 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 0% 0%, rgba(244,63,94,0.18) 0%, transparent 45%), radial-gradient(circle at 100% 100%, rgba(99,102,241,0.18) 0%, transparent 45%)',
            }}
            aria-hidden
          />

          <div className="relative grid lg:grid-cols-[1.4fr,1fr] gap-8 p-6 sm:p-10 lg:p-12 items-center">
            {/* ── Colonne gauche : message ───────────────────────── */}
            <div>
              {/* Badge animé */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-semibold
                shadow-lg shadow-rose-500/25">
                <Sparkles className="w-3.5 h-3.5" aria-hidden />
                {t('offer.banner.badge')}
              </div>

              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                {t('offer.banner.title')}{' '}
                <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent">
                  {t('offer.banner.highlight')}
                </span>
              </h2>

              {/* Prix barré */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Pack starter habituel :
                </span>
                <span className="text-base text-gray-400 dark:text-gray-500 line-through decoration-rose-500/70 decoration-2">
                  {t('offer.banner.strike')}
                </span>
              </div>

              <p className="mt-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                {t('offer.banner.subtitle')}
              </p>

              {/* Bullets */}
              <ul className="mt-6 grid sm:grid-cols-3 gap-3">
                {bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Check className="w-3 h-3" aria-hidden />
                    </span>
                    <span className="leading-snug">{b}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <LocalizedLink
                  href="/sante"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 group"
                  style={{
                    background: 'linear-gradient(135deg, #f43f5e, #6366f1)',
                    boxShadow: '0 10px 25px rgba(244,63,94,0.25)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 30px rgba(244,63,94,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 25px rgba(244,63,94,0.25)';
                  }}
                >
                  {t('offer.banner.cta')}
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </LocalizedLink>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t('offer.banner.note')}
                </span>
              </div>
            </div>

            {/* ── Colonne droite : visuel prix ───────────────────── */}
            <div className="relative">
              <div className="relative mx-auto max-w-sm rounded-2xl border border-white/40 dark:border-white/10
                bg-white/70 dark:bg-white/5 backdrop-blur-sm p-6 sm:p-8 shadow-lg">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <HeartPulse className="w-5 h-5" aria-hidden />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {t('nav.dropdown.sante.label')}
                  </span>
                </div>

                <div className="mt-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('offer.banner.from')}
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">990</span>
                  <span className="text-2xl font-semibold text-gray-700 dark:text-gray-200">€</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">HT</span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-sm">
                  <span className="text-gray-400 dark:text-gray-500 line-through">
                    {t('offer.banner.strike')}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                    -34%
                  </span>
                </div>

                <div className="my-5 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">+ 29€</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">/ mois</span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Hébergement, maintenance & mises à jour incluses
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
