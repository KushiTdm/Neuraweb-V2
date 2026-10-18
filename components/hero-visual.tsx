'use client';

import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';

// Visuel de héros des pages thématiques : image WebP (2 couleurs du thème) + léger flottement CSS.
// L'animation est coupée avec prefers-reduced-motion (voir globals.css : .nw-float).
interface HeroVisualProps {
  src: string;
  alts: Record<'fr' | 'en' | 'es' | 'vi', string>;
  priority?: boolean;
  className?: string;
}

export function HeroVisual({ src, alts, priority = true, className = '' }: HeroVisualProps) {
  const { language } = useLanguage();
  const alt = alts[language as keyof typeof alts] ?? alts.fr;
  return (
    <div className={`nw-float relative aspect-[3/2] w-full overflow-hidden rounded-3xl border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.25)] ${className}`}>
      <Image src={src} alt={alt} fill sizes="(max-width:1024px) 92vw, 560px" priority={priority} className="object-cover" />
    </div>
  );
}
