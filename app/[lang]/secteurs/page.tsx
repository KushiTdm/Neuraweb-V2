import type { Metadata } from 'next';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SectorsSection } from '@/components/sections/sectors-section';
import { JsonLd } from '@/components/json-ld';
import { generateBreadcrumbSchema } from '@/lib/structured-data';

// Hub « Secteurs » : cible de maillage interne, distinct des services (voir docs/brand/IA_SERVICES_SECTEURS.md).
const BASE_URL = 'https://neuraweb.fr';

const COPY = {
  fr: { title: 'Sites web par secteur : santé, restaurants, mairies | NeuraWeb', description: 'Santé, restaurants & hôtels, collectivités : des sites web et des outils pensés pour votre métier, avec des prix affichés et une réglementation maîtrisée.', crumb: 'Secteurs' },
  en: { title: 'Websites by industry: healthcare, restaurants, local authorities | NeuraWeb', description: 'Healthcare, restaurants & hotels, local authorities: websites and tools built for your profession, with posted prices and regulation under control.', crumb: 'Industries' },
  es: { title: 'Sitios web por sector: salud, restaurantes, ayuntamientos | NeuraWeb', description: 'Salud, restaurantes y hoteles, administraciones locales: sitios y herramientas pensados para su profesión, con precios visibles y normativa controlada.', crumb: 'Sectores' },
  vi: { title: 'Website theo lĩnh vực: y tế, nhà hàng, cơ quan địa phương | NeuraWeb', description: 'Y tế, nhà hàng và khách sạn, cơ quan địa phương: website và công cụ thiết kế cho nghề của bạn, báo giá rõ ràng, tuân thủ quy định.', crumb: 'Lĩnh vực' },
} as const;

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l = (lang in COPY ? lang : 'fr') as keyof typeof COPY;
  const c = COPY[l];
  return {
    title: { absolute: c.title },
    description: c.description,
    alternates: {
      canonical: `${BASE_URL}/${l}/secteurs`,
      languages: Object.fromEntries([...SUPPORTED_LANGUAGES.map((x) => [x, `${BASE_URL}/${x}/secteurs`]), ['x-default', `${BASE_URL}/fr/secteurs`]]),
    },
    openGraph: { title: c.title, description: c.description, url: `${BASE_URL}/${l}/secteurs`, siteName: 'NeuraWeb', type: 'website' },
  };
}

export default async function SecteursPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = (lang in COPY ? lang : 'fr') as keyof typeof COPY;
  const breadcrumb = generateBreadcrumbSchema([
    { name: { fr: 'Accueil', en: 'Home', es: 'Inicio', vi: 'Trang chủ' }[l], url: `/${l}` },
    { name: COPY[l].crumb, url: `/${l}/secteurs` },
  ]);
  return (
    <div className="theme-accueil">
      <JsonLd id="breadcrumb-secteurs" data={breadcrumb} />
      <Header />
      <main id="main-content">
        <SectorsSection hub />
      </main>
      <Footer />
    </div>
  );
}
