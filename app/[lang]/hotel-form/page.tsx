
// FICHIER 18 : app/[lang]/hotel-form/page.tsx
// Page Next.js avec generateMetadata
// ============================================================
import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import type { Language } from '@/lib/mdx';
import { HotelFormWrapper } from './HotelFormWrapper';

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map(lang => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = 'https://neuraweb.tech';

  const meta = {
    fr: {
      title: 'Formulaire Projet Hôtelier | NeuraWeb',
      description: 'Partagez les besoins de votre hôtel ou hostal. Nous créons votre site web sur mesure avec système de réservation, multilangue et chatbot IA.',
    },
    en: {
      title: 'Hotel Project Form | NeuraWeb',
      description: 'Share your hotel or hostal needs. We build your custom website with booking system, multilingual support and AI chatbot.',
    },
    es: {
      title: 'Formulario Proyecto Hotelero | NeuraWeb',
      description: 'Comparta las necesidades de su hotel u hostal. Creamos su sitio web a medida con sistema de reservas, multilingüe y chatbot IA.',
    },
  };

  const m = meta[lang as keyof typeof meta] ?? meta.fr;

  return {
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${baseUrl}/${lang}/hotel-form`,
      languages: {
        'fr-FR': `${baseUrl}/fr/hotel-form`,
        'en-US': `${baseUrl}/en/hotel-form`,
        'es-ES': `${baseUrl}/es/hotel-form`,
        'x-default': `${baseUrl}/fr/hotel-form`,
      },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `${baseUrl}/${lang}/hotel-form`,
      siteName: 'NeuraWeb',
      images: [{ url: `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: m.title }],
      locale: lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
  };
}

export default async function HotelFormPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-[#050510] py-16 px-4">
        {/* Background orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute w-[600px] h-[600px] rounded-full -top-48 -left-48 opacity-10 blur-[80px] animate-[float_8s_ease-in-out_infinite]" style={{ background: '#6366f1' }} />
          <div className="absolute w-[400px] h-[400px] rounded-full -bottom-24 -right-24 opacity-10 blur-[80px] animate-[float_8s_ease-in-out_3s_infinite]" style={{ background: '#8b5cf6' }} />
          <div className="absolute w-[300px] h-[300px] rounded-full top-1/2 left-[60%] opacity-10 blur-[80px] animate-[float_8s_ease-in-out_5s_infinite]" style={{ background: '#22d3ee' }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.72rem] font-semibold uppercase tracking-widest text-violet-400 mb-5"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
              NeuraWeb — Formulaire Client
            </div>
            <h1 className="font-extrabold tracking-tight leading-tight mb-3"
              style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem,5vw,3rem)' }}>
              Votre projet{' '}
              <span style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc,#67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                hôtelier
              </span>
              <br />en détail
            </h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Remplissez ce formulaire pour nous permettre de développer votre site web sur mesure. Comptez environ 10 minutes.
            </p>
          </div>

          {/* Gradient line */}
          <div className="h-px mb-10" style={{ background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.5),rgba(139,92,246,0.5),transparent)' }} />

          <HotelFormWrapper lang={lang as Language} />
        </div>
      </main>
      <Footer />
    </>
  );
}