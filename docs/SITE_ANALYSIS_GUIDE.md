# SITE_ANALYSIS_GUIDE.md

**Objectif :** Analyser neuraweb.tech via les API Google gratuites (Search Console, Google Analytics 4, Indexing API) pour obtenir des insights sur l'indexation, le trafic, les interactions utilisateurs, le contenu et les mots-clés.

---

## CONFIGURATION ACTUELLE

| Élément | Valeur |
|---------|--------|
| Site | `https://neuraweb.tech` |
| Blog | `/fr/blog` / `/en/blog` / `/es/blog` |
| Service Account (GSC + GA4) | `neuraweb@neuraweb-indexation.iam.gserviceaccount.com` |
| Fichier clé (GSC + GA4) | `project/neuraweb-indexation-859fd0c7dfeb.json` (gitignored) |
| Service Account (Indexing API) | `neuraweb-indexation@gen-lang-client-0602851575.iam.gserviceaccount.com` |
| Fichier clé (Indexing API) | `project/scripts/service-account.json` (gitignored) |
| GA4 Property ID | `517812956` |
| Propriété GSC | `sc-domain:neuraweb.tech` |

> **Attention :** les deux service accounts ne sont pas interchangeables. `neuraweb-indexation-859fd0c7dfeb.json` est autorisé dans GSC et GA4. `scripts/service-account.json` est uniquement pour l'Indexing API.

---

## COMMANDES DISPONIBLES

Toutes les commandes s'exécutent depuis `project/` :

```bash
# Analyse SEO (GSC + GA4)
npm run analyze              # Audit global 28 jours : impressions, CTR, position, GA4
npm run analyze:keywords     # Mots-clés : quick wins (pos 4-10), manqués (>10), CTR faible
npm run analyze:content      # Contenu : ce qui fonctionne vs à optimiser (croisement GSC × GA4)
npm run analyze:mobile       # Mobile vs desktop : CTR, position, engagement par device
npm run analyze:indexation   # Indexation : URLs sitemap sans trafic GSC (candidates à soumettre)

# Options supplémentaires (passer directement au script)
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./neuraweb-indexation-859fd0c7dfeb.json \
  node scripts/analyze-site.js --phase=keywords --days=90   # Analyse 90 jours
  node scripts/analyze-site.js --phase=global --days=180    # Analyse 6 mois

# Indexation et sitemap
npm run indexing             # Soumettre toutes les URLs du sitemap à l'Indexing API Google
npm run indexnow             # Soumettre toutes les URLs à Bing IndexNow
npm run sitemap:check        # Valider le sitemap (lancé automatiquement avant chaque build)
npm run pagespeed            # Audit PageSpeed Insights mobile + desktop sur la homepage
npm run pagespeed /fr/blog/nom-article  # Audit PageSpeed sur une page spécifique
```

---

## CE QUI EST IMPLÉMENTÉ

### Scripts d'analyse (`project/scripts/analyze-site.js`)
Script Node.js autonome (zéro dépendance npm) qui appelle GSC et GA4 via JWT/OAuth2.

**Phases disponibles :**
- `global` — métriques globales GSC + top pages GA4, 5 insights, recommandations
- `keywords` — requêtes quick wins (pos 4-10), manquées (pos > 10), gagnantes (Top 3), CTR faible
- `content` — croisement GSC × GA4 : contenu performant / à optimiser / candidat suppression
- `mobile` — comparatif CTR et position mobile vs desktop, engagement GA4 par device
- `indexation` — diff sitemap vs URLs avec trafic GSC → liste des URLs à soumettre

### Tracking analytics blog (`project/hooks/use-blog-analytics.ts`)
Hook appelé depuis `blog-post-client.tsx`. Envoie les events GA4 suivants via `window.gtag` :

| Event GA4 | Déclencheur |
|-----------|-------------|
| `article_view` | Ouverture de l'article (avec flag `is_return_reader`) |
| `article_scroll_depth` | Paliers 25 / 50 / 75 / 90 / 100% de scroll |
| `article_read_complete` | Scroll > 90% |
| `article_engaged_read` | 30 secondes passées sur l'article |
| `article_time_spent` | À la fermeture (temps actif + temps total + profondeur max) |
| `article_bounce_unqualified` | Sortie en moins de 10 secondes |
| `article_tag_click` | Clic sur un tag |
| `article_related_click` | Clic sur un article lié |
| `article_cta_click` | Clic CTA contact/services en bas d'article |
| `article_share` | Bouton "Copier le lien" |

### Tracking analytics booking (`project/components/booking-page-client.tsx`)
Ajouté le 16 juin 2026. Events via `window.gtag` directement :

