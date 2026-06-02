"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonios = [
  {
    id: "ntrl",
    empresa: "Natural Ropa Deportiva",
    logo: "/logos/logo-ntrl.webp",
    texto:
      "NexCode97 transformó por completo la forma en que gestionamos nuestra empresa. Antes todo era en papel y WhatsApp. Hoy tenemos un sistema completo con producción, ventas e inventario. El equipo entendió nuestro negocio desde el primer día y entregó exactamente lo que necesitábamos.",
    autor: "Gerente General",
    empresa_corta: "Natural Ropa Deportiva",
    initials: "NR",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "veloclub",
    empresa: "VeloClub",
    logo: "/logos/logo-veloclub.webp",
    texto:
      "Buscábamos una solución para digitalizar la gestión de nuestro club de ciclismo y NexCode97 la construyó desde cero. Control de membresías, asistencia y pagos en una sola plataforma. Sin mensualidades, sin letra pequeña.",
    autor: "Director Deportivo",
    empresa_corta: "VeloClub",
    initials: "VC",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "grupo500",
    empresa: "Grupo 500",
    logo: "/logos/logo-grupo500.webp",
    texto:
      "La plataforma que nos construyeron maneja estudiantes, pagos en cuotas, certificados y WhatsApp automático. Todo conectado. Lo que antes nos tomaba horas ahora es automático.",
    autor: "Coordinador Académico",
    empresa_corta: "Grupo 500",
    initials: "G5",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "gvr",
    empresa: "Guevara Sport",
    logo: "/logos/logo-gvr.webp",
    texto:
      "Rápidos, profesionales y sin vueltas. Nos entregaron el sitio web en el tiempo acordado y con una calidad que no esperábamos a ese precio.",
    autor: "Fundador",
    empresa_corta: "Guevara Sport",
    initials: "GS",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

export function TestimoniosSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="testimonios"
      className="py-24"
      style={{ background: "#09090e" }}
    >
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-xl space-y-4 text-center"
        >
          <p className="text-xs font-bold tracking-[0.14em] uppercase flex items-center justify-center gap-3"
            style={{ color: "#22d3ee" }}>
            <span className="inline-block w-2 h-2 rounded-full"
              style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }} />
            Testimonios
          </p>
          <h2 className="text-4xl font-extrabold leading-tight" style={{ color: "#fff" }}>
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#888ca4" }}>
            Empresas reales que confiaron en NexCode97 para construir su software a la medida.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">

          {/* Card grande — NTRL */}
          <motion.div
            className="sm:col-span-2 lg:row-span-2"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full grid grid-rows-[auto_1fr] gap-6 p-6"
              style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <CardHeader className="p-0">
                <img
                  src="/logos/logo-ntrl.webp"
                  alt="Natural Ropa Deportiva"
                  className="h-8 w-auto object-contain opacity-80"
                />
              </CardHeader>
              <CardContent className="p-0">
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                  <p className="text-lg font-medium leading-relaxed" style={{ color: "#e2e8f0" }}>
                    "{testimonios[0].texto}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11">
                      <AvatarImage src={testimonios[0].avatar} alt={testimonios[0].autor} />
                      <AvatarFallback style={{ background: "rgba(124,58,237,0.3)", color: "#a78bfa" }}>
                        {testimonios[0].initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <cite className="text-sm font-semibold not-italic" style={{ color: "#fff" }}>
                        {testimonios[0].autor}
                      </cite>
                      <span className="block text-xs" style={{ color: "#888ca4" }}>
                        {testimonios[0].empresa_corta}
                      </span>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card VeloClub — ancho 2 */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <CardContent className="h-full pt-6">
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                  <p className="text-base font-medium leading-relaxed" style={{ color: "#cbd5e1" }}>
                    "{testimonios[1].texto}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11">
                      <AvatarImage src={testimonios[1].avatar} alt={testimonios[1].autor} />
                      <AvatarFallback style={{ background: "rgba(124,58,237,0.3)", color: "#a78bfa" }}>
                        {testimonios[1].initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <cite className="text-sm font-semibold not-italic" style={{ color: "#fff" }}>
                        {testimonios[1].autor}
                      </cite>
                      <span className="block text-xs" style={{ color: "#888ca4" }}>
                        {testimonios[1].empresa_corta}
                      </span>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card Grupo 500 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="h-full"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <CardContent className="h-full pt-6">
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                  <p className="text-sm leading-relaxed" style={{ color: "#cbd5e1" }}>
                    "{testimonios[2].texto}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11">
                      <AvatarImage src={testimonios[2].avatar} alt={testimonios[2].autor} />
                      <AvatarFallback style={{ background: "rgba(124,58,237,0.3)", color: "#a78bfa" }}>
                        {testimonios[2].initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <cite className="text-sm font-semibold not-italic" style={{ color: "#fff" }}>
                        {testimonios[2].autor}
                      </cite>
                      <span className="block text-xs" style={{ color: "#888ca4" }}>
                        {testimonios[2].empresa_corta}
                      </span>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card Guevara Sport */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <CardContent className="h-full pt-6">
                <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                  <p className="text-sm leading-relaxed" style={{ color: "#cbd5e1" }}>
                    "{testimonios[3].texto}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-11">
                      <AvatarImage src={testimonios[3].avatar} alt={testimonios[3].autor} />
                      <AvatarFallback style={{ background: "rgba(124,58,237,0.3)", color: "#a78bfa" }}>
                        {testimonios[3].initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <cite className="text-sm font-semibold not-italic" style={{ color: "#fff" }}>
                        {testimonios[3].autor}
                      </cite>
                      <span className="block text-xs" style={{ color: "#888ca4" }}>
                        {testimonios[3].empresa_corta}
                      </span>
                    </div>
                  </div>
                </blockquote>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
