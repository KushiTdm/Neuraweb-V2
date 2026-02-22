
// FICHIER 15 : components/hotel-form/steps/Step6Goals.tsx
// ============================================================
'use client';

import { useHotelForm, PRICES } from '../HotelFormProvider';
import { SectionCard, Divider } from '../SectionCard';
import { CheckGroup } from '../ui/CheckGroup';
import { RadioGroup } from '../ui/RadioGroup';
import { FieldWrapper, inputCls, selectCls } from '../ui/FieldWrapper';
import { NavRow } from '../ui/NavRow';
import { PriceSummary } from '../PriceSummary';

export function Step6Goals() {
  const { formData, update, toggleArray, setStep, setOption, submitForm, t } = useHotelForm();

  const CIBLE_ITEMS = [
    { value: 'couples', label: t('hotelForm.step6.cible.couples') },
    { value: 'familles', label: t('hotelForm.step6.cible.familles') },
    { value: 'business', label: t('hotelForm.step6.cible.business') },
    { value: 'backpackers', label: t('hotelForm.step6.cible.backpackers') },
    { value: 'luxe', label: t('hotelForm.step6.cible.luxe') },
    { value: 'groupes', label: t('hotelForm.step6.cible.groupes') },
    { value: 'internationaux', label: t('hotelForm.step6.cible.internationaux') },
  ];

  const OBJECTIFS_ITEMS = [
    { value: 'resa_directes', label: t('hotelForm.step6.objectifs.resa') },
    { value: 'notoriete', label: t('hotelForm.step6.objectifs.notoriete') },
    { value: 'seo', label: t('hotelForm.step6.objectifs.seo') },
    { value: 'ota_moins', label: t('hotelForm.step6.objectifs.ota') },
    { value: 'international', label: t('hotelForm.step6.objectifs.international') },
  ];

  const budgetOptions = [
    t('hotelForm.step6.budget.moins1k'),
    t('hotelForm.step6.budget.1k25k'),
    t('hotelForm.step6.budget.25k5k'),
    t('hotelForm.step6.budget.5k10k'),
    t('hotelForm.step6.budget.plus10k'),
    t('hotelForm.step6.budget.definir'),
  ];

  const delaiOptions = [
    t('hotelForm.step6.delai.urgent'),
    t('hotelForm.step6.delai.1a2'),
    t('hotelForm.step6.delai.2a3'),
    t('hotelForm.step6.delai.3a6'),
    t('hotelForm.step6.delai.noConstraint'),
  ];

  const handleChatbot = (val: string) => {
    update('chatbot', val);
    setOption('chatbot', val === 'oui' ? { price: PRICES.CHATBOT, label: t('hotelForm.step6.chatbot.labelOption') } : null);
  };

  const handleMaintenance = (val: string) => {
    update('maintenance', val);
    setOption('maintenance', val === 'oui' ? { price: PRICES.MAINTENANCE, label: t('hotelForm.step6.maintenance.labelOption'), monthly: true } : null);
  };

  return (
    <SectionCard icon="🚀" title={t('hotelForm.step6.title')} desc={t('hotelForm.step6.desc')}>
      <FieldWrapper label={t('hotelForm.step6.cible.label')} required>
        <CheckGroup items={CIBLE_ITEMS} selected={formData.cible} onChange={v => toggleArray('cible', v)} />
      </FieldWrapper>

      <FieldWrapper label={t('hotelForm.step6.objectifs.label')} required>
        <CheckGroup items={OBJECTIFS_ITEMS} selected={formData.objectifs} onChange={v => toggleArray('objectifs', v)} />
      </FieldWrapper>

      <FieldWrapper label={t('hotelForm.step6.chatbot.label')} badge={`Option +$${PRICES.CHATBOT.toLocaleString()}`} hint={t('hotelForm.step6.chatbot.hint')}>
        <RadioGroup selected={formData.chatbot} onSelect={handleChatbot} items={[
          { value: 'oui', label: t('hotelForm.step6.chatbot.oui'), badge: `+$${PRICES.CHATBOT.toLocaleString()}` },
          { value: 'non', label: t('hotelForm.step6.chatbot.non') },
        ]} />
      </FieldWrapper>

      <FieldWrapper label={t('hotelForm.step6.maintenance.label')} badge={`Option +$${PRICES.MAINTENANCE}/mois`} hint={t('hotelForm.step6.maintenance.hint')}>
        <RadioGroup selected={formData.maintenance} onSelect={handleMaintenance} items={[
          { value: 'oui', label: t('hotelForm.step6.maintenance.oui'), badge: `+$${PRICES.MAINTENANCE}/mois` },
          { value: 'non', label: t('hotelForm.step6.maintenance.non') },
        ]} />
      </FieldWrapper>

      <Divider />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldWrapper label={t('hotelForm.step6.budget.label')}>
          <select className={selectCls} value={formData.budget} onChange={e => update('budget', e.target.value)}>
            <option value="">{t('hotelForm.step6.budget.placeholder')}</option>
            {budgetOptions.map(b => <option key={b}>{b}</option>)}
          </select>
        </FieldWrapper>
        <FieldWrapper label={t('hotelForm.step6.delai.label')}>
          <select className={selectCls} value={formData.delai} onChange={e => update('delai', e.target.value)}>
            <option value="">{t('hotelForm.step6.delai.placeholder')}</option>
            {delaiOptions.map(d => <option key={d}>{d}</option>)}
          </select>
        </FieldWrapper>
      </div>

      <FieldWrapper label={t('hotelForm.step6.references.label')}>
        <textarea className={`${inputCls} resize-y min-h-[70px]`} placeholder={t('hotelForm.step6.references.placeholder')} value={formData.references} onChange={e => update('references', e.target.value)} />
      </FieldWrapper>

      <FieldWrapper label={t('hotelForm.step6.complement.label')}>
        <textarea className={`${inputCls} resize-y min-h-[90px]`} placeholder={t('hotelForm.step6.complement.placeholder')} value={formData.complement} onChange={e => update('complement', e.target.value)} />
      </FieldWrapper>

      <Divider />

      {/* Récapitulatif prix final */}
      <PriceSummary />

      <NavRow
        stepNum={6}
        onPrev={() => setStep(4)}
        isLast
        onSubmit={submitForm}
      />
    </SectionCard>
  );
}

