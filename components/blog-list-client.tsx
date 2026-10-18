'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { useAnalytics } from '@/hooks/use-analytics';
import { CoverImage } from '@/components/blog/cover-image';
import { CategoryRail } from '@/components/blog/category-rail';
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
  postsVi: BlogPostMeta[];
  featuredFr: BlogPostMeta[];
  featuredEn: BlogPostMeta[];
  featuredEs: BlogPostMeta[];
  featuredVi: BlogPostMeta[];
}

export function BlogListClient({ postsFr, postsEn, postsEs, postsVi, featuredFr, featuredEn, featuredEs, featuredVi }: BlogListClientProps) {
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
    const featuredPosts = language === 'en' ? featuredEn : language === 'es' ? featuredEs : language === 'vi' ? featuredVi : featuredFr;
    if (featuredPosts.length <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % featuredPosts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [mounted, language, featuredFr, featuredEn, featuredEs, featuredVi]);

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

  const allPosts = language === 'en' ? postsEn : language === 'es' ? postsEs : language === 'vi' ? postsVi : postsFr;
  const featuredPosts = language === 'en' ? featuredEn : language === 'es' ? featuredEs : language === 'vi' ? featuredVi : featuredFr;

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
      all: 'Tous',
      seeAll: 'Tout voir',
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
      all: 'All',
      seeAll: 'See all',
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
      all: 'Todos',
      seeAll: 'Ver todo',
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
    vi: {
      title: 'Blog',
      subtitle: 'Bài viết, hướng dẫn và kinh nghiệm thực tế về website, AI và tự động hóa.',
      intro: 'Chào mừng bạn đến với blog NeuraWeb — nơi chủ cửa hàng, hộ kinh doanh và doanh nghiệp vừa và nhỏ tại Việt Nam tìm được những kiến thức thực tế về công nghệ web. Mỗi tuần, đội ngũ lập trình viên và chuyên gia AI của chúng tôi chia sẻ hướng dẫn từng bước, phân tích chuyên sâu và các tình huống có thật xoay quanh ba chủ đề chính: thiết kế website với Next.js và React, ứng dụng trí tuệ nhân tạo vào công việc kinh doanh hằng ngày, và tự động hóa quy trình bằng n8n, Make hay Zapier. Dù bạn đang muốn có một trang giới thiệu cửa hàng để khách tìm thấy trên Google, làm mới website doanh nghiệp, triển khai chatbot AI trả lời khách 24/7, giảm phụ thuộc vào các app đặt món, hay hiểu rõ cách làm SEO năm 2026 — bạn đều tìm được câu trả lời áp dụng được ngay. Chúng tôi viết theo hướng kết quả: không nội dung chung chung, chỉ có tình huống cụ thể, con số thật và những việc bạn có thể bắt tay làm ngay.',
      featuredBadge: 'NỔI BẬT',
      all: 'Tất cả',
      seeAll: 'Xem tất cả',
      readArticle: 'Đọc bài viết',
      searchPlaceholder: 'Tìm bài viết, từ khóa...',
      dateLabel: 'Ngày đăng',
      contentType: 'Loại nội dung',
      reset: 'Đặt lại',
      newest: 'Mới nhất',
      oldest: 'Cũ nhất',
      allTypes: 'Tất cả loại nội dung',
      allArticles: 'Tất cả bài viết',
      noResults: 'Không có bài viết nào phù hợp với tìm kiếm của bạn.',
      newsletter: 'Cập nhật cùng NeuraWeb',
      newsletterDesc: 'Nhận bài viết và tài liệu mới nhất của chúng tôi qua email.',
      emailPlaceholder: 'Địa chỉ email của bạn',
      subscribe: 'Đăng ký',
      by: 'bởi',
    },
  };

  const tr = t[language as 'fr' | 'en' | 'es' | 'vi'] || t.fr;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(
      language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : language === 'vi' ? 'vi-VN' : 'fr-FR',
      { day: 'numeric', month: 'short', year: 'numeric' }
    );

  const handleReset = () => {
    setSearchQuery('');
    setSortByDate('newest');
    setSelectedCategory('all');
  };

  // Catégories : trois teintes de la charte (plus de couleurs arbitraires)
  const CAT_STYLES = [
    'bg-chypre text-creme',
    'bg-chypre-20 text-chypre',
    'border border-chypre/40 bg-creme text-chypre',
  ];
  const CATEGORY_STYLES: Record<string, string> = {};
  categories.forEach((cat, i) => {
    CATEGORY_STYLES[cat] = CAT_STYLES[i % CAT_STYLES.length];
  });
  const countByCategory = useMemo(() => {
    const m: Record<string, number> = {};
    allPosts.forEach((p) => { m[p.category] = (m[p.category] ?? 0) + 1; });
    return m;
  }, [allPosts]);

  // Carte d'article (grille et carrousels de catégories)
  const renderCard = (post: BlogPostMeta, extra = '') => (
    <article
                    key={post.slug}
                    data-blog-slug={post.slug}
                    data-blog-title={post.title}
                    className={`lift group relative flex flex-col overflow-hidden rounded-3xl border border-chypre/15 bg-creme transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,70,67,0.14)] ${extra}`}
                  >
                    <CoverImage
                      src={post.image}
                      alt=""
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                      className="aspect-[3/2] w-full border-b border-chypre/10"
                      imgClassName="transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                    />

                    <div className="flex flex-1 flex-col p-5">
                      <span className={`mb-3 self-start rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_STYLES[post.category] ?? CAT_STYLES[0]}`}>
                        {post.category}
                      </span>
                      <h3 className="mb-2 line-clamp-2 font-display text-lg font-bold leading-snug text-chypre">
                        {/* Lien étiré : toute la carte est cliquable */}
                        <LocalizedLink
                          href={`/blog/${post.slug}`}
                          onClick={() => handleBlogClick(post.slug, post.title)}
                          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-chypre focus-visible:after:rounded-3xl"
                        >
                          {post.title}
                        </LocalizedLink>
                      </h3>
                      <p className="mb-4 line-clamp-2 flex-1 text-sm text-chypre/85">{post.excerpt}</p>
                      <div className="mt-auto flex items-center gap-2 text-xs text-chypre/80">
                        <time>{formatDate(post.date)}</time>
                        <span aria-hidden="true">·</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </article>
  )

  // Vue « Tous » : un carrousel automatique par catégorie ; dès qu'un filtre ou une recherche est actif : grille paginée
  const railMode = selectedCategory === 'all' && !searchQuery.trim() && sortByDate === 'newest'
  const rails = useMemo(
    () =>
      categories
        .map((cat) => ({ cat, posts: remainingPosts.filter((p) => p.category === cat) }))
        .filter((r) => r.posts.length > 0)
        .sort((a, b) => b.posts.length - a.posts.length),
    [categories, remainingPosts]
  )

  const hasFilters = searchQuery || selectedCategory !== 'all' || sortByDate !== 'newest';

  return (
    <>
      {/* ─── En-tête compact ─── */}
      <section className="px-4 pb-4 pt-24 sm:px-6 sm:pb-8 sm:pt-28 lg:pt-32">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-[2rem] leading-[1.1] text-chypre sm:mb-3 sm:text-5xl lg:text-6xl">
            {tr.title} NeuraWeb
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-chypre/90 sm:text-xl">{tr.subtitle}</p>
        </div>
      </section>

      {/* ─── À la une : texte 50 % / illustration entière 50 % ─── */}
      {latestPost && (
        <section className="mb-6 px-4 sm:mb-10 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="overflow-hidden rounded-3xl border border-chypre/15 bg-creme">
              {(featuredPosts.length > 1 ? featuredPosts : [latestPost]).map((fp, idx) => (
                <div key={fp.slug} className={idx === (featuredPosts.length > 1 ? featuredIndex : 0) ? 'block' : 'hidden'}>
                  <FeaturedCard post={fp} tr={tr} formatDate={formatDate} priority={idx === 0} onOpen={handleBlogClick} />
                </div>
              ))}
            </div>
            {featuredPosts.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3">
                {featuredPosts.map((fp, idx) => (
                  <button
                    key={fp.slug}
                    onClick={() => setFeaturedIndex(idx)}
                    className="flex h-6 items-center"
                    aria-label={`${idx + 1} / ${featuredPosts.length}`}
                    aria-current={idx === featuredIndex}
                  >
                    <span className={`block h-1.5 rounded-full transition-all ${idx === featuredIndex ? 'w-8 bg-chypre' : 'w-2 bg-chypre/35'}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Filtres collants : pastilles défilantes + recherche ─── */}
      <section className="z-40 border-y border-chypre/10 bg-creme/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:sticky lg:top-[72px] lg:transition-[top] lg:duration-500 lg:[html[data-nav-hidden='true']_&]:top-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 lg:flex-row lg:items-start">
          <div
            className="flex flex-wrap gap-2 lg:flex-1"
            role="group"
            aria-label={tr.contentType}
          >
            {['all', ...categories].map((cat) => {
              const selected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selected}
                  className={`min-h-[44px] whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors ${
                    selected ? 'border-chypre bg-chypre text-creme' : 'border-chypre/30 text-chypre hover:bg-chypre/10'
                  }`}
                >
                  {cat === 'all' ? tr.all : cat}
                  <span className={`ml-1.5 text-xs font-medium ${selected ? 'text-creme/80' : 'text-chypre/80'}`}>
                    {cat === 'all' ? allPosts.length : countByCategory[cat]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 lg:w-64 lg:flex-none">
              <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-chypre/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tr.searchPlaceholder}
                aria-label={tr.searchPlaceholder}
                className="min-h-[44px] w-full rounded-full border border-chypre/30 bg-creme pl-10 pr-4 text-sm text-chypre placeholder:text-chypre/60 focus:border-chypre focus:outline-none focus:ring-2 focus:ring-chypre/30"
              />
            </div>
            <select
              value={sortByDate}
              onChange={(e) => setSortByDate(e.target.value as 'newest' | 'oldest')}
              aria-label={tr.dateLabel}
              className="min-h-[44px] cursor-pointer rounded-full border border-chypre/30 bg-creme px-3 text-sm text-chypre focus:border-chypre focus:outline-none focus:ring-2 focus:ring-chypre/30"
            >
              <option value="newest">{tr.newest}</option>
              <option value="oldest">{tr.oldest}</option>
            </select>
            {hasFilters && (
              <button onClick={handleReset} className="min-h-[44px] shrink-0 rounded-full px-3 text-sm font-semibold text-chypre underline underline-offset-4">
                {tr.reset}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Grille : l'illustration mène chaque carte ─── */}
      <section className="px-4 pb-16 pt-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {railMode ? (
            <>
              {rails.map(({ cat, posts }) => (
                <CategoryRail
                  key={cat}
                  title={cat}
                  count={posts.length}
                  items={posts}
                  seeAllLabel={tr.seeAll}
                  onSeeAll={() => { setSelectedCategory(cat); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  getKey={(p) => p.slug}
                  renderItem={(p, extra) => renderCard(p, extra)}
                />
              ))}
            </>
          ) : paginatedPosts.length === 0 ? (
            <div className="rounded-3xl border border-chypre/15 bg-chypre/[0.05] py-20 text-center">
              <p className="text-chypre/90">{tr.noResults}</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedPosts.map((post) => renderCard(post))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-chypre/30 text-chypre transition hover:bg-chypre/10 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Previous"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
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
                        <span key={`ellipsis-${i}`} className="flex h-11 w-8 items-center justify-center text-chypre/80">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p as number)}
                          aria-current={currentPage === p ? 'page' : undefined}
                          className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold transition ${
                            currentPage === p ? 'border-chypre bg-chypre text-creme' : 'border-chypre/30 text-chypre hover:bg-chypre/10'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-chypre/30 text-chypre transition hover:bg-chypre/10 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Next"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {/* ─── Newsletter ─── */}
      <section className="px-4 pb-12 sm:px-6">
        <div className="ctx-dark mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-3xl bg-chypre px-6 py-8 sm:flex-row sm:px-8">
          <div className="flex-1 text-center sm:text-left">
            <p className="font-display text-lg font-bold text-creme">{tr.newsletter}</p>
            <p className="mt-0.5 text-sm text-creme/85">{tr.newsletterDesc}</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <input
              type="email"
              placeholder={tr.emailPlaceholder}
              aria-label={tr.emailPlaceholder}
              className="min-h-[44px] w-full min-w-0 flex-1 rounded-full border border-creme/30 bg-creme/10 px-4 text-base sm:text-sm text-creme placeholder:text-creme/70 focus:border-creme focus:outline-none focus:ring-2 focus:ring-creme/40 sm:w-60"
            />
            <button className="min-h-[44px] w-full shrink-0 rounded-full bg-creme px-5 text-sm font-semibold text-chypre transition-transform hover:scale-[1.03] sm:w-auto">
              {tr.subscribe} →
            </button>
          </div>
        </div>
      </section>

      {/* ─── Texte de présentation (SEO) : sous la grille pour ne pas repousser les articles ─── */}
      {tr.intro && (
        <section className="px-4 pb-20 sm:px-6">
          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-chypre/80">{tr.intro}</p>
        </section>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FeaturedCard : « à la une » — texte à gauche, illustration entière à droite
// ─────────────────────────────────────────────────────────────────────────────
interface FeaturedCardProps {
  post: BlogPostMeta;
  tr: Record<string, string>;
  formatDate: (d: string) => string;
  priority: boolean;
  onOpen: (slug: string, title: string) => void;
}

function FeaturedCard({ post, tr, formatDate, priority, onOpen }: FeaturedCardProps) {
  return (
    <div className="grid md:grid-cols-2">
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 max-md:order-last">
        <span className="mb-4 self-start rounded-full bg-chypre px-3 py-1 text-xs font-bold tracking-wide text-creme">
          {tr.featuredBadge}
        </span>
        <h2 className="mb-3 font-impact text-2xl font-black leading-tight text-chypre sm:text-3xl">{post.title}</h2>
        <p className="mb-5 line-clamp-3 max-w-md text-chypre/90">{post.excerpt}</p>
        <div className="mb-6 flex items-center gap-2 text-sm text-chypre/80">
          <time>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
        </div>
        <LocalizedLink
          href={`/blog/${post.slug}`}
          onClick={() => onOpen(post.slug, post.title)}
          className="inline-flex min-h-[48px] items-center gap-2 self-start rounded-full bg-chypre px-6 text-sm font-semibold text-creme transition-transform hover:scale-[1.03]"
        >
          {tr.readArticle}
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </LocalizedLink>
      </div>

      <CoverImage
        src={post.image}
        alt={post.title}
        sizes="(max-width: 768px) 100vw, 560px"
        priority={priority}
        className="aspect-[16/9] border-b border-chypre/10 md:aspect-auto md:min-h-[340px] md:border-b-0 md:border-l"
      />
    </div>
  );
}
