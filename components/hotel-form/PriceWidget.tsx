
// FICHIER 7 : components/hotel-form/PriceWidget.tsx
// Widget flottant temps réel
// ============================================================
'use client';

import { useState } from 'react';
import { useHotelForm } from './HotelFormProvider';

export function PriceWidget() {
  const { options, totalOneTime, totalMonthly, t } = useHotelForm();
  const [open, setOpen] = useState(true);
  const optList = Object.values(options);

  return (
    <div className="fixed bottom-6 right-6 z-50 min-w-[220px] rounded-[18px] border border-indigo-500/35 backdrop-blur-xl"
      style={{ background: 'rgba(10,10,30,0.92)', boxShadow: '0 8px 32px rgba(0,0,0,0.5),0 0 30px rgba(99,102,241,0.15)' }}>
      <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setOpen(p => !p)}>
        <span className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest">{t('hotelForm.widget.title')}</span>
        <span className="text-indigo-400 text-xs">{open ? '▼' : '▲'}</span>
      </div>
      {open && (
        <div className="px-4 pb-4">
          <div className="flex justify-between items-center py-1.5 border-b border-white/6 mb-2">
            <span className="text-xs text-slate-300">{t('hotelForm.widget.baseSite')}</span>
            <span className="text-xs font-semibold text-white">$690</span>
          </div>
          <div className="flex flex-col gap-1 mb-3 max-h-40 overflow-y-auto">
            {optList.map((o, i) => (
              <div key={i} className="flex justify-between items-center text-[0.72rem]">
                <span className="text-slate-400 truncate max-w-[130px]">{o.label}</span>
                <span className="text-violet-400 font-semibold ml-2 flex-shrink-0">
                  {o.monthly ? `+$${o.price}${t('hotelForm.widget.perMonth')}` : `+$${o.price.toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-baseline pt-2.5 border-t border-indigo-500/25">
            <span className="text-sm font-bold text-white">{t('hotelForm.widget.total')}</span>
            <span className="font-extrabold text-xl" style={{ fontFamily: 'Syne, sans-serif', background: 'linear-gradient(135deg,#818cf8,#c084fc,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              ${totalOneTime.toLocaleString()}
            </span>
          </div>
          {totalMonthly > 0 && (
            <p className="text-right text-[0.68rem] text-slate-500 mt-1">+ ${totalMonthly}{t('hotelForm.widget.perMonth')}</p>
          )}
          <p className="text-[0.62rem] text-slate-600 mt-2 pt-2 border-t border-white/4 leading-relaxed">
            {t('hotelForm.widget.disclaimer')}
          </p>
        </div>
      )}
    </div>
  );
}
