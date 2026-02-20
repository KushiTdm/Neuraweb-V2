import { Metadata } from 'next';
import { BlogListClient } from '@/components/blog-list-client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { getAllPosts, getFeaturedPosts } from '@/lib/mdx';

// Génération des paramètres statiques
export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

// Métadonnées dynamiques par langue
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<string, string> = {
    fr: 'Blog - Actualités & Conseils | NeuraWeb',
    en: 'Blog - News & Tips | NeuraWeb',
    es: 'Blog - Noticias y Consejos | NeuraWeb',
  };

  const descriptions: Record<string, string> = {
    fr: 'Articles et conseils sur le développement web, l\'IA et l\'automatisation.',
    en: 'Articles and tips on web development, AI and automation.',
    es: 'Artículos y consejos sobre desarrollo web, IA y automatización.',
  };

  const baseUrl = 'https://neuraweb.tech';

  return {
    title: titles[lang] || titles.fr,
    description: descriptions[lang] || descriptions.fr,
    alternates: {
      canonical: `${baseUrl}/${lang}/blog`,
      languages: {
        'fr-FR': `${baseUrl}/fr/blog`,
        'en-US': `${baseUrl}/en/blog`,
        'es-ES': `${baseUrl}/es/blog`,
        'x-default': `${baseUrl}/fr/blog`,
      },
    },
    openGraph: {
      title: titles[lang] || titles.fr,
      description: descriptions[lang] || descriptions.fr,
      url: `${baseUrl}/${lang}/blog`,
      siteName: 'NeuraWeb',
      images: [
        {
          url: '/og-image.jpeg',
          width: 1200,
          height: 630,
          alt: 'NeuraWeb Blog',
        },
      ],
      locale: lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Récupérer les articles pour chaque langue
  const postsFr = getAllPosts('fr');
  const postsEn = getAllPosts('en');
  const postsEs = getAllPosts('es');
  const featuredFr = getFeaturedPosts('fr');
  const featuredEn = getFeaturedPosts('en');
  const featuredEs = getFeaturedPosts('es');

  return (
    <>
      <Header />
      <main id="main-content">
        <BlogListClient 
          postsFr={postsFr}
          postsEn={postsEn}
          postsEs={postsEs}
          featuredFr={featuredFr}
          featuredEn={featuredEn}
          featuredEs={featuredEs}
        />
      </main>
      <Footer />
    </>
  );
}