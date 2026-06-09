'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByDate, setSortByDate] = useState<'newest' | 'oldest'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 18;

  const trackedPosts = useRef<Set<string>>(new Set());
  const { trackBlogView, trackBlogClick, trackCTA } = useAnalytics();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortByDate, selectedCategory]);

  // Auto-advance featured carousel
  useEffect(() => {
    if (!mounted) return;
    const featuredPosts = language === 'en' ? featuredEn : language === 'es' ? featuredEs : featuredFr;
    if (featuredPosts.length <= 1) return;
    const timer = setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % featuredPosts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [mounted, language, featuredFr, featuredEn, featuredEs]);

  useEffect(() => {
    if (!mounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slug = entry.target.getAttribute('data-blog-slug');
          const title = entry.target.getAttribute('data-blog-title');
          if (slug && title && entry.isIntersecting && !trackedPosts.current.has(slug)) {
            trackedPosts.current.add(slug);
            trackBlogView({ blog_title: title, blog_slug: slug, language });
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll('[data-blog-slug]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted, language, trackBlogView]);

  const handleBlogClick = (slug: string, title: string) => {
    trackBlogClick({ blog_title: title, blog_slug: slug, language });
  };

  const handleContactCTA = () => {
    trackCTA({ cta_name: 'blog_contact_cta', cta_location: 'blog_page', destination: '/contact', language });
  };

  const allPosts = language === 'en' ? postsEn : language === 'es' ? postsEs : postsFr;
  const featuredPosts = language === 'en' ? featuredEn : language === 'es' ? featuredEs : featuredFr;

  // Sort all posts by date descending to find the latest
  const sortedByRecent = useMemo(
    () => [...allPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [allPosts]
  );
  const latestPost = sortedByRecent[0] ?? null;
  const heroPosts = featuredPosts.length > 1 ? featuredPosts : latestPost ? [latestPost] : [];
  const heroPostSlugs = new Set(heroPosts.map((post) => post.slug));
  const remainingPosts = sortedByRecent.filter((post) => !heroPostSlugs.has(post.slug));

  // All unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(allPosts.map((p) => p.category)));
    return cats.sort();
  }, [allPosts]);

  // Filtered & sorted remaining posts
  const filteredPosts = useMemo(() => {
    let posts = [...remainingPosts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      posts = posts.filter((p) => p.category === selectedCategory);
    }

    posts.sort((a, b) => {
      const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      return sortByDate === 'newest' ? diff : -diff;
    });

    return posts;
  }, [remainingPosts, searchQuery, selectedCategory, sortByDate]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const t = {
    fr: {
      title: 'Blog',
      subtitle: "Articles, tutoriels et conseils sur le développement web, l'IA et l'automatisation.",
      intro: "Bienvenue sur le blog NeuraWeb — la ressource de référence pour les entrepreneurs, startups et PME qui veulent exploiter les technologies web de demain. Nos experts partagent chaque semaine des guides pratiques, des analyses approfondies et des retours d'expérience concrets sur trois grands thèmes : le développement web avec Next.js et React, l'intégration de l'intelligence artificielle dans les processus métier, et l'automatisation des workflows avec des outils comme n8n, Make et Zapier. Que vous cherchiez à refondre votre site, déployer un chatbot IA, automatiser votre prospection commerciale ou comprendre les enjeux du SEO en 2026, vous trouverez ici des réponses directement applicables. Chaque article est rédigé par notre équipe de développeurs et consultants IA, avec un angle orienté résultats et ROI mesurable. Pas de contenu générique — uniquement des cas concrets, des chiffres réels et des recommandations actionnables pour accélérer votre transformation digitale.",
      featuredBadge: 'À LA UNE',
      readArticle: "Lire l'article",
      searchPlaceholder: 'Rechercher un article, un mot-clé...',
      dateLabel: 'Date de publication',
      contentType: 'Type de contenu',
      reset: 'Réinitialiser',
      newest: 'Plus récents',
      oldest: 'Plus anciens',
      allTypes: 'Tous les types',
      allArticles: 'Tous les articles',
      noResults: 'Aucun article ne correspond à votre recherche.',
      newsletter: 'Restez à jour avec NeuraWeb',
      newsletterDesc: 'Recevez nos derniers articles et ressources directement dans votre boîte mail.',
      emailPlaceholder: 'Votre adresse email',
      subscribe: "S'abonner",
      by: 'par',
    },
    en: {
      title: 'Blog',
      subtitle: 'Articles, tutorials and tips on web development, AI and automation.',
      intro: 'Welcome to the NeuraWeb blog — your go-to resource for entrepreneurs, startups and SMBs looking to leverage tomorrow\'s web technologies. Our experts share weekly practical guides, in-depth analyses and real-world case studies on three major topics: web development with Next.js and React, integrating artificial intelligence into business processes, and workflow automation with tools like n8n, Make and Zapier. Whether you\'re looking to redesign your website, deploy an AI chatbot, automate your sales prospecting or understand SEO challenges in 2026, you\'ll find directly actionable answers here. Every article is written by our team of developers and AI consultants, with a results-driven, measurable ROI focus. No generic content — only concrete case studies, real numbers and actionable recommendations to accelerate your digital transformation and stay ahead of the competition.',
      featuredBadge: 'FEATURED',
      readArticle: 'Read article',
      searchPlaceholder: 'Search an article, a keyword...',
      dateLabel: 'Publication date',
      contentType: 'Content type',
      reset: 'Reset',
      newest: 'Newest',
      oldest: 'Oldest',
      allTypes: 'All types',
      allArticles: 'All articles',
      noResults: 'No articles match your search.',
      newsletter: 'Stay up to date with NeuraWeb',
      newsletterDesc: 'Receive our latest articles and resources directly in your inbox.',
      emailPlaceholder: 'Your email address',
      subscribe: 'Subscribe',
      by: 'by',
    },
    es: {
      title: 'Blog',
      subtitle: 'Artículos, tutoriales y consejos sobre desarrollo web, IA y automatización.',
      intro: 'Bienvenido al blog de NeuraWeb — tu recurso de referencia para emprendedores, startups y pymes que quieren aprovechar las tecnologías web del futuro. Nuestros expertos comparten cada semana guías prácticas, análisis en profundidad y casos de uso reales sobre tres grandes temas: el desarrollo web con Next.js y React, la integración de la inteligencia artificial en los procesos de negocio, y la automatización de flujos de trabajo con herramientas como n8n, Make y Zapier. Ya sea que quieras renovar tu sitio web, desplegar un chatbot IA, automatizar tu prospección comercial o entender los desafíos del SEO en 2026, encontrarás aquí respuestas directamente aplicables. Cada artículo está redactado por nuestro equipo de desarrolladores y consultores en IA, con un enfoque orientado a resultados y ROI medible. Sin contenido genérico — solo casos concretos, cifras reales y recomendaciones accionables para acelerar tu transformación digital.',
      featuredBadge: 'DESTACADO',
      readArticle: 'Leer el artículo',
      searchPlaceholder: 'Buscar un artículo, una palabra clave...',
      dateLabel: 'Fecha de publicación',
      contentType: 'Tipo de contenido',
      reset: 'Reiniciar',
      newest: 'Más recientes',
      oldest: 'Más antiguos',
      allTypes: 'Todos los tipos',
      allArticles: 'Todos los artículos',
      noResults: 'Ningún artículo coincide con tu búsqueda.',
      newsletter: 'Mantente al día con NeuraWeb',
      newsletterDesc: 'Recibe nuestros últimos artículos y recursos directamente en tu bandeja de entrada.',
      emailPlaceholder: 'Tu dirección de email',
      subscribe: 'Suscribirse',
      by: 'por',
    },
  };

  const tr = t[language as 'fr' | 'en' | 'es'] || t.fr;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(
      language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'fr-FR',
      { day: 'numeric', month: 'short', year: 'numeric' }
    );

  const handleReset = () => {
    setSearchQuery('');
    setSortByDate('newest');
    setSelectedCategory('all');
  };

  // Category badge color map (cycles through a palette)
  const CATEGORY_COLORS: Record<string, string> = {};
  const PALETTE = [
    'bg-gray-700',
    'bg-purple-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
  ];
  categories.forEach((cat, i) => {
    CATEGORY_COLORS[cat] = PALETTE[i % PALETTE.length];
  });

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="py-16 sm:py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {tr.title}{' '}
            <span className="bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
              NeuraWeb
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {tr.subtitle}
          </p>
          {tr.intro && (
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mt-4 leading-relaxed">
              {tr.intro}
            </p>
          )}
        </div>
      </section>

      {/* ─── Latest / Featured Hero Card ─── */}
      {latestPost && (
        <section className="px-4 mb-10">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              {/* Carousel if there are multiple featured */}
              {featuredPosts.length > 1 && (
                <>
                  {featuredPosts.map((fp, idx) => (
                    <div
                      key={fp.slug}
                      className={`transition-opacity duration-700 ${idx === featuredIndex ? 'block' : 'hidden'}`}
                    >
                      <HeroCard post={fp} tr={tr} formatDate={formatDate} categoryColors={CATEGORY_COLORS} />
                    </div>
                  ))}
                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {featuredPosts.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setFeaturedIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${idx === featuredIndex ? 'w-8 bg-white' : 'w-2 bg-gray-400/60'}`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                  {/* Arrow */}
                  <button
                    onClick={() => setFeaturedIndex((i) => (i + 1) % featuredPosts.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition"
                    aria-label="Next"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              {/* Single latest post if no featured carousel */}
              {featuredPosts.length <= 1 && (
                <HeroCard post={latestPost} tr={tr} formatDate={formatDate} categoryColors={CATEGORY_COLORS} />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── Search & Filters ─── */}
      <section className="px-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tr.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 transition"
              />
            </div>

            {/* Date sort */}
            <div className="relative">
              <select
                value={sortByDate}
                onChange={(e) => setSortByDate(e.target.value as 'newest' | 'oldest')}
                className="appearance-none pl-3 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 transition cursor-pointer"
              >
                <option value="newest">{tr.dateLabel} ↓ {tr.newest}</option>
                <option value="oldest">{tr.dateLabel} ↑ {tr.oldest}</option>
              </select>
              <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
              </svg>
            </div>

            {/* Category filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-3 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 transition cursor-pointer"
              >
                <option value="all">{tr.contentType} — {tr.allTypes}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Reset */}
            {(searchQuery || selectedCategory !== 'all' || sortByDate !== 'newest') && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm hover:border-red-400 hover:text-red-500 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M5.635 19A9 9 0 1 0 4.583 9.001" />
                </svg>
                {tr.reset}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Posts Grid ─── */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {paginatedPosts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/30 rounded-2xl">
              <p className="text-gray-500 dark:text-gray-400">{tr.noResults}</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map((post) => (
                  <article
                    key={post.slug}
                    data-blog-slug={post.slug}
                    data-blog-title={post.title}
                    className="group bg-white dark:bg-gray-900/40 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-gray-400/50 hover:shadow-lg hover:shadow-gray-400/10 transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-44 w-full overflow-hidden flex-shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold text-white ${CATEGORY_COLORS[post.category] ?? 'bg-gray-700'}`}>
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors line-clamp-2 leading-snug">
                        <Link href={`/blog/${post.slug}`} onClick={() => handleBlogClick(post.slug, post.title)}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-auto">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">N</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{post.author}</span>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <time className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {formatDate(post.date)}
                        </time>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    aria-label="Previous"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '...' ? (
                        <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
                          ...
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p as number)}
                          className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition border ${
                            currentPage === p
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-900 hover:text-gray-900'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    aria-label="Next"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ─── Newsletter Banner ─── */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-900 dark:bg-gray-800/50 rounded-2xl px-8 py-7 border border-gray-700">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Text */}
            <div className="flex-1 text-center sm:text-left">
              <p className="font-semibold text-white text-base">{tr.newsletter}</p>
              <p className="text-gray-400 text-sm mt-0.5">{tr.newsletterDesc}</p>
            </div>

            {/* Form */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder={tr.emailPlaceholder}
                className="flex-1 sm:w-60 px-4 py-2.5 rounded-xl bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400 transition"
              />
              <button className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-900 text-sm font-semibold transition">
                {tr.subscribe} →
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HeroCard sub-component (latest/featured post)
// ─────────────────────────────────────────────────────────────────────────────
interface HeroCardProps {
  post: BlogPostMeta;
  tr: Record<string, string>;
  formatDate: (d: string) => string;
  categoryColors: Record<string, string>;
}

function HeroCard({ post, tr, formatDate, categoryColors }: HeroCardProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-[340px]">
      {/* Text side */}
      <div className="flex-1 p-8 flex flex-col justify-center z-10">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-900 text-white mb-4 self-start tracking-wide">
          {tr.featuredBadge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
          {post.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2 max-w-md">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <span>{post.author}</span>
          <span>•</span>
          <time>{formatDate(post.date)}</time>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 self-start px-5 py-2.5 rounded-xl border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all duration-200"
        >
          {tr.readArticle}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Image side */}
      <div className="relative md:w-[45%] min-h-[220px] md:min-h-0">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-gray-900/90 via-transparent to-transparent md:block hidden" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900/90 via-transparent to-transparent md:hidden" />
      </div>
    </div>
  );
}
