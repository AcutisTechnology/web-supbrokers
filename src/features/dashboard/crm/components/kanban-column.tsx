"use client";

import { useDroppable } from "@dnd-kit/core";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Inbox } from "lucide-react";
import { memo, useRef } from "react";
import { cn } from "@/lib/utils";
import type { CrmLead, CrmPipelineStage } from "../services/crm-service";
import { LeadCard } from "./lead-card";

interface KanbanColumnProps {
  stage: CrmPipelineStage;
  leads: CrmLead[];
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Mistura uma cor hex (#RRGGBB) sobre branco no alpha dado → cor opaca.
// Usado para o cabeçalho parecer "fosco" sem depender de backdrop-blur.
const blendOverWhite = (hex: string, alpha: number) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "#ffffff";
  const int = parseInt(m[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  const blend = (c: number) => Math.round(c * alpha + 255 * (1 - alpha));
  return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`;
};

function KanbanColumnComponent({ stage, leads }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `stage-${stage.id}`,
    data: { stageId: stage.id },
  });

  const color = stage.color ?? "#9747FF";
  const headerBg = blendOverWhite(color, 0.12);
  const totalValue = leads.reduce((acc, lead) => acc + Number(lead.value ?? 0), 0);

  // Virtualização: só os cards visíveis na coluna ficam no DOM. Sem isso, uma
  // base com milhares de leads renderiza tudo de uma vez (dezenas de milhares
  // de nós) e o drag trava. Cada coluna é seu próprio container de scroll.
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: leads.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 161,
    overscan: 10,
    getItemKey: (index) => leads[index].id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-[85vw] sm:w-[280px] md:min-w-[280px] md:max-w-[300px] flex-shrink-0 snap-start md:snap-align-none rounded-2xl h-full flex flex-col overflow-hidden transition-shadow",
        isOver && "ring-2 ring-inset ring-[#9747FF]/40",
      )}
      style={{ backgroundColor: `${color}0a` }}
    >
      {/* cabeçalho — fica fixo no topo da coluna enquanto os cards rolam.
          Sem backdrop-blur: blur em elemento sticky é repintado a cada frame
          durante o drag/scroll e trava o board. Fundo opaco resolve o overlap. */}
      <div className="rounded-t-2xl px-3 pt-3 pb-2" style={{ backgroundColor: headerBg }}>
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
        <div className="px-3 py-1.5 text-xs text-[#555] shrink-0">
          Total: <strong className="text-[#141414]">{formatCurrency(totalValue)}</strong>
        </div>
      )}

      {/* área de cards rolável + virtualizada — a coluna inteira é a zona de drop
          (ref do droppable está na raiz). */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 transition-colors rounded-b-2xl [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
        style={isOver ? { backgroundColor: `${color}1a` } : undefined}
      >
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-8 text-[#777777]">
            <Inbox className="h-6 w-6 mb-2 opacity-40" />
            <div className="text-xs">Sem leads nesta etapa</div>
            <div className="text-[10px] mt-1 opacity-70">Arraste cards até aqui</div>
          </div>
        ) : (
          <div style={{ height: virtualizer.getTotalSize(), position: "relative", width: "100%" }}>
            {virtualizer.getVirtualItems().map((item) => (
              <div
                key={item.key}
                data-index={item.index}
                ref={virtualizer.measureElement}
                className="absolute left-0 top-0 w-full pb-2"
                style={{ transform: `translateY(${item.start}px)` }}
              >
                <LeadCard lead={leads[item.index]} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const KanbanColumn = memo(KanbanColumnComponent);
