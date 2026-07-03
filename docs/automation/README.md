# Automatisation — Publication d'articles de blog (n8n)

Pipeline : **Routine Claude (veille quotidienne) → Google Sheet → n8n → commit GitHub → redeploy Vercel → IndexNow → campagne newsletter (en attente) → validation sur l'app mobile → envoi (immédiat ou programmé)**.

Le blog est *file-based* (MDX dans `content/blog/`). Vercel a un système de fichiers en lecture seule au runtime : on ne peut donc pas écrire un article via une route API. **Publier = committer un fichier `.mdx` dans le repo GitHub `KushiTdm/Neuraweb-V2`**, ce qui déclenche le redeploy. Les pages blog (`revalidate = 86400`, `dynamicParams` par défaut `true`) et le `sitemap.ts` lisent automatiquement les fichiers MDX — aucun autre fichier à modifier.

**Aucun email n'est jamais envoyé automatiquement.** La publication crée seulement une campagne `pending_review` ; l'envoi (immédiat ou programmé à une date/heure précise) nécessite une validation explicite depuis l'app mobile (onglet Newsletter) — voir `app/api/mobile/newsletter/campaigns/[id]/route.ts`.

2 fichiers importables (n8n → *Import from File*) :
- [`n8n-blog-publish-workflow.json`](./n8n-blog-publish-workflow.json) — publication + création de la campagne en attente.
- [`n8n-newsletter-scheduler-workflow.json`](./n8n-newsletter-scheduler-workflow.json) — déclenche l'envoi réel des campagnes programmées arrivées à échéance (tourne toutes les 5 min).

## 1. Schéma du Google Sheet (feuille `Contenu`)

La routine Claude écrit une ligne par contenu généré (posts X, Facebook **et** articles de blog). Le workflow ne traite que les lignes `type = blog` et `status = ready`.

| Colonne | Oblig. (blog) | Description |
|---|---|---|
| `id` | ✅ | Identifiant unique de ligne (sert au write-back du statut) |
| `type` | ✅ | `blog` \| `x` \| `facebook` |
| `status` | ✅ | `draft` → `ready` (à publier) → `published` / `error` |
| `lang` | – | `fr` (défaut) \| `en` \| `es` |
| `slug` | – | Auto-généré depuis `title` si vide |
| `title` | ✅ | Titre de l'article (H1) |
| `seo_title` | – | Titre SEO court (≤ ~55 car.), sinon dérivé du titre |
| `excerpt` | ✅ | Résumé (≈ 130–150 car., sert à la meta description) |
| `category` | ✅ | Ex. `Automatisation`, `IA`, `Web` |
| `tags` | – | Séparés par virgules : `n8n, Automatisation, No-Code` |
| `image` | – | Chemin/URL ; défaut `/assets/blog/<slug>.webp` |
| `featured` | – | `TRUE` / `FALSE` |
| `faq` | – | JSON : `[{"question":"…","answer":"…"}]` (génère le schema FAQPage) |
| `content` | ✅ | Corps de l'article en Markdown/MDX |
| `date` | – | `YYYY-MM-DD` ; défaut = aujourd'hui |
| `published_at`, `published_url` | – | Écrits par le workflow |

> ⚠️ L'image `image` doit exister dans `public/assets/blog/`. La routine Claude ne génère que du texte : prévoir soit un visuel uploadé séparément, soit une image par défaut. Tant que le `.webp` n'existe pas, l'article s'affiche mais l'OG image sera cassée.

## 2. Configuration n8n

Credentials à créer puis associer aux nodes (remplacer les `id: "REMPLACER"`) :
- **Google Sheets OAuth2** — lecture + write-back du statut.
- **GitHub** (Personal Access Token, scope `repo`) — commit du fichier MDX.

Variables d'environnement n8n :
- `NEURAWEB_SHEET_ID` — ID du Google Sheet.
- `INDEXNOW_KEY` — nom de la clé IndexNow (= nom des fichiers `.txt` déjà dans `public/`, ex. `12d2379a1e5244c9b57051c18690e055`).
- `NEWSLETTER_NOTIFY_SECRET` — doit être identique à la variable Vercel du même nom. Sert à authentifier les deux appels HTTP newsletter (`/api/newsletter/campaigns` et `/api/newsletter/process-scheduled`).

