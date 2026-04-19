# NeuraWeb — Identité Visuelle & Design System

> Extrait automatiquement depuis le code source — `globals.css`, composants sections, layout.

---

## Positionnement

NeuraWeb se positionne comme une **agence tech premium** avec une esthétique **dark-first, néomorphique-spatiale** :
fond presque noir (`#050510`), effets Three.js et particules en couche, ambiance à mi-chemin entre un studio de motion design et une interface de dashboard SaaS.

---

## 1. Palette de couleurs

### 1.1 Couleurs de marque (Brand Core)

| Token | Hex | Usage |
|---|---|---|
| `--brand-primary` | `#6366f1` | Couleur principale — indigo |
| `--brand-secondary` | `#8b5cf6` | Couleur secondaire — violet |
| `--brand-accent` | `#22d3ee` | Accent tech/data — cyan |
| `--brand-rose` | `#f43f5e` | Accent émotionnel / alertes — rose |

### 1.2 Couleurs de surface

| Token | Valeur | Mode |
|---|---|---|
| BG Dark | `#050510` | Dark |
| Surface 1 Dark | `rgba(15,15,30,0.95)` | Dark |
| Surface 2 Dark | `rgba(20,20,40,0.9)` | Dark |
| Surface Glass Dark | `rgba(255,255,255,0.04)` | Dark |
| BG Light | `#ffffff` | Light |
| Surface Light | `rgba(255,255,255,0.8)` | Light |
| Surface 2 Light | `rgba(248,250,252,0.9)` | Light |
| Surface Glass Light | `rgba(255,255,255,0.06)` | Light |

### 1.3 Couleurs thématiques par service

| Service | Couleur principale | Hex | Dégradé |
|---|---|---|---|
| Web Dev | Blue | `#3b82f6` | `#3b82f6 → #1d4ed8` |
| Automation | Purple | `#a855f7` | `#a855f7 → #7e22ce` |
| AI | Pink | `#ec4899` | `#ec4899 → #be185d` |
| Reliability | Emerald | `#10b981` | valeur About |
| Performance | Amber | `#f59e0b` | valeur About |
| Collaboration | Blue | `#3b82f6` | valeur About |
| Excellence | Purple | `#a855f7` | valeur About |

---

## 2. Gradients — signature de marque

Tous les gradients sont à **135° de direction**. C'est la signature directionnelle de la marque.

```css
/* Brand — couleur par défaut des boutons et icônes */
--gradient-brand: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);

/* Hero — gradient principal de la section hero */
--gradient-hero: linear-gradient(135deg, #4f46e5 0%, #7c3aed 40%, #ec4899 100%);

/* CTA — version plus sombre pour les appels à l'action */
--gradient-cta: linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #be185d 100%);

/* Text — gradient appliqué au clip-text des titres */
--gradient-text: linear-gradient(135deg, #6366f1, #8b5cf6, #22d3ee);

/* Text Hero — version claire pour les titres sur fond sombre */
/* (défini inline) */ linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #67e8f9 100%);

/* Shimmer — animation de brillance */
--gradient-shimmer: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
```

### Ligne décorative

```css
/* Subtile */
.gradient-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(139,92,246,0.5), transparent);
}

/* Lumineuse */
.gradient-line-bright {
  height: 2px;
  background: linear-gradient(90deg, transparent, #6366f1, #8b5cf6, #22d3ee, transparent);
}
```

---

## 3. Typographie

### Familles de polices

| Police | Variable CSS | Usage | Poids | Source |
|---|---|---|---|---|
| **Syne** | `--font-syne` | Titres h1–h6 | 700, 800 | Google Fonts |
| **Geist** | `--font-geist` | Corps, UI, labels | 400, 500, 600, 700, 800 | Vercel |
| **Geist Mono** | `--font-geist-mono` | Code, compteurs | 400, 500 | Vercel |

### Échelle typographique

```css
h1 { font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 800; }
h2 { font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 700; }
h3 { font-size: clamp(1.5rem, 3vw, 2rem);  font-weight: 700; }
p  { line-height: 1.75; }
```

Propriétés globales :
- `letter-spacing: -0.02em` sur tous les titres
- `line-height: 1.15` sur les titres
- `font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1`
- `-webkit-font-smoothing: antialiased`

---

## 4. Ombres & effets

```css
--shadow-sm:  0 1px 2px rgba(0,0,0,0.04);
--shadow-md:  0 4px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
--shadow-lg:  0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
--shadow-xl:  0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06);
--shadow-glow: 0 0 40px rgba(99, 102, 241, 0.25);   /* glow indigo */
```

En mode dark, les opacités sont multipliées (~×5).

---

## 5. Design tokens — espacement & layout

| Token | Valeur |
|---|---|
| `--radius` | `0.75rem` (12px) |
| Scrollbar width | 6px |
| Scrollbar color | `rgba(99,102,241,0.3)` → `0.6` au hover |
| Touch target min | 44×44px (`@media (pointer: coarse)`) |

---

## 6. Composants UI

### Boutons

```css
/* Primaire — gradient + glow */
.btn-primary {
  background: var(--gradient-brand);
  box-shadow: 0 4px 15px rgba(99,102,241,0.4);
  border-radius: 0.75rem;
  padding: 12px 24px;
  /* hover: translateY(-2px), glow renforcé */
}

/* Secondaire — glassmorphisme */
.btn-secondary {
  background: rgba(255,255,255,0.8) / rgba(gray-800,0.6);
  border: 1px solid gray-200 / gray-700;
  backdrop-blur: sm;
}

/* Ghost — discret */
.btn-ghost {
  color: gray-600;
  hover: bg-gray-100;
}
```

