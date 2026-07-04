"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  LayoutDashboard, Users, GitMerge, BarChart2, Settings,
  ChevronLeft, ChevronRight, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",           label: "Dashboard",     icon: LayoutDashboard },
  { href: "/dashboard/leads",     label: "Leads",         icon: Users },
  { href: "/dashboard/pipeline",  label: "Pipeline",      icon: GitMerge },
  { href: "/dashboard/analytics", label: "Analytics",     icon: BarChart2 },
  { href: "/dashboard/settings",  label: "Configuración", icon: Settings },
];

// Paleta fija del sidebar oscuro (marca NexCode97)
const RAIL_BG = "#0d0d12";
const ACTIVE  = "#facc15";

// Geometría del sidebar flotante
const PAD_L       = 6;    // separación izquierda
const PAD_Y       = 8;    // separación arriba/abajo
const R           = 18;   // radio de esquinas
const LOGO_BOTTOM = 70;   // borde inferior del bloque del logo
const GAP         = 12;   // separación entre el logo y el bloque principal
const MAIN_TOP    = LOGO_BOTTOM + GAP;

// Rectángulo con las cuatro esquinas redondeadas
function roundedRect(x1: number, y1: number, x2: number, y2: number, r: number): string {
  return [
    `M${x1},${y1 + r}`,
    `Q${x1},${y1} ${x1 + r},${y1}`,
    `H${x2 - r}`,
    `Q${x2},${y1} ${x2},${y1 + r}`,
    `V${y2 - r}`,
    `Q${x2},${y2} ${x2 - r},${y2}`,
    `H${x1 + r}`,
    `Q${x1},${y2} ${x1},${y2 - r}`,
    `Z`,
  ].join(" ");
}

// Bloque principal (nav + footer): esquinas redondeadas + curva cóncava del activo.
function buildMain(w: number, h: number, cy: number | null): string {
  const top    = MAIN_TOP;
  const bottom = h - PAD_Y;
  const left   = PAD_L;
  const depth  = 38;
  const half   = 52;
  const wi     = w - depth;

  const p: string[] = [
    `M${left},${top + R}`,
    `Q${left},${top} ${left + R},${top}`,   // esquina sup-izq
    `H${w - R}`,
  ];

  if (cy == null) {
    p.push(`Q${w},${top} ${w},${top + R}`); // esquina sup-der normal
  } else {
    const botMelt = cy + half > bottom - R - 2; // el brazo inferior toca la esquina

    // ── Borde derecho: entrada a la curva (arriba) ──
    p.push(
      `Q${w},${top} ${w},${top + R}`,
      `V${(cy - half).toFixed(1)}`,
      `C${w},${(cy - half * 0.35).toFixed(1)} ${wi},${(cy - half * 0.6).toFixed(1)} ${wi},${cy.toFixed(1)}`,
    );

    // ── Salida de la curva (abajo) ──
    if (botMelt) {
      p.push(
        `C${wi},${(cy + half * 0.55).toFixed(1)} ${w},${bottom} ${w - R},${bottom}`,
        `H${left + R}`,
        `Q${left},${bottom} ${left},${bottom - R}`,
        `Z`,
      );
      return p.join(" ");
    }
    p.push(`C${wi},${(cy + half * 0.6).toFixed(1)} ${w},${(cy + half * 0.35).toFixed(1)} ${w},${(cy + half).toFixed(1)}`);
  }

  p.push(
    `V${bottom - R}`,
    `Q${w},${bottom} ${w - R},${bottom}`,        // esquina inf-der
    `H${left + R}`,
    `Q${left},${bottom} ${left},${bottom - R}`,  // esquina inf-izq
    `Z`,
  );
  return p.join(" ");
}

// Fondo completo: bloque del logo (flotante) + bloque principal
function buildPath(w: number, h: number, cy: number | null): string {
  const logo = roundedRect(PAD_L, PAD_Y, w, LOGO_BOTTOM, R);
  return `${logo} ${buildMain(w, h, cy)}`;
}

