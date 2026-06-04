import { Mail, MapPin } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  { icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/nexcode97?igsh=enVnc2pqNTVra2Mw" },
  { icon: FaWhatsapp,  label: "WhatsApp",  href: "https://wa.me/573006359008" },
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
  { text: "Nosotros",      href: "#nosotros" },
  { text: "Testimonios",   href: "#testimonios" },
  { text: "NexTechnology", href: "#" },
];

const contactInfo = [
  { icon: FaWhatsapp, text: "+57 300 635 9008",   href: "https://wa.me/573006359008" },
  { icon: Mail,       text: "nexcode97@gmail.com", href: "mailto:nexcode97@gmail.com" },
  { icon: MapPin,     text: "Colombia",            href: "#", isAddress: true },
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
            <Image
              src="/logo-nuevo.png"
              alt="NexCode97"
              width={180}
              height={54}
              className="h-12 w-auto object-contain"
            />

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/40">
              Construimos el software exacto que tu negocio necesita. Sin plantillas, sin mensualidades. Solo código que trabaja para ti.
            </p>

            <ul className="mt-7 flex gap-4">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition-all duration-150 hover:text-white hover:scale-110"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
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
              <p className="text-sm font-bold uppercase tracking-widest mb-5" style={{ color: "#ffffff" }}>
                Servicios
              </p>
              <ul className="space-y-3">
                {serviciosLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="text-sm text-white/40 transition-colors duration-150 hover:text-white"
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-5" style={{ color: "#ffffff" }}>
                Empresa
              </p>
              <ul className="space-y-3">
                {empresaLinks.map(({ text, href }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="text-sm text-white/40 transition-colors duration-150 hover:text-white"
                    >
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-5" style={{ color: "#ffffff" }}>
                Contacto
              </p>
              <ul className="space-y-3">
                {contactInfo.map(({ icon: Icon, text, href, isAddress }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="flex items-start gap-2.5 text-sm text-white/40 transition-colors duration-150 hover:text-white"
                    >
                      <Icon className="size-4 shrink-0 mt-0.5" style={{ color: "#ffffff" }} />
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
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} NexCode97. Todos los derechos reservados.
          </p>
          <p className="text-xs flex items-center gap-1.5 text-white/25">
            Hecho con
            <span className="text-red-500">❤</span>
            en Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
