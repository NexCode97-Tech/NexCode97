"use client"

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"

const testimonials = [
  {
    id: 1,
    name: "Gerente General",
    role: "Gerente General",
    company: "Natural Ropa Deportiva",
    content:
      "NexCode97 transformó por completo la forma en que gestionamos nuestra empresa. Antes todo era en papel y WhatsApp. Hoy tenemos un sistema completo con producción, ventas e inventario. El equipo entendió nuestro negocio desde el primer día y entregó exactamente lo que necesitábamos.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    name: "Director Deportivo",
    role: "Director Deportivo",
    company: "VeloClub",
    content:
      "Buscábamos una solución para digitalizar la gestión de nuestro club de ciclismo y NexCode97 la construyó desde cero. Control de membresías, asistencia y pagos en una sola plataforma. Sin mensualidades, sin letra pequeña.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 3,
    name: "Coordinador Académico",
    role: "Coordinador Académico",
    company: "Grupo 500",
    content:
      "La plataforma que nos construyeron maneja estudiantes, pagos en cuotas, certificados y WhatsApp automático. Todo conectado. Lo que antes nos tomaba horas ahora es automático.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 4,
    name: "Fundador",
    role: "Fundador",
    company: "Guevara Sport",
    content:
      "Rápidos, profesionales y sin vueltas. Nos entregaron el sitio web en el tiempo acordado y con una calidad que no esperábamos a ese precio.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
]

export function TestimoniosSection() {
  return (
    <AnimatedTestimonials
      title="Cada testimonio fue un problema que resolvimos."
      subtitle="Empresas reales que confiaron en NexCode97 para construir su software a la medida."
      badgeText="Testimonios"
      testimonials={testimonials}
      autoRotateInterval={6000}
    />
  )
}
