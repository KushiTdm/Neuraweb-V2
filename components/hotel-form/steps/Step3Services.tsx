
// FICHILE 11 : components/hotel-form/steps/Step3Services.tsx
// ============================================================
'use client';

import { useHotelForm } from '../HotelFormProvider';
import { SectionCard } from '../SectionCard';
import { CheckGroup } from '../ui/CheckGroup';
import { FieldWrapper, inputCls } from '../ui/FieldWrapper';
import { NavRow } from '../ui/NavRow';

export function Step3Services() {
  const { formData, update, toggleArray, setStep, t } = useHotelForm();

  const SERVICES_INCLUS = [
    { value: 'petitdej', label: t('hotelForm.step3.inclus.petitdej') },
    { value: 'demipension', label: t('hotelForm.step3.inclus.demipension') },
    { value: 'pensionComplete', label: t('hotelForm.step3.inclus.pensionComplete') },
    { value: 'reception24h', label: t('hotelForm.step3.inclus.reception24h') },
    { value: 'navette', label: t('hotelForm.step3.inclus.navette') },
    { value: 'parking', label: t('hotelForm.step3.inclus.parking') },
    { value: 'menage', label: t('hotelForm.step3.inclus.menage') },
    { value: 'conciergerie', label: t('hotelForm.step3.inclus.conciergerie') },
  ];

  const SERVICES_SUP = [
    { value: 'piscine', label: t('hotelForm.step3.sup.piscine') },
    { value: 'spa', label: t('hotelForm.step3.sup.spa') },
    { value: 'sport', label: t('hotelForm.step3.sup.sport') },
    { value: 'restaurant', label: t('hotelForm.step3.sup.restaurant') },
    { value: 'bar', label: t('hotelForm.step3.sup.bar') },
    { value: 'seminaire', label: t('hotelForm.step3.sup.seminaire') },
    { value: 'rooftop', label: t('hotelForm.step3.sup.rooftop') },
    { value: 'velo', label: t('hotelForm.step3.sup.velo') },
    { value: 'blanchisserie', label: t('hotelForm.step3.sup.blanchisserie') },
    { value: 'ev', label: t('hotelForm.step3.sup.ev') },
  ];

  return (
    <SectionCard icon="🛎" title={t('hotelForm.step3.title')} desc={t('hotelForm.step3.desc')}>
      <FieldWrapper label={t('hotelForm.step3.inclus.label')}>
        <CheckGroup items={SERVICES_INCLUS} selected={formData.servicesInclus} onChange={v => toggleArray('servicesInclus', v)} />
      </FieldWrapper>
      <FieldWrapper label={t('hotelForm.step3.sup.label')}>
        <CheckGroup items={SERVICES_SUP} selected={formData.servicesSup} onChange={v => toggleArray('servicesSup', v)} />
      </FieldWrapper>
      <FieldWrapper label={t('hotelForm.step3.autres.label')}>
        <textarea className={`${inputCls} resize-y min-h-[80px]`} placeholder={t('hotelForm.step3.autres.placeholder')} value={formData.autresServices} onChange={e => update('autresServices', e.target.value)} />
      </FieldWrapper>
      <NavRow stepNum={3} onPrev={() => setStep(1)} onNext={() => setStep(3)} nextLabel={t('hotelForm.step3.nextLabel')} />
    </SectionCard>
  );
}
