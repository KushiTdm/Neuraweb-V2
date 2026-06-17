'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollToTopOnNavigate — force le scroll en haut de page à chaque
 * changement de route, sans déclencher le smooth-scroll global défini en CSS
 * (`html { scroll-behavior: smooth }`).
 *
 * Sans ce composant, Next.js tente bien de scroller en haut après navigation
 * client, mais le smooth-scroll CSS rend la transition lente — l'utilisateur
 * a l'impression d'atterrir « en milieu de page ». On désactive temporairement
 * le smooth via un attribut data-* pour faire un saut instantané.
 *
 * Respecte l'ancrage si l'URL contient un hash (#section).
 */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash) return;

    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    // Deux passes : juste après le commit React (au cas où le DOM est encore
    // en train de se construire) puis sur le frame suivant pour neutraliser
    // toute tentative concurrente de scroll-restoration du navigateur.
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      html.style.scrollBehavior = previous;
    });
  }, [pathname]);

  return null;
}
