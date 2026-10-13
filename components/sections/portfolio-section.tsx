'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import { ArrowUpRight, Smartphone, Monitor, Radio, MapPin } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';
import { DEMO_URL, HANOI_OFFERS_URL } from '@/lib/site-config';
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
    name: 'Maison Éclat',
    sectorKey: 'portfolio.maison.sector',
    descKey: 'portfolio.maison.desc',
    image: '/assets/portfolio/maison-eclat.webp',
    url: 'https://maison-eclat.san3neb.workers.dev',
    stack: ['React 18', 'Vite', 'Tailwind', 'Supabase'],
  },
  {
    name: 'L\u2019Orée',
    sectorKey: 'portfolio.loree.sector',
    descKey: 'portfolio.loree.desc',
    image: '/assets/portfolio/loree-spa.webp',
    url: 'https://loree-spa.san3neb.workers.dev',
    stack: ['Next.js 15', 'React 19', 'GSAP', 'FR / EN'],
  },
  {
    name: 'The Box CrossFit',
    sectorKey: 'portfolio.crossfit.sector',
    descKey: 'portfolio.crossfit.desc',
    image: '/assets/portfolio/crossfit-box.webp',
    url: 'https://project-crossfit.san3neb.workers.dev',
    stack: ['React 18', 'Vite', 'Tailwind', 'Supabase'],
  },
  {
    name: 'UrbX',
    sectorKey: 'portfolio.urbx.sector',
    descKey: 'portfolio.urbx.desc',
    image: '/assets/portfolio/urbx.webp',
    url: 'https://urbx.san3neb.workers.dev',
    stack: ['React 18', 'Vite', 'GSAP', 'Supabase'],
  },
  {
    name: 'Le Jardin d\u2019Or',
    sectorKey: 'portfolio.restaurant.sector',
    descKey: 'portfolio.restaurant.desc',
    image: '/assets/portfolio/restaurant-jardin-dor.webp',
    url: 'https://restaurants-jardindor.vercel.app/',
    stack: ['Menu & galerie', 'Réservation', 'Avis clients'],
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
];

export function PortfolioSection() {
  const { t, language } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

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
          Carrousel automatique : la liste est rendue deux fois et translatée de -50 %
          en boucle (la 2e copie est masquée aux lecteurs d'écran et non focusable).
          Pause au survol / focus ; avec prefers-reduced-motion : rail à défilement manuel.
        */}
        <div
          className={`-mx-4 md:mx-0 ${reduceMotion ? 'overflow-x-auto' : 'overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]'}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <motion.ul
            className="flex w-max py-2"
            animate={reduceMotion || paused ? undefined : { x: ['0%', '-50%'] }}
            transition={{ duration: 70, ease: 'linear', repeat: Infinity }}
            aria-label={t('portfolio.carousel.label')}
          >
            {(reduceMotion ? [0] : [0, 1]).flatMap((copy) => [
              ...portfolio.map((project) => (
                <li
                  key={`${copy}-${project.url}`}
                  aria-hidden={copy === 1}
                  className="w-[85vw] shrink-0 pl-4 sm:w-[24rem] md:pl-0 md:pr-6"
                >
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={copy === 1 ? -1 : undefined}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-white/10 dark:bg-white/5 dark:hover:border-indigo-400/50"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-navy-900">
                      <Image
                        src={project.image}
                        alt={copy === 1 ? '' : `${project.name} — ${t(project.sectorKey)}`}
                        fill
                        sizes="(min-width: 640px) 384px, 85vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {t(project.sectorKey)}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{project.name}</h3>
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

                      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-indigo-600 transition-colors group-hover:text-indigo-500 dark:text-indigo-300">
                        {t('portfolio.modal.view')}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </a>
                </li>
              )),
              /* Un seul modèle restaurant ci-dessus : les autres sont sur la page dédiée. */
              <li
                key={`${copy}-restaurants`}
                aria-hidden={copy === 1}
                className="w-[85vw] shrink-0 pl-4 sm:w-[24rem] md:pl-0 md:pr-6"
              >
                <LocalizedLink
                  href="/restaurants"
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="group flex h-full min-h-[18rem] flex-col items-start justify-center rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/50 p-6 transition-colors hover:border-indigo-500 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-indigo-400/30 dark:bg-indigo-400/5 dark:hover:bg-indigo-400/10"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('portfolio.restaurant.seeAllTitle')}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-neutral-300">{t('portfolio.restaurant.seeAllDesc')}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                    {t('portfolio.modal.view')}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </span>
                </LocalizedLink>
              </li>,
            ])}
          </motion.ul>
        </div>

        {/* ── Bandeau offres Vietnam (vi uniquement) ──────────────────────
            Projet distinct (monorepo Hanoi, Cloudflare Workers) : packs à prix
            fixe en đồng + démos par métier pour Hanoï. N'est pas une réalisation
            NeuraWeb parmi d'autres, d'où l'encart séparé plutôt qu'une carte
            supplémentaire dans la grille ci-dessus. */}
        {language === 'vi' && (
          <a
            href={HANOI_OFFERS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 flex flex-col items-start gap-5 rounded-2xl border border-emerald-300/60 bg-emerald-50/60 p-6 transition-colors hover:border-emerald-400 sm:flex-row sm:items-center sm:justify-between md:mt-14 md:p-8 dark:border-emerald-400/20 dark:bg-emerald-400/5 dark:hover:border-emerald-400/40"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {t('portfolio.vietnam.badge')}
              </span>
              <h3 className="mt-3 text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                {t('portfolio.vietnam.title')}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-700 md:text-base dark:text-neutral-300">
                {t('portfolio.vietnam.desc')}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-emerald-500">
              {t('portfolio.vietnam.cta')}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </a>
        )}
      </div>
    </section>
  );
}
