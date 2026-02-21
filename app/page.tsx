import { redirect } from 'next/navigation';

/**
 * Page racine : redirige vers /fr en 308 (permanent).
 * Sans cette redirection, neuraweb.tech/ peut renvoyer une 404
 * ou une page vide, ce qui détruit le ranking sur le nom de marque.
 *
 * Le 308 (vs 301) est recommandé avec Next.js App Router car il
 * préserve la méthode HTTP et est mieux géré par les crawlers modernes.
 */
export default function RootPage() {
  redirect('/fr');
}