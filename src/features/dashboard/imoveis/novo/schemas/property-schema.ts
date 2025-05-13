import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  street: z.string().min(1, "O endereço é obrigatório"),
  neighborhood: z.string().min(1, "O bairro é obrigatório"),
  size: z.coerce.number().min(1, "A área é obrigatória"),
  bedrooms: z.coerce.number().min(0, "Número de quartos inválido"),
  garages: z.coerce.number().min(0, "Número de vagas inválido"),
  rent: z.coerce.number().default(0),
  code: z.string().min(1, "O código do imóvel é obrigatório"),
  sale: z.coerce.number().default(0),
  value: z.coerce.number().min(1, "O valor é obrigatório"),
  iptu_value: z.coerce.number().default(0),
  condo_value: z.coerce.number().default(0),
  qr_code: z.string().optional(),
  active: z.coerce.number().default(1),
  characteristics: z.array(z.string()).default([]),
  attachments: z.array(z.any()).default([]),
  purpose: z.enum(["sell", "rent"]).default("sell"),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export const defaultValues: Partial<PropertyFormValues> = {
  title: "",
  description: "",
  street: "",
  neighborhood: "",
  size: 0,
  bedrooms: 0,
  garages: 0,
  rent: 0,
  code: "",
  sale: 1,
  value: 0,
  iptu_value: 0,
  condo_value: 0,
  qr_code: "teste",
  active: 1,
  characteristics: [],
  attachments: [],
  purpose: "sell",
};
