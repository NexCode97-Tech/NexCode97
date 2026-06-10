import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { StatusSelector } from "./status-selector";

export const dynamic = "force-dynamic";

async function updateLeadStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/dashboard");
}

function ScoreBar({ score }: { score: number | null }) {
  if (score === null) return <span style={{ color: "#475569", fontSize: 12 }}>Analizando...</span>;
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

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="min-h-screen px-4 py-10" style={{ background: "#09090e" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Image src="/logo-nuevo.png" alt="NexCode97" width={140} height={36} className="h-8 w-auto object-contain mb-1" />
            <p className="text-sm" style={{ color: "#475569" }}>{session.user.email}</p>
          </div>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button type="submit" className="rounded-lg px-4 py-2 text-sm font-medium cursor-pointer transition-opacity hover:opacity-70"
              style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}>
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
            <div key={stat.label} className="rounded-xl p-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-3xl font-bold" style={{ color: "#ffffff" }}>{stat.value}</p>
              <p className="text-sm mt-1" style={{ color: "#64748b" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
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
                <div key={lead.id} className="px-6 py-4 grid gap-3" style={{ gridTemplateColumns: "1fr 1fr 1fr auto" }}>

                  {/* Nombre + empresa */}
                  <div>
                    <p className="font-medium text-sm" style={{ color: "#ffffff" }}>{lead.name}</p>
                    {lead.company && <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{lead.company}</p>}
                    <p className="text-xs mt-1" style={{ color: "#475569" }}>{lead.whatsapp}</p>
                  </div>

                  {/* Score + clasificación */}
                  <div className="flex flex-col gap-1.5 justify-center">
                    <ScoreBar score={lead.score} />
                    <PriorityBadge priority={lead.priority} />
                    {lead.serviceType && (
                      <span className="text-xs" style={{ color: "#a78bfa" }}>
                        {lead.serviceType.replace("_", " ")}
                      </span>
                    )}
                  </div>

                  {/* Descripción */}
                  <div className="flex items-center">
                    <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "#94a3b8" }}>{lead.description}</p>
                  </div>

                  {/* Estado + fecha */}
                  <div className="flex flex-col items-end gap-2 justify-center">
                    <StatusSelector id={lead.id} status={lead.status} action={updateLeadStatus} />
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
