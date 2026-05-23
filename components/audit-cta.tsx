'use client';

import React from 'react';
import { Check, ArrowRight, Sparkles, Lock, Clock, Monitor } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';

export function AuditCTA() {
  const { t } = useTranslation();

  const benefits = [
    t('audit.benefit.1'),
    t('audit.benefit.2'),
    t('audit.benefit.3'),
    t('audit.benefit.4'),
  ];

  const trustBadges = [
    { icon: Lock,    label: t('audit.trust.1') },
    { icon: Clock,   label: t('audit.trust.2') },
    { icon: Monitor, label: t('audit.trust.3') },
  ];

  return (
    <section
      className="relative py-24 lg:py-32 px-4 overflow-hidden"
      aria-label={t('audit.title')}
      style={{ background: '#070F26' }}
    >
      {/* ── Blobs de fond ──────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(93,184,240,0.15), transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[70px]"
          style={{ background: 'radial-gradient(circle, rgba(255,122,89,0.12), transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full blur-[60px]"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.10), transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* ── Carte principale ─────────────────────────────── */}
        {/* Wrapper gradient pour la bordure */}
        <div
          className="p-px rounded-[2rem]"
          style={{ background: 'rgba(255,255,255,0.15)' }}
        >
          <div className="rounded-[calc(2rem-1px)] p-8 sm:p-12 lg:p-16" style={{ background: '#1E2A4A' }}>
            <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-10 items-center">

              {/* ── Colonne gauche — texte + features ─────── */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff' }}>
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  {t('audit.badge')}
                </div>

                {/* Titre + sticker */}
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
                  {t('audit.title')}
                </h2>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-base font-medium" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    Valeur{' '}
                  </span>
                  <span className="relative inline-block text-base font-semibold" style={{ color: '#C5F277' }}>
                    490€
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 50 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <line x1="2" y1="10" x2="48" y2="10" stroke="#C5F277" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>

                <p className="text-sm leading-relaxed mb-8 max-w-md" style={{ color: 'rgba(148,163,184,0.8)' }}>
                  {t('audit.subtitle')}
                </p>

                {/* 4 benefits en 2×2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {benefits.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C5F277' }} aria-hidden="true" />
                      <span className="text-sm font-medium text-white">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTA button */}
                <LocalizedLink
                  href="/booking?service=audit-ia"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-gray-900 transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
                  style={{
                    background: '#ffffff',
                    boxShadow: '0 8px 30px rgba(255,255,255,0.2)',
                  }}
                  aria-label={t('audit.cta')}
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  {t('audit.cta')}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </LocalizedLink>

                <p className="mt-3 text-xs" style={{ color: 'rgba(148,163,184,0.5)' }}>
                  {t('audit.note')}
                </p>
              </div>

              {/* ── Colonne droite — placeholder mockup ──── */}
              <div className="hidden lg:flex items-center justify-center">
                <div
                  className="w-full rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(93,184,240,0.15)',
                    aspectRatio: '3/4',
                  }}
                >
                  <div className="text-center p-8">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: 'rgba(93,184,240,0.1)' }}
                    >
                      <Monitor className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-sm font-medium text-white mb-1">Rapport d&apos;audit</p>
                    <p className="text-xs" style={{ color: 'rgba(148,163,184,0.5)' }}>
                      Aperçu disponible<br />après réservation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer de la carte — 3 trust badges ───── */}
            <div
              className="mt-10 pt-8 flex flex-wrap justify-center gap-6 sm:gap-10"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-white" aria-hidden="true" />
                  <span className="text-xs font-medium" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AuditBanner() {
  const { t } = useTranslation();

  return (
    <div
      className="rounded-2xl p-6 text-white"
      style={{ background: '#111827' }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{t('audit.title')}</h3>
            <p className="text-white/80 text-sm">{t('audit.value')}</p>
          </div>
        </div>
        <LocalizedLink
          href="/booking?service=audit-ia"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-navy-900 font-semibold hover:bg-frost transition-colors"
        >
          {t('audit.cta')}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </LocalizedLink>
      </div>
    </div>
  );
}

export default AuditCTA;
