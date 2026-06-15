'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Building, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { LocalizedLink } from '@/components/localized-link';

interface Slot {
  date: string;
  time: string;
  available: boolean;
}

interface BookingPageClientProps {
  lang: 'fr' | 'en' | 'es';
  preselectedService?: string;
  preselectedPack?: string;
}

const translations = {
  fr: {
    title: 'Réserver un rendez-vous',
    subtitle: 'Choisissez un créneau pour discuter de votre projet',
    step1: 'Créneau',
    step2: 'Vos informations',
    selectDate: 'Sélectionnez une date',
    selectTime: 'Sélectionnez une heure',
    noSlots: 'Aucun créneau disponible',
    loading: 'Chargement des créneaux...',
    name: 'Votre nom *',
    email: 'Votre email *',
    phone: 'Téléphone',
    whatsapp: 'WhatsApp (pour l\'appel)',
    company: 'Entreprise',
    service: 'Service intéressé',
    pack: 'Pack sélectionné',
    message: 'Message (optionnel)',
    submit: 'Confirmer le rendez-vous',
    submitting: 'Réservation en cours...',
    back: 'Retour',
    backToHome: 'Retour à l\'accueil',
    success: 'Rendez-vous confirmé !',
    successMessage: 'Vous recevrez un email de confirmation. À bientôt !',
    error: 'Erreur lors de la réservation',
    services: ['Développement Web', 'Application Mobile', 'Intégration IA', 'Automatisation', 'Site Restaurant', 'Site Santé', 'Audit IA', 'Autre'],
    packs: {
      starter: 'Pack Starter - 1 490€',
      business: 'Pack Business - 3 990€',
      premium: 'Pack Premium - 7 990€',
      ai: 'Pack IA - Sur devis'
    }
  },
  en: {
    title: 'Book an appointment',
    subtitle: 'Choose a time slot to discuss your project',
    step1: 'Time slot',
    step2: 'Your information',
    selectDate: 'Select a date',
    selectTime: 'Select a time',
    noSlots: 'No available slots',
    loading: 'Loading slots...',
    name: 'Your name *',
    email: 'Your email *',
    phone: 'Phone',
    whatsapp: 'WhatsApp (for the call)',
    company: 'Company',
    service: 'Service interested',
    pack: 'Selected pack',
    message: 'Message (optional)',
    submit: 'Confirm appointment',
    submitting: 'Booking...',
    back: 'Back',
    backToHome: 'Back to home',
    success: 'Appointment confirmed!',
    successMessage: 'You will receive a confirmation email. See you soon!',
    error: 'Booking error',
    services: ['Web Development', 'Mobile App', 'AI Integration', 'Automation', 'Restaurant Website', 'Healthcare Website', 'AI Audit', 'Other'],
    packs: {
      starter: 'Starter Pack - €1,490',
      business: 'Business Pack - €3,990',
      premium: 'Premium Pack - €7,990',
      ai: 'AI Pack - On quote'
    }
  },
  es: {
    title: 'Reservar una cita',
    subtitle: 'Elige un horario para discutir tu proyecto',
    step1: 'Horario',
    step2: 'Tu información',
    selectDate: 'Selecciona una fecha',
    selectTime: 'Selecciona una hora',
    noSlots: 'Sin horarios disponibles',
    loading: 'Cargando horarios...',
    name: 'Tu nombre *',
    email: 'Tu email *',
    phone: 'Teléfono',
    whatsapp: 'WhatsApp (para la llamada)',
    company: 'Empresa',
    service: 'Servicio de interés',
    pack: 'Pack seleccionado',
    message: 'Mensaje (opcional)',
    submit: 'Confirmar cita',
    submitting: 'Reservando...',
    back: 'Volver',
    backToHome: 'Volver al inicio',
    success: '¡Cita confirmada!',
    successMessage: 'Recibirás un email de confirmación. ¡Hasta pronto!',
    error: 'Error al reservar',
    services: ['Desarrollo Web', 'Aplicación Móvil', 'Integración IA', 'Automatización', 'Sitio Restaurante', 'Sitio Salud', 'Auditoría IA', 'Otro'],
    packs: {
      starter: 'Pack Starter - 1.490€',
      business: 'Pack Business - 3.990€',
      premium: 'Pack Premium - 7.990€',
      ai: 'Pack IA - Bajo presupuesto'
    }
  }
};

