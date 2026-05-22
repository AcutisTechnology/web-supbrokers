"use client";

import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/shared/configs/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Filter, Plus, Search, Settings2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  CrmLeadsFilters,
  useCreateCrmLead,
  useCrmLeadSources,
  useCrmLeads,
  useCrmMetrics,
  useCrmPipelineStages,
  useCrmTags,
  useMoveCrmLeadStage,
} from "@/features/dashboard/crm/services/crm-service";
import { KanbanBoard } from "@/features/dashboard/crm/components/kanban-board";

type Broker = {
  id: number;
  name: string;
  user_type?: string | null;
};

const createLeadSchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  phone: z.string().min(1, "Informe o telefone"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  source_id: z.string().optional(),
  value: z.string().optional(),
  priority: z.enum(["1", "2", "3"]).default("2"),
  assigned_user_id: z.string().optional(),
  pipeline_stage_id: z.string().min(1, "Selecione a etapa"),
  notes: z.string().optional(),
  tag_ids: z.array(z.number()).optional(),
});

type CreateLeadFormValues = z.infer<typeof createLeadSchema>;

const formatCurrency = (value: string | null | undefined) => {
  const numeric = value ? Number(value) : 0;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number.isFinite(numeric) ? numeric : 0);
};


export default function CrmPage() {
  const { data: stagesData, isLoading: isLoadingStages } = useCrmPipelineStages();
  const { data: tagsData } = useCrmTags();

  const [filters, setFilters] = useState<CrmLeadsFilters>({
    search: "",
    status: "all",
    assigned_user_id: "all",
    period: "this_month",
    sort: "recent",
    direction: "desc",
    tag_ids: [],
    is_hot: false,
    no_activity: false,
    no_contact_days: undefined,
  });

  const { data: leadsData, isLoading: isLoadingLeads } = useCrmLeads(filters);
  const { data: metricsData } = useCrmMetrics(filters.period);

  const moveStageMutation = useMoveCrmLeadStage();
  const { data: sourcesData } = useCrmLeadSources();

  const stages = useMemo(() => (stagesData ?? []).slice().sort((a, b) => a.order - b.order), [stagesData]);
  const leads = useMemo(() => leadsData ?? [], [leadsData]);
  const tags = useMemo(() => tagsData ?? [], [tagsData]);
  const sources = useMemo(() => sourcesData ?? [], [sourcesData]);

  const { data: brokersData } = useQuery({
    queryKey: ["brokers", "list"],
    queryFn: async () => {
      const response = await api.get("users").json<{ data: Broker[] }>();
      const users = Array.isArray(response.data) ? response.data : ([] as Broker[]);
      return users.filter((u) => u.user_type === "corretor" || u.user_type === "admin");
    },
  });

  const brokers = useMemo(() => brokersData ?? [], [brokersData]);

  const createLeadMutation = useCreateCrmLead();
  const form = useForm<CreateLeadFormValues>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      source_id: "",
      value: "",
      priority: "2",
      assigned_user_id: "",
      pipeline_stage_id: "",
      notes: "",
      tag_ids: [],
    },
  });

  useEffect(() => {
    const current = form.getValues("pipeline_stage_id");
    if (!current && stages[0]?.id) {
      form.setValue("pipeline_stage_id", String(stages[0].id), { shouldValidate: true });
    }
  }, [form, stages]);

  const selectedTagIds = useMemo(() => filters.tag_ids ?? [], [filters.tag_ids]);
  const selectedTags = useMemo(() => tags.filter((t) => selectedTagIds.includes(t.id)), [selectedTagIds, tags]);

  const handleToggleTagFilter = (tagId: number) => {
    setFilters((prev) => {
      const current = prev.tag_ids ?? [];
      const next = current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId];
      return { ...prev, tag_ids: next };
    });
  };

  const submitCreateLead = form.handleSubmit(async (values) => {
    const parseValue = () => {
      const raw = (values.value ?? "").trim();
      if (!raw) return null;
      const cleaned = raw.replace(/\./g, "").replace(",", ".");
      const number = Number(cleaned);
      return Number.isFinite(number) ? number : null;
    };

    createLeadMutation.mutate({
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email?.trim() || null,
      source_id: values.source_id ? Number(values.source_id) : null,
      value: parseValue(),
      priority: Number(values.priority) as 1 | 2 | 3,
      assigned_user_id: values.assigned_user_id ? Number(values.assigned_user_id) : null,
      pipeline_stage_id: Number(values.pipeline_stage_id),
      notes: values.notes?.trim() || null,
      tag_ids: values.tag_ids ?? [],
    });
  });

  const headerIsLoading = isLoadingStages || isLoadingLeads;

  return (
    <>
      <TopNav title_secondary="CRM" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center mt-0.5">
            <Filter className="w-5 h-5 text-[#141414]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[#141414]">CRM de Leads</h1>
              {headerIsLoading ? (
                <span className="text-xs bg-gray-100 text-[#777777] px-3 py-1 rounded-full border border-gray-200">Carregando…</span>
              ) : (
                <span className="text-xs bg-gray-100 text-[#777777] px-3 py-1 rounded-full border border-gray-200">
                  {metricsData?.total_leads ?? 0} leads
                </span>
              )}
            </div>
            <p className="text-[#777777]">Organize seus leads em um pipeline e acompanhe o funil.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/dashboard/crm/config">
              <Settings2 className="h-4 w-4" />
              Configurações
            </Link>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Novo lead</DialogTitle>
              </DialogHeader>

              <form className="grid grid-cols-1 gap-4" onSubmit={submitCreateLead}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input {...form.register("name")} placeholder="Nome do lead" />
                    {form.formState.errors.name?.message && (
                      <div className="text-sm text-red-600">{form.formState.errors.name.message}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone (WhatsApp)</Label>
                    <Input {...form.register("phone")} placeholder="(00) 00000-0000" />
                    {form.formState.errors.phone?.message && (
                      <div className="text-sm text-red-600">{form.formState.errors.phone.message}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>E-mail (opcional)</Label>
                    <Input type="email" {...form.register("email")} placeholder="cliente@email.com" />
                    {form.formState.errors.email?.message && (
                      <div className="text-sm text-red-600">{form.formState.errors.email.message}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Valor estimado</Label>
                    <Input {...form.register("value")} placeholder="0,00" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Origem</Label>
                    <Select
                      value={form.watch("source_id") || "none"}
                      onValueChange={(v) => form.setValue("source_id", v === "none" ? "" : v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sem origem</SelectItem>
                        {sources.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Etapa</Label>
                    <Select value={form.watch("pipeline_stage_id")} onValueChange={(v) => form.setValue("pipeline_stage_id", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.pipeline_stage_id?.message && (
                      <div className="text-sm text-red-600">{form.formState.errors.pipeline_stage_id.message}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <Select value={form.watch("priority")} onValueChange={(v) => form.setValue("priority", v as "1" | "2" | "3")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Alta</SelectItem>
                        <SelectItem value="2">Média</SelectItem>
                        <SelectItem value="3">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Responsável</Label>
                    <Select
                      value={form.watch("assigned_user_id") || "none"}
                      onValueChange={(v) => form.setValue("assigned_user_id", v === "none" ? "" : v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sem responsável</SelectItem>
                        {brokers.map((b) => (
                          <SelectItem key={b.id} value={String(b.id)}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => {
                      const selected = (form.watch("tag_ids") ?? []).includes(t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          className={`px-3 py-1 rounded-full border text-xs transition-colors ${
                            selected ? "bg-[#9747FF]/10 border-[#9747FF]/20 text-[#9747FF]" : "bg-white border-gray-200 text-[#777777] hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            const current = form.getValues("tag_ids") ?? [];
                            const next = selected ? current.filter((id) => id !== t.id) : [...current, t.id];
                            form.setValue("tag_ids", next);
                          }}
                        >
                          {t.name}
                        </button>
                      );
                    })}
                    {tags.length === 0 && <div className="text-sm text-[#777777]">Cadastre tags em Configurações.</div>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea {...form.register("notes")} placeholder="Contexto, preferências, próximas ações..." />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button type="submit" disabled={createLeadMutation.isPending} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Criar lead
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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

            <div className="md:col-span-4 flex items-center justify-between gap-3 flex-wrap">
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

              <Button
                variant="ghost"
                className="gap-2"
                onClick={() =>
                  setFilters({
                    search: "",
                    status: "all",
                    assigned_user_id: "all",
                    source_id: "all",
                    period: "this_month",
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

      {isLoadingStages || isLoadingLeads ? (
        <div className="text-sm text-[#777777] py-12 text-center">Carregando pipeline...</div>
      ) : stages.length === 0 ? (
        <Card className="border border-gray-100 shadow-sm rounded-2xl w-full">
          <CardContent className="p-10 text-center">
            <div className="text-lg font-semibold text-[#141414] mb-2">Nenhuma etapa configurada</div>
            <div className="text-sm text-[#777777] max-w-md mx-auto">
              Crie as etapas do seu pipeline para começar.
            </div>
            <Button asChild className="mt-6 gap-2">
              <Link href="/dashboard/crm/config">
                <Settings2 className="h-4 w-4" />
                Ir para configurações
              </Link>
            </Button>
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

