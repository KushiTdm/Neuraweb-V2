**Pour apparaître dans les moteurs de recherche IA (ChatGPT Search, Perplexity, Google AI Overviews, Claude, Grok, etc.), voici les recommandations actuelles en 2026 issues de Google, OpenAI, sources SEO et discussions Reddit.**

> **Décision NeuraWeb (juin 2026)** : les bots d'entraînement (GPTBot, ClaudeBot,
> anthropic-ai, CCBot, Google-Extended) sont **autorisés** sur les pages publiques
> dans `app/robots.ts`, en plus des bots de recherche IA. Objectif : entrer dans
> les connaissances des futurs modèles et les index dérivés de Common Crawl.
> Seules les routes privées (/api/, /admin/, /hotel-form/) restent bloquées,
> pour tous les bots. Les exemples `Disallow` ci-dessous sont des modèles
> génériques, pas la configuration du site.

## ⚡ MISE À JOUR — État vérifié juillet 2026

Synthèse des changements confirmés (docs officielles + études récentes), qui **corrige ou précise** les sections Grok/Perplexity plus bas (recherches antérieures, conservées pour historique) :

### Ce qui a changé

1. **Google a supprimé les FAQ rich results** (notice de dépréciation 7-8 mai 2026, doc retirée le 15 juin 2026). Les FAQ n'apparaissent plus du tout en rich result dans Google Search. **Le markup FAQPage reste à conserver** : il est toujours lu par Bingbot, PerplexityBot et les crawlers RAG, et les pages avec FAQ schema restent nettement plus présentes dans les AI Overviews (≈ 3,2×, étude AirOps). Ne rien changer au pipeline `faq:` du blog.
2. **llms.txt — verdict mi-2026** : adoption ×8,8 mais **97 % des fichiers ne reçoivent aucune requête IA**. Google a déclaré officiellement (15 juin 2026) que llms.txt n'est pas nécessaire pour Search ; OpenAI renvoie à robots.txt ; Anthropic/Perplexity le lisent partiellement. Valeur réelle : outils dev (Cursor, Claude Code). **On garde le nôtre (coût nul) mais on n'y investit plus** — contrairement à ce que suggèrent les sections ci-dessous (« beaucoup d'outils IA le lisent » : c'est infirmé).
3. **La citation IA ne suit pas le ranking Google** : étude mai 2026 (153 425 citations) — ~77 % des URLs citées par les moteurs IA sont **hors top-10 organique**. La reconnaissance d'**entité** pèse plus que la position (corrélation brand mentions ↔ visibilité AI Overviews = 0,664 vs 0,218 pour les backlinks). Conséquence : soigner `sameAs` (LinkedIn, GitHub, Wikidata si créable) dans le schema Organization, cohérence stricte nom/URL/description partout (NAP), et tester régulièrement « qu'est-ce que neuraweb.tech ? » dans ChatGPT/Claude/Perplexity — c'est le levier anti-cannibalisation face aux homonymes.
4. **IndexNow confirmé comme levier n°1 vers ChatGPT** : ~80 M de sites actifs (janv. 2026) ; Bing rapporte que 22 % des URLs cliquées dans ses résultats proviennent d'IndexNow. ChatGPT Search et Copilot puisent dans l'index Bing → pas indexé Bing = invisible ChatGPT. **`npm run indexnow` à chaque publication.**
5. **Google Indexing API — risque ToS** : toujours officiellement restreinte à JobPosting/BroadcastEvent ; depuis mai 2025, détection anti-spam sur toutes les soumissions et révocation possible. L'usage pour des articles de blog fonctionne encore mais viole les ToS. **Préférer IndexNow + demande d'indexation manuelle GSC pour les articles ; réserver `npm run indexing` à un usage exceptionnel.**
6. **Longueur pour la citation IA** : pages citées en AI Overviews ≈ 1 282 mots en moyenne ; 53,4 % des citations vont à des pages < 1 000 mots ; corrélation longueur/citation ≈ 0. Format gagnant : réponse directe de 2-4 phrases en tête, H2 en questions, stats datées et sourcées, listes/tableaux. Pour la SERP classique, 1 500-2 500 mots restent la zone efficace → cible blog : **~1 500-2 000 mots denses, answer-first**.
7. **E-E-A-T étendu au-delà du YMYL** (core update mars 2026) : les agences et services locaux sont désormais évalués sur ce cadre, avec sur-pondération du premier E (Experience) — cas clients réels et données propriétaires (« Information Gain ») comptent plus que les backlinks.

### Ce qui est confirmé (déjà en place chez NeuraWeb)

- Séparation **retrieval vs training** actée : OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot = citation/recherche → **ne jamais les bloquer**. GPTBot, ClaudeBot, Google-Extended, CCBot = training (choix NeuraWeb : autorisés aussi). `app/robots.ts` liste déjà tous ces bots avec les routes privées en disallow. ✅
- Vérifier que le CDN/WAF (Vercel) ne bloque pas ces user-agents au niveau réseau — un blocage réseau outrepasse robots.txt.

