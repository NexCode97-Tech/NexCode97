"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Sparkles } from "lucide-react";

type NewLead = {
  id: string;
  name: string;
  company: string | null;
  createdAt: Date;
};

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "hace un momento";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "hace 1 día";
  return `hace ${days} días`;
}

export function NotificationsBell({ leads }: { leads: NewLead[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const count = leads.length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Notificaciones"
        className="relative p-2 rounded-full cursor-pointer transition-colors hover:bg-slate-100"
        style={{ color: "#475569" }}
      >
        <Bell size={18} />
        {count > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-black"
            style={{ background: "#facc15", color: "#0d0d12" }}
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-50"
          style={{ background: "#ffffff", border: "1px solid #edf2f7", boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
        >
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #edf2f7" }}>
            <span className="text-xs font-black" style={{ color: "#1a1c1e" }}>Notificaciones</span>
            {count > 0 && (
              <span className="text-[10px] font-black rounded-full px-2 py-0.5" style={{ background: "#fef9c3", color: "#a16207" }}>
                {count} sin contactar
              </span>
            )}
          </div>

          {count === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-xs" style={{ color: "#94a3b8" }}>No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {leads.map((lead, idx) => (
                <Link
                  key={lead.id}
                  href="/dashboard/leads"
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
                  style={idx < leads.length - 1 ? { borderBottom: "1px solid #f1f5f9" } : {}}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "#fef9c3" }}>
                    <Sparkles size={14} style={{ color: "#a16207" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold" style={{ color: "#1a1c1e" }}>
                      Nuevo lead: {lead.name}
                    </p>
                    {lead.company && (
                      <p className="text-[11px] truncate" style={{ color: "#64748b" }}>{lead.company}</p>
                    )}
                    <p className="text-[10px] mt-0.5" style={{ color: "#94a3b8" }}>{timeAgo(lead.createdAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/dashboard/leads"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-center text-xs font-bold transition-colors hover:bg-slate-50"
            style={{ color: "#a16207", borderTop: "1px solid #edf2f7" }}
          >
            Ver todos los leads
          </Link>
        </div>
      )}
    </div>
  );
}
