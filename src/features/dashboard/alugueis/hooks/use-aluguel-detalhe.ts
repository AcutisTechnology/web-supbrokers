import { useQuery } from '@tanstack/react-query';
import { getAluguelById, getPagamentos, getReparos } from '../services/aluguel-service';
import type { Aluguel } from '../types/aluguel';

export function useAluguelDetalhe(id: string) {
  const { data: aluguelRaw, isLoading: loadingAluguel, error: errorAluguel } = useQuery({
    queryKey: ['aluguel', id],
    queryFn: () => getAluguelById(id),
    enabled: !!id,
  });

  const { data: pagamentosRaw = [], isLoading: loadingPagamentos, error: errorPagamentos } = useQuery({
    queryKey: ['pagamentos', id],
    queryFn: () => getPagamentos(id),
    enabled: !!id,
  });

  const { data: reparosRaw = [], isLoading: loadingReparos, error: errorReparos } = useQuery({
    queryKey: ['reparos', id],
    queryFn: () => getReparos(id),
    enabled: !!id,
  });

  // Normalização para garantir array
  const pagamentos = Array.isArray(pagamentosRaw)
    ? pagamentosRaw
    : (typeof pagamentosRaw === 'object' && pagamentosRaw !== null && 'data' in pagamentosRaw && Array.isArray((pagamentosRaw as { data?: unknown }).data)
      ? (pagamentosRaw as { data: unknown[] }).data
      : []);

  const reparos = Array.isArray(reparosRaw)
    ? reparosRaw
    : (typeof reparosRaw === 'object' && reparosRaw !== null && 'data' in reparosRaw && Array.isArray((reparosRaw as { data?: unknown }).data)
      ? (reparosRaw as { data: unknown[] }).data
      : []);

  // Normalização: se vier { data: { ... } }, pega o .data, senão pega direto
  const aluguel = (aluguelRaw && typeof aluguelRaw === 'object' && 'data' in aluguelRaw)
    ? (aluguelRaw as { data: Aluguel }).data
    : (aluguelRaw ?? {});

  const loading = loadingAluguel || loadingPagamentos || loadingReparos;
  const error = errorAluguel || errorPagamentos || errorReparos;

  function formatDateBR(dateStr: string) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  return { aluguel, pagamentos, reparos, financeiro: null, formatDateBR, loading, error };
} 