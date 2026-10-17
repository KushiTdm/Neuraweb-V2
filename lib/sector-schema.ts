// Balisage schema.org commun aux pages sectorielles (voir docs/brand/IA_SERVICES_SECTEURS.md).
const BASE_URL = 'https://neuraweb.fr';

/** `audience` (public visé) + `areaServed` (zone) + rattachement au hub /fr/secteurs. */
export function sectorAudience(audienceType: string, audienceName: string) {
  return {
    audience: { '@type': 'Audience', audienceType, name: audienceName },
    isPartOf: { '@type': 'WebPage', '@id': `${BASE_URL}/fr/secteurs#sectors`, url: `${BASE_URL}/fr/secteurs`, name: 'Secteurs — NeuraWeb' },
  };
}

/** Zone desservie : ces offres reposent sur la réglementation française (RGPD/HDS, RGAA) → France ; l'équipe travaille à distance. */
export const SECTOR_AREA_SERVED = [
  { '@type': 'Country', name: 'France' },
];

/** Fil d'Ariane à 3 niveaux : Accueil > Secteurs > Page. */
export function sectorBreadcrumb(name: string, pagePath: string) {
  return [
    { name: 'Accueil', url: '/fr' },
    { name: 'Secteurs', url: '/fr/secteurs' },
    { name, url: pagePath },
  ];
}
