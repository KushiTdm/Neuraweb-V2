'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/hero-section';
import { StatsSection } from '@/components/sections/stats-section';
import { ReviewsBadge } from '@/components/reviews-badge';
import { AuditCTA } from '@/components/audit-cta';

// Section skeleton — affiché pendant le chargement des sections dynamiques
function SectionSkeleton() {
  return (
    <div className="section-snap flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 py-20 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/3 mx-auto" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

const VideoOverlay = dynamic(
  () => import('@/components/sections/video-scroll-section').then((mod) => {
    const C = mod.VideoScrollSection as React.ComponentType;
    return { default: C };
  }),
  { ssr: false }
);

const ServicesSection = dynamic(
  () => import('@/components/sections/services-section').then((mod) => ({ default: mod.ServicesSection })),
  { loading: () => <SectionSkeleton /> }
);
const AboutSection = dynamic(
  () => import('@/components/sections/about-section').then((mod) => ({ default: mod.AboutSection })),
  { loading: () => <SectionSkeleton /> }
);
const PortfolioSection = dynamic(
  () => import('@/components/sections/portfolio-section').then((mod) => ({ default: mod.PortfolioSection })),
  { loading: () => <SectionSkeleton /> }
);
const TestimonialsSection = dynamic(
  () => import('@/components/sections/testimonials-section').then((mod) => ({ default: mod.TestimonialsSection })),
  { loading: () => <SectionSkeleton /> }
);
const CTASection = dynamic(
  () => import('@/components/sections/cta-section').then((mod) => ({ default: mod.CTASection })),
  { loading: () => <SectionSkeleton /> }
);

export function HomePageClient() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const servicesRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useRef(false);

  // Mousemove parallax — désactivé sur touch/mobile pour économiser les ressources
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isTouchDevice.current) return;
    setMousePosition({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20,
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    // Détecter si l'appareil est tactile
    isTouchDevice.current = window.matchMedia('(hover: none)').matches;

    if (!isTouchDevice.current) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  // IntersectionObserver pour les animations d'entrée au scroll
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // Désobserver après animation pour économiser les ressources
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );

    const elements = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-up');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted]);

  const scrollToServices = useCallback(() => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (!mounted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#050510' }}
        aria-label="Chargement de NeuraWeb"
      >
        <div className="text-4xl font-bold text-white animate-pulse" aria-hidden="true">
          NeuraWeb
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Video intro fixed overlay — fades out, reveals the page underneath */}
      <VideoOverlay />

      <main id="main-content" className="homepage-container">
        <HeroSection mousePosition={mousePosition} onScrollToNext={scrollToServices} />

        <div ref={servicesRef}>
          <ServicesSection />
        </div>

        {/* Stats Section — Chiffres clés */}
        <StatsSection />

        {/* Reviews Badge — Preuve sociale */}
        <ReviewsBadge />

        <AboutSection />
        <PortfolioSection />
        <TestimonialsSection />

        {/* Audit CTA — Offre d'entrée gratuite */}
        <AuditCTA />

        <CTASection />
      </main>
    </>
  );
}
