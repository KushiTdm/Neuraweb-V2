import type { CSSProperties } from 'react';

// Thèmes de page (voir docs/brand/BRAND_DECISIONS.md).
// `bg` = fond du thème, `fg` = texte, logo et icônes, `accent` (optionnel) = touche vive.
// Le bouton principal reprend la paire du thème (voir `ctaStyle`).
export const PAGE_THEMES = {
  accueil: { bg: '#004643', fg: '#F0EDE5' }, // bicolore Chypre + Crème (fond clair : bg/fg inversés)
  'dev-web': { bg: '#DE3A43', fg: '#EFE6DD' }, // paire « Vietnam » — gros titres seulement (contraste 3,6)
  mobile: { bg: '#282B4A', fg: '#EEEBDA' }, // paire « Midnight Indigo / Vanilla Cream »
  automatisation: { bg: '#9A0002', fg: '#EFE6DE' }, // paire « Cherry Cola / Cream Vanilla »
  chatbot: { bg: '#1A1A1A', fg: '#FFFFFF', accent: '#39FF14' }, // paire « Neon Venom / Graphite »
  sante: { bg: '#004643', fg: '#FAFAFA' },
  restaurants: { bg: '#523D2C', fg: '#F3EFE6' }, // ⚠ proche de vietnam (brun) : à revoir
  collectivites: { bg: '#534739', fg: '#EBE9DD' },
  vietnam: { bg: '#4B2E21', fg: '#F2E6B3' }, // paire « Cookie Crumble / Whipped Butter »
} as const satisfies Record<string, { bg: string; fg: string; accent?: string }>;

export type PageThemeName = keyof typeof PAGE_THEMES;

/** Variables CSS à poser sur le conteneur de page : `style={themeStyle('mobile')}`. */
export function themeStyle(name: PageThemeName): CSSProperties {
  const t: { bg: string; fg: string; accent?: string } = PAGE_THEMES[name];
  return {
    '--theme-bg': t.bg,
    '--theme-fg': t.fg,
    ...(t.accent ? { '--theme-accent': t.accent } : {}),
  } as CSSProperties;
}

/**
 * Bouton principal = la paire de la page, jamais une couleur à part.
 * - sur une surface « thème » (hero, bandes colorées) : fond = fg, texte = bg ;
 * - sur une surface claire (sections papier) : fond = bg du thème, texte = fg.
 * Thème `dev-web` (rouge) : libellé en gros et gras (≥ 19 px) car le contraste de la paire est 3,6.
 * Thème `chatbot` : sur surface thème, le bouton passe en néon (`accent`) avec texte Graphite (12,8).
 */
export function ctaStyle(name: PageThemeName, surface: 'theme' | 'light'): CSSProperties {
  const t: { bg: string; fg: string; accent?: string } = PAGE_THEMES[name];
  if (surface === 'theme') {
    return { backgroundColor: t.accent ?? t.fg, color: t.bg };
  }
  return { backgroundColor: t.bg, color: t.fg };
}
