"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useLayoutEffect } from "react";
import { PropertyCard } from "@/features/dashboard/imoveis/property-card";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import {
  useProperties,
  useDeleteProperty,
  PropertiesFilters,
} from "@/features/dashboard/imoveis/services/property-service";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { ChevronDown, ChevronUp, Plus, Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/shared/configs/api";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { ImportPropertiesModal } from "@/features/dashboard/imoveis/components/import-properties-modal";

const emptyOption = { id: null as number | null, name: "" };

const defaultFilters = (): PropertiesFilters => ({
  code: "",
  search: "",
  neighborhood: { ...emptyOption },
  city: { ...emptyOption },
  min_value: null,
  max_value: null,
  min_size: null,
  max_size: null,
});

export default function PropertiesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { hasPermission } = useCurrentUser();
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [draftFilters, setDraftFilters] = useState<PropertiesFilters>(defaultFilters());
  const [appliedFilters, setAppliedFilters] = useState<PropertiesFilters>(defaultFilters());

  const { data, isLoading, isError, error, refetch } = useProperties(currentPage, appliedFilters);
  const deletePropertyMutation = useDeleteProperty();

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleCreateProperty = () => router.push("/dashboard/imoveis/novo");

  const handleDeleteProperty = async (slug: string) => {
    try {
      await deletePropertyMutation.mutateAsync(slug, {
        onSuccess: () => {
          toast({ title: "Imóvel excluído com sucesso!" });
          queryClient.invalidateQueries({ queryKey: ["properties"] });
        },
        onError: () => {
          toast({
            title: "Erro ao excluir imóvel",
            description: "Ocorreu um erro ao excluir o imóvel. Tente novamente.",
            variant: "destructive",
          });
        },
      });
    } catch {
      // handled above
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters(draftFilters);
  };

  const clearFilters = () => {
    const cleared = defaultFilters();
    setCurrentPage(1);
    setDraftFilters(cleared);
    setAppliedFilters(cleared);
  };

  const searchCities = async (query: string) => {
    const response = await api
      .get(`properties/locations?type=cidade&search=${encodeURIComponent(query)}`)
      .json<{ data: { id: number; name: string }[] }>();
    return (response.data ?? []).map((i) => ({ id: String(i.id), name: i.name }));
  };

  const searchNeighborhoods = async (query: string) => {
    const response = await api
      .get(`properties/locations?type=bairro&search=${encodeURIComponent(query)}`)
      .json<{ data: { id: number; name: string }[] }>();
    return (response.data ?? []).map((i) => ({ id: String(i.id), name: i.name }));
  };

  useLayoutEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["properties"] });
  }, [queryClient]);

  return (
    <>
      <TopNav title_secondary="Seus imóveis" />
      <div className="flex items-center justify-between mb-6">
        <Button onClick={handleCreateProperty}>
          <Plus className="mr-2 h-4 w-4" />
          Criar novo imóvel
        </Button>
        {hasPermission("imoveis.importar") && (
          <Button variant="outline" onClick={() => setImportModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Importar Canal Pro
          </Button>
        )}
      </div>

      <ImportPropertiesModal open={importModalOpen} onOpenChange={setImportModalOpen} />

      {/* Filtros */}
      <Card className="border border-gray-100 shadow-sm mb-6">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Filtros</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters((v) => !v)}
            className="gap-2"
          >
            {showAdvancedFilters ? (
              <>Menos filtros <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Mais filtros <ChevronDown className="h-4 w-4" /></>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Linha 1 — sempre visível */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium mb-2 text-[#141414]">Código</div>
              <Input
                placeholder="Ex: TD01"
                value={draftFilters.code ?? ""}
                onChange={(e) =>
                  setDraftFilters((p) => ({ ...p, code: e.target.value }))
                }
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-2 text-[#141414]">Nome</div>
              <Input
                placeholder="Buscar pelo nome do imóvel"
                value={draftFilters.search ?? ""}
                onChange={(e) =>
                  setDraftFilters((p) => ({ ...p, search: e.target.value }))
                }
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-2 text-[#141414]">Bairro</div>
              <AutocompleteInput
                value={{
                  id: draftFilters.neighborhood?.id ? String(draftFilters.neighborhood.id) : null,
                  name: draftFilters.neighborhood?.name ?? "",
                }}
                onChange={(v) =>
                  setDraftFilters((p) => ({
                    ...p,
                    neighborhood: { id: v.id ? Number(v.id) : null, name: v.name },
                  }))
                }
                onSearch={searchNeighborhoods}
                placeholder="Bairro"
                debounceMs={300}
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-2 text-[#141414]">Cidade</div>
              <AutocompleteInput
                value={{
                  id: draftFilters.city?.id ? String(draftFilters.city.id) : null,
                  name: draftFilters.city?.name ?? "",
                }}
                onChange={(v) =>
                  setDraftFilters((p) => ({
                    ...p,
                    city: { id: v.id ? Number(v.id) : null, name: v.name },
                  }))
                }
                onSearch={searchCities}
                placeholder="Cidade"
                debounceMs={300}
              />
            </div>
          </div>

          {/* Linha 2 — filtros avançados */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-2 text-[#141414]">Faixa de preço</div>
                <div className="grid grid-cols-2 gap-2">
                  <CurrencyInput
                    value={draftFilters.min_value ?? 0}
                    onChange={(v) =>
                      setDraftFilters((p) => ({ ...p, min_value: v === 0 ? null : v }))
                    }
                    placeholder="Mín."
                  />
                  <CurrencyInput
                    value={draftFilters.max_value ?? 0}
                    onChange={(v) =>
                      setDraftFilters((p) => ({ ...p, max_value: v === 0 ? null : v }))
                    }
                    placeholder="Máx."
                  />
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2 text-[#141414]">Faixa de tamanho (m²)</div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Mín."
                    value={draftFilters.min_size ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setDraftFilters((p) => ({ ...p, min_size: v === "" ? null : Number(v) }));
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Máx."
                    value={draftFilters.max_size ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setDraftFilters((p) => ({ ...p, max_size: v === "" ? null : Number(v) }));
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={clearFilters}>
              Limpar
            </Button>
            <Button onClick={applyFilters}>Aplicar filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Estado de carregamento e erro */}
      <LoadingState
        isLoading={isLoading}
        isError={isError}
        error={error as Error}
        onRetry={() => refetch()}
      />

      {/* Lista de imóveis */}
      {!isLoading && !isError && (
        <>
          {data?.data && data.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((property, index) => (
                <PropertyCard
                  key={`${property.slug}-${index}`}
                  property={property}
                  onDelete={() => handleDeleteProperty(property.slug)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              action={{
                label: "Criar novo imóvel",
                onClick: handleCreateProperty,
              }}
            />
          )}

          {data?.meta && data.meta.last_page > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={data.meta.last_page}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          )}
        </>
      )}

      <div className="mt-8 text-center text-sm text-[#777777]">
        Copyright © iMoobile. Todos os direitos reservados
      </div>
    </>
  );
}
