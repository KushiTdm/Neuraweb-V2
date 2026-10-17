# Architecture : Services ≠ Secteurs ≠ Marchés (18 octobre 2026)

Source : recherche croisée de 5 IA (Gemini, ChatGPT, Perplexity, DeepSeek, Kimi) via search-ai. Consensus net ; les exemples cités (HubSpot, Salesforce, Stripe, Webflow…) n'ont pas été vérifiés un par un.

## Principe : trois axes qui ne se mélangent pas
| Axe | Question du visiteur | Pages |
|---|---|---|
| **Services** | « Que savez-vous faire ? » | Dév web, Mobile, Automatisation, Intégration IA |
| **Secteurs** | « Travaillez-vous pour mon métier ? » | Santé & paramédical · Restaurants & hôtels · Collectivités & mairies |
| **Marchés** | « Où intervenez-vous ? » | France, Vietnam (future page) |

## Appliqué (sans changer d'URL)
- **Navbar** : entrée `Secteurs ▾` à côté de `Services ▾` (3 liens + micro-description) ; mobile : entrées « Secteurs · … ».
- **Accueil** : section « Pour votre métier » juste après les services — 3 cartes, chacune dans la paire de couleurs de sa page, étiquette **SECTEUR**, accroche métier, visuel.
- **Footer** : colonne « Secteurs » (3 liens) distincte de « Services » et d'« Agences » (Lille, Paris). Le bloc « Secteur public » à part est supprimé.
- **Textes** : clés `nav.sectors`, `sectors.*`, `footer.sectors` en FR/EN/ES/VI (« Industries » en anglais).

## Appliqué le 18 oct. 2026 : migration des URL
Pages déplacées vers `/fr/secteurs/sante`, `/fr/secteurs/restaurants-hotels`, `/fr/secteurs/collectivites` + hub `/{lang}/secteurs` (4 langues). Anciennes URL (`/{fr,en,es,vi}/{sante,restaurants,collectivites}`) → redirection **permanente directe** (statut 308, équivalent du 301) vers la nouvelle URL FR, définie dans `next.config.js`. Sitemap, canoniques, liens internes, articles de blog, `llms.txt`, chatbot et `scripts/validate-sitemap.js` mis à jour.

## Recommandé, reste à faire
1. ~~URLs~~ (fait) `/fr/secteurs/sante`, `/fr/secteurs/restaurants-hotels`, `/fr/secteurs/collectivites` + hub `/fr/secteurs` ; **301 directes** depuis `/fr/sante`, `/fr/restaurants`, `/fr/collectivites` (pas de chaîne), liens internes, sitemap et hreflang mis à jour. Les 5 IA convergent. Points de vigilance :
   - ces pages sont aujourd'hui **FR uniquement** (`/en` et `/es` redirigent vers `/fr`, voir CLAUDE.md) : les slugs traduits proposés par une IA (`/en/sectors/healthcare`, `/vi/linh-vuc/y-te`) ne s'appliquent pas tant qu'il n'y a pas de versions traduites ;
   - le gain SEO est théorique (peu de trafic actuel, cf. `npm run analyze:keywords`) : migrer maintenant coûte peu, plus tard davantage.
2. **Hub `/secteurs`** : page maillante qui explique « services × secteur ».
3. **Schema.org** par page secteur : `Service`/`ProfessionalService` + `areaServed` + `audience`, `BreadcrumbList` (Accueil > Secteurs > Santé), `FAQPage` (HDS, RGPD, RGAA).
4. **Pages matrices** (« site web pour ostéopathes ») : seulement si le volume de recherche le justifie ; ≥ 70 % de contenu métier pour éviter le contenu dupliqué.
5. **Étiquette « Secteur »** en en-tête des pages verticales (déjà sur les cartes d'accueil).

## À éviter (consensus)
Mélanger services et secteurs dans un même menu · chaînes de redirections · dupliquer un texte générique en changeant juste le nom du métier · ranger le Vietnam dans Services ou Secteurs.

## Vietnam
C'est un **marché géographique** : ni service ni secteur. Placement recommandé : entrée « Agence / Bureau Vietnam » (menu À propos) et/ou version `/vi` ; jamais dans Services ni Secteurs. Thème de couleur déjà prêt (`.theme-vietnam`).
