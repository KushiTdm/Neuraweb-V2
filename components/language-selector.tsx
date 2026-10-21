'use client';

import { useLanguage } from '@/contexts/language-context';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Language } from '@/contexts/language-context';

// Sélecteur de langue : texte seul (FR / EN / ES / VI), sans icône ni drapeau.
// Couleurs : celles de la page (Chypre sur Crème dans l'en-tête).
const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'vi', name: 'Tiếng Việt' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setIsOpen(false);

    const pathSegments = pathname.split('/');
    if (['fr', 'en', 'es', 'vi'].includes(pathSegments[1])) {
      pathSegments[1] = newLang;
      router.push(pathSegments.join('/'));
    } else {
      // Fallback : pathname peut être '/' si le middleware a fait un rewrite (pas redirect)
      router.push(`/${newLang}`);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-full border border-navfg/30 px-3.5 py-1.5 text-sm font-semibold uppercase tracking-wide text-navfg transition-colors hover:bg-navfg/10"
        aria-label={`${language} – Change language`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {language}
        <span
          aria-hidden="true"
          className={`inline-block h-0 w-0 border-x-4 border-t-[5px] border-x-transparent border-t-current transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-navfg/20 bg-navbg py-1 text-navfg shadow-[0_12px_32px_rgba(0,70,67,0.18)]"
        >
          {LANGUAGES.map((lang) => {
            const selected = language === lang.code;
            return (
              <li key={lang.code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex w-full items-baseline gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                    selected ? 'bg-navfg text-navbg' : 'hover:bg-navfg/10'
                  }`}
                >
                  <span className="w-6 font-bold uppercase">{lang.code}</span>
                  <span className={selected ? 'text-navbg/90' : 'text-navfg/80'}>{lang.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
