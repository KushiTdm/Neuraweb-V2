# Plan de Correction SEO — NeuraWeb V2

> Généré le 2026-04-17 | Mis à jour au fur et à mesure des corrections

---

## Contexte

Le site `neuraweb.tech` n'apparaît pas sur Google pour la recherche "neuraweb" malgré 3 mois d'existence. Audit SEO révèle 37 pages non-indexées sur 53. Ce plan liste tous les bugs identifiés, classés par impact sur l'indexation.

---

## CRITIQUE — Bloque l'indexation

### BUG #1 — SSR bloqué sur les articles de blog ✅ EN COURS

**Fichiers :** `components/blog-post-client.tsx`, `app/[lang]/blog/[slug]/page.tsx`

**Problème :** Le composant `BlogPostClient` utilise un pattern `mounted` state :
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
if (!mounted || !post) { return <skeleton>; }
```
Résultat : Next.js en SSR retourne uniquement le skeleton de chargement. **Googlebot voit un skeleton vide au lieu du contenu de l'article.** Les 27 articles ne sont donc pas indexables par leur contenu.

**Fix :**
- Passer `lang` comme prop depuis le server component (`app/[lang]/blog/[slug]/page.tsx`)
- Remplacer `useLanguage()` par la prop `lang` pour les traductions et formatage de date
- Supprimer le `mounted` state, le `useEffect`, et le early return conditionnel
- Garder uniquement `if (!post) return null;`

**Impact estimé :** Très fort — permet à Googlebot de crawler le vrai contenu des 27 articles

---

### BUG #2 — Timeout Zhipu AI trop court (5s → 12s) ✅ DÉJÀ CORRIGÉ

**Fichiers :** `lib/seo-ai-server.ts`

Timeout augmenté à 12000ms dans la session précédente.

---

### BUG #3 — Fallback SEO générique pour tous les articles ✅ DÉJÀ CORRIGÉ

**Fichiers :** `lib/seo-ai-server.ts`

`buildFallbackSEO()` retournait "Blog - Actualités & Conseils | NeuraWeb" pour tous les articles. Corrigé dans la session précédente pour extraire le titre depuis `customContext`.

---

## HAUTE PRIORITÉ — Impact fort sur les rankings

### BUG #4 — Schema BlogPosting manquant sur les articles ✅ EN COURS

**Fichiers :** `app/[lang]/blog/[slug]/page.tsx`, `lib/seo-ai-server.ts`

**Problème :** `generateJsonLd('WebPage', context)` génère un schema `WebPage` générique. Les articles de blog devraient avoir un schema `BlogPosting` (ou `Article`) pour permettre à Google d'afficher les rich results (date de publication, auteur, etc.).

**Fix :**
- Utiliser `generateArticleSchema()` depuis `lib/structured-data.ts` dans `app/[lang]/blog/[slug]/page.tsx`
- Injecter le JSON-LD dans un `<script type="application/ld+json">` dans le `<head>` via `generateMetadata()` ou directement dans la page

**Impact estimé :** Fort — active les rich results pour les articles (étoiles, date, auteur)

---

### BUG #5 — Chemin image fallback incorrect dans blog-post-client

**Fichiers :** `components/blog-post-client.tsx`

**Problème :**
```tsx
src={post.image || '/og-image.png'}  // ❌ fichier inexistant
```
Le fichier OG image est à `/assets/og-image.png`.

**Fix :**
```tsx
src={post.image || '/assets/og-image.png'}  // ✅
```

**Impact :** Moyen — les articles sans image custom affichent une image cassée

---

## MOYENNE PRIORITÉ — Optimisations SEO

### BUG #6 — reviewCount inconsistant dans structured-data.ts

**Fichiers :** `lib/structured-data.ts`

**Problème :** `reviewCount: '11'` dans les schémas `LocalBusiness` et `ProfessionalService`. À vérifier avec le nombre réel d'avis Google.

**Fix :** Mettre à jour avec le nombre réel d'avis Google Business Profile.

---

### BUG #7 — Middleware de détection langue non actif

**Fichiers :** `proxy.ts` (fonction `proxy` non utilisée), pas de `middleware.ts`

**Problème :** Le fichier `proxy.ts` exporte une fonction middleware et un `config` matcher, mais ce fichier n'est pas reconnu par Next.js comme middleware (doit s'appeler `middleware.ts`). Résultat : la détection de langue via `Accept-Language` header ne fonctionne pas — tous les visiteurs sont redirigés vers `/fr` par `app/page.tsx`.

**Fix :** Créer `middleware.ts` à la racine du projet qui importe et ré-exporte la fonction `proxy`.

**Impact :** Moyen — les visiteurs anglophones/hispanophones arrivent toujours en FR

---

### BUG #8 — Slugs EN/ES non localisés

**Fichiers :** `app/[lang]/equipe/page.tsx`, `app/sitemap.ts`

**Problème :** Les URLs `/en/equipe` et `/es/equipe` utilisent le mot français. Google peut interpréter ça comme du contenu dupliqué ou mal localisé.

- `/en/equipe` → devrait être `/en/team`
- `/es/equipe` → devrait être `/es/equipo`

**Fix :** Créer les routes `/en/team/` et `/es/equipo/` avec redirections 308 depuis les anciennes URLs.

**Impact :** Faible pour l'indexation, mais améliore la cohérence multilingue

---

## BASSE PRIORITÉ — Nicetohave

### BUG #9 — FAQPage schema sur site commercial

**Fichiers :** `lib/structured-data.ts`, `app/[lang]/page.tsx`

**Contexte :** Depuis août 2023, Google n'affiche plus les FAQ rich results pour les sites commerciaux. Le schema est quand même utile pour les LLMs (ChatGPT, Perplexity, etc.).

**Décision :** Garder le schema FAQ — pas de rich result Google, mais bénéfice pour la citation LLM.

---

### BUG #10 — Pages services trop courtes (contenu thin)

**Fichiers :** `app/[lang]/services/page.tsx` et composants services

**Problème :** Pages services estimées à 80-200 mots. Google considère < 300 mots comme "thin content".

**Fix :** Développer les pages services à 800-1500 mots avec :
- Descriptions détaillées de chaque service
- FAQ par service
- Exemples de projets réalisés
- Témoignages clients

---

---

## Plan de demande d'indexation GSC — Vague par vague

> Limite GSC : ~10 URL Inspection requests/jour. Renouveler chaque jour ouvré.
> Prérequis : push Vercel déployé + sitemap.xml resoumis dans GSC (Sitemaps section).
> Pages exclues intentionnellement : `/hotel-form` (noindex), `/admin/hotel-tokens` (admin), APIs.
> Total : 42 pages indexables sur 5 jours.

---

### Jour 1 (2026-04-17) — Pages principales FR + accueil EN/ES

| URL |
|-----|
| `https://neuraweb.tech/fr` |
| `https://neuraweb.tech/fr/services` |
| `https://neuraweb.tech/fr/blog` |
| `https://neuraweb.tech/fr/contact` |
| `https://neuraweb.tech/fr/equipe` |
| `https://neuraweb.tech/fr/booking` |
| `https://neuraweb.tech/en` |
| `https://neuraweb.tech/en/services` |
| `https://neuraweb.tech/es` |
| `https://neuraweb.tech/es/services` |

