"use client";

import { Button } from "@/components/ui/button";
import { TimelineStep } from "../types/timeline";
import { Check, Clock, Circle } from "lucide-react";

interface TimelineStepProps {
  step: TimelineStep;
  isLast: boolean;
  onUpdateStep: (stepId: string, status: 'completed' | 'current' | 'pending') => void;
}

export function TimelineStepComponent({ step, isLast, onUpdateStep }: TimelineStepProps) {
  const getStepIcon = () => {
    switch (step.status) {
      case 'completed':
        return <Check className="w-4 h-4 text-white" />;
      case 'current':
        return <Clock className="w-4 h-4 text-white" />;
      case 'pending':
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStepColor = () => {
    switch (step.status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-[#9747ff]';
      case 'pending':
        return 'bg-gray-300';
    }
  };

  const getTextColor = () => {
    switch (step.status) {
      case 'completed':
        return 'text-green-700';
      case 'current':
        return 'text-[#9747ff]';
      case 'pending':
        return 'text-gray-500';
    }
  };

  return (
    <div className="relative flex items-start gap-4">
      {/* Ícone do Step */}
      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${getStepColor()}`}>
        <span className="text-lg">{step.icon}</span>
        <div className="absolute inset-0 flex items-center justify-center">
          {getStepIcon()}
        </div>
      </div>

      {/* Conteúdo do Step */}
      <div className="flex-1 min-w-0 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`font-semibold ${getTextColor()}`}>
              {step.title}
            </h4>
            <p className="text-sm text-[#969696] mt-1">
              {step.description}
            </p>
            {step.notes && (
              <p className="text-xs text-blue-700 bg-blue-50 rounded px-2 py-1 mt-2">
                <span className="font-medium">Observação:</span> {step.notes}
              </p>
            )}
            {step.date && (
              <p className="text-xs text-[#969696] mt-2">
                {new Date(step.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>

          {/* Ações do Step */}
          <div className="flex gap-2">
            {/* Primeiro: se está pendente, só pode iniciar */}
            {step.status === 'pending' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStep(step.id, 'current')}
                className="text-xs"
              >
                Iniciar
              </Button>
            )}
            {/* Depois: se está em andamento, pode concluir */}
            {step.status === 'current' && (
              <Button
                size="sm"
                onClick={() => onUpdateStep(step.id, 'completed')}
                className="text-xs bg-green-500 hover:bg-green-600"
              >
                Concluir
              </Button>
            )}
            {/* Só mostra reabrir se já foi concluído */}
            {step.status === 'completed' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStep(step.id, 'current')}
                className="text-xs"
              >
                Reabrir
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 