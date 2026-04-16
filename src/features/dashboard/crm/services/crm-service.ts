import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast";

export type CrmPipelineStage = {
  id: number;
  name: string;
  order: number;
  color: string | null;
  is_default: boolean;
  leads_count?: number;
};

export type CrmTag = {
  id: number;
  name: string;
  color: string | null;
};

export type CrmLead = {
  id: number;
  name: string;
  phone: string;
  source: string | null;
  status: "open" | "won" | "lost";
  priority: 1 | 2 | 3;
  value: string | null;
  pipeline_stage_id: number;
  pipeline_stage?: { id: number; name: string; order: number; color: string | null } | null;
  assigned_user_id: number | null;
  assigned_user?: { id: number; name: string } | null;
  tags?: CrmTag[];
  notes?: string | null;
  created_at: string;
  updated_at: string;
  last_interaction_at: string | null;
  next_follow_up_at: string | null;
  days_without_contact?: number | null;
  is_hot?: boolean;
};

export type CrmLeadInteraction = {
  id: number;
  type: "call" | "whatsapp" | "note" | "email";
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

export type CrmLeadDetail = CrmLead & {
  interactions: CrmLeadInteraction[];
  stage_movements: CrmLeadStageMovement[];
  attachments: CrmLeadAttachment[];
};

export type CrmMetrics = {
  total_leads: number;
  total_value: number;
  won_leads: number;
  conversion_rate: number;
};

export type CrmLeadsFilters = {
  search?: string;
  status?: "open" | "won" | "lost" | "all";
  assigned_user_id?: number | "all";
  tag_ids?: number[];
  period?: "this_month" | "last_7_days" | "last_30_days" | "all";
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

  if (filters.period && filters.period !== "all") params.set("period", filters.period);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.direction) params.set("direction", filters.direction);

  if (filters.tag_ids && filters.tag_ids.length > 0) params.set("tag_ids", filters.tag_ids.join(","));

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
  source?: string | null;
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

  return useMutation<{ data: CrmLead }, Error, number>({
    mutationFn: async (id) => api.post(`crm/leads/${id}/mark-lost`).json<{ data: CrmLead }>(),
    onSuccess: (_, id) => {
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

  return useMutation<{ data: CrmPipelineStage }, Error, { name: string; color?: string | null; order?: number }>({
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

  return useMutation<{ data: CrmPipelineStage }, Error, { id: number; name?: string; color?: string | null; order?: number }>({
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
