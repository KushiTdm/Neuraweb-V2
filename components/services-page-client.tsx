'use client';

import React, { useRef } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CustomCursor } from '@/components/services/custom-cursor';
import { ServicesHero } from '@/components/services/services-hero';
import { ServicesProcess } from '@/components/services/services-process';
import { ServicesPricing } from '@/components/services/services-pricing';
import { ServicesCTA } from '@/components/services/services-cta';
import { useLanguage } from '@/contexts/language-context';

export function ServicesPageClient() {
  const pricingRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Header />
      <div className="services-page-container min-h-screen bg-slate-950">
        <CustomCursor />
        <div className="overflow-x-hidden">
          <ServicesHero />
        </div>
        <ServicesProcess language={language} onScrollToPricing={scrollToPricing} />
        <div className="overflow-x-hidden">
          <ServicesPricing ref={pricingRef} language={language} />
          <ServicesCTA />
        </div>
      </div>
      <Footer />
    </>
  );
}
