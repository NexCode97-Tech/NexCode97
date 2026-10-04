/** Proyectos en producción que se muestran en /deploys. La URL es la que se consulta para el estado en vivo. */
export const DEPLOYS = [
  {
    id: "veloclub",
    nombre: "VeloClub",
    tipo: "Plataforma para clubes deportivos",
    descripcion:
      "Inscripciones, control de asistencia, mensualidades, sedes y resultados de cada deportista en un solo lugar. Hoy la usan clubes de patinaje, ciclismo y atletismo en Colombia.",
    url: "https://www.veloclubtech.com",
    dominio: "veloclubtech.com",
    imagen: "/deploys/veloclub.jpg",
    alt: "Página de inicio de VeloClub: Tecnología que mueve al club",
    datos: { tipo: "SaaS · App instalable (PWA)", modelo: "Suscripción mensual por club" },
    tecnologias: ["Next.js", "Express", "PostgreSQL", "Clerk", "Cloudinary"],
    precios: null,
  },
  {
    id: "crm",
    nombre: "NexCode97 CRM",
    tipo: "Bandeja multicanal con agentes de IA",
    descripcion:
      "WhatsApp, Instagram, Messenger, Telegram, TikTok, correo y chat web en una sola bandeja compartida, con equipos, reparto automático, flujos y agentes de IA que responden con la información de cada empresa.",
    url: "https://www.nexcode97.com/crm/",
    dominio: "nexcode97.com/crm",
    imagen: "/deploys/crm-bandeja-hd.jpg",
    alt: "Bandeja del CRM de NexCode97: conversaciones, chat con el agente de IA y ficha del contacto (datos de ejemplo)",
    datos: { tipo: "SaaS multiempresa", modelo: "Suscripción, sin recargo sobre WhatsApp" },
    tecnologias: ["Node.js", "TypeScript", "Prisma", "PostgreSQL", "IA"],
    /** Página de planes, para el botón «Ver precios». */
    precios: "/precios",
  },
] as const;

export type IdDeploy = (typeof DEPLOYS)[number]["id"];
