'use client';

// Sommaire compact collant (mobile uniquement) pour les pages denses : un tap saute à la section.
// Se cale sous le header et remonte à top-0 quand le header se masque (html[data-nav-hidden]).
export function PageAnchorNav({ items, label }: { items: { href: string; label: string }[]; label: string }) {
  return (
    <nav
      aria-label={label}
      className="sticky top-[72px] z-30 border-b border-white/10 bg-[rgb(var(--c-navy-950)/0.92)] backdrop-blur-md transition-[top] duration-500 md:hidden [html[data-nav-hidden='true']_&]:top-0"
    >
      <ul className="scrollbar-hide flex gap-2 overflow-x-auto px-4 py-2.5">
        {items.map((item) => (
          <li key={item.href} className="shrink-0">
            <a
              href={item.href}
              className="inline-flex min-h-[36px] items-center rounded-full border border-white/25 px-4 text-sm font-semibold text-white transition-colors active:bg-white/10"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
