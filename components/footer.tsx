'use client';

import React, { useState } from 'react';
import { NeuraWebLogo } from '@/components/brand/neuraweb-logo';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';
import { useCookieConsent } from '@/contexts/cookie-consent-context';

type NewsletterStatus = 'idle' | 'loading' | 'success' | 'already' | 'error';

export function Footer() {
  const { t, language } = useTranslation();
  const { openPreferences } = useCookieConsent();
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<NewsletterStatus>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'loading' || !email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language, company_website: honeypot }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setStatus('error');
        return;
      }
      setStatus(data.alreadySubscribed ? 'already' : 'success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  const newsletterFeedback = (() => {
    switch (status) {
      case 'success': return t('footer.newsletter.success');
      case 'already': return t('footer.newsletter.alreadySubscribed');
      case 'error':   return t('footer.newsletter.error');
      default:        return null;
    }
  })();

  const services: { label: string; href: string }[] = [
    { label: t('services.web.title'),        href: '/developpement-web'              },
    { label: t('services.mobile.title'),     href: '/mobile-app-development'},
    { label: t('services.automation.title'), href: '/automatisation'        },
    { label: t('services.ai.title'),         href: '/integration-ia'        },
  ];

  // Liens légaux uniquement (quick links supprimés — déjà dans le menu)
  const legalLinks = [
    { href: '/mentions-legales',       label: t('footer.legal.legalNotice') },
    { href: '/confidentialite',        label: t('footer.legal.privacy')     },
    { href: '/conditions-utilisation', label: t('footer.legal.terms')       },
  ];

  // Pages locales SEO — FR uniquement (redirigent vers /fr depuis en/es)
  const localPages = [
    { href: '/agence-web-lille', label: 'Agence web Lille' },
    { href: '/agence-web-paris', label: 'Agence web Paris' },
  ];

  // Secteurs : colonne distincte des services (voir ../docs/01-marque/IA_SERVICES_SECTEURS.md)
  const sectorPages = [
    { href: '/secteurs/sante', label: t('nav.dropdown.sante.label')         },
    { href: '/secteurs/restaurants-hotels', label: t('nav.dropdown.restaurants.label')   },
    { href: '/secteurs/collectivites', label: t('nav.dropdown.collectivites.label') },
  ];


  const linkCls = 'text-sm text-footfg/85 transition-colors duration-200 hover:text-footfg';
  const colTitle = 'mb-3 text-xs font-semibold uppercase tracking-wider text-footfg';

  return (
    <footer className="relative overflow-hidden border-t border-footfg/15 bg-footbg">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr]">
          {/* Marque + contact (formulaire uniquement) */}
          <div className="col-span-2 lg:col-span-1">
            <LocalizedLink href="/" className="mb-3 inline-block">
              <NeuraWebLogo height={28} className="w-auto text-footfg opacity-90 transition-opacity hover:opacity-100" />
            </LocalizedLink>
            <p className="mb-4 max-w-xs text-sm leading-relaxed text-footfg/85">{t('footer.company.description')}</p>
            <LocalizedLink
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-footfg px-5 py-2.5 text-sm font-semibold text-footbg transition-opacity hover:opacity-90"
            >
              {t('nav.contact')} <ArrowRight size={14} aria-hidden="true" />
            </LocalizedLink>
          </div>

          <nav aria-label={t('nav.services')}>
            <h3 className={colTitle}>{t('nav.services')}</h3>
            <ul className="space-y-2">
              {services.map((l) => (<li key={l.label}><LocalizedLink href={l.href} className={linkCls}>{l.label}</LocalizedLink></li>))}
            </ul>
          </nav>

          <nav aria-label={t('footer.sectors')}>
            <h3 className={colTitle}><LocalizedLink href="/secteurs" className="transition-opacity hover:opacity-80">{t('footer.sectors')}</LocalizedLink></h3>
            <ul className="space-y-2">
              {sectorPages.map((l) => (<li key={l.href}><LocalizedLink href={l.href} className={linkCls}>{l.label}</LocalizedLink></li>))}
            </ul>
          </nav>

          <nav aria-label={t('footer.agencies')}>
            <h3 className={colTitle}>{t('footer.agencies')}</h3>
            <ul className="space-y-2">
              {localPages.map((l) => (<li key={l.href}><LocalizedLink href={l.href} className={linkCls}>{l.label}</LocalizedLink></li>))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className={colTitle}>Newsletter</h3>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} name="company_website"
                tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
              />
              <input
                type="email" required disabled={status === 'loading'} value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletter.placeholder')} aria-label={t('footer.newsletter.placeholder')}
                className="min-w-0 flex-1 rounded-xl border border-footfg/25 bg-footfg/10 px-3 py-2.5 text-sm text-footfg placeholder:text-footfg/85 focus:border-footfg/60 focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit" disabled={status === 'loading'} aria-label={t('footer.newsletter.subscribeLong')}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-footfg text-footbg transition-opacity hover:opacity-80 disabled:opacity-60"
              >
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>
            <p className="mt-2 min-h-[16px] text-xs text-footfg" role="status">{newsletterFeedback}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-footfg/15 pt-5 text-xs text-footfg/85 sm:flex-row">
          <p>{t('footer.copyright')}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {legalLinks.map((l) => (
              <LocalizedLink key={l.href} href={l.href} className="transition-colors hover:text-footfg">{l.label}</LocalizedLink>
            ))}
            <button type="button" onClick={openPreferences} className="transition-colors hover:text-footfg">{t('cookies.manage')}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
