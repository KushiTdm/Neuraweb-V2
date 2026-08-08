import { Metadata } from 'next';
import { JsonLd } from '@/components/json-ld';
import { IntegrationIAPageClient } from '@/components/integration-ia-page-client';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

const BASE_URL = 'https://neuraweb.fr';
const PAGE_SLUG = 'integration-ia';

type Lang = 'fr' | 'en' | 'es' | 'vi';

export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ lang: 'fr' }, { lang: 'en' }, { lang: 'es' }, { lang: 'vi' }];
}

const META: Record<Lang, {
  title: string;
  description: string;
  keywords: string[];
  locale: string;
}> = {
  fr: {
    title: 'Intégration IA, Chatbot RAG, Agents Autonomes | NeuraWeb',
    description: "Intégrez l'IA dans votre site : chatbot RAG, agents IA, LLM (Claude, Mistral, GPT), génération de contenu. Audit gratuit 490 €. Dès 1 499 € HT.",
    keywords: [
      'intégration IA site web',
      'chatbot IA entreprise',
      'agent IA commercial',
      'RAG chatbot France',
      'intégration Claude GPT France',
      'agent IA autonome PME',
      'chatbot intelligent site web',
      'IA agentique entreprise',
      'génération contenu IA',
      'intégration LLM',
      'agence IA France',
      'chatbot FAQ intelligent',
    ],
    locale: 'fr_FR',
  },
  en: {
    title: 'AI Integration, RAG Chatbot & Autonomous AI Agents | NeuraWeb',
    description: 'Integrate AI into your website: RAG chatbot, AI agents, LLMs (Claude, Mistral, GPT), content generation. Free audit. From €1,499 ex. VAT.',
    keywords: [
      'AI integration website',
      'enterprise AI chatbot',
      'AI commercial agent',
      'RAG chatbot France',
      'Claude GPT integration',
      'autonomous AI agent SMB',
      'intelligent website chatbot',
      'agentic AI business',
      'AI content generation',
      'LLM integration',
      'AI agency France',
      'intelligent FAQ chatbot',
    ],
    locale: 'en_US',
  },
  es: {
    title: 'Integración IA, Chatbot RAG y Agentes Autónomos | NeuraWeb',
    description: 'Integra la IA en tu sitio web: chatbot RAG, agentes IA, LLMs (Claude, Mistral, GPT), generación de contenido. Auditoría gratuita. Desde 1.499 € sin IVA.',
    keywords: [
      'integración IA sitio web',
      'chatbot IA empresa',
      'agente IA comercial',
      'RAG chatbot Francia',
      'integración Claude GPT',
      'agente IA autónomo PYME',
      'chatbot inteligente sitio web',
      'IA agéntica empresa',
      'generación contenido IA',
      'integración LLM',
      'agencia IA Francia',
      'chatbot FAQ inteligente',
    ],
    locale: 'es_ES',
  },
  vi: {
    title: 'Tích hợp AI, Chatbot RAG & AI Agent tự vận hành | NeuraWeb',
    description: 'Đưa AI vào website của bạn: chatbot RAG, AI agent, LLM (Claude, Mistral, GPT), tạo nội dung tự động. Tư vấn miễn phí, báo giá riêng theo nhu cầu thực tế.',
    keywords: [
      'tích hợp AI vào website',
      'chatbot AI cho doanh nghiệp',
      'AI agent bán hàng',
      'chatbot RAG Việt Nam',
      'tích hợp ChatGPT Claude',
      'AI agent tự vận hành',
      'chatbot thông minh cho website',
      'ứng dụng AI trong kinh doanh',
      'tạo nội dung bằng AI',
      'tích hợp LLM',
      'công ty AI Hà Nội',
      'chatbot trả lời câu hỏi thường gặp',
    ],
    locale: 'vi_VN',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const l: Lang = (lang as Lang) in META ? (lang as Lang) : 'fr';
  const meta = META[l];
  const pagePath = `/${l}/${PAGE_SLUG}`;
  const ogImage = `${BASE_URL}/assets/og-image.png`;

  return {
    title: { absolute: meta.title },
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `${BASE_URL}${pagePath}`,
      languages: {
        fr: `${BASE_URL}/fr/${PAGE_SLUG}`,
        en: `${BASE_URL}/en/${PAGE_SLUG}`,
        es: `${BASE_URL}/es/${PAGE_SLUG}`,
        vi: `${BASE_URL}/vi/${PAGE_SLUG}`,
        'x-default': `${BASE_URL}/fr/${PAGE_SLUG}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${BASE_URL}${pagePath}`,
      siteName: 'NeuraWeb',
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.title }],
      locale: meta.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [ogImage],
      creator: '@neurawebtech',
    },
  };
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AI Integration & Chatbots — NeuraWeb',
  description:
    'Agency specialised in AI integration for SMBs: RAG chatbots, commercial AI agents, LLMs (Claude, Mistral, GPT), content generation, SEO automation. Free audit included.',
  url: `${BASE_URL}/fr/${PAGE_SLUG}`,
  provider: {
    '@type': 'Organization',
    name: 'NeuraWeb',
    url: BASE_URL,
  },
  areaServed: { '@type': 'Country', name: 'France' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'AI Integration Packs',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Pack Essentiel IA',
        price: '1499',
        priceCurrency: 'EUR',
        description: 'AI FAQ chatbot, site + 1 doc indexing, 500 conversations/month.',
      },
      {
        '@type': 'Offer',
        name: 'Pack Business IA',
        price: '3999',
        priceCurrency: 'EUR',
        description: 'Qualifying AI agent, connected CRM, 800 conversations/month, 3 languages.',
      },
      {
        '@type': 'Offer',
        name: 'Pack Premium IA',
        price: '9999',
        priceCurrency: 'EUR',
        description: 'Multi-agent system, large-scale RAG, sovereign French hosting.',
      },
    ],
  },
};

