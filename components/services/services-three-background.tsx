'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function HeroThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const torusRef = useRef<THREE.Mesh | null>(null);
  const frameIdRef = useRef<number>();
  const [isMounted, setIsMounted] = useState(false);

  // Step 1: Client-side hydration check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Step 2: Initialize Three.js after client hydration
  useEffect(() => {
    // Critical: Only run on client
    if (!isMounted) return;

    // Check if container exists
    if (!containerRef.current) {
      console.warn('Container ref not found');
      return;
    }

    const container = containerRef.current;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      scene.background = null;
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

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      
      // Append to container
      if (container.children.length === 0) {
        container.appendChild(renderer.domElement);
      }
      rendererRef.current = renderer;

      // Particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 5000;
      const posArray = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
      }

      particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(posArray, 3)
      );

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x667eea,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);
      particlesRef.current = particlesMesh;

      // Torus Knot
      const torusGeometry = new THREE.TorusKnotGeometry(8, 2, 100, 16);
      const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0x764ba2,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        emissive: 0x764ba2,
        emissiveIntensity: 0.2,
      });
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      scene.add(torus);
      torusRef.current = torus;

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x667eea, 2);
      pointLight1.position.set(10, 10, 10);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xf093fb, 2);
      pointLight2.position.set(-10, -10, -10);
      scene.add(pointLight2);

      // Mouse movement
      let mouseX = 0;
      let mouseY = 0;

      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Animation loop
      const animate = () => {
        frameIdRef.current = requestAnimationFrame(animate);

        // Rotate particles
        if (particlesRef.current) {
          particlesRef.current.rotation.y += 0.001;
          particlesRef.current.rotation.x += 0.0005;
        }

        // Rotate torus
        if (torusRef.current) {
          torusRef.current.rotation.x += 0.01;
          torusRef.current.rotation.y += 0.005;
          torusRef.current.rotation.z += 0.003;
        }

        // Camera movement based on mouse
        if (cameraRef.current) {
          cameraRef.current.position.x += (mouseX * 5 - cameraRef.current.position.x) * 0.05;
          cameraRef.current.position.y += (mouseY * 5 - cameraRef.current.position.y) * 0.05;
          cameraRef.current.lookAt(scene.position);
        }

        renderer.render(scene, camera);
      };

      animate();

      // Handle window resize
      const handleResize = () => {
        if (!cameraRef.current || !rendererRef.current) return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup function
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        
        if (frameIdRef.current) {
          cancelAnimationFrame(frameIdRef.current);
        }
        
        if (rendererRef.current) {
          rendererRef.current.dispose();
          if (container && container.contains(rendererRef.current.domElement)) {
            container.removeChild(rendererRef.current.domElement);
          }
        }
        
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        torusGeometry.dispose();
        torusMaterial.dispose();
      };
    } catch (error) {
      console.error('Three.js initialization error:', error);
      return;
    }
  }, [isMounted]);

  // Don't render anything on server
  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 opacity-100"
      style={{ pointerEvents: 'none' }}
    />
  );
}