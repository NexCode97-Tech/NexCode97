import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/site-footer";
import { DEPLOYS } from "@/lib/deploys";
import styles from "./deploys.module.css";

export const metadata: Metadata = {
  title: "Deploys | NexCode97",
  description: "Software que construimos en NexCode97 y que hoy está en producción: VeloClub y NexCode97 CRM.",
  alternates: { canonical: "/deploys" },
  openGraph: { title: "Deploys | NexCode97", description: "Software que construimos en NexCode97 y que hoy está en producción: VeloClub y NexCode97 CRM.", url: "/deploys", siteName: "NexCode97", locale: "es_CO", type: "website" },
  twitter: { card: "summary", title: "Deploys | NexCode97", description: "Software que construimos en NexCode97 y que hoy está en producción: VeloClub y NexCode97 CRM." },
};

function Externo() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Candado() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
}
function Flecha() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Deploys() {
  return (
    <main className={styles.raiz}>
      <div className={styles.envoltura}>
        <section className={styles.cab}>
          <h1>Deploys</h1>
          <p>Software que construimos y que hoy está en producción, atendiendo usuarios reales todos los días.</p>
        </section>

        <section className={styles.proyectos} aria-label="Proyectos en producción">
          {DEPLOYS.map((d, i) => (
            <article key={d.id} className={`${styles.proyecto} ${i % 2 ? styles.inverso : ""}`}>
              <a className={styles.marco} href={d.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${d.nombre}`}>
                <div className={styles.chrome}><i /><i /><i /><span className={styles.url}><Candado />{d.dominio}</span></div>
                <Image src={d.imagen} alt={d.alt} width={1200} height={750} sizes="(max-width: 960px) 100vw, 680px" priority={i === 0} unoptimized />
              </a>
              <div className={styles.info}>
                <h2 className={styles.nombre}>{d.nombre}</h2>
                <p className={styles.tipo}>{d.tipo}</p>
                <p>{d.descripcion}</p>
                <dl className={styles.datos}>
                  <dt>Tipo</dt><dd>{d.datos.tipo}</dd>
                  <dt>Modelo</dt><dd>{d.datos.modelo}</dd>
                  <dt>Tecnología</dt>
                  <dd><span className={styles.etiquetas}>{d.tecnologias.map((t) => <span key={t}>{t}</span>)}</span></dd>
                </dl>
                <div className={styles.acciones}>
                  <a className={styles.ver} href={d.url} target="_blank" rel="noopener noreferrer">Ver en vivo <Externo /></a>
                  {d.precios && <a className={styles.precios} href={d.precios}>Ver precios <Flecha /></a>}
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className={styles.cierre} aria-label="Contacto">
          <div>
            <h2>¿Tu proyecto es el siguiente?</h2>
            <p>Cuéntanos qué necesitas y te enviamos una propuesta.</p>
          </div>
          <a href="https://wa.me/573006359008" target="_blank" rel="noopener noreferrer">Cotizar mi proyecto <Flecha /></a>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
