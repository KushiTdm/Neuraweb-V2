'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Loader2, ExternalLink, Globe, Smartphone } from 'lucide-react';
import { gsap } from '@/lib/gsap-setup';
import { useTranslation } from '@/hooks/use-translation';
import type { TranslationKey } from '@/locales';

interface Project {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  image: string;
  gif: string;
  gifType: 'gif' | 'webm';
  technologies: string[];
  category: 'web' | 'mobile';
  url?: string;
  ariaLabel?: string;
}

const portfolio: Project[] = [
  {
    titleKey: 'portfolio.ecommerce.title',
    descriptionKey: 'portfolio.ecommerce.description',
    image: '/assets/ecommerce/ecommerceCompressed.webp',
    gif: '/assets/ecommerce/ecommerceCompressed.webp',
    gifType: 'webm',
    technologies: ['React', 'Node.js', 'Stripe'],
    category: 'web',
    url: 'https://neuraweb-ecommerce.netlify.app/',
    ariaLabel: 'E-commerce platform project',
  },
  {
    titleKey: 'portfolio.fitness.title',
    descriptionKey: 'portfolio.fitness.description',
    image: '/assets/Fit/fitCompressed.webp',
    gif: '/assets/Fit/fitCompressed.webp',
    gifType: 'gif',
    technologies: ['React Native', 'Firebase'],
    category: 'mobile',
    url: 'https://fitnessandhappiness.netlify.app/',
  },
  {
    titleKey: 'portfolio.beauty.title',
    descriptionKey: 'portfolio.beauty.description',
    image: '/assets/Lum/Lum-Cover.webp',
    gif: '/assets/Lum/Lum.gif',
    gifType: 'gif',
    technologies: ['React', 'TypeScript', 'GSAP'],
    category: 'web',
    url: 'https://lum-paris.netlify.app/',
  },
  {
    titleKey: 'portfolio.booking.title',
    descriptionKey: 'portfolio.booking.description',
    image: '/assets/osteoCanin/osteoCanin.webp',
    gif: '/assets/osteoCanin/osteoCanin.webp',
    gifType: 'gif',
    technologies: ['React', 'Supabase', 'Node'],
    category: 'web',
    url: 'https://osteocanin.onrender.com/',
  },
  {
    titleKey: 'portfolio.hotel.title',
    descriptionKey: 'portfolio.hotel.description',
    image: '/assets/hotel/hotel.webp',
    gif: '/assets/hotel/hotel.webp',
    gifType: 'gif',
    technologies: ['React', 'Supabase', 'Node'],
    category: 'web',
    url: 'https://arthan-hotel.netlify.app/',
  },
];

type FilterCategory = 'all' | 'web' | 'mobile';

