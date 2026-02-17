'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/use-translation';

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

  const videoRef  = useRef<HTMLVideoElement>(null);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const { t }     = useTranslation();

  useEffect(() => { setMounted(true); }, []);

  // ─── Fade out then remove overlay + animate Hero ─────────────
  const dismiss = useCallback(() => {
    if (fading || !visible) return;

    // Stop video
    const v = videoRef.current;
    if (v) v.pause();

    // 1. Start CSS fade-out (1.5 s)
    setFading(true);

    // 2. After fade ends, remove overlay from DOM
    setTimeout(() => {
      setVisible(false);

      // 3. Émettre l'événement custom pour déclencher les animations du Hero
      window.dispatchEvent(new CustomEvent('hero:reveal'));

      // 4. Trigger legacy Hero animations (fallback)
      requestAnimationFrame(() => {
        document
          .querySelectorAll('.animate-on-scroll, .fade-up, .fade-left, .fade-right, .scale-up')
          .forEach((el) => el.classList.add('animate-in'));
      });
    }, 1500);
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
      if (v.duration) setProgress((v.currentTime / v.duration) * 100);
    };

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('ended', dismiss);

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
      v.removeEventListener('ended', dismiss);
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
        // The only fade: overlay opacity goes 1 → 0 over 1.5 s
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 1.5s ease' : 'none',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        muted
        playsInline
        preload="auto"
        poster="/assets/ampoulePoster.webp"
      >
        <source src="/assets/Idee.webm" type="video/webm" />
        <source src="/assets/Idee.mp4"  type="video/mp4"  />
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