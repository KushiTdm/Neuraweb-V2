
// FICHIER 5 : components/hotel-form/ui/FieldWrapper.tsx
// Label + champ avec style cohérent
// ============================================================
'use client';

import { ReactNode } from 'react';

interface FieldWrapperProps {
  label: string;
  required?: boolean;
  hint?: string;
  badge?: string;
  children: ReactNode;
}

export function FieldWrapper({ label, required, hint, badge, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-300 tracking-wide flex items-center gap-2">
        {label}
        {required && <span className="text-rose-400">*</span>}
        {badge && <span className="text-indigo-400 font-bold text-[0.72rem]">{badge}</span>}
      </label>
      {hint && <p className="text-xs text-slate-600 -mt-0.5">{hint}</p>}
      {children}
    </div>
  );
}

export const inputCls = `w-full px-3.5 py-2.5 rounded-xl text-sm text-slate-100 font-medium
  bg-white/5 border border-white/8 outline-none transition-all duration-200
  placeholder:text-slate-600
  focus:border-indigo-500/60 focus:bg-indigo-500/6 focus:ring-2 focus:ring-indigo-500/12`;

export const selectCls = `${inputCls} cursor-pointer`;