"use client"

import Image from "next/image"
import { Sparkles } from "@/components/ui/sparkles"

const LOGOS = [
  { name: "Natural Ropa Deportiva", src: "/logos/logo-ntrl.webp",     w: 120, h: 48 },
  { name: "Guevara Sport",          src: "/logos/logo-gvr.webp",      w: 120, h: 48 },
  { name: "VeloClub",               src: "/logos/logo-veloclub.webp", w: 120, h: 48 },
  { name: "Grupo 500",              src: "/logos/logo-grupo500.webp", w: 56,  h: 56 },
]

export function BrandsSparkles() {
  return (
    <section className="w-full overflow-hidden" style={{ background: "#09090e" }}>
      {/* ── Logos ── */}
      <div className="mx-auto max-w-4xl px-6 pt-20 pb-4">
        <p className="mb-12 text-center text-xs font-bold tracking-[0.14em] uppercase"
          style={{ color: "#3d3f52", fontFamily: "var(--font-inter), sans-serif" }}>
          Empresas que confían en NexCode97
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-center justify-items-center">
          {LOGOS.map(({ name, src, w, h }) => (
            <Image
              key={name}
              src={src}
              alt={name}
              width={w}
              height={h}
              quality={100}
              className="object-contain opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
            />
          ))}
        </div>
      </div>

      {/* ── Sparkles ── */}
      <div className="relative -mt-16 h-80 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]">
        {/* glow de fondo */}
        <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#7c3aed,transparent_70%)] before:opacity-40" />

        {/* arco curvo */}
        <div className="absolute -left-1/2 top-1/2 aspect-[1/0.7] z-10 w-[200%] rounded-[100%] border-t"
          style={{ borderColor: "rgba(124,58,237,0.2)", background: "#09090e" }} />

        {/* partículas */}
        <Sparkles
          density={1200}
          speed={0.8}
          color="#a78bfa"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </div>
    </section>
  )
}
