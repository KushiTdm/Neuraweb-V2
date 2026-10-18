'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { BlogHeading } from '@/lib/blog-markdown';

interface ArticleTocProps {
  headings: BlogHeading[];
  title: string;
  variant: 'desktop' | 'mobile';
}

/** Id du titre actif : le dernier titre passé sous le bord haut (sous l'en-tête fixe). */
function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '');
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let current = ids[0] ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ids]);
  return active;
}

export function ArticleToc({ headings, title, variant }: ArticleTocProps) {
  const ids = useMemo(() => headings.map((h) => h.id), [headings]);
  const active = useActiveHeading(ids);
  const [open, setOpen] = useState(false);

  if (headings.length < 3) return null;

  const list = (
    <ul className="space-y-0.5">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={() => setOpen(false)}
            aria-current={active === h.id ? 'location' : undefined}
            className={`block rounded-lg px-3 py-2 text-sm leading-snug transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chypre ${
              h.level === 3 ? 'ml-3 ' : ''
            }${
              active === h.id
                ? 'bg-chypre font-semibold text-creme'
                : 'text-chypre/85 hover:bg-chypre/10 hover:text-chypre'
            }`}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === 'desktop') {
    return (
      <nav aria-label={title} className="hidden lg:block">
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-chypre/80">{title}</p>
        <div className="max-h-[calc(100vh-9rem)] overflow-y-auto pr-1">{list}</div>
      </nav>
    );
  }

  return (
    <nav aria-label={title} className="mb-8 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-[48px] w-full items-center justify-between rounded-2xl border border-chypre/25 bg-creme px-4 text-left text-sm font-semibold text-chypre"
      >
        <span>
          {title} <span className="ml-1 font-normal text-chypre/80">({headings.length})</span>
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && <div className="mt-2 rounded-2xl border border-chypre/15 bg-chypre/[0.04] p-2">{list}</div>}
    </nav>
  );
}
