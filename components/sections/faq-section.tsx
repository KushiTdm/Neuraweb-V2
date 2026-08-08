'use client';

import React, { useState } from 'react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';
import { HOME_FAQ_ITEMS } from '@/lib/structured-data';

const SECTION_LABELS: Record<string, { chip: string; title1: string; title2: string; subtitle: string; cta: string }> = {
  fr: {
    chip: 'FAQ',
    title1: 'Questions',
    title2: 'fréquentes',
    subtitle: 'Délais, tarifs, IA, automatisation — les réponses aux questions qu\'on nous pose le plus souvent.',
    cta: 'Une autre question ? Contactez-nous',
  },
  en: {
    chip: 'FAQ',
    title1: 'Frequently asked',
    title2: 'questions',
    subtitle: 'Timelines, pricing, AI, automation — answers to the questions we hear most often.',
    cta: 'Another question? Contact us',
  },
  es: {
    chip: 'FAQ',
    title1: 'Preguntas',
    title2: 'frecuentes',
    subtitle: 'Plazos, precios, IA, automatización — respuestas a las preguntas que más nos hacen.',
    cta: '¿Otra pregunta? Contáctanos',
  },
  vi: {
    chip: 'FAQ',
    title1: 'Câu hỏi',
    title2: 'thường gặp',
    subtitle: 'Thời gian, chi phí, AI, tự động hóa — giải đáp những thắc mắc chúng tôi nhận được nhiều nhất.',
    cta: 'Bạn còn câu hỏi khác? Liên hệ với chúng tôi',
  },
};

export function FAQSection() {
  const { language } = useTranslation();
  const labels = SECTION_LABELS[(language as string)] ?? SECTION_LABELS.fr;
  const items = HOME_FAQ_ITEMS[(language as 'fr' | 'en' | 'es' | 'vi')] ?? HOME_FAQ_ITEMS.fr;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 lg:py-32 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest bg-frost text-navy-900 border border-white/20 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            {labels.chip}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            <span className="text-navy-900">{labels.title1} </span>
            <span style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed,#0891b2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {labels.title2}
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-4 max-w-xl mx-auto">
            {labels.subtitle}
          </p>
        </div>

        {/* Accordéon — les réponses restent dans le DOM (repliées en CSS) pour
            que le contenu balisé FAQPage soit visible des crawlers. */}
        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-navy-900/10 overflow-hidden transition-shadow duration-200 hover:shadow-md"
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-display text-base sm:text-lg font-bold text-navy-900">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-navy-900/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={`faq-answer-${i}`}
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <LocalizedLink
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy-900 border border-navy-900/20 rounded-full px-6 py-3 hover:bg-navy-900 hover:text-white transition-all duration-200 group"
          >
            {labels.cta}
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}
