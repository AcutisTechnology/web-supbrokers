import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";

// ── Types ─────────────────────────────────────────────────────────────────────

export type BlastCampaignStatus = "draft" | "running" | "paused" | "completed" | "failed";

export type BlastCampaignAction = {
  id: number;
  sort_order: number;
  kind: "text" | "image" | "video" | "audio" | "document";
  message: string | null;
  file_path: string | null;
  file_name: string | null;
  typing_seconds: number;
  wait_next_seconds: number;
  unique_image_preview: boolean;
};

export type BlastCampaign = {
  id: number;
  name: string;
  status: BlastCampaignStatus;
  interval_seconds: number;
  pause_every_contacts: number;
  pause_seconds: number;
  disable_signature: boolean;
  custom_signature_name: boolean;
  signature_name: string | null;
  contacts_total: number;
  contacts_processed: number;
  contacts_sent: number;
  contacts_failed: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  whatsapp_instance: { id: number; display_name: string; status: string } | null;
  actions?: BlastCampaignAction[];
};

export type BlastCampaignProgress = {
  status: BlastCampaignStatus;
  contacts_total: number;
  contacts_processed: number;
  contacts_sent: number;
  contacts_failed: number;
  started_at: string | null;
  completed_at: string | null;
};

export type BlastContact = {
  id: string;
  name: string;
  phone: string;
  type: string;
  crm_lead_id?: number | null;
};

export type BlastMediaUploadResult = {
  file_path: string;
  file_name: string;
  url: string;
};

export type CreateBlastCampaignPayload = {
  name: string;
  whatsapp_instance_id: number | null;
  interval_seconds: number;
  pause_every_contacts: number;
  pause_seconds: number;
  disable_signature: boolean;
  custom_signature_name: boolean;
  signature_name: string | null;
  contacts: { name: string; phone: string; crm_lead_id?: number | null }[];
  actions: {
    kind: string;
    message: string | null;
    file_path: string | null;
    file_name: string | null;
    typing_seconds: number;
    wait_next_seconds: number;
    unique_image_preview: boolean;
  }[];
};

// ── Queries ───────────────────────────────────────────────────────────────────

export function useBlastCampaigns() {
  return useQuery({
    queryKey: ["blast", "campaigns"],
    queryFn: () =>
      api.get("blast/campaigns").json<{ data: BlastCampaign[] }>().then((r) => r.data),
  });
}

export function useBlastCampaign(id: number | null) {
  return useQuery({
    queryKey: ["blast", "campaigns", id],
    queryFn: () =>
      api.get(`blast/campaigns/${id}`).json<{ data: BlastCampaign }>().then((r) => r.data),
    enabled: id !== null,
  });
}

/**
 * Polling de progresso durante o envio da campanha.
 * Refetch a cada 3s enquanto status = 'running'.
 * Para automaticamente quando concluído/pausado/falhou.
 */
export function useBlastCampaignProgress(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["blast", "progress", id],
    queryFn: () => api.get(`blast/campaigns/${id}/progress`).json<BlastCampaignProgress>(),
    enabled: enabled && id !== null,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "running" ? 3_000 : false;
    },
    staleTime: 0,
    gcTime: 0,
  });
}

/**
 * Retorna leads do CRM com telefone cadastrado para seleção na campanha.
 */
export function useBlastCrmContacts() {
  return useQuery({
    queryKey: ["blast", "crm-contacts"],
    queryFn: () =>
      api.get("blast/contacts/from-crm").json<{ data: BlastContact[] }>().then((r) => r.data),
    staleTime: 5 * 60_000, // cache 5 min
  });
}

/**
 * Retorna leads de estágios específicos do CRM para seleção na campanha.
 */
export function useBlastCrmContactsByStages(stageIds: number[]) {
  const key = [...stageIds].sort().join(",");
  return useQuery({
    queryKey: ["blast", "crm-contacts-stages", key],
    queryFn: () =>
      api
        .get("crm/leads", { searchParams: { pipeline_stage_ids: key, per_page: "500" } })
        .json<{ data: { id: number; name: string; phone: string }[] }>()
        .then((r) =>
          r.data
            .filter((lead) => lead.phone)
            .map(
              (lead): BlastContact => ({
                id: String(lead.id),
                name: lead.name,
                phone: lead.phone,
                type: "Lead",
                crm_lead_id: lead.id,
              })
            )
        ),
    enabled: stageIds.length > 0,
    staleTime: 30_000,
  });
}

/**
 * Busca leads do CRM por nome, telefone ou e-mail (server-side).
 * Habilitado apenas quando `search` é não-vazio.
 */
export function useBlastCrmContactsSearch(search: string) {
  const trimmed = search.trim();
  return useQuery({
    queryKey: ["blast", "crm-contacts-search", trimmed],
    queryFn: () =>
      api
        .get("crm/leads", { searchParams: { search: trimmed, per_page: "100" } })
        .json<{ data: { id: number; name: string; phone: string }[] }>()
        .then((r) =>
          r.data.map(
            (lead): BlastContact => ({
              id: String(lead.id),
              name: lead.name,
              phone: lead.phone,
              type: "Lead",
              crm_lead_id: lead.id,
            })
          )
        ),
    enabled: trimmed.length > 0,
    staleTime: 30_000,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateBlastCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBlastCampaignPayload) =>
      api
        .post("blast/campaigns", { json: payload })
        .json<{ data: BlastCampaign }>()
        .then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blast", "campaigns"] }),
  });
}

export function useStartBlastCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.post(`blast/campaigns/${id}/start`).json<{ message: string; status: string }>(),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["blast", "campaigns"] });
      qc.invalidateQueries({ queryKey: ["blast", "progress", id] });
    },
  });
}

export function usePauseBlastCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.post(`blast/campaigns/${id}/pause`).json<{ message: string; status: string }>(),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["blast", "campaigns"] });
      qc.invalidateQueries({ queryKey: ["blast", "progress", id] });
    },
  });
}

export function useDeleteBlastCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`blast/campaigns/${id}`).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blast", "campaigns"] }),
  });
}

/**
 * Upload temporário de mídia (antes da campanha ser criada).
 * O file_path retornado é incluído na payload de criação da campanha.
 */
export function useUploadBlastMedia() {
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return api.post("blast/media/upload", { body: form }).json<BlastMediaUploadResult>();
    },
  });
}

/**
 * Parse de planilha CSV/XLSX e retorna lista de contatos.
 */
export function useImportBlastSpreadsheet() {
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return api
        .post("blast/contacts/import-spreadsheet", { body: form })
        .json<{ data: BlastContact[]; total: number }>();
    },
  });
}
