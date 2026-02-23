'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function AboutThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>();
  const clockRef = useRef(new THREE.Clock());
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    const container = containerRef.current;
    const W = container.clientWidth || window.innerWidth;
    const H = container.clientHeight || window.innerHeight;

    // ── Scene ──────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera ─────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 500);
    camera.position.set(0, 0, 32);

    // ── Renderer ───────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── 1. Réseau de neurones (lignes + nœuds) ─────────────────
    const NODE_COUNT = 60;
    const nodePositions: THREE.Vector3[] = [];
    const nodeGroup = new THREE.Group();

    // Nœuds
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

      const hue = 200 + Math.random() * 80; // bleu → violet
      const color = new THREE.Color().setHSL(hue / 360, 0.8, 0.6);

      const geo = new THREE.SphereGeometry(0.12 + Math.random() * 0.18, 8, 8);
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
    const lineColors: number[] = [];
    const MAX_DIST = 7;

    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const d = nodePositions[i]!.distanceTo(nodePositions[j]!);
        if (d < MAX_DIST && Math.random() < 0.35) {
          linePositions.push(
            nodePositions[i]!.x, nodePositions[i]!.y, nodePositions[i]!.z,
            nodePositions[j]!.x, nodePositions[j]!.y, nodePositions[j]!.z
          );
          const alpha = (1 - d / MAX_DIST) * 0.4;
          lineColors.push(0.3, 0.5, 1.0, alpha, 0.3, 0.5, 1.0, alpha);
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
    const PART_COUNT = 800;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PART_COUNT * 3);
    const pCol = new Float32Array(PART_COUNT * 3);

    for (let i = 0; i < PART_COUNT; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 50;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const t = Math.random();
      // Dégradé bleu → violet → rose
      pCol[i * 3] = 0.2 + t * 0.6;
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

    // ── 3. Anneau DNA (double hélice stylisée) ─────────────────
    const helixGroup = new THREE.Group();
    const HELIX_POINTS = 80;
    const helixRadius = 4;
    const helixHeight = 20;

    for (let strand = 0; strand < 2; strand++) {
      const offset = strand * Math.PI;
      for (let i = 0; i < HELIX_POINTS; i++) {
        const t = i / HELIX_POINTS;
        const angle = t * Math.PI * 6 + offset;
        const x = Math.cos(angle) * helixRadius;
        const y = t * helixHeight - helixHeight / 2;
        const z = Math.sin(angle) * helixRadius;

        const size = 0.1 + Math.sin(t * Math.PI) * 0.12;
        const geo = new THREE.SphereGeometry(size, 6, 6);
        const hue = strand === 0 ? 0.6 : 0.75; // bleu vs violet
        const color = new THREE.Color().setHSL(hue, 0.9, 0.65);
        const mat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const bead = new THREE.Mesh(geo, mat);
        bead.position.set(x, y, z);
        helixGroup.add(bead);
      }

      // Barreaux de connexion entre les deux brins
      if (strand === 1) {
        for (let i = 0; i < HELIX_POINTS; i += 4) {
          const t = i / HELIX_POINTS;
          const angle0 = t * Math.PI * 6;
          const angle1 = angle0 + Math.PI;
          const y = t * helixHeight - helixHeight / 2;

          const p0 = new THREE.Vector3(Math.cos(angle0) * helixRadius, y, Math.sin(angle0) * helixRadius);
          const p1 = new THREE.Vector3(Math.cos(angle1) * helixRadius, y, Math.sin(angle1) * helixRadius);

          const barGeo = new THREE.BufferGeometry().setFromPoints([p0, p1]);
          const barMat = new THREE.LineBasicMaterial({
            color: 0x818cf8,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          helixGroup.add(new THREE.Line(barGeo, barMat));
        }
      }
    }

    helixGroup.position.set(14, 0, -5);
    helixGroup.rotation.z = 0.3;
    scene.add(helixGroup);

    // ── 4. Sphère centrale holographique ──────────────────────
    const sphereGroup = new THREE.Group();

    // Wireframe extérieur
    const outerGeo = new THREE.IcosahedronGeometry(3.5, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    sphereGroup.add(new THREE.Mesh(outerGeo, outerMat));

    // Sphère intérieure glow
    const innerGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.08,
    });
    sphereGroup.add(new THREE.Mesh(innerGeo, innerMat));

    // Anneau équatorial
    const ringGeo = new THREE.TorusGeometry(3.8, 0.04, 16, 100);
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

    // ── 5. Lumières ────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const l1 = new THREE.PointLight(0x3b82f6, 2, 50);
    l1.position.set(0, 10, 15);
    scene.add(l1);
    const l2 = new THREE.PointLight(0xa855f7, 1.5, 40);
    l2.position.set(-10, -5, 10);
    scene.add(l2);

    // ── Mouse ──────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Resize ─────────────────────────────────────────────────
    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── Animation ──────────────────────────────────────────────
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();

      // Particules flottantes
      particles.rotation.y = t * 0.025;
      particles.rotation.x = t * 0.012;

      // Réseau de neurones : légère rotation
      nodeGroup.rotation.y = t * 0.05;
      linesMesh.rotation.y = t * 0.05;

      // Pulsation des nœuds
      nodeGroup.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const { phase, speed } = mesh.userData as { phase: number; speed: number };
        const s = 1 + Math.sin(t * speed + phase) * 0.3;
        mesh.scale.setScalar(s);
      });

      // Hélice DNA
      helixGroup.rotation.y = t * 0.2;

      // Sphère holographique
      sphereGroup.rotation.y = t * 0.15;
      sphereGroup.rotation.x = Math.sin(t * 0.3) * 0.1;
      const pulse = 1 + Math.sin(t * 1.8) * 0.04;
      sphereGroup.scale.setScalar(pulse);

      // Réaction souris
      scene.rotation.y += (mouseRef.current.x * 0.08 - scene.rotation.y) * 0.03;
      scene.rotation.x += (-mouseRef.current.y * 0.05 - scene.rotation.x) * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ────────────────────────────────────────────────
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
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
