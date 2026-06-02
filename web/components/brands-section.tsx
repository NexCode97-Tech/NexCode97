"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const BRANDS = [
  { name: "Natural Ropa Deportiva", src: "/logos/logo-ntrl.png" },
  { name: "Guevara Sport",          src: "/logos/logo-gvr.png" },
  { name: "VeloClub",               src: "/logos/logo-veloclub.png" },
  { name: "Grupo 500",              src: "/logos/logo-grupo500.png" },
];

export const BrandsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative z-10 py-20" style={{ background: "#09090e" }}>
      {/* Divider top */}
      <div className="h-px mx-auto max-w-5xl" style={{ background: "linear-gradient(90deg,transparent,rgba(124,58,237,.4) 30%,rgba(6,182,212,.3) 70%,transparent)" }} />

      <div className="max-w-5xl mx-auto px-6 pt-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-xs font-bold tracking-[0.14em] uppercase mb-10"
          style={{ color: "#3d3f52", fontFamily: "'Inter', sans-serif" }}
        >
          Empresas que confían en NexCode97
        </motion.p>

        {/* Grid de logos */}
        <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden border"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          {BRANDS.map(({ name, src }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group flex items-center justify-center py-10 px-8 transition-colors duration-300 cursor-default"
              style={{
                borderRight: i % 4 !== 3 ? "1px solid rgba(255,255,255,0.07)" : undefined,
                borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.07)" : undefined,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <Image
                src={src}
                alt={name}
                width={120}
                height={48}
                className="object-contain max-h-12 w-auto transition-all duration-300 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
