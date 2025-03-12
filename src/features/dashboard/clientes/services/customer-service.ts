import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";

// Interface para as propriedades de interesse do cliente
export interface InterestedProperty {
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
  code: string;
  qr_code: string;
  active: boolean;
  highlighted: boolean;
  characteristics: { text: string }[];
  images: { name: string; url: string }[];
  created_at: string;
}

// Interface para os dados de um cliente
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  interested_properties: InterestedProperty[];
}

// Interface para a resposta paginada da API
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

// Hook para buscar clientes com paginação
export function useCustomers(page = 1) {
  return useQuery({
    queryKey: ["customers", page],
    queryFn: async () => {
      const response = await api
        .get(`customers?page=${page}`)
        .json<PaginatedResponse<Customer>>();
      return response;
    },
  });
}

// Hook para buscar um cliente específico pelo ID
export function useCustomer(id: number) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const response = await api
        .get(`customers/${id}`)
        .json<{ data: Customer }>();
      return response;
    },
    enabled: !!id,
  });
}
