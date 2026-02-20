'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ServicesProcessProps {
  language?: 'fr' | 'en' | 'es';
  onScrollToPricing?: () => void;
}

// ─── Static data outside component to avoid stale closures ────────────────────
const STEP_DATA = {
  fr: [
    {
      title: 'Audit & Analyse',
      description: 'Analyse approfondie de vos besoins et de votre marché pour définir une stratégie gagnante',
      icon: '🔍',
      color: 0x3b82f6,
      colorHex: '#3b82f6',
    },
    {
      title: 'Design & UX',
      description: "Création d'interfaces modernes et intuitives optimisées pour l'expérience utilisateur",
      icon: '🎨',
      color: 0xa855f7,
      colorHex: '#a855f7',
    },
    {
      title: 'Développement',
      description: 'Développement avec les technologies les plus performantes et les meilleures pratiques',
      icon: '⚡',
      color: 0xf97316,
      colorHex: '#f97316',
    },
    {
      title: 'Tests & Optimisation',
      description: 'Tests rigoureux et optimisations pour garantir performance et qualité',
      icon: '✅',
      color: 0x10b981,
      colorHex: '#10b981',
    },
    {
      title: 'Livraison & Support',
      description: 'Mise en ligne et accompagnement continu pour votre réussite',
      icon: '🚀',
      color: 0xeab308,
      colorHex: '#eab308',
    },
  ],
  en: [
    {
      title: 'Audit & Analysis',
      description: 'In-depth analysis of your needs and market to define a winning strategy',
      icon: '🔍',
      color: 0x3b82f6,
      colorHex: '#3b82f6',
    },
    {
      title: 'Design & UX',
      description: 'Creation of modern and intuitive interfaces optimized for user experience',
      icon: '🎨',
      color: 0xa855f7,
      colorHex: '#a855f7',
    },
    {
      title: 'Development',
      description: 'Development with the most performant technologies and best practices',
      icon: '⚡',
      color: 0xf97316,
      colorHex: '#f97316',
    },
    {
      title: 'Testing & Optimization',
      description: 'Rigorous testing and optimizations to guarantee performance and quality',
      icon: '✅',
      color: 0x10b981,
      colorHex: '#10b981',
    },
    {
      title: 'Delivery & Support',
      description: 'Launch and continuous support for your success',
      icon: '🚀',
      color: 0xeab308,
      colorHex: '#eab308',
    },
  ],
  es: [
    {
      title: 'Auditoría y Análisis',
      description: 'Análisis profundo de tus necesidades y mercado para definir una estrategia ganadora',
      icon: '🔍',
      color: 0x3b82f6,
      colorHex: '#3b82f6',
    },
    {
      title: 'Diseño y UX',
      description: 'Creación de interfaces modernas e intuitivas optimizadas para la experiencia del usuario',
      icon: '🎨',
      color: 0xa855f7,
      colorHex: '#a855f7',
    },
    {
      title: 'Desarrollo',
      description: 'Desarrollo con las tecnologías más eficientes y mejores prácticas',
      icon: '⚡',
      color: 0xf97316,
      colorHex: '#f97316',
    },
    {
      title: 'Pruebas y Optimización',
      description: 'Pruebas rigurosas y optimizaciones para garantizar rendimiento y calidad',
      icon: '✅',
      color: 0x10b981,
      colorHex: '#10b981',
    },
    {
      title: 'Entrega y Soporte',
      description: 'Lanzamiento y acompañamiento continuo para tu éxito',
      icon: '🚀',
      color: 0xeab308,
      colorHex: '#eab308',
    },
  ],
};

// Spacing between cards in 3D world units
const CARD_SPACING = 20;
// Total steps
const TOTAL_STEPS = 5;

