"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const achievements = [
  { label: "Proyectos entregados", value: "15+",  count: 15,  suffix: "+" },
  { label: "Clientes satisfechos", value: "100%", count: 100, suffix: "%" },
  { label: "Años de experiencia",  value: "5+",   count: 5,   suffix: "+" },
  { label: "Tecnologías dominadas",value: "20+",  count: 20,  suffix: "+" },
];

function CountUp({ to, suffix, duration = 1.6, start }: { to: number; suffix: string; duration?: number; start: boolean }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!start) return;
    setCurrent(0);
    const steps = 40;
    const stepTime = (duration * 1000) / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * to));
      if (step >= steps) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [start, to, duration]);

  return <>{current}{suffix}</>;
}

function StatsBlock() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className="relative mt-6 overflow-hidden rounded-2xl p-10 md:p-14"
      style={{
        background: "#f8f7ff",
        border: "1px solid rgba(124,58,237,0.12)",
      }}
    >
      <div className="flex flex-col gap-3 text-center md:text-left">
        <h3 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#09090e" }}>
          Números que respaldan el trabajo
        </h3>
        <p className="max-w-lg text-sm leading-relaxed" style={{ color: "#475569" }}>
          Cada proyecto es un compromiso. Estos son los resultados de cumplirlo.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-between gap-10 text-center">
        {achievements.map((item, i) => (
          <motion.div
            key={item.label}
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
          >
            <p className="text-sm" style={{ color: "#475569" }}>{item.label}</p>
            <span
              className="text-5xl md:text-6xl font-extrabold tabular-nums"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <CountUp to={item.count} suffix={item.suffix} start={inView} duration={1.4 + i * 0.15} />
            </span>
          </motion.div>
        ))}
      </div>

      {/* Grid decorativo */}
      <div
        className="pointer-events-none absolute -top-1 right-1 z-10 hidden h-full w-full md:block"
        style={{
          backgroundImage: "linear-gradient(to right,#a78bfa 1px,transparent 1px),linear-gradient(to bottom,#a78bfa 1px,transparent 1px)",
          backgroundSize: "80px 80px",
          opacity: 0.06,
          maskImage: "linear-gradient(to bottom right,#000,transparent,transparent)",
        }}
      />
    </motion.div>
  );
}

export function NosotrosSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="nosotros"
      className="py-32"
      style={{ background: "#ffffff" }}
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 grid gap-6 md:grid-cols-2 md:items-end"
        >
          <div>
            <p
              className="text-xs font-bold tracking-[0.14em] uppercase mb-4 flex items-center gap-3"
              style={{ color: "#7c3aed" }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}
              />
              Nosotros
            </p>
            <h2
              className="text-4xl md:text-5xl font-extrabold leading-tight"
              style={{ color: "#09090e" }}
            >
              Quiénes somos
            </h2>
          </div>
          <p
            className="text-base leading-relaxed"
            style={{ color: "#475569" }}
          >
            NexCode97 es un equipo de desarrollo especializado en construir
            sistemas a la medida. No vendemos plantillas — construimos la
            solución exacta que tu negocio necesita, sin mensualidades y con
            código que tú posees.
          </p>
        </motion.div>

        {/* ── Grid imágenes ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="grid gap-6 lg:grid-cols-3"
        >
          {/* Imagen principal */}
          <div className="relative overflow-hidden rounded-2xl lg:col-span-2" style={{ maxHeight: "560px" }}>
            <Image
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80"
              alt="Equipo NexCode97 colaborando en un proyecto"
              width={1400}
              height={900}
              className="w-full h-full object-cover"
              quality={100}
            />
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(to top, rgba(9,9,14,0.55) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col gap-6 md:flex-row lg:flex-col">

            {/* Breakout card */}
            <div
              className="flex flex-col justify-between gap-6 rounded-2xl p-7 md:w-1/2 lg:w-auto"
              style={{
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.25)",
              }}
            >
              {/* Badge N97 */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0"
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
                  color: "#fff",
                  letterSpacing: "-0.03em",
                }}
              >
                N97
              </div>

              <div>
                <p
                  className="mb-2 text-lg font-bold"
                  style={{ color: "#09090e" }}
                >
                  Sin mensualidades. Sin excusas.
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#475569" }}
                >
                  Pago único, producto tuyo para siempre. Creemos que un
                  software bien hecho no debería costarte eternamente.
                </p>
              </div>

              <a
                href="https://wa.me/573164134212"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="rounded-full text-sm cursor-pointer transition-colors duration-200"
                  style={{
                    borderColor: "rgba(124,58,237,0.4)",
                    color: "#a78bfa",
                    background: "transparent",
                  }}
                >
                  Hablemos →
                </Button>
              </a>
            </div>

            {/* Imagen secundaria */}
            <div className="relative grow min-h-[180px] overflow-hidden rounded-2xl md:w-1/2 lg:w-auto">
              <Image
                src="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=80"
                alt="Setup de desarrollo NexCode97"
                fill
                className="object-cover"
                quality={100}
              />
            </div>
          </div>
        </motion.div>

        {/* ── Achievements ── */}
        <StatsBlock />

      </div>
    </section>
  );
}
