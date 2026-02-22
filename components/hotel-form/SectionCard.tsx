
// FICHIER 8 : components/hotel-form/SectionCard.tsx
// Card wrapper pour chaque étape
// ============================================================
'use client';

import { ReactNode } from 'react';

interface SectionCardProps {
  icon: string;
  title: string;
  desc: string;
  children: ReactNode;
}

export function SectionCard({ icon, title, desc, children }: SectionCardProps) {
  return (
    <div className="rounded-[20px] border border-white/8 p-8 backdrop-blur-md transition-all hover:border-indigo-500/20"
      style={{ background: 'rgba(255,255,255,0.025)' }}>
      <div className="flex items-center gap-3 mb-7">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
          {icon}
        </div>
        <div>
          <h2 className="font-bold text-lg tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>{title}</h2>
          <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

export function Divider() {
  return <div className="h-px my-1" style={{ background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.3),transparent)' }} />;
}
