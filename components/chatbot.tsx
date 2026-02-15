'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2, AlertCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatResponse {
  response: string
  remainingMessages: number
  maxMessages: number
  error?: string
}

// Génère un ID de session unique
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

interface ChatbotProps {
  language?: 'fr' | 'en'
}

export default function Chatbot({ language = 'fr' }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: language === 'fr' 
        ? "Bonjour ! 👋 Je suis l'assistant NeuraWeb. Comment puis-je vous aider aujourd'hui ? N'hésitez pas à me poser vos questions sur nos services de développement web, d'automatisation ou d'intégration IA."
        : "Hello! 👋 I'm the NeuraWeb assistant. How can I help you today? Feel free to ask me questions about our web development, automation or AI integration services."
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remainingMessages, setRemainingMessages] = useState(15)
  const [sessionId] = useState(generateSessionId)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Traductions
  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      fr: {
        'chatbot.placeholder': 'Posez votre question...',
        'chatbot.send': 'Envoyer',
        'chatbot.close': 'Fermer le chat',
        'chatbot.open': 'Ouvrir le chat',
        'chatbot.remaining': 'messages restants',
        'chatbot.limit': 'Limite de messages atteinte',
        'chatbot.contact': 'Contactez-nous directement',
        'chatbot.footer': 'Propulsé par',
      },
      en: {
        'chatbot.placeholder': 'Ask your question...',
        'chatbot.send': 'Send',
        'chatbot.close': 'Close chat',
        'chatbot.open': 'Open chat',
        'chatbot.remaining': 'messages remaining',
        'chatbot.limit': 'Message limit reached',
        'chatbot.contact': 'Contact us directly',
        'chatbot.footer': 'Powered by',
      },
    }
    return translations[language][key] || key
  }

  // Scroll automatique vers le bas
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Focus sur l'input quand le chat s'ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!input.trim() || isLoading || remainingMessages <= 0) return

    const userMessage = input.trim()
    setInput('')
    setError(null)
    setIsLoading(true)

    // Ajouter le message utilisateur immédiatement
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          history: messages
        })
      })

      const data: ChatResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      // Ajouter la réponse de l'assistant
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      setRemainingMessages(data.remainingMessages)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(errorMessage)
      // Retirer le message utilisateur en cas d'erreur
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

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-700 hover:bg-gray-600 rotate-0' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-110'
        }`}
        aria-label={isOpen ? t('chatbot.close') : t('chatbot.open')}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Fenêtre de chat */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] transition-all duration-300 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">NeuraWeb Assistant</h3>
                <p className="text-white/70 text-xs">
                  {remainingMessages} {t('chatbot.remaining')}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-950">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Indicateur de chargement */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                </div>
              </div>
            )}

            {/* Message d'erreur */}
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
                <p className="text-gray-400 text-sm mb-2">
                  {t('chatbot.limit')}
                </p>
                <a
                  href="mailto:contact@neuraweb.tech"
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
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
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50 text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-label={t('chatbot.send')}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-950 border-t border-gray-800">
            <p className="text-gray-500 text-xs text-center">
              {t('chatbot.footer')} <span className="text-purple-400">NeuraWeb</span> • 
              <a href="mailto:contact@neuraweb.tech" className="text-gray-400 hover:text-white ml-1">
                contact@neuraweb.tech
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}