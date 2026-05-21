'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowRight, Calendar, Check, Sparkles, Lock, Clock, Monitor, TrendingUp, Shield, Headphones } from 'lucide-react';
import { LocalizedLink } from '@/components/localized-link';
import { useTranslation } from '@/hooks/use-translation';

function HandDrawnUnderline() {
  return (
    <svg
      className="absolute -bottom-2 left-0 w-full"
      viewBox="0 0 300 12"
      fill="none"
      aria-hidden="true"
      style={{ height: '12px', overflow: 'visible' }}
    >
      <path
        d="M4 8 C50 3, 100 10, 150 6 C200 2, 250 9, 296 5"
        stroke="#5DB8F0"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function CTASection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          entry.target.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
            setTimeout(() => el.classList.add('animate-in'), i * 100);
          });
        }
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const auditBenefits = [
    t('audit.benefit.1'),
    t('audit.benefit.2'),
    t('audit.benefit.3'),
    t('audit.benefit.4'),
  ];

  const trustBadges = [
    { icon: Lock,      label: t('audit.trust.1') },
    { icon: Clock,     label: t('audit.trust.2') },
    { icon: Monitor,   label: t('audit.trust.3') },
  ];

  const featureBadges = [
    { icon: TrendingUp, label: t('cta.guaranteedGrowth') },
    { icon: Shield,     label: t('cta.secure')           },
    { icon: Headphones, label: t('cta.dedicatedSupport') },
  ];

  const rawTitle = t('cta.title');
  const visionKeyword = { fr: 'votre vision', en: 'your vision', es: 'tu visión' };
  const foundKeyword = Object.values(visionKeyword).find((kw) =>
    rawTitle.toLowerCase().includes(kw.toLowerCase())
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: '#070F26' }}
    >
      {/* Orbes de fond */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(93,184,240,0.14), transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-[90px]" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.10), transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── En-tête centré ────────────────────────────────── */}
        <div className="text-center mb-14">
          <div className="animate-on-scroll fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white mb-8" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <Sparkles size={14} aria-hidden="true" />
            {t('cta.subtitle')}
          </div>

          <h2 className="animate-on-scroll fade-up delay-100 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {foundKeyword ? (
              <>
                {rawTitle.substring(0, rawTitle.toLowerCase().indexOf(foundKeyword.toLowerCase()))}
                <span className="relative inline-block">
                  {rawTitle.substring(
                    rawTitle.toLowerCase().indexOf(foundKeyword.toLowerCase()),
                    rawTitle.toLowerCase().indexOf(foundKeyword.toLowerCase()) + foundKeyword.length
                  )}
                  <HandDrawnUnderline />
                </span>
                {rawTitle.substring(rawTitle.toLowerCase().indexOf(foundKeyword.toLowerCase()) + foundKeyword.length)}
              </>
            ) : (
              rawTitle
            )}
          </h2>
        </div>

        {/* ── Deux cartes côte à côte ──────────────────────── */}
        <div className="animate-on-scroll fade-up delay-200 grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">

          {/* Carte gauche — Appel découverte (simple) */}
          <div
            className="flex flex-col rounded-3xl p-8 border"
            style={{ background: '#1E2A4A', borderColor: 'rgba(93,184,240,0.15)' }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-6" style={{ background: 'rgba(93,184,240,0.1)' }}>
              <Calendar className="w-6 h-6 text-sky-400" aria-hidden="true" />
            </div>

            <h3 className="font-display text-2xl font-bold text-white mb-3">
              {t('cta.bookCall')}
            </h3>

            <p className="text-sm leading-relaxed mb-8 flex-1" style={{ color: 'rgba(148,163,184,0.8)' }}>
              Échangez avec notre équipe en 30 minutes. Présentez votre projet, obtenez un premier avis technique et explorez les pistes d'optimisation adaptées à votre activité.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {featureBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: 'rgba(148,163,184,0.7)' }}>
                  <Icon className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" aria-hidden="true" />
                  {label}
                </div>
              ))}
            </div>

            <LocalizedLink
              href="/booking"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white border transition-all duration-300 hover:bg-white/8 hover:border-sky-400/40 mt-auto"
              style={{ borderColor: 'rgba(255,255,255,0.2)' }}
            >
              Réserver un créneau
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </LocalizedLink>
          </div>

          {/* Carte droite — Audit IA Gratuit (mise en avant) */}
          <div
            className="p-px rounded-3xl"
            style={{ background: 'linear-gradient(135deg, #5DB8F0, #22D3EE)' }}
          >
            <div
              className="flex flex-col h-full rounded-[calc(1.5rem-1px)] p-8"
              style={{ background: '#1E2A4A' }}
            >
              {/* Badge + prix */}
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(93,184,240,0.12)', color: '#5DB8F0' }}>
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  {t('audit.badge')}
                </div>
                <span className="text-sm font-medium line-through" style={{ color: 'rgba(148,163,184,0.45)' }}>
                  490€
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-2">
                {t('audit.title')}
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(148,163,184,0.8)' }}>
                {t('audit.subtitle')}
              </p>

              {/* 4 bénéfices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8 flex-1">
                {auditBenefits.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-sky-400" aria-hidden="true" />
                    <span className="text-sm text-white/80">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA principal */}
              <LocalizedLink
                href="/booking?service=audit-ia"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-navy-900 transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 mb-3"
                style={{ background: 'linear-gradient(90deg, #5DB8F0, #22D3EE)', boxShadow: '0 6px 24px rgba(93,184,240,0.3)' }}
                aria-label={t('audit.cta')}
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                {t('audit.cta')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </LocalizedLink>

              <p className="text-xs text-center" style={{ color: 'rgba(148,163,184,0.45)' }}>
                {t('audit.note')}
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-5 mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {trustBadges.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                    <span className="text-xs" style={{ color: 'rgba(148,163,184,0.6)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
