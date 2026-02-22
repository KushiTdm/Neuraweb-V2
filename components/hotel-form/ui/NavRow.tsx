
// FICHIER 4 : components/hotel-form/ui/NavRow.tsx
// Boutons navigation prev / next / submit
// ============================================================
'use client';

import { useHotelForm } from '../HotelFormProvider';

interface NavRowProps {
  stepNum: number;
  totalSteps?: number;
  onPrev?: () => void;
  onNext?: () => void;
  isLast?: boolean;
  onSubmit?: () => void;
  nextLabel?: string;
}

export function NavRow({ stepNum, totalSteps = 6, onPrev, onNext, isLast, onSubmit, nextLabel }: NavRowProps) {
  const { t } = useHotelForm();
  
  return (
    <div className="flex items-center justify-between mt-8 gap-3">
      {onPrev ? (
        <button type="button" onClick={onPrev}
          className="flex items-center gap-2 px-5 py-3 bg-white/4 border border-white/8 rounded-xl text-slate-400 text-sm font-medium hover:border-indigo-500/30 hover:text-white transition-all">
          {t('hotelForm.nav.back')}
        </button>
      ) : <span />}
      <span className="text-xs text-slate-500">
        {t('hotelForm.nav.step')} <strong className="text-violet-400">{stepNum}</strong> / {totalSteps}
      </span>
      {isLast ? (
        <button type="button" onClick={onSubmit}
          className="flex items-center gap-2 px-8 py-3 rounded-xl text-white text-sm font-bold transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#a78bfa)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
          {t('hotelForm.nav.submit')}
        </button>
      ) : (
        <button type="button" onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#a78bfa)', boxShadow: '0 4px 15px rgba(99,102,241,0.35)' }}>
          {nextLabel || t('hotelForm.nav.next')} →
        </button>
      )}
    </div>
  );
}

