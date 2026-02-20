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
  initialLanguage?: Language;
}

export function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage || 'fr');
  const [mounted, setMounted] = useState(false);

  // Détection automatique de la langue au premier chargement
  useEffect(() => {
    setMounted(true);

    // Si une langue initiale est fournie (depuis l'URL), l'utiliser
    if (initialLanguage) {
      setLanguageState(initialLanguage);
      localStorage.setItem('preferred-language', initialLanguage);
      return;
    }

    // Sinon, vérifier le localStorage
    const savedLanguage = localStorage.getItem('preferred-language') as Language | null;
    
    if (savedLanguage && ['fr', 'en', 'es'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      return;
    }

    // Détecter la langue du navigateur
    const browserLanguage = navigator.language.toLowerCase();
    
    if (browserLanguage.startsWith('fr')) {
      setLanguageState('fr');
    } else if (browserLanguage.startsWith('es')) {
      setLanguageState('es');
    } else {
      setLanguageState('en');
    }
  }, [initialLanguage]);

  // Sauvegarder le choix de l'utilisateur et mettre à jour l'URL
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (mounted) {
      localStorage.setItem('preferred-language', lang);
      
      // Mettre à jour l'URL pour refléter la nouvelle langue
      const currentPath = window.location.pathname;
      const pathWithoutLang = currentPath.replace(/^\/(fr|en|es)/, '');
      const newPath = `/${lang}${pathWithoutLang}`;
      
      // Utiliser history.pushState pour éviter un rechargement complet
      window.history.pushState({}, '', newPath);
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