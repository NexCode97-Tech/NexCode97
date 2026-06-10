# Agente de Leads IA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un agente IA que clasifica, puntúa y genera mensajes personalizados para cada lead nuevo, notifica por email HTML y permite gestionar el estado del lead desde el dashboard.

**Architecture:** El agente corre como función server-side en Next.js — se invoca desde `/api/leads` tras crear el lead en la DB. Groq procesa la descripción + contexto histórico y retorna JSON estructurado. Resend envía el email HTML. Un cron job de Vercel revisa leads sin respuesta cada hora.

**Tech Stack:** Next.js 15 App Router, Groq SDK, Resend, Prisma 7, PostgreSQL (Railway), Vercel Cron Jobs, TypeScript.

---

## Archivos del plan

| Archivo | Acción |
|---------|--------|
| `web/prisma/schema.prisma` | Modificar — agregar campos al modelo Lead |
| `web/lib/agent.ts` | Crear — lógica Groq + prompt |
| `web/lib/mailer.ts` | Crear — email HTML con Resend |
| `web/app/api/leads/route.ts` | Modificar — invocar agente tras crear lead |
| `web/app/api/leads/[id]/status/route.ts` | Crear — PATCH para cambiar estado |
| `web/app/api/cron/follow-up/route.ts` | Crear — cron 48h |
| `web/app/dashboard/page.tsx` | Modificar — dashboard interactivo |
| `web/vercel.json` | Crear — config cron Vercel |

---

## Task 1: Migración de base de datos

**Files:**
- Modify: `web/prisma/schema.prisma`

- [ ] **Step 1: Agregar campos al modelo Lead**

Reemplazar el modelo `Lead` en `web/prisma/schema.prisma`:

```prisma
model Lead {
  id           String   @id @default(cuid())
  name         String
  email        String?
  whatsapp     String
  company      String?
  description  String
  status       String   @default("nuevo")
  notes        String?
  serviceType  String?
  priority     String?
  score        Int?
  scoreReason  String?
  enriched     Json?
  suggestedMsg String?
  agentVersion String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

- [ ] **Step 2: Crear la migración**

```bash
cd web
npx prisma migrate dev --name add_agent_fields
```

Esperado: migración aplicada sin errores, archivo creado en `web/prisma/migrations/`.

- [ ] **Step 3: Verificar que el cliente Prisma se regeneró**

```bash
npx prisma generate
```

Esperado: `Generated Prisma Client` sin errores.

- [ ] **Step 4: Commit**

```bash
git add web/prisma/schema.prisma web/prisma/migrations/
git commit -m "feat: agregar campos de agente al modelo Lead"
```

---

## Task 2: Instalar dependencias

**Files:**
- `web/package.json`

- [ ] **Step 1: Instalar Groq SDK y Resend**

```bash
cd web
npm install groq-sdk resend
```

Esperado: ambos paquetes en `dependencies` de `web/package.json`.

- [ ] **Step 2: Commit**

```bash
git add web/package.json web/package-lock.json
git commit -m "feat: instalar groq-sdk y resend"
```

---

## Task 3: Agente Groq

**Files:**
- Create: `web/lib/agent.ts`

- [ ] **Step 1: Crear el archivo del agente**

Crear `web/lib/agent.ts` con el siguiente contenido completo:

```typescript
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const AGENT_VERSION = "1.0.0";

export type AgentResult = {
  serviceType: string;
  priority: string;
  score: number;
  scoreReason: string;
  enriched: {
    hasBudget: boolean;
    hasDeadline: boolean;
    isDecisionMaker: boolean;
    hasExistingSystem: boolean;
    readinessToBuy: "alto" | "medio" | "bajo";
  };
  suggestedMsg: string;
};

async function getWonLeadsContext(): Promise<string> {
  const wonLeads = await prisma.lead.findMany({
    where: { status: "ganado" },
    orderBy: { updatedAt: "desc" },
    take: 10,
    select: { name: true, company: true, description: true, serviceType: true, score: true },
  });

  if (wonLeads.length === 0) return "No hay leads ganados aún.";

  return wonLeads
    .map((l) => `- ${l.name}${l.company ? ` (${l.company})` : ""}: "${l.description}" → ${l.serviceType ?? "sin clasificar"} [score: ${l.score ?? "N/A"}]`)
    .join("\n");
}

