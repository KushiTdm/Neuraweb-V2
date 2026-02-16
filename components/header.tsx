'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, User, LogOut } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useTranslation } from '@/hooks/use-translation';
import { LanguageSelector } from '@/components/language-selector';
import Image from 'next/image';

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: {
    name?: string;
    type?: 'client' | 'admin';
    isValidated?: boolean;
  } | null;
  onLogout?: () => void;
}

export function Header({ 
  isAuthenticated = false, 
  user = null,
  onLogout 
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    onLogout?.();
    setIsMenuOpen(false);
  };

  // Détection du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermeture du menu mobile au changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isHomePage = pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || !isHomePage
        ? 'bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700'
        : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center relative h-14 w-auto">
            <Image
              src={isDark ? "/assets/neurawebW.webp" : "/assets/neurawebB.webp"}
              alt="NeuraWeb Logo"
              width={180}
              height={56}
              priority
              className="h-14 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <noscript>
              <div className="h-14 w-14 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">NW</span>
              </div>
            </noscript>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/services"
              className={`font-medium transition-colors duration-200 ${
                isActive('/services') 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              {t('nav.services')}
            </Link>
            <Link
              href="/booking"
              className="btn-primary"
            >
              {t('nav.booking')}
            </Link>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* User Authentication Section */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <User size={16} />
                  <span className="text-sm">{user?.name}</span>
                </div>
                {user?.type === 'client' && user?.isValidated && (
                  <Link
                    href="/wizard"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Project Wizard
                  </Link>
                )}
                {user?.type === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label={t('header.toggle.theme')}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {t('nav.login')}
                </Link>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label={t('header.toggle.theme')}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Language Selector */}
            <LanguageSelector />

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              aria-label={t('header.toggle.menu')}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/services"
                onClick={() => setIsMenuOpen(false)}
                className={`font-medium transition-colors duration-200 ${
                  isActive('/services') 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('nav.services')}
              </Link>
              <Link
                href="/booking"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary inline-block text-center"
              >
                {t('nav.booking')}
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-4">
                      <User size={16} />
                      <span className="text-sm">{user?.name}</span>
                    </div>
                    {user?.type === 'client' && user?.isValidated && (
                      <Link
                        href="/wizard"
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-4"
                      >
                        Project Wizard
                      </Link>
                    )}
                    {user?.type === 'admin' && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mb-4"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <LogOut size={16} />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {t('nav.login')}
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}