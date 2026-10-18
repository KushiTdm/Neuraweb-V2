'use client';

import React, { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileCollapseProps {
  children: React.ReactNode;
  /** Titre toujours affiché ; sur mobile il devient le bouton qui déplie le contenu. */
  title?: React.ReactNode;
  /** Sans `title` : libellé du bouton (mobile uniquement), selon l'état. */
  openLabel?: string;
  closedLabel?: string;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
}

/**
 * Contenu replié sur mobile, toujours déplié à partir de `lg`.
 * Le contenu reste dans le HTML rendu (simple `display:none`) : même texte pour Google
 * et les crawlers IA, seul le scroll mobile raccourcit.
 */
export function MobileCollapse({
  children,
  title,
  openLabel,
  closedLabel,
  defaultOpen = false,
  className,
  headerClassName,
}: MobileCollapseProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center justify-between gap-3 text-left lg:pointer-events-none lg:cursor-default',
          !title && 'lg:hidden',
          headerClassName,
        )}
      >
        {title ?? <span className="text-sm font-medium text-white/80">{open ? openLabel : closedLabel}</span>}
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={cn('shrink-0 transition-transform duration-200 lg:hidden', open && 'rotate-180')}
        />
      </button>
      <div id={panelId} className={cn(open ? 'block' : 'hidden lg:block')}>
        {children}
      </div>
    </div>
  );
}
