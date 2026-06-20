# Prompt — App iOS Flutter « NeuraWeb Social Studio »

> Prompt prêt à coller dans un outil de génération de code (Claude Code, etc.).
> Stack imposée : **Flutter / Dart**. Publication déléguée à **n8n** (l'app ne fait que changer le statut).

---

## MISSION

Construis une application mobile **iOS en Flutter** nommée **NeuraWeb Social Studio**. Elle permet à un administrateur (moi) de **consulter, valider/rejeter et éditer (manuellement ou via IA)** les publications sociales (LinkedIn + Facebook) générées automatiquement à partir des articles de blog, stockées dans **Supabase**.

L'app **ne publie pas elle-même** sur les réseaux : valider = passer le statut à `approved`. Un workflow **n8n** détecte ce changement et publie via les APIs LinkedIn/Facebook (hors périmètre de cette app). L'app est donc un outil de **revue + édition assistée par IA**.

## CONTEXTE DU PIPELINE (pour comprendre, ne pas réimplémenter)

`commit article .mdx → GitHub Action → webhook n8n → Gemini 2.5 Flash → table Supabase generated_social_posts (status=pending)`.

Cette app intervient **après** : elle lit les lignes `pending`, me laisse les revoir et les valider.

## STACK TECHNIQUE IMPOSÉE

- **Flutter** (dernière stable, Dart 3, null-safety), cible **iOS 15+**.
- **supabase_flutter** (auth + Postgres + Realtime).
- **flutter_riverpod** pour le state management.
- **go_router** pour la navigation.
- **dio** (ou `http`) pour l'appel au webhook n8n d'édition IA.
- **flutter_dotenv** pour la config (`.env`), fournir un `.env.example`.
- Architecture en couches : `data` (modèles + repositories Supabase), `application` (providers Riverpod), `presentation` (écrans/widgets). Pas de logique métier dans les widgets.

## MODÈLE DE DONNÉES — table `public.generated_social_posts`

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `slug` | text | identifiant article (= nom du fichier .mdx) |
| `lang` | text | `fr` \| `en` \| `es` |
| `title` | text | titre de l'article |
| `image` | text | **chemin relatif** ex. `/assets/blog/agents-ia.webp` |
| `facebook_hook` | text | accroche FB |
| `facebook_post` | text | post FB complet |
| `linkedin_hook` | text | accroche LinkedIn |
| `linkedin_post` | text | post LinkedIn complet |
| `status` | text | `pending` \| `approved` \| `published` \| `rejected` |
| `source_path` | text | chemin du .mdx source |
| `source_commit` | text | SHA du commit déclencheur |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | maintenu par trigger |

Génère le modèle Dart `SocialPost` correspondant (immutable, `fromJson`/`toJson`, `copyWith`), avec un enum `PostStatus` et un enum `Lang`.

## AUTHENTIFICATION & SÉCURITÉ (impératif)

- Connexion via **Supabase Auth** (email + mot de passe, un seul compte admin). Écran de login obligatoire, session persistée, auto-login si session valide, logout.
- L'app utilise **uniquement l'anon key** (jamais la service role key).
- **Aucune clé Gemini dans l'app** : l'édition IA passe par un webhook n8n (voir plus bas).
- La RLS est activée sur la table ; ajoute (dans la doc/README) les policies SQL nécessaires :

```sql
-- L'app mobile lit et met à jour via un compte Supabase Auth.
create policy "admin read"   on public.generated_social_posts
  for select to authenticated using (true);
create policy "admin update" on public.generated_social_posts
  for update to authenticated using (true) with check (true);
```

## ÉCRANS & PARCOURS

### 1. Login
Email/mot de passe, gestion d'erreur (identifiants invalides), état de chargement.

### 2. Liste (feed)
- Liste des posts triés par `created_at` desc.
- **Filtres** : par `status` (segmented control : À valider / Validés / Publiés / Rejetés / Tous) et par `lang` (chips fr/en/es).
- Chaque carte : `title`, badge langue, **chip de statut coloré**, extrait du `facebook_post` ou `linkedin_post`, date relative, miniature image (voir résolution d'URL).
- **Pull-to-refresh** + **Realtime Supabase** (mise à jour live quand n8n change un statut en `published`).
- État vide (« Aucun post à valider ») et skeleton de chargement.
- Tap → écran Détail.

### 3. Détail
- En-tête : titre, langue, statut, lien/slug de l'article source.
- **Onglets Facebook / LinkedIn**. Pour chaque plateforme : afficher `hook` et `post`, avec **compteur de mots/caractères** et rappel des cibles (FB 120-180 mots ; LinkedIn 300-500 mots).
- Aperçu de l'`image`.
- Barre d'actions : **Approuver** (→ `approved`), **Rejeter** (→ `rejected`), **Éditer** (manuel), **Éditer avec IA**.
- **Optimistic UI** sur le changement de statut + rollback en cas d'échec, toast de confirmation.
- Si `status == published` : actions de validation désactivées (lecture seule), bandeau « Déjà publié ».

### 4. Édition manuelle
- Champs éditables : `hook` et `post` de la plateforme courante.
- Sauvegarde → `update` Supabase, retour au Détail. Bouton Annuler. Détection des modifs non sauvegardées.

### 5. Édition avec IA
- Sélection de la cible (plateforme + champ : hook ou post).
- **Instructions rapides** (chips) : « Raccourcir », « Plus direct », « Ajouter un CTA », « Plus pro », « Corriger l'orthographe » + un champ **instruction libre**.
- Appel au **webhook n8n d'édition IA** (contrat ci-dessous), spinner pendant la génération.
- Affichage **avant / après** côte à côte ; boutons **Remplacer** (écrit le texte révisé dans le champ d'édition), **Régénérer**, **Annuler**. Le remplacement n'est persisté en base qu'après validation utilisateur.
- Gérer erreurs/timeout (60 s) et quota Gemini (`429` → message « réessaie dans un instant »).

## CONTRAT — Webhook n8n d'édition IA

L'app **POST** vers `N8N_REFINE_URL` (`.env`), en-tête `x-app-secret: <APP_SECRET>`.

Requête :
```json
{
  "platform": "linkedin",          // "facebook" | "linkedin"
  "field": "post",                 // "hook" | "post"
  "lang": "fr",
  "current": "texte actuel à retravailler",
  "instruction": "Raccourcis à ~250 mots et ajoute un CTA vers /booking",
  "title": "Titre de l'article",
  "excerpt": "Résumé de l'article"
}
```
Réponse attendue :
```json
{ "ok": true, "revised": "nouveau texte généré" }
```
> Inclure dans le README un mini-workflow n8n d'exemple (Webhook → Code build prompt → Gemini `responseMimeType:text/plain` → Respond `{ok, revised}`), pour garder la clé Gemini côté serveur.

## RÉSOLUTION DE L'IMAGE

`image` est un **chemin relatif**. Construire l'URL absolue avec une base configurable (`.env` `SITE_BASE_URL=https://neuraweb.tech`) : `SITE_BASE_URL + image`. Placeholder si l'image est absente/cassée.

## DESIGN / BRANDING

- Palette de marque NeuraWeb : **indigo (primaire), violet, cyan, rose** (identité 2026 orientée navy / sky / cyan). Récupérer les valeurs exactes dans `project/tailwind.config.ts` et les transposer en `ThemeData`.
- UI **épurée, cartes, coins arrondis, ombres douces**, support clair/sombre, typographie type SF Pro. Chips de statut codées couleur (pending=ambre, approved=vert, published=bleu, rejected=rouge).
- Animations légères (transitions, feedback de tap). Pas de surcharge.

## QUALITÉ / ROBUSTESSE

- États **loading / empty / error** sur chaque écran, retry.
- Gestion offline (message clair, pas de crash).
- Optimistic updates + rollback.
- Pas de secret en dur ; tout via `.env`.
- Code typé, commenté là où utile, `flutter analyze` sans warning.

## STRUCTURE PROJET ATTENDUE

```
lib/
  main.dart
  core/            (theme, config/env, router, constants)
  data/            (models/social_post.dart, repositories/social_repository.dart, services/supabase, services/ai_refine)
  application/     (providers Riverpod : auth, posts_list, post_detail, ai_refine)
  presentation/
    auth/          (login_screen)
    feed/          (feed_screen, widgets/post_card, widgets/filters)
    detail/        (detail_screen, widgets/platform_tab)
    edit/          (manual_edit_screen)
    ai_edit/       (ai_edit_screen, widgets/diff_view)
    shared/        (status_chip, loading, empty_state, error_view)
```

## LIVRABLES

1. Projet Flutter complet et **compilable** (`flutter run` sur simulateur iOS).
2. `.env.example` avec : `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `N8N_REFINE_URL`, `APP_SECRET`, `SITE_BASE_URL`.
3. **README** : prérequis, config Supabase (création du compte admin + policies RLS SQL), lancement local, build iOS et **distribution TestFlight via EAS/Xcode**, et le mini-workflow n8n d'édition IA.
4. Le **SQL des policies RLS** ci-dessus.

## CRITÈRES D'ACCEPTATION

- [ ] Login Supabase Auth fonctionnel, session persistée.
- [ ] Feed liste les posts depuis Supabase avec filtres status + langue et pull-to-refresh.
- [ ] Détail affiche FB et LinkedIn (hook + post) avec compteurs.
- [ ] Approuver/Rejeter mettent à jour `status` en base (optimistic + rollback).
- [ ] Édition manuelle persiste les changements de texte.
- [ ] Édition IA appelle le webhook n8n, affiche avant/après, et n'écrit en base qu'après validation.
- [ ] Realtime : un post passé `published` par n8n se met à jour dans le feed sans refresh manuel.
- [ ] Aucune clé Gemini ni service role dans l'app ; `flutter analyze` propre.
- [ ] Branding NeuraWeb appliqué (couleurs depuis tailwind.config.ts).

Commence par proposer l'arborescence des fichiers et le `pubspec.yaml`, puis implémente écran par écran en commençant par l'auth et le feed.
