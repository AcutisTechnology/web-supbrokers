import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast";

export type CrmPipelineStage = {
  id: number;
  company_id: number;
  name: string;
  order: number;
  color: string | null;
  is_default: boolean;
  is_won: boolean;
  is_lost: boolean;
  leads_count?: number;
};

export type CrmLeadSource = {
  id: number;
  name: string;
  slug: string;
  color: string | null;
  is_active: boolean;
};

export type CrmLeadLossReason = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
};

export type CrmTag = {
  id: number;
  name: string;
  color: string | null;
};

export type CrmLead = {
  id: number;
  company_id: number;
  name: string;
  phone: string;
  email?: string | null;
  cpf?: string | null;
  profession?: string | null;
  source: string | null;
  source_id?: number | null;
  lead_source?: CrmLeadSource | null;
  status: "open" | "won" | "lost";
  priority: 1 | 2 | 3;
  value: string | null;
  pipeline_stage_id: number;
  pipeline_stage?: {
    id: number;
    name: string;
    order: number;
    color: string | null;
    is_won?: boolean;
    is_lost?: boolean;
  } | null;
  assigned_user_id: number | null;
  assigned_user?: { id: number; name: string } | null;
  tags?: CrmTag[];
  notes?: string | null;
  last_loss_reason_id?: number | null;
  last_loss_reason?: { id: number; name: string } | null;
  lost_at?: string | null;
  won_at?: string | null;
  created_at: string;
  updated_at: string;
  last_interaction_at: string | null;
  next_follow_up_at: string | null;
  days_without_contact?: number | null;
  is_hot?: boolean;
};

export type CrmLeadInteraction = {
  id: number;
  type: "call" | "whatsapp" | "note" | "email" | "meeting" | "visit" | "task";
  description: string;
  created_at: string;
};

export type CrmLeadStageMovement = {
  id: number;
  from_stage: { id: number; name: string; color: string | null } | null;
  to_stage: { id: number; name: string; color: string | null } | null;
  moved_by: { id: number; name: string } | null;
  created_at: string;
};

export type CrmLeadAttachment = {
  id: number;
  name: string;
  url: string;
  mime_type: string | null;
  size: number | null;
  created_at: string;
};

export const CRM_ACTIVITY_TYPES = ["call", "whatsapp", "meeting", "visit", "email", "task"] as const;
export type CrmActivityType = (typeof CRM_ACTIVITY_TYPES)[number];

export const CRM_ACTIVITY_TYPE_LABELS: Record<CrmActivityType, string> = {
  call: "Ligação",
  whatsapp: "WhatsApp",
  meeting: "Reunião",
  visit: "Visita",
  email: "E-mail",
  task: "Tarefa",
};

export type CrmLeadActivity = {
  id: number;
  uuid: string;
  lead_id: number;
  type: CrmActivityType;
  title: string;
  description: string | null;
  scheduled_for: string | null;
  done_at: string | null;
  is_done: boolean;
  is_overdue: boolean;
  responsible_user_id: number | null;
  responsible?: { id: number; name: string } | null;
  created_by_user_id: number | null;
  created_by?: { id: number; name: string } | null;
  lead?: { id: number; name: string; phone: string } | null;
  created_at: string;
  updated_at: string;
};

export type CrmLeadProposal = {
  id: number;
  uuid: string;
  code: string | null;
  status: string;
  property: { id: number; title: string | null; code: string | null } | null;
  total_value: string | null;
  created_at: string;
  accepted_at: string | null;
  rejected_at: string | null;
};

export type CrmLeadDetail = CrmLead & {
  interactions: CrmLeadInteraction[];
  stage_movements: CrmLeadStageMovement[];
  attachments: CrmLeadAttachment[];
  activities?: CrmLeadActivity[];
  pending_activities_count?: number;
  properties?: Array<{
    id: number;
    code: string | null;
    title: string | null;
    street: string | null;
    neighborhood: string | null;
    value: string | null;
    rent: boolean | null;
    sale: boolean | null;
    pivot?: { interest_type: string | null; notes: string | null; created_at: string | null } | null;
  }>;
  proposals?: CrmLeadProposal[];
};

