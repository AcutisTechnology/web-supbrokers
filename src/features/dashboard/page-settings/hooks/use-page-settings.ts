import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updatePageSettings } from '../services/page-settings-service';
import { useToast } from '@/hooks/use-toast';

export function usePageSettings() {
  const { toast } = useToast();
  
  // Mutation para atualizar as configurações
  const updateMutation = useMutation({
    mutationFn: updatePageSettings,
    onSuccess: () => {
      toast({
        title: 'Configurações salvas',
        description: 'As configurações da sua página foram atualizadas com sucesso.',
        variant: 'default',
      });
    },
    onError: () => {
      toast({
        title: 'Erro ao salvar configurações',
        description: 'Ocorreu um erro ao atualizar as configurações. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
  
  return {
    updateSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
} 