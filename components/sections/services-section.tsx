'use client';

import React from 'react';
import Image from 'next/image';
import { Code, Bot, Brain, Smartphone, ArrowUpRight, Sparkles } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';
import { CardsCarousel } from '@/components/ui/cards-carousel';

const SECTION_LABELS: Record<string, { chip: string; title1: string; title2: string; cta: string }> = {
  fr: { chip: 'NOS SERVICES', title1: 'Des solutions digitales', title2: 'pour scaler votre business', cta: 'Voir tous nos services' },
  en: { chip: 'OUR SERVICES',  title1: 'Digital solutions',       title2: 'to scale your business',    cta: 'View all services'      },
  es: { chip: 'NUESTROS SERVICIOS', title1: 'Soluciones digitales', title2: 'para escalar tu negocio', cta: 'Ver todos los servicios' },
};

// SVG constellation pour la carte IA
function ConstellationSVG() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 200 300" fill="none" aria-hidden>
      {([[30,40],[80,25],[150,50],[170,120],[120,160],[60,200],[20,260],[100,240],[160,280],[140,80]] as [number,number][]).map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="#5DB8F0" />
      ))}
      <line x1="30" y1="40" x2="80" y2="25" stroke="#5DB8F0" strokeWidth="0.5"/>
      <line x1="80" y1="25" x2="150" y2="50" stroke="#5DB8F0" strokeWidth="0.5"/>
      <line x1="150" y1="50" x2="170" y2="120" stroke="#5DB8F0" strokeWidth="0.5"/>
      <line x1="170" y1="120" x2="120" y2="160" stroke="#5DB8F0" strokeWidth="0.5"/>
      <line x1="120" y1="160" x2="60" y2="200" stroke="#22D3EE" strokeWidth="0.5"/>
      <line x1="60" y1="200" x2="20" y2="260" stroke="#5DB8F0" strokeWidth="0.5"/>
      <line x1="60" y1="200" x2="100" y2="240" stroke="#22D3EE" strokeWidth="0.5"/>
      <line x1="100" y1="240" x2="160" y2="280" stroke="#22D3EE" strokeWidth="0.5"/>
      <line x1="140" y1="80" x2="150" y2="50" stroke="#5DB8F0" strokeWidth="0.5"/>
      <line x1="140" y1="80" x2="170" y2="120" stroke="#22D3EE" strokeWidth="0.5"/>
    </svg>
  );
}

