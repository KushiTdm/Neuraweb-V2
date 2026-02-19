'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useTranslation } from '@/hooks/use-translation';
import { useLanguage } from '@/contexts/language-context';
import { useAnalytics } from '@/hooks/use-analytics';
import BookingForm from '@/components/BookingForm';
import {
  Mail,
  MessageCircle,
  MapPin,
  ArrowRight,
  Clock,
  Gift,
  Star,
  Headphones,
  Sparkles,
  Send,
  Calendar,
  ChevronDown,
  X,
  Package,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  name: string;
  email: string;
  subject: string;
  pack: string;
  budget: string;
  message: string;
}

// ─── Contact Info Card ────────────────────────────────────────────────────────
function ContactInfoCard({
  icon: Icon,
  label,
  value,
  desc,
  href,
  color,
  delay,
  isVisible,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  desc: string;
  href?: string;
  color: string;
  delay: number;
  isVisible: boolean;
}) {
  return (
    <div
      className="group relative"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {/* Glow au hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none"
        style={{ background: `${color}20` }}
      />

      <div className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/8 transition-all duration-300 group-hover:-translate-y-1 h-full">
        {/* Icône */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg"
          style={{ background: `${color}20`, border: `1px solid ${color}40` }}
        >
          <Icon size={22} style={{ color }} />
        </div>

        {/* Label */}
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">
          {label}
        </p>

        {/* Valeur */}
        {href ? (
          <a
            href={href}
            className="block text-base font-bold text-white hover:text-brand-400 transition-colors duration-200 mb-1"
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {value}
          </a>
        ) : (
          <p className="text-base font-bold text-white mb-1">{value}</p>
        )}

        {/* Description */}
        <p className="text-sm text-gray-400">{desc}</p>
      </div>
    </div>
  );
}

// ─── Trust Card ───────────────────────────────────────────────────────────────
function TrustCard({
  icon: Icon,
  title,
  desc,
  color,
  delay,
  isVisible,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  delay: number;
  isVisible: boolean;
}) {
  return (
    <div
      className="group flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm hover:border-white/15 hover:bg-white/7 transition-all duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
        transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${color}18`, border: `1px solid ${color}35` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-sm font-bold text-white mb-0.5">{title}</p>
        <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── Contact Page Content (avec useSearchParams) ───────────────────────────────
function ContactPageContent() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { 
    trackFormStart, 
    trackFormProgress, 
    trackFormSubmit, 
    trackCTA,
    trackContact 
  } = useAnalytics();
  
  const [formStarted, setFormStarted] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    pack: '',
    budget: '',
    message: '',
  });

  // Préselection du pack depuis l'URL
  useEffect(() => {
    const packParam = searchParams.get('pack');
    if (packParam && ['starter', 'business', 'premium', 'ai'].includes(packParam)) {
      setFormData(prev => ({ ...prev, pack: packParam }));
    }
  }, [searchParams]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [trustVisible, setTrustVisible] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  const cardsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  // Bloquer le scroll quand la modale booking est ouverte
  useEffect(() => {
    document.body.style.overflow = showBooking ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showBooking]);

  // Hero reveal
  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // IntersectionObserver pour les sections
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const createObserver = (
      ref: React.RefObject<HTMLDivElement | null>,
      setter: (v: boolean) => void
    ) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry?.isIntersecting) setter(true); },
        { threshold: 0.1 }
      );
      obs.observe(ref.current);
      observers.push(obs);
    };

    createObserver(cardsRef, setCardsVisible);
    createObserver(formRef, setFormVisible);
    createObserver(trustRef, setTrustVisible);

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Envoi du formulaire via /api/contact (proxy → Google Apps Script)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Résoudre le label budget lisible
      const budgetLabel = formData.budget
        ? t(`contact.form.budget.${formData.budget}` as any)
        : '';

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          budget: budgetLabel,
          message: formData.message,
          language,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Tracker la soumission réussie
        trackFormSubmit({
          form_name: 'contact_form',
          pack_selected: formData.pack,
          budget_selected: formData.budget,
          language: language,
        });
        
        toast({
          title: t('contact.form.success.title'),
          description: t('contact.form.success.desc'),
        });
        setFormData({ name: '', email: '', subject: '', pack: '', budget: '', message: '' });
        setFormStarted(false);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch {
      toast({
        title: t('contact.form.error.title'),
        description: t('contact.form.error.desc'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Tracker le début de saisie du formulaire (premier champ rempli)
    if (!formStarted && value.trim()) {
      setFormStarted(true);
      trackFormStart({
        form_name: 'contact_form',
        language: language,
      });
    }
    
    // Tracker la progression quand pack ou budget est sélectionné
    if (name === 'pack' && value) {
      trackFormProgress({
        form_name: 'contact_form',
        form_step: 1,
        pack_selected: value,
        language: language,
      });
    }
    
    if (name === 'budget' && value) {
      trackFormProgress({
        form_name: 'contact_form',
        form_step: 2,
        budget_selected: value,
        language: language,
      });
    }
  };

  // Données des cartes de contact
  const contactCards = [
    {
      icon: Mail,
      label: t('contact.info.email.label'),
      value: t('contact.info.email.value'),
      desc: t('contact.info.email.desc'),
      href: `mailto:${t('contact.info.email.value')}`,
      color: '#6366f1',
    },
    {
      icon: MessageCircle,
      label: t('contact.info.whatsapp.label'),
      value: t('contact.info.whatsapp.value'),
      desc: t('contact.info.whatsapp.desc'),
      href: `https://wa.me/${t('contact.info.whatsapp.value').replace(/\s+/g, '').replace('+', '')}`,
      color: '#22d3ee',
    },
    {
      icon: MapPin,
      label: t('contact.info.location.label'),
      value: t('contact.info.location.value'),
      desc: t('contact.info.location.desc'),
      href: undefined,
      color: '#a78bfa',
    },
  ];

  // Données des cartes de confiance
  const trustCards = [
    { icon: Clock,       title: t('contact.trust.fast.title'),   desc: t('contact.trust.fast.desc'),   color: '#22d3ee' },
    { icon: Gift,        title: t('contact.trust.free.title'),   desc: t('contact.trust.free.desc'),   color: '#4ade80' },
    { icon: Star,        title: t('contact.trust.expert.title'), desc: t('contact.trust.expert.desc'), color: '#f59e0b' },
    { icon: Headphones,  title: t('contact.trust.support.title'),desc: t('contact.trust.support.desc'),color: '#a78bfa' },
  ];

  // Options budget
  const budgetOptions = [
    { value: 'option1', label: t('contact.form.budget.option1') },
    { value: 'option2', label: t('contact.form.budget.option2') },
    { value: 'option3', label: t('contact.form.budget.option3') },
    { value: 'option4', label: t('contact.form.budget.option4') },
    { value: 'option5', label: t('contact.form.budget.option5') },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050510]">

        {/* ══════════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden pt-24 pb-20 px-4 sm:px-6 lg:px-8">

          {/* Ligne lumineuse en haut */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #22d3ee, transparent)' }}
          />

          {/* Orbes de couleur */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
              style={{ background: 'radial-gradient(circle, #4f46e5, transparent 70%)' }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[80px]"
              style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }}
            />
            <div
              className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full opacity-10 blur-[60px]"
              style={{ background: 'radial-gradient(circle, #22d3ee, transparent 70%)' }}
            />
          </div>

          {/* Grille subtile */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Particules */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${(i * 6.7 + 5) % 100}%`,
                  animationDelay: `${(i * 0.4) % 3}s`,
                  animationDuration: `${3 + (i * 0.25) % 2}s`,
                }}
              />
            ))}
          </div>

          {/* Contenu hero */}
          <div className="relative z-10 max-w-4xl mx-auto text-center">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 backdrop-blur-sm mb-8"
              style={{
                background: 'rgba(6, 182, 212, 0.08)',
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
              }}
            >
              <Sparkles size={14} className="text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">
                {t('contact.hero.badge')}
              </span>
            </div>

            {/* Titre */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 0.9s ease, transform 0.9s ease',
                transitionDelay: '0.15s',
                textShadow: '0 0 40px rgba(139, 92, 246, 0.3)',
              }}
            >
              {t('contact.hero.title')}{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #67e8f9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {t('contact.hero.title.highlight')}
              </span>
            </h1>

            {/* Sous-titre */}
            <p
              className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.9s ease, transform 0.9s ease',
                transitionDelay: '0.3s',
              }}
            >
              {t('contact.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            CARTES DE CONTACT
        ══════════════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div ref={cardsRef} className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
            {contactCards.map((card, i) => (
              <ContactInfoCard
                key={card.label}
                {...card}
                delay={i * 120}
                isVisible={cardsVisible}
              />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            FORMULAIRE + SIDEBAR
        ══════════════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-6xl mx-auto">

            {/* Ligne décorative */}
            <div className="gradient-line mb-16 opacity-40" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 xl:gap-16">

              {/* ── Formulaire (3/5) ─────────────────────────── */}
              <div
                ref={formRef}
                className="lg:col-span-3"
                style={{
                  opacity: formVisible ? 1 : 0,
                  transform: formVisible ? 'translateX(0)' : 'translateX(-30px)',
                  transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {/* En-tête formulaire */}
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {t('contact.form.title')}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t('contact.form.subtitle')}
                  </p>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Nom + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-300"
                      >
                        {t('contact.form.name')}
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={t('contact.form.name.placeholder')}
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-300"
                      >
                        {t('contact.form.email')}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={t('contact.form.email.placeholder')}
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Pack */}
                  <div className="space-y-2">
                    <label
                      htmlFor="pack"
                      className="block text-sm font-semibold text-gray-300"
                    >
                      {language === 'fr' ? 'Pack souhaité' : 'Desired pack'}
                    </label>
                    <div className="relative">
                      <select
                        id="pack"
                        name="pack"
                        value={formData.pack}
                        onChange={handleChange}
                        className="input-field appearance-none pr-10 cursor-pointer"
                      >
                        <option value="">
                          {language === 'fr' ? 'Sélectionnez un pack' : 'Select a pack'}
                        </option>
                        <option value="starter">
                          {language === 'fr' ? 'Starter - 1 990€' : 'Starter - €1,990'}
                        </option>
                        <option value="business">
                          {language === 'fr' ? 'Business - 4 900€' : 'Business - €4,900'}
                        </option>
                        <option value="premium">
                          {language === 'fr' ? 'Premium - 6 900€' : 'Premium - €6,900'}
                        </option>
                        <option value="ai">
                          {language === 'fr' ? 'Pack IA - Sur devis' : 'AI Pack - Custom'}
                        </option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Sujet */}
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-300"
                    >
                      {t('contact.form.subject')}
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.form.subject.placeholder')}
                      className="input-field"
                    />
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <label
                      htmlFor="budget"
                      className="block text-sm font-semibold text-gray-300"
                    >
                      {t('contact.form.budget')}
                    </label>
                    <div className="relative">
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="input-field appearance-none pr-10 cursor-pointer"
                      >
                        <option value="" disabled>
                          {t('contact.form.budget.placeholder')}
                        </option>
                        {budgetOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-300"
                    >
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder={t('contact.form.message.placeholder')}
                      className="input-field resize-none"
                    />
                  </div>

                  {/* Bouton submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: isSubmitting
                        ? 'rgba(99,102,241,0.5)'
                        : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      boxShadow: isSubmitting
                        ? 'none'
                        : '0 8px 30px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                        (e.currentTarget as HTMLElement).style.boxShadow =
                          '0 12px 40px rgba(79,70,229,0.55), inset 0 1px 0 rgba(255,255,255,0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        '0 8px 30px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.1)';
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        {t('contact.form.submitting')}
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        {t('contact.form.submit')}
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* ── Sidebar (2/5) ─────────────────────────────── */}
              <div
                ref={trustRef}
                className="lg:col-span-2 space-y-6"
                style={{
                  opacity: trustVisible ? 1 : 0,
                  transform: trustVisible ? 'translateX(0)' : 'translateX(30px)',
                  transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s',
                }}
              >
                {/* Titre "Pourquoi nous choisir" */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-5">
                    {t('contact.trust.title')}
                  </h3>
                  <div className="space-y-3">
                    {trustCards.map((card, i) => (
                      <TrustCard
                        key={card.title}
                        {...card}
                        delay={i * 100}
                        isVisible={trustVisible}
                      />
                    ))}
                  </div>
                </div>

                {/* Séparateur */}
                <div className="gradient-line opacity-30" />

                {/* CTA Booking */}
                <div
                  className="relative p-6 rounded-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(124,58,237,0.15))',
                    border: '1px solid rgba(99,102,241,0.25)',
                  }}
                >
                  {/* Glow décoratif */}
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar size={18} style={{ color: '#818cf8' }} />
                      <h4 className="text-base font-bold text-white">
                        {t('contact.booking.title')}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed mb-5">
                      {t('contact.booking.desc')}
                    </p>
                    <button
                      onClick={() => {
                        trackCTA({
                          cta_name: 'booking_cta',
                          cta_location: 'contact_page',
                          language: language,
                        });
                        setShowBooking(true);
                      }}
                      className="group inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 border border-white/15 bg-white/8 hover:bg-white/15 hover:border-white/25"
                    >
                      <Calendar size={15} />
                      {t('contact.booking.cta')}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Toaster />

      {/* ══════════════════════════════════════════════════════
          MODALE BOOKING
      ══════════════════════════════════════════════════════ */}
      {showBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowBooking(false); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl"
            style={{ background: '#0d0d1a' }}
          >
            {/* Bouton fermer */}
            <button
              onClick={() => setShowBooking(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>

            {/* Ligne lumineuse en haut */}
            <div
              className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
              style={{ background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #22d3ee, transparent)' }}
            />

            <BookingForm
              language={language as 'fr' | 'en' | 'es'}
              onClose={() => setShowBooking(false)}
              onSuccess={(msg) => {
                setShowBooking(false);
                toast({ title: msg });
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

// ─── Page principale avec Suspense ────────────────────────────────────────────
export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <ContactPageContent />
    </Suspense>
  );
}
