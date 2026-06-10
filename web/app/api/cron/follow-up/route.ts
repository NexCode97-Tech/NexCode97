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
