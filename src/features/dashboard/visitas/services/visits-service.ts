import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/configs/api";

import { VisitFormValues } from "../schemas/visit-schema";
import {
  LeadSearchResult,
  PaginatedResponse,
  PropertySearchResult,
  VisitListItem,
  VisitsFilters,
} from "../types/visit";

function appendIfDefined(formData: FormData, key: string, value: unknown) {
  if (value === undefined || value === null) return;
  if (typeof value === "boolean") {
    formData.append(key, value ? "1" : "0");
    return;
  }
  formData.append(key, String(value));
}

function buildVisitFormData(values: VisitFormValues, files: File[], removeFileIds: number[] = []) {
  const formData = new FormData();

  appendIfDefined(formData, "lead_id", values.lead_id ?? undefined);
  appendIfDefined(formData, "property_id", values.property_id ?? undefined);

  appendIfDefined(formData, "visitor_name", values.visitor_name);
  appendIfDefined(formData, "visitor_phone", values.visitor_phone);
  appendIfDefined(formData, "visitor_email", values.visitor_email || undefined);

  appendIfDefined(formData, "property_name", values.property_name || undefined);
  appendIfDefined(formData, "property_address", values.property_address || undefined);

  appendIfDefined(formData, "property_type", values.property_type || undefined);
  appendIfDefined(formData, "interest_type", values.interest_type || undefined);
  appendIfDefined(formData, "source", values.source || undefined);

  appendIfDefined(formData, "customer_notes", values.customer_notes || undefined);
  appendIfDefined(formData, "broker_notes", values.broker_notes || undefined);
  appendIfDefined(formData, "broker_notes_private", values.broker_notes_private);

  appendIfDefined(formData, "has_partner_broker", values.has_partner_broker);
  appendIfDefined(formData, "partner_broker_name", values.partner_broker_name || undefined);
  appendIfDefined(formData, "partner_broker_creci", values.partner_broker_creci || undefined);
  appendIfDefined(formData, "partner_broker_phone", values.partner_broker_phone || undefined);
  appendIfDefined(formData, "partner_broker_company", values.partner_broker_company || undefined);

  if (values.signature) {
    formData.append("signature", values.signature);
  }

  appendIfDefined(formData, "status", values.status);
  appendIfDefined(formData, "visited_at", values.visited_at || undefined);

  files.forEach((file) => {
    formData.append("files[]", file);
  });

  removeFileIds.forEach((id) => {
    formData.append("remove_file_ids[]", String(id));
  });

  return formData;
}

export function useVisits(filters: VisitsFilters = {}) {
  return useQuery({
    queryKey: ["visits", filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        searchParams.set(key, String(value));
      });

      const url = searchParams.toString() ? `visits?${searchParams.toString()}` : "visits";
      return api.get(url).json<PaginatedResponse<VisitListItem>>();
    },
  });
}

export function useVisit(id: number | null) {
  return useQuery({
    queryKey: ["visit", id],
    enabled: !!id && Number.isFinite(id),
    queryFn: async () => {
      const response = await api.get(`visits/${id}`).json<{ data: VisitListItem }>();
      return response.data;
    },
  });
}

export function useCreateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ values, files }: { values: VisitFormValues; files: File[] }) => {
      const formData = buildVisitFormData(values, files);
      const response = await api.post("visits", { body: formData }).json<{ data: VisitListItem }>();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    },
  });
}

export function useUpdateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      values,
      files,
      removeFileIds = [],
    }: {
      id: number;
      values: VisitFormValues;
      files: File[];
      removeFileIds?: number[];
    }) => {
      const formData = buildVisitFormData(values, files, removeFileIds);
      const response = await api
        .post(`visits/${id}`, { body: formData })
        .json<{ data: VisitListItem }>();
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["visit", data.id] });
    },
  });
}

export function useDeleteVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => api.delete(`visits/${id}`).json(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    },
  });
}

export async function searchVisitLeads(query: string): Promise<LeadSearchResult[]> {
  if (!query.trim()) return [];
  const response = await api
    .get(`visits/search/leads?q=${encodeURIComponent(query)}`)
    .json<{ data: LeadSearchResult[] }>();
  return response.data;
}

export async function searchVisitProperties(query: string): Promise<PropertySearchResult[]> {
  if (!query.trim()) return [];
  const response = await api
    .get(`visits/search/properties?q=${encodeURIComponent(query)}`)
    .json<{ data: PropertySearchResult[] }>();
  return response.data;
}

export interface QuickLeadInput {
  name: string;
  phone: string;
  email?: string | null;
  cpf?: string | null;
}

export async function quickCreateLead(input: QuickLeadInput): Promise<LeadSearchResult> {
  const formData = new FormData();
  formData.append("name", input.name);
  formData.append("phone", input.phone);
  if (input.email) formData.append("email", input.email);
  if (input.cpf) formData.append("cpf", input.cpf);

  const response = await api
    .post("visits/quick/leads", { body: formData })
    .json<{ data: LeadSearchResult }>();
  return response.data;
}

export interface QuickPropertyInput {
  property_type: string;
  street: string;
  neighborhood: string;
  condo_value?: number | null;
  value?: number | null;
  notes?: string | null;
}

export async function quickCreateProperty(input: QuickPropertyInput): Promise<PropertySearchResult> {
  const formData = new FormData();
  formData.append("property_type", input.property_type);
  formData.append("street", input.street);
  formData.append("neighborhood", input.neighborhood);
  if (input.condo_value != null) formData.append("condo_value", String(input.condo_value));
  if (input.value != null) formData.append("value", String(input.value));
  if (input.notes) formData.append("notes", input.notes);

  const response = await api
    .post("visits/quick/properties", { body: formData })
    .json<{ data: PropertySearchResult }>();
  return response.data;
}
