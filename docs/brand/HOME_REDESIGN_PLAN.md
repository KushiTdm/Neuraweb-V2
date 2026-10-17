# Refonte de l'accueil — analyse, logique de présentation, état d'avancement (17 octobre 2026)

Branche : `redesign/identite-2026`. **Packs, prix et services : non modifiés** (consigne).

## 1. Ce que disent les données

### 1.1 Search Console (réel, 28 jours, `neuraweb.fr` — via `npm run analyze:keywords`)
Le site est très peu visible : impressions à un chiffre, sauf :
| Requête | Impressions | Position |
|---|---|---|
| mobile app development | 32 | 9,2 |
| web development | 15 | 6,1 |
| custom web (application/software) development | 6 + 6 | 8,5 / 6,2 |
| créateur de site internet · création sites internet · conception de site web | 1–3 | 5–10 |
| agence web · création de sites internet · website development / developers | 2–4 | 1–2,3 |
**Lecture** : (1) le trafic existant est surtout **anglophone** (« web / mobile app development »), pas francophone ; (2) en français, les requêtes réelles sont **« création / créateur de site internet »**, pas « sites web et applications » ; (3) le domaine est jeune (migration juillet 2026) : les volumes sont trop faibles pour juger des mots-clés, il faut surtout **gagner de la visibilité** (blog, avis, annuaires). Aucune requête « Vietnam » ni « automatisation » n'apparaît encore.

### 1.2 Concurrence (5 sites analysés, pages d'accueil lues)
- Aucun n'affiche de prix → **NeuraWeb affiche les siens : à mettre en tête** (appliqué : section « promesse »).
- Structure commune des meilleurs : hero (promesse + preuve) → logos/preuves → services → réalisations chiffrées → process → témoignages/avis → FAQ → CTA. Gemeos et Knok ajoutent une **note d'avis chiffrée** en hero ; Digital Silk, un **process en étapes**.
- Faiblesse commune : ton « grandes marques » ; les PME locales sont peu servies en discours.

### 1.3 Recherche search-ai (5 IA, visuels par section)
Consensus : **mix hybride** — illustrations vectorielles pour services/explications, **photos réelles pour la preuve** (portfolio, équipe, clients), motion léger en CSS, performance d'abord (LCP < 1,2–2,5 s, SVG/AVIF/WebP, `prefers-reduced-motion`). Risque identifié : les images IA « génériques » nuisent à la confiance (E-E-A-T). Désaccord : hero = illustration/motion (Gemini, Perplexity) ou photo réelle (Kimi).
**Application ici** : illustrations IA stylisées pour les services (acceptées, pas de faux réalisme) ; photo pour le fondateur **de dos**, composition volontairement graphique ; preuves (portfolio, avis) laissées réelles.

## 2. Logique de présentation, section par section

