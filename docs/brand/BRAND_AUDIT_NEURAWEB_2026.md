# NeuraWeb — Brand audit & plateforme de marque (17 octobre 2026)

> Version remplie de [BRAND_CHECKLIST_TEMPLATE.md](BRAND_CHECKLIST_TEMPLATE.md). Remplace l'ancien [neuraweb-brand-identity.md](../neuraweb-brand-identity.md) (indigo/violet/Syne, qui ne correspond plus au code).
>
> **Fiabilité des sources** : « vérifié » = lu dans le code du repo ou sur la page d'accueil du concurrent (WebFetch). « Estimé » = fourni par des IA (Gemini, ChatGPT, Perplexity, DeepSeek) sans source officielle : à traiter comme hypothèse. Les couleurs/polices des concurrents n'ont **pas** pu être vérifiées dans le CSS (navigation navigateur bloquée sur ces domaines) : ce sont des estimations visuelles.
> Les points marqués **❓** demandent ta confirmation : je ne les invente pas.

---

## 1. Brand audit — état des lieux

### 1.1 Ce qui existe (vérifié dans le code)

| Élément | État réel | Problème |
|---|---|---|
| Logo utilisé sur le site | Ancien logo **cerveau + « NEURAWEB » noir** (`neurawebB`/`neurawebW`) dans header, footer, pages | Générique (cerveau = IA cliché), 2 logos coexistent |
| Nouveau logo | `public/assets/logo/neuraweb-agence_tech.png` : marque en réseau de nœuds bleu ciel + « NeuraWeb » navy + « tech agency » | **Non utilisé sur le site**, fond blanc, pas de vectoriel, baseline en anglais |
| Logo dans les données structurées | `neurawebW.webp` (version **blanche**) | Invisible sur fond clair dans les résultats Google/IA → à corriger |
| Palette (code) | Navy `#0E1B3D`, sky `#5DB8F0`, cyan `#22D3EE`, coral `#FF7A59`, lime `#C5F277`, frost/surface (bleutés) | Fidèle à l'esprit mais 5 accents = pas de signature claire |
| Doc d'identité | Dit indigo `#6366f1`/violet, Syne, Geist, fond `#050510` | **Obsolète** : code = Inter / Inter Tight / JetBrains Mono |
| Typographie | Inter + Inter Tight + JetBrains Mono | Inter = police par défaut de milliers de sites → faible distinctivité |
| Positionnement hero | « Agence web à Lille — sites, apps, automatisations pour les PME » | Contredit la réalité (équipe nomade au Vietnam) et le territoire Lille/Paris est saturé |
| Langues | FR, EN, ES, **VI** (4 locales) | Atout rare, sous-exploité en message |
| Prix | Packs affichés 1 490 / 3 990 / 7 990 €, add-ons à 75 €/h, paiement 40/30/30 | **Le meilleur différenciateur** (voir §2) |
| Preuves | 30 articles de blog, démo « Connected Suite », schémas FAQ, chatbot | Portfolio = surtout sites démo/concepts : ❓ lesquels sont de vrais clients ? |
| Réseaux (schema) | LinkedIn, GitHub, X, Facebook, Google Business | Incohérence de handle (`neuraweb` / `neurawebtech`), avatars à unifier |

### 1.2 Diagnostic (note /5, appréciation)

| Dimension | Note | Pourquoi |
|---|---|---|
| Clarté du positionnement | 2 | « Agence web à Lille » + 5 services = pas de promesse mémorable |
| Différenciation prouvée | 3 | Prix publics + équipe directe, mais non portés en tête |
| Cohérence visuelle | 2 | 2 logos, doc d'identité périmé, 5 accents |
| Cohérence éditoriale | 3 | Bon fond (FR→EN/ES/VI), ton parfois « startup » |
| Distinctivité (reconnu sans logo) | 1 | Navy + bleu + Inter = look « SaaS » interchangeable |
| Preuves & confiance | 2 | Peu d'avis publics visibles, démos présentées comme réalisations |
| Accessibilité couleurs | 3 | Bon contraste navy ; **texte blanc sur corail = 2,57:1 (échoue AA)** |
| Visibilité IA / SEO de marque | 3 | llms.txt, FAQ, blog OK ; logo schema invisible, entité peu connue |

