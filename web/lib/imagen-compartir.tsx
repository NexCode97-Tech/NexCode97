import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * La imagen al compartir un enlace del sitio (WhatsApp, Facebook, X, LinkedIn): el logo de NexCode97 y el nombre
 * sobre negro, cuadrada. WhatsApp la muestra como miniatura de ~120 px, así que no lleva texto pequeño; Facebook y
 * LinkedIn la recortan a 1200×630 por el centro, y el logo y el nombre caben justo en esa franja.
 */
export const TAMANO_COMPARTIR = { width: 1200, height: 1200 };

export async function imagenCompartir() {
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/icon-512.png"))).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#09090e", gap: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse dibuja <img>, no next/image */}
        <img src={logo} width={480} height={480} alt="" />
        <div style={{ display: "flex", fontSize: 112, fontWeight: 700, color: "#f4f4f6", letterSpacing: -2 }}>NexCode97</div>
      </div>
    ),
    TAMANO_COMPARTIR,
  );
}
