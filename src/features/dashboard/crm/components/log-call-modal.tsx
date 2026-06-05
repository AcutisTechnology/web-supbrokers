"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Phone } from "lucide-react";
import { useCreateCrmLeadInteraction } from "@/features/dashboard/crm/services/crm-service";

interface LogCallModalProps {
  leadId: number;
  leadName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogCallModal({ leadId, leadName, open, onOpenChange }: LogCallModalProps) {
  const [description, setDescription] = useState("");
  const createInteraction = useCreateCrmLeadInteraction(leadId);

  const handleSave = () => {
    createInteraction.mutate(
      { type: "call", description: description.trim() },
      {
        onSuccess: () => {
          setDescription("");
          onOpenChange(false);
        },
      },
    );
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) setDescription("");
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-[#9747FF]" />
            Registrar ligação
            {leadName && (
              <span className="font-normal text-[#777777] truncate">— {leadName}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="bg-[#9747FF]/5 rounded-lg px-3 py-2 text-sm text-[#9747FF]">
            Tipo: <span className="font-medium">Ligação</span>
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Escreva um resumo da ligação…"
              className="min-h-[100px]"
              autoFocus
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={createInteraction.isPending || description.trim().length === 0}
              className="gap-2"
            >
              {createInteraction.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar interação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
