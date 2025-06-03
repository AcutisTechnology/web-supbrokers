"use client";

import { useState, useEffect } from "react";
import { ClienteTimeline, TimelineStep, DEFAULT_TIMELINE_STEPS } from "../types/timeline";
import { useToast } from "@/hooks/use-toast";

export function useClienteTimeline(clienteId: number) {
  const [timeline, setTimeline] = useState<ClienteTimeline | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Simula carregamento da timeline (em produção, viria da API)
  useEffect(() => {
    const loadTimeline = () => {
      setIsLoading(true);
      
      // Simula delay da API
      setTimeout(() => {
        // Verifica se já existe uma timeline salva no localStorage
        const savedTimeline = localStorage.getItem(`timeline_${clienteId}`);
        
        if (savedTimeline) {
          setTimeline(JSON.parse(savedTimeline));
        } else {
          // Cria uma nova timeline com o primeiro step como atual
          const newTimeline: ClienteTimeline = {
            clienteId,
            currentStep: 0,
            lastUpdate: new Date().toISOString(),
            steps: DEFAULT_TIMELINE_STEPS.map((step, index) => ({
              ...step,
              status: index === 0 ? 'current' : 'pending',
              date: index === 0 ? new Date().toISOString() : undefined
            }))
          };
          
          setTimeline(newTimeline);
          localStorage.setItem(`timeline_${clienteId}`, JSON.stringify(newTimeline));
        }
        
        setIsLoading(false);
      }, 500);
    };

    loadTimeline();
  }, [clienteId]);

  const updateStep = (stepId: string, status: 'completed' | 'current' | 'pending') => {
    if (!timeline) return;

    const updatedSteps = timeline.steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          status,
          date: status !== 'pending' ? new Date().toISOString() : step.date
        };
      }
      return step;
    });

    // Lógica para garantir consistência da timeline
    const stepIndex = updatedSteps.findIndex(step => step.id === stepId);
    
    if (status === 'completed') {
      // Marca todos os anteriores como concluídos
      for (let i = 0; i < stepIndex; i++) {
        if (updatedSteps[i].status === 'pending') {
          updatedSteps[i].status = 'completed';
          updatedSteps[i].date = new Date().toISOString();
        }
      }
    } else if (status === 'pending') {
      // Marca todos os posteriores como pendentes
      for (let i = stepIndex + 1; i < updatedSteps.length; i++) {
        if (updatedSteps[i].status !== 'pending') {
          updatedSteps[i].status = 'pending';
          updatedSteps[i].date = undefined;
        }
      }
    }

    const updatedTimeline: ClienteTimeline = {
      ...timeline,
      steps: updatedSteps,
      lastUpdate: new Date().toISOString(),
      currentStep: updatedSteps.findIndex(step => step.status === 'current')
    };

    setTimeline(updatedTimeline);
    localStorage.setItem(`timeline_${clienteId}`, JSON.stringify(updatedTimeline));

    // Mostra toast de feedback
    const step = updatedSteps.find(s => s.id === stepId);
    if (step) {
      toast({
        title: "Timeline atualizada",
        description: `${step.title} marcado como ${getStatusText(status)}`,
      });
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'concluído';
      case 'current': return 'em andamento';
      case 'pending': return 'pendente';
      default: return status;
    }
  };

  return {
    timeline,
    updateStep,
    isLoading
  };
} 