import {
  Instagram,
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { icon: Instagram,      label: "Instagram", href: "https://instagram.com/nexcode97" },
  { icon: MessageCircle,  label: "WhatsApp",  href: "https://wa.me/573006359008" },
  { icon: Github,         label: "GitHub",    href: "https://github.com/NexCode97" },
  { icon: Linkedin,       label: "LinkedIn",  href: "https://linkedin.com/company/nexcode97" },
];

const serviciosLinks = [
  { text: "Apps web a la medida",  href: "#servicios" },
  { text: "Apps móviles",          href: "#servicios" },
  { text: "Páginas y landings",    href: "#servicios" },
  { text: "Sistemas de gestión",   href: "#servicios" },
  { text: "Tiendas en línea",      href: "#servicios" },
  { text: "Integraciones y PWA",   href: "#servicios" },
];

const empresaLinks = [
  { text: "Nosotros",     href: "#nosotros" },
  { text: "Testimonios",  href: "#testimonios" },
  { text: "NexTechnology",href: "#" },
];

const contactInfo = [
  { icon: MessageCircle, text: "+57 300 635 9008",       href: "https://wa.me/573006359008" },
  { icon: Mail,          text: "hola@nexcode97.com",     href: "mailto:hola@nexcode97.com" },
  { icon: MapPin,        text: "Colombia",               href: "#", isAddress: true },
];

export function SiteFooter() {
  return (
    <footer
      className="w-full place-self-end"
      style={{ background: "#060609", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-8 lg:pt-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-extrabold text-white shrink-0"
                style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", letterSpacing: "-0.03em" }}
              >
                N97
              </div>
              <span className="text-lg font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
                NexCode97
              </span>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Construimos el software exacto que tu negocio necesita. Sin plantillas, sin mensualidades. Solo código que trabaja para ti.
            </p>

            <ul className="mt-7 flex gap-4">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 hover:scale-110"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                    aria-label={label}
                  >
                    <Icon className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-2">

            {/* Servicios */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-5" style={{ color: "#a78bfa" }}>
                Servicios
              </p>
              <ul className="space-y-3">
                {serviciosLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="text-sm transition-colors duration-150 hover:text-white"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-5" style={{ color: "#a78bfa" }}>
                Empresa
              </p>
              <ul className="space-y-3">
                {empresaLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="text-sm transition-colors duration-150 hover:text-white"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-5" style={{ color: "#a78bfa" }}>
                Contacto
              </p>
              <ul className="space-y-3">
                {contactInfo.map(({ icon: Icon, text, href, isAddress }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="flex items-start gap-2.5 text-sm transition-colors duration-150 hover:text-white"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      <Icon className="size-4 shrink-0 mt-0.5" style={{ color: "#a78bfa" }} />
                      {isAddress ? (
                        <address className="not-italic">{text}</address>
                      ) : (
                        <span>{text}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col items-center justify-between gap-4 sm:flex-row"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} NexCode97. Todos los derechos reservados.
          </p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
            Hecho con
            <span className="text-red-500">❤</span>
            en Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
