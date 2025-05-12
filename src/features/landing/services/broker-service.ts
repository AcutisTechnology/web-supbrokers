import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";

// Interface para os dados do imóvel
export interface Property {
  title: string;
  description: string;
  slug: string;
  street: string;
  neighborhood: string;
  size: number;
  bedrooms: number;
  garages: number;
  rent: boolean;
  sale: boolean;
  value: string;
  iptu_value: string;
  condominium_value?: string; // Valor do condomínio (opcional)
  code: string;
  qr_code: string;
  active: boolean;
  highlighted: boolean;
  characteristics: { text: string }[];
  images: { name: string; url: string }[];
  created_at: string;
}

// Interface para os dados do corretor
export interface User {
  name: string;
  phone: string;
  page_settings?: {
    primary_color: string;
    title: string;
    subtitle: string;
    brand_image: string;
  }
}

// Interface para os dados retornados pela API
export interface BrokerPropertiesResponse {
  data: {
    highlighted: Property[];
    releases: Property[];
    all: Property[];
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

/**
 * Hook para buscar os imóveis de um corretor
 * @param slug Slug do corretor
 */
export function useBrokerProperties(slug: string) {
  return useQuery({
    queryKey: ["broker-properties", slug],
    queryFn: async () => {
      const response = await api.get(`${slug}/properties`).json<BrokerPropertiesResponse>();
      return response;
    },
    enabled: !!slug,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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