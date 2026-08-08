'use client';

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// Bouton de contact WhatsApp — canal disponible immédiatement (pas encore de
// compte Zalo). Zalo reste le canal n°1 du marché vietnamien à terme (cf. plan
// vi, section "Volet communication / canaux") ; ce composant est l'équivalent
// fonctionnel en attendant, à remplacer par ZaloContactButton (ou à faire
// coexister avec) une fois un compte Zalo créé.
//
// TODO: remplacer par le vrai numéro WhatsApp (format international sans
// "+" ni espaces, ex. 33612345678 pour un numéro français, 84912345678 pour
// un numéro vietnamien). Le placeholder ci-dessous n'est volontairement PAS
// un numéro d'apparence réelle : tant qu'il n'est pas remplacé, le bouton
// reste visible mais non cliquable — on ne déploie jamais de lien externe
// cassé (cf. règle SEO "External links: avoid unverifiable bot-blocked URLs"
// dans CLAUDE.md ; wa.me bloque de toute façon les crawlers, d'où le
// rel="nofollow noopener noreferrer" une fois le lien actif).
//
// Note CLAUDE.md : la règle "Contact channels on /contact: email et /booking
// uniquement, pas de WhatsApp" cible le marché FR/EU. Exception assumée ici
// pour la version vi uniquement, à la demande explicite de l'utilisateur —
// WhatsApp est le canal de repli en attendant Zalo.
// ═══════════════════════════════════════════════════════════════════════════

export const WHATSAPP_PHONE_NUMBER = 'REPLACE_WITH_WHATSAPP_NUMBER';

/** Un numéro WhatsApp exploitable = format international, 8 à 15 chiffres, sans "+". */
export const isWhatsAppConfigured = /^\d{8,15}$/.test(WHATSAPP_PHONE_NUMBER);

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE_NUMBER}`;

/** Vert de marque WhatsApp. */
const WHATSAPP_GREEN = '#25D366';

/**
 * Icône bulle de discussion.
 * Le logo officiel WhatsApp est une marque déposée : on ne le reproduit pas,
 * on utilise une bulle générique + le mot « WhatsApp » en texte, ce qui reste
 * immédiatement lisible.
 */
function WhatsAppBubbleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 2.25c-5.66 0-10.25 3.83-10.25 8.56 0 2.68 1.48 5.07 3.79 6.64-.17 1.28-.72 2.5-1.6 3.6a.62.62 0 0 0 .58 1c1.98-.34 3.72-1.1 5.13-2.2.76.11 1.55.17 2.35.17 5.66 0 10.25-3.83 10.25-8.56S17.66 2.25 12 2.25Z" />
    </svg>
  );
}

interface WhatsAppContactButtonProps {
  /** `solid` = bouton plein vert WhatsApp · `outline` = bordure sur fond sombre. */
  variant?: 'solid' | 'outline';
  /** Libellé affiché — vietnamien par défaut, le bouton n'étant exposé que sur `/vi`. */
  label?: string;
  /** Info-bulle affichée tant que le numéro WhatsApp n'est pas configuré. */
  pendingTitle?: string;
  className?: string;
}

export function WhatsAppContactButton({
  variant = 'solid',
  label = 'Nhắn tin WhatsApp',
  pendingTitle = 'Kênh WhatsApp sẽ sớm được kích hoạt',
  className = '',
}: WhatsAppContactButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap';

  const skin =
    variant === 'solid'
      ? 'text-white hover:brightness-110 hover:-translate-y-0.5'
      : 'text-white border hover:bg-white/10';

  const style =
    variant === 'solid'
      ? { background: WHATSAPP_GREEN, boxShadow: '0 4px 15px rgba(37,211,102,0.35)' }
      : { borderColor: 'rgba(255,255,255,0.3)' };

  // Numéro pas encore renseigné : on affiche le bouton (QA / maquette) sans lien mort.
  if (!isWhatsAppConfigured) {
    return (
      <button
        type="button"
        disabled
        data-whatsapp-placeholder="true"
        title={pendingTitle}
        aria-label={`${label} — ${pendingTitle}`}
        className={`${base} ${skin} opacity-60 cursor-not-allowed ${className}`}
        style={style}
      >
        <WhatsAppBubbleIcon className="w-4 h-4 shrink-0" />
        {label}
      </button>
    );
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className={`${base} ${skin} ${className}`}
      style={style}
    >
      <WhatsAppBubbleIcon className="w-4 h-4 shrink-0" />
      {label}
    </a>
  );
}
