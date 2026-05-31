import { z } from "zod";

export const PROPERTY_TYPES = [
  "apartamento",
  "casa",
  "cobertura",
  "mansao",
  "terreno",
  "comercial",
  "studio",
  "loft",
  "sobrado",
  "kitnet",
  "fazenda",
  "sitio",
  "chacara",
  "galpao",
  "sala_comercial",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  cobertura: "Cobertura",
  mansao: "Mansão",
  terreno: "Terreno",
  comercial: "Comercial",
  studio: "Studio",
  loft: "Loft",
  sobrado: "Sobrado",
  kitnet: "Kitnet",
  fazenda: "Fazenda",
  sitio: "Sítio",
  chacara: "Chácara",
  galpao: "Galpão",
  sala_comercial: "Sala comercial",
};

export const propertySchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  property_type: z.enum(PROPERTY_TYPES).optional().nullable(),
  street: z.string().min(1, "O endereço é obrigatório"),
  neighborhood: z.string().min(1, "O bairro é obrigatório"),
  city: z.string().optional().nullable(),
  state: z
    .string()
    .length(2, "UF deve ter 2 letras")
    .optional()
    .nullable()
    .or(z.literal("")),
  zipcode: z.string().optional().nullable(),
  size: z.coerce.number().min(1, "A área é obrigatória"),
  bedrooms: z.coerce.number().min(0, "Número de quartos inválido"),
  suites: z.coerce.number().min(0, "Número de suítes inválido").default(0),
  bathrooms: z.coerce
    .number()
    .min(0, "Número de banheiros inválido")
    .default(0),
  garages: z.coerce.number().min(0, "Número de vagas inválido"),
  rent: z.coerce.number().default(0),
  code: z.string().min(1, "O código do imóvel é obrigatório"),
  sale: z.coerce.number().default(0),
  value: z.coerce.number().min(0, "O valor é obrigatório"),
  iptu_value: z.coerce.number().default(0),
  condominium_value: z.coerce.number().default(0),
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
  property_type: null,
  street: "",
  neighborhood: "",
  city: "",
  state: "",
  zipcode: "",
  size: 0,
  bedrooms: 0,
  suites: 0,
  bathrooms: 0,
  garages: 0,
  rent: 0,
  code: "",
  sale: 1,
  value: 0,
  iptu_value: 0,
  condominium_value: 0,
  qr_code: "",
  active: 1,
  characteristics: [],
  attachments: [],
  purpose: "sell",
};
