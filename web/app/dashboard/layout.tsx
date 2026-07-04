import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Geist } from "next/font/google";
import { Search } from "lucide-react";
import { Sidebar } from "./sidebar";
import { NotificationsBell } from "./notifications-bell";

const geist = Geist({ subsets: ["latin"] });

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Leads nuevos sin contactar → notificaciones de la campana
  const newLeads = await prisma.lead.findMany({
    where: { status: "nuevo" },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: { id: true, name: true, company: true, createdAt: true },
  });

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className={`${geist.className} min-h-screen flex`} style={{ background: "#F8F9FA" }}>

      {/* ── Sidebar (colapsable, estilo Grupo 500 adaptado a la marca) ── */}
      <Sidebar email={session.user.email ?? ""} signOutAction={doSignOut} />

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header
          className="h-14 flex items-center justify-between px-6 sticky top-0 z-40"
          style={{ background: "#ffffff", borderBottom: "1px solid #edf2f7" }}
        >
          <div className="relative w-80 max-w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Buscar leads..."
              className="w-full rounded-xl py-2 pl-9 pr-4 text-sm outline-none"
              style={{
                background: "#f1f5f9",
                border: "1px solid #edf2f7",
                color: "#1a1c1e",
              }}
            />
          </div>
          <NotificationsBell leads={newLeads} />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8" style={{ background: "#F8F9FA" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
