'use client';

import React from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CustomCursor } from '@/components/services/custom-cursor';
import { ServicesHero } from '@/components/services/services-hero';
import { ServicesProcess } from '@/components/services/services-process';
import { ServicesPricing } from '@/components/services/services-pricing';
import { ServicesCTA } from '@/components/services/services-cta';

export function ServicesPageClient() {
  return (
    <>
      <Header />
      <div className="services-page-container min-h-screen bg-slate-950">
        <CustomCursor />
        <div className="overflow-x-hidden">
          <ServicesHero />
        </div>
        <ServicesProcess />
        <div className="overflow-x-hidden">
          <ServicesPricing />
          <ServicesCTA />
        </div>
      </div>
      <Footer />
    </>
  );
}