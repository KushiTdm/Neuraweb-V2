# Prompts de création — sites manquants au portfolio

Briefs prêts à copier-coller pour faire produire les démos qui manquent.

**Mode d'emploi : collez toujours le BLOC COMMUN d'abord, puis le prompt du site voulu
dans le même message.** Le bloc commun porte la stack, les règles de qualité et les correctifs
des défauts constatés sur les démos existantes ; sans lui, les prompts produiront des sites
incohérents avec le reste du portfolio.

Ordre de priorité recommandé : **1. Automatisation & IA** (le différenciateur n°1, sans aucune
preuve visuelle aujourd'hui) → **2. Restaurant** → **3. Artisan/BTP** → **4. Immobilier** →
**5. Dashboard SaaS**.

---

## BLOC COMMUN — à coller avant chaque prompt

```
Tu es un développeur front-end senior et directeur artistique. Tu produis une démo de site
vitrine destinée au portfolio de NeuraWeb, agence web et IA basée à Lille (neuraweb.fr).
Le site doit pouvoir être montré à un prospect du secteur concerné comme preuve de savoir-faire.

STACK IMPOSÉE (identique aux autres démos du portfolio, ne pas en dévier)
- Vite + React 19 + TypeScript
- Tailwind CSS pour tout le style — pas de CSS-in-JS, pas de librairie de composants lourde
- react-router-dom pour la navigation multi-pages
- lucide-react pour les icônes
- Animations : CSS/Tailwind + IntersectionObserver pour les apparitions au scroll.
  Pas de librairie d'animation lourde.
- Build statique déployable sur Netlify (`npm run build` → dossier `dist/`)
- Aucun back-end, aucune clé d'API, aucun appel réseau externe payant. Toute donnée est
  mockée dans des fichiers TypeScript typés sous `src/data/`.

RÈGLES DE QUALITÉ — non négociables
1. `<html lang="fr">` et contenu en français cohérent. Si le site est multilingue, l'attribut
   lang doit suivre la langue réellement affichée.
2. `<title>` commercial de 50-60 caractères et `<meta name="description">` de 130-150
   caractères, rédigés pour le référencement — pas de titre technique type
   "Mon Site Interactive Website".
3. Open Graph complet : og:title, og:description, og:image, og:type, og:locale.
4. Zéro lien mort. Tout élément cliquable aboutit à une page réelle du site ou à une ancre
   valide. Pas de `href="#"` en cul-de-sac.
5. Responsive vérifié à 375px, 768px, 1024px et 1440px. Aucun débordement horizontal de la
   page à aucune largeur : `document.documentElement.scrollWidth` ne doit jamais dépasser
   `clientWidth`.
6. Accessibilité : contrastes AA, navigation clavier complète, `:focus-visible` visible sur
   tous les interactifs, alt sur toutes les images, un seul `<h1>` par page, hiérarchie de
   titres continue, labels associés à tous les champs de formulaire.
7. Images : format WebP, `loading="lazy"` hors du premier écran, `width`/`height` explicites
   pour éviter tout décalage de mise en page.
8. Performance : viser un Lighthouse mobile ≥ 90. Pas de police auto-hébergée non sous-ensemblée,
   pas d'image au-delà de 1920px de large.
9. Formulaires : validation côté client avec messages d'erreur explicites, état de succès
   simulé, mention RGPD sous le bouton d'envoi. Aucune donnée n'est réellement transmise.
10. Relis le contenu rédactionnel : pas de faute, et surtout **accords en genre cohérents**
    avec le prénom de chaque personne citée (erreur constatée sur une démo existante :
    un praticien masculin décrit avec « Convaincue » et « Diplômée »). Vérifie aussi les
    adresses e-mail inventées (pas de doublement de lettre accidentel).
11. Crédit en pied de page : « Site réalisé par NeuraWeb » avec lien vers
    `https://neuraweb.fr` — jamais `neuraweb.tech`, l'ancien domaine.
12. Données mockées réalistes et cohérentes entre elles : noms, tarifs, horaires, adresses
    plausibles pour le secteur et la zone géographique. Pas de « Lorem ipsum », pas de
    « Client 1 / Client 2 ».

LIVRABLE
- Projet complet et lançable : `npm install && npm run dev`
- `README.md` listant les pages, les fonctionnalités et la commande de build
- Structure claire : `src/pages/`, `src/components/`, `src/data/`, `src/hooks/`
```

---

## Prompt 1 — Automatisation & IA appliquée ⭐ priorité

> C'est le manque le plus coûteux : NeuraWeb vend de l'automatisation n8n, de l'intégration IA
> et un pack Premium à 7 990 €, et la page d'accueil affiche « 12 API connectées / 47 workflows
> actifs / −4h par semaine » — sans aucune preuve visuelle derrière.

```
Crée « FluxOps » — la vitrine d'une offre d'automatisation et d'intégration IA pour PME.
Le site doit rendre TANGIBLE un travail habituellement invisible : des workflows qui tournent,
des heures économisées, des systèmes qui se parlent.

PAGES
1. Accueil
   - Hero : promesse chiffrée + visualisation animée d'un workflow (nœuds reliés, paquets de
     données qui circulent le long des connexions, en SVG animé)
   - Bandeau de logos des outils connectés : Gmail, Slack, Notion, HubSpot, Stripe, Google
     Sheets, WhatsApp Business, Shopify
   - 3 cas d'usage détaillés en cartes : relance de devis, tri et routage des e-mails entrants,
     reporting hebdomadaire automatique
   - Compteurs animés au scroll : workflows actifs, exécutions ce mois, heures économisées
   - Témoignages de dirigeants de PME avec le gain concret obtenu
