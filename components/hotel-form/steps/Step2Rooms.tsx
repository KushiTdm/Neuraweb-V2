
// FICHIER 10 : components/hotel-form/steps/Step2Rooms.tsx
// ============================================================
'use client';

import { useHotelForm } from '../HotelFormProvider';
import { SectionCard, Divider } from '../SectionCard';
import { CheckGroup } from '../ui/CheckGroup';
import { RadioGroup } from '../ui/RadioGroup';
import { FieldWrapper, inputCls, selectCls } from '../ui/FieldWrapper';
import { NavRow } from '../ui/NavRow';
import type { RoomType } from '../HotelFormProvider';

const EQUIP_CHAMBRES = [
  { value: 'wifi', label: 'Wi-Fi gratuit' },
  { value: 'clim', label: 'Climatisation' },
  { value: 'tv', label: 'TV écran plat' },
  { value: 'sdb', label: 'Salle de bain privée' },
  { value: 'balcon', label: 'Balcon / Terrasse' },
  { value: 'coffre', label: 'Coffre-fort' },
  { value: 'minibar', label: 'Minibar' },
  { value: 'kitchenette', label: 'Kitchenette' },
  { value: 'bureau', label: 'Bureau de travail' },
  { value: 'vue', label: 'Vue mer / montagne' },
];

export function Step2Rooms() {
  const { formData, update, toggleArray, setStep } = useHotelForm();

  const addRoom = () => {
    const newRoom: RoomType = { id: Date.now(), type: '', qty: '', capacity: '', price: '' };
    update('rooms', [...formData.rooms, newRoom]);
  };

  const removeRoom = (id: number) => {
    if (formData.rooms.length <= 1) return;
    update('rooms', formData.rooms.filter(r => r.id !== id));
  };

  const updateRoom = (id: number, field: keyof RoomType, val: string) => {
    update('rooms', formData.rooms.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  return (
    <SectionCard icon="🛏" title="Hébergement & Chambres" desc="Détaillez vos types de chambres et leur capacité">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FieldWrapper label="Chambres au total" required>
          <input type="number" className={inputCls} placeholder="45" min="1" value={formData.nbChambresTotal} onChange={e => update('nbChambresTotal', e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="Capacité totale (pers.)">
          <input type="number" className={inputCls} placeholder="90" min="1" value={formData.capaciteTotale} onChange={e => update('capaciteTotale', e.target.value)} />
        </FieldWrapper>
        <FieldWrapper label="Étages / Niveaux">
          <input type="number" className={inputCls} placeholder="4" min="1" value={formData.etages} onChange={e => update('etages', e.target.value)} />
        </FieldWrapper>
      </div>

      <Divider />

      <FieldWrapper label="Types de chambres" required hint="Ajoutez chaque type avec son nombre, sa capacité et son tarif indicatif.">
        <div className="flex flex-col gap-2 mt-1">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-[1fr_70px_70px_80px_32px] gap-2 px-3 text-[0.7rem] text-slate-500">
            <span>Type de chambre</span><span>Quantité</span><span>Cap. max</span><span>Prix/nuit ($)</span><span />
          </div>
          {formData.rooms.map(room => (
            <div key={room.id} className="grid grid-cols-2 sm:grid-cols-[1fr_70px_70px_80px_32px] gap-2 p-3 rounded-xl border border-white/8 bg-white/4 hover:border-indigo-500/25 transition-all">
              <input className={inputCls} placeholder="Double standard" value={room.type} onChange={e => updateRoom(room.id, 'type', e.target.value)} />
              <input type="number" className={inputCls} placeholder="10" min="1" value={room.qty} onChange={e => updateRoom(room.id, 'qty', e.target.value)} />
              <input type="number" className={inputCls} placeholder="2" min="1" value={room.capacity} onChange={e => updateRoom(room.id, 'capacity', e.target.value)} />
              <input type="number" className={inputCls} placeholder="120" min="0" value={room.price} onChange={e => updateRoom(room.id, 'price', e.target.value)} />
              <button type="button" onClick={() => removeRoom(room.id)}
                className="flex items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all text-sm">
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={addRoom}
            className="flex items-center gap-2 px-4 py-2 w-fit border border-dashed border-indigo-500/30 rounded-xl text-violet-400 text-xs font-medium hover:bg-indigo-500/8 hover:border-indigo-500/50 transition-all">
            + Ajouter un type de chambre
          </button>
        </div>
      </FieldWrapper>

      <Divider />

      <FieldWrapper label="Équipements inclus dans les chambres">
        <CheckGroup items={EQUIP_CHAMBRES} selected={formData.equipChambres} onChange={v => toggleArray('equipChambres', v)} />
      </FieldWrapper>

      <FieldWrapper label="Animaux de compagnie acceptés ?">
        <RadioGroup selected={formData.animaux} onSelect={v => update('animaux', v)} items={[
          { value: 'non', label: 'Non' },
          { value: 'oui', label: 'Oui, tous' },
          { value: 'petits', label: 'Petits animaux' },
          { value: 'chiens', label: 'Chiens uniquement' },
          { value: 'supplement', label: 'Oui, avec supplément' },
        ]} />
      </FieldWrapper>

      <FieldWrapper label="Accessibilité PMR">
        <RadioGroup selected={formData.pmr} onSelect={v => update('pmr', v)} items={[
          { value: 'non', label: 'Non' },
          { value: 'partiel', label: 'Partiellement' },
          { value: 'oui', label: 'Entièrement accessible' },
        ]} />
      </FieldWrapper>

      <NavRow stepNum={2} onPrev={() => setStep(0)} onNext={() => setStep(2)} nextLabel="Suivant → Services" />
    </SectionCard>
  );
}