| Event GA4 | Déclencheur |
|-----------|-------------|
| `booking_page_view` | Arrivée sur la page (avec service/pack pré-sélectionnés) |
| `booking_date_selected` | Sélection d'une date |
| `booking_time_selected` | Sélection d'un créneau horaire |
| `booking_step_advance` | Passage à l'étape 2 (informations personnelles) |
| `booking_form_start` | Premier caractère saisi dans le formulaire |
| `booking_submit_attempt` | Clic "Confirmer le rendez-vous" |
| `booking_success` | Réservation confirmée par l'API |
| `booking_submit_error` | Erreur (champs manquants / API / réseau) |
| `generate_lead` | Réservation réussie (event de conversion GA4) |

### Tracking analytics général (`project/hooks/use-analytics.ts`)
Hook utilisé dans `blog-list-client.tsx` et `services-pricing.tsx` :
- `pack_view` / `pack_click` / `pack_choose` / `pack_modal_close`
- `contact_click` (type : whatsapp / chatbot / form)
- `blog_view` / `blog_click`
- `scroll_depth` / `cta_click` / `navigation_click`
- `form_start` / `form_progress` / `form_submit` / `form_error`

---

## CE QUI EST AMÉLIORABLE

### 1. Tracking manquant sur les pages clés
Les pages suivantes n'ont **aucun event GA4 personnalisé** :
- `/fr/contact` — pas de tracking `contact_form_start` ni `contact_form_submit`
- `/fr/services` / `/fr/developpement-web` / `/fr/integration-ia` — pas de tracking CTA
- `/fr/automatisation` / `/fr/sante` — pas de scroll depth ni de clic CTA
- Chat IA — `contact_click` devrait être envoyé à l'ouverture du chat (déjà dans `use-analytics.ts` mais non branché)

### 2. Durées de session anormales
GA4 montre des durées de session aberrantes (homepage : 1574s = 26 min, `/es` : 1036s) sur des sessions avec 1 seul utilisateur. Probable : onglets laissés ouverts comptés par GA4. Solution : activer le filtre "session timeout" dans GA4 Admin (réduire à 30 min).

### 3. `/fr/booking` — 29 sessions avec 0% engagement (avant le 16/06)
Cause probable : utilisateurs arrivant directement sur la page (lien externe ou pub) et repartant immédiatement avant que le script GA4 (chargé en `lazyOnload`) ait le temps d'enregistrer une interaction. Le nouveau tracking `booking_page_view` permettra de distinguer bots vs vrais utilisateurs. À surveiller 7 jours après déploiement dans GA4 → Évènements.

### 4. Deux hooks analytics en parallèle
`use-analytics.ts` utilise `sendGAEvent` de `@next/third-parties/google`, `use-blog-analytics.ts` utilise `window.gtag` directement. Les deux fonctionnent car le layout injecte manuellement `window.gtag`, mais c'est incohérent. À terme, tout migrer vers `window.gtag` direct (ou tout vers `@next/third-parties`) pour uniformiser.

### 5. Pas de données GA4 pour le contenu blog
Sur 28 jours, seuls 3 articles ont des sessions GA4. L'analyse croisée GSC × GA4 (`npm run analyze:content`) est limitée car les données GA4 sont quasi nulles. Ce croisement deviendra utile à partir de ~200 sessions/mois.

### 6. 56/95 URLs sans trafic GSC
Lancer `npm run indexing` pour soumettre toutes les URLs. Ensuite re-vérifier avec `npm run analyze:indexation` dans 7 jours.

---

## FLUX DE TRAVAIL RECOMMANDÉ

### Routine hebdomadaire (lundi matin)
```bash
cd project
npm run analyze              # Audit global : y a-t-il du nouveau trafic ?
npm run analyze:keywords     # Nouvelles requêtes apparues ?
```

### Routine mensuelle
```bash
npm run analyze:content --days=90   # Croisement contenu sur 90 jours (plus de données)
npm run analyze:mobile              # Vérifier l'écart mobile/desktop
npm run analyze:indexation          # Y a-t-il de nouvelles URLs à soumettre ?
npm run pagespeed                   # Vérifier les Core Web Vitals
```

### Après publication d'un article
```bash
npm run indexing     # Soumettre les nouvelles URLs à Google
npm run indexnow     # Soumettre à Bing
# Vérifier dans 7 jours : npm run analyze:indexation
```

---

## ANALYSE MOTS-CLÉS FR — MÉTHODOLOGIE

### Problème actuel
Sur 90 jours, le site est visible pour des requêtes EN génériques (`web development`, `web hosting`) ultra-compétitives. Aucune requête FR avec volume significatif n'apparaît — les articles blog FR ne génèrent pas encore d'impressions.

