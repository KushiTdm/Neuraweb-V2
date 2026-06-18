# Prompt de génération — Démo « NeuraWeb Connected Suite »

> **Nature du fichier.** Ce document est un *prompt prêt à l'emploi* destiné à un agent de
> génération de code (Claude Code, v0, Cursor, Lovable…). Copie tout le bloc « PROMPT À
> EXÉCUTER » dans l'outil, ou utilise ce fichier comme cahier des charges. Objectif : produire
> **une application de démonstration web + mobile connectée**, multi-secteurs (collectivités,
> restaurants, hôtels…), qui sert de **vitrine des capacités de NeuraWeb** à concevoir des outils
> cohérents, intelligents et connectés. Tout est **mocké** : aucune donnée réelle, aucun back-end.
> Chaque section et chaque bouton mène à une page — au pire une page « Démo » explicite.

---

## 1. Contexte (à donner à l'agent)

NeuraWeb est une agence web & IA (Lille, intervient partout en France) qui propose des sites,
applications mobiles, intégrations IA et automatisations. Pour ses rendez-vous commerciaux —
notamment avec des **mairies / collectivités**, mais aussi des **restaurants** et **hôtels** — elle
a besoin d'**une démo unique et impressionnante** montrant qu'un même savoir-faire produit des
écosystèmes **web (back-office) + mobile (application citoyen/client) connectés en temps réel**.

