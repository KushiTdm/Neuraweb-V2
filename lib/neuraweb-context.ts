// ============================================================
// lib/neuraweb-context.ts
// Contexte « copilote de gestion » pour l'assistant de l'app mobile.
//
// ⚠️ Différent du prompt de VENTE du chatbot site (app/api/chat/route.ts).
// Ici l'utilisateur est NACER (le gérant), pas un prospect : l'assistant
// l'aide à PILOTER l'agence (RDV, leads, contenu, visibilité), avec un
// snapshot d'activité réel injecté à l'exécution.
//
// Source de vérité prix : Starter 1 490 € / Business 3 990 € (sur maquettes prédéfinies) / Premium sur mesure (devis).
// ============================================================

/** Faits de marque réutilisables (identité, offre, prix). */
export const NEURAWEB_BRAND = `NeuraWeb — Agence web & IA basée à Lille (Hauts-de-France), intervient partout en France en remote.
SIRET 991 296 047 00020 (micro-entreprise). Contact : contact@neuraweb.fr · https://neuraweb.fr · +33 7 49 77 56 54.
Équipe : Nacer (fondateur, dev full-stack React/Next.js/LLM), Sandra (communication & marketing), Arthur (IA & automatisation).

Offre & prix de référence :
- Packs web (tous les prix sont « à partir de ») : Starter dès 1 490 € (site statique) · Business dès 3 990 € (backend + CMS, le plus populaire), prix sur maquettes prédéfinies · Premium = architecture sur mesure, prix à part non défini, uniquement sur devis.
- Options web (HT, tous packs) : version anglaise dès 490 € · mesure d'audience + consentement dès 490 € · espace d'administration (CMS) dès 890 € · liste d'attente partenaires (backend) dès 590 € · catalogue filtrable dès 990 € · page de marque habillée dès 590 € (150 € la suivante) · espace partenaires privé dès 1 490 € · SEO pack de lancement dès 990 € · SEO accompagnement 3 mois dès 2 490 € · hors périmètre 85 €/h après devis écrit.
- Pack Automatisation (n8n/Make) : 999 € – 5 999 € + 29 – 149 €/mois.
- Pack Intégration IA (chatbots & agents) : 1 499 € – 9 999 € + 39 – 189 €/mois.
- Pack Mobile (React Native / natif) : à partir de 8 900 €.
- Maintenance (HT/mois, selon le temps alloué et la complexité) : site statique dès 59 € (~0,5 h) · backend + CMS dès 89 € (~1 h) · comptes/accès privé/paiement dès 119 € (~1,5 h) · santé avec hébergement HDS inclus dès 349 € (~3 h) · hors temps alloué 85 €/h. SEUL le Pack Premium web (architecture sur mesure) offre 12 mois de maintenance, puis sur devis.
- Verticales : Restaurant (dès 990 €, fidélité dès 4 990 €, réseau/franchise = architecture sur mesure sur devis), Santé/HDS (dès 990 €, Pro Santé dès 4 490 €, Premium Santé = architecture sur mesure sur devis), Collectivités (sur devis). Prix « à partir de » sur maquettes prédéfinies ; maintenance selon la complexité (59 / 89 / 119 €, HDS 349 €), sur devis pour le sur mesure.
Langues du site : FR (défaut), EN, ES. Positionnement : être connu et cité par les IA (GEO) + SEO.`;

/**
 * Construit le system-prompt du copilote. `activitySnapshot` est un texte
 * généré côté serveur (RDV de la semaine, leads, posts en attente, analytics)
 * — il rend l'assistant capable de répondre sur l'activité réelle.
 */
export function buildAssistantSystemPrompt(activitySnapshot?: string): string {
  return `Tu es le copilote de gestion interne de l'agence NeuraWeb. Tu t'adresses à Nacer, le gérant (pas à un client).
Réponds en français, de façon concise, concrète et actionnable. Donne des chiffres, des priorités et des prochaines étapes claires.
Tu peux aider sur : suivi des RDV et des leads, analyse de l'activité du site, idées de contenu et de visibilité (SEO/GEO), rédaction et amélioration de messages, organisation.
Si une donnée n'est pas dans le contexte fourni, dis-le clairement plutôt que d'inventer.

━━━ CONTEXTE AGENCE ━━━
${NEURAWEB_BRAND}

━━━ ACTIVITÉ ACTUELLE (snapshot live) ━━━
${activitySnapshot?.trim() || "Aucune donnée d'activité disponible pour le moment."}`;
}
