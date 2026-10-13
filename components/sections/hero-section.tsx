'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';

interface HeroSectionProps {
  onScrollToNext?: () => void;
}

// Hero fixe : une promesse, une preuve, deux actions. Le H1 porte les mots-clés
// ciblés (agence web, IA, Lille) — ne pas le réduire à un slogan sans mot-clé.
const COPY: Record<string, {
  kicker: string;
  title: string;
  subtitle: string;
  proof: string[];
  cta: string;
  ctaSecondary: string;
  alt: string;
}> = {
  fr: {
    kicker: 'Agence web à Lille',
    title: 'Sites web, applications et automatisations pour les PME',
    subtitle:
      'Nous créons votre site Next.js, votre application mobile ou vos workflows n8n et agents IA. Hôtels, restaurants, cabinets de santé, collectivités : vous échangez directement avec l\'équipe qui fait le travail.',
    proof: ['Devis gratuit sous 24 h', 'Packs web dès 1 490 €', 'Basés à Lille, clients dans toute la France'],
    cta: 'Demander un devis',
    ctaSecondary: 'Voir les tarifs',
    alt: 'Un développeur travaille sur son ordinateur portable à la table d\'un café près d\'une fenêtre à persiennes',
  },
  en: {
    kicker: 'Web agency in Lille, France',
    title: 'Websites, apps and automations for small businesses',
    subtitle:
      'We build your Next.js website, mobile app, n8n workflows and AI agents. Hotels, restaurants, health practices, local authorities: you talk directly to the team that does the work.',
    proof: ['Free quote within 24 h', 'Web packs from €1,490', 'Based in Lille, clients across France'],
    cta: 'Get a quote',
    ctaSecondary: 'See pricing',
    alt: 'A developer working on a laptop at a café table by a shuttered window',
  },
  es: {
    kicker: 'Agencia web en Lille, Francia',
    title: 'Sitios web, apps y automatizaciones para pymes',
    subtitle:
      'Creamos tu sitio Next.js, tu aplicación móvil, flujos n8n y agentes de IA. Hoteles, restaurantes, consultas de salud, administraciones: hablas directamente con el equipo que hace el trabajo.',
    proof: ['Presupuesto gratis en 24 h', 'Packs web desde 1.490 €', 'Con sede en Lille, clientes en toda Francia'],
    cta: 'Pedir presupuesto',
    ctaSecondary: 'Ver precios',
    alt: 'Un desarrollador trabaja con su portátil en la mesa de un café junto a una ventana con persianas',
  },
  vi: {
    kicker: 'Agency web tại Lille, Pháp',
    title: 'Website, ứng dụng và tự động hoá cho doanh nghiệp nhỏ',
    subtitle:
      'Chúng tôi xây dựng website Next.js, ứng dụng di động, quy trình n8n và AI agent. Khách sạn, nhà hàng, phòng khám, cơ quan địa phương: bạn làm việc trực tiếp với đội ngũ thực hiện dự án.',
    proof: ['Báo giá miễn phí trong 24 giờ', 'Gói web từ 1.490 €', 'Trụ sở tại Lille, khách hàng khắp nước Pháp'],
    cta: 'Nhận báo giá',
    ctaSecondary: 'Xem bảng giá',
    alt: 'Một lập trình viên làm việc trên laptop tại bàn quán cà phê cạnh cửa sổ có chớp',
  },
};

export function HeroSection({ onScrollToNext }: HeroSectionProps) {
  const { language } = useTranslation();
  const c = COPY[language as string] ?? COPY.fr;

  return (
    <section className="relative w-full overflow-hidden bg-navy-950" aria-label="NeuraWeb">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-16 lg:pt-36 lg:pb-20 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-7">
          <p className="text-sm font-semibold text-sky-400 mb-5">{c.kicker}</p>

          <h1 className="font-display font-bold text-white leading-[1.08] mb-6 text-4xl sm:text-5xl xl:text-6xl tracking-tight">
            {c.title}
          </h1>

          <p className="text-lg leading-relaxed text-slate-300 mb-8 max-w-xl">{c.subtitle}</p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <LocalizedLink
              href="/booking"
              className="inline-flex items-center px-7 py-3.5 rounded-lg text-sm font-semibold text-navy-950 bg-white hover:bg-slate-100 transition-colors"
            >
              {c.cta}
            </LocalizedLink>
            <LocalizedLink
              href="/services"
              className="inline-flex items-center px-7 py-3.5 rounded-lg text-sm font-semibold text-white border border-white/30 hover:border-white transition-colors"
            >
              {c.ctaSecondary}
            </LocalizedLink>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
            {c.proof.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
            <Image
              src="/assets/services/nw_hero_accueil.webp"
              alt={c.alt}
              fill
              sizes="(max-width:1024px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {onScrollToNext && <span className="sr-only" />}
    </section>
  );
}
