# Auth + DB + Leads Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Configurar NextAuth Credentials, Prisma + PostgreSQL en Railway, formulario de contacto público y panel admin para gestionar leads.

**Architecture:** Next.js App Router con NextAuth v5 (JWT strategy), Prisma ORM conectado a PostgreSQL en Railway. El formulario público guarda leads en la DB y notifica por WhatsApp. El dashboard `/dashboard` está protegido y solo accesible con el usuario admin.

**Tech Stack:** next-auth@beta, @prisma/client, prisma, bcryptjs, @types/bcryptjs

---

## Archivos a crear/modificar

| Archivo | Acción | Responsabilidad |
|---------|--------|-----------------|
| `web/prisma/schema.prisma` | Crear | Schema de User y Lead |
| `web/lib/prisma.ts` | Crear | Cliente Prisma singleton |
| `web/auth.ts` | Crear | Configuración NextAuth |
| `web/middleware.ts` | Crear | Proteger rutas /dashboard |
| `web/app/api/auth/[...nextauth]/route.ts` | Crear | Handler NextAuth |
| `web/app/api/leads/route.ts` | Crear | API para recibir leads del formulario |
| `web/app/login/page.tsx` | Crear | Página de login |
| `web/app/dashboard/layout.tsx` | Crear | Layout protegido del dashboard |
| `web/app/dashboard/page.tsx` | Crear | Lista de leads |
| `web/components/contact-form.tsx` | Crear | Formulario de contacto público |
| `web/app/page.tsx` | Modificar | Agregar ContactForm |
| `web/.env.local` | Crear | Variables de entorno locales |
| `web/app/layout.tsx` | Modificar | Agregar SessionProvider |
| `web/components/providers.tsx` | Crear | SessionProvider wrapper |

---

### Task 1: Instalar dependencias y configurar Prisma

**Files:**
- Modify: `web/package.json`
- Create: `web/prisma/schema.prisma`
- Create: `web/lib/prisma.ts`
- Create: `web/.env.local`

- [ ] **Step 1: Instalar paquetes**

```bash
cd web
pnpm add next-auth@beta @auth/prisma-adapter prisma @prisma/client bcryptjs
pnpm add -D @types/bcryptjs
```

- [ ] **Step 2: Crear schema Prisma**

Crear `web/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String   @id @default(cuid())
  email          String   @unique
  hashedPassword String
  name           String?
  createdAt      DateTime @default(now())
}

model Lead {
  id          String   @id @default(cuid())
  name        String
  email       String?
  whatsapp    String
  company     String?
  description String
  status      String   @default("nuevo")
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

- [ ] **Step 3: Crear cliente Prisma singleton**

Crear `web/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 4: Crear .env.local**

Crear `web/.env.local`:

```env
DATABASE_URL="postgresql://postgres:ovoamiUzzAlugsAOhVnoOigaWgyTQnTl@acela.proxy.rlwy.net:43691/railway"
AUTH_SECRET="GENERAR_CON_openssl_rand_-base64_32"
AUTH_URL="http://localhost:3000"
ADMIN_EMAIL="nexcode97@gmail.com"
```

- [ ] **Step 5: Generar AUTH_SECRET**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copiar el resultado y reemplazar `GENERAR_CON_openssl_rand_-base64_32` en `.env.local`.

- [ ] **Step 6: Correr migración inicial**

```bash
cd web
npx prisma migrate dev --name init
```

Resultado esperado: `✔ Generated Prisma Client` y tablas `User` y `Lead` creadas.

- [ ] **Step 7: Crear usuario admin en la DB**

```bash
cd web
node -e "
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('TU_PASSWORD_AQUI', 12);
console.log(hash);
"
```

Luego insertar en la DB:

```bash
npx prisma studio
```

Abrir `User` → Add record → email: `nexcode97@gmail.com`, hashedPassword: el hash generado.

- [ ] **Step 8: Commit**

```bash
git add web/prisma web/lib/prisma.ts web/package.json web/pnpm-lock.yaml
git commit -m "feat(db): schema Prisma con User y Lead, cliente singleton"
```

---

### Task 2: Configurar NextAuth

