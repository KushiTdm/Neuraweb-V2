'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'neuraweb_cookie_consent';
const CONSENT_VERSION = 1;

interface ConsentRecord {
  version: number;
  analytics: boolean;
  timestamp: string;
}

interface CookieConsentContextType {
  /** null = aucun choix enregistré encore (bandeau à afficher) */
  analyticsConsent: boolean | null;
  /** le panneau de préférences est ouvert (depuis le bandeau ou le lien "Gérer les cookies") */
  isPreferencesOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (analytics: boolean) => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

function readStoredConsent(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredConsent(analytics: boolean) {
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    analytics,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = readStoredConsent();
    setAnalyticsConsent(stored ? stored.analytics : null);
  }, []);

  const savePreferences = useCallback((analytics: boolean) => {
    writeStoredConsent(analytics);
    setAnalyticsConsent(analytics);
    setIsPreferencesOpen(false);
  }, []);

  const acceptAll = useCallback(() => savePreferences(true), [savePreferences]);
  const rejectAll = useCallback(() => savePreferences(false), [savePreferences]);
  const openPreferences = useCallback(() => setIsPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setIsPreferencesOpen(false), []);

  return (
    <CookieConsentContext.Provider
      value={{
        // Pendant l'hydratation on traite comme "pas encore décidé" pour éviter tout flash
        analyticsConsent: mounted ? analyticsConsent : null,
        isPreferencesOpen,
        acceptAll,
        rejectAll,
        savePreferences,
        openPreferences,
        closePreferences,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}
