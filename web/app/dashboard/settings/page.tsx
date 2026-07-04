import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { changePassword } from "../actions";
import { User, ShieldCheck, KeyRound } from "lucide-react";

export const dynamic = "force-dynamic";

const PWD_MESSAGES: Record<string, { text: string; ok: boolean }> = {
  ok:                { text: "Contraseña actualizada correctamente.", ok: true },
  campos:            { text: "Completa todos los campos.", ok: false },
  "no-coincide":     { text: "La nueva contraseña y su confirmación no coinciden.", ok: false },
  corta:             { text: "La nueva contraseña debe tener al menos 8 caracteres.", ok: false },
  "actual-invalida": { text: "La contraseña actual es incorrecta.", ok: false },
  error:             { text: "Ocurrió un error. Intenta de nuevo.", ok: false },
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ pwd?: string }>;
}) {
  const session = await auth();
  const { pwd } = await searchParams;
  const feedback = pwd ? PWD_MESSAGES[pwd] : null;

  const user = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email } })
    : null;

  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "#1a1c1e", letterSpacing: "-0.03em" }}>
          Configuración
        </h1>
        <p className="text-sm mt-1" style={{ color: "#475569" }}>
          Administra tu cuenta y la seguridad del panel.
        </p>
      </div>

      <div className="flex flex-col gap-6">

        {/* Perfil */}
        <section className="rounded-2xl p-6"
          style={{ background: "#ffffff", border: "1px solid #edf2f7", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#fef9c3" }}>
              <User size={15} style={{ color: "#a16207" }} />
            </div>
            <h2 className="text-sm font-black" style={{ color: "#1a1c1e" }}>Perfil</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0"
              style={{ background: "#1a1c1e", color: "#facc15" }}>
              {user?.email?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-bold" style={{ color: "#1a1c1e" }}>
                {user?.name ?? "Administrador"}
              </p>
              <p className="text-xs" style={{ color: "#64748b" }}>{user?.email}</p>
              {user?.createdAt && (
                <p className="text-[11px]" style={{ color: "#94a3b8" }}>
                  Cuenta creada el {new Date(user.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
            <span className="ml-auto rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide flex items-center gap-1.5"
              style={{ background: "#dcfce7", color: "#15803d" }}>
              <ShieldCheck size={12} /> Admin
            </span>
          </div>
        </section>

        {/* Seguridad */}
        <section className="rounded-2xl p-6"
          style={{ background: "#ffffff", border: "1px solid #edf2f7", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#fef9c3" }}>
              <KeyRound size={15} style={{ color: "#a16207" }} />
            </div>
            <h2 className="text-sm font-black" style={{ color: "#1a1c1e" }}>Cambiar contraseña</h2>
          </div>
          <p className="text-xs mb-5" style={{ color: "#94a3b8" }}>
            Usa una contraseña de al menos 8 caracteres que no uses en otro sitio.
          </p>

          {feedback && (
            <div className="mb-5 rounded-xl px-4 py-3 text-xs font-bold"
              style={feedback.ok
                ? { background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0" }
                : { background: "#fee2e2", color: "#b91c1c", border: "1px solid #fecaca" }}>
              {feedback.text}
            </div>
          )}

          <form action={changePassword} className="flex flex-col gap-4">
            <div>
              <label htmlFor="current" className="block text-xs font-bold mb-1.5" style={{ color: "#475569" }}>
                Contraseña actual
              </label>
              <input
                id="current" name="current" type="password" required autoComplete="current-password"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-200"
                style={{ background: "#f8fafc", border: "1px solid #edf2f7", color: "#1a1c1e" }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="next" className="block text-xs font-bold mb-1.5" style={{ color: "#475569" }}>
                  Nueva contraseña
                </label>
                <input
                  id="next" name="next" type="password" required minLength={8} autoComplete="new-password"
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-200"
                  style={{ background: "#f8fafc", border: "1px solid #edf2f7", color: "#1a1c1e" }}
                />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-xs font-bold mb-1.5" style={{ color: "#475569" }}>
                  Confirmar nueva contraseña
                </label>
                <input
                  id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password"
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-yellow-200"
                  style={{ background: "#f8fafc", border: "1px solid #edf2f7", color: "#1a1c1e" }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="self-start rounded-xl px-6 py-2.5 text-sm font-bold cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: "#1a1c1e", color: "#ffffff" }}
            >
              Actualizar contraseña
            </button>
          </form>
        </section>

        {/* Info del sistema */}
        <section className="rounded-2xl p-6"
          style={{ background: "#ffffff", border: "1px solid #edf2f7", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h2 className="text-sm font-black mb-4" style={{ color: "#1a1c1e" }}>Sistema</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Plataforma", value: "NexCode97 CRM" },
              { label: "Agente IA", value: "Groq · activo" },
              { label: "Base de datos", value: "PostgreSQL · Railway" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl px-4 py-3" style={{ background: "#f8fafc", border: "1px solid #edf2f7" }}>
                <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: "#94a3b8" }}>{label}</p>
                <p className="text-xs font-bold mt-0.5" style={{ color: "#1a1c1e" }}>{value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
