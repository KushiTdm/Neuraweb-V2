'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, User, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
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

const RobotIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="8" width="16" height="12" rx="2"/>
    <path d="M2 12h2"/><path d="M20 12h2"/><path d="M8 4h8"/>
    <circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/>
    <path d="M9 17h6"/>
  </svg>
)

// ── Widget SVG Icons ──────────────────────────────────────────────────────────
const BotWidgetIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <circle cx="9" cy="11" r="1.5" fill="currentColor" />
    <circle cx="17" cy="11" r="1.5" fill="currentColor" />
    <path d="M9 15.5c1 1.5 7 1.5 8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="3" y="5" width="20" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 5V3M17 5V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 13H1M25 13H23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const CloseSmallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 3l8 8M11 3L3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

  // ── Label widget state ──────────────────────────────────────────────────────
  const [labelVisible, setLabelVisible] = useState(false)
  const [labelDismissed, setLabelDismissed] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)
  const [btnClicked, setBtnClicked] = useState(false)
  const [dotPhase, setDotPhase] = useState(0)

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

  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }, [])

  // ── Init session ────────────────────────────────────────────────────────────
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

  // ── Affiche le label après 5 secondes ───────────────────────────────────────
  useEffect(() => {
    if (!mounted) return
    const t = setTimeout(() => setLabelVisible(true), 5000)
    return () => clearTimeout(t)
  }, [mounted])

  // ── Auto-ferme le label après 12 secondes ───────────────────────────────────
  useEffect(() => {
    if (!labelVisible) return
    const t = setTimeout(() => setLabelDismissed(true), 12000)
    return () => clearTimeout(t)
  }, [labelVisible])

  // ── Animation des points de typing ──────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => setDotPhase(p => (p + 1) % 4), 400)
    return () => clearInterval(interval)
  }, [])

  // ── Écoute l'événement openChatbot (depuis les pages services/packages) ─────
  useEffect(() => {
    const handleOpenChatbot = (event: CustomEvent<{ pack: string }>) => {
      setIsOpen(true)
      setLabelDismissed(true)
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

  // ── Message de bienvenue ────────────────────────────────────────────────────
  useEffect(() => {
    if (mounted) {
      const greeting = t('chatbot.greeting')
      if (greeting !== previousGreetingRef.current) {
        previousGreetingRef.current = greeting
        setMessages([{ role: 'assistant', content: greeting }])
      }
    }
  }, [mounted, language, t])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])
  useEffect(() => { if (isOpen && inputRef.current) inputRef.current.focus() }, [isOpen])

  // ── Booking helpers ─────────────────────────────────────────────────────────
  const loadAvailableSlots = async (): Promise<Slot[]> => {
    try {
      const response = await fetch('/api/booking?action=getAvailableSlots')
      const data = await response.json()
      if (data.slots && data.slots.length > 0) {
        setAvailableSlots(data.slots)
        return data.slots
      }
      return generateFallbackSlots()
    } catch {
      return generateFallbackSlots()
    }
  }

  const generateFallbackSlots = (): Slot[] => {
    const slots: Slot[] = []
    const today = new Date()
    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
    for (let day = 1; day <= 14; day++) {
      const date = new Date(today)
      date.setDate(today.getDate() + day)
      if (date.getDay() === 0 || date.getDay() === 6) continue
      const dateStr = date.toISOString().split('T')[0]
      timeSlots.forEach(time => slots.push({ date: dateStr, time, available: true }))
    }
    setAvailableSlots(slots)
    return slots
  }

  const startBooking = async () => {
    const slots = await loadAvailableSlots()
    if (slots.length === 0) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: language === 'fr'
          ? "Désolé, il n'y a pas de créneaux disponibles. Contactez-nous à contact@neuraweb.tech"
          : language === 'es'
          ? "Lo siento, no hay horarios disponibles. Contáctenos en contact@neuraweb.tech"
          : "Sorry, no slots available. Contact us at contact@neuraweb.tech"
      }])
      return
    }
    setBookingStep('dates')
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: language === 'fr' ? "📅 **Choisissez une date pour votre rendez-vous :**"
        : language === 'es' ? "📅 **Elige una fecha para tu cita:**"
        : "📅 **Choose a date for your appointment:**",
      showBooking: 'dates',
      slots
    }])
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(
      language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US',
      { weekday: 'long', day: 'numeric', month: 'long' }
    )
  }

  const selectDate = (date: string, slots?: Slot[]) => {
    setSelectedDate(date)
    setBookingStep('times')
    const currentSlots = slots || availableSlots
    const availableTimes = currentSlots.filter(s => s.date === date && s.available).map(s => s.time)
    setMessages(prev => [...prev,
      { role: 'user', content: formatDate(date) },
      {
        role: 'assistant',
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

  const selectTime = (time: string) => {
    setSelectedTime(time)
    setBookingStep('form')
    setMessages(prev => [...prev,
      { role: 'user', content: time },
      {
        role: 'assistant',
        content: language === 'fr'
          ? `📝 **Parfait ! Vos informations pour confirmer le rendez-vous :**\n\n📅 ${formatDate(selectedDate)} à ${time}`
          : language === 'es'
          ? `📝 **¡Perfecto! Su información para confirmar la cita:**\n\n📅 ${formatDate(selectedDate)} a las ${time}`
          : `📝 **Perfect! Your details to confirm the appointment:**\n\n📅 ${formatDate(selectedDate)} at ${time}`,
        showBooking: 'form',
        selectedDate
      }
    ])
  }

  const submitBooking = async () => {
    if (!bookingForm.name || !bookingForm.email) return
    setIsSubmittingBooking(true)
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bookSlot', data: { ...bookingForm, date: selectedDate, time: selectedTime, language } })
      })
      const data = await response.json()
      if (data.success) {
        setBookingStep('success')
        setMessages(prev => [...prev,
          { role: 'user', content: `${bookingForm.name} - ${bookingForm.email}` },
          {
            role: 'assistant',
            content: language === 'fr'
              ? `✅ **Rendez-vous confirmé !**\n\n📅 ${formatDate(selectedDate)} à ${selectedTime}\n\n📧 Email de confirmation envoyé.\n\nÀ très bientôt !`
              : language === 'es'
              ? `✅ **¡Cita confirmada!**\n\n📅 ${formatDate(selectedDate)} a las ${selectedTime}\n\n📧 Email de confirmación enviado.\n\n¡Hasta pronto!`
              : `✅ **Appointment confirmed!**\n\n📅 ${formatDate(selectedDate)} at ${selectedTime}\n\n📧 Confirmation email sent.\n\nSee you soon!`
          }
        ])
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

  const sendMessage = async () => {
    if (!input.trim() || isLoading || remainingMessages <= 0) return
    const userMessage = input.trim()
    setInput('')
    setError(null)
    setIsLoading(true)
    if (bookingStep !== 'none' && bookingStep !== 'success') setBookingStep('none')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    try {
      const cleanHistory = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId, history: cleanHistory, language })
      })
      const data: ChatResponse = await response.json()
      if (!response.ok) throw new Error(data.error || t('chatbot.error.general'))
      if (data.showBookingDates) {
        const slots = await loadAvailableSlots()
        setMessages(prev => [...prev, { role: 'assistant', content: data.response, showBooking: 'dates', slots }])
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

  // ── Ouvrir/fermer le chat ───────────────────────────────────────────────────
  const handleToggleChat = () => {
    setBtnClicked(true)
    setLabelDismissed(true)
    setIsOpen(prev => !prev)
    setTimeout(() => setBtnClicked(false), 300)
  }

  if (!mounted) return null

  const showLabel = labelVisible && !labelDismissed && !btnHovered && !isOpen
  const dots = ["", ".", "..", "..."][dotPhase]

  const toggleLabel = isOpen
    ? (language === 'fr' ? 'Fermer le chat' : language === 'es' ? 'Cerrar el chat' : 'Close chat')
    : (language === 'fr' ? 'Ouvrir le chat avec NeuraWeb IA' : language === 'es' ? 'Abrir el chat con NeuraWeb IA' : 'Open chat with NeuraWeb AI')

  const sendLabel = language === 'fr' ? 'Envoyer le message' : language === 'es' ? 'Enviar mensaje' : 'Send message'

  return (
    <>
      {/* ── Styles keyframes ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes nw-pulse-ring {
          0%   { transform: scale(1);    opacity: 0.7; }
          70%  { transform: scale(1.55); opacity: 0;   }
          100% { transform: scale(1.55); opacity: 0;   }
        }
        @keyframes nw-pulse-ring2 {
          0%   { transform: scale(1);    opacity: 0.4; }
          70%  { transform: scale(1.9);  opacity: 0;   }
          100% { transform: scale(1.9);  opacity: 0;   }
        }
        @keyframes nw-label-in {
          from { opacity: 0; transform: translateX(12px) scale(0.95); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
        @keyframes nw-label-out {
          from { opacity: 1; transform: translateX(0)    scale(1);    }
          to   { opacity: 0; transform: translateX(8px)  scale(0.95); }
        }
        @keyframes nw-float {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-5px); }
        }
        @keyframes nw-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes nw-dot {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.4; transform: scale(0.65); }
        }
        @keyframes nw-press {
          0%   { transform: scale(1);    }
          40%  { transform: scale(0.88); }
          100% { transform: scale(1);    }
        }
        .nw-btn-press { animation: nw-press 0.3s ease forwards; }
      `}</style>

      {/* ── Bouton flottant + label ───────────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexDirection: 'row-reverse',
      }}>

        {/* Bouton principal */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {/* Anneaux de pulse (masqués au hover et quand ouvert) */}
          {!btnHovered && !isOpen && (
            <>
              <span style={{
                position: 'absolute', inset: -5, borderRadius: '50%',
                border: '1.5px solid rgba(93,184,240,0.5)',
                animation: 'nw-pulse-ring 2.5s ease-out infinite',
                pointerEvents: 'none',
              }} />
              <span style={{
                position: 'absolute', inset: -5, borderRadius: '50%',
                border: '1px solid rgba(93,184,240,0.3)',
                animation: 'nw-pulse-ring2 2.5s ease-out infinite 0.4s',
                pointerEvents: 'none',
              }} />
            </>
          )}

          <button
            onClick={handleToggleChat}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            className={btnClicked ? 'nw-btn-press' : ''}
            aria-label={toggleLabel}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            style={{
              width: 58, height: 58, borderRadius: '50%',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
              animation: (btnHovered || isOpen) ? 'none' : 'nw-float 3s ease-in-out infinite',
              transition: 'transform 0.2s ease',
              background: isOpen
                ? 'linear-gradient(135deg, #374151, #4b5563)'
                : btnHovered
                ? 'linear-gradient(135deg, #5DB8F0, #22D3EE)'
                : 'linear-gradient(135deg, #0E1B3D, #1E2A4A)',
              boxShadow: btnHovered
                ? '0 0 0 3px rgba(93,184,240,0.3), 0 8px 32px rgba(93,184,240,0.6), 0 0 60px rgba(93,184,240,0.3)'
                : '0 4px 20px rgba(93,184,240,0.45), 0 0 40px rgba(93,184,240,0.2)',
              transform: btnHovered ? 'scale(1.08)' : 'scale(1)',
            }}
          >
            {/* Shimmer au hover */}
            {btnHovered && !isOpen && (
              <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                backgroundSize: '200% 100%',
                animation: 'nw-shimmer 1.2s linear infinite',
              }} />
            )}

            <span style={{ color: '#fff', position: 'relative', zIndex: 1 }}>
              {isOpen
                ? <X className="w-6 h-6 text-white" aria-hidden="true" />
                : <BotWidgetIcon />
              }
            </span>

            {/* Point "en ligne" (masqué quand ouvert) */}
            {!isOpen && (
              <span style={{
                position: 'absolute', top: 10, right: 10,
                width: 9, height: 9, borderRadius: '50%',
                background: '#22d3ee', border: '2px solid #1e1b4b',
                animation: 'nw-dot 1.8s ease-in-out infinite', zIndex: 2,
              }} />
            )}
          </button>
        </div>

        {/* Label bubble */}
        <div style={{
          animation: showLabel
            ? 'nw-label-in 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards'
            : labelVisible
            ? 'nw-label-out 0.3s ease forwards'
            : 'none',
          opacity: showLabel ? 1 : 0,
          pointerEvents: showLabel ? 'auto' : 'none',
        }}>
          <div style={{
            background: 'rgba(15,12,41,0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(93,184,240,0.4)',
            borderRadius: 14, padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
            whiteSpace: 'nowrap', position: 'relative',
          }}>
            {/* Avatar N */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #5DB8F0, #22D3EE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 14, fontWeight: 700, color: '#fff',
              boxShadow: '0 0 12px rgba(93,184,240,0.5)',
            }}>N</div>

            {/* Texte */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, color: '#a5b4fc',
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>NeuraWeb IA</span>
              <span style={{
                fontSize: 13, fontWeight: 500, color: '#e2e8f0',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                {language === 'fr' ? 'Parlez à notre IA' : language === 'es' ? 'Hable con nuestra IA' : 'Talk to our AI'}
                <span style={{ color: '#818cf8', fontFamily: 'monospace', minWidth: 16 }}>
                  {dots}
                </span>
              </span>
            </div>

            {/* Bouton fermer le label */}
            <button
              onClick={(e) => { e.stopPropagation(); setLabelDismissed(true) }}
              aria-label="Fermer"
              style={{
                background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '50%',
                width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#94a3b8', marginLeft: 2,
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.2)'
                e.currentTarget.style.color = '#f87171'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.color = '#94a3b8'
              }}
            ><CloseSmallIcon /></button>

            {/* Flèche pointant vers le bouton */}
            <span style={{
              position: 'absolute', right: -7, top: '50%', transform: 'translateY(-50%)',
              width: 0, height: 0,
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              borderLeft: '7px solid rgba(93,184,240,0.4)',
            }} />
          </div>
        </div>
      </div>

      {/* ── Fenêtre de chat ───────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={language === 'fr' ? 'Chat NeuraWeb' : language === 'es' ? 'Chat NeuraWeb' : 'NeuraWeb Chat'}
        className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-navy-900 to-navy-800 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center" aria-hidden="true">
                <RobotIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{t('chatbot.title')}</h3>
                <p className="text-white/70 text-xs">{remainingMessages} {t('chatbot.remaining')}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-950"
            role="log"
            aria-live="polite"
            aria-label={language === 'fr' ? 'Messages du chat' : language === 'es' ? 'Mensajes del chat' : 'Chat messages'}
          >
            {messages.map((msg, index) => (
              <div key={index}>
                <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-sky-400' : 'bg-gradient-to-r from-navy-800 to-navy-700'
                    }`}
                    aria-hidden="true"
                  >
                    {msg.role === 'user'
                      ? <User className="w-4 h-4 text-white" />
                      : <RobotIcon className="w-4 h-4 text-white" />
                    }
                  </div>
                  <div className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-sky-400 text-white rounded-br-sm'
                      : 'bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>

                {/* Dates cliquables */}
                {msg.showBooking === 'dates' && msg.slots && (
                  <div className="mt-3 ml-11 grid grid-cols-3 gap-2" role="group" aria-label={language === 'fr' ? 'Choisir une date' : 'Choose a date'}>
                    {Array.from(new Set(msg.slots.filter(s => s.available).map(s => s.date))).sort().slice(0, 9).map(date => (
                      <button
                        key={date}
                        onClick={() => selectDate(date, msg.slots)}
                        aria-label={formatDate(date)}
                        className="p-2 bg-gray-800 hover:bg-sky-400 border border-gray-700 hover:border-sky-400 rounded-lg text-center text-white text-sm transition-all"
                      >
                        <div className="text-xs text-gray-400">{new Date(date).toLocaleDateString(
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
                  <div className="mt-3 ml-11 grid grid-cols-4 gap-2" role="group" aria-label={language === 'fr' ? 'Choisir un horaire' : 'Choose a time'}>
                    {msg.slots.filter(s => s.date === msg.selectedDate && s.available).map(s => s.time).map(time => (
                      <button
                        key={time}
                        onClick={() => selectTime(time)}
                        aria-label={`${language === 'fr' ? 'Réserver à' : 'Book at'} ${time}`}
                        className="p-2 bg-gray-800 hover:bg-sky-400 border border-gray-700 hover:border-sky-400 rounded-lg text-white text-sm font-medium transition-all"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}

                {/* Formulaire booking */}
                {msg.showBooking === 'form' && (
                  <div className="mt-3 ml-11 space-y-2">
                    <input type="text"
                      placeholder={language === 'fr' ? 'Nom *' : language === 'es' ? 'Nombre *' : 'Name *'}
                      value={bookingForm.name}
                      onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                      aria-label={language === 'fr' ? 'Votre nom' : 'Your name'}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-sky-400"
                    />
                    <input type="email" placeholder="Email *"
                      value={bookingForm.email}
                      onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                      aria-label={language === 'fr' ? 'Votre email' : 'Your email'}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-sky-400"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="tel"
                        placeholder={language === 'fr' ? 'Téléphone' : 'Phone'}
                        value={bookingForm.phone}
                        onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                        aria-label={language === 'fr' ? 'Téléphone' : 'Phone'}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-sky-400"
                      />
                      <input type="tel" placeholder="WhatsApp"
                        value={bookingForm.whatsapp}
                        onChange={e => setBookingForm({...bookingForm, whatsapp: e.target.value})}
                        aria-label="WhatsApp"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-sky-400"
                      />
                    </div>
                    <textarea
                      placeholder={language === 'fr' ? 'Message (optionnel)' : 'Message (optional)'}
                      value={bookingForm.message}
                      onChange={e => setBookingForm({...bookingForm, message: e.target.value})}
                      rows={2}
                      aria-label={language === 'fr' ? 'Message optionnel' : 'Optional message'}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-sky-400 resize-none"
                    />
                    <button
                      onClick={submitBooking}
                      disabled={!bookingForm.name || !bookingForm.email || isSubmittingBooking}
                      aria-label={language === 'fr' ? 'Confirmer le rendez-vous' : 'Confirm booking'}
                      className="w-full py-2 bg-gradient-to-r from-navy-900 to-navy-800 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmittingBooking ? (
                        <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />{language === 'fr' ? 'Réservation...' : 'Booking...'}</>
                      ) : (
                        <><CheckCircle className="w-4 h-4" aria-hidden="true" />{language === 'fr' ? 'Confirmer le RDV' : language === 'es' ? 'Confirmar cita' : 'Confirm booking'}</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3" role="status" aria-label={language === 'fr' ? 'En cours de réponse…' : 'Typing…'}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-navy-800 to-navy-700 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <RobotIcon className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1" aria-hidden="true">
                  <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg" role="alert">
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
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
                  aria-label={t('chatbot.placeholder')}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-sky-400 disabled:opacity-50 text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  aria-label={sendLabel}
                  className="px-4 py-2 bg-gradient-to-r from-navy-900 to-navy-800 text-white rounded-xl hover:from-navy-800 hover:to-navy-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-950 border-t border-gray-800 flex items-center justify-center">
            <p className="text-gray-500 text-xs">
              {t('chatbot.footer')} <span className="text-sky-400">NeuraWeb</span>
            </p>
          </div>
        </div>
      </div>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}