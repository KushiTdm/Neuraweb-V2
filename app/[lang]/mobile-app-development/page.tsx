import type { Metadata } from 'next';
import { MobileAppDevClient } from '@/components/mobile-app-dev-client';
import { JsonLd } from '@/components/json-ld';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

type Lang = 'fr' | 'en' | 'es';

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export const revalidate = 86400;

const META: Record<Lang, { title: string; description: string; keywords: string[]; ogTitle: string; ogDescription: string }> = {
  fr: {
    title: 'Développement Application Mobile iOS & Android | NeuraWeb',
    description: 'Agence de développement d\'applications mobiles à Paris et Lille. Apps iOS, Android, React Native, Flutter. MVP à partir de 6 900€. Devis gratuit sous 24h.',
    keywords: [
      'développement application mobile',
      'création application mobile',
      'agence application mobile',
      'développement app iOS Android',
      'agence React Native France',
      'création app mobile Paris',
      'création applications mobiles Lille',
      'développeur Flutter Paris',
      'application mobile sur mesure',
      'tarifs développement app mobile',
    ],
    ogTitle: 'Développement Application Mobile iOS & Android — NeuraWeb',
    ogDescription: 'Création d\'apps mobiles natives et cross-platform pour startups et PME. MVP à partir de 6 900€.',
  },
  en: {
    title: 'Mobile App Development Agency — iOS & Android | NeuraWeb',
    description: 'Custom mobile app development agency. iOS, Android, React Native, Flutter. MVP from €6,900. Free detailed quote within 24h. Based in France, clients worldwide.',
    keywords: [
      'mobile app development',
      'mobile app development agency',
      'custom mobile app development',
      'iOS app development',
      'Android app development',
      'React Native development agency',
      'Flutter app development',
      'mobile app development services',
      'custom app development services',
      'mobile app development pricing',
    ],
    ogTitle: 'Mobile App Development Agency — iOS & Android | NeuraWeb',
    ogDescription: 'Custom iOS and Android apps for startups and SMBs. MVP from €6,900. Free quote in 24h.',
  },
  es: {
    title: 'Desarrollo Aplicaciones Móviles iOS y Android | NeuraWeb',
    description: 'Agencia de desarrollo de aplicaciones móviles. Apps iOS, Android, React Native, Flutter. MVP desde 6 900€. Presupuesto detallado gratis en 24h.',
    keywords: [
      'desarrollo aplicaciones móviles',
      'agencia desarrollo apps móviles',
      'desarrollo app iOS Android',
      'agencia React Native',
      'desarrollo Flutter',
      'creación aplicaciones móviles',
      'desarrollo app a medida',
      'precio desarrollo app móvil',
      'agencia apps móviles España',
    ],
    ogTitle: 'Desarrollo Aplicaciones Móviles iOS y Android — NeuraWeb',
    ogDescription: 'Apps móviles a medida para startups y pymes. MVP desde 6 900€. Presupuesto gratis en 24h.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = (lang as Lang) || 'fr';
  const baseUrl = 'https://neuraweb.tech';
  const ogImage = `${baseUrl}/assets/og-image.png`;
  const meta = META[language] ?? META.fr;
  const path = `/${language}/mobile-app-development`;

  return {
    title: { absolute: meta.title },
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: {
        fr: `${baseUrl}/fr/mobile-app-development`,
        en: `${baseUrl}/en/mobile-app-development`,
        es: `${baseUrl}/es/mobile-app-development`,
        'x-default': `${baseUrl}/fr/mobile-app-development`,
      },
    },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: `${baseUrl}${path}`,
      siteName: 'NeuraWeb',
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.ogTitle }],
      locale: language === 'fr' ? 'fr_FR' : language === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: [ogImage],
      creator: '@neurawebtech',
    },
  };
}

