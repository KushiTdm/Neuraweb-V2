'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/use-translation';

// ── Détection du type d'appareil pour charger la bonne vidéo ─────────────────
function useDeviceType() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Détecter mobile via matchMedia et connection
    const checkMobile = () => {
      const mobileQuery = window.matchMedia('(max-width: 768px)').matches;
      const conn = (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
      const slowConnection = conn?.effectiveType === '2g' || conn?.effectiveType === 'slow-2g';
      const saveData = conn?.saveData === true;
      return mobileQuery || slowConnection || saveData;
    };
    setIsMobile(checkMobile());
  }, []);
  
  return isMobile;
}

export function VideoScrollSection() {
  const [mounted, setMounted]           = useState(false);
  const [visible, setVisible]           = useState(true);   // controls overlay presence in DOM
  const [fading, setFading]             = useState(false);  // triggers CSS fade-out
  const [titleIn, setTitleIn]           = useState(false);  // title entrance
  const [barsIn, setBarsIn]             = useState(false);  // letterbox bars entrance
  const [progress, setProgress]         = useState(0);
  const [skipHovered, setSkipHovered]   = useState(false);
  const [skipPct, setSkipPct]           = useState(0);
  const [holding, setHolding]           = useState(false);
  const [videoLoaded, setVideoLoaded]   = useState(false);  // vidéo prête à jouer

  const videoRef  = useRef<HTMLVideoElement>(null);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasEndedRef = useRef(false);  // empêche la vidéo de rejouer (ref pour éviter les re-rendus)
  const { t }     = useTranslation();
  const isMobile  = useDeviceType();

  useEffect(() => { 
    setMounted(true);
    
    // Vérifier si la vidéo a déjà été vue dans cette session
    if (typeof window !== 'undefined' && sessionStorage.getItem('video-intro-seen') === 'true') {
      hasEndedRef.current = true;
      setVisible(false);
      // Déclencher les animations du Hero immédiatement
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('hero:reveal'));
      }, 100);
    }
  }, []);

  // ─── Fade out then remove overlay + animate Hero ─────────────
  const dismiss = useCallback(() => {
    if (fading || !visible || hasEndedRef.current) return;

    // Marquer comme terminé pour empêcher toute relecture
    hasEndedRef.current = true;

    // Stop video immediately
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = v.duration; // Aller à la fin pour éviter tout restart
    }

    // 1. Start CSS fade-out (0.8s - plus rapide)
    setFading(true);

    // 2. After fade ends, remove overlay from DOM
    setTimeout(() => {
      setVisible(false);
      
      // Sauvegarder que la vidéo a été vue dans cette session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('video-intro-seen', 'true');
      }

      // 3. Émettre l'événement custom pour déclencher les animations du Hero
      window.dispatchEvent(new CustomEvent('hero:reveal'));

      // 4. Trigger legacy Hero animations (fallback)
      requestAnimationFrame(() => {
        document
          .querySelectorAll('.animate-on-scroll, .fade-up, .fade-left, .fade-right, .scale-up')
          .forEach((el) => el.classList.add('animate-in'));
      });
    }, 800);
  }, [fading, visible]);

  // ─── Hold-to-skip ────────────────────────────────────────────
  const startHold = useCallback(() => {
    if (fading) return;
    setHolding(true);
    setSkipPct(0);
    let elapsed = 0;
    holdTimer.current = setInterval(() => {
      elapsed += 50;
      const pct = Math.min((elapsed / 1500) * 100, 100);
      setSkipPct(pct);
      if (pct >= 100) {
        clearInterval(holdTimer.current!);
        setHolding(false);
        setSkipPct(0);
        dismiss();
      }
    }, 50);
  }, [fading, dismiss]);

  const cancelHold = useCallback(() => {
    if (holdTimer.current) clearInterval(holdTimer.current);
    setHolding(false);
    setSkipPct(0);
  }, []);

  // ─── Video init ──────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    const v = videoRef.current;
    if (!v) return;

    const play = async () => {
      try {
        v.currentTime = 0;
        await v.play();
        // Bars slide in, then title fades in
        setTimeout(() => setBarsIn(true), 100);
        setTimeout(() => setTitleIn(true), 600);
      } catch {
        dismiss();
      }
    };

    const onTime = () => {
      // Si déjà terminé, ignorer
      if (hasEndedRef.current) return;
      
      if (v.duration) {
        const pct = (v.currentTime / v.duration) * 100;
        setProgress(pct);
        // Arrêter la vidéo 800ms avant la fin pour éviter qu'elle ne boucle
        if (v.currentTime >= v.duration - 0.8 && !v.paused) {
          v.pause();
          dismiss();
        }
      }
    };

    // Empêcher la vidéo de rejouer
    const onEnded = () => {
      if (hasEndedRef.current) return;
      v.pause();
      dismiss();
    };

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('ended', onEnded);
    // Empêcher le loop
    v.loop = false;

    if (v.readyState >= 2) {
      play();
    } else {
      v.addEventListener('loadedmetadata', play, { once: true });
      // Fallback if video never loads
      const fb = setTimeout(dismiss, 4000);
      v.addEventListener('loadedmetadata', () => clearTimeout(fb), { once: true });
    }

    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('ended', onEnded);
      if (holdTimer.current) clearInterval(holdTimer.current);
    };
  }, [mounted, dismiss]);

  if (!mounted || !visible) return null;

  const C = 2 * Math.PI * 16; // SVG circle circumference

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        // Fade-out rapide (0.8s) pour transition fluide
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 0.8s ease-out' : 'none',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* VIDEO — Ampoule qui s'allime puis explose, représentant l'idée qui émerge */}
      {/* 
          Optimisations de chargement :
          - preload="metadata" : ne charge que les métadonnées au début
          - poster : affiche une image pendant le chargement
          - sources responsive : mobile (640x360) vs desktop (1280x720)
          - WebM en premier (plus léger) puis MP4 (fallback)
      */}
      <video
        ref={videoRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        muted
        playsInline
        preload="metadata"
        poster="/assets/ampoulePoster.webp"
        title="Animation d'une ampoule qui s'allume puis explose, symbolisant l'idée qui émerge - NeuraWeb"
        aria-label="Animation d'introduction : une ampoule s'allume puis explose en illuminant l'espace, représentant le processus créatif et l'émergence d'une idée innovante"
        role="img"
      >
        {isMobile ? (
          <>
            {/* Mobile : 640x360 - ultra léger (~300-400KB) */}
            <source src="/assets/light_idea_to_reality_mobile.webm" type="video/webm" />
            <source src="/assets/light_idea_to_reality_mobile.mp4" type="video/mp4" />
          </>
        ) : (
          <>
            {/* Desktop : 1280x720 - haute qualité (~800KB-1MB) */}
            <source src="/assets/light_idea_to_reality.webm" type="video/webm" />
            <source src="/assets/light_idea_to_reality.mp4" type="video/mp4" />
          </>
        )}
      </video>
      {/* LETTERBOX TOP */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '7vh',
        background: '#000', zIndex: 10,
        transform: barsIn ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.9s cubic-bezier(0.4,0,0.2,1)',
      }} />
      {/* LETTERBOX BOTTOM */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '7vh',
        background: '#000', zIndex: 10,
        transform: barsIn ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.9s cubic-bezier(0.4,0,0.2,1)',
      }} />

      {/* VIGNETTE */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 11, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
      }} />

      {/* TITLE */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', 'Garamond', serif",
          fontSize: 'clamp(1.8rem, 5vw, 4.5rem)',
          fontWeight: 300,
          color: '#fff',
          textAlign: 'center',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          textShadow: '0 2px 40px rgba(0,0,0,0.9)',
          userSelect: 'none',
          margin: 0,
          opacity: titleIn ? 1 : 0,
          transform: titleIn ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 1.2s ease, transform 1.2s ease',
        }}>
          {t('video.title')}
        </h2>
      </div>

      {/* PROGRESS BAR */}
      <div style={{
        position: 'absolute', bottom: '7vh', left: 0, right: 0,
        zIndex: 30, padding: '0 2rem', pointerEvents: 'none',
      }}>
        <div style={{
          width: '100%', height: '1px',
          background: 'rgba(255,255,255,0.15)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: '0 auto 0 0',
            background: 'rgba(255,255,255,0.55)',
            width: `${progress}%`,
            transition: 'width 0.3s linear',
          }} />
        </div>
      </div>

      {/* SKIP BUTTON */}
      <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 40 }}>
        <button
          aria-label="Passer l'introduction"
          onMouseEnter={() => setSkipHovered(true)}
          onMouseLeave={() => { setSkipHovered(false); cancelHold(); }}
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onTouchStart={(e) => { e.preventDefault(); startHold(); }}
          onTouchEnd={() => cancelHold()}
          onClick={() => { if (!holding && !fading) dismiss(); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, userSelect: 'none',
          }}
        >
          {/* Ring SVG */}
          <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
            <svg
              style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
              width="40" height="40" viewBox="0 0 40 40"
            >
              <circle cx="20" cy="20" r="16" fill="none"
                stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <circle cx="20" cy="20" r="16" fill="none"
                stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C - (C * skipPct) / 100}
                style={{ transition: holding ? 'none' : 'stroke-dashoffset 0.1s' }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{
                  color: '#fff',
                  transform: skipHovered ? 'translateX(2px)' : 'translateX(0)',
                  transition: 'transform 0.2s ease',
                }}>
                <path d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {/* Label */}
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '0.68rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', fontWeight: 300,
            color: '#fff', whiteSpace: 'nowrap',
            opacity: skipHovered || holding ? 1 : 0.55,
            transition: 'opacity 0.25s ease',
          }}>
            {holding ? 'Patienter…' : 'Passer'}
          </span>
        </button>
      </div>
    </div>
  );
}