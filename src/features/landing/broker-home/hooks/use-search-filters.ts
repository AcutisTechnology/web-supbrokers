'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { BrokerSearchFilters } from '@/features/landing/services/broker-service';

/**
 * Mapeia URLSearchParams ↔ BrokerSearchFilters.
 * Mantém o estado da busca persistido no link e shareable.
 */

const STRING_KEYS: (keyof BrokerSearchFilters)[] = [
  'q',
  'neighborhood',
  'city',
  'state',
  'purpose',
  'code',
  'sort',
];

const NUMBER_KEYS: (keyof BrokerSearchFilters)[] = [
  'bedrooms_min',
  'suites_min',
  'bathrooms_min',
  'garages_min',
  'size_min',
  'size_max',
  'price_min',
  'price_max',
];

function paramsToFilters(params: URLSearchParams): BrokerSearchFilters {
  const out: BrokerSearchFilters = {};

  STRING_KEYS.forEach(key => {
    const value = params.get(key);
    if (value) (out as Record<string, unknown>)[key] = value;
  });

  NUMBER_KEYS.forEach(key => {
    const value = params.get(key);
    if (value !== null && value !== '') {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) (out as Record<string, unknown>)[key] = parsed;
    }
  });

  const propertyType = params.get('property_type');
  if (propertyType) {
    out.property_type = propertyType.includes(',')
      ? propertyType.split(',').map(s => s.trim()).filter(Boolean)
      : propertyType;
  }

  return out;
}

function mergeIntoParams(
  current: URLSearchParams,
  patch: Partial<BrokerSearchFilters>
): URLSearchParams {
  const next = new URLSearchParams(current.toString());
  Object.entries(patch).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      next.delete(key);
      return;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        next.delete(key);
      } else {
        next.set(key, value.join(','));
      }
      return;
    }
    next.set(key, String(value));
  });
  return next;
}

interface UseSearchFiltersOptions {
  /** Lista de chaves a preservar ao limpar filtros (ex: broker). */
  preserveKeys?: string[];
}

export function useSearchFilters(options: UseSearchFiltersOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preserve = options.preserveKeys ?? [];

  const filters = useMemo(
    () => paramsToFilters(searchParams),
    [searchParams]
  );

  const filtersCount = useMemo(() => {
    let count = 0;
    for (const _ of Object.values(filters)) count++;
    return count;
  }, [filters]);

  const setFilter = useCallback(
    <K extends keyof BrokerSearchFilters>(
      key: K,
      value: BrokerSearchFilters[K] | undefined
    ) => {
      const next = mergeIntoParams(searchParams, { [key]: value } as Partial<BrokerSearchFilters>);
      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const setFilters = useCallback(
    (patch: Partial<BrokerSearchFilters>) => {
      const next = mergeIntoParams(searchParams, patch);
      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const replaceFilters = useCallback(
    (patch: BrokerSearchFilters) => {
      const next = new URLSearchParams();
      preserve.forEach(k => {
        const v = searchParams.get(k);
        if (v) next.set(k, v);
      });
      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        if (Array.isArray(value)) {
          if (value.length === 0) return;
          next.set(key, value.join(','));
        } else {
          next.set(key, String(value));
        }
      });
      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [router, searchParams, preserve]
  );

  const clearFilters = useCallback(() => {
    const next = new URLSearchParams();
    preserve.forEach(k => {
      const v = searchParams.get(k);
      if (v) next.set(k, v);
    });
    router.replace(`?${next.toString()}`, { scroll: false });
  }, [router, searchParams, preserve]);

  const buildSearchPath = useCallback(
    (basePath: string, draft: BrokerSearchFilters): string => {
      const next = new URLSearchParams();
      preserve.forEach(k => {
        const v = searchParams.get(k);
        if (v) next.set(k, v);
      });
      Object.entries(draft).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        if (Array.isArray(value)) {
          if (value.length === 0) return;
          next.set(key, value.join(','));
        } else {
          next.set(key, String(value));
        }
      });
      const qs = next.toString();
      return qs ? `${basePath}?${qs}` : basePath;
    },
    [searchParams, preserve]
  );

  return {
    filters,
    filtersCount,
    setFilter,
    setFilters,
    replaceFilters,
    clearFilters,
    buildSearchPath,
  };
}