export async function analyzeLead(lead: {
  name: string;
  company?: string | null;
  description: string;
  whatsapp: string;
}): Promise<AgentResult> {
  const wonContext = await getWonLeadsContext();

  const systemPrompt = `Eres el agente de calificación de leads de NexCode97, una empresa colombiana de desarrollo de software a la medida.
Tu tarea es analizar el mensaje de un prospecto y retornar un JSON con su clasificación, score y un mensaje personalizado.

NexCode97 construye: apps web, apps móviles, landings, e-commerce, sistemas de gestión, integraciones y PWAs.
No usa mensualidades. Cobra por proyecto único.

Leads ganados recientemente (úsalos como referencia para ajustar el score):
${wonContext}

REGLAS DE SCORING (suma de puntos, máximo 100):
- Menciona presupuesto o rango de precio: +20
- Menciona fecha límite o urgencia: +15
- Empresa establecida (no solo "tengo una idea"): +15
- Es el decisor (dueño, gerente, CEO, fundador): +15
- Descripción clara y detallada (más de 50 palabras): +10
- Ya tiene un sistema anterior que quiere mejorar: +10
- Menciona más de un módulo o funcionalidad: +10
- Perfil similar a leads ganados históricamente: hasta +15 adicional
- Solo dice "quiero una app" sin ningún detalle: -20

TONO DEL MENSAJE SUGERIDO: Casual, directo, como si fuera el dueño de NexCode97 escribiendo personalmente. En español colombiano. Sin emojis excesivos. Máximo 3 oraciones. Debe mencionar el nombre del lead y su necesidad específica.

Retorna ÚNICAMENTE el siguiente JSON válido, sin texto adicional:
{
  "serviceType": "app_web|app_movil|landing|ecommerce|sistema_gestion|integracion|otro",
  "priority": "alta|media|baja",
  "score": número entre 0 y 100,
  "scoreReason": "justificación en máximo 2 líneas",
  "enriched": {
    "hasBudget": boolean,
    "hasDeadline": boolean,
    "isDecisionMaker": boolean,
    "hasExistingSystem": boolean,
    "readinessToBuy": "alto|medio|bajo"
  },
  "suggestedMsg": "mensaje personalizado listo para WhatsApp"
}`;

  const userPrompt = `Analiza este lead:
Nombre: ${lead.name}
Empresa: ${lead.company ?? "No especificada"}
WhatsApp: ${lead.whatsapp}
Mensaje: ${lead.description}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 800,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const result = JSON.parse(raw) as AgentResult;

  return result;
}
```

- [ ] **Step 2: Verificar que TypeScript compila**

```bash
cd web
npx tsc --noEmit
```

Esperado: sin errores de tipos.

- [ ] **Step 3: Commit**

```bash
git add web/lib/agent.ts
git commit -m "feat: agente Groq con scoring y contexto histórico"
```

---

## Task 4: Mailer HTML con Resend

**Files:**
- Create: `web/lib/mailer.ts`

- [ ] **Step 1: Crear el mailer**

Crear `web/lib/mailer.ts`:

```typescript
import { Resend } from "resend";
import type { AgentResult } from "@/lib/agent";

const resend = new Resend(process.env.RESEND_API_KEY);

function scoreBar(score: number): string {
  const filled = Math.round(score / 10);
  const empty = 10 - filled;
  const color = score >= 70 ? "#4ade80" : score >= 40 ? "#FFF200" : "#f87171";
  return `<span style="color:${color};font-size:18px;letter-spacing:2px">${"█".repeat(filled)}${"░".repeat(empty)}</span> <strong style="color:${color}">${score}/100</strong>`;
}

function priorityBadge(priority: string): string {
  const colors: Record<string, string> = {
    alta: "#f87171",
    media: "#FFF200",
    baja: "#94a3b8",
  };
  const color = colors[priority] ?? "#94a3b8";
  return `<span style="background:${color}22;color:${color};border:1px solid ${color}44;padding:2px 12px;border-radius:99px;font-size:12px;font-weight:700;text-transform:uppercase">${priority}</span>`;
}

function enrichedList(enriched: AgentResult["enriched"]): string {
  const items = [
    { label: "Tiene presupuesto", value: enriched.hasBudget },
    { label: "Tiene fecha límite", value: enriched.hasDeadline },
    { label: "Es el decisor", value: enriched.isDecisionMaker },
    { label: "Tiene sistema anterior", value: enriched.hasExistingSystem },
  ];
  return items
    .map((i) => `<li style="margin:4px 0;color:#94a3b8">${i.value ? "✓" : "✗"} ${i.label}</li>`)
    .join("");
}

export async function sendLeadNotification(lead: {
  id: string;
  name: string;
  email?: string | null;
  whatsapp: string;
  company?: string | null;
  description: string;
}, result: AgentResult) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL ?? "https://nexcode97.com"}/dashboard`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#09090e;font-family:sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px">

    <!-- Header -->
    <div style="margin-bottom:24px">
      <span style="color:#FFF200;font-size:22px;font-weight:900;letter-spacing:-0.5px">NexCode97</span>
      <span style="color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.5px"> · Lead nuevo</span>
    </div>

    <!-- Lead info -->
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:16px">
      <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:#ffffff">${lead.name}</p>
      ${lead.company ? `<p style="margin:0 0 12px;font-size:14px;color:#64748b">${lead.company}</p>` : ""}
      <p style="margin:4px 0;font-size:14px;color:#94a3b8">📱 ${lead.whatsapp}</p>
      ${lead.email ? `<p style="margin:4px 0;font-size:14px;color:#94a3b8">✉️ ${lead.email}</p>` : ""}
    </div>

    <!-- Score -->
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:16px">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#64748b">Score</p>
      <p style="margin:0 0 8px">${scoreBar(result.score)}</p>
      <p style="margin:0">${priorityBadge(result.priority)} &nbsp; <span style="color:#a78bfa;font-size:13px">${result.serviceType.replace("_", " ")}</span></p>
      <p style="margin:12px 0 0;font-size:13px;color:#94a3b8;font-style:italic">${result.scoreReason}</p>
    </div>

    <!-- Señales -->
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:16px">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#64748b">Señales detectadas</p>
      <ul style="margin:0;padding:0 0 0 4px;list-style:none">${enrichedList(result.enriched)}</ul>
      <p style="margin:8px 0 0;font-size:13px;color:#94a3b8">Disposición de compra: <strong style="color:#ffffff">${result.enriched.readinessToBuy}</strong></p>
    </div>

    <!-- Descripción -->
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:16px">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#64748b">Mensaje original</p>
      <p style="margin:0;font-size:14px;color:#94a3b8;line-height:1.6">${lead.description}</p>
    </div>

    <!-- Mensaje sugerido -->
    <div style="background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#a78bfa">Mensaje sugerido para WhatsApp</p>
      <p style="margin:0;font-size:14px;color:#ffffff;line-height:1.7">${result.suggestedMsg}</p>
    </div>

    <!-- CTA -->
    <a href="${dashboardUrl}" style="display:inline-block;background:#FFF200;color:#09090e;font-weight:700;font-size:14px;padding:12px 28px;border-radius:99px;text-decoration:none">
      Ver en dashboard →
    </a>

  </div>
</body>
</html>`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "NexCode97 <hola@nexcode97.com>",
    to: "nexcode97@gmail.com",
    subject: `Lead nuevo [${result.score}/100] — ${lead.name} · ${result.serviceType.replace("_", " ")}`,
    html,
  });
}

export async function sendFollowUpReminder(lead: {
  id: string;
  name: string;
  whatsapp: string;
  company?: string | null;
  description: string;
  createdAt: Date;
}, followUpMsg: string) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL ?? "https://nexcode97.com"}/dashboard`;
  const hoursAgo = Math.round((Date.now() - lead.createdAt.getTime()) / 3600000);

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#09090e;font-family:sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px">
    <div style="margin-bottom:24px">
      <span style="color:#f87171;font-size:22px;font-weight:900">⏰ Seguimiento pendiente</span>
    </div>
    <div style="background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);border-radius:12px;padding:20px;margin-bottom:16px">
      <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#ffffff">${lead.name}</p>
      ${lead.company ? `<p style="margin:0 0 8px;font-size:13px;color:#64748b">${lead.company}</p>` : ""}
      <p style="margin:4px 0;font-size:13px;color:#94a3b8">📱 ${lead.whatsapp}</p>
      <p style="margin:8px 0 0;font-size:12px;color:#f87171">Sin respuesta hace ${hoursAgo} horas</p>
    </div>
    <div style="background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#a78bfa">Mensaje de seguimiento</p>
      <p style="margin:0;font-size:14px;color:#ffffff;line-height:1.7">${followUpMsg}</p>
    </div>
    <a href="${dashboardUrl}" style="display:inline-block;background:#FFF200;color:#09090e;font-weight:700;font-size:14px;padding:12px 28px;border-radius:99px;text-decoration:none">
      Ver en dashboard →
    </a>
  </div>
</body>
</html>`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "NexCode97 <hola@nexcode97.com>",
    to: "nexcode97@gmail.com",
    subject: `⏰ Seguimiento — ${lead.name} lleva ${hoursAgo}h sin respuesta`,
    html,
  });
}
```

- [ ] **Step 2: Verificar tipos**

```bash
cd web
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add web/lib/mailer.ts
git commit -m "feat: mailer HTML con Resend para notificaciones de leads"
```

---

## Task 5: Integrar agente en el endpoint de leads

**Files:**
- Modify: `web/app/api/leads/route.ts`

- [ ] **Step 1: Actualizar el endpoint**

Reemplazar el contenido completo de `web/app/api/leads/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeLead, AGENT_VERSION } from "@/lib/agent";
import { sendLeadNotification } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, whatsapp, company, description } = body;

    if (!name || !whatsapp || !description) {
      return NextResponse.json(
        { error: "Nombre, WhatsApp y descripción son requeridos." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: { name, email: email || null, whatsapp, company: company || null, description },
    });

    // Agente corre en background — no bloquea la respuesta al usuario
    (async () => {
      try {
        const result = await analyzeLead({ name, company, description, whatsapp });

        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            serviceType: result.serviceType,
            priority: result.priority,
            score: result.score,
            scoreReason: result.scoreReason,
            enriched: result.enriched,
            suggestedMsg: result.suggestedMsg,
            agentVersion: AGENT_VERSION,
          },
        });

        await sendLeadNotification(
          { id: lead.id, name, email, whatsapp, company, description },
          result
        );
      } catch (err) {
        console.error("[agent] Error procesando lead:", err);
      }
    })();

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verificar tipos**

```bash
cd web
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add web/app/api/leads/route.ts
git commit -m "feat: integrar agente Groq en endpoint de leads"
```

---

## Task 6: Endpoint PATCH para cambiar estado del lead

**Files:**
- Create: `web/app/api/leads/[id]/status/route.ts`

- [ ] **Step 1: Crear el endpoint**

Crear `web/app/api/leads/[id]/status/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["nuevo", "contactado", "ganado", "perdido"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ ok: true, status: lead.status });
}
```

- [ ] **Step 2: Verificar tipos**

```bash
cd web
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add web/app/api/leads/[id]/status/route.ts
git commit -m "feat: endpoint PATCH para cambiar estado de lead"
```

---

## Task 7: Cron de seguimiento 48h

**Files:**
- Create: `web/app/api/cron/follow-up/route.ts`

- [ ] **Step 1: Crear el cron handler**

Crear `web/app/api/cron/follow-up/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";
import { sendFollowUpReminder } from "@/lib/mailer";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization");
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const staleLeads = await prisma.lead.findMany({
    where: {
      status: "nuevo",
      createdAt: { lte: cutoff },
    },
    orderBy: { createdAt: "asc" },
  });

  for (const lead of staleLeads) {
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `Eres el agente de ventas de NexCode97, empresa colombiana de desarrollo de software a la medida. 
Escribe un mensaje de seguimiento casual y directo para un prospecto que no ha respondido en más de 48 horas.
El mensaje debe ser diferente al inicial, más corto (máximo 2 oraciones), en español colombiano.
Sin emojis. Solo el texto del mensaje, sin encabezados ni explicaciones.`,
          },
          {
            role: "user",
            content: `Prospecto: ${lead.name}${lead.company ? ` de ${lead.company}` : ""}
Mensaje original: ${lead.description}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 200,
      });

      const followUpMsg = completion.choices[0]?.message?.content?.trim() ?? "";

      await sendFollowUpReminder(
        {
          id: lead.id,
          name: lead.name,
          whatsapp: lead.whatsapp,
          company: lead.company,
          description: lead.description,
          createdAt: lead.createdAt,
        },
        followUpMsg
      );
    } catch (err) {
      console.error(`[cron] Error procesando lead ${lead.id}:`, err);
    }
  }

  return NextResponse.json({ ok: true, processed: staleLeads.length });
}
```

- [ ] **Step 2: Verificar tipos**

```bash
cd web
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add web/app/api/cron/follow-up/route.ts
git commit -m "feat: cron de seguimiento automático para leads sin respuesta (48h)"
```

---

## Task 8: Configurar Vercel Cron

**Files:**
- Create: `web/vercel.json`

- [ ] **Step 1: Crear vercel.json**

Verificar si existe `web/vercel.json`. Si no existe, crearlo:

```json
{
  "crons": [
    {
      "path": "/api/cron/follow-up",
      "schedule": "0 * * * *"
    }
  ]
}
```

Si ya existe, agregar el bloque `"crons"` al JSON existente sin borrar el contenido previo.

- [ ] **Step 2: Commit**

```bash
git add web/vercel.json
git commit -m "feat: configurar Vercel Cron Job para seguimiento de leads cada hora"
```

---

## Task 9: Dashboard interactivo

**Files:**
- Modify: `web/app/dashboard/page.tsx`

- [ ] **Step 1: Reemplazar el dashboard con versión interactiva**

Reemplazar el contenido completo de `web/app/dashboard/page.tsx`:

```tsx
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Image from "next/image";

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

const STATUS_OPTIONS = ["nuevo", "contactado", "ganado", "perdido"];
const STATUS_COLORS: Record<string, string> = {
  nuevo: "#FFF200",
  contactado: "#60a5fa",
  ganado: "#4ade80",
  perdido: "#f87171",
};

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
                    <form action={updateLeadStatus}>
                      <input type="hidden" name="id" value={lead.id} />
                      <select
                        name="status"
                        defaultValue={lead.status}
                        onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        className="rounded-full px-3 py-1 text-xs font-semibold cursor-pointer outline-none"
                        style={{
                          background: `${STATUS_COLORS[lead.status] ?? "#64748b"}22`,
                          color: STATUS_COLORS[lead.status] ?? "#64748b",
                          border: `1px solid ${STATUS_COLORS[lead.status] ?? "#64748b"}44`,
                        }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} style={{ background: "#09090e", color: "#ffffff" }}>{s}</option>
                        ))}
                      </select>
                    </form>
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
```

- [ ] **Step 2: Verificar tipos**

```bash
cd web
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Step 3: Commit**

```bash
git add web/app/dashboard/page.tsx
git commit -m "feat: dashboard interactivo con score, prioridad y selector de estado"
```

---

## Task 10: Variables de entorno y push final

**Files:**
- Vercel dashboard (entorno externo)

- [ ] **Step 1: Agregar variables en Vercel**

En el dashboard de Vercel → proyecto NexCode97 → Settings → Environment Variables, agregar:

| Variable | Valor |
|----------|-------|
| `GROQ_API_KEY` | Tu API key de Groq |
| `RESEND_API_KEY` | Tu API key de Resend (resend.com) |
| `RESEND_FROM_EMAIL` | `NexCode97 <hola@nexcode97.com>` (dominio verificado en Resend) |
| `CRON_SECRET` | Generar con: `openssl rand -base64 32` |

- [ ] **Step 2: Verificar que GROQ_API_KEY también esté en Vercel**

La variable ya está en Railway (para el backend si existiera), pero el agente corre en Next.js/Vercel. Confirmar que también esté en Vercel.

- [ ] **Step 3: Push final**

```bash
git push origin main
```

Esperado: Vercel despliega sin errores de build.

- [ ] **Step 4: Verificar el cron en Vercel**

En Vercel dashboard → proyecto → Settings → Cron Jobs. Confirmar que aparece `/api/cron/follow-up` con schedule `0 * * * *`.

- [ ] **Step 5: Prueba end-to-end**

1. Ir a nexcode97.com y llenar el formulario de contacto con un mensaje detallado
2. Esperar máximo 10 segundos
3. Revisar nexcode97@gmail.com — debe llegar el email HTML con score y mensaje sugerido
4. Entrar a nexcode97.com/dashboard — el lead debe aparecer con score, prioridad y tipo de servicio
5. Cambiar el estado del lead en el selector — debe actualizarse sin recargar la página
