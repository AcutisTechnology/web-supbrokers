import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";

export type WhatsappInstanceStatus = "connecting" | "connected" | "disconnected";

export type WhatsappInstance = {
  id: number;
  display_name: string;
  status: WhatsappInstanceStatus;
  phone: string | null;
  created_at: string;
};

export type WhatsappInstanceQr = {
  status: string;
  base64: string | null; // campo `code` da Evolution API v2 (pode ser string QR ou null)
};

export type WhatsappInstanceStatusResponse = {
  id: number;
  status: WhatsappInstanceStatus;
  phone: string | null;
};

// ── Queries ──────────────────────────────────────────────────────────────────

export function useWhatsappInstances() {
  return useQuery({
    queryKey: ["whatsapp", "instances"],
    queryFn: () => api.get("whatsapp/instances").json<{ data: WhatsappInstance[] }>().then((r) => r.data),
  });
}

/**
 * Busca o QR Code da instância. Faz refetch a cada 4s enquanto ativo
 * (o QR expira em ~45s e a Evolution gera um novo automaticamente).
 */
export function useWhatsappInstanceQr(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["whatsapp", "instance-qr", id],
    queryFn: async () => {
      console.log(`[WhatsApp QR] Polling QR for instance ${id}...`);
      const result = await api.get(`whatsapp/instances/${id}/qr`).json<WhatsappInstanceQr>();
      console.log(`[WhatsApp QR] Response:`, {
        status: result.status,
        base64_is_null: result.base64 === null,
        base64_preview: result.base64 ? result.base64.substring(0, 50) : null,
      });
      return result;
    },
    enabled: enabled && id !== null,
    refetchInterval: 4_000,
    staleTime: 0,
    gcTime: 0,
  });
}

/**
 * Polls o status da instância a cada 3s enquanto ativo.
 * O frontend usa isso para saber quando o QR foi escaneado (status → 'connected').
 */
export function useWhatsappInstanceStatus(id: number | null, enabled: boolean) {
  return useQuery({
    queryKey: ["whatsapp", "instance-status", id],
    queryFn: async () => {
      const result = await api.get(`whatsapp/instances/${id}/status`).json<WhatsappInstanceStatusResponse>();
      console.log(`[WhatsApp Status] Instance ${id}:`, result.status);
      return result;
    },
    enabled: enabled && id !== null,
    refetchInterval: 3_000,
    staleTime: 0,
    gcTime: 0,
  });
}

// ── Mutations ────────────────────────────────────────────────────────────────

export function useCreateWhatsappInstance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (displayName: string) =>
      api
        .post("whatsapp/instances", { json: { display_name: displayName } })
        .json<{ data: WhatsappInstance }>()
        .then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whatsapp", "instances"] }),
  });
}

export function useDeleteWhatsappInstance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`whatsapp/instances/${id}`).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whatsapp", "instances"] }),
  });
}