### Jour 2 (2026-04-18) — Pages principales EN + ES restantes

| URL |
|-----|
| `https://neuraweb.tech/en/blog` |
| `https://neuraweb.tech/en/contact` |
| `https://neuraweb.tech/en/equipe` |
| `https://neuraweb.tech/en/booking` |
| `https://neuraweb.tech/es/blog` |
| `https://neuraweb.tech/es/contact` |
| `https://neuraweb.tech/es/equipe` |
| `https://neuraweb.tech/es/booking` |

### Jour 3 (2026-04-19) — Articles blog FR (8 articles) + 2 EN

| URL |
|-----|
| `https://neuraweb.tech/fr/blog/automatisation-n8n-guide` |
| `https://neuraweb.tech/fr/blog/automatisation-processus-roi` |
| `https://neuraweb.tech/fr/blog/checklist-site-hotelier-performant` |
| `https://neuraweb.tech/fr/blog/integrer-ia-site-web-2025` |
| `https://neuraweb.tech/fr/blog/marketing-digital-ia-automations` |
| `https://neuraweb.tech/fr/blog/nextjs-vs-wordpress-2025` |
| `https://neuraweb.tech/fr/blog/reservations-directes-hotel-sans-commission-ota` |
| `https://neuraweb.tech/fr/blog/site-web-hotel-design-reservations` |
| `https://neuraweb.tech/en/blog/automatisation-n8n-guide` |
| `https://neuraweb.tech/en/blog/automatisation-processus-roi` |

### Jour 4 (2026-04-20) — Articles blog EN restants (6)

| URL |
|-----|
| `https://neuraweb.tech/en/blog/checklist-site-hotelier-performant` |
| `https://neuraweb.tech/en/blog/integrer-ia-site-web-2025` |
| `https://neuraweb.tech/en/blog/marketing-digital-ia-automations` |
| `https://neuraweb.tech/en/blog/nextjs-vs-wordpress-2025` |
| `https://neuraweb.tech/en/blog/reservations-directes-hotel-sans-commission-ota` |
| `https://neuraweb.tech/en/blog/site-web-hotel-design-reservations` |

### Jour 5 (2026-04-22) — Articles blog ES (8)

| URL |
|-----|
| `https://neuraweb.tech/es/blog/automatisation-n8n-guide` |
| `https://neuraweb.tech/es/blog/automatisation-processus-roi` |
| `https://neuraweb.tech/es/blog/checklist-site-hotelier-performant` |
| `https://neuraweb.tech/es/blog/integrer-ia-site-web-2025` |
| `https://neuraweb.tech/es/blog/marketing-digital-ia-automations` |
| `https://neuraweb.tech/es/blog/nextjs-vs-wordpress-2025` |
| `https://neuraweb.tech/es/blog/reservations-directes-hotel-sans-commission-ota` |
| `https://neuraweb.tech/es/blog/site-web-hotel-design-reservations` |

---

## Résumé des corrections

| # | Bug | Priorité | Statut |
|---|-----|----------|--------|
| 1 | SSR bloqué blog-post-client.tsx | CRITIQUE | ✅ CORRIGÉ |
| 2 | Timeout Zhipu 5s | CRITIQUE | ✅ CORRIGÉ |
| 3 | Fallback SEO générique articles | CRITIQUE | ✅ CORRIGÉ |
| 4 | Schema BlogPosting manquant | HAUTE | ✅ CORRIGÉ |
| 5 | Image fallback path incorrect | HAUTE | ✅ CORRIGÉ |
| 6 | reviewCount inconsistant | MOYENNE | ✅ CORRIGÉ (11 → 16) |
| 7 | Middleware langue non actif | MOYENNE | ✅ DÉJÀ ACTIF (proxy.ts = middleware Vercel) |
| 8 | Slugs EN/ES non localisés | MOYENNE | ✅ CORRIGÉ (redirections) |
| 9 | FAQPage schema commercial | BASSE | ⬜ GARDER (bénéfice LLM) |
| 10 | Pages services thin content | BASSE | ⬜ TODO |