### Cartes

```css
/* Base */
.card-base {
  background: white / gray-900;
  border: 1px solid gray-100 / gray-800;
  border-radius: 1rem;
  box-shadow: var(--shadow-md);
  /* hover: shadow-xl + border brand */
}

/* Glass */
.card-glass {
  background: var(--surface-glass);
  border: 1px solid rgba(255,255,255,0.10);
  backdrop-blur: 12px;
}
```

### Badges

```css
.badge-brand  { bg: indigo-50 / indigo-950;  color: indigo-600 / indigo-400; border: brand; }
.badge-outline { bg: white/60; border: gray; color: gray-600; backdrop-blur; }
```

### Sélection de texte

```css
::selection { background: rgba(99,102,241,0.25); }
```

---

## 7. Animations — catalogue complet

| Keyframe | Durée | Type | Usage |
|---|---|---|---|
| `float` | 4s ease-in-out ∞ | translateY 0 → -14px → 0 | Éléments flottants |
| `cardFloat` | 3s ease-in-out ∞ | translateY 0 → -8px → 0 | Cartes |
| `shimmer` | 2.5s linear ∞ | bg-position -200% → 200% | Effets de brillance |
| `glowPulse` | keyframes | opacity 0.5 → 1 → 0.5 | Halos lumineux |
| `borderSpin` | ∞ | rotate 0 → 360° | Bordures animées |
| `ping-slow` | 2s cubic ∞ | scale 1.5 → 2.2, opacity 0.6→0 | Indicateurs actifs |
| `particle-rise` | 3s ease-in ∞ | translateY 0 → -80px, scale 0→1→0 | Particules |
| `fadeIn` | 0.5s ease-in | opacity 0 → 1 | Apparitions |

### Animations au scroll (IntersectionObserver)

```css
.animate-on-scroll   { opacity: 0; transform: translateY(40px); transition: 0.8s cubic-bezier(0.22,1,0.36,1); }
.animate-on-scroll.animate-in { opacity: 1; transform: translateY(0); }

/* Variantes */
.fade-up    { translateY(50px)  }
.fade-left  { translateX(-50px) }
.fade-right { translateX(50px)  }
.scale-up   { scale(0.85)       }

/* Délais disponibles */
.delay-100 … .delay-600  { transition-delay: 0.1s … 0.6s; }
```

> ⚠️ **Accessibilité** : `@media (prefers-reduced-motion: reduce)` désactive toutes les animations (durée → 0.01ms, iteration → 1).

---

## 8. Effets Three.js — arrière-plans 3D

Trois scènes Three.js sont utilisées sur le site :

### Hero — réseau neuronal généraliste
- 800 particules sphériques (bleu→violet→rose)
- Rotation lente réactive à la souris
- Rendu `AdditiveBlending`, `depthWrite: false`

### About — composition multi-objets
- 60 nœuds + lignes de connexion (réseau de neurones)
- Double hélice DNA (80 points × 2 brins)
- Sphère holographique centrale (icosaèdre wireframe + anneau torique)
- 800 particules flottantes

### Services — composition thématique
- 400 particules (palette changeante selon le service actif)
- 4 sphères en orbite
- Noyau icosaèdre pulsant
- 3 anneaux toriques à vitesses différentes
- Palette de couleurs swap à chaud selon l'index actif (0=bleu, 1=violet, 2=rose)

---

## 9. Accessibilité (WCAG AA)

| Élément | Implémentation |
|---|---|
| Skip link | `.skip-link` — apparaît au focus, disparaît sinon |
| Focus visible | `outline: 2px solid #6366f1; outline-offset: 3px` |
| Focus ring boutons | `box-shadow: 0 0 0 4px rgba(99,102,241,0.25)` |
| Touch targets | `min-height: 44px; min-width: 44px` sur `pointer: coarse` |
| Reduced motion | Désactivation complète de toutes les animations |
| High contrast | Borders 2px + underline sur liens |
| Contraste texte minimum | 4.5:1 (`--text-contrast-muted: #6b7280` sur blanc) |
| Texte SR only | `.sr-only` avec clip/overflow |

---

## 10. Couleurs chart (tokens shadcn/ui)

```css
--chart-1: hsl(239 84% 67%)   /* indigo */
--chart-2: hsl(262 83% 58%)   /* violet */
--chart-3: hsl(187 100% 42%)  /* cyan */
--chart-4: hsl(330 81% 60%)   /* rose */
--chart-5: hsl(43 96% 56%)    /* amber */
```

---

## Résumé — ADN visuel en 5 points

1. **Axe chromatique** : indigo `#6366f1` → violet `#8b5cf6` — c'est la colonne vertébrale de toute la marque.
2. **Direction** : tous les gradients à `135deg` — cohérence absolue.
3. **Dark-first** : le fond de référence est `#050510`, le light mode est un override.
4. **Mouvement** : les animations Three.js ne sont pas décoratives — elles racontent l'IA et les données.
5. **Typo en tension** : Syne (organique, expressif) vs Geist (neutre, système) — agence créative + sérieux tech.
