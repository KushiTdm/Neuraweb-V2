'use client';

import React from 'react';
import Image from 'next/image';

interface AboutSectionProps {
  language?: 'fr' | 'en';
}

const technologies = [
  'React',
  'Node.js',
  'Python',
  'AWS',
  'MongoDB',
  'TypeScript',
  'Next.js',
  'PostgreSQL',
] as const;

export function AboutSection({ language = 'fr' }: AboutSectionProps) {
  // Traductions
  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      fr: {
        'about.title': 'À propos de NeuraWeb',
        'about.description': 'Nous sommes une équipe passionnée de développeurs et d\'experts en IA dédiés à transformer vos idées en solutions digitales innovantes. Notre approche combine expertise technique, créativité et engagement pour livrer des projets qui dépassent vos attentes.',
        'about.image.alt': 'Équipe NeuraWeb en collaboration',
        'about.stat.projects': 'Satisfaction client',
        'about.stat.support': 'Support disponible',
      },
      en: {
        'about.title': 'About NeuraWeb',
        'about.description': 'We are a passionate team of developers and AI experts dedicated to transforming your ideas into innovative digital solutions. Our approach combines technical expertise, creativity and commitment to deliver projects that exceed your expectations.',
        'about.image.alt': 'NeuraWeb team collaborating',
        'about.stat.projects': 'Client satisfaction',
        'about.stat.support': 'Support available',
      },
    };
    return translations[language][key] || key;
  };

  return (
    <section className="section-snap bg-white dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image avec decorations */}
          <div className="animate-on-scroll fade-left">
            <div className="relative">
              {/* Image principale */}
              <div className="relative rounded-3xl shadow-2xl overflow-hidden aspect-[7/5]">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&h=500&fit=crop"
                  alt={t('about.image.alt')}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
                  className="object-cover"
                  quality={85}
                  priority
                />
              </div>

              {/* Decoration rectangulaire */}
              <div 
                className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl -z-10"
                aria-hidden="true"
              />

              {/* Decoration circulaire */}
              <div 
                className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full -z-10 animate-pulse"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Contenu textuel */}
          <div className="animate-on-scroll fade-right">
            {/* Titre */}
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('about.title')}
            </h2>

            {/* Description */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {t('about.description')}
            </p>

            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div 
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl transform hover:scale-105 transition-transform cursor-default"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('about.stat.projects')}
                </div>
              </div>

              <div 
                className="text-center p-6 bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-900/30 dark:to-orange-900/30 rounded-2xl transform hover:scale-105 transition-transform cursor-default"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('about.stat.support')}
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-3" role="list" aria-label="Technologies utilisées">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  role="listitem"
                  className="px-5 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold transform hover:scale-110 transition-transform cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}