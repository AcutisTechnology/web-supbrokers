"use client";

import { use } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, RefreshCw, MapPin, Home, DollarSign, BedDouble } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import {
  useDemanda, useRematchDemanda,
} from "@/features/dashboard/demandas/services/demandas-service";
import {
  DEMANDA_STATUS_LABELS, DEMANDA_STATUS_COLORS, DemandaStatus,
} from "@/features/dashboard/demandas/types/demanda";

export default function DemandaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const demandaId = Number(id);
  const queryClient = useQueryClient();

  const { data: resp, isLoading, error } = useDemanda(demandaId);
  const rematchMutation = useRematchDemanda();

  if (isLoading) return <div className="p-6 text-center text-gray-400">Carregando...</div>;
  if (error || !resp?.data) return <div className="p-6 text-red-500">Demanda não encontrada.</div>;

  const d = resp.data;

  const handleRematch = () => {
    rematchMutation.mutate(demandaId, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["demanda", demandaId] }),
    });
  };

  return (
    <div className="flex-1">
      <main className="p-4 sm:p-6">
        <TopNav title_secondary="Demandas" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{d.title}</h1>
            {d.client && (
              <p className="text-sm text-gray-500 mt-0.5">Cliente: <span className="font-medium">{d.client.name}</span></p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline" size="sm"
              onClick={handleRematch}
              disabled={rematchMutation.isPending}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${rematchMutation.isPending ? "animate-spin" : ""}`} />
              Regenerar matches
            </Button>
            <Button asChild size="sm" className="bg-[#9747ff] hover:bg-[#7c2ae8] text-white">
              <Link href={`/dashboard/demandas/${demandaId}/editar`}>
                <Pencil className="w-4 h-4 mr-2" /> Editar
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumo */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-4 shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Resumo</h2>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DEMANDA_STATUS_COLORS[d.status as DemandaStatus]}`}>
                    {DEMANDA_STATUS_LABELS[d.status as DemandaStatus]}
                  </span>
                </div>
                {d.property_type && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Tipo</span>
                    <span className="font-medium">{d.property_type}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Finalidade</span>
                  <span className="font-medium">{[d.sale && "Compra", d.rent && "Aluguel"].filter(Boolean).join(" / ") || "—"}</span>
                </div>
                {(d.city || d.state) && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Localização</span>
                    <span className="font-medium">{[d.city, d.state].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                {d.neighborhoods?.length > 0 && (
                  <div>
                    <span className="text-gray-500">Bairros</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {d.neighborhoods.map(n => (
                        <span key={n} className="bg-[#9747ff]/10 text-[#9747ff] text-xs px-2 py-0.5 rounded-full">{n}</span>
                      ))}
                    </div>
                  </div>
                )}
                {(d.min_value || d.max_value) && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Valor</span>
                    <span className="font-medium text-xs">
                      {d.min_value ? "R$ " + d.min_value.toLocaleString("pt-BR") : "—"} até {d.max_value ? "R$ " + d.max_value.toLocaleString("pt-BR") : "—"}
                    </span>
                  </div>
                )}
                {(d.min_size || d.max_size) && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Área</span>
                    <span className="font-medium">{d.min_size ?? "—"}m² – {d.max_size ?? "—"}m²</span>
                  </div>
                )}
                {d.min_bedrooms != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Quartos mín.</span>
                    <span className="font-medium">{d.min_bedrooms}</span>
                  </div>
                )}
              </div>
            </Card>

            {d.required_characteristics?.length > 0 && (
              <Card className="p-4 shadow-sm">
                <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Características obrigatórias</h2>
                <div className="flex flex-wrap gap-1">
                  {d.required_characteristics.map(c => (
                    <span key={c} className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">{c}</span>
                  ))}
                </div>
              </Card>
            )}

            {d.desired_characteristics?.length > 0 && (
              <Card className="p-4 shadow-sm">
                <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Características desejáveis</h2>
                <div className="flex flex-wrap gap-1">
                  {d.desired_characteristics.map(c => (
                    <span key={c} className="bg-[#9747ff]/10 text-[#9747ff] text-xs px-2 py-0.5 rounded-full font-medium">{c}</span>
                  ))}
                </div>
              </Card>
            )}

            {d.description && (
              <Card className="p-4 shadow-sm">
                <h2 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Observações</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{d.description}</p>
              </Card>
            )}
          </div>

          {/* Imóveis compatíveis */}
          <div className="lg:col-span-2">
            <Card className="p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-700">
                  Imóveis Compatíveis
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    ({d.matches?.length ?? d.matches_count} encontrado(s))
                  </span>
                </h2>
              </div>

              {!d.matches?.length ? (
                <div className="text-center py-12 text-gray-400">
                  <Home className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>Nenhum imóvel compatível encontrado.</p>
                  <p className="text-xs mt-1">Verifique se há imóveis ativos que atendam aos critérios.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead className="border-b border-gray-200">
                      <tr className="text-left">
                        <th className="pb-2 text-xs font-semibold text-gray-500 uppercase">Foto</th>
                        <th className="pb-2 text-xs font-semibold text-gray-500 uppercase">Código</th>
                        <th className="pb-2 text-xs font-semibold text-gray-500 uppercase">Imóvel</th>
                        <th className="pb-2 text-xs font-semibold text-gray-500 uppercase">Bairro</th>
                        <th className="pb-2 text-xs font-semibold text-gray-500 uppercase">Valor</th>
                        <th className="pb-2 text-xs font-semibold text-gray-500 uppercase text-center">Compatib.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {d.matches.map(match => {
                        const p = match.property;
                        if (!p) return null;
                        const score = match.compatibility_score;
                        const scoreColor =
                          score >= 80 ? "bg-green-100 text-green-700" :
                          score >= 65 ? "bg-yellow-100 text-yellow-700" :
                          "bg-orange-100 text-orange-700";

                        return (
                          <tr key={match.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 pr-3">
                              {p.photo_url ? (
                                <img
                                  src={p.photo_url}
                                  alt={p.title}
                                  className="w-14 h-10 object-cover rounded-md"
                                />
                              ) : (
                                <div className="w-14 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                                  <Home className="w-5 h-5 text-gray-300" />
                                </div>
                              )}
                            </td>
                            <td className="py-3 pr-3 text-gray-500 text-xs font-mono">{p.code ?? "—"}</td>
                            <td className="py-3 pr-3">
                              <Link
                                href={p.owner_slug
                                  ? `/${p.owner_slug}/imovel/${p.slug}`
                                  : `/dashboard/imoveis/${p.slug}`}
                                target={p.owner_slug ? "_blank" : undefined}
                                rel={p.owner_slug ? "noopener noreferrer" : undefined}
                                className="font-medium text-gray-900 hover:text-[#9747ff] transition-colors line-clamp-1"
                              >
                                {p.title}
                              </Link>
                              {(p.bedrooms || p.size) && (
                                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                                  {p.bedrooms != null && <span className="flex items-center gap-0.5"><BedDouble className="w-3 h-3" />{p.bedrooms}</span>}
                                  {p.size != null && <span>{p.size}m²</span>}
                                </p>
                              )}
                            </td>
                            <td className="py-3 pr-3 text-gray-500 text-xs">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 shrink-0" />
                                {p.neighborhood ?? "—"}
                              </div>
                            </td>
                            <td className="py-3 pr-3 text-gray-700 text-xs font-medium whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {p.value_formatted}
                              </div>
                            </td>
                            <td className="py-3 text-center">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${scoreColor}`}>
                                {score}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
