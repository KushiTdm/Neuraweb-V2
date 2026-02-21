import { Metadata } from 'next';
import { BlogListClient } from '@/components/blog-list-client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { getAllPosts, getFeaturedPosts } from '@/lib/mdx';
import { generateAISEO } from '@/lib/seo-ai-server';

// Génération des paramètres statiques
export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

// Métadonnées dynamiques par langue - IA server-side
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = (lang as 'fr' | 'en' | 'es') || 'fr';
  const baseUrl = 'https://neuraweb.tech';

  // L'IA génère les meta tags optimisés — résultat injecté dans le <head> statique
  const seo = await generateAISEO({
    pageType: 'blog',
    language,
    path: `/${lang}/blog`,
  });

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
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
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: `${baseUrl}/${lang}/blog`,
      siteName: 'NeuraWeb',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: seo.ogTitle,
        },
      ],
      locale: language === 'fr' ? 'fr_FR' : language === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [`${baseUrl}/og-image.png`],
      creator: '@neurawebtech',
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