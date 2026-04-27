"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { ChevronDown, ChevronUp, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/shared/configs/api";
import { CaptacoesFilters, useCaptacoes, useDeleteCaptacao } from "@/features/dashboard/captacoes/services/captacoes-service";
import { formatCurrency } from "@/lib/utils";

export default function CaptacoesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  const emptyOption = { id: null as number | null, name: "" };

  const [draftFilters, setDraftFilters] = useState<CaptacoesFilters>({
    search: "",
    builder: emptyOption,
    city: emptyOption,
    neighborhood: emptyOption,
    min_value: null,
    max_value: null,
    min_size: null,
    max_size: null,
  });

  const [appliedFilters, setAppliedFilters] = useState<CaptacoesFilters>(draftFilters);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const { data, isLoading, isError, error, refetch } = useCaptacoes(currentPage, appliedFilters);
  const deleteMutation = useDeleteCaptacao();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreate = () => {
    router.push("/dashboard/captacoes/nova");
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["captacoes"] });
      },
    });
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters(draftFilters);
  };

  const clearFilters = () => {
    const cleared: CaptacoesFilters = {
      search: "",
      builder: emptyOption,
      city: emptyOption,
      neighborhood: emptyOption,
      min_value: null,
      max_value: null,
      min_size: null,
      max_size: null,
    };
    setCurrentPage(1);
    setDraftFilters(cleared);
    setAppliedFilters(cleared);
  };

  const searchBuilders = async (query: string) => {
    const response = await api
      .get(`builders?search=${encodeURIComponent(query)}`)
      .json<{ data: { id: number; name: string }[] }>();

    return (response.data ?? []).map((i) => ({ id: String(i.id), name: i.name }));
  };

  const searchCities = async (query: string) => {
    const response = await api
      .get(`locations?type=cidade&search=${encodeURIComponent(query)}`)
      .json<{ data: { id: number; name: string }[] }>();

    return (response.data ?? []).map((i) => ({ id: String(i.id), name: i.name }));
  };

  const searchNeighborhoods = async (query: string) => {
    const response = await api
      .get(`locations?type=bairro&search=${encodeURIComponent(query)}`)
      .json<{ data: { id: number; name: string }[] }>();

    return (response.data ?? []).map((i) => ({ id: String(i.id), name: i.name }));
  };

  const formatRange = (min: number | null | undefined, max: number | null | undefined, suffix?: string) => {
    const hasMin = typeof min === "number" && Number.isFinite(min);
    const hasMax = typeof max === "number" && Number.isFinite(max);

    if (!hasMin && !hasMax) return "-";
    if (hasMin && hasMax) return `${min}${suffix ?? ""} – ${max}${suffix ?? ""}`;
    if (hasMin) return `a partir de ${min}${suffix ?? ""}`;
    return `até ${max}${suffix ?? ""}`;
  };

  const formatMoneyRange = (min: number | null | undefined, max: number | null | undefined) => {
    const minValue = typeof min === "number" && Number.isFinite(min) ? min : null;
    const maxValue = typeof max === "number" && Number.isFinite(max) ? max : null;

    if (minValue === null && maxValue === null) return "-";
    if (minValue !== null && maxValue !== null) return `${formatCurrency(minValue)} – ${formatCurrency(maxValue)}`;
    if (minValue !== null) return `a partir de ${formatCurrency(minValue)}`;
    return `até ${formatCurrency(maxValue ?? 0)}`;
  };

  useLayoutEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["captacoes"] });
  }, [queryClient]);

  return (
    <>
      <TopNav title_secondary="Captações" />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#141414]">Captações</h1>
          <p className="text-[#777777]">Empreendimentos em captação</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Criar nova captação
        </Button>
      </div>

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
              <>
                Menos filtros <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Mais filtros <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium mb-2 text-[#141414]">Nome</div>
              <Input
                placeholder="Buscar pelo nome do prédio"
                value={draftFilters.search ?? ""}
                onChange={(e) => setDraftFilters((p) => ({ ...p, search: e.target.value }))}
              />
            </div>

            <div>
              <div className="text-sm font-medium mb-2 text-[#141414]">Construtora</div>
              <AutocompleteInput
                value={{ id: draftFilters.builder?.id ? String(draftFilters.builder.id) : null, name: draftFilters.builder?.name ?? "" }}
                onChange={(v) =>
                  setDraftFilters((p) => ({
                    ...p,
                    builder: { id: v.id ? Number(v.id) : null, name: v.name },
                  }))
                }
                onSearch={searchBuilders}
                placeholder="Construtora"
                debounceMs={300}
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
          </div>

          {showAdvancedFilters ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium mb-2 text-[#141414]">Cidade</div>
                <AutocompleteInput
                  value={{ id: draftFilters.city?.id ? String(draftFilters.city.id) : null, name: draftFilters.city?.name ?? "" }}
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

              <div>
                <div className="text-sm font-medium mb-2 text-[#141414]">Faixa de preço</div>
                <div className="grid grid-cols-2 gap-2">
                  <CurrencyInput
                    value={draftFilters.min_value ?? 0}
                    onChange={(v) => setDraftFilters((p) => ({ ...p, min_value: v === 0 ? null : v }))}
                    placeholder="Mín."
                  />
                  <CurrencyInput
                    value={draftFilters.max_value ?? 0}
                    onChange={(v) => setDraftFilters((p) => ({ ...p, max_value: v === 0 ? null : v }))}
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
          ) : null}

          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={clearFilters}>
              Limpar
            </Button>
            <Button onClick={applyFilters}>Aplicar filtros</Button>
          </div>
        </CardContent>
      </Card>

      <LoadingState isLoading={isLoading} isError={isError} error={error as Error} onRetry={() => refetch()} />

      {!isLoading && !isError && (
        <>
          {data?.data && data.data.length > 0 ? (
            <div className="w-full">
              <div className="hidden md:block bg-white rounded-xl border border-[#E2E2E2] overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[#E2E2E2]">
                      <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">NOME</th>
                      <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">CONSTRUTORA</th>
                      <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">CIDADE</th>
                      <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">BAIRRO</th>
                      <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">PREÇO</th>
                      <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">TAMANHO</th>
                      <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">STATUS</th>
                      <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">DRIVE</th>
                      <th className="text-right px-6 py-4 font-semibold text-[#4A316A]">AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((captacao) => (
                      <tr key={captacao.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-[#141414] font-medium">{captacao.building_name}</td>
                        <td className="px-6 py-4 text-[#141414]">{captacao.builder?.name ?? "-"}</td>
                        <td className="px-6 py-4 text-[#141414]">{captacao.city_ref?.name ?? "-"}</td>
                        <td className="px-6 py-4 text-[#141414]">{captacao.neighborhood_ref?.name ?? "-"}</td>
                        <td className="px-6 py-4 text-[#141414]">{formatMoneyRange(captacao.min_value, captacao.max_value)}</td>
                        <td className="px-6 py-4 text-[#141414]">
                          {formatRange(captacao.min_size ?? null, captacao.max_size ?? null, "m²")}
                        </td>
                        <td className="px-6 py-4 text-[#141414]">{captacao.status?.trim() ? captacao.status : "-"}</td>
                        <td className="px-6 py-4">
                          {captacao.drive_url?.trim() ? (
                            <Button asChild variant="outline" size="sm">
                              <a href={captacao.drive_url} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                Abrir
                              </a>
                            </Button>
                          ) : (
                            <span className="text-[#969696]">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/dashboard/captacoes/${captacao.id}/editar`}>Editar</Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir captação</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir esta captação? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(captacao.id)}>Excluir</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden bg-white rounded-xl border border-[#E2E2E2] overflow-hidden shadow-sm overflow-x-auto">
                <table className="min-w-[900px] w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-[#E2E2E2]">
                      <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">NOME</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">CONSTRUTORA</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">CIDADE</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">BAIRRO</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">PREÇO</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">TAMANHO</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">STATUS</th>
                      <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">DRIVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((captacao) => (
                      <tr key={captacao.id} className="border-b border-gray-100 last:border-b-0">
                        <td className="px-4 py-3 text-[#141414] font-medium">{captacao.building_name}</td>
                        <td className="px-4 py-3 text-[#141414]">{captacao.builder?.name ?? "-"}</td>
                        <td className="px-4 py-3 text-[#141414]">{captacao.city_ref?.name ?? "-"}</td>
                        <td className="px-4 py-3 text-[#141414]">{captacao.neighborhood_ref?.name ?? "-"}</td>
                        <td className="px-4 py-3 text-[#141414]">{formatMoneyRange(captacao.min_value, captacao.max_value)}</td>
                        <td className="px-4 py-3 text-[#141414]">
                          {formatRange(captacao.min_size ?? null, captacao.max_size ?? null, "m²")}
                        </td>
                        <td className="px-4 py-3 text-[#141414]">{captacao.status?.trim() ? captacao.status : "-"}</td>
                        <td className="px-4 py-3">
                          {captacao.drive_url?.trim() ? (
                            <Button asChild variant="outline" size="sm">
                              <a href={captacao.drive_url} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                Abrir
                              </a>
                            </Button>
                          ) : (
                            <span className="text-[#969696]">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState action={{ label: "Criar nova captação", onClick: handleCreate }} />
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

      <div className="mt-8 text-center text-sm text-[#777777]">Copyright © iMoobile. Todos os direitos reservados</div>
    </>
  );
}
