# Guide de rédaction d'un article de blog

Ce document décrit les règles à suivre pour publier un nouvel article sans casser les schémas SEO. **Lire intégralement avant le premier article**.

---

## 1. Architecture (à connaître avant d'écrire)

Un article = 3 fichiers MDX, un par langue :

```
project/content/blog/<slug>.mdx          → version FR (langue source)
project/content/blog/en/<slug>.mdx       → version EN
project/content/blog/es/<slug>.mdx       → version ES
```

Le `slug` est identique dans les 3 langues (URL : `/{lang}/blog/<slug>`).

Le code (`app/[lang]/blog/[slug]/page.tsx`) s'occupe **automatiquement** de :
- générer les meta tags (titre/description/OG/Twitter) via IA,
- injecter le schéma JSON-LD `Article`,
- injecter le schéma JSON-LD `FAQPage` à partir du frontmatter `faq:`,
- créer les `hreflang` FR/EN/ES.

**Tu n'as donc rien à coder dans le MDX au-delà du contenu rédactionnel.**

---

## 2. Frontmatter — modèle à copier

```yaml
---
title: "Titre de l'article (≤ 65 caractères)"
excerpt: "Résumé de 140-160 caractères qui sera utilisé comme description SEO et dans les listings."
date: "2026-04-26"
category: "IA"               # IA | Web | Automatisation | Mobile | Stratégie
author: "NeuraWeb"
image: "/assets/blog/<slug>.webp"   # 1200x630px, format webp
tags:
  - "IA"
  - "Sitio Web"              # 4 à 6 tags max
featured: true               # true uniquement pour 2-3 articles "vitrine"
faq:
  - question: "Question 1 ?"
    answer: "Réponse 1, complète, 2-3 phrases."
  - question: "Question 2 ?"
    answer: "Réponse 2."
  # 5 questions = sweet spot pour les rich snippets
---
```

### Règles strictes

| Champ | Règle |
|---|---|
| `title` | ≤ 65 caractères, contient le mot-clé principal au début |
| `excerpt` | 140-160 caractères, doit pouvoir tenir seul comme meta description |
| `date` | Format `YYYY-MM-DD`, pas dans le futur sauf publication programmée |
| `image` | Toujours en `.webp`, dimensions 1200×630, dans `/public/assets/blog/` |
| `tags` | 4 à 6 maximum, en majuscule de phrase, traduits dans chaque langue |
| `faq` | **Optionnel mais fortement recommandé** — 4 à 6 Q/R, génère le schéma FAQPage automatiquement |

---

## 3. Règles ABSOLUES sur les schémas JSON-LD

### ❌ Ne JAMAIS faire dans le MDX

```mdx
<!-- INTERDIT -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  ...
}
</script>
```

**Pourquoi c'est interdit** :
1. Le schéma FAQ est déjà généré automatiquement par le code à partir du frontmatter `faq:`. Coller un `<script>` crée un **doublon** → Google rejette.
2. MDX = Markdown + JSX. Le `{` du JSON est interprété comme du **JavaScript**. Le `<script>` est rendu en HTML brut moche avec `<br />` au lieu de retours à la ligne → Google voit du JSON corrompu.

### ✅ Pour ajouter un schéma FAQ

Mets uniquement le bloc `faq:` dans le frontmatter. C'est tout.

### ✅ Section FAQ visible : générée automatiquement

**Tu n'écris PAS la section FAQ visible dans le MDX.** Le composant [BlogPostClient](../components/blog-post-client.tsx) la génère automatiquement à partir du `faq:` du frontmatter.

Pourquoi : Google exige que le **texte exact** des Q/R du schéma JSON-LD soit visible sur la page. Si tu écris la FAQ à la main, le moindre mot d'écart entre frontmatter et visible (un "sur les leads générés" en trop, un guillemet `"` au lieu de `«`, une reformulation) fait que Google marque les questions comme "éléments non valides" dans GSC.

Une seule source de vérité = `faq:` dans le frontmatter. Le rendu visible et le schéma JSON-LD sortent du même endroit, ils restent toujours synchronisés.

**Donc dans ton MDX : pas de `## FAQ`, pas de `### Question`, rien.** Tu finis ton article par ta conclusion / CTA, c'est tout.

---

## 4. Markdown — éléments supportés

Le parser ([components/blog-post-client.tsx](../components/blog-post-client.tsx)) supporte :

| Syntaxe | Rendu |
|---|---|
| `## Titre` | H2 (titre de section) |
| `### Titre` | H3 (sous-section, utilisé pour les questions FAQ) |
| `**gras**` | **Texte en gras** |
| `*italique*` | *Italique* |
| `` `code` `` | Code inline |
| ```` ```lang\ncode\n``` ```` | Bloc de code |
| `> citation` | Blockquote (utile pour CTA encadrés) |
| `- item` | Liste à puces |
| `\| col1 \| col2 \|` | Tableau |
| `[texte](url)` | Lien (interne `/contact` ou externe) |

