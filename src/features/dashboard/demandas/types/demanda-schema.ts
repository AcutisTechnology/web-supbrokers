import { z } from 'zod';

export const demandaSchema = z.object({
  lead_id: z.number().nullable(),
  title: z.string().min(1, 'O título é obrigatório'),
  property_type: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  sale: z.boolean().default(false),
  rent: z.boolean().default(false),
  min_value: z.number().nullable().optional(),
  max_value: z.number().nullable().optional(),
  min_size: z.number().nullable().optional(),
  max_size: z.number().nullable().optional(),
  min_bedrooms: z.number().nullable().optional(),
  min_suites: z.number().nullable().optional(),
  min_bathrooms: z.number().nullable().optional(),
  min_garages: z.number().nullable().optional(),
  neighborhoods: z.array(z.string()).default([]),
  required_characteristics: z.array(z.string()).default([]),
  desired_characteristics: z.array(z.string()).default([]),
  description: z.string().nullable().optional(),
  status: z.enum(['nova','em_busca','imoveis_enviados','negociacao','fechada','perdida']).default('nova'),
})
  .refine(data => data.lead_id !== null, {
    message: 'Selecione um cliente',
    path: ['lead_id'],
  })
  .refine(data => data.sale || data.rent, {
    message: 'Selecione ao menos uma finalidade (Comprar ou Alugar)',
    path: ['sale'],
  });

export type DemandaFormValues = z.infer<typeof demandaSchema>;

export const demandaDefaultValues: DemandaFormValues = {
  lead_id: null,
  title: '',
  property_type: null,
  city: null,
  state: null,
  sale: false,
  rent: false,
  min_value: null,
  max_value: null,
  min_size: null,
  max_size: null,
  min_bedrooms: null,
  min_suites: null,
  min_bathrooms: null,
  min_garages: null,
  neighborhoods: [],
  required_characteristics: [],
  desired_characteristics: [],
  description: null,
  status: 'nova',
};