const FAQ_BY_LANG: Record<Lang, { question: string; answer: string }[]> = {
  fr: [
    { question: 'Combien coûte le développement d\'une application mobile en France ?', answer: 'Un MVP démarre à 6 900€ en cross-platform. Une app standard iOS + Android coûte entre 12 000€ et 30 000€ selon la complexité. Une app premium avec IA ou temps réel peut dépasser 50 000€.' },
    { question: 'Combien de temps pour créer une app mobile ?', answer: 'Comptez 6 à 8 semaines pour un MVP, 12 à 16 semaines pour une app complète iOS + Android avec backend. Livraison par sprints de 2 semaines.' },
    { question: 'Cross-platform (React Native/Flutter) ou natif (Swift/Kotlin) ?', answer: 'Cross-platform pour un MVP rapide et un budget serré. Natif si vous visez une expérience premium ou une intégration profonde avec le système.' },
    { question: 'Gérez-vous la publication sur l\'App Store et Google Play ?', answer: 'Oui, inclus dans tous nos packs. Nous créons les comptes développeurs si besoin et gérons la soumission complète.' },
    { question: 'Intervenez-vous à Lille, Lyon, Marseille ?', answer: 'Oui. Équipe basée à Paris, clients partout en France. Travail à distance avec points hebdomadaires en visio.' },
  ],
  en: [
    { question: 'How much does mobile app development cost?', answer: 'An MVP starts at €6,900 cross-platform. A standard iOS + Android app costs €12,000-€30,000. A premium app with AI or real-time features can exceed €50,000.' },
    { question: 'How long does it take to build a mobile app?', answer: 'Count 6-8 weeks for an MVP, 12-16 weeks for a full iOS + Android app with backend. Delivered in 2-week sprints.' },
    { question: 'Cross-platform (React Native/Flutter) or native (Swift/Kotlin)?', answer: 'Cross-platform for a fast MVP and tight budget. Native if you need premium experience or deep OS integration.' },
    { question: 'Do you handle App Store and Google Play submission?', answer: 'Yes, included in all packs. We set up developer accounts if needed and handle the full submission process.' },
    { question: 'Do you work with international clients?', answer: 'Yes. Team based in France, clients worldwide. Remote-first with weekly video syncs.' },
  ],
  es: [
    { question: '¿Cuánto cuesta desarrollar una app móvil?', answer: 'Un MVP empieza en 6 900€ multiplataforma. Una app estándar iOS + Android cuesta entre 12 000€ y 30 000€. Una app premium con IA puede superar 50 000€.' },
    { question: '¿Cuánto tiempo lleva crear una app móvil?', answer: 'Cuenta 6 a 8 semanas para un MVP, 12 a 16 semanas para una app completa iOS + Android con backend.' },
    { question: '¿Multiplataforma o nativo?', answer: 'Multiplataforma para un MVP rápido y presupuesto ajustado. Nativo si buscas experiencia premium o integración profunda con el sistema.' },
    { question: '¿Gestionáis la publicación en App Store y Google Play?', answer: 'Sí, incluido en todos los paquetes. Creamos las cuentas de desarrollador y gestionamos el envío completo.' },
    { question: '¿Trabajáis con clientes internacionales?', answer: 'Sí. Equipo basado en Francia, clientes en toda Europa. Remoto con puntos semanales por video.' },
  ],
};

const generateMobileAppJsonLd = (lang: Lang) => {
  const baseUrl = 'https://neuraweb.tech';
  const serviceName: Record<Lang, string> = {
    fr: 'Développement d\'applications mobiles iOS et Android',
    en: 'Mobile app development for iOS and Android',
    es: 'Desarrollo de aplicaciones móviles iOS y Android',
  };
  const serviceDesc: Record<Lang, string> = {
    fr: 'Création d\'applications mobiles natives (Swift, Kotlin) et cross-platform (React Native, Flutter) pour startups et PME.',
    en: 'Native (Swift, Kotlin) and cross-platform (React Native, Flutter) mobile app development for startups and SMBs.',
    es: 'Desarrollo de aplicaciones móviles nativas (Swift, Kotlin) y multiplataforma (React Native, Flutter) para startups y pymes.',
  };

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/${lang}/mobile-app-development#service`,
    name: serviceName[lang],
    description: serviceDesc[lang],
    serviceType: 'Mobile App Development',
    provider: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'NeuraWeb',
      url: baseUrl,
    },
    areaServed: [
      { '@type': 'City', name: 'Paris' },
      { '@type': 'City', name: 'Lille' },
      { '@type': 'City', name: 'Lyon' },
      { '@type': 'City', name: 'Marseille' },
      { '@type': 'AdministrativeArea', name: 'Île-de-France' },
      { '@type': 'AdministrativeArea', name: 'Hauts-de-France' },
      { '@type': 'Country', name: 'France' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Mobile App Development Packs',
      itemListElement: [
        { '@type': 'Offer', name: 'Mobile MVP', price: '6900', priceCurrency: 'EUR', description: 'React Native cross-platform MVP, 3-5 screens, store publication.' },
        { '@type': 'Offer', name: 'Standard App', price: '12900', priceCurrency: 'EUR', description: 'iOS + Android app, 10-15 screens, custom backend, 3 months support.' },
        { '@type': 'Offer', name: 'Premium App', description: 'Advanced features (AI, real-time), custom design, scalable architecture, 24/7 SLA.' },
      ],
    },
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${baseUrl}/${lang}/mobile-app-development#faq`,
    mainEntity: FAQ_BY_LANG[lang].map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return [service, faq];
};

export default async function MobileAppDevPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const language = (lang as Lang) || 'fr';
  const jsonLd = generateMobileAppJsonLd(language);

  // Breadcrumb pour navigation SERP
  const breadcrumbName: Record<Lang, string> = {
    fr: 'Développement Mobile',
    en: 'Mobile Development',
    es: 'Desarrollo Móvil',
  };
  const breadcrumbData = generateBreadcrumbSchema([
    { name: language === 'fr' ? 'Accueil' : language === 'es' ? 'Inicio' : 'Home', url: `/${language}` },
    { name: breadcrumbName[language], url: `/${language}/mobile-app-development` },
  ]);

  return (
    <>
      {jsonLd.map((schema, i) => (
        <JsonLd key={i} id={`mobile-app-schema-${i}`} data={schema} />
      ))}
      <JsonLd id="breadcrumb-schema" data={breadcrumbData} />
      <MobileAppDevClient lang={language} />
    </>
  );
}
