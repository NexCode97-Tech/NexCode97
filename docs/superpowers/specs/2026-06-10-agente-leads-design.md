# Agente de Leads IA — NexCode97

## Objetivo

Cuando un lead llena el formulario de contacto, un agente IA analiza su mensaje en tiempo real, enriquece su perfil con scoring inteligente basado en patrones históricos, y envía un email HTML profesional a NexCode97 con el resumen y un mensaje personalizado listo para enviar por WhatsApp.

## Stack

- **Groq API** (modelo: `llama-3.3-70b-versatile`) — inferencia rápida y gratuita
- **Resend** — envío de emails HTML transaccionales
- **Prisma + PostgreSQL** — persistencia del scoring y clasificación
- **Next.js API Routes** — el agente corre server-side sin infraestructura adicional

---

## Modelo de datos — cambios en Lead

Agregar al modelo `Lead` en `schema.prisma`:

```prisma
serviceType  String?   // app_web | app_movil | landing | ecommerce | sistema_gestion | integracion | otro
priority     String?   // alta | media | baja
score        Int?      // 0-100
scoreReason  String?   // justificación del score en 1-2 líneas
enriched     Json?     // { hasBudget, hasDeadline, isDecisionMaker, hasExistingSystem, readinessToBuy }
suggestedMsg String?   // mensaje sugerido para WhatsApp
agentVersion String?   // versión del prompt para trazabilidad
```

---

## Flujo completo

```
Usuario llena formulario
        ↓
POST /api/leads
        ↓
Crear lead en DB (status: "nuevo")
        ↓
Llamar agente Groq con contexto de últimos 10 leads ganados (async)
        ↓
Agente retorna JSON con clasificación + score + enriched + suggestedMsg
        ↓
Actualizar lead en DB con los campos enriquecidos
        ↓
Enviar email HTML a nexcode97@gmail.com vía Resend
        ↓
Si en 48h el lead sigue en "nuevo" → email de recordatorio con mensaje de seguimiento
```

---

## El agente — prompt y output

### Contexto histórico (memoria)

Antes de llamar a Groq, se consultan los últimos 10 leads con `status = "ganado"` de la DB. Se pasan al prompt como ejemplos de clientes que SÍ cerraron, para que el agente aprenda patrones reales de NexCode97 y ajuste el scoring en consecuencia.

### Sistema de scoring (0-100)

| Señal | Puntos |
|-------|--------|
| Menciona presupuesto o rango de precio | +20 |
| Menciona fecha límite o urgencia | +15 |
| Empresa establecida (no "tengo una idea") | +15 |
| Es el decisor (dueño, gerente, CEO) | +15 |
| Descripción clara y detallada (>50 palabras) | +10 |
| Ya tiene un sistema anterior que quiere mejorar | +10 |
| Menciona más de un módulo o funcionalidad | +10 |
| Solo dice "quiero una app" sin detalle | -20 |
| Perfil similar a leads ganados históricamente | +bonus hasta +15 |

### Output esperado del agente (JSON estricto)

```json
{
  "serviceType": "app_web",
  "priority": "alta",
  "score": 82,
  "scoreReason": "Empresa establecida con presupuesto definido y fecha límite clara. Alto potencial de cierre.",
  "enriched": {
    "hasBudget": true,
    "hasDeadline": true,
    "isDecisionMaker": true,
    "hasExistingSystem": false,
    "readinessToBuy": "alto"
  },
  "suggestedMsg": "Hola Juan, qué tal! Vi tu mensaje sobre el sistema de gestión para tu restaurante. Me parece un proyecto muy interesante y justo es algo en lo que tenemos bastante experiencia. ¿Tienes 15 minutos esta semana para contarme un poco más sobre lo que necesitas? Así te puedo dar una idea clara de tiempos y costos. Saludos, NexCode97"
}
```

---

## Email HTML de notificación

Diseño con colores de NexCode97: fondo `#09090e`, acentos violeta `#7c3aed`, score en amarillo `#FFF200`.

**Asunto:** `Lead nuevo [82/100] — Juan Pérez · App Web`

**Secciones del email:**
1. Header con logo NexCode97
2. Nombre, empresa, WhatsApp, email del lead
3. Score visual: barra de progreso coloreada según valor (rojo <40, amarillo 40-70, verde >70)
4. Prioridad badge (alta/media/baja)
5. Clasificación del servicio
6. Señales detectadas con íconos (✓ tiene presupuesto, ✓ tiene deadline, etc.)
7. Justificación del agente
8. Descripción original del lead
9. Mensaje sugerido en caja destacada para copiar y pegar en WhatsApp
10. Botón "Ver en dashboard" → enlace directo a nexcode97.com/dashboard

---

## Seguimiento automático (48h)

Cron job que corre cada hora revisando leads en `"nuevo"` con más de 48h sin actualizar. Por cada uno envía email con:
- Resumen del lead
- Nuevo mensaje de seguimiento generado por Groq (diferente al inicial, tono más directo)
- Botón "Ver en dashboard"

**Implementación:** `/api/cron/follow-up` protegido con header `Authorization: Bearer CRON_SECRET`, llamado desde Vercel Cron Jobs cada hora.

---

## Dashboard interactivo

El dashboard muestra por cada lead:
- Score con barra visual coloreada
- Badge de prioridad (alta/media/baja)
- Tipo de servicio
- Selector de estado inline (nuevo → contactado → ganado → perdido) — cambia en la DB sin recargar la página
- Cambiar estado a cualquier valor distinto de "nuevo" resetea el contador del cron de 48h

**Implementación:** Server Action en Next.js para actualizar el estado. El selector usa `optimistic update` para feedback inmediato.

---

## Archivos a crear/modificar

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `web/prisma/schema.prisma` | Modificar | Agregar campos al modelo Lead |
| `web/lib/agent.ts` | Crear | Lógica del agente Groq + prompt con contexto histórico |
| `web/lib/mailer.ts` | Crear | Email HTML con Resend |
| `web/app/api/leads/route.ts` | Modificar | Llamar agente después de crear lead |
| `web/app/api/cron/follow-up/route.ts` | Crear | Cron de seguimiento 48h |
| `web/app/api/leads/[id]/status/route.ts` | Crear | PATCH para cambiar estado del lead |
| `web/app/dashboard/page.tsx` | Modificar | Dashboard interactivo con score, selector de estado |
| `vercel.json` | Crear | Configurar Vercel Cron Job cada hora |

---

## Variables de entorno requeridas

| Variable | Servicio | Descripción |
|----------|----------|-------------|
| `GROQ_API_KEY` | Vercel | API key de Groq |
| `RESEND_API_KEY` | Vercel | API key de Resend |
| `RESEND_FROM_EMAIL` | Vercel | Email remitente verificado en Resend (ej: hola@nexcode97.com) |
| `CRON_SECRET` | Vercel | Token aleatorio para proteger el endpoint del cron |

---

## Criterios de éxito

- Lead creado → agente responde en menos de 3 segundos
- Email llega a nexcode97@gmail.com en menos de 10 segundos tras el lead
- Score ajustado correctamente según patrones de leads ganados
- Mensaje sugerido menciona el nombre del lead y su necesidad específica
- Dashboard permite cambiar estado con un click sin recargar
- Cron dispara exactamente a las 48h para leads sin respuesta
