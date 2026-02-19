'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, User, Loader2, AlertCircle, Calendar, Clock, CheckCircle, Bot } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'

interface Message {
  role: 'user' | 'assistant'
  content: string
  showBooking?: 'dates' | 'times' | 'form'
  slots?: Slot[]
  selectedDate?: string
}

interface Slot {
  date: string
  time: string
  available: boolean
  dateFormatted?: string
}

interface ChatResponse {
  response: string
  remainingMessages: number
  maxMessages: number
  error?: string
  showBookingDates?: boolean
}

// Icône Robot IA personnalisée
const RobotIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="8" width="16" height="12" rx="2"/>
    <path d="M2 12h2"/><path d="M20 12h2"/><path d="M8 4h8"/>
    <circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/>
    <path d="M9 17h6"/>
  </svg>
)

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remainingMessages, setRemainingMessages] = useState(15)
  const [sessionId, setSessionId] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  
  // Booking state
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookingStep, setBookingStep] = useState<'none' | 'dates' | 'times' | 'form' | 'success'>('none')
  const [bookingForm, setBookingForm] = useState({
    name: '', email: '', phone: '', whatsapp: '', company: '', service: '', message: ''
  })
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const previousGreetingRef = useRef<string>('')
  
  const { t, language } = useTranslation()

  // Génère un ID de session
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }, [])

  // Initialisation
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('neuraweb_client_id')
      if (stored) setSessionId(stored)
      else {
        const newId = generateSessionId()
        localStorage.setItem('neuraweb_client_id', newId)
        setSessionId(newId)
      }
    } catch {
      setSessionId(generateSessionId())
    }
  }, [generateSessionId])

  // Écouter l'événement d'ouverture du chatbot depuis les packs
  useEffect(() => {
    const handleOpenChatbot = (event: CustomEvent<{ pack: string }>) => {
      setIsOpen(true)
      const packId = event.detail?.pack
      if (packId) {
        const packNames: Record<string, Record<string, string>> = {
          fr: { starter: 'Starter (1 990€)', business: 'Business (4 900€)', premium: 'Premium (6 900€)', ai: 'Pack IA (sur devis)' },
          en: { starter: 'Starter (€1,990)', business: 'Business (€4,900)', premium: 'Premium (€6,900)', ai: 'AI Pack (custom)' },
          es: { starter: 'Starter (1 990€)', business: 'Business (4 900€)', premium: 'Premium (6 900€)', ai: 'Pack IA (a presupuesto)' }
        }
        const packName = packNames[language]?.[packId] || packId
        const message = language === 'fr' 
          ? `Bonjour ! Je suis intéressé(e) par le ${packName}. Pouvez-vous m'en dire plus ?`
          : language === 'es'
          ? `¡Hola! Estoy interesado/a en el ${packName}. ¿Puede decirme más?`
          : `Hello! I'm interested in the ${packName}. Can you tell me more?`
        
        setInput(message)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }

    window.addEventListener('openChatbot', handleOpenChatbot as EventListener)
    return () => window.removeEventListener('openChatbot', handleOpenChatbot as EventListener)
  }, [language])

  // Message de bienvenue
  useEffect(() => {
    if (mounted) {
      const greeting = t('chatbot.greeting')
      if (greeting !== previousGreetingRef.current) {
        previousGreetingRef.current = greeting
        setMessages([{ role: 'assistant', content: greeting }])
      }
    }
  }, [mounted, language, t])

  // Scroll automatique
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus()
  }, [isOpen])

  // Charger les créneaux disponibles
  const loadAvailableSlots = async (): Promise<Slot[]> => {
    try {
      console.log('📡 Appel /api/booking...')
    const response = await fetch('/api/booking?action=getAvailableSlots')
    console.log('📡 Status:', response.status)
    const data = await response.json()
    console.log('📡 Data:', JSON.stringify(data))
      if (data.slots && data.slots.length > 0) {
        console.log(`✅ ${data.slots.length} créneaux chargés`)
        setAvailableSlots(data.slots)
        return data.slots
      }
      console.log('⚠️ Aucun créneau reçu, génération locale...')
      return generateFallbackSlots()
    } catch (err) {
      console.error('❌ Erreur chargement créneaux:', err)
      return generateFallbackSlots()
    }
  }

  // Générer des créneaux de secours si l'API échoue
  const generateFallbackSlots = (): Slot[] => {
    const slots: Slot[] = []
    const today = new Date()
    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

    for (let day = 1; day <= 14; day++) {
      const date = new Date(today)
      date.setDate(today.getDate() + day)

      if (date.getDay() === 0 || date.getDay() === 6) continue

      const dateStr = date.toISOString().split('T')[0]

      timeSlots.forEach(time => {
        slots.push({
          date: dateStr,
          time,
          available: true
        })
      })
    }
    
    console.log(`📋 ${slots.length} créneaux de secours générés`)
    setAvailableSlots(slots)
    return slots
  }

  // Démarrer le processus de réservation
  const startBooking = async () => {
    const slots = await loadAvailableSlots()
    if (slots.length === 0) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: language === 'fr' 
          ? "Désolé, il n'y a pas de créneaux disponibles pour le moment. Veuillez nous contacter à contact@neuraweb.tech"
          : language === 'es'
          ? "Lo siento, no hay horarios disponibles en este momento. Contáctenos en contact@neuraweb.tech"
          : "Sorry, there are no available slots at the moment. Please contact us at contact@neuraweb.tech"
      }])
      return
    }
    
    setBookingStep('dates')
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: language === 'fr' 
        ? "📅 **Choisissez une date pour votre rendez-vous :**"
        : language === 'es'
        ? "📅 **Elige una fecha para tu cita:**"
        : "📅 **Choose a date for your appointment:**",
      showBooking: 'dates',
      slots: slots
    }])
  }

  // Formater une date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(
      language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US',
      { weekday: 'long', day: 'numeric', month: 'long' }
    )
  }

  // Sélectionner une date
  const selectDate = (date: string, slots?: Slot[]) => {
    setSelectedDate(date)
    setBookingStep('times')
    const currentSlots = slots || availableSlots
    const availableTimes = currentSlots.filter(s => s.date === date && s.available).map(s => s.time)
    
    setMessages(prev => [...prev, 
      { role: 'user', content: formatDate(date) },
      { role: 'assistant', 
        content: language === 'fr' 
          ? `🕐 **Créneaux disponibles le ${formatDate(date)} :**\n\n${availableTimes.length} créneau${availableTimes.length > 1 ? 'x' : ''} disponible${availableTimes.length > 1 ? 's' : ''}`
          : language === 'es'
          ? `🕐 **Horarios disponibles el ${formatDate(date)}:**\n\n${availableTimes.length} horario${availableTimes.length > 1 ? 's' : ''} disponible${availableTimes.length > 1 ? 's' : ''}`
          : `🕐 **Available slots on ${formatDate(date)}:**\n\n${availableTimes.length} slot${availableTimes.length > 1 ? 's' : ''} available`,
        showBooking: 'times',
        selectedDate: date,
        slots: currentSlots
      }
    ])
  }

  // Sélectionner une heure
  const selectTime = (time: string) => {
    setSelectedTime(time)
    setBookingStep('form')
    
    setMessages(prev => [...prev, 
      { role: 'user', content: time },
      { role: 'assistant', 
        content: language === 'fr' 
          ? `📝 **Parfait ! Veuillez remplir vos informations pour confirmer le rendez-vous :**\n\n📅 ${formatDate(selectedDate)} à ${time}`
          : language === 'es'
          ? `📝 **¡Perfecto! Por favor complete su información para confirmar la cita:**\n\n📅 ${formatDate(selectedDate)} a las ${time}`
          : `📝 **Perfect! Please fill in your details to confirm the appointment:**\n\n📅 ${formatDate(selectedDate)} at ${time}`,
        showBooking: 'form',
        selectedDate: selectedDate
      }
    ])
  }

  // Soumettre la réservation
  const submitBooking = async () => {
    if (!bookingForm.name || !bookingForm.email) return
    
    setIsSubmittingBooking(true)
    
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bookSlot',
          data: {
            ...bookingForm,
            date: selectedDate,
            time: selectedTime,
            language
          }
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setBookingStep('success')
        setMessages(prev => [...prev, 
          { role: 'user', content: `${bookingForm.name} - ${bookingForm.email}` },
          { role: 'assistant', 
            content: language === 'fr' 
              ? `✅ **Rendez-vous confirmé !**\n\n📅 ${formatDate(selectedDate)} à ${selectedTime}\n\n📧 Vous recevrez un email de confirmation.\n📞 Nous vous appellerons à l'heure convenue.\n\nÀ très bientôt !`
              : language === 'es'
              ? `✅ **¡Cita confirmada!**\n\n📅 ${formatDate(selectedDate)} a las ${selectedTime}\n\n📧 Recibirás un email de confirmación.\n📞 Te llamaremos a la hora acordada.\n\n¡Hasta pronto!`
              : `✅ **Appointment confirmed!**\n\n📅 ${formatDate(selectedDate)} at ${selectedTime}\n\n📧 You will receive a confirmation email.\n📞 We will call you at the agreed time.\n\nSee you soon!`
          }
        ])
        // Reset
        setBookingForm({ name: '', email: '', phone: '', whatsapp: '', company: '', service: '', message: '' })
        setSelectedDate('')
        setSelectedTime('')
      } else {
        setError(data.error || 'Erreur')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setIsSubmittingBooking(false)
    }
  }

  // Envoyer un message

