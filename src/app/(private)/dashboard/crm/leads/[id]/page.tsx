"use client";

import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/shared/configs/api";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarCheck, CalendarClock, CheckCircle2, FileText, FileUp, History, Home, ListTodo, MessageCircle, MessageSquareText, PhoneCall, Phone, Tag, User2, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  CrmLeadInteraction,
  useCreateCrmLeadInteraction,
  useCrmLead,
  useCrmPipelineStages,
  useCrmTags,
  useMarkWonCrmLead,
  useMoveCrmLeadStage,
  useUpdateCrmLead,
  useUploadCrmLeadAttachment,
} from "@/features/dashboard/crm/services/crm-service";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadActivitiesPanel } from "@/features/dashboard/crm/components/lead-activities-panel";
import { LeadVisitsPanel } from "@/features/dashboard/crm/components/lead-visits-panel";
import { LeadPropertiesPanel } from "@/features/dashboard/crm/components/lead-properties-panel";
import { LeadProposalsPanel } from "@/features/dashboard/crm/components/lead-proposals-panel";
import { MarkLostDialog } from "@/features/dashboard/crm/components/mark-lost-dialog";
import { LogCallModal } from "@/features/dashboard/crm/components/log-call-modal";

type Broker = {
  id: number;
  name: string;
  user_type?: string | null;
};

const normalizePhoneDigits = (phone: string) => phone.replace(/\D/g, "");

const formatCurrency = (value: string | null | undefined) => {
  const numeric = value ? Number(value) : 0;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number.isFinite(numeric) ? numeric : 0);
};

const formatDateTime = (iso: string | null | undefined) => {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
};

