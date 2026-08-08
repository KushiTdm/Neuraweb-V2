'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { PillButton } from '@/components/ui/pill-button';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import type { TranslationKey } from '@/locales';

const TESTIMONIALS: { nameKey: TranslationKey; companyKey: TranslationKey; textKey: TranslationKey }[] = [
  { nameKey: 'testimonials.maria.name',    companyKey: 'testimonials.maria.company',    textKey: 'testimonials.maria.text'    },
  { nameKey: 'testimonials.sanji.name',    companyKey: 'testimonials.sanji.company',    textKey: 'testimonials.sanji.text'    },
  { nameKey: 'testimonials.hermes.name',   companyKey: 'testimonials.hermes.company',   textKey: 'testimonials.hermes.text'   },
  { nameKey: 'testimonials.ludwik.name',   companyKey: 'testimonials.ludwik.company',   textKey: 'testimonials.ludwik.text'   },
  { nameKey: 'testimonials.christian.name',companyKey: 'testimonials.christian.company',textKey: 'testimonials.christian.text'},
  { nameKey: 'testimonials.leila.name',    companyKey: 'testimonials.leila.company',    textKey: 'testimonials.leila.text'    },
];

const SECTION_LABELS: Record<string, { chip: string; title: string; cta: string }> = {
  fr: { chip: 'Témoignages', title: 'Ce que nos clients disent de NeuraWeb', cta: 'Démarrer un projet' },
  en: { chip: 'Testimonials', title: 'What our clients say about NeuraWeb',  cta: 'Start a project'   },
  es: { chip: 'Testimonios',  title: 'Lo que nuestros clientes dicen de NeuraWeb', cta: 'Iniciar un proyecto' },
  vi: { chip: 'Đánh giá',     title: 'Khách hàng nói gì về NeuraWeb',        cta: 'Bắt đầu dự án'      },
};

export function TestimonialsSection() {
  const { language, t } = useTranslation();
  const labels = SECTION_LABELS[(language as string)] ?? SECTION_LABELS.fr;

  const items = TESTIMONIALS.map((item) => ({
    quote: t(item.textKey),
    name:  t(item.nameKey),
    title: t(item.companyKey),
  }));

  return (
    <section className="py-20 lg:py-28 overflow-hidden" style={{ background: '#F7FAFD' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            <span className="section-chip section-chip-light mb-4 inline-flex">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {labels.chip}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-xl">
              {labels.title}
            </h2>
          </div>
          <div className="flex-shrink-0">
            <PillButton href="/contact" variant="light">{labels.cta}</PillButton>
          </div>
        </div>
      </div>

      <InfiniteMovingCards
        items={items}
        direction="left"
        speed="normal"
        pauseOnHover
        className="mx-auto"
      />
    </section>
  );
}
