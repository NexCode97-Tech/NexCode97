import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * La imagen al compartir un enlace del sitio (WhatsApp, Facebook, X, LinkedIn): el logo de NexCode97 sobre negro,
 * cuadrada: WhatsApp la muestra entera sin deformarla, y Facebook y LinkedIn la recortan arriba y abajo, así que el
 * logo y el texto van en la franja del centro. Cada página pone su subtítulo.
 */
export const TAMANO_COMPARTIR = { width: 1200, height: 1200 };

export async function imagenCompartir(subtitulo: string) {
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/icon-512.png"))).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#09090e", gap: 30 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse dibuja <img>, no next/image */}
        <img src={logo} width={300} height={300} alt="" />
        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, color: "#f4f4f6", letterSpacing: -1 }}>NexCode97</div>
        <div style={{ display: "flex", fontSize: 38, color: "#FFF200" }}>{subtitulo}</div>
      </div>
    ),
    TAMANO_COMPARTIR,
  );
}
