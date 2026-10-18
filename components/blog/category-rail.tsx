'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryRailProps<T> {
  title: string;
  count: number;
  items: T[];
  seeAllLabel: string;
  onSeeAll: () => void;
  renderItem: (item: T, extraClass: string) => ReactNode;
  getKey: (item: T) => string;
}

/**
 * Rangée horizontale d'une catégorie : défilement tactile (scroll-snap) + avance automatique douce.
 * L'auto-défilement s'arrête au survol, au toucher, au focus clavier, hors écran et avec `prefers-reduced-motion`.
 */
export function CategoryRail<T>({ title, count, items, seeAllLabel, onSeeAll, renderItem, getKey }: CategoryRailProps<T>) {
  const track = useRef<HTMLUListElement>(null);
  const wrapper = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector('li');
    const w = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
    else el.scrollBy({ left: dir * w, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const node = wrapper.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible || items.length < 2) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => step(1), 4500);
    return () => clearInterval(id);
  }, [paused, visible, items.length, step]);

  // Reprise 10 s après une interaction tactile
  const holdThenResume = () => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 10000);
  };
  useEffect(() => () => { if (resumeTimer.current) clearTimeout(resumeTimer.current); }, []);

  return (
    <section ref={wrapper} aria-label={title} className="mb-10 md:mb-12">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-chypre sm:text-2xl">
          {title} <span className="ml-1 text-sm font-medium text-chypre/80">{count}</span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSeeAll}
            className="min-h-[44px] rounded-full px-3 text-sm font-semibold text-chypre underline underline-offset-4"
          >
            {seeAllLabel}
          </button>
          <div className="hidden gap-2 md:flex">
            <button type="button" onClick={() => { holdThenResume(); step(-1); }} aria-label="←" className="flex h-11 w-11 items-center justify-center rounded-full border border-chypre/30 text-chypre transition hover:bg-chypre/10">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => { holdThenResume(); step(1); }} aria-label="→" className="flex h-11 w-11 items-center justify-center rounded-full border border-chypre/30 text-chypre transition hover:bg-chypre/10">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <ul
        ref={track}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={holdThenResume}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-3 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <li key={getKey(item)} className="flex basis-[82%] shrink-0 snap-start sm:basis-[46%] lg:basis-[calc((100%-2rem)/3)]">
            {renderItem(item, 'w-full')}
          </li>
        ))}
      </ul>
    </section>
  );
}
