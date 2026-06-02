"use client";

import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import {
  Monitor,
  Smartphone,
  Globe,
  LayoutDashboard,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { ExpandingCards, CardItem } from "@/components/ui/expanding-cards";

const SERVICES: CardItem[] = [
  {
    id: "apps-web",
    title: "Apps web a la medida",
    description:
      "Plataformas completas con lógica de negocio, roles, dashboards y flujos personalizados. Construidas para escalar desde el día uno.",
    imgSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    icon: <Monitor size={22} />,
    linkHref: "#contacto",
  },
  {
    id: "apps-moviles",
    title: "Apps móviles",
    description:
      "Aplicaciones nativas y multiplataforma para iOS y Android, con experiencias fluidas y diseño adaptado a cada dispositivo.",
    imgSrc: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
    icon: <Smartphone size={22} />,
    linkHref: "#contacto",
  },
  {
    id: "paginas-web",
    title: "Páginas web y landings",
    description:
      "Sitios corporativos, portafolios y landing pages de alto impacto visual optimizados para convertir visitantes en clientes.",
    imgSrc: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80",
    icon: <Globe size={22} />,
    linkHref: "#contacto",
  },
  {
    id: "sistemas-gestion",
    title: "Sistemas de gestión",
    description:
      "ERPs, CRMs y herramientas internas que automatizan tus procesos, eliminan el papel y centralizan la información de tu empresa.",
    imgSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    icon: <LayoutDashboard size={22} />,
    linkHref: "#contacto",
  },
  {
    id: "ecommerce",
    title: "Tiendas en línea",
    description:
      "E-commerce completo con catálogo, carrito, pagos en línea y panel de administración para gestionar tu inventario y pedidos.",
    imgSrc: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    icon: <ShoppingCart size={22} />,
    linkHref: "#contacto",
  },
  {
    id: "integraciones",
    title: "Integraciones y PWA",
    description:
      "Conectamos tu sistema con pagos, WhatsApp, correo y APIs externas. También desarrollamos PWAs instalables sin tienda de apps.",
    imgSrc: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    icon: <Zap size={22} />,
    linkHref: "#contacto",
  },
];

export const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} id="servicios" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-xs font-bold tracking-[0.14em] uppercase mb-4 flex items-center gap-3"
            style={{ color: "#22d3ee" }}>
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }} />
            Servicios
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ letterSpacing: "-0.04em", color: "#09090e" }}>
            Lo que construimos
          </h2>
          <p className="text-sm max-w-md leading-relaxed" style={{ color: "#475569" }}>
            Soluciones digitales a la medida para cualquier tipo de negocio. Pasa el cursor sobre cada servicio.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center"
        >
          <ExpandingCards items={SERVICES} defaultActiveIndex={0} />
        </motion.div>
      </div>
    </section>
  );
};
