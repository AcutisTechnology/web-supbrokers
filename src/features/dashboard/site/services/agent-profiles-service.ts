import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast";

export const AGENT_SPECIALTY_OPTIONS = [
  { value: "luxo", label: "Luxo" },
  { value: "lancamentos", label: "Lançamentos" },
  { value: "investimento", label: "Investimento" },
  { value: "destaque", label: "Destaque" },
] as const;

export interface AgentProfile {
  id: number;
  slug: string;
  name: string;
  role_title: string | null;
  creci: string | null;
  specialty: string | null;
  mini_bio: string | null;
  full_bio: string | null;
  photo_url: string | null;
  banner_url: string | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  city: string | null;
  neighborhoods: string[];
  specialties: string[];
  languages: string[];
  years_experience: number | null;
  is_featured: boolean;
  is_public: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AgentProfilePayload {
  name: string;
  role_title?: string | null;
  creci?: string | null;
  specialty?: string | null;
  mini_bio?: string | null;
  full_bio?: string | null;
  photo_url?: string | null;
  banner_url?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
  email?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  city?: string | null;
  neighborhoods?: string[];
  specialties?: string[];
  languages?: string[];
  years_experience?: number | null;
  is_featured?: boolean;
  is_public?: boolean;
  sort_order?: number;
}

type ResourceResponse<T> = { data: T };

const QUERY_KEY = ["site", "agents"] as const;

export async function fetchAgentProfiles(): Promise<AgentProfile[]> {
  const response = await api.get("site/agents").json<ResourceResponse<AgentProfile[]>>();
  return response.data;
}

export async function createAgentProfile(payload: AgentProfilePayload): Promise<AgentProfile> {
  const response = await api
    .post("site/agents", { json: payload })
    .json<ResourceResponse<AgentProfile>>();
  return response.data;
}

export async function updateAgentProfile(
  id: number,
  payload: AgentProfilePayload
): Promise<AgentProfile> {
  const response = await api
    .put(`site/agents/${id}`, { json: payload })
    .json<ResourceResponse<AgentProfile>>();
  return response.data;
}

export async function deleteAgentProfile(id: number): Promise<void> {
  await api.delete(`site/agents/${id}`);
}

export async function reorderAgentProfiles(
  items: { id: number; sort_order: number }[]
): Promise<void> {
  await api.post("site/agents/reorder", { json: { items } });
}

/* ---------------- React Query hooks ---------------- */

export function useAgentProfiles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchAgentProfiles,
  });

  const create = useMutation({
    mutationFn: createAgentProfile,
    onSuccess: () => {
      toast({ title: "Corretor cadastrado com sucesso." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => {
      toast({
        title: "Erro ao cadastrar corretor",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AgentProfilePayload }) =>
      updateAgentProfile(id, payload),
    onSuccess: () => {
      toast({ title: "Corretor atualizado com sucesso." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar corretor",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    },
  });

  const remove = useMutation({
    mutationFn: deleteAgentProfile,
    onSuccess: () => {
      toast({ title: "Corretor removido." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => {
      toast({
        title: "Erro ao remover corretor",
        variant: "destructive",
      });
    },
  });

  const reorder = useMutation({
    mutationFn: reorderAgentProfiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    agents: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    create: create.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,
    reorder: reorder.mutateAsync,
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isRemoving: remove.isPending,
    isReordering: reorder.isPending,
  };
}
