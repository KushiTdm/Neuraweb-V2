
// FICHIER 14 : components/hotel-form/PriceSummary.tsx
// Récapitulatif final affiché dans Step 6
// ============================================================
'use client';

import { useHotelForm, PRICES } from './HotelFormProvider';

export function PriceSummary() {
  const { options, totalOneTime, totalMonthly, t } = useHotelForm();
  const optList = Object.values(options);

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-white/4 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );

  return (
    <div className="rounded-2xl border border-indigo-500/20 p-6"
      style={{ background: 'rgba(99,102,241,0.06)' }}>
      <h3 className="font-bold text-base mb-4 flex items-center gap-2" style={{ fontFamily: 'Syne, sans-serif' }}>
        {t('hotelForm.summary.title')}
      </h3>
      <div className="flex flex-col">
        <Row label={t('hotelForm.summary.baseSite')} value={`$${PRICES.BASE}`} />
        {optList.map((opt, i) => (
          <Row key={i} label={opt.label} value={opt.monthly ? `+$${opt.price}${t('hotelForm.widget.perMonth')}` : `+$${opt.price.toLocaleString()}`} />
        ))}
      </div>
      <div className="flex justify-between items-baseline pt-4 mt-2 border-t-2 border-indigo-500/30">
        <span className="font-bold text-base" style={{ fontFamily: 'Syne, sans-serif' }}>{t('hotelForm.summary.total')}</span>
        <span className="font-extrabold text-3xl" style={{ fontFamily: 'Syne, sans-serif', background: 'linear-gradient(135deg,#818cf8,#c084fc,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          ${totalOneTime.toLocaleString()}
        </span>
      </div>
      {totalMonthly > 0 && (
        <p className="text-right text-xs text-violet-400 mt-1">+ ${totalMonthly}{t('hotelForm.widget.perMonth')} {t('hotelForm.summary.monthlyMaintenance')}</p>
      )}
      <p className="text-[0.7rem] text-slate-600 mt-4 pt-3 border-t border-white/4 leading-relaxed">
        {t('hotelForm.summary.disclaimer')}
      </p>
    </div>
  );
}
