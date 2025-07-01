export interface Pagamento {
  id: number;
  mes: string;
  dataVencimento: string;
  dataPagamento: string;
  aluguel: number;
  condominio: number;
  iptu: number;
  total: number;
  status: string;
  diasAtraso: number;
} 