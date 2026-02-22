
// FICHIER 9 : components/hotel-form/steps/Step1General.tsx
// ============================================================
'use client';

import { useHotelForm, PRICES } from '../HotelFormProvider';
import { SectionCard, Divider } from '../SectionCard';
import { RadioGroup } from '../ui/RadioGroup';
import { FieldWrapper, inputCls, selectCls } from '../ui/FieldWrapper';
import { NavRow } from '../ui/NavRow';

export function Step1General() {
  const { formData, update, setStep, setOption } = useHotelForm();

  const handleSiteExistant = (val: string) => {
    update('siteExistant', val as any);
    setOption('refonte', val === 'refonte' ? { price: PRICES.REFONTE, label: 'Refonte site existant' } : null);
  };

  return (
    <SectionCard icon="🏨" title="Informations générales" desc="Dites-nous qui vous êtes et où vous êtes">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldWrapper label="Nom de l'établissement" required>
          <input className={inputCls} placeholder="Hôtel Les Palmiers" value={formData.nom} onChange={e => update('nom', e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="Type d'établissement" required>
          <select className={selectCls} value={formData.typeEtablissement} onChange={e => update('typeEtablissement', e.target.value)}>
            <option value="">Sélectionner...</option>
            {['Hôtel','Hostal','Bed & Breakfast','Auberge de jeunesse','Boutique Hôtel','Résidence hôtelière','Apart\'hôtel'].map(t => <option key={t}>{t}</option>)}
          </select>
        </FieldWrapper>
        <FieldWrapper label="Adresse complète" required>
          <input className={inputCls} placeholder="123 rue de la Plage, 06000 Nice" value={formData.adresse} onChange={e => update('adresse', e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="Pays / Région">
          <input className={inputCls} placeholder="France — Côte d'Azur" value={formData.pays} onChange={e => update('pays', e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="Email de contact" required>
          <input type="email" className={inputCls} placeholder="contact@hotel.com" value={formData.email} onChange={e => update('email', e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="Téléphone">
          <input type="tel" className={inputCls} placeholder="+33 4 93 00 00 00" value={formData.tel} onChange={e => update('tel', e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="Responsable du projet" required>
          <input className={inputCls} placeholder="Marie Dupont" value={formData.responsable} onChange={e => update('responsable', e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="Classement / Étoiles">
          <select className={selectCls} value={formData.etoiles} onChange={e => update('etoiles', e.target.value)}>
            <option value="">Non classé</option>
            {['1 étoile','2 étoiles','3 étoiles','4 étoiles','5 étoiles','Palace'].map(e => <option key={e}>{e}</option>)}
          </select>
        </FieldWrapper>
      </div>

      <Divider />

      <FieldWrapper label="Avez-vous déjà un site web ?">
        <RadioGroup
          selected={formData.siteExistant}
          onSelect={handleSiteExistant}
          items={[
            { value: 'non', label: 'Non, création' },
            { value: 'refonte', label: 'Oui, refonte', badge: `+$${PRICES.REFONTE}` },
            { value: 'update', label: 'Oui, mise à jour' },
          ]}
        />
      </FieldWrapper>

      {formData.siteExistant !== 'non' && (
        <FieldWrapper label="URL du site actuel">
          <input className={inputCls} placeholder="https://www.votrehotel.com" value={formData.urlActuel} onChange={e => update('urlActuel', e.target.value)} />
        </FieldWrapper>
      )}

      <NavRow stepNum={1} onNext={() => setStep(1)} nextLabel="Suivant → Chambres" />
    </SectionCard>
  );
}

