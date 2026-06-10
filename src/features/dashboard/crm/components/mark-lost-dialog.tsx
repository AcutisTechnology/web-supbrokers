"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useCrmLeadLossReasons,
  useMarkLostCrmLead,
  type CrmLead,
} from "../services/crm-service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: CrmLead | null;
}

export function MarkLostDialog({ open, onOpenChange, lead }: Props) {
  const [reasonId, setReasonId] = useState<string>("");
  const { data: reasons } = useCrmLeadLossReasons();
  const markLost = useMarkLostCrmLead();

  useEffect(() => {
    if (open) setReasonId("");
  }, [open]);

  const handleConfirm = async () => {
    if (!lead) return;
    await markLost.mutateAsync({
      id: lead.id,
      loss_reason_id: reasonId ? Number(reasonId) : null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Marcar lead como perdido</DialogTitle>
          <DialogDescription>
            {lead?.name ? `Lead: ${lead.name}.` : ""} Selecione o motivo (opcional) para alimentar
            relatórios de perda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Motivo</Label>
          <Select value={reasonId} onValueChange={setReasonId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um motivo" />
            </SelectTrigger>
            <SelectContent>
              {(reasons ?? []).filter((r) => r.is_active).map((r) => (
                <SelectItem key={r.id} value={String(r.id)}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="pt-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={markLost.isPending}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={markLost.isPending}
            className="bg-rose-600 hover:bg-rose-700"
          >
            {markLost.isPending ? "Salvando..." : "Marcar como perdido"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
