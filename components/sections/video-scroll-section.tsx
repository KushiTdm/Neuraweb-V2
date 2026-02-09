'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-setup';

interface VideoScrollSectionProps {
  language?: 'fr' | 'en';
}

export function VideoScrollSection({ language = 'fr' }: VideoScrollSectionProps) {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayTextRef = useRef<HTMLDivElement>(null);

  // Traductions
  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      fr: {
        'video.title': 'Donnez vie à vos idées',
        'hero.scroll.discover': 'Découvrir',
      },
      en: {
        'video.title': 'Bring your ideas to life',
        'hero.scroll.discover': 'Discover',
      },
    };
    return translations[language][key] || key;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !sectionRef.current || !videoRef.current || !overlayTextRef.current) {
      return;
    }

    const video = videoRef.current;
    const section = sectionRef.current;
    const overlayText = overlayTextRef.current;

    // Attendre que la vidéo soit chargée
    const initAnimations = () => {
      // Créer une timeline GSAP
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      // Animations de la vidéo
      tl.fromTo(
        video,
        {
          scale: 0.5,
          borderRadius: '50px',
          opacity: 0.7,
        },
        {
          scale: 1,
          borderRadius: '0px',
          opacity: 1,
          duration: 1,
        }
      )
      .to(video, {
        scale: 1.1,
        duration: 1,
      });

      // Animations du texte en overlay
      if (overlayText.children.length >= 1) {
        tl.fromTo(
          overlayText.children[0],
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.3
        )
        .to(
          overlayText.children[0],
          { opacity: 0, y: -50, duration: 0.3 },
          1.2
        );
      }

      // Synchroniser la lecture de la vidéo avec le scroll
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          if (video.duration && !isNaN(video.duration)) {
            const progress = self.progress;
            video.currentTime = video.duration * progress;
          }
        },
      });
    };

    // Forcer le chargement de la vidéo
    video.load();
    
    // Initialiser après le chargement des métadonnées
    if (video.readyState >= 2) {
      initAnimations();
    } else {
      video.addEventListener('loadedmetadata', initAnimations, { once: true });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [mounted]);

  // Rendu initial pendant l'hydratation
  if (!mounted) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-white text-2xl">Chargement...</div>
      </section>
    );
  }

  return (
    <section 
      className="bg-black relative section-snap min-h-screen" 
      ref={sectionRef}
    >
      {/* Conteneur vidéo */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          poster="/assets/ampoulePoster.webp"
        >
          {/* Source principale */}
          <source src="/assets/Idee.webm" type="video/webm" />
          <source src="/assets/Idee.mp4" type="video/mp4" />

          {/* Sous-titres FR */}
          <track
            kind="captions"
            src="/assets/ampouleExplose_fr.vtt"
            srcLang="fr"
            label="Français"
            default={language === 'fr'}
          />

          {/* Sous-titres EN */}
          <track
            kind="captions"
            src="/assets/ampouleExplose_en.vtt"
            srcLang="en"
            label="English"
            default={language === 'en'}
          />
          
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      </div>

      {/* Texte overlay */}
      <div
        ref={overlayTextRef}
        className="relative z-10 text-center max-w-4xl px-6 pointer-events-none h-screen flex items-center justify-center"
      >
        <h2 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">
          {t('video.title')}
        </h2>
      </div>

      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center text-white animate-bounce">
          <span className="text-sm mb-2">{t('hero.scroll.discover')}</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}