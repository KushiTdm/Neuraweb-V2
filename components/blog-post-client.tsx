'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { LocalizedLink } from '@/components/localized-link';
import type { BlogPost, BlogPostMeta } from '@/lib/mdx';

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPostMeta[];
}

export function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Translations
  const t = {
    fr: {
      home: 'Accueil',
      blog: 'Blog',
      readTime: 'min de lecture',
      tags: 'Tags',
      relatedArticles: 'Articles similaires',
      needHelp: 'Besoin d\'aide pour votre projet ?',
      helpDesc: 'NeuraWeb vous accompagne dans le développement web, l\'intégration IA et l\'automatisation.',
      contactUs: 'Contactez-nous',
    },
    en: {
      home: 'Home',
      blog: 'Blog',
      readTime: 'min read',
      tags: 'Tags',
      relatedArticles: 'Related Articles',
      needHelp: 'Need help with your project?',
      helpDesc: 'NeuraWeb supports you in web development, AI integration and automation.',
      contactUs: 'Contact Us',
    },
    es: {
      home: 'Inicio',
      blog: 'Blog',
      readTime: 'min de lectura',
      tags: 'Etiquetas',
      relatedArticles: 'Artículos relacionados',
      needHelp: '¿Necesitas ayuda con tu proyecto?',
      helpDesc: 'NeuraWeb te acompaña en desarrollo web, integración IA y automatización.',
      contactUs: 'Contáctanos',
    },
  };

  const translations = t[language as 'fr' | 'en' | 'es'] || t.fr;

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || !post) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050510] pt-24">
        <div className="animate-pulse">
          <div className="h-[40vh] bg-gray-200 dark:bg-gray-800"></div>
          <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-6"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Parse markdown content (simplified version)
  const parseMarkdown = (content: string): string => {
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 text-sm font-mono">$1</code>')
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto my-6"><code class="text-sm text-gray-100 font-mono whitespace-pre">$2</code></pre>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg text-gray-700 dark:text-gray-300">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="text-gray-600 dark:text-gray-300 ml-4 mb-2">$1</li>')
      .replace(/^- \[x\] (.*$)/gim, '<li class="flex items-center gap-2 text-gray-600 dark:text-gray-300 ml-4 mb-2"><span class="text-green-500">✅</span> $1</li>')
      .replace(/^- \[ \] (.*$)/gim, '<li class="flex items-center gap-2 text-gray-600 dark:text-gray-300 ml-4 mb-2"><span class="text-gray-400">⬜</span> $1</li>')
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        if (cells.some(c => c.trim().match(/^[-:]+$/))) return '';
        const cellTags = cells.map(c => `<td class="px-4 py-2 text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800">${c.trim()}</td>`).join('');
        return `<tr>${cellTags}</tr>`;
      })
      .replace(/\n\n/g, '</p><p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">')
      .replace(/\n/g, '<br />');
  };

  const parsedContent = parseMarkdown(post.content);

  return (
    <>
      {/* Hero Image */}
      <div className="relative h-[40vh] min-h-[300px] w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#050510] z-10" />
        <Image
          src={post.image || '/og-image.png'}
          alt={post.title}
          fill
          className="object-cover opacity-60 dark:opacity-40"
          priority
        />
      </div>

      {/* Breadcrumb */}
      <nav className="py-4 px-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#050510] -mt-20 relative z-20" aria-label="Breadcrumb">
        <div className="max-w-4xl mx-auto">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <LocalizedLink href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                {translations.home}
              </LocalizedLink>
            </li>
            <li className="text-gray-400 dark:text-gray-500">/</li>
            <li>
              <LocalizedLink href="/blog" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                {translations.blog}
              </LocalizedLink>
            </li>
            <li className="text-gray-400 dark:text-gray-500">/</li>
            <li className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">
              {post.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Article Header */}
      <header className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              {post.category}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {post.readTime} {translations.readTime}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
          
          {/* Author & Date */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{post.author}</p>
              <time className="text-sm text-gray-500 dark:text-gray-400" dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            "
          >
            <div 
              dangerouslySetInnerHTML={{ __html: `<p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">${parsedContent}</p>` }}
            />
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                {translations.tags}
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {translations.relatedArticles}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <LocalizedLink
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all duration-300"
                >
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {translations.needHelp}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {translations.helpDesc}
          </p>
          <LocalizedLink
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {translations.contactUs}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </LocalizedLink>
        </div>
      </section>
    </>
  );
}