---

## GROK

### Principe clé : Distinguer **crawl/search** vs **training**
- Les bots de **recherche/citation** (qui citent ton site avec un lien) sont ceux qui boostent ta visibilité en GEO (Generative Engine Optimization).
- Les bots de **training** (entraînement des modèles) peuvent être bloqués séparément sans perdre la visibilité en recherche IA.

**Recommandation majoritaire (SEO + Reddit)** :  
Permets les bots de recherche IA tout en bloquant (optionnellement) les bots d’entraînement purs. Ne bloque **pas** tout avec `User-agent: * Disallow: /`.

### Bots IA importants à autoriser (2026)

| Bot                  | Usage principal                  | Recommandation pour visibilité IA | User-agent                  |
|----------------------|----------------------------------|-----------------------------------|-----------------------------|
| **OAI-SearchBot**   | Recherche ChatGPT               | **Autoriser** (prioritaire)      | OAI-SearchBot              |
| **PerplexityBot**   | Indexation + citations Perplexity | **Autoriser**                    | PerplexityBot              |
| **Claude-SearchBot**| Recherche Claude                | **Autoriser**                    | Claude-SearchBot           |
| **ChatGPT-User**    | Navigation utilisateur          | Autoriser (mais respect variable)| ChatGPT-User               |
| **Claude-User**     | Navigation utilisateur          | Autoriser                        | Claude-User                |
| **Googlebot**       | Google Search + AI Overviews    | **Toujours autoriser**           | Googlebot                  |
| **Google-Extended** | Entraînement Gemini             | Optionnel (bloquer si tu veux)   | Google-Extended            |
| **GPTBot**          | Entraînement OpenAI             | Optionnel (souvent bloqué)       | GPTBot                     |
| **ClaudeBot**       | Entraînement Anthropic          | Optionnel                        | ClaudeBot                  |
| **CCBot**           | Common Crawl (datasets)         | Souvent bloqué                   | CCBot                      |

### Exemple de robots.txt recommandé pour **maximiser la visibilité IA**

```txt
# === Robots.txt optimisé GEO / AI Search 2026 ===

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# === AI Search / Retrieval (à autoriser) ===
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-User
Allow: /

# === Training (optionnel : bloquer si tu veux protéger ton contenu) ===
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CCBot
Disallow: /

# Règles générales
User-agent: *
Disallow: /wp-admin/
Disallow: /cart/
Disallow: /checkout/
Disallow: /private/
Disallow: /admin/
Allow: /wp-content/uploads/   # images souvent utiles

Sitemap: https://tonsite.com/sitemap.xml
```

### Autres conseils issus des sources (Google, Reddit r/TechSEO, Semrush, etc.)
- **Ajoute un fichier `llms.txt`** à la racine (complémentaire à robots.txt) : il donne des instructions spécifiques aux IA (résumé du site, pages importantes, politique de contenu). Beaucoup d’outils IA le lisent.
- Teste toujours ton fichier avec l’outil Google Robots.txt Tester (Search Console).
- Les changements peuvent prendre 24h+ pour OpenAI.
- Sur Reddit (r/TechSEO) : beaucoup de gens voient du trafic (même faible pour l’instant) depuis Perplexity/ChatGPT quand ils autorisent les bons bots. Bloquer tout par erreur est un regret fréquent.
- **Attention** : Certains bots (surtout Perplexity) contournent parfois robots.txt → combine avec des règles serveur/Cloudflare si besoin.

## PERPLEXITY :

Oui — voici des recommandations concrètes pour configurer votre fichier robots.txt afin d'optimiser la visibilité auprès des moteurs de recherche IA (ChatGPT Search / OpenAI, Bing/Chat, Perplexity, Claude, etc.), basées sur la synthèse des bonnes pratiques trouvées sur Google, forums Reddit et articles spécialisés. [webrankinfo](https://www.webrankinfo.com/dossiers/ia/chatgpt-search)

