'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';
import { MultiStepLoader } from '@/components/ui/multi-step-loader';

const COMMITMENT_KEYS = [
  'about.commitments.1',
  'about.commitments.2',
  'about.commitments.3',
  'about.commitments.4',
  'about.commitments.5',
  'about.commitments.6',
] as const;

const SECTION_LABELS: Record<string, { chip: string; learnMore: string; alt: string }> = {
  fr: { chip: 'QUI SOMMES-NOUS ?', learnMore: "Rencontrer l'équipe", alt: 'Le fondateur assis de profil dans un café aux murs verts, la tête tournée vers la fenêtre, travaillant sur son ordinateur' },
  en: { chip: 'ABOUT US', learnMore: 'Meet the team', alt: 'The founder seated in profile in a green-walled coffee shop, head turned toward the window, working on his laptop' },
  es: { chip: 'QUIÉNES SOMOS', learnMore: 'Conocer el equipo', alt: 'El fundador sentado de perfil en una cafetería de paredes verdes, con la cabeza girada hacia la ventana, trabajando con su portátil' },
  vi: { chip: 'CHÚNG TÔI LÀ AI?', learnMore: 'Gặp gỡ đội ngũ', alt: 'Người sáng lập ngồi nghiêng trong quán cà phê tường xanh, quay đầu về phía cửa sổ, làm việc trên laptop' },
};

export function AboutSection() {
  const { t, language } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const labels = SECTION_LABELS[language as string] ?? SECTION_LABELS.fr;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-creme py-12 sm:py-24 lg:py-32 sec-screen">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-14 lg:grid-cols-[52%_48%] xl:gap-20">
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-32px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <div className="relative h-[240px] overflow-hidden rounded-2xl border border-chypre/15 sm:h-[340px] sm:rounded-3xl lg:h-[460px] xl:h-[520px]">
              <Image
                src="/assets/redesign/about-cafe-tete-tournee.webp"
                alt={labels.alt}
                fill
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 90vw, 52vw"
                className="object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>

          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(32px)',
              transition: 'opacity 0.7s 0.15s ease, transform 0.7s 0.15s ease',
            }}
          >
            <span className="mb-4 inline-flex rounded-full bg-chypre/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-chypre sm:mb-6">
              {labels.chip}
            </span>

            <h2 className="mb-4 font-impact text-3xl font-black leading-tight text-chypre sm:text-4xl lg:text-5xl">
              {t('about.title').split('NeuraWeb')[0]}
              <span>NeuraWeb</span>
            </h2>

            <p className="mb-6 max-w-lg text-sm leading-relaxed text-chypre/90 sm:mb-10 sm:text-base">
              {t('about.description')}
            </p>

            <div className="mb-6 sm:mb-10">
              <MultiStepLoader steps={COMMITMENT_KEYS.map((key) => ({ text: t(key) }))} active={isVisible} duration={2200} />
            </div>

            <LocalizedLink
              href="/equipe"
              className="group block w-fit inline-flex items-center gap-2 rounded-full bg-chypre px-6 py-3 text-sm font-semibold text-creme transition-colors duration-200 hover:bg-chypre/90"
            >
              {labels.learnMore}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </LocalizedLink>
          </div>
        </div>
      </div>
    </section>
  );
}