const sendMessage = async () => {
    if (!input.trim() || isLoading || remainingMessages <= 0) return

    const userMessage = input.trim()
    setInput('')
    setError(null)
    setIsLoading(true)
    
    if (bookingStep !== 'none' && bookingStep !== 'success') {
      setBookingStep('none')
    }

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      // ✅ FIX: Nettoyer l'historique avant envoi (supprimer les champs UI)
      const cleanHistory = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content })) // ← on garde UNIQUEMENT role + content

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          history: cleanHistory, // ← historique propre sans showBooking/slots
          language
        })
      })

      const data: ChatResponse = await response.json()

      if (!response.ok) throw new Error(data.error || t('chatbot.error.general'))

      if (data.showBookingDates) {
        const slots = await loadAvailableSlots()
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response,
          showBooking: 'dates',
          slots: slots
        }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      }
      
      setRemainingMessages(data.remainingMessages)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('chatbot.error.general')
      setError(errorMessage)
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!mounted) return null

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-700 hover:bg-gray-600' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <RobotIcon className="w-6 h-6 text-white" />}
        {!isOpen && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />}
      </button>

      {/* Fenêtre de chat */}
      <div className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <RobotIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{t('chatbot.title')}</h3>
                <p className="text-white/70 text-xs">{remainingMessages} {t('chatbot.remaining')}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-950">
            {messages.map((msg, index) => (
              <div key={index}>
                <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-blue-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <RobotIcon className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                    msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>

                {/* Dates cliquables */}
                {msg.showBooking === 'dates' && msg.slots && (
                  <div className="mt-3 ml-11 grid grid-cols-3 gap-2">
                    {Array.from(new Set(msg.slots.filter(s => s.available).map(s => s.date))).sort().slice(0, 9).map(date => (
                      <button
                        key={date}
                        onClick={() => selectDate(date, msg.slots)}
                        className="p-2 bg-gray-800 hover:bg-purple-600 border border-gray-700 hover:border-purple-500 rounded-lg text-center text-white text-sm transition-all"
                      >
                        <div className="text-xs text-gray-400 group-hover:text-white">{new Date(date).toLocaleDateString(
                          language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US', { weekday: 'short' }
                        )}</div>
                        <div className="font-bold text-lg">{new Date(date).getDate()}</div>
                        <div className="text-xs text-gray-400">{new Date(date).toLocaleDateString(
                          language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US', { month: 'short' }
                        )}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Heures cliquables */}
                {msg.showBooking === 'times' && msg.selectedDate && msg.slots && (
                  <div className="mt-3 ml-11 grid grid-cols-4 gap-2">
                    {msg.slots.filter(s => s.date === msg.selectedDate && s.available).map(s => s.time).map(time => (
                      <button
                        key={time}
                        onClick={() => selectTime(time)}
                        className="p-2 bg-gray-800 hover:bg-purple-600 border border-gray-700 hover:border-purple-500 rounded-lg text-white text-sm font-medium transition-all"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}

                {/* Formulaire */}
                {msg.showBooking === 'form' && (
                  <div className="mt-3 ml-11 space-y-2">
                    <input
                      type="text"
                      placeholder={language === 'fr' ? 'Nom *' : language === 'es' ? 'Nombre *' : 'Name *'}
                      value={bookingForm.name}
                      onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={bookingForm.email}
                      onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="tel"
                        placeholder={language === 'fr' ? 'Téléphone' : language === 'es' ? 'Teléfono' : 'Phone'}
                        value={bookingForm.phone}
                        onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                      <input
                        type="tel"
                        placeholder="WhatsApp"
                        value={bookingForm.whatsapp}
                        onChange={e => setBookingForm({...bookingForm, whatsapp: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <textarea
                      placeholder={language === 'fr' ? 'Message (optionnel)' : language === 'es' ? 'Mensaje (opcional)' : 'Message (optional)'}
                      value={bookingForm.message}
                      onChange={e => setBookingForm({...bookingForm, message: e.target.value})}
                      rows={2}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                    />
                    <button
                      onClick={submitBooking}
                      disabled={!bookingForm.name || !bookingForm.email || isSubmittingBooking}
                      className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmittingBooking ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {language === 'fr' ? 'Réservation...' : language === 'es' ? 'Reservando...' : 'Booking...'}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          {language === 'fr' ? 'Confirmer le RDV' : language === 'es' ? 'Confirmar cita' : 'Confirm booking'}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <RobotIcon className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-gray-900 border-t border-gray-700">
            {remainingMessages <= 0 ? (
              <div className="text-center py-2">
                <p className="text-gray-400 text-sm mb-2">{t('chatbot.limit')}</p>
                <a href="mailto:contact@neuraweb.tech" className="text-blue-400 hover:text-blue-300 text-sm underline">
                  {t('chatbot.contact')}
                </a>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chatbot.placeholder')}
                  disabled={isLoading}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 disabled:opacity-50 text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-950 border-t border-gray-800 flex items-center justify-center">
            <p className="text-gray-500 text-xs">
              {t('chatbot.footer')} <span className="text-purple-400">NeuraWeb</span>
            </p>
          </div>
        </div>
      </div>

      {/* Overlay mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
