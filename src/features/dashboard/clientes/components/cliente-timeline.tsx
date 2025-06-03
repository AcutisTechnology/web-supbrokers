"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Customer } from "../services/customer-service";
import { TimelineStepComponent } from "./timeline-step";
import { TimelineActions } from "./timeline-actions";
import { useCustomerStatuses, useAvailableSteps, useCreateCustomerStatus, useUpdateCustomerStatus } from "../hooks/use-customer-status";
import { useMemo, useState } from "react";
import { CustomerStatus, CustomerStatusStep, CustomerStatusType } from "../types/status";
import { Button } from "@/components/ui/button";
import { Dialog as Modal, DialogContent as ModalContent, DialogHeader as ModalHeader, DialogTitle as ModalTitle } from "@/components/ui/dialog";

interface ClienteTimelineProps {
  cliente: Customer;
  isOpen: boolean;
  onClose: () => void;
}

const STEP_ICONS: Record<CustomerStatusStep, string> = {
  interest_shown: "👀",
  first_contact: "📞",
  visit_scheduled: "🏠",
  negotiation: "💬",
  document_analysis: "📋",
  approval: "✅",
  contract_signature: "📝",
};

export function ClienteTimelineDialog({ cliente, isOpen, onClose }: ClienteTimelineProps) {
  const { data: statuses, isLoading } = useCustomerStatuses(cliente.id);
  const { data: availableSteps } = useAvailableSteps();
  const createStatus = useCreateCustomerStatus(cliente.id);
  const updateStatus = useUpdateCustomerStatus(cliente.id);

  // State para modal de observação
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesValue, setNotesValue] = useState("");
  const [pendingStepAction, setPendingStepAction] = useState<{
    stepId: string;
    action: 'current' | 'completed' | 'pending';
    statusId?: number;
    currentNotes?: string;
  } | null>(null);

  // Monta os steps da timeline a partir dos status vindos do backend
  const timelineSteps = useMemo(() => {
    if (!statuses || !availableSteps) return [];
    // Garante que só exista um status por step (o mais recente)
    const uniqueStatuses = new Map<string, typeof statuses[0]>();
    [...statuses].reverse().forEach((status) => {
      if (!uniqueStatuses.has(status.step)) {
        uniqueStatuses.set(status.step, status);
      }
    });
    const ordered = Array.from(uniqueStatuses.values()).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    return ordered.map((status) => {
      let mappedStatus: 'completed' | 'current' | 'pending' = 'pending';
      if (status.status === 'started') mappedStatus = 'current';
      else if (status.status === 'completed') mappedStatus = 'completed';
      else if (status.status === 'reopened') mappedStatus = 'pending';
      return {
        id: status.step,
        title: availableSteps[status.step],
        description: '',
        status: mappedStatus,
        date: status.created_at,
        icon: STEP_ICONS[status.step],
      };
    });
  }, [statuses, availableSteps]);

  // Lista de todos os steps possíveis na ordem correta
  const allSteps = useMemo(() => {
    if (!availableSteps) return [];
    return Object.entries(availableSteps).map(([step, title]) => ({
      id: step,
      title,
      icon: STEP_ICONS[step as CustomerStatusStep],
    }));
  }, [availableSteps]);

  // Step disponível para adicionar (primeiro step que não existe na timeline)
  const nextStepToAdd = useMemo(() => {
    if (!allSteps.length || !timelineSteps.length) return allSteps[0];
    const existingStepIds = timelineSteps.map((s) => s.id);
    return allSteps.find((step) => !existingStepIds.includes(step.id as CustomerStatusStep));
  }, [allSteps, timelineSteps]);

  // Progresso
  const progress = useMemo(() => {
    if (!timelineSteps.length) return 0;
    const completed = timelineSteps.filter((s) => s.status === 'completed').length;
    return Math.round((completed / timelineSteps.length) * 100);
  }, [timelineSteps]);

  // Adicionar próximo status (abre modal)
  const handleAddNextStep = () => {
    setPendingStepAction(null);
    setShowNotesModal(true);
  };

  // Confirma adicionar próximo passo com notes
  const handleConfirmAddNextStep = () => {
    if (!nextStepToAdd) return;
    createStatus.mutate({ step: nextStepToAdd.id as CustomerStatusStep, status: 'started', notes: notesValue });
    setShowNotesModal(false);
    setNotesValue("");
  };

  // Atualizar status existente (concluir/reabrir) - abre modal para editar notes
  const handleUpdateStep = (stepId: string, action: 'completed' | 'current' | 'pending') => {
    if (!statuses) return;
    const statusObj = statuses.find(s => s.step === stepId);
    if (!statusObj) return;
    setPendingStepAction({
      stepId,
      action,
      statusId: statusObj.id,
      currentNotes: statusObj.notes || ""
    });
    setNotesValue(statusObj.notes || "");
    setShowNotesModal(true);
  };

  // Confirma update de status existente
  const handleConfirmUpdateStep = () => {
    if (!pendingStepAction || !pendingStepAction.statusId) return;
    let backendStatus: CustomerStatusType = 'started';
    if (pendingStepAction.action === 'completed') backendStatus = 'completed';
    if (pendingStepAction.action === 'pending') backendStatus = 'reopened';
    updateStatus.mutate({ statusId: pendingStepAction.statusId, status: backendStatus, notes: notesValue });
    setShowNotesModal(false);
    setNotesValue("");
    setPendingStepAction(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#9747ff]/10 flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{cliente.name}</h2>
              <p className="text-sm text-[#969696] font-normal">Linha do tempo do cliente</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Barra de Progresso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#969696]">Progresso geral</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#9747ff] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Informações do Cliente */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#969696]">Email</p>
                <p className="font-medium">{cliente.email}</p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Telefone</p>
                <p className="font-medium">{cliente.phone}</p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Imóveis de interesse</p>
                <p className="font-medium">{cliente.interested_properties.length} imóveis</p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Última atualização</p>
                <p className="font-medium">
                  {statuses && statuses[0]?.created_at ? new Date(statuses[0].created_at).toLocaleDateString('pt-BR') : 'Hoje'}
                </p>
              </div>
            </div>
          </div>

          {nextStepToAdd && (
            <div className="flex justify-end">
              <Button size="sm" onClick={handleAddNextStep} disabled={createStatus.isPending}>
                Adicionar próximo passo: {nextStepToAdd.title}
              </Button>
            </div>
          )}

          {/* Linha do Tempo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Progresso do Atendimento</h3>
            <div className="relative">
              {/* Linha vertical */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              {/* Steps */}
              <div className="space-y-6">
                {timelineSteps.map((step, index) => (
                  <TimelineStepComponent
                    key={step.id}
                    step={{ ...step, notes: statuses?.find(s => s.step === step.id)?.notes || undefined }}
                    isLast={index === timelineSteps.length - 1}
                    onUpdateStep={handleUpdateStep}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Ações */}
          {/* Aqui pode-se adaptar o TimelineActions para usar os dados reais, se necessário */}
        </div>
      </DialogContent>
      {/* Modal para observação (adicionar OU editar) */}
      <Modal open={showNotesModal} onOpenChange={setShowNotesModal}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>{pendingStepAction ? 'Editar observação da etapa' : 'Adicionar observação (opcional)'}</ModalTitle>
          </ModalHeader>
          <textarea
            className="w-full border rounded p-2 mt-2"
            rows={3}
            placeholder="Digite uma observação para este passo (opcional)"
            value={notesValue}
            onChange={e => setNotesValue(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => { setShowNotesModal(false); setPendingStepAction(null); }}>Cancelar</Button>
            {pendingStepAction ? (
              <Button onClick={handleConfirmUpdateStep} disabled={updateStatus.isPending}>Salvar</Button>
            ) : (
              <Button onClick={handleConfirmAddNextStep} disabled={createStatus.isPending}>Adicionar</Button>
            )}
          </div>
        </ModalContent>
      </Modal>
    </Dialog>
  );
} 