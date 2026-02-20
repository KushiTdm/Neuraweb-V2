import { Metadata } from 'next';
import { BlogPostClient } from '@/components/blog-post-client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getAllPostSlugs, getPostBySlug, getAllPosts, type Language } from '@/lib/mdx';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { notFound } from 'next/navigation';

// Génération des paramètres statiques
export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];

  SUPPORTED_LANGUAGES.forEach((lang) => {
    const slugs = getAllPostSlugs(lang as Language);
    slugs.forEach((slug) => {
      params.push({ lang, slug });
    });
  });

  return params;
}

// Métadonnées dynamiques par langue
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getPostBySlug(slug, lang as Language);

  if (!post) {
    return {
      title: 'Article non trouvé | NeuraWeb',
    };
  }

  const baseUrl = 'https://neuraweb.tech';

  return {
    title: post.title,
    description: post.excerpt || post.title,
    authors: post.author ? [{ name: post.author }] : undefined,
    alternates: {
      canonical: `${baseUrl}/${lang}/blog/${slug}`,
      languages: {
        'fr-FR': `${baseUrl}/fr/blog/${slug}`,
        'en-US': `${baseUrl}/en/blog/${slug}`,
        'es-ES': `${baseUrl}/es/blog/${slug}`,
        'x-default': `${baseUrl}/fr/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      url: `${baseUrl}/${lang}/blog/${slug}`,
      siteName: 'NeuraWeb',
      type: 'article',
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      images: post.image
        ? [
            {
              url: post.image,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
      locale: lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  
  // Récupérer l'article dans la langue actuelle
  const post = getPostBySlug(slug, lang as Language);

  if (!post) {
    notFound();
  }

  // Récupérer les articles liés (même catégorie, excluant l'article actuel)
  const allPosts = getAllPosts(lang as Language);
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  return (
    <>
      <Header />
      <main id="main-content">
        <BlogPostClient 
          post={post}
          relatedPosts={relatedPosts}
        />
      </main>
      <Footer />
    </>
  );
}