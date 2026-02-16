'use client';

import React from 'react';
import Image from 'next/image';
import { Code, Bot, Brain, LucideIcon } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import type { TranslationKey } from '@/locales';

interface Service {
  icon: LucideIcon;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  color: string;
  screenshot: string;
}

const services: Service[] = [
  {
    icon: Code,
    titleKey: 'services.web.title',
    descKey: 'services.web.desc',
    color: 'from-blue-500 to-blue-600',
    screenshot: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  },
  {
    icon: Bot,
    titleKey: 'services.automation.title',
    descKey: 'services.automation.desc',
    color: 'from-purple-500 to-purple-600',
    screenshot: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
  },
  {
    icon: Brain,
    titleKey: 'services.ai.title',
    descKey: 'services.ai.desc',
    color: 'from-pink-500 to-pink-600',
    screenshot: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
  },
];

export function ServicesSection() {
  const { t } = useTranslation();

  return (
    <section className="section-snap bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 animate-on-scroll fade-up">
            {t('services.section.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-on-scroll fade-up delay-200">
            {t('services.section.subtitle')}
          </p>
        </div>

        {/* Grid de services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const direction = index % 2 === 0 ? 'fade-left' : 'fade-right';
            const delay = `delay-${(index + 1) * 100}`;
            
            return (
              <div
                key={service.titleKey}
                className={`service-card relative group animate-on-scroll ${direction} ${delay}`}
              >
                {/* Image de fond */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <Image
                    src={service.screenshot}
                    alt={t(service.titleKey)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                    quality={75}
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 backdrop-blur-sm" />
                </div>

                {/* Contenu de la carte */}
                <div className="relative p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-2xl transition-all duration-300 bg-white/50 dark:bg-gray-800/50">
                  {/* Icon */}
                  <div 
                    className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>

                  {/* Titre */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {t(service.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t(service.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}