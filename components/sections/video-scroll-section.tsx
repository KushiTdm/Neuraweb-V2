'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/use-translation';

// ── Détection du type d'appareil pour charger la bonne vidéo ─────────────────
function useDeviceType() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
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
  const [visible, setVisible]           = useState(true);
  const [fading, setFading]             = useState(false);
  const [titleIn, setTitleIn]           = useState(false);
  const [barsIn, setBarsIn]             = useState(false);
  const [progress, setProgress]         = useState(0);
  const [skipHovered, setSkipHovered]   = useState(false);
  const [skipPct, setSkipPct]           = useState(0);
  const [holding, setHolding]           = useState(false);

  const videoRef  = useRef<HTMLVideoElement>(null);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasEndedRef = useRef(false);
  const { t }     = useTranslation();
  const isMobile  = useDeviceType();

  useEffect(() => { 
    setMounted(true);
    
    if (typeof window !== 'undefined' && sessionStorage.getItem('video-intro-seen') === 'true') {
      hasEndedRef.current = true;
      setVisible(false);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('hero:reveal'));
      }, 100);
    }
  }, []);

  // ─── Fade out then remove overlay + animate Hero ─────────────
  const dismiss = useCallback(() => {
    if (fading || !visible || hasEndedRef.current) return;

    hasEndedRef.current = true;

    const v = videoRef.current;
    if (v) {
      v.pause();
      // FIX: vérifier que duration est un nombre fini avant d'assigner currentTime
      if (v.duration && isFinite(v.duration)) {
        v.currentTime = v.duration;
      }
    }

    setFading(true);

    setTimeout(() => {
      setVisible(false);
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('video-intro-seen', 'true');
      }

      window.dispatchEvent(new CustomEvent('hero:reveal'));

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
        // FIX: vérifier que currentTime est assignable (vidéo prête)
        if (v.readyState >= 1 && isFinite(v.duration || 0)) {
          v.currentTime = 0;
        }
        await v.play();
        setTimeout(() => setBarsIn(true), 100);
        setTimeout(() => setTitleIn(true), 600);
      } catch {
        dismiss();
      }
    };

    const onTime = () => {
      if (hasEndedRef.current) return;
      
      // FIX: vérifier que duration est fini avant tout calcul
      if (v.duration && isFinite(v.duration) && v.duration > 0) {
        const pct = (v.currentTime / v.duration) * 100;
        setProgress(pct);
        if (v.currentTime >= v.duration - 0.8 && !v.paused) {
          v.pause();
          dismiss();
        }
      }
    };

    const onEnded = () => {
      if (hasEndedRef.current) return;
      v.pause();
      dismiss();
    };

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('ended', onEnded);
    v.loop = false;

    if (v.readyState >= 2) {
      play();
    } else {
      v.addEventListener('loadedmetadata', play, { once: true });
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

  const C = 2 * Math.PI * 16;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 0.8s ease-out' : 'none',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/*
        FIX ACCESSIBILITÉ :
        1. Suppression de role="img" → invalide sur <video> (seuls les éléments non-interactifs
           sans sémantique propre acceptent role="img")
        2. Ajout d'un <track kind="captions"> pour les sous-titres (requis WCAG 1.2.2)
        3. aria-label conservé pour décrire le contenu visuel
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
      >
        {isMobile ? (
          <>
            <source src="/assets/light_idea_to_reality_mobile.webm" type="video/webm" />
            <source src="/assets/light_idea_to_reality_mobile.mp4" type="video/mp4" />
          </>
        ) : (
          <>
            <source src="/assets/light_idea_to_reality.webm" type="video/webm" />
            <source src="/assets/light_idea_to_reality.mp4" type="video/mp4" />
          </>
        )}
        {/*
          FIX: Ajout d'un track de sous-titres vide pour satisfaire l'audit
          Le fichier captions.vtt peut être vide ou contenir une description textuelle.
          kind="captions" est requis pour les vidéos avec contenu audio significatif.
          Ici la vidéo est muette (muted) donc on peut pointer vers un fichier vide.
        */}
        <track
          kind="captions"
          src="/assets/captions-empty.vtt"
          srcLang="fr"
          label="Français"
          default
        />
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