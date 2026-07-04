import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import {
  LogOut,
  Plus,
  HelpCircle,
  MessageCircle,
  Bell,
  Search,
} from "lucide-react";
import { SidebarNav } from "./sidebar-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen flex" style={{ background: "#F8F9FA", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-60 z-50"
        style={{ background: "#ffffff", borderRight: "1px solid #edf2f7" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: "1px solid #edf2f7" }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
            style={{ background: "#facc15" }}
          >
            <span className="font-black text-sm" style={{ color: "#1a1c1e" }}>N</span>
          </div>
          <div>
            <p className="font-black text-sm leading-tight" style={{ color: "#1a1c1e", letterSpacing: "-0.02em" }}>NexCode97</p>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#94a3b8" }}>CRM</p>
          </div>
        </div>

        {/* Nav */}
        <SidebarNav />

        {/* Bottom */}
        <div className="px-3 pb-5 flex flex-col gap-3">
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#1a1c1e", color: "#ffffff" }}
          >
            <Plus size={16} />
            Nuevo lead
          </button>

          <div className="flex flex-col gap-0.5 pt-3" style={{ borderTop: "1px solid #edf2f7" }}>
            <a href="#" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors" style={{ color: "#94a3b8" }}>
              <HelpCircle size={15} />
              Ayuda
            </a>
            <a href="#" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors" style={{ color: "#94a3b8" }}>
              <MessageCircle size={15} />
              Soporte
            </a>
          </div>

          {/* User */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl mt-1" style={{ background: "#f8fafc", border: "1px solid #edf2f7" }}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
              style={{ background: "#1a1c1e", color: "#facc15" }}
            >
              {session.user.email?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs font-bold truncate" style={{ color: "#1a1c1e" }}>Admin</span>
              <span className="text-[10px] truncate" style={{ color: "#94a3b8" }}>{session.user.email}</span>
            </div>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
              <button type="submit" title="Cerrar sesión" className="cursor-pointer transition-colors hover:text-red-500" style={{ color: "#94a3b8" }}>
                <LogOut size={14} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col lg:ml-60">

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
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-full transition-colors"
              style={{ color: "#475569" }}
            >
              <Bell size={18} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white"
                style={{ background: "#facc15" }}
              />
            </button>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
              style={{ background: "#1a1c1e", color: "#facc15" }}
            >
              {session.user.email?.[0]?.toUpperCase() ?? "A"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8" style={{ background: "#F8F9FA" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
