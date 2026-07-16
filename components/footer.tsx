'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Zap, Twitter, ArrowRight } from 'lucide-react';
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
    { label: t('services.web.title'),        href: '/services'              },
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

  // Pages sectorielles — retirées de la navbar, déplacées ici
  const sectorPages = [
    { href: '/restaurants', label: t('nav.dropdown.restaurants.label') },
    { href: '/sante',       label: t('nav.dropdown.sante.label')       },
  ];

  const socialLinks = [
    { href: 'https://twitter.com/neurawebtech',          icon: Twitter,  label: 'X/Twitter' },
  ];

  return (
    <footer className="relative bg-[#070F26] border-t border-white/5 overflow-hidden">
      {/* Ligne accent sky→cyan en haut */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(255,255,255,0.4), transparent)' }}
      />

      {/* ══════════════════════════════════════════════════
          MOBILE — layout compact (< sm)
      ══════════════════════════════════════════════════ */}
      <div className="sm:hidden px-5 pt-8 pb-6">

        {/* Logo + Socials inline */}
        <div className="flex items-center justify-between mb-5">
          <LocalizedLink href="/">
            <Image
              src="/assets/neurawebW.webp"
              alt="NeuraWeb"
              width={110}
              height={34}
              loading="lazy"
              className="h-8 w-auto object-contain opacity-90"
            />
          </LocalizedLink>

          <div className="flex gap-2">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Email */}
        <a
          href="mailto:contact@neuraweb.fr"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-5"
        >
          <Mail size={12} className="text-white" />
          contact@neuraweb.fr
        </a>

        {/* Pages locales + sectorielles */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
          {[...localPages, ...sectorPages].map((link) => (
            <LocalizedLink
              key={link.href}
              href={link.href}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              {link.label}
            </LocalizedLink>
          ))}
        </div>

        {/* Secteur public — partie à part (marchés publics ≠ autres secteurs) */}
        <div className="mb-5">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">
            Secteur public
          </p>
          <LocalizedLink
            href="/collectivites"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Collectivités &amp; mairies
          </LocalizedLink>
        </div>

        {/* Newsletter */}
        <div className="mb-5">
          <p className="text-xs text-slate-500 mb-2.5">
            {t('footer.newsletter.tagline')}
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            {/* Honeypot anti-spam — invisible pour les humains, voir lib/rate-limit.ts */}
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
            />
            <input
              type="email"
              required
              disabled={status === 'loading'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('footer.newsletter.placeholder')}
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-white/50 transition-colors disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              aria-label={t('footer.newsletter.subscribe')}
              className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 disabled:opacity-60"
              style={{ background: '#ffffff' }}
            >
              <ArrowRight size={14} className="text-gray-900" />
            </button>
          </form>
          <p
            className="text-[11px] mt-2 min-h-[14px]"
            style={{ color: status === 'error' ? '#f87171' : '#5eead4' }}
          >
            {newsletterFeedback}
          </p>
        </div>

        {/* Séparateur */}
        <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Copyright + Legal */}
        <p className="text-[10px] text-slate-500 mb-2">{t('footer.copyright')}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {legalLinks.map((link, i) => (
            <React.Fragment key={link.href}>
              <LocalizedLink
                href={link.href}
                className="text-[10px] text-slate-500 hover:text-white transition-colors"
              >
                {link.label}
              </LocalizedLink>
              {i < legalLinks.length - 1 && (
                <span className="text-slate-700 text-[10px]">•</span>
              )}
            </React.Fragment>
          ))}
          <span className="text-slate-700 text-[10px]">•</span>
          <button
            type="button"
            onClick={openPreferences}
            className="text-[10px] text-slate-500 hover:text-white transition-colors"
          >
            {t('cookies.manage')}
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          DESKTOP — 3 colonnes (≥ sm) — quick links supprimés
      ══════════════════════════════════════════════════ */}
      <div className="hidden sm:block relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">

          {/* Col 1 : Marque */}
          <div>
            <LocalizedLink href="/" className="inline-block mb-5">
              <Image
                src="/assets/neurawebW.webp"
                alt="NeuraWeb"
                width={140}
                height={42}
                loading="lazy"
                className="h-9 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </LocalizedLink>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {t('footer.company.description')}
            </p>
            <a
              href="mailto:contact@neuraweb.fr"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/40 transition-colors">
                <Mail size={14} className="text-slate-400 group-hover:text-white transition-colors" />
              </div>
              contact@neuraweb.fr
            </a>
          </div>

          {/* Col 2 : Services */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-5 flex items-center gap-2">
              <Zap size={14} className="text-white" />
              {t('nav.services')}
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <LocalizedLink
                    href={service.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/50 group-hover:bg-white transition-colors" />
                    {service.label}
                  </LocalizedLink>
                </li>
              ))}
            </ul>

            <h3 className="text-white text-sm font-semibold mt-6 mb-3">Agences & secteurs</h3>
            <ul className="space-y-2">
              {[...localPages, ...sectorPages].map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/50 group-hover:bg-white transition-colors" />
                    {link.label}
                  </LocalizedLink>
                </li>
              ))}
            </ul>

            {/* Secteur public — partie à part (marchés publics ≠ autres secteurs) */}
            <h3 className="text-white text-sm font-semibold mt-6 mb-3">Secteur public</h3>
            <ul className="space-y-2">
              <li>
                <LocalizedLink
                  href="/collectivites"
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-white/50 group-hover:bg-white transition-colors" />
                  Collectivités &amp; mairies
                </LocalizedLink>
              </li>
            </ul>
          </div>

          {/* Col 3 : Newsletter + Socials */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-5">Newsletter</h3>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              {t('footer.newsletter.description')}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 mb-2">
              {/* Honeypot anti-spam — invisible pour les humains, voir lib/rate-limit.ts */}
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
              />
              <input
                type="email"
                required
                disabled={status === 'loading'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletter.placeholder')}
                className="flex-1 min-w-0 px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-white/60 transition-colors disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                aria-label={t('footer.newsletter.subscribeLong')}
                className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 transition-opacity hover:opacity-80 disabled:opacity-60"
                style={{ background: '#ffffff' }}
              >
                <ArrowRight size={16} className="text-gray-900" />
              </button>
            </form>
            <p
              className="text-xs mb-4 min-h-[16px]"
              style={{ color: status === 'error' ? '#f87171' : '#5eead4' }}
            >
              {newsletterFeedback}
            </p>

            <div className="flex gap-2">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-navy-800 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="h-px bg-navy-800 mb-6" />

        {/* Legal + Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400/60">{t('footer.copyright')}</p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            {legalLinks.map((link, index) => (
              <React.Fragment key={link.href}>
                <LocalizedLink
                  href={link.href}
                  className="text-slate-400/60 hover:text-white transition-colors"
                >
                  {link.label}
                </LocalizedLink>
                {index < legalLinks.length - 1 && (
                  <span className="text-slate-700">•</span>
                )}
              </React.Fragment>
            ))}
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={openPreferences}
              className="text-slate-400/60 hover:text-white transition-colors"
            >
              {t('cookies.manage')}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Crafted with</span>
            <span className="text-white">♥</span>
            <span>by NeuraWeb</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
