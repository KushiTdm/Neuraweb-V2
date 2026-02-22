
// FICHIER 13 : components/hotel-form/steps/Step5Content.tsx
// ============================================================
'use client';

import { useHotelForm, PRICES } from '../HotelFormProvider';
import { SectionCard } from '../SectionCard';
import { RadioGroup } from '../ui/RadioGroup';
import { FieldWrapper, inputCls } from '../ui/FieldWrapper';
import { NavRow } from '../ui/NavRow';

const LANG_ITEMS = [
  { value: 'fr', label: '🇫🇷 Français', included: true },
  { value: 'en', label: '🇬🇧 Anglais' },
  { value: 'es', label: '🇪🇸 Espagnol' },
  { value: 'de', label: '🇩🇪 Allemand' },
  { value: 'it', label: '🇮🇹 Italien' },
  { value: 'pt', label: '🇵🇹 Portugais' },
  { value: 'ar', label: '🇸🇦 Arabe' },
  { value: 'zh', label: '🇨🇳 Mandarin' },
];

const RESEAUX_ITEMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'aucun', label: 'Aucun' },
];

export function Step5Content() {
  const { formData, update, setStep, setOption } = useHotelForm();

  const toggleLang = (val: string) => {
    if (val === 'fr') return;
    const langs = formData.langues.includes(val)
      ? formData.langues.filter(l => l !== val)
      : [...formData.langues, val];
    update('langues', langs);
    const extra = langs.filter(l => l !== 'fr').length;
    setOption('langues', extra > 0 ? { price: extra * PRICES.LANGUE, label: `Langues suppl. (×${extra})` } : null);
  };

  const handleBlog = (val: string) => {
    update('blog', val);
    setOption('blog', val === 'oui' ? { price: PRICES.BLOG, label: 'Blog / Actualités' } : null);
  };

  const handleSeo = (val: string) => {
    update('seo', val);
    setOption('seo', val === 'oui' ? { price: PRICES.SEO, label: 'SEO avancé' } : null);
  };

  const toggleReseau = (val: string) => {
    const arr = formData.reseaux;
    update('reseaux', arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const extraLangs = formData.langues.filter(l => l !== 'fr').length;

  return (
    <SectionCard icon="🎨" title="Contenu & Médias" desc="Ce que vous avez déjà et ce qu'il faudra créer">
      <FieldWrapper label="Photos professionnelles disponibles ?">
        <RadioGroup selected={formData.photos} onSelect={v => update('photos', v)} items={[
          { value: 'oui_pro', label: 'Oui, pro' },
          { value: 'oui_perso', label: 'Oui, perso' },
          { value: 'non', label: 'Non, à prévoir' },
          { value: 'partiel', label: 'Quelques-unes' },
        ]} />
      </FieldWrapper>

      <FieldWrapper label="Langues du site" badge={`+$${PRICES.LANGUE}/langue supplémentaire`} hint="Le français est inclus. Chaque langue additionnelle est facturée $50.">
        <div className="flex flex-wrap gap-2 py-1">
          {LANG_ITEMS.map(item => {
            const isIncluded = item.value === 'fr';
            const isSelected = formData.langues.includes(item.value);
            return (
              <button key={item.value} type="button" onClick={() => toggleLang(item.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all
                  ${isSelected
                    ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300'
                    : 'border-white/8 bg-white/4 text-slate-300 hover:border-indigo-500/40'}`}>
                <span className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
                  {isSelected && <span className="text-white text-[9px] font-bold">✓</span>}
                </span>
                {item.label}
                {isIncluded
                  ? <span className="text-[0.68rem] text-green-400 ml-1">✓ inclus</span>
                  : <span className="text-[0.68rem] text-indigo-400 font-bold ml-1">+$50</span>
                }
              </button>
            );
          })}
        </div>
        {extraLangs > 0 && (
          <p className="text-xs text-violet-400 mt-1">{extraLangs} langue(s) supplémentaire(s) → +${extraLangs * PRICES.LANGUE}</p>
        )}
      </FieldWrapper>

      <FieldWrapper label="Blog / Section actualités" badge={`Option +$${PRICES.BLOG}`}>
        <RadioGroup selected={formData.blog} onSelect={handleBlog} items={[
          { value: 'oui', label: `✦ Oui`, badge: `+$${PRICES.BLOG}` },
          { value: 'non', label: 'Non' },
          { value: 'plus_tard', label: 'Plus tard' },
        ]} />
      </FieldWrapper>

      <FieldWrapper label="SEO avancé" badge={`Option +$${PRICES.SEO}`} hint="Audit complet, optimisation on-page, schema markup hôtelier, rapport de positionnement.">
        <RadioGroup selected={formData.seo} onSelect={handleSeo} items={[
          { value: 'oui', label: '✦ Oui', badge: `+$${PRICES.SEO}` },
          { value: 'non', label: 'SEO de base (inclus)' },
        ]} />
      </FieldWrapper>

      <FieldWrapper label="Avis clients à afficher ?">
        <RadioGroup selected={formData.avisClients} onSelect={v => update('avisClients', v)} items={[
          { value: 'oui', label: 'Oui' },
          { value: 'non', label: 'Non' },
          { value: 'temoignages', label: 'Oui + témoignages libres' },
        ]} />
      </FieldWrapper>

      <FieldWrapper label="Réseaux sociaux actifs">
        <div className="flex flex-wrap gap-2 py-1">
          {RESEAUX_ITEMS.map(item => {
            const checked = formData.reseaux.includes(item.value);
            return (
              <button key={item.value} type="button" onClick={() => toggleReseau(item.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all
                  ${checked ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300' : 'border-white/8 bg-white/4 text-slate-300 hover:border-indigo-500/40'}`}>
                <span className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${checked ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
                  {checked && <span className="text-white text-[9px] font-bold">✓</span>}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </FieldWrapper>

      <FieldWrapper label="Charte graphique existante ?">
        <RadioGroup selected={formData.charte} onSelect={v => update('charte', v)} items={[
          { value: 'oui', label: 'Oui, complète' },
          { value: 'logo', label: 'Logo uniquement' },
          { value: 'non', label: 'Non, à créer' },
        ]} />
      </FieldWrapper>

      <NavRow stepNum={5} onPrev={() => setStep(3)} onNext={() => setStep(5)} nextLabel="Suivant → Objectifs" />
    </SectionCard>
  );
}
