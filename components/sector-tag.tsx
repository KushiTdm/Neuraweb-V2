import React from 'react';
import { LocalizedLink } from '@/components/localized-link';

// Étiquette « SECTEUR » en tête des pages sectorielles : distingue visuellement une page métier
// d'une page de service, et renvoie vers le hub /secteurs (maillage). Couleurs = paire du thème.
// `tone="dark"` : version pour un héros sur fond de thème (puce claire, lien clair).
export function SectorTag({ label = 'Secteur', hubLabel = 'Tous les secteurs', tone = 'light' }: { label?: string; hubLabel?: string; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 md:mb-5" data-sector-tag>
      <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${dark ? 'bg-white text-gray-900' : 'bg-slate-900 text-white'}`}>{label}</span>
      <LocalizedLink
        href="/secteurs"
        className={`text-xs font-semibold underline underline-offset-4 ${dark ? 'text-white decoration-white/50 hover:decoration-white' : 'text-slate-700 decoration-slate-400 hover:decoration-slate-700'}`}
      >
        ← {hubLabel}
      </LocalizedLink>
    </div>
  );
}
