"use client";

import { Button } from "@/components/ui/button";
import { ClienteTimeline } from "../types/timeline";
import { ArrowRight, RotateCcw } from "lucide-react";

interface TimelineActionsProps {
  timeline: ClienteTimeline | null;
  onUpdateStep: (stepId: string, status: 'completed' | 'current' | 'pending') => void;
}

export function TimelineActions({ timeline, onUpdateStep }: TimelineActionsProps) {
  if (!timeline) return null;

  const currentStepIndex = timeline.steps.findIndex(step => step.status === 'current');
  const hasNextStep = currentStepIndex < timeline.steps.length - 1;
  const hasPreviousStep = currentStepIndex > 0;

  const advanceToNextStep = () => {
    if (hasNextStep) {
      const currentStep = timeline.steps[currentStepIndex];
      const nextStep = timeline.steps[currentStepIndex + 1];
      
      // Marca o atual como concluído
      onUpdateStep(currentStep.id, 'completed');
      // Marca o próximo como atual
      onUpdateStep(nextStep.id, 'current');
    }
  };

  const goBackToPreviousStep = () => {
    if (hasPreviousStep) {
      const currentStep = timeline.steps[currentStepIndex];
      const previousStep = timeline.steps[currentStepIndex - 1];
      
      // Marca o atual como pendente
      onUpdateStep(currentStep.id, 'pending');
      // Marca o anterior como atual
      onUpdateStep(previousStep.id, 'current');
    }
  };

  const getProgressPercentage = () => {
    const completedSteps = timeline.steps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / timeline.steps.length) * 100);
  };

  return (
    <div className="border-t pt-6 space-y-4">
      {/* Barra de Progresso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#969696]">Progresso geral</span>
          <span className="font-medium">{getProgressPercentage()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#9747ff] h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="flex gap-3">
        {hasPreviousStep && (
          <Button
            variant="outline"
            size="sm"
            onClick={goBackToPreviousStep}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Voltar Etapa
          </Button>
        )}
        
        {hasNextStep && (
          <Button
            size="sm"
            onClick={advanceToNextStep}
            className="flex items-center gap-2 bg-[#9747ff] hover:bg-[#9747ff]/90"
          >
            Avançar Etapa
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}

        {currentStepIndex === timeline.steps.length - 1 && (
          <div className="flex items-center gap-2 text-green-600">
            <span className="text-lg">🎉</span>
            <span className="font-medium">Processo Concluído!</span>
          </div>
        )}
      </div>
    </div>
  );
} 