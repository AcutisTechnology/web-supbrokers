import { z } from "zod";

export const PROPERTY_TYPES = [
  "apartamento",
  "casa",
  "casa_condominio",
  "casa_vila",
  "cobertura",
  "fazenda_sitio_chacara",
  "flat",
  "kitnet_conjugado",
  "loft",
  "lote_terreno",
  "predio_edificio",
  "studio",
  // legados — aceitos mas não exibidos no dropdown
  "comercial",
  "sobrado",
  "kitnet",
  "sitio",
  "chacara",
  "galpao",
  "sala_comercial",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_TYPES_UI = [
  "apartamento",
  "casa",
  "casa_condominio",
  "casa_vila",
  "cobertura",
  "fazenda_sitio_chacara",
  "flat",
  "kitnet_conjugado",
  "loft",
  "lote_terreno",
  "predio_edificio",
  "studio",
] as const satisfies readonly PropertyType[];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartamento:           "Apartamento",
  casa:                  "Casa",
  casa_condominio:       "Casa de condomínio",
  casa_vila:             "Casa de vila",
  cobertura:             "Cobertura",
  fazenda_sitio_chacara: "Fazenda/Sítio/Chácara",
  flat:                  "Flat",
  kitnet_conjugado:      "Kitnet/Conjugado",
  loft:                  "Loft",
  lote_terreno:          "Lote/Terreno",
  predio_edificio:       "Prédio/Edifício inteiro",
  studio:                "Studio",
  // legados
  comercial:    "Comercial",
  sobrado:      "Sobrado",
  kitnet:       "Kitnet",
  sitio:        "Sítio",
  chacara:      "Chácara",
  galpao:       "Galpão",
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
  total_size: z.coerce.number().optional().nullable(),
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
  value: z.coerce.number().min(1, "O valor é obrigatório"),
  iptu_value: z.coerce.number().default(0),
  condominium_value: z.coerce.number().default(0),
  qr_code: z.string().optional().nullable(),
  active: z.coerce.number().default(1),
  characteristics: z.array(z.string()).default([]),
  attachments: z.array(z.any()).default([]),
  purpose: z.enum(["sell", "rent", "both"]).default("sell"),
  rent_price: z.coerce.number().default(0),
  responsible_user_id: z.number().optional().nullable(),
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
  total_size: null,
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
  rent_price: 0,
  responsible_user_id: null,
};