export function BookingPageClient({ lang, preselectedService, preselectedPack }: BookingPageClientProps) {
  const t = translations[lang];
  
  // Debug: log les props reçues
  console.log('BookingPageClient props:', { lang, preselectedService, preselectedPack });
  
  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  // Mapping des services de l'URL vers les labels affichés
  const serviceMapping: Record<string, Record<string, string>> = {
    'audit-ia': { fr: 'Audit IA', en: 'AI Audit', es: 'Auditoría IA' },
    'audit': { fr: 'Audit IA', en: 'AI Audit', es: 'Auditoría IA' },
    'devis': { fr: 'Développement Web', en: 'Web Development', es: 'Desarrollo Web' },
    'developpement-web': { fr: 'Développement Web', en: 'Web Development', es: 'Desarrollo Web' },
    'mobile': { fr: 'Application Mobile', en: 'Mobile App', es: 'Aplicación Móvil' },
    'integration-ia': { fr: 'Intégration IA', en: 'AI Integration', es: 'Integración IA' },
    'automatisation': { fr: 'Automatisation', en: 'Automation', es: 'Automatización' },
    'restaurant': { fr: 'Site Restaurant', en: 'Restaurant Website', es: 'Sitio Restaurante' },
    'sante': { fr: 'Site Santé', en: 'Healthcare Website', es: 'Sitio Salud' },
    'appel': { fr: 'Autre', en: 'Other', es: 'Otro' },
    'renseignement': { fr: 'Autre', en: 'Other', es: 'Otro' },
  };

  const getDisplayService = (service: string): string => {
    if (!service) return '';
    return serviceMapping[service]?.[lang] || service;
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    company: '',
    service: '',
    pack: '',
    message: ''
  });

  // Synchroniser les props avec le state au montage et quand les props changent
  useEffect(() => {
    const serviceDisplay = preselectedService 
      ? (serviceMapping[preselectedService]?.[lang] || preselectedService)
      : '';
    
    setFormData(prev => ({
      ...prev,
      service: serviceDisplay,
      pack: preselectedPack || ''
    }));
  }, [preselectedService, preselectedPack, lang]);

  const packLabel = preselectedPack && t.packs[preselectedPack as keyof typeof t.packs];

  useEffect(() => {
    fetch('/api/booking?action=getAvailableSlots')
      .then(res => res.json())
      .then(data => {
        if (data.slots) {
          setSlots(data.slots);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const uniqueDates = Array.from(new Set(slots.map(s => s.date))).sort();
  const availableTimes = slots.filter(s => s.date === selectedDate && s.available).map(s => s.time);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US',
      { weekday: 'long', day: 'numeric', month: 'long' }
    );
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !selectedDate || !selectedTime) {
      setError(t.error);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bookSlot',
          data: {
            ...formData,
            date: selectedDate,
            time: selectedTime,
            language: lang
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || t.error);
      }
    } catch {
      setError(t.error);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white to-gray-50 dark:from-[#050510] dark:to-[#0a0a1a]">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t.success}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{t.successMessage}</p>
            <LocalizedLink
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToHome}
            </LocalizedLink>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white to-gray-50 dark:from-[#050510] dark:to-[#0a0a1a]">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t.title}</h1>
            <p className="text-gray-600 dark:text-gray-300">{t.subtitle}</p>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step === 1 ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>1</div>
            <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step === 2 ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>2</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
            {/* Step 1: Sélection du créneau */}
            {step === 1 && (
              <div className="p-6 space-y-6">
                {/* Pack présélectionné - affiché dès l'étape 1 */}
                {packLabel && (
                  <div className="bg-gray-100 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.pack}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{packLabel}</p>
                  </div>
                )}
                
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-500" />
                    <p className="text-gray-500 dark:text-gray-400 mt-4">{t.loading}</p>
                  </div>
                ) : uniqueDates.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-12">{t.noSlots}</p>
                ) : (
                  <>
                    {/* Sélection de la date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        {t.selectDate}
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto">
                        {uniqueDates.map(date => {
                          const d = new Date(date);
                          const dayName = d.toLocaleDateString(
                            lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US',
                            { weekday: 'short' }
                          );
                          const dayNum = d.getDate();
                          const month = d.toLocaleDateString(
                            lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US',
                            { month: 'short' }
                          );
                          
                          return (
                            <button
                              key={date}
                              onClick={() => { setSelectedDate(date); setSelectedTime(''); }}
                              className={`p-2 rounded-xl text-center transition-all ${
                                selectedDate === date 
                                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                              }`}
                            >
                              <div className="text-xs uppercase">{dayName}</div>
                              <div className="text-lg font-bold">{dayNum}</div>
                              <div className="text-xs">{month}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sélection de l'heure */}
                    {selectedDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          <Clock className="w-4 h-4 inline mr-2" />
                          {t.selectTime}
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                          {availableTimes.map(time => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-2 rounded-xl text-center transition-all font-medium ${
                                selectedTime === time 
                                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bouton suivant */}
                    <button
                      onClick={() => selectedDate && selectedTime && setStep(2)}
                      disabled={!selectedDate || !selectedTime}
                      className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all"
                    >
                      {t.step2} →
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Step 2: Informations */}
            {step === 2 && (
              <div className="p-6 space-y-4">
                {/* Résumé du créneau */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex items-center gap-4">
                  <Calendar className="w-6 h-6 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{formatDate(selectedDate)}</div>
                    <div className="text-gray-500 dark:text-gray-400">{selectedTime}</div>
                  </div>
                </div>

                {/* Pack présélectionné */}
                {packLabel && (
                  <div className="bg-gray-100 dark:bg-gray-800/40 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.pack}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{packLabel}</p>
                  </div>
                )}

                {/* Formulaire */}
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <User className="w-4 h-4 inline mr-1" />
                      {t.name}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Mail className="w-4 h-4 inline mr-1" />
                      {t.email}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Phone className="w-4 h-4 inline mr-1" />
                        {t.phone}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <MessageSquare className="w-4 h-4 inline mr-1" />
                        {t.whatsapp}
                      </label>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Building className="w-4 h-4 inline mr-1" />
                      {t.company}
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={e => setFormData({...formData, company: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.service}
                    </label>
                    <select
                      value={formData.service}
                      onChange={e => setFormData({...formData, service: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    >
                      <option value="">{t.service}</option>
                      {t.services.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t.message}
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                {/* Boutons */}
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    ← {t.back}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !formData.name || !formData.email}
                    className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t.submitting}
                      </>
                    ) : (
                      t.submit
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}