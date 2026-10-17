#!/usr/bin/env node
// Génère le système de thèmes de page (docs/brand/BRAND_DECISIONS.md) :
//   - lib/theme-tokens.json   : jetons de couleur → valeur par défaut (couleur Tailwind d'origine)
//   - app/[lang]/themes.css   : `:root` (valeurs d'origine) + `.theme-<nom>` (recolorage)
// Principe : chaque jeton (ex. `slate-500`, `indigo-600`, `white`, `navy-900`) devient une variable
// CSS `--c-<jeton>` consommée par tailwind.config.ts via `rgb(var(--c-x) / <alpha-value>)`.
// Hors d'un `.theme-*`, les variables valent les couleurs d'origine : rien ne change.
// Dans un `.theme-*`, tout est recalculé à partir de DEUX couleurs (D = sombre, L = clair) et de
// leurs mélanges — un accent optionnel A (ex. néon) n'est utilisé que pour les accents sur fond sombre.
// Usage : node scripts/generate-themes.mjs
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const twColors = require('tailwindcss/colors');

const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
const NEUTRALS = ['slate', 'gray', 'zinc', 'neutral', 'stone'];
const ACCENTS = ['indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'red', 'orange', 'amber', 'yellow', 'green', 'emerald', 'teal', 'cyan', 'blue', 'sky'];

// ─── Valeurs d'origine (tailwind.config.ts) pour les couleurs maison ──────────────────────────────
const CUSTOM = {
  'navy-700': '#1E3A6B', 'navy-800': '#1E2A4A', 'navy-900': '#0E1B3D', 'navy-950': '#070F26',
  'sky-400': '#5DB8F0', 'sky-DEFAULT': '#5DB8F0',
  'cyan-500': '#22D3EE', 'cyan-DEFAULT': '#22D3EE',
  'coral-DEFAULT': '#FF7A59', 'coral-soft': '#FFB088',
  'lime-DEFAULT': '#C5F277', 'frost-DEFAULT': '#E8F4FD', 'surface-DEFAULT': '#F7FAFD',
  white: '#FFFFFF', black: '#000000',
};

const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v * (1 - t) + b[i] * t));
const shade = (c, t) => mix(c, [0, 0, 0], t);
const trip = (c) => c.join(' ');

// ─── Liste des jetons ────────────────────────────────────────────────────────────────────────────
const tokens = {}; // nom → [r,g,b] par défaut
for (const p of [...NEUTRALS, ...ACCENTS]) for (const s of SHADES) if (twColors[p]?.[s]) tokens[`${p}-${s}`] = hex2rgb(twColors[p][s]);
for (const [k, v] of Object.entries(CUSTOM)) tokens[k] = hex2rgb(v);
tokens['sky-400'] = hex2rgb(CUSTOM['sky-400']);
tokens['cyan-500'] = hex2rgb(CUSTOM['cyan-500']);

// ─── Thèmes ──────────────────────────────────────────────────────────────────────────────────────
// D = sombre de la paire, L = clair de la paire, A = accent vif optionnel (sur fond sombre seulement).
// Dn = sombre « de fond » (si D est trop clair pour porter du texte, on utilise une ombre de D).
// Db = sombre « de marque » pour boutons/accents sur fond clair.
const THEMES = {
  accueil: { D: '#004643', L: '#F0EDE5' },
  sante: { D: '#004643', L: '#FAFAFA' },
  'dev-web': { D: '#DE3A43', L: '#EFE6DD', dn: 0.4, db: 0.18, nv950: 0.3, nv900: 0.2 }, // rouge : ombres pour garder la lisibilité
  mobile: { D: '#282B4A', L: '#EEEBDA' },
  automatisation: { D: '#9A0002', L: '#EFE6DE' },
  chatbot: { D: '#1A1A1A', L: '#FFFFFF', A: '#39FF14' },
  restaurants: { D: '#31372B', L: '#FBF7EC' },
  collectivites: { D: '#534739', L: '#EBE9DD' },
  vietnam: { D: '#4B2E21', L: '#F2E6B3' },
};

