import { NextRequest, NextResponse, after } from "next/server";
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

    // Agente corre después de responder — after() garantiza ejecución en Vercel
    after(async () => {
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
    });

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
