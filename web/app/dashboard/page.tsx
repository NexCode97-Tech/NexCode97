import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, TrendingUp, Users, Target, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  nuevo:      { label: "Nuevos",      color: "#a16207", bg: "#facc15" },
  contactado: { label: "Contactados", color: "#1d4ed8", bg: "#3b82f6" },
  ganado:     { label: "Ganados",     color: "#15803d", bg: "#10b981" },
  perdido:    { label: "Perdidos",    color: "#b91c1c", bg: "#ef4444" },
};

export default async function DashboardPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  const total = leads.length;
  const ganados = leads.filter((l) => l.status === "ganado").length;
  const nuevos = leads.filter((l) => l.status === "nuevo").length;
  const conversion = total > 0 ? Math.round((ganados / total) * 100) : 0;
  const scored = leads.filter((l) => l.score !== null);
  const avgScore = scored.length > 0
    ? Math.round(scored.reduce((sum, l) => sum + (l.score ?? 0), 0) / scored.length)
    : null;

  const byStatus = Object.keys(STATUS_META).map((s) => ({
    status: s,
    ...STATUS_META[s],
    count: leads.filter((l) => l.status === s).length,
  }));

  const recent = leads.slice(0, 5);

  const kpis = [
    { label: "Total leads", value: String(total), icon: Users },
    { label: "Nuevos sin contactar", value: String(nuevos), icon: Sparkles },
    { label: "Tasa de conversión", value: `${conversion}%`, icon: Target },
    { label: "Score promedio", value: avgScore !== null ? String(avgScore) : "—", icon: TrendingUp },
  ];

  return (
    <div className="max-w-5xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "#1a1c1e", letterSpacing: "-0.03em" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "#475569" }}>
          Resumen general de tu operación comercial.
        </p>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl p-5"
            style={{ background: "#ffffff", border: "1px solid #edf2f7", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#fef9c3" }}>
                <Icon size={15} style={{ color: "#a16207" }} />
              </div>
            </div>
            <p className="text-3xl font-black" style={{ color: "#1a1c1e", letterSpacing: "-0.03em" }}>{value}</p>
            <p className="text-xs mt-1 font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Leads recientes */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #edf2f7", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #edf2f7" }}>
            <h2 className="text-sm font-black" style={{ color: "#1a1c1e" }}>Leads recientes</h2>
            <Link href="/dashboard/leads" className="flex items-center gap-1 text-xs font-bold transition-opacity hover:opacity-70" style={{ color: "#a16207" }}>
              Ver todos <ArrowRight size={13} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm" style={{ color: "#94a3b8" }}>
              Aún no hay leads registrados.
            </div>
          ) : (
            <div>
              {recent.map((lead, idx) => {
                const meta = STATUS_META[lead.status] ?? STATUS_META.nuevo;
                return (
                  <div key={lead.id} className="px-6 py-3.5 flex items-center gap-4"
                    style={idx < recent.length - 1 ? { borderBottom: "1px solid #f1f5f9" } : {}}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ background: "#f1f5f9", color: "#475569" }}>
                      {lead.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: "#1a1c1e" }}>{lead.name}</p>
                      <p className="text-xs truncate" style={{ color: "#94a3b8" }}>
                        {lead.company ?? lead.whatsapp}
                      </p>
                    </div>
                    {lead.score !== null && (
                      <span className="text-xs font-black flex-shrink-0"
                        style={{ color: lead.score >= 70 ? "#10b981" : lead.score >= 40 ? "#eab308" : "#ef4444" }}>
                        {lead.score}
                      </span>
                    )}
                    <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize flex-shrink-0"
                      style={{ background: `${meta.bg}1a`, color: meta.color }}>
                      {lead.status}
                    </span>
                    <span className="text-[11px] flex-shrink-0 hidden sm:block" style={{ color: "#94a3b8" }}>
                      {new Date(lead.createdAt).toLocaleDateString("es-CO")}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Distribución por estado */}
        <div className="lg:col-span-2 rounded-2xl p-6 flex flex-col gap-5"
          style={{ background: "#ffffff", border: "1px solid #edf2f7", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h2 className="text-sm font-black" style={{ color: "#1a1c1e" }}>Distribución por estado</h2>

          {total === 0 ? (
            <p className="text-sm" style={{ color: "#94a3b8" }}>Sin datos todavía.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {byStatus.map(({ status, label, color, bg, count }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold" style={{ color: "#475569" }}>{label}</span>
                      <span className="text-xs font-black" style={{ color }}>{count} · {pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: bg }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-auto pt-4" style={{ borderTop: "1px solid #edf2f7" }}>
            <Link href="/dashboard/analytics"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-80"
              style={{ background: "#1a1c1e", color: "#ffffff" }}>
              Ver analytics completo <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
