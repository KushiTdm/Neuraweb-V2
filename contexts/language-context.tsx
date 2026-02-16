'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Types de langues supportées
export type Language = 'fr' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [mounted, setMounted] = useState(false);

  // Détection automatique de la langue au premier chargement
  useEffect(() => {
    setMounted(true);

    // 1. Vérifier si l'utilisateur a déjà choisi une langue (localStorage)
    const savedLanguage = localStorage.getItem('preferred-language') as Language | null;
    
    if (savedLanguage && ['fr', 'en', 'es'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      return;
    }

    // 2. Détecter la langue du navigateur
    const browserLanguage = navigator.language.toLowerCase();
    
    if (browserLanguage.startsWith('fr')) {
      setLanguageState('fr');
    } else if (browserLanguage.startsWith('es')) {
      setLanguageState('es');
    } else {
      setLanguageState('en'); // Par défaut anglais
    }
  }, []);

  // Sauvegarder le choix de l'utilisateur
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (mounted) {
      localStorage.setItem('preferred-language', lang);
    }
  };

  // Fonction de traduction simplifiée (sera remplacée par les vrais fichiers de traduction)
  const t = (key: string): string => {
    // Cette fonction sera utilisée par tous les composants
    // Pour l'instant, elle retourne juste la clé
    return key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};