## 3. Étapes du workflow

1. **Schedule Trigger** (tous les jours 9h) — remplaçable par un Webhook si la routine doit déclencher à la demande.
2. **Lire le Google Sheet** — feuille `Contenu`.
3. **Filter** `type=blog & status=ready`.
4. **Code « Construire le MDX »** — valide les champs obligatoires (mêmes règles que `lib/mdx.ts → validatePostFrontmatter`), génère slug + `readTime`, sérialise un frontmatter YAML compatible `gray-matter`, calcule le chemin (`project/content/blog/<lang>/<slug>.mdx`).
5. **Filter** `ok = true` (les lignes invalides sont écartées avec leurs `errors`).
6. **GitHub – create file** → commit sur `main` → redeploy Vercel.
7. **Google Sheets – update** → `status = published`, `published_at`, `published_url`.
8. **HTTP – IndexNow** (optionnel) → ping moteurs. N'est utile qu'après le redeploy (ajouter un node *Wait* ~2–3 min si nécessaire).
9. **HTTP – Créer la campagne newsletter (à valider)** → `POST /api/newsletter/campaigns` avec `{ slug, lang }` et l'en-tête `x-webhook-secret`. Crée une ligne `pending_review` dans `newsletter_campaigns` — **n'envoie aucun email**. Best-effort : une erreur ici ne bloque pas le reste du workflow.
10. **Set « Sortie JSON »** → objet de sortie final.

### Workflow 2 — `n8n-newsletter-scheduler-workflow.json`

Tourne en continu (toutes les 5 min), indépendamment du workflow de publication :
1. **Schedule Trigger** (5 min).
2. **HTTP – Traiter les campagnes dues** → `POST /api/newsletter/process-scheduled`. Cherche les campagnes `status = scheduled` dont `scheduled_at` est passé et déclenche leur envoi réel (voir `lib/newsletter-campaigns.ts → sendCampaign`). Ne fait rien si aucune campagne n'est due.

### Validation côté app mobile

Depuis l'onglet **Newsletter** du cockpit (`app-mobile/`), chaque campagne `pending_review` peut être :
- **Approuvée et envoyée immédiatement** — déclenche l'envoi réel tout de suite (`action: 'approve'`).
- **Programmée** à un jour/heure précis — passe en `status = scheduled`, sera envoyée par le workflow 2 dès l'échéance atteinte (`action: 'schedule'`).
- **Annulée** — aucun envoi n'aura jamais lieu (`action: 'cancel'`).

## 4. Sortie attendue (JSON)

Chaque article publié produit :

```json
{
  "ok": true,
  "slug": "automatiser-veille-ia-n8n",
  "lang": "fr",
  "path": "project/content/blog/automatiser-veille-ia-n8n.mdx",
  "url": "https://neuraweb.tech/fr/blog/automatiser-veille-ia-n8n",
  "commit_url": "https://github.com/KushiTdm/Neuraweb-V2/commit/…",
  "published_at": "2026-05-29T09:00:12.000Z",
  "frontmatter": {
    "title": "…", "seoTitle": "…", "excerpt": "…", "date": "2026-05-29",
    "category": "Automatisation", "author": "NeuraWeb",
    "image": "/assets/blog/automatiser-veille-ia-n8n.webp",
    "tags": ["n8n", "IA", "Veille"], "featured": false, "faq": []
  }
}
```

Ligne invalide (non publiée) :

```json
{ "ok": false, "rowId": "42", "slug": null, "errors": ["excerpt manquant", "content (corps MDX) manquant"] }
```

## 5. Limites / pour aller plus loin

- **Upsert** : le node GitHub `create` échoue si le fichier existe déjà. Pour ré-publier un slug, utiliser `operation: edit` (nécessite le `sha`), ou passer par un node HTTP `PUT /repos/{owner}/{repo}/contents/{path}`.
- **Traductions EN/ES** : publier un MDX du même slug dans `content/blog/en|es/`. Tant qu'une langue manque, le guard hreflang de `app/[lang]/blog/[slug]/page.tsx` n'émet pas d'alternate cassé (cf. `CLAUDE.md`).
- **Images** : brancher en amont un node de génération/upload d'image vers `public/assets/blog/<slug>.webp` (commit séparé), ou imposer une image par défaut.
