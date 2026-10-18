import React from 'react';
import { LocalizedLink } from '@/components/localized-link';

// Étiquette « SECTEUR » en tête des pages sectorielles : distingue visuellement une page métier
// d'une page de service, et renvoie vers le hub /secteurs (maillage). Couleurs = paire du thème.
export function SectorTag({ label = 'Secteur', hubLabel = 'Tous les secteurs' }: { label?: string; hubLabel?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 md:mb-5" data-sector-tag>
      <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">{label}</span>
      <LocalizedLink href="/secteurs" className="text-xs font-semibold text-slate-700 underline decoration-slate-400 underline-offset-4 hover:decoration-slate-700">
        ← {hubLabel}
      </LocalizedLink>
    </div>
  );
}
