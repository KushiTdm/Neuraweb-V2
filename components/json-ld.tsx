'use client';

interface JsonLdProps {
  id: string;
  data: Record<string, unknown>;
}

/**
 * Rend un schéma JSON-LD dans le HTML initial (SSR), lisible par tous les
 * crawlers — y compris ceux qui n'exécutent pas le JS (GPTBot, ClaudeBot,
 * Bingbot, PerplexityBot…).
 *
 * Pourquoi un Client Component qui rend le <script> directement, et non :
 * – un Server Component ? Next.js sérialise le rendu des Server Components
 *   dans le payload RSC (`self.__next_f.push(...)`). Le tag complet
 *   `<script type="application/ld+json">` s'y retrouvait échappé une seconde
 *   fois, et Google signalait "Champ FAQPage en double" + "Élément sans nom".
 * – une injection useEffect (ancienne approche) ? Le schéma n'existait que
 *   dans le DOM hydraté : invisible pour les crawlers IA sans JS, Bing et
 *   les outils d'audit — rédhibitoire pour le GEO/AEO.
 *
 * En Client Component, le HTML SSR contient le tag une seule fois ; le payload
 * RSC ne contient que les props (les données sans le marqueur
 * `application/ld+json`), donc pas de double détection.
 */
export function JsonLd({ id, data }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // < : empêche un éventuel "</script>" dans les données de casser le tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
