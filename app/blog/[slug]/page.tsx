import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { generateBreadcrumbSchema, generateArticleSchema } from '@/lib/structured-data';
import { getPostBySlug, getAllPostSlugs, getRelatedPosts, type Language } from '@/lib/mdx';
import { BlogPostClient } from '@/components/blog-post-client';

// ── Generate Static Params ──────────────────────────────────────────────────
export async function generateStaticParams() {
  // Generate params for all languages
  const languages: Language[] = ['fr', 'en'];
  const params: { slug: string }[] = [];
  
  for (const lang of languages) {
    const slugs = getAllPostSlugs(lang);
    for (const slug of slugs) {
      // Only add if not already present (avoid duplicates)
      if (!params.some(p => p.slug === slug)) {
        params.push({ slug });
      }
    }
  }
  
  return params;
}

// ── Generate Metadata ───────────────────────────────────────────────────────
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  // Try to get post in any language for metadata
  const post = getPostBySlug(slug, 'fr') || getPostBySlug(slug, 'en');

  if (!post) {
    return {
      title: 'Article non trouvé | NeuraWeb',
    };
  }

  return {
    title: `${post.title} | Blog NeuraWeb`,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `https://neuraweb.tech/blog/${slug}`,
      siteName: 'NeuraWeb',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.image || '/og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image || '/og-image.png'],
    },
    alternates: {
      canonical: `https://neuraweb.tech/blog/${slug}`,
    },
  };
}

// ── Page Component ──────────────────────────────────────────────────────────
export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Get posts in both languages
  const postFr = getPostBySlug(slug, 'fr');
  const postEn = getPostBySlug(slug, 'en');
  
  // If no post exists in any language, 404
  if (!postFr && !postEn) {
    notFound();
  }

  // Get the primary post for schemas (prefer French)
  const primaryPost = postFr || postEn!;

  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: 'https://neuraweb.tech' },
    { name: 'Blog', url: 'https://neuraweb.tech/blog' },
    { name: primaryPost.title, url: `https://neuraweb.tech/blog/${slug}` },
  ]);

  const articleSchema = generateArticleSchema({
    title: primaryPost.title,
    description: primaryPost.excerpt,
    datePublished: primaryPost.date,
    author: primaryPost.author,
    url: `/blog/${slug}`,
    image: primaryPost.image,
  });

  // Get related posts for both languages
  const relatedFr = postFr ? getRelatedPosts(slug, 'fr', 2) : [];
  const relatedEn = postEn ? getRelatedPosts(slug, 'en', 2) : [];

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Header />

      <main id="main-content" className="min-h-screen bg-white dark:bg-[#050510] pt-24">
        <BlogPostClient 
          postFr={postFr}
          postEn={postEn}
          relatedFr={relatedFr}
          relatedEn={relatedEn}
        />
      </main>

      <Footer />
    </>
  );
}