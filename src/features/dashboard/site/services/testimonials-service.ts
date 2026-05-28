import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast";

export interface SiteTestimonial {
  id: number;
  name: string;
  role: string | null;
  avatar_url: string | null;
  rating: number;
  message: string;
  is_active: boolean;
  sort_order: number;
}

export interface SiteTestimonialPayload {
  name: string;
  role?: string | null;
  avatar_url?: string | null;
  rating?: number;
  message: string;
  is_active?: boolean;
  sort_order?: number;
}

type ResourceResponse<T> = { data: T };

const QUERY_KEY = ["site", "testimonials"] as const;

export async function fetchTestimonials(): Promise<SiteTestimonial[]> {
  const response = await api.get("site/testimonials").json<ResourceResponse<SiteTestimonial[]>>();
  return response.data;
}

export async function createTestimonial(payload: SiteTestimonialPayload): Promise<SiteTestimonial> {
  const response = await api
    .post("site/testimonials", { json: payload })
    .json<ResourceResponse<SiteTestimonial>>();
  return response.data;
}

export async function updateTestimonial(
  id: number,
  payload: SiteTestimonialPayload
): Promise<SiteTestimonial> {
  const response = await api
    .put(`site/testimonials/${id}`, { json: payload })
    .json<ResourceResponse<SiteTestimonial>>();
  return response.data;
}

export async function deleteTestimonial(id: number): Promise<void> {
  await api.delete(`site/testimonials/${id}`);
}

export async function reorderTestimonials(
  items: { id: number; sort_order: number }[]
): Promise<void> {
  await api.post("site/testimonials/reorder", { json: { items } });
}

export function useTestimonials() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: QUERY_KEY, queryFn: fetchTestimonials });

  const create = useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      toast({ title: "Depoimento adicionado." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast({ title: "Erro ao adicionar depoimento", variant: "destructive" }),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SiteTestimonialPayload }) =>
      updateTestimonial(id, payload),
    onSuccess: () => {
      toast({ title: "Depoimento atualizado." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast({ title: "Erro ao atualizar depoimento", variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      toast({ title: "Depoimento removido." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast({ title: "Erro ao remover depoimento", variant: "destructive" }),
  });

  const reorder = useMutation({
    mutationFn: reorderTestimonials,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return {
    testimonials: query.data ?? [],
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
