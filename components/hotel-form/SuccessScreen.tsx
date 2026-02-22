
// FICHIER 16 : components/hotel-form/SuccessScreen.tsx
// ============================================================
'use client';

import { useHotelForm } from './HotelFormProvider';

export function SuccessScreen() {
  const { t } = useHotelForm();
  
  return (
    <div className="rounded-[20px] border border-white/8 p-12 text-center backdrop-blur-md"
      style={{ background: 'rgba(255,255,255,0.025)' }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"
        style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))', border: '2px solid rgba(99,102,241,0.4)' }}>
        ✦
      </div>
      <h2 className="font-extrabold text-2xl mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
        {t('hotelForm.success.title')}{' '}
        <span style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {t('hotelForm.success.titleHighlight')}
        </span>
      </h2>
      <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
        {t('hotelForm.success.message')}{' '}
        <strong className="text-violet-400">{t('hotelForm.success.delay')}</strong>{' '}
        {t('hotelForm.success.messageEnd')}
      </p>
      <div className="mt-6 text-xs text-slate-500">
        {t('hotelForm.success.question')}{' '}
        <a href="mailto:contact@neuraweb.tech" className="text-violet-400 hover:text-violet-300 transition-colors no-underline">
          contact@neuraweb.tech
        </a>
      </div>
    </div>
  );
}
