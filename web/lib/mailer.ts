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
    <div style="margin-bottom:24px">
      <span style="color:#FFF200;font-size:22px;font-weight:900;letter-spacing:-0.5px">NexCode97</span>
      <span style="color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.5px"> · Lead nuevo</span>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:16px">
      <p style="margin:0 0 4px;font-size:20px;font-weight:700;color:#ffffff">${lead.name}</p>
      ${lead.company ? `<p style="margin:0 0 12px;font-size:14px;color:#64748b">${lead.company}</p>` : ""}
      <p style="margin:4px 0;font-size:14px;color:#94a3b8">📱 ${lead.whatsapp}</p>
      ${lead.email ? `<p style="margin:4px 0;font-size:14px;color:#94a3b8">✉️ ${lead.email}</p>` : ""}
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:16px">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#64748b">Score</p>
      <p style="margin:0 0 8px">${scoreBar(result.score)}</p>
      <p style="margin:0">${priorityBadge(result.priority)} &nbsp; <span style="color:#a78bfa;font-size:13px">${result.serviceType.replace("_", " ")}</span></p>
      <p style="margin:12px 0 0;font-size:13px;color:#94a3b8;font-style:italic">${result.scoreReason}</p>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:16px">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#64748b">Señales detectadas</p>
      <ul style="margin:0;padding:0 0 0 4px;list-style:none">${enrichedList(result.enriched)}</ul>
      <p style="margin:8px 0 0;font-size:13px;color:#94a3b8">Disposición de compra: <strong style="color:#ffffff">${result.enriched.readinessToBuy}</strong></p>
    </div>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:16px">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#64748b">Mensaje original</p>
      <p style="margin:0;font-size:14px;color:#94a3b8;line-height:1.6">${lead.description}</p>
    </div>
    <div style="background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#a78bfa">Mensaje sugerido para WhatsApp</p>
      <p style="margin:0;font-size:14px;color:#ffffff;line-height:1.7">${result.suggestedMsg}</p>
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