// Encre de la navbar (fond crème conservé) : sombre du thème, assombri si besoin pour le contraste (rouge).
function navInk(th) { const D = hex2rgb(th.D); return th.db ? shade(D, th.db) : D; }
function n950Of(th) { const D = hex2rgb(th.D); return th.nv950 ? shade(D, th.nv950) : shade(th.dn ? shade(D, th.dn) : D, 0.4); }
function n900Of(th) { const D = hex2rgb(th.D); const Dn = th.dn ? shade(D, th.dn) : D; return th.nv900 ? shade(D, th.nv900) : Dn; }

function themeValues(th) {
  const D = hex2rgb(th.D), L = hex2rgb(th.L), A = th.A ? hex2rgb(th.A) : null;
  const Dn = th.dn ? shade(D, th.dn) : D;
  const Db = th.db ? shade(D, th.db) : D;
  const Aon = A ?? L;
  const v = {};
  v.white = L; v.black = shade(Dn, 0.55);
  const neutral = {
    50: mix(L, Dn, 0.035), 100: mix(L, Dn, 0.07), 200: mix(L, Dn, 0.14), 300: mix(L, Dn, 0.26), 400: mix(L, Dn, 0.42),
    500: mix(Dn, L, 0.3), 600: mix(Dn, L, 0.18), 700: mix(Dn, L, 0.09), 800: mix(Dn, L, 0.08), 900: Dn, 950: shade(Dn, 0.35),
  };
  for (const p of NEUTRALS) for (const s of SHADES) v[`${p}-${s}`] = neutral[s];
  const accent = {
    50: mix(L, Dn, 0.05), 100: mix(L, Dn, 0.1), 200: mix(L, Dn, 0.18), 300: mix(Aon, Dn, A ? 0.1 : 0.28), 400: Aon,
    500: mix(Db, L, 0.12), 600: Db, 700: Db, 800: mix(Db, Dn, 0.5), 900: Dn, 950: shade(Dn, 0.35),
  };
  for (const p of ACCENTS) for (const s of SHADES) v[`${p}-${s}`] = accent[s];
  const n900 = th.nv900 ? shade(D, th.nv900) : Dn;
  const n950 = th.nv950 ? shade(D, th.nv950) : shade(Dn, 0.4);
  v['navy-700'] = mix(n900, L, 0.2); v['navy-800'] = mix(n900, L, 0.1); v['navy-900'] = n900; v['navy-950'] = n950;
  v['sky-DEFAULT'] = Aon; v['sky-400'] = Aon; v['cyan-DEFAULT'] = Aon; v['cyan-500'] = Aon;
  v['coral-DEFAULT'] = Aon; v['coral-soft'] = mix(Aon, Dn, 0.25); v['lime-DEFAULT'] = Aon;
  v['frost-DEFAULT'] = mix(L, Dn, 0.07); v['surface-DEFAULT'] = mix(L, Dn, 0.03);
  return { v, L, Dn };
}

// hex → "h s% l%" (variables shadcn)
function hsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