2. Catalogue de workflows
   - Grille filtrable par métier (commerce, RH, comptabilité, support, marketing) et par
     outil connecté
   - Chaque carte : nom, déclencheur, actions enchaînées, temps économisé estimé, badge de
     difficulté d'intégration
   - Clic → page de détail du workflow
3. Détail d'un workflow
   - Schéma pas-à-pas du flux : déclencheur → conditions → actions → résultat
   - Onglets « Avant / Après » comparant le processus manuel et le processus automatisé,
     avec le temps passé dans chaque cas
   - Prérequis techniques et durée de mise en place
4. Simulateur de ROI (la pièce maîtresse, interactive)
   - Champs : nombre de tâches répétitives par semaine, durée moyenne d'une tâche, coût horaire
     chargé, nombre de personnes concernées
   - Sortie recalculée en direct : heures récupérées par mois, économie annuelle en euros,
     délai de rentabilisation
   - Graphique en barres comparant coût manuel et coût automatisé sur 12 mois, en SVG,
     sans librairie de graphiques
5. Assistant IA (démo)
   - Widget de conversation avec réponses scriptées et latence simulée, répondant à des
     questions sur les workflows du catalogue
   - Affiche explicitement « réponses simulées — démonstration » pour rester honnête
6. Tarifs — 3 paliers (audit, mise en place, forfait mensuel de supervision)
7. Contact — formulaire avec sélection du besoin

EXIGENCES TECHNIQUES SPÉCIFIQUES
- Le graphe de workflow animé est le morceau de bravoure : SVG, chemins animés via
  `stroke-dasharray`/`stroke-dashoffset`, nœuds au survol affichant une infobulle détaillée.
  Il doit respecter `prefers-reduced-motion` et se figer proprement si l'utilisateur l'a activé.
- Le simulateur de ROI recalcule à chaque frappe, sans bouton « calculer », et son état est
  conservé dans l'URL (query params) pour qu'un résultat soit partageable.
- Le catalogue filtre sans rechargement, et l'état des filtres vit aussi dans l'URL.

