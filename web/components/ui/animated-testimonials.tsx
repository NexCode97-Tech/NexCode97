"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Quote, Star } from "lucide-react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
}

export interface AnimatedTestimonialsProps {
  title?: string
  subtitle?: string
  badgeText?: string
  testimonials?: Testimonial[]
  autoRotateInterval?: number
  className?: string
}

export function AnimatedTestimonials({
  title = "Cada testimonio fue un problema que resolvimos.",
  subtitle = "Empresas reales que confiaron en NexCode97 para construir su software a la medida.",
  badgeText = "Testimonios",
  testimonials = [],
  autoRotateInterval = 6000,
  className,
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const controls = useAnimation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  useEffect(() => {
    if (isInView) controls.start("visible")
  }, [isInView, controls])

  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, autoRotateInterval)
    return () => clearInterval(interval)
  }, [autoRotateInterval, testimonials.length])

  if (testimonials.length === 0) return null

  return (
    <section
      ref={sectionRef}
      id="testimonios"
      className={`py-24 overflow-hidden ${className ?? ""}`}
      style={{ background: "#09090e" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 gap-16 w-full md:grid-cols-2 lg:gap-24 items-center"
        >
          {/* Izquierda — título y navegación */}
          <motion.div variants={itemVariants} className="flex flex-col justify-center">
            <div className="space-y-6">
              {badgeText && (
                <p className="text-xs font-bold tracking-[0.14em] uppercase flex items-center gap-3"
                  style={{ color: "#22d3ee" }}>
                  <span className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }} />
                  {badgeText}
                </p>
              )}

              <h2 className="text-4xl font-extrabold leading-tight" style={{ color: "#fff" }}>
                {title}
              </h2>

              <p className="text-sm leading-relaxed" style={{ color: "#888ca4" }}>
                {subtitle}
              </p>

              {/* Puntos de navegación */}
              <div className="flex items-center gap-3 pt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className="h-2.5 rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      width: activeIndex === index ? "2.5rem" : "0.625rem",
                      background: activeIndex === index
                        ? "linear-gradient(135deg,#7c3aed,#06b6d4)"
                        : "rgba(255,255,255,0.2)",
                    }}
                    aria-label={`Ver testimonio ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Derecha — tarjetas */}
          <motion.div variants={itemVariants} className="relative min-h-[360px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 80 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 80,
                  scale: activeIndex === index ? 1 : 0.95,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ zIndex: activeIndex === index ? 10 : 0 }}
              >
                <div
                  className="rounded-2xl p-8 h-full flex flex-col"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {/* Estrellas */}
                  <div className="mb-5 flex gap-1.5">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Cita */}
                  <div className="relative mb-6 flex-1">
                    <Quote className="absolute -top-1 -left-1 h-7 w-7 rotate-180" style={{ color: "rgba(124,58,237,0.3)" }} />
                    <p className="relative z-10 text-base font-medium leading-relaxed pl-5" style={{ color: "#e2e8f0" }}>
                      "{testimonial.content}"
                    </p>
                  </div>

                  <Separator className="my-4" />

                  {/* Autor */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-11 w-11 border" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback style={{ background: "rgba(124,58,237,0.3)", color: "#a78bfa" }}>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-sm font-semibold" style={{ color: "#fff" }}>{testimonial.name}</h3>
                      <p className="text-xs" style={{ color: "#888ca4" }}>
                        {testimonial.role} · {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Decorativos */}
            <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-xl pointer-events-none"
              style={{ background: "rgba(124,58,237,0.06)" }} />
            <div className="absolute -top-6 -right-6 h-20 w-20 rounded-xl pointer-events-none"
              style={{ background: "rgba(6,182,212,0.06)" }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
