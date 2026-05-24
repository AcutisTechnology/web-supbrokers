'use client';

import {
  PROPERTY_TYPE_LABELS,
  type PropertyType,
} from '@/features/dashboard/imoveis/novo/schemas/property-schema';
import { useBrokerProperties } from '@/features/landing/services/broker-service';
import { ArrowLeft, Loader2, MapPin, SearchX } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useBrokerHomeData } from '../hooks/use-broker-home-data';
import { useSearchFilters } from '../hooks/use-search-filters';
import { apiToCardProperty } from '../lib/map-property';
import { FloatingWhatsapp } from './floating-whatsapp';
import { PremiumFooter } from './premium-footer';
import { PremiumHeader } from './premium-header';
import { PremiumPropertyCard } from './premium-property-card';

interface SearchResultsProps {
  brokerSlug: string | null;
}

export function SearchResults({ brokerSlug }: SearchResultsProps) {
  const meta = useBrokerHomeData(brokerSlug);
  const { filters, clearFilters, filtersCount } = useSearchFilters();

  const propertiesQuery = useBrokerProperties(brokerSlug ?? '', filters);
  const data = propertiesQuery.data?.data;
  const items = data?.all ?? [];

  // Chips de filtros ativos
  const activeChips = useMemo(() => buildChips(filters), [filters]);

  const isLoading = propertiesQuery.isLoading;
  const error = propertiesQuery.error;

  const homeHref = brokerSlug ? `/${brokerSlug}` : '/preview-home';

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0F0820]">
      <PremiumHeader
        brandName={meta.brandName}
        brandLogo={meta.brandLogo}
        brokerSlug={meta.brokerSlug}
        whatsappNumber={meta.whatsappNumber}
        menu={meta.menu}
      />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          {/* Breadcrumb / voltar */}
          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 text-sm text-[#0F0820]/60 hover:text-[#0F0820] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o início
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#9747FF] mb-2">
                Resultados da busca
              </p>
              <h1 className="font-display text-3xl md:text-5xl tracking-tight leading-[1.05]">
                {isLoading
                  ? 'Buscando…'
                  : `${items.length} ${items.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}`}
              </h1>
            </div>

            {filtersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-[#9747FF] hover:underline whitespace-nowrap"
              >
                Limpar filtros ({filtersCount})
              </button>
            )}
          </div>

          {/* Chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {activeChips.map(c => (
                <span
                  key={c.key}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black/10 text-xs text-[#0F0820]"
                >
                  <span className="text-[#9747FF]">{c.label}:</span>
                  <span className="font-medium">{c.value}</span>
                </span>
              ))}
            </div>
          )}

          {/* Conteúdo */}
          {isLoading ? (
            <LoadingGrid />
          ) : error ? (
            <EmptyState
              title="Erro ao buscar imóveis"
              description="Tente novamente em instantes."
            />
          ) : items.length === 0 ? (
            <EmptyState
              title="Nenhum imóvel encontrado"
              description="Ajuste os filtros e tente novamente."
              action={
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center gap-2 bg-[#0F0820] text-white px-5 py-2.5 rounded-full text-sm hover:bg-[#1f1240] transition-colors"
                >
                  Limpar filtros
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {items.map(p => (
                <PremiumPropertyCard
                  key={p.slug}
                  property={apiToCardProperty(p)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <PremiumFooter />
      <FloatingWhatsapp />
    </div>
  );
}

function buildChips(filters: ReturnType<typeof useSearchFilters>['filters']) {
  const chips: { key: string; label: string; value: string }[] = [];

  if (filters.purpose) {
    chips.push({
      key: 'purpose',
      label: 'Finalidade',
      value:
        filters.purpose === 'sale'
          ? 'Comprar'
          : filters.purpose === 'rent'
            ? 'Alugar'
            : 'Todos',
    });
  }
  if (filters.city) chips.push({ key: 'city', label: 'Cidade', value: filters.city });
  if (filters.neighborhood)
    chips.push({ key: 'neighborhood', label: 'Bairro', value: filters.neighborhood });
  if (filters.q) chips.push({ key: 'q', label: 'Busca', value: filters.q });
  if (filters.property_type) {
    const types = Array.isArray(filters.property_type)
      ? filters.property_type
      : [filters.property_type];
    chips.push({
      key: 'property_type',
      label: 'Tipo',
      value: types.map(t => PROPERTY_TYPE_LABELS[t as PropertyType] ?? t).join(', '),
    });
  }
  if (filters.bedrooms_min)
    chips.push({ key: 'bedrooms_min', label: 'Quartos', value: `${filters.bedrooms_min}+` });
  if (filters.suites_min)
    chips.push({ key: 'suites_min', label: 'Suítes', value: `${filters.suites_min}+` });
  if (filters.bathrooms_min)
    chips.push({ key: 'bathrooms_min', label: 'Banheiros', value: `${filters.bathrooms_min}+` });
  if (filters.garages_min)
    chips.push({ key: 'garages_min', label: 'Vagas', value: `${filters.garages_min}+` });
  if (filters.size_min || filters.size_max) {
    const min = filters.size_min ?? 0;
    const max = filters.size_max ?? '∞';
    chips.push({ key: 'size', label: 'Área', value: `${min}–${max} m²` });
  }
  if (filters.price_min || filters.price_max) {
    const min = filters.price_min ? `R$ ${filters.price_min.toLocaleString('pt-BR')}` : 'R$ 0';
    const max = filters.price_max
      ? `R$ ${filters.price_max.toLocaleString('pt-BR')}`
      : '∞';
    chips.push({ key: 'price', label: 'Preço', value: `${min} – ${max}` });
  }
  if (filters.code) chips.push({ key: 'code', label: 'Código', value: filters.code });

  return chips;
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl overflow-hidden border border-black/[0.06] animate-pulse"
        >
          <div className="aspect-[4/3] bg-gray-200" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ))}
      <div className="col-span-full flex items-center justify-center pt-6 text-[#0F0820]/40">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Carregando imóveis…
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-black/5">
      <div className="inline-flex w-16 h-16 rounded-full bg-[#FAFAF7] items-center justify-center mb-5 text-[#9747FF]">
        <SearchX className="w-7 h-7" />
      </div>
      <h2 className="font-display text-2xl text-[#0F0820] mb-2">{title}</h2>
      <p className="text-[#777] flex items-center justify-center gap-2">
        <MapPin className="w-4 h-4" />
        {description}
      </p>
      {action}
    </div>
  );
}