La démo n'a pas vocation à être un produit fini : c'est une **maquette interactive haute fidélité**.
On veut une navigation fluide, un design soigné cohérent avec la marque, des données crédibles
mais factices, et une **démonstration visible de la connexion web ↔ mobile** (une action côté
back-office se répercute instantanément sur le téléphone affiché à l'écran, et inversement).

**Message à faire passer au prospect :** « Voilà le type d'outil sur-mesure, intelligent et
connecté, que nous pouvons construire pour vous. »

---

## 2. Objectif de la démo (definition of done résumée)

1. Une **page d'accueil / launcher** qui présente la suite et laisse choisir un secteur.
2. **3 verticaux** livrés : **Collectivité (mairie)**, **Restaurant**, **Hôtel**.
   Architecture **extensible** pour en ajouter d'autres (santé, immobilier…).
3. Pour chaque vertical : **une vue back-office web** ET **une vue application mobile** (rendue
   dans un *cadre de téléphone* à l'écran), **connectées** par un état partagé mocké.
4. **Démonstration de synchronisation** web ↔ mobile en direct (cf. §8).
5. **Touches d'intelligence** (IA mockée) : assistant conversationnel, suggestions, KPI.
6. **Aucun cul-de-sac** : tout lien/bouton mène à une vraie route ou à la **page stub « Démo »**.
7. **100 % responsive**, accessible, et **bandeau « Démo »** persistant.

---

## 3. Stack & conventions techniques

Aligne-toi sur la stack NeuraWeb pour la cohérence :

- **Next.js (App Router) + TypeScript** ; **Tailwind CSS** ; composants type **shadcn/ui**.
- Icônes **lucide-react**. Animations **Framer Motion** (ou GSAP) — sobres, utiles, jamais gadget.
- **Aucun back-end réel.** Toute la donnée vient de **mocks** (objets TS / JSON en mémoire).
  La « base de données » est un **store global côté client** (Zustand ou React Context) pour
  permettre la synchro web ↔ mobile dans le même onglet.
- **PWA-ready** (manifest + thème) pour appuyer le discours « application mobile ».
- Déploiement cible : **Vercel**. Build statique autant que possible.
- Pas de secrets, pas d'appels externes payants. Une éventuelle IA est **simulée** (réponses
  scriptées + petite latence), aucune clé requise.

---

## 4. Identité visuelle (à respecter strictement)

Palette NeuraWeb (issue de `tailwind.config.ts`) :

| Rôle | Couleur | Hex |
|---|---|---|
| Fond sombre principal | navy-950 | `#070F26` |
| Navy profond | navy-900 | `#0E1B3D` |
| Accent principal | sky-400 | `#5DB8F0` |
| Accent vif / dégradés | cyan-500 | `#22D3EE` |
| CTA chaud prioritaire | coral | `#FF7A59` |
| Succès / KPI positif | lime | `#C5F277` |
| Fond clair de section | surface | `#F7FAFD` |

- Dégradé signature : `from-sky-400 via-cyan-500` sur fond navy, halos floutés discrets.
- Chaque vertical reçoit **une teinte d'accent secondaire** pour se distinguer tout en restant
  dans la famille : **Collectivité = indigo/sky**, **Restaurant = amber/coral**, **Hôtel = teal/cyan**.
- Typo : police d'affichage marquée pour les titres (`font-display`), sans-serif lisible pour le corps.
- Logo « NEURAWEB » (cerveau). Coins arrondis 2xl, ombres douces, beaucoup d'air.
- **Mode sombre** pour les back-offices, **mode clair** pour les apps mobiles (contraste démo).

---

## 5. Architecture & routing

```
/                         → Launcher : présentation + choix du secteur
/demo                     → Page stub générique « Fonctionnalité de démonstration »
/c/collectivite           → Hub Collectivité (split web back-office + mobile)
/c/collectivite/admin/*   → Routes back-office mairie
/c/collectivite/app/*     → Routes application citoyenne (mobile)
/r/restaurant             → Hub Restaurant (split)
/r/restaurant/admin/*     → Back-office restaurant
/r/restaurant/app/*       → Application client restaurant
/h/hotel                  → Hub Hôtel (split)
/h/hotel/admin/*          → Back-office hôtel
/h/hotel/app/*            → Application client/voyageur
```

**Pattern « Split View » (cœur de la démo).** Sur desktop, chaque hub affiche **côte à côte** :
- à gauche, le **back-office web** (dashboard, plein écran) ;
- à droite, un **cadre de smartphone** (mockup device) contenant l'**app mobile** correspondante.

Sur mobile/tablette, un **onglet bascule** « Back-office ⇄ App mobile » (les deux ne tiennent pas
côte à côte). Un bouton « Voir en plein écran » ouvre l'une ou l'autre vue seule.

---

## 6. Règle d'or : aucun cul-de-sac (pages mockées)

> **Chaque** élément cliquable doit aboutir. Trois cas autorisés :
> 1. La page/fonction est réellement maquettée (état mocké, UI complète mais sans persistance réelle).
> 2. Le bouton déclenche une **action simulée** (toast, changement d'état local, animation).
> 3. Sinon, il **redirige vers `/demo`** : une page stub élégante qui affiche :
>    « 🧪 Ceci est une démonstration. Cette fonctionnalité serait pleinement développée dans la
>    version finale. » + nom de la fonctionnalité demandée (via query `?feature=...&from=...`),
>    + bouton « Revenir » et « Demander cette fonctionnalité » → renvoie vers la prise de contact.

Implémente un composant `<DemoLink href? feature="...">` : s'il n'y a pas de `href` réel, il pointe
vers `/demo?feature=<label>&from=<routeActuelle>`. Utilise-le partout par défaut, pour qu'**aucun
lien ne soit mort** même si la page n'est pas faite.

La page `/demo` doit être **soignée** (pas une 404 déguisée) : c'est elle qui assume le côté
« maquette » sans casser l'effet de démo.

---

## 7. Touches d'intelligence (IA mockée)

Pour incarner le « intelligent » :

- **Assistant conversationnel** flottant (présent dans chaque app et back-office). Réponses
  **scriptées** par secteur (FAQ, orientation), avec indicateur « réponse générée », latence
  simulée, et mention **« Assistant IA — démo »** (transparence, clin d'œil à l'AI Act art. 50).
- **Suggestions contextuelles** : ex. back-office mairie qui « détecte » un pic de signalements et
  propose une action ; resto qui suggère une promo anti-gaspillage ; hôtel qui propose un upsell.
- **KPI animés** (compteurs, mini-graphiques sparkline) avec libellés crédibles.
- **Recherche intelligente** (filtrage instantané mocké) dans les listes.

Tout est déterministe et hors-ligne : pas d'appel modèle réel.

---

## 8. La démonstration « connectée » (web ↔ mobile) — point clé

C'est ce qui doit faire dire « waouh ». Dans le **Split View**, l'état est **partagé** entre le
back-office et l'app mobile (même store). Scénarios scriptés à câbler, **bidirectionnels et en temps réel** :

- **Collectivité :** un citoyen crée un **signalement** (photo voirie) depuis l'app mobile →
  il **apparaît instantanément** dans le tableau du back-office mairie, badge « Nouveau ». L'agent
  change le statut (Reçu → En cours → Résolu) côté web → l'app mobile reçoit une **notification**
  et le suivi se met à jour. Idem pour une **réservation de salle** validée côté mairie.
- **Restaurant :** un client passe une **commande click & collect** sur l'app → ticket en temps
  réel sur l'écran cuisine du back-office ; la cuisine fait avancer le statut → le client voit
  « En préparation → Prête » + code de retrait.
- **Hôtel :** un voyageur fait une **demande de service** (room service / late check-out) depuis
  l'app → elle tombe dans la console réception ; la réception confirme → notif côté voyageur.

Ajoute un petit **« Mode présentation »** : un bouton qui **joue automatiquement** un scénario
(séquence d'événements simulés) pour une démo mains-libres devant le prospect.

---

## 9. Spécification des 3 verticaux

Pour chaque vertical, livrer : un **back-office** (sidebar + dashboard + 3-5 modules) et une **app
mobile** (bottom-tab nav + 4-5 écrans). Modules non détaillés = liens vers `/demo`.

### 9.1 Collectivité (mairie) — accent indigo/sky

**Back-office mairie (web)**
- **Dashboard** : KPI (demandes en cours, délai moyen de traitement, taux de conformité du site,
  fréquentation services en ligne), carte des signalements, file des dernières demandes.
- **Signalements citoyens** : liste + carte, filtres (voirie, éclairage, propreté), changement de
  statut, assignation à un service. *(connecté à l'app, cf. §8)*
- **Réservations** : salles municipales, équipements sportifs, créneaux d'ateliers (théâtre,
  médiathèque) — calendrier + validation.
- **Démarches en ligne** : suivi des dossiers (état civil, urbanisme, inscriptions) avec statuts.
- **Conformité & accessibilité** (signature NeuraWeb) : widget RGAA (score, déclaration, schéma
  pluriannuel), RGPD/cookies, transparence IA — purement informatif, montre le sérieux secteur public.
- **Contenu / actualités** : éditeur d'actus & agenda (mocké).

**App citoyenne (mobile)**
- **Accueil** : actus, alertes, accès rapides (mes démarches, signaler, réserver, agenda).
- **Signaler** : prendre une photo (mock upload), géolocalisation, catégorie → envoi *(→ back-office)*.
- **Mes démarches** : démarches en ligne avec suivi de dossier, FranceConnect (bouton mocké).
- **Réserver** : salle / atelier / équipement, choix de créneau, confirmation.
- **Agenda & notifications** : événements, push simulées.
- **Annuaire des commerces locaux** : fiches commerçants (lien attractivité du territoire).

### 9.2 Restaurant — accent amber/coral

**Back-office restaurant (web)**
- **Dashboard** : CA du jour, commandes en cours, panier moyen, économies vs plateformes (vs 30 %).
- **Écran cuisine (KDS)** : tickets temps réel, avancement de statut *(connecté à l'app)*.
- **Réservations de table** : plan de salle, créneaux.
- **Carte & menu** : éditer plats/prix, activer une **promo anti-gaspillage** en un clic.
- **Fidélité** : base clients, points, relances (mockées).

**App client (mobile)**
- **Vitrine** : menu, photos, avis, horaires, plan.
- **Commander** : click & collect, panier, **paiement simulé** (Stripe-like, sans transaction),
  créneau de retrait → **code à 4 chiffres** + suivi temps réel *(→ KDS)*.
- **Réserver une table** : date/heure/couverts.
- **Fidélité** : carte de points, paliers, récompenses.

### 9.3 Hôtel — accent teal/cyan

**Back-office hôtel (web)**
- **Dashboard** : taux d'occupation, arrivées/départs du jour, demandes de service, RevPAR (mock).
- **Planning des chambres** : calendrier d'occupation, statuts (libre, occupée, ménage).
- **Réservations** : liste + détail réservation, check-in/out.
- **Conciergerie / services** : demandes voyageurs (room service, late check-out, taxi) *(connecté)*.
- **Tarifs & disponibilités** : grille tarifaire (mockée).

**App voyageur (mobile)**
- **Réserver** : recherche dates, choix de chambre, **paiement simulé**, confirmation.
- **Mon séjour** : détails réservation, **check-in en ligne**, clé digitale (mock), wifi.
- **Services** : commander un service / faire une demande → suivi *(→ conciergerie)*.
- **Découvrir** : recommandations locales (restaurants partenaires → clin d'œil cross-vertical),
  conciergerie IA.

---

## 10. Stratégie de données mockées

- Un dossier `mocks/` par vertical : `citizens.ts`, `reports.ts`, `bookings.ts`, `orders.ts`,
  `rooms.ts`, etc. Données **réalistes** (noms FR, dates récentes, montants crédibles), volume
  suffisant pour que les listes/graphiques « respirent ».
- Un **store global** (Zustand recommandé) expose actions + sélecteurs ; web et mobile lisent/écrivent
  le même état → la synchro §8 est automatique.
- **Persistance légère optionnelle** : `localStorage` pour conserver l'état pendant la démo, avec un
  bouton **« Réinitialiser la démo »** (remet les mocks d'origine).
- Horodatages relatifs (« il y a 3 min ») pour donner du « temps réel ».

---

## 11. Composants transverses à produire

- `<DemoBanner>` : bandeau fin, fixe et discret (« 🧪 Environnement de démonstration NeuraWeb —
  données fictives »), refermable, présent partout.
- `<DemoLink>` : cf. §6.
- `<PhoneFrame>` : cadre smartphone responsive (encoche, barre d'état mockée) encapsulant l'app mobile.
- `<SplitView>` : back-office + PhoneFrame côte à côte / onglets selon breakpoint.
- `<KpiCard>`, `<Sparkline>`, `<StatusBadge>`, `<DataTable>` (filtrable/triable), `<Timeline>`.
- `<AssistantWidget>` : chatbot IA mocké (scripté par secteur).
- `<PresentationModeButton>` : joue un scénario automatique (§8).
- `<VerticalSwitcher>` : passer d'un secteur à l'autre sans revenir au launcher.
- `<DemoStub>` : contenu de la page `/demo`.

---

## 12. Launcher (page `/`)

- Hero NeuraWeb : « Une démo, trois métiers, un même savoir-faire connecté. »
- 3 grandes cartes (Collectivité, Restaurant, Hôtel) → entrent dans le Split View du vertical.
- Bandeau de capacités : Web + Mobile, Temps réel, IA intégrée, RGPD/Accessibilité, PWA.
- CTA secondaire : « Discuter de votre projet » → page de contact mockée (ou `/demo`).
- Mention claire : démo à but d'illustration, fonctionnalités simulées.

---

## 13. Accessibilité & responsive

- Navigation clavier complète, focus visibles, contrastes AA, `aria-*` sur les composants
  interactifs, `alt` sur les images, respect de `prefers-reduced-motion`.
- Mobile-first : tout doit être impeccable de 320 px à grand écran. Le `PhoneFrame` passe en
  plein écran sur petit viewport.

---

## 14. Critères d'acceptation (Definition of Done)

- [ ] Launcher + 3 hubs Split View fonctionnels (web + PhoneFrame).
- [ ] Pour chaque vertical : back-office (≥1 module riche + le reste en stubs) **et** app mobile (≥4 écrans).
- [ ] **Au moins un scénario de synchro temps réel** par vertical, vérifiable à l'écran.
- [ ] **Mode présentation** jouant un scénario automatiquement.
- [ ] Assistant IA mocké présent et cohérent par secteur.
- [ ] **Zéro lien mort** : tout aboutit (vraie page ou `/demo`).
- [ ] `<DemoBanner>` visible partout + bouton « Réinitialiser la démo ».
- [ ] Responsive 320 px → desktop, accessibilité de base respectée.
- [ ] Identité visuelle NeuraWeb respectée (palette §4).
- [ ] Build OK, déployable sur Vercel, PWA installable.

---

## 15. Idées d'extension (bonus, non bloquant)

- Vertical **Santé** (cabinet) et **Immobilier** réutilisant les mêmes briques.
- **Sélecteur de thème** par collectivité/marque (montre la personnalisation).
- **Multilingue** FR/EN/ES (la marque est déjà i18n).
- **QR code** sur le back-office qui « ouvre » l'app mobile (en réalité focus le PhoneFrame) pour
  un effet démo physique sur tablette.
- Export PDF mocké d'un rapport (KPI mairie, CA resto, occupation hôtel).

---

## 16. PROMPT À EXÉCUTER (copier-coller dans l'outil de génération)

> Tu es un ingénieur front senior. Construis **« NeuraWeb Connected Suite »**, une **application de
> démonstration web + mobile connectée** en **Next.js (App Router) + TypeScript + Tailwind +
> shadcn/ui + lucide-react + Framer Motion**, **entièrement mockée** (aucun back-end, store global
> Zustand + persistance localStorage, bouton de reset).
>
> Elle illustre le savoir-faire de l'agence NeuraWeb sur **3 métiers** : **Collectivité (mairie)**,
> **Restaurant**, **Hôtel**. Pour chacun, livre un **back-office web** et une **application mobile**
> affichée dans un **cadre de smartphone**, **côte à côte (Split View)** sur desktop, en **onglets**
> sur mobile, **partageant le même état** pour démontrer une **synchronisation temps réel** web ↔
> mobile (signalement citoyen, commande click & collect, demande de service hôtel — du mobile vers
> le back-office et retour, avec changements de statut et notifications simulées). Ajoute un **« Mode
> présentation »** qui joue un scénario automatiquement.
>
> Respecte la palette NeuraWeb (navy `#070F26`/`#0E1B3D`, sky `#5DB8F0`, cyan `#22D3EE`, coral
> `#FF7A59`, lime `#C5F277`), back-offices en sombre, apps mobiles en clair, accents secondaires par
> vertical (indigo, amber, teal). Intègre un **assistant IA mocké** (réponses scriptées par secteur,
> latence simulée, mention « démo »), des **KPI animés**, une **recherche/filtre instantané**.
>
> **Règle absolue : aucun lien mort.** Crée un composant `<DemoLink>` qui, faute de page réelle,
> redirige vers `/demo?feature=...&from=...`, une page stub soignée indiquant « Ceci est une
> démonstration — fonctionnalité développée dans la version finale », avec retour et CTA contact.
> Affiche un `<DemoBanner>` persistant « Environnement de démonstration — données fictives ».
>
> Couvre les modules décrits dans le cahier des charges (signalements, réservations, démarches,
> conformité RGAA/RGPD pour la mairie ; KDS, commande, fidélité pour le resto ; planning,
> conciergerie, check-in pour l'hôtel). Les modules non maquettés en profondeur doivent exister en
> stubs via `<DemoLink>`. Le tout **responsive (320 px → desktop), accessible (clavier, contrastes,
> reduced-motion), PWA-ready**, déployable sur Vercel. Commence par le launcher `/`, la page `/demo`,
> le store mocké et les composants transverses (`<SplitView>`, `<PhoneFrame>`, `<DemoLink>`,
> `<DemoBanner>`, `<AssistantWidget>`), puis décline les 3 verticaux.

---

*Document maintenu par NeuraWeb — support commercial. La démo est une maquette interactive : les
fonctionnalités sont simulées et les données fictives.*
