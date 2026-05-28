'use client';

import { useBrokerProperties } from '@/features/landing/services/broker-service';
import { ChevronRight, Home, SearchX, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useBrokerHomeData } from '../hooks/use-broker-home-data';
import { useSearchFilters } from '../hooks/use-search-filters';
import { WhatsappProvider } from '../hooks/whatsapp-context';
import { apiToCardProperty } from '../lib/map-property';
import { DynamicSeo } from './dynamic-seo';
import { FloatingWhatsapp } from './floating-whatsapp';
import { ListingPagination } from './listing-pagination';
import { ListingPropertyCard } from './listing-property-card';
import { ListingSort } from './listing-sort';
import { PremiumFooter } from './premium-footer';
import { PremiumHeader } from './premium-header';
import { PropertySearchForm } from './property-search-form';

interface SearchResultsProps {
  brokerSlug: string | null;
}

const DEFAULT_PAGE_SIZE = 12;

export function SearchResults({ brokerSlug }: SearchResultsProps) {
  const meta = useBrokerHomeData(brokerSlug);
  const { filters, clearFilters, filtersCount } = useSearchFilters();

  // Aplica a ordenação default configurada quando o usuário não escolheu uma.
  const effectiveFilters = useMemo(() => {
    const fallbackSort = (meta.listing.defaultSort ?? undefined) as
      | typeof filters.sort
      | undefined;
    return { ...filters, sort: filters.sort ?? fallbackSort };
  }, [filters, meta.listing.defaultSort]);

  const pageSize = meta.listing.pageSize ?? DEFAULT_PAGE_SIZE;

  const propertiesQuery = useBrokerProperties(brokerSlug ?? '', effectiveFilters);
  const data = propertiesQuery.data?.data;
  const items = useMemo(
    () => (data?.all ?? []).map(apiToCardProperty),
    [data]
  );

  // Paginação client-side
  const [page, setPage] = useState(1);
  useEffect(() => {
    // Resetar para a primeira página quando os filtros mudam (qty de resultados muda)
    setPage(1);
  }, [items.length, filtersCount]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const visible = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  );

  const isLoading = propertiesQuery.isLoading;
  const error = propertiesQuery.error;

  const dynamicTitle = useMemo(() => {
    if (filters.city) return `Imóveis em ${filters.city}`;
    if (filters.neighborhood) return `Imóveis em ${filters.neighborhood}`;
    if (filters.purpose === 'sale') return 'Imóveis à venda';
    if (filters.purpose === 'rent') return 'Imóveis para alugar';
    return 'Todos os imóveis';
  }, [filters.city, filters.neighborhood, filters.purpose]);

  const homeHref = brokerSlug ? `/${brokerSlug}` : '/preview-home';

  const seoTitle = `${dynamicTitle}${meta.brandName ? ` · ${meta.brandName}` : ''}`;

  return (
    <WhatsappProvider number={meta.whatsappNumber} templates={meta.whatsappTemplates}>
    <DynamicSeo
      title={seoTitle}
      description={meta.seo.description}
      ogImage={meta.seo.ogImage}
    />
    <div className="min-h-screen bg-[#FAFAF7] text-[#0F0820]">
      <PremiumHeader
        brandName={meta.brandName}
        brandLogo={meta.brandLogo}
        brokerSlug={meta.brokerSlug}
        whatsappNumber={meta.whatsappNumber}
        menu={meta.menu}
        theme="light"
      />

      <main className="pt-24 md:pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-[#0F0820]/50 mb-5"
          >
            <Link
              href={homeHref}
              className="inline-flex items-center gap-1 hover:text-[#0F0820] transition-colors"
            >
              <Home className="w-3 h-3" />
              Início
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#0F0820]/80">Imóveis</span>
            {(filters.city || filters.neighborhood) && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#0F0820]/80">
                  {filters.city ?? filters.neighborhood}
                </span>
              </>
            )}
          </nav>

          {/* Search bar (mesmo componente usado na Home, theme=light) */}
          <PropertySearchForm
            theme="light"
            citySuggestions={meta.citySuggestions}
            neighborhoodSuggestions={meta.neighborhoodSuggestions}
            submitLabel="Refinar Busca"
            onSubmit={() =>
              document
                .getElementById('listing-results')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          />

          {/* Title + sort */}
          <div
            id="listing-results"
            className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4 scroll-mt-24"
          >
            <div>
              <h1 className="font-display text-3xl md:text-4xl tracking-tight leading-[1.05] text-[#0F0820]">
                {dynamicTitle}
              </h1>
              <p className="mt-2 text-sm text-[#0F0820]/60">
                {isLoading ? (
                  'Buscando imóveis…'
                ) : items.length === 0 ? (
                  'Nenhum imóvel encontrado com esses filtros.'
                ) : (
                  <>
                    Encontramos{' '}
                    <strong className="text-[#0F0820]">{items.length}</strong>{' '}
                    {items.length === 1
                      ? 'propriedade exclusiva disponível.'
                      : 'propriedades exclusivas disponíveis.'}
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-4">
              <ListingSort />
            </div>
          </div>

          {/* Results */}
          <section className="mt-8">
            {isLoading ? (
              <LoadingGrid />
            ) : error ? (
              <EmptyState
                icon={<SearchX className="w-7 h-7" />}
                title="Erro ao carregar imóveis"
                description="Tente novamente em instantes."
              />
            ) : items.length === 0 ? (
              <EmptyState
                icon={<SearchX className="w-7 h-7" />}
                title="Nenhum imóvel encontrado"
                description="Ajuste os filtros ou amplie sua busca para ver mais resultados."
                action={
                  filtersCount > 0 ? (
                    <button
                      onClick={clearFilters}
                      className="mt-5 inline-flex items-center gap-2 bg-[#0F0820] text-white px-5 py-2.5 rounded-full text-sm hover:bg-[#1f1240] transition-colors"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      Limpar filtros ({filtersCount})
                    </button>
                  ) : null
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                  {visible.map(p => (
                    <ListingPropertyCard
                      key={p.id}
                      property={p}
                      whatsappNumber={meta.whatsappNumber}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-12">
                    <ListingPagination
                      page={page}
                      totalPages={totalPages}
                      onChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <PremiumFooter />
      <FloatingWhatsapp />
    </div>
    </WhatsappProvider>
  );
}

/* -------------------- Helpers -------------------- */

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden border border-black/[0.05] animate-pulse"
        >
          <div className="aspect-[4/3] bg-gray-200" />
          <div className="p-4 md:p-5 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
            <div className="pt-3 border-t border-black/[0.06]">
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-black/5">
      <div className="inline-flex w-16 h-16 rounded-full bg-[#FAFAF7] items-center justify-center mb-5 text-[#9747FF]">
        {icon}
      </div>
      <h2 className="font-display text-2xl text-[#0F0820] mb-2">{title}</h2>
      <p className="text-[#0F0820]/60 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}
