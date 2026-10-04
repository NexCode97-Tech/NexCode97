"use client";

import { useEffect, useState } from "react";
import styles from "./deploys.module.css";

type Estado = { ok: boolean; ms: number | null } | null;

/** La etiqueta «En producción · 142 ms» de cada proyecto: pregunta a /api/estado al cargar y cada minuto. */
export function EstadoVivo({ id }: { id: string }) {
  const [estado, setEstado] = useState<Estado>(null);

  useEffect(() => {
    let vivo = true;
    const revisar = () =>
      fetch("/api/estado")
        .then((r) => r.json())
        .then((d: { proyectos: { id: string; ok: boolean; ms: number | null }[] }) => {
          const p = d.proyectos.find((x) => x.id === id);
          if (vivo && p) setEstado({ ok: p.ok, ms: p.ms });
        })
        .catch(() => {});
    revisar();
    const t = setInterval(revisar, 60_000);
    return () => { vivo = false; clearInterval(t); };
  }, [id]);

  if (!estado) {
    return <span className={`${styles.vivo} ${styles.revisando}`}><span className={styles.pulso} aria-hidden="true" />Comprobando…</span>;
  }
  if (!estado.ok) {
    return <span className={`${styles.vivo} ${styles.caido}`}><span className={styles.pulso} aria-hidden="true" />Sin respuesta</span>;
  }
  return (
    <span className={styles.vivo}>
      <span className={styles.pulso} aria-hidden="true" />En producción
      {estado.ms !== null && <small className={styles.num}>· {estado.ms} ms</small>}
    </span>
  );
}
