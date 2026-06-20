'use client';

/**
 * StaggeredMenuPanel — adapté de React Bits pour NeuraWeb
 * Panneau full-screen mobile avec animation GSAP staggerée
 * Panneau contrôlé : open/onClose gérés par le parent (header.tsx)
 */

import React, { useCallback, useLayoutEffect, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, X } from 'lucide-react';
import { gsap } from 'gsap';
import { LocalizedLink } from '@/components/localized-link';

export interface StaggeredMenuItem {
  label: string;
  href: string;
  ariaLabel?: string;
  isSubItem?: boolean;
  /** lien externe (ex. sous-domaine démo) — rendu via <a> + nouvel onglet */
  external?: boolean;
}

interface StaggeredMenuPanelProps {
  open: boolean;
  onClose: () => void;
  items: StaggeredMenuItem[];
  /** Couleurs des couches pre-layer (défaut : navy NeuraWeb) */
  colors?: string[];
  /** Couleur d'accent pour le hover et numérotation */
  accentColor?: string;
  /** Affiche la numérotation devant les items */
  displayItemNumbering?: boolean;
  /** Label du bouton contact */
  contactLabel?: string;
}

export function StaggeredMenuPanel({
  open,
  onClose,
  items,
  colors = ['#1E2A4A', '#0E1B3D'],
  accentColor = '#ffffff',
  displayItemNumbering = false,
  contactLabel = 'Contact',
}: StaggeredMenuPanelProps) {
  const panelRef       = useRef<HTMLElement>(null);
  const preLayersRef   = useRef<HTMLDivElement>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const openTlRef      = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef  = useRef<gsap.core.Tween | null>(null);
  const busyRef        = useRef(false);
  const prevOpenRef    = useRef(false);

  // ── Initialisation GSAP ───────────────────────────────────────────────────
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      if (!panel) return;

      const preLayers = preContainer
        ? Array.from(preContainer.querySelectorAll<HTMLElement>('.sm-prelayer'))
        : [];
      preLayerElsRef.current = preLayers;

      gsap.set([panel, ...preLayers], { xPercent: 100, opacity: 1 });
    });
    return () => ctx.revert();
  }, []);

  // ── Timeline d'ouverture ───────────────────────────────────────────────────
  const buildOpenTimeline = useCallback(() => {
    const panel  = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    closeTweenRef.current?.kill();
    closeTweenRef.current = null;

    const itemEls   = Array.from(panel.querySelectorAll<HTMLElement>('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll<HTMLElement>('.sm-panel-list[data-numbering] .sm-panel-item'));

    if (itemEls.length)   gsap.set(itemEls,   { yPercent: 140, rotate: 8 });
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 } as gsap.TweenVars);

    const tl = gsap.timeline({ paused: true });
    const layerCount = layers.length;

    layers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const panelInsertTime = layerCount ? (layerCount - 1) * 0.07 + 0.08 : 0;
    const panelDuration = 0.65;

    tl.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsertTime);

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(itemEls, { yPercent: 0, rotate: 0, duration: 0.9, ease: 'power4.out', stagger: { each: 0.09, from: 'start' } }, itemsStart);
      if (numberEls.length) {
        tl.to(numberEls, { duration: 0.6, ease: 'power2.out', '--sm-num-opacity': 1 } as gsap.TweenVars, itemsStart + 0.1);
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => { busyRef.current = false; });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  // ── Animation de fermeture ────────────────────────────────────────────────
  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel  = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    closeTweenRef.current?.kill();
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: 100,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const els = Array.from(panel.querySelectorAll<HTMLElement>('.sm-panel-itemLabel'));
        if (els.length) gsap.set(els, { yPercent: 140, rotate: 8 });
        const numEls = Array.from(panel.querySelectorAll<HTMLElement>('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numEls.length) gsap.set(numEls, { '--sm-num-opacity': 0 } as gsap.TweenVars);
        busyRef.current = false;
      },
    });
  }, []);

  // ── Réagit aux changements de prop `open` ─────────────────────────────────
  useEffect(() => {
    if (open && !prevOpenRef.current) playOpen();
    else if (!open && prevOpenRef.current) playClose();
    prevOpenRef.current = open;
  }, [open, playOpen, playClose]);

  // ── Couleurs des pre-layers ───────────────────────────────────────────────
  const preLayerColors = (() => {
    const raw = colors.length ? colors.slice(0, 4) : ['#1E2A4A', '#0E1B3D'];
    const arr = [...raw];
    if (arr.length >= 3) arr.splice(Math.floor(arr.length / 2), 1);
    return arr;
  })();

  return (
    <>
      {/* Pre-layers colorés — glissent juste avant le panel */}
      <div
        ref={preLayersRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 47 }}
        aria-hidden
      >
        {preLayerColors.map((c, i) => (
          <div
            key={i}
            className="sm-prelayer absolute inset-0"
            style={{ background: c }}
          />
        ))}
      </div>

      {/* Panel principal */}
      <aside
        ref={panelRef}
        className="fixed inset-0 flex flex-col overflow-y-auto"
        style={{ background: '#070F26', zIndex: 48 }}
        aria-hidden={!open}
        aria-label="Navigation mobile"
      >
        {/* Header : logo + bouton fermer */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
          <LocalizedLink href="/" onClick={onClose}>
            <Image
              src="/assets/neurawebW.webp"
              alt="NeuraWeb"
              width={130}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </LocalizedLink>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Ligne de séparation gradient */}
        <div className="mx-5 mb-6 h-px" style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.3),transparent)' }} />

        {/* Items de navigation */}
        <nav className="flex-1 px-5 overflow-y-auto">
          <ul
            className="sm-panel-list list-none m-0 p--0 flex flex-col gap-1"
            role="list"
            style={{ '--sm-accent': accentColor } as React.CSSProperties}
            data-numbering={displayItemNumbering ? 'true' : undefined}
          >
            {items.map((item, idx) => (
              <li
                key={item.label + idx}
                className={`sm-panel-itemWrap relative overflow-hidden leading-none ${item.isSubItem ? 'ml-5 border-l border-white/10 pl-4' : ''}`}
              >
                {(() => {
                  const className = `sm-panel-item group relative cursor-pointer leading-none inline-block no-underline ${
                    item.isSubItem
                      ? 'text-white/60 font-semibold py-1.5 hover:text-white/90'
                      : 'text-white/90 font-bold tracking-tight uppercase py-2'
                  }`;
                  const style = {
                    fontSize: item.isSubItem ? 'clamp(1.1rem, 4.5vw, 1.5rem)' : 'clamp(2.2rem, 9vw, 3.4rem)',
                    letterSpacing: item.isSubItem ? '-0.01em' : '-0.03em',
                    paddingRight: displayItemNumbering && !item.isSubItem ? '2.5em' : undefined,
                  } as const;
                  const inner = (
                    <span
                      className="sm-panel-itemLabel inline-block transition-colors duration-150 group-hover:text-white"
                      style={{ transformOrigin: '50% 100%', willChange: 'transform' }}
                    >
                      {item.isSubItem && <span className="mr-1.5 opacity-40">—</span>}
                      {item.label}
                    </span>
                  );
                  return item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className={className}
                      style={style}
                      aria-label={item.ariaLabel}
                      data-index={idx + 1}
                    >
                      {inner}
                    </a>
                  ) : (
                    <LocalizedLink
                      href={item.href}
                      onClick={onClose}
                      className={className}
                      style={style}
                      aria-label={item.ariaLabel}
                      data-index={idx + 1}
                    >
                      {inner}
                    </LocalizedLink>
                  );
                })()}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 pb-10 pt-6 flex-shrink-0">
          {/* Ligne de séparation */}
          <div className="mb-5 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

          {/* CTA Contact */}
          <LocalizedLink
            href="/contact"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full text-sm font-semibold mb-5 transition-opacity hover:opacity-90"
            style={{ background: '#ffffff', color: '#111827' }}
          >
            {contactLabel}
            <ArrowRight size={15} />
          </LocalizedLink>

          <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
            contact@neuraweb.tech
          </p>
        </div>
      </aside>

      <style>{`
        /* Numérotation */
        .sm-panel-list[data-numbering] { counter-reset: smItem; }
        .sm-panel-list[data-numbering] .sm-panel-item::after {
          counter-increment: smItem;
          content: counter(smItem, decimal-leading-zero);
          position: absolute;
          top: 0.15em;
          right: 0;
          font-size: 13px;
          font-weight: 400;
          color: #9ca3af;
          letter-spacing: 0;
          pointer-events: none;
          user-select: none;
          opacity: var(--sm-num-opacity, 0);
        }
      `}</style>
    </>
  );
}

export default StaggeredMenuPanel;
