import { z } from 'zod';

export const aluguelSchema = z.object({
  imovel: z.string().min(1, 'O imóvel é obrigatório'),
  endereco: z.string().min(1, 'O endereço é obrigatório'),
  inquilino: z.string().min(1, 'O nome do inquilino é obrigatório'),
  cpf: z.string().min(11, 'O CPF é obrigatório'),
  rg: z.string().min(5, 'O RG é obrigatório'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'O telefone é obrigatório'),
  profissao: z.string().optional(),
  renda: z.union([z.string(), z.number()]).optional(),
  doc_rg: z.array(z.any()).optional(),
  doc_cpf: z.array(z.any()).optional(),
  doc_renda: z.array(z.any()).optional(),
  valor: z.union([z.string(), z.number()]),
  data_inicio: z.string().min(1, 'A data de início é obrigatória'),
  data_fim: z.string().min(1, 'A data de término é obrigatória'),
  garantia: z.string().optional(),
  multa: z.union([z.string(), z.number()]).optional(),
  reajuste: z.string().optional(),
  observacoes: z.string().optional(),
});

export type AluguelFormValues = z.infer<typeof aluguelSchema>;

export const aluguelDefaultValues: AluguelFormValues = {
  imovel: '',
  endereco: '',
  inquilino: '',
  cpf: '',
  rg: '',
  email: '',
  telefone: '',
  profissao: '',
  renda: '',
  doc_rg: [],
  doc_cpf: [],
  doc_renda: [],
  valor: '',
  data_inicio: '',
  data_fim: '',
  garantia: '',
  multa: '',
  reajuste: '',
  observacoes: '',
};
