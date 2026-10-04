import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { PreciosCrm } from "./precios-crm";

export const metadata: Metadata = {
  title: "Precios del CRM | NexCode97",
  description: "Un precio fijo por el CRM. WhatsApp y la IA, directo con cada proveedor y sin recargo. Planes Starter, Growth y Business.",
  alternates: { canonical: "/precios" },
};

export default function Precios() {
  return (
    <main className="flex-1" style={{ background: "#09090e" }}>
      <PreciosCrm />
      <SiteFooter />
    </main>
  );
}
