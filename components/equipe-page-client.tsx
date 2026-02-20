'use client';

import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import type { TranslationKey } from '@/locales/fr';

const getTeamData = (t: (key: TranslationKey) => string) => [
  {
    name: 'Nacer',
    role: t('equipe.members.nacer.role'),
    bio: t('equipe.members.nacer.bio'),
    stack: ['React', 'Next.js', 'OpenAI', 'n8n', 'Python', 'TypeScript'],
    certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
  },
  {
    name: 'Sandra',
    role: t('equipe.members.sandra.role'),
    bio: t('equipe.members.sandra.bio'),
    stack: ['Social Media', 'SEO', 'Content Marketing', 'Branding', 'Analytics'],
    certifications: ['Google Ads Certified', 'HubSpot Marketing'],
  },
  {
    name: 'Arthur',
    role: t('equipe.members.arthur.role'),
    bio: t('equipe.members.arthur.bio'),
    stack: ['Python', 'LangChain', 'n8n', 'OpenAI', 'Machine Learning', 'API'],
    certifications: ['TensorFlow Developer', 'n8n Certified'],
  },
];

export function EquipePageClient() {
  const { t } = useTranslation();
  const team = getTeamData(t);

  return (
    <main id="main-content" className="min-h-screen bg-white dark:bg-[#050510] pt-24">
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t('equipe.hero.title')}{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              NeuraWeb
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('equipe.hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {team.map((member) => (
              <article key={member.name} className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-colors">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-4xl text-white font-bold">{member.name.charAt(0)}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" title={t('equipe.available')} />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{member.name}</h2>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">{member.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{member.bio}</p>
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">{t('equipe.stack')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {member.stack.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{tech}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">{t('equipe.certifications')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {member.certifications.map((cert) => (
                      <span key={cert} className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">{cert}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">{t('equipe.values.title')}</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('equipe.values.speed.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('equipe.values.speed.desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('equipe.values.quality.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('equipe.values.quality.desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('equipe.values.proximity.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('equipe.values.proximity.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('equipe.cta.title')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{t('equipe.cta.desc')}</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            {t('equipe.cta.button')}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </section>
    </main>
  );
}