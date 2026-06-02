"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// --- Main Hero Component ---
export const WovenLightHero = () => {
  const textControls = useAnimation();
  const buttonControls = useAnimation();

  useEffect(() => {
    textControls.start(i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 1.5,
        duration: 1.2,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }));
    buttonControls.start({
      opacity: 1,
      transition: { delay: 2.5, duration: 1 }
    });
  }, [textControls, buttonControls]);

  const headline = "Cada negocio merece su propio sistema.";

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">
      <WovenCanvas />
      <HeroNav />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight" style={{ fontFamily: "var(--font-playfair), serif", textShadow: '0 0 60px rgba(124, 58, 237, 0.4)' }}>
            {headline.split(" ").map((word, i) => (
                <span key={i} className="inline-block">
                    {word.split("").map((char, j) => (
                        <motion.span key={j} custom={i * 5 + j} initial={{ opacity: 0, y: 50 }} animate={textControls} style={{ display: 'inline-block' }}>
                            {char}
                        </motion.span>
                    ))}
                    {i < headline.split(" ").length - 1 && <span>&nbsp;</span>}
                </span>
            ))}
        </h1>
        <motion.p
          custom={headline.length}
          initial={{ opacity: 0, y: 30 }}
          animate={textControls}
          className="mx-auto mt-8 max-w-xl text-lg text-slate-300"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          Construimos la herramienta exacta que necesitas. Sin plantillas, sin mensualidades — solo software que trabaja para ti.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={buttonControls} className="mt-10 flex flex-wrap gap-4 justify-center">
          <a href="#portafolio" className="rounded-full bg-white/10 border-2 border-white/20 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Ver portafolio
          </a>
          <a href="https://wa.me/573164134212" target="_blank" rel="noopener noreferrer" className="rounded-full bg-violet-600/80 border-2 border-violet-400/30 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-violet-600" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            Hablemos
          </a>
        </motion.div>
      </div>
    </div>
  );
};

// --- Navigation Component ---
const NAV_LINKS = [
  { label: 'Servicios',  href: '#servicios'  },
  { label: 'Portafolio', href: '#portafolio' },
  { label: 'Nosotros',   href: '#nosotros'   },
];

const NavLogo = () => (
  <a href="#" className="flex items-center gap-2 no-underline">
    <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none">
      <path d="M7 8L3 12L7 16" stroke="url(#ng1)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 8L21 12L17 16" stroke="url(#ng2)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 4L10 20" stroke="url(#ng3)" strokeWidth="2.2" strokeLinecap="round"/>
      <defs>
        <linearGradient id="ng1" x1="3" y1="12" x2="7" y2="12" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#06b6d4"/></linearGradient>
        <linearGradient id="ng2" x1="17" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#06b6d4"/></linearGradient>
        <linearGradient id="ng3" x1="10" y1="4" x2="14" y2="20" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#06b6d4"/></linearGradient>
      </defs>
    </svg>
    <span className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      Nex<span style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Code97</span>
    </span>
  </a>
);

const HeroNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }}
      className="absolute top-0 left-0 right-0 z-20"
    >
      {/* ── Desktop bar ── */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <NavLogo />

        {/* Links centro */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/573164134212"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/16 hover:border-violet-400/50"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            {/* WhatsApp icon */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-green-400" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Hablemos
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-[5px] p-2 rounded-lg hover:bg-white/8 transition-colors"
            aria-label="Menú"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-black/80 backdrop-blur-xl"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/8 transition-all"
                  style={{ fontFamily: "var(--font-inter), sans-serif" }}
                >
                  {label}
                </a>
              ))}
              <a
                href="https://wa.me/573164134212"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-violet-600/80 border border-violet-400/30 px-5 py-3 text-sm font-semibold text-white"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Hablemos por WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// --- Three.js Canvas Component ---
const WovenCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

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
        
        const mouseWorld = new THREE.Vector3(mouse.x * 3, mouse.y * 3, 0);

        for (let i = 0; i < particleCount; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            const currentPos = new THREE.Vector3(positions[ix], positions[iy], positions[iz]);
            const originalPos = new THREE.Vector3(originalPositions[ix], originalPositions[iy], originalPositions[iz]);
            const velocity = new THREE.Vector3(velocities[ix], velocities[iy], velocities[iz]);

            const dist = currentPos.distanceTo(mouseWorld);
            if (dist < 1.5) {
                const force = (1.5 - dist) * 0.01;
                const direction = new THREE.Vector3().subVectors(currentPos, mouseWorld).normalize();
                velocity.add(direction.multiplyScalar(force));
            }

            // Return to original position
            const returnForce = new THREE.Vector3().subVectors(originalPos, currentPos).multiplyScalar(0.001);
            velocity.add(returnForce);
            
            // Damping
            velocity.multiplyScalar(0.95);

            positions[ix] += velocity.x;
            positions[iy] += velocity.y;
            positions[iz] += velocity.z;
            
            velocities[ix] = velocity.x;
            velocities[iy] = velocity.y;
            velocities[iz] = velocity.z;
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
        mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};


export default WovenLightHero;
