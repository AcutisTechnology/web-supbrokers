"use client";

import { useDroppable } from "@dnd-kit/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Inbox } from "lucide-react";
import { useRef } from "react";
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

  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: leads.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 138,
    overscan: 5,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  const totalValue = leads.reduce((acc, lead) => acc + Number(lead.value ?? 0), 0);
  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="w-[85vw] sm:w-[280px] md:min-w-[280px] md:max-w-[300px] flex-shrink-0 snap-start md:snap-align-none flex flex-col h-full">
      <div
        className="flex items-center justify-between mb-3 px-3 py-2 rounded-xl"
        style={{
          backgroundColor: `${stage.color ?? "#9747FF"}1a`,
          borderLeft: `4px solid ${stage.color ?? "#9747FF"}`,
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative group/tooltip min-w-0">
            <h3 className="text-sm font-semibold text-[#141414] truncate cursor-default">{stage.name}</h3>
            {stage.description && (
              <div className="pointer-events-none absolute left-0 top-full mt-1.5 z-50 hidden group-hover/tooltip:block w-56 rounded-lg bg-gray-900 px-3 py-2 text-xs leading-relaxed text-white shadow-xl">
                {stage.description}
              </div>
            )}
          </div>
          {stage.is_won && (
            <span className="text-[10px] uppercase tracking-wide text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
              Fechado
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

      {leads.length > 0 && (
        <div className="mb-2 px-1 text-xs text-[#777777]">
          Total: <strong className="text-[#141414]">{formatCurrency(totalValue)}</strong>
        </div>
      )}

      {/* scroll container por coluna */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
      >
        <div
          ref={setNodeRef}
          className={cn(
            "rounded-xl p-2 transition-colors border border-dashed relative",
            isOver
              ? "bg-[#9747FF]/10 border-[#9747FF]/50 ring-2 ring-[#9747FF]/20"
              : "border-transparent",
          )}
          style={{ height: `${Math.max(400, virtualizer.getTotalSize() + 16)}px` }}
        >
          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-8 text-[#777777]">
              <Inbox className="h-6 w-6 mb-2 opacity-40" />
              <div className="text-xs">Sem leads nesta etapa</div>
              <div className="text-[10px] mt-1 opacity-70">Arraste cards até aqui</div>
            </div>
          ) : (
            virtualItems.map((virtualItem) => (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 8,
                  right: 8,
                  transform: `translateY(${virtualItem.start}px)`,
                  paddingBottom: 8,
                }}
              >
                <LeadCard lead={leads[virtualItem.index]} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
