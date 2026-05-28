import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast";

export interface HomeSection {
  key: string;
  enabled: boolean;
}

export const HOME_SECTION_LABELS: Record<string, { label: string; description: string }> = {
  destaques: { label: "Imóveis em destaque", description: "Carrossel dos imóveis destacados" },
  venda: { label: "À venda", description: "Carrossel de imóveis para compra" },
  aluguel: { label: "Para alugar", description: "Carrossel de imóveis para locação" },
  stats: { label: "Estatísticas", description: "Faixa de números da imobiliária" },
  regioes: { label: "Regiões / Bairros", description: "Os melhores endereços" },
  institucional: { label: "Sobre (institucional)", description: "Seção com história e diferenciais" },
  equipe: { label: "Equipe", description: "Prévia dos corretores" },
  depoimentos: { label: "Depoimentos", description: "Slider de avaliações de clientes" },
  blog: { label: "Blog", description: "Artigos e novidades" },
};

type ResourceResponse<T> = { data: T };

const QUERY_KEY = ["site", "home-layout"] as const;

export async function fetchHomeLayout(): Promise<HomeSection[]> {
  const response = await api.get("site/home-layout").json<ResourceResponse<HomeSection[]>>();
  return response.data;
}

export async function updateHomeLayout(sections: HomeSection[]): Promise<HomeSection[]> {
  const response = await api
    .put("site/home-layout", { json: { sections } })
    .json<ResourceResponse<HomeSection[]>>();
  return response.data;
}

export function useHomeLayout() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({ queryKey: QUERY_KEY, queryFn: fetchHomeLayout });

  const save = useMutation({
    mutationFn: updateHomeLayout,
    onSuccess: () => {
      toast({ title: "Layout da home atualizado." });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => toast({ title: "Erro ao salvar layout", variant: "destructive" }),
  });

  return {
    sections: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    save: save.mutateAsync,
    isSaving: save.isPending,
  };
}
