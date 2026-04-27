import { z } from "zod";

export const proponentSchema = z.object({
  id: z.number().optional(),
  type: z.enum(["principal", "conjuge", "adicional"]).default("principal"),
  lead_id: z.number().optional().nullable(),
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido").optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable().or(z.literal("")),
  cpf: z.string().optional().nullable().or(z.literal("")),
  birth_date: z.string().optional().nullable().or(z.literal("")),
  nationality: z.string().optional().nullable().or(z.literal("")),
  marital_status: z.string().optional().nullable().or(z.literal("")),
  profession: z.string().optional().nullable().or(z.literal("")),
  rg: z.string().optional().nullable().or(z.literal("")),
  address: z.string().optional().nullable().or(z.literal("")),
});

export const conditionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["percentage", "value"]).default("value"),
  description: z.string().min(1, "A descrição é obrigatória"),
  value: z.coerce.number().min(0, "O valor deve ser maior ou igual a zero"),
  start_date: z.string().optional().nullable().or(z.literal("")),
  end_date: z.string().optional().nullable().or(z.literal("")),
  installments: z.coerce.number().min(1).default(1),
  period: z.string().optional().nullable().or(z.literal("UNICA")),
  installment_value: z.number().optional().nullable(),
  total_value: z.number().optional().nullable(),
  order: z.number().optional().nullable(),
});

export const intermediatorSchema = z.object({
  broker_id: z.number().optional().nullable(),
  name: z.string().optional().nullable().or(z.literal("")),
  creci: z.string().optional().nullable().or(z.literal("")),
  phone: z.string().optional().nullable().or(z.literal("")),
  document: z.string().optional().nullable().or(z.literal("")),
  email: z.string().optional().nullable().or(z.literal("")),
  address: z.string().optional().nullable().or(z.literal("")),
  company_name: z.string().optional().nullable().or(z.literal("")),
});

export const proposalSchema = z.object({
  property_id: z.number({ required_error: "Selecione um imóvel" }),
  property_description: z.string().optional().nullable(),
  property_value: z.number().optional().nullable(),
  property_address: z.string().optional().nullable(),
  property_complement: z.string().optional().nullable(),
  
  status: z.string().default("PENDING"),
  proponents: z.array(proponentSchema).min(1, "Adicione pelo menos um proponente"),
  conditions: z.array(conditionSchema).min(1, "Adicione pelo menos uma condição de pagamento"),
  intermediator: intermediatorSchema.optional().nullable(),
  
  total_value: z.number().min(0, "O valor total deve ser maior ou igual a zero"),
  total_percentage: z.number().optional().nullable(),
  difference_value: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type ProposalFormValues = z.infer<typeof proposalSchema>;

export const defaultProposalValues: Partial<ProposalFormValues> = {
  status: "PENDING",
  proponents: [{ name: "", type: "principal" }],
  conditions: [{ description: "Sinal", value: 0, type: "value", installments: 1, period: "UNICA" }],
  total_value: 0,
  intermediator: { name: "" },
};
