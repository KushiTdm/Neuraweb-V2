# NeuraWeb — Stratégie couleur par page, typographie et logo (v2, 17 octobre 2026)

> **Remplace la palette et les polices du §6 de [BRAND_AUDIT_NEURAWEB_2026.md](BRAND_AUDIT_NEURAWEB_2026.md)** (navy/corail/jade/ciel/sable jugée disharmonieuse).
> Source : les 7 palettes envoyées (couleurs **échantillonnées dans les images**, pas lues sur les étiquettes) + recherches Pinterest (palettes navy/terracotta/crème, lettrages de logos, paires de polices, affiches).
> Remarque : sur ta palette « milk / sea », les codes écrits dans l'image (#D2DB76 / #2D371D) ne correspondent pas aux couleurs affichées (blanc bleuté / indigo). J'ai utilisé les couleurs réellement affichées.

## 1. Ce que tes palettes ont en commun (le « goût NeuraWeb »)
- Un **fond crème chaud** (vanille, coco, blanc floral) : jamais de blanc pur froid.
- Une **couleur sombre profonde et saturée avec de la personnalité** (ardoise, vert Chypre, olive noire, indigo, brun, moka) à la place d'un noir/navy générique.
- **Une seule couleur vive par composition** (sable-orange ou rouge).
- Typo : condensé gras (Chorus/Anton), serif rétro épais, serif italique, Didone élégant.

Pourquoi l'ancienne palette échouait : 7 teintes sans hiérarchie (navy, corail rose-orangé, jade, ciel, sable, lime) avec **3 accents qui se battaient**.

## 2. Palette officielle (couleurs exactes)

| Rôle | Nom | HEX | Origine |
|---|---|---|---|
| **Base — fond** | Vanille | `#F3EFE6` | ta palette « Vanilla Bean » |
| **Base — encre** | Ardoise | `#2C3844` | ta palette « Tokyo/Chorus » (remplace le navy `#0E1B3D`) |
| **Signature — CTA** | Sable | `#F3AC5E` | ta palette « Tokyo/Chorus » |
| Thème Dev web & Mobile | Indigo / Lait | `#27187D` / `#F7F7FF` | « milk / sea » |
| Thème Automatisation & IA | Olive noire / Blanc floral | `#31372B` / `#FBF7EC` | « Floral White / Black Olive » |
| Thème Santé | Chypre / Blanc nuage | `#004743` / `#FAFAFA` | « Cyprus / Cloud White » |
| Thème Restaurants & Hôtels | Ours / Vanille | `#523D2C` / `#F3EFE6` | « Teddy Bear / Vanilla Bean » |
| Thème Collectivités & Équipe | Moka / Coco | `#534739` / `#EBE9DD` | « Mocha / Coconut » |
| Thème Vietnam | Rouge / Crème | `#DE3A43` / `#EFE6DD` | « Punchy Pink / Cream Vanilla » |

**Règle d'or : le bouton « Demander un devis » est toujours Sable avec texte Ardoise, sur toutes les pages.** C'est l'élément qui rend le site reconnaissable quelle que soit la couleur de la page.

## 3. Stratégie : « chaque page, sa couleur », du sobre au coloré

| Niveau | Pages | Traitement |
|---|---|---|
| **N0 — Sobre** | Accueil, Tarifs, Réservation, Contact, Blog (liste + articles), pages SEO locales (Lille, Paris) | Vanille + Ardoise + 1 bouton Sable. Aucune couleur de thème. |
| **N1 — Hub** | Services | Base sobre, avec 4–5 pastilles/cartes aux couleurs des thèmes (le visiteur « apprend » la légende). |
| **N2 — Service** | Développement web (Indigo), Mobile (Indigo), Automatisation & IA, Intégration IA (Olive) | Hero en couleur du thème + 1 bande de section ; le reste en Vanille. |
| **N3 — Verticale / marché** | Santé (Chypre), Restaurants & Hôtels (Ours), Collectivités & Équipe (Moka), **Vietnam (Rouge)** | Thème complet : hero, bandes, icônes, illustrations teintées. |

Pourquoi ce choix : la conversion (tarifs, devis, contact) reste sur une base stable et sobre ; la couleur sert à **orienter** (où suis-je ? quel service ?) et à **parler au secteur** (vert = santé, brun chaleureux = restauration/hôtel, rouge = Vietnam, indigo = tech).
Les **tags du blog** reprennent les couleurs de thème par catégorie (web = indigo, IA = olive, santé = chypre…).

## 4. Contrastes mesurés (WCAG, ratio texte/fond)

| Couple | Ratio | Usage autorisé |
|---|---|---|
| Ardoise sur Vanille | 10,4 | Tout texte ✓ |
| Ardoise sur Sable | 6,2 | Bouton CTA ✓ |
| Blanc nuage sur Chypre | 10,2 | Tout texte ✓ |
| Blanc floral sur Olive | 11,5 | Tout texte ✓ |
| Lait sur Indigo | 13,0 | Tout texte ✓ |
| Vanille sur Ours | 8,9 | Tout texte ✓ |
| Coco sur Moka | 7,4 | Tout texte ✓ |
| Sable sur Indigo / Olive / Chypre / Ours / Moka | 7,2 / 6,4 / 5,5 / 5,3 / 4,7 | Titres et boutons ✓ (texte courant : réserver à ≥ 5) |
| **Crème sur Rouge** | **3,6** | **Gros titres uniquement (≥ 24 px)** |
| **Rouge sur Vanille** | **3,8** | **Gros titres / fonds, jamais en texte courant** |
| **Sable sur Rouge** | **2,3 ✗** | Interdit : sur le thème Vietnam, le CTA est Ardoise (texte crème) |
| **Sable sur Vanille** | **1,7 ✗** | Interdit en texte/icône ; seulement en fond de bouton avec texte Ardoise |

