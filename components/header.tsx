'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useTranslation } from '@/hooks/use-translation';
import { LanguageSelector } from '@/components/language-selector';
import Image from 'next/image';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 dark:bg-[#050510]/90 backdrop-blur-xl border-b border-gray-100/80 dark:border-white/5 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">

            {/* ── Logo ──────────────────────────────────────── */}
            <Link href="/" className="flex items-center group">
              <Image
                src={isDark ? '/assets/neurawebW.webp' : '/assets/neurawebB.webp'}
                alt="NeuraWeb"
                width={160}
                height={48}
                priority
                className="h-11 w-auto object-contain transition-opacity duration-200 group-hover:opacity-80"
              />
            </Link>

            {/* ── Navigation desktop ────────────────────────── */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/')
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-white/5'
                }`}
              >
                {t('nav.home')}
                {isActive('/') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-brand-500" />
                )}
              </Link>

              <Link
                href="/services"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/services')
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-white/5'
                }`}
              >
                {t('nav.services')}
                {isActive('/services') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-brand-500" />
                )}
              </Link>

              <Link
                href="/contact"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/contact')
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-white/5'
                }`}
              >
                {t('nav.contact')}
                {isActive('/contact') && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-brand-500" />
                )}
              </Link>
            </nav>

            {/* ── Actions droite ────────────────────────────── */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-white/5 transition-all duration-200"
                aria-label={t('header.toggle.theme')}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Language selector */}
              <LanguageSelector />

              {/* CTA Réserver */}
              <Link
                href="/booking"
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 group"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(99,102,241,0.35)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {t('nav.booking')}
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>

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
          className={`absolute top-0 right-0 h-full w-72 bg-white dark:bg-[#0a0a1a] border-l border-gray-100 dark:border-white/5 shadow-2xl transition-transform duration-400 ${
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
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Liens */}
          <nav className="p-5 space-y-1">
            {[
              { href: '/', label: t('nav.home') },
              { href: '/services', label: t('nav.services') },
              { href: '/contact', label: t('nav.contact') },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA mobile */}
          <div className="px-5 pt-2">
            <Link
              href="/booking"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {t('nav.booking')}
              <ArrowRight size={14} />
            </Link>
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
