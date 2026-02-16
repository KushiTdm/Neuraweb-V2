'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/sections/hero-section';

const VideoOverlay = dynamic(
  () => import('@/components/sections/video-scroll-section').then((mod) => ({ default: mod.VideoScrollSection })),
  { ssr: false }
);

const ServicesSection = dynamic(
  () => import('@/components/sections/services-section').then((mod) => ({ default: mod.ServicesSection }))
);
const AboutSection = dynamic(
  () => import('@/components/sections/about-section').then((mod) => ({ default: mod.AboutSection }))
);
const PortfolioSection = dynamic(
  () => import('@/components/sections/portfolio-section').then((mod) => ({ default: mod.PortfolioSection }))
);
const TestimonialsSection = dynamic(
  () => import('@/components/sections/testimonials-section').then((mod) => ({ default: mod.TestimonialsSection }))
);
const CTASection = dynamic(
  () => import('@/components/sections/cta-section').then((mod) => ({ default: mod.CTASection }))
);

export function HomePageClient() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate-in');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const elements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted]);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
        <div className="text-4xl font-bold text-gray-800 dark:text-white animate-pulse">NeuraWeb</div>
      </div>
    );
  }

  return (
    <>
      {/* Video intro fixed overlay — fades out, reveals the page underneath */}
      <VideoOverlay />

      <main className="homepage-container">
        <HeroSection mousePosition={mousePosition} onScrollToNext={scrollToServices} />

        <div ref={servicesRef}>
          <ServicesSection />
        </div>

        <AboutSection />
        <PortfolioSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </>
  );
}