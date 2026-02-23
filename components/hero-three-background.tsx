'use client';

import { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  size: number;
  cluster: number;
  hue: number;
}

interface Pulse {
  connIdx: number;
  t: number;
  speed: number;
  hue: number;
}

// Performance constants - réduits pour alléger le thread principal
const NODE_COUNT = 60; // Réduit de 120 à 60
const STAR_COUNT = 80; // Réduit de 200 à 80
const PULSE_COUNT = 25; // Réduit de 60 à 25
const MAX_DIST = 0.18;

export function HeroThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIdRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { 
      alpha: false, // Optimisation: pas de transparence nécessaire
      desynchronized: true // Utilise le GPU quand disponible
    });
    if (!ctx) return;

    // ─── Resize avec debounce ─────────────────────────────────────
    let resizeTimeout: NodeJS.Timeout;
    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Réduire la résolution sur mobile pour améliorer les performances
        const dpr = window.innerWidth < 768 ? 1 : Math.min(window.devicePixelRatio, 2);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.scale(dpr, dpr);
      }, 100);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    // ─── Clusters ────────────────────────────────────────────────
    const clusterHues = [220, 260, 200, 240, 280, 210];
    const clusterCenters = [
      { x: 0.2, y: 0.3 },
      { x: 0.8, y: 0.6 },
      { x: 0.5, y: 0.8 },
      { x: 0.15, y: 0.65 },
      { x: 0.75, y: 0.25 },
      { x: 0.45, y: 0.15 },
    ];
    const getClusterCenter = (cluster: number) => clusterCenters[cluster] || clusterCenters[0];

    // ─── Nodes - pré-alloués pour éviter les allocations ───────────
    const nodes: Node[] = new Array(NODE_COUNT);
    for (let i = 0; i < NODE_COUNT; i++) {
      const cluster = i % 6;
      const center = getClusterCenter(cluster);
      const spread = 0.12;
      nodes[i] = {
        x: center.x + (Math.random() - 0.5) * spread,
        y: center.y + (Math.random() - 0.5) * spread,
        vx: (Math.random() - 0.5) * 0.0002,
        vy: (Math.random() - 0.5) * 0.0002,
        phase: Math.random() * Math.PI * 2,
        size: 2 + Math.random() * 3,
        cluster,
        hue: clusterHues[cluster],
      };
    }

    // ─── Connections - pré-calculées ──────────────────────────────
    const connections: { a: number; b: number }[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const sameCluster = nodes[i].cluster === nodes[j].cluster;
          if (sameCluster ? Math.random() < 0.5 : Math.random() < 0.1) {
            connections.push({ a: i, b: j });
          }
        }
      }
    }

    // ─── Pulses ───────────────────────────────────────────────────
    const pulses: Pulse[] = new Array(PULSE_COUNT);
    for (let i = 0; i < PULSE_COUNT; i++) {
      pulses[i] = {
        connIdx: Math.floor(Math.random() * connections.length),
        t: Math.random(),
        speed: 0.003 + Math.random() * 0.006,
        hue: 200 + Math.random() * 80,
      };
    }

    // ─── Stars - pré-calculés ─────────────────────────────────────
    const stars = new Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      stars[i] = {
        x: Math.random(),
        y: Math.random(),
        r: 0.3 + Math.random() * 0.8,
        alpha: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      };
    }

    // ─── Mouse avec throttle ──────────────────────────────────────
    let mouseX = 0.5;
    let mouseY = 0.5;
    let mouseMoved = false;
    
    const onMouseMove = (e: MouseEvent) => {
      if (!mouseMoved) {
        mouseMoved = true;
        requestAnimationFrame(() => {
          mouseX = e.clientX / window.innerWidth;
          mouseY = e.clientY / window.innerHeight;
          mouseMoved = false;
        });
      }
    };
    
    // Ne pas écouter la souris sur mobile
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    // ─── Visibility Observer - pause quand non visible ────────────
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    visibilityObserver.observe(canvas);

    // ─── Animation avec frame skipping ────────────────────────────
    let time = 0;
    let lastTs = 0;
    let frameCount = 0;

    const animate = (ts: number) => {
      frameIdRef.current = requestAnimationFrame(animate);

      // Skip frame si pas visible ou si on est sur mobile avec batterie faible
      if (!isVisible) return;

      // Sur mobile, réduire à 30fps
      const targetDelta = window.innerWidth < 768 ? 0.033 : 0.016;
      const delta = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : targetDelta;
      
      // Frame skipping pour maintenir les performances
      if (delta < targetDelta * 0.8) return;
      
      lastTs = ts;
      time += delta;
      frameCount++;

      const w = W();
      const h = H();

      // Background
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, w, h);

      // ── Stars - rendu optimisé ──
      // Ne mettre à jour les stars que toutes les 2 frames
      if (frameCount % 2 === 0) {
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          const alpha = s.alpha * (0.5 + 0.5 * Math.sin(time * 0.8 + s.phase));
          ctx.beginPath();
          ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(150,170,220,${alpha.toFixed(2)})`;
          ctx.fill();
        }
      }

      // Update nodes - optimisé
      const time04 = time * 0.4;
      const time035 = time * 0.35;
      const sinTime = Math.sin(time04);
      const cosTime = Math.cos(time035);
      
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const center = getClusterCenter(n.cluster);
        
        n.x += n.vx + Math.sin(time04 + n.phase) * 0.00008;
        n.y += n.vy + Math.cos(time035 + n.phase * 1.3) * 0.00008;

        const dx = n.x - center.x;
        const dy = n.y - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.15) {
          n.vx -= dx * 0.00005;
          n.vy -= dy * 0.00005;
        }
        n.vx *= 0.999;
        n.vy *= 0.999;

        n.vx += (mouseX - n.x) * 0.000005;
        n.vy += (mouseY - n.y) * 0.000005;
      }

      // ── Connections - rendu groupé ──
      ctx.lineWidth = 0.5;
      for (let i = 0; i < connections.length; i++) {
        const conn = connections[i];
        const na = nodes[conn.a];
        const nb = nodes[conn.b];
        const dx = na.x - nb.x;
        const dy = na.y - nb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = Math.max(0, (MAX_DIST - dist) / MAX_DIST) * 0.3;

        ctx.beginPath();
        ctx.moveTo(na.x * w, na.y * h);
        ctx.lineTo(nb.x * w, nb.y * h);
        ctx.strokeStyle = `hsla(${(na.hue + nb.hue) >> 1},70%,50%,${alpha.toFixed(2)})`;
        ctx.stroke();
      }

      // ── Nodes (neurones) - rendu optimisé ──
      const time25 = time * 2.5;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const pulse = Math.sin(time25 + n.phase) * 0.5 + 0.5;
        const lightness = 50 + pulse * 20;
        const alpha = 0.6 + pulse * 0.4;
        const r = n.size * (1 + pulse * 0.5);
        const nx = n.x * w;
        const ny = n.y * h;
        const r4 = r * 4;

        // Glow - simplifié
        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, r4);
        grad.addColorStop(0, `hsla(${n.hue + pulse * 20},85%,${lightness}%,${alpha.toFixed(2)})`);
        grad.addColorStop(0.4, `hsla(${n.hue},70%,50%,${(alpha * 0.4).toFixed(2)})`);
        grad.addColorStop(1, 'hsla(0,0%,0%,0)');

        ctx.beginPath();
        ctx.arc(nx, ny, r4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue + pulse * 20},90%,${lightness + 10}%,${alpha.toFixed(2)})`;
        ctx.fill();
      }

      // ── Pulses synaptiques - rendu optimisé ──
      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t > 1) {
          p.t = 0;
          p.connIdx = Math.floor(Math.random() * connections.length);
          p.hue = 200 + Math.random() * 80;
        }

        const conn = connections[p.connIdx];
        if (!conn) continue;
        const na = nodes[conn.a];
        const nb = nodes[conn.b];

        const px = (na.x + (nb.x - na.x) * p.t) * w;
        const py = (na.y + (nb.y - na.y) * p.t) * h;
        const taper = Math.sin(p.t * Math.PI);
        const pr = 2 + taper * 3;
        const pr3 = pr * 3;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, pr3);
        grad.addColorStop(0, `hsla(${p.hue},100%,80%,0.95)`);
        grad.addColorStop(0.5, `hsla(${p.hue},100%,60%,0.4)`);
        grad.addColorStop(1, 'hsla(0,0%,0%,0)');

        ctx.beginPath();
        ctx.arc(px, py, pr3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    // Démarrer l'animation avec requestIdleCallback si disponible
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => animate(0));
    } else {
      animate(0);
    }

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', resize);
      if (!isTouchDevice) window.removeEventListener('mousemove', onMouseMove);
      visibilityObserver.disconnect();
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, [isVisible]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        display: 'block',
      }}
    />
  );
}
