
// FICHIER 11 : components/hotel-form/steps/Step3Services.tsx
// ============================================================
'use client';

import { useHotelForm } from '../HotelFormProvider';
import { SectionCard } from '../SectionCard';
import { CheckGroup } from '../ui/CheckGroup';
import { FieldWrapper, inputCls } from '../ui/FieldWrapper';
import { NavRow } from '../ui/NavRow';

const SERVICES_INCLUS = [
  { value: 'petitdej', label: 'Petit-déjeuner' },
  { value: 'demipension', label: 'Demi-pension' },
  { value: 'pensionComplete', label: 'Pension complète' },
  { value: 'reception24h', label: 'Réception 24h/24' },
  { value: 'navette', label: 'Navette aéroport/gare' },
  { value: 'parking', label: 'Parking gratuit' },
  { value: 'menage', label: 'Ménage quotidien' },
  { value: 'conciergerie', label: 'Conciergerie' },
];

const SERVICES_SUP = [
  { value: 'piscine', label: 'Piscine' },
  { value: 'spa', label: 'Spa / Wellness' },
  { value: 'sport', label: 'Salle de sport' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'bar', label: 'Bar / Lounge' },
  { value: 'seminaire', label: 'Salle de séminaire' },
  { value: 'rooftop', label: 'Rooftop' },
  { value: 'velo', label: 'Location vélos' },
  { value: 'blanchisserie', label: 'Blanchisserie' },
  { value: 'ev', label: 'Borne recharge EV' },
];

export function Step3Services() {
  const { formData, update, toggleArray, setStep } = useHotelForm();
  return (
    <SectionCard icon="🛎" title="Services & Équipements" desc="Les prestations qui font votre différence">
      <FieldWrapper label="Services inclus dans le séjour">
        <CheckGroup items={SERVICES_INCLUS} selected={formData.servicesInclus} onChange={v => toggleArray('servicesInclus', v)} />
      </FieldWrapper>
      <FieldWrapper label="Équipements & services supplémentaires">
        <CheckGroup items={SERVICES_SUP} selected={formData.servicesSup} onChange={v => toggleArray('servicesSup', v)} />
      </FieldWrapper>
      <FieldWrapper label="Autres services à mentionner">
        <textarea className={`${inputCls} resize-y min-h-[80px]`} placeholder="Précisez tout autre service spécifique…" value={formData.autresServices} onChange={e => update('autresServices', e.target.value)} />
      </FieldWrapper>
      <NavRow stepNum={3} onPrev={() => setStep(1)} onNext={() => setStep(3)} nextLabel="Suivant → Réservation" />
    </SectionCard>
  );
}
