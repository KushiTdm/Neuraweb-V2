'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

interface LocalizedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  prefetch?: boolean;
}

/**
 * Composant Link qui ajoute automatiquement le préfixe de langue
 * Exemple: href="/services" devient "/fr/services" si la langue est française
 */
export const LocalizedLink = forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  ({ href, children, className, onClick, style, onMouseEnter, onMouseLeave, prefetch, ...rest }, ref) => {
    const { language } = useLanguage();

    // Si le href commence déjà par une langue, ne pas ajouter le préfixe
    const languagePattern = /^\/(fr|en|es)(\/|$)/;
    
    let localizedHref = href;
    if (!languagePattern.test(href)) {
      // Ajouter le préfixe de langue
      localizedHref = href === '/' 
        ? `/${language}` 
        : `/${language}${href.startsWith('/') ? href : `/${href}`}`;
    }

    return (
      <Link 
        ref={ref}
        href={localizedHref} 
        className={className as string} 
        onClick={onClick}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        prefetch={prefetch}
        {...rest}
      >
        {children}
      </Link>
    );
  }
);

LocalizedLink.displayName = 'LocalizedLink';