**Conclusion** : la base technique est solide, la marque ne l'est pas encore. Rien de grave, mais personne ne peut aujourd'hui dire en 5 secondes « NeuraWeb = ça ».

---

## 2. Analyse concurrentielle de marque (top 5)

Sélection : 2 références internationales (design et technique), 1 généraliste conversion citée par les IA, 1 France PME/SEO-GEO, 1 francophone basé au Vietnam.

| | Clay | Blazity | Digital Silk | Gemeos | Knok Studios |
|---|---|---|---|---|---|
| Marché | Mondial (SF, NY, Lisbonne) | Mondial, B2B tech (Varsovie) | USA, grandes marques | France | **France + Vietnam + international** |
| Promesse (vérifié) | « Global branding and UX design agency » | « Experts in enterprise AI agents & workflows » | « Web design agency for B2B, B2C & enterprise » | « Agence web pour marques ambitieuses » | « Solutions digitales, résultats réels. Le digital sans frontière. » |
| Cible | Grandes marques/fintech | Scale-ups & enterprise (Vercel) | ETI/grands comptes | SaaS & marques ambitieuses | PME, expats, hôtellerie |
| **Prix affichés** | Non | Non | Non | Non (devis) | Non |
| Preuve sociale | Logos Google/Meta/Stripe | Case studies chiffrées, badge Vercel | Forbes, DesignRush, 26 cas | **4,9/5 sur 97 avis**, 250+ entreprises | Trustpilot 33 avis, 200+ clients (depuis 2018) |
| Ton | Ambitieux, « transformative » | Direct, ingénieur | Assuré, orienté résultats | Décontracté, « sans bullshit » | Chaleureux, direct |
| Visuel (estimé) | Éditorial, noir/blanc, grands visuels | Dark-first, violet/bleu, glow | Corporate clair, bleu + orange | Éditorial, serif, illustrations dessinées | Sombre, accent vif (non confirmé) |

**Ce que montre le tableau** (vérifié sur les 5 homepages) :
1. **Aucun des 5 n'affiche un prix.** NeuraWeb affiche des packs et un taux horaire : c'est le territoire n°1 à posséder.
2. Tous parlent à de grandes entreprises ou à des « marques ambitieuses » → **les PME locales, hôtels, restaurants, cabinets sont mal servis en discours**.
3. Le visuel du secteur est soit **sombre/violet/néon (IA)**, soit **corporate bleu** : un territoire **chaleureux, papier, humain** est libre.
4. **Knok Studios** est le seul concurrent direct sur l'axe « francophone au Vietnam ». Il est plus ancien (2018), plus de preuve sociale, mais : pas de prix, pas d'angle IA/automatisation visible, ton plus « agence classique ».
5. Gemeos prouve que la **confiance par les avis chiffrés + ton direct** fonctionne en France ; Eskimoz (hors top 5) occupe SEO/GEO à grande échelle, inutile de l'affronter frontalement.

---

## 3. Problème client & résolution

### 3.1 Le problème (du point de vue du client)

> « J'ai besoin d'un site ou d'une automatisation pour mon activité, mais je ne sais pas à qui faire confiance, ni combien ça devrait vraiment coûter, et je ne comprends pas ce qu'on me raconte. »

**Pains** (consensus des 4 IA + cohérents avec ton playbook) :
- **Peur du freelance qui disparaît** / de l'agence qui sous-traite et devient injoignable
- **Prix opaques** : devis incompréhensibles, extras surprises
- **Jargon** (headless, RAG, LLM) qui crée de l'infériorité
- **Site lent / invisible** : payé cher, aucun client en plus
- **Dépendance** : accès, code, hébergement entre les mains du prestataire ❓ *(à confirmer : tes clients sont-ils propriétaires de tout ?)*
- **ROI flou**, surtout sur l'IA
- **Expat/PME vietnamienne** : peur de la barrière de langue, des standards de qualité, du décalage horaire

