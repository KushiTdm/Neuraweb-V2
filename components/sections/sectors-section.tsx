'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';
import { PAGE_THEMES } from '@/lib/page-themes';

// Section « Pour votre métier » : les secteurs sont présentés À PART des services
// (les services = ce que l'on fait ; les secteurs = pour qui). Chaque carte porte la paire de
// couleurs de sa page et une étiquette « Secteur ». Voir docs/brand/IA_SERVICES_SECTEURS.md.
const SECTORS = [
  { key: 'sante', href: '/sante', theme: PAGE_THEMES.sante, image: '/assets/redesign/pages/sante-hero.webp' },
  { key: 'restaurants', href: '/restaurants', theme: PAGE_THEMES.restaurants, image: '/assets/redesign/pages/restaurants-hero.webp' },
  { key: 'collectivites', href: '/collectivites', theme: PAGE_THEMES.collectivites, image: '/assets/redesign/pages/collectivites-hero.webp' },
] as const;

const ALTS: Record<string, Record<string, string>> = {
  fr: { sante: 'Salle de soin lumineuse avec une table en bois et une plante', restaurants: 'Table dressée vue du dessus avec une assiette de saison', collectivites: 'Illustration d\'une mairie et de citoyens de tous âges' },
  en: { sante: 'Bright treatment room with a wooden table and a plant', restaurants: 'Set table seen from above with a seasonal dish', collectivites: 'Illustration of a town hall and citizens of all ages' },
  es: { sante: 'Sala de tratamiento luminosa con camilla de madera y una planta', restaurants: 'Mesa puesta vista desde arriba con un plato de temporada', collectivites: 'Ilustración de un ayuntamiento y ciudadanos de todas las edades' },
  vi: { sante: 'Phòng trị liệu sáng sủa với bàn gỗ và một chậu cây', restaurants: 'Bàn ăn nhìn từ trên cao với một món ăn theo mùa', collectivites: 'Minh họa một tòa thị chính và người dân mọi lứa tuổi' },
};

export function SectorsSection() {
  const { language, t } = useTranslation();
  const alts = ALTS[language as string] ?? ALTS.fr;

  return (
    <section className="sec-screen bg-chypre-20 py-20 lg:py-28" aria-labelledby="sectors-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="mb-4 inline-flex rounded-full bg-chypre px-4 py-1.5 text-xs font-semibold tracking-widest text-creme">{t('sectors.chip')}</span>
          <h2 id="sectors-heading" className="font-impact text-4xl font-black leading-[1.05] tracking-tight text-chypre sm:text-5xl lg:text-6xl">
            {t('sectors.title')}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-chypre/90 sm:text-lg">{t('sectors.sub')}</p>
        </div>

        <ul className="grid gap-5 md:grid-cols-3 sv-stagger">
          {SECTORS.map(({ key, href, theme, image }) => (
            <li key={key} className="sv-rise">
              <LocalizedLink
                href={href}
                className="group flex h-full flex-col overflow-hidden rounded-3xl lift transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(0,70,67,0.25)]"
                style={{ backgroundColor: theme.bg, color: theme.fg }}
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={image}
                    alt={alts[key]}
                    fill
                    sizes="(max-width:768px) 92vw, 400px"
                    className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
                    loading="lazy"
                  />
                  <span
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
                    style={{ backgroundColor: theme.fg, color: theme.bg }}
                  >
                    {t('sectors.badge')}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-bold leading-tight sm:text-2xl">{t(`nav.dropdown.${key}.label` as any)}</h3>
                  <p className="mt-3 text-sm leading-relaxed opacity-90 sm:text-base">{t(`sectors.${key}.hook` as any)}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5">
                    {t('sectors.cta')} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </LocalizedLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
