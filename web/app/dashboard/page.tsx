import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  const statusColors: Record<string, string> = {
    nuevo: "#FFF200",
    contactado: "#60a5fa",
    ganado: "#4ade80",
    perdido: "#f87171",
  };

  return (
    <main className="min-h-screen px-6 py-12" style={{ background: "#09090e" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#ffffff" }}>
              Panel NexCode97
            </h1>
            <p className="text-sm mt-1" style={{ color: "#64748b" }}>
              {session.user.email}
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Cerrar sesión
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total leads", value: leads.length },
            { label: "Nuevos", value: leads.filter((l) => l.status === "nuevo").length },
            { label: "Contactados", value: leads.filter((l) => l.status === "contactado").length },
            { label: "Ganados", value: leads.filter((l) => l.status === "ganado").length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-3xl font-bold" style={{ color: "#ffffff" }}>{stat.value}</p>
              <p className="text-sm mt-1" style={{ color: "#64748b" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Leads table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="px-6 py-4" style={{ background: "rgba(255,255,255,0.04)" }}>
            <h2 className="font-semibold" style={{ color: "#ffffff" }}>Leads recibidos</h2>
          </div>

          {leads.length === 0 ? (
            <div className="px-6 py-10 text-center" style={{ color: "#64748b" }}>
              No hay leads aún. Cuando alguien llene el formulario de contacto, aparecerá aquí.
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {leads.map((lead) => (
                <div key={lead.id} className="px-6 py-4 grid md:grid-cols-4 gap-2 items-start">
                  <div>
                    <p className="font-medium text-sm" style={{ color: "#ffffff" }}>{lead.name}</p>
                    {lead.company && (
                      <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{lead.company}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "#94a3b8" }}>{lead.whatsapp}</p>
                    {lead.email && (
                      <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{lead.email}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{lead.description}</p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: `${statusColors[lead.status] ?? "#64748b"}22`,
                        color: statusColors[lead.status] ?? "#64748b",
                        border: `1px solid ${statusColors[lead.status] ?? "#64748b"}44`,
                      }}
                    >
                      {lead.status}
                    </span>
                    <p className="text-xs" style={{ color: "#475569" }}>
                      {new Date(lead.createdAt).toLocaleDateString("es-CO")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
