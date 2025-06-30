import { useQuery } from '@tanstack/react-query';
import { getAlugueis } from '../services/aluguel-service';
import type { AluguelListItem } from '../types/aluguel-list-item';

export function useAlugueis() {
  return useQuery<AluguelListItem[]>({
    queryKey: ['alugueis'],
    queryFn: getAlugueis,
    select: (data: unknown) => {
      if (Array.isArray(data)) return data;
      if (
        typeof data === 'object' &&
        data !== null &&
        'data' in data &&
        Array.isArray((data as { data?: unknown }).data)
      ) {
        return (data as { data: AluguelListItem[] }).data;
      }
      return [];
    },
  });
} 