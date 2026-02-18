'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowUpRight, Zap } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from '@/components/theme-provider';

export function Footer() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const services = [
    t('services.web.title'),
    t('services.automation.title'),
    t('services.ai.title'),
  ];

  const links = [
    { href: '/contact', label: t('nav.contact') },
    { href: '/booking', label: t('nav.booking') },
    { href: '/services', label: t('nav.services') },
  ];

  return (
    <footer className="relative bg-[#050510] border-t border-white/5 overflow-hidden">
      {/* Glow décoratif */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #22d3ee, transparent)' }}
      />
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* ── Grille principale ──────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Colonne 1 : Marque */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/assets/neurawebW.webp"
                alt="NeuraWeb"
                width={140}
                height={42}
                loading="lazy"
                className="h-9 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              {t('footer.company.description')}
            </p>
            {/* Email */}
            <a
              href="mailto:contact@neuraweb.tech"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-brand-500/40 transition-colors">
                <Mail size={14} className="text-gray-400 group-hover:text-brand-400 transition-colors" />
              </div>
              contact@neuraweb.tech
            </a>
          </div>

          {/* Colonne 2 : Services */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-5 flex items-center gap-2">
              <Zap size={14} className="text-brand-400" />
              {t('nav.services')}
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-500/50 group-hover:bg-brand-400 transition-colors" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : Liens rapides */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-5">
              {t('footer.links.title')}
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-brand-400"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Ligne de séparation ────────────────────────── */}
        <div className="gradient-line mb-6" />

        {/* ── Copyright ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span>Crafted with</span>
            <span className="text-brand-500">♥</span>
            <span>by NeuraWeb</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
