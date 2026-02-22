
// FICHIER 6 : components/hotel-form/ProgressBar.tsx
// ============================================================
'use client';

import { useHotelForm } from './HotelFormProvider';

export function ProgressBar() {
  const { step, t } = useHotelForm();
  
  const STEPS = [
    `🏨 ${t('hotelForm.progress.general')}`,
    `🛏 ${t('hotelForm.progress.rooms')}`,
    `🛎 ${t('hotelForm.progress.services')}`,
    `💳 ${t('hotelForm.progress.booking')}`,
    `🎨 ${t('hotelForm.progress.content')}`,
    `🚀 ${t('hotelForm.progress.goals')}`,
  ];
  
  return (
    <div className="flex items-center bg-white/4 border border-white/8 rounded-full p-1 max-w-2xl mx-auto mb-10">
      {STEPS.map((s, i) => (
        <div key={i} className={`flex-1 text-center py-2 rounded-full text-[0.68rem] font-semibold transition-all duration-300
          ${i === step
            ? 'text-white shadow-lg'
            : i < step ? 'text-violet-400' : 'text-slate-500'}`}
          style={i === step ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#a78bfa)', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' } : {}}>
          {s}
        </div>
      ))}
    </div>
  );
}
