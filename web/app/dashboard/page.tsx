import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { DashboardClient } from "./dashboard-client";

export const dynamic = "force-dynamic";

async function updateLeadStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/dashboard");
}

async function deleteLead(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.lead.delete({ where: { id } });
  revalidatePath("/dashboard");
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  const stats = [
    { label: "Total leads", value: leads.length },
    { label: "Nuevos", value: leads.filter((l) => l.status === "nuevo").length },
    { label: "Contactados", value: leads.filter((l) => l.status === "contactado").length },
    { label: "Ganados", value: leads.filter((l) => l.status === "ganado").length },
  ];

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
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl p-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-3xl font-bold" style={{ color: "#ffffff" }}>{stat.value}</p>
              <p className="text-sm mt-1" style={{ color: "#64748b" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Dashboard interactivo */}
        <DashboardClient
          leads={leads}
          updateStatus={updateLeadStatus}
          deleteLead={deleteLead}
        />
      </div>
    </main>
  );
}
