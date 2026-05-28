import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast";

export const SITE_STAT_ICONS = [
  "Award",
  "Building2",
  "Crown",
  "Users",
  "Sparkles",
  "ShieldCheck",
  "TrendingUp",
  "Home",
  "Star",
  "Heart",
] as const;
export type SiteStatIcon = (typeof SITE_STAT_ICONS)[number];

export interface SiteStat {
  id: number;
  label: string;
  value: number;
  prefix: string | null;
  suffix: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteStatPayload {
  label: string;
  value: number;
  prefix?: string | null;
  suffix?: string | null;
  icon?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

type ResourceResponse<T> = { data: T };

const QUERY_KEY = ["site", "stats"] as const;

export async function fetchSiteStats(): Promise<SiteStat[]> {
  const response = await api.get("site/stats").json<ResourceResponse<SiteStat[]>>();
  return response.data;
}

export async function createSiteStat(payload: SiteStatPayload): Promise<SiteStat> {
  const response = await api
    .post("site/stats", { json: payload })
    .json<ResourceResponse<SiteStat>>();
  return response.data;
}

export async function updateSiteStat(id: number, payload: SiteStatPayload): Promise<SiteStat> {
  const response = await api
    .put(`site/stats/${id}`, { json: payload })
    .json<ResourceResponse<SiteStat>>();
  return response.data;
}

export async function deleteSiteStat(id: number): Promise<void> {
  await api.delete(`site/stats/${id}`);
}

export async function reorderSiteStats(items: { id: number; sort_order: number }[]): Promise<void> {
  await api.post("site/stats/reorder", { json: { items } });
}

export function useSiteStats() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: QUERY_KEY, queryFn: fetchSiteStats });

  const create = useMutation({
    mutationFn: createSiteStat,
    onSuccess: () => {
      toast({ title: "Estatística adicionada." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast({ title: "Erro ao adicionar estatística", variant: "destructive" }),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SiteStatPayload }) =>
      updateSiteStat(id, payload),
    onSuccess: () => {
      toast({ title: "Estatística atualizada." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast({ title: "Erro ao atualizar estatística", variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: deleteSiteStat,
    onSuccess: () => {
      toast({ title: "Estatística removida." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast({ title: "Erro ao remover estatística", variant: "destructive" }),
  });

  const reorder = useMutation({
    mutationFn: reorderSiteStats,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return {
    stats: query.data ?? [],
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
