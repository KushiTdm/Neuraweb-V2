'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, ChevronDown, Code, Smartphone, Zap, Brain, HeartPulse } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useTranslation } from '@/hooks/use-translation';
import { LanguageSelector } from '@/components/language-selector';
import { LocalizedLink } from '@/components/localized-link';
import Image from 'next/image';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const pathname = usePathname();

  // Vérifie si le chemin correspond (en ignorant le préfixe de langue)
  const isActive = (path: string) => {
    const pathWithoutLang = pathname.replace(/^\/(fr|en|es)/, '') || '/';
    return pathWithoutLang === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 20);
      if (currentY > lastScrollY.current && currentY > 80) {
        setIsHidden(true);
      } else if (currentY < lastScrollY.current) {
        setIsHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b
          transition-[transform,background-color,border-color,box-shadow] duration-500 ease-in-out
          ${isHidden && !isMenuOpen ? '-translate-y-full' : 'translate-y-0'}
          ${isScrolled
            ? 'bg-white/75 dark:bg-[rgba(7,15,38,0.82)] border-white/25 dark:border-white/[0.07] shadow-[0_1px_20px_rgba(0,0,0,0.06)]'
            : 'bg-white/10 dark:bg-navy-950/10 border-white/[0.08] dark:border-white/[0.04]'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">

            {/* ── Logo ──────────────────────────────────────── */}
            <LocalizedLink href="/" className="flex items-center group">
              <Image
                src={isDark ? '/assets/neurawebW.webp' : '/assets/neurawebB.webp'}
                alt="NeuraWeb"
                width={160}
                height={48}
                priority
                className="h-11 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80"
              />
            </LocalizedLink>

            {/* ── Navigation desktop ────────────────────────── */}
            <nav className="hidden md:flex items-center gap-1">
              <LocalizedLink
                href="/"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/')
                    ? 'text-sky-400'
                    : 'text-navy-900 dark:text-gray-300 hover:text-sky-400 dark:hover:text-white hover:bg-frost/60 dark:hover:bg-white/5'
                }`}
              >
                {t('nav.home')}
                {isActive('/') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-sky-400" />
                )}
              </LocalizedLink>

              {/* Services — dropdown au survol */}
              <div className="relative group">
                <LocalizedLink
                  href="/services"
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center gap-1 ${
                    isActive('/services')
                      ? 'text-sky-400'
                      : 'text-navy-900 dark:text-gray-300 hover:text-sky-400 dark:hover:text-white hover:bg-frost/60 dark:hover:bg-white/5'
                  }`}
                  aria-haspopup="menu"
                >
                  {t('nav.services')}
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                  {isActive('/services') && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-sky-400" />
                  )}
                </LocalizedLink>

                {/* Pont invisible pour empêcher la fermeture entre le bouton et le panneau */}
                <div className="absolute left-0 right-0 top-full h-2" aria-hidden />

                {/* Panneau dropdown */}
                <div
                  role="menu"
                  className="absolute top-full left-0 mt-2 w-72 opacity-0 invisible translate-y-1
                    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                    focus-within:opacity-100 focus-within:visible focus-within:translate-y-0
                    transition-all duration-200 origin-top-left z-50"
                >
                  <div className="rounded-xl border border-gray-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0a0a1a]/95 backdrop-blur-md shadow-xl shadow-black/5 dark:shadow-black/40 p-2">
                    <LocalizedLink
                      href="/services"
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                        hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <Code size={18} className="mt-0.5 text-sky-400 shrink-0" />
                      <span>
                        <span className="block font-medium">{t('nav.dropdown.web.label')}</span>
                        <span className="block text-xs text-gray-500 dark:text-gray-500">{t('nav.dropdown.web.desc')}</span>
                      </span>
                    </LocalizedLink>

                    <LocalizedLink
                      href="/mobile-app-development"
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                        hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <Smartphone size={18} className="mt-0.5 text-cyan-500 shrink-0" />
                      <span>
                        <span className="block font-medium">{t('nav.dropdown.mobile.label')}</span>
                        <span className="block text-xs text-gray-500 dark:text-gray-500">{t('nav.dropdown.mobile.desc')}</span>
                      </span>
                    </LocalizedLink>

                    <LocalizedLink
                      href="/automatisation"
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                        hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <Zap size={18} className="mt-0.5 text-amber-500 shrink-0" />
                      <span>
                        <span className="block font-medium">{t('nav.dropdown.automation.label')}</span>
                        <span className="block text-xs text-gray-500 dark:text-gray-500">{t('nav.dropdown.automation.desc')}</span>
                      </span>
                    </LocalizedLink>

                    <LocalizedLink
                      href="/integration-ia"
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                        hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <Brain size={18} className="mt-0.5 text-sky-400 shrink-0" />
                      <span>
                        <span className="block font-medium">{t('nav.dropdown.ai.label')}</span>
                        <span className="block text-xs text-gray-500 dark:text-gray-500">{t('nav.dropdown.ai.desc')}</span>
                      </span>
                    </LocalizedLink>

                    <div className="my-1 border-t border-gray-100 dark:border-white/5" />

                    <LocalizedLink
                      href="/sante"
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                        hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <HeartPulse size={18} className="mt-0.5 text-rose-500 shrink-0" />
                      <span>
                        <span className="block font-medium">{t('nav.dropdown.sante.label')}</span>
                        <span className="block text-xs text-gray-500 dark:text-gray-500">{t('nav.dropdown.sante.desc')}</span>
                      </span>
                    </LocalizedLink>
                  </div>
                </div>
              </div>

              <LocalizedLink
                href="/blog"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/blog')
                    ? 'text-sky-400'
                    : 'text-navy-900 dark:text-gray-300 hover:text-sky-400 dark:hover:text-white hover:bg-frost/60 dark:hover:bg-white/5'
                }`}
              >
                {t('nav.blog')}
                {isActive('/blog') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-sky-400" />
                )}
              </LocalizedLink>

              <LocalizedLink
                href="/equipe"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/equipe')
                    ? 'text-sky-400'
                    : 'text-navy-900 dark:text-gray-300 hover:text-sky-400 dark:hover:text-white hover:bg-frost/60 dark:hover:bg-white/5'
                }`}
              >
                {t('nav.team')}
                {isActive('/equipe') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-sky-400" />
                )}
              </LocalizedLink>
            </nav>

            {/* ── Actions droite ────────────────────────────── */}
            <div className="flex items-center gap-2">
              {/* Language selector */}
              <LanguageSelector />

              {/* CTA Contact */}
              <LocalizedLink
                href="/contact"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 group bg-navy-900 hover:bg-navy-800"
                style={{ boxShadow: '0 4px 15px rgba(14,27,61,0.25)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(255,122,89,0.35)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(14,27,61,0.25)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {t('nav.contact')}
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </LocalizedLink>

              {/* Burger mobile */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100/60 dark:hover:bg-white/5 transition-all duration-200"
                aria-label={t('header.toggle.menu')}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Menu mobile ─────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-white dark:bg-navy-950 border-l border-gray-100 dark:border-navy-800 shadow-2xl transition-transform duration-400 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header du panel */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
            <Image
              src={isDark ? '/assets/neurawebW.webp' : '/assets/neurawebB.webp'}
              alt="NeuraWeb"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
            />
            <button
              onClick={() => setIsMenuOpen(false)}
              aria-label={t('nav.closeMenu')}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Liens */}
          <nav className="p-5 space-y-1">
            <LocalizedLink
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-frost dark:bg-navy-800 text-sky-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {t('nav.home')}
            </LocalizedLink>

            {/* Services + sous-liens indentés */}
            <div>
              <LocalizedLink
                href="/services"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/services')
                    ? 'bg-frost dark:bg-navy-800 text-sky-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {t('nav.services')}
              </LocalizedLink>
              <div className="ml-5 mt-1 space-y-0.5 border-l border-gray-200 dark:border-white/10 pl-3">
                <LocalizedLink
                  href="/services"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <Code size={14} className="text-sky-400" />
                  {t('nav.dropdown.web.label')}
                </LocalizedLink>
                <LocalizedLink
                  href="/mobile-app-development"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <Smartphone size={14} className="text-cyan-500" />
                  {t('nav.dropdown.mobile.label')}
                </LocalizedLink>
                <LocalizedLink
                  href="/automatisation"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <Zap size={14} className="text-amber-500" />
                  {t('nav.dropdown.automation.label')}
                </LocalizedLink>
                <LocalizedLink
                  href="/integration-ia"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <Brain size={14} className="text-sky-400" />
                  {t('nav.dropdown.ai.label')}
                </LocalizedLink>
                <LocalizedLink
                  href="/sante"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <HeartPulse size={14} className="text-rose-500" />
                  {t('nav.dropdown.sante.label')}
                </LocalizedLink>
              </div>
            </div>

            <LocalizedLink
              href="/blog"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/blog')
                  ? 'bg-frost dark:bg-navy-800 text-sky-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {t('nav.blog')}
            </LocalizedLink>

            <LocalizedLink
              href="/equipe"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/equipe')
                  ? 'bg-frost dark:bg-navy-800 text-sky-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {t('nav.team')}
            </LocalizedLink>
          </nav>

          {/* CTA mobile */}
          <div className="px-5 pt-2">
            <LocalizedLink
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 transition-colors duration-200"
            >
              {t('nav.contact')}
              <ArrowRight size={14} />
            </LocalizedLink>
          </div>

          {/* Séparateur + infos */}
          <div className="absolute bottom-8 left-5 right-5">
            <div className="gradient-line mb-4" />
            <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
              contact@neuraweb.tech
            </p>
          </div>
        </div>
      </div>
    </>
  );
}