Règles : Sable n'est jamais du texte sur fond clair ; Rouge jamais pour du texte courant ; sur le thème Vietnam, le bouton passe en Ardoise.

## 5. Typographie — 3 rôles, 3 options testées
Rôles : **Principale** = logo + titres d'impact · **Primaire** = titres de sections, boutons, navigation · **Secondaire** = texte courant. (J'ai interprété ainsi ta demande « principale, primaire et secondaire » ; dis-moi si tu l'entendais autrement.)
Toutes les polices ci-dessous sont **libres (Google Fonts) et chargent le sous-ensemble vietnamien** (vérifié par requête à l'API Google Fonts).

| | Principale | Primaire | Secondaire | Ambiance | Plaquette |
|---|---|---|---|---|---|
| **A « Affiche »** | Anton | Fraunces (semi-gras + italique) | Be Vietnam Pro | Affiche, condensé, très énergique | `nwb_font_A_affiche_3.png` |
| **B « Rétro chaleureux »** ⭐ | Fraunces Black | Bricolage Grotesque | Inter | Chaleureux, humain, mémorable | `nwb_font_B_retro_2.png` |
| **C « Élégant »** | Playfair Display (+ italique) | Plus Jakarta Sans | Inter | Calme, haut de gamme | `nwb_font_C_elegant.png` |

**Recommandation : B.** Elle porte le plus l'idée « sobre et chaleureux », le serif épais est rare dans les agences web, et elle s'accorde avec Vanille/Ardoise/Sable. A est parfaite pour affiches et réseaux sociaux (peut servir de police « campagne »). C risque de faire « cabinet de luxe », décalé pour des PME.
Exclues (pas de vietnamien) : DM Serif Display, Instrument Serif, Bebas Neue, Archivo Black, Syne, DM Sans. Be Vietnam Pro a l'avantage d'être dessinée pour le vietnamien.
⚠️ Fraunces Black « soft » est une police variable : activer les axes `SOFT`/`WONK` pour le rendu des plaquettes ; à tester dans le navigateur avant de figer.

## 6. Logo — 5 propositions (plaquettes générées)
| # | Style | Référence Pinterest | Fichier |
|---|---|---|---|
| P1 | Condensé affiche, `NEURAWEB.` | Quinda | `nwb_logo_P1_condense.png` |
| P2 | Gras géométrique `neuraweb.` (le point = nœud allumé) | Salt. / sonna. | `nwb_logo_P2_gras_point.png` |
| P3 | Serif rétro chaleureux `neuraweb` (w décoré) | Amore | `nwb_logo_P3_serif_retro.png` |
| P4 | Serif élégant `Neuraweb` (web en italique) | Sage / Signa | `nwb_logo_P4_serif_elegant.png` |
| P5 | Italique + symbole en nœuds | gather | `nwb_logo_P5_italique_symbole.png` |

**Recommandation : P3, avec le point Sable de P2** (`neuraweb.`) comme signature : le serif rétro est chaleureux et distinctif, le point est un *distinctive asset* qui se décline partout (favicon `n.`, puces, fin de titres). P2 est le plan B (plus « tech », plus lisible à très petite taille). P5 est le plus « IA » mais le moins sobre.
Le symbole en nœuds (ancien logo) reste utilisable comme **motif** (pattern), plus comme logo.
Les images sont raster : le logo retenu doit être **redessiné/vectorisé** (SVG) avec la vraie police avant mise en ligne.

## 7. Tokens (à intégrer dans `tailwind.config.ts` après validation)
```ts
colors: {
  vanille: '#F3EFE6', ardoise: '#2C3844', sable: '#F3AC5E',
  theme: {
    indigo:  { bg: '#27187D', fg: '#F7F7FF' },
    olive:   { bg: '#31372B', fg: '#FBF7EC' },
    chypre:  { bg: '#004743', fg: '#FAFAFA' },
    ours:    { bg: '#523D2C', fg: '#F3EFE6' },
    moka:    { bg: '#534739', fg: '#EBE9DD' },
    rouge:   { bg: '#DE3A43', fg: '#EFE6DD' }, // gros titres seulement
  },
}
```
Implémentation : variables CSS `--theme-bg` / `--theme-fg` posées par le layout de chaque page (ex. `data-theme="chypre"`), le bouton CTA ne lit jamais ces variables.
Les anciennes couleurs (navy, sky, cyan, coral, lime, frost, surface) seront retirées après migration ; les mentions dans `docs/neuraweb-brand-identity.md` sont obsolètes.

## 8. Limites
- Les plaquettes et le board de stratégie sont générés par IA : le texte y est parfois déformé (le board `nwb_color_strategy_board.png` contient des fautes dans les mini-maquettes). **La référence officielle est ce document**, pas les images.
- Aucune palette n'a été testée sur de vrais écrans ni auprès de clients.