/**
 * La version vietnamienne du site est commercialisée en mode devis intégral :
 * on retire `hasOfferCatalog` (donc les montants EUR) pour `lang === 'vi'`,
 * comme le fait déjà `getProfessionalServiceSchema` dans lib/structured-data.
 */
function serviceSchemaForLang(lang: Lang): Record<string, unknown> {
  if (lang === 'vi') {
    const { hasOfferCatalog: _omitted, ...withoutOffers } = serviceSchema;
    return withoutOffers;
  }
  return serviceSchema;
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Quelle est la différence entre un chatbot classique et un agent IA RAG ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Un chatbot classique répond depuis un arbre de décision figé. Un agent IA RAG indexe vos contenus réels et génère des réponses précises basées sur VOS données. Il comprend les questions en langage naturel et gère les nuances.",
      },
    },
    {
      '@type': 'Question',
      name: "Mes données restent-elles confidentielles avec l'IA ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui. Les modèles sont configurés pour que vos données ne servent pas à entraîner des modèles tiers. Pour les données sensibles, nous recommandons un modèle open source self-hosted (Mistral ou LLama) sur serveurs France.",
      },
    },
    {
      '@type': 'Question',
      name: "Quel budget prévoir pour un projet IA ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Un chatbot FAQ simple : 1 499 € HT + 39 €/mois. Un agent IA commercial avec CRM : 3 999 € HT + 89 €/mois. Un système multi-agents souverain : à partir de 9 999 € HT. L'audit gratuit donne une estimation précise.",
      },
    },
  ],
};

/**
 * Ce FAQPage schema était injecté tel quel (français, prix EUR) sur toutes les
 * langues, y compris vi — bug indépendant du chantier de localisation, corrigé
 * ici pour vi uniquement (fr/en/es inchangés, aucune régression possible).
 */
const faqSchemaVi = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Chatbot thông thường khác gì với AI agent RAG?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chatbot thông thường trả lời theo kịch bản cố định. AI agent RAG lập chỉ mục nội dung thật của bạn và tạo câu trả lời chính xác dựa trên chính dữ liệu của bạn. Nó hiểu câu hỏi bằng ngôn ngữ tự nhiên và xử lý được các sắc thái phức tạp.',
      },
    },
    {
      '@type': 'Question',
      name: 'Dữ liệu của tôi có được bảo mật khi dùng AI không?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Có. Các mô hình được cấu hình để dữ liệu của bạn không được dùng để huấn luyện mô hình của bên thứ ba. Với dữ liệu nhạy cảm, chúng tôi khuyến nghị mô hình mã nguồn mở tự host (Mistral hoặc Llama) trên máy chủ tại châu Âu.',
      },
    },
    {
      '@type': 'Question',
      name: 'Chi phí cho một dự án AI là bao nhiêu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chi phí phụ thuộc vào độ phức tạp: một chatbot FAQ đơn giản, một AI agent tư vấn tích hợp CRM, hay một hệ thống multi-agent riêng cho doanh nghiệp đều có mức đầu tư rất khác nhau. Buổi tư vấn 30 phút miễn phí giúp xác định đúng nhu cầu và đưa ra báo giá chính xác trong 24-48 giờ.',
      },
    },
  ],
};

function faqSchemaForLang(lang: Lang) {
  return lang === 'vi' ? faqSchemaVi : faqSchema;
}

const BREADCRUMB_NAMES: Record<Lang, [string, string]> = {
  fr: ['Accueil', 'Intégration IA'],
  en: ['Home', 'AI Integration'],
  es: ['Inicio', 'Integración IA'],
  vi: ['Trang chủ', 'Tích hợp AI'],
};

export default async function IntegrationIAPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l: Lang = (lang as Lang) in META ? (lang as Lang) : 'fr';
  const pagePath = `/${l}/${PAGE_SLUG}`;

  const breadcrumbData = generateBreadcrumbSchema([
    { name: BREADCRUMB_NAMES[l][0], url: `/${l}` },
    { name: BREADCRUMB_NAMES[l][1], url: pagePath },
  ]);

  return (
    <>
      <JsonLd id="integration-ia-service" data={serviceSchemaForLang(l)} />
      <JsonLd id="integration-ia-faq" data={faqSchemaForLang(l)} />
      <JsonLd id="integration-ia-breadcrumb" data={breadcrumbData} />
      <IntegrationIAPageClient lang={l} />
    </>
  );
}
