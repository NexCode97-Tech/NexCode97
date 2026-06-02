"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FaReact, FaNodeJs, FaDocker, FaGitAlt, FaWhatsapp,
} from "react-icons/fa";
import {
  SiNextdotjs, SiTypescript, SiTailwindcss, SiPrisma,
  SiPostgresql, SiVercel, SiCloudinary, SiExpress,
} from "react-icons/si";

const iconConfigs = [
  { Icon: FaReact,       color: "#61DAFB", label: "React"       },
  { Icon: SiNextdotjs,   color: "#ffffff", label: "Next.js"     },
  { Icon: FaNodeJs,      color: "#339933", label: "Node.js"     },
  { Icon: SiTypescript,  color: "#3178C6", label: "TypeScript"  },
  { Icon: SiTailwindcss, color: "#06B6D4", label: "Tailwind"    },
  { Icon: SiPrisma,      color: "#5a67d8", label: "Prisma"      },
  { Icon: SiPostgresql,  color: "#336791", label: "PostgreSQL"  },
  { Icon: SiVercel,      color: "#ffffff", label: "Vercel"      },
  { Icon: SiCloudinary,  color: "#3448C5", label: "Cloudinary"  },
  { Icon: SiExpress,     color: "#ffffff", label: "Express"     },
  { Icon: FaDocker,      color: "#2496ED", label: "Docker"      },
  { Icon: FaGitAlt,      color: "#F05032", label: "Git"         },
  { Icon: FaWhatsapp,    color: "#25D366", label: "WhatsApp"    },
];

const ORBIT_COUNT = 3;
const ORBIT_GAP = 8;
const iconsPerOrbit = Math.ceil(iconConfigs.length / ORBIT_COUNT);

export default function StackFeatureSection() {
  return (
    <section className="relative max-w-6xl mx-auto my-24 px-4">
      <div className="relative flex items-center justify-between h-[30rem] border overflow-hidden rounded-3xl pl-10"
        style={{ borderColor: "rgba(124,58,237,0.25)", background: "#09090e" }}>

        {/* Left: texto */}
        <div className="w-1/2 z-10 relative">
          <p className="text-xs font-bold tracking-[0.14em] uppercase mb-4 flex items-center gap-3"
            style={{ color: "#22d3ee", fontFamily: "var(--font-inter), sans-serif" }}>
            <span className="inline-block w-4 h-0.5 rounded" style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }} />
            Tecnología
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight"
            style={{ color: "#fff", fontFamily: "var(--font-inter), sans-serif", letterSpacing: "-0.04em" }}>
            Construye tu<br />
            <span style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              idea con nosotros
            </span>
          </h2>
          <p className="mb-8 max-w-sm text-sm leading-relaxed"
            style={{ color: "#888ca4", fontFamily: "var(--font-inter), sans-serif" }}>
            Usamos el stack más moderno y probado para que tu producto sea rápido, escalable y fácil de mantener.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://wa.me/573164134212" target="_blank" rel="noopener noreferrer">
              <Button className="rounded-full px-6 font-semibold"
                style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", border: "none", color: "#fff" }}>
                Comenzar proyecto
              </Button>
            </a>
            <a href="#portafolio">
              <Button variant="outline" className="rounded-full px-6 font-semibold"
                style={{ borderColor: "rgba(124,58,237,0.4)", color: "#a78bfa", background: "transparent" }}>
                Ver portafolio
              </Button>
            </a>
          </div>
        </div>

        {/* Right: órbitas */}
        <div className="relative w-1/2 h-full flex items-center justify-start overflow-hidden">
          <div className="relative w-[50rem] h-[50rem] translate-x-[50%] flex items-center justify-center">

            {/* Centro */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center z-10"
              style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", boxShadow: "0 0 32px rgba(124,58,237,0.3)" }}>
              <FaReact className="w-10 h-10" style={{ color: "#61DAFB" }} />
            </div>

            {/* Órbitas */}
            {[...Array(ORBIT_COUNT)].map((_, orbitIdx) => {
              const size = `${12 + ORBIT_GAP * (orbitIdx + 1)}rem`;
              const angleStep = (2 * Math.PI) / iconsPerOrbit;
              const duration = 18 + orbitIdx * 8;
              const dir = orbitIdx % 2 === 0 ? "orbit-cw" : "orbit-ccw";

              return (
                <div
                  key={orbitIdx}
                  className={`absolute rounded-full ${dir}`}
                  style={{
                    width: size,
                    height: size,
                    border: "1px dashed rgba(124,58,237,0.25)",
                    animationDuration: `${duration}s`,
                  }}
                >
                  {iconConfigs
                    .slice(orbitIdx * iconsPerOrbit, orbitIdx * iconsPerOrbit + iconsPerOrbit)
                    .map((cfg, iconIdx) => {
                      const angle = iconIdx * angleStep;
                      const x = 50 + 50 * Math.cos(angle);
                      const y = 50 + 50 * Math.sin(angle);
                      const counterClass = orbitIdx % 2 === 0 ? "counter-ccw" : "counter-cw";

                      return (
                        <div
                          key={iconIdx}
                          className={`absolute rounded-full p-2 ${counterClass}`}
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: "translate(-50%, -50%)",
                            background: "rgba(13,13,20,0.9)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                            animationDuration: `${duration}s`,
                          }}
                        >
                          <cfg.Icon className="w-7 h-7" style={{ color: cfg.color }} />
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-cw  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
        @keyframes spin-ccw { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
        @keyframes counter-ccw { from { transform: translate(-50%,-50%) rotate(0deg);    } to { transform: translate(-50%,-50%) rotate(-360deg);  } }
        @keyframes counter-cw  { from { transform: translate(-50%,-50%) rotate(0deg);    } to { transform: translate(-50%,-50%) rotate(360deg);   } }
        .orbit-cw   { animation: spin-cw  linear infinite; }
        .orbit-ccw  { animation: spin-ccw linear infinite; }
        .counter-ccw { animation: counter-ccw linear infinite; }
        .counter-cw  { animation: counter-cw  linear infinite; }
      `}</style>
    </section>
  );
}
