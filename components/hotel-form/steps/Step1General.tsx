
// FICHIER 9 : components/hotel-form/steps/Step1General.tsx
// ============================================================
'use client';

import { useHotelForm, PRICES } from '../HotelFormProvider';
import { SectionCard, Divider } from '../SectionCard';
import { RadioGroup } from '../ui/RadioGroup';
import { FieldWrapper, inputCls, selectCls } from '../ui/FieldWrapper';
import { NavRow } from '../ui/NavRow';

export function Step1General() {
  const { formData, update, setStep, setOption, t } = useHotelForm();

  const handleSiteExistant = (val: string) => {
    update('siteExistant', val as any);
    setOption('refonte', val === 'refonte' ? { price: PRICES.REFONTE, label: t('hotelForm.step1.refonteLabel') } : null);
  };

  const establishmentTypes = [
    t('hotelForm.step1.type.hotel'),
    t('hotelForm.step1.type.hostal'),
    t('hotelForm.step1.type.bnb'),
    t('hotelForm.step1.type.auberge'),
    t('hotelForm.step1.type.boutique'),
    t('hotelForm.step1.type.residence'),
    t('hotelForm.step1.type.aparthotel'),
  ];

  const starRatings = [
    t('hotelForm.step1.etoiles.1'),
    t('hotelForm.step1.etoiles.2'),
    t('hotelForm.step1.etoiles.3'),
    t('hotelForm.step1.etoiles.4'),
    t('hotelForm.step1.etoiles.5'),
    t('hotelForm.step1.etoiles.palace'),
  ];

  return (
    <SectionCard icon="🏨" title={t('hotelForm.step1.title')} desc={t('hotelForm.step1.desc')}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldWrapper label={t('hotelForm.step1.nom.label')} required>
          <input className={inputCls} placeholder={t('hotelForm.step1.nom.placeholder')} value={formData.nom} onChange={e => update('nom', e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label={t('hotelForm.step1.type.label')} required>
          <select className={selectCls} value={formData.typeEtablissement} onChange={e => update('typeEtablissement', e.target.value)}>
            <option value="">{t('hotelForm.step1.type.placeholder')}</option>
            {establishmentTypes.map(type => <option key={type}>{type}</option>)}
          </select>
        </FieldWrapper>
        <FieldWrapper label={t('hotelForm.step1.adresse.label')} required>
          <input className={inputCls} placeholder={t('hotelForm.step1.adresse.placeholder')} value={formData.adresse} onChange={e => update('adresse', e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label={t('hotelForm.step1.pays.label')}>
          <input className={inputCls} placeholder={t('hotelForm.step1.pays.placeholder')} value={formData.pays} onChange={e => update('pays', e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label={t('hotelForm.step1.email.label')} required>
          <input type="email" className={inputCls} placeholder={t('hotelForm.step1.email.placeholder')} value={formData.email} onChange={e => update('email', e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label={t('hotelForm.step1.tel.label')}>
          <input type="tel" className={inputCls} placeholder={t('hotelForm.step1.tel.placeholder')} value={formData.tel} onChange={e => update('tel', e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label={t('hotelForm.step1.responsable.label')} required>
          <input className={inputCls} placeholder={t('hotelForm.step1.responsable.placeholder')} value={formData.responsable} onChange={e => update('responsable', e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label={t('hotelForm.step1.etoiles.label')}>
          <select className={selectCls} value={formData.etoiles} onChange={e => update('etoiles', e.target.value)}>
            <option value="">{t('hotelForm.step1.etoiles.nonClasse')}</option>
            {starRatings.map(rating => <option key={rating}>{rating}</option>)}
          </select>
        </FieldWrapper>
      </div>

      <Divider />

      <FieldWrapper label={t('hotelForm.step1.siteExistant.label')}>
        <RadioGroup
          selected={formData.siteExistant}
          onSelect={handleSiteExistant}
          items={[
            { value: 'non', label: t('hotelForm.step1.siteExistant.non') },
            { value: 'refonte', label: t('hotelForm.step1.siteExistant.refonte'), badge: `+$${PRICES.REFONTE}` },
            { value: 'update', label: t('hotelForm.step1.siteExistant.update') },
          ]}
        />
      </FieldWrapper>

      {formData.siteExistant !== 'non' && (
        <FieldWrapper label={t('hotelForm.step1.url.label')}>
          <input className={inputCls} placeholder={t('hotelForm.step1.url.placeholder')} value={formData.urlActuel} onChange={e => update('urlActuel', e.target.value)} />
        </FieldWrapper>
      )}

      <NavRow stepNum={1} onNext={() => setStep(1)} nextLabel={t('hotelForm.step1.nextLabel')} />
    </SectionCard>
  );
}