DIRECTION ARTISTIQUE
Technique et net, pas ludique. Fond sombre (bleu nuit très désaturé), accents électriques
indigo et cyan, typographie sans-serif géométrique, monospace pour les valeurs chiffrées et
les noms de nœuds. Beaucoup de blanc tournant, grille stricte. L'inspiration est un outil
professionnel type Linear ou Retool, pas une page marketing colorée.
```

---

## Prompt 2 — Restaurant

> NeuraWeb a une landing `/restaurants`, un argumentaire commercial dédié
> (`formules-argumentaire-restaurants.md`) et des visuels déjà prêts
> (`public/assets/restaurant/bistrot.webp`) — mais aucune réalisation cliente à montrer.

```
Crée « Le Comptoir des Halles » — site d'un bistrot de quartier contemporain à Lille,
15 tables, cuisine de marché, carte qui change chaque semaine.

PAGES
1. Accueil — hero photo pleine hauteur, plat du jour mis en avant, horaires avec état
   « ouvert / fermé » calculé en direct depuis l'heure courante, accès rapide à la réservation
2. La carte
   - Onglets : Midi, Soir, Vins, Desserts
   - Chaque plat : nom, description, prix, badges allergènes (gluten, lactose, fruits à coque),
     marqueurs végétarien / vegan / fait maison
   - Filtre par régime alimentaire, actif sur tous les onglets
   - Mention « carte du 12 au 18 mai » pour matérialiser la rotation hebdomadaire
3. Réservation — la pièce maîtresse
   - Parcours en 3 étapes : date et nombre de couverts → créneau disponible → coordonnées
   - Calendrier maison, sans librairie : jours complets grisés, lundi fermé, créneaux par
     tranches de 15 min dans les services 12h-14h et 19h-22h
   - Disponibilité simulée de façon crédible (le vendredi et le samedi soir se remplissent en
     premier), récapitulatif avant confirmation, écran de confirmation avec numéro de réservation
4. Menus de groupe — formules pour 10 personnes et plus, devis simulé selon le nombre de convives
5. Le lieu — galerie photo avec visionneuse plein écran (navigation clavier, fermeture par Échap)
6. Accès & contact — carte statique, transports, parking, formulaire de contact

FONCTIONNALITÉS TRANSVERSES
- État d'ouverture recalculé en direct dans l'en-tête, avec la prochaine ouverture si fermé
- Bandeau « Menu de Noël — réservations ouvertes » masquable, mémorisé en localStorage
- Données structurées JSON-LD `Restaurant` complètes : horaires, gamme de prix, type de cuisine,
  adresse, coordonnées géographiques

DIRECTION ARTISTIQUE
Chaleureux et soigné, sans cliché de bistrot parisien. Palette terre cuite, crème, vert olive
sombre. Une serif de caractère pour les titres, une sans-serif très lisible pour le corps.
Photographie généreuse, cadrages serrés sur les assiettes. Grain léger et textures papier
autorisés. Évite le rouge-blanc-nappe à carreaux.
```

---

## Prompt 3 — Artisan / BTP local

> Le cœur de cible d'une agence lilloise, et la démo qui ancre concrètement le pack Starter
> à 1 490 €. Aucun artisan au portfolio aujourd'hui.

```
Crée « Deschamps Rénovation » — site d'une entreprise familiale de rénovation intérieure dans
la métropole lilloise : plâtrerie, peinture, sols, salles de bain. 12 salariés, fondée en 1998.

PAGES
1. Accueil
   - Hero avec le triptyque de réassurance : devis gratuit, garantie décennale, intervention
     sous 48h
   - Les 4 métiers en cartes cliquables
   - Comparateurs avant/après avec curseur glissant sur 3 chantiers (le composant signature)
   - Zone d'intervention affichée sous forme de liste de communes, pas d'iframe de carte
   - Avis clients avec note moyenne et nombre d'avis
2. Nos prestations — une page par métier, avec le détail des prestations, les matériaux
   utilisés, les délais moyens et une fourchette de prix au m²
3. Réalisations
   - Galerie filtrable par type de chantier et par budget
   - Chaque chantier : lieu, durée, budget, prestations réalisées, série de photos
     avant/pendant/après
