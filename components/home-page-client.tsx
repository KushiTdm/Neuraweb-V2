'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/hero-section';
import { StatsSection } from '@/components/sections/stats-section';
import { PartnersMarquee } from '@/components/sections/partners-marquee';
import { AuditCTA } from '@/components/audit-cta';

// Section skeleton — affiché pendant le chargement des sections dynamiques
function SectionSkeleton() {
  return (
    <div className="flex items-center justify-center bg-white py-24">
      <div className="w-full max-w-7xl mx-auto px-6 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-100 rounded-xl w-1/3" />
        <div className="h-4 bg-gray-100 rounded-lg w-2/3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// VideoOverlay : ssr:false car elle lit sessionStorage + joue une vidéo.
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
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // IntersectionObserver pour les animations fade-up au scroll
  useEffect(() => {
    if (!mounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
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

  return (
    <>
      {/* Vidéo intro premier passage */}
      <VideoOverlay />

      <main id="main-content">
        {/* 1. Hero — slider image, cross-fade, ken-burns */}
        <HeroSection onScrollToNext={scrollToServices} />

        {/* 2. Partenaires / stack tech — marquee infini */}
        <PartnersMarquee />

        {/* 3. Services — cartes image + icône flottante, slider */}
        <div ref={servicesRef}>
          <ServicesSection />
        </div>

        {/* 4. Stats — chiffres métalliques chrome, count-up */}
        <StatsSection />

        {/* 5. About */}
        <AboutSection />

        {/* 6. Portfolio */}
        <PortfolioSection />

        {/* 7. Témoignages */}
        <TestimonialsSection />

        {/* 8. Audit CTA */}
        <AuditCTA />

        {/* 9. CTA final */}
        <CTASection />
      </main>
    </>
  );
}
