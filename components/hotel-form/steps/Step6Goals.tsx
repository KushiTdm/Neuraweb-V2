
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

const CIBLE_ITEMS = [
  { value: 'couples', label: 'Couples' },
  { value: 'familles', label: 'Familles' },
  { value: 'business', label: "Voyageurs d'affaires" },
  { value: 'backpackers', label: 'Backpackers' },
  { value: 'luxe', label: 'Clientèle luxe' },
  { value: 'groupes', label: 'Groupes / Séminaires' },
  { value: 'internationaux', label: 'International' },
];

const OBJECTIFS_ITEMS = [
  { value: 'resa_directes', label: 'Réservations directes' },
  { value: 'notoriete', label: 'Notoriété / image' },
  { value: 'seo', label: 'Visibilité Google' },
  { value: 'ota_moins', label: 'Réduire dépendance OTA' },
  { value: 'international', label: 'Attirer l\'international' },
];

export function Step6Goals() {
  const { formData, update, toggleArray, setStep, setOption, submitForm } = useHotelForm();

  const handleChatbot = (val: string) => {
    update('chatbot', val);
    setOption('chatbot', val === 'oui' ? { price: PRICES.CHATBOT, label: 'Chatbot IA' } : null);
  };

  const handleMaintenance = (val: string) => {
    update('maintenance', val);
    setOption('maintenance', val === 'oui' ? { price: PRICES.MAINTENANCE, label: 'Maintenance mensuelle', monthly: true } : null);
  };

  return (
    <SectionCard icon="🚀" title="Objectifs & Vision web" desc="Ce que vous attendez de votre nouveau site">
      <FieldWrapper label="Public cible" required>
        <CheckGroup items={CIBLE_ITEMS} selected={formData.cible} onChange={v => toggleArray('cible', v)} />
      </FieldWrapper>

      <FieldWrapper label="Objectifs principaux" required>
        <CheckGroup items={OBJECTIFS_ITEMS} selected={formData.objectifs} onChange={v => toggleArray('objectifs', v)} />
      </FieldWrapper>

      <FieldWrapper label="Chatbot IA" badge={`Option +$${PRICES.CHATBOT.toLocaleString()}`} hint="Assistant virtuel entraîné sur les données de votre hôtel : FAQ, disponibilités, services.">
        <RadioGroup selected={formData.chatbot} onSelect={handleChatbot} items={[
          { value: 'oui', label: '✦ Oui', badge: `+$${PRICES.CHATBOT.toLocaleString()}` },
          { value: 'non', label: 'Non merci' },
        ]} />
      </FieldWrapper>

      <FieldWrapper label="Maintenance mensuelle" badge={`Option +$${PRICES.MAINTENANCE}/mois`} hint="Mises à jour, sécurité, sauvegardes, support prioritaire.">
        <RadioGroup selected={formData.maintenance} onSelect={handleMaintenance} items={[
          { value: 'oui', label: '✦ Oui', badge: `+$${PRICES.MAINTENANCE}/mois` },
          { value: 'non', label: 'Non merci' },
        ]} />
      </FieldWrapper>

      <Divider />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldWrapper label="Budget indicatif">
          <select className={selectCls} value={formData.budget} onChange={e => update('budget', e.target.value)}>
            <option value="">Sélectionner...</option>
            {['Moins de $1,000','$1,000 – $2,500','$2,500 – $5,000','$5,000 – $10,000','Plus de $10,000','À définir ensemble'].map(b => <option key={b}>{b}</option>)}
          </select>
        </FieldWrapper>
        <FieldWrapper label="Délai souhaité">
          <select className={selectCls} value={formData.delai} onChange={e => update('delai', e.target.value)}>
            <option value="">Sélectionner...</option>
            {["Urgent (moins d'1 mois)",'1 à 2 mois','2 à 3 mois','3 à 6 mois','Pas de contrainte'].map(d => <option key={d}>{d}</option>)}
          </select>
        </FieldWrapper>
      </div>

      <FieldWrapper label="Sites de référence appréciés">
        <textarea className={`${inputCls} resize-y min-h-[70px]`} placeholder="URLs de sites hôteliers dont vous aimez le design…" value={formData.references} onChange={e => update('references', e.target.value)} />
      </FieldWrapper>

      <FieldWrapper label="Informations complémentaires">
        <textarea className={`${inputCls} resize-y min-h-[90px]`} placeholder="Tout ce qui nous aiderait à mieux comprendre votre projet…" value={formData.complement} onChange={e => update('complement', e.target.value)} />
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

