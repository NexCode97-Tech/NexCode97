import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

// Lazy: evita instanciar el cliente en build time cuando la env var no existe
let _groq: Groq | null = null;
function getGroq() {
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _groq;
}

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
    .map((l: { name: string; company: string | null; description: string; serviceType: string | null; score: number | null }) => `- ${l.name}${l.company ? ` (${l.company})` : ""}: "${l.description}" → ${l.serviceType ?? "sin clasificar"} [score: ${l.score ?? "N/A"}]`)
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

  const completion = await getGroq().chat.completions.create({
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
