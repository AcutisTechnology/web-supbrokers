import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/shared/configs/api';
import { useToast } from '@/hooks/use-toast';
import type { Demanda } from '../types/demanda';
import type { DemandaFormValues } from '../types/demanda-schema';
import type { AutocompleteOption } from '@/components/ui/autocomplete-input';

export interface DemandasFilters {
  search?: string;
  status?: string;
  property_type?: string;
  lead_id?: number | null;
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
  if (filters?.lead_id) params.set('lead_id', String(filters.lead_id));
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
      api.get(`crm/leads?search=${encodeURIComponent(query)}&per_page=20`).json<{ data: { id: number; name: string }[] }>(),
    enabled: query.length >= 2,
  });
}

export async function searchCustomers(query: string): Promise<AutocompleteOption[]> {
  if (query.trim().length < 2) return [];
  const res = await api
    .get(`crm/leads?search=${encodeURIComponent(query)}&per_page=20`)
    .json<{ data: { id: number; name: string; phone?: string }[] }>();
  return res.data.map(c => ({
    id: String(c.id),
    name: c.phone ? `${c.name} — ${c.phone}` : c.name,
  }));
}

export async function searchNeighborhoodSuggestions(query: string): Promise<{ id: number; name: string }[]> {
  if (query.trim().length < 2) return [];
  const res = await api
    .get(`locations?type=bairro&search=${encodeURIComponent(query)}`)
    .json<{ data: { id: number; name: string }[] }>();
  return res.data;
}
