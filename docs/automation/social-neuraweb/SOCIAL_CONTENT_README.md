# Génération de contenu social (LinkedIn / Facebook) depuis le blog

Pipeline V1 : **commit d'un article `.mdx` → GitHub Action → webhook n8n → Gemini 2.5 Flash (free tier) → Supabase (`status = pending`)**.

À distinguer du pipeline **publication d'articles** (`README.md` / `n8n-blog-publish-workflow.json`), qui fait l'inverse : Sheet → commit MDX. Ici on part d'un article **déjà publié** pour en dériver les posts sociaux, soumis à validation manuelle avant diffusion.

```text
git push main (project/content/blog/**/*.mdx)
        ↓
GitHub Action  .github/workflows/social-content.yml
   (git diff → fichiers ajoutés/modifiés → POST par article)
        ↓
Webhook n8n  POST /webhook/social-content   (en-tête x-webhook-secret)
        ↓
Parse & Validate  (frontmatter + nettoyage MDX)
        ↓
Gemini 2.5 Flash  (responseMimeType: application/json)
        ↓
Parse AI JSON
        ↓
Supabase upsert  generated_social_posts   (unique slug,lang → idempotent)
        ↓
status = pending
```

## Fichiers

| Fichier | Rôle |
|---|---|
| `.github/workflows/social-content.yml` | Déclencheur GitHub Action (push sur `main`, paths `project/content/blog/**/*.mdx`). |
| `.github/scripts/social-notify.mjs` | Lit chaque `.mdx` changé, POST vers le webhook n8n (sans dépendance, Node 20). |
| `project/docs/automation/n8n-social-content-workflow.json` | Workflow n8n importable (*Import from File*). |
| `project/docs/automation/social-content-supabase.sql` | Schéma de la table `generated_social_posts`. |

## Adaptations au repo réel (≠ plan initial)

- **Pas de champ `published` / `socialGenerated` / `coverImage` / `slug`** dans le frontmatter. On utilise les vrais champs : `title`, `excerpt`, `image`. Le **slug = nom du fichier**, la **langue = sous-dossier** (`en/`, `es/`, sinon `fr`).
- **Chemin réel `project/content/blog/**`** (l'app vit sous `project/`).
- **Idempotence sans write-back git** : contrainte `unique(slug, lang)` + upsert Supabase (`Prefer: resolution=merge-duplicates`). Rejouer le même article n'écrase que sa ligne, sans nouveau commit. Du coup on traite indifféremment les fichiers **ajoutés et modifiés** (`--diff-filter=AM`).
- **Mode JSON natif de Gemini** (`responseMimeType: application/json`) au lieu de « réponds uniquement en JSON » → bien plus fiable.
- **Multilingue** : la langue de l'article est passée au prompt, Gemini rédige les posts dans cette langue.

## Mise en place

### 1. Supabase
Exécuter `social-content-supabase.sql` dans Supabase > SQL Editor.

### 2. n8n
1. *Import from File* → `n8n-social-content-workflow.json`.
2. Renseigner les variables d'environnement n8n :
   - `GEMINI_API_KEY` — clé Google AI Studio (gratuite). Modèle `gemini-2.5-flash`.
   - `SUPABASE_URL` — ex. `https://xxxx.supabase.co`.
   - `SUPABASE_SERVICE_KEY` — **service role** key (écrit malgré la RLS). Ne pas utiliser l'anon key.
   - `N8N_WEBHOOK_SECRET` — même valeur que le secret GitHub (vérifié dans le node *Parse & Validate*).
3. Activer le workflow et copier l'URL de production du webhook (`…/webhook/social-content`).

### 3. GitHub
Repo `KushiTdm/Neuraweb-V2` → *Settings > Secrets and variables > Actions* :
- `N8N_WEBHOOK_URL` — l'URL de production du webhook n8n.
- `N8N_WEBHOOK_SECRET` — identique à celle de n8n.

> Si le repo n'a pas encore d'Actions activées, les activer dans *Settings > Actions > General*.

## Tester

- **Manuel** : onglet *Actions > Génération contenu social > Run workflow*, renseigner un chemin dans `files` (ex. `project/content/blog/agents-ia.mdx`).
- **Réel** : committer/modifier un `.mdx` sous `project/content/blog/` sur `main`.
- Vérifier la table `generated_social_posts` : une ligne `status = pending` par article.

## Coûts / limites

- **Gemini free tier** : quotas par minute/jour (suffisant pour ~quelques articles/jour). En cas de `429`, ajouter un node *Wait* ou réduire la fréquence.
- **Validation** : le node *Parse & Validate* lève une erreur (exécution n8n en échec) si `title`/`contenu` manquent — visible dans les exécutions n8n. Pour une gestion plus douce, ajouter un node *IF* + *Respond* d'erreur.
- **Diffusion** : la V1 s'arrête à `status = pending`. La publication réelle (LinkedIn/Facebook API, ou validation via une UI d'admin qui passe `status = approved/published`) est une V2.
- **Sécurité** : le webhook est protégé par un secret partagé d'en-tête, pas par une signature. Suffisant pour un webhook privé ; pour durcir, signer la payload (HMAC) côté Action et vérifier côté n8n.

## Alternative Vercel (écartée)

Un *Deploy Hook* / webhook Vercel se déclenche au build mais **ne fournit pas la liste des fichiers modifiés** : il faudrait recalculer le diff via l'API GitHub depuis une fonction. La GitHub Action a ce diff nativement (`git diff`), d'où le choix. Garder l'option Vercel en tête seulement si tu veux déclencher *après* redeploy réussi plutôt qu'au push.
