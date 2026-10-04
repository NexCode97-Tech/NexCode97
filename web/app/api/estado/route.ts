import { NextResponse } from "next/server";
import { DEPLOYS } from "@/lib/deploys";

/**
 * Estado en vivo de los proyectos de /deploys: si responden y en cuánto tiempo. Lo mide el servidor (el navegador no
 * puede consultar otros dominios por la CSP) y la respuesta queda en la caché de Vercel 60 segundos, así que los
 * proyectos se consultan como mucho una vez por minuto sin importar cuántas visitas haya.
 */
export const dynamic = "force-dynamic";

async function medir(url: string) {
  const inicio = performance.now();
  try {
    const r = await fetch(url, { method: "GET", redirect: "follow", cache: "no-store", signal: AbortSignal.timeout(6000) });
    return { ok: r.status < 500, ms: Math.round(performance.now() - inicio) };
  } catch {
    return { ok: false, ms: null };
  }
}

export async function GET() {
  const resultados = await Promise.all(DEPLOYS.map(async (d) => ({ id: d.id, ...(await medir(d.url)) })));
  return NextResponse.json(
    { revisado: new Date().toISOString(), proyectos: resultados },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
