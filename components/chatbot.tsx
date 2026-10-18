'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import { X, Loader2 } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { PAGE_THEMES, type PageThemeName } from '@/lib/page-themes'

// ── Thème de la page courante : le chat reprend la paire de couleurs de la page ──────────────
function themeForPath(pathname: string): PageThemeName {
  const p = pathname.replace(/^\/(fr|en|es|vi)(?=\/|$)/, '') || '/'
  if (p.startsWith('/developpement-web')) return 'dev-web'
  if (p.startsWith('/mobile-app-development')) return 'mobile'
  if (p.startsWith('/automatisation')) return 'automatisation'
  if (p.startsWith('/integration-ia')) return 'chatbot'
  if (p.startsWith('/secteurs/sante')) return 'sante'
  if (p.startsWith('/secteurs/restaurants')) return 'restaurants'
  if (p.startsWith('/secteurs/collectivites')) return 'collectivites'
  return 'accueil'
}
const hexToRgb = (h: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number]
const lum = ([r, g, b]: number[]) => {
  const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const ratio = (a: number[], b: number[]) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05) }
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v * (1 - t) + b[i] * t))
/** Couleurs du chat : « dark » = fond du thème, assombri si besoin pour un texte lisible (≥ 4,5) sur « light ». */
function chatColors(name: PageThemeName): CSSProperties {
  const t: { bg: string; fg: string } = PAGE_THEMES[name]
  const light = hexToRgb(t.fg)
  let dark: number[] = hexToRgb(t.bg)
  for (let i = 0; i < 12 && ratio(dark, light) < 4.5; i++) dark = mix(dark, [0, 0, 0], 0.12)
  const tint = mix(light, dark, 0.2)
  return { '--cb-dark': dark.join(' '), '--cb-light': light.join(' '), '--cb-tint': tint.join(' ') } as CSSProperties
}

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

// Rendu Markdown minimal et sûr (aucun HTML injecté) : **gras**, *italique*, listes « - » / « • ».
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

function MessageContent({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed space-y-1">
      {content.split('\n').map((line, i) => {
        const bullet = line.match(/^\s*[-•]\s+(.*)$/)
        if (bullet) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span aria-hidden="true">•</span>
              <span>{renderInline(bullet[1])}</span>
            </div>
          )
        }
        return line.trim() === '' ? <div key={i} className="h-1" /> : <p key={i}>{renderInline(line)}</p>
      })}
    </div>
  )
}

// ── Icône animée du bouton : bulle de dialogue dont les trois points « écrivent » à tour de rôle ──
const ChatLauncherIcon = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M6 6.5h20a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5H14l-5.2 4.3a.6.6 0 0 1-1-.46V22.5H6A2.5 2.5 0 0 1 3.5 20V9A2.5 2.5 0 0 1 6 6.5Z"
      stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"
    />
    <circle className="nw-typing-dot" cx="10.5" cy="14.5" r="1.9" fill="currentColor" style={{ animationDelay: '0ms' }} />
    <circle className="nw-typing-dot" cx="16" cy="14.5" r="1.9" fill="currentColor" style={{ animationDelay: '160ms' }} />
    <circle className="nw-typing-dot" cx="21.5" cy="14.5" r="1.9" fill="currentColor" style={{ animationDelay: '320ms' }} />
  </svg>
)

