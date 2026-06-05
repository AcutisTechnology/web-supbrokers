export type DemandaStatus =
  | 'nova'
  | 'em_busca'
  | 'imoveis_enviados'
  | 'negociacao'
  | 'fechada'
  | 'perdida';

export const DEMANDA_STATUS_LABELS: Record<DemandaStatus, string> = {
  nova: 'Nova',
  em_busca: 'Em busca',
  imoveis_enviados: 'Imóveis enviados',
  negociacao: 'Negociação',
  fechada: 'Fechada',
  perdida: 'Perdida',
};

export const DEMANDA_STATUS_COLORS: Record<DemandaStatus, string> = {
  nova: 'bg-blue-100 text-blue-700',
  em_busca: 'bg-purple-100 text-purple-700',
  imoveis_enviados: 'bg-yellow-100 text-yellow-700',
  negociacao: 'bg-orange-100 text-orange-700',
  fechada: 'bg-green-100 text-green-700',
  perdida: 'bg-red-100 text-red-700',
};

export const PROPERTY_TYPES = ['Casa', 'Apartamento', 'Terreno', 'Comercial'] as const;
export type PropertyType = typeof PROPERTY_TYPES[number];

export interface DemandaClient {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

export interface DemandaMatchProperty {
  id: number;
  title: string;
  slug: string;
  code?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  value: number;
  value_formatted: string;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  garages?: number;
  size?: number;
  property_type?: string;
  photo_url?: string | null;
}

export interface DemandaMatch {
  id: number;
  compatibility_score: number;
  property: DemandaMatchProperty | null;
}

export interface Demanda {
  id: number;
  title: string;
  property_type?: string | null;
  city?: string | null;
  state?: string | null;
  sale: boolean;
  rent: boolean;
  min_value?: number | null;
  max_value?: number | null;
  min_size?: number | null;
  max_size?: number | null;
  min_bedrooms?: number | null;
  min_suites?: number | null;
  min_bathrooms?: number | null;
  min_garages?: number | null;
  neighborhoods: string[];
  required_characteristics: string[];
  desired_characteristics: string[];
  description?: string | null;
  status: DemandaStatus;
  matches_count: number;
  client?: DemandaClient | null;
  matches?: DemandaMatch[];
  created_at: string;
  updated_at: string;
}
