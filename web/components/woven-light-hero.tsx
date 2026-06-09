"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';

// Espera a que el intro splash termine antes de animar/inicializar lo pesado.
// Respaldo de 5s por si el intro no está presente o el evento ya se disparó.
function useIntroDone() {
  const [done, setDone] = React.useState(false);

  useEffect(() => {
    const markDone = () => setDone(true);
    window.addEventListener("nexcode:intro-done", markDone);
    const fallback = setTimeout(markDone, 5000);
    return () => {
      window.removeEventListener("nexcode:intro-done", markDone);
      clearTimeout(fallback);
    };
  }, []);

  return done;
}

// --- Main Hero Component ---
export const WovenLightHero = () => {
  const textControls = useAnimation();
  const buttonControls = useAnimation();
  const introDone = useIntroDone();

  useEffect(() => {
    if (!introDone) return;
    textControls.start(i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }));
    buttonControls.start({
      opacity: 1,
      transition: { delay: 0.7, duration: 0.8 }
    });
  }, [introDone, textControls, buttonControls]);

  const headline = "Cada negocio merece su propio sistema.";

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-center overflow-hidden bg-black">
      <WovenCanvas />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight" style={{ fontFamily: "var(--font-playfair), serif", textShadow: '0 0 60px rgba(124, 58, 237, 0.4)' }}>
            {headline.split(" ").map((word, i) => (
                <span key={i} className="inline-block">
                    <motion.span custom={i} initial={{ opacity: 0, y: 50 }} animate={textControls} style={{ display: 'inline-block' }}>
                        {word}
                    </motion.span>
                    {i < headline.split(" ").length - 1 && <span>&nbsp;</span>}
                </span>
            ))}
        </h1>
        <motion.p
          custom={7}
          initial={{ opacity: 0, y: 30 }}
          animate={textControls}
          className="mx-auto mt-8 max-w-xl text-lg text-slate-300"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Construimos la herramienta exacta que necesitas. Sin plantillas, sin mensualidades. Solo software que trabaja para ti.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={buttonControls} className="mt-10 flex flex-wrap gap-4 justify-center">
          <a href="https://wa.me/573006359008" target="_blank" rel="noopener noreferrer" className="rounded-full bg-violet-600/80 border-2 border-violet-400/30 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-violet-600" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Contacta a ventas
          </a>
        </motion.div>
      </div>
    </div>
  );
};

// --- Fallback gradient for when WebGL is unavailable ---
const GradientFallback = () => (
  <div
    className="absolute inset-0 z-0"
    style={{
      background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124,58,237,0.25) 0%, rgba(6,182,212,0.1) 50%, transparent 100%)',
    }}
  />
);

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// --- Three.js Canvas Component ---
const WovenCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = React.useState(false);
  const introDone = useIntroDone();
  const [canvasReady, setCanvasReady] = React.useState(false);

  // Escalonar: el texto anima primero, las partículas inician 900ms después
  // para que no compitan por el hilo principal
  useEffect(() => {
    if (!introDone) return;
    const t = setTimeout(() => setCanvasReady(true), 900);
    return () => clearTimeout(t);
  }, [introDone]);

  useEffect(() => {
    if (!canvasReady) return;
    if (!mountRef.current) return;
    if (!isWebGLAvailable()) { setWebglFailed(true); return; }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebglFailed(true);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap at 2x para móvil
    mountRef.current.appendChild(renderer.domElement);

    // Manejar pérdida de contexto WebGL
    renderer.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      setWebglFailed(true);
    });

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // --- Woven Silk ---
    const particleCount = 50000;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const geometry = new THREE.BufferGeometry();
    const torusKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 32);

    for (let i = 0; i < particleCount; i++) {
        const vertexIndex = i % torusKnot.attributes.position.count;
        const x = torusKnot.attributes.position.getX(vertexIndex);
        const y = torusKnot.attributes.position.getY(vertexIndex);
        const z = torusKnot.attributes.position.getZ(vertexIndex);
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        originalPositions[i * 3] = x;
        originalPositions[i * 3 + 1] = y;
        originalPositions[i * 3 + 2] = z;

        const color = new THREE.Color();
        color.setHSL(Math.random(), 0.8, isDarkMode ? 0.5 : 0.7);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        velocities[i * 3] = 0;
        velocities[i * 3 + 1] = 0;
        velocities[i * 3 + 2] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        blending: isDarkMode ? THREE.NormalBlending : THREE.AdditiveBlending,
        transparent: true,
        opacity: isDarkMode ? 1.0 : 0.8,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const handleMouseMove = (event: MouseEvent) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        
        // Matemática escalar sin asignar objetos: evita pausas de GC por frame
        const mwx = mouse.x * 3, mwy = mouse.y * 3, mwz = 0;

        for (let i = 0; i < particleCount; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            const px = positions[ix], py = positions[iy], pz = positions[iz];
            let vx = velocities[ix], vy = velocities[iy], vz = velocities[iz];

            const dx = px - mwx, dy = py - mwy, dz = pz - mwz;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < 1.5 && dist > 0) {
                const force = ((1.5 - dist) * 0.01) / dist;
                vx += dx * force;
                vy += dy * force;
                vz += dz * force;
            }

            // Return to original position
            vx += (originalPositions[ix] - px) * 0.001;
            vy += (originalPositions[iy] - py) * 0.001;
            vz += (originalPositions[iz] - pz) * 0.001;

            // Damping
            vx *= 0.95; vy *= 0.95; vz *= 0.95;

            positions[ix] = px + vx;
            positions[iy] = py + vy;
            positions[iz] = pz + vz;

            velocities[ix] = vx;
            velocities[iy] = vy;
            velocities[iz] = vz;
        }
        geometry.attributes.position.needsUpdate = true;

        points.rotation.y = elapsedTime * 0.05;
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
    };
  }, [canvasReady]);

  if (webglFailed) return <GradientFallback />;
  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};


export default WovenLightHero;