**Files:**
- Create: `web/auth.ts`
- Create: `web/middleware.ts`
- Create: `web/app/api/auth/[...nextauth]/route.ts`
- Create: `web/components/providers.tsx`
- Modify: `web/app/layout.tsx`

- [ ] **Step 1: Crear auth.ts**

Crear `web/auth.ts`:

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id as string;
      return session;
    },
  },
});
```

- [ ] **Step 2: Crear route handler**

Crear `web/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

- [ ] **Step 3: Crear middleware**

Crear `web/middleware.ts`:

```typescript
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isLogin = req.nextUrl.pathname === "/login";

  if (isDashboard && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isLogin && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
```

- [ ] **Step 4: Crear SessionProvider**

Crear `web/components/providers.tsx`:

```typescript
"use client";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

- [ ] **Step 5: Agregar Providers al layout**

Modificar `web/app/layout.tsx` — envolver `{children}` con `<Providers>`:

```typescript
import { Providers } from "@/components/providers";
// ...
<body className="min-h-full flex flex-col">
  <Providers>
    <SiteHeader />
    {children}
    <Analytics />
  </Providers>
</body>
```

- [ ] **Step 6: Commit**

```bash
git add web/auth.ts web/middleware.ts web/app/api web/components/providers.tsx web/app/layout.tsx
git commit -m "feat(auth): NextAuth Credentials con JWT, middleware protege /dashboard"
```

---

### Task 3: Página de login

**Files:**
- Create: `web/app/login/page.tsx`

- [ ] **Step 1: Crear página de login**

Crear `web/app/login/page.tsx`:

```typescript
"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Correo o contraseña incorrectos");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#09090e" }}>
      <div className="w-full max-w-sm px-6">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image src="/logo-nuevo.png" alt="NexCode97" width={120} height={32} className="h-10 w-auto" />
          <p className="text-sm text-white/40">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/60">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors focus:ring-1 focus:ring-white/20"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              placeholder="nexcode97@gmail.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/60">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors focus:ring-1 focus:ring-white/20"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full py-3 text-sm font-bold transition-opacity disabled:opacity-50"
            style={{ background: "#FFF200", color: "#09090e" }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add web/app/login
git commit -m "feat(auth): página de login con diseño oscuro NexCode97"
```

---

### Task 4: Dashboard de leads

**Files:**
- Create: `web/app/dashboard/layout.tsx`
- Create: `web/app/dashboard/page.tsx`

- [ ] **Step 1: Crear layout del dashboard**

Crear `web/app/dashboard/layout.tsx`:

```typescript
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import Image from "next/image";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen" style={{ background: "#09090e" }}>
      <header className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <Image src="/logo-nuevo.png" alt="NexCode97" width={120} height={32} className="h-8 w-auto" />
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/40">{session.user?.email}</span>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button type="submit" className="text-xs text-white/50 hover:text-white transition-colors">
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Crear página principal del dashboard**

Crear `web/app/dashboard/page.tsx`:

```typescript
import { prisma } from "@/lib/prisma";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  nuevo:         { label: "Nuevo",          color: "#FFF200" },
  contactado:    { label: "Contactado",     color: "#60a5fa" },
  negociacion:   { label: "En negociación", color: "#a78bfa" },
  cerrado:       { label: "Cerrado",        color: "#4ade80" },
  perdido:       { label: "Perdido",        color: "#f87171" },
};

export default async function DashboardPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-sm text-white/40 mt-1">{leads.length} en total</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {leads.length === 0 && (
          <div className="rounded-xl py-16 text-center text-white/30 text-sm"
            style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
            Aún no hay leads. Cuando alguien llene el formulario aparecerá aquí.
          </div>
        )}
        {leads.map((lead) => {
          const status = STATUS_LABELS[lead.status] ?? STATUS_LABELS.nuevo;
          return (
            <div key={lead.id} className="rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-white">{lead.name}</p>
                  {lead.company && <span className="text-xs text-white/40">· {lead.company}</span>}
                </div>
                <p className="text-sm text-white/60 line-clamp-2">{lead.description}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-white/30">
                  <span>{lead.whatsapp}</span>
                  {lead.email && <span>{lead.email}</span>}
                  <span>{new Date(lead.createdAt).toLocaleDateString("es-CO")}</span>
                </div>
              </div>
              <span className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: `${status.color}18`, color: status.color, border: `1px solid ${status.color}40` }}>
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add web/app/dashboard
git commit -m "feat(dashboard): layout protegido y lista de leads"
```

---

### Task 5: API de leads + formulario de contacto

**Files:**
- Create: `web/app/api/leads/route.ts`
- Create: `web/components/contact-form.tsx`
- Modify: `web/app/page.tsx`

- [ ] **Step 1: Crear API route para leads**

Crear `web/app/api/leads/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, company, description } = body;

    if (!name || !whatsapp || !description) {
      return NextResponse.json(
        { error: "Nombre, WhatsApp y descripción son requeridos" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: { name, email, whatsapp, company, description },
    });

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Crear componente ContactForm**

Crear `web/components/contact-form.tsx`:

```typescript
"use client";
import { useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "", email: "", whatsapp: "", company: "", description: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setStatus(res.ok ? "success" : "error");
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl p-10 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <p className="text-2xl font-bold text-white mb-2">¡Mensaje recibido!</p>
        <p className="text-sm text-white/50">Te contactamos en las próximas horas por WhatsApp.</p>
      </div>
    );
  }

  return (
    <section id="contacto" className="py-24" style={{ background: "#09090e" }}>
      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ letterSpacing: "-0.04em" }}>
            Cuéntanos tu proyecto
          </h2>
          <p className="text-sm text-white/50">
            Sin compromisos. Te respondemos en menos de 24 horas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/50">Nombre *</label>
              <input name="name" value={form.name} onChange={handleChange} required
                placeholder="Tu nombre"
                className="rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-white/20"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/50">WhatsApp *</label>
              <input name="whatsapp" value={form.whatsapp} onChange={handleChange} required
                placeholder="+57 300 000 0000"
                className="rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-white/20"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/50">Correo</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="tu@correo.com"
                className="rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-white/20"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-white/50">Empresa</label>
              <input name="company" value={form.company} onChange={handleChange}
                placeholder="Nombre de tu empresa"
                className="rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-white/20"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/50">¿Qué necesitas? *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required
              rows={5} placeholder="Describe tu proyecto o lo que necesitas..."
              className="rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-white/20 resize-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
          </div>

          {status === "error" && (
            <p className="text-xs text-red-400">Hubo un error. Intenta de nuevo o escríbenos directo al WhatsApp.</p>
          )}

          <button type="submit" disabled={status === "loading"}
            className="mt-2 rounded-full py-4 text-sm font-bold transition-opacity disabled:opacity-50"
            style={{ background: "#FFF200", color: "#09090e" }}>
            {status === "loading" ? "Enviando..." : "Enviar mensaje →"}
          </button>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Agregar ContactForm a la página principal**

