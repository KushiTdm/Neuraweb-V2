'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// FIX PERFORMANCE :
// - NODE_COUNT : 60 → 40 (moins de géométries, moins de draw calls)
// - PART_COUNT : 800 → 300 (particules moins nombreuses)
// - Hélice DNA supprimée (180 Mesh objects = 180 draw calls pour un détail invisible)
// - Sphère icosaèdre réduite (detail 2 → 1 = 4x moins de triangles)
// - Mouse listener uniquement sur desktop
// - IntersectionObserver pour pause hors viewport
// - Frame throttling 30fps mobile / 60fps desktop
const NODE_COUNT = 40;
const PART_COUNT = 300;

export function AboutThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>();
  const clockRef = useRef(new THREE.Clock());
  const mouseRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    const container = containerRef.current;
    const W = container.clientWidth || window.innerWidth;
    const H = container.clientHeight || window.innerHeight;
    const isMobile = window.innerWidth < 768;

    // ── Scene ──────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 500);
    camera.position.set(0, 0, 32);

    // FIX: powerPreference 'low-power' pour un composant de section
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

    // ── 1. Réseau de neurones ──────────────────────────────────
    const nodePositions: THREE.Vector3[] = [];
    const nodeGroup = new THREE.Group();

    // FIX: SphereGeometry(r, 6, 6) au lieu de (r, 8, 8) = moins de triangles
    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 6 + Math.random() * 12;

      const pos = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        (Math.random() - 0.5) * 18
      );
      nodePositions.push(pos);

      const hue = 200 + Math.random() * 80;
      const color = new THREE.Color().setHSL(hue / 360, 0.8, 0.6);
      const geo = new THREE.SphereGeometry(0.12 + Math.random() * 0.18, 6, 6); // FIX: 6,6 au lieu de 8,8
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.7 + Math.random() * 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const node = new THREE.Mesh(geo, mat);
      node.position.copy(pos);
      node.userData = { basePos: pos.clone(), phase: Math.random() * Math.PI * 2, speed: 0.3 + Math.random() * 0.5 };
      nodeGroup.add(node);
    }

    // Connexions entre nœuds proches
    const linePositions: number[] = [];
    const MAX_DIST = 7;

    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const d = nodePositions[i]!.distanceTo(nodePositions[j]!);
        if (d < MAX_DIST && Math.random() < 0.3) { // FIX: 0.35 → 0.3 moins de lignes
          linePositions.push(
            nodePositions[i]!.x, nodePositions[i]!.y, nodePositions[i]!.z,
            nodePositions[j]!.x, nodePositions[j]!.y, nodePositions[j]!.z
          );
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4f8ef7,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(linesMesh);
    scene.add(nodeGroup);

    // ── 2. Particules flottantes ───────────────────────────────
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PART_COUNT * 3);
    const pCol = new Float32Array(PART_COUNT * 3);

    for (let i = 0; i < PART_COUNT; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 50;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      const t = Math.random();
      pCol[i * 3]     = 0.2 + t * 0.6;
      pCol[i * 3 + 1] = 0.3 + (1 - t) * 0.4;
      pCol[i * 3 + 2] = 0.9;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // FIX: Hélice DNA supprimée — 160 Mesh + 20 Line = 180 draw calls
    // pour un élément secondaire à peine visible. Économie majeure sur le TBT.

    // ── 3. Sphère centrale holographique simplifiée ────────────
    const sphereGroup = new THREE.Group();

    // FIX: IcosahedronGeometry detail 2 → 1 (4x moins de triangles)
    const outerGeo = new THREE.IcosahedronGeometry(3.5, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    sphereGroup.add(new THREE.Mesh(outerGeo, outerMat));

    // FIX: SphereGeometry segments réduits (32 → 16)
    const innerGeo = new THREE.SphereGeometry(2.2, 16, 16);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.08,
    });
    sphereGroup.add(new THREE.Mesh(innerGeo, innerMat));

    const ringGeo = new THREE.TorusGeometry(3.8, 0.04, 8, 60); // FIX: 16,100 → 8,60
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    sphereGroup.add(new THREE.Mesh(ringGeo, ringMat));
    sphereGroup.position.set(-12, 0, -3);
    scene.add(sphereGroup);

    // ── 4. Lumières ────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const l1 = new THREE.PointLight(0x3b82f6, 2, 50);
    l1.position.set(0, 10, 15);
    scene.add(l1);
    const l2 = new THREE.PointLight(0xa855f7, 1.5, 40);
    l2.position.set(-10, -5, 10);
    scene.add(l2);

    // FIX: Mouse uniquement sur desktop
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    let mousePending = false;
    const onMouseMove = (e: MouseEvent) => {
      if (mousePending) return;
      mousePending = true;
      requestAnimationFrame(() => {
        mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
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

    // Resize
    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // FIX: Animation avec frame throttling
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

      particles.rotation.y = t * 0.025;
      particles.rotation.x = t * 0.012;
      nodeGroup.rotation.y = t * 0.05;
      linesMesh.rotation.y = t * 0.05;

      // Pulsation nœuds — toutes les 2 frames pour économiser
      nodeGroup.children.forEach((child, idx) => {
        if (idx % 2 !== 0) return; // FIX: seulement 1 nœud sur 2
        const mesh = child as THREE.Mesh;
        const { phase, speed } = mesh.userData as { phase: number; speed: number };
        const s = 1 + Math.sin(t * speed + phase) * 0.3;
        mesh.scale.setScalar(s);
      });

      sphereGroup.rotation.y = t * 0.15;
      sphereGroup.rotation.x = Math.sin(t * 0.3) * 0.1;
      sphereGroup.scale.setScalar(1 + Math.sin(t * 1.8) * 0.04);

      // Réaction souris
      scene.rotation.y += (mouseRef.current.x * 0.08 - scene.rotation.y) * 0.03;
      scene.rotation.x += (-mouseRef.current.y * 0.05 - scene.rotation.x) * 0.03;

      renderer.render(scene, camera);
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
      lineGeo.dispose();
      lineMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}