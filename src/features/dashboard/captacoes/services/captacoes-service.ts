import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/shared/configs/api";
import { useToast } from "@/hooks/use-toast";
import { CaptacaoFormValues } from "../schemas/captacao-schema";

export type Captacao = {
  id: number;
  builder?: { id: number; name: string } | null;
  city_ref?: { id: number; name: string } | null;
  neighborhood_ref?: { id: number; name: string } | null;
  building_name: string;
  min_size?: number | null;
  max_size?: number | null;
  min_value?: number | null;
  max_value?: number | null;
  status?: string | null;
  drive_url?: string | null;
  description?: string | null;
  created_at: string;
};

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

type CaptacaoPayload = {
  building_name: string;
  builder_id?: number | null;
  builder_name?: string | null;
  city_id?: number | null;
  city?: string | null;
  neighborhood_id?: number | null;
  neighborhood?: string | null;
  min_size?: number | null;
  max_size?: number | null;
  min_value?: number | null;
  max_value?: number | null;
  status?: string | null;
  drive_url?: string | null;
  description?: string | null;
};

const toPayload = (data: CaptacaoFormValues): CaptacaoPayload => {
  const builder = data.builder;
  const city = data.city;
  const neighborhood = data.neighborhood;

  return {
    building_name: data.building_name.trim(),
    builder_id: builder?.id ?? null,
    builder_name: builder?.id ? null : builder?.name?.trim() || null,
    city_id: city?.id ?? null,
    city: city?.id ? null : city?.name?.trim() || null,
    neighborhood_id: neighborhood?.id ?? null,
    neighborhood: neighborhood?.name?.trim() || null,
    min_size: data.min_size ?? null,
    max_size: data.max_size ?? null,
    min_value: data.min_value ?? null,
    max_value: data.max_value ?? null,
    status: data.status?.trim() || null,
    drive_url: data.drive_url?.trim() || null,
    description: data.description?.trim() || null,
  };
};

export type CaptacoesFilters = {
  search?: string;
  builder?: { id: number | null; name: string };
  city?: { id: number | null; name: string };
  neighborhood?: { id: number | null; name: string };
  min_value?: number | null;
  max_value?: number | null;
  min_size?: number | null;
  max_size?: number | null;
};

const buildFiltersQuery = (filters?: CaptacoesFilters) => {
  if (!filters) return "";

  const params = new URLSearchParams();
  const search = filters.search?.trim();
  if (search) params.set("search", search);

  const builder = filters.builder;
  if (builder?.id) params.set("builder_id", String(builder.id));
  else if (builder?.name?.trim()) params.set("builder_search", builder.name.trim());

  const city = filters.city;
  if (city?.id) params.set("city_id", String(city.id));
  else if (city?.name?.trim()) params.set("city_search", city.name.trim());

  const neighborhood = filters.neighborhood;
  if (neighborhood?.id) params.set("neighborhood_id", String(neighborhood.id));
  else if (neighborhood?.name?.trim()) params.set("neighborhood_search", neighborhood.name.trim());

  if (filters.min_value != null) params.set("min_value", String(filters.min_value));
  if (filters.max_value != null) params.set("max_value", String(filters.max_value));
  if (filters.min_size != null) params.set("min_size", String(filters.min_size));
  if (filters.max_size != null) params.set("max_size", String(filters.max_size));

  const qs = params.toString();
  return qs ? `&${qs}` : "";
};

export function useCaptacoes(page = 1, filters?: CaptacoesFilters) {
  const filtersQuery = buildFiltersQuery(filters);

  return useQuery({
    queryKey: ["captacoes", page, filters ?? {}],
    queryFn: async () => {
      const response = await api.get(`captacoes?page=${page}${filtersQuery}`).json<PaginatedResponse<Captacao>>();
      return response;
    },
  });
}

export function useCaptacao(id: number) {
  return useQuery({
    queryKey: ["captacao", id],
    queryFn: async () => {
      const response = await api.get(`captacoes/${id}`).json<{ data: Captacao }>();
      return response;
    },
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCreateCaptacao() {
  const { toast } = useToast();

  return useMutation<{ data: Captacao }, Error, CaptacaoFormValues>({
    mutationFn: async (data: CaptacaoFormValues) => {
      const payload = toPayload(data);
      return api.post("captacoes", { json: payload }).json<{ data: Captacao }>();
    },
    onSuccess: () => {
      toast({ title: "Captação criada com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao criar captação",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCaptacao(id: number) {
  const { toast } = useToast();

  return useMutation<{ data: Captacao }, Error, CaptacaoFormValues>({
    mutationFn: async (data: CaptacaoFormValues) => {
      const payload = toPayload(data);
      return api.put(`captacoes/${id}`, { json: payload }).json<{ data: Captacao }>();
    },
    onSuccess: () => {
      toast({ title: "Captação atualizada com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar captação",
        description: "Ocorreu um erro ao salvar. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCaptacao() {
  const { toast } = useToast();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await api.delete(`captacoes/${id}`).json();
    },
    onSuccess: () => {
      toast({ title: "Captação excluída com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir captação",
        description: "Ocorreu um erro ao excluir. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}
