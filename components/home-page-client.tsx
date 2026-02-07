'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Import dynamique pour optimiser le chargement
const HeroSection = dynamic(() => import('@/components/sections/hero-section').then(mod => ({ default: mod.HeroSection })), {
  loading: () => <div className="min-h-screen animate-pulse bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800" />,
});

const VideoScrollSection = dynamic(() => import('@/components/sections/video-scroll-section').then(mod => ({ default: mod.VideoScrollSection })), {
  loading: () => <div className="min-h-screen animate-pulse bg-gray-100 dark:bg-gray-800" />,
});

const ServicesSection = dynamic(() => import('@/components/sections/services-section').then(mod => ({ default: mod.ServicesSection })));
const AboutSection = dynamic(() => import('@/components/sections/about-section').then(mod => ({ default: mod.AboutSection })));
const PortfolioSection = dynamic(() => import('@/components/sections/portfolio-section').then(mod => ({ default: mod.PortfolioSection })));
const TestimonialsSection = dynamic(() => import('@/components/sections/testimonials-section').then(mod => ({ default: mod.TestimonialsSection })));
const CTASection = dynamic(() => import('@/components/sections/cta-section').then(mod => ({ default: mod.CTASection })));

export function HomePageClient() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Évite les erreurs d'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll vers Hero après 5 secondes
  useEffect(() => {
    if (!mounted) return;

    let hasUserScrolled = false;

    const handleUserScroll = () => {
      hasUserScrolled = true;
    };

    // Écouter les événements de scroll
    window.addEventListener('scroll', handleUserScroll, { once: true });
    window.addEventListener('wheel', handleUserScroll, { once: true });
    window.addEventListener('touchmove', handleUserScroll, { once: true });

    const timer = setTimeout(() => {
      if (!hasUserScrolled && heroRef.current) {
        heroRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleUserScroll);
      window.removeEventListener('wheel', handleUserScroll);
      window.removeEventListener('touchmove', handleUserScroll);
    };
  }, [mounted]);

  // Mouse parallax effect
  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 50,
        y: (e.clientY / window.innerHeight - 0.5) * 50
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted]);

  // Intersection Observer pour les animations
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [mounted]);

  // Fonction pour scroller vers la section suivante
  const scrollToNextSection = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen animate-pulse bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800" />
    );
  }

  return (
    <div className="homepage-container">
      <VideoScrollSection />
      <div ref={heroRef}>
        <HeroSection mousePosition={mousePosition} onScrollToNext={scrollToNextSection} />
      </div>
      <div ref={servicesRef}>
        <ServicesSection />
      </div>
      <AboutSection />
      <PortfolioSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}