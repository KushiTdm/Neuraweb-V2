'use client';

import { useEffect, useRef } from 'react';

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

export function HeroThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIdRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ─── Resize ──────────────────────────────────────────────────
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    // ─── Clusters ────────────────────────────────────────────────
    const clusterHues = [220, 260, 200, 240, 280, 210];
    const getClusterCenter = (cluster: number) => {
      const centers = [
        { x: 0.2, y: 0.3 },
        { x: 0.8, y: 0.6 },
        { x: 0.5, y: 0.8 },
        { x: 0.15, y: 0.65 },
        { x: 0.75, y: 0.25 },
        { x: 0.45, y: 0.15 },
      ];
      return centers[cluster];
    };

    // ─── Nodes ───────────────────────────────────────────────────
    const NODE_COUNT = 120;
    const nodes: Node[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      const cluster = i % 6;
      const center = getClusterCenter(cluster);
      const spread = 0.12;
      nodes.push({
        x: center.x + (Math.random() - 0.5) * spread,
        y: center.y + (Math.random() - 0.5) * spread,
        vx: (Math.random() - 0.5) * 0.0002,
        vy: (Math.random() - 0.5) * 0.0002,
        phase: Math.random() * Math.PI * 2,
        size: 2 + Math.random() * 3,
        cluster,
        hue: clusterHues[cluster],
      });
    }

    // ─── Connections ─────────────────────────────────────────────
    const connections: { a: number; b: number }[] = [];
    const MAX_DIST = 0.18;
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
    const PULSE_COUNT = 60;
    const pulses: Pulse[] = Array.from({ length: PULSE_COUNT }, () => ({
      connIdx: Math.floor(Math.random() * connections.length),
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.006,
      hue: 200 + Math.random() * 80,
    }));

    // ─── Stars ───────────────────────────────────────────────────
    const STAR_COUNT = 200;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.3 + Math.random() * 0.8,
      alpha: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    // ─── Mouse ───────────────────────────────────────────────────
    let mouseX = 0.5;
    let mouseY = 0.5;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ─── Animation ───────────────────────────────────────────────
    let time = 0;
    let lastTs = 0;

    const animate = (ts: number) => {
      frameIdRef.current = requestAnimationFrame(animate);

      const delta = lastTs ? Math.min((ts - lastTs) / 1000, 0.05) : 0.016;
      lastTs = ts;
      time += delta;

      const w = W();
      const h = H();

      // Background
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, w, h);

      // ── Stars ──
      for (const s of stars) {
        const alpha = s.alpha * (0.5 + 0.5 * Math.sin(time * 0.8 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 170, 220, ${alpha})`;
        ctx.fill();
      }

      // Update nodes
      for (const n of nodes) {
        const center = getClusterCenter(n.cluster);
        n.x += n.vx + Math.sin(time * 0.4 + n.phase) * 0.00008;
        n.y += n.vy + Math.cos(time * 0.35 + n.phase * 1.3) * 0.00008;

        // Attraction vers le centre du cluster
        const dx = n.x - center.x;
        const dy = n.y - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0.15) {
          n.vx -= dx * 0.00005;
          n.vy -= dy * 0.00005;
        }
        n.vx *= 0.999;
        n.vy *= 0.999;

        // Légère attraction vers la souris
        n.vx += (mouseX - n.x) * 0.000005;
        n.vy += (mouseY - n.y) * 0.000005;
      }

      // ── Connections ──
      for (const conn of connections) {
        const na = nodes[conn.a];
        const nb = nodes[conn.b];
        const dx = na.x - nb.x;
        const dy = na.y - nb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = Math.max(0, (MAX_DIST - dist) / MAX_DIST) * 0.3;

        const hue = (na.hue + nb.hue) / 2;
        ctx.beginPath();
        ctx.moveTo(na.x * w, na.y * h);
        ctx.lineTo(nb.x * w, nb.y * h);
        ctx.strokeStyle = `hsla(${hue}, 70%, 50%, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // ── Nodes (neurones) ──
      for (const n of nodes) {
        const pulse = Math.sin(time * 2.5 + n.phase) * 0.5 + 0.5;
        const lightness = 50 + pulse * 20;
        const alpha = 0.6 + pulse * 0.4;
        const r = n.size * (1 + pulse * 0.5);

        // Glow
        const grad = ctx.createRadialGradient(
          n.x * w, n.y * h, 0,
          n.x * w, n.y * h, r * 4
        );
        grad.addColorStop(0, `hsla(${n.hue + pulse * 20}, 85%, ${lightness}%, ${alpha})`);
        grad.addColorStop(0.4, `hsla(${n.hue}, 70%, 50%, ${alpha * 0.4})`);
        grad.addColorStop(1, `hsla(${n.hue}, 70%, 50%, 0)`);

        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue + pulse * 20}, 90%, ${lightness + 10}%, ${alpha})`;
        ctx.fill();
      }

      // ── Pulses synaptiques ──
      for (const p of pulses) {
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

        const grad = ctx.createRadialGradient(px, py, 0, px, py, pr * 3);
        grad.addColorStop(0, `hsla(${p.hue}, 100%, 80%, 0.95)`);
        grad.addColorStop(0.5, `hsla(${p.hue}, 100%, 60%, 0.4)`);
        grad.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`);

        ctx.beginPath();
        ctx.arc(px, py, pr * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
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
