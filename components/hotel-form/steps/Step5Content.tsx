
// FICHIER 13 : components/hotel-form/steps/Step5Content.tsx
// ============================================================
'use client';

import { useHotelForm, PRICES } from '../HotelFormProvider';
import { SectionCard } from '../SectionCard';
import { RadioGroup } from '../ui/RadioGroup';
import { FieldWrapper, inputCls } from '../ui/FieldWrapper';
import { NavRow } from '../ui/NavRow';

export function Step5Content() {
  const { formData, update, setStep, setOption, t } = useHotelForm();

  const LANG_ITEMS = [
    { value: 'fr', label: t('hotelForm.step5.langues.fr'), included: true },
    { value: 'en', label: t('hotelForm.step5.langues.en') },
    { value: 'es', label: t('hotelForm.step5.langues.es') },
    { value: 'de', label: t('hotelForm.step5.langues.de') },
    { value: 'it', label: t('hotelForm.step5.langues.it') },
    { value: 'pt', label: t('hotelForm.step5.langues.pt') },
    { value: 'ar', label: t('hotelForm.step5.langues.ar') },
    { value: 'zh', label: t('hotelForm.step5.langues.zh') },
  ];

  const RESEAUX_ITEMS = [
    { value: 'instagram', label: t('hotelForm.step5.reseaux.instagram') },
    { value: 'facebook', label: t('hotelForm.step5.reseaux.facebook') },
    { value: 'tiktok', label: t('hotelForm.step5.reseaux.tiktok') },
    { value: 'youtube', label: t('hotelForm.step5.reseaux.youtube') },
    { value: 'linkedin', label: t('hotelForm.step5.reseaux.linkedin') },
    { value: 'aucun', label: t('hotelForm.step5.reseaux.aucun') },
  ];

  const toggleLang = (val: string) => {
    if (val === 'fr') return;
    const langs = formData.langues.includes(val)
      ? formData.langues.filter(l => l !== val)
      : [...formData.langues, val];
    update('langues', langs);
    const extra = langs.filter(l => l !== 'fr').length;
    setOption('langues', extra > 0 ? { price: extra * PRICES.LANGUE, label: t('hotelForm.langues.supLabel').replace('{count}', String(extra)) } : null);
  };

  const handleBlog = (val: string) => {
    update('blog', val);
    setOption('blog', val === 'oui' ? { price: PRICES.BLOG, label: t('hotelForm.step5.blog.labelOption') } : null);
  };

  const handleSeo = (val: string) => {
    update('seo', val);
    setOption('seo', val === 'oui' ? { price: PRICES.SEO, label: t('hotelForm.step5.seo.labelOption') } : null);
  };

  const toggleReseau = (val: string) => {
    const arr = formData.reseaux;
    update('reseaux', arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const extraLangs = formData.langues.filter(l => l !== 'fr').length;

  return (
    <SectionCard icon="🎨" title={t('hotelForm.step5.title')} desc={t('hotelForm.step5.desc')}>
      <FieldWrapper label={t('hotelForm.step5.photos.label')}>
        <RadioGroup selected={formData.photos} onSelect={v => update('photos', v)} items={[
          { value: 'oui_pro', label: t('hotelForm.step5.photos.ouiPro') },
          { value: 'oui_perso', label: t('hotelForm.step5.photos.ouiPerso') },
          { value: 'non', label: t('hotelForm.step5.photos.non') },
          { value: 'partiel', label: t('hotelForm.step5.photos.partiel') },
        ]} />
      </FieldWrapper>

      <FieldWrapper label={t('hotelForm.step5.langues.label')} badge={`+$${PRICES.LANGUE}/langue supplémentaire`} hint={t('hotelForm.step5.langues.hint')}>
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
                  ? <span className="text-[0.68rem] text-green-400 ml-1">{t('hotelForm.step5.langues.inclus')}</span>
                  : <span className="text-[0.68rem] text-indigo-400 font-bold ml-1">+$50</span>
                }
              </button>
            );
          })}
        </div>
        {extraLangs > 0 && (
          <p className="text-xs text-violet-400 mt-1">{extraLangs} {t('hotelForm.step5.langues.supplementaire')} → +${extraLangs * PRICES.LANGUE}</p>
        )}
      </FieldWrapper>

      <FieldWrapper label={t('hotelForm.step5.blog.label')} badge={`Option +$${PRICES.BLOG}`}>
        <RadioGroup selected={formData.blog} onSelect={handleBlog} items={[
          { value: 'oui', label: t('hotelForm.step5.blog.oui'), badge: `+$${PRICES.BLOG}` },
          { value: 'non', label: t('hotelForm.step5.blog.non') },
          { value: 'plus_tard', label: t('hotelForm.step5.blog.plusTard') },
        ]} />
      </FieldWrapper>

      <FieldWrapper label={t('hotelForm.step5.seo.label')} badge={`Option +$${PRICES.SEO}`} hint={t('hotelForm.step5.seo.hint')}>
        <RadioGroup selected={formData.seo} onSelect={handleSeo} items={[
          { value: 'oui', label: t('hotelForm.step5.seo.oui'), badge: `+$${PRICES.SEO}` },
          { value: 'non', label: t('hotelForm.step5.seo.non') },
        ]} />
      </FieldWrapper>

      <FieldWrapper label={t('hotelForm.step5.avis.label')}>
        <RadioGroup selected={formData.avisClients} onSelect={v => update('avisClients', v)} items={[
          { value: 'oui', label: t('hotelForm.step5.avis.oui') },
          { value: 'non', label: t('hotelForm.step5.avis.non') },
          { value: 'temoignages', label: t('hotelForm.step5.avis.temoignages') },
        ]} />
      </FieldWrapper>

      <FieldWrapper label={t('hotelForm.step5.reseaux.label')}>
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

      <FieldWrapper label={t('hotelForm.step5.charte.label')}>
        <RadioGroup selected={formData.charte} onSelect={v => update('charte', v)} items={[
          { value: 'oui', label: t('hotelForm.step5.charte.oui') },
          { value: 'logo', label: t('hotelForm.step5.charte.logo') },
          { value: 'non', label: t('hotelForm.step5.charte.non') },
        ]} />
      </FieldWrapper>

      <NavRow stepNum={5} onPrev={() => setStep(3)} onNext={() => setStep(5)} nextLabel={t('hotelForm.step5.nextLabel')} />
    </SectionCard>
  );
}
