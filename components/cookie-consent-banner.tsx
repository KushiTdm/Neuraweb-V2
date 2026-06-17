'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { useCookieConsent } from '@/contexts/cookie-consent-context';
import { LocalizedLink } from '@/components/localized-link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Cookie } from 'lucide-react';

export function CookieConsentBanner() {
  const { t } = useTranslation();
  const {
    analyticsConsent,
    isPreferencesOpen,
    acceptAll,
    rejectAll,
    savePreferences,
    openPreferences,
    closePreferences,
  } = useCookieConsent();
  const [pendingAnalytics, setPendingAnalytics] = useState(false);

  const showBanner = analyticsConsent === null && !isPreferencesOpen;

  return (
    <>
      {showBanner && (
        <div
          role="dialog"
          aria-label={t('cookies.banner.title')}
          className="fixed bottom-0 left-0 right-0 z-[60] border-t border-white/10 bg-[#070F26] px-4 py-5 sm:px-6"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Cookie className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-300" />
              <div>
                <p className="text-sm font-semibold text-white">{t('cookies.banner.title')}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400 sm:max-w-xl">
                  {t('cookies.banner.description')}{' '}
                  <LocalizedLink href="/confidentialite" className="underline hover:text-white">
                    {t('cookies.banner.privacyLink')}
                  </LocalizedLink>
                </p>
              </div>
            </div>

            <div className="flex flex-shrink-0 flex-wrap gap-2 sm:gap-3">
              <button
                type="button"
                onClick={rejectAll}
                className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5 sm:flex-none"
              >
                {t('cookies.banner.rejectAll')}
              </button>
              <button
                type="button"
                onClick={() => { setPendingAnalytics(false); openPreferences(); }}
                className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5 sm:flex-none"
              >
                {t('cookies.banner.customize')}
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-opacity hover:opacity-90 sm:flex-none"
              >
                {t('cookies.banner.acceptAll')}
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog
        open={isPreferencesOpen}
        onOpenChange={(open) => {
          if (!open) closePreferences();
          else setPendingAnalytics(analyticsConsent ?? false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('cookies.modal.title')}</DialogTitle>
            <DialogDescription>{t('cookies.modal.description')}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 rounded-xl border border-border/50 p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{t('cookies.modal.essential.title')}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t('cookies.modal.essential.description')}</p>
              </div>
              <input type="checkbox" checked disabled aria-label={t('cookies.modal.essential.title')} className="mt-1 h-4 w-4 flex-shrink-0 accent-gray-900" />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-xl border border-border/50 p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{t('cookies.modal.analytics.title')}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t('cookies.modal.analytics.description')}</p>
              </div>
              <input
                type="checkbox"
                checked={pendingAnalytics}
                onChange={(e) => setPendingAnalytics(e.target.checked)}
                aria-label={t('cookies.modal.analytics.title')}
                className="mt-1 h-4 w-4 flex-shrink-0 accent-gray-900"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => savePreferences(pendingAnalytics)}
              className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              {t('cookies.modal.save')}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
