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

import { useMemo, useState } from 'react';
import { LocalizedLink } from '@/components/localized-link';
import type { BlogPost, BlogPostMeta } from '@/lib/mdx';
import { useBlogPostAnalytics } from '@/hooks/use-blog-analytics'; // ← ANALYTICS
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ArticleCTASidebar,
  ArticleCTAMobile,
} from '@/components/blog/article-cta-sidebar';
import { ArticleToc } from '@/components/blog/article-toc';
import { CoverImage } from '@/components/blog/cover-image';
import { ReadingProgress } from '@/components/blog/reading-progress';
import { parseBlogMarkdown } from '@/lib/blog-markdown';

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPostMeta[];
  lang: string;
}

export function BlogPostClient({ post, relatedPosts, lang }: BlogPostClientProps) {
  const language = (lang as 'fr' | 'en' | 'es' | 'vi') || 'fr';

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
      aiImageLabel: 'Image générée par IA',
      aiAssisted: 'Assisté par IA',
      toc: 'Sommaire',
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
      aiImageLabel: 'AI-generated image',
      aiAssisted: 'AI-assisted',
      toc: 'Contents',
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
      aiImageLabel: 'Imagen generada por IA',
      aiAssisted: 'Asistido por IA',
      toc: 'Índice',
    },
    vi: {
      home: 'Trang chủ',
      blog: 'Blog',
      readTime: 'phút đọc',
      tags: 'Từ khóa',
      relatedArticles: 'Bài viết liên quan',
      needHelp: 'Bạn cần hỗ trợ cho dự án của mình?',
      helpDesc: 'NeuraWeb đồng hành cùng bạn trong thiết kế website, tích hợp AI và tự động hóa.',
      contactUs: 'Liên hệ với chúng tôi',
      ourServices: 'Dịch vụ của chúng tôi',
      webAi: 'Website & Trí tuệ nhân tạo',
      mobileApp: 'Ứng dụng di động',
      freeQuote: 'Nhận báo giá miễn phí',
      copyLink: 'Sao chép liên kết',
      copied: 'Đã sao chép liên kết!',
      shareArticle: 'Chia sẻ',
      aiImageLabel: 'Hình ảnh do AI tạo',
      aiAssisted: 'Có hỗ trợ của AI',
      toc: 'Mục lục',
    },
  };

  const tr = t[language] || t.fr;
  const faqHeading = language === 'en' ? 'FAQ' : language === 'es' ? 'Preguntas frecuentes' : language === 'vi' ? 'Câu hỏi thường gặp' : 'FAQ';


  const { html: parsedContent, headings } = useMemo(
    () => parseBlogMarkdown(post?.content ?? ''),
    [post?.content]
  );

  if (!post) return null;

  const readMinutes = parseInt(post.readTime) || 5;
  const hasToc = headings.length >= 3;
  const tocItems = post.faq && post.faq.length > 0 ? [...headings, { id: 'faq', text: faqHeading, level: 2 as const }] : headings;
  const dateLabel = new Date(post.date).toLocaleDateString(
    language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : language === 'vi' ? 'vi-VN' : 'fr-FR',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const trackSidebar = (prefix: string) => (kind: 'service' | 'booking', href: string) => {
    const labels = { service: tr.ourServices, booking: tr.contactUs } as const;
    trackCTAClick(`${prefix}:${kind}:${labels[kind]}`, href);
  };

  return (
    <>
      <ReadingProgress targetId="article-body" />

      {/* ── En-tête : titre à gauche, illustration entière à droite (au-dessus sur mobile) ── */}
      <header className="px-4 pb-10 pt-28 sm:px-6 lg:pb-14 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-6 sm:mb-8" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-chypre/80">
              <li>
                <LocalizedLink href="/" className="underline-offset-4 hover:text-chypre hover:underline">{tr.home}</LocalizedLink>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <LocalizedLink href="/blog" className="underline-offset-4 hover:text-chypre hover:underline">{tr.blog}</LocalizedLink>
              </li>
              <li aria-hidden="true" className="hidden sm:inline">/</li>
              <li className="hidden max-w-[320px] truncate font-medium text-chypre sm:block" aria-current="page">{post.title}</li>
            </ol>
          </nav>

          <div className={`grid items-center gap-8 lg:gap-12 ${post.image ? 'lg:grid-cols-[1.05fr_1fr]' : ''}`}>
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-chypre px-3.5 py-1.5 text-sm font-semibold text-creme">{post.category}</span>
                <span className="text-sm text-chypre/85">{readMinutes} {tr.readTime}</span>
              </div>

              <h1 className="mb-5 text-[2rem] leading-[1.08] text-chypre sm:text-4xl lg:text-[2.75rem]">{post.title}</h1>
              <p className="mb-7 text-lg leading-relaxed text-chypre/90 sm:text-xl">{post.excerpt}</p>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-chypre/15 pt-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-chypre font-display text-lg font-bold text-creme" aria-hidden="true">N</div>
                  <div>
                    <p className="flex items-center gap-2 font-semibold text-chypre">
                      {post.author}
                      <span className="rounded-full bg-chypre/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-chypre">{tr.aiAssisted}</span>
                    </p>
                    <time className="text-sm text-chypre/80" dateTime={post.date}>{dateLabel}</time>
                  </div>
                </div>

                {/* ── Bouton Copier le lien ── ← ANALYTICS */}
                <button
                  onClick={handleCopyLink}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-chypre/30 px-4 text-sm font-semibold text-chypre transition-colors hover:bg-chypre hover:text-creme"
                  aria-label={tr.copyLink}
                >
                  {copied ? (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {tr.copied}
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      {tr.copyLink}
                    </>
                  )}
                </button>
              </div>
            </div>

            {post.image && (
              <figure className="max-lg:order-first">
                <CoverImage
                  src={post.image}
                  alt={post.title}
                  sizes="(max-width: 1024px) 100vw, 560px"
                  priority
                  className="aspect-[3/2] rounded-3xl border border-chypre/15"
                />
                <figcaption className="mt-2 text-xs text-chypre/80">{tr.aiImageLabel}</figcaption>
              </figure>
            )}
          </div>
        </div>
      </header>

      {/* ── Article : sommaire (gauche) · texte (700 px) · CTA (droite, ≥ xl) ── */}
      <article id="article-body" className="px-4 pb-16 sm:px-6">
        <div
          className={`mx-auto max-w-[1280px] lg:grid lg:justify-center lg:gap-10 ${
            hasToc
              ? 'lg:grid-cols-[220px_minmax(0,720px)] xl:grid-cols-[220px_minmax(0,720px)_260px]'
              : 'xl:grid-cols-[minmax(0,720px)_260px]'
          }`}
        >
          {hasToc && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <ArticleToc headings={tocItems} title={tr.toc} variant="desktop" />
              </div>
            </aside>
          )}

          <div className="w-full min-w-0">
            {hasToc && <ArticleToc headings={tocItems} title={tr.toc} variant="mobile" />}

            <div
              className="text-[1.0625rem] leading-[1.75] text-chypre/90 sm:text-[1.125rem]"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />

            {/* CTA inline (visible < xl) */}
            <ArticleCTAMobile
              slug={post.slug}
              category={post.category}
              tags={post.tags}
              language={language}
              onTrack={trackSidebar('mobile-cta')}
            />

            {/* FAQ */}
            {post.faq && post.faq.length > 0 && (
              <section id="faq" className="mt-14 scroll-mt-28 border-t border-chypre/20 pt-10">
                <h2 className="mb-6 font-display text-2xl font-bold text-chypre sm:text-[1.75rem]">{faqHeading}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {post.faq.map((item, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`} className="border-chypre/20">
                      <AccordionTrigger className="min-h-[48px] text-left text-base font-semibold text-chypre hover:no-underline sm:text-lg">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-base leading-relaxed text-chypre/90">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* ── Tags avec tracking ── ← ANALYTICS */}
            {post.tags.length > 0 && (
              <div className="mt-12 border-t border-chypre/20 pt-8">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-chypre/80">{tr.tags}</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => trackTagClick(tag)} // ← ANALYTICS
                      className="min-h-[40px] cursor-pointer rounded-full border border-chypre/25 px-4 text-sm font-medium text-chypre transition-colors hover:bg-chypre hover:text-creme"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA — sticky, visible ≥ xl */}
          <ArticleCTASidebar
            slug={post.slug}
            category={post.category}
            tags={post.tags}
            language={language}
            onTrack={trackSidebar('sidebar')}
          />
        </div>
      </article>

      {/* ── Articles liés (illustrations en vedette) ── ← ANALYTICS */}
      {relatedPosts.length > 0 && (
        <section className="bg-chypre/[0.06] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 font-display text-2xl font-bold text-chypre sm:text-3xl">{tr.relatedArticles}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <LocalizedLink
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  onClick={() => trackRelatedArticleClick(relatedPost.slug, relatedPost.title)} // ← ANALYTICS
                  className="lift group flex flex-col overflow-hidden rounded-3xl border border-chypre/15 bg-creme transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,70,67,0.14)]"
                >
                  <CoverImage
                    src={relatedPost.image || '/assets/og-image.png'}
                    alt={relatedPost.title}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                    className="aspect-[3/2] border-b border-chypre/10"
                    imgClassName="transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-chypre/80">{relatedPost.category}</span>
                    <h3 className="mt-2 line-clamp-2 font-display text-lg font-semibold leading-snug text-chypre">{relatedPost.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-chypre/85">{relatedPost.excerpt}</p>
                  </div>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA fin d'article ── ← ANALYTICS */}
      <section className="px-4 py-16 sm:px-6">
        <div className="ctx-dark mx-auto max-w-4xl rounded-3xl bg-chypre px-6 py-12 text-center sm:px-12">
          <h2 className="mb-3 font-display text-2xl font-bold text-creme sm:text-3xl">{tr.needHelp}</h2>
          <p className="mx-auto mb-7 max-w-xl text-creme/90">{tr.helpDesc}</p>
          <LocalizedLink
            href="/contact"
            onClick={() => trackCTAClick(tr.contactUs, '/contact')} // ← ANALYTICS
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-creme px-8 py-3 font-semibold text-chypre transition-transform hover:scale-[1.03]"
          >
            {tr.contactUs}
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </LocalizedLink>

          {/* Maillage interne */}
          <div className="mt-8 border-t border-creme/20 pt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-creme/80">{tr.ourServices}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <LocalizedLink
                href="/developpement-web"
                onClick={() => trackCTAClick(tr.webAi, '/developpement-web')} // ← ANALYTICS
                className="inline-flex min-h-[44px] items-center rounded-full border border-creme/40 px-4 text-sm font-medium text-creme transition-colors hover:bg-creme hover:text-chypre"
              >
                {tr.webAi}
              </LocalizedLink>
              <LocalizedLink
                href="/mobile-app-development"
                onClick={() => trackCTAClick(tr.mobileApp, '/mobile-app-development')} // ← ANALYTICS
                className="inline-flex min-h-[44px] items-center rounded-full border border-creme/40 px-4 text-sm font-medium text-creme transition-colors hover:bg-creme hover:text-chypre"
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
