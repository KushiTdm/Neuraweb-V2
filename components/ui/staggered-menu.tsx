'use client';

/**
 * StaggeredMenuPanel — adapté de React Bits pour NeuraWeb
 * Panneau full-screen mobile avec animation GSAP staggerée
 * Panneau contrôlé : open/onClose gérés par le parent (header.tsx)
 */

import React, { useCallback, useLayoutEffect, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { LocalizedLink } from '@/components/localized-link';

export interface StaggeredMenuItem {
  label: string;
  href: string;
  ariaLabel?: string;
  isSubItem?: boolean;
  /** lien externe (ex. sous-domaine démo) — rendu via <a> + nouvel onglet */
  external?: boolean;
  /** intertitre de groupe (affiché quand il change d'un item à l'autre) */
  group?: string;
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
  colors = ['rgb(var(--nav-fg, 0 70 67) / 0.55)', 'rgb(var(--nav-fg, 0 70 67))'],
  accentColor = 'currentColor',
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
    const raw = colors.length ? colors.slice(0, 4) : ['rgb(var(--nav-fg, 0 70 67) / 0.55)', 'rgb(var(--nav-fg, 0 70 67))'];
    const arr = [...raw];
    if (arr.length >= 3) arr.splice(Math.floor(arr.length / 2), 1);
    return arr;
  })();

  return (
    <>
      {/* Pre-layers colorés — glissent juste avant le panel (couleur = texte de la barre, donc de la page) */}
      <div ref={preLayersRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 47 }} aria-hidden>
        {preLayerColors.map((c, i) => (
          <div key={i} className="sm-prelayer absolute inset-0" style={{ background: c }} />
        ))}
      </div>

      {/* Panneau : mêmes couleurs que la barre de navigation (fond crème, texte Chypre ou couleur de la page) */}
      <aside
        ref={panelRef}
        className="fixed inset-0 flex flex-col overflow-y-auto"
        style={{ background: 'rgb(var(--nav-bg, 240 237 229))', color: 'rgb(var(--nav-fg, 0 70 67))', zIndex: 48 }}
        aria-hidden={!open}
        aria-label="Navigation mobile"
      >
        {/* La barre fixe (logo, langue, croix) reste au-dessus : on laisse sa hauteur libre */}
        <div className="h-[72px] flex-shrink-0" />
        <div className="mx-5 mb-4 h-px flex-shrink-0 bg-current opacity-15" />

        <nav className="flex-1 overflow-y-auto px-5 pb-4" aria-label="Navigation principale">
          <ul
            className="sm-panel-list m-0 flex list-none flex-col p-0"
            role="list"
            data-numbering={displayItemNumbering ? 'true' : undefined}
          >
            {items.map((item, idx) => {
              const showGroup = item.group && item.group !== '·' && item.group !== items[idx - 1]?.group;
              const className = `sm-panel-item group relative inline-flex min-h-[44px] items-center no-underline font-display font-bold leading-tight ${
                item.group ? 'py-1.5 text-[1.35rem] opacity-90' : 'py-2 text-[1.9rem]'
              }`;
              const inner = (
                <span className="sm-panel-itemLabel inline-block" style={{ transformOrigin: '50% 100%', willChange: 'transform' }}>
                  {item.label}
                </span>
              );
              return (
                <li key={item.label + idx} className="sm-panel-itemWrap relative overflow-hidden">
                  {showGroup && (
                    <p className="mb-1 mt-3 text-[11px] font-bold uppercase tracking-[0.18em] opacity-60">{item.group}</p>
                  )}
                  {item.group === '·' && items[idx - 1]?.group !== '·' && (
                    <div className="mb-2 mt-4 border-t border-current opacity-20" role="separator" />
                  )}
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onClose} className={className} aria-label={item.ariaLabel} data-index={idx + 1}>
                      {inner}
                    </a>
                  ) : (
                    <LocalizedLink href={item.href} onClick={onClose} className={className} aria-label={item.ariaLabel} data-index={idx + 1}>
                      {inner}
                    </LocalizedLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex-shrink-0 px-5 pb-8 pt-3">
          <LocalizedLink
            href="/contact"
            onClick={onClose}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'rgb(var(--nav-fg, 0 70 67))', color: 'rgb(var(--nav-bg, 240 237 229))' }}
          >
            {contactLabel}
            <ArrowRight size={16} aria-hidden="true" />
          </LocalizedLink>
        </div>
      </aside>
    </>
  );
}

export default StaggeredMenuPanel;
