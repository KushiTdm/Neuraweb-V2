'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports pour code splitting
const VideoScrollSection = dynamic(
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

import { HeroSection } from '@/components/sections/hero-section';

export function HomePageClient() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [mounted]);

  const scrollToHero = () => {
    heroRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
        <div className="text-4xl font-bold text-gray-800 dark:text-white animate-pulse">NeuraWeb</div>
      </div>
    );
  }

  return (
    <main className="homepage-container">
      {/* 1. Video Hero Section (première chose visible) */}
      <VideoScrollSection />
      
      {/* 2. Hero Section avec texte et boutons */}
      <div ref={heroRef}>
        <HeroSection mousePosition={mousePosition} onScrollToNext={scrollToHero} />
      </div>
      
      {/* 3. Services Section */}
      <ServicesSection />
      
      {/* 4. About Section */}
      <AboutSection />
      
      {/* 5. Portfolio Section */}
      <PortfolioSection />
      
      {/* 6. Testimonials Section */}
      <TestimonialsSection />
      
      {/* 7. CTA Section */}
      <CTASection />
    </main>
  );
}