function isActiveHref(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar({
  email,
  signOutAction,
}: {
  email: string;
  signOutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Navegación optimista: el indicador se mueve al hacer clic,
  // sin esperar a que el servidor termine de renderizar la ruta
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  useEffect(() => { setPendingHref(null); }, [pathname]);
  const effectivePath = pendingHref ?? pathname;

  const width = collapsed ? 60 : 230;

  // Ítem activo
  const activeItem = navItems.find((it) => isActiveHref(effectivePath, it.href));
  const ActiveIcon = activeItem?.icon;

  // ── Íconos fijos; el indicador (círculo + curva) se desliza al activo ──
  const asideRef  = useRef<HTMLElement>(null);
  const navRef    = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const cyRef     = useRef<number | null>(null);
  const rafRef    = useRef<number | null>(null);
  const firstRef  = useRef(true);
  const [dims, setDims] = useState({ h: 0 });
  const [cy, setCy]     = useState<number | null>(null);

  const setCyNow = useCallback((v: number | null) => { cyRef.current = v; setCy(v); }, []);

  const animarA = useCallback((to: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const from = cyRef.current;
    if (from == null) { setCyNow(to); return; }
    const dur = 320, t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCyNow(from + (to - from) * e);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [setCyNow]);

  const medir = useCallback((animar: boolean) => {
    const aside = asideRef.current;
    if (aside) setDims({ h: aside.clientHeight });
    if (!aside || !collapsed || !activeRef.current) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setCyNow(null);
      return;
    }
    const ar = aside.getBoundingClientRect();
    const er = activeRef.current.getBoundingClientRect();
    const to = er.top - ar.top + er.height / 2;
    if (firstRef.current || !animar) { firstRef.current = false; setCyNow(to); }
    else animarA(to);
  }, [collapsed, animarA, setCyNow]);

  useEffect(() => { medir(true); }, [effectivePath]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { medir(false); }, [collapsed]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onResize = () => medir(false);
    const nav = navRef.current;
    window.addEventListener("resize", onResize);
    nav?.addEventListener("scroll", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      nav?.removeEventListener("scroll", onResize);
    };
  }, [medir]);
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <aside
      ref={asideRef}
      style={{ background: "#F8F9FA" }}
      className={cn(
        "relative hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300 z-20 flex-shrink-0",
        // margen derecho extra en comprimido para que el círculo flotante no toque el contenido
        collapsed ? "w-[60px] mr-5" : "w-[230px]",
      )}
    >
      {/* ── Fondo oscuro deformable (SVG) ───────────── */}
      <svg
        className="absolute inset-0 w-full h-full z-0 pointer-events-none transition-[all] duration-300"
        viewBox={`0 0 ${width} ${dims.h || 800}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={buildPath(width, dims.h || 800, cy)} fill={RAIL_BG} />
      </svg>

      {/* ── Círculo amarillo flotante que se desliza al módulo activo ── */}
      {collapsed && cy != null && ActiveIcon && (
        <span
          style={{ top: cy, background: ACTIVE, boxShadow: "0 6px 16px rgba(250,204,21,0.45)" }}
          className="absolute right-[-23px] -translate-y-1/2 w-[50px] h-[50px] rounded-full flex items-center justify-center z-30 pointer-events-none"
        >
          <ActiveIcon className="w-[19px] h-[19px]" style={{ color: "#0d0d12" }} />
        </span>
      )}

      {/* ── Logo (bloque flotante separado) ──────── */}
      <div
        style={{ height: MAIN_TOP }}
        className={cn(
          "relative z-10 flex items-center gap-2.5 px-4 flex-shrink-0",
          collapsed && "justify-center px-0",
        )}
      >
        <div className="flex-shrink-0 w-10 h-10">
          <Image src="/logo-icon.png" alt="NexCode97" width={40} height={40} className="w-10 h-10 object-cover rounded-xl" priority />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white leading-none tracking-tight">NexCode97</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">CRM</p>
          </div>
        )}
      </div>

      {/* ── Nav ──────────────────────────────────── */}
      {/* Caja de ícono fija (w-11 h-10) → mismo tamaño/posición en colapsado y expandido */}
      <nav ref={navRef} className="relative z-10 flex-1 px-2 overflow-y-auto">
        <div className="pt-2 pb-10 space-y-2">
          {/* Toggle expandir/contraer */}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expandir" : "Contraer"}
            className="relative flex items-center w-full rounded-md text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] transition-colors mb-1 cursor-pointer"
          >
            <span className="w-11 h-10 flex items-center justify-center shrink-0">
              {collapsed
                ? <ChevronRight className="w-[18px] h-[18px]" />
                : <ChevronLeft className="w-[18px] h-[18px]" />}
            </span>
            {!collapsed && <span className="text-[12px] font-medium">Contraer</span>}
          </button>

          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = isActiveHref(effectivePath, href);

            // ── Activo + colapsado: placeholder (el círculo se dibuja aparte) ──
            if (isActive && collapsed) {
              return (
                <Link key={href} ref={activeRef} href={href} title={label} className="relative flex items-center">
                  <span className="w-11 h-10 flex items-center justify-center shrink-0">
                    <Icon className="w-[17px] h-[17px] opacity-0" />
                  </span>
                </Link>
              );
            }

            // ── Activo (expandido): círculo amarillo en la caja + label ──
            if (isActive) {
              return (
                <Link key={href} href={href} className="relative flex items-center pr-3 rounded-md text-[13px] font-medium text-white">
                  <span className="w-11 h-10 flex items-center justify-center shrink-0">
                    <span
                      style={{ background: ACTIVE, boxShadow: "0 4px 12px rgba(250,204,21,0.4)" }}
                      className="w-[34px] h-[34px] rounded-full flex items-center justify-center"
                    >
                      <Icon className="w-[17px] h-[17px]" style={{ color: "#0d0d12" }} />
                    </span>
                  </span>
                  <span className="flex-1 truncate">{label}</span>
                </Link>
              );
            }

            // ── Ítem inactivo ──
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setPendingHref(href)}
                title={collapsed ? label : undefined}
                className={cn(
                  "relative flex items-center rounded-md text-[13px] font-medium transition-colors duration-150 group",
                  "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100",
                  !collapsed && "pr-3",
                )}
              >
                <span className="w-11 h-10 flex items-center justify-center shrink-0">
                  <Icon className="w-[17px] h-[17px] text-slate-400 group-hover:text-slate-100" />
                </span>
                {!collapsed && <span className="flex-1 truncate">{label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Footer: perfil admin ─────────────────── */}
      <div className="relative z-10 flex-shrink-0 border-t border-white/[0.06] p-2">
        <div className={cn(
          "flex items-center gap-2.5 px-2 py-1.5",
          collapsed && "justify-center px-0",
        )}>
          <Image
            src="/logo-icon.png"
            alt="Admin"
            width={36}
            height={36}
            className="w-9 h-9 object-cover rounded-full flex-shrink-0"
          />
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-white leading-none">Admin</p>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{email}</p>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  title="Cerrar sesión"
                  className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
