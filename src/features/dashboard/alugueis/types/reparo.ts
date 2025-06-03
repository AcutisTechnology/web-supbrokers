export interface Reparo {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  dataAbertura: string;
  dataConclusao: string | null;
  responsavel: string;
  telefoneResponsavel: string;
  custo: number;
  recibo: string;
  observacoes: string;
} 