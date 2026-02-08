'use client';

import React from 'react';
import { CustomCursor } from '@/components/services/custom-cursor';
import { ServicesHero } from '@/components/services/services-hero';
import { ServicesProcess } from '@/components/services/services-process';
import { ServicesPricing } from '@/components/services/services-pricing';
import { ServicesCTA } from '@/components/services/services-cta';

export function ServicesPageClient() {
  return (
    <div className="services-page-container min-h-screen bg-slate-950 overflow-x-hidden">
      <CustomCursor />
      <ServicesHero />
      <ServicesProcess />
      <ServicesPricing />
      <ServicesCTA />
    </div>
  );
}