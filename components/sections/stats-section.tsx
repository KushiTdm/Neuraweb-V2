'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { LocalizedLink } from '@/components/localized-link';
import { useLanguage } from '@/contexts/language-context';
import { NeuraIcon, type NeuraIconName } from '@/components/icons/neura-icon';
import { ResponsiveCards } from '@/components/ui/cards-carousel';

const T = {
  fr: {
    eyebrow: 'NOS REPÈRES',
    unit1: ' ans',
    label1: 'd\'expérience en développement web',
    desc1: 'Premiers projets en 2021, freelance puis agence, et NeuraWeb depuis 2023.',
    label2: 'Continents où nous avons livré',
    desc2: 'Asie, Amérique du Sud et Europe : hôtels, restaurants, agences de voyage et cafés.',
    label3: 'Note moyenne sur Google',
    desc3: '14 avis clients publiés sur notre fiche Google, tous à 5 étoiles.',
    heading1: 'Des chiffres qui parlent',
    heading2: 'd\'eux-mêmes',
    sub: 'Depuis 2023, à distance depuis l\'Asie, l\'Amérique du Sud et l\'Europe : sites, applications et automatisations pour des hôtels, restaurants, agences de voyage et cafés.',
    learn: 'À propos de NeuraWeb',
  },
  en: {
    eyebrow: 'OUR BENCHMARKS',
    unit1: ' years',
    label1: 'of web development experience',
    desc1: 'First projects in 2021, freelance then agency, and NeuraWeb since 2023.',
    label2: 'Continents where we have delivered',
    desc2: 'Asia, South America and Europe: hotels, restaurants, travel agencies and cafés.',
    label3: 'Average Google rating',
    desc3: '14 client reviews published on our Google profile, all 5 stars.',
    heading1: 'Numbers that speak',
    heading2: 'for themselves',
    sub: 'Since 2023, working remotely from Asia, South America and Europe: websites, apps and automations for hotels, restaurants, travel agencies and cafés.',
    learn: 'About NeuraWeb',
  },
  es: {
    eyebrow: 'NUESTROS DATOS',
    unit1: ' años',
    label1: 'de experiencia en desarrollo web',
    desc1: 'Primeros proyectos en 2021, freelance, luego agencia, y NeuraWeb desde 2023.',
    label2: 'Continentes donde hemos entregado',
    desc2: 'Asia, Sudamérica y Europa: hoteles, restaurantes, agencias de viajes y cafeterías.',
    label3: 'Valoración media en Google',
    desc3: '14 reseñas de clientes publicadas en nuestra ficha de Google, todas de 5 estrellas.',
    heading1: 'Cifras que hablan',
    heading2: 'por sí solas',
    sub: 'Desde 2023, trabajando a distancia desde Asia, Sudamérica y Europa: sitios web, apps y automatizaciones para hoteles, restaurantes, agencias de viajes y cafeterías.',
    learn: 'Sobre NeuraWeb',
  },
  vi: {
    eyebrow: 'CON SỐ CỦA CHÚNG TÔI',
    unit1: ' năm',
    label1: 'kinh nghiệm phát triển web',
    desc1: 'Dự án đầu tiên năm 2021, freelance rồi làm cho agency, và NeuraWeb từ năm 2023.',
    label2: 'Châu lục đã bàn giao dự án',
    desc2: 'Châu Á, Nam Mỹ và châu Âu: khách sạn, nhà hàng, công ty du lịch và quán cà phê.',
    label3: 'Điểm đánh giá trung bình trên Google',
    desc3: '14 đánh giá của khách hàng trên trang Google của chúng tôi, tất cả đều 5 sao.',
    heading1: 'Những con số',
    heading2: 'tự nói lên tất cả',
    sub: 'Từ năm 2023, làm việc từ xa tại châu Á, Nam Mỹ và châu Âu: website, ứng dụng và tự động hóa cho khách sạn, nhà hàng, công ty du lịch và quán cà phê.',
    learn: 'Về NeuraWeb',
  },
};

// Repères vérifiables (18/10/2026) : développement depuis 2021 (5 ans) ; livraisons sur 3 continents
// (Asie, Amérique du Sud, Europe) ; 5/5 = note de la fiche Google (14 avis). « 150+ projets » et « 98 % »
// retirés : périmètre (projets perso inclus) et méthode non justifiables. Ajouter ici un décompte des
// missions clients seulement s'il est chiffré et défini.
const STATS: { value: number; suffix: string; key: string; descKey: string; icon: NeuraIconName }[] = [
  { value: 5, suffix: ' ans', key: 'label1', descKey: 'desc1', icon: 'site-web' },
  { value: 3, suffix: '', key: 'label2', descKey: 'desc2', icon: 'sante' },
  { value: 5, suffix: '/5', key: 'label3', descKey: 'desc3', icon: 'seo-geo' },
];

function StatCard({ value, suffix, label, desc, icon, started, index }: {
  value: number; suffix: string; label: string; desc: string; icon: NeuraIconName; started: boolean; index: number;
}) {
  const display = value % 1 !== 0 ? value.toFixed(1) : value;
  return (
    <div
      className="glass lift flex h-full flex-col rounded-3xl p-6 sm:p-8"
      style={{ opacity: started ? undefined : 0, animation: started ? `nwFadeInUp 0.6s ${index * 0.15}s ease both` : 'none' }}
    >
      <NeuraIcon name={icon} size={44} className="mb-3 flex-shrink-0 text-creme sm:mb-4" />
      <div
        className="mb-3 whitespace-nowrap font-impact font-black leading-none text-creme"
        style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)' }}
        aria-label={`${value}${suffix} ${label}`}
      >
        {display}{suffix}
      </div>
      <p className="mb-2 text-base font-semibold text-creme">{label}</p>
      <p className="text-sm leading-relaxed text-creme/80">{desc}</p>
    </div>
  );
}

export function StatsSection() {
  const { language } = useLanguage();
  const t = T[language as keyof typeof T] ?? T.fr;
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-chypre py-12 sm:py-24 lg:py-32 sec-screen">
      <Image
        src="/assets/redesign/motif-vagues.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-70 motion-safe:animate-[nwDrift_40s_ease-in-out_infinite_alternate]"
        aria-hidden="true"
        loading="lazy"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[40fr_60fr] lg:gap-16">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-creme/90 sm:mb-6">{t.eyebrow}</p>
            <h2 className="mb-6 font-impact text-3xl font-black leading-tight text-creme sm:text-4xl lg:text-5xl">
              {t.heading1} {t.heading2}
            </h2>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-creme/90 sm:mb-10 sm:text-base">{t.sub}</p>
            <LocalizedLink
              href="/equipe"
              className="group inline-flex items-center gap-2 rounded-full bg-creme px-6 py-3 font-semibold text-chypre transition-colors duration-200 hover:bg-white"
            >
              {t.learn}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </LocalizedLink>
          </div>

          <div>
          <ResponsiveCards breakpoint="md" gridClass="grid-cols-3" gridGap="gap-4">
            {STATS.map((s, i) => (
              <StatCard
                key={s.key}
                value={s.value}
                suffix={s.key === 'label1' ? t.unit1 : s.suffix}
                label={t[s.key as keyof typeof t] as string}
                desc={t[s.descKey as keyof typeof t] as string}
                icon={s.icon}
                started={started}
                index={i}
              />
            ))}
          </ResponsiveCards>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
