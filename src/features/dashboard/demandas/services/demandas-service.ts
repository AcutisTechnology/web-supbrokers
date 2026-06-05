import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/shared/configs/api';
import { useToast } from '@/hooks/use-toast';
import type { Demanda } from '../types/demanda';
import type { DemandaFormValues } from '../types/demanda-schema';

export interface DemandasFilters {
  search?: string;
  status?: string;
  property_type?: string;
  client_id?: number | null;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

function buildQuery(filters?: DemandasFilters): string {
  const params = new URLSearchParams();
  if (filters?.search?.trim()) params.set('search', filters.search.trim());
  if (filters?.status) params.set('status', filters.status);
  if (filters?.property_type) params.set('property_type', filters.property_type);
  if (filters?.client_id) params.set('client_id', String(filters.client_id));
  const qs = params.toString();
  return qs ? `&${qs}` : '';
}

export function useDemandasList(page = 1, filters?: DemandasFilters) {
  return useQuery({
    queryKey: ['demandas', page, filters ?? {}],
    queryFn: () =>
      api.get(`demands?page=${page}${buildQuery(filters)}`).json<PaginatedResponse<Demanda>>(),
  });
}

export function useDemanda(id: number | null) {
  return useQuery({
    queryKey: ['demanda', id],
    queryFn: () => api.get(`demands/${id}`).json<{ data: Demanda }>(),
    enabled: typeof id === 'number' && id > 0,
  });
}

export function useCreateDemanda() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: DemandaFormValues) =>
      api.post('demands', { json: data }).json<{ data: Demanda }>(),
    onSuccess: () => toast({ title: 'Demanda criada com sucesso!' }),
    onError: () =>
      toast({ title: 'Erro ao criar demanda', variant: 'destructive' }),
  });
}

export function useUpdateDemanda() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DemandaFormValues }) =>
      api.put(`demands/${id}`, { json: data }).json<{ data: Demanda }>(),
    onSuccess: () => toast({ title: 'Demanda atualizada com sucesso!' }),
    onError: () =>
      toast({ title: 'Erro ao atualizar demanda', variant: 'destructive' }),
  });
}

export function useDeleteDemanda() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) => api.delete(`demands/${id}`).json<void>(),
    onSuccess: () => toast({ title: 'Demanda excluída com sucesso!' }),
    onError: () =>
      toast({ title: 'Erro ao excluir demanda', variant: 'destructive' }),
  });
}

export function useDuplicateDemanda() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) =>
      api.post(`demands/${id}/duplicate`).json<{ data: Demanda }>(),
    onSuccess: () => toast({ title: 'Demanda duplicada com sucesso!' }),
    onError: () =>
      toast({ title: 'Erro ao duplicar demanda', variant: 'destructive' }),
  });
}

export function useRematchDemanda() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: number) =>
      api.post(`demands/${id}/rematch`).json<{ message: string; matches_count: number }>(),
    onSuccess: (data) =>
      toast({ title: `Matches regenerados: ${data.matches_count} imóvel(is) encontrado(s).` }),
    onError: () =>
      toast({ title: 'Erro ao regenerar matches', variant: 'destructive' }),
  });
}

export function useSearchClients(query: string) {
  return useQuery({
    queryKey: ['clients-search', query],
    queryFn: () =>
      api.get(`customers?search=${encodeURIComponent(query)}`).json<{ data: { id: number; name: string }[] }>(),
    enabled: query.length >= 2,
  });
}