export function ServicesSection() {
  const { language, t } = useTranslation();
  const labels = SECTION_LABELS[(language as string)] ?? SECTION_LABELS.fr;

  return (
    <section className="py-24 lg:py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest bg-frost text-navy-900 border border-sky-400/20 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              {labels.chip}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-xl">
              <span className="text-navy-900">{labels.title1}</span>
              <br />
              <span style={{ background: 'linear-gradient(90deg,#5DB8F0,#22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
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
            <div className="absolute top-0 left-0 right-0 h-0.5 z-10" style={{ background: 'linear-gradient(90deg,#5DB8F0,#22D3EE)' }} />
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
            <span className="absolute top-5 left-5 z-10 text-4xl font-bold text-sky-400/40 font-mono">01</span>
            {/* Texte en bas */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm mb-4">
                <Code className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">
                {t('services.web.title')}
              </h3>
              <p className="text-sm leading-relaxed max-w-sm text-white/70">
                {t('services.web.desc')}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 group-hover:gap-2.5 transition-all duration-200">
                En savoir plus <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </LocalizedLink>

          {/* Carte 2 — Applications Mobiles — col 8-12 / row 1 */}
          <LocalizedLink href="/mobile-app-development" className="relative col-span-5 rounded-3xl overflow-hidden bg-frost group">
            <Image
              src="/assets/services/developement_mobile.webp"
              alt="Interface mobile moderne"
              fill sizes="(max-width:1280px) 42vw, 540px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ opacity: 0.45 }}
              loading="lazy"
            />
            {/* Overlay pour lisibilité */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(232,244,253,0.3) 0%, rgba(232,244,253,0.85) 60%, rgba(232,244,253,0.98) 100%)' }} />
            {/* Badge */}
            <div className="absolute top-5 right-5 z-10">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-navy-900" style={{ background: '#5DB8F0' }}>
                MVP 6 sem.
              </span>
            </div>
            <span className="absolute top-5 left-5 z-10 text-4xl font-bold text-navy-900/20 font-mono">02</span>
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm mb-3">
                <Smartphone className="w-4 h-4 text-sky-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-navy-900 mb-1.5">
                {t('services.mobile.title')}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t('services.mobile.desc')}
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-navy-900 group-hover:gap-2 transition-all duration-200">
                En savoir plus <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </LocalizedLink>

          {/* Carte 3 — Intégration IA — col 8-10 / row 2 */}
          <LocalizedLink href="/integration-ia" className="relative col-span-3 rounded-3xl overflow-hidden group" style={{ background: '#0E1B3D' }}>
            <ConstellationSVG />
            <div className="relative z-10 p-6 h-full flex flex-col">
              <span className="text-4xl font-bold font-mono text-sky-400/30 mb-auto">03</span>
              <div>
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-sky-400/10 mb-3">
                  <Brain className="w-4 h-4 text-sky-400" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-1 leading-tight">
                  {t('services.ai.title')}
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  {t('services.ai.desc')}
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-400 group-hover:gap-1.5 transition-all duration-200">
                  En savoir plus <ArrowUpRight className="w-3 h-3" />
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
              style={{ opacity: 0.35 }}
              loading="lazy"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,15,38,0.98) 0%, rgba(7,15,38,0.6) 60%, transparent 100%)' }} />
            {/* Badge accent */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-end">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: '#0E1B3D' }}>
                <Sparkles className="w-2.5 h-2.5" />
                −4h/sem
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <span className="text-2xl font-bold font-mono text-sky-400/30 block mb-1">04</span>
              <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 mb-2">
                <Bot className="w-3.5 h-3.5 text-sky-400" />
              </div>
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
          <CardsCarousel slideWidth="snap" padding={1} gap={1} dotColor="#5DB8F0" showArrows autoPlay autoPlayInterval={4500}>
            {/* Carte 1 — Dev Web */}
            <LocalizedLink href="/services" className="relative rounded-3xl overflow-hidden group block h-[340px]">
              <Image src="/assets/services/development_web-macbook.webp" alt="Développement Web" fill sizes="85vw" className="object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,15,38,0.95) 0%, rgba(7,15,38,0.4) 60%, transparent 100%)' }} />
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg,#5DB8F0,#22D3EE)' }} />
              <span className="absolute top-5 left-5 text-3xl font-bold text-sky-400/40 font-mono">01</span>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Code className="w-6 h-6 text-sky-400 mb-3" />
                <h3 className="font-display text-2xl font-bold text-white mb-2">{t('services.web.title')}</h3>
                <p className="text-sm text-white/70">{t('services.web.desc')}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400">
                  En savoir plus <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </LocalizedLink>

            {/* Carte 2 — Mobile */}
            <LocalizedLink href="/mobile-app-development" className="relative rounded-3xl overflow-hidden bg-frost group block h-[340px]">
              <Image src="/assets/services/developement_mobile.webp" alt="Apps Mobiles" fill sizes="85vw" className="object-cover" style={{ opacity: 0.4 }} loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(232,244,253,0.2) 0%, rgba(232,244,253,0.92) 65%)' }} />
              <div className="absolute top-5 right-5 z-10">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold text-navy-900" style={{ background: '#5DB8F0' }}>
                  MVP 6 sem.
                </span>
              </div>
              <span className="absolute top-5 left-5 z-10 text-3xl font-bold text-navy-900/20 font-mono">02</span>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <Smartphone className="w-6 h-6 text-sky-400 mb-3" />
                <h3 className="font-display text-2xl font-bold text-navy-900 mb-2">{t('services.mobile.title')}</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{t('services.mobile.desc')}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                  En savoir plus <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </LocalizedLink>

            {/* Carte 3 — IA */}
            <LocalizedLink href="/integration-ia" className="relative rounded-3xl overflow-hidden group block h-[340px]" style={{ background: '#0E1B3D' }}>
              <ConstellationSVG />
              <span className="absolute top-5 left-5 text-3xl font-bold text-sky-400/30 font-mono">03</span>
              <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                <Brain className="w-6 h-6 text-sky-400 mb-3" />
                <h3 className="font-display text-2xl font-bold text-white mb-2">{t('services.ai.title')}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{t('services.ai.desc')}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400">
                  En savoir plus <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </LocalizedLink>

            {/* Carte 4 — Automatisation */}
            <LocalizedLink href="/automatisation" className="relative rounded-3xl overflow-hidden group block h-[340px]" style={{ background: '#070F26' }}>
              <Image src="/assets/services/automation_n8n.webp" alt="Automatisation" fill sizes="85vw" className="object-cover" style={{ opacity: 0.5 }} loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,15,38,0.95) 0%, transparent 60%)' }} />
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: '#0E1B3D' }}>
                  <Sparkles className="w-3 h-3" />−4h/sem
                </span>
              </div>
              <span className="absolute top-5 left-5 text-3xl font-bold text-sky-400/30 font-mono">04</span>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Bot className="w-6 h-6 text-sky-400 mb-3" />
                <h3 className="font-display text-2xl font-bold text-white mb-2">{t('services.automation.title')}</h3>
                <p className="text-sm text-white/70">{t('services.automation.desc')}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400">
                  En savoir plus <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </LocalizedLink>
          </CardsCarousel>
        </div>
      </div>
    </section>
  );
}
