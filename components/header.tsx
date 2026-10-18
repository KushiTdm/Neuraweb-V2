'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { LanguageSelector } from '@/components/language-selector';
import { LocalizedLink } from '@/components/localized-link';
import { DEMO_URL } from '@/lib/site-config';
import { NeuraWebLogo } from '@/components/brand/neuraweb-logo';
import { StaggeredMenuPanel, type StaggeredMenuItem } from '@/components/ui/staggered-menu';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const isDark = false; // le contenu du site est toujours clair : header clair en permanence
  const { t } = useTranslation();
  const pathname = usePathname();

  // Vérifie si le chemin correspond (en ignorant le préfixe de langue)
  const isActive = (path: string) => {
    const pathWithoutLang = pathname.replace(/^\/(fr|en|es|vi)/, '') || '/';
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

  // Expose l'état de la barre pour les éléments collants de page (ex. filtres du blog)
  useEffect(() => {
    document.documentElement.dataset.navHidden = String(isHidden && !isMenuOpen);
    return () => { delete document.documentElement.dataset.navHidden; };
  }, [isHidden, isMenuOpen]);

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
            ? 'bg-navbg/75 backdrop-saturate-150 border-navfg/10 shadow-[0_1px_20px_rgba(0,70,67,0.08)]'
            : 'bg-navbg border-navfg/15'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">

            {/* ── Logo ──────────────────────────────────────── */}
            <LocalizedLink href="/" className="flex items-center group">
              <NeuraWebLogo height={30} className="w-auto text-navfg transition-opacity duration-200 group-hover:opacity-80" />
            </LocalizedLink>

            {/* ── Navigation desktop ────────────────────────── */}
            <nav className="hidden md:flex items-center gap-1">
              <LocalizedLink
                href="/"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/')
                    ? 'text-navfg'
                    : 'text-navfg hover:text-navfg hover:bg-navfg/10'
                }`}
              >
                {t('nav.home')}
                {isActive('/') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-navfg" />
                )}
              </LocalizedLink>

              {/* Services — dropdown au survol */}
              <div className="relative group">
                <LocalizedLink
                  href="/developpement-web"
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center gap-1 ${
                    isActive('/developpement-web')
                      ? 'text-navfg'
                      : 'text-navfg hover:text-navfg hover:bg-navfg/10'
                  }`}
                  aria-haspopup="menu"
                >
                  {t('nav.services')}
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                  {isActive('/developpement-web') && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-navfg" />
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
                  <div className="rounded-xl border border-gray-200/80 bg-white/95 backdrop-blur-md shadow-xl shadow-black/5 p-2">
                    {/* Développement web + ses verticales sectorielles */}
                    <LocalizedLink
                      href="/developpement-web"
                      className="flex flex-col px-3 py-2.5 rounded-lg text-sm transition-colors
                        text-gray-700 hover:text-gray-900
                        hover:bg-gray-50"
                    >
                      <span className="block font-medium">{t('nav.dropdown.web.label')}</span>
                      <span className="block text-xs text-gray-500">{t('nav.dropdown.web.desc')}</span>
                    </LocalizedLink>

                    <div className="my-1 border-t border-gray-100" />

                    <LocalizedLink
                      href="/mobile-app-development"
                      className="flex flex-col px-3 py-2.5 rounded-lg text-sm transition-colors
                        text-gray-700 hover:text-gray-900
                        hover:bg-gray-50"
                    >
                      <span className="block font-medium">{t('nav.dropdown.mobile.label')}</span>
                      <span className="block text-xs text-gray-500">{t('nav.dropdown.mobile.desc')}</span>
                    </LocalizedLink>

                    <LocalizedLink
                      href="/automatisation"
                      className="flex flex-col px-3 py-2.5 rounded-lg text-sm transition-colors
                        text-gray-700 hover:text-gray-900
                        hover:bg-gray-50"
                    >
                      <span className="block font-medium">{t('nav.dropdown.automation.label')}</span>
                      <span className="block text-xs text-gray-500">{t('nav.dropdown.automation.desc')}</span>
                    </LocalizedLink>

                    <LocalizedLink
                      href="/integration-ia"
                      className="flex flex-col px-3 py-2.5 rounded-lg text-sm transition-colors
                        text-gray-700 hover:text-gray-900
                        hover:bg-gray-50"
                    >
                      <span className="block font-medium">{t('nav.dropdown.ai.label')}</span>
                      <span className="block text-xs text-gray-500">{t('nav.dropdown.ai.desc')}</span>
                    </LocalizedLink>

                    <div className="my-1 border-t border-gray-100" />

                    {/* Démo interactive — sous-domaine externe (web + mobile connectés) */}
                    <a
                      href={DEMO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col px-3 py-2.5 rounded-lg text-sm transition-colors
                        text-indigo-700 hover:bg-indigo-50"
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        Démo interactive
                        <ArrowRight size={13} className="-rotate-45" />
                      </span>
                      <span className="block text-xs text-gray-500">Web + mobile connectés en temps réel</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Secteurs — entrée distincte des services (pour qui, pas ce qu'on fait) */}
              <div className="relative group">
                <button
                  type="button"
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center gap-1 ${
                    ['/secteurs/sante', '/secteurs/restaurants-hotels', '/secteurs/collectivites'].some((h) => isActive(h))
                      ? 'text-navfg'
                      : 'text-navfg hover:text-navfg hover:bg-navfg/10'
                  }`}
                  aria-haspopup="menu"
                >
                  {t('nav.sectors')}
                  <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                  {['/secteurs/sante', '/secteurs/restaurants-hotels', '/secteurs/collectivites'].some((h) => isActive(h)) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-navfg" />
                  )}
                </button>
                <div className="absolute left-0 right-0 top-full h-2" aria-hidden />
                <div
                  role="menu"
                  className="absolute top-full left-0 mt-2 w-72 opacity-0 invisible translate-y-1
                    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                    focus-within:opacity-100 focus-within:visible focus-within:translate-y-0
                    transition-all duration-200 origin-top-left z-50"
                >
                  <div className="rounded-xl border border-gray-200/80 bg-white/95 backdrop-blur-md shadow-xl shadow-black/5 p-2">
                    {[
                      { href: '/secteurs/sante', key: 'sante' },
                      { href: '/secteurs/restaurants-hotels', key: 'restaurants' },
                      { href: '/secteurs/collectivites', key: 'collectivites' },
                    ].map(({ href, key }) => (
                      <LocalizedLink
                        key={key}
                        href={href}
                        className="flex flex-col px-3 py-2.5 rounded-lg text-sm transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      >
                        <span className="block font-medium">{t(`nav.dropdown.${key}.label` as any)}</span>
                        <span className="block text-xs text-gray-500">{t(`nav.dropdown.${key}.desc` as any)}</span>
                      </LocalizedLink>
                    ))}
                  </div>
                </div>
              </div>

              <LocalizedLink
                href="/blog"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/blog')
                    ? 'text-navfg'
                    : 'text-navfg hover:text-navfg hover:bg-navfg/10'
                }`}
              >
                {t('nav.blog')}
                {isActive('/blog') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-navfg" />
                )}
              </LocalizedLink>

              <LocalizedLink
                href="/equipe"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/equipe')
                    ? 'text-navfg'
                    : 'text-navfg hover:text-navfg hover:bg-navfg/10'
                }`}
              >
                {t('nav.team')}
                {isActive('/equipe') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-navfg" />
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
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-navbg transition-all duration-300 group bg-navfg hover:bg-navfg/90"
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
                  background: 'transparent',
                  border: '1px solid rgb(var(--nav-fg, 0 70 67) / 0.3)',
                  zIndex: 51, // au-dessus du panel (z-48)
                  position: 'relative',
                }}
                aria-label={t('header.toggle.menu')}
                aria-expanded={isMenuOpen}
              >
                <span
                  className="block w-[18px] h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center"
                  style={{
                    color: isDark ? '#fff' : '#004643',
                    transform: isMenuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
                  }}
                />
                <span
                  className="block w-[18px] h-[1.5px] bg-current rounded-full transition-all duration-300"
                  style={{
                    color: isDark ? '#fff' : '#004643',
                    opacity: isMenuOpen ? 0 : 1,
                    transform: isMenuOpen ? 'scaleX(0)' : 'none',
                  }}
                />
                <span
                  className="block w-[18px] h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center"
                  style={{
                    color: isDark ? '#fff' : '#004643',
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
            { label: t('nav.home'), href: '/', ariaLabel: t('nav.home') },
            { group: t('nav.services'), label: t('nav.dropdown.web.label'), href: '/developpement-web' },
            { group: t('nav.services'), label: t('nav.dropdown.mobile.label'), href: '/mobile-app-development' },
            { group: t('nav.services'), label: t('nav.dropdown.automation.label'), href: '/automatisation' },
            { group: t('nav.services'), label: t('nav.dropdown.ai.label'), href: '/integration-ia' },
            { group: t('nav.sectors'), label: t('nav.dropdown.sante.label'), href: '/secteurs/sante' },
            { group: t('nav.sectors'), label: t('nav.dropdown.restaurants.label'), href: '/secteurs/restaurants-hotels' },
            { group: t('nav.sectors'), label: t('nav.dropdown.collectivites.label'), href: '/secteurs/collectivites' },
            { group: '·', label: t('nav.blog'), href: '/blog', ariaLabel: t('nav.blog') },
            { group: '·', label: t('nav.team'), href: '/equipe', ariaLabel: t('nav.team') },
            { group: '·', label: 'Démo', href: DEMO_URL, external: true, ariaLabel: 'Démo interactive web + mobile' },
          ] as StaggeredMenuItem[]}
        />
      </div>
    </>
  );
}