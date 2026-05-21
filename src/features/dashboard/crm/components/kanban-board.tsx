"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import type { CrmLead, CrmPipelineStage } from "../services/crm-service";
import { KanbanColumn } from "./kanban-column";
import { LeadCard } from "./lead-card";

interface KanbanBoardProps {
  stages: CrmPipelineStage[];
  leads: CrmLead[];
  onMove: (leadId: number, toStageId: number) => void;
}

export function KanbanBoard({ stages, leads, onMove }: KanbanBoardProps) {
  const [activeLead, setActiveLead] = useState<CrmLead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const leadsByStage = useMemo(() => {
    const map = new Map<number, CrmLead[]>();
    for (const stage of stages) {
      map.set(stage.id, []);
    }
    for (const lead of leads) {
      const arr = map.get(lead.pipeline_stage_id) ?? [];
      arr.push(lead);
      map.set(lead.pipeline_stage_id, arr);
    }
    return map;
  }, [stages, leads]);

  const handleDragStart = (event: DragStartEvent) => {
    const leadId = event.active.data.current?.leadId as number | undefined;
    if (!leadId) {
      setActiveLead(null);
      return;
    }
    setActiveLead(leads.find((l) => l.id === leadId) ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveLead(null);
    const leadId = event.active.data.current?.leadId as number | undefined;
    const fromStageId = event.active.data.current?.fromStageId as number | undefined;
    const toStageId = event.over?.data.current?.stageId as number | undefined;

    if (!leadId || !toStageId || fromStageId === toStageId) return;

    onMove(leadId, toStageId);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
        {stages.map((stage) => (
          <KanbanColumn key={stage.id} stage={stage} leads={leadsByStage.get(stage.id) ?? []} />
        ))}
      </div>

      <DragOverlay>
        {activeLead ? (
          <div className="opacity-90 rotate-1 shadow-2xl">
            <LeadCard lead={activeLead} draggable={false} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
