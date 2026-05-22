"use client";

import { useDroppable } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import { Inbox } from "lucide-react";
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
    <div className="w-[85vw] sm:w-[280px] md:min-w-[280px] md:max-w-[300px] flex-shrink-0 snap-start md:snap-align-none">
      <div
        className="flex items-center justify-between mb-3 px-3 py-2 rounded-xl sticky top-0 z-10 backdrop-blur"
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
          isOver ? "bg-[#9747FF]/10 border-[#9747FF]/50 ring-2 ring-[#9747FF]/20" : "border-transparent",
        )}
      >
        <AnimatePresence initial={false}>
          {leads.map((lead) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <LeadCard lead={lead} />
            </motion.div>
          ))}
        </AnimatePresence>
        {leads.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-8 text-[#777777]">
            <Inbox className="h-6 w-6 mb-2 opacity-40" />
            <div className="text-xs">Sem leads nesta etapa</div>
            <div className="text-[10px] mt-1 opacity-70">Arraste cards até aqui</div>
          </div>
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
