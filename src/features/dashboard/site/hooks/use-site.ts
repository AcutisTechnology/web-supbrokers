import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  StoreSiteSocialLinkPayload,
  UpdateSiteFooterPayload,
  UpdateSiteSettingPayload,
  UpdateSiteSocialLinkPayload,
  createSiteSocialLink,
  deleteSiteSocialLink,
  fetchSiteFooter,
  fetchSiteSettings,
  fetchSiteSocialLinks,
  updateSiteFooter,
  updateSiteSettings,
  updateSiteSocialLink,
} from "../services/site-service";

const KEYS = {
  settings: ["site", "settings"] as const,
  footer: ["site", "footer"] as const,
  socialLinks: ["site", "social-links"] as const,
};

export function useSiteSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: KEYS.settings,
    queryFn: fetchSiteSettings,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateSiteSettingPayload) => updateSiteSettings(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(KEYS.settings, data);
      toast.success("Aparência atualizada com sucesso");
    },
    onError: () => {
      toast.error("Não foi possível atualizar a aparência");
    },
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

export function useSiteFooter() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: KEYS.footer,
    queryFn: fetchSiteFooter,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateSiteFooterPayload) => updateSiteFooter(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(KEYS.footer, data);
      toast.success("Rodapé atualizado com sucesso");
    },
    onError: () => {
      toast.error("Não foi possível atualizar o rodapé");
    },
  });

  return {
    footer: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

export function useSiteSocialLinks() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: KEYS.socialLinks,
    queryFn: fetchSiteSocialLinks,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: KEYS.socialLinks });

  const createMutation = useMutation({
    mutationFn: (payload: StoreSiteSocialLinkPayload) => createSiteSocialLink(payload),
    onSuccess: () => {
      invalidate();
      toast.success("Rede social adicionada");
    },
    onError: () => toast.error("Não foi possível adicionar a rede social"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSiteSocialLinkPayload }) =>
      updateSiteSocialLink(id, payload),
    onSuccess: () => {
      invalidate();
      toast.success("Rede social atualizada");
    },
    onError: () => toast.error("Não foi possível atualizar a rede social"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSiteSocialLink(id),
    onSuccess: () => {
      invalidate();
      toast.success("Rede social removida");
    },
    onError: () => toast.error("Não foi possível remover a rede social"),
  });

  return {
    socialLinks: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    remove: deleteMutation.mutateAsync,
    isRemoving: deleteMutation.isPending,
  };
}
