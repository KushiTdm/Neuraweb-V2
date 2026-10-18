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
    kicker: 'Agence web & IA française · Lille – Hanoï',
    title: 'Sites web, applications et automatisations pour les PME',
    subtitle:
      'Nous créons votre site Next.js, votre application mobile ou vos workflows n8n et agents IA. Hôtels, restaurants, cabinets de santé, collectivités : vous échangez directement avec l\'équipe qui fait le travail.',
    proof: ['Devis gratuit sous 48 h', 'Packs web dès 1 490 €', 'Contrat et facture français, équipe à Hanoï'],
    cta: 'Demander un devis',
    ctaSecondary: 'Voir les tarifs',
    alt: 'Le fondateur vu de dos, travaillant sur un ordinateur devant un mur vert et un grand disque crème',
  },
  en: {
    kicker: 'French web & AI agency · Lille – Hanoi',
    title: 'Websites, apps and automations for small businesses',
    subtitle:
      'We build your Next.js website, mobile app, n8n workflows and AI agents. Hotels, restaurants, health practices, local authorities: you talk directly to the team that does the work.',
    proof: ['Free quote within 48 h', 'Web packs from €1,490', 'French contract and invoice, team in Hanoi'],
    cta: 'Get a quote',
    ctaSecondary: 'See pricing',
    alt: 'The founder seen from behind, working on a laptop in front of a green wall and a large cream circle',
  },
  es: {
    kicker: 'Agencia web e IA francesa · Lille – Hanói',
    title: 'Sitios web, apps y automatizaciones para pymes',
    subtitle:
      'Creamos tu sitio Next.js, tu aplicación móvil, flujos n8n y agentes de IA. Hoteles, restaurantes, consultas de salud, administraciones: hablas directamente con el equipo que hace el trabajo.',
    proof: ['Presupuesto gratis en 48 h', 'Packs web desde 1.490 €', 'Contrato y factura franceses, equipo en Hanói'],
    cta: 'Pedir presupuesto',
    ctaSecondary: 'Ver precios',
    alt: 'El fundador de espaldas, trabajando con su portátil frente a una pared verde y un gran círculo crema',
  },
  vi: {
    kicker: 'Agency web & AI của Pháp · Lille – Hà Nội',
    title: 'Website, ứng dụng và tự động hoá cho doanh nghiệp nhỏ',
    subtitle:
      'Chúng tôi xây dựng website Next.js, ứng dụng di động, quy trình n8n và AI agent. Khách sạn, nhà hàng, phòng khám, cơ quan địa phương: bạn làm việc trực tiếp với đội ngũ thực hiện dự án.',
    proof: ['Báo giá miễn phí trong 48 giờ', 'Gói web từ 1.490 €', 'Hợp đồng và hóa đơn của Pháp, đội ngũ tại Hà Nội'],
    cta: 'Nhận báo giá',
    ctaSecondary: 'Xem bảng giá',
    alt: 'Người sáng lập nhìn từ phía sau, làm việc trên laptop trước bức tường xanh và một vòng tròn kem lớn',
  },
};

export function HeroSection({ onScrollToNext }: HeroSectionProps) {
  const { language } = useTranslation();
  const c = COPY[language as string] ?? COPY.fr;

  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-chypre" aria-label="NeuraWeb">
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 pt-24 pb-8 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20 grid lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-7">
          <p className="text-sm font-semibold text-creme/80 mb-3 sm:mb-5">{c.kicker}</p>

          <h1 className="font-impact font-black text-creme leading-[1.05] mb-4 sm:mb-6 text-[2rem] sm:text-5xl xl:text-6xl tracking-tight">
            {c.title}
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-creme/90 mb-5 sm:mb-8 max-w-xl">{c.subtitle}</p>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 mb-5 sm:mb-8">
            <LocalizedLink
              href="/booking"
              className="inline-flex min-h-[48px] items-center justify-center px-4 sm:px-7 py-3 rounded-lg text-sm font-semibold text-chypre bg-creme hover:bg-white transition-colors text-center"
            >
              {c.cta}
            </LocalizedLink>
            <LocalizedLink
              href="/developpement-web"
              className="inline-flex min-h-[48px] items-center justify-center px-4 sm:px-7 py-3 rounded-lg text-sm font-semibold text-creme border border-creme/40 hover:border-creme transition-colors text-center"
            >
              {c.ctaSecondary}
            </LocalizedLink>
          </div>

          <ul className="hidden sm:flex flex-wrap gap-x-6 gap-y-2 text-sm text-creme/80">
            {c.proof.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="relative aspect-[16/9] max-h-[27svh] sm:max-h-none sm:aspect-[4/3] rounded-2xl overflow-hidden border border-creme/15">
            <Image
              src="/assets/redesign/hero-fondateur.webp"
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