export type CrmMetrics = {
  total_leads: number;
  total_value: number;
  open_leads: number;
  won_leads: number;
  lost_leads: number;
  negotiation_value: number;
  won_value: number;
  conversion_rate: number;
  avg_ticket: number;
};

export type CrmLeadsFilters = {
  search?: string;
  status?: "open" | "won" | "lost" | "all";
  assigned_user_id?: number | "all";
  source_id?: number | "all";
  tag_ids?: number[];
  period?: "this_month" | "last_7_days" | "last_30_days" | "all";
  min_value?: number;
  max_value?: number;
  no_contact_days?: number;
  no_activity?: boolean;
  is_hot?: boolean;
  sort?: "recent" | "value" | "priority";
  direction?: "asc" | "desc";
};

const buildLeadsQuery = (filters?: CrmLeadsFilters) => {
  if (!filters) return "";

  const params = new URLSearchParams();
  const search = filters.search?.trim();
  if (search) params.set("search", search);

  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.assigned_user_id && filters.assigned_user_id !== "all")
    params.set("assigned_user_id", String(filters.assigned_user_id));
  if (filters.source_id && filters.source_id !== "all")
    params.set("source_id", String(filters.source_id));

  if (filters.period && filters.period !== "all") params.set("period", filters.period);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.direction) params.set("direction", filters.direction);

  if (filters.tag_ids && filters.tag_ids.length > 0) params.set("tag_ids", filters.tag_ids.join(","));
  if (filters.min_value) params.set("min_value", String(filters.min_value));
  if (filters.max_value) params.set("max_value", String(filters.max_value));
  if (filters.no_contact_days) params.set("no_contact_days", String(filters.no_contact_days));
  if (filters.no_activity) params.set("no_activity", "1");
  if (filters.is_hot) params.set("is_hot", "1");

  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export function useCrmPipelineStages() {
  return useQuery({
    queryKey: ["crm", "pipeline-stages"],
    queryFn: async () => {
      const response = await api.get("crm/pipeline-stages").json<{ data: CrmPipelineStage[] }>();
      return response.data;
    },
  });
}

export function useCrmTags() {
  return useQuery({
    queryKey: ["crm", "tags"],
    queryFn: async () => {
      const response = await api.get("crm/tags").json<{ data: CrmTag[] }>();
      return response.data;
    },
  });
}

export function useCrmLeads(filters?: CrmLeadsFilters) {
  const qs = buildLeadsQuery(filters);

  return useQuery({
    queryKey: ["crm", "leads", filters ?? {}],
    queryFn: async () => {
      const response = await api.get(`crm/leads${qs}`).json<{ data: CrmLead[] }>();
      return response.data;
    },
  });
}

