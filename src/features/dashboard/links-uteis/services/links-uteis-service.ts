import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast";

export type LinkUtil = {
  id: number;
  titulo: string;
  descricao: string;
  url: string;
  categoria: string | null;
  ordem: number;
  created_at: string;
  updated_at: string;
};

export type LinkUtilFilters = {
  categoria?: string;
};

const buildQueryString = (filters?: LinkUtilFilters) => {
  if (!filters?.categoria || !filters.categoria.trim()) return "";
  const params = new URLSearchParams();
  params.set("categoria", filters.categoria.trim());
  return `?${params.toString()}`;
};

export function useLinksUteis(filters?: LinkUtilFilters) {
  const qs = buildQueryString(filters);

  return useQuery({
    queryKey: ["links-uteis", filters ?? {}],
    queryFn: async () => {
      const response = await api.get(`links${qs}`).json<{ data: LinkUtil[] }>();
      return response.data ?? [];
    },
  });
}

type LinkUtilPayload = {
  titulo: string;
  descricao: string;
  url: string;
  categoria?: string | null;
  ordem?: number;
};

export function useCreateLinkUtil() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: LinkUtil }, Error, LinkUtilPayload>({
    mutationFn: async (payload) => api.post("links", { json: payload }).json<{ data: LinkUtil }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links-uteis"] });
      toast({ title: "Link criado com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao criar link",
        description: "Verifique os campos e tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateLinkUtil(id: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ data: LinkUtil }, Error, LinkUtilPayload>({
    mutationFn: async (payload) => api.put(`links/${id}`, { json: payload }).json<{ data: LinkUtil }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links-uteis"] });
      toast({ title: "Link atualizado com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar link",
        description: "Verifique os campos e tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteLinkUtil() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await api.delete(`links/${id}`).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links-uteis"] });
      toast({ title: "Link excluído com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir link",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });
}