// ── Icônes fonctionnelles uniquement (fermer) ─────────────────────────────────
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
  const pathname = usePathname()
  const chatVars = useMemo(() => chatColors(themeForPath(pathname || '/')), [pathname])

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
          fr: { starter: 'Starter (à partir de 1 490€)', business: 'Business (à partir de 3 990€)', premium: 'Premium (sur mesure)', ai: 'Pack IA (sur devis)' },
          en: { starter: 'Starter (from €1,490)', business: 'Business (from €3,990)', premium: 'Premium (tailor-made)', ai: 'AI Pack (custom)' },
          es: { starter: 'Starter (desde 1.490€)', business: 'Business (desde 3.990€)', premium: 'Premium (a medida)', ai: 'Pack IA (a presupuesto)' },
          // vi : aucun prix EUR fixe (règle du site) — seule l'offre Landing Page
          // Express a un prix affiché, tout le reste est en mode devis.
          vi: { landing: 'Landing Page Express (1.290.000 VND)', starter: 'Starter (Theo báo giá)', business: 'Business (Theo báo giá)', premium: 'Premium (Theo báo giá)', ai: 'Gói AI (Theo báo giá)' },
        }
        const packName = packNames[language]?.[packId] || packId
        const message = language === 'fr'
          ? `Bonjour ! Je suis intéressé(e) par le ${packName}. Pouvez-vous m'en dire plus ?`
          : language === 'es'
          ? `¡Hola! Estoy interesado/a en el ${packName}. ¿Puede decirme más?`
          : language === 'vi'
          ? `Xin chào! Tôi quan tâm đến ${packName}. Bạn có thể cho tôi biết thêm thông tin không?`
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
          ? "Désolé, il n'y a pas de créneaux disponibles. Contactez-nous à contact@neuraweb.fr"
          : language === 'es'
          ? "Lo siento, no hay horarios disponibles. Contáctenos en contact@neuraweb.fr"
          : language === 'vi'
          ? "Xin lỗi, hiện không có khung giờ trống. Vui lòng liên hệ contact@neuraweb.fr"
          : "Sorry, no slots available. Contact us at contact@neuraweb.fr"
      }])
      return
    }
    setBookingStep('dates')
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: language === 'fr' ? "📅 **Choisissez une date pour votre rendez-vous :**"
        : language === 'es' ? "📅 **Elige una fecha para tu cita:**"
        : language === 'vi' ? "📅 **Chọn ngày hẹn của bạn:**"
        : "📅 **Choose a date for your appointment:**",
      showBooking: 'dates',
      slots
    }])
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(
      language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : language === 'vi' ? 'vi-VN' : 'en-US',
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
          : language === 'vi'
          ? `🕐 **Khung giờ trống ngày ${formatDate(date)}:**\n\n${availableTimes.length} khung giờ trống`
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
          : language === 'vi'
          ? `📝 **Tuyệt vời! Vui lòng để lại thông tin để xác nhận lịch hẹn:**\n\n📅 ${formatDate(selectedDate)} lúc ${time}`
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
              : language === 'vi'
              ? `✅ **Đã xác nhận lịch hẹn!**\n\n📅 ${formatDate(selectedDate)} lúc ${selectedTime}\n\n📧 Email xác nhận đã được gửi.\n\nHẹn sớm gặp lại bạn!`
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
    ? (language === 'fr' ? 'Fermer le chat' : language === 'es' ? 'Cerrar el chat' : language === 'vi' ? 'Đóng khung chat' : 'Close chat')
    : (language === 'fr' ? 'Ouvrir le chat avec NeuraWeb IA' : language === 'es' ? 'Abrir el chat con NeuraWeb IA' : language === 'vi' ? 'Mở khung chat với NeuraWeb IA' : 'Open chat with NeuraWeb AI')

  const sendLabel = language === 'fr' ? 'Envoyer le message' : language === 'es' ? 'Enviar mensaje' : language === 'vi' ? 'Gửi tin nhắn' : 'Send message'

  return (
    <div className="contents" style={chatVars}>
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
        @keyframes nw-typing {
          0%, 60%, 100% { transform: translateY(0);    opacity: 0.45; }
          30%           { transform: translateY(-2.6px); opacity: 1;    }
        }
        .nw-typing-dot { animation: nw-typing 1.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) {
          .nw-typing-dot, .nw-btn-press { animation: none !important; opacity: 1; }
        }
      `}</style>

      {/* ── Bouton flottant + label ───────────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
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
                border: '1.5px solid rgb(var(--cb-dark) / 0.5)',
                animation: 'nw-pulse-ring 2.5s ease-out infinite',
                pointerEvents: 'none',
              }} />
              <span style={{
                position: 'absolute', inset: -5, borderRadius: '50%',
                border: '1px solid rgb(var(--cb-dark) / 0.3)',
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
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden',
              animation: (btnHovered || isOpen) ? 'none' : 'nw-float 3s ease-in-out infinite',
              transition: 'transform 0.2s ease',
              background: 'rgb(var(--cb-light))',
              border: '2px solid rgb(var(--cb-dark))',
              boxShadow: btnHovered
                ? '0 0 0 4px rgb(var(--cb-dark) / 0.45), 0 8px 28px rgb(var(--cb-dark) / 0.35)'
                : '0 4px 20px rgb(var(--cb-dark) / 0.35)',
              transform: btnHovered ? 'scale(1.08)' : 'scale(1)',
            }}
          >
            {/* Shimmer au hover */}
            {btnHovered && !isOpen && (
              <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'linear-gradient(90deg, transparent, rgb(var(--cb-dark) / 0.12), transparent)',
                backgroundSize: '200% 100%',
                animation: 'nw-shimmer 1.2s linear infinite',
              }} />
            )}

            <span style={{ color: 'rgb(var(--cb-dark))', position: 'relative', zIndex: 1, display: 'flex' }}>
              {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <ChatLauncherIcon />}
            </span>
          </button>
        </div>

        {/* Label bubble (masqué sur mobile pour ne pas masquer le contenu) */}
        <div className="hidden sm:block" style={{
          animation: showLabel
            ? 'nw-label-in 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards'
            : labelVisible
            ? 'nw-label-out 0.3s ease forwards'
            : 'none',
          opacity: showLabel ? 1 : 0,
          pointerEvents: showLabel ? 'auto' : 'none',
        }}>
          <div style={{
            background: 'rgb(var(--cb-dark))',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgb(var(--cb-light) / 0.25)',
            borderRadius: 14, padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 4px 24px rgb(var(--cb-dark) / 0.35)',
            whiteSpace: 'nowrap', position: 'relative',
          }}>
            {/* Texte */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, color: 'rgb(var(--cb-light) / 0.85)',
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>NeuraWeb IA</span>
              <span style={{
                fontSize: 13, fontWeight: 500, color: 'rgb(var(--cb-light))',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                {language === 'fr' ? 'Parlez à notre IA' : language === 'es' ? 'Hable con nuestra IA' : language === 'vi' ? 'Trò chuyện với AI của chúng tôi' : 'Talk to our AI'}
                <span style={{ color: 'rgb(var(--cb-light) / 0.75)', fontFamily: 'monospace', minWidth: 16 }}>
                  {dots}
                </span>
              </span>
            </div>

            {/* Bouton fermer le label */}
            <button
              onClick={(e) => { e.stopPropagation(); setLabelDismissed(true) }}
              aria-label="Fermer"
              style={{
                background: 'rgb(var(--cb-light) / 0.12)', border: 'none', borderRadius: '50%',
                width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'rgb(var(--cb-light) / 0.8)', marginLeft: 2,
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgb(var(--cb-light) / 0.25)'
                e.currentTarget.style.color = 'rgb(var(--cb-light))'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgb(var(--cb-light) / 0.12)'
                e.currentTarget.style.color = 'rgb(var(--cb-light) / 0.8)'
              }}
            ><CloseSmallIcon /></button>

            {/* Flèche pointant vers le bouton */}
            <span style={{
              position: 'absolute', right: -7, top: '50%', transform: 'translateY(-50%)',
              width: 0, height: 0,
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              borderLeft: '7px solid rgb(var(--cb-dark))',
            }} />
          </div>
        </div>
      </div>

      {/* ── Fenêtre de chat ───────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={language === 'fr' ? 'Chat NeuraWeb' : language === 'es' ? 'Chat NeuraWeb' : language === 'vi' ? 'Chat NeuraWeb' : 'NeuraWeb Chat'}
        className={`fixed bottom-[88px] left-3 right-3 z-50 transition-all duration-300 sm:bottom-24 sm:left-auto sm:right-6 sm:w-[380px] ${
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-cbdark/25 bg-cblight shadow-[0_20px_60px_rgb(var(--cb-dark)/0.3)]">

          {/* Header */}
          <div className="bg-cbdark px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-bold leading-tight text-cblight">{t('chatbot.title')}</h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide shrink-0 whitespace-nowrap bg-cblight/20 text-cblight">
                    {t('chatbot.aiTag')}
                  </span>
                </div>
                <p className="text-xs text-cblight/80">{remainingMessages} {t('chatbot.remaining')}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="h-[min(20rem,calc(100svh-23rem))] min-h-[11rem] space-y-4 overflow-y-auto bg-cblight p-4"
            role="log"
            aria-live="polite"
            aria-label={language === 'fr' ? 'Messages du chat' : language === 'es' ? 'Mensajes del chat' : language === 'vi' ? 'Tin nhắn trò chuyện' : 'Chat messages'}
          >
            {messages.map((msg, index) => (
              <div key={index}>
                <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                    msg.role === 'user'
                      ? 'rounded-br-sm bg-cbdark text-cblight'
                      : 'rounded-bl-sm border border-cbdark/15 bg-cbtint text-cbdark'
                  }`}>
                    <MessageContent content={msg.content} />
                  </div>
                </div>

                {/* Dates cliquables */}
                {msg.showBooking === 'dates' && msg.slots && (
                  <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label={language === 'fr' ? 'Choisir une date' : language === 'vi' ? 'Chọn ngày' : 'Choose a date'}>
                    {Array.from(new Set(msg.slots.filter(s => s.available).map(s => s.date))).sort().slice(0, 9).map(date => (
                      <button
                        key={date}
                        onClick={() => selectDate(date, msg.slots)}
                        aria-label={formatDate(date)}
                        className="p-2 rounded-lg border border-cbdark/30 bg-cblight text-center text-sm text-cbdark transition-all hover:bg-cbdark/10"
                      >
                        <div className="text-xs text-cbdark/70">{new Date(date).toLocaleDateString(
                          language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : language === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'short' }
                        )}</div>
                        <div className="font-bold text-lg">{new Date(date).getDate()}</div>
                        <div className="text-xs text-cbdark/70">{new Date(date).toLocaleDateString(
                          language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : language === 'vi' ? 'vi-VN' : 'en-US', { month: 'short' }
                        )}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Heures cliquables */}
                {msg.showBooking === 'times' && msg.selectedDate && msg.slots && (
                  <div className="mt-3 grid grid-cols-4 gap-2" role="group" aria-label={language === 'fr' ? 'Choisir un horaire' : language === 'vi' ? 'Chọn giờ' : 'Choose a time'}>
                    {msg.slots.filter(s => s.date === msg.selectedDate && s.available).map(s => s.time).map(time => (
                      <button
                        key={time}
                        onClick={() => selectTime(time)}
                        aria-label={`${language === 'fr' ? 'Réserver à' : language === 'vi' ? 'Đặt lúc' : 'Book at'} ${time}`}
                        className="p-2 rounded-lg border border-cbdark/30 bg-cblight text-sm font-medium text-cbdark transition-all hover:bg-cbdark/10"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}

                {/* Formulaire booking */}
                {msg.showBooking === 'form' && (
                  <div className="mt-3 space-y-2">
                    <input type="text"
                      placeholder={language === 'fr' ? 'Nom *' : language === 'es' ? 'Nombre *' : language === 'vi' ? 'Họ tên *' : 'Name *'}
                      value={bookingForm.name}
                      onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                      aria-label={language === 'fr' ? 'Votre nom' : language === 'vi' ? 'Họ tên của bạn' : 'Your name'}
                      className="w-full rounded-lg border border-cbdark/30 bg-cblight px-3 py-2 text-sm text-cbdark placeholder-cbdark/60 focus:border-cbdark focus:outline-none"
                    />
                    <input type="email" placeholder="Email *"
                      value={bookingForm.email}
                      onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                      aria-label={language === 'fr' ? 'Votre email' : language === 'vi' ? 'Email của bạn' : 'Your email'}
                      className="w-full rounded-lg border border-cbdark/30 bg-cblight px-3 py-2 text-sm text-cbdark placeholder-cbdark/60 focus:border-cbdark focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="tel"
                        placeholder={language === 'fr' ? 'Téléphone' : language === 'vi' ? 'Số điện thoại' : 'Phone'}
                        value={bookingForm.phone}
                        onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                        aria-label={language === 'fr' ? 'Téléphone' : language === 'vi' ? 'Số điện thoại' : 'Phone'}
                        className="w-full rounded-lg border border-cbdark/30 bg-cblight px-3 py-2 text-sm text-cbdark placeholder-cbdark/60 focus:border-cbdark focus:outline-none"
                      />
                      <input type="tel" placeholder="WhatsApp"
                        value={bookingForm.whatsapp}
                        onChange={e => setBookingForm({...bookingForm, whatsapp: e.target.value})}
                        aria-label="WhatsApp"
                        className="w-full rounded-lg border border-cbdark/30 bg-cblight px-3 py-2 text-sm text-cbdark placeholder-cbdark/60 focus:border-cbdark focus:outline-none"
                      />
                    </div>
                    <textarea
                      placeholder={language === 'fr' ? 'Message (optionnel)' : language === 'vi' ? 'Lời nhắn (không bắt buộc)' : 'Message (optional)'}
                      value={bookingForm.message}
                      onChange={e => setBookingForm({...bookingForm, message: e.target.value})}
                      rows={2}
                      aria-label={language === 'fr' ? 'Message optionnel' : language === 'vi' ? 'Lời nhắn không bắt buộc' : 'Optional message'}
                      className="w-full rounded-lg border border-cbdark/30 bg-cblight px-3 py-2 text-sm text-cbdark placeholder-cbdark/60 focus:border-cbdark focus:outline-none resize-none"
                    />
                    <button
                      onClick={submitBooking}
                      disabled={!bookingForm.name || !bookingForm.email || isSubmittingBooking}
                      aria-label={language === 'fr' ? 'Confirmer le rendez-vous' : language === 'vi' ? 'Xác nhận lịch hẹn' : 'Confirm booking'}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-cbdark py-2 font-medium text-cblight disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmittingBooking ? (
                        <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />{language === 'fr' ? 'Réservation...' : language === 'vi' ? 'Đang đặt lịch...' : 'Booking...'}</>
                      ) : (
                        <>{language === 'fr' ? 'Confirmer le RDV' : language === 'es' ? 'Confirmar cita' : language === 'vi' ? 'Xác nhận lịch hẹn' : 'Confirm booking'}</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3" role="status" aria-label={language === 'fr' ? 'En cours de réponse…' : language === 'vi' ? 'Đang trả lời…' : 'Typing…'}>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-cbdark/15 bg-cbtint px-4 py-3" aria-hidden="true">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cbdark/70 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cbdark/70 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cbdark/70 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-cbdark/30 bg-cbdark/10 px-3 py-2 text-sm text-cbdark" role="alert">
                
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-cbdark/20 bg-cblight p-3">
            {remainingMessages <= 0 ? (
              <div className="text-center py-2">
                <p className="mb-2 text-sm text-cbdark/80">{t('chatbot.limit')}</p>
                <a href="mailto:contact@neuraweb.fr" className="text-sm text-cbdark underline hover:text-cbdark/80">
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
                  className="min-w-0 flex-1 rounded-xl border border-cbdark/30 bg-cblight px-3 py-2 text-base sm:px-4 sm:text-sm text-cbdark placeholder-cbdark/60 focus:border-cbdark focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  aria-label={sendLabel}
                  className="shrink-0 rounded-xl bg-cbdark px-4 py-2 text-sm font-semibold text-cblight transition-all hover:bg-cbdark/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {language === 'fr' ? 'Envoyer' : language === 'es' ? 'Enviar' : language === 'vi' ? 'Gửi' : 'Send'}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center border-t border-cbdark/15 bg-cbtint px-4 py-2">
            <p className="text-xs text-cbdark/80">
              {t('chatbot.footer')} <span className="font-semibold text-cbdark">NeuraWeb</span>
            </p>
          </div>
        </div>
      </div>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-cbdark/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}