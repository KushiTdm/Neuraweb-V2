'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { useAnalytics } from '@/hooks/use-analytics';
import { LocalizedLink } from '@/components/localized-link';
import type { Language } from '@/lib/mdx';

interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  image: string;
  tags: string[];
  featured?: boolean;
  language: Language;
}

interface BlogListClientProps {
  postsFr: BlogPostMeta[];
  postsEn: BlogPostMeta[];
  postsEs: BlogPostMeta[];
  featuredFr: BlogPostMeta[];
  featuredEn: BlogPostMeta[];
  featuredEs: BlogPostMeta[];
}

export function BlogListClient({ postsFr, postsEn, postsEs, featuredFr, featuredEn, featuredEs }: BlogListClientProps) {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const trackedPosts = useRef<Set<string>>(new Set());
  const { trackBlogView, trackBlogClick, trackCTA } = useAnalytics();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tracker les vues des articles avec Intersection Observer
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slug = entry.target.getAttribute('data-blog-slug');
          const title = entry.target.getAttribute('data-blog-title');
          if (slug && title && entry.isIntersecting && !trackedPosts.current.has(slug)) {
            trackedPosts.current.add(slug);
            trackBlogView({
              blog_title: title,
              blog_slug: slug,
              language: language,
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('[data-blog-slug]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [mounted, language, trackBlogView]);

  // Handler pour tracker les clics sur les articles
  const handleBlogClick = (slug: string, title: string) => {
    trackBlogClick({
      blog_title: title,
      blog_slug: slug,
      language: language,
    });
  };

  // Handler pour tracker le CTA contact
  const handleContactCTA = () => {
    trackCTA({
      cta_name: 'blog_contact_cta',
      cta_location: 'blog_page',
      destination: '/contact',
      language: language,
    });
  };

  // Select posts based on current language
  const allPosts = language === 'en' ? postsEn : language === 'es' ? postsEs : postsFr;
  const featuredPosts = language === 'en' ? featuredEn : language === 'es' ? featuredEs : featuredFr;

  // Translations
  const t = {
    fr: {
      title: 'Blog',
      subtitle: 'Articles, tutoriels et conseils sur le développement web, l\'IA et l\'automatisation.',
      featured: 'Articles à la une',
      allArticles: 'Tous les articles',
      read: 'Lire',
      stayInformed: 'Restez informé',
      newsletterDesc: 'Recevez nos derniers articles et conseils directement dans votre boîte mail. Pas de spam, promis !',
      subscribe: 'S\'inscrire',
      emailPlaceholder: 'votre@email.com',
      haveProject: 'Un projet en tête ?',
      contactDesc: 'Discutons de votre projet et voyons comment NeuraWeb peut vous aider à le concrétiser.',
      contactUs: 'Nous contacter',
      noArticles: 'Aucun article pour le moment.',
    },
    en: {
      title: 'Blog',
      subtitle: 'Articles, tutorials and tips on web development, AI and automation.',
      featured: 'Featured Articles',
      allArticles: 'All Articles',
      read: 'Read',
      stayInformed: 'Stay Informed',
      newsletterDesc: 'Receive our latest articles and tips directly in your inbox. No spam, promised!',
      subscribe: 'Subscribe',
      emailPlaceholder: 'your@email.com',
      haveProject: 'Have a project in mind?',
      contactDesc: 'Let\'s discuss your project and see how NeuraWeb can help you make it happen.',
      contactUs: 'Contact Us',
      noArticles: 'No articles yet.',
    },
    es: {
      title: 'Blog',
      subtitle: 'Artículos, tutoriales y consejos sobre desarrollo web, IA y automatización.',
      featured: 'Artículos destacados',
      allArticles: 'Todos los artículos',
      read: 'Leer',
      stayInformed: 'Mantente informado',
      newsletterDesc: 'Recibe nuestros últimos artículos y consejos directamente en tu bandeja de entrada. ¡Sin spam, lo prometemos!',
      subscribe: 'Suscribirse',
      emailPlaceholder: 'tu@email.com',
      haveProject: '¿Tienes un proyecto en mente?',
      contactDesc: 'Hablemos de tu proyecto y veamos cómo NeuraWeb puede ayudarte a hacerlo realidad.',
      contactUs: 'Contáctanos',
      noArticles: 'No hay artículos todavía.',
    },
  };

  const translations = t[language as 'fr' | 'en' | 'es'] || t.fr;

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6 w-48 mx-auto"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {translations.title}{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              NeuraWeb
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {translations.subtitle}
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                ⭐
              </span>
              {translations.featured}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <article
                  key={post.slug}
                  data-blog-slug={post.slug}
                  data-blog-title={post.title}
                  className="group relative bg-gray-50 dark:bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/90 text-white">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      <LocalizedLink href={`/blog/${post.slug}`}>
                        {post.title}
                      </LocalizedLink>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <time>
                          {new Date(post.date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </time>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline inline-flex items-center gap-1 group/link"
                      >
                        {translations.read}
                        <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {translations.allArticles} ({allPosts.length})
          </h2>
          
          {allPosts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/30 rounded-2xl">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {translations.noArticles}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPosts.map((post) => (
                <article
                  key={post.slug}
                  data-blog-slug={post.slug}
                  data-blog-title={post.title}
                  className="group bg-gray-50 dark:bg-gray-900/30 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <time>
                        {new Date(post.date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </time>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA to Contact */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {translations.haveProject}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {translations.contactDesc}
          </p>
          <Link
            href="/contact"
            onClick={handleContactCTA}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {translations.contactUs}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}