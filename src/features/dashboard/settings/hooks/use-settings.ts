import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getUserSettings, updateUserSettings, type UpdateUserSettingsPayload } from "../services/settings-service";

export function useSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["user-settings"],
    queryFn: getUserSettings,
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateUserSettingsPayload) => updateUserSettings(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-settings"] });
      toast({
        title: "Configurações salvas",
        description: "As alterações foram persistidas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar configurações",
        description: "Não foi possível persistir as alterações. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    ...query,
    updateSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
