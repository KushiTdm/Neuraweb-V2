'use client';

/**
 * blog-post-client.tsx — VERSION ANALYTICS ENRICHIE
 *
 * Modifications par rapport à l'original :
 *  1. Import de `useBlogPostAnalytics` → tracking automatique (temps, scroll,
 *     heure de lecture, retour lecteur, lecture complète…)
 *  2. Tags cliquables avec `trackTagClick`
 *  3. Articles liés avec `trackRelatedArticleClick`
 *  4. CTA contact et services avec `trackCTAClick`
 *  5. Bouton "Copier le lien" avec `trackShareClick`
 *
 * Chercher "// ← ANALYTICS" pour retrouver tous les ajouts.
 */

import { useState } from 'react';
import Image from 'next/image';
import { LocalizedLink } from '@/components/localized-link';
import type { BlogPost, BlogPostMeta } from '@/lib/mdx';
import { useBlogPostAnalytics } from '@/hooks/use-blog-analytics'; // ← ANALYTICS

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPostMeta[];
  lang: string;
}

export function BlogPostClient({ post, relatedPosts, lang }: BlogPostClientProps) {
  const language = (lang as 'fr' | 'en' | 'es') || 'fr';

  // ── ANALYTICS : initialisation ─────────────────────────────────────────── ← ANALYTICS
  const { trackTagClick, trackRelatedArticleClick, trackCTAClick, trackShareClick } =
    useBlogPostAnalytics({
      slug: post.slug,
      title: post.title,
      category: post.category,
      tags: post.tags,
      author: post.author,
      language,
      estimatedReadTimeMin: parseInt(post.readTime) || 5,
    });

  // ── État local pour le bouton de copie ─────────────────────────────────── ← ANALYTICS
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      trackShareClick('copy'); // ← ANALYTICS
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Translations ────────────────────────────────────────────────────────
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
      ourServices: 'Nos services',
      webAi: 'Web & Intelligence Artificielle',
      mobileApp: 'Applications mobiles',
      freeQuote: 'Devis gratuit',
      copyLink: 'Copier le lien',
      copied: 'Lien copié !',
      shareArticle: 'Partager',
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
      ourServices: 'Our services',
      webAi: 'Web & Artificial Intelligence',
      mobileApp: 'Mobile applications',
      freeQuote: 'Free quote',
      copyLink: 'Copy link',
      copied: 'Link copied!',
      shareArticle: 'Share',
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
      ourServices: 'Nuestros servicios',
      webAi: 'Web e Inteligencia Artificial',
      mobileApp: 'Aplicaciones móviles',
      freeQuote: 'Presupuesto gratuito',
      copyLink: 'Copiar enlace',
      copied: '¡Enlace copiado!',
      shareArticle: 'Compartir',
    },
  };

  const tr = t[language] || t.fr;
  const faqHeading = language === 'en' ? 'FAQ' : language === 'es' ? 'Preguntas frecuentes' : 'FAQ';

  if (!post) return null;

  // ── Markdown parser ──────────────────────────────────────────────────────
  const parseMarkdown = (content: string): string => {
    const isSeparatorRow = (l: string) => /^\|[\s\-:|]+\|$/.test(l.trim());
    const isTableRow = (l: string) => /^\s*\|/.test(l) && /\|\s*$/.test(l);

    const renderInline = (text: string) => text
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-600 dark:text-indigo-400 font-medium underline decoration-indigo-300 dark:decoration-indigo-700 hover:decoration-indigo-600 dark:hover:decoration-indigo-400">$1</a>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 text-sm font-mono">$1</code>');

    const renderTable = (lines: string[]) => {
      const dataLines = lines.filter(l => l.trim() && !isSeparatorRow(l));
      if (dataLines.length < 2) return '';
      const splitRow = (l: string) => l.trim().split('|').slice(1, -1);
      const headerCells = splitRow(dataLines[0]).map(c =>
        `<th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/60 border-b-2 border-gray-200 dark:border-gray-700">${renderInline(c.trim())}</th>`
      ).join('');
      const bodyRows = dataLines.slice(1).map(row =>
        `<tr>${splitRow(row).map(c => `<td class="px-4 py-3 text-gray-600 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800">${renderInline(c.trim())}</td>`).join('')}</tr>`
      ).join('');
      return `<div class="my-6 overflow-x-auto"><table class="w-full border-collapse text-sm border border-gray-200 dark:border-gray-800 rounded-lg"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
    };

    // Split into table vs non-table blocks, process separately
    const lines = content.split('\n');
    const blocks: { type: 'table' | 'other'; lines: string[] }[] = [];
    let cur: { type: 'table' | 'other'; lines: string[] } = { type: 'other', lines: [] };
    for (const line of lines) {
      const tableRow = isTableRow(line);
      if (tableRow && cur.type !== 'table') { if (cur.lines.length) blocks.push(cur); cur = { type: 'table', lines: [] }; }
      if (!tableRow && cur.type !== 'other') { blocks.push(cur); cur = { type: 'other', lines: [] }; }
      cur.lines.push(line);
    }
    if (cur.lines.length) blocks.push(cur);

    return blocks.map(block => {
      if (block.type === 'table') return renderTable(block.lines);
      return block.lines.join('\n')
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">$1</h2>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-600 dark:text-indigo-400 font-medium underline decoration-indigo-300 dark:decoration-indigo-700 hover:decoration-indigo-600 dark:hover:decoration-indigo-400">$1</a>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 text-sm font-mono">$1</code>')
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto my-6"><code class="text-sm text-gray-100 font-mono whitespace-pre">$2</code></pre>')
        .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-900 dark:border-gray-200 pl-4 py-2 my-4 bg-gray-100 dark:bg-gray-800/40 rounded-r-lg text-gray-700 dark:text-gray-300">$1</blockquote>')
        .replace(/^- (.*$)/gim, '<li class="text-gray-600 dark:text-gray-300 ml-4 mb-2">$1</li>')
        .replace(/\n\n/g, '</p><p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">')
        .replace(/\n/g, '<br />');
    }).join('');
  };

  const parsedContent = parseMarkdown(post.content);

  return (
    <>
      {/* Hero Image */}
      <div className="relative h-[40vh] min-h-[300px] w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#050510] z-10" />
        <Image
          src={post.image || '/assets/og-image.png'}
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
                {tr.home}
              </LocalizedLink>
            </li>
            <li className="text-gray-400 dark:text-gray-500">/</li>
            <li>
              <LocalizedLink href="/blog" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                {tr.blog}
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
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
                {post.category}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {post.readTime} {tr.readTime}
              </span>
            </div>

            {/* ── Bouton Copier le lien ──────────────────────────────── ← ANALYTICS */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-900 hover:text-gray-900 dark:hover:text-white dark:hover:border-white transition-all"
              aria-label={tr.copyLink}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-600 dark:text-green-400">{tr.copied}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {tr.copyLink}
                </>
              )}
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author & Date */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{post.author}</p>
              <time className="text-sm text-gray-500 dark:text-gray-400" dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(
                  language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'fr-FR',
                  { day: 'numeric', month: 'long', year: 'numeric' }
                )}
              </time>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-gray-900 dark:prose-a:text-white prose-a:no-underline hover:prose-a:underline
            prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: `<p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">${parsedContent}</p>`,
              }}
            />
          </div>

          {/* FAQ */}
          {post.faq && post.faq.length > 0 && (
            <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {faqHeading}
              </h2>
              <div className="space-y-6">
                {post.faq.map((item, idx) => (
                  <div key={idx}>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {item.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Tags avec tracking ────────────────────────────────────── ← ANALYTICS */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                {tr.tags}
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => trackTagClick(tag)} // ← ANALYTICS
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* ── Articles liés avec tracking ───────────────────────────────── ← ANALYTICS */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {tr.relatedArticles}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <LocalizedLink
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  onClick={() => trackRelatedArticleClick(relatedPost.slug, relatedPost.title)} // ← ANALYTICS
                  className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-400/50 transition-all duration-300"
                >
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
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

      {/* ── CTA avec tracking ─────────────────────────────────────────── ← ANALYTICS */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {tr.needHelp}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {tr.helpDesc}
          </p>
          <LocalizedLink
            href="/contact"
            onClick={() => trackCTAClick(tr.contactUs, '/contact')} // ← ANALYTICS
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {tr.contactUs}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </LocalizedLink>

          {/* Maillage interne */}
          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
              {tr.ourServices}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <LocalizedLink
                href="/services"
                onClick={() => trackCTAClick(tr.webAi, '/services')} // ← ANALYTICS
                className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-900 hover:text-gray-900 dark:hover:text-white dark:hover:border-white transition-colors"
              >
                {tr.webAi}
              </LocalizedLink>
              <LocalizedLink
                href="/mobile-app-development"
                onClick={() => trackCTAClick(tr.mobileApp, '/mobile-app-development')} // ← ANALYTICS
                className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-900 hover:text-gray-900 dark:hover:text-white dark:hover:border-white transition-colors"
              >
                {tr.mobileApp}
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}