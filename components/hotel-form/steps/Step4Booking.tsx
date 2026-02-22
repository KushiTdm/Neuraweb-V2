
// FICHIER 12 : components/hotel-form/steps/Step4Booking.tsx
// ============================================================
'use client';

import { useHotelForm, PRICES } from '../HotelFormProvider';
import { SectionCard } from '../SectionCard';
import { CheckGroup } from '../ui/CheckGroup';
import { RadioGroup } from '../ui/RadioGroup';
import { FieldWrapper, inputCls, selectCls } from '../ui/FieldWrapper';
import { NavRow } from '../ui/NavRow';

export function Step4Booking() {
  const { formData, update, toggleArray, setStep, setOption, t } = useHotelForm();

  const OTA_ITEMS = [
    { value: 'booking', label: t('hotelForm.step4.ota.booking') },
    { value: 'airbnb', label: t('hotelForm.step4.ota.airbnb') },
    { value: 'expedia', label: t('hotelForm.step4.ota.expedia') },
    { value: 'tripadvisor', label: t('hotelForm.step4.ota.tripadvisor') },
    { value: 'google', label: t('hotelForm.step4.ota.google') },
    { value: 'aucun', label: t('hotelForm.step4.ota.aucun') },
  ];

  const PAIEMENT_ITEMS = [
    { value: 'cb', label: t('hotelForm.step4.paiement.cb') },
    { value: 'especes', label: t('hotelForm.step4.paiement.especes') },
    { value: 'virement', label: t('hotelForm.step4.paiement.virement') },
    { value: 'paypal', label: t('hotelForm.step4.paiement.paypal') },
    { value: 'cheques_vac', label: t('hotelForm.step4.paiement.cheques') },
  ];

  const annulationOptions = [
    t('hotelForm.step4.annulation.24h'),
    t('hotelForm.step4.annulation.48h'),
    t('hotelForm.step4.annulation.7j'),
    t('hotelForm.step4.annulation.non'),
    t('hotelForm.step4.annulation.variable'),
  ];

  const handleMoteur = (val: string) => {
    update('moteurResa', val);
    setOption('moteur', val === 'oui_nouveau' ? { price: PRICES.MOTEUR_RESA, label: t('hotelForm.step4.moteur.labelOption') } : null);
  };

  return (
    <SectionCard icon="💳" title={t('hotelForm.step4.title')} desc={t('hotelForm.step4.desc')}>
      <FieldWrapper label={t('hotelForm.step4.moteur.label')} badge={`Option +$${PRICES.MOTEUR_RESA}`}>
        <RadioGroup selected={formData.moteurResa} onSelect={handleMoteur} items={[
          { value: 'oui_nouveau', label: t('hotelForm.step4.moteur.ouiNouveau'), badge: `+$${PRICES.MOTEUR_RESA}` },
          { value: 'existant', label: t('hotelForm.step4.moteur.existant') },
          { value: 'non', label: t('hotelForm.step4.moteur.non') },
          { value: 'conseil', label: t('hotelForm.step4.moteur.conseil') },
        ]} />
      </FieldWrapper>

      {formData.moteurResa === 'existant' && (
        <FieldWrapper label={t('hotelForm.step4.outil.label')}>
          <input className={inputCls} placeholder={t('hotelForm.step4.outil.placeholder')} value={formData.outilResa} onChange={e => update('outilResa', e.target.value)} />
        </FieldWrapper>
      )}

      <FieldWrapper label={t('hotelForm.step4.ota.label')}>
        <CheckGroup items={OTA_ITEMS} selected={formData.ota} onChange={v => toggleArray('ota', v)} />
      </FieldWrapper>

      <FieldWrapper label={t('hotelForm.step4.saison.label')}>
        <RadioGroup selected={formData.saisonnalite} onSelect={v => update('saisonnalite', v)} items={[
          { value: 'non', label: t('hotelForm.step4.saison.non') },
          { value: 'oui', label: t('hotelForm.step4.saison.oui') },
          { value: 'promo', label: t('hotelForm.step4.saison.promo') },
        ]} />
      </FieldWrapper>

      <FieldWrapper label={t('hotelForm.step4.annulation.label')}>
        <select className={selectCls} value={formData.annulation} onChange={e => update('annulation', e.target.value)}>
          <option value="">{t('hotelForm.step4.annulation.placeholder')}</option>
          {annulationOptions.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      </FieldWrapper>

      <FieldWrapper label={t('hotelForm.step4.paiement.label')}>
        <CheckGroup items={PAIEMENT_ITEMS} selected={formData.paiement} onChange={v => toggleArray('paiement', v)} />
      </FieldWrapper>

      <NavRow stepNum={4} onPrev={() => setStep(2)} onNext={() => setStep(4)} nextLabel={t('hotelForm.step4.nextLabel')} />
    </SectionCard>
  );
}
