'use client';

import React from 'react';
import { Gift, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

// ── Audit CTA Component ─────────────────────────────────────────────────────
// Offre d'entrée "Audit IA Gratuit" pour convertir les visiteurs
export function AuditCTA() {
  return (
    <section 
      className="relative py-16 sm:py-24 px-4 overflow-hidden"
      aria-label="Offre d'entrée gratuite"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-cyan-600/10" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%), 
                           radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 p-8 sm:p-12">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <Gift className="w-4 h-4 text-blue-500" aria-hidden="true" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Offre de lancement
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Audit IA Gratuit
              <span className="block text-lg sm:text-xl font-normal text-gray-500 dark:text-gray-400 mt-2">
                Valeur 490€
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              En 45 minutes, on analyse votre stack actuelle et on identifie les{' '}
              <strong className="text-gray-900 dark:text-white">
                3 opportunités d'automatisation IA
              </strong>{' '}
              les plus impactantes pour votre business.
            </p>
          </div>

          {/* Benefits list */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              'Analyse de votre workflow actuel',
              'Identification des tâches automatisables',
              'Estimation ROI chiffrée',
              'Roadmap d\'implémentation prioritaire',
            ].map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
              >
                <CheckCircle 
                  className="w-5 h-5 text-green-500 flex-shrink-0" 
                  aria-hidden="true" 
                />
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <a
              href="/contact?booking=true&service=audit-ia"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300"
              aria-label="Réserver mon audit IA gratuit — 45 minutes"
            >
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              <span>Réserver mon audit gratuit</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </a>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Aucune obligation. 100% actionnable.
            </p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Sans engagement</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>45 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Visio ou présentiel</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Compact Audit Banner ────────────────────────────────────────────────────
export function AuditBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Gift className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Audit IA Gratuit</h3>
            <p className="text-white/80 text-sm">Valeur 490€ — 45 minutes</p>
          </div>
        </div>
        <a
          href="https://cal.com/neuraweb/audit-ia"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
        >
          Réserver
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export default AuditCTA;