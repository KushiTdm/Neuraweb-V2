# Chiffres et preuves — règles et liste utilisable (18 octobre 2026)

Source : brief search-ai (5 IA, Code de la consommation L121-2, DGCCRF, ARPP) : `/Users/Dev/ai-search-results/research/20261018-162230_*.md`. Ce n'est pas un avis juridique ; les sanctions citées par les IA varient (jusqu'à 300 000 € pour une personne, 10 à 15 % du CA pour une société), à vérifier.

## Règle
Un chiffre est utilisable s'il est (1) **un fait propre vérifiable**, (2) **une statistique tierce citée** (auteur, date, contexte), (3) **un calcul dont les hypothèses sont affichées**, ou (4) un **objectif** clairement présenté comme tel. Interdit : moyenne « chez nos clients » sans données, « 100 % conforme », « ROI garanti », pourcentage d'un client anonyme sans période ni méthode.

## À mettre en avant (faits vérifiables NeuraWeb)
| Argument | Chiffre | Preuve à pouvoir produire |
|---|---|---|
| Avis | 5,0/5 sur 14 avis Google | la fiche Google (lien public) |
| Expérience | depuis 2023 ; 150+ projets ; 98 % de clients satisfaits | **à documenter** : liste interne des projets, méthode de mesure de la satisfaction (enquête de fin de projet ?) → écrire « 98 % de satisfaction (enquête de fin de projet) » seulement si c'est vrai |
| Prix | dès 1 490 € (Starter) · dès 3 990 € (Business) · Premium sur devis · 85 €/h hors périmètre · maintenance dès 59 €/mois | grille publique |
| Réactivité | devis sous 48 h ouvrées | s'y tenir (journaliser les délais) |
| Paiement | 40 / 30 / 30 | CGV |
| Périmètre | 4 langues, 3 packs, équipe de 3, contrat et facture français | — |
| Délais de livraison | landing 1–2 sem., vitrine 3–5 sem., application 6–10 sem. (déjà dans les FAQ) | planning réel des projets |

## Statistiques tierces (à citer avec source et date avant publication)
Commissions des plateformes de livraison (≈ 30 %) et des OTA hôtelières (15–25 %) ; impact de la vitesse sur la conversion (étude Deloitte/Google « Milliseconds Make Millions ») ; abandon de panier (Baymard Institute) ; part des recherches avec réponse IA. Aucune n'est insérée tant que la source n'est pas lue et citée.

## Calculateurs (levier de conversion recommandé)
Calculateur « commissions récupérées » (restaurants, hôtels) et « heures gagnées » (automatisation) avec hypothèses modifiables par le visiteur : seule forme de chiffrage qui soit à la fois persuasive et défendable. À construire si tu valides.

## Corrections faites le 18 oct. 2026
Retirés ou reformulés : « +35 % de trafic organique en moyenne » ; +120 % de patients, +300 % de trafic, 20 % → 5 % d'absences, « 100 % conforme RGPD santé » ; −7 h/sem, +87 % de RDV, 68 % sans agent ; 45 → 3 min, ×2 de réponse, −28 h/sem, −87 % de ruptures ; ×4 commandes, +62 % de fréquence, 15 000 profils, ×3 d'engagement ; +30–50 % de réservation, +15–25 % de panier. Remplacés par des formulations qualitatives et un sous-titre « scénarios types, sans garantie ». Gardés : calculs à hypothèses affichées (restaurants : 5 000 € × 30 %, 300 habitués × 25 €).
« Réponse garantie sous 4 heures ouvrées » remplacé partout par « Réponse sous 48 h ouvrées » ; « Performance garantie 90+ », « +50 pts Lighthouse garanti », « Croissance garantie », « Conformité RGPD garantie » reformulés en objectifs.
Gardés tels quels : les contextes de départ des scénarios (« 40 % d'appels manqués », « CRM à 70 % »), présentés comme hypothèses ; l'amende ARCOM (collectivités) est une règle publique, à citer avec son article de loi.

## Statistiques tierces intégrées (18 oct. 2026) — composant `components/sourced-stats.tsx`
Affichées sous « Repères chiffrés du marché » avec leur source cliquable et la mention « elles décrivent le marché, pas des résultats de NeuraWeb ». Pages : Développement web, Intégration IA, Automatisation, Applications mobiles, Restaurants/Hôtels.
| Chiffre | Source | Vérification |
|---|---|---|
| 53 % de visites mobiles abandonnées > 3 s | Google, 2016 | **lu** sur blog.google (post du 8 sept. 2016) |
| +8,4 % de conversions retail pour 0,1 s gagnée (37 marques, 30 M de sessions) | Deloitte pour Google, 2020 | recherche web ; la version PDF arrondit à 8 % |
| 65 % des TPE/PME françaises ont un site ; 26 % vendent en ligne (49 % en hébergement-restauration) | Baromètre France Num (DGE), 2024 | **lu** sur francenum.gouv.fr |
| 70,22 % d'abandon de panier (50 études) | Baymard Institute, mis à jour le 22/09/2025 | **lu** |
| 18 % des entreprises (10+ salariés) utilisent l'IA en 2025, 10 % en 2024 ; 54 % des non-utilisatrices citent le manque d'expertise | Insee Première n° 2120 | page Insee non lisible par mes outils (blocage) : confirmée par recherche web |
| 91 % des 12 ans et plus ont un smartphone | Arcep / Credoc, Baromètre du numérique 2025 (enquête été 2024) | recherche web |
| 60 % des métiers ont ≥ 30 % d'activités automatisables | McKinsey Global Institute, 2017 | citation connue, lien canonique non relu |
À re-vérifier dans le navigateur avant mise en production : Insee, Arcep, Deloitte, McKinsey.
**Écartés faute de source vérifiée** : commissions Uber Eats/Booking (taux contractuels, pas de page officielle fixe — seule la décision 19-D-23 de l'Autorité de la concurrence est citable), amende d'accessibilité pour le privé (les sources divergent : sanction de 50 000 € documentée pour les acteurs publics), HDS (page esante.gouv.fr inaccessible), BrightLocal, Asana, dates de la facture électronique et de l'AI Act (déjà dans les articles de blog ; à relier aux pages officielles).

## « 150+ projets » et « 98 % » — retirés de l'accueil (18 oct. 2026)
- **150+ projets** : le périmètre mêle des projets personnels et des automatisations/remises à niveau ; présenté comme « projets livrés », ce n'est pas justifiable. Remplacé par « 5 ans d'expérience en développement web » (depuis 2021) et « 3 continents où nous avons livré » (Asie, Amérique du Sud, Europe).
- **98 % de satisfaction** : l'intitulé annonçait un « taux mesuré après chaque livraison ». Il n'existe pas de mesure : il s'agit d'avis tous positifs. Remplacé par la note Google (5/5, 14 avis), seul chiffre de satisfaction vérifiable.
- **À réintroduire plus tard** : « N missions pour des clients depuis 2023 », seulement après un décompte écrit (hors projets perso) et une définition de « mission » (site, automatisation, remise à niveau). Pour les petites équipes, 40 à 60 missions par an sur trois ans serait plausible, mais il faut le décompte.
