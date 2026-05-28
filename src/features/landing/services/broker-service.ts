import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";

// Interface para os dados do imóvel
export interface Property {
  title: string;
  description: string;
  slug: string;
  property_type: string | null;
  street: string;
  neighborhood: string;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  size: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  garages: number;
  rent: boolean;
  sale: boolean;
  value: string;
  value_raw?: number;
  iptu_value: string;
  condominium_value?: string;
  code: string;
  qr_code: string;
  active: boolean;
  highlighted: boolean;
  characteristics: { text: string }[];
  attachments: { name: string; url: string }[];
  created_at: string;
}

export interface PublicSiteFooter {
  company_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  address_number: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  creci: string | null;
  footer_text: string | null;
  show_social_links: boolean;
}

export interface PublicSocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string | null;
  sort_order: number;
}

export interface PublicSite {
  primary_color: string | null;
  secondary_color: string | null;
  brand_image: string | null;
  favicon: string | null;
  site_title: string | null;
  site_subtitle: string | null;
  hero_eyebrow: string | null;
  hero_title_line_1: string | null;
  hero_title_line_2: string | null;
  hero_background_url: string | null;
  footer: PublicSiteFooter | null;
  social_links: PublicSocialLink[];
}

export interface PublicSiteStat {
  id: number;
  label: string;
  value: number;
  prefix: string | null;
  suffix: string | null;
  icon: string | null;
  sort_order: number;
}

// Interface para os dados do corretor
export interface User {
  name: string;
  phone: string;
  site?: PublicSite | null;
}

// Interface para os dados retornados pela API
export interface BrokerPropertiesResponse {
  data: {
    highlighted: Property[];
    all: Property[];
    sale: Property[];
    rent: Property[];
    stats: PublicSiteStat[];
    user: User;
  };
}

// Interface para os dados de um imóvel específico
export interface PropertyDetailResponse {
  data: {
    property: Property;
    user: User;
  };
}

// Chave para armazenar o imóvel selecionado no localStorage
const SELECTED_PROPERTY_KEY = 'selected_property';
const SELECTED_USER_KEY = 'selected_user';

/**
 * Armazena o imóvel selecionado e os dados do usuário no localStorage
 */
export function storeSelectedProperty(property: Property, user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SELECTED_PROPERTY_KEY, JSON.stringify(property));
    localStorage.setItem(SELECTED_USER_KEY, JSON.stringify(user));
  }
}

/**
 * Recupera o imóvel selecionado e os dados do usuário do localStorage
 */
export function getSelectedProperty(): PropertyDetailResponse | null {
  if (typeof window !== 'undefined') {
    const propertyStr = localStorage.getItem(SELECTED_PROPERTY_KEY);
    const userStr = localStorage.getItem(SELECTED_USER_KEY);
    
    if (propertyStr && userStr) {
      try {
        const property = JSON.parse(propertyStr);
        const user = JSON.parse(userStr);
        return {
          data: {
            property,
            user
          }
        };
      } catch (error) {
        console.error('Erro ao recuperar imóvel selecionado:', error);
      }
    }
  }
  return null;
}

export interface BrokerSearchFilters {
  q?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  property_type?: string | string[];
  purpose?: "sale" | "rent" | "both";
  bedrooms_min?: number;
  suites_min?: number;
  bathrooms_min?: number;
  garages_min?: number;
  size_min?: number;
  size_max?: number;
  price_min?: number;
  price_max?: number;
  code?: string;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "size_desc";
}

function buildFilterQuery(filters: BrokerSearchFilters = {}): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (value.length === 0) return;
      params.append(key, value.join(","));
    } else {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Hook para buscar os imóveis de um corretor com filtros opcionais.
 * Os filtros são serializados em query string e enviados ao endpoint público,
 * que aplica filtros server-side em todos os buckets (all/highlighted/sale/rent).
 *
 * @param slug Slug do corretor
 * @param filters Filtros opcionais
 */
export function useBrokerProperties(
  slug: string,
  filters: BrokerSearchFilters = {}
) {
  const query = buildFilterQuery(filters);
  return useQuery({
    queryKey: ["broker-properties", slug, query],
    queryFn: async () => {
      const response = await api
        .get(`${slug}/properties${query}`)
        .json<BrokerPropertiesResponse>();
      return response;
    },
    enabled: !!slug,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook para buscar os detalhes de um imóvel específico
 * @param brokerSlug Slug do corretor
 * @param propertySlug Slug do imóvel
 */
export function usePropertyDetail(brokerSlug: string, propertySlug: string) {
  return useQuery({
    queryKey: ["property-detail", brokerSlug, propertySlug],
    queryFn: async () => {
      // Tenta recuperar o imóvel do localStorage primeiro
      const storedProperty = getSelectedProperty();
      if (storedProperty) {
        return storedProperty;
      }
      
      // Se não encontrar no localStorage, faz a requisição para a API
      try {
        const response = await api.get(`${brokerSlug}/property/${propertySlug}`).json<PropertyDetailResponse>();
        return response;
      } catch (error) {
        console.error('Erro ao buscar imóvel da API:', error);
        throw error;
      }
    },
    enabled: !!brokerSlug && !!propertySlug,
  });
} 
