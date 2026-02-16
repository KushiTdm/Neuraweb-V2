import { fr, type TranslationKey } from './fr';
import { en } from './en';
import { es } from './es';

export type { TranslationKey };

export const translations = {
  fr,
  en,
  es,
} as const;

export type Language = keyof typeof translations;

// Helper pour obtenir une traduction
export function getTranslation(
  lang: Language,
  key: TranslationKey
): string {
  return translations[lang][key] || translations.fr[key] || key;
}