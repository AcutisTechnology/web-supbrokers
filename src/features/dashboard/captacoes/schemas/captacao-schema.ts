import { z } from "zod";

export const catalogOptionSchema = z.object({
  id: z.number().nullable(),
  name: z.string(),
});

export const captacaoSchema = z.object({
  building_name: z.string().min(1, "Informe o nome do prédio"),
  builder: catalogOptionSchema.refine((v) => v.name.trim().length > 0, "Informe a construtora"),
  city: catalogOptionSchema.refine((v) => v.name.trim().length > 0, "Informe a cidade"),
  neighborhood: catalogOptionSchema.refine((v) => v.name.trim().length > 0, "Informe o bairro"),
  min_size: z.number().nullable().optional(),
  max_size: z.number().nullable().optional(),
  min_value: z.number().nullable().optional(),
  max_value: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
  drive_url: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export type CaptacaoFormValues = z.infer<typeof captacaoSchema>;

export const defaultCaptacaoValues: CaptacaoFormValues = {
  building_name: "",
  builder: { id: null, name: "" },
  city: { id: null, name: "" },
  neighborhood: { id: null, name: "" },
  min_size: null,
  max_size: null,
  min_value: null,
  max_value: null,
  status: null,
  drive_url: null,
  description: null,
};
