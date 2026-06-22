// ============================================================
// lib/social-playbook.ts
// Bonnes pratiques par plateforme (algorithmes + formats) injectées
// dans le prompt de l'assistant « conseil social ». Texte statique,
// maintenu à la main — pas d'appel externe.
// ============================================================

export type SocialPlatform = "facebook" | "linkedin" | "x";

const PLAYBOOKS: Record<SocialPlatform, string> = {
  facebook: `FACEBOOK (Pages / fil d'actualité)
- L'algorithme privilégie les interactions significatives (commentaires, partages) et le temps passé. Les liens sortants sont dépriorisés : préférer mettre le lien en 1er commentaire.
- Format gagnant : accroche émotionnelle ou question dès la 1re ligne (avant le "voir plus", ~120 caractères visibles), 1 idée par post, visuel natif (image/vidéo carrée 1:1 ou 4:5), CTA doux.
- Longueur : 80–180 mots. 1–3 hashtags max (peu d'impact sur FB). Emojis OK avec parcimonie.
- Vidéo : sous-titres intégrés, hook dans les 3 premières secondes, format vertical/carré.
- Éviter : appâts à engagement explicites ("commentez OUI"), trop de liens, texte trop dense.`,

  linkedin: `LINKEDIN (fil professionnel)
- L'algorithme valorise le "dwell time" et les commentaires des 60–90 premières minutes. Les posts qui retiennent (carrousels, texte long structuré) performent.
- Format gagnant : hook fort sur la 1re ligne (avant le "voir plus", ~140 caractères), aération (sauts de ligne, listes), storytelling ou retour d'expérience, 1 enseignement clair.
- Longueur : 900–1 800 caractères pour un post texte. 3–5 hashtags ciblés. Lien externe : plutôt en commentaire (sinon léger malus de portée).
- Ton : professionnel mais personnel/authentique (le "je"), valeur concrète (chiffres, méthode, cas client anonymisé). Finir par une question ouverte.
- Éviter : jargon corporate creux, post purement promotionnel, trop de hashtags.`,

  x: `X / TWITTER
- L'algorithme favorise la vitesse d'engagement (réponses, reposts, signets) et les conversations. Les liens externes réduisent la portée : les placer en réponse au tweet.
- Format gagnant : 1 idée nette et percutante, ≤ 280 caractères, hook immédiat. Pour développer : utiliser un thread (1/ 2/ 3/) avec une 1re ligne qui donne envie de dérouler.
- Hashtags : 0–2 maximum. Emojis : avec parcimonie. Les questions et opinions tranchées génèrent des réponses.
- Threads : chaque tweet doit tenir seul ; finir par un CTA (suivre, repartager le 1er tweet).
- Éviter : trop de hashtags, liens dans le tweet principal, texte qui dépasse sans thread.`,
};

const GENERIC = `PRINCIPES COMMUNS
- Hook dès la 1re ligne, 1 message principal, preuve concrète (chiffre, exemple), CTA clair.
- Adapter la longueur et le ton à la plateforme. Lien sortant souvent mieux en commentaire/réponse.
- Authenticité > promotion. Cohérence avec la marque NeuraWeb (web & IA, ton expert et accessible).`;

/** Renvoie le playbook d'une plateforme (ou les principes communs en secours). */
export function getPlaybook(platform: string): string {
  const key = platform?.toLowerCase() as SocialPlatform;
  return PLAYBOOKS[key] ?? GENERIC;
}

export function isSupportedPlatform(p: string): p is SocialPlatform {
  return p === "facebook" || p === "linkedin" || p === "x";
}

export { GENERIC as GENERIC_PLAYBOOK };
