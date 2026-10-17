import type { CSSProperties } from 'react';

// Thèmes de page (voir docs/brand/BRAND_DECISIONS.md et BRAND_COLOR_TYPE_STRATEGY.md).
// `bg` = fond du thème, `fg` = texte, logo et icônes. Le bouton devis ne lit PAS ces valeurs.
export const PAGE_THEMES = {
  accueil: { bg: '#004643', fg: '#F0EDE5', paper: '#F0EDE5', ink: '#004643' }, // bicolore Chypre + Crème
  indigo: { bg: '#27187D', fg: '#F7F7FF' }, // Dev web & Mobile
  olive: { bg: '#31372B', fg: '#FBF7EC' }, // Automatisation & IA
  chypre: { bg: '#004643', fg: '#FAFAFA' }, // Santé
  ours: { bg: '#523D2C', fg: '#F3EFE6' }, // Restaurants & Hôtels
  moka: { bg: '#534739', fg: '#EBE9DD' }, // Collectivités & Équipe
  rouge: { bg: '#DE3A43', fg: '#EFE6DD' }, // Vietnam — gros formats seulement (contraste 3,6)
} as const;

export type PageThemeName = keyof typeof PAGE_THEMES;

/** Variables CSS à poser sur le conteneur de page : `style={themeStyle('indigo')}`. */
export function themeStyle(name: PageThemeName): CSSProperties {
  const t = PAGE_THEMES[name];
  return { '--theme-bg': t.bg, '--theme-fg': t.fg } as CSSProperties;
}
