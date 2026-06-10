import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
