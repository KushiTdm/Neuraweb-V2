'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { LocalizedLink } from '@/components/localized-link';

interface PillButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  /** 'dark' = fond sombre (bordure + texte blancs, disque blanc)
   *  'light' = fond clair (bordure + texte noirs, disque noir) */
  variant?: 'dark' | 'light';
  className?: string;
  external?: boolean;
  disabled?: boolean;
}

export function PillButton({
  href,
  onClick,
  children,
  variant = 'dark',
  className = '',
  external = false,
  disabled = false,
}: PillButtonProps) {
  const cls = variant === 'dark' ? 'pill-btn-dark' : 'pill-btn-light';

  const inner = (
    <>
      <span className="pill-label">{children}</span>
      <span className="pill-disc" aria-hidden="true">
        <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
      </span>
    </>
  );

  if (href && !disabled) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${cls} ${className}`}
        >
          {inner}
        </a>
      );
    }
    return (
      <LocalizedLink href={href} className={`${cls} ${className}`}>
        {inner}
      </LocalizedLink>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${cls} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {inner}
    </button>
  );
}
