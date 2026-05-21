'use client';

import React from 'react';
import { HeroParallax } from '@/components/ui/hero-parallax';
import { useTranslation } from '@/hooks/use-translation';
import type { TranslationKey } from '@/locales';

interface Project {
  titleKey: TranslationKey;
  image: string;
  url?: string;
}

const portfolio: Project[] = [
  {
    titleKey: 'portfolio.ecommerce.title',
    image: '/assets/ecommerce/ecommerceCompressed.webp',
    url: 'https://neuraweb-ecommerce.netlify.app/',
  },
  {
    titleKey: 'portfolio.fitness.title',
    image: '/assets/Fit/fitCompressed.webp',
    url: 'https://fitnessandhappiness.netlify.app/',
  },
  {
    titleKey: 'portfolio.beauty.title',
    image: '/assets/Lum/Lum-Cover.webp',
    url: 'https://lum-paris.netlify.app/',
  },
  {
    titleKey: 'portfolio.booking.title',
    image: '/assets/osteoCanin/osteoCanin.webp',
    url: 'https://osteocanin.onrender.com/',
  },
  {
    titleKey: 'portfolio.hotel.title',
    image: '/assets/hotel/hotel.webp',
    url: 'https://arthan-hotel.netlify.app/',
  },
];

export function PortfolioSection() {
  const { t } = useTranslation();

  // HeroParallax needs 15 items (3 rows × 5); repeat the 5 projects three times
  const products = [...portfolio, ...portfolio, ...portfolio].map((p) => ({
    title: t(p.titleKey),
    link: p.url ?? '#',
    thumbnail: p.image,
  }));

  const header = (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h2
        id="portfolio-heading"
        className="text-2xl md:text-7xl font-bold text-gray-900 dark:text-white"
      >
        {t('portfolio.section.title.start')}{' '}
        <span className="bg-gradient-to-r from-sky-400 to-cyan-500 bg-clip-text text-transparent">
          {t('portfolio.section.title.highlight')}
        </span>
      </h2>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-gray-700 dark:text-neutral-200">
        {t('portfolio.section.subtitle')}
      </p>
    </div>
  );

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="bg-gradient-to-br from-surface via-frost to-surface dark:from-navy-950 dark:via-navy-900 dark:to-navy-950"
    >
      <HeroParallax products={products} header={header} />
    </section>
  );
}
