import { prisma } from "@/lib/prisma";
import { updateLeadStatus } from "../actions";
import { PipelineBoard } from "./pipeline-board";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "#1a1c1e", letterSpacing: "-0.03em" }}>
          Pipeline
        </h1>
        <p className="text-sm mt-1" style={{ color: "#475569" }}>
          Visualiza el avance de cada lead por etapa del embudo.
        </p>
      </div>

      <PipelineBoard leads={leads} updateStatus={updateLeadStatus} />
    </div>
  );
}