Modificar `web/app/page.tsx` — agregar `<ContactForm />` antes del footer:

```typescript
import { ContactForm } from "@/components/contact-form";
// ...
<TestimoniosSection />
<ContactForm />
<SiteFooter />
```

- [ ] **Step 4: Commit**

```bash
git add web/app/api/leads web/components/contact-form.tsx web/app/page.tsx
git commit -m "feat(leads): API POST /api/leads + formulario de contacto público"
```

---

### Task 6: Variables de entorno en Vercel + Railway

- [ ] **Step 1: Agregar variables en Vercel**

En el panel de Vercel → proyecto `nex-code97` → **Environment Variables**, agregar:

```
DATABASE_URL = postgresql://postgres:ovoamiUzzAlugsAOhVnoOigaWgyTQnTl@postgres.railway.internal:5432/railway
AUTH_SECRET = [el valor generado en Task 1 Step 5]
AUTH_URL = https://nexcode97.com
ADMIN_EMAIL = nexcode97@gmail.com
```

> **Nota:** En producción usar la URL **interna** de Railway (`postgres.railway.internal`) porque el frontend desplegado en Vercel puede conectarse a Railway por red interna si están en el mismo proyecto. Si no funciona, usar la pública.

- [ ] **Step 2: Push final**

```bash
git push origin main
```

