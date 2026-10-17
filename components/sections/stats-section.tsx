'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { LocalizedLink } from '@/components/localized-link';
import { useLanguage } from '@/contexts/language-context';
import { NeuraIcon, type NeuraIconName } from '@/components/icons/neura-icon';

const T = {
  fr: {
    eyebrow: 'NOS RÉSULTATS',
    label1: 'Projets livrés avec succès',
    desc1: 'Applications web, mobiles et automatisations livrées dans les délais convenus.',
    label2: 'Clients satisfaits',
    desc2: 'Taux de satisfaction mesuré après chaque livraison — notre priorité absolue.',
    label3: 'ROI moyen client',
    desc3: 'Retour sur investissement constaté sur nos projets d\'automatisation et IA.',
    heading1: 'Des chiffres qui parlent',
    heading2: 'd\'eux-mêmes',
    sub: 'Depuis notre création, nous avons aidé des dizaines d\'entreprises à accélérer leur croissance grâce à des solutions web, IA et automatisation.',
    learn: 'À propos de NeuraWeb',
  },
  en: {
    eyebrow: 'OUR RESULTS',
    label1: 'Projects delivered',
    desc1: 'Web, mobile and automation projects delivered on time and within agreed deadlines.',
    label2: 'Satisfied clients',
    desc2: 'Satisfaction rate measured after each delivery — our absolute priority.',
    label3: 'Average client ROI',
    desc3: 'Return on investment observed on our automation and AI projects.',
    heading1: 'Numbers that speak',
    heading2: 'for themselves',
    sub: 'Since our creation, we have helped dozens of companies accelerate their growth.',
    learn: 'About NeuraWeb',
  },
  es: {
    eyebrow: 'NUESTROS RESULTADOS',
    label1: 'Proyectos entregados',
    desc1: 'Proyectos web, móviles y de automatización entregados a tiempo.',
    label2: 'Clientes satisfechos',
    desc2: 'Tasa de satisfacción medida después de cada entrega — nuestra prioridad absoluta.',
    label3: 'ROI promedio',
    desc3: 'Retorno de inversión observado en nuestros proyectos de automatización e IA.',
    heading1: 'Cifras que hablan',
    heading2: 'por sí solas',
    sub: 'Desde nuestra creación, hemos ayudado a docenas de empresas a acelerar su crecimiento.',
    learn: 'Sobre NeuraWeb',
  },
  vi: {
    eyebrow: 'KẾT QUẢ CỦA CHÚNG TÔI',
    label1: 'Dự án đã bàn giao',
    desc1: 'Website, ứng dụng di động và quy trình tự động hóa được bàn giao đúng hẹn.',
    label2: 'Khách hàng hài lòng',
    desc2: 'Tỷ lệ hài lòng được ghi nhận sau mỗi lần bàn giao — ưu tiên hàng đầu của chúng tôi.',
    label3: 'Hiệu quả đầu tư trung bình',
    desc3: 'Mức hiệu quả đầu tư ghi nhận được trên các dự án tự động hóa và AI.',
    heading1: 'Những con số',
    heading2: 'tự nói lên tất cả',
    sub: 'Từ ngày thành lập, chúng tôi đã đồng hành cùng hàng chục doanh nghiệp tăng trưởng nhanh hơn nhờ website, AI và tự động hóa.',
    learn: 'Về NeuraWeb',
  },
};

// ⚠ Chiffres (150+, 98 %, 3,2x) repris tels quels de la version précédente : ils ne sont
// documentés nulle part dans le repo. À justifier (preuves) ou remplacer avant mise en production.
const STATS: { value: number; suffix: string; key: string; descKey: string; icon: NeuraIconName }[] = [
  { value: 150, suffix: '+', key: 'label1', descKey: 'desc1', icon: 'site-web' },
  { value: 98, suffix: '%', key: 'label2', descKey: 'desc2', icon: 'sante' },
  { value: 3.2, suffix: 'x', key: 'label3', descKey: 'desc3', icon: 'seo-geo' },
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
      <NeuraIcon name={icon} size={44} className="mb-4 flex-shrink-0 text-creme" />
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
    <section ref={sectionRef} className="relative overflow-hidden bg-chypre py-20 sm:py-24 lg:py-32 sec-screen">
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
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[40fr_60fr] lg:gap-16">
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.1em] text-creme/90">{t.eyebrow}</p>
            <h2 className="mb-6 font-impact text-3xl font-black leading-tight text-creme sm:text-4xl lg:text-5xl">
              {t.heading1} {t.heading2}
            </h2>
            <p className="mb-10 max-w-md text-base leading-relaxed text-creme/90">{t.sub}</p>
            <LocalizedLink
              href="/equipe"
              className="group inline-flex items-center gap-2 rounded-full bg-creme px-6 py-3 font-semibold text-chypre transition-colors duration-200 hover:bg-white"
            >
              {t.learn}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </LocalizedLink>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {STATS.map((s, i) => (
              <StatCard
                key={s.key}
                value={s.value}
                suffix={s.suffix}
                label={t[s.key as keyof typeof t] as string}
                desc={t[s.descKey as keyof typeof t] as string}
                icon={s.icon}
                started={started}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