export function useCrmLead(id: number) {
  return useQuery({
    queryKey: ["crm", "lead", id],
    queryFn: async () => {
      const response = await api.get(`crm/leads/${id}`).json<{ data: CrmLeadDetail }>();
      return response.data;
    },
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCrmMetrics(period?: CrmLeadsFilters["period"]) {
  const params = new URLSearchParams();
  if (period && period !== "all") params.set("period", period);
  const qs = params.toString();

  return useQuery({
    queryKey: ["crm", "metrics", period ?? "all"],
    queryFn: async () => {
      const response = await api.get(`crm/metrics${qs ? `?${qs}` : ""}`).json<{ data: CrmMetrics }>();
      return response.data;
    },
  });
}

type CrmLeadCreatePayload = {
  name: string;
  phone: string;
  email?: string | null;
  cpf?: string | null;
  profession?: string | null;
  source?: string | null;
  source_id?: number | null;
  status?: "open" | "won" | "lost";
  priority?: 1 | 2 | 3;
  value?: number | null;
  pipeline_stage_id: number;
  assigned_user_id?: number | null;
  tag_ids?: number[];
  notes?: string | null;
  next_follow_up_at?: string | null;
};

type CrmLeadUpdatePayload = Partial<CrmLeadCreatePayload>;

export function useCreateCrmLead() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmLead }, Error, CrmLeadCreatePayload>({
    mutationFn: async (payload) => api.post("crm/leads", { json: payload }).json<{ data: CrmLead }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "pipeline-stages"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "metrics"] });
      toast({ title: "Lead criado com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao criar lead",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCrmLead(id: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmLead }, Error, CrmLeadUpdatePayload>({
    mutationFn: async (payload) => api.put(`crm/leads/${id}`, { json: payload }).json<{ data: CrmLead }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "lead", id] });
      queryClient.invalidateQueries({ queryKey: ["crm", "pipeline-stages"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "metrics"] });
      toast({ title: "Lead atualizado com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar lead",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCrmLead() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`crm/leads/${id}`).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "pipeline-stages"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "metrics"] });
      toast({ title: "Lead excluído com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir lead",
        description: "Ocorreu um erro ao excluir. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useMoveCrmLeadStage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmLead }, Error, { id: number; to_stage_id: number }>({
    mutationFn: async ({ id, to_stage_id }) =>
      api.post(`crm/leads/${id}/move`, { json: { to_stage_id } }).json<{ data: CrmLead }>(),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "lead", vars.id] });
      queryClient.invalidateQueries({ queryKey: ["crm", "pipeline-stages"] });
      toast({ title: "Etapa atualizada!" });
    },
    onError: () => {
      toast({
        title: "Erro ao mover lead",
        description: "Ocorreu um erro ao atualizar a etapa. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useDuplicateCrmLead() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmLead }, Error, number>({
    mutationFn: async (id) => api.post(`crm/leads/${id}/duplicate`).json<{ data: CrmLead }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "pipeline-stages"] });
      toast({ title: "Lead duplicado!" });
    },
    onError: () => {
      toast({
        title: "Erro ao duplicar lead",
        description: "Ocorreu um erro ao duplicar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useMarkWonCrmLead() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmLead }, Error, number>({
    mutationFn: async (id) => api.post(`crm/leads/${id}/mark-won`).json<{ data: CrmLead }>(),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "lead", id] });
      queryClient.invalidateQueries({ queryKey: ["crm", "pipeline-stages"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "metrics"] });
      toast({ title: "Lead marcado como ganho!" });
    },
    onError: () => {
      toast({
        title: "Erro ao marcar como ganho",
        description: "Ocorreu um erro ao atualizar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useMarkLostCrmLead() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmLead }, Error, { id: number; loss_reason_id?: number | null }>({
    mutationFn: async ({ id, loss_reason_id }) =>
      api
        .post(`crm/leads/${id}/mark-lost`, {
          json: loss_reason_id ? { loss_reason_id } : {},
        })
        .json<{ data: CrmLead }>(),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "lead", id] });
      queryClient.invalidateQueries({ queryKey: ["crm", "metrics"] });
      toast({ title: "Lead marcado como perdido." });
    },
    onError: () => {
      toast({
        title: "Erro ao marcar como perdido",
        description: "Ocorreu um erro ao atualizar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useCrmLeadSources() {
  return useQuery({
    queryKey: ["crm", "sources"],
    queryFn: async () => (await api.get("crm/sources").json<{ data: CrmLeadSource[] }>()).data,
  });
}

export function useCrmLeadLossReasons() {
  return useQuery({
    queryKey: ["crm", "loss-reasons"],
    queryFn: async () =>
      (await api.get("crm/loss-reasons").json<{ data: CrmLeadLossReason[] }>()).data,
  });
}

export function useCreateCrmLeadSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; color?: string | null; is_active?: boolean }) =>
      api.post("crm/sources", { json: payload }).json<{ data: CrmLeadSource }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm", "sources"] }),
  });
}

export function useUpdateCrmLeadSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; name?: string; color?: string | null; is_active?: boolean }) =>
      api.put(`crm/sources/${id}`, { json: payload }).json<{ data: CrmLeadSource }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm", "sources"] }),
  });
}

export function useDeleteCrmLeadSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`crm/sources/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm", "sources"] }),
  });
}

export function useCreateCrmLeadLossReason() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; is_active?: boolean }) =>
      api.post("crm/loss-reasons", { json: payload }).json<{ data: CrmLeadLossReason }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm", "loss-reasons"] }),
  });
}

export function useUpdateCrmLeadLossReason() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; name?: string; is_active?: boolean }) =>
      api.put(`crm/loss-reasons/${id}`, { json: payload }).json<{ data: CrmLeadLossReason }>(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm", "loss-reasons"] }),
  });
}

export function useDeleteCrmLeadLossReason() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`crm/loss-reasons/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["crm", "loss-reasons"] }),
  });
}

