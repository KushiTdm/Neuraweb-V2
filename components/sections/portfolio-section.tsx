'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Loader2, ExternalLink } from 'lucide-react';
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
  category: string;
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
    image: '/assets/Lum/Lum-Cover.jpg',
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

export function PortfolioSection() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [gifLoading, setGifLoading] = useState(false);
  const [gifLoaded, setGifLoaded] = useState(false);
  const { t } = useTranslation();
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  useEffect(() => {
    if (!mounted) return;

    gsap.from('.portfolio-title', {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: 'power3.out',
    });
  }, [mounted]);

  useEffect(() => {
    if (mounted && cardsRef.current.length > 0) {
      updateCarousel();
    }
  }, [currentIndex, mounted]);

  useEffect(() => {
    if (!mounted || !isAutoPlay) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % portfolio.length);
    }, 4000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlay, mounted]);

  const updateCarousel = () => {
    if (!mounted) return;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      const offset = index - currentIndex;
      const absOffset = Math.abs(offset);
      
      let x = offset * 320;
      let z = -absOffset * 200;
      let scale = 1 - absOffset * 0.2;
      let opacity = absOffset <= 1 ? 1 : 0.3;
      let rotateY = offset * 15;

      if (window.innerWidth < 768) {
        x = offset * 260;
        z = -absOffset * 120;
        scale = 1 - absOffset * 0.15;
      }

      gsap.to(card, {
        duration: 0.8,
        x: x,
        z: z,
        scale: scale,
        opacity: opacity,
        rotateY: rotateY,
        ease: 'power2.out',
        zIndex: 100 - absOffset,
      });
    });
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % portfolio.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + portfolio.length) % portfolio.length);
    setIsAutoPlay(false);
  };

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setIsAutoPlay(false);
    setGifLoading(true);
    setGifLoaded(false);
    
    if (project.gifType === 'gif') {
      const img = new window.Image();
      img.src = project.gif;
      img.onload = () => {
        setGifLoading(false);
        setGifLoaded(true);
      };
      img.onerror = () => {
        setGifLoading(false);
        setGifLoaded(false);
      };
    }

    gsap.from('.modal-content', {
      duration: 0.5,
      scale: 0.5,
      opacity: 0,
      ease: 'back.out(1.7)',
    });
  };

  const closeProject = () => {
    gsap.to('.modal-content', {
      duration: 0.3,
      scale: 0.5,
      opacity: 0,
      ease: 'power2.in',
      onComplete: () => {
        setSelectedProject(null);
        setIsAutoPlay(true);
        setGifLoading(false);
        setGifLoaded(false);
      },
    });
  };

  const handleViewProject = () => {
    if (selectedProject?.url) {
      window.open(selectedProject.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (!mounted) {
    return (
      <section className="section-snap min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-2xl text-gray-400">Chargement du portfolio...</div>
      </section>
    );
  }

  return (
    <>
      <section
        id="portfolio"
        aria-labelledby="portfolio-heading"
        className="section-snap bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 overflow-hidden relative min-h-screen py-20"
      >
        <div className="max-w-7xl mx-auto h-full min-h-screen flex flex-col justify-center px-4 py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-4 md:mb-6 relative z-[60]">
            <h2
              id="portfolio-heading"
              className="portfolio-title text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2"
            >
              {t('portfolio.section.title.start')}{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {t('portfolio.section.title.highlight')}
              </span>
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-100 max-w-2xl mx-auto">
              {t('portfolio.section.subtitle')}
            </p>
          </div>

          {/* 3D Carousel */}
          <div
            className="flex-1 relative max-h-[450px] md:max-h-[500px]"
            style={{ perspective: '1500px' }}
            role="region"
            aria-label={t('portfolio.carousel.label')}
          >
            <div
              ref={carouselRef}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {portfolio.map((project, index) => (
                <div
                  key={index}
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
                  <div className="bg-white dark:bg-gray-800/90 dark:backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl border border-gray-200 dark:border-white/20 transition-all duration-300 hover:border-purple-400 dark:hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20">
                    <div className="relative h-36 sm:h-40 md:h-48 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={t(project.titleKey)}
                        fill
                        sizes="320px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        quality={75}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
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
                      <p className="text-gray-700 dark:text-gray-100 mb-3 text-xs md:text-sm line-clamp-2">
                        {t(project.descriptionKey)}
                      </p>
                      <div className="flex flex-wrap gap-1.5 md:gap-2" role="list" aria-label="Technologies used">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            role="listitem"
                            className="px-2 md:px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-500/30 dark:to-purple-500/30 text-blue-600 dark:text-blue-200 rounded-full text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 z-50 shadow-lg"
              aria-label={t('portfolio.nav.previous')}
            >
              <ChevronLeft size={20} className="md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 z-50 shadow-lg"
              aria-label={t('portfolio.nav.next')}
            >
              <ChevronRight size={20} className="md:w-6 md:h-6" />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-4 md:mt-6 relative z-[60]" role="tablist" aria-label="Portfolio navigation">
            {portfolio.map((_, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={index === currentIndex}
                aria-controls={`project-${index}`}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlay(false);
                }}
                className={`h-2 md:h-3 rounded-full transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  index === currentIndex ? 'w-8 md:w-10' : 'w-2 md:w-3'
                }`}
                aria-label={`${t('portfolio.nav.goto')} ${index + 1}`}
              >
                <span
                  className={`block h-2 md:h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 md:w-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400'
                      : 'w-2 md:w-3 bg-gray-300 dark:bg-white/30'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8"
          onClick={closeProject}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div
            className="modal-content bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 rounded-2xl md:rounded-3xl w-full max-w-5xl border border-gray-200 dark:border-purple-500/30 shadow-2xl flex flex-col relative"
            style={{ maxHeight: 'calc(100vh - 2rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button
              onClick={closeProject}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm text-gray-900 dark:text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-20 shadow-lg"
              aria-label={t('portfolio.modal.close')}
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Layout adaptatif */}
            <div className="flex flex-col lg:flex-row h-full">
              {/* Zone média */}
              <div className="relative w-full lg:w-3/5 h-48 sm:h-64 lg:h-auto bg-gray-900 rounded-t-2xl lg:rounded-l-3xl lg:rounded-tr-none overflow-hidden flex-shrink-0">
                {gifLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500 animate-spin" />
                      <span className="text-white font-medium text-sm sm:text-base">
                        {t('portfolio.modal.loading')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Image statique */}
                <Image
                  src={selectedProject.image}
                  alt={t(selectedProject.titleKey)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className={`object-cover transition-opacity duration-500 ${
                    gifLoaded ? 'opacity-0' : 'opacity-100'
                  }`}
                  quality={85}
                  priority
                />

                {/* GIF */}
                {selectedProject.gifType === 'gif' && gifLoaded && (
                  <Image
                    src={selectedProject.gif}
                    alt={`${t(selectedProject.titleKey)} - Demo`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover animate-fadeIn"
                    unoptimized
                  />
                )}

                {/* WebM vidéo */}
                {selectedProject.gifType === 'webm' && (
                  <video
                    src={selectedProject.gif}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                      gifLoaded ? 'opacity-100' : 'opacity-0 absolute'
                    }`}
                    onLoadedData={() => {
                      setGifLoading(false);
                      setGifLoaded(true);
                    }}
                    onError={() => {
                      setGifLoading(false);
                      setGifLoaded(false);
                    }}
                  />
                )}
              </div>

              {/* Zone contenu */}
              <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
                <div>
                  <h3
                    id="modal-title"
                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4 pr-8"
                  >
                    {t(selectedProject.titleKey)}
                  </h3>
                  <p
                    id="modal-description"
                    className="text-gray-700 dark:text-gray-300 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 line-clamp-3 lg:line-clamp-none"
                  >
                    {t(selectedProject.descriptionKey)}
                  </p>

                  {/* Technologies */}
                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                      {t('portfolio.modal.technologies')}
                    </h4>
                    <div className="flex flex-wrap gap-2" role="list" aria-label="Project technologies">
                      {selectedProject.technologies.map((tech, index) => (
                        <span
                          key={index}
                          role="listitem"
                          className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium text-xs sm:text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bouton CTA */}
                {selectedProject.url && (
                  <button
                    onClick={handleViewProject}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-sm sm:text-base lg:text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    aria-label={`${t('portfolio.modal.view')} - ${t(selectedProject.titleKey)}`}
                  >
                    <ExternalLink size={18} className="sm:w-5 sm:h-5" />
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