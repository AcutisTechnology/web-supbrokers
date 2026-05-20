import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  StoreSitePagePayload,
  UpdateSitePagePayload,
  createSitePage,
  deleteSitePage,
  fetchSitePages,
  setSitePageAsHome,
  toggleSitePagePublish,
  updateSitePage,
} from "../services/site-pages-service";

const KEY = ["site", "pages"] as const;

export function useSitePages() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: KEY,
    queryFn: fetchSitePages,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: KEY });

  const createMutation = useMutation({
    mutationFn: (payload: StoreSitePagePayload) => createSitePage(payload),
    onSuccess: () => {
      invalidate();
      toast.success("Página criada com sucesso");
    },
    onError: () => toast.error("Não foi possível criar a página"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSitePagePayload }) =>
      updateSitePage(id, payload),
    onSuccess: () => {
      invalidate();
      toast.success("Página atualizada");
    },
    onError: () => toast.error("Não foi possível atualizar a página"),
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => deleteSitePage(id),
    onSuccess: () => {
      invalidate();
      toast.success("Página removida");
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { json?: () => Promise<{ message?: string }> } })?.response?.json
          ? "Não foi possível remover a página"
          : "Não foi possível remover a página";
      toast.error(message);
    },
  });

  const setHomeMutation = useMutation({
    mutationFn: (id: number) => setSitePageAsHome(id),
    onSuccess: () => {
      invalidate();
      toast.success("Página definida como home");
    },
    onError: () => toast.error("Não foi possível definir como home"),
  });

  const publishMutation = useMutation({
    mutationFn: (id: number) => toggleSitePagePublish(id),
    onSuccess: () => {
      invalidate();
      toast.success("Status de publicação atualizado");
    },
    onError: () => toast.error("Não foi possível alterar a publicação"),
  });

  return {
    pages: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    remove: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
    setHome: setHomeMutation.mutateAsync,
    isSettingHome: setHomeMutation.isPending,
    togglePublish: publishMutation.mutateAsync,
    isTogglingPublish: publishMutation.isPending,
  };
}