export function useCreateCrmLeadInteraction(leadId: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmLeadInteraction }, Error, { type: CrmLeadInteraction["type"]; description: string }>({
    mutationFn: async (payload) =>
      api.post(`crm/leads/${leadId}/interactions`, { json: payload }).json<{ data: CrmLeadInteraction }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "lead", leadId] });
      queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
      toast({ title: "Interação registrada!" });
    },
    onError: () => {
      toast({
        title: "Erro ao registrar interação",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useUploadCrmLeadAttachment(leadId: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmLeadAttachment }, Error, File>({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.set("file", file);
      return api.post(`crm/leads/${leadId}/attachments`, { body: formData }).json<{ data: CrmLeadAttachment }>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "lead", leadId] });
      toast({ title: "Arquivo enviado!" });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar arquivo",
        description: "Ocorreu um erro ao enviar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useCreateCrmTag() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmTag }, Error, { name: string; color?: string | null }>({
    mutationFn: async (payload) => api.post("crm/tags", { json: payload }).json<{ data: CrmTag }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "tags"] });
      toast({ title: "Tag criada!" });
    },
    onError: () => {
      toast({
        title: "Erro ao criar tag",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCrmTag() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmTag }, Error, { id: number; name?: string; color?: string | null }>({
    mutationFn: async ({ id, ...payload }) => api.put(`crm/tags/${id}`, { json: payload }).json<{ data: CrmTag }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "tags"] });
      toast({ title: "Tag atualizada!" });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar tag",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCrmTag() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`crm/tags/${id}`).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "tags"] });
      toast({ title: "Tag excluída!" });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir tag",
        description: "Ocorreu um erro ao excluir. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useCreateCrmPipelineStage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmPipelineStage }, Error, { name: string; color?: string | null; order?: number; is_won?: boolean; is_lost?: boolean }>({
    mutationFn: async (payload) =>
      api.post("crm/pipeline-stages", { json: payload }).json<{ data: CrmPipelineStage }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "pipeline-stages"] });
      toast({ title: "Etapa criada!" });
    },
    onError: () => {
      toast({
        title: "Erro ao criar etapa",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCrmPipelineStage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmPipelineStage }, Error, { id: number; name?: string; color?: string | null; order?: number; is_won?: boolean; is_lost?: boolean }>({
    mutationFn: async ({ id, ...payload }) =>
      api.put(`crm/pipeline-stages/${id}`, { json: payload }).json<{ data: CrmPipelineStage }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "pipeline-stages"] });
      toast({ title: "Etapa atualizada!" });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar etapa",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCrmPipelineStage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`crm/pipeline-stages/${id}`).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "pipeline-stages"] });
      toast({ title: "Etapa excluída!" });
    },
    onError: (err) => {
      const message = err?.message ?? "";
      toast({
        title: "Erro ao excluir etapa",
        description: message || "Ocorreu um erro ao excluir. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useReorderCrmPipelineStages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; order: number }[]>({
    mutationFn: async (stages) => {
      await api.patch("crm/pipeline-stages/reorder", { json: { stages } }).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "pipeline-stages"] });
      toast({ title: "Ordem atualizada!" });
    },
    onError: () => {
      toast({
        title: "Erro ao reordenar etapas",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

// ─── FASE 2: atividades agendadas ─────────────────────────────────────────────

type ActivityListFilters = {
  lead_id?: number;
  responsible_user_id?: number;
  type?: CrmActivityType;
  status?: "pending" | "done" | "overdue";
  date_from?: string;
  date_to?: string;
  order?: "soonest" | "latest" | "recent";
  per_page?: number;
};

const buildActivityQs = (filters?: ActivityListFilters): string => {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.lead_id) params.set("lead_id", String(filters.lead_id));
  if (filters.responsible_user_id) params.set("responsible_user_id", String(filters.responsible_user_id));
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);
  if (filters.order) params.set("order", filters.order);
  if (filters.per_page) params.set("per_page", String(filters.per_page));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export function useCrmLeadActivities(filters?: ActivityListFilters) {
  const qs = buildActivityQs(filters);
  return useQuery({
    queryKey: ["crm", "activities", filters ?? {}],
    queryFn: async () => (await api.get(`crm/activities${qs}`).json<{ data: CrmLeadActivity[] }>()).data,
  });
}

type CreateActivityPayload = {
  lead_id: number;
  type: CrmActivityType;
  title: string;
  description?: string | null;
  scheduled_for: string;
  responsible_user_id?: number | null;
};

type UpdateActivityPayload = Partial<Omit<CreateActivityPayload, "lead_id">>;

export function useCreateCrmLeadActivity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmLeadActivity }, Error, CreateActivityPayload>({
    mutationFn: async (payload) => api.post("crm/activities", { json: payload }).json<{ data: CrmLeadActivity }>(),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "activities"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "lead", payload.lead_id] });
      queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
      toast({ title: "Atividade agendada!" });
    },
    onError: () =>
      toast({
        title: "Erro ao agendar atividade",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      }),
  });
}

