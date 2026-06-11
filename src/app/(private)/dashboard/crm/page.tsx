"use client";

import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { api } from "@/shared/configs/api";
import { BarChart3, ChevronDown, Filter, Plus, Search, Settings2, SlidersHorizontal, Upload, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CrmLeadsFilters,
  useCrmLeads,
  useCrmLeadSources,
  useCrmMetrics,
  useCrmPipelineStages,
  useCrmTags,
  useMoveCrmLeadStage,
} from "@/features/dashboard/crm/services/crm-service";
import { KanbanBoard } from "@/features/dashboard/crm/components/kanban-board";
import { KanbanSkeleton } from "@/features/dashboard/crm/components/kanban-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ImportLeadsModal } from "@/features/dashboard/crm/components/import-leads-modal";
import { NewLeadModal } from "@/features/dashboard/crm/components/new-lead-modal";

type Broker = { id: number; name: string; user_type?: string | null };

const formatCurrency = (value: string | null | undefined) => {
  const numeric = value ? Number(value) : 0;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number.isFinite(numeric) ? numeric : 0);
};


export default function CrmPage() {
  const { isBroker, user: currentUser, userId: currentUserId, hasPermission } = useCurrentUser();
  const [importOpen, setImportOpen] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const { data: stagesData, isLoading: isLoadingStages } = useCrmPipelineStages();
  const { data: tagsData } = useCrmTags();
  const { data: sourcesData } = useCrmLeadSources();
  const { data: brokersData } = useQuery({
    queryKey: ["brokers", "list"],
    queryFn: async () => {
      const res = await api.get("users").json<{ data: Broker[] }>();
      const users = Array.isArray(res.data) ? res.data : [];
      return users.filter((u) => u.user_type === "corretor" || u.user_type === "admin");
    },
  });

  const [filters, setFilters] = useState<CrmLeadsFilters>({
    search: "",
    status: "all",
    assigned_user_id: "all",
    period: "all",
    sort: "recent",
    direction: "desc",
    tag_ids: [],
    is_hot: false,
    no_activity: false,
    no_contact_days: undefined,
  });

  const {
    data: leadsData,
    isLoading: isLoadingLeads,
  } = useCrmLeads(filters);
  const { data: metricsData } = useCrmMetrics(filters.period);

  const moveStageMutation = useMoveCrmLeadStage();

  const stages = useMemo(() => (stagesData ?? []).slice().sort((a, b) => a.order - b.order), [stagesData]);
  const leads  = useMemo(() => leadsData ?? [], [leadsData]);

  const tags     = useMemo(() => tagsData  ?? [], [tagsData]);
  const sources  = useMemo(() => sourcesData ?? [], [sourcesData]);
  const brokers  = useMemo(() => brokersData ?? [], [brokersData]);

  const [createLeadOpen, setCreateLeadOpen] = useState(false);

  const selectedTagIds = useMemo(() => filters.tag_ids ?? [], [filters.tag_ids]);
  const selectedTags   = useMemo(() => tags.filter((t) => selectedTagIds.includes(t.id)), [selectedTagIds, tags]);

  const handleToggleTagFilter = (tagId: number) => {
    setFilters((prev) => {
      const current = prev.tag_ids ?? [];
      const next = current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId];
      return { ...prev, tag_ids: next };
    });
  };

  const headerIsLoading = isLoadingStages || isLoadingLeads;

  // Algum filtro avançado (escondido sob "Mais filtros") está ativo? Serve para
  // marcar o botão e não esconder filtros ativos do usuário sem aviso.
  const hasAdvancedFilters =
    (filters.assigned_user_id ?? "all") !== "all" ||
    (filters.source_id ?? "all") !== "all" ||
    (filters.sort ?? "recent") !== "recent" ||
    (filters.direction ?? "desc") !== "desc" ||
    (filters.tag_ids?.length ?? 0) > 0 ||
    !!filters.is_hot ||
    !!filters.no_activity ||
    filters.no_contact_days != null;

  return (
    <>
      <TopNav title_secondary="CRM" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div />

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/dashboard/crm/analytics">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          {hasPermission("crm.manage") && (
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/dashboard/crm/config">
                <Settings2 className="h-4 w-4" />
                Configurações
              </Link>
            </Button>
          )}

          {hasPermission("crm.import") && (
            <Button variant="outline" className="gap-2" onClick={() => setImportOpen(true)}>
              <Upload className="h-4 w-4" />
              Importar
            </Button>
          )}

          <Button className="gap-2" onClick={() => setCreateLeadOpen(true)}>
            <Plus className="h-4 w-4" />
            Novo lead
          </Button>

          <NewLeadModal open={createLeadOpen} onOpenChange={setCreateLeadOpen} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#777777] font-medium">Total de leads</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold text-[#141414]">{metricsData?.total_leads ?? 0}</div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#777777] font-medium">Valor total</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold text-[#141414]">
              {formatCurrency(metricsData ? String(metricsData.total_value) : "0")}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#777777] font-medium">Taxa de conversão</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold text-[#141414]">{metricsData?.conversion_rate ?? 0}%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-100 shadow-sm rounded-2xl mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#777777]" />
              <Input
                className="pl-9"
                placeholder="Buscar por nome ou telefone…"
                value={filters.search ?? ""}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              />
            </div>

            <div>
              <Select
                value={filters.period ?? "all"}
                onValueChange={(v) => setFilters((p) => ({ ...p, period: v as CrmLeadsFilters["period"] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this_month">Este mês</SelectItem>
                  <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filters.status ?? "all"}
                onValueChange={(v) => setFilters((p) => ({ ...p, status: v as CrmLeadsFilters["status"] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="open">Em aberto</SelectItem>
                  <SelectItem value="won">Ganho</SelectItem>
                  <SelectItem value="lost">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showMoreFilters && (
            <>
            <div>
              <Select
                value={String(filters.assigned_user_id ?? "all")}
                onValueChange={(v) => setFilters((p) => ({ ...p, assigned_user_id: v === "all" ? "all" : Number(v) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos responsáveis</SelectItem>
                  {brokers.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={String(filters.source_id ?? "all")}
                onValueChange={(v) => setFilters((p) => ({ ...p, source_id: v === "all" ? "all" : Number(v) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas origens</SelectItem>
                  {sources.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-1">
              <Select value={filters.sort ?? "recent"} onValueChange={(v) => setFilters((p) => ({ ...p, sort: v as CrmLeadsFilters["sort"] }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="value">Valor</SelectItem>
                  <SelectItem value="priority">Prioridade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-1">
              <Select
                value={filters.direction ?? "desc"}
                onValueChange={(v) => setFilters((p) => ({ ...p, direction: v as CrmLeadsFilters["direction"] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ordem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Desc</SelectItem>
                  <SelectItem value="asc">Asc</SelectItem>
                </SelectContent>
              </Select>
            </div>
            </>
            )}

            {showMoreFilters && (
            <div className="md:col-span-4 flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Tags
                      {selectedTagIds.length > 0 && (
                        <Badge className="ml-1 bg-[#9747FF]/10 text-[#9747FF] border border-[#9747FF]/20">
                          {selectedTagIds.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72" align="start">
                    <DropdownMenuLabel>Filtrar por tags</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {tags.map((t) => (
                      <DropdownMenuCheckboxItem
                        key={t.id}
                        checked={selectedTagIds.includes(t.id)}
                        onCheckedChange={() => handleToggleTagFilter(t.id)}
                      >
                        {t.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                    {tags.length === 0 && <div className="px-2 py-3 text-sm text-[#777777]">Nenhuma tag cadastrada.</div>}
                  </DropdownMenuContent>
                </DropdownMenu>

                {selectedTags.map((t) => (
                  <Badge key={t.id} variant="secondary" className="rounded-full">
                    {t.name}
                  </Badge>
                ))}

                <Button
                  type="button"
                  variant={filters.is_hot ? "default" : "outline"}
                  size="sm"
                  className="gap-1"
                  onClick={() => setFilters((p) => ({ ...p, is_hot: !p.is_hot }))}
                  title="Leads em aberto sem contato há 3+ dias"
                >
                  🔥 Quente
                </Button>

                <Button
                  type="button"
                  variant={filters.no_activity ? "default" : "outline"}
                  size="sm"
                  className="gap-1"
                  onClick={() => setFilters((p) => ({ ...p, no_activity: !p.no_activity }))}
                  title="Leads sem atividades pendentes"
                >
                  Sem atividade
                </Button>

                <div className="flex items-center gap-1">
                  <Label className="text-xs text-[#777777]">Sem contato há</Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="-"
                    value={filters.no_contact_days ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFilters((p) => ({ ...p, no_contact_days: v === "" ? undefined : Number(v) }));
                    }}
                    className="h-9 w-16"
                  />
                  <span className="text-xs text-[#777777]">dias</span>
                </div>
              </div>
            </div>
            )}

            <div className="md:col-span-4 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2 text-[#555]"
                onClick={() => setShowMoreFilters((v) => !v)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showMoreFilters ? "Menos filtros" : "Mais filtros"}
                {!showMoreFilters && hasAdvancedFilters && (
                  <span className="h-2 w-2 rounded-full bg-[#9747FF]" title="Há filtros avançados ativos" />
                )}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showMoreFilters ? "rotate-180" : ""}`}
                />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() =>
                  setFilters({
                    search: "",
                    status: "all",
                    assigned_user_id: "all",
                    source_id: "all",
                    period: "all",
                    sort: "recent",
                    direction: "desc",
                    tag_ids: [],
                    is_hot: false,
                    no_activity: false,
                    no_contact_days: undefined,
                  })
                }
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ImportLeadsModal
        open={importOpen}
        onOpenChange={setImportOpen}
        stages={stages}
      />

      {isLoadingStages || isLoadingLeads ? (
        <KanbanSkeleton columns={Math.max(stages.length || 5, 4)} />
      ) : stages.length === 0 ? (
        <Card className="border border-gray-100 shadow-sm rounded-2xl w-full">
          <CardContent className="p-2">
            <EmptyState
              icon={<Settings2 className="h-6 w-6 text-[#9747FF]" />}
              title="Nenhuma etapa configurada"
              description="Crie as etapas do seu pipeline para começar a organizar seus leads."
            />
            <div className="flex justify-center pb-6">
              <Button asChild className="gap-2">
                <Link href="/dashboard/crm/config">
                  <Settings2 className="h-4 w-4" />
                  Ir para configurações
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : leads.length === 0 ? (
        <Card className="border border-gray-100 shadow-sm rounded-2xl w-full">
          <CardContent className="p-2">
            <EmptyState
              icon={<Users className="h-6 w-6 text-[#9747FF]" />}
              title="Nenhum lead encontrado"
              description="Ajuste os filtros acima ou cadastre o primeiro lead do seu pipeline."
            />
          </CardContent>
        </Card>
      ) : (
        <KanbanBoard
          stages={stages}
          leads={leads}
          onMove={(leadId, toStageId) => moveStageMutation.mutate({ id: leadId, to_stage_id: toStageId })}
        />
      )}
    </>
  );
}

