'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

interface WhatsAppButtonProps {
  phoneNumber?: string; 
  message?: string;
}

export function WhatsAppButton({ 
  phoneNumber = '33749775654', 
  message,
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const defaultMessage = message || t('whatsapp.greeting');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Popup de conversation */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-[9998] w-80 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-white">
                <div className="font-bold">NeuraWeb</div>
                <div className="text-xs opacity-90">{t('whatsapp.online') || 'En ligne'}</div>
              </div>
            </div>
            <button
              onClick={togglePopup}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label={t('whatsapp.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-[200px] flex flex-col justify-end">
            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none p-4 shadow-sm border border-gray-200 dark:border-gray-700 max-w-[85%]">
              <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                {t('whatsapp.greeting')}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {new Date().toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClick}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              {t('whatsapp.button')}
            </button>
          </div>
        </div>
      )}

      {/* Bouton flottant */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999] flex flex-col items-end gap-3">
        {/* Tooltip */}
        {!isOpen && (
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            {t('whatsapp.tooltip')}
          </div>
        )}

        {/* Bouton principal */}
        <button
          onClick={togglePopup}
          className="group relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label={t('whatsapp.tooltip')}
        >
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping" />
          
          {/* Icon */}
          <MessageCircle className="relative w-7 h-7 md:w-8 md:h-8 text-white transform group-hover:rotate-12 transition-transform duration-300" />

          {/* Badge notification */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
        </button>
      </div>
    </>
  );
}