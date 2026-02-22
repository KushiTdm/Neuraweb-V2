// ============================================================
// FICHIER 1 : components/hotel-form/HotelFormProvider.tsx
// Context global — state du formulaire + pricing
// ============================================================
'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { getTranslation, type TranslationKey } from '@/locales';

// ── Types ──────────────────────────────────────────────────
export type Lang = 'fr' | 'en' | 'es';

export interface RoomType {
  id: number;
  type: string;
  qty: string;
  capacity: string;
  price: string;
}

export interface FormData {
  // Step 1
  nom: string;
  typeEtablissement: string;
  adresse: string;
  pays: string;
  email: string;
  tel: string;
  responsable: string;
  etoiles: string;
  siteExistant: 'non' | 'refonte' | 'update';
  urlActuel: string;
  // Step 2
  nbChambresTotal: string;
  capaciteTotale: string;
  etages: string;
  rooms: RoomType[];
  equipChambres: string[];
  animaux: string;
  pmr: string;
  // Step 3
  servicesInclus: string[];
  servicesSup: string[];
  autresServices: string;
  // Step 4
  moteurResa: string;
  outilResa: string;
  ota: string[];
  saisonnalite: string;
  annulation: string;
  paiement: string[];
  // Step 5
  photos: string;
  langues: string[];
  blog: string;
  seo: string;
  avisClients: string;
  reseaux: string[];
  charte: string;
  // Step 6
  cible: string[];
  objectifs: string[];
  chatbot: string;
  maintenance: string;
  budget: string;
  delai: string;
  references: string;
  complement: string;
}

export interface PricingOption {
  price: number;
  label: string;
  monthly?: boolean;
}

interface HotelFormCtx {
  step: number;
  setStep: (s: number) => void;
  formData: FormData;
  update: (field: keyof FormData, value: any) => void;
  toggleArray: (field: keyof FormData, value: string) => void;
  options: Record<string, PricingOption>;
  setOption: (key: string, opt: PricingOption | null) => void;
  totalOneTime: number;
  totalMonthly: number;
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
  lang: Lang;
  token: string | null;
  setToken: (t: string | null) => void;
  submitForm: () => Promise<{ success: boolean; error?: string }>;
  isSubmitting: boolean;
  t: (key: TranslationKey) => string;
}

const Ctx = createContext<HotelFormCtx | null>(null);

export const PRICES = {
  BASE: 690,
  REFONTE: 290,
  MOTEUR_RESA: 490,
  LANGUE: 50,
  BLOG: 190,
  SEO: 390,
  CHATBOT: 1199,
  MAINTENANCE: 89,
} as const;

const defaultForm: FormData = {
  nom: '', typeEtablissement: '', adresse: '', pays: '', email: '', tel: '',
  responsable: '', etoiles: '', siteExistant: 'non', urlActuel: '',
  nbChambresTotal: '', capaciteTotale: '', etages: '',
  rooms: [{ id: 1, type: '', qty: '', capacity: '', price: '' }],
  equipChambres: [], animaux: 'non', pmr: 'non',
  servicesInclus: [], servicesSup: [], autresServices: '',
  moteurResa: 'non', outilResa: '', ota: [], saisonnalite: 'non',
  annulation: '', paiement: [],
  photos: '', langues: ['fr'], blog: 'non', seo: 'non',
  avisClients: '', reseaux: [], charte: '',
  cible: [], objectifs: [], chatbot: 'non', maintenance: 'non',
  budget: '', delai: '', references: '', complement: '',
};

export function HotelFormProvider({ children, lang }: { children: ReactNode; lang: Lang }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(defaultForm);
  const [options, setOptions] = useState<Record<string, PricingOption>>({});
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof FormData, value: any) =>
    setFormData(p => ({ ...p, [field]: value }));

  const toggleArray = (field: keyof FormData, value: string) => {
    setFormData(p => {
      const arr = p[field] as string[];
      return { ...p, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const setOption = (key: string, opt: PricingOption | null) =>
    setOptions(p => { const n = { ...p }; opt ? (n[key] = opt) : delete n[key]; return n; });

  const totalOneTime = PRICES.BASE + Object.values(options).filter(o => !o.monthly).reduce((s, o) => s + o.price, 0);
  const totalMonthly = Object.values(options).filter(o => o.monthly).reduce((s, o) => s + o.price, 0);

  const submitForm = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/hotel-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submitForm',
          token,
          formData,
          pricing: { totalOneTime, totalMonthly, options },
          language: lang,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Erreur lors de la soumission' };
      }
    } catch (error: any) {
      console.error('Erreur soumission:', error);
      return { success: false, error: error.message || 'Erreur de connexion' };
    } finally {
      setIsSubmitting(false);
    }
  }, [token, formData, totalOneTime, totalMonthly, options, lang, setSubmitted]);

  const t = useCallback((key: TranslationKey) => getTranslation(lang, key), [lang]);

  return (
    <Ctx.Provider value={{ 
      step, setStep, formData, update, toggleArray, options, setOption, 
      totalOneTime, totalMonthly, submitted, setSubmitted, lang,
      token, setToken, submitForm, isSubmitting, t
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useHotelForm = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useHotelForm must be used within HotelFormProvider');
  return ctx;
};
