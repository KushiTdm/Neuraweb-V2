import { Metadata } from 'next';
import { BlogPostClient } from '@/components/blog-post-client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { JsonLd } from '@/components/json-ld';
import { getAllPostSlugs, getPostBySlug, getAllPosts, type Language } from '@/lib/mdx';
import { SUPPORTED_LANGUAGES } from '@/proxy';
import { notFound } from 'next/navigation';
import { generateBlogPostAISEO } from '@/lib/seo-ai-server';
import { generateArticleSchema, generateFaqSchema, generateBreadcrumbSchema } from '@/lib/structured-data';

export const revalidate = 86400;

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

// Métadonnées dynamiques par langue - IA server-side enrichie du contenu de l'article
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

  // L'IA génère les meta tags optimisés basés sur le contenu réel de l'article
  const seo = await generateBlogPostAISEO({
    lang,
    title: post.title,
    seoTitle: post.seoTitle,
    excerpt: post.excerpt || post.title,
    tags: post.tags || [],
    slug,
  });

  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords,
    authors: post.author ? [{ name: post.author }] : undefined,
    alternates: {
      canonical: `${baseUrl}/${lang}/blog/${slug}`,
      languages: (() => {
        const langs: Record<string, string> = { 'x-default': `${baseUrl}/fr/blog/${slug}` };
        if (getPostBySlug(slug, 'fr')) langs.fr = `${baseUrl}/fr/blog/${slug}`;
        if (getPostBySlug(slug, 'en')) langs.en = `${baseUrl}/en/blog/${slug}`;
        if (getPostBySlug(slug, 'es')) langs.es = `${baseUrl}/es/blog/${slug}`;
        return langs;
      })(),
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
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
              alt: seo.ogTitle,
            },
          ]
        : [
            {
              url: `${baseUrl}/assets/og-image.png`,
              width: 1200,
              height: 630,
              alt: seo.ogTitle,
            },
          ],
      locale: lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: post.image ? [post.image] : [`${baseUrl}/assets/og-image.png`],
      creator: '@neurawebtech',
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

  // Récupérer les articles liés — même catégorie en priorité, fallback cross-catégorie
  const allPosts = getAllPosts(lang as Language);
  const sameCategory = allPosts.filter((p) => p.slug !== slug && p.category === post.category);
  const otherPosts = allPosts.filter((p) => p.slug !== slug && p.category !== post.category);
  const relatedPosts = [...sameCategory, ...otherPosts].slice(0, 3);

  const baseUrl = 'https://neuraweb.tech';
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt || post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: post.author,
    url: `${baseUrl}/${lang}/blog/${slug}`,
    image: post.image || undefined,
  });

  const faqSchema = post.faq && post.faq.length > 0
    ? generateFaqSchema(post.faq)
    : null;

  // Breadcrumb pour navigation SERP
  const breadcrumbData = generateBreadcrumbSchema([
    { name: lang === 'fr' ? 'Accueil' : lang === 'es' ? 'Inicio' : 'Home', url: `/${lang}` },
    { name: 'Blog', url: `/${lang}/blog` },
    { name: post.title, url: `/${lang}/blog/${slug}` },
  ]);

  return (
    <>
      <JsonLd id={`article-schema-${slug}`} data={articleSchema} />
      {faqSchema && <JsonLd id={`faq-schema-${slug}`} data={faqSchema} />}
      <JsonLd id={`breadcrumb-schema-${slug}`} data={breadcrumbData} />
      <Header />
      <main id="main-content">
        <BlogPostClient
          post={post}
          relatedPosts={relatedPosts}
          lang={lang}
        />
      </main>
      <Footer />
    </>
  );
}