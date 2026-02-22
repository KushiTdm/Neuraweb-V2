
// FICHIER 2 : components/hotel-form/ui/CheckGroup.tsx
// Checkbox réutilisable avec style NeuraWeb
// ============================================================
'use client';

interface CheckItemProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  badge?: string; // ex: "+$50"
}

export function CheckItem({ label, value, checked, onChange, badge }: CheckItemProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all duration-200 cursor-pointer select-none
        ${checked
          ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
          : 'border-white/8 bg-white/4 text-slate-300 hover:border-indigo-500/40 hover:bg-white/7'
        }`}
    >
      <span className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all
        ${checked ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
        {checked && <span className="text-white text-[9px] font-bold">✓</span>}
      </span>
      <span>{label}</span>
      {badge && <span className={`text-xs font-bold ml-1 ${checked ? 'text-indigo-300' : 'text-indigo-500/80'}`}>{badge}</span>}
    </button>
  );
}

interface CheckGroupProps {
  items: { label: string; value: string; badge?: string }[];
  selected: string[];
  onChange: (value: string) => void;
}

export function CheckGroup({ items, selected, onChange }: CheckGroupProps) {
  return (
    <div className="flex flex-wrap gap-2 py-1">
      {items.map(item => (
        <CheckItem key={item.value} {...item} checked={selected.includes(item.value)} onChange={onChange} />
      ))}
    </div>
  );
}
