# Étape 2 — Faits, « À propos », propriété du code, visibilité IA (18 octobre 2026)

Sources : recherche search-ai (6 IA, deux briefs : `/Users/Dev/ai-search-results/research/20261018-143805_*.md` et `…143957_*.md`) + baseline IA (`/Users/Dev/ai-search-results/20261018-144052_*.md`). Les affirmations « non confirmées » le sont explicitement. Aucun avis juridique : les clauses ci-dessous sont à faire relire par un juriste.

## 1. Faits retenus (donnés par toi)
- Équipe de 3 : Nacer, Sandra, Arthur. Entité : NeuraWeb, Lille, qui facture tous les clients.
- Clients : Nord, Paris, étranger (Amérique latine l'an dernier). Équipe à Hanoï pour un an ; pas d'entité au Vietnam (pas de visa de travail).
- Projets clients non affichés ; on ne dit jamais « réel » ou « démo ».
- Chiffres projets et satisfaction réels ; avis réels. Réseaux : X et Facebook.

## 2. « À propos » et localisation — ce que font les autres
Brief fiable (5 IA, sources Knok Studios, studios remote-first) : les agences qui s'en sortent **séparent le siège légal (où l'on facture) du lieu où travaille l'équipe**, sans fausse adresse locale. Knok Studios (français, Hanoï/Hô Chi Minh-Ville) est l'exemple le plus proche. Deux risques :
- **Google Business Profile** : revendiquer « Lille » sur Google Maps sans local ouvert au public viole les règles (suspension possible). Solution : profil en **zone de service** (adresse masquée) ou ne pas en créer. *Source : Gemini + Grok, sans lien vérifié.*
- DeepSeek cite Akabia/Wapiti comme agences « lilloises à distance » : **non vérifié**, à ignorer.

### Propositions de texte (à choisir)
- **A — Franche (recommandée).** « NeuraWeb est une agence web & IA française, immatriculée à Lille. Nous sommes trois — Nacer, Sandra et Arthur — et nous travaillons cette année depuis Hanoï. Nos clients sont dans le Nord, à Paris et à l'étranger. Contrat, facture et TVA françaises, où que nous soyons. »
- **B — Lille d'abord.** « Agence web & IA du Nord, siège à Lille. Équipe de trois, en télétravail depuis Hanoï jusqu'à l'été prochain : vous nous joignez en visio, et nous sommes à Lille pour les rendez-vous en France. » *(à ne dire que si c'est vrai ; sinon supprimer la dernière phrase.)*
- **C — Mondiale.** « Une petite équipe française qui livre des sites, des applications et des automatisations pour des PME en France et à l'étranger — de Lille à Hanoï, en passant par l'Amérique latine. Prix affichés, interlocuteurs directs. »

Hero (kicker actuel « Agence web à Lille ») : proposé **« Agence web & IA française · Lille – Hanoï »**. Les pages `agence-web-lille` et `sous-traitance-web` gardent Lille pour le SEO local, avec « siège à Lille » plutôt que « basés à Lille ».

## 3. Propriété du code — pratiques observées
Fiable (4–5 IA) :
1. En France, le droit d'auteur **ne passe pas automatiquement au client** : il faut une **cession écrite** précisant étendue, durée, territoire et prix (CPI).
2. Les agences sérieuses livrent **code spécifique + fichiers de design** à **paiement du solde**, en gardant leurs **frameworks, composants et bibliothèques réutilisables** (licence non exclusive pour le client).
3. Bonne pratique : **nom de domaine, hébergement et dépôt Git ouverts au nom du client dès le début** ; l'agence est un collaborateur (Studio Contra, Clay).
Non confirmé : les clauses exactes de Gemeos, Knok, Wild Code, Pixelis, Clay — leurs contrats ne sont pas publics.

### Trois modèles de clause (à valider avec un juriste)
- **M1 — Cession à paiement intégral (recommandé).** Le client devient propriétaire des développements spécifiques, des contenus et des fichiers de design à réception du solde ; cession pour le monde entier, durée légale, tous supports ; NeuraWeb conserve ses composants génériques réutilisables, licenciés au client de façon non exclusive, perpétuelle ; bibliothèques open source sous leurs licences.
- **M2 — Licence d'exploitation.** Le client exploite le site tant que la maintenance/hébergement est payé ; rachat des droits possible. Plus protecteur pour l'agence, **moins rassurant pour la cible PME** et mal vu face à la peur de la dépendance.
- **M3 — Cession + dépôt remis.** Comme M1, avec remise du dépôt Git, des accès admin et d'un guide de passation à la livraison (checklist), et clause de sortie si le client change de prestataire.

À ajouter dans CGV et devis dans tous les cas : liste des livrables remis, qui est titulaire du domaine/hébergement, ce qui reste sous licence, maintenance facultative (le droit de propriété n'en dépend pas).

## 4. Baseline de visibilité IA (18 oct. 2026, 4 assistants)
| Assistant | « Agence web Lille » | « Agence web & IA, prix affichés » | « n8n France » | « Depuis le Vietnam » | Connaît neuraweb.fr |
|---|---|---|---|---|---|
| Perplexity | **cité n°1** (via neuraweb.fr) | **cité n°1** | cité | – | oui, packs lus sur le site |
| Gemini | cité n°4, description plausible | cité n°3 | – | – | description générique (peut être inventée) |
| ChatGPT | non cité (Yios, Dalt…) | – | – | – | – |
| DeepSeek | non | non | non | non (Upwwward, SICLO, SUTUNAM cités) | non |

Lecture : Perplexity (qui lit le web en direct) lit bien le site ; ChatGPT et DeepSeek ne connaissent pas encore la marque. **Alerte** : Perplexity cite « Premium dès 7 990 € » car la version **en ligne** de neuraweb.fr affiche encore ce montant (vérifié) ; le code local l'a retiré (règle « Premium sur mesure, jamais de prix »). → **déployer** les modifications de packs en attente pour que les IA arrêtent de citer un prix périmé.
Concurrents cités à surveiller : Yios, Dalt, 3clics, Norry, Webbay, Widop (Lille) ; ADN IA, GD Agence, Paris Agence IA (prix affichés) ; Upwwward, SICLO, SUTUNAM, Knok (Vietnam).
À refaire à J+30 et J+90 avec les mêmes questions.

## 5. À valider par toi
1. Texte « À propos » : A, B ou C (et kicker du hero).
2. Modèle de propriété du code : M1, M2 ou M3.
3. **Chiffres** : valeurs exactes de « projets livrés », « satisfaction » et ce que mesure « 3,2× », avec depuis quand (pour écrire « depuis 20XX » et la source).
4. Est-ce que les clients sont déjà titulaires de leur domaine/hébergement aujourd'hui ?