**Ce qu'ils cherchent vraiment** : de la **tranquillité** (« quelqu'un de sérieux s'en occupe »), du **contrôle** (savoir combien et quand), des **résultats visibles** (appels, réservations, avis), et un interlocuteur **humain**.

### 3.2 La résolution NeuraWeb

| Pain | Réponse | Preuve disponible |
|---|---|---|
| Prix opaques | Packs et add-ons publics, paiement 40/30/30 | `/services`, `pack2026.md` |
| Freelance qui disparaît | Équipe joignable, réponse sous 24 h, rendez-vous réservable, suivi | ❓ avis clients à collecter |
| Jargon | « Le web sans jargon » : explications en langage client, FAQ visibles | blog, FAQ |
| Site invisible | SEO de base inclus, SEO local/GEO en options chiffrées | articles, llms.txt |
| ROI flou IA | Audit gratuit, ROI mesuré à 30 jours (automatisation) | pack automatisation |
| Frontières/langues | 4 langues, prix en EUR/VND, équipe FR↔VN, travail pendant la nuit européenne | site 4 locales |

---

## 4. Project success : pourquoi te choisir toi plutôt qu'un concurrent ?

**Le « plus » NeuraWeb (une phrase)** :
> **« Le seul studio web & IA francophone qui affiche ses prix, que tu joins directement, et qui travaille d'un fuseau à l'autre. »**

Hiérarchie des arguments (à montrer dans cet ordre) :
1. **Transparence** — prix affichés, aucun des 5 concurrents ne le fait.
2. **Proximité** — tu parles à ceux qui font le travail (déjà dans ton hero), pas à un commercial.
3. **Pont France ↔ Asie du Sud-Est** — qualité de design et cadre contractuel français, coûts et réactivité d'une équipe à Hanoï ; livraison « au réveil ».
4. **Tout-en-un utile** — site Next.js + automatisation n8n + agents IA + SEO/GEO : un seul interlocuteur.
5. **Preuves vivantes** — le site lui-même (vitesse, SEO, 4 langues), la démo Connected Suite, le blog.

**À ne pas promettre** (risque de confiance) : des « résultats garantis » sans cas client chiffré ; présenter une démo comme un client réel ; « agence de 20 personnes » si ce n'est pas le cas.

