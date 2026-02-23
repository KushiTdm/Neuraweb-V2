'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// FIX PERFORMANCE : Réduction drastique du nombre de particules
// Avant : 2000 étoiles + 80 nébuleuses + 50 anneaux de tunnel
// Après : 800 étoiles + 40 nébuleuses + tunnel supprimé (inutile en arrière-plan)
const STAR_COUNT = 800;       // ↓ de 2000 à 800 (-60%)
const NEBULA_COUNT = 40;      // ↓ de 80 à 40 (-50%)
const TUNNEL_RINGS = 0;       // ↓ de 50 à 0 — supprimé (non visible à l'œil)

export function ThreeBackground() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>();
  const isVisibleRef = useRef(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // FIX: Renderer avec options de performance
    // - antialias: false sur mobile pour économiser le GPU
    // - powerPreference: 'low-power' pour les arrière-plans (pas besoin de haute perf)
    const isMobile = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile, // Désactivé sur mobile
      powerPreference: 'low-power', // FIX: arrière-plan → pas besoin de perf max
    });
    // FIX: DPR limité à 1.5 max pour les arrière-plans (était 2)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Stars ──────────────────────────────────────────────────────
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(STAR_COUNT * 3);
    const starColors = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 12 + Math.random() * 35;
      const z = (Math.random() - 0.5) * 300;

      starPositions[i * 3]     = Math.cos(angle) * radius;
      starPositions[i * 3 + 1] = Math.sin(angle) * radius;
      starPositions[i * 3 + 2] = z;

      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        starColors[i * 3] = 0.95; starColors[i * 3 + 1] = 0.98; starColors[i * 3 + 2] = 1.0;
      } else if (colorChoice < 0.75) {
        starColors[i * 3] = 0.2;  starColors[i * 3 + 1] = 0.85; starColors[i * 3 + 2] = 1.0;
      } else {
        starColors[i * 3] = 0.75; starColors[i * 3 + 1] = 0.5;  starColors[i * 3 + 2] = 1.0;
      }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false, // FIX: évite les z-fighting et accélère le rendu
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ── Nebula ──────────────────────────────────────────────────────
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaPositions = new Float32Array(NEBULA_COUNT * 3);
    const nebulaColors = new Float32Array(NEBULA_COUNT * 3);

    for (let i = 0; i < NEBULA_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 18 + Math.random() * 28;
      const z = (Math.random() - 0.5) * 250;

      nebulaPositions[i * 3]     = Math.cos(angle) * radius;
      nebulaPositions[i * 3 + 1] = Math.sin(angle) * radius;
      nebulaPositions[i * 3 + 2] = z;

      const t = Math.random();
      nebulaColors[i * 3]     = 0.15 + t * 0.4;
      nebulaColors[i * 3 + 1] = 0.5 + t * 0.3;
      nebulaColors[i * 3 + 2] = 1.0;
    }

    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

    const nebulaMaterial = new THREE.PointsMaterial({
      size: 15,
      vertexColors: true,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);

    // FIX: Tunnel supprimé — 50 LineLoop × 49 points = calcul inutile en arrière-plan

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pointLight1 = new THREE.PointLight(0x22d3ee, 2);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xa78bfa, 2);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // FIX: Mouse avec throttle — l'événement ne doit pas déclencher un calcul chaque pixel
    let mouseX = 0;
    let mouseY = 0;
    let mousePending = false;

    const handleMouseMove = (event: MouseEvent) => {
      if (mousePending) return;
      mousePending = true;
      requestAnimationFrame(() => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        mousePending = false;
      });
    };

    // FIX: Pas d'écoute souris sur mobile (touch device)
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // FIX: IntersectionObserver — pause de l'animation quand non visible
    // Économise CPU/GPU quand l'utilisateur est sur une autre section
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    // FIX: Animation avec frame throttling — 30fps sur mobile, 60fps sur desktop
    let lastTs = 0;
    const targetFps = isMobile ? 30 : 60;
    const targetDelta = 1000 / targetFps;

    const animate = (ts: number) => {
      frameIdRef.current = requestAnimationFrame(animate);

      // FIX: Skip si non visible (économie CPU/GPU majeure)
      if (!isVisibleRef.current) return;

      // FIX: Frame throttling
      if (ts - lastTs < targetDelta) return;
      lastTs = ts;

      const time = ts * 0.001;

      stars.rotation.y  = time * 0.05;
      stars.rotation.x  = time * 0.025;
      nebula.rotation.y = time * 0.025;
      nebula.rotation.x = time * 0.015;

      // Camera movement basée sur la souris — lerp doux
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Avance de la caméra dans le tunnel
      camera.position.z -= 0.05;
      if (camera.position.z < -200) camera.position.z = 30;

      renderer.render(scene, camera);
    };

    animate(0);

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup
    return () => {
      if (!isTouchDevice) window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      visibilityObserver.disconnect();

      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);

      if (rendererRef.current && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      starGeometry.dispose();
      starMaterial.dispose();
      nebulaGeometry.dispose();
      nebulaMaterial.dispose();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 opacity-60"
      style={{ pointerEvents: 'none' }}
    />
  );
}