Réponse rapide
- Autorisez explicitement les user‑agents IA que vous voulez voir crawler votre site (OAI-SearchBot, ChatGPT-User, GPTBot, bingbot, ClaudeBot, PerplexityBot) et bloquez uniquement ceux dont vous ne voulez pas l’usage pour l’entraînement. [odyssee-agency](https://odyssee-agency.com/blog/apparaitre-chatgpt-search)

Configuration robots.txt recommandée (exemple)
- Placez ce fichier à la racine de votre domaine (https://votre-domaine.com/robots.txt). [abondance](https://www.abondance.com/guides/optimiser-fichier-robotstxt)
- Exemple simple qui autorise l’exploration par les crawlers IA courants tout en vous laissant la possibilité de bloquer l’entraînement (modifiez selon votre politique) :
```
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
# Autoriser si vous acceptez l'usage pour entraînement, sinon Disallow: /
Disallow: /

User-agent: bingbot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: *
Disallow: /private/
Allow: /
Sitemap: https://votre-domaine.com/sitemap.xml
```
- Dans cet exemple GPTBot est bloqué pour l’entraînement (Disallow), tandis que les crawlers de recherche temps‑réel et d’indexation sont autorisés. Adaptez selon votre choix sur l’entraînement des modèles. [alyze](https://alyze.info/Blog/le-fichier-robots-txt-ia)

Points techniques et bonnes pratiques
- Déclarez chaque crawler IA explicitement dans robots.txt : certains crawlers préfèrent une section dédiée plutôt qu’un User-agent: * générique. [webrankinfo](https://www.webrankinfo.com/dossiers/ia/chatgpt-search)
- Soumettez votre site à Bing Webmaster Tools et utilisez IndexNow pour accélérer l’indexation par les écosystèmes qui alimentent les IA (ex. ChatGPT Search s’appuie sur l’index Bing). [75secondes](https://www.75secondes.fr/tech/seo-chatgpt-search-les-cles-pour-etre-bien-reference)
- Vérifiez la latence de prise en compte : OpenAI indique qu’il peut y avoir un délai (~24 h) entre la modification de robots.txt et sa prise en compte. [kelcible](https://kelcible.fr/actualites/)

Fichier llms.txt (standard émergent)
- Un standard « llms.txt » (équivalent de robots.txt ciblé IA) est évoqué comme pratique émergente : vous pouvez y préciser des règles plus fines (politique d’utilisation pour entraînement, préférences de licence). Ajoutez-le si vous voulez un signal explicite. [botrank](https://www.botrank.ai/fr/technical-doc/robots-txt)

Conséquences SEO/GEO et recommandations complémentaires
- Autoriser les crawlers IA ne suffit pas : soignez la structure HTML (H1/H2/H3), JSON‑LD (Article, FAQ, LocalBusiness, BreadcrumbList), balises meta, alt d’images et un sitemap propre pour maximiser les chances d’être cité par une IA. [webloom](https://webloom.fr/comment-optimiser-un-article-de-blog-pour-chatgpt/)
- Pour le GEO (optimisation pour moteurs IA), privilégiez des réponses « answer‑first », contenus courts et structurés (listes, tableaux), et du contenu localisé si cible géographique. [natural-net](https://www.natural-net.fr/blog-agence-web/2026/03/26/seo-pour-ia-guide-complet-du-geo-pour-optimiser-votre-visibilite.html)
- Évitez de bloquer bingbot si vous visez ChatGPT Search, car beaucoup de ces services utilisent Bing pour l’indexation. [75secondes](https://www.75secondes.fr/tech/seo-chatgpt-search-les-cles-pour-etre-bien-reference)

Vérifications et suivi
- Testez votre robots.txt avec outils webmaster (Bing/Webmaster Tools) et vérifiez logs serveur pour confirmer que les user‑agents attendus crawlent bien votre site. [abondance](https://www.abondance.com/guides/optimiser-fichier-robotstxt)
- Mettez en place un suivi des pages citées par les IA (ex. requêtes anonymes, monitoring de trafic référent) pour ajuster si nécessaire. [natural-net](https://www.natural-net.fr/blog-agence-web/2026/03/26/seo-pour-ia-guide-complet-du-geo-pour-optimiser-votre-visibilite.html)

Risques et décisions à prendre
- Bloquer totalement les crawlers IA protège vos contenus contre l’entraînement mais vous rendra invisible dans beaucoup de moteurs IA grand public ; autoriser tout facilite l’apparition dans réponses mais peut permettre un usage d’entraînement selon les user‑agents autorisés. Choisissez selon votre stratégie de propriété de contenu. [alyze](https://alyze.info/Blog/le-fichier-robots-txt-ia)

Checklist rapide (à appliquer)
- Nommer explicitement OAI-SearchBot, ChatGPT-User, GPTBot, bingbot, ClaudeBot, PerplexityBot dans robots.txt. [odyssee-agency](https://odyssee-agency.com/blog/apparaitre-chatgpt-search)
- Ajouter Sitemap et laisser les pages publiques accessibles. [webrankinfo](https://www.webrankinfo.com/dossiers/ia/chatgpt-search)
- Publier JSON‑LD (Article/FAQ/LocalBusiness) sur pages prioritaires. [75secondes](https://www.75secondes.fr/tech/seo-chatgpt-search-les-cles-pour-etre-bien-reference)
- S’inscrire à Bing Webmaster Tools et activer IndexNow. [webrankinfo](https://www.webrankinfo.com/dossiers/ia/chatgpt-search)
- Options avancées : ajouter llms.txt si vous souhaitez des règles plus détaillées sur l’usage pour entraînement. [odyssee-agency](https://odyssee-agency.com/blog/apparaitre-chatgpt-search)

Si vous voulez, je peux :
- Générer un robots.txt personnalisé selon votre politique (autoriser/empêcher entraînement, quelles sections bloquer, pages privées à exclure).  
- Vérifier votre robots.txt actuel (copiez/collez le contenu) et proposer les modifications exactes.