'use client';

import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { NeuraIcon, type NeuraIconName } from '@/components/icons/neura-icon';
import { ResponsiveCards } from '@/components/ui/cards-carousel';

// Section « promesse » : traduit les 3 différenciateurs vérifiés de NeuraWeb
// (prix affichés, équipe joignable, 4 langues + deux fuseaux) en réponse aux
// peurs des PME (prix opaques, prestataire injoignable, jargon).
// Aucun chiffre ici autre que le prix d'entrée des packs (1 490 €, source : services-pricing.tsx).
// VI : pas de prix en euros affiché (règle du site, mode devis).
type Copy = {
  chip: string;
  title: string;
  subtitle: string;
  items: { icon: NeuraIconName; title: string; text: string }[];
};

const COPY: Record<string, Copy> = {
  fr: {
    chip: 'NOTRE ENGAGEMENT',
    title: 'Le web sans jargon, sans frontières',
    subtitle: 'Agence web et IA : sites Next.js, applications et automatisations, avec des prix affichés et une équipe que vous joignez directement.',
    items: [
      { icon: 'devis', title: 'Prix affichés', text: 'Des packs web dès 1 490 €, avec le détail de ce qui est inclus. Pas de devis opaque, pas de surprise.' },
      { icon: 'agent-ia', title: 'Équipe joignable', text: 'Vous échangez directement avec l\'équipe qui fait le travail, avec une réponse sous 48 h.' },
      { icon: 'paris-hanoi', title: 'Ouvert sur le monde', text: 'Un site en français, anglais, espagnol et vietnamien, et une équipe entre la France et le Vietnam.' },
    ],
  },
  en: {
    chip: 'OUR PROMISE',
    title: 'Web without jargon, without borders',
    subtitle: 'Web and AI agency: Next.js websites, apps and automations, with posted prices and a team you can reach directly.',
    items: [
      { icon: 'devis', title: 'Posted prices', text: 'Web packs from €1,490, with a clear list of what is included. No opaque quotes, no surprises.' },
      { icon: 'agent-ia', title: 'A reachable team', text: 'You talk directly to the people doing the work, with an answer within 24 hours.' },
      { icon: 'paris-hanoi', title: 'Open to the world', text: 'A site in French, English, Spanish and Vietnamese, and a team between France and Vietnam.' },
    ],
  },
  es: {
    chip: 'NUESTRO COMPROMISO',
    title: 'La web sin jerga, sin fronteras',
    subtitle: 'Agencia web y de IA: sitios Next.js, apps y automatizaciones, con precios visibles y un equipo al que puedes contactar directamente.',
    items: [
      { icon: 'devis', title: 'Precios visibles', text: 'Packs web desde 1.490 €, con el detalle de lo que incluyen. Sin presupuestos opacos, sin sorpresas.' },
      { icon: 'agent-ia', title: 'Equipo accesible', text: 'Hablas directamente con quien hace el trabajo, con respuesta en 48 horas.' },
      { icon: 'paris-hanoi', title: 'Abiertos al mundo', text: 'Un sitio en francés, inglés, español y vietnamita, y un equipo entre Francia y Vietnam.' },
    ],
  },
  vi: {
    chip: 'CAM KẾT CỦA CHÚNG TÔI',
    title: 'Web không thuật ngữ, không biên giới',
    subtitle: 'Agency web và AI: website Next.js, ứng dụng và tự động hóa, báo giá rõ ràng và đội ngũ bạn có thể liên hệ trực tiếp.',
    items: [
      { icon: 'devis', title: 'Báo giá rõ ràng', text: 'Gói website ghi rõ những gì được bao gồm. Không báo giá mập mờ, không phát sinh bất ngờ.' },
      { icon: 'agent-ia', title: 'Dễ dàng liên hệ', text: 'Bạn trao đổi trực tiếp với người thực hiện dự án, phản hồi trong vòng 48 giờ.' },
      { icon: 'paris-hanoi', title: 'Mở ra thế giới', text: 'Website bằng tiếng Pháp, Anh, Tây Ban Nha và Việt, cùng đội ngũ giữa Pháp và Việt Nam.' },
    ],
  },
};

export function PromiseSection() {
  const { language } = useTranslation();
  const c = COPY[language as string] ?? COPY.fr;

  return (
    <section className="bg-chypre-20 py-12 lg:py-28 sec-screen" aria-labelledby="promise-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl lg:mb-12">
          <span className="mb-4 inline-flex rounded-full bg-chypre px-4 py-1.5 text-xs font-semibold tracking-widest text-creme">{c.chip}</span>
          <h2 id="promise-heading" className="font-impact text-3xl font-black leading-[1.05] tracking-tight text-chypre sm:text-5xl lg:text-6xl">
            {c.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-chypre/90 sm:mt-5 sm:text-lg">{c.subtitle}</p>
        </div>

        <ResponsiveCards breakpoint="md" gridClass="grid-cols-3" gridGap="gap-4" dotColor="#004643">
          {c.items.map((item) => (
            <div key={item.title} className="lift h-full rounded-3xl border border-chypre/15 bg-creme p-6 sm:p-7">
              <NeuraIcon name={item.icon} size={48} className="mb-4 text-chypre" />
              <h3 className="font-display text-xl font-bold text-chypre">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-chypre/80 sm:text-base">{item.text}</p>
            </div>
          ))}
        </ResponsiveCards>
      </div>
    </section>
  );
}
