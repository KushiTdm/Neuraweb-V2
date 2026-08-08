'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, Calendar, Check, Sparkles, Lock, Clock, Monitor, TrendingUp, Shield, Headphones, X } from 'lucide-react';
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
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// ── Modal générique — bottom-sheet propre ────────────────────────────────────
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden />
      {/* Feuille */}
      <div
        className="relative z-10 w-full sm:max-w-[420px] rounded-t-[28px] sm:rounded-[28px]"
        style={{ background: '#16213A', maxHeight: '92dvh', overflowY: 'auto' }}
      >
        {/* Handle drag + ligne accent */}
        <div className="flex flex-col items-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }} />
        </div>
        {children}
      </div>
    </div>
  );
}

export function CTASection() {
  const { t, language } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [openModal, setOpenModal] = useState<'booking' | 'audit' | null>(null);
  const closeModal = useCallback(() => setOpenModal(null), []);

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
  // Chaque valeur doit être un sous-texte exact du `cta.title` de la locale
  // correspondante (cf. locales/*.ts) — c'est ce segment qui reçoit le
  // soulignement dessiné à la main.
  const visionKeyword = { fr: 'votre vision', en: 'your vision', es: 'tu visión', vi: 'tầm nhìn của bạn' };
  const foundKeyword = Object.values(visionKeyword).find((kw) =>
    rawTitle.toLowerCase().includes(kw.toLowerCase())
  );

  return (
    <>
      <section
        ref={sectionRef}
        className="relative overflow-hidden py-16 sm:py-24 lg:py-32"
        style={{ background: '#070F26' }}
      >
        {/* Orbes de fond */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(93,184,240,0.14), transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-[90px]" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.10), transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── En-tête centré ────────────────────────────────── */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="animate-on-scroll fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white mb-6 sm:mb-8" style={{ background: 'rgba(255,255,255,0.1)' }}>
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

          {/* ── Mobile : deux boutons qui ouvrent des modals ─── */}
          <div className="animate-on-scroll fade-up delay-200 flex flex-col gap-3 sm:hidden mb-2">
            {/* Bouton Appel découverte */}
            <button
              onClick={() => setOpenModal('booking')}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border text-left transition-all duration-200 active:scale-[.98]"
              style={{ background: '#1E2A4A', borderColor: 'rgba(93,184,240,0.18)' }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0" style={{ background: 'rgba(93,184,240,0.1)' }}>
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">{t('cta.bookCall')}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.65)' }}>{t('cta.callDuration')}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white flex-shrink-0" />
            </button>

            {/* Bouton Audit IA Gratuit */}
            <button
              onClick={() => setOpenModal('audit')}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl text-left transition-all duration-200 active:scale-[.98] relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(93,184,240,0.15), rgba(34,211,238,0.1))', border: '1px solid rgba(93,184,240,0.35)' }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0" style={{ background: 'rgba(93,184,240,0.15)' }}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm leading-tight">{t('audit.title')}</p>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                      {t('audit.badge')}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.65)' }}>{t('audit.value')}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white flex-shrink-0" />
            </button>
          </div>

          {/* ── Desktop : deux cartes côte à côte (masqué sur mobile) ── */}
          <div className="animate-on-scroll fade-up delay-200 hidden sm:grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">

            {/* Carte gauche — Appel découverte (simple) */}
            <div
              className="flex flex-col rounded-3xl p-8 border"
              style={{ background: '#1E2A4A', borderColor: 'rgba(93,184,240,0.15)' }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-6" style={{ background: 'rgba(93,184,240,0.1)' }}>
                <Calendar className="w-6 h-6 text-white" aria-hidden="true" />
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-3">
                {t('cta.bookCall')}
              </h3>

              <p className="text-sm leading-relaxed mb-8 flex-1" style={{ color: 'rgba(148,163,184,0.8)' }}>
                {t('cta.discoveryDescription')}
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {featureBadges.map(({ icon: Icon, label }) => (
                  <div key={label} className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: 'rgba(148,163,184,0.7)' }}>
                    <Icon className="w-3.5 h-3.5 text-white flex-shrink-0" aria-hidden="true" />
                    {label}
                  </div>
                ))}
              </div>

              <LocalizedLink
                href="/booking"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white border transition-all duration-300 hover:bg-white/8 hover:border-white/40 mt-auto"
                style={{ borderColor: 'rgba(255,255,255,0.2)' }}
              >
                {t('cta.bookSlot')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </LocalizedLink>
            </div>

            {/* Carte droite — Audit IA Gratuit (mise en avant) */}
            <div
              className="p-px rounded-3xl"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <div
                className="flex flex-col h-full rounded-[calc(1.5rem-1px)] p-8"
                style={{ background: '#1E2A4A' }}
              >
                {/* Badge + prix */}
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.12)', color: '#ffffff' }}>
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    {t('audit.badge')}
                  </div>
                  {/* Pas de prix EUR affiché sur vi (règle du site — mode devis) */}
                  {language !== 'vi' && (
                    <span className="text-sm font-medium line-through" style={{ color: 'rgba(148,163,184,0.45)' }}>
                      490€
                    </span>
                  )}
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
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-white" aria-hidden="true" />
                      <span className="text-sm text-white/80">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTA principal */}
                <LocalizedLink
                  href="/booking?service=audit-ia"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-navy-900 transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 mb-3"
                  style={{ background: '#ffffff', boxShadow: '0 6px 24px rgba(255,255,255,0.25)' }}
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
                      <Icon className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                      <span className="text-xs" style={{ color: 'rgba(148,163,184,0.6)' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modal Appel découverte ─────────────────────────────────────── */}
      <Modal open={openModal === 'booking'} onClose={closeModal}>
        {/* Header : icône + titre + close */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.12)' }}>
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{t('cta.bookCall')}</p>
              <p className="text-xs text-white">Appel 30 min · Gratuit</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)' }}
            aria-label={t('portfolio.modal.close')}
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Séparateur */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 20px' }} />

        {/* Corps */}
        <div className="px-5 pt-4 pb-6">
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(148,163,184,0.85)' }}>
            Échangez avec notre équipe en 30 minutes. Présentez votre projet, obtenez un premier avis technique et explorez les pistes d&apos;optimisation adaptées à votre activité.
          </p>
          <div className="flex flex-wrap gap-2.5 mb-5">
            {featureBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(148,163,184,0.8)' }}>
                <Icon className="w-3 h-3 text-white flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
          <LocalizedLink
            href="/booking"
            onClick={closeModal}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white transition-all duration-200"
            style={{ background: 'rgba(93,184,240,0.15)', border: '1px solid rgba(93,184,240,0.3)' }}
          >
            {t('cta.bookSlot')}
            <ArrowRight size={15} />
          </LocalizedLink>
        </div>
      </Modal>

      {/* ── Modal Audit IA Gratuit ─────────────────────────────────────── */}
      <Modal open={openModal === 'audit'} onClose={closeModal}>
        {/* Ligne accent gradient en haut */}
        <div className="h-0.5 mx-5 rounded-full mb-0" style={{ background: '#ffffff' }} />

        {/* Header : badge + prix + close */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.12)', color: '#ffffff' }}>
              <Sparkles className="w-3 h-3" />
              {t('audit.badge')}
            </div>
            {language !== 'vi' && (
              <span className="text-xs font-medium line-through" style={{ color: 'rgba(148,163,184,0.4)' }}>490€</span>
            )}
          </div>
          <button
            onClick={closeModal}
            className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)' }}
            aria-label={t('portfolio.modal.close')}
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Séparateur */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 20px' }} />

        {/* Corps */}
        <div className="px-5 pt-4 pb-6">
          <h3 className="font-display text-xl font-bold text-white mb-1.5">{t('audit.title')}</h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(148,163,184,0.8)' }}>{t('audit.subtitle')}</p>

          <div className="flex flex-col gap-2 mb-5">
            {auditBenefits.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(93,184,240,0.15)' }}>
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-sm text-white/80">{item}</span>
              </div>
            ))}
          </div>

          <LocalizedLink
            href="/booking?service=audit-ia"
            onClick={closeModal}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-navy-900 mb-2"
            style={{ background: '#ffffff', boxShadow: '0 4px 20px rgba(93,184,240,0.35)' }}
          >
            <Sparkles className="w-4 h-4" />
            {t('audit.cta')}
            <ArrowRight className="w-4 h-4" />
          </LocalizedLink>

          <p className="text-xs text-center mb-4" style={{ color: 'rgba(148,163,184,0.4)' }}>{t('audit.note')}</p>

          <div className="flex flex-wrap justify-center gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1">
                <Icon className="w-3 h-3 text-white" />
                <span className="text-[11px]" style={{ color: 'rgba(148,163,184,0.55)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
