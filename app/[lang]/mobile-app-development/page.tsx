import type { Metadata } from 'next';
import { MobileAppDevClient } from '@/components/mobile-app-dev-client';
import { JsonLd } from '@/components/json-ld';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

type Lang = 'fr' | 'en' | 'es' | 'vi';

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export const revalidate = 3600;

const META: Record<Lang, { title: string; description: string; keywords: string[]; ogTitle: string; ogDescription: string }> = {
  fr: {
    title: 'Développement Application Mobile iOS & Android | NeuraWeb',
    description: 'Agence de développement d\'applications mobiles basée à Lille, clients à Paris et partout en France. Apps iOS, Android, React Native, Flutter. MVP à partir de 8 900€. Devis gratuit sous 24h.',
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
    ogDescription: 'Création d\'apps mobiles natives et cross-platform pour startups et PME. MVP à partir de 8 900€.',
  },
  en: {
    title: 'Mobile App Development Agency — iOS & Android | NeuraWeb',
    description: 'Custom mobile app development agency. iOS, Android, React Native, Flutter. MVP from €8,900. Free detailed quote within 24h. Based in France, clients worldwide.',
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
    ogDescription: 'Custom iOS and Android apps for startups and SMBs. MVP from €8,900. Free quote in 24h.',
  },
  es: {
    title: 'Desarrollo Aplicaciones Móviles iOS y Android | NeuraWeb',
    description: 'Agencia de desarrollo de aplicaciones móviles. Apps iOS, Android, React Native, Flutter. MVP desde 8 900€. Presupuesto detallado gratis en 24h.',
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
    ogDescription: 'Apps móviles a medida para startups y pymes. MVP desde 8 900€. Presupuesto gratis en 24h.',
  },
  vi: {
    title: 'Phát triển ứng dụng di động iOS & Android | NeuraWeb',
    description: 'Đội ngũ Pháp tại Hà Nội phát triển ứng dụng di động iOS, Android, React Native, Flutter cho startup và doanh nghiệp. MVP trong 6 tuần, báo giá miễn phí trong 24 giờ.',
    keywords: [
      'phát triển ứng dụng di động',
      'thiết kế app mobile',
      'công ty làm app Hà Nội',
      'phát triển app iOS Android',
      'lập trình React Native',
      'lập trình Flutter',
      'làm app cho doanh nghiệp',
      'app di động theo yêu cầu',
      'MVP ứng dụng di động',
      'báo giá phát triển app',
    ],
    ogTitle: 'Phát triển ứng dụng di động iOS & Android — NeuraWeb',
    ogDescription: 'Phát triển ứng dụng di động native và đa nền tảng cho startup và doanh nghiệp. MVP trong 6 tuần.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = (lang as Lang) || 'fr';
  const baseUrl = 'https://neuraweb.fr';
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
        vi: `${baseUrl}/vi/mobile-app-development`,
        'x-default': `${baseUrl}/fr/mobile-app-development`,
      },
    },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: `${baseUrl}${path}`,
      siteName: 'NeuraWeb',
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.ogTitle }],
      locale: language === 'fr' ? 'fr_FR' : language === 'es' ? 'es_ES' : language === 'vi' ? 'vi_VN' : 'en_US',
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
    { question: 'Combien coûte le développement d\'une application mobile en France ?', answer: 'Un MVP démarre à 8 900€ en cross-platform — bien en dessous des 11 000€ à 25 000€ généralement constatés sur le marché français en 2026. Une app standard iOS + Android se situe entre 15 900€ et 30 000€ selon la complexité. Une app premium avec IA ou temps réel peut dépasser 50 000€.' },
    { question: 'Combien de temps pour créer une app mobile ?', answer: 'Comptez 6 à 8 semaines pour un MVP, 12 à 16 semaines pour une app complète iOS + Android avec backend. Livraison par sprints de 2 semaines.' },
    { question: 'Cross-platform (React Native/Flutter) ou natif (Swift/Kotlin) ?', answer: 'Cross-platform pour un MVP rapide et un budget serré. Natif si vous visez une expérience premium ou une intégration profonde avec le système.' },
    { question: 'Gérez-vous la publication sur l\'App Store et Google Play ?', answer: 'Oui, inclus dans tous nos packs. Nous créons les comptes développeurs si besoin et gérons la soumission complète.' },
    { question: 'Intervenez-vous à Lille, Lyon, Marseille ?', answer: 'Oui. Équipe basée à Lille, clients partout en France (Paris, Lyon, Marseille...). Travail à distance avec points hebdomadaires en visio.' },
  ],
  en: [
    { question: 'How much does mobile app development cost?', answer: 'An MVP starts at €8,900 cross-platform — well below the €11,000-€25,000 typically seen on the French market in 2026. A standard iOS + Android app costs €15,900-€30,000. A premium app with AI or real-time features can exceed €50,000.' },
    { question: 'How long does it take to build a mobile app?', answer: 'Count 6-8 weeks for an MVP, 12-16 weeks for a full iOS + Android app with backend. Delivered in 2-week sprints.' },
    { question: 'Cross-platform (React Native/Flutter) or native (Swift/Kotlin)?', answer: 'Cross-platform for a fast MVP and tight budget. Native if you need premium experience or deep OS integration.' },
    { question: 'Do you handle App Store and Google Play submission?', answer: 'Yes, included in all packs. We set up developer accounts if needed and handle the full submission process.' },
    { question: 'Do you work with international clients?', answer: 'Yes. Team based in France, clients worldwide. Remote-first with weekly video syncs.' },
  ],
  es: [
    { question: '¿Cuánto cuesta desarrollar una app móvil?', answer: 'Un MVP empieza en 8 900€ multiplataforma — muy por debajo de los 11 000€ a 25 000€ habituales en el mercado francés en 2026. Una app estándar iOS + Android cuesta entre 15 900€ y 30 000€. Una app premium con IA puede superar 50 000€.' },
    { question: '¿Cuánto tiempo lleva crear una app móvil?', answer: 'Cuenta 6 a 8 semanas para un MVP, 12 a 16 semanas para una app completa iOS + Android con backend.' },
    { question: '¿Multiplataforma o nativo?', answer: 'Multiplataforma para un MVP rápido y presupuesto ajustado. Nativo si buscas experiencia premium o integración profunda con el sistema.' },
    { question: '¿Gestionáis la publicación en App Store y Google Play?', answer: 'Sí, incluido en todos los paquetes. Creamos las cuentas de desarrollador y gestionamos el envío completo.' },
    { question: '¿Trabajáis con clientes internacionales?', answer: 'Sí. Equipo basado en Francia, clientes en toda Europa. Remoto con puntos semanales por video.' },
  ],
  vi: [
    { question: 'Chi phí phát triển một ứng dụng di động là bao nhiêu?', answer: 'Chi phí phụ thuộc vào phạm vi thực tế: số màn hình, backend, tích hợp thanh toán hay AI. Vì vậy chúng tôi báo giá riêng cho từng dự án sau một buổi trao đổi ngắn về nhu cầu của bạn. Báo giá miễn phí, gửi trong 24 giờ và không ràng buộc.' },
    { question: 'Làm một ứng dụng di động mất bao lâu?', answer: 'Khoảng 6 đến 8 tuần cho bản MVP, và 12 đến 16 tuần cho một ứng dụng hoàn chỉnh iOS + Android kèm backend. Chúng tôi bàn giao theo từng sprint 2 tuần để bạn thấy tiến độ liên tục.' },
    { question: 'Nên chọn đa nền tảng (React Native/Flutter) hay native (Swift/Kotlin)?', answer: 'Đa nền tảng phù hợp khi bạn cần ra mắt MVP nhanh với ngân sách gọn. Native phù hợp khi bạn hướng tới trải nghiệm cao cấp hoặc cần khai thác sâu tính năng của hệ điều hành.' },
    { question: 'Các bạn có lo phần đăng ứng dụng lên App Store và Google Play không?', answer: 'Có, việc này nằm trong tất cả các gói. Chúng tôi tạo tài khoản nhà phát triển nếu bạn chưa có và xử lý toàn bộ quá trình gửi duyệt ứng dụng.' },
    { question: 'Các bạn làm việc với khách hàng tại Việt Nam như thế nào?', answer: 'Đội ngũ người Pháp của chúng tôi có mặt tại Hà Nội, làm việc trực tiếp hoặc từ xa với khách hàng trên cả nước. Trao đổi được bằng tiếng Việt, tiếng Anh và tiếng Pháp, với buổi cập nhật tiến độ hằng tuần qua video call.' },
  ],
};

