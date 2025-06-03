export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  icon: string;
  notes?: string;
}

export interface ClienteTimeline {
  clienteId: number;
  currentStep: number;
  steps: TimelineStep[];
  lastUpdate: string;
}

export const DEFAULT_TIMELINE_STEPS: Omit<TimelineStep, 'status' | 'date'>[] = [
  {
    id: 'interesse',
    title: 'Interesse Demonstrado',
    description: 'Cliente demonstrou interesse em um ou mais imóveis',
    icon: '👀'
  },
  {
    id: 'contato',
    title: 'Primeiro Contato',
    description: 'Primeiro contato realizado com o cliente',
    icon: '📞'
  },
  {
    id: 'visita',
    title: 'Visita Agendada',
    description: 'Visita ao imóvel foi agendada',
    icon: '🏠'
  },
  {
    id: 'negociacao',
    title: 'Negociação',
    description: 'Processo de negociação iniciado',
    icon: '💬'
  },
  {
    id: 'documentacao',
    title: 'Análise de Documentação',
    description: 'Documentos do cliente em análise',
    icon: '📋'
  },
  {
    id: 'aprovacao',
    title: 'Aprovação',
    description: 'Cliente aprovado para o imóvel',
    icon: '✅'
  },
  {
    id: 'contrato',
    title: 'Assinatura do Contrato',
    description: 'Contrato assinado e processo finalizado',
    icon: '📝'
  }
]; 