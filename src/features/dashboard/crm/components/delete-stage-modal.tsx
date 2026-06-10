"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CrmPipelineStage } from "../services/crm-service";

interface DeleteStageModalProps {
  stage: CrmPipelineStage | null;
  stages: CrmPipelineStage[];
  isDeleting: boolean;
  onConfirm: (targetStageId: number) => void;
  onCancel: () => void;
}

export function DeleteStageModal({ stage, stages, isDeleting, onConfirm, onCancel }: DeleteStageModalProps) {
  const [targetStageId, setTargetStageId] = useState<string>("");

  const otherStages = stages.filter((s) => s.id !== stage?.id);
  const leadsCount = stage?.leads_count ?? 0;

  const handleConfirm = () => {
    if (!targetStageId) return;
    onConfirm(Number(targetStageId));
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTargetStageId("");
      onCancel();
    }
  };

  return (
    <Dialog open={!!stage} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Excluir etapa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-[#141414]">
            A etapa <strong>&ldquo;{stage?.name}&rdquo;</strong> possui{" "}
            <strong>{leadsCount} {leadsCount === 1 ? "lead" : "leads"}</strong>. Escolha para qual etapa
            deseja mover todos eles antes de excluir.
          </p>

          <div className="space-y-2">
            <Label>Mover leads para</Label>
            <Select value={targetStageId} onValueChange={setTargetStageId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma etapa…" />
              </SelectTrigger>
              <SelectContent>
                {otherStages.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: s.color ?? "#e5e7eb" }}
                      />
                      {s.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={!targetStageId || isDeleting}
            >
              {isDeleting ? "Excluindo…" : "Mover e excluir"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
