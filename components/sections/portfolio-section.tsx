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
      className="bg-chypre-20 py-20 md:py-28 sec-screen"
    >
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-10 max-w-2xl md:mb-14">
          <h2
            id="portfolio-heading"
            className="font-impact text-3xl font-black leading-tight text-chypre md:text-5xl"
          >
            {t('portfolio.section.title.start')}{' '}
            <span className="text-chypre">
              {t('portfolio.section.title.highlight')}
            </span>
          </h2>
          <p className="mt-4 text-base text-chypre/90 md:text-lg">
            {t('portfolio.section.subtitle')}
          </p>
        </header>

        {/* ── Réalisation phare : la démo interactive maison ──────────────
            Seule réalisation qui prouve le back-office métier, le mobile et
            la synchro temps réel — d'où le traitement pleine largeur. */}
        <article className="mb-10 overflow-hidden rounded-3xl border border-chypre/20 bg-creme shadow-sm md:mb-14">
          <div className="grid items-center gap-0 lg:grid-cols-[1.15fr_1fr]">
            <a
              href={`${DEMO_URL}/c/collectivite`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[16/9] overflow-hidden bg-chypre sm:aspect-[16/10] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chypre"
            >
              <Image
                src="/assets/portfolio/connected-suite.webp"
                alt={t('portfolio.suite.imageAlt')}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <span className="absolute left-4 top-4 rounded-full bg-chypre px-3 py-1 text-xs font-semibold text-creme shadow-lg">
                {t('portfolio.suite.badge')}
              </span>
            </a>

            <div className="p-5 md:p-8 lg:p-10">
              <h3 className="text-xl font-bold text-chypre sm:text-2xl md:text-3xl">
                NeuraWeb Connected Suite
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-chypre/80 sm:mt-3 sm:line-clamp-none sm:text-base">
                {t('portfolio.suite.desc')}
              </p>

              <ul className="mt-6 hidden space-y-3 sm:block">
                {[
                  { Icon: Monitor, key: 'portfolio.suite.feature.backoffice' as TranslationKey },
                  { Icon: Smartphone, key: 'portfolio.suite.feature.mobile' as TranslationKey },
                  { Icon: Radio, key: 'portfolio.suite.feature.realtime' as TranslationKey },
                ].map(({ Icon, key }) => (
                  <li key={key} className="flex items-start gap-3 text-sm text-chypre/90">
                    <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-chypre" aria-hidden="true" />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-6 hidden flex-wrap gap-2 sm:flex" aria-label={t('portfolio.modal.technologies')}>
                {['Next.js 16', 'React 19', 'Zustand', 'PWA'].map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md bg-chypre/10 px-2 py-1 text-xs font-medium text-chypre/90"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-3 sm:mt-7">
                <a
                  href={`${DEMO_URL}/c/collectivite`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-chypre px-5 py-2.5 text-sm font-semibold text-creme transition-colors hover:bg-chypre/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chypre"
                >
                  {t('portfolio.suite.ctaCollectivite')}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden items-center gap-1.5 rounded-full border border-chypre/40 px-5 sm:inline-flex py-2.5 text-sm font-semibold text-chypre transition-colors hover:border-chypre hover:bg-chypre/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chypre"
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
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-chypre/15 bg-creme shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-chypre/40 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chypre"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-chypre/10">
                      <Image
                        src={project.image}
                        alt={copy === 1 ? '' : `${project.name} — ${t(project.sectorKey)}`}
                        fill
                        sizes="(min-width: 640px) 384px, 85vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-chypre/90 px-3 py-1 text-xs font-medium text-creme backdrop-blur-sm">
                        {t(project.sectorKey)}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-bold text-chypre">{project.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-chypre/80">
                        {t(project.descKey)}
                      </p>

                      <ul className="mt-4 flex flex-wrap gap-2" aria-label={t('portfolio.modal.technologies')}>
                        {project.stack.map((tech) => (
                          <li
                            key={tech}
                            className="rounded-md bg-chypre/10 px-2 py-1 text-xs font-medium text-chypre/90"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>

                      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-chypre transition-colors group-hover:text-indigo-500">
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
                  href="/secteurs/restaurants-hotels"
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="group flex h-full min-h-[18rem] flex-col items-start justify-center rounded-2xl border border-dashed border-chypre/40 bg-chypre/5 p-6 transition-colors hover:border-chypre hover:bg-chypre/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chypre"
                >
                  <h3 className="text-lg font-bold text-chypre">{t('portfolio.restaurant.seeAllTitle')}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-chypre/80">{t('portfolio.restaurant.seeAllDesc')}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-chypre">
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
            className="group mt-10 flex flex-col items-start gap-5 rounded-2xl border border-chypre/30 bg-creme p-6 transition-colors hover:border-chypre sm:flex-row sm:items-center sm:justify-between md:mt-14 md:p-8"
          >
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-chypre px-3 py-1 text-xs font-semibold text-creme">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {t('portfolio.vietnam.badge')}
              </span>
              <h3 className="mt-3 text-xl font-bold text-chypre md:text-2xl">
                {t('portfolio.vietnam.title')}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-chypre/90 md:text-base">
                {t('portfolio.vietnam.desc')}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-chypre px-5 py-2.5 text-sm font-semibold text-creme transition-colors group-hover:bg-chypre/90">
              {t('portfolio.vietnam.cta')}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </a>
        )}
      </div>
    </section>
  );
}
