'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';
import { CardsCarousel } from '@/components/ui/cards-carousel';

// H2 : les mots-clés (sites web, applications, IA, automatisation, PME) sont dans le titre ;
// les H3 de cartes restent traduits via locales (services.*.title / desc).
const SECTION_LABELS: Record<string, { chip: string; title1: string; title2: string; cta: string }> = {
  fr: { chip: 'NOS SERVICES', title1: 'Sites web, applications, IA et automatisation', title2: 'pour les PME et commerces locaux', cta: 'Voir tous nos services' },
  en: { chip: 'OUR SERVICES', title1: 'Websites, apps, AI and automation', title2: 'for small and local businesses', cta: 'View all services' },
  es: { chip: 'NUESTROS SERVICIOS', title1: 'Sitios web, apps, IA y automatización', title2: 'para pymes y comercios locales', cta: 'Ver todos los servicios' },
  vi: { chip: 'DỊCH VỤ CỦA CHÚNG TÔI', title1: 'Website, ứng dụng, AI và tự động hóa', title2: 'cho doanh nghiệp nhỏ và cửa hàng địa phương', cta: 'Xem tất cả dịch vụ' },
};

const ALTS: Record<string, { web: string; mobile: string; ai: string; automation: string }> = {
  fr: {
    web: 'Illustration d\'une fenêtre de navigateur formée de formes organiques vertes et crème, avec un curseur',
    mobile: 'Illustration d\'un smartphone avec un repère de localisation au centre de cercles concentriques',
    ai: 'Illustration d\'un assistant IA souriant qui répond à la question d\'un client dans des bulles de discussion, à côté d\'un site web',
    automation: 'Illustration d\'un flux automatisé : un email reçu, un engrenage, une facture validée et un agenda mis à jour',
  },
  en: {
    web: 'Illustration of a browser window made of organic green and cream shapes with a cursor',
    mobile: 'Illustration of a smartphone with a location pin inside concentric circles',
    ai: 'Illustration of a smiling AI assistant answering a customer question in chat bubbles, next to a website',
    automation: 'Illustration of an automated flow: an incoming email, a gear, a validated invoice and an updated calendar',
  },
  es: {
    web: 'Ilustración de una ventana de navegador hecha de formas orgánicas verdes y crema, con un cursor',
    mobile: 'Ilustración de un smartphone con un marcador de ubicación entre círculos concéntricos',
    ai: 'Ilustración de un asistente de IA sonriente que responde a la pregunta de un cliente en burbujas de chat, junto a un sitio web',
    automation: 'Ilustración de un flujo automatizado: un correo recibido, un engranaje, una factura validada y una agenda actualizada',
  },
  vi: {
    web: 'Minh họa cửa sổ trình duyệt tạo từ các hình khối hữu cơ màu xanh lá và kem, có con trỏ chuột',
    mobile: 'Minh họa điện thoại thông minh có ghim vị trí giữa các vòng tròn đồng tâm',
    ai: 'Minh họa trợ lý AI mỉm cười trả lời câu hỏi của khách hàng trong các bong bóng trò chuyện, bên cạnh một website',
    automation: 'Minh họa một quy trình tự động: email nhận được, bánh răng, hóa đơn đã duyệt và lịch được cập nhật',
  },
};

type Tone = 'chypre' | 'creme' | 'tint';
const TONES: Record<Tone, { panel: string; title: string; text: string; link: string }> = {
  chypre: { panel: 'bg-chypre', title: 'text-creme', text: 'text-creme/80', link: 'text-creme' },
  creme: { panel: 'bg-creme border-t border-chypre/10', title: 'text-chypre', text: 'text-chypre/80', link: 'text-chypre' },
  tint: { panel: 'bg-chypre-20', title: 'text-chypre', text: 'text-chypre/90', link: 'text-chypre' },
};

interface CardProps {
  href: string;
  image: string;
  alt: string;
  title: string;
  desc: string;
  learn: string;
  tone: Tone;
  badge?: string;
  horizontal?: boolean;
  big?: boolean;
  sizes: string;
  className?: string;
}

