import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast";

export interface InstitutionalDifferential {
  icon: string;
  title: string;
  text: string;
}

export interface SiteInstitutional {
  id: number | null;
  eyebrow: string | null;
  title: string | null;
  body: string | null;
  image_url: string | null;
  values: string[];
  differentials: InstitutionalDifferential[];
  is_active: boolean;
}

export interface SiteInstitutionalPayload {
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  image_url?: string | null;
  values?: string[];
  differentials?: InstitutionalDifferential[];
  is_active?: boolean;
}

type ResourceResponse<T> = { data: T };

const QUERY_KEY = ["site", "institutional"] as const;

export async function fetchInstitutional(): Promise<SiteInstitutional> {
  const response = await api.get("site/institutional").json<ResourceResponse<SiteInstitutional>>();
  return response.data;
}

export async function updateInstitutional(
  payload: SiteInstitutionalPayload
): Promise<SiteInstitutional> {
  const response = await api
    .put("site/institutional", { json: payload })
    .json<ResourceResponse<SiteInstitutional>>();
  return response.data;
}

export function useInstitutional() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: QUERY_KEY, queryFn: fetchInstitutional });

  const save = useMutation({
    mutationFn: updateInstitutional,
    onSuccess: () => {
      toast({ title: "Seção institucional atualizada." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () =>
      toast({ title: "Erro ao salvar seção institucional", variant: "destructive" }),
  });

  return {
    institutional: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    save: save.mutateAsync,
    isSaving: save.isPending,
  };
}