### Étape 1 : Extraire les requêtes GSC existantes
```bash
npm run analyze:keywords --days=90
```
Cela donne les requêtes actuelles. Le but est de les enrichir avec des requêtes longue-traîne FR.

### Étape 2 : Sources de mots-clés FR ciblés

**A. Google Search Console — "Découverte" (à faire manuellement)**
Dans GSC → Performance → Pages → filtrer sur `/fr/` → voir quelles requêtes FR génèrent des impressions même faibles (position > 20). Ce sont les germes à développer.

**B. Google Suggest (autocomplétion)**
Taper les racines dans Google.fr et noter les suggestions :
- `agence web [ville]` → agence web lille, agence web nord, agence web PME...
- `création site [secteur]` → création site restaurant, création site hôtel...
- `automatisation [secteur]` → automatisation PME, automatisation comptabilité...
- `agent IA [usage]` → agent IA commercial, agent IA relance clients...

**C. "Les gens demandent aussi" dans les SERP**
Chercher les sujets des articles existants et noter les questions de la section "Les gens demandent aussi" — ce sont des cibles exactes pour les FAQ d'articles.

**D. Outil gratuit : Google Keyword Planner**
Via Google Ads (compte gratuit) → Outil de planification des mots-clés → entrer les URL des articles → extraire les suggestions de volume FR.

**E. Analyse concurrents**
Entrer les URLs de 2-3 concurrents directs (agences web FR ciblant PME) dans la barre de recherche Google puis noter quelles requêtes les positionnent via leurs titres de pages.

### Étape 3 : Matrice de ciblage par intention

| Intention | Exemples FR | Page cible |
|-----------|-------------|------------|
| Informationnelle | "comment automatiser ses factures PME", "qu'est-ce qu'un agent IA commercial" | Articles blog |
| Transactionnelle | "agence web IA PME prix", "création site hôtel réservation directe devis" | Pages services + booking |
| Navigationnelle | "neuraweb", "neuraweb avis" | Homepage + pages institutionnelles |
| Locale | "agence web Lille", "développeur web Nord", "agence IA Hauts-de-France" | Pages services avec balise LocalBusiness |

### Étape 4 : Quick wins identifiés

Requêtes à intégrer en priorité dans les articles et pages existants :

**Blog — enrichir les H2/H3 existants :**
- `automatisation IA PME` → article `automatisation-ia-pme-prix-2026.mdx`
- `agent IA commercial PME` → article `agent-ia-commercial-pme.mdx`
- `réservations directes hôtel sans commission` → article `reservations-directes-hotel-sans-commission-ota.mdx`
- `site web restaurant sans commission 2026` → article `site-restaurant-sans-commission-2026.mdx`
- `n8n vs make vs zapier PME` → article `make-n8n-zapier-2026-pme-france.mdx`
- `NextJS vs WordPress 2026` → article `nextjs-vs-wordpress-2026.mdx`

**Pages services — ajouter aux meta titles :**
- `/fr/developpement-web` → cibler "agence web IA PME" + "création site internet entreprise"
- `/fr/integration-ia` → cibler "intégration IA site web PME" + "agent IA sur mesure"
- `/fr/automatisation` → cibler "automatisation processus PME" + "workflow IA n8n"
- `/fr/sante` → cibler "site web cabinet médical" + "prise de rendez-vous en ligne médecin"

**Requêtes locales à ajouter dans les structured data et le contenu :**
- "agence web Lille", "agence web Nord", "développeur web Hauts-de-France"
- Ces termes doivent apparaître naturellement dans au moins 1-2 articles et dans la meta description de la homepage.

### Étape 5 : Vérifier l'impact (J+30)
```bash
npm run analyze:keywords --days=30
```
Comparer avec la baseline actuelle : les nouvelles requêtes FR doivent commencer à apparaître avec des impressions (même en position 20-50).

---

## RÉFÉRENCES CREDENTIALS

| Ressource | Lien |
|-----------|------|
| Google Search Console | https://search.google.com/search-console |
| Google Analytics | https://analytics.google.com → Property 517812956 |
| Google Cloud Console (APIs) | https://console.cloud.google.com → Project neuraweb-indexation |
| GSC API Docs | https://developers.google.com/webmaster-tools/v1 |
| GA4 Data API Docs | https://developers.google.com/analytics/devguides/reporting/data/v1 |
| Indexing API Docs | https://developers.google.com/search/indexing-api |
| PageSpeed Insights Docs | https://developers.google.com/speed/docs/insights/v5/get-started |
