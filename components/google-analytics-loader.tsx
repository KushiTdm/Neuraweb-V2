'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useCookieConsent } from '@/contexts/cookie-consent-context';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function deleteAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(';')
    .map((c) => c.trim().split('=')[0])
    .filter((name) => name === '_ga' || name === '_gid' || name.startsWith('_ga_'));

  cookieNames.forEach((name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}

/**
 * Google Analytics 4 en Consent Mode v2.
 *
 * Le tag est chargé sur toutes les pages mais démarre avec `analytics_storage: 'denied'` :
 * aucun cookie n'est déposé tant que le visiteur n'a pas accepté. Le choix est ensuite
 * propagé via `consent update`.
 *
 * Remplace le chargement conditionnel précédent (tag injecté seulement après acceptation),
 * qui rendait la balise indétectable par les vérificateurs Google et privait GA4 des
 * données modélisées pour les visiteurs ayant refusé.
 */
export function GoogleAnalyticsLoader({ gaId }: { gaId: string }) {
  const { analyticsConsent } = useCookieConsent();

  useEffect(() => {
    if (!gaId || analyticsConsent === null) return;

    window.gtag?.('consent', 'update', {
      analytics_storage: analyticsConsent ? 'granted' : 'denied',
    });

    if (analyticsConsent === false) {
      deleteAnalyticsCookies();
    }
  }, [gaId, analyticsConsent]);

  if (!gaId) return null;

  return (
    <>
      {/* Doit précéder gtag.js : les commandes sont empilées dans dataLayer et traitées
          dans l'ordre, ce qui garantit que l'état « denied » s'applique avant tout
          dépôt de cookie. */}
      <Script id="google-analytics-consent" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'granted',
            security_storage: 'granted',
            wait_for_update: 500
          });
          gtag('set', 'ads_data_redaction', true);
          gtag('set', 'url_passthrough', true);
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
    </>
  );
}