export function PortfolioSection() {
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(portfolio);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [gifLoading, setGifLoading] = useState(false);
  const [gifLoaded, setGifLoaded] = useState(false);
  const [autoPlayProgress, setAutoPlayProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useTranslation();

  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const prevIndexRef = useRef<number>(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.portfolio-title', {
        scrollTrigger: { trigger: '.portfolio-title', start: 'top 85%', toggleActions: 'play none none none' },
        duration: 0.9, y: -40, opacity: 0, ease: 'power3.out',
      });
      gsap.from('.portfolio-subtitle', {
        scrollTrigger: { trigger: '.portfolio-subtitle', start: 'top 85%', toggleActions: 'play none none none' },
        duration: 0.9, y: 20, opacity: 0, delay: 0.15, ease: 'power3.out',
      });
      gsap.from('.portfolio-filters', {
        scrollTrigger: { trigger: '.portfolio-filters', start: 'top 88%', toggleActions: 'play none none none' },
        duration: 0.7, y: 20, opacity: 0, delay: 0.25, ease: 'power2.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !carouselRef.current) {
      const newFiltered = activeFilter === 'all' ? portfolio : portfolio.filter((p) => p.category === activeFilter);
      setFilteredProjects(newFiltered);
      setCurrentIndex(0);
      return;
    }
    gsap.to(cardsRef.current.filter(Boolean), {
      duration: 0.25, opacity: 0, y: -20, scale: 0.92, ease: 'power2.in', stagger: 0.04,
      onComplete: () => {
        const newFiltered = activeFilter === 'all' ? portfolio : portfolio.filter((p) => p.category === activeFilter);
        setFilteredProjects(newFiltered);
        setCurrentIndex(0);
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  const updateCarousel = useCallback(() => {
    if (!mounted) return;
    const isMobile = window.innerWidth < 768;
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      const offset = index - currentIndex;
      const absOffset = Math.abs(offset);
      const isActive = offset === 0;
      const x = isMobile ? offset * 240 : offset * 310;
      const z = isActive ? 0 : -absOffset * 180;
      const scale = isActive ? 1 : Math.max(0.65, 1 - absOffset * 0.18);
      const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.55 : 0.2;
      const rotateY = offset * 12;
      gsap.to(card, {
        duration: isActive ? 0.65 : 0.75, x, z, scale, opacity, rotateY,
        ease: isActive ? 'back.out(1.4)' : 'power3.out',
        zIndex: 100 - absOffset * 10, overwrite: 'auto',
      });
    });
  }, [currentIndex, mounted]);

  useEffect(() => {
    if (!mounted || cardsRef.current.length === 0) return;
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, y: 60, scale: 0.85 },
        {
          opacity: index === 0 ? 1 : index === 1 ? 0.55 : 0.2,
          y: 0, scale: index === 0 ? 1 : Math.max(0.65, 1 - index * 0.18),
          duration: 0.7, delay: 0.1 + index * 0.08, ease: 'power3.out', overwrite: 'auto',
        }
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, filteredProjects]);

  useEffect(() => {
    if (mounted && cardsRef.current.length > 0) updateCarousel();
  }, [currentIndex, mounted, filteredProjects, updateCarousel]);

  useEffect(() => {
    if (!mounted || !isAutoPlay || filteredProjects.length <= 1) {
      setAutoPlayProgress(0);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }
    setAutoPlayProgress(0);
    const DURATION = 4000;
    const TICK = 50;
    progressRef.current = setInterval(() => {
      setAutoPlayProgress((prev) => prev >= 100 ? 0 : prev + (TICK / DURATION) * 100);
    }, TICK);
    autoPlayRef.current = setInterval(() => {
      prevIndexRef.current = currentIndex;
      setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
      setAutoPlayProgress(0);
    }, DURATION);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isAutoPlay, mounted, filteredProjects.length, currentIndex]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    prevIndexRef.current = currentIndex;
    setCurrentIndex((prev) => (prev + 1) % filteredProjects.length);
    setIsAutoPlay(false);
    setAutoPlayProgress(0);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [currentIndex, filteredProjects.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    prevIndexRef.current = currentIndex;
    setCurrentIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
    setIsAutoPlay(false);
    setAutoPlayProgress(0);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [currentIndex, filteredProjects.length, isTransitioning]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
    touchStartY.current = e.changedTouches[0].screenY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = Math.abs(touchStartY.current - e.changedTouches[0].screenY);
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
      deltaX > 0 ? nextSlide() : prevSlide();
    }
  };

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setIsAutoPlay(false);
    setGifLoading(true);
    setGifLoaded(false);
    if (project.gifType === 'gif') {
      const img = new window.Image();
      img.src = project.gif;
      img.onload = () => { setGifLoading(false); setGifLoaded(true); };
      img.onerror = () => { setGifLoading(false); setGifLoaded(false); };
    }
    gsap.from('.modal-content', { duration: 0.5, scale: 0.5, opacity: 0, ease: 'back.out(1.7)' });
  };

  const closeProject = () => {
    gsap.to('.modal-content', {
      duration: 0.3, scale: 0.5, opacity: 0, ease: 'power2.in',
      onComplete: () => { setSelectedProject(null); setIsAutoPlay(true); setGifLoading(false); setGifLoaded(false); },
    });
  };

  const handleViewProject = () => {
    if (selectedProject?.url) window.open(selectedProject.url, '_blank', 'noopener,noreferrer');
  };

  const getCategoryIcon = (category: 'web' | 'mobile') =>
    category === 'mobile'
      ? <Smartphone size={11} className="inline-block mr-1" aria-hidden="true" />
      : <Globe size={11} className="inline-block mr-1" aria-hidden="true" />;

  const getCategoryLabel = (category: 'web' | 'mobile') =>
    category === 'mobile' ? t('portfolio.category.mobile') : t('portfolio.category.web');

  /*
    FIX contraste badges :
    Problème : dark:bg-gray-800/90 est semi-transparent + backdrop-blur.
    Le fond effectif derrière les cartes latérales varie selon le contenu
    derrière (gradient violet/gris), rendant le contraste imprévisible.

    Solution double :
    1. Fond carte → dark:bg-gray-800 (opaque, sans /90) pour éliminer
       la transparence qui cause le contraste variable.
    2. Badge Web/Mobile → couleurs à fort contraste garanti :
       - bg-blue-100 text-blue-800 : ratio ~5.9:1 ✓
       - dark:bg-blue-800 dark:text-blue-100 : ratio ~8.2:1 ✓ (remplace dark:bg-blue-700 dark:text-white)
  */
  const getCategoryColor = (category: 'web' | 'mobile') =>
    category === 'mobile'
      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';

  if (!mounted) {
    return (
      <section className="section-snap min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-2xl text-gray-400">Chargement du portfolio...</div>
      </section>
    );
  }

  const filters: { key: FilterCategory; label: TranslationKey }[] = [
    { key: 'all', label: 'portfolio.filter.all' },
    { key: 'web', label: 'portfolio.filter.web' },
    { key: 'mobile', label: 'portfolio.filter.mobile' },
  ];

  return (
    <>
      <section
        ref={sectionRef}
        id="portfolio"
        aria-labelledby="portfolio-heading"
        className="section-snap bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 overflow-hidden relative min-h-screen py-20"
      >
        <div className="max-w-7xl mx-auto h-full min-h-screen flex flex-col justify-center px-4 py-8 md:py-12">

          <div className="text-center mb-4 md:mb-5 relative z-[60]">
            <h2 id="portfolio-heading" className="portfolio-title text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              {t('portfolio.section.title.start')}{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {t('portfolio.section.title.highlight')}
              </span>
            </h2>
            <p className="portfolio-subtitle text-sm md:text-base lg:text-lg text-gray-800 dark:text-gray-100 max-w-2xl mx-auto">
              {t('portfolio.section.subtitle')}
            </p>
          </div>

          <div className="portfolio-filters flex justify-center gap-2 mb-4 md:mb-5 relative z-[60]" role="group" aria-label="Filtrer les projets">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setActiveFilter(key); setIsAutoPlay(false); }}
                aria-pressed={activeFilter === key}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  activeFilter === key
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg shadow-purple-500/30 scale-105'
                    : 'bg-white/80 dark:bg-white/10 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/20 hover:border-purple-400 dark:hover:border-purple-400 hover:scale-105'
                }`}
              >
                {t(label)}
                {key !== 'all' && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({portfolio.filter((p) => p.category === key).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {filteredProjects.length > 0 ? (
            <div
              className="flex-1 relative max-h-[450px] md:max-h-[500px]"
              style={{ perspective: '1500px' }}
              role="region"
              aria-label={t('portfolio.carousel.label')}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div ref={carouselRef} className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                {filteredProjects.map((project, index) => (
                  <div
                    key={`${activeFilter}-${index}`}
                    ref={(el) => (cardsRef.current[index] = el)}
                    className="carousel-card absolute w-60 sm:w-64 md:w-72 lg:w-80 cursor-pointer group"
                    style={{ transformStyle: 'preserve-3d' }}
                    onClick={() => index === currentIndex && openProject(project)}
                    role="article"
                    aria-label={project.ariaLabel || t(project.titleKey)}
                    tabIndex={index === currentIndex ? 0 : -1}
                    onKeyDown={(e) => {
                      if (index === currentIndex && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        openProject(project);
                      }
                    }}
                  >
                    {/*
                      FIX contraste dark mode :
                      dark:bg-gray-800/90 dark:backdrop-blur-lg → fond semi-transparent
                      Le fond effectif derrière les cartes latérales varie selon le gradient
                      de fond de la section, rendant les ratios de contraste imprévisibles.

                      Solution : dark:bg-gray-800 (fond opaque, sans alpha)
                      → élimine la dépendance au fond arrière-plan
                      → ratio texte garanti indépendamment de la position dans le carousel
                    */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl border border-gray-200 dark:border-white/20 transition-shadow duration-300 hover:border-purple-400 dark:hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20">
                      <div className="relative h-36 sm:h-40 md:h-48 overflow-hidden">
                        <Image
                          src={project.image}
                          alt={t(project.titleKey)}
                          fill sizes="320px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          quality={75}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                        <div className={`absolute top-2 left-2 flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(project.category)}`}>
                          {getCategoryIcon(project.category)}
                          {getCategoryLabel(project.category)}
                        </div>
                        {index === currentIndex && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="bg-white/90 dark:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white px-4 py-2 rounded-full font-semibold text-sm">
                              {t('portfolio.card.clickToView')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 md:p-5 lg:p-6">
                        <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {t(project.titleKey)}
                        </h3>
                        {/*
                          FIX contraste texte description :
                          text-gray-800 dark:text-gray-200 → ratios :
                          light: #1f2937 sur #ffffff → 14.7:1 ✓
                          dark:  #e5e7eb sur #1f2937 → 11.3:1 ✓
                        */}
                        <p className="text-gray-800 dark:text-gray-200 mb-3 text-xs md:text-sm line-clamp-2">
                          {t(project.descriptionKey)}
                        </p>
                        <div className="flex flex-wrap gap-1.5 md:gap-2" role="list" aria-label="Technologies used">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} role="listitem" className="px-2 md:px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-700/60 dark:to-purple-700/60 text-blue-700 dark:text-blue-100 rounded-full text-xs font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProjects.length > 1 && (
                <>
                  <button onClick={prevSlide} disabled={isTransitioning}
                    className="absolute left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 group/btn bg-white/90 dark:bg-white/10 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 dark:hover:from-blue-500 dark:hover:to-purple-600 backdrop-blur-sm text-gray-900 dark:text-white hover:text-white p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed z-50 shadow-lg hover:shadow-purple-500/40"
                    aria-label={t('portfolio.nav.previous')}>
                    <ChevronLeft size={20} className="md:w-6 md:h-6 transition-transform duration-200 group-hover/btn:-translate-x-0.5" aria-hidden="true" />
                  </button>
                  <button onClick={nextSlide} disabled={isTransitioning}
                    className="absolute right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 group/btn bg-white/90 dark:bg-white/10 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 dark:hover:from-blue-500 dark:hover:to-purple-600 backdrop-blur-sm text-gray-900 dark:text-white hover:text-white p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed z-50 shadow-lg hover:shadow-purple-500/40"
                    aria-label={t('portfolio.nav.next')}>
                    <ChevronRight size={20} className="md:w-6 md:h-6 transition-transform duration-200 group-hover/btn:translate-x-0.5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">Aucun projet dans cette catégorie.</p>
            </div>
          )}

          {filteredProjects.length > 0 && (
            <div className="flex flex-col items-center gap-3 mt-4 md:mt-6 relative z-[60]">
              {/*
                FIX aria-selected :
                - aria-pressed (toggle button sémantique) au lieu de role="tab" + aria-selected
                - aria-label enrichi avec le titre du projet
                - aria-controls supprimé (ne pointait vers aucun tabpanel dans le DOM)
              */}
              <div
                className="flex justify-center gap-2"
                role="group"
                aria-label={t('portfolio.carousel.label') || 'Navigation du portfolio'}
              >
                {filteredProjects.map((project, index) => (
                  <button
                    key={index}
                    aria-pressed={index === currentIndex}
                    aria-label={`${t('portfolio.nav.goto')} ${index + 1} — ${t(project.titleKey)}`}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsAutoPlay(false);
                      setAutoPlayProgress(0);
                    }}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center group/dot"
                  >
                    <span className="relative flex items-center justify-center">
                      {index === currentIndex && (
                        <span className="absolute inset-0 rounded-full border-2 border-purple-500/50 dark:border-purple-400/50 scale-150 animate-ping-slow" aria-hidden="true" />
                      )}
                      <span
                        className={`block rounded-full transition-all duration-500 ${
                          index === currentIndex
                            ? 'w-8 md:w-10 h-2.5 md:h-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 shadow-md shadow-purple-500/40'
                            : 'w-2.5 md:w-3 h-2.5 md:h-3 bg-gray-400 dark:bg-white/40 group-hover/dot:bg-purple-400 dark:group-hover/dot:bg-purple-400 group-hover/dot:scale-125'
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                ))}
              </div>

              {isAutoPlay && filteredProjects.length > 1 && (
                <div className="w-32 md:w-40 h-0.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden" aria-hidden="true">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-none" style={{ width: `${autoPlayProgress}%` }} />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8"
          onClick={closeProject}
          role="dialog" aria-modal="true"
          aria-labelledby="modal-title" aria-describedby="modal-description"
        >
          <div
            className="modal-content bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl w-full max-w-5xl border border-gray-200 dark:border-purple-500/30 shadow-2xl flex flex-col relative"
            style={{ maxHeight: 'calc(100vh - 2rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeProject}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 backdrop-blur-sm text-gray-900 dark:text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-20 shadow-lg"
              aria-label={t('portfolio.modal.close')}
            >
              <X size={20} className="sm:w-6 sm:h-6" aria-hidden="true" />
            </button>

            <div className="flex flex-col lg:flex-row h-full">
              <div className="relative w-full lg:w-3/5 h-48 sm:h-64 lg:h-auto bg-gray-900 rounded-t-2xl lg:rounded-l-3xl lg:rounded-tr-none overflow-hidden flex-shrink-0">
                {gifLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500 animate-spin" aria-hidden="true" />
                      <span className="text-white font-medium text-sm sm:text-base">{t('portfolio.modal.loading')}</span>
                    </div>
                  </div>
                )}
                <Image
                  src={selectedProject.image} alt={t(selectedProject.titleKey)}
                  fill sizes="(max-width: 1024px) 100vw, 60vw"
                  className={`object-cover transition-opacity duration-500 ${gifLoaded ? 'opacity-0' : 'opacity-100'}`}
                  quality={85} priority
                />
                {selectedProject.gifType === 'gif' && gifLoaded && (
                  <Image
                    src={selectedProject.gif} alt={`${t(selectedProject.titleKey)} - Demo`}
                    fill sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover animate-fadeIn" unoptimized
                  />
                )}
                {selectedProject.gifType === 'webm' && (
                  <video
                    src={selectedProject.gif} autoPlay loop muted playsInline
                    aria-label={`${t(selectedProject.titleKey)} - Demo`}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${gifLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
                    onLoadedData={() => { setGifLoading(false); setGifLoaded(true); }}
                    onError={() => { setGifLoading(false); setGifLoaded(false); }}
                  />
                )}
                <div className={`absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getCategoryColor(selectedProject.category)}`}>
                  {getCategoryIcon(selectedProject.category)}
                  {getCategoryLabel(selectedProject.category)}
                </div>
              </div>

              <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
                <div>
                  <h3 id="modal-title" className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4 pr-8">
                    {t(selectedProject.titleKey)}
                  </h3>
                  <p id="modal-description" className="text-gray-700 dark:text-gray-200 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 line-clamp-3 lg:line-clamp-none">
                    {t(selectedProject.descriptionKey)}
                  </p>
                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wider">
                      {t('portfolio.modal.technologies')}
                    </h4>
                    <div className="flex flex-wrap gap-2" role="list" aria-label="Project technologies">
                      {selectedProject.technologies.map((tech, index) => (
                        <span key={index} role="listitem" className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium text-xs sm:text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {selectedProject.url && (
                  <button
                    onClick={handleViewProject}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-sm sm:text-base lg:text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    aria-label={`${t('portfolio.modal.view')} - ${t(selectedProject.titleKey)}`}
                  >
                    <ExternalLink size={18} className="sm:w-5 sm:h-5" aria-hidden="true" />
                    {t('portfolio.modal.view')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}