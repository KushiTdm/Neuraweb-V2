'use client';

import { useLanguage } from '@/contexts/language-context';
import { getTranslation, type TranslationKey } from '@/locales';

/**
 * Hook pour faciliter l'utilisation des traductions dans les composants
 * 
 * @example
 * ```tsx
 * const { t } = useTranslation();
 * return <h1>{t('hero.main.title')}</h1>
 * ```
 */
export function useTranslation() {
  const { language, setLanguage } = useLanguage();

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };

  return {
    t,
    language,
    setLanguage,
  };
}