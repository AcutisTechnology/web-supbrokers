import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";

export const COMMISSION_TYPES = ["percentage", "fixed"] as const;
export type CommissionType = (typeof COMMISSION_TYPES)[number];

export const SALE_STATUSES = ["pending", "partial", "received", "canceled"] as const;
export type SaleStatus = (typeof SALE_STATUSES)[number];

export const COMMISSION_STATUSES = ["pending", "released", "partial", "registered", "blocked"] as const;
export type CommissionStatus = (typeof COMMISSION_STATUSES)[number];

export interface FinanceSaleBroker {
  id: number;
  uuid: string;
  broker_id: number;
  broker_name?: string;
  participation_percentage: number;
  commission_amount: number;
}

export interface FinanceSaleInstallment {
  id: number;
  uuid: string;
  description: string;
  amount: number;
  due_date: string | null;
  received_at: string | null;
  payment_method: string | null;
  status: "pending" | "overdue" | "received";
  notes: string | null;
}

export interface FinanceBrokerCommission {
  id: number;
  uuid: string;
  finance_sale_id: number;
  broker_id: number;
  broker_name?: string;
  total_amount: number;
  released_amount: number;
  pending_amount: number;
  status: CommissionStatus;
  released_at: string | null;
  sale?: {
    id: number;
    uuid: string;
    sale_value: number;
    status: SaleStatus;
    contract_date: string | null;
    property?: { id: number; title: string | null };
    client?: { id: number; name: string | null };
  } | null;
}

export interface FinanceSale {
  id: number;
  uuid: string;
  company_id: number;
  property?: {
    id: number;
    title: string | null;
    slug?: string | null;
    code?: string | null;
  };
  client?: {
    id: number;
    name: string | null;
    email?: string | null;
    phone?: string | null;
  };
  sale_value: number;
  commission_type: CommissionType;
  commission_value: number | null;
  commission_percentage: number | null;
  commission_total: number;
  status: SaleStatus;
  contract_date: string | null;
  notes: string | null;
  brokers?: FinanceSaleBroker[];
  brokers_count?: number;
  installments?: FinanceSaleInstallment[];
  commissions?: FinanceBrokerCommission[];
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SaleFilters {
  search?: string;
  broker_id?: number;
  client_id?: number;
  property_id?: number;
  status?: SaleStatus;
  date_from?: string;
  date_to?: string;
  min_value?: number;
  max_value?: number;
  per_page?: number;
  page?: number;
}

export interface SalePayload {
  property_id: number;
  client_id: number;
  sale_value: number;
  commission_type: CommissionType;
  commission_value?: number | null;
  commission_percentage?: number | null;
  status?: SaleStatus;
  contract_date?: string | null;
  notes?: string | null;
  brokers: Array<{ broker_id: number; participation_percentage: number }>;
  installments?: Array<{
    id?: number;
    description: string;
    amount: number;
    due_date: string;
    payment_method?: string | null;
    notes?: string | null;
    status?: "pending" | "overdue" | "received";
    received_at?: string | null;
  }>;
}

export interface FinanceDashboard {
  total_sold: number;
  sales_count: number;
  expected_commission: number;
  released_commission: number;
}

export interface BrokerOption {
  id: number;
  name: string | null;
  email: string | null;
}

interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

function toQuery(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  return search.toString();
}

const KEY = {
  list: (filters: SaleFilters) => ["finance", "sales", filters] as const,
  one: (id: number) => ["finance", "sales", id] as const,
  dashboard: () => ["finance", "dashboard"] as const,
  myCommissions: (filters: Record<string, unknown>) => ["finance", "my-commissions", filters] as const,
  brokers: () => ["finance", "brokers"] as const,
};

export function useFinanceSales(filters: SaleFilters = {}) {
  return useQuery({
    queryKey: KEY.list(filters),
    queryFn: async () => {
      const qs = toQuery(filters as Record<string, unknown>);
      const url = qs ? `finance/sales?${qs}` : "finance/sales";
      return api.get(url).json<PaginatedResponse<FinanceSale>>();
    },
  });
}

export function useFinanceSale(id: number | null) {
  return useQuery({
    queryKey: id ? KEY.one(id) : ["finance", "sales", "none"],
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      return api.get(`finance/sales/${id}`).json<{ data: FinanceSale }>();
    },
    enabled: !!id,
  });
}

export function useFinanceDashboard() {
  return useQuery({
    queryKey: KEY.dashboard(),
    queryFn: async () => api.get("finance/dashboard").json<{ data: FinanceDashboard }>(),
  });
}

export function useMyCommissions(filters: { status?: CommissionStatus; per_page?: number; page?: number } = {}) {
  return useQuery({
    queryKey: KEY.myCommissions(filters),
    queryFn: async () => {
      const qs = toQuery(filters);
      const url = qs ? `finance/my-commissions?${qs}` : "finance/my-commissions";
      return api.get(url).json<PaginatedResponse<FinanceBrokerCommission>>();
    },
  });
}

export function useFinanceBrokers() {
  return useQuery({
    queryKey: KEY.brokers(),
    queryFn: async () => api.get("finance/brokers").json<{ data: BrokerOption[] }>(),
  });
}

export function useCreateFinanceSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SalePayload) => api.post("finance/sales", { json: payload }).json<{ data: FinanceSale }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finance"] });
    },
  });
}

export function useUpdateFinanceSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<SalePayload> }) =>
      api.put(`finance/sales/${id}`, { json: payload }).json<{ data: FinanceSale }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finance"] });
    },
  });
}

export function useDeleteFinanceSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`finance/sales/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finance"] });
    },
  });
}

// Calcula a comissão total a partir do payload, espelhando a regra do backend.
export function computeTotalCommission(
  saleValue: number,
  commissionType: CommissionType,
  commissionValue?: number | null,
  commissionPercentage?: number | null,
): number {
  if (commissionType === "fixed") {
    return Math.max(0, Number(commissionValue ?? 0));
  }
  const pct = Math.max(0, Number(commissionPercentage ?? 0));
  return Math.round((Number(saleValue) || 0) * pct) / 100;
}

export const STATUS_LABELS: Record<SaleStatus, string> = {
  pending: "Pendente",
  partial: "Parcial",
  received: "Recebida",
  canceled: "Cancelada",
};

export const STATUS_BADGE_CLASS: Record<SaleStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border border-amber-200",
  partial: "bg-blue-100 text-blue-800 border border-blue-200",
  received: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  canceled: "bg-rose-100 text-rose-800 border border-rose-200",
};

export const COMMISSION_STATUS_LABELS: Record<CommissionStatus, string> = {
  pending: "Pendente",
  released: "Liberada",
  partial: "Parcial",
  registered: "Registrada",
  blocked: "Bloqueada",
};
