# NeuraWeb — Identité bicolore (Chypre + Crème), 17 octobre 2026

> Direction demandée : **uniquement deux tons**, ceux de la référence « Creative » : vert Chypre `#004643` et crème `#F0EDE5`.
> **Remplace** la stratégie « une couleur par page » de [BRAND_COLOR_TYPE_STRATEGY.md](BRAND_COLOR_TYPE_STRATEGY.md) (qui reste valable si tu reviens à une palette multi-teintes).
> Images : [generated/bicolore/](../../generated/bicolore/).

## 1. Palette
| Ton | Nom | HEX | Rôle |
|---|---|---|---|
| 1 | **Chypre** | `#004643` | Encre, fonds sombres, boutons, logo |
| 2 | **Crème** | `#F0EDE5` | Fond principal, texte sur vert |

**Contraste Chypre/Crème : 9,17:1** (AA et AAA pour le texte courant, dans les deux sens).
**Teintes autorisées** (mélanges des deux tons, pas de nouvelle couleur) :
| Teinte | HEX | Usage | Contraste |
|---|---|---|---|
| 20 % | `#C0CCC5` | Fonds de cartes, bandes douces | Chypre dessus : 6,5 ✓ |
| 40 % | `#90AAA4` | Bordures, lignes, décor | Chypre dessus : 4,3 (gros texte seulement) |
| 60 % | `#608984` | **Décor uniquement** (motifs, illustrations) | jamais de texte |

Règles : le texte est toujours Chypre 100 % sur Crème/teinte 20 %, ou Crème 100 % sur Chypre. Pas de gris, pas de noir pur, pas de dégradé.

## 2. Boutons et états sans troisième couleur
- Bouton principal : **plein** (Chypre + texte Crème sur fond crème ; Crème + texte Chypre sur fond vert).
- Bouton secondaire : contour 2 px.
- Focus clavier : anneau 3 px de la couleur inverse + 2 px d'écart. Succès/erreur : icône + texte (✓ / !), pas de couleur.
- Seule limite assumée : sans rouge/orange, une erreur de formulaire repose sur l'icône et le libellé ; c'est conforme WCAG (1.4.1) mais moins immédiat.

## 3. « Chaque page, sa personnalité » avec deux tons
Sans couleur de thème, la progression « sobre → plus riche » passe par la **proportion** et le **motif** :
| Niveau | Pages | Ratio Crème / Chypre | Motif signature |
|---|---|---|---|
| N0 | Accueil, Tarifs, Contact, Blog | ~85 / 15 | Typo seule, un seul bandeau vert (« Nos services ») |
| N1 | Services (hub) | ~70 / 30 | Cartes en contour + icônes |
| N2 | Pages service | ~50 / 50 | Hero vert plein + illustration au trait |
| N3 | Verticales & marchés (santé, restos, hôtels, collectivités, Vietnam) | ~30 / 70 | Hero et bandes vertes, motif propre à chaque secteur (icônes, trame) |
Chaque service a **son motif** (navigateur, nœuds, bulle, graphique, horloge…), pas sa teinte.

## 4. Typographie (3 rôles, vietnamien vérifié)
| Rôle | Police | Pourquoi |
|---|---|---|
| **Principale** — logo, H1 | **Inter Tight** ExtraBold/Black, interlettrage ≈ −0,05 em | Rendu « Creative » lourd et serré ; charge le vietnamien |
| **Primaire** — accents, étiquettes | **Lora Italic** | Les mots en italique serif (« sans frontières »), comme la référence ; charge le vietnamien |
| **Secondaire** — texte courant, UI | **Inter** 400/500 | Lisibilité, performance |
⚠️ La référence indique **Poppins**, mais Poppins **ne charge pas le vietnamien** (vérifié sur l'API Google Fonts) : ne pas l'utiliser. Alternatives lourdes compatibles : Be Vietnam Pro 800, Plus Jakarta Sans 800, Bricolage Grotesque 800.

## 5. Logo (3 propositions)
| | Proposition | Fichier | Avis |
|---|---|---|---|
| A | Mot-marque lourd `neuraweb.` (le point = nœud allumé) | `nwb2_logo_A_wordmark_point.png` | Très reconnaissable, fidèle à la référence. ⚠️ une tuile affiche « neurweb. » (faute de génération) |
| B | **Symbole « N » en nœuds + mot-marque** | `nwb2_logo_B_symbole.png` | Le « N » se lit nettement, bon avatar/favicon, garde l'idée « réseau » de l'ancien logo |
| C | Monogramme `nw` + système (avatar, highlights, stickers, carte) | `nwb2_logo_C_monogramme_systeme.png` | Bon pour les réseaux ; le `nw` est moins lisible que le « N » |

**Recommandation : B pour le symbole (avatar, favicon, app) + le mot-marque `neuraweb.` de A pour le site** (point final = signature). C sert de base aux highlights/stickers.
⚠️ Les images contiennent des éléments **copiés de la référence** (`@muzudesigns`, `info@muzudesigns.com`, petit logo orange) : **ne pas réutiliser ces fichiers tels quels**. Redessiner en SVG avec la vraie police.

## 6. Tokens
```ts
colors: { chypre: '#004643', creme: '#F0EDE5',
  'chypre-20': '#C0CCC5', 'chypre-40': '#90AAA4', 'chypre-60': '#608984' }
fontFamily: { display: ['Inter Tight'], accent: ['Lora'], sans: ['Inter'] }
```

## 7. Limites
- Le bicolore est très cohérent mais **moins différenciant** que « 3 teintes + un accent » : sans accent chaud, l'urgence d'un CTA repose sur la taille, le contraste et la position.
- Le vert profond évoque aussi la santé/le bio/la finance : le test de non-confusion repose ici sur la **typo lourde et le point**, pas sur la couleur.
- Rien n'est testé sur de vrais écrans ni auprès de clients.
