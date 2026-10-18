# Décisions de marque validées (17 octobre 2026)

| Sujet | Décision | Source |
|---|---|---|
| **Logo** | Proposition 3 « Serif rétro chaleureux » : mot-marque `neuraweb` en serif rétro épais, `w` décoré. Design conservé, couleurs adaptées par page. | `generated/nwb_logo_P3_serif_retro.png` |
| **Page principale (accueil)** | **Bicolore** Chypre `#004643` + Crème `#F0EDE5` (teintes 20/40/60 % autorisées pour le décor) | [BRAND_BICOLORE.md](BRAND_BICOLORE.md) |
| **Autres pages** | Thème de couleur par service/secteur, logo recoloré selon le thème (stratégie « sobre → coloré ») | [BRAND_COLOR_TYPE_STRATEGY.md](BRAND_COLOR_TYPE_STRATEGY.md) §3 |

## Thèmes par page (mis à jour le 17 octobre 2026)
Chaque nom renvoie à la **paire de couleurs de la plaquette de référence**. Seules les **couleurs** sont reprises (pas les polices de ces plaquettes).

| Page | Paire | Fond (`bg`) | Texte / logo / icônes (`fg`) | Contraste |
|---|---|---|---|---|
| Accueil, Tarifs, Contact, Blog | Chypre + Crème (bicolore) | `#F0EDE5` (ou inversé `#004643`) | `#004643` | 9,2 |
| **Développement web** | « Vietnam » (rouge) | `#DE3A43` | `#EFE6DD` | **3,6 — gros titres seulement** |
| **Mobile** | Midnight Indigo / Vanilla Cream | `#282B4A` | `#EEEBDA` | 11,4 |
| **Automatisation** | Cherry Cola / Cream Vanilla | `#9A0002` | `#EFE6DE` | 7,2 |
| **Chatbot / intégration IA** | Neon Venom / Graphite | `#1A1A1A` | `#FFFFFF` + accent `#39FF14` | 17,4 · 12,8 (néon) |
| **Vietnam** | Cookie Crumble / Whipped Butter | `#4B2E21` | `#F2E6B3` | 9,8 |
| Santé, Restaurants & Hôtels, Collectivités & Équipe | inchangés | voir [BRAND_COLOR_TYPE_STRATEGY.md](BRAND_COLOR_TYPE_STRATEGY.md) | | |

## Règle du bouton : toujours la paire de la page (décidé)
Les couleurs vont **par paires** : plus de sable commun. Le bouton principal reprend la paire du thème, en inversé selon la surface :
| Surface | Fond du bouton | Texte du bouton |
|---|---|---|
| Hero / bande colorée du thème | `fg` du thème | `bg` du thème |
| Section claire (papier) | `bg` du thème | `fg` du thème |
Cas particuliers : **Développement web** (paire à 3,6) : libellé du bouton en **gras ≥ 19 px** (seuil « grand texte » WCAG, 3:1). **Chatbot** : sur surface thème, bouton **néon** `#39FF14` + texte Graphite (12,8). Implémenté dans `ctaStyle()` (`lib/page-themes.ts`).

## Typographie (décidé) : plaquette « Option B — rétro chaleureux », sans ses couleurs
| Rôle | Police (Google Fonts, vietnamien vérifié) |
|---|---|
| **Principale** — logo et titres d'impact | **Fraunces Black** (axes `SOFT` / `WONK` à tester) |
| **Primaire** — titres, boutons, navigation | **Bricolage Grotesque** Bold |
| **Secondaire** — texte courant | **Inter** Regular/Medium |
La plaquette générée est une image IA : les polices à utiliser sont celles **nommées ci-dessus** (le rendu de la ligne « primaire » de l'image ressemble plus à Inter qu'à Bricolage). Les couleurs de bas de plaquette (`#31372B #FBF7EC #DE3A43 #F3AC5E`) sont **ignorées**.
Remplace pour la typo : Inter Tight + Lora de [BRAND_BICOLORE.md](BRAND_BICOLORE.md).

## Points ouverts
- **Collision de bruns** : Vietnam (`#4B2E21`) est presque identique à Restaurants & Hôtels (`#523D2C`). Proposition : Restaurants & Hôtels passe sur la paire **Black Olive / Floral White** (`#31372B` / `#FBF7EC`), libérée depuis le retrait de l'olive pour l'automatisation. À valider.
- **Page chatbot** : supposée être `/integration-ia`. À confirmer.
- Intégration des polices dans le site (`next/font`, `tailwind.config.ts`) : pas encore faite.
- Le logo est en SVG (`components/brand/neuraweb-logo.tsx`), recolorable par thème via `currentColor`.

## Système de thèmes de page (implémenté le 17 octobre 2026)
- `scripts/generate-themes.mjs` génère `app/[lang]/themes.css` et `lib/theme-tokens.json`. **Ne pas éditer le CSS à la main** : modifier les paires dans le script puis `node scripts/generate-themes.mjs`.
- Chaque couleur Tailwind (slate/gray/indigo/emerald/…/navy/sky/white) est une variable `--c-<jeton>` ; hors thème elle vaut sa couleur d'origine (rien ne change), dans `.theme-<nom>` elle est recalculée à partir de **deux couleurs** (sombre + clair) et de leurs mélanges. Le néon (chatbot) n'est utilisé que comme accent sur fond sombre.
- Les pages sont enveloppées dans `<div className="theme-…">` entre `<Header />` et `<Footer />` : dev-web (rouge), mobile (minuit), automatisation (cerise), intégration IA/chatbot (graphite + néon), santé (Chypre), restaurants (olive), collectivités + équipe (moka), accueil + tarifs/contact/booking/blog/légales/SEO locales (Chypre + crème). **Vietnam** : thème prêt (`.theme-vietnam`), pas encore de page à l'appliquer.
- Limite : les couleurs écrites en dur hors palette Tailwind (quelques `rgba` teal/rose/cyan, dégradés SVG) et les illustrations/captures ne suivent pas le thème.
