'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, Smartphone, Monitor, Radio } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { DEMO_URL } from '@/lib/site-config';
import type { TranslationKey } from '@/locales';

interface Project {
  /** Nom propre du projet — non traduit. */
  name: string;
  sectorKey: TranslationKey;
  descKey: TranslationKey;
  image: string;
  url: string;
  /** Briques techniques mises en avant sur la carte. */
  stack: string[];
}

/**
 * Une seule source de vérité pour les réalisations affichées en home.
 * Chaque projet n'est rendu qu'une fois dans le DOM : la même liste devient
 * un carrousel scroll-snap en mobile et une grille à partir de md (voir plus bas).
 */
const portfolio: Project[] = [
  {
    name: 'Arthan Boutique Hotel',
    sectorKey: 'portfolio.arthan.sector',
    descKey: 'portfolio.arthan.desc',
    image: '/assets/portfolio/arthan-hotel.webp',
    url: 'https://arthan-hotel.netlify.app/',
    stack: ['React', 'FR / EN', 'Moteur de réservation'],
  },
  {
    name: 'OstéoParis',
    sectorKey: 'portfolio.osteo.sector',
    descKey: 'portfolio.osteo.desc',
    image: '/assets/portfolio/osteo-paris.webp',
    url: 'https://neuraweb-sante.netlify.app/',
    stack: ['React', 'Prise de RDV', 'Formulaire RGPD'],
  },
  {
    name: 'Sin Fronteras Tours',
    sectorKey: 'portfolio.tours.sector',
    descKey: 'portfolio.tours.desc',
    image: '/assets/portfolio/traveltour.webp',
    url: 'https://traveltour-agency.netlify.app/',
    stack: ['React', 'ES / EN / FR', 'Catalogue de tours'],
  },
  {
    name: 'Minimal Store',
    sectorKey: 'portfolio.shop.sector',
    descKey: 'portfolio.shop.desc',
    image: '/assets/portfolio/ecommerce.webp',
    url: 'https://neuraweb-ecommerce.netlify.app/',
    stack: ['React', 'Panier & favoris', 'Catalogue filtrable'],
  },
  {
    name: 'Lūm',
    sectorKey: 'portfolio.lum.sector',
    descKey: 'portfolio.lum.desc',
    image: '/assets/portfolio/lum-paris.webp',
    url: 'https://lum-paris.netlify.app/',
    stack: ['React', 'Animations', 'Réservation'],
  },
  {
    name: 'Hostal Paradis',
    sectorKey: 'portfolio.hostal.sector',
    descKey: 'portfolio.hostal.desc',
    image: '/assets/portfolio/hostal-paradis.webp',
    url: 'https://hostal-paradis.netlify.app/',
    stack: ['React', 'Tarifs par chambre', 'Demande de réservation'],
  },
];

export function PortfolioSection() {
  const { t } = useTranslation();

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="bg-gradient-to-br from-surface via-frost to-surface py-20 md:py-28 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950"
    >
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-10 max-w-2xl md:mb-14">
          <h2
            id="portfolio-heading"
            className="text-3xl font-bold leading-tight text-gray-900 md:text-5xl dark:text-white"
          >
            {t('portfolio.section.title.start')}{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-300 dark:to-violet-300">
              {t('portfolio.section.title.highlight')}
            </span>
          </h2>
          <p className="mt-4 text-base text-gray-700 md:text-lg dark:text-neutral-300">
            {t('portfolio.section.subtitle')}
          </p>
        </header>

        {/* ── Réalisation phare : la démo interactive maison ──────────────
            Seule réalisation qui prouve le back-office métier, le mobile et
            la synchro temps réel — d'où le traitement pleine largeur. */}
        <article className="mb-10 overflow-hidden rounded-3xl border border-indigo-200/60 bg-white shadow-sm md:mb-14 dark:border-indigo-400/20 dark:bg-white/5">
          <div className="grid items-center gap-0 lg:grid-cols-[1.15fr_1fr]">
            <a
              href={`${DEMO_URL}/c/collectivite`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[16/10] overflow-hidden bg-navy-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <Image
                src="/assets/portfolio/connected-suite.webp"
                alt={t('portfolio.suite.imageAlt')}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <span className="absolute left-4 top-4 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                {t('portfolio.suite.badge')}
              </span>
            </a>

            <div className="p-6 md:p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                NeuraWeb Connected Suite
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-600 dark:text-neutral-300">
                {t('portfolio.suite.desc')}
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  { Icon: Monitor, key: 'portfolio.suite.feature.backoffice' as TranslationKey },
                  { Icon: Smartphone, key: 'portfolio.suite.feature.mobile' as TranslationKey },
                  { Icon: Radio, key: 'portfolio.suite.feature.realtime' as TranslationKey },
                ].map(({ Icon, key }) => (
                  <li key={key} className="flex items-start gap-3 text-sm text-gray-700 dark:text-neutral-300">
                    <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-6 flex flex-wrap gap-2" aria-label={t('portfolio.modal.technologies')}>
                {['Next.js 16', 'React 19', 'Zustand', 'PWA'].map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-white/10 dark:text-neutral-200"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={`${DEMO_URL}/c/collectivite`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  {t('portfolio.suite.ctaCollectivite')}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:border-indigo-400 hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-white/20 dark:text-neutral-100 dark:hover:text-indigo-300"
                >
                  {t('portfolio.suite.ctaAll')}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </article>

        {/*
          Un seul rendu pour les deux affichages :
          - < md : rail horizontal scroll-snap (défilement natif, pas de JS)
          - ≥ md : grille 2 colonnes, puis 3 à partir de lg
        */}
        <ul
          className="
            -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4
            [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
            md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0
            lg:grid-cols-3
          "
        >
          {portfolio.map((project) => (
            <li
              key={project.url}
              className="w-[85vw] shrink-0 snap-start sm:w-[55vw] md:w-auto md:shrink"
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-white/10 dark:bg-white/5 dark:hover:border-indigo-400/50"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-navy-900">
                  <Image
                    src={project.image}
                    alt={`${project.name} — ${t(project.sectorKey)}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 85vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {t(project.sectorKey)}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-neutral-300">
                    {t(project.descKey)}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-2" aria-label={t('portfolio.modal.technologies')}>
                    {project.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-white/10 dark:text-neutral-200"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors group-hover:text-indigo-500 dark:text-indigo-300">
                    {t('portfolio.modal.view')}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