function ServiceCard({ href, image, alt, title, desc, learn, tone, badge, horizontal, big, sizes, className = '' }: CardProps) {
  const c = TONES[tone];
  return (
    <LocalizedLink
      href={href}
      className={`lift sv-pop group relative flex overflow-hidden rounded-3xl border border-chypre/15 bg-creme transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,70,67,0.18)] ${horizontal ? 'flex-row' : 'flex-col'} ${className}`}
    >
      <div className={`relative overflow-hidden ${horizontal ? 'w-2/5 shrink-0' : big ? 'min-h-[280px] flex-1' : 'aspect-[3/2]'}`}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
          loading="lazy"
        />
        {badge && (
          <span className="absolute right-3 top-3 rounded-full bg-creme px-2.5 py-1 text-xs font-bold text-chypre">{badge}</span>
        )}
      </div>
      <div className={`flex flex-col justify-center ${c.panel} ${horizontal ? 'flex-1 p-5' : big ? 'p-7 lg:p-8' : 'p-5'}`}>
        <h3 className={`font-display font-bold leading-tight ${c.title} ${big ? 'text-2xl lg:text-3xl' : 'text-lg'} mb-1.5`}>{title}</h3>
        <p className={`leading-relaxed ${c.text} ${big ? 'max-w-md text-base' : 'text-sm'}`}>{desc}</p>
        <span className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${c.link} transition-all duration-200 group-hover:gap-2`}>
          {learn} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </LocalizedLink>
  );
}

export function ServicesSection() {
  const { language, t } = useTranslation();
  const labels = SECTION_LABELS[language as string] ?? SECTION_LABELS.fr;
  const alt = ALTS[language as string] ?? ALTS.fr;
  const learn = t('common.learnMore');

  const web = { href: '/developpement-web', image: '/assets/redesign/service-web.webp', alt: alt.web, title: t('services.web.title'), desc: t('services.web.desc'), learn };
  const mobile = { href: '/mobile-app-development', image: '/assets/redesign/service-mobile.webp', alt: alt.mobile, title: t('services.mobile.title'), desc: t('services.mobile.desc'), learn, badge: 'MVP 6 sem.' };
  const ai = { href: '/integration-ia', image: '/assets/redesign/service-ia-assistant.webp', alt: alt.ai, title: t('services.ai.title'), desc: t('services.ai.desc'), learn };
  const auto = { href: '/automatisation', image: '/assets/redesign/service-automatisation-flux.webp', alt: alt.automation, title: t('services.automation.title'), desc: t('services.automation.desc'), learn };

  return (
    <section className="bg-creme py-24 lg:py-32 sec-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-4 inline-flex rounded-full bg-chypre/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-chypre">{labels.chip}</span>
            <h2 className="max-w-2xl font-display text-3xl font-bold leading-tight text-chypre sm:text-4xl lg:text-5xl">
              {labels.title1}{' '}
              <span className="font-impact font-black">{labels.title2}</span>
            </h2>
          </div>
          <LocalizedLink
            href="/developpement-web"
            className="group inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-chypre/30 px-6 py-3 text-sm font-semibold text-chypre transition-all duration-200 hover:bg-chypre hover:text-creme"
          >
            {labels.cta}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </LocalizedLink>
        </div>

        {/* Desktop : grande carte à gauche, 3 cartes à droite */}
        <div className="hidden min-h-[600px] grid-cols-12 gap-4 md:grid">
          <ServiceCard {...web} tone="chypre" big sizes="(max-width:1280px) 58vw, 740px" className="col-span-7" />
          <div className="col-span-5 grid grid-rows-[auto_1fr] gap-4">
            <ServiceCard {...mobile} tone="creme" horizontal sizes="220px" className="min-h-[200px]" />
            <div className="grid grid-cols-2 gap-4">
              <ServiceCard {...ai} tone="tint" sizes="(max-width:1280px) 22vw, 280px" />
              <ServiceCard {...auto} tone="creme" sizes="(max-width:1280px) 22vw, 280px" />
            </div>
          </div>
        </div>

        {/* Mobile : carrousel */}
        <div className="-mx-4 sm:-mx-6 md:hidden">
          <CardsCarousel slideWidth="snap" padding={1} gap={1} dotColor="#004643" showArrows autoPlay autoPlayInterval={4500}>
            <ServiceCard {...web} tone="chypre" sizes="85vw" className="h-[430px]" />
            <ServiceCard {...mobile} tone="creme" sizes="85vw" className="h-[430px]" />
            <ServiceCard {...ai} tone="tint" sizes="85vw" className="h-[430px]" />
            <ServiceCard {...auto} tone="creme" sizes="85vw" className="h-[430px]" />
          </CardsCarousel>
        </div>
      </div>
    </section>
  );
}
