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
      <div className="theme-accueil">
      <style>{`.contact-illus{animation:contactIn .9s ease-out both}@keyframes contactIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.contact-illus{animation:none}}`}</style>
      <Header />
      <main id="main-content" className="min-h-screen pt-24 pb-12 sm:pb-16 bg-creme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-6 sm:mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-chypre text-creme mb-3 sm:mb-4">
              {t('contact.hero.badge')}
            </span>
            <h1 className="text-[2rem] leading-[1.1] sm:text-5xl lg:text-6xl text-chypre mb-3 sm:mb-6">
              {t('contact.hero.title')}{' '}
              <span className="text-chypre">
                {t('contact.hero.title.highlight')}
              </span>
            </h1>
            <p className="text-base sm:text-xl text-chypre/90 max-w-2xl mx-auto mb-0 sm:mb-4">
              {t('contact.hero.subtitle')}
            </p>
            <p className="hidden sm:block text-base text-chypre/85 max-w-3xl mx-auto">
              {t('contact.hero.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-10 lg:gap-12">
            {/* Contact Info */}
            <div className="space-y-5 sm:space-y-8 max-md:order-2">
              <div className="bg-chypre/[0.05] rounded-2xl p-5 sm:p-8 border border-chypre/15">
                <h2 className="text-xl font-semibold text-chypre mb-6">
                  {t('contact.info.email.label')}
                </h2>
                <div className="space-y-4">
                  <a
                    href="mailto:contact@neuraweb.fr"
                    className="flex items-center gap-4 text-chypre/85 hover:text-chypre hover:underline underline-offset-4 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-chypre flex items-center justify-center">
                      <Mail className="w-5 h-5 text-creme" />
                    </div>
                    <div>
                      <p className="font-medium">contact@neuraweb.fr</p>
                      <p className="text-sm text-chypre/80">
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
                <div className="bg-chypre/[0.05] rounded-2xl p-5 sm:p-8 border border-chypre/15">
                  <h2 className="text-xl font-semibold text-chypre mb-2">
                    Nhắn tin qua WhatsApp
                  </h2>
                  <p className="text-sm text-chypre/80 mb-6">
                    Cách nhanh nhất để trao đổi trực tiếp. Chúng tôi trả lời bằng tiếng Việt, tiếng Anh hoặc tiếng Pháp.
                  </p>
                  <WhatsAppContactButton className="w-full sm:w-auto" />
                </div>
              )}

              <div className="bg-chypre/[0.05] rounded-2xl p-5 sm:p-8 border border-chypre/15">
                <h2 className="text-xl font-semibold text-chypre mb-6">
                  {t('contact.info.location.label')}
                </h2>
                <div className="flex items-center gap-4 text-chypre/85">
                  <div className="w-12 h-12 rounded-xl bg-chypre flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-creme" />
                  </div>
                  <div>
                    <p className="font-medium">{t('contact.info.location.value')}</p>
                    <p className="text-sm text-chypre/80">
                      {t('contact.info.location.desc')}
                    </p>
                  </div>
                </div>
              </div>
              {/* Illustration (lg+ seulement : ne repousse jamais le formulaire sur mobile).
                  Animation d'entrée unique, désactivée si prefers-reduced-motion. */}
              <div className="hidden lg:block contact-illus overflow-hidden rounded-2xl border border-chypre/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/redesign/contact-illustration.webp"
                  alt=""
                  width={960}
                  height={720}
                  loading="lazy"
                  className="h-auto w-full"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-chypre/[0.05] rounded-2xl p-5 sm:p-8 border border-chypre/15">
              <h2 className="text-xl font-semibold text-chypre mb-2">
                {t('contact.form.title')}
              </h2>
              <p className="text-chypre/85 mb-6">
                {t('contact.form.subtitle')}
              </p>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-chypre/10 border border-chypre/30">
                  <div className="flex items-center gap-2 text-chypre">
                    <CheckCircle className="w-5 h-5" />
                    <p className="font-medium">{t('contact.form.success.title')}</p>
                  </div>
                  <p className="text-sm text-chypre/85 mt-1">
                    {t('contact.form.success.desc')}
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-chypre/10 border border-chypre/30">
                  <div className="flex items-center gap-2 text-chypre">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">{t('contact.form.error.title')}</p>
                  </div>
                  <p className="text-sm text-chypre/85 mt-1">
                    {t('contact.form.error.desc')}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-chypre/85 mb-1">
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder={t('contact.form.name.placeholder')}
                    className="w-full px-4 py-3 rounded-xl border border-chypre/30 bg-creme text-chypre placeholder:text-chypre/60 focus:outline-none focus:ring-2 focus:ring-chypre/40 focus:border-chypre transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-chypre/85 mb-1">
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder={t('contact.form.email.placeholder')}
                    className="w-full px-4 py-3 rounded-xl border border-chypre/30 bg-creme text-chypre placeholder:text-chypre/60 focus:outline-none focus:ring-2 focus:ring-chypre/40 focus:border-chypre transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-chypre/85 mb-1">
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    placeholder={t('contact.form.subject.placeholder')}
                    className="w-full px-4 py-3 rounded-xl border border-chypre/30 bg-creme text-chypre placeholder:text-chypre/60 focus:outline-none focus:ring-2 focus:ring-chypre/40 focus:border-chypre transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-chypre/85 mb-1">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder={t('contact.form.message.placeholder')}
                    className="w-full px-4 py-3 rounded-xl border border-chypre/30 bg-creme text-chypre placeholder:text-chypre/60 focus:outline-none focus:ring-2 focus:ring-chypre/40 focus:border-chypre transition-all resize-none"
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-chypre/80">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#004643]"
                  />
                  <span>
                    {t('forms.consent.prefix')}{' '}
                    <LocalizedLink href="/confidentialite" className="underline hover:text-chypre">
                      {t('forms.consent.link')}
                    </LocalizedLink>
                    {t('forms.consent.suffix')}
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting || !consent}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-chypre text-creme font-semibold transition-all duration-300 hover:bg-chypre/90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-creme/30 border-t-creme rounded-full animate-spin" />
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
      </div>
    </>
  );
}