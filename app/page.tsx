import { permanentRedirect } from 'next/navigation';

/**
 * Page racine : redirige vers /fr en 308 (permanent).
 *  
 * Différence critique :
 * - 307 = temporaire → Google ne transfère pas le PageRank, peut ne pas indexer /fr
 * - 308 = permanent  → Google transfère le PageRank et indexe /fr comme page principale
 *
 * Le 308 (vs 301) est recommandé avec Next.js App Router car il
 * préserve la méthode HTTP et est mieux géré par les crawlers modernes.
 */
export default function RootPage() {
  permanentRedirect('/fr');
}