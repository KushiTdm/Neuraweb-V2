
// FICHIER 12 : components/hotel-form/steps/Step4Booking.tsx
// ============================================================
'use client';

import { useHotelForm, PRICES } from '../HotelFormProvider';
import { SectionCard } from '../SectionCard';
import { CheckGroup } from '../ui/CheckGroup';
import { RadioGroup } from '../ui/RadioGroup';
import { FieldWrapper, inputCls, selectCls } from '../ui/FieldWrapper';
import { NavRow } from '../ui/NavRow';

const OTA_ITEMS = [
  { value: 'booking', label: 'Booking.com' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'expedia', label: 'Expedia' },
  { value: 'tripadvisor', label: 'TripAdvisor' },
  { value: 'google', label: 'Google Hotels' },
  { value: 'aucun', label: 'Aucune' },
];

const PAIEMENT_ITEMS = [
  { value: 'cb', label: 'Carte bancaire' },
  { value: 'especes', label: 'Espèces' },
  { value: 'virement', label: 'Virement' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'cheques_vac', label: 'Chèques vacances' },
];

export function Step4Booking() {
  const { formData, update, toggleArray, setStep, setOption } = useHotelForm();

  const handleMoteur = (val: string) => {
    update('moteurResa', val);
    setOption('moteur', val === 'oui_nouveau' ? { price: PRICES.MOTEUR_RESA, label: 'Moteur de réservation' } : null);
  };

  return (
    <SectionCard icon="💳" title="Réservation & Tarification" desc="Comment vos clients réservent et paient">
      <FieldWrapper label="Moteur de réservation en ligne" badge={`Option +$${PRICES.MOTEUR_RESA}`}>
        <RadioGroup selected={formData.moteurResa} onSelect={handleMoteur} items={[
          { value: 'oui_nouveau', label: '✦ Oui, intégrer', badge: `+$${PRICES.MOTEUR_RESA}` },
          { value: 'existant', label: 'Outil existant à connecter' },
          { value: 'non', label: 'Non merci' },
          { value: 'conseil', label: 'Besoin de conseil' },
        ]} />
      </FieldWrapper>

      {formData.moteurResa === 'existant' && (
        <FieldWrapper label="Nom de l'outil actuel">
          <input className={inputCls} placeholder="ex : Cloudbeds, Mews, Little Hotelier…" value={formData.outilResa} onChange={e => update('outilResa', e.target.value)} />
        </FieldWrapper>
      )}

      <FieldWrapper label="Plateformes OTA utilisées">
        <CheckGroup items={OTA_ITEMS} selected={formData.ota} onChange={v => toggleArray('ota', v)} />
      </FieldWrapper>

      <FieldWrapper label="Tarification saisonnière ?">
        <RadioGroup selected={formData.saisonnalite} onSelect={v => update('saisonnalite', v)} items={[
          { value: 'non', label: 'Non, tarif fixe' },
          { value: 'oui', label: 'Oui' },
          { value: 'promo', label: 'Oui + codes promo' },
        ]} />
      </FieldWrapper>

      <FieldWrapper label="Politique d'annulation">
        <select className={selectCls} value={formData.annulation} onChange={e => update('annulation', e.target.value)}>
          <option value="">Sélectionner...</option>
          {['Annulation gratuite jusqu\'à 24h avant','Annulation gratuite jusqu\'à 48h avant','Annulation gratuite jusqu\'à 7 jours avant','Non remboursable','Variable selon la saison'].map(a => <option key={a}>{a}</option>)}
        </select>
      </FieldWrapper>

      <FieldWrapper label="Modes de paiement acceptés">
        <CheckGroup items={PAIEMENT_ITEMS} selected={formData.paiement} onChange={v => toggleArray('paiement', v)} />
      </FieldWrapper>

      <NavRow stepNum={4} onPrev={() => setStep(2)} onNext={() => setStep(4)} nextLabel="Suivant → Contenu" />
    </SectionCard>
  );
}
