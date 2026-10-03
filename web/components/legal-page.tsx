import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { PAGINAS_LEGALES, RESPONSABLE, VIGENCIA } from "@/lib/legal";

/** Marco común de las páginas legales: título, fecha de vigencia, índice entre documentos y el texto. */
export function LegalPage({ ruta, titulo, resumen, children }: { ruta: string; titulo: string; resumen: string; children: React.ReactNode }) {
  return (
    <main style={{ background: "#09090e" }} className="flex-1">
      <div className="mx-auto max-w-3xl px-4 pt-28 pb-20 sm:px-6 sm:pt-32">
        <nav aria-label="Documentos legales" className="mb-10 flex flex-wrap gap-2">
          {PAGINAS_LEGALES.map(p => (
            <Link
              key={p.href}
              href={p.href}
              aria-current={p.href === ruta ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${p.href === ruta ? "bg-[#FFF200] text-black" : "text-white/55 hover:text-white"}`}
              style={p.href === ruta ? undefined : { border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {p.titulo}
            </Link>
          ))}
        </nav>
        <h1 className="text-3xl font-extrabold tracking-tight text-white text-balance sm:text-4xl">{titulo}</h1>
        <p className="mt-3 text-sm text-white/40">Vigente desde el {VIGENCIA}</p>
        <p className="mt-6 text-base leading-relaxed text-white/70 text-pretty">{resumen}</p>
        <div className="legal mt-10">{children}</div>
        <p className="legal-pie mt-14 border-t pt-6 text-sm leading-relaxed text-white/40" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          {RESPONSABLE.marca} es una marca operada por {RESPONSABLE.nombre}, persona natural, NIT {RESPONSABLE.nit}, con domicilio en {RESPONSABLE.ciudad}.
          Escríbenos a <a href={`mailto:${RESPONSABLE.correo}`}>{RESPONSABLE.correo}</a>.
        </p>
      </div>
      <SiteFooter />
    </main>
  );
}

export function Seccion({ id, titulo, children }: { id?: string; titulo: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-10 first:mt-0 scroll-mt-28">
      <h2 className="text-xl font-bold tracking-tight text-white">{titulo}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

/** Los datos de quien responde, en una tabla corta. La dirección solo va donde la ley la exige (la política de datos). */
export function DatosResponsable({ conDireccion = false }: { conDireccion?: boolean }) {
  const filas: [string, React.ReactNode][] = [
    ["Responsable", `${RESPONSABLE.nombre}, persona natural, que opera la marca ${RESPONSABLE.marca}`],
    ["NIT", RESPONSABLE.nit],
    ["Domicilio", conDireccion ? RESPONSABLE.direccion : RESPONSABLE.ciudad],
    ["Correo", <a key="c" href={`mailto:${RESPONSABLE.correo}`}>{RESPONSABLE.correo}</a>],
    ["Teléfono y WhatsApp", RESPONSABLE.telefono],
    ["Sitio", RESPONSABLE.sitio.replace("https://", "")],
  ];
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-xl p-5 text-sm sm:grid-cols-[auto_1fr]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      {filas.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="font-semibold text-white">{k}</dt>
          <dd className="text-white/70">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
