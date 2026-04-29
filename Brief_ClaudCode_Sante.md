# BRIEF POUR CLAUDE CODE — PAGE DE VENTE "SANTÉ & PARAMÉDICAL"

## 🎯 OBJECTIF
Créer une page de vente unique (`/sante.html` ou route `/sante`) qui sert de **canal de conversion principal** pour les professionnels de santé libéraux (ostéopathes, kinés, infirmiers, etc.).

**Métrique de succès** : un visiteur doit pouvoir comprendre l'offre, choisir son pack et demander un devis en moins de 90 secondes.

---

## 🏗️ STACK TECHNIQUE

```
- Framework : React 18+ (Vite) OU Next.js 14+ (App Router)
- Styling : Tailwind CSS 3.4+
- Animations : Framer Motion (scroll reveal, micro-interactions)
- Icônes : Lucide React
- Formulaire : React Hook Form + Zod (validation)
- Déploiement : statique (export) ou Vercel/Netlify
```

**Contraintes techniques** :
- 100% responsive (mobile-first, 80% du trafic santé est mobile)
- Temps de chargement < 1.5s (Lighthouse perf > 90)
- SEO on-page complet (meta tags, schema.org LocalBusiness, OpenGraph)
- Aucune dépendance lourde (pas de Bootstrap, pas de jQuery)

---

## 📄 STRUCTURE DE PAGE — SECTION PAR SECTION

### SECTION 1 : HERO (100vh sur desktop, auto sur mobile)

**Layout** : 2 colonnes sur desktop (texte gauche 55%, visuel droite 45%), empilé sur mobile.

