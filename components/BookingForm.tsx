'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Building, CheckCircle, Loader2 } from 'lucide-react'

interface Slot {
  date: string
  time: string
  available: boolean
  dateFormatted?: string
}

interface BookingFormProps {
  language: 'fr' | 'en' | 'es'
  onClose: () => void
  onSuccess: (message: string) => void
  preselectedService?: string
  preselectedPack?: string
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
    success: 'Rendez-vous confirmé !',
    successMessage: 'Vous recevrez un email de confirmation. À bientôt !',
    error: 'Erreur lors de la réservation',
    services: ['Audit IA', 'Devis', 'Site vitrine', 'E-commerce', 'Application web', 'Intégration IA', 'Automatisation', 'Autre'],
    packs: {
      starter: 'Pack Starter - 1 500€',
      business: 'Pack Business - 4 900€',
      premium: 'Pack Premium - 9 900€',
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
    success: 'Appointment confirmed!',
    successMessage: 'You will receive a confirmation email. See you soon!',
    error: 'Booking error',
    services: ['AI Audit', 'Quote', 'Showcase website', 'E-commerce', 'Web application', 'AI integration', 'Automation', 'Other'],
    packs: {
      starter: 'Starter Pack - €1,500',
      business: 'Business Pack - €4,900',
      premium: 'Premium Pack - €9,900',
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
    success: '¡Cita confirmada!',
    successMessage: 'Recibirás un email de confirmación. ¡Hasta pronto!',
    error: 'Error al reservar',
    services: ['Auditoría IA', 'Presupuesto', 'Sitio web', 'E-commerce', 'Aplicación web', 'Integración IA', 'Automatización', 'Otro'],
    packs: {
      starter: 'Pack Starter - 1.500€',
      business: 'Pack Business - 4.900€',
      premium: 'Pack Premium - 9.900€',
      ai: 'Pack IA - Bajo presupuesto'
    }
  }
}

export default function BookingForm({ language, onClose, onSuccess, preselectedService, preselectedPack }: BookingFormProps) {
  const t = translations[language]
  
  const [step, setStep] = useState(1)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Données du formulaire
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    company: '',
    service: preselectedService || '',
    pack: preselectedPack || '',
    message: ''
  })
  
  // Obtenir le label du pack sélectionné
  const packLabel = preselectedPack && t.packs ? t.packs[preselectedPack as keyof typeof t.packs] : null

  // Charger les créneaux disponibles
  useEffect(() => {
    fetch('/api/booking?action=getAvailableSlots')
      .then(res => res.json())
      .then(data => {
        if (data.slots) {
          setSlots(data.slots)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  // Dates uniques
  const uniqueDates = Array.from(new Set(slots.map(s => s.date))).sort()
  
  // Heures disponibles pour la date sélectionnée
  const availableTimes = slots
    .filter(s => s.date === selectedDate && s.available)
    .map(s => s.time)

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !selectedDate || !selectedTime) {
      setError(t.error)
      return
    }

    setSubmitting(true)
    setError(null)

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
            language
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess(t.successMessage)
        }, 2000)
      } else {
        setError(data.error || t.error)
      }
    } catch {
      setError(t.error)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{t.success}</h3>
        <p className="text-gray-400">{t.successMessage}</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-1">{t.title}</h3>
        <p className="text-gray-400 text-sm">{t.subtitle}</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          step === 1 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
        }`}>1</div>
        <div className="w-12 h-0.5 bg-gray-700" />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          step === 2 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
        }`}>2</div>
      </div>

      {/* Step 1: Sélection du créneau */}
      {step === 1 && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-500" />
              <p className="text-gray-400 mt-2">{t.loading}</p>
            </div>
          ) : uniqueDates.length === 0 ? (
            <p className="text-center text-gray-400 py-8">{t.noSlots}</p>
          ) : (
            <>
              {/* Sélection de la date */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {t.selectDate}
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {uniqueDates.map(date => {
                    const d = new Date(date)
                    const dayName = d.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US', { weekday: 'short' })
                    const dayNum = d.getDate()
                    const month = d.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US', { month: 'short' })
                    
                    return (
                      <button
                        key={date}
                        onClick={() => { setSelectedDate(date); setSelectedTime('') }}
                        className={`p-2 rounded-lg text-center transition-all ${
                          selectedDate === date 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-xs uppercase">{dayName}</div>
                        <div className="text-lg font-bold">{dayNum}</div>
                        <div className="text-xs">{month}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Sélection de l'heure */}
              {selectedDate && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {t.selectTime}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableTimes.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-lg text-center transition-all ${
                          selectedTime === time 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                {t.step2} →
              </button>
            </>
          )}
        </div>
      )}

      {/* Step 2: Informations */}
      {step === 2 && (
        <div className="space-y-3">
          {/* Résumé du créneau */}
          <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-white font-medium">{selectedDate}</div>
              <div className="text-gray-400 text-sm">{selectedTime}</div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="grid gap-3">
            <input
              type="text"
              placeholder={t.name}
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            
            <input
              type="email"
              placeholder={t.email}
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                type="tel"
                placeholder={t.phone}
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <input
                type="tel"
                placeholder={t.whatsapp}
                value={formData.whatsapp}
                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <input
              type="text"
              placeholder={t.company}
              value={formData.company}
              onChange={e => setFormData({...formData, company: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />

            <select
              value={formData.service}
              onChange={e => setFormData({...formData, service: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="">{t.service}</option>
              {t.services.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <textarea
              placeholder={t.message}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Boutons */}
          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition-all"
            >
              ← {t.back}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !formData.name || !formData.email}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
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

      {/* Fermer */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors"
      >
        ✕
      </button>
    </div>
  )
}
