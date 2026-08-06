# Campagne locale — Annuaire commerceshaubourdin.fr

**Canal :** Neuraweb opère un annuaire de commerces pour la ville d'Haubourdin (`app.commerceshaubourdin.fr`), où l'agence est elle-même enregistrée. La fiche Neuraweb dispose d'un module "Promotions" (bandeau visible sur la fiche) utilisé ici comme canal d'acquisition local, pas comme simple outil de notoriété.

**Objectif :** convertir des commerçants/artisans/indépendants d'Haubourdin — visiteurs ou futurs revendicateurs de fiche sur l'annuaire — en clients du Pack Starter (site vitrine, 1 490€ TTC).

## Audience (100 fiches de l'annuaire au 06/08/2026)

| Catégorie | Nombre |
|---|---|
| Garages & automobile | 26 |
| Beauté & bien-être | 16 |
| Coiffeurs & barbiers | 14 |
| Alimentation & épiceries | 12 |
| Immobilier, banques & assurances | 9 |
| Animaux | 4 |
| Autres commerces | 4 |
| Boulangeries & pâtisseries | 4 |
| Cafés & bars | 4 |
| Boucheries, traiteurs & primeurs | 3 |
| Friteries | 3 |
| Artisans du bâtiment | 1 |

**98/100 fiches sont `unclaimed`** (non revendiquées) → signal de maturité digitale très faible, cohérent avec le ciblage du Pack Starter ("petits commerces, indépendants, présence en ligne basique" — voir `COMPLETE_OFFERINGS.md`). Exclure du ciblage les enseignes/agences nationales déjà présentes dans la liste (Lidl, Aldi, Picard, Allianz, Banque Populaire, Caisse d'Épargne, Crédit Agricole, Crédit Mutuel) : elles ont leur propre digital, l'offre ne les concerne pas.

## Offre

**-25% sur le Pack Starter → 1 117€ TTC** (au lieu de 1 490€), réservée aux **10 premiers commerces d'Haubourdin** inscrits, jusqu'au **30/09/2026**.

Arbitrage du pourcentage : 10% est trop faible pour déclencher une action chez une audience à 98% non digitalisée (effort perçu > gain) ; 50%+ dévalorise la prestation et, sur un bassin d'une centaine de commerces qui se connaissent, ancre un prix de référence intenable pour les prospects futurs hors promo. 25% reste dans la fourchette usuelle d'une offre d'acquisition (20-30%) et se raconte facilement ("-373€, quasi l'hébergement + le support offerts").

Le quota de 10 places reflète une contrainte réelle de capacité de production (pas un faux compteur) — **vérifier la capacité avant publication**, dans un bassin où tout se sait, une fausse rareté détruit la confiance.

## Contenu du formulaire "Promotions" (app.commerceshaubourdin.fr)

```
Titre :
Commerçants d'Haubourdin : -25 % sur votre site vitrine

Texte optionnel :
On est d'Haubourdin, comme vous. Un site clair, trouvé sur Google, sans jargon
ni mauvaise surprise — pour 10 commerces seulement, places limitées.

Bouton — libellé :
Je réserve mon appel

Bouton — lien :
https://neuraweb.fr/booking?utm_source=annuaire-haubourdin&utm_campaign=promo-starter25

Style : Bandeau (couleur de marque)
Début : date de publication
Fin : 2026-09-30
Afficher sur le site : coché
```

**Variante titre (urgence immédiate)** : *"-25 % sur votre site — 10 places, commerçants d'Haubourdin"*
**Variante texte (objection prix)** : *"1 117 € tout compris pour être visible en ligne, sans mauvaise surprise ni abonnement caché. On connaît vos clients, on connaît Haubourdin."*

Pas de déclinaison par métier (garage, coiffeur…) : l'accroche générique "commerce local" couvre l'ensemble du panel ; une segmentation par catégorie n'apporte pas de gain net pour un simple bandeau.

## Exécution

1. La page `/booking` affiche le tarif plein catalogue (1 490€) — la remise s'applique **manuellement** à l'appel/RDV en repérant le tag UTM `annuaire-haubourdin`. Sans ce repérage, décalage perçu entre l'annonce et le devis = perte de confiance.
2. Tracer la source dans le suivi commercial (Sheet/Supabase) pour mesurer le taux de conversion propre à ce canal, et relancer les leads non convertis avant l'échéance du 30/09/2026.
3. À l'expiration, reconduire avec une offre moins agressive (éviter d'ancrer -25% comme prix permanent sur un bassin restreint).
4. Ton commercial : chaleureux, local, concret — pas de vocabulaire "startup" (ROI, scalabilité, MEDDIC). Voir segment 4 dans `target_audience.md`.

---
*Dernière mise à jour : 2026-08-06.*