const toDatetimeLocal = (iso: string | null | undefined) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function CrmLeadDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { isBroker } = useCurrentUser();

  const leadId = Number(params.id);
  const { data: lead, isLoading } = useCrmLead(leadId);
  const { data: stagesData } = useCrmPipelineStages();
  const { data: tagsData } = useCrmTags();

  const stages = useMemo(() => (stagesData ?? []).slice().sort((a, b) => a.order - b.order), [stagesData]);
  const tags = useMemo(() => tagsData ?? [], [tagsData]);

  const updateLeadMutation = useUpdateCrmLead(leadId);
  const moveStageMutation = useMoveCrmLeadStage();
  const markWonMutation = useMarkWonCrmLead();
  const createInteractionMutation = useCreateCrmLeadInteraction(leadId);
  const uploadAttachmentMutation = useUploadCrmLeadAttachment(leadId);

  const [markLostOpen, setMarkLostOpen] = useState(false);
  const [logCallOpen, setLogCallOpen] = useState(false);

  const [notesDraft, setNotesDraft] = useState("");
  const [followUpDraft, setFollowUpDraft] = useState("");

  const phoneDigits = lead?.phone ? normalizePhoneDigits(lead.phone) : "";
  const whatsappUrl = phoneDigits ? `https://wa.me/${phoneDigits}` : null;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: brokersData } = useQuery({
    queryKey: ["brokers", "list"],
    queryFn: async () => {
      const response = await api.get("users").json<{ data: Broker[] }>();
      const users = Array.isArray(response.data) ? response.data : ([] as Broker[]);
      return users.filter((u) => u.user_type === "corretor" || u.user_type === "admin");
    },
  });

  const brokers = useMemo(() => brokersData ?? [], [brokersData]);

  const timelineItems = useMemo(() => {
    const movements = (lead?.stage_movements ?? []).map((m) => ({
      id: `m-${m.id}`,
      created_at: m.created_at,
      kind: "movement" as const,
      title: "Movimentação",
      description: `${m.from_stage?.name ?? "Início"} → ${m.to_stage?.name ?? "-"}`,
    }));
    const interactions = (lead?.interactions ?? []).map((i) => ({
      id: `i-${i.id}`,
      created_at: i.created_at,
      kind: "interaction" as const,
      title: i.type === "whatsapp" ? "WhatsApp" : i.type === "call" ? "Ligação" : i.type === "email" ? "Email" : i.type === "meeting" ? "Reunião" : i.type === "visit" ? "Visita" : "Nota",
      description: i.description,
    }));
    const doneActivities = (lead?.activities ?? [])
      .filter((a) => a.is_done)
      .map((a) => ({
        id: `a-${a.id}`,
        created_at: a.done_at ?? a.scheduled_for ?? a.created_at,
        kind: "activity" as const,
        title: `Atividade concluída: ${a.title}`,
        description: a.description ?? "",
      }));
    return [...movements, ...interactions, ...doneActivities].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [lead?.interactions, lead?.stage_movements, lead?.activities]);

  const pendingActivities = useMemo(
    () => (lead?.activities ?? []).filter((a) => !a.is_done),
    [lead?.activities],
  );

  const callInteractions = useMemo(
    () => (lead?.interactions ?? []).filter((i) => i.type === "call").sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    ),
    [lead?.interactions],
  );

  const [interactionType, setInteractionType] = useState<CrmLeadInteraction["type"]>("note");
  const [interactionDescription, setInteractionDescription] = useState("");

  const handleSaveNotes = () => {
    updateLeadMutation.mutate({ notes: notesDraft || null, next_follow_up_at: followUpDraft ? new Date(followUpDraft).toISOString() : null });
  };

  const handleMoveStage = (toStageId: number) => {
    if (!lead) return;
    moveStageMutation.mutate({ id: lead.id, to_stage_id: toStageId });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAttachmentMutation.mutate(file);
    e.target.value = "";
  };

  if (!Number.isFinite(leadId) || leadId <= 0) {
    return (
      <>
        <TopNav title_secondary="CRM" />
        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardContent className="p-10 text-center text-[#777777]">Lead inválido.</CardContent>
        </Card>
      </>
    );
  }

  if (isLoading && !lead) {
    return (
      <>
        <TopNav title_secondary="CRM" />
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Skeleton className="h-64 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-2xl mb-4" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </>
    );
  }

  return (
    <>
      <TopNav title_secondary="CRM" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold text-[#141414] truncate">{lead?.name ?? "Carregando…"}</h1>
              {lead?.status && (
                <Badge className="bg-gray-100 text-[#777777] border border-gray-200">
                  {lead.status === "open" ? "Em aberto" : lead.status === "won" ? "Ganho" : "Perdido"}
                </Badge>
              )}
              {lead?.is_hot && (
                <Badge className="bg-[#FFEDD5] text-[#9A3412] border border-[#FED7AA]">Lead quente</Badge>
              )}
            </div>

            <div className="text-sm text-[#777777] mt-1 flex items-center gap-3 flex-wrap">
              {lead?.phone && (
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {lead.phone}
                </span>
              )}
              {lead?.assigned_user?.name && (
                <span className="inline-flex items-center gap-2">
                  <User2 className="h-4 w-4" />
                  {lead.assigned_user.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {whatsappUrl && (
            <Button asChild variant="outline" className="gap-2">
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          )}
          {lead && lead.status !== "won" && (
            <Button
              type="button"
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => markWonMutation.mutate(lead.id)}
              disabled={markWonMutation.isPending}
            >
              <CheckCircle2 className="h-4 w-4" />
              Marcar ganho
            </Button>
          )}
          {lead && lead.status !== "lost" && (
            <Button
              type="button"
              variant="outline"
              className="gap-2 text-rose-700 border-rose-200 hover:bg-rose-50"
              onClick={() => setMarkLostOpen(true)}
            >
              <XCircle className="h-4 w-4" />
              Marcar perdido
            </Button>
          )}
        </div>
      </div>

      <MarkLostDialog open={markLostOpen} onOpenChange={setMarkLostOpen} lead={lead ?? null} />
      <LogCallModal leadId={leadId} leadName={lead?.name} open={logCallOpen} onOpenChange={setLogCallOpen} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="border border-gray-100 shadow-sm rounded-2xl lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Etapa</Label>
                <Select value={lead?.pipeline_stage_id ? String(lead.pipeline_stage_id) : ""} onValueChange={(v) => handleMoveStage(Number(v))}>
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
              </div>

              <div className="space-y-2">
                <Label>Responsável</Label>
                {isBroker ? (
                  <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                    {lead?.assigned_user?.name ?? "—"}
                  </div>
                ) : (
                  <Select
                    value={lead?.assigned_user_id ? String(lead.assigned_user_id) : "none"}
                    onValueChange={(v) => updateLeadMutation.mutate({ assigned_user_id: v === "none" ? null : Number(v) })}
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
                )}
              </div>

              <div className="space-y-2">
                <Label>Valor estimado</Label>
                <Input
                  defaultValue={lead?.value ?? ""}
                  placeholder="0,00"
                  onBlur={(e) => {
                    const raw = e.target.value.trim();
                    if (!raw) {
                      updateLeadMutation.mutate({ value: null });
                      return;
                    }
                    const cleaned = raw.replace(/\./g, "").replace(",", ".");
                    const number = Number(cleaned);
                    if (!Number.isFinite(number)) {
                      toast({ title: "Valor inválido", variant: "destructive" });
                      return;
                    }
                    updateLeadMutation.mutate({ value: number });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select
                  value={lead?.priority ? String(lead.priority) : "2"}
                  onValueChange={(v) => updateLeadMutation.mutate({ priority: Number(v) as 1 | 2 | 3 })}
                >
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
            </div>

            <div className="mt-4">
              <Label>Tags</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((t) => {
                  const selected = (lead?.tags ?? []).some((x) => x.id === t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className={`px-3 py-1 rounded-full border text-xs transition-colors ${
                        selected ? "bg-[#9747FF]/10 border-[#9747FF]/20 text-[#9747FF]" : "bg-white border-gray-200 text-[#777777] hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        const current = (lead?.tags ?? []).map((x) => x.id);
                        const next = selected ? current.filter((id) => id !== t.id) : [...current, t.id];
                        updateLeadMutation.mutate({ tag_ids: next });
                      }}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Tag className="h-3 w-3" />
                        {t.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 text-sm text-[#777777] flex items-center justify-between gap-4 flex-wrap">
              <div>Criado: {formatDateTime(lead?.created_at)}</div>
              <div>Último contato: {formatDateTime(lead?.last_interaction_at)}</div>
              <div>Valor: {formatCurrency(lead?.value ?? null)}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Follow-up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Próximo lembrete</Label>
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-[#777777]" />
                <Input
                  type="datetime-local"
                  value={followUpDraft || toDatetimeLocal(lead?.next_follow_up_at)}
                  onChange={(e) => setFollowUpDraft(e.target.value)}
                />
              </div>
              <Button variant="outline" className="w-full mt-2" onClick={handleSaveNotes}>
                Salvar follow-up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline" className="gap-2">
            <History className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="calls" className="gap-2">
            <PhoneCall className="h-4 w-4" />
            Ligações
            {callInteractions.length > 0 && (
              <Badge className="ml-1 bg-[#9747FF]/10 text-[#9747FF] border border-[#9747FF]/20">
                {callInteractions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="activities" className="gap-2">
            <ListTodo className="h-4 w-4" />
            Atividades
            {pendingActivities.length > 0 && (
              <Badge className="ml-1 bg-[#9747FF]/10 text-[#9747FF] border border-[#9747FF]/20">
                {pendingActivities.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="visits" className="gap-2">
            <CalendarCheck className="h-4 w-4" />
            Visitas
          </TabsTrigger>
          <TabsTrigger value="properties" className="gap-2">
            <Home className="h-4 w-4" />
            Imóveis
            {(lead?.properties?.length ?? 0) > 0 && (
              <Badge className="ml-1 bg-[#9747FF]/10 text-[#9747FF] border border-[#9747FF]/20">
                {lead!.properties!.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="proposals" className="gap-2">
            <FileText className="h-4 w-4" />
            Propostas
            {(lead?.proposals?.length ?? 0) > 0 && (
              <Badge className="ml-1 bg-[#9747FF]/10 text-[#9747FF] border border-[#9747FF]/20">
                {lead!.proposals!.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <MessageSquareText className="h-4 w-4" />
            Observações
          </TabsTrigger>
          <TabsTrigger value="files" className="gap-2">
            <FileUp className="h-4 w-4" />
            Arquivos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border border-gray-100 shadow-sm rounded-2xl lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Linha do tempo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timelineItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl border border-gray-100">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold text-[#141414]">{item.title}</div>
                        <div className="text-xs text-[#777777]">{formatDateTime(item.created_at)}</div>
                      </div>
                      <div className="text-sm text-[#777777] mt-2 whitespace-pre-wrap">{item.description}</div>
                    </div>
                  ))}
                  {!isLoading && timelineItems.length === 0 && <div className="text-sm text-[#777777] py-6 text-center">Nenhuma interação registrada.</div>}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Registrar contato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={interactionType} onValueChange={(v) => setInteractionType(v as CrmLeadInteraction["type"])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="call">Ligação</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="note">Nota</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea value={interactionDescription} onChange={(e) => setInteractionDescription(e.target.value)} placeholder="Escreva um resumo do contato…" />
                  </div>

                  <Button
                    className="w-full"
                    disabled={createInteractionMutation.isPending || interactionDescription.trim().length === 0}
                    onClick={() => {
                      createInteractionMutation.mutate({ type: interactionType, description: interactionDescription.trim() });
                      setInteractionDescription("");
                    }}
                  >
                    Salvar interação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calls" className="mt-6">
          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Ligações registradas</CardTitle>
              <Button className="gap-2" onClick={() => setLogCallOpen(true)}>
                <PhoneCall className="h-4 w-4" />
                Registrar ligação
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {callInteractions.map((i) => (
                  <div key={i.id} className="p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-semibold text-[#141414]">
                        <PhoneCall className="h-4 w-4 text-[#9747FF]" />
                        Ligação
                      </div>
                      <div className="text-xs text-[#777777]">{formatDateTime(i.created_at)}</div>
                    </div>
                    <div className="text-sm text-[#777777] mt-2 whitespace-pre-wrap">{i.description}</div>
                  </div>
                ))}
                {!isLoading && callInteractions.length === 0 && (
                  <div className="text-sm text-[#777777] py-6 text-center">Nenhuma ligação registrada.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <LeadActivitiesPanel leadId={leadId} activities={lead?.activities ?? []} />
        </TabsContent>

        <TabsContent value="visits" className="mt-6">
          <LeadVisitsPanel leadId={leadId} />
        </TabsContent>

        <TabsContent value="properties" className="mt-6">
          <LeadPropertiesPanel leadId={leadId} />
        </TabsContent>

        <TabsContent value="proposals" className="mt-6">
          <LeadProposalsPanel proposals={lead?.proposals ?? []} />
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notesDraft || lead?.notes || ""}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Escreva observações e próximos passos…"
                className="min-h-[180px]"
              />
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setNotesDraft("")}>
                  Descartar
                </Button>
                <Button onClick={handleSaveNotes} disabled={updateLeadMutation.isPending}>
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Arquivos</CardTitle>
              <div className="flex items-center gap-2">
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                <Button className="gap-2" onClick={handleUploadClick}>
                  <FileUp className="h-4 w-4" />
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(lead?.attachments ?? []).map((a) => (
                  <a
                    key={a.id}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-[#141414] truncate">{a.name}</div>
                      <div className="text-xs text-[#777777] mt-1">
                        {a.mime_type ?? "arquivo"} • {a.size ? `${Math.round(a.size / 1024)} KB` : "-"} • {formatDateTime(a.created_at)}
                      </div>
                    </div>
                    <Badge variant="secondary">Abrir</Badge>
                  </a>
                ))}
                {!isLoading && (lead?.attachments ?? []).length === 0 && (
                  <div className="text-sm text-[#777777] py-6 text-center">Nenhum arquivo enviado.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