export function useUpdateCrmLeadActivity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmLeadActivity }, Error, { id: number; leadId?: number; payload: UpdateActivityPayload }>({
    mutationFn: async ({ id, payload }) =>
      api.put(`crm/activities/${id}`, { json: payload }).json<{ data: CrmLeadActivity }>(),
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "activities"] });
      if (leadId) queryClient.invalidateQueries({ queryKey: ["crm", "lead", leadId] });
      toast({ title: "Atividade atualizada!" });
    },
    onError: () =>
      toast({
        title: "Erro ao atualizar atividade",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      }),
  });
}

export function useDeleteCrmLeadActivity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; leadId?: number }>({
    mutationFn: async ({ id }) => {
      await api.delete(`crm/activities/${id}`).json();
    },
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "activities"] });
      if (leadId) queryClient.invalidateQueries({ queryKey: ["crm", "lead", leadId] });
      toast({ title: "Atividade removida." });
    },
    onError: () =>
      toast({
        title: "Erro ao remover atividade",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      }),
  });
}

export function useMarkDoneCrmLeadActivity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    { data: CrmLeadActivity },
    Error,
    { id: number; leadId?: number; interaction?: { type?: CrmActivityType; description?: string } | null }
  >({
    mutationFn: async ({ id, interaction }) =>
      api
        .post(`crm/activities/${id}/mark-done`, {
          json: interaction ? { interaction } : {},
        })
        .json<{ data: CrmLeadActivity }>(),
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "activities"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
      if (leadId) queryClient.invalidateQueries({ queryKey: ["crm", "lead", leadId] });
      toast({ title: "Atividade concluída!" });
    },
    onError: () =>
      toast({
        title: "Erro ao concluir atividade",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      }),
  });
}

// ─── analytics ────────────────────────────────────────────────────────────────

export type CrmAnalyticsPeriod = "this_month" | "last_7_days" | "last_30_days" | "this_year";

export type CrmFunnelRow = {
  stage_id: number;
  name: string;
  color: string | null;
  order: number;
  is_won: boolean;
  is_lost: boolean;
  count: number;
  value: number;
};

export type CrmConversionRow = {
  stage_id: number;
  name: string;
  order: number;
  entries: number;
  next_stage_id: number | null;
  next_stage_name: string | null;
  next_entries: number | null;
  conversion_rate: number | null;
};

export type CrmBrokerRankingRow = {
  user_id: number;
  name: string;
  total_leads: number;
  won_leads: number;
  lost_leads: number;
  open_leads: number;
  won_value: number;
  conversion_rate: number;
};

export type CrmTimelineRow = {
  date: string;
  created: number;
  won: number;
  lost: number;
};

const buildAnalyticsQuery = (period?: CrmAnalyticsPeriod, from?: string, to?: string) => {
  const params = new URLSearchParams();
  if (period) params.set("period", period);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const q = params.toString();
  return q ? `?${q}` : "";
};

