'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap-setup';
import { MessageCircle, ArrowRight } from 'lucide-react';

interface ServicesCTAProps {
  language?: 'fr' | 'en';
}

export function ServicesCTA({ language = 'fr' }: ServicesCTAProps) {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      fr: {
        'servicePage.cta.title.word1': 'Prêt',
        'servicePage.cta.title.word2': 'à',
        'servicePage.cta.title.word3': 'lancer',
        'servicePage.cta.title.word4': 'votre',
        'servicePage.cta.title.word5': 'projet',
        'servicePage.cta.title.word6': 'avec',
        'servicePage.cta.title.word7': 'nous ?',
        'servicePage.cta.subtitle': 'Discutons de vos objectifs et transformons votre vision en réalité',
        'servicePage.cta.button': 'Demander un devis',
        'servicePage.cta.feature1': 'Réponse sous 24h',
        'servicePage.cta.feature2': 'Devis gratuit',
        'servicePage.cta.feature3': 'Sans engagement',
      },
      en: {
        'servicePage.cta.title.word1': 'Ready',
        'servicePage.cta.title.word2': 'to',
        'servicePage.cta.title.word3': 'launch',
        'servicePage.cta.title.word4': 'your',
        'servicePage.cta.title.word5': 'project',
        'servicePage.cta.title.word6': 'with us?',
        'servicePage.cta.subtitle': 'Let\'s discuss your goals and turn your vision into reality',
        'servicePage.cta.button': 'Request a quote',
        'servicePage.cta.feature1': 'Response within 24h',
        'servicePage.cta.feature2': 'Free quote',
        'servicePage.cta.feature3': 'No commitment',
      },
    };
    return translations[language][key] || key;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const ctx = gsap.context(() => {
      const splitTitle = titleRef.current?.querySelectorAll('.word');
      if (splitTitle) {
        gsap.from(splitTitle, {
          y: 100,
          opacity: 0,
          rotateX: -90,
          stagger: 0.1,
          duration: 1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      gsap.from(buttonRef.current, {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: buttonRef.current,
          start: 'top 85%',
          end: 'bottom 60%',
          toggleActions: 'play none none reverse',
        },
      });

      if (particlesRef.current) {
        const particles = particlesRef.current.children;
        Array.from(particles).forEach((particle) => {
          gsap.to(particle, {
            y: `+=${Math.random() * 100 - 50}`,
            x: `+=${Math.random() * 100 - 50}`,
            opacity: Math.random() * 0.5 + 0.3,
            duration: Math.random() * 3 + 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [mounted]);

  const handleButtonHover = (isHovering: boolean) => {
    if (!buttonRef.current) return;
    
    gsap.to(buttonRef.current, {
      scale: isHovering ? 1.1 : 1,
      boxShadow: isHovering
        ? '0 20px 60px rgba(139, 92, 246, 0.6)'
        : '0 10px 40px rgba(139, 92, 246, 0.3)',
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const titleWords = language === 'fr' ? 7 : 6;

  if (!mounted) {
    return (
      <section className="relative py-32 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <h2 className="text-5xl md:text-7xl font-bold mb-12 text-white">
            {t('servicePage.cta.title.word1')} {t('servicePage.cta.title.word2')}{' '}
            {t('servicePage.cta.title.word3')}
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950"
    >
      {/* Particules */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-radial from-violet-600/20 via-transparent to-transparent" />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <MessageCircle className="w-20 h-20 mx-auto mb-8 text-violet-400 animate-pulse" />

        <h2 ref={titleRef} className="text-5xl md:text-7xl font-bold mb-12 leading-tight text-white">
          <span className="word inline-block mr-4">{t('servicePage.cta.title.word1')}</span>
          <span className="word inline-block mr-4">{t('servicePage.cta.title.word2')}</span>
          <span className="word inline-block mr-4">{t('servicePage.cta.title.word3')}</span>
          <span className="word inline-block mr-4">{t('servicePage.cta.title.word4')}</span>
          <span className="word inline-block mr-4">{t('servicePage.cta.title.word5')}</span>
          {titleWords === 7 ? (
            <>
              <span className="word inline-block mr-4">{t('servicePage.cta.title.word6')}</span>
              <span className="word inline-block bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {t('servicePage.cta.title.word7')}
              </span>
            </>
          ) : (
            <span className="word inline-block bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {t('servicePage.cta.title.word6')}
            </span>
          )}
        </h2>

        <p className="text-xl mb-16 max-w-2xl mx-auto text-white/70">
          {t('servicePage.cta.subtitle')}
        </p>

        <Link
          href="/quote"
          ref={buttonRef}
          onMouseEnter={() => handleButtonHover(true)}
          onMouseLeave={() => handleButtonHover(false)}
          className="group inline-block relative px-12 py-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3">
            {t('servicePage.cta.button')}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        <div className="mt-16 flex justify-center gap-8 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>{t('servicePage.cta.feature1')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>{t('servicePage.cta.feature2')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span>{t('servicePage.cta.feature3')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}