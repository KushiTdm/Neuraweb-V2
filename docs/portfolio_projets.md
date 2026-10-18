# Portfolio NeuraWeb

Réalisations affichées dans la section `#portfolio` de la page d'accueil
([components/sections/portfolio-section.tsx](../components/sections/portfolio-section.tsx)).

Les visuels sont dans `public/assets/portfolio/` — captures 2880×1800 en WebP (q78–80).
Secteurs et descriptions sont traduits dans les 4 locales (`fr`, `en`, `es`, `vi`) sous les clés
`portfolio.<projet>.sector` / `.desc`. Les noms propres restent dans le composant, non traduits.

## Réalisation phare — NeuraWeb Connected Suite

Démo interactive maison, mise en avant en pleine largeur au-dessus de la grille.

- **Lien** : https://demo.neuraweb.fr — hub collectivité : `/c/collectivite`
- **Source** : dossier `Demo/` à la racine du repo (projet Vercel distinct)
- **Stack** : Next.js 16, React 19, TypeScript, Tailwind v4, Zustand v5 (`persist`), PWA
- **Ce qu'elle prouve** : back-office métier + application client partageant le même état en
  temps réel, sur 3 métiers (collectivité, restaurant, hôtel). C'est la seule réalisation qui
  démontre le mobile, le back-office et la synchro — d'où le traitement en bloc phare.
- **Contenu** : tout est mocké (aucun back-end, IA simulée). Bouton « Mode présentation »
  pour un déroulé mains libres.

## Réalisations clientes

| Projet | Secteur | Lien | Stack |
|---|---|---|---|
| Maison Éclat | Hôtellerie de luxe | https://maison-eclat.san3neb.workers.dev | React 18, Vite, Tailwind, Supabase |
| L'Orée | Spa & bien-être | https://loree-spa.san3neb.workers.dev | Next.js 15, React 19, GSAP |
| The Box CrossFit | Sport & fitness | https://project-crossfit.san3neb.workers.dev | React 18, Vite, Tailwind, Supabase |
| UrbX | E-commerce mobilité | https://urbx.san3neb.workers.dev | React 18, Vite, GSAP, Supabase |
| Le Jardin d'Or | Restaurant (1 modèle sur 7, voir `/restaurants`) | https://restaurants-jardindor.vercel.app | — |
| OstéoParis | Santé | https://neuraweb-sante.netlify.app | Vite + React |
| Sin Fronteras Tours | Tourisme | https://traveltour-agency.netlify.app | Vite + React |
| Minimal Store | E-commerce | https://neuraweb-ecommerce.netlify.app | Vite + React |

Remplacés en octobre 2026 : Arthan Boutique Hotel et Hostal Paradis (→ Maison Éclat), Lūm (→ L'Orée).
Captures 1280×800 dans `public/assets/portfolio/`. Présentation : carrousel automatique (motion, pause au survol/focus, rail manuel si `prefers-reduced-motion`).

## Retirés

- **OstéoCanin** (`osteocanin.onrender.com`) — service Render suspendu, renvoie 503
  « This service has been suspended by its owner ». Retiré de la section et l'asset
  `public/assets/osteoCanin/` supprimé (août 2026).
- **FitPro / Fitness & Happiness** (`fitnessandhappiness.netlify.app`) — toujours en ligne (200),
  simplement absent de la sélection actuelle. Réintégrable si besoin d'un 7ᵉ projet.

## Correctifs à faire sur les démos elles-mêmes

Repérés en auditant les sites (à corriger dans leurs repos respectifs, pas ici) :

- **OstéoParis** : `contact@osteeoparis.fr` — faute (double « e ») présente dans la barre
  supérieure **et** dans le bloc contact. Par ailleurs le praticien « Arthur Pales » est décrit
  avec des accords féminins (« Convaincue… j'ai fondé », « Diplômée du Collège Ostéopathique »).
- **Lūm** : `<html lang="en">` alors que tout le contenu est en français ; `<title>` = « Lūm Salon
  Interactive Website » ; aucune `meta description`.
- **Arthan** : le crédit en pied de page pointe vers **NeuraWeb.tech** — ancien domaine. Le
  canonique est `neuraweb.fr` depuis juillet 2026.

## Manques identifiés

Voir [prompts-portfolio.md](./prompts-portfolio.md) pour les briefs de création détaillés.

Par ordre de priorité : automatisation/IA appliquée (le différenciateur n°1, sans aucune preuve
visuelle aujourd'hui), restaurant en vitrine cliente, artisan/BTP local, immobilier, et un
dashboard SaaS métier qui justifie le pack Premium (sur mesure, sur devis).
