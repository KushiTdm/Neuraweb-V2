'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useCookieConsent } from '@/contexts/cookie-consent-context';

function deleteAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(';')
    .map((c) => c.trim().split('=')[0])
    .filter((name) => name === '_ga' || name === '_gid' || name.startsWith('_ga_'));

  cookieNames.forEach((name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}

export function GoogleAnalyticsLoader({ gaId }: { gaId: string }) {
  const { analyticsConsent } = useCookieConsent();

  // Si le consentement est retiré après avoir été accordé, on supprime les cookies déjà déposés.
  useEffect(() => {
    if (analyticsConsent === false) {
      deleteAnalyticsCookies();
    }
  }, [analyticsConsent]);

  if (!gaId || analyticsConsent !== true) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
