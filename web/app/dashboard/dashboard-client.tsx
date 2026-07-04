"use client";

import { useState, useMemo } from "react";
import { StatusSelector } from "./status-selector";

const STATUS_OPTIONS = ["todos", "nuevo", "contactado", "ganado", "perdido"];
const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  nuevo:      { bg: "#fef9c3", text: "#a16207", border: "#fde68a" },
  contactado: { bg: "#dbeafe", text: "#1d4ed8", border: "#bfdbfe" },
  ganado:     { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" },
  perdido:    { bg: "#fee2e2", text: "#b91c1c", border: "#fecaca" },
};

type Lead = {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string;
  company: string | null;
  description: string;
  status: string;
  score: number | null;
  scoreReason: string | null;
  priority: string | null;
  serviceType: string | null;
  suggestedMsg: string | null;
  createdAt: Date;
};

function ScoreBlocks({ score }: { score: number | null }) {
  if (score === null)
    return <span style={{ color: "#94a3b8", fontSize: 11 }}>Analizando...</span>;
  const filled = Math.round((score / 100) * 10);
  const empty = 10 - filled;
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#eab308" : "#ef4444";
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5 p-1 rounded-md" style={{ background: "#f1f5f9" }}>
        {Array.from({ length: filled }).map((_, i) => (
          <div key={i} className="rounded-sm" style={{ width: 6, height: 14, background: color }} />
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <div key={i} className="rounded-sm" style={{ width: 6, height: 14, background: "#cbd5e1" }} />
        ))}
      </div>
      <span className="text-xs font-black" style={{ color }}>{score}</span>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string | null }) {
  if (!priority) return null;
  const map: Record<string, { bg: string; text: string }> = {
    alta:  { bg: "#fee2e2", text: "#b91c1c" },
    media: { bg: "#fef9c3", text: "#a16207" },
    baja:  { bg: "#f1f5f9", text: "#64748b" },
  };
  const c = map[priority] ?? map.baja;
  return (
    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{ background: c.bg, color: c.text }}>
      {priority}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handleCopy}
      className="rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-all"
      style={{
        background: copied ? "#dcfce7" : "#f8fafc",
        color: copied ? "#15803d" : "#475569",
        border: `1px solid ${copied ? "#bbf7d0" : "#edf2f7"}`,
      }}
    >
      {copied ? "✓ Copiado" : "Copiar mensaje"}
    </button>
  );
}

