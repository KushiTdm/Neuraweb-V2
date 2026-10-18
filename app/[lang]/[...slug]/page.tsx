import { notFound } from 'next/navigation';

// Capte toute URL inconnue sous /<lang>/… pour afficher la 404 personnalisée (app/[lang]/not-found.tsx)
// avec un vrai statut HTTP 404 (pas de soft-404).
export default function CatchAll() {
  notFound();
}
