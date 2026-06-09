"use client";

import { useEffect, useRef, useState } from "react";

export function IntroSplash() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Bloquear scroll mientras el intro está visible
  useEffect(() => {
    if (hidden) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [hidden]);

  // Al terminar el video: avisar al hero, fade-out y luego desmontar
  const handleEnded = () => {
    setEnded(true);
    window.dispatchEvent(new Event("nexcode:intro-done"));
    setTimeout(() => setHidden(true), 600);
  };

  // Failsafe: si el video no arranca en 4s (red lenta, autoplay bloqueado),
  // no dejar al usuario atrapado en pantalla negra
  useEffect(() => {
    const failsafe = setTimeout(() => {
      const v = videoRef.current;
      if (v && (v.paused || v.readyState < 2)) {
        handleEnded();
      }
    }, 4000);
    return () => clearTimeout(failsafe);
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: "#000000",
        opacity: ended ? 0 : 1,
        transition: "opacity 600ms ease-out",
        pointerEvents: ended ? "none" : "auto",
      }}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        muted
        playsInline
        preload="auto"
        onCanPlayThrough={(e) => {
          // Reproducir solo cuando el buffer está completo: evita trabas al inicio
          const v = e.currentTarget;
          if (v.paused) v.play().catch(() => handleEnded());
        }}
        onEnded={handleEnded}
        className="rounded-2xl object-contain"
        style={{ width: "min(480px, 90vw)", height: "auto" }}
      />
    </div>
  );
}
