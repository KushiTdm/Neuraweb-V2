import { Metadata } from 'next';
import { BookingPageClient } from '@/components/booking-page-client';
import { SUPPORTED_LANGUAGES } from '@/proxy';

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  
  const titles = {
    fr: 'Réserver un rendez-vous | NeuraWeb',
    en: 'Book an appointment | NeuraWeb',
    es: 'Reservar una cita | NeuraWeb',
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.fr,
    description: 'Réservez votre créneau pour discuter de votre projet avec NeuraWeb',
  };
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ service?: string; pack?: string }>;
}) {
  const { lang } = await params;
  const { service, pack } = await searchParams;

  return (
    <BookingPageClient 
      lang={lang as 'fr' | 'en' | 'es'} 
      preselectedService={service}
      preselectedPack={pack}
    />
  );
}