### Limitations
- Pas de composants React custom : MDX est lu en raw et parsé en HTML, pas compilé.
- Pas d'images inline dans le corps (utilise uniquement l'`image:` du frontmatter pour le hero).
- Pas de `<script>`, `<style>`, ou autre balise HTML brute.

---

## 5. Contenu — structure recommandée

```markdown
[Hook 1-2 phrases qui posent le problème ou cite un chiffre choc]

## 1. [Premier point]

[3-5 paragraphes, exemples concrets, chiffres mesurés]

## 2. [Deuxième point]

...

## 7. [Septième point — articles "listicle" 5-7 points convertissent le mieux]

## [Conclusion : par où commencer / méthode]

> [CTA encadré : appel à un audit gratuit, lien vers /contact]
```

**La section FAQ visible apparaîtra automatiquement sous l'article** à partir du `faq:` du frontmatter. Tu n'as pas à l'écrire dans le markdown.

**Longueur cible** : 1500-2500 mots pour un article SEO solide. Le `readTime` est calculé automatiquement (200 mots/min).

---

## 6. Workflow de publication

```
1. Rédiger l'article en français → project/content/blog/<slug>.mdx
2. Traduire vers EN → project/content/blog/en/<slug>.mdx (slug identique)
3. Traduire vers ES → project/content/blog/es/<slug>.mdx (slug identique)
4. Ajouter l'image dans /public/assets/blog/<slug>.webp (1200×630)
5. Ajouter les 3 URLs dans project/app/sitemap.ts
6. Ajouter les 3 URLs dans project/scripts/indexing.js
7. npm run typecheck && npm run build  → vérifier qu'il n'y a pas d'erreur
8. git commit + push → déploiement Vercel
9. Dans Google Search Console : "Demander une indexation" pour les 3 URLs
10. (Optionnel) npm run indexing → notifie l'API Indexing de Google
```

---

## 7. Checklist avant `git commit`

- [ ] 3 fichiers MDX créés (FR, EN, ES) avec slug identique
- [ ] Frontmatter complet : `title`, `excerpt`, `date`, `category`, `image`, `tags`, `faq` (optionnel)
- [ ] **Aucun bloc `<script>`** dans les MDX
- [ ] **Aucune section `## FAQ` écrite à la main** (générée automatiquement depuis `faq:`)
- [ ] Image `.webp` 1200×630 ajoutée dans `/public/assets/blog/`
- [ ] URLs ajoutées dans `app/sitemap.ts` et `scripts/indexing.js`
- [ ] `npm run typecheck` passe sans erreur
- [ ] `npm run build` passe sans erreur
- [ ] L'article s'affiche correctement en local sur `/fr/blog/<slug>`, `/en/blog/<slug>`, `/es/blog/<slug>`

---

## 8. Validation post-déploiement

1. **Google Rich Results Test** : https://search.google.com/test/rich-results
   - Coller `https://neuraweb.tech/fr/blog/<slug>`
   - Vérifier : 1 schéma `Article` + 1 schéma `FAQPage` (si frontmatter `faq:`) → **pas plus, pas moins**
   - Aucune erreur, aucun avertissement
2. **GSC → Inspection de l'URL** : "Demander une indexation"
3. **Attendre 24-48h** puis vérifier que l'URL apparaît dans GSC > Pages > Indexées

---

## 9. Pièges connus

| Symptôme dans GSC | Cause | Fix |
|---|---|---|
| "FAQ : N éléments non valides" | Soit bloc `<script>` parasite dans le MDX (doublon), soit section `## FAQ` écrite à la main qui ne reproduit pas exactement le texte du frontmatter | Supprimer le `<script>` ET la section `## FAQ` du MDX. Le composant `BlogPostClient` rend la FAQ tout seul depuis le frontmatter, garantissant la correspondance exacte avec le schéma JSON-LD. |
| "Type de valeur incorrect" sur schéma | MDX interprète `{` comme JSX | Pas de `<script>` JSON-LD dans le MDX |
| "L'avis contient plusieurs avis cumulés" | `localBusinessSchema` injecté hors des pages "fiche entreprise" | Déjà corrigé : ce schéma n'est plus injecté que sur home, /contact, /equipe |
| Article non indexé après 1 semaine | URL absente du sitemap ou de `indexing.js` | Vérifier les 2 fichiers, relancer `npm run indexing` |
| Hero image floue / mauvais ratio | Dimensions ≠ 1200×630 | Recompresser au bon format |

---

## TL;DR

**2 règles à retenir** :
1. Pour la FAQ, tu écris uniquement `faq:` dans le frontmatter. Le code génère **à la fois** le schéma JSON-LD et la section visible.
2. **Aucune balise `<script>` dans le MDX. Aucune section `## FAQ` à la main.** Jamais.
