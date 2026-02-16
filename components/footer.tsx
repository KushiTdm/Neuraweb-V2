'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/hooks/use-translation';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900/95 backdrop-blur-md border-t border-white/30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          {/* Company Info */}
          <div className="text-center sm:text-left">
            <Link href="/" className="flex items-center justify-center sm:justify-start space-x-2 mb-3">
              <Image
                src="/assets/neurawebW.webp"
                alt="NeuraWeb Logo"
                width={120}
                height={24}
                className="h-6 w-auto object-contain"
                priority={false}
              />
            </Link>
            <p className="text-white text-xs mb-2 max-w-sm mx-auto sm:mx-0">
              {t('footer.company.description')}
            </p>
            <div className="text-gray-200 text-xs">
              <a 
                href="mailto:contact@neuraweb.tech" 
                className="hover:text-white transition-colors"
              >
                contact@neuraweb.tech
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="text-center">
            <h3 className="text-white font-medium mb-3 text-sm">{t('nav.services')}</h3>
            <ul className="space-y-2 text-white text-xs">
              <li className="hover:text-gray-200 transition-colors cursor-default">
                {t('services.web.title')}
              </li>
              <li className="hover:text-gray-200 transition-colors cursor-default">
                {t('services.automation.title')}
              </li>
              <li className="hover:text-gray-200 transition-colors cursor-default">
                {t('services.ai.title')}
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:col-span-2 lg:col-span-1 lg:text-right">
            <h3 className="text-white font-medium mb-3 text-sm">
              {t('footer.links.title')}
            </h3>
            <ul className="space-y-2 text-white text-xs">
              <li>
                <Link 
                  href="/contact" 
                  className="hover:text-gray-200 transition-colors"
                >
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/quote" 
                  className="hover:text-gray-200 transition-colors"
                >
                  {t('nav.quote')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/booking" 
                  className="hover:text-gray-200 transition-colors"
                >
                  {t('nav.booking')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-6 pt-4 text-center text-gray-200 text-xs">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}