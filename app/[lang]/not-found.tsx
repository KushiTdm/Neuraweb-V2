import type { Metadata } from 'next';
import { NotFoundView } from '@/components/not-found-view';

export const metadata: Metadata = {
  title: { absolute: 'Page introuvable (404) | NeuraWeb' },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundView />;
}
