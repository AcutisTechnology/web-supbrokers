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
  finance_sale_id?: number;
  installment_number: number | null;
  description: string;
  amount: number;
  due_date: string | null;
  received_at: string | null;
  payment_method: string | null;
  status: "pending" | "overdue" | "received";
  is_commission_released?: boolean;
  notes: string | null;
  sale?: {
    id: number;
    uuid: string;
    status: SaleStatus;
    sale_value: number;
    property?: { id: number; title: string | null; code?: string | null } | null;
    client?: { id: number; name: string | null } | null;
  } | null;
}

export interface FinanceBrokerCommission {
  id: number;
  uuid: string;
  finance_sale_id: number;
  broker_id: number;
  broker_name?: string;
  total_amount: number;
  released_amount: number;
  available_amount: number;
  registered_amount: number;
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

export const PAYMENT_METHODS = ["pix", "ted", "transfer", "cash", "other"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pix: "PIX",
  ted: "TED",
  transfer: "Transferência",
  cash: "Dinheiro",
  other: "Outro",
};

export interface FinanceCommissionRegister {
  id: number;
  uuid: string;
  finance_broker_commission_id: number;
  amount: number;
  payment_date: string | null;
  payment_method: PaymentMethod;
  receipt_file: string | null;
  receipt_url: string | null;
  receipt_file_name: string | null;
  notes: string | null;
  created_by: number | null;
  creator_name?: string;
  created_at: string;
  commission?: {
    id: number;
    broker_id: number;
    broker_name?: string;
    total_amount: number;
    released_amount: number;
    registered_amount: number;
    available_amount: number;
    sale?: {
      id: number;
      sale_value: number;
      property?: { id: number; title: string | null; code?: string | null };
      client?: { id: number; name: string | null };
    };
  };
}

export interface FinanceDashboardFull extends FinanceDashboard {
  total_received: number;
  overdue_installments_count: number;
  available_commission: number;
  registered_commission: number;
  pending_commission: number;
  broker_ranking: Array<{
    broker_id: number;
    broker_name: string | null;
    sales_count: number;
    commission_total: number;
  }>;
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

// ─── FASE 2 ───────────────────────────────────────────────────────────────────

export interface InstallmentFilters {
  sale_id?: number;
  status?: "pending" | "overdue" | "received";
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

export interface InstallmentPayload {
  finance_sale_id: number;
  installment_number?: number;
  description: string;
  amount: number;
  due_date: string;
  payment_method?: string | null;
  status?: "pending" | "overdue" | "received";
  notes?: string | null;
}

export interface CommissionRegisterFilters {
  broker_id?: number;
  commission_id?: number;
  payment_method?: PaymentMethod;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

export function useInstallments(filters: InstallmentFilters = {}) {
  return useQuery({
    queryKey: ["finance", "installments", filters],
    queryFn: async () => {
      const qs = toQuery(filters as Record<string, unknown>);
      const url = qs ? `finance/installments?${qs}` : "finance/installments";
      return api.get(url).json<PaginatedResponse<FinanceSaleInstallment>>();
    },
  });
}

export function useCreateInstallment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InstallmentPayload) =>
      api.post("finance/installments", { json: payload }).json<{ data: FinanceSaleInstallment }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finance"] });
    },
  });
}

export function useUpdateInstallment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<InstallmentPayload> }) =>
      api.put(`finance/installments/${id}`, { json: payload }).json<{ data: FinanceSaleInstallment }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finance"] });
    },
  });
}

export function useReceiveInstallment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, received_at }: { id: number; received_at?: string }) =>
      api
        .put(`finance/installments/${id}/receive`, {
          json: received_at ? { received_at } : {},
        })
        .json<{ data: FinanceSaleInstallment }>(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finance"] });
    },
  });
}

export function useFinanceCommissions(filters: { broker_id?: number; sale_id?: number; status?: CommissionStatus; per_page?: number; page?: number } = {}) {
  return useQuery({
    queryKey: ["finance", "commissions", filters],
    queryFn: async () => {
      const qs = toQuery(filters as Record<string, unknown>);
      const url = qs ? `finance/commissions?${qs}` : "finance/commissions";
      return api.get(url).json<PaginatedResponse<FinanceBrokerCommission>>();
    },
  });
}

export function useFinanceCommission(id: number | null) {
  return useQuery({
    queryKey: id ? ["finance", "commissions", id] : ["finance", "commissions", "none"],
    queryFn: async () => {
      if (!id) throw new Error("missing id");
      return api.get(`finance/commissions/${id}`).json<{ data: FinanceBrokerCommission }>();
    },
    enabled: !!id,
  });
}

export function useCommissionRegisters(filters: CommissionRegisterFilters = {}) {
  return useQuery({
    queryKey: ["finance", "commission-registers", filters],
    queryFn: async () => {
      const qs = toQuery(filters as Record<string, unknown>);
      const url = qs ? `finance/commission-registers?${qs}` : "finance/commission-registers";
      return api.get(url).json<PaginatedResponse<FinanceCommissionRegister>>();
    },
  });
}

export function useCreateCommissionRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      finance_broker_commission_id: number;
      amount: number;
      payment_date: string;
      payment_method: PaymentMethod;
      notes?: string;
      receipt?: File | null;
    }) => {
      const formData = new FormData();
      formData.append("finance_broker_commission_id", String(payload.finance_broker_commission_id));
      formData.append("amount", String(payload.amount));
      formData.append("payment_date", payload.payment_date);
      formData.append("payment_method", payload.payment_method);
      if (payload.notes) formData.append("notes", payload.notes);
      if (payload.receipt) formData.append("receipt", payload.receipt);
      return api
        .post("finance/commission-registers", { body: formData })
        .json<{ data: FinanceCommissionRegister }>();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finance"] });
    },
  });
}

export function useDeleteCommissionRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`finance/commission-registers/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finance"] });
    },
  });
}

export function useFinanceDashboardFull() {
  return useQuery({
    queryKey: ["finance", "dashboard"],
    queryFn: async () =>
      api.get("finance/dashboard").json<{ data: FinanceDashboardFull }>(),
  });
}

export const INSTALLMENT_STATUS_LABELS: Record<"pending" | "overdue" | "received", string> = {
  pending: "Pendente",
  overdue: "Vencida",
  received: "Recebida",
};

export const INSTALLMENT_STATUS_BADGE: Record<"pending" | "overdue" | "received", string> = {
  pending: "bg-amber-100 text-amber-800 border border-amber-200",
  overdue: "bg-rose-100 text-rose-800 border border-rose-200",
  received: "bg-emerald-100 text-emerald-800 border border-emerald-200",
};