const generateMobileAppJsonLd = (lang: Lang) => {
  const baseUrl = 'https://neuraweb.fr';
  const serviceName: Record<Lang, string> = {
    fr: 'Développement d\'applications mobiles iOS et Android',
    en: 'Mobile app development for iOS and Android',
    es: 'Desarrollo de aplicaciones móviles iOS y Android',
    vi: 'Phát triển ứng dụng di động iOS và Android',
  };
  const serviceDesc: Record<Lang, string> = {
    fr: 'Création d\'applications mobiles natives (Swift, Kotlin) et cross-platform (React Native, Flutter) pour startups et PME.',
    en: 'Native (Swift, Kotlin) and cross-platform (React Native, Flutter) mobile app development for startups and SMBs.',
    es: 'Desarrollo de aplicaciones móviles nativas (Swift, Kotlin) y multiplataforma (React Native, Flutter) para startups y pymes.',
    vi: 'Phát triển ứng dụng di động native (Swift, Kotlin) và đa nền tảng (React Native, Flutter) cho startup và doanh nghiệp.',
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
        // Mode devis intégral en vi (cf. QUOTE_ONLY_LANGS) : aucun montant EUR
        // n'est exposé dans le balisage pour la locale vietnamienne.
        { '@type': 'Offer', name: 'Mobile MVP', ...(lang === 'vi' ? {} : { price: '8900', priceCurrency: 'EUR' }), description: 'React Native cross-platform MVP, 3-5 screens, store publication.' },
        { '@type': 'Offer', name: 'Standard App', ...(lang === 'vi' ? {} : { price: '15900', priceCurrency: 'EUR' }), description: 'iOS + Android app, 10-15 screens, custom backend, 3 months support.' },
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
    vi: 'Phát triển ứng dụng di động',
  };
  const breadcrumbData = generateBreadcrumbSchema([
    { name: language === 'fr' ? 'Accueil' : language === 'es' ? 'Inicio' : language === 'vi' ? 'Trang chủ' : 'Home', url: `/${language}` },
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
