import { prisma } from "@/lib/prisma";
import { DashboardClient } from "../dashboard-client";
import { updateLeadStatus, deleteLead } from "../actions";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  const stats = [
    { label: "Total leads", value: leads.length },
    { label: "Nuevos", value: leads.filter((l) => l.status === "nuevo").length },
    { label: "Contactados", value: leads.filter((l) => l.status === "contactado").length },
    { label: "Ganados", value: leads.filter((l) => l.status === "ganado").length },
  ];

  return (
    <div className="max-w-5xl">

      {/* Header de página */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "#1a1c1e", letterSpacing: "-0.03em" }}>
          Gestión de Leads
        </h1>
        <p className="text-sm mt-1" style={{ color: "#475569" }}>
          Administra tus prospectos y haz seguimiento de cada oportunidad.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl p-5"
            style={{ background: "#ffffff", border: "1px solid #edf2f7", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <p className="text-3xl font-black" style={{ color: "#1a1c1e", letterSpacing: "-0.03em" }}>{stat.value}</p>
            <p className="text-xs mt-1 font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Gestión interactiva */}
      <DashboardClient
        leads={leads}
        updateStatus={updateLeadStatus}
        deleteLead={deleteLead}
      />
    </div>
  );
}
