"use client";

import { useOptimistic, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const COLUMNS = [
  { status: "nuevo",      label: "Nuevos",      accent: "#facc15", chipBg: "#fef9c3", chipText: "#a16207" },
  { status: "contactado", label: "Contactados", accent: "#3b82f6", chipBg: "#dbeafe", chipText: "#1d4ed8" },
  { status: "ganado",     label: "Ganados",     accent: "#10b981", chipBg: "#dcfce7", chipText: "#15803d" },
  { status: "perdido",    label: "Perdidos",    accent: "#ef4444", chipBg: "#fee2e2", chipText: "#b91c1c" },
];

const ORDER = COLUMNS.map((c) => c.status);

type Lead = {
  id: string;
  name: string;
  company: string | null;
  whatsapp: string;
  status: string;
  score: number | null;
  priority: string | null;
  serviceType: string | null;
  createdAt: Date;
};

export function PipelineBoard({
  leads,
  updateStatus,
}: {
  leads: Lead[];
  updateStatus: (formData: FormData) => Promise<void>;
}) {
  const [, startTransition] = useTransition();
  const [optimisticLeads, moveOptimistic] = useOptimistic(
    leads,
    (state, { id, status }: { id: string; status: string }) =>
      state.map((l) => (l.id === id ? { ...l, status } : l))
  );

  function move(id: string, status: string) {
    startTransition(async () => {
      moveOptimistic({ id, status });
      const fd = new FormData();
      fd.set("id", id);
      fd.set("status", status);
      await updateStatus(fd);
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      {COLUMNS.map((col, colIdx) => {
        const items = optimisticLeads.filter((l) => l.status === col.status);
        return (
          <div key={col.status} className="rounded-2xl flex flex-col"
            style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}>

            {/* Cabecera de columna */}
            <div className="px-4 py-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: col.accent }} />
              <span className="text-xs font-black uppercase tracking-wide" style={{ color: "#475569" }}>
                {col.label}
              </span>
              <span className="ml-auto text-xs font-black rounded-full px-2 py-0.5"
                style={{ background: "#ffffff", color: "#64748b", border: "1px solid #e2e8f0" }}>
                {items.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2.5 px-3 pb-3 min-h-[80px]">
              {items.length === 0 ? (
                <div className="rounded-xl py-6 text-center text-xs"
                  style={{ color: "#94a3b8", border: "1px dashed #cbd5e1" }}>
                  Sin leads aquí
                </div>
              ) : (
                items.map((lead) => {
                  const scoreColor =
                    lead.score === null ? "#94a3b8"
                    : lead.score >= 70 ? "#10b981"
                    : lead.score >= 40 ? "#eab308"
                    : "#ef4444";
                  return (
                    <div key={lead.id} className="rounded-xl p-4 flex flex-col gap-2.5 transition-shadow hover:shadow-md"
                      style={{ background: "#ffffff", border: "1px solid #edf2f7", borderTop: `3px solid ${col.accent}` }}>

                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: "#1a1c1e" }}>{lead.name}</p>
                          <p className="text-xs truncate" style={{ color: "#94a3b8" }}>
                            {lead.company ?? lead.whatsapp}
                          </p>
                        </div>
                        {lead.score !== null && (
                          <span className="text-xs font-black flex-shrink-0" style={{ color: scoreColor }}>
                            {lead.score}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {lead.priority && (
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                            style={{ background: col.chipBg, color: col.chipText }}>
                            {lead.priority}
                          </span>
                        )}
                        {lead.serviceType && (
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{ background: "#ede9fe", color: "#6d28d9" }}>
                            {lead.serviceType.replace("_", " ")}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid #f1f5f9" }}>
                        <button
                          onClick={() => move(lead.id, ORDER[colIdx - 1])}
                          disabled={colIdx === 0}
                          title={colIdx > 0 ? `Mover a ${COLUMNS[colIdx - 1].label}` : undefined}
                          className="p-1 rounded-md cursor-pointer transition-colors hover:bg-slate-100 disabled:opacity-0 disabled:pointer-events-none"
                          style={{ color: "#64748b" }}
                        >
                          <ChevronLeft size={15} />
                        </button>
                        <span className="text-[10px]" style={{ color: "#cbd5e1" }}>
                          {new Date(lead.createdAt).toLocaleDateString("es-CO")}
                        </span>
                        <button
                          onClick={() => move(lead.id, ORDER[colIdx + 1])}
                          disabled={colIdx === ORDER.length - 1}
                          title={colIdx < ORDER.length - 1 ? `Mover a ${COLUMNS[colIdx + 1].label}` : undefined}
                          className="p-1 rounded-md cursor-pointer transition-colors hover:bg-slate-100 disabled:opacity-0 disabled:pointer-events-none"
                          style={{ color: "#64748b" }}
                        >
                          <ChevronRight size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
