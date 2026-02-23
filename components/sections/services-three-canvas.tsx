'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ServicesThreeCanvasProps {
  activeIndex: number;
}

const SERVICE_PALETTES = [
  { primary: 0x3b82f6, secondary: 0x60a5fa, accent: 0x1d4ed8 },
  { primary: 0xa855f7, secondary: 0xc084fc, accent: 0x7e22ce },
  { primary: 0xec4899, secondary: 0xf472b6, accent: 0xbe185d },
];

// FIX PERFORMANCE :
// - PARTICLE_COUNT : 400 → 200 (-50%)
// - ORBIT_COUNT : 4 → 3
// - Grille de fond supprimée (GridHelper = draw call constant, invisible sur fond sombre)
const PARTICLE_COUNT = 200;
const ORBIT_COUNT = 3;

export function ServicesThreeCanvas({ activeIndex }: ServicesThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number>();
  const clockRef = useRef(new THREE.Clock());
  const isVisibleRef = useRef(false);

  const particlesRef = useRef<THREE.Points | null>(null);
  const ringsRef = useRef<THREE.Group | null>(null);
  const coreRef = useRef<THREE.Mesh | null>(null);
  const orbitGroupRef = useRef<THREE.Group | null>(null);
  const orbitMeshesRef = useRef<THREE.Mesh[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    const container = containerRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;
    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 500);
    camera.position.set(0, 0, 28);
    cameraRef.current = camera;

    // FIX: powerPreference 'low-power', antialias off mobile, DPR limité à 1.5
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'low-power',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const palette = SERVICE_PALETTES[activeIndex] ?? SERVICE_PALETTES[0];

    // FIX: Grille supprimée (était draw call constant + invisible sur fond sombre)

    // ── 1. Nuage de particules réduit ──────────────────────────
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    const pColors = new Float32Array(PARTICLE_COUNT * 3);

    const c1 = new THREE.Color(palette.primary);
    const c2 = new THREE.Color(palette.secondary);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 8 + Math.random() * 14;

      pPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const t = Math.random();
      const col = c1.clone().lerp(c2, t);
      pColors[i * 3]     = col.r;
      pColors[i * 3 + 1] = col.g;
      pColors[i * 3 + 2] = col.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
    particlesRef.current = particles;

    // ── 2. Anneaux orbitaux ────────────────────────────────────
    const ringsGroup = new THREE.Group();
    const ringData = [
      { radius: 5.5, tube: 0.04, color: palette.primary, speed: 0.4, tilt: 0.3 },
      { radius: 7.5, tube: 0.03, color: palette.secondary, speed: -0.25, tilt: -0.5 },
      { radius: 9.5, tube: 0.025, color: palette.accent, speed: 0.15, tilt: 0.8 },
    ];

    ringData.forEach((rd) => {
      // FIX: TorusGeometry segments réduits (16,120 → 8,64)
      const geo = new THREE.TorusGeometry(rd.radius, rd.tube, 8, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: rd.color,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = rd.tilt;
      ring.userData = { speed: rd.speed };
      ringsGroup.add(ring);
    });

    scene.add(ringsGroup);
    ringsRef.current = ringsGroup;

    // ── 3. Noyau central — géométrie réduite ──────────────────
    // FIX: IcosahedronGeometry detail 1 → 0 (beaucoup moins de triangles)
    const coreGeo = new THREE.IcosahedronGeometry(2.8, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: palette.primary,
      emissive: palette.primary,
      emissiveIntensity: 0.4,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);
    coreRef.current = core;

    // FIX: SphereGeometry 32,32 → 16,16
    const innerGeo = new THREE.SphereGeometry(2.2, 16, 16);
    const innerMat = new THREE.MeshStandardMaterial({
      color: palette.primary,
      emissive: palette.primary,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.15,
    });
    scene.add(new THREE.Mesh(innerGeo, innerMat));

    // ── 4. Sphères en orbite ───────────────────────────────────
    const orbitGroup = new THREE.Group();
    const orbitMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < ORBIT_COUNT; i++) {
      const angle = (i / ORBIT_COUNT) * Math.PI * 2;
      const orbitRadius = 6.5;
      const size = 0.18 + Math.random() * 0.22;

      // FIX: SphereGeometry 12,12 → 8,8
      const oGeo = new THREE.SphereGeometry(size, 8, 8);
      const oMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? palette.primary : palette.secondary,
        emissive: i % 2 === 0 ? palette.primary : palette.secondary,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
      });
      const orb = new THREE.Mesh(oGeo, oMat);
      orb.position.set(Math.cos(angle) * orbitRadius, Math.sin(angle) * orbitRadius, 0);
      orb.userData = { angle, orbitRadius, speed: 0.3 + Math.random() * 0.2 };
      orbitGroup.add(orb);
      orbitMeshes.push(orb);
    }

    scene.add(orbitGroup);
    orbitGroupRef.current = orbitGroup;
    orbitMeshesRef.current = orbitMeshes;

    // ── 5. Lumières ────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const light1 = new THREE.PointLight(palette.primary, 3, 40);
    light1.position.set(5, 5, 10);
    scene.add(light1);
    const light2 = new THREE.PointLight(palette.secondary, 2, 30);
    light2.position.set(-5, -5, 8);
    scene.add(light2);

    // FIX: Mouse throttle + desktop only
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    let mousePending = false;
    const onMouseMove = (e: MouseEvent) => {
      if (mousePending) return;
      mousePending = true;
      requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        mousePending = false;
      });
    };
    if (!isTouchDevice) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    // FIX: IntersectionObserver — ne rendre que si visible
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    visibilityObserver.observe(container);

    const onResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // FIX: Frame throttling — 30fps mobile, 60fps desktop
    const targetFps = isMobile ? 30 : 60;
    const targetDelta = 1000 / targetFps;
    let lastTs = 0;

    const animate = (ts: number) => {
      frameIdRef.current = requestAnimationFrame(animate);

      // Skip si non visible
      if (!isVisibleRef.current) return;

      // Frame throttling
      if (ts - lastTs < targetDelta) return;
      lastTs = ts;

      const t = clockRef.current.getElapsedTime();

      if (particlesRef.current) {
        particlesRef.current.rotation.y = t * 0.04;
        particlesRef.current.rotation.x = t * 0.02;
      }

      if (ringsRef.current) {
        ringsRef.current.children.forEach((child) => {
          child.rotation.z += (child.userData.speed as number) * 0.008;
        });
        ringsRef.current.rotation.y = t * 0.06;
      }

      if (coreRef.current) {
        const pulse = 1 + Math.sin(t * 2.5) * 0.06;
        coreRef.current.scale.setScalar(pulse);
        coreRef.current.rotation.x = t * 0.3;
        coreRef.current.rotation.y = t * 0.5;
        coreRef.current.rotation.z = t * 0.2;
      }

      orbitMeshesRef.current.forEach((orb) => {
        const { orbitRadius, speed } = orb.userData as { angle: number; orbitRadius: number; speed: number };
        orb.userData.angle += speed * 0.01;
        orb.position.x = Math.cos(orb.userData.angle) * orbitRadius;
        orb.position.y = Math.sin(orb.userData.angle) * orbitRadius;
        orb.scale.setScalar(1 + Math.sin(t * 3 + orb.userData.angle) * 0.2);
      });

      if (sceneRef.current) {
        sceneRef.current.rotation.y += (mouseRef.current.x * 0.15 - sceneRef.current.rotation.y) * 0.04;
        sceneRef.current.rotation.x += (-mouseRef.current.y * 0.1 - sceneRef.current.rotation.x) * 0.04;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate(0);

    return () => {
      if (!isTouchDevice) window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      visibilityObserver.disconnect();
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
      pGeo.dispose();
      pMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  // Transition couleurs activeIndex
  useEffect(() => {
    if (!sceneRef.current) return;
    const palette = SERVICE_PALETTES[activeIndex] ?? SERVICE_PALETTES[0];

    if (ringsRef.current) {
      const colors = [palette.primary, palette.secondary, palette.accent];
      ringsRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.color.setHex(colors[i] ?? palette.primary);
      });
    }

    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.color.setHex(palette.primary);
      mat.emissive.setHex(palette.primary);
    }

    orbitMeshesRef.current.forEach((orb, i) => {
      const mat = orb.material as THREE.MeshStandardMaterial;
      const col = i % 2 === 0 ? palette.primary : palette.secondary;
      mat.color.setHex(col);
      mat.emissive.setHex(col);
    });

    if (particlesRef.current) {
      const c1 = new THREE.Color(palette.primary);
      const c2 = new THREE.Color(palette.secondary);
      const geo = particlesRef.current.geometry;
      const colors = geo.attributes.color.array as Float32Array;
      for (let i = 0; i < colors.length / 3; i++) {
        const t = Math.random();
        const col = c1.clone().lerp(c2, t);
        colors[i * 3]     = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }
      geo.attributes.color.needsUpdate = true;
    }
  }, [activeIndex]);

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}