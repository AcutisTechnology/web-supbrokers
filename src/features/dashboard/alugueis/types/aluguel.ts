export interface Aluguel {
  id: string;
  imovel: string;
  endereco: string;
  bairro?: string;
  inquilino: string;
  cpf: string;
  rg: string;
  email: string;
  telefone: string;
  profissao?: string;
  renda?: string;
  valor: string;
  status: string;
  data_inicio: string;
  data_fim: string;
  garantia?: string;
  multa?: string;
  reajuste?: string;
  observacoes?: string;
  doc_rg?: string;
  doc_cpf?: string;
  doc_renda?: string;
} 