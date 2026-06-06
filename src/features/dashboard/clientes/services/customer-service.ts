import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useCrmLeads, useInfiniteCrmLeads, CrmLead, CrmLeadsFilters } from "@/features/dashboard/crm/services/crm-service";

// ── Novo: leads via CRM ───────────────────────────────────────────────────────

export type { CrmLead };
export type { CrmLeadsFilters };

export function useLeads(filters?: CrmLeadsFilters) {
  return useCrmLeads(filters);
}

export function useInfiniteLeads(filters?: CrmLeadsFilters) {
  return useInfiniteCrmLeads(filters);
}

// ── Legado: mantido para compatibilidade com dashboard e financeiro ────────────

export interface InterestedProperty {
  id: number;
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

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  interested_properties: InterestedProperty[];
}

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
    links: { url: string | null; label: string; active: boolean }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export function useCustomers(page = 1) {
  return useQuery({
    queryKey: ["customers", page],
    queryFn: () =>
      api.get(`customers?page=${page}`).json<PaginatedResponse<Customer>>(),
  });
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => api.get(`customers/${id}`).json<{ data: Customer }>(),
    enabled: !!id,
  });
}
