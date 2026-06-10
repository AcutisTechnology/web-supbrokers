import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast";

export interface WhatsappTemplateItem {
  key: string;
  label: string;
  placeholders: string[];
  default_message: string;
  message: string;
  is_active: boolean;
}

type ResourceResponse<T> = { data: T };

const QUERY_KEY = ["site", "whatsapp-templates"] as const;

export async function fetchWhatsappTemplates(): Promise<WhatsappTemplateItem[]> {
  const response = await api
    .get("site/whatsapp-templates")
    .json<ResourceResponse<WhatsappTemplateItem[]>>();
  return response.data;
}

export async function bulkUpdateWhatsappTemplates(
  items: { key: string; message: string; is_active?: boolean }[]
): Promise<void> {
  await api.put("site/whatsapp-templates", { json: { items } });
}

export async function resetWhatsappTemplate(key: string): Promise<void> {
  await api.post(`site/whatsapp-templates/${key}/reset`);
}

export function useWhatsappTemplates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: QUERY_KEY, queryFn: fetchWhatsappTemplates });

  const save = useMutation({
    mutationFn: bulkUpdateWhatsappTemplates,
    onSuccess: () => {
      toast({ title: "Mensagens atualizadas." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () =>
      toast({ title: "Erro ao salvar mensagens", variant: "destructive" }),
  });

  const reset = useMutation({
    mutationFn: resetWhatsappTemplate,
    onSuccess: () => {
      toast({ title: "Mensagem restaurada para o padrão." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () =>
      toast({ title: "Erro ao restaurar mensagem", variant: "destructive" }),
  });

  return {
    templates: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    save: save.mutateAsync,
    reset: reset.mutateAsync,
    isSaving: save.isPending,
    isResetting: reset.isPending,
  };
}
