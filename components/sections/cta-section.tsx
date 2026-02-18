'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, FileText, TrendingUp, Shield, Headphones, Sparkles } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

export function CTASection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          entry.target.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
            setTimeout(() => el.classList.add('animate-in'), i * 120);
          });
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: TrendingUp, label: t('cta.guaranteedGrowth'), color: '#22d3ee' },
    { icon: Shield,     label: t('cta.secure'),           color: '#4ade80' },
    { icon: Headphones, label: t('cta.dedicatedSupport'), color: '#a78bfa' },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-snap relative overflow-hidden bg-[#050510]"
    >
      {/* ── Fond : mesh gradient animé ──────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Orbes de couleur */}
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #4f46e5, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-10 blur-[60px]"
          style={{ background: 'radial-gradient(circle, #22d3ee, transparent 70%)' }}
        />

        {/* Grille subtile */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Ligne lumineuse en haut */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #22d3ee, transparent)' }}
        />
      </div>

      {/* ── Contenu ──────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">

        {/* Badge */}
        <div className="animate-on-scroll fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium text-gray-300 mb-8">
          <Sparkles size={14} className="text-brand-400" />
          {t('cta.subtitle')}
        </div>

        {/* Titre principal */}
        <h2 className="animate-on-scroll fade-up delay-100 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
          {t('cta.title').split('?')[0]}
          <span className="gradient-text-hero">?</span>
        </h2>

        {/* Sous-titre */}
        <p className="animate-on-scroll fade-up delay-200 text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          {t('cta.subtitle')}
        </p>

        {/* Boutons CTA */}
        <div className="animate-on-scroll fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center mb-16">
          {/* Bouton principal */}
          <Link
            href="/booking"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: '0 8px 30px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(79,70,229,0.55), inset 0 1px 0 rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.1)';
            }}
          >
            <Calendar size={18} />
            {t('cta.bookCall')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Bouton secondaire */}
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-300 border border-white/15 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/25"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <FileText size={18} />
            {t('cta.requestQuote')}
          </Link>
        </div>

        {/* Features */}
        <div className="animate-on-scroll fade-up delay-400 flex flex-wrap justify-center gap-6 sm:gap-10">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex items-center gap-2.5 group">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
                >
                  <Icon size={15} style={{ color: f.color }} />
                </div>
                <span className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                  {f.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Ligne décorative bas */}
        <div className="mt-16 gradient-line opacity-40" />
      </div>
    </section>
  );
}
