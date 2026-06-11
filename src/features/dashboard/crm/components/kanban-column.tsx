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

  const color = stage.color ?? "#9747FF";
  const totalValue = leads.reduce((acc, lead) => acc + Number(lead.value ?? 0), 0);

  return (
    <div
      className="w-[85vw] sm:w-[280px] md:min-w-[280px] md:max-w-[300px] flex-shrink-0 snap-start md:snap-align-none rounded-2xl min-h-full flex flex-col"
      style={{ backgroundColor: `${color}0a` }}
    >
      {/* cabeçalho sticky — fica fixo enquanto os cards rolam */}
      <div
        className="sticky top-0 z-10 rounded-t-2xl px-3 pt-3 pb-2 backdrop-blur-sm"
        style={{ backgroundColor: `${color}18` }}
      >
        <div
          className="flex items-center justify-between py-1.5 px-2.5 rounded-xl"
          style={{ borderLeft: `4px solid ${color}` }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative group/tooltip min-w-0">
              <h3 className="text-sm font-semibold text-[#141414] truncate cursor-default">
                {stage.name}
              </h3>
              {stage.description && (
                <div className="pointer-events-none absolute left-0 top-full mt-1.5 z-50 hidden group-hover/tooltip:block w-56 rounded-lg bg-gray-900 px-3 py-2 text-xs leading-relaxed text-white shadow-xl">
                  {stage.description}
                </div>
              )}
            </div>
            {stage.is_won && (
              <span className="text-[10px] uppercase tracking-wide text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                Fechado
              </span>
            )}
            {stage.is_lost && (
              <span className="text-[10px] uppercase tracking-wide text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded shrink-0">
                Perdido
              </span>
            )}
          </div>
          <span className="text-xs bg-white/80 text-[#141414] px-2 py-0.5 rounded-full shrink-0 ml-2">
            {leads.length}
          </span>
        </div>

      </div>

      {leads.length > 0 && (
        <div className="px-3 py-1.5 text-xs text-[#555]">
          Total: <strong className="text-[#141414]">{formatCurrency(totalValue)}</strong>
        </div>
      )}

      {/* área de drop + cards */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-2 space-y-2 transition-colors rounded-b-2xl border border-t-0 border-dashed",
          isOver
            ? "border-[#9747FF]/50 ring-2 ring-inset ring-[#9747FF]/20"
            : "border-transparent",
        )}
        style={isOver ? { backgroundColor: `${color}1a` } : undefined}
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
    </div>
  );
}