**Objectif de reconnaissance « en un clin d'œil »** : 4 *distinctive brand assets* (méthode Ehrenberg-Bass : cohérence > originalité) :
1. **Le Nœud allumé** — symbole : un réseau de points dont un nœud est corail (« votre projet est allumé »).
2. **Corail + Encre + Papier** — triptyque de couleurs inhabituel pour le secteur.
3. **Le mot en italique** — dans chaque titre, un mot en serif italique corail/encre (« ouverte sur le monde »).
4. **La double horloge Paris · Hà Nội** — élément UI/visuel unique (chip, badge, motif d'horloges).

---

## 5. Plateforme de marque

**Mission** — Donner aux petites entreprises les outils numériques des grandes : sites, apps et automatisations, avec des prix clairs et des gens joignables.

**Vision** — Devenir l'agence web & IA francophone de référence entre l'Europe et l'Asie du Sud-Est.

**Valeurs** (avec comportements)
| Valeur | Se voit quand… |
|---|---|
| **Clarté** | le prix est écrit, les mots sont simples, le devis tient sur une page |
| **Soin** | chaque page est testée (vitesse, mobile, accessibilité) avant livraison |
| **Proximité** | le client a le contact direct, réponse sous 24 h |
| **Continuité** | on suit après la mise en ligne (maintenance, mesures) |
| **Curiosité utile** | l'IA est utilisée pour faire gagner du temps réel, pas pour faire joli |

**Attributs** : chaleureux · direct · précis · curieux · calme. **Jamais** : arrogant, jargonneux, « disruptif », vendeur de rêve.
**Archétype** : *Le Guide* (principal) + *Le Compagnon* (secondaire) — l'expert qui explique, pas le génie qui impressionne.
**Core strengths** : (1) prix transparents ; (2) équipe réduite = interlocuteur direct ; (3) stack moderne performante (Next.js, Lighthouse 90+) ; (4) multilingue FR/EN/ES/VI ; (5) SEO + GEO + IA dans la même offre.

**Positioning statement**
> Pour les PME, hôtels, cabinets et entrepreneurs expatriés qui veulent un site ou une automatisation sans se faire embrouiller, NeuraWeb est le studio web & IA français, ouvert sur le monde, qui affiche ses prix et travaille avec toi en direct — contrairement aux agences opaques et aux freelances isolés.

**Tagline recommandée** : **« Le web sans jargon, sans frontières. »**
Alternatives testables : « Des sites qui travaillent pendant que tu dors. » · « Prix affichés. Équipe joignable. Résultats mesurés. » (excellente en sous-titre/preuve).
Baseline logo : retirer « tech agency » (anglais, générique) → « agence web & IA » ou aucune baseline.

**Ton de voix** : « tu » pour indépendants/expats/réseaux sociaux, « vous » dans devis/B2B/collectivités. Phrases courtes, un chiffre par argument, zéro anglicisme gratuit.
| Au lieu de… | Dire… |
|---|---|
| « Solutions digitales disruptives » | « Un site qui vous amène des clients » |
| « Nous leverageons l'IA » | « Un assistant qui répond à vos clients 24 h/24 » |
| « Sur devis » | « À partir de 1 490 €, voici ce qui est inclus » |

### Avatars (à valider avec tes vrais clients)
1. **Claire, 41 ans, gérante d'un hôtel de 12 chambres** (Annecy ou Hội An). Veut des réservations directes, hait payer des commissions. Peur : site cher qui ne vend rien. → *Pack Business + réservation + multilingue.*
2. **Marc, 38 ans, dirigeant de PME de services** (Lille/Lyon). Site vieux, 3 devis incompréhensibles. Veut des leads. → *Pack Starter/Business, SEO on-page, prix clairs.*
3. **Julien, 34 ans, entrepreneur français expatrié à Hanoï/Saïgon.** Veut un site FR/EN, quelqu'un qui parle français et connaît le fuseau. → *Pack Starter/Business, appel en horaires FR.*
4. **Thảo, 36 ans, gérante d'un spa/hôtel boutique à Đà Nẵng.** Veut un standard « européen », prix en VND, pages VI/EN/FR. → *Page `/vi`, packs convertis en VND.*
Anti-persona : clients « tout pour 300 € », projets sans décideur, appels d'offres à cahier des charges de 80 pages.

---

## 6. Système visuel recommandé

> ⚠️ **Palette, typographie et logo de cette section remplacés** par [BRAND_COLOR_TYPE_STRATEGY.md](BRAND_COLOR_TYPE_STRATEGY.md) (17 oct. 2026, d'après tes palettes). Le concept, les patterns et les règles d'illustration restent valables.

**Concept** : « **Le nœud allumé** » — un réseau calme (encre) dans lequel une connexion s'allume (corail) : la rencontre de deux mondes, la chaleur humaine dans la technique.
**Ambiance** : papier chaud, encre profonde, une seule couleur vive. Éditorial, pas néon. *Ce que ça n'est pas* : cyber, violet IA, glassmorphism, banque.

### 6.1 Palette (contrastes mesurés, WCAG)

| Rôle | Nom | HEX | Usage | Contraste clé |
|---|---|---|---|---|
| Primaire | **Encre** | `#0E1B3D` | Fonds sombres, titres, logo | 15,4:1 sur Papier |
| Fond clair | **Papier** | `#F7F4EE` | Fond principal des pages | — |
| **Signature** | **Corail** | `#FF7A59` | Boutons, nœud allumé, accents | **texte Encre dessus : 6,6:1** (jamais texte blanc : 2,6:1 ✗) |
| Corail texte | **Corail profond** | `#C73E22` | Liens/accent texte sur clair | 4,6:1 sur Papier ✓ |
| Secondaire | **Jade** | `#17745E` | Succès, « en ligne », ancrage Vietnam (feuille, jade) | 5,2:1 sur Papier ; texte blanc 5,7:1 ✓ |
| Signal | **Ciel** | `#5DB8F0` | Nœuds/liens sur fond Encre, héritage du logo | 7,7:1 sur Encre ; **jamais sur Papier** (2,0:1 ✗) |
| Surface | **Sable** | `#E9DFCF` | Cartes, bandes, alternance de sections | Encre dessus 12,8:1 |
| Neutre | **Brume** | `#5B6478` | Texte secondaire | 5,4:1 sur Papier ✓ |
| Ligne | **Galet** | `#DDD6C8` | Bordures | — |
| Sémantique | Erreur `#C73E22` · Alerte `#B7791F` · Info `#2563A8` | | | à valider avant usage |

**Ratio** : 55 % Papier/Sable · 30 % Encre · 10 % Corail · 5 % Jade/Ciel.
**Évolutions vs code actuel** : `lime #C5F277` → remplacé par Jade (moins « startup néon ») ; `cyan` supprimé ; `frost/surface` bleutés → Papier/Sable chauds ; Corail conservé tel quel (déjà dans le code) mais avec règle « texte Encre sur corail ».
**Test de non-confusion** : le corail + encre + papier n'évoque ni banque (bleu/vert), ni santé (bleu clair/blanc), ni BTP (jaune/orange vif), ni restauration/fast-food (rouge/jaune), ni crypto/IA (violet/néon). La combinaison est libre dans le secteur.
**Culture** : le corail-rouge évoque la chance et la fête au Vietnam (positif) ; éviter le noir seul et le blanc seul pour des visuels de vœux/fêtes (deuil) ; le jade est positif en Asie du Sud-Est.

### 6.2 Typographie

| Rôle | Police | Source | Pourquoi |
|---|---|---|---|
| **Primaire — titres** | **Bricolage Grotesque** (600–800) | Google Fonts, libre | Grotesque chaleureuse aux formes humaines, très peu vue chez les agences, remplace Inter Tight |
| **Accent — mot en italique** | **Fraunces Italic** (400–500) | Google Fonts, libre | Serif douce à contraste ; supporte le vietnamien (contrairement à Instrument Serif) |
| **Secondaire — texte & UI** | **Inter** (400–600) | Google Fonts, libre | Lisibilité, perf, déjà chargé ; choix volontairement neutre |
| **Tertiaire — étiquettes/chiffres** | **JetBrains Mono** (500) | Google Fonts, libre | Prix, délais, horloge, tags |

⚠️ À vérifier avant intégration : que **chaque** police charge le sous-ensemble `vietnamese` sur Google Fonts (je n'ai pas pu le tester dans cette session). Échelle : H1 `clamp(2.5rem,6vw,4.5rem)` · H2 `clamp(2rem,4vw,3rem)` · corps 17–18 px, interligne 1,6.
**Règle d'accent** : 1 mot par titre en Fraunces italique, couleur Corail profond (clair) ou Corail (sombre).

### 6.3 Logo — cahier des charges
- **Symbole** : réseau de nœuds simplifié formant un « N » (ou un pentagone ouvert comme l'actuel), **un nœud corail**, le reste Encre (ou Ciel sur fond sombre). Doit tenir à 16 px.
- **Logotype** : « neuraweb » en Bricolage Grotesque Bold (minuscules, plus chaleureux que NEURAWEB en capitales).
- **Déclinaisons à livrer** : horizontal · empilé · symbole seul · logotype seul · couleur · noir · blanc · fond sombre · monochrome corail · favicon 16/32/48/180/512 · avatar rond (réseaux) · version animée (nœud qui s'allume).
- **Zone de protection** : hauteur du « n » autour. **Taille minimale** : symbole 16 px, lockup 96 px de large.
- **Interdits** : étirer, changer les couleurs hors palette, mettre sur photo chargée, ombres/glow, remettre « tech agency ».
- ⚠️ Les images générées sont raster : pour la production, faire **vectoriser/redessiner** le logo retenu (Figma/Illustrator ou service de vectorisation) avant de le déployer.

### 6.4 Système graphique
- Rayons : 12 px (cartes), 999 px (boutons pilules). Ombres douces chaudes, pas de glow néon.
- **Patterns** : (1) « Constellation » — grille de points reliés avec un nœud corail ; (2) « Fuseaux » — bandes verticales fines et horloges stylisées ; (3) texture papier discrète.
- **Illustrations** : traits Encre 2 px, aplats Sable, **un seul** détail Corail par illustration.
- **Icônes** : trait 1,75 px, coins arrondis, 24 px, détail corail optionnel.
- **Stickers/tags** : tampons ronds « Prix affichés », « Réponse < 24 h », « Fait à Hà Nội · pensé en France » ; chips jade « En ligne ».
- **Photographie** : lumière naturelle, vrais lieux de travail (cafés, co-working, hôtels clients), jamais de banques d'images génériques ; traitement chaud léger.
- **Motion** : 200–400 ms, easing doux, nœud qui s'allume au chargement ; respecter `prefers-reduced-motion`.

---

## 7. Pack à produire (et avec quel outil)

| Livrable | Outil | Statut |
|---|---|---|
| Exploration logo (6 pistes) → sélection | image-gen | à lancer |
| Logo final : couleur / noir / blanc / avec & sans nom / favicon | image-gen + Canva (assemblage) | à lancer |
| Patterns, illustrations, icônes, stickers | image-gen | à lancer |
| Brand guidelines (présentation) | Canva | à lancer |
| Templates réseaux : post carré, story, carrousel LinkedIn, couvertures FB/YouTube, **highlight covers**, avatars | Canva | à lancer |
| Carte de visite, signature, mockups | Canva + image-gen | à lancer |
| Brand Kit Canva (couleurs/polices/logos) | **manuel** : l'API Canva ne permet pas de le créer | à faire par toi (je fournis les valeurs §6) |

---

## 8. Ce qu'il faut mettre en place sur le site/SEO (après validation)

1. Remplacer le hero « Agence web à Lille » par la nouvelle promesse (tagline + prix + double horloge) ; garder Lille comme adresse légale/SEO local en pages dédiées.
2. Remplacer le logo cerveau par le nouveau symbole dans header, footer, favicon, OG, e-mails (`neurawebW.png`), **et mettre un logo sur fond clair dans le schema `Organization`**.
3. Migrer les tokens Tailwind (Papier/Sable/Corail/Jade, polices) ; règle `bg-coral` → `text-navy-950`.
4. Collecter **5–10 avis réels** (Google, Clutch, Trustpilot) : c'est le premier gap face à Gemeos/Knok.
5. Unifier les handles (LinkedIn, X, Facebook, GitHub) et les avatars.
6. Mettre à jour `docs/neuraweb-brand-identity.md` (à remplacer par ce document) et `llms.txt` (positionnement).
7. Trancher le point ❓ « démos vs vrais clients » dans le portfolio avant toute mise en avant.

## 9. Questions ouvertes (❓)
- Combien de personnes dans « l'équipe » aujourd'hui ? (conditionne « nous » vs « je »)
- Les clients sont-ils propriétaires du code/hébergement/domaines ? (argument anti-dépendance majeur)
- Quels projets du portfolio sont des clients réels ? Peux-tu publier leurs chiffres ?
- Tu préfères « tu » ou « vous » comme voix par défaut du site ?
- Le Vietnam est-il un marché *cible* (clients VN) ou seulement ton lieu de travail ? Cela change la place de la page `/vi`.
