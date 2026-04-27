'use client';

import { useEffect } from 'react';

interface JsonLdProps {
  id: string;
  data: Record<string, unknown>;
}

/**
 * Injecte un schéma JSON-LD dans <head> côté client après hydratation.
 *
 * Pourquoi pas un simple <script type="application/ld+json"> dans un Server Component ?
 * Next.js App Router sérialise le contenu des Server Components dans le RSC payload
 * pour l'hydratation client (`self.__next_f.push(...)`). Le <script> JSON-LD se
 * retrouve donc DEUX fois dans le HTML final : une fois en tant que tag rendu, une
 * fois dans le RSC payload. Google détecte les deux et signale "Champ FAQPage en
 * double" + "Élément sans nom" (le second est cassé par l'échappement).
 *
 * En l'injectant via useEffect, le <script> n'existe que dans le DOM hydraté.
 * Googlebot exécute le JS (Chromium headless) et voit le schéma une seule fois.
 */
export function JsonLd({ id, data }: JsonLdProps) {
  useEffect(() => {
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      const node = document.getElementById(id);
      if (node) node.remove();
    };
  }, [id, data]);

  return null;
}
