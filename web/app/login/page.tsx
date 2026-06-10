"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Correo o contraseña incorrectos.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main
      className="min-h-[100dvh] flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ background: "#09090e" }}
    >
      {/* Fondo decorativo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Grid decorativo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(to right, rgba(167,139,250,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Logo + título */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center mb-5">
            <Image
              src="/logo-nuevo.png"
              alt="NexCode97"
              width={160}
              height={40}
              className="h-9 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#ffffff", letterSpacing: "-0.03em" }}>
            Acceso interno
          </h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            Panel de gestión NexCode97
          </p>
        </div>

        {/* Formulario */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                Correo electrónico
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4" style={{ color: "#7c3aed" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="nexcode97@gmail.com"
                  className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#ffffff",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                Contraseña
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4" style={{ color: "#7c3aed" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl pl-10 pr-12 py-3 text-sm outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#ffffff",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer transition-colors duration-150 hover:text-white"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm text-center"
                style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 cursor-pointer disabled:opacity-60 active:scale-[0.98]"
              style={{ background: "#FFF200", color: "#09090e" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Verificando...
                </span>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          © {new Date().getFullYear()} NexCode97 · Acceso restringido
        </p>
      </div>
    </main>
  );
}