export function useCrmFunnel(period: CrmAnalyticsPeriod = "this_month") {
  return useQuery({
    queryKey: ["crm", "analytics", "funnel", period],
    queryFn: async () =>
      api.get(`crm/analytics/funnel${buildAnalyticsQuery(period)}`).json<{
        data: { period: { from: string; to: string }; stages: CrmFunnelRow[] };
      }>(),
    select: (r) => r.data,
  });
}

export function useCrmConversion(period: CrmAnalyticsPeriod = "this_month") {
  return useQuery({
    queryKey: ["crm", "analytics", "conversion", period],
    queryFn: async () =>
      api.get(`crm/analytics/conversion${buildAnalyticsQuery(period)}`).json<{
        data: { period: { from: string; to: string }; rows: CrmConversionRow[] };
      }>(),
    select: (r) => r.data,
  });
}

export function useCrmBrokerRanking(period: CrmAnalyticsPeriod = "this_month") {
  return useQuery({
    queryKey: ["crm", "analytics", "broker-ranking", period],
    queryFn: async () =>
      api.get(`crm/analytics/broker-ranking${buildAnalyticsQuery(period)}`).json<{
        data: { period: { from: string; to: string }; rows: CrmBrokerRankingRow[] };
      }>(),
    select: (r) => r.data,
  });
}

export function useCrmTimeline(period: CrmAnalyticsPeriod = "this_month") {
  return useQuery({
    queryKey: ["crm", "analytics", "timeline", period],
    queryFn: async () =>
      api.get(`crm/analytics/timeline${buildAnalyticsQuery(period)}`).json<{
        data: { period: { from: string; to: string }; rows: CrmTimelineRow[] };
      }>(),
    select: (r) => r.data,
  });
}

// ─── lead properties ──────────────────────────────────────────────────────────

export type LeadProperty = {
  id: number;
  code: string | null;
  title: string | null;
  street: string | null;
  neighborhood: string | null;
  bedrooms: number | null;
  garages: number | null;
  size: string | null;
  value: string | null;
  rent: boolean | null;
  sale: boolean | null;
  active: boolean;
  pivot?: { interest_type: string | null; notes: string | null; created_at: string | null } | null;
};

export function useLeadProperties(leadId: number | null) {
  return useQuery({
    queryKey: ["crm", "lead", leadId, "properties"],
    queryFn: async () =>
      api.get(`crm/leads/${leadId}/properties`).json<{ data: LeadProperty[] }>(),
    enabled: !!leadId,
    select: (r) => r.data,
  });
}

export function useAttachLeadProperty() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    { data: LeadProperty },
    Error,
    { leadId: number; property_id: number; interest_type?: string; notes?: string }
  >({
    mutationFn: async ({ leadId, ...payload }) =>
      api.post(`crm/leads/${leadId}/properties`, { json: payload }).json<{ data: LeadProperty }>(),
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "lead", leadId] });
      queryClient.invalidateQueries({ queryKey: ["crm", "lead", leadId, "properties"] });
      toast({ title: "Imóvel vinculado ao lead." });
    },
    onError: () =>
      toast({
        title: "Erro ao vincular imóvel",
        description: "Tente novamente.",
        variant: "destructive",
      }),
  });
}

export function useDetachLeadProperty() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, { leadId: number; propertyId: number }>({
    mutationFn: async ({ leadId, propertyId }) =>
      api.delete(`crm/leads/${leadId}/properties/${propertyId}`).json(),
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "lead", leadId] });
      queryClient.invalidateQueries({ queryKey: ["crm", "lead", leadId, "properties"] });
      toast({ title: "Imóvel desvinculado." });
    },
    onError: () =>
      toast({
        title: "Erro ao desvincular",
        description: "Tente novamente.",
        variant: "destructive",
      }),
  });
}

export function useReopenCrmLeadActivity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: CrmLeadActivity }, Error, { id: number; leadId?: number }>({
    mutationFn: async ({ id }) =>
      api.post(`crm/activities/${id}/reopen`).json<{ data: CrmLeadActivity }>(),
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "activities"] });
      if (leadId) queryClient.invalidateQueries({ queryKey: ["crm", "lead", leadId] });
      toast({ title: "Atividade reaberta." });
    },
    onError: () =>
      toast({
        title: "Erro ao reabrir atividade",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      }),
  });
}
