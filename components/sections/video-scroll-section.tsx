'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-setup';
import { useTranslation } from '@/hooks/use-translation';

export function VideoScrollSection() {
  const [mounted, setMounted] = useState(false);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayTextRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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

    const initVideo = async () => {
      try {
        window.scrollTo(0, 0);
        video.currentTime = 0;
        await video.play();
        
        if (overlayText.children.length >= 1) {
          gsap.fromTo(
            overlayText.children[0],
            { opacity: 0, y: 50, scale: 0.8 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power2.out', delay: 0.5 }
          );
          
          gsap.to(
            overlayText.children[0],
            { opacity: 0, y: -50, scale: 0.8, duration: 0.8, delay: video.duration - 1.5 }
          );
        }

        video.addEventListener('ended', () => {
          setVideoPlayed(true);
          const nextSection = section.nextElementSibling;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, { once: true });

      } catch (error) {
        console.error('Erreur lecture vidéo:', error);
        setTimeout(() => {
          const nextSection = section.nextElementSibling;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    };

    if (video.readyState >= 2) {
      initVideo();
    } else {
      video.addEventListener('loadedmetadata', initVideo, { once: true });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-white text-2xl">Chargement...</div>
      </section>
    );
  }

  return (
    <section 
      className="bg-black relative min-h-screen flex items-center justify-center" 
      ref={sectionRef}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          poster="/assets/ampoulePoster.webp"
        >
          <source src="/assets/Idee.webm" type="video/webm" />
          <source src="/assets/Idee.mp4" type="video/mp4" />
          <track
            kind="captions"
            src="/assets/ampouleExplose_fr.vtt"
            srcLang="fr"
            label="Français"
          />
          <track
            kind="captions"
            src="/assets/ampouleExplose_en.vtt"
            srcLang="en"
            label="English"
          />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      </div>

      <div
        ref={overlayTextRef}
        className="relative z-10 text-center max-w-4xl px-6 pointer-events-none"
      >
        <h2 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">
          {t('video.title')}
        </h2>
      </div>
    </section>
  );
}