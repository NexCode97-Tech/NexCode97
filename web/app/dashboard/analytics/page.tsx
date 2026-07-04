import { prisma } from "@/lib/prisma";
import { TrendingUp, TrendingDown, Target, Users, Gauge } from "lucide-react";

export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  nuevo:      { label: "Nuevos",      bg: "#facc15", color: "#a16207" },
  contactado: { label: "Contactados", bg: "#3b82f6", color: "#1d4ed8" },
  ganado:     { label: "Ganados",     bg: "#10b981", color: "#15803d" },
  perdido:    { label: "Perdidos",    bg: "#ef4444", color: "#b91c1c" },
};

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default async function AnalyticsPage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  const now = new Date();
  const total = leads.length;
  const ganados = leads.filter((l) => l.status === "ganado").length;
  const conversion = total > 0 ? Math.round((ganados / total) * 100) : 0;

  const scored = leads.filter((l) => l.score !== null);
  const avgScore = scored.length > 0
    ? Math.round(scored.reduce((s, l) => s + (l.score ?? 0), 0) / scored.length)
    : null;

  // Velocidad semanal: esta semana vs semana anterior
  const weekAgo = new Date(now.getTime() - 7 * DAY_MS);
  const twoWeeksAgo = new Date(now.getTime() - 14 * DAY_MS);
  const thisWeek = leads.filter((l) => l.createdAt >= weekAgo).length;
  const lastWeek = leads.filter((l) => l.createdAt >= twoWeeksAgo && l.createdAt < weekAgo).length;
  const delta = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : thisWeek > 0 ? 100 : 0;

  // Leads por día — últimos 7 días
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() - (6 - i) * DAY_MS);
    return {
      date: d,
      label: d.toLocaleDateString("es-CO", { weekday: "short" }),
      count: leads.filter((l) => sameDay(new Date(l.createdAt), d)).length,
    };
  });
  const maxDay = Math.max(...days.map((d) => d.count), 1);

  // Distribución por estado
  const byStatus = Object.keys(STATUS_META).map((s) => ({
    ...STATUS_META[s],
    count: leads.filter((l) => l.status === s).length,
  }));

  // Distribución por tipo de servicio
  const serviceCounts = new Map<string, number>();
  for (const l of leads) {
    if (!l.serviceType) continue;
    const key = l.serviceType.replace("_", " ");
    serviceCounts.set(key, (serviceCounts.get(key) ?? 0) + 1);
  }
  const byService = [...serviceCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxService = Math.max(...byService.map(([, c]) => c), 1);

  const kpis = [
    { label: "Total leads", value: String(total), icon: Users, hint: "Histórico" },
    { label: "Tasa de conversión", value: `${conversion}%`, icon: Target, hint: `${ganados} ganados` },
    { label: "Score promedio", value: avgScore !== null ? String(avgScore) : "—", icon: Gauge, hint: `${scored.length} analizados` },
    {
      label: "Leads esta semana",
      value: String(thisWeek),
      icon: delta >= 0 ? TrendingUp : TrendingDown,
      hint: `${delta >= 0 ? "+" : ""}${delta}% vs anterior`,
      hintColor: delta >= 0 ? "#15803d" : "#b91c1c",
    },
  ];

  return (
    <div className="max-w-5xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "#1a1c1e", letterSpacing: "-0.03em" }}>
          Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: "#475569" }}>
          Métricas y rendimiento de tu captación de clientes.
        </p>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, hint, hintColor }) => (
          <div key={label} className="rounded-2xl p-5"
            style={{ background: "#ffffff", border: "1px solid #edf2f7", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: "#fef9c3" }}>
              <Icon size={15} style={{ color: "#a16207" }} />
            </div>
            <p className="text-3xl font-black" style={{ color: "#1a1c1e", letterSpacing: "-0.03em" }}>{value}</p>
            <p className="text-xs mt-1 font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>{label}</p>
            <p className="text-[11px] mt-1 font-bold" style={{ color: hintColor ?? "#cbd5e1" }}>{hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Leads últimos 7 días */}
        <div className="rounded-2xl p-6"
          style={{ background: "#ffffff", border: "1px solid #edf2f7", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h2 className="text-sm font-black mb-6" style={{ color: "#1a1c1e" }}>Leads — últimos 7 días</h2>
          <div className="flex items-end justify-between gap-2 h-40">
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-black" style={{ color: d.count > 0 ? "#1a1c1e" : "#cbd5e1" }}>
                  {d.count}
                </span>
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${Math.max((d.count / maxDay) * 100, 4)}%`,
                    background: i === days.length - 1 ? "#facc15" : "#fde68a",
                  }}
                />
                <span className="text-[10px] font-bold uppercase" style={{ color: "#94a3b8" }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por estado */}
        <div className="rounded-2xl p-6 flex flex-col gap-4"
          style={{ background: "#ffffff", border: "1px solid #edf2f7", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h2 className="text-sm font-black" style={{ color: "#1a1c1e" }}>Embudo por estado</h2>
          {total === 0 ? (
            <p className="text-sm" style={{ color: "#94a3b8" }}>Sin datos todavía.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {byStatus.map(({ label, bg, color, count }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold" style={{ color: "#475569" }}>{label}</span>
                      <span className="text-xs font-black" style={{ color }}>{count} · {pct}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: bg }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Servicios más solicitados */}
        <div className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: "#ffffff", border: "1px solid #edf2f7", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h2 className="text-sm font-black mb-5" style={{ color: "#1a1c1e" }}>Servicios más solicitados</h2>
          {byService.length === 0 ? (
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              Cuando el agente clasifique leads por tipo de servicio, aparecerán aquí.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {byService.map(([service, count]) => (
                <div key={service} className="flex items-center gap-4">
                  <span className="text-xs font-bold capitalize w-32 truncate flex-shrink-0" style={{ color: "#475569" }}>
                    {service}
                  </span>
                  <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: "#f1f5f9" }}>
                    <div className="h-full rounded-lg flex items-center px-2"
                      style={{ width: `${Math.max((count / maxService) * 100, 8)}%`, background: "#ede9fe" }}>
                      <span className="text-[10px] font-black" style={{ color: "#6d28d9" }}>{count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
