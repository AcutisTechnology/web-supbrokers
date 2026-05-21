"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { CrmLead, CrmPipelineStage } from "../services/crm-service";
import { LeadCard } from "./lead-card";

interface KanbanColumnProps {
  stage: CrmPipelineStage;
  leads: CrmLead[];
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function KanbanColumn({ stage, leads }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `stage-${stage.id}`,
    data: { stageId: stage.id },
  });

  const totalValue = leads.reduce((acc, lead) => acc + Number(lead.value ?? 0), 0);

  return (
    <div className="min-w-[280px] max-w-[300px] flex-shrink-0">
      <div
        className="flex items-center justify-between mb-3 px-3 py-2 rounded-xl"
        style={{
          backgroundColor: `${stage.color ?? "#9747FF"}1a`,
          borderLeft: `4px solid ${stage.color ?? "#9747FF"}`,
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-semibold text-[#141414] truncate">{stage.name}</h3>
          {stage.is_won && (
            <span className="text-[10px] uppercase tracking-wide text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
              Ganho
            </span>
          )}
          {stage.is_lost && (
            <span className="text-[10px] uppercase tracking-wide text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
              Perdido
            </span>
          )}
        </div>
        <span className="text-xs bg-white text-[#141414] px-2 py-0.5 rounded-full shrink-0">
          {leads.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "min-h-[400px] rounded-xl p-2 space-y-2 transition-colors border border-dashed",
          isOver ? "bg-[#9747FF]/5 border-[#9747FF]/40" : "border-transparent",
        )}
      >
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        {leads.length === 0 && (
          <div className="text-center text-xs text-[#777777] py-6">Sem leads nesta etapa</div>
        )}
      </div>

      {leads.length > 0 && (
        <div className="mt-2 px-3 py-2 text-xs text-[#777777] border-t border-dashed border-gray-200">
          Total: <strong className="text-[#141414]">{formatCurrency(totalValue)}</strong>
        </div>
      )}
    </div>
  );
}
