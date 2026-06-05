"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Eye, Pencil, Copy, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";

import {
  useDemandasList, useDeleteDemanda, useDuplicateDemanda, DemandasFilters,
} from "@/features/dashboard/demandas/services/demandas-service";
import {
  DEMANDA_STATUS_LABELS, DEMANDA_STATUS_COLORS, DemandaStatus, PROPERTY_TYPES,
} from "@/features/dashboard/demandas/types/demanda";

const ALL_STATUSES = Object.entries(DEMANDA_STATUS_LABELS) as [DemandaStatus, string][];
const EMPTY = "_all";

export default function DemandasPage() {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState({ search: "", status: EMPTY, property_type: EMPTY });
  const [filters, setFilters] = useState<DemandasFilters>({});

  const { data, isLoading } = useDemandasList(page, filters);
  const deleteMutation = useDeleteDemanda();
  const duplicateMutation = useDuplicateDemanda();

  const applyFilters = () => {
    setPage(1);
    setFilters({
      search: draft.search || undefined,
      status: draft.status !== EMPTY ? draft.status : undefined,
      property_type: draft.property_type !== EMPTY ? draft.property_type : undefined,
    });
  };
  const clearFilters = () => {
    setDraft({ search: "", status: EMPTY, property_type: EMPTY });
    setFilters({});
    setPage(1);
  };

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["demandas"] });

  return (
    <div className="flex-1">
      <main className="p-4 sm:p-6">
        <TopNav title_secondary="Demandas" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Demandas</h1>
          <Button asChild className="bg-[#9747ff] hover:bg-[#7c2ae8] text-white">
            <Link href="/dashboard/demandas/nova">
              <Plus className="w-4 h-4 mr-2" /> Nova demanda
            </Link>
          </Button>
        </div>

        {/* Filtros — só renderiza no client para evitar hydration mismatch com o Select */}
        {mounted && (
          <Card className="p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                placeholder="Buscar por título ou cidade..."
                value={draft.search ?? ""}
                onChange={e => setDraft(d => ({ ...d, search: e.target.value }))}
              />
              <Select
                value={draft.status}
                onValueChange={v => setDraft(d => ({ ...d, status: v }))}
              >
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={EMPTY}>Todos os status</SelectItem>
                  {ALL_STATUSES.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select
                value={draft.property_type}
                onValueChange={v => setDraft(d => ({ ...d, property_type: v }))}
              >
                <SelectTrigger><SelectValue placeholder="Tipo de imóvel" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={EMPTY}>Todos os tipos</SelectItem>
                  {PROPERTY_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="outline" size="sm" onClick={clearFilters}>Limpar</Button>
              <Button size="sm" onClick={applyFilters} className="bg-[#9747ff] hover:bg-[#7c2ae8] text-white">
                Filtrar
              </Button>
            </div>
          </Card>
        )}

        {/* Tabela — guard de montagem evita mismatch com cache do React Query */}
        {!mounted || isLoading ? (
          <div className="text-center py-12 text-gray-400">Carregando...</div>
        ) : !data?.data?.length ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">Nenhuma demanda encontrada.</p>
            <Button asChild className="bg-[#9747ff] hover:bg-[#7c2ae8] text-white">
              <Link href="/dashboard/demandas/nova"><Plus className="w-4 h-4 mr-2" /> Nova demanda</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Cliente","Título","Tipo","Cidade","Faixa de valor","Matches","Status","Criada em","Ações"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.data.map(demanda => (
                    <tr key={demanda.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-gray-600 text-xs">{demanda.client?.name ?? "—"}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{demanda.title}</td>
                      <td className="px-4 py-3 text-gray-600">{demanda.property_type ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{demanda.city ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                        {demanda.min_value || demanda.max_value
                          ? `${demanda.min_value ? "R$ " + demanda.min_value.toLocaleString("pt-BR") : "—"} a ${demanda.max_value ? "R$ " + demanda.max_value.toLocaleString("pt-BR") : "—"}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#9747ff]/10 text-[#9747ff]">
                          {demanda.matches_count} imóvel(is)
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${DEMANDA_STATUS_COLORS[demanda.status]}`}>
                          {DEMANDA_STATUS_LABELS[demanda.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(demanda.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button asChild variant="ghost" size="icon" title="Visualizar">
                            <Link href={`/dashboard/demandas/${demanda.id}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="ghost" size="icon" title="Editar">
                            <Link href={`/dashboard/demandas/${demanda.id}/editar`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost" size="icon" title="Duplicar"
                            onClick={() => duplicateMutation.mutate(demanda.id, { onSuccess: invalidate })}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="Excluir" className="text-red-500 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir demanda?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita. Todos os matches associados também serão removidos.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => deleteMutation.mutate(demanda.id, { onSuccess: invalidate })}
                                >
                                  Excluir
                                </AlertDialogAction>
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

            {/* Mobile */}
            <div className="md:hidden space-y-3">
              {data.data.map(demanda => (
                <Card key={demanda.id} className="p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{demanda.title}</p>
                      {demanda.client && <p className="text-xs text-gray-500">{demanda.client.name}</p>}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${DEMANDA_STATUS_COLORS[demanda.status]}`}>
                      {DEMANDA_STATUS_LABELS[demanda.status]}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1 mb-3">
                    {demanda.property_type && <p>Tipo: {demanda.property_type}</p>}
                    {demanda.city && <p>Cidade: {demanda.city}</p>}
                    <p className="text-[#9747ff] font-medium">{demanda.matches_count} imóvel(is) compatível(is)</p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/dashboard/demandas/${demanda.id}`}>Ver</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/dashboard/demandas/${demanda.id}/editar`}>Editar</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Paginação */}
            {data?.meta && data.meta.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  {page} / {data.meta.last_page}
                </span>
                <Button variant="outline" size="sm" disabled={page === data.meta.last_page} onClick={() => setPage(p => p + 1)}>
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