export function DashboardClient({
  leads,
  updateStatus,
  deleteLead,
}: {
  leads: Lead[];
  updateStatus: (formData: FormData) => Promise<void>;
  deleteLead: (formData: FormData) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchStatus = filter === "todos" || l.status === filter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        (l.company ?? "").toLowerCase().includes(q) ||
        l.whatsapp.includes(q);
      return matchStatus && matchSearch;
    });
  }, [leads, filter, search]);

  async function handleDelete(id: string) {
    setDeleting(id);
    const fd = new FormData();
    fd.set("id", id);
    await deleteLead(fd);
    setDeleting(null);
    if (expanded === id) setExpanded(null);
  }

  return (
    <div>
      {/* Búsqueda + filtros */}
      <div className="mb-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          type="text"
          placeholder="Buscar por nombre, empresa o WhatsApp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none w-full"
          style={{
            background: "#ffffff",
            border: "1px solid #edf2f7",
            color: "#1a1c1e",
          }}
        />
        <div className="flex gap-2 flex-wrap p-1 rounded-xl" style={{ background: "#ffffff", border: "1px solid #edf2f7" }}>
          {STATUS_OPTIONS.map((s) => {
            const active = filter === s;
            const c = STATUS_COLORS[s];
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="rounded-lg px-4 py-1.5 text-xs font-bold cursor-pointer capitalize transition-all"
                style={active && c
                  ? { background: c.bg, color: c.text, border: `1px solid ${c.border}` }
                  : active
                  ? { background: "#1a1c1e", color: "#ffffff" }
                  : { color: "#64748b" }
                }
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#ffffff", border: "1px solid #edf2f7", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        {/* Cabecera tabla */}
        <div className="px-6 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid #edf2f7" }}>
          <h2 className="text-sm font-black" style={{ color: "#1a1c1e" }}>Leads recibidos</h2>
          <span className="text-xs font-semibold" style={{ color: "#94a3b8" }}>{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm" style={{ color: "#94a3b8" }}>
            {leads.length === 0
              ? "No hay leads aún. Cuando alguien llene el formulario de contacto, aparecerá aquí."
              : "No hay leads que coincidan con la búsqueda."}
          </div>
        ) : (
          <div>
            {filtered.map((lead, idx) => {
              const isExpanded = expanded === lead.id;
              const isLast = idx === filtered.length - 1;
              return (
                <div key={lead.id} style={!isLast ? { borderBottom: "1px solid #f1f5f9" } : {}}>
                  {/* Fila principal */}
                  <div className="px-6 py-4 grid gap-4 items-center" style={{ gridTemplateColumns: "1.5fr 1fr 1.5fr auto" }}>

                    {/* Nombre */}
                    <div>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : lead.id)}
                        className="text-left cursor-pointer"
                      >
                        <p className="font-bold text-sm" style={{ color: "#1a1c1e" }}>
                          {lead.name}
                          <span className="ml-1.5 text-[10px]" style={{ color: "#94a3b8" }}>
                            {isExpanded ? "▲" : "▼"}
                          </span>
                        </p>
                      </button>
                      {lead.company && (
                        <p className="text-xs font-semibold mt-0.5" style={{ color: "#475569" }}>{lead.company}</p>
                      )}
                      <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{lead.whatsapp}</p>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col gap-1.5">
                      <ScoreBlocks score={lead.score} />
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <PriorityBadge priority={lead.priority} />
                        {lead.serviceType && (
                          <span className="text-[10px] font-bold rounded-full px-2 py-0.5" style={{ background: "#ede9fe", color: "#6d28d9" }}>
                            {lead.serviceType.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#64748b" }}>
                      {lead.description}
                    </p>

                    {/* Estado + fecha + eliminar */}
                    <div className="flex flex-col items-end gap-1.5">
                      <StatusSelector id={lead.id} status={lead.status} action={updateStatus} />
                      <p className="text-[11px]" style={{ color: "#94a3b8" }}>
                        {new Date(lead.createdAt).toLocaleDateString("es-CO")}
                      </p>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        disabled={deleting === lead.id}
                        className="text-[10px] font-semibold cursor-pointer transition-colors disabled:opacity-40"
                        style={{ color: "#cbd5e1" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#cbd5e1")}
                      >
                        {deleting === lead.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </div>

                  {/* Panel expandido */}
                  {isExpanded && (
                    <div
                      className="px-6 pb-5 flex flex-col gap-4"
                      style={{ background: "#f0fdf4", borderTop: "1px solid #dcfce7" }}
                    >
                      <div className="pt-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#10b981" }}>
                          <span style={{ color: "#fff", fontSize: 11 }}>✦</span>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#10b981" }}>AI Insights</span>
                      </div>

                      {lead.scoreReason && (
                        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.7)", border: "1px solid #d1fae5" }}>
                          <p className="text-[10px] uppercase tracking-widest font-black mb-1.5" style={{ color: "#6ee7b7" }}>Análisis del agente</p>
                          <p className="text-sm leading-relaxed" style={{ color: "#1a1c1e" }}>{lead.scoreReason}</p>
                        </div>
                      )}

                      {lead.suggestedMsg && (
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-black mb-2" style={{ color: "#6ee7b7" }}>
                            Mensaje sugerido para WhatsApp
                          </p>
                          <div
                            className="rounded-2xl p-4 mb-3 text-sm leading-relaxed relative overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.8)", border: "1px solid #d1fae5" }}
                          >
                            <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: "#25D366" }} />
                            <p className="pl-3" style={{ color: "#1a1c1e" }}>{lead.suggestedMsg}</p>
                          </div>
                          <CopyButton text={lead.suggestedMsg} />
                        </div>
                      )}

                      {lead.email && (
                        <p className="text-xs" style={{ color: "#64748b" }}>
                          Email: <span style={{ color: "#475569" }}>{lead.email}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