export function ServicesProcess({ language = 'fr', onScrollToPricing }: ServicesProcessProps) {
  const steps = STEP_DATA[language] ?? STEP_DATA.fr;

  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // DOM refs
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Three.js refs
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number>(0);
  const clockRef = useRef(new THREE.Clock());
  const cardGroupsRef = useRef<THREE.Group[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Scroll state — plain refs, read directly in animation loop
  const scrollProgressRef = useRef(0);   // smoothed
  const targetProgressRef = useRef(0);   // raw from scroll event
  const activeStepRef = useRef(0);       // current step index

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─── Scroll listener ──────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const viewH = window.innerHeight;
      const scrollable = sectionH - viewH;

      // How many px we've scrolled into the section
      const scrolled = -rect.top;
      const progress = scrollable > 0
        ? Math.max(0, Math.min(1, scrolled / scrollable))
        : 0;

      targetProgressRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once immediately in case page is already scrolled
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  // ─── Three.js setup ───────────────────────────────────────────
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const container = canvasRef.current;
    const W = container.clientWidth || window.innerWidth;
    const H = container.clientHeight || window.innerHeight;

    // ── Scene ──────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.025);
    sceneRef.current = scene;

    // ── Camera ─────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 300);
    // Camera starts at z=0, looking toward -Z
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, -10);
    cameraRef.current = camera;

    // ── Renderer ───────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020617, 1);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Tunnel rings ───────────────────────────────────────────
    for (let i = 0; i < 30; i++) {
      const ringGeo = new THREE.TorusGeometry(10, 0.05, 8, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x1e3a5f,
        transparent: true,
        opacity: 0.25,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.z = -(i * 7);
      scene.add(ring);
    }

    // ── Background particles ───────────────────────────────────
    const PARTICLE_COUNT = 1500;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    const pColors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 4 + Math.random() * 8;
      pPos[i * 3]     = Math.cos(angle) * radius;
      pPos[i * 3 + 1] = Math.sin(angle) * radius;
      pPos[i * 3 + 2] = -(Math.random() * (TOTAL_STEPS * CARD_SPACING + 20));

      const stepIdx = Math.floor(Math.random() * TOTAL_STEPS);
      const col = new THREE.Color(STEP_DATA.fr[stepIdx].color);
      pColors[i * 3]     = col.r;
      pColors[i * 3 + 1] = col.g;
      pColors[i * 3 + 2] = col.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
    particlesRef.current = particles;

    // ── 3D Cards ───────────────────────────────────────────────
    const cardGroups: THREE.Group[] = [];

    STEP_DATA.fr.forEach((step, index) => {
      const group = new THREE.Group();
      // Cards placed along -Z axis, starting at -10 then every CARD_SPACING units
      group.position.z = -(index * CARD_SPACING + 10);

      // ── Canvas texture ──────────────────────────────────────
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 640;
      texCanvas.height = 400;
      const ctx = texCanvas.getContext('2d')!;

      // Background
      const col = new THREE.Color(step.color);
      const r = Math.round(col.r * 255);
      const g = Math.round(col.g * 255);
      const b = Math.round(col.b * 255);

      const grad = ctx.createLinearGradient(0, 0, 640, 400);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.95)`);
      grad.addColorStop(1, `rgba(${Math.round(r * 0.3)}, ${Math.round(g * 0.3)}, ${Math.round(b * 0.3)}, 0.85)`);
      ctx.fillStyle = grad;
      ctx.roundRect(0, 0, 640, 400, 28);
      ctx.fill();

      // Glassmorphism inner panel
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      ctx.roundRect(16, 16, 608, 368, 18);
      ctx.fill();

      // Border
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 1)`;
      ctx.lineWidth = 2.5;
      ctx.roundRect(2, 2, 636, 396, 26);
      ctx.stroke();

      // Step number badge
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.arc(68, 72, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 38px system-ui, Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${index + 1}`, 68, 72);

      // Icon
      ctx.font = '52px system-ui, Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(step.icon, 130, 36);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px system-ui, Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(step.title, 30, 140);

      // Divider line
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(30, 200);
      ctx.lineTo(610, 200);
      ctx.stroke();

      // Description with word wrap
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.font = '24px system-ui, Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const words = step.description.split(' ');
      let line = '';
      let y = 218;
      const maxW = 580;
      const lh = 34;
      for (const word of words) {
        const test = line + word + ' ';
        if (ctx.measureText(test).width > maxW && line !== '') {
          ctx.fillText(line.trim(), 30, y);
          line = word + ' ';
          y += lh;
        } else {
          line = test;
        }
      }
      if (line.trim()) ctx.fillText(line.trim(), 30, y);

      const texture = new THREE.CanvasTexture(texCanvas);

      // ── Card mesh ───────────────────────────────────────────
      const cardW = 9;
      const cardH = 5.6;
      const cardGeo = new THREE.PlaneGeometry(cardW, cardH);
      const cardMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,          // start invisible
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const card = new THREE.Mesh(cardGeo, cardMat);
      group.add(card);

      // ── Glow halo ───────────────────────────────────────────
      const glowGeo = new THREE.PlaneGeometry(cardW + 2, cardH + 2);
      const glowMat = new THREE.MeshBasicMaterial({
        color: step.color,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.z = -0.05;
      group.add(glow);

      // ── Floating particles around card ──────────────────────
      const fGeo = new THREE.BufferGeometry();
      const fPos = new Float32Array(80 * 3);
      for (let j = 0; j < 80; j++) {
        fPos[j * 3]     = (Math.random() - 0.5) * 14;
        fPos[j * 3 + 1] = (Math.random() - 0.5) * 10;
        fPos[j * 3 + 2] = (Math.random() - 0.5) * 6;
      }
      fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
      const fMat = new THREE.PointsMaterial({
        color: step.color,
        size: 0.07,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const floatPts = new THREE.Points(fGeo, fMat);
      group.add(floatPts);

      scene.add(group);
      cardGroups.push(group);
    });

    cardGroupsRef.current = cardGroups;

    // ── Ambient light ──────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // ── Resize handler ─────────────────────────────────────────
    const onResize = () => {
      const c = canvasRef.current;
      if (!c) return;
      const w = c.clientWidth;
      const h = c.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ─────────────────────────────────────────
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const elapsed = clockRef.current.getElapsedTime();

      // Lerp scroll progress for smooth camera movement
      scrollProgressRef.current += (targetProgressRef.current - scrollProgressRef.current) * 0.07;
      const progress = scrollProgressRef.current;

      // Camera Z: moves from 0 to -(TOTAL_STEPS-1)*CARD_SPACING
      const camZ = -(progress * (TOTAL_STEPS - 1) * CARD_SPACING);
      camera.position.z = camZ;
      // Subtle sway
      camera.position.x = Math.sin(elapsed * 0.25) * 0.25;
      camera.position.y = Math.cos(elapsed * 0.18) * 0.18;
      camera.lookAt(
        camera.position.x,
        camera.position.y,
        camZ - 10
      );

      // Update each card
      cardGroupsRef.current.forEach((group, idx) => {
        // World Z of this card
        const cardWorldZ = -(idx * CARD_SPACING + 10);
        // Distance from camera (positive = ahead, negative = behind)
        const distAhead = cardWorldZ - camZ; // negative means card is ahead of camera

        // We want the card to be visible when it's between -CARD_SPACING/2 and +4 units from camera
        const APPEAR_DIST = CARD_SPACING * 0.9;  // how far ahead we start showing
        const DISAPPEAR_DIST = 4;                 // how far behind before fully gone

        let opacity = 0;
        let scale = 1;

        if (distAhead < 0 && distAhead > -APPEAR_DIST) {
          // Card is ahead of camera (distAhead is negative)
          const t = 1 - (-distAhead / APPEAR_DIST); // 0 when far, 1 when at camera
          opacity = Math.min(1, t * 1.5);
          scale = 0.2 + t * 0.8;
        } else if (distAhead >= 0 && distAhead < DISAPPEAR_DIST) {
          // Card just passed camera (distAhead is positive = behind camera)
          const t = distAhead / DISAPPEAR_DIST;
          opacity = 1 - t;
          scale = 1 + t * 0.2;
        }

        group.scale.setScalar(scale);

        // Floating bob
        group.position.y = Math.sin(elapsed * 0.7 + idx * 1.3) * 0.25;
        group.rotation.y = Math.sin(elapsed * 0.35 + idx * 0.9) * 0.04;
        group.rotation.x = Math.cos(elapsed * 0.28 + idx * 0.7) * 0.025;

        // Apply opacity to all children
        group.children.forEach((child, ci) => {
          const mat = (child as THREE.Mesh | THREE.Points).material as THREE.Material & { opacity: number };
          if (ci === 0) {
            // Card face
            mat.opacity = opacity;
          } else if (ci === 1) {
            // Glow
            mat.opacity = opacity * 0.18;
          } else if (ci === 2) {
            // Float particles
            mat.opacity = opacity * 0.75;
            (child as THREE.Points).rotation.y = elapsed * 0.4 + idx;
            (child as THREE.Points).rotation.x = elapsed * 0.25 + idx;
          }
          mat.needsUpdate = true;
        });
      });

      // Slowly rotate background particles
      if (particlesRef.current) {
        particlesRef.current.rotation.z = elapsed * 0.015;
      }

      // Update active step indicator
      const newActive = Math.min(
        TOTAL_STEPS - 1,
        Math.max(0, Math.round(progress * (TOTAL_STEPS - 1)))
      );
      if (newActive !== activeStepRef.current) {
        activeStepRef.current = newActive;
        setActiveStep(newActive);
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ────────────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameIdRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mounted]); // only runs once after mount

  // ─── SSR placeholder ──────────────────────────────────────────
  if (!mounted) {
    return (
      <section className="relative bg-slate-950 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white">
            {language === 'fr' ? 'Notre Processus' : language === 'es' ? 'Nuestro Proceso' : 'Our Process'}
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-slate-950"
      /* 600vh = 5 steps × 100vh + 100vh buffer */
      style={{ height: `${TOTAL_STEPS * 100 + 100}vh` }}
    >
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Three.js canvas fills the sticky viewport */}
        <div
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* ── Top overlay: title ── */}
        <div
          className="absolute top-0 left-0 right-0 z-10 pt-10 pb-8 text-center pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.55) 65%, transparent 100%)',
          }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 mb-4 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/70">
              {language === 'fr' ? 'Méthode éprouvée' : language === 'es' ? 'Método probado' : 'Proven method'}
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            {language === 'fr' ? 'Notre Processus' : language === 'es' ? 'Nuestro Proceso' : 'Our Process'}
          </h2>
          <p className="mt-2 text-base md:text-lg text-white/40">
            {language === 'fr'
              ? 'Une méthode éprouvée pour votre succès'
              : language === 'es'
                ? 'Un método probado para tu éxito'
                : 'A proven method for your success'}
          </p>
        </div>

        {/* ── Bottom overlay: step info ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 pb-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.6) 55%, transparent 100%)',
          }}
        >
          {/* Progress dots */}
          <div className="flex justify-center items-center gap-3 mb-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="transition-all duration-500 rounded-full"
                style={{
                  width: i === activeStep ? '28px' : '9px',
                  height: '9px',
                  backgroundColor: i === activeStep ? step.colorHex : 'rgba(255,255,255,0.2)',
                  boxShadow: i === activeStep ? `0 0 10px ${step.colorHex}` : 'none',
                }}
              />
            ))}
          </div>

          {/* Step cards (HTML overlay) */}
          <div className="relative h-36 max-w-2xl mx-auto px-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="absolute inset-x-6 text-center transition-all duration-600"
                style={{
                  opacity: i === activeStep ? 1 : 0,
                  transform: i === activeStep
                    ? 'translateY(0px)'
                    : i < activeStep
                      ? 'translateY(-16px)'
                      : 'translateY(16px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl">{step.icon}</span>
                  <span
                    className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: `${step.colorHex}22`,
                      color: step.colorHex,
                      border: `1px solid ${step.colorHex}55`,
                    }}
                  >
                    {language === 'fr' ? `Étape ${i + 1} / ${steps.length}` : language === 'es' ? `Paso ${i + 1} / ${steps.length}` : `Step ${i + 1} / ${steps.length}`}
                  </span>
                </div>
                <h3
                  className="text-2xl md:text-3xl font-bold mb-2"
                  style={{ color: step.colorHex }}
                >
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-white/65 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Scroll hint or CTA button */}
          <div className="flex flex-col items-center gap-3 mt-4">
            {/* Show scroll hint when not at last step */}
            <div
              className="flex flex-col items-center gap-1 transition-opacity duration-500"
              style={{ opacity: activeStep >= steps.length - 1 ? 0 : 0.45 }}
            >
              <span className="text-xs text-white/35 tracking-widest uppercase">
                {language === 'fr' ? 'Scrollez pour explorer' : language === 'es' ? 'Desliza para explorar' : 'Scroll to explore'}
              </span>
              <div className="w-px h-6 bg-gradient-to-b from-white/35 to-transparent animate-pulse" />
            </div>
            
            {/* Show CTA button when at last step */}
            {onScrollToPricing && (
              <button
                onClick={onScrollToPricing}
                className="pointer-events-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30"
                style={{
                  opacity: activeStep >= steps.length - 1 ? 1 : 0,
                  transform: activeStep >= steps.length - 1 ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
              >
                <span className="flex items-center gap-2">
                  {language === 'fr' ? 'Voir nos packs' : language === 'es' ? 'Ver nuestros paquetes' : 'View our packages'}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