| # | Section | Rôle | Titre / texte | Visuel mis en place | Mot-clé / SEO | État |
|---|---|---|---|---|---|---|
| 1 | **Hero** | Promesse + preuve + 2 actions | H1 inchangé : « Sites web, applications et automatisations pour les PME » + kicker « Agence web à Lille » | Photo du fondateur **de dos** devant un disque crème (`hero-fondateur.webp`, 15 Ko) ; H1 en Fraunces Soft Black | Voir §3 : H1 non modifié volontairement | Visuel + couleurs ✅ ; texte à décider |
| 2 | Bande stack | Réassurance technique | « Notre stack au quotidien » | — | Next.js, React, n8n… (entités) | Couleurs ✅ |
| 3 | **Promesse (nouvelle)** | Répondre aux 3 peurs : prix opaques, injoignable, jargon | H2 « Le web sans jargon, sans frontières » ; 3 cartes : **Prix affichés / Équipe joignable / Ouvert sur le monde** | 3 icônes gravure (`devis`, `agent-ia`, `paris-hanoi`) | « agence web et IA », prix d'entrée, 4 langues | ✅ (FR/EN/ES/VI ; **VI sans prix en euros**, règle du site) |
| 4 | **Services** | Orienter vers les 4 offres | H2 reformulé avec les mots-clés : « Sites web, applications, IA et automatisation **pour les PME et commerces locaux** » | 4 illustrations bicolores (web, mobile, IA, automatisation), sans texte | sites web, applications, IA, automatisation, PME | ✅ |
| 5 | **Chiffres** | Preuve | « Des chiffres qui parlent d'eux-mêmes » | Motif vagues animé (CSS lent) + 3 icônes | — | Couleurs ✅ — ⚠ **chiffres non justifiés** (§3) |
| 6 | **À propos** | Humaniser sans montrer le visage | « À propos de NeuraWeb » + 6 engagements animés | Fondateur de dos entre **deux horloges** (deux fuseaux) | — | Visuel ✅ ; texte à revoir (§3) |
| 7 | **Réalisations** | Preuve concrète | « Nos Réalisations » | Vraies captures (inchangées) | — | Couleurs ✅ |
| 8 | **Témoignages** | Avis | « Ce que nos clients disent de NeuraWeb » | Cartes teinte Chypre 20 % | — | Couleurs ✅ |
| 9 | **FAQ** | AEO / FAQPage | « Questions fréquentes » | — | FAQPage inchangé | Couleurs ✅ |
| 10 | **CTA final** | Conversion | « Prêt à transformer votre vision en réalité ? » + appel + audit IA | Motif vagues ; **le visuel « homme qui marche » n'a pas pu être généré** (quota Gemini) | — | Couleurs ✅ ; visuel en attente |
| — | En-tête / pied / bandeau cookies | | | Logo SVG recolorable | | ✅ |

## 3. Décisions à prendre (je ne les ai pas appliquées)
1. **H1 / kicker.** Les requêtes réelles sont « création / créateur de site internet » et, en anglais, « web / mobile app development ». Proposition de H1 : « **Création de site internet, applications et automatisation pour les PME** » (garde « Next.js » dans le sous-titre). Le kicker « Agence web à Lille » **contredit** le positionnement nomade/Vietnam : alternatives « Agence web & IA française, ouverte sur le monde » ou garder Lille pour le SEO local sur ses pages dédiées. Ton CLAUDE.md demande que le H1 garde des mots-clés : je n'ai donc pas touché au texte.
2. **Chiffres (150+ projets, 98 %, 3,2×).** Ils ne sont documentés nulle part dans le repo ; le portfolio compte 8 projets dont plusieurs démos. **À justifier avec des preuves, ou remplacer** par des faits vérifiables (4 langues, 3 packs, 24 h de réponse, nombre d'articles…). Si ce n'est pas étayé, c'est un risque de confiance et de conformité.
3. **Texte « À propos »** : « petite agence basée à Lille » alors que l'équipe travaille au Vietnam — à harmoniser avec le positionnement.
4. **Avis** : ajouter une note chiffrée en hero (type Gemeos : « 4,9/5 sur N avis ») **uniquement** si elle existe (Google Business).
5. **Section « process »** (3–4 étapes + Paris ↔ Hà Nội) : manquait par rapport à Digital Silk ; à ajouter si tu valides les étapes réelles.
6. **Anglais** : le trafic réel est anglophone ; l'accueil `/en` mérite son propre H1 « web development agency … ».
7. **Photos réelles** : la recherche recommande de la preuve réelle (équipe, projets). Le fondateur de dos est une image générée par IA : acceptable en visuel d'ambiance, **pas comme preuve**.

## 4. Technique
- **Fraunces** auto-hébergée : 1 fichier woff2 **22 Ko** (latin + vietnamien) au lieu de la variable Google (plusieurs centaines de Ko). Le zip d'origine est rangé hors de `public/` : `../design-sources/fonts/Fraunces.zip`.
- Images : 14–66 Ko chacune (WebP), `loading="lazy"` sauf hero ; décor animé en CSS (`nwDrift`) désactivé avec `prefers-reduced-motion`.
- Couleurs : uniquement Chypre `#004643`, Crème `#F0EDE5` et leurs teintes 20/40/60 % sur l'accueil ; les autres pages gardent l'ancien style tant qu'elles ne sont pas migrées.
- Limites : captures desktop vérifiées ; **mobile pas encore vérifié finement** (le navigateur headless impose une largeur minimale) ; Lighthouse non lancé.