4. Demande de devis — la pièce maîtresse
   - Formulaire progressif multi-étapes : type de projet → surface → prestations souhaitées
     (cases à cocher) → délai envisagé → photos du chantier → coordonnées
   - Barre de progression, retour arrière possible sans perte de saisie
   - Estimation de fourchette budgétaire affichée en direct à partir des réponses
   - Zone de dépôt de photos avec aperçu des fichiers (traitement uniquement local)
5. L'entreprise — histoire, équipe avec photos et rôles, certifications (RGE, Qualibat,
   garantie décennale) sous forme de badges
6. Contact — téléphone cliquable, formulaire, horaires d'atelier

FONCTIONNALITÉS TRANSVERSES
- Bouton d'appel flottant, visible uniquement sous 768px
- Données structurées JSON-LD `LocalBusiness` avec `areaServed` couvrant les communes desservies
- Le comparateur avant/après doit fonctionner à la souris ET au toucher, et être pilotable
  au clavier avec les flèches gauche/droite

DIRECTION ARTISTIQUE
Solide, franc, rassurant. Bleu de travail profond, orange sécurité en accent, gris béton.
Sans-serif robuste, angles droits, ombres marquées. Photographie de chantier réelle, pas
d'image d'illustration générique. Le site doit inspirer le sérieux d'un artisan qui tient
ses délais — pas une start-up.
```

---

## Prompt 4 — Immobilier

> Vertical à forte valeur : cycle de vente long, panier élevé, et une agence immobilière
> attend précisément le type de fonctionnalités (recherche multicritère, estimation) qui
> justifie un pack Business ou Premium.

```
Crée « Ravel & Associés » — agence immobilière indépendante à Lille, spécialisée dans l'ancien
de caractère et les appartements de standing.

PAGES
1. Accueil — hero avec barre de recherche (type de bien, commune, budget), biens en vedette,
   chiffres clés de l'agence, présentation de l'équipe
2. Recherche de biens — la pièce maîtresse
   - Filtres : type, commune, budget avec curseur double, surface, nombre de pièces, extérieur,
     stationnement, DPE
   - Tri : prix croissant/décroissant, surface, date d'ajout
   - Bascule vue liste / vue grille
   - Tous les filtres et le tri sérialisés dans l'URL, pour qu'une recherche soit partageable
   - Comparateur : sélection de 3 biens maximum, tableau comparatif côte à côte
   - Système de favoris persisté en localStorage, avec compteur dans l'en-tête
3. Fiche d'un bien
   - Galerie photo avec visionneuse plein écran et miniatures
   - Caractéristiques détaillées, étiquette DPE et GES dessinées en SVG aux couleurs
     réglementaires (A vert à G rouge)
   - Simulateur de mensualité intégré : montant emprunté, apport, durée, taux → mensualité et
     coût total du crédit, recalculés en direct
   - Plan de l'appartement, quartier et commodités à proximité
   - Formulaire de demande de visite avec choix de créneaux
4. Estimation de bien — parcours guidé en 5 étapes (type, adresse, surface, état, prestations)
   aboutissant à une fourchette d'estimation et à une prise de contact
5. Vendre / Acheter — deux pages de méthodologie expliquant l'accompagnement étape par étape
6. L'agence — équipe, honoraires (obligation légale d'affichage), mentions légales complètes

EXIGENCES TECHNIQUES SPÉCIFIQUES
- 24 biens mockés minimum, cohérents : le prix au m² doit être plausible pour la commune citée
  (Vieux-Lille plus cher que Fives), et la surface cohérente avec le nombre de pièces
- Le simulateur de crédit utilise la vraie formule d'amortissement :
  `M = C × (t/12) / (1 − (1 + t/12)^(−n))`
- Les étiquettes DPE respectent les seuils et les couleurs réglementaires françaises

DIRECTION ARTISTIQUE
Élégant et sobre, registre haut de gamme sans ostentation. Blanc cassé, noir profond, un unique
accent laiton. Serif fine pour les titres, sans-serif neutre pour le corps. Beaucoup d'air,
photographie immobilière soignée en grand format. L'inspiration est un catalogue de galerie,
pas un portail d'annonces.
```

---

## Prompt 5 — Dashboard SaaS métier

> Justifie le pack Premium à 7 990 € : c'est la démo qui montre que NeuraWeb ne fait pas
> que des vitrines, mais aussi des applications métier.

```
Crée « Cadence » — application de gestion pour salles de sport et studios indépendants.
Interface d'administration complète, en démonstration, sans back-end.

