'use client';

import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

// Liste statique de noms : les anciens logos SVG dessinés à la main étaient déformés
// (n8n, Stripe, PostgreSQL) et le défilement infini faisait « template ».
const STACK = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'n8n', 'Supabase', 'Vercel', 'Stripe', 'PostgreSQL'];

const LABELS: Record<string, string> = {
  fr: 'Notre stack au quotidien',
  en: 'Our everyday stack',
  es: 'Nuestro stack diario',
  vi: 'Công nghệ chúng tôi dùng hằng ngày',
};

export function PartnersMarquee() {
  const { language } = useTranslation();
  const label = LABELS[language as string] ?? LABELS.fr;

  return (
    <section className="border-b border-chypre/15 bg-creme py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
        <p className="text-sm font-semibold text-chypre whitespace-nowrap">{label}</p>
        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-chypre/80">
          {STACK.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