let css = '/* GÉNÉRÉ par scripts/generate-themes.mjs — ne pas modifier à la main. */\n:root {\n';
for (const [k, c] of Object.entries(tokens)) css += `  --c-${k}: ${trip(c)};\n`;
css += '}\n';
for (const [name, th] of Object.entries(THEMES)) {
  const { v, L, Dn } = themeValues(th);
  css += `\n.theme-${name} {\n`;
  for (const [k, c] of Object.entries(v)) css += `  --c-${k}: ${trip(c)};\n`;
  css += `  --background: ${hsl(L)};\n  --foreground: ${hsl(Dn)};\n  --card: ${hsl(L)};\n  --card-foreground: ${hsl(Dn)};\n  --border: ${hsl(mix(L, Dn, 0.18))};\n  --muted-foreground: ${hsl(mix(Dn, L, 0.3))};\n`;
  if (name !== 'accueil') css += `  --nav-fg: ${trip(navInk(th))};\n  --foot-bg: ${trip(n950Of(th))};\n  --foot-fg: ${trip(L)};\n`;
  css += `  background-color: rgb(var(--c-white));\n  color: rgb(var(--c-gray-900));\n}\n`;
  // Teinte intermédiaire + inversion de section (clair ↔ sombre) + motifs
  const { v: tv } = themeValues(th);
  const n950 = tv['navy-950'], Lc = tv.white;
  css += `.theme-${name} { --c-tint: ${trip(mix(L, Dn, 0.13))}; --pat-light: ${trip(Dn)}; --pat-dark: ${trip(L)}; }\n`;
  const FLIP = { 50: '950', 100: '900', 200: '800', 300: '700', 400: '600', 500: '500', 600: '400', 700: '300', 800: '200', 900: '100', 950: '50' };
  css += `.theme-${name} .sec-flip {\n`;
  for (const p of [...NEUTRALS, ...ACCENTS]) for (const sh of SHADES) css += `  --c-${p}-${sh}: ${trip(tv[`${p}-${FLIP[sh]}`])};\n`;
  css += `  --c-white: ${trip(n950)};\n  --c-navy-950: ${trip(Lc)};\n  --c-navy-900: ${trip(tv['frost-DEFAULT'])};\n  --c-navy-800: ${trip(mix(L, Dn, 0.2))};\n  --c-navy-700: ${trip(mix(L, Dn, 0.3))};\n  --c-surface-DEFAULT: ${trip(n950)};\n  --c-frost-DEFAULT: ${trip(tv['navy-900'])};\n}\n`;
}
const WAVES = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='160' viewBox='0 0 320 160' fill='none' stroke='black' stroke-width='1.4'>" + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d='M0 ${20 + i * 17} C 40 ${i * 17} 80 ${40 + i * 17} 160 ${20 + i * 17} S 280 ${i * 17} 320 ${20 + i * 17}'/>`).join('') + "</svg>\")";
const DOTS = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120' fill='black' stroke='black' stroke-width='1'><circle cx='20' cy='20' r='2.6'/><circle cx='80' cy='50' r='2.6'/><circle cx='45' cy='95' r='2.6'/><circle cx='105' cy='105' r='2.6'/><path d='M20 20L80 50L45 95L105 105' opacity='.6' fill='none'/></svg>\")";
css += `
/* Sections : teinte, inversion, motifs (masque SVG recoloré par le thème) */
.sec-tint { background-color: rgb(var(--c-tint)); }
.sec-dark-base { background-color: rgb(var(--c-navy-950)); }
.sec-flip { background-color: rgb(var(--c-white)); color: rgb(var(--c-gray-900)); }
.sec-flip.sec-flip-light { background-color: rgb(var(--c-navy-950)); }
.sec-pat { position: relative; isolation: isolate; }
.sec-pat::before { content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none; opacity: .09; background-color: rgb(var(--pat-dark, 255 255 255)); }
.sec-pat.sec-pat-light::before { background-color: rgb(var(--pat-light, 0 0 0)); opacity: .07; }
.sec-waves::before { -webkit-mask-image: ${WAVES}; mask-image: ${WAVES}; -webkit-mask-size: 320px 160px; mask-size: 320px 160px; }
.sec-dots::before { -webkit-mask-image: ${DOTS}; mask-image: ${DOTS}; -webkit-mask-size: 120px 120px; mask-size: 120px 120px; }
`;
fs.writeFileSync(new URL('../app/[lang]/themes.css', import.meta.url), css);
fs.writeFileSync(new URL('../lib/theme-tokens.json', import.meta.url), JSON.stringify(Object.keys(tokens), null, 0));
console.log(`themes.css : ${Object.keys(tokens).length} jetons × ${Object.keys(THEMES).length} thèmes`);
