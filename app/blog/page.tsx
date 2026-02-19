import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { generateBreadcrumbSchema } from '@/lib/structured-data';
import { getAllPosts, getFeaturedPosts } from '@/lib/mdx';
import { BlogListClient } from '@/components/blog-list-client';

// ── Metadata SEO ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Blog - Actualités & Conseils | NeuraWeb',
  description: 'Articles et conseils sur le développement web, l\'IA et l\'automatisation. Découvrez les meilleures pratiques pour accélérer votre croissance digitale.',
  keywords: [
    'blog tech',
    'développement web',
    'intelligence artificielle',
    'automatisation n8n',
    'conseils startup',
    'React Next.js',
    'intégration IA',
  ],
  openGraph: {
    title: 'Blog - Actualités & Conseils | NeuraWeb',
    description: 'Articles et conseils sur le développement web, l\'IA et l\'automatisation.',
    url: 'https://neuraweb.tech/blog',
    siteName: 'NeuraWeb',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Blog NeuraWeb',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://neuraweb.tech/blog',
  },
};

// ── Breadcrumb Schema ───────────────────────────────────────────────────────
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Accueil', url: 'https://neuraweb.tech' },
  { name: 'Blog', url: 'https://neuraweb.tech/blog' },
]);

// ── Page Component ──────────────────────────────────────────────────────────
export default function BlogPage() {
  // Get posts for both languages
  const postsFr = getAllPosts('fr');
  const postsEn = getAllPosts('en');
  const featuredFr = getFeaturedPosts('fr');
  const featuredEn = getFeaturedPosts('en');

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      <main id="main-content" className="min-h-screen bg-white dark:bg-[#050510] pt-24">
        <BlogListClient 
          postsFr={postsFr}
          postsEn={postsEn}
          featuredFr={featuredFr}
          featuredEn={featuredEn}
        />
      </main>

      <Footer />
    </>
  );
}
