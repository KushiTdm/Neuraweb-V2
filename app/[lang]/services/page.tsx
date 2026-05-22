import { permanentRedirect } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from '@/proxy';

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default async function ServicesPageRedirect({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  permanentRedirect(`/${lang}/developpement-web`);
}
