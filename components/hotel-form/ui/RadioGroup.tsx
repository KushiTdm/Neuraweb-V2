
// FICHIER 3 : components/hotel-form/ui/RadioGroup.tsx
// Radio réutilisable avec style NeuraWeb
// ============================================================
'use client';

interface RadioItemProps {
  label: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
  badge?: string;
}

export function RadioItem({ label, value, selected, onSelect, badge }: RadioItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all duration-200 cursor-pointer select-none
        ${selected
          ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
          : 'border-white/8 bg-white/4 text-slate-300 hover:border-indigo-500/40 hover:bg-white/7'
        }`}
    >
      {label}
      {badge && <span className={`text-xs font-bold ml-1 ${selected ? 'text-indigo-300' : 'text-indigo-500/80'}`}>{badge}</span>}
    </button>
  );
}

interface RadioGroupProps {
  items: { label: string; value: string; badge?: string }[];
  selected: string;
  onSelect: (value: string) => void;
}

export function RadioGroup({ items, selected, onSelect }: RadioGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <RadioItem key={item.value} {...item} selected={selected === item.value} onSelect={onSelect} />
      ))}
    </div>
  );
}