**Contenu texte** :
- **H1** : "Votre cabinet mérite un site à la hauteur de votre expertise"
- **Sous-titre** : "Sites web conçus pour les ostéopathes, kinésithérapeutes et infirmiers libéraux. Conformes, sécurisés, livrés en 1 semaine."
- **CTA Primaire** : Bouton "Voir les forfaits" (scroll doux vers #packs)
- **CTA Secondaire** : Bouton texte "Demander un devis gratuit" (ouvre modal formulaire)
- **Trust bar** : 3 micro-items avec icônes :
  - "🔒 Conforme RGPD Santé"
  - "🏥 Hébergement France"
  - "⚡ Intégration Doctolib"

**Visuel** :
- Mockup d'un site vitrine santé affiché sur un iPhone + un MacBook
- En fond : dégradé très subtil bleu médical (#f0f9ff vers #ffffff)
- **Pas de photo stock** — utiliser une illustration clean ou un mockup généré

**Animation** :
- Fade-in + translateY(20px → 0) sur le texte, stagger 0.1s par élément
- Le mockup flotte légèrement (animation CSS infinite translateY ±10px, 4s)

---

### SECTION 2 : BANDEAU CONFIANCE (logos métiers + badges)

**Layout** : full-width, fond blanc cassé (#fafafa), padding 3rem.

**Contenu** :
- **Label** : "Conçu pour les professionnels de santé"
- **Pills métiers** (scroll horizontal sur mobile) :
  - Ostéopathes
  - Kinésithérapeutes
  - Infirmiers à domicile
  - Sage-femmes
  - Podologues
  - Psychomotriciens
- **Badges conformité** (4 cartes mini) :
  - RGPD Santé
  - HDS (Hébergement Données Santé)
  - Hébergement France
  - Doctolib-ready

**Animation** : fade-in au scroll

---

### SECTION 3 : PROBLÈME / SOLUTION ("Pourquoi une agence spécialisée ?")

**Layout** : container max-w-5xl, 2 colonnes alternées (texte | visuel) puis inverse.

**Contenu** — 4 blocs :

1. **"Je ne veux pas faire d'erreur avec les données patients"**
   - Texte : "Nous connaissons la réglementation HDS. Vous n'avez pas besoin de devenir expert en conformité — on s'occupe de tout, du bon hébergement aux mentions légales."
   - Icône : ShieldCheck

2. **"Je n'ai pas le temps de gérer un site"**
   - Texte : "Maintenance, sauvegardes, mises à jour de sécurité : tout est inclus dans l'abonnement mensuel. Vous ne touchez à rien."
   - Icône : Clock

3. **"Doctolib me suffit, non ?"**
   - Texte : "Doctolib est un annuaire. Votre site, c'est VOTRE vitrine. Google référence votre nom, pas celui de Doctolib. Un site pro = plus de crédibilité + meilleur référencement local."
   - Icône : Globe

4. **"J'ai déjà eu une mauvaise expérience avec une agence"**
   - Texte : "Devis transparent, livraison garantie sous 10 jours pour les vitrines, 3 révisions de maquettes incluses. Pas de surprise."
   - Icône : ThumbsUp

**Animation** : chaque bloc apparaît au scroll avec un léger slide depuis le côté alterné

---

### SECTION 4 : SIMULATEUR DE BESOIN (composant interactif clé)

**Layout** : carte centrée, fond bleu très clair, bordure arrondie.

**Fonctionnement** : questionnaire en 3 étapes (stepper), 1 question visible à la fois.

**Étape 1** : "Vous exercez..."
- Radio cards : Seul(e) / À 2 / À 3 ou plus / Centre médical

**Étape 2** : "Vous souhaitez..."
- Radio cards : Un site simple avec lien Doctolib / Un site avec blog et réservation / Une plateforme complète multi-praticiens

**Étape 3** : "Vous stockez des données patients sur le site ?"
- Radio cards : Non, jamais / Oui, historique et documents

**Résultat dynamique** :
- Affiche le pack recommandé (nom + prix création + prix mensuel)
- Bouton "Choisir ce pack" → scroll vers #packs + highlight le pack concerné
- Texte explicatif : "Basé sur vos réponses, le Pack [X] correspond le mieux à votre situation."

**État initial** : simulateur masqué derrière un bouton "Trouver mon pack en 30 secondes" pour ne pas imposer.

---

### SECTION 5 : LES 4 PACKS (ancre #packs)

**Layout** : grille 4 colonnes sur desktop (1 sur mobile, 2 sur tablet). Cartes de hauteur égale.

**Comportement** :
- Par défaut : chaque carte affiche nom, prix, 4 bullets clés, CTA
- Toggle "Voir les détails complets" par carte (accordion) qui dévoile :
  - Liste complète inclus / non-inclus
  - Options ajoutables
  - Détails de l'abonnement

**Design des cartes** :
- Pack 1 (Vitrine) : bordure grise standard
- Pack 2 (Vitrine Pro + Blog) : **bordure bleue + badge "Le plus choisi"** (bandeau en haut de carte)
- Pack 3 (Pro Santé) : bordure verte + badge "HDS Inclus"
- Pack 4 (Premium) : bordure dorée/violette + badge "Sur-mesure"

**Prix affichés** :
- Création : gros, gras
- "/mois" : plus petit, sous le prix création
- Mention "Engagement 12 mois" en micro-texte

**CTA par carte** : "Choisir ce pack" (même modal devis, avec champ pack pré-rempli)

**Tableau comparatif** (option toggle sous les cartes) :
- Comparaison côte à côte des 4 packs sur 10 critères (HDS, blog, réservation, rappels, etc.)

---

### SECTION 6 : TÉMOIGNAGES / PREUVES SOCIALES

**Layout** : carousel horizontal (swiper ou custom), 3 témoignages visibles sur desktop.

**Contenu** (si pas de vrai client, créer des études de cas réalistes mais marquées "exemple type") :

> "Avant, je passais 30 min par jour au téléphone. Maintenant, mes patients réservent directement. J'ai gagné 2h par semaine."
> **Marie L., Ostéopathe D.O. — Lyon**

> "Le site était en ligne en 8 jours. La formation de 30 min m'a suffi pour comprendre comment changer un horaire."
> **Thomas B., Kinésithérapeute — Marseille**

> "Nous sommes 4 praticiens dans la maison de santé. La gestion des plannings et les rappels SMS ont changé notre quotidien."
> **Dr. Sarah K., Maison de santé — Nantes**

**Éléments visuels** :
- Avatar (initiales dans un cercle coloré si pas de photo)
- Étoiles 5/5
- Badge métier (petit tag)

**Animation** : défilement auto lent, pause au hover

---

### SECTION 7 : PROCESSUS EN 3 ÉTAPES

**Layout** : timeline horizontale sur desktop, verticale sur mobile.

**Étapes** :
1. **Cadrage** (30 min) — Icône MessageCircle — "Vous nous parlez de votre cabinet. On vous conseille le bon pack."
2. **Création** (5 à 15 jours) — Icône Code — "On construit. Vous validez 2-3 captures d'écran. Pas de surprise."
3. **Mise en ligne** (1 jour) — Icône Rocket — "Formation incluse. Votre site est vivant. On reste disponible."

**Sous chaque étape** : délai estimé + ce que le client doit fournir (textes, photos, logo).

---

### SECTION 8 : FAQ ACCORDION (10 questions ciblées santé)

**Questions obligatoires** :
1. "Mon site doit-il être HDS ?" → Expliquer la nuance (stockage données patients = oui, vitrine simple = non)
2. "Puis-je garder mon Doctolib ?" → Oui, et c'est recommandé
3. "Qui rédige les textes du site ?" → Client par défaut, option rédaction SEO
4. "Et si je veux changer un tarif après ?" → Modifs incluses selon pack
5. "Combien de temps dure la création ?" → 5 jours à 12 semaines selon pack
6. "Mes données sont-elis sécurisées ?" → SSL, hébergement France, HDS si besoin
7. "Puis-je payer en plusieurs fois ?" → 40/30/30
8. "Que se passe-t-il si je veux arrêter l'abonnement ?" → Préavis 30 jours, export du site possible
9. "Le site est-il référencé sur Google ?" → SEO local inclus, Google Business Profile connecté
10. "Proposez-vous la prise de rendez-vous en ligne ?" → Oui dès le Pack Essentiel, sinon lien Doctolib

**Comportement** : 1 question ouverte à la fois, animation smooth height.

---

### SECTION 9 : GARANTIE & RASSURANCE

**Layout** : 3 cartes horizontales.

**Cartes** :
- **"Satisfait ou refait"** : 3 révisions de maquettes sans frais
- **"Pas de surprise"** : Devis signé = prix final. Aucun frais caché.
- **"Accompagnement humain"** : Pas de chatbot opaque. Un interlocuteur dédié.

**Icônes** : RefreshCcw, Lock, UserCheck

---

### SECTION 10 : CTA FINAL ("Prêt à faire découvrir votre cabinet ?")

**Layout** : full-width, fond dégradé bleu médical foncé vers bleu plus clair, texte blanc.

**Contenu** :
- **H2** : "Prêt à faire découvrir votre cabinet sur Google ?"
- **Sous-titre** : "Devis gratuit sous 24h. Sans engagement."
- **CTA Primaire** : "Demander mon devis gratuit" (modal formulaire)
- **CTA Secondaire** : "📞 Ou me téléphoner au 06 XX XX XX XX" (lien tel:)
- **Micro-trust** : "Réponse garantie sous 4h ouvrées"

---

### SECTION 11 : FOOTER SPÉCIFIQUE (optionnel)

- Liens vers mentions légales, politique de confidentialité
- Lien "Espace client" (si applicable)
- Lien "On recrute" (si applicable)

---

## 🎨 DESIGN SYSTEM

### Couleurs
```css
--primary : #0ea5e9;        /* Sky 500 — bleu médical confiance */
--primary-dark : #0369a1;   /* Sky 700 — hover, titres */
--primary-light : #f0f9ff;  /* Sky 50 — fonds sections */
--success : #10b981;        /* Emerald 500 — HDS, badges positifs */
--warning : #f59e0b;        /* Amber 500 — pack recommandé */
--premium : #8b5cf6;        /* Violet 500 — pack premium */
--text : #1e293b;           /* Slate 800 — texte principal */
--text-muted : #64748b;     /* Slate 500 — sous-titres */
--bg : #ffffff;
--bg-alt : #f8fafc;         /* Slate 50 */
--border : #e2e8f0;         /* Slate 200 */
```

### Typographie
```css
--font-sans : 'Inter', system-ui, sans-serif;
--h1 : 3rem (48px), font-weight 800, line-height 1.1;
--h2 : 2.25rem (36px), font-weight 700, line-height 1.2;
--h3 : 1.5rem (24px), font-weight 600;
--body : 1.125rem (18px), line-height 1.7;
--small : 0.875rem (14px);
```

### Composants
- **Boutons** : radius 0.5rem, padding 1rem 2rem, font-weight 600
  - Primaire : fond primary, texte blanc, hover primary-dark + shadow-lg
  - Secondaire : fond transparent, bordure primary, texte primary
- **Cartes** : radius 1rem, fond blanc, border 1px, shadow-sm (hover shadow-md transition)
- **Inputs** : radius 0.5rem, border slate-200, focus ring primary

---

## ⚙️ COMPORTEMENTS INTERACTIFS À IMPLÉMENTER

### 1. Navigation sticky
- Header fixe au scroll avec fond blanc + blur backdrop
- Sur mobile : menu hamburger avec animation slide-in

### 2. Smooth scroll
- Tous les liens ancres (`#packs`, `#faq`, etc.) doivent scroller doucement

### 3. Modal formulaire devis
**Champs obligatoires** :
- Nom prénom (text)
- Métier (select : Ostéopathe, Kiné, Infirmier, Sage-femme, Autre)
- Ville (text)
- Téléphone (tel)
- Email (email)
- Pack intéressé (select pré-rempli si clic depuis une carte)
- Message (textarea, optionnel)
- Checkbox : "J'accepte d'être recontacté(e)"

**Validation** : Zod schema côté client
**Soumission** : console.log() pour l'instant (à brancher sur webhook/email backend plus tard)
**État succès** : message "Merci ! Votre devis arrive sous 24h."

### 4. Highlight pack depuis simulateur
- Quand le simulateur retourne un résultat, le bouton "Choisir ce pack" doit :
  1. Scroller jusqu'à #packs
  2. Ajouter une bordure pulsante (ring-4 ring-primary animate-pulse) sur la carte concernée pendant 3s
  3. Ouvrir l'accordion de cette carte

### 5. Compteur d'urgence (optionnel, test A/B)
- Badge "⚡ 2 places disponibles ce mois-ci" sous le CTA principal
- Doit être crédible (ne pas mentir) — peut être lié à un vrai compteur si tu as un pipeline limité

---

## 🔍 SEO & ACCESSIBILITÉ

### Meta tags
```
title : Création site web pour ostéopathe, kiné & infirmier | [Nom Agence]
description : Sites web conformes RGPD pour les professionnels de santé. Vitrine, réservation en ligne, HDS. Devis gratuit sous 24h.
```

### Schema.org (JSON-LD dans <head>)
- `LocalBusiness` (ou `MedicalBusiness` si applicable)
- `Service` pour chaque pack
- `FAQPage` pour la section FAQ

### Accessibilité
- Contraste WCAG AA minimum sur tout le texte
- Boutons avec aria-label clairs
- Formulaire avec labels associés aux inputs
- Navigation clavier fonctionnelle (focus visible)

---

## 📁 FICHIER À GÉNÉRER

Génère un fichier unique `SantePage.tsx` (ou `page.tsx` si Next.js) qui contient :
- Toutes les sections comme composants internes (pas de fichiers séparés sauf si nécessaire)
- Les données des packs, FAQ, témoignages dans des constantes en haut du fichier
- Le simulateur comme composant interne avec useState
- Le formulaire modal comme composant interne
- Le design system appliqué via Tailwind uniquement (pas de CSS custom hors Tailwind)

**Livrable** : un fichier prêt à être copié dans un projet Vite React + Tailwind existant. Inclure les instructions d'installation des dépendances manquantes (framer-motion, lucide-react, react-hook-form, zod).

---

## ✅ CHECKLIST DE VALIDATION AVANT LIVRAISON

- [ ] La page s'affiche correctement sur iPhone SE (375px) à 4K (2560px)
- [ ] Le simulateur fonctionne de bout en bout et recommande le bon pack
- [ ] Les accordions packs s'ouvrent/ferment sans bug visuel
- [ ] Le formulaire modal valide les champs et affiche le succès
- [ ] Le smooth scroll fonctionne sur tous les ancres
- [ ] Lighthouse Performance > 90, Accessibilité > 95, SEO > 95
- [ ] Aucune faute d'orthographe dans le copy
- [ ] Les prix affichés correspondent exactement aux 4 packs définis
