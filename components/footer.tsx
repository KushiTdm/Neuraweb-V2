'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Zap, Linkedin, Twitter, Github, Instagram, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';

export function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const services: { label: string; href: string }[] = [
    { label: t('services.web.title'), href: '/services' },
    { label: t('services.mobile.title'), href: '/mobile-app-development' },
    { label: t('services.automation.title'), href: '/automatisation' },
    { label: t('services.ai.title'), href: '/integration-ia' },
  ];

  const quickLinks = [
    { href: '/contact', label: t('nav.contact') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/equipe', label: t('nav.team') },
    { href: '/mentions-legales', label: t('footer.legal.legalNotice') },
  ];

  const legalLinks = [
    { href: '/mentions-legales', label: t('footer.legal.legalNotice') },
    { href: '/confidentialite', label: t('footer.legal.privacy') },
    { href: '/conditions-utilisation', label: t('footer.legal.terms') },
  ];

  const socialLinks = [
    { href: 'https://www.linkedin.com/company/neuraweb', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://twitter.com/neurawebtech', icon: Twitter, label: 'X / Twitter' },
    { href: 'https://github.com/neuraweb', icon: Github, label: 'GitHub' },
    { href: 'https://www.instagram.com/neurawebtech', icon: Instagram, label: 'Instagram' },
  ];

  return (
    <footer className="relative bg-[#070F26] border-t border-white/5 overflow-hidden">
      {/* Ligne séparatrice Sky→Cyan en haut */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #5DB8F0, #22D3EE, transparent)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* ── Grille principale 4 colonnes ────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Colonne 1 : Marque */}
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
              href="mailto:contact@neuraweb.tech"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-sky-400/40 transition-colors">
                <Mail size={14} className="text-slate-400 group-hover:text-sky-400 transition-colors" />
              </div>
              contact@neuraweb.tech
            </a>
          </div>

          {/* Colonne 2 : Services */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-5 flex items-center gap-2">
              <Zap size={14} className="text-sky-400" />
              {t('nav.services')}
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <LocalizedLink
                    href={service.href}
                    className="text-sm text-slate-400 hover:text-sky-400 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-sky-400/50 group-hover:bg-sky-400 transition-colors" />
                    {service.label}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : Liens rapides */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-5">
              {t('footer.links.title')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-sky-400 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-sky-400 transition-colors" />
                    {link.label}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 : Newsletter + Social */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-5">
              Newsletter
            </h3>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              Tendances tech, astuces IA et conseils automation — directement dans votre boîte.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); setEmail(''); }}
              className="flex gap-2 mb-6"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="flex-1 min-w-0 px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400/60 transition-colors"
              />
              <button
                type="submit"
                aria-label="S'inscrire à la newsletter"
                className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 transition-opacity hover:opacity-80"
                style={{ background: 'linear-gradient(90deg, #5DB8F0, #22D3EE)' }}
              >
                <ArrowRight size={16} className="text-white" />
              </button>
            </form>

            {/* Social icons */}
            <div className="flex gap-2">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-navy-800 border border-white/5 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-400/30 transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Ligne de séparation ─────────────────────────────── */}
        <div className="h-px bg-navy-800 mb-6" />

        {/* ── Legal + Copyright ──────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400/60">
            {t('footer.copyright')}
          </p>

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
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Crafted with</span>
            <span className="text-sky-400">♥</span>
            <span>by NeuraWeb</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
