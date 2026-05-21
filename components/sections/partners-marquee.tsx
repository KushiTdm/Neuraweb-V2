'use client';

import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

const PARTNERS = [
  { name: 'Next.js',     icon: NextJsIcon },
  { name: 'React',       icon: ReactIcon },
  { name: 'TypeScript',  icon: TypeScriptIcon },
  { name: 'Tailwind CSS',icon: TailwindIcon },
  { name: 'n8n',         icon: N8nIcon },
  { name: 'Vercel',      icon: VercelIcon },
  { name: 'Supabase',    icon: SupabaseIcon },
  { name: 'OpenAI',      icon: OpenAIIcon },
  { name: 'Stripe',      icon: StripeIcon },
  { name: 'PostgreSQL',  icon: PostgresIcon },
];

// Doubles pour la boucle infinie du marquee
const MARQUEE_ITEMS = [...PARTNERS, ...PARTNERS];

// ── Icônes SVG inline (logotypes simplifiés) ─────────────────────────────────

function NextJsIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="h-8 w-auto">
      <circle cx="40" cy="40" r="40" fill="#000"/>
      <path d="M23.9 56.6V24.2l33.6 39.5c-4.7 3.6-10.5 5.7-16.9 5.7-6.3 0-12.1-2-17-5.4" fill="white" opacity="0.3"/>
      <path d="M54.9 53.7L28.7 20.8h-4.8v38.4l4.4-2.6V28.7l22.2 26.8 4.4-1.8z" fill="white"/>
    </svg>
  );
}

function ReactIcon() {
  return (
    <svg viewBox="0 0 80 48" fill="none" className="h-8 w-auto">
      <ellipse cx="40" cy="24" rx="38" ry="12" stroke="#61DAFB" strokeWidth="2.5" fill="none"/>
      <ellipse cx="40" cy="24" rx="38" ry="12" stroke="#61DAFB" strokeWidth="2.5" fill="none" transform="rotate(60 40 24)"/>
      <ellipse cx="40" cy="24" rx="38" ry="12" stroke="#61DAFB" strokeWidth="2.5" fill="none" transform="rotate(120 40 24)"/>
      <circle cx="40" cy="24" r="5" fill="#61DAFB"/>
    </svg>
  );
}

function TypeScriptIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="h-8 w-auto">
      <rect width="80" height="80" rx="6" fill="#3178C6"/>
      <path d="M12 44h10v-6H12V24h20v6H22v6h10v6H12v-8" fill="white"/>
      <path d="M44 30h-8v-6h22v6h-8v26h-6V30" fill="white"/>
    </svg>
  );
}

function TailwindIcon() {
  return (
    <svg viewBox="0 0 80 48" fill="none" className="h-7 w-auto">
      <path d="M20 24c4-16 12-20 20-12-4 16-12 20-20 12zM40 32c4-16 12-20 20-12-4 16-12 20-20 12z" fill="#38BDF8"/>
    </svg>
  );
}

function N8nIcon() {
  return (
    <svg viewBox="0 0 80 36" fill="none" className="h-7 w-auto">
      <path d="M4 18C4 9.16 11.16 2 20 2s16 7.16 16 16-7.16 16-16 16" stroke="#EA4B71" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M36 18c0-8.84 7.16-16 16-16s16 7.16 16 16-7.16 16-16 16" stroke="#EA4B71" strokeWidth="4" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function VercelIcon() {
  return (
    <svg viewBox="0 0 80 72" fill="none" className="h-8 w-auto">
      <path d="M40 4 L76 68 H4 Z" fill="#000"/>
    </svg>
  );
}

function SupabaseIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="h-8 w-auto">
      <defs>
        <linearGradient id="sb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3ECF8E"/>
          <stop offset="100%" stopColor="#1EBB7B"/>
        </linearGradient>
      </defs>
      <path d="M46 4L12 46h24l-4 30L76 34H52L46 4z" fill="url(#sb)"/>
    </svg>
  );
}

function OpenAIIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="h-8 w-auto">
      <circle cx="40" cy="40" r="36" stroke="#000" strokeWidth="3" fill="none"/>
      <path d="M40 16a24 24 0 0 1 20.8 12M40 16a24 24 0 0 0-20.8 12M60.8 28a24 24 0 0 1 0 24M19.2 28a24 24 0 0 0 0 24M60.8 52A24 24 0 0 1 40 64M19.2 52A24 24 0 0 0 40 64M40 28a12 12 0 1 1 0 24 12 12 0 0 1 0-24z" stroke="#000" strokeWidth="2" fill="none"/>
    </svg>
  );
}

function StripeIcon() {
  return (
    <svg viewBox="0 0 80 34" fill="none" className="h-7 w-auto">
      <path d="M8 12c0-2.2 1.8-3 4.5-3 4 0 8.8 1.2 12.5 3.4V4C21.5 2.2 17.5 1.5 13 1.5 5.8 1.5 1 5.2 1 12.5c0 11.2 15.4 9.4 15.4 14.2 0 2.6-2.2 3.4-5.2 3.4-4.5 0-9.8-1.8-14-4.4v9c4 1.8 8 2.8 14 2.8 7.4 0 12.6-3.6 12.6-11 .2-12.1-15.8-10-15.8-14.5zM45 10h-8L33.5 28H26l-2-6.5L21.5 28H14l-3.5-18H19l1.5 12 2.5-12h6l2.5 12 1.5-12h7.5L45 10zM48 5c2.4 0 4-1.6 4-4s-1.6-4-4-4-4 1.6-4 4 1.6 4 4 4zm-4 5h8v18h-8V10zm12 0h7.5v2.5c1-1.8 3.2-3 6-3 4.5 0 7 3 7 7.5V28H69V18c0-2.2-1-3.5-3.2-3.5-2 0-3.2 1.2-3.2 3.5v10H56V10z" fill="#635BFF"/>
    </svg>
  );
}

function PostgresIcon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="h-8 w-auto">
      <path d="M40 4C20.1 4 4 20.1 4 40s16.1 36 36 36 36-16.1 36-36S59.9 4 40 4z" fill="#336791"/>
      <path d="M54 28c0-7.7-6.3-14-14-14S26 20.3 26 28v24c0 7.7 6.3 14 14 14s14-6.3 14-14" stroke="white" strokeWidth="3" fill="none"/>
      <path d="M40 20v20M32 28h16" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

// ── Composant principal ──────────────────────────────────────────────────────

const LABELS: Record<string, { prefix: string; text: string }> = {
  fr: { prefix: 'Nous développons avec les', text: 'meilleures technologies du marché' },
  en: { prefix: 'We build with the',          text: 'best technologies on the market'   },
  es: { prefix: 'Desarrollamos con las',       text: 'mejores tecnologías del mercado'   },
};

export function PartnersMarquee() {
  const { language } = useTranslation();
  const label = LABELS[(language as string)] ?? LABELS.fr;

  return (
    <section className="py-12 border-y overflow-hidden" style={{ background: '#E8F4FD', borderColor: 'rgba(93,184,240,0.15)' }}>
      {/* Label centré au-dessus */}
      <div className="text-center mb-8 px-6">
        <p className="text-base font-medium" style={{ color: '#0E1B3D' }}>
          {label.prefix}{' '}
          <strong style={{ color: '#0E1B3D' }}>{label.text}</strong>
        </p>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden">
        {/* Dégradé masque gauche */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #E8F4FD, transparent)' }}
        />
        {/* Dégradé masque droite */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #E8F4FD, transparent)' }}
        />

        <div className="marquee-track">
          {MARQUEE_ITEMS.map((partner, i) => {
            const Icon = partner.icon;
            return (
              <div
                key={`${partner.name}-${i}`}
                className="flex items-center gap-3 px-10 flex-shrink-0 group"
                title={partner.name}
              >
                <div
                  className="opacity-60 group-hover:opacity-100 transition-all duration-300 flex items-center h-8"
                  style={{ filter: 'grayscale(1)', transition: 'filter 0.3s, opacity 0.3s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'none'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'grayscale(1)'; }}
                >
                  <Icon />
                </div>
                <span
                  className="text-sm font-medium whitespace-nowrap transition-colors duration-300"
                  style={{ color: 'rgba(14,27,61,0.6)' }}
                >
                  {partner.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
