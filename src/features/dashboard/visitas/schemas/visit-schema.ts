import { z } from "zod";

export const VISIT_STATUSES = ["agendada", "em_andamento", "finalizada", "cancelada"] as const;

export const VISIT_PROPERTY_TYPES = ["casa", "apartamento", "terreno", "sala_loja", "outro"] as const;

export const VISIT_INTEREST_TYPES = ["compra", "aluguel", "permuta"] as const;

export const VISIT_SOURCES = [
  "instagram",
  "site",
  "plataforma",
  "indicacao",
  "placa",
  "outro",
] as const;

export const visitSchema = z.object({
  lead_id: z.number().nullable().optional(),
  property_id: z.number().nullable().optional(),

  visitor_name: z.string().min(1, "Informe o nome do cliente"),
  visitor_phone: z.string().min(1, "Informe o telefone do cliente"),
  visitor_email: z.string().email("E-mail inválido").or(z.literal("")).optional().nullable(),

  property_name: z.string().nullable().optional(),
  property_address: z.string().nullable().optional(),

  property_type: z.enum(VISIT_PROPERTY_TYPES).nullable().optional(),
  interest_type: z.enum(VISIT_INTEREST_TYPES).nullable().optional(),
  source: z.enum(VISIT_SOURCES).nullable().optional(),

  customer_notes: z.string().nullable().optional(),
  broker_notes: z.string().nullable().optional(),
  broker_notes_private: z.boolean().default(false),

  has_partner_broker: z.boolean().default(false),
  partner_broker_name: z.string().nullable().optional(),
  partner_broker_creci: z.string().nullable().optional(),
  partner_broker_phone: z.string().nullable().optional(),
  partner_broker_company: z.string().nullable().optional(),

  signature: z.string().nullable().optional(), // base64 PNG
  remove_signature: z.boolean().optional(),

  status: z.enum(VISIT_STATUSES).default("agendada"),
  visited_at: z.string().nullable().optional(),
});

export type VisitFormValues = z.infer<typeof visitSchema>;

export const quickLeadSchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  phone: z.string().min(1, "Informe o telefone"),
  email: z.string().email("E-mail inválido").or(z.literal("")).optional().nullable(),
  cpf: z.string().nullable().optional(),
});

export type QuickLeadFormValues = z.infer<typeof quickLeadSchema>;

export const quickPropertySchema = z.object({
  property_type: z.enum(VISIT_PROPERTY_TYPES, {
    required_error: "Selecione o tipo do imóvel",
  }),
  street: z.string().min(1, "Informe o endereço"),
  neighborhood: z.string().min(1, "Informe o bairro"),
  condo_value: z.coerce.number().min(0).nullable().optional(),
  value: z.coerce.number().min(0).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type QuickPropertyFormValues = z.infer<typeof quickPropertySchema>;