ÉCRANS
1. Connexion — écran de démo avec accès pré-rempli et bouton « entrer en mode démonstration »
2. Tableau de bord — indicateurs du mois (adhérents actifs, taux de remplissage des cours,
   revenu récurrent mensuel, taux de résiliation), courbe d'évolution sur 12 mois,
   prochains cours du jour, alertes (paiements en échec, abonnements expirant sous 7 jours)
3. Planning — vue calendrier hebdomadaire
   - Grille horaire avec les cours positionnés, code couleur par discipline
   - Glisser-déposer pour déplacer un cours d'un créneau à l'autre
   - Clic sur un cours → panneau latéral : coach, capacité, liste des inscrits, liste d'attente
   - Création d'un cours récurrent via un formulaire dédié
4. Adhérents — tableau avec recherche, tri sur chaque colonne, filtres par statut d'abonnement
   et pagination ; fiche individuelle avec historique de présence, abonnement en cours,
   paiements et notes
5. Abonnements — formules proposées, répartition des adhérents par formule, gestion des
   suspensions et résiliations
6. Coachs — planning individuel, heures effectuées dans le mois, disciplines enseignées
7. Statistiques — fréquentation par créneau horaire sous forme de carte de chaleur,
   cours les plus et les moins remplis, évolution des effectifs, cohortes de rétention
8. Réglages — informations de la salle, horaires d'ouverture, disciplines, utilisateurs et rôles

EXIGENCES TECHNIQUES SPÉCIFIQUES
- Tous les graphiques dessinés en SVG à la main, sans librairie de charting :
  courbes, barres, carte de chaleur
- Le glisser-déposer du planning est implémenté avec les événements pointer natifs,
  sans librairie, et reste utilisable au clavier
- État global géré avec Zustand, persisté en localStorage, avec un bouton
  « réinitialiser la démo » qui régénère un jeu de données frais
- Barre latérale rétractable, thème clair et sombre commutable et mémorisé
- Jeu de données mocké crédible : environ 180 adhérents, 25 cours hebdomadaires, 6 coachs,
  12 mois d'historique cohérent (saisonnalité visible : creux en été, pic en janvier)
- Malgré la densité, tout reste utilisable à 375px : les tableaux deviennent des cartes
  empilées, la barre latérale passe en tiroir

DIRECTION ARTISTIQUE
Interface applicative dense mais respirable. Neutres froids, un accent vert énergie, densité
d'information assumée. Sans-serif compacte, chiffres tabulaires pour l'alignement des colonnes.
L'inspiration est Linear ou Vercel : rapide, précis, sans décoration superflue.
```

---

## Après production de chaque démo

1. Déployer sur Netlify, vérifier que l'URL répond bien en 200.
2. Capturer la page d'accueil en 1440×900 avec un facteur d'échelle 2 (soit 2880×1800),
   convertir en WebP à qualité 78 : `cwebp -q 78 -m 6 source.png -o cible.webp`.
   Viser 100–200 Ko. Placer le fichier dans `public/assets/portfolio/`.
   Sur un site à animations d'apparition au scroll, faire défiler la page avant de capturer,
   sinon le hero sort vide.
3. Ajouter l'entrée dans le tableau `portfolio` de
   [components/sections/portfolio-section.tsx](../components/sections/portfolio-section.tsx).
4. Ajouter les clés `portfolio.<projet>.sector` et `.desc` dans **les 4 locales**
   (`fr`, `en`, `es`, `vi`) — `en`/`es`/`vi` sont typées `Record<TranslationKey, string>`,
   une clé manquante casse `npm run typecheck`.
5. Lancer `npm run typecheck` puis vérifier le rendu à 375, 768 et 1440px.
6. Mettre à jour [portfolio_projets.md](./portfolio_projets.md).
