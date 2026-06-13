'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useTranslation } from '@/hooks/use-translation';
import { LanguageSelector } from '@/components/language-selector';
import { LocalizedLink } from '@/components/localized-link';
import Image from 'next/image';
import { StaggeredMenuPanel, type StaggeredMenuItem } from '@/components/ui/staggered-menu';

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
                    ? 'text-white'
                    : 'text-navy-900 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-frost/60 dark:hover:bg-white/5'
                }`}
              >
                {t('nav.home')}
                {isActive('/') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-white" />
                )}
              </LocalizedLink>

              {/* Services — dropdown au survol */}
              <div className="relative group">
                <LocalizedLink
                  href="/developpement-web"
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center gap-1 ${
                    isActive('/developpement-web')
                      ? 'text-white'
                      : 'text-navy-900 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-frost/60 dark:hover:bg-white/5'
                  }`}
                  aria-haspopup="menu"
                >
                  {t('nav.services')}
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                  {isActive('/developpement-web') && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-white" />
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
                    {/* Développement web + ses verticales sectorielles */}
                    <LocalizedLink
                      href="/developpement-web"
                      className="flex flex-col px-3 py-2.5 rounded-lg text-sm transition-colors
                        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                        hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <span className="block font-medium">{t('nav.dropdown.web.label')}</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-500">{t('nav.dropdown.web.desc')}</span>
                    </LocalizedLink>

                    {/* Sous-pages sectorielles de Développement web */}
                    <div className="ml-3 pl-3 border-l border-gray-100 dark:border-white/10">
                      <LocalizedLink
                        href="/restaurants"
                        className="flex flex-col px-3 py-2 rounded-lg text-sm transition-colors
                          text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                          hover:bg-gray-50 dark:hover:bg-white/5"
                      >
                        <span className="block font-medium">{t('nav.dropdown.restaurants.label')}</span>
                        <span className="block text-xs text-gray-400 dark:text-gray-600">{t('nav.dropdown.restaurants.desc')}</span>
                      </LocalizedLink>

                      <LocalizedLink
                        href="/sante"
                        className="flex flex-col px-3 py-2 rounded-lg text-sm transition-colors
                          text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                          hover:bg-gray-50 dark:hover:bg-white/5"
                      >
                        <span className="block font-medium">{t('nav.dropdown.sante.label')}</span>
                        <span className="block text-xs text-gray-400 dark:text-gray-600">{t('nav.dropdown.sante.desc')}</span>
                      </LocalizedLink>
                    </div>

                    <div className="my-1 border-t border-gray-100 dark:border-white/5" />

                    <LocalizedLink
                      href="/mobile-app-development"
                      className="flex flex-col px-3 py-2.5 rounded-lg text-sm transition-colors
                        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                        hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <span className="block font-medium">{t('nav.dropdown.mobile.label')}</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-500">{t('nav.dropdown.mobile.desc')}</span>
                    </LocalizedLink>

                    <LocalizedLink
                      href="/automatisation"
                      className="flex flex-col px-3 py-2.5 rounded-lg text-sm transition-colors
                        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                        hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <span className="block font-medium">{t('nav.dropdown.automation.label')}</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-500">{t('nav.dropdown.automation.desc')}</span>
                    </LocalizedLink>

                    <LocalizedLink
                      href="/integration-ia"
                      className="flex flex-col px-3 py-2.5 rounded-lg text-sm transition-colors
                        text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white
                        hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <span className="block font-medium">{t('nav.dropdown.ai.label')}</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-500">{t('nav.dropdown.ai.desc')}</span>
                    </LocalizedLink>
                  </div>
                </div>
              </div>

              <LocalizedLink
                href="/blog"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/blog')
                    ? 'text-white'
                    : 'text-navy-900 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-frost/60 dark:hover:bg-white/5'
                }`}
              >
                {t('nav.blog')}
                {isActive('/blog') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-white" />
                )}
              </LocalizedLink>

              <LocalizedLink
                href="/equipe"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/equipe')
                    ? 'text-white'
                    : 'text-navy-900 dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-frost/60 dark:hover:bg-white/5'
                }`}
              >
                {t('nav.team')}
                {isActive('/equipe') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-white" />
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

              {/* Burger mobile — lignes animées */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-xl gap-[5px] transition-all duration-200"
                style={{
                  background: isMenuOpen ? 'rgba(93,184,240,0.1)' : 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  zIndex: 51, // au-dessus du panel (z-48)
                  position: 'relative',
                }}
                aria-label={t('header.toggle.menu')}
                aria-expanded={isMenuOpen}
              >
                <span
                  className="block w-[18px] h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center"
                  style={{
                    color: isScrolled ? (isDark ? '#fff' : '#0E1B3D') : '#fff',
                    transform: isMenuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
                  }}
                />
                <span
                  className="block w-[18px] h-[1.5px] bg-current rounded-full transition-all duration-300"
                  style={{
                    color: isScrolled ? (isDark ? '#fff' : '#0E1B3D') : '#fff',
                    opacity: isMenuOpen ? 0 : 1,
                    transform: isMenuOpen ? 'scaleX(0)' : 'none',
                  }}
                />
                <span
                  className="block w-[18px] h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center"
                  style={{
                    color: isScrolled ? (isDark ? '#fff' : '#0E1B3D') : '#fff',
                    transform: isMenuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Menu mobile — StaggeredMenu GSAP ─────────────────── */}
      <div className="md:hidden">
        <StaggeredMenuPanel
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          contactLabel={t('nav.contact')}
          items={[
            { label: t('nav.home'),     href: '/',                     ariaLabel: t('nav.home')     },
            { label: t('nav.dropdown.web.label'), href: '/developpement-web' },
            { label: t('nav.dropdown.restaurants.label'), href: '/restaurants', isSubItem: true },
            { label: t('nav.dropdown.sante.label'),       href: '/sante',       isSubItem: true },
            { label: 'Mobile',          href: '/mobile-app-development' },
            { label: 'IA',              href: '/integration-ia'        },
            { label: t('nav.blog'),     href: '/blog',                 ariaLabel: t('nav.blog')     },
            { label: t('nav.team'),     href: '/equipe',               ariaLabel: t('nav.team')     },
          ] as StaggeredMenuItem[]}
          colors={['#1A2847', '#0E1B3D']}
          accentColor="#ffffff"
        />
      </div>
    </>
  );
}