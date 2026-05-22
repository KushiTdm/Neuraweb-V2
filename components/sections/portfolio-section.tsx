'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { HeroParallax } from '@/components/ui/hero-parallax';
import { useTranslation } from '@/hooks/use-translation';
import { CardsCarousel } from '@/components/ui/cards-carousel';
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
      {/* ── Desktop : HeroParallax 3D ───────────────────────── */}
      <div className="hidden md:block">
        <HeroParallax products={products} header={header} />
      </div>

      {/* ── Mobile : carousel snap horizontal ──────────────── */}
      <div className="md:hidden py-16">
        <div className="px-4 mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {t('portfolio.section.title.start')}{' '}
            <span className="bg-gradient-to-r from-sky-400 to-cyan-500 bg-clip-text text-transparent">
              {t('portfolio.section.title.highlight')}
            </span>
          </h2>
          <p className="text-base text-gray-700 dark:text-neutral-200">
            {t('portfolio.section.subtitle')}
          </p>
        </div>

        <CardsCarousel slideWidth="snap" padding={1} gap={1} dotColor="#5DB8F0" showArrows autoPlay autoPlayInterval={4000}>
          {portfolio.map((project) => (
            <a
              key={project.image}
              href={project.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block relative rounded-3xl overflow-hidden group h-[240px] shadow-lg"
            >
              <Image
                src={project.image}
                alt={t(project.titleKey)}
                fill
                sizes="85vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,15,38,0.92) 0%, rgba(7,15,38,0.3) 55%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between gap-3">
                <h3 className="text-white text-lg font-bold leading-tight">{t(project.titleKey)}</h3>
                <span className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </a>
          ))}
        </CardsCarousel>
      </div>
    </section>
  );
}
