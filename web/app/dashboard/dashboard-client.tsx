"use client";

import { useState, useMemo } from "react";
import { StatusSelector } from "./status-selector";

const STATUS_OPTIONS = ["todos", "nuevo", "contactado", "ganado", "perdido"];
const STATUS_COLORS: Record<string, string> = {
  nuevo: "#FFF200",
  contactado: "#60a5fa",
  ganado: "#4ade80",
  perdido: "#f87171",
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

function ScoreBar({ score }: { score: number | null }) {
  if (score === null)
    return <span style={{ color: "#475569", fontSize: 12 }}>Analizando...</span>;
  const filled = Math.round(score / 10);
  const empty = 10 - filled;
  const color = score >= 70 ? "#4ade80" : score >= 40 ? "#FFF200" : "#f87171";
  return (
    <div className="flex items-center gap-2">
      <span style={{ color, fontSize: 10, letterSpacing: 1 }}>
        {"█".repeat(filled)}{"░".repeat(empty)}
      </span>
      <span style={{ color, fontSize: 12, fontWeight: 700 }}>{score}</span>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string | null }) {
  if (!priority) return null;
  const colors: Record<string, string> = { alta: "#f87171", media: "#FFF200", baja: "#94a3b8" };
  const color = colors[priority] ?? "#94a3b8";
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
    >
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
      className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all"
      style={{
        background: copied ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.06)",
        color: copied ? "#4ade80" : "#94a3b8",
        border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.08)"}`,
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
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre, empresa o WhatsApp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#ffffff",
          }}
        />
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map((s) => {
            const color = s === "todos" ? "#94a3b8" : STATUS_COLORS[s];
            const active = filter === s;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="rounded-full px-3 py-1.5 text-xs font-semibold cursor-pointer capitalize transition-all"
                style={{
                  background: active ? `${color}22` : "rgba(255,255,255,0.04)",
                  color: active ? color : "#64748b",
                  border: `1px solid ${active ? `${color}44` : "rgba(255,255,255,0.06)"}`,
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.04)" }}>
          <h2 className="font-semibold" style={{ color: "#ffffff" }}>Leads recibidos</h2>
          <span className="text-xs" style={{ color: "#64748b" }}>{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-10 text-center" style={{ color: "#64748b" }}>
            {leads.length === 0
              ? "No hay leads aún. Cuando alguien llene el formulario de contacto, aparecerá aquí."
              : "No hay leads que coincidan con la búsqueda."}
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {filtered.map((lead) => {
              const isExpanded = expanded === lead.id;
              return (
                <div key={lead.id}>
                  {/* Fila principal */}
                  <div className="px-6 py-4 grid gap-3 items-center" style={{ gridTemplateColumns: "1fr 1fr 1fr auto" }}>

                    {/* Nombre */}
                    <div>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : lead.id)}
                        className="text-left cursor-pointer group"
                      >
                        <p className="font-medium text-sm group-hover:underline" style={{ color: "#ffffff" }}>
                          {lead.name}
                          <span className="ml-1.5 text-[10px]" style={{ color: "#475569" }}>
                            {isExpanded ? "▲" : "▼"}
                          </span>
                        </p>
                      </button>
                      {lead.company && <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{lead.company}</p>}
                      <p className="text-xs mt-1" style={{ color: "#475569" }}>{lead.whatsapp}</p>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col gap-1.5">
                      <ScoreBar score={lead.score} />
                      <PriorityBadge priority={lead.priority} />
                      {lead.serviceType && (
                        <span className="text-xs" style={{ color: "#a78bfa" }}>
                          {lead.serviceType.replace("_", " ")}
                        </span>
                      )}
                    </div>

                    {/* Descripción */}
                    <div>
                      <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "#94a3b8" }}>
                        {lead.description}
                      </p>
                    </div>

                    {/* Estado + fecha + eliminar */}
                    <div className="flex flex-col items-end gap-2">
                      <StatusSelector id={lead.id} status={lead.status} action={updateStatus} />
                      <p className="text-xs" style={{ color: "#475569" }}>
                        {new Date(lead.createdAt).toLocaleDateString("es-CO")}
                      </p>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        disabled={deleting === lead.id}
                        className="text-[10px] cursor-pointer transition-colors disabled:opacity-40"
                        style={{ color: "#475569" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
                      >
                        {deleting === lead.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </div>

                  {/* Panel expandido */}
                  {isExpanded && (
                    <div
                      className="px-6 pb-5 flex flex-col gap-4"
                      style={{ background: "rgba(124,58,237,0.04)", borderTop: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      {/* Justificación del agente */}
                      {lead.scoreReason && (
                        <div>
                          <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "#475569" }}>
                            Análisis del agente
                          </p>
                          <p className="text-sm" style={{ color: "#94a3b8" }}>{lead.scoreReason}</p>
                        </div>
                      )}

                      {/* Mensaje sugerido para WhatsApp */}
                      {lead.suggestedMsg && (
                        <div>
                          <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#475569" }}>
                            Mensaje sugerido para WhatsApp
                          </p>
                          <div
                            className="rounded-xl p-4 mb-2 text-sm leading-relaxed"
                            style={{
                              background: "rgba(37,211,102,0.06)",
                              border: "1px solid rgba(37,211,102,0.15)",
                              color: "#e2e8f0",
                            }}
                          >
                            {lead.suggestedMsg}
                          </div>
                          <CopyButton text={lead.suggestedMsg} />
                        </div>
                      )}

                      {/* Email si existe */}
                      {lead.email && (
                        <p className="text-xs" style={{ color: "#475569" }}>
                          Email: <span style={{ color: "#94a3b8" }}>{lead.email}</span>
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
