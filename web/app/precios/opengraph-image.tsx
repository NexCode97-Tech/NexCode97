import { ImageResponse } from "next/og";
import { PLANES } from "@/lib/precios-crm";

/** La imagen al compartir /precios (WhatsApp, Facebook, X, LinkedIn). Sale de PLANES: si cambia un precio, cambia sola. */
export const alt = "Precios del CRM de NexCode97: Starter, Growth y Business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Imagen() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#09090e", color: "#f4f4f6", padding: "64px 72px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: "#FFF200", color: "#09090e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800 }}>N</div>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>NexCode97 CRM</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", fontSize: 66, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>Precios del CRM</div>
          <div style={{ display: "flex", fontSize: 30, color: "#a1a1ad" }}>WhatsApp, Instagram, Messenger y más en una sola bandeja.</div>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {PLANES.map((p) => (
            <div key={p.id} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, padding: "22px 26px", borderRadius: 20, background: p.destacado ? "#FFF200" : "#16161e", color: p.destacado ? "#09090e" : "#f4f4f6", border: p.destacado ? "none" : "1px solid #2a2a35" }}>
              <div style={{ display: "flex", fontSize: 26, fontWeight: 700 }}>{p.nombre}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 50, fontWeight: 800, letterSpacing: -1 }}>USD {p.mensual}</span>
                <span style={{ fontSize: 22, opacity: 0.7 }}>al mes</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#a1a1ad" }}>
          <span>WhatsApp e IA sin recargo · 10 días gratis en Starter</span>
          <span style={{ color: "#FFF200", fontWeight: 700 }}>nexcode97.com/precios</span>
        </div>
      </div>
    ),
    size,
  );
}
