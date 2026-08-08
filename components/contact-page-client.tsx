'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useTranslation } from '@/hooks/use-translation';
import { LocalizedLink } from '@/components/localized-link';
import { WhatsAppContactButton } from '@/components/whatsapp-contact-button';
import { Mail, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPageClient() {
  const { t, language } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const payload = Object.fromEntries(formData.entries());
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, language }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
        setConsent(false);
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white to-gray-50 dark:from-[#050510] dark:to-[#0a0a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 mb-4">
              {t('contact.hero.badge')}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('contact.hero.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                {t('contact.hero.title.highlight')}
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
              {t('contact.hero.subtitle')}
            </p>
            <p className="text-base text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              {t('contact.hero.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t('contact.info.email.label')}
                </h2>
                <div className="space-y-4">
                  <a
                    href="mailto:contact@neuraweb.fr"
                    className="flex items-center gap-4 text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <p className="font-medium">contact@neuraweb.fr</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('contact.info.email.desc')}
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* ── Contact WhatsApp (vi uniquement) ────────────────────────
                  Canal de repli en attendant un compte Zalo (le canal de contact
                  par défaut visé au Vietnam à terme) : on l'expose au même niveau
                  que l'email sur `/vi/contact`. Libellés inline en vietnamien (et
                  non dans `locales/vi.ts`) parce que le bloc n'est jamais rendu
                  dans les 3 autres langues. Le bouton reste inactif tant que le
                  numéro WhatsApp réel n'est pas renseigné — voir
                  `components/whatsapp-contact-button.tsx`. */}
              {language === 'vi' && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Nhắn tin qua WhatsApp
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Cách nhanh nhất để trao đổi trực tiếp. Chúng tôi trả lời bằng tiếng Việt, tiếng Anh hoặc tiếng Pháp.
                  </p>
                  <WhatsAppContactButton className="w-full sm:w-auto" />
                </div>
              )}

              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {t('contact.info.location.label')}
                </h2>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium">{t('contact.info.location.value')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('contact.info.location.desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('contact.form.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('contact.form.subtitle')}
              </p>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <p className="font-medium">{t('contact.form.success.title')}</p>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    {t('contact.form.success.desc')}
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">{t('contact.form.error.title')}</p>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    {t('contact.form.error.desc')}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder={t('contact.form.name.placeholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder={t('contact.form.email.placeholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    placeholder={t('contact.form.subject.placeholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder={t('contact.form.message.placeholder')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 accent-gray-900"
                  />
                  <span>
                    {t('forms.consent.prefix')}{' '}
                    <LocalizedLink href="/confidentialite" className="underline hover:text-gray-900 dark:hover:text-white">
                      {t('forms.consent.link')}
                    </LocalizedLink>
                    {t('forms.consent.suffix')}
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting || !consent}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: '#111827',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('contact.form.submitting')}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('contact.form.submit')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}