"use client";

import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  Download,
  Filter,
  Image as ImageIcon,
  Layers,
  Loader2,
  MessageSquare,
  Pause,
  Pencil,
  Play,
  Plus,
  Send,
  Settings2,
  Trash2,
  Upload,
  Users,
  Video,
  Volume2,
  FileText,
  Link as LinkIcon,
  XCircle,
} from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  useBlastCrmContacts,
  useImportBlastSpreadsheet,
  useCreateBlastCampaign,
  useStartBlastCampaign,
  usePauseBlastCampaign,
  useBlastCampaignProgress,
  useUploadBlastMedia,
  useBlastCampaigns,
  type BlastContact,
} from "@/features/dashboard/disparo-em-massa/services/blast-service";
import { useWhatsappInstances } from "@/features/dashboard/whatsapp/services/whatsapp-service";

type StepKey = "contacts" | "actions" | "review" | "send" | "results";

type Contact = {
  id: string;
  name: string;
  phone: string;
  type: string;
  crm_lead_id?: number | null;
};

type ActionKind = "text" | "image" | "video" | "audio" | "document";

type CampaignAction = {
  id: string;
  kind: ActionKind;
  message: string;
  typingSeconds: number;
  waitNextSeconds: number;
  uniqueImagePreview: boolean;
  fileName: string | null;
  filePath: string | null;
  isUploading?: boolean;
};

const steps: { key: StepKey; label: string; icon: React.ElementType }[] = [
  { key: "contacts", label: "Contatos", icon: Users },
  { key: "actions", label: "Ações", icon: Settings2 },
  { key: "review", label: "Revisão", icon: ClipboardCheck },
  { key: "send", label: "Envio", icon: Send },
  { key: "results", label: "Resultados", icon: BarChart3 },
];

export default function NovaCampanhaDisparoEmMassaPage() {
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState<StepKey>("contacts");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Record<string, true>>({});
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isInternational, setIsInternational] = useState(false);
  const [ignoreNinthDigit, setIgnoreNinthDigit] = useState(false);
  const [selectedSpreadsheetFile, setSelectedSpreadsheetFile] = useState<File | null>(null);
  const [mediaPickerKind, setMediaPickerKind] = useState<ActionKind>("image");
  const [mediaPickerActionId, setMediaPickerActionId] = useState<string | null>(null);
  const mediaFileInputRef = useRef<HTMLInputElement | null>(null);
  const [actions, setActions] = useState<CampaignAction[]>([]);
  const [selectedActionId, setSelectedActionId] = useState<string>("");
  const [intervalSeconds, setIntervalSeconds] = useState<number>(10);
  const [pauseEveryContacts, setPauseEveryContacts] = useState<number>(10);
  const [pauseSeconds, setPauseSeconds] = useState<number>(60);
  const [disableSignature, setDisableSignature] = useState<boolean>(false);
  const [customSignatureName, setCustomSignatureName] = useState<boolean>(true);
  const [signatureName, setSignatureName] = useState<string>("");
  const [isPaused, setIsPaused] = useState<boolean>(true);

  // Campanha criada
  const [currentCampaignId, setCurrentCampaignId] = useState<number | null>(null);
  const [selectedInstanceId, setSelectedInstanceId] = useState<number | null>(null);
  const [campaignName, setCampaignName] = useState<string>(`Campanha ${new Date().toLocaleDateString("pt-BR")}`);

  // Contatos importados via planilha (adicionados à lista existente de CRM)
  const [importedContacts, setImportedContacts] = useState<Contact[]>([]);

  // API hooks
  const { data: crmContacts = [], isLoading: isLoadingContacts } = useBlastCrmContacts();
  const { data: instances = [] } = useWhatsappInstances();
  const { data: campaigns = [] } = useBlastCampaigns();
  const importSpreadsheet = useImportBlastSpreadsheet();
  const createCampaign = useCreateBlastCampaign();
  const startCampaign = useStartBlastCampaign();
  const pauseCampaign = usePauseBlastCampaign();
  const uploadMedia = useUploadBlastMedia();

  // Progress polling — ativo apenas na etapa de envio
  const { data: progressData } = useBlastCampaignProgress(
    currentCampaignId,
    activeStep === "send"
  );

  // Sincroniza progresso real com estado local
  useEffect(() => {
    if (!progressData) return;
    if (progressData.status === "paused") setIsPaused(true);
    if (progressData.status === "running") setIsPaused(false);
    if (progressData.status === "completed") {
      toast({ title: "Campanha concluída!", description: "Todos os contatos foram processados." });
    }
  }, [progressData, toast]);

  // Contatos consolidados: CRM + importados
  const contacts = useMemo<Contact[]>(() => {
    const crmMapped: Contact[] = (crmContacts as BlastContact[]).map((c) => ({
      id: String(c.id),
      name: c.name,
      phone: c.phone,
      type: c.type,
      crm_lead_id: c.crm_lead_id ?? null,
    }));
    return [...crmMapped, ...importedContacts];
  }, [crmContacts, importedContacts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q));
  }, [contacts, search]);

  const selectedList = useMemo(() => {
    const selected = new Set(Object.keys(selectedIds));
    return contacts.filter((c) => selected.has(c.id));
  }, [contacts, selectedIds]);

  // Métricas de progresso (API > local state)
  const processedContacts = progressData?.contacts_processed ?? 0;
  const sentContacts = progressData?.contacts_sent ?? 0;
  const failedContacts = progressData?.contacts_failed ?? 0;

  const handleToggleAll = () => {
    if (filtered.length === 0) return;
    const allSelected = filtered.every((c) => !!selectedIds[c.id]);
    if (allSelected) {
      const next = { ...selectedIds };
      filtered.forEach((c) => { delete next[c.id]; });
      setSelectedIds(next);
      return;
    }
    const next = { ...selectedIds };
    filtered.forEach((c) => { next[c.id] = true; });
    setSelectedIds(next);
  };

  const handleToggleOne = (id: string) => {
    setSelectedIds((prev) => {
      if (prev[id]) { const next = { ...prev }; delete next[id]; return next; }
      return { ...prev, [id]: true };
    });
  };

  const handleClearSelected = () => setSelectedIds({});
  const handleRemoveSelected = (id: string) => {
    setSelectedIds((prev) => { const next = { ...prev }; delete next[id]; return next; });
  };

  const handleAddContact = () => {
    toast({ title: "Em breve", description: "A adição manual de contatos será disponibilizada em breve." });
  };

  const handleOpenFilters = () => {
    toast({ title: "Em breve", description: "Filtros avançados serão disponibilizados em breve." });
  };

  const handleOpenGroups = () => {
    toast({ title: "Em breve", description: "Agrupamentos serão disponibilizados em breve." });
  };

  const handleExportSelected = () => {
    toast({ title: "Em breve", description: "Exportação de contatos selecionados será disponibilizada em breve." });
  };

  const openImportModal = () => setIsImportModalOpen(true);
  const openTemplateModal = () => { setIsImportModalOpen(false); setIsTemplateModalOpen(true); };

  const handleSpreadsheetFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedSpreadsheetFile(file);
  };

  const handleConfirmImport = async () => {
    if (!selectedSpreadsheetFile) {
      toast({ title: "Selecione um arquivo", description: "Escolha um arquivo CSV, XLSX ou XLS para importar.", variant: "destructive" });
      return;
    }
    try {
      const result = await importSpreadsheet.mutateAsync(selectedSpreadsheetFile);
      const newContacts: Contact[] = result.data.map((c, i) => ({
        id: `imported-${Date.now()}-${i}`,
        name: c.name,
        phone: c.phone,
        type: "Importado",
      }));
      setImportedContacts((prev) => [...prev, ...newContacts]);
      setIsImportModalOpen(false);
      toast({ title: `${result.total} contatos importados`, description: "Contatos adicionados à lista." });
    } catch {
      toast({ title: "Erro na importação", description: "Verifique o formato do arquivo.", variant: "destructive" });
    }
  };

  const getAcceptByKind = (kind: ActionKind) => {
    if (kind === "image") return "image/*";
    if (kind === "video") return "video/*";
    if (kind === "audio") return "audio/*";
    if (kind === "document") return ".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt";
    return "";
  };

  const openMediaPicker = (actionId: string, kind: ActionKind) => {
    if (kind === "text") return;
    setMediaPickerActionId(actionId);
    setMediaPickerKind(kind);
    const accept = getAcceptByKind(kind);
    if (mediaFileInputRef.current) {
      mediaFileInputRef.current.accept = accept;
      mediaFileInputRef.current.value = "";
      mediaFileInputRef.current.click();
    }
  };

  const addAction = (kind: ActionKind) => {
    const id = `a${Date.now()}`;
    const next: CampaignAction = {
      id, kind, message: "", typingSeconds: 5, waitNextSeconds: 5,
      uniqueImagePreview: false, fileName: null, filePath: null,
    };
    setActions((prev) => [...prev, next]);
    setSelectedActionId(id);
    if (kind !== "text") openMediaPicker(id, kind);
  };

  const removeAction = (id: string) => {
    setActions((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (selectedActionId === id) setSelectedActionId(next[0]?.id ?? "");
      return next;
    });
  };

  const updateAction = (id: string, patch: Partial<CampaignAction>) => {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const selectedAction = actions.find((a) => a.id === selectedActionId) ?? actions[0] ?? null;

  const estimatedSeconds = useMemo(() => {
    const actionsSeconds = actions.reduce((acc, a) => acc + (a.typingSeconds ?? 0) + (a.waitNextSeconds ?? 0), 0);
    const perContact = actionsSeconds + (intervalSeconds ?? 0);
    const contactsCount = selectedList.length;
    const pauses = pauseEveryContacts > 0 ? Math.floor(contactsCount / pauseEveryContacts) : 0;
    const pausesSeconds = pauses * (pauseSeconds ?? 0);
    return perContact * contactsCount + pausesSeconds;
  }, [actions, intervalSeconds, pauseEveryContacts, pauseSeconds, selectedList.length]);

  const formatDuration = (totalSeconds: number) => {
    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "~0s";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    if (minutes <= 0) return `~${seconds}s`;
    if (seconds === 0) return `~${minutes}m`;
    return `~${minutes}m ${seconds}s`;
  };

  const stepTitle =
    activeStep === "contacts" ? "Selecionar destinatários"
    : activeStep === "actions" ? "Componha suas ações"
    : activeStep === "review" ? "Revise e confirme"
    : activeStep === "send" ? (isPaused ? "Campanha Pausada" : "Campanha em Execução")
    : "Resultados";

  const stepSubtitle =
    activeStep === "contacts" ? "Escolha para quem você deseja enviar a mensagem"
    : activeStep === "actions" ? "Adicione uma ou mais ações que serão executadas em sequência"
    : activeStep === "review" ? "Verifique os detalhes antes de executar as ações"
    : activeStep === "send" ? "Continue de onde parou"
    : "Resumo e histórico de execuções";

  const handleMediaFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const actionId = mediaPickerActionId ?? selectedAction?.id;
    if (!actionId) return;

    updateAction(actionId, { fileName: file.name, isUploading: true });

    try {
      const result = await uploadMedia.mutateAsync(file);
      updateAction(actionId, { fileName: result.file_name, filePath: result.file_path, isUploading: false });
    } catch {
      toast({ title: "Erro no upload", description: "Não foi possível enviar o arquivo.", variant: "destructive" });
      updateAction(actionId, { isUploading: false });
    }
  };

  // Cria e inicia a campanha ao clicar em Executar
  const handleExecutar = async () => {
    if (!selectedInstanceId) {
      toast({ title: "Selecione uma instância", description: "Escolha um WhatsApp conectado para enviar a campanha.", variant: "destructive" });
      return;
    }
    if (actions.some((a) => a.isUploading)) {
      toast({ title: "Aguarde o upload", description: "Ainda há arquivos sendo enviados.", variant: "destructive" });
      return;
    }

    try {
      const campaign = await createCampaign.mutateAsync({
        name: campaignName,
        whatsapp_instance_id: selectedInstanceId,
        interval_seconds: intervalSeconds,
        pause_every_contacts: pauseEveryContacts,
        pause_seconds: pauseSeconds,
        disable_signature: disableSignature,
        custom_signature_name: customSignatureName,
        signature_name: customSignatureName ? signatureName : null,
        contacts: selectedList.map((c) => ({ name: c.name, phone: c.phone, crm_lead_id: c.crm_lead_id ?? null })),
        actions: actions.map((a) => ({
          kind: a.kind,
          message: a.message || null,
          file_path: a.filePath,
          file_name: a.fileName,
          typing_seconds: a.typingSeconds,
          wait_next_seconds: a.waitNextSeconds,
          unique_image_preview: a.uniqueImagePreview,
        })),
      });

      setCurrentCampaignId(campaign.id);

      await startCampaign.mutateAsync(campaign.id);
      setIsPaused(false);
      setActiveStep("send");
    } catch {
      toast({ title: "Erro ao criar campanha", description: "Verifique sua instância e tente novamente.", variant: "destructive" });
    }
  };

  const handleTogglePause = async () => {
    if (!currentCampaignId) {
      setIsPaused((v) => !v);
      return;
    }
    try {
      if (!isPaused) {
        await pauseCampaign.mutateAsync(currentCampaignId);
        setIsPaused(true);
      } else {
        await startCampaign.mutateAsync(currentCampaignId);
        setIsPaused(false);
      }
    } catch {
      toast({ title: "Erro", description: "Não foi possível alterar o estado da campanha.", variant: "destructive" });
    }
  };

  const isExecuting = createCampaign.isPending || startCampaign.isPending;

  return (
    <>
      <TopNav title_secondary="Disparo" />

      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#141414]">{stepTitle}</h1>
            <p className="text-[#777777]">{stepSubtitle}</p>
          </div>
        </div>

        <div className="mt-5 bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-3">
          <div className="flex items-center justify-center gap-6">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = activeStep === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActiveStep(s.key)}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors",
                    isActive ? "text-[#9747FF]" : "text-[#777777] hover:text-[#141414]"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-[#9747FF]" : "text-[#777777]")} />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeStep === "contacts" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-3 border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contatos Salvos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 w-full" onClick={handleOpenFilters}>
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
                <Button variant="outline" size="sm" className="gap-2 w-full" onClick={handleOpenGroups}>
                  <Layers className="h-4 w-4" />
                  Agrupamentos
                </Button>
              </div>
              <div className="space-y-1">
                {["Inbox", "Etiquetas", "Grupos", "Contatos de grupos", "CRMs / Abas", "Perfil do contato", "Importar planilha"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-xl text-sm text-[#141414] hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      label === "Importar planilha"
                        ? openImportModal()
                        : toast({ title: "Em breve", description: `A seção "${label}" será disponibilizada em breve.` })
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Button variant="outline" className="w-full" onClick={handleExportSelected}>
                Exportar Contatos Selecionados (.XLSX)
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-6 border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pesquisar por nome ou número"
                    className="pl-4 h-11 rounded-xl"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={handleToggleAll}>
                  Selecionar tudo
                </Button>
              </div>
              <div className="text-xs text-[#777777] mt-2">
                {isLoadingContacts ? (
                  <span className="flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Carregando contatos...</span>
                ) : (
                  `${filtered.length} destinatários disponíveis • ${selectedList.length} selecionados`
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="max-h-[420px] overflow-auto">
                  {filtered.length === 0 ? (
                    <div className="py-16 text-center text-sm text-[#777777]">
                      {isLoadingContacts ? "Carregando..." : "Nenhum contato encontrado."}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filtered.map((c) => {
                        const checked = !!selectedIds[c.id];
                        const initials = c.name.trim().slice(0, 1).toUpperCase();
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleToggleOne(c.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                          >
                            <Checkbox checked={checked} onCheckedChange={() => handleToggleOne(c.id)} />
                            <div className="w-8 h-8 rounded-full bg-[#9747FF]/10 text-[#9747FF] flex items-center justify-center text-sm font-semibold">
                              {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-[#141414] truncate">{c.name}</div>
                              <div className="text-xs text-[#777777]">Tipo: {c.type}</div>
                            </div>
                            <div className="text-xs text-[#777777]">{c.phone}</div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">Destinatários selecionados</CardTitle>
                  <p className="text-xs text-[#777777]">{selectedList.length} destinatários</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleAddContact}>
                  <Plus className="h-4 w-4" />
                  Adicionar contato
                </Button>
              </div>
              <div className="flex items-center justify-end">
                <Button variant="ghost" size="sm" className="text-[#777777]" onClick={handleClearSelected}>
                  Limpar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="max-h-[360px] overflow-auto">
                  {selectedList.length === 0 ? (
                    <div className="py-14 text-center text-sm text-[#777777] px-6">
                      Selecione contatos para adicionar à campanha.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {selectedList.map((c) => {
                        const initials = c.name.trim().slice(0, 1).toUpperCase();
                        return (
                          <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                            <div className="w-7 h-7 rounded-full bg-[#9747FF]/10 text-[#9747FF] flex items-center justify-center text-xs font-semibold">
                              {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-[#141414] truncate">{c.name}</div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveSelected(c.id)}>
                              Remover
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => toast({ title: "Em breve", description: "A criação de agrupamento será disponibilizada em breve." })}
                variant="outline"
              >
                Criar Agrupamento
              </Button>
              <Button className="w-full mt-3" onClick={() => setActiveStep("actions")} disabled={selectedList.length === 0}>
                Próximo
              </Button>
            </CardContent>
          </Card>
        </div>

      ) : activeStep === "actions" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-3 border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <Tabs defaultValue="acoes">
                <TabsList className="w-full bg-gray-100">
                  <TabsTrigger value="acoes" className="flex-1">Ações</TabsTrigger>
                  <TabsTrigger value="rapidas" className="flex-1">Respostas Rápidas</TabsTrigger>
                </TabsList>
                <TabsContent value="acoes" className="mt-4">
                  <div className="text-sm font-medium text-[#141414] mb-3">Enviar Mensagem</div>
                  <div className="space-y-1">
                    {(["text", "image", "video", "audio", "document"] as ActionKind[]).map((kind) => {
                      const icons: Record<ActionKind, React.ElementType> = {
                        text: MessageSquare, image: ImageIcon, video: Video, audio: Volume2, document: FileText,
                      };
                      const labels: Record<ActionKind, string> = {
                        text: "Texto", image: "Imagem", video: "Vídeo", audio: "Áudio", document: "Documentos",
                      };
                      const Icon = icons[kind];
                      return (
                        <button
                          key={kind}
                          type="button"
                          onClick={() => addAction(kind)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#141414] hover:bg-gray-50 transition-colors"
                        >
                          <Icon className="h-4 w-4 text-[#777777]" />
                          {labels[kind]}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => toast({ title: "Em breve", description: "Link com banner em desenvolvimento." })}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#141414] hover:bg-gray-50 transition-colors"
                    >
                      <LinkIcon className="h-4 w-4 text-[#777777]" />
                      Link com Banner
                    </button>
                  </div>
                </TabsContent>
                <TabsContent value="rapidas" className="mt-4">
                  <div className="text-sm text-[#777777]">Em breve.</div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>

          <Card className="lg:col-span-6 border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Em sequência</CardTitle>
            </CardHeader>
            <CardContent>
              {actions.length === 0 ? (
                <div className="h-[520px] rounded-2xl border border-gray-100 bg-white flex items-center justify-center text-center px-10">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Settings2 className="h-6 w-6 text-[#777777]" />
                    </div>
                    <div className="font-medium text-[#141414] mb-1">Selecione uma ação</div>
                    <div className="text-sm text-[#777777]">Clique em uma ação do lado esquerdo para adicionar na sequência</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[520px] overflow-auto pr-1">
                  {actions.map((a) => {
                    const isSelected = a.id === selectedAction?.id;
                    return (
                      <div
                        key={a.id}
                        className={cn(
                          "rounded-2xl border p-4 transition-colors",
                          isSelected ? "border-[#9747FF] bg-[#9747FF]/5" : "border-gray-100 bg-white"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <button type="button" className="text-left" onClick={() => setSelectedActionId(a.id)}>
                            <div className="text-sm font-semibold text-[#141414]">
                              {a.kind === "image" ? "Criar Mensagem de Imagem"
                               : a.kind === "video" ? "Criar Mensagem de Vídeo"
                               : a.kind === "audio" ? "Criar Mensagem de Áudio"
                               : a.kind === "document" ? "Criar Mensagem de Documento"
                               : "Criar Mensagem de Texto"}
                            </div>
                            <div className="text-xs text-[#777777]">Ação {actions.findIndex((x) => x.id === a.id) + 1}</div>
                          </button>
                          <Button variant="ghost" size="sm" onClick={() => removeAction(a.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {isSelected && (
                          <div className="mt-4 space-y-4">
                            {a.kind === "text" ? (
                              <>
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-sm text-[#141414]">Exibir para o cliente que a mensagem está sendo digitada por</div>
                                  <div className="flex items-center gap-2">
                                    <Input type="number" value={a.typingSeconds} onChange={(e) => updateAction(a.id, { typingSeconds: Number(e.target.value || 0) })} className="w-20 h-9" />
                                    <span className="text-sm text-[#141414]">Segundos</span>
                                  </div>
                                </div>
                                <Textarea placeholder="Digite o texto" value={a.message} onChange={(e) => updateAction(a.id, { message: e.target.value })} />
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-sm text-[#141414]">Aguarde para chamar a próxima ação por</div>
                                  <div className="flex items-center gap-2">
                                    <Input type="number" value={a.waitNextSeconds} onChange={(e) => updateAction(a.id, { waitNextSeconds: Number(e.target.value || 0) })} className="w-20 h-9" />
                                    <span className="text-sm text-[#141414]">Segundos</span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="h-56 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center">
                                  <div className="text-center">
                                    {a.isUploading ? (
                                      <><Loader2 className="h-10 w-10 text-[#9747FF] mx-auto animate-spin" /><div className="text-sm text-[#777777] mt-2">Enviando...</div></>
                                    ) : a.kind === "image" ? (
                                      <ImageIcon className="h-10 w-10 text-[#777777] mx-auto" />
                                    ) : a.kind === "video" ? (
                                      <Video className="h-10 w-10 text-[#777777] mx-auto" />
                                    ) : a.kind === "audio" ? (
                                      <Volume2 className="h-10 w-10 text-[#777777] mx-auto" />
                                    ) : (
                                      <FileText className="h-10 w-10 text-[#777777] mx-auto" />
                                    )}
                                    {!a.isUploading && (
                                      <>
                                        <div className="text-sm text-[#777777] mt-2">{a.fileName ? a.fileName : "Nenhum arquivo selecionado"}</div>
                                        <Button variant="outline" className="mt-3 gap-2" onClick={() => openMediaPicker(a.id, a.kind)}>
                                          <Upload className="h-4 w-4" />
                                          Selecionar arquivos
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                                {a.kind === "image" && (
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm text-[#141414]">Imagem com visualização única</div>
                                    <Switch checked={a.uniqueImagePreview} onCheckedChange={(v) => updateAction(a.id, { uniqueImagePreview: !!v })} />
                                  </div>
                                )}
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-sm text-[#141414]">Exibir para o cliente que a mensagem está sendo digitada por</div>
                                  <div className="flex items-center gap-2">
                                    <Input type="number" value={a.typingSeconds} onChange={(e) => updateAction(a.id, { typingSeconds: Number(e.target.value || 0) })} className="w-20 h-9" />
                                    <span className="text-sm text-[#141414]">Segundos</span>
                                  </div>
                                </div>
                                <Textarea placeholder="Digite o texto" value={a.message} onChange={(e) => updateAction(a.id, { message: e.target.value })} />
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-sm text-[#141414]">Aguarde para chamar a próxima ação por</div>
                                  <div className="flex items-center gap-2">
                                    <Input type="number" value={a.waitNextSeconds} onChange={(e) => updateAction(a.id, { waitNextSeconds: Number(e.target.value || 0) })} className="w-20 h-9" />
                                    <span className="text-sm text-[#141414]">Segundos</span>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Pré-visualização do fluxo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-[#F4F6FF] p-4">
                <div className="space-y-2">
                  {actions.length === 0 ? (
                    <div className="text-sm text-[#777777] text-center py-10">Adicione ações para visualizar o fluxo.</div>
                  ) : (
                    actions.map((a, idx) => (
                      <div key={a.id} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#2B66FF] text-white flex items-center justify-center text-xs font-semibold">{idx + 1}</div>
                        <div className="flex-1 rounded-xl bg-white border border-gray-100 px-3 py-2 text-sm text-[#141414]">
                          {a.kind === "image" ? "📷 Imagem"
                           : a.kind === "video" ? "🎥 Vídeo"
                           : a.kind === "audio" ? "🔊 Áudio"
                           : a.kind === "document" ? "📄 Documento"
                           : a.message?.trim() ? a.message : "Mensagem de texto"}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#141414]">Intervalo (s)</span>
                  <Input type="number" className="w-28 h-9" value={intervalSeconds} onChange={(e) => setIntervalSeconds(Number(e.target.value || 0))} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#141414]">Pausa (a cada X envios)</span>
                  <Input type="number" className="w-28 h-9" value={pauseEveryContacts} onChange={(e) => setPauseEveryContacts(Number(e.target.value || 0))} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#141414]">Tempo de pausa (s)</span>
                  <Input type="number" className="w-28 h-9" value={pauseSeconds} onChange={(e) => setPauseSeconds(Number(e.target.value || 0))} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#141414]">Desativar assinatura</span>
                  <Switch checked={disableSignature} onCheckedChange={(v) => setDisableSignature(!!v)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#141414]">Personalizar o nome da assinatura</span>
                  <Switch checked={customSignatureName} onCheckedChange={(v) => setCustomSignatureName(!!v)} />
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-[#777777]">Nome da assinatura</span>
                  <Input value={signatureName} onChange={(e) => setSignatureName(e.target.value)} disabled={!customSignatureName} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => setActiveStep("contacts")}>Voltar</Button>
                <Button onClick={() => setActiveStep("review")} disabled={actions.length === 0}>Próximo</Button>
              </div>
            </CardContent>
          </Card>
        </div>

      ) : activeStep === "review" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-[#141414]" />
                    <CardTitle className="text-base">Sequência de Ações</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveStep("actions")}>
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {actions.length === 0 ? (
                  <div className="text-sm text-[#777777]">Nenhuma ação adicionada.</div>
                ) : (
                  <div className="space-y-2">
                    {actions.map((a, idx) => (
                      <div key={a.id} className="border border-gray-100 rounded-xl px-4 py-3 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#2B66FF] text-white flex items-center justify-center text-xs font-semibold">{idx + 1}</div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#141414]">
                            {a.kind === "text" ? "Mensagem de Texto"
                             : a.kind === "image" ? "Mensagem de Imagem"
                             : a.kind === "video" ? "Mensagem de Vídeo"
                             : a.kind === "audio" ? "Mensagem de Áudio"
                             : "Mensagem de Documento"}
                          </div>
                          <div className="text-xs text-[#777777]">
                            {a.kind === "text"
                              ? a.message?.trim() ? `Prévia: ${a.message.trim()}` : "Envie uma mensagem de texto para o contato."
                              : a.fileName ? `Arquivo: ${a.fileName}` : "Selecione um arquivo para esta ação."}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t border-gray-100 pt-4 text-sm text-[#141414] flex items-center justify-between">
                  <div>
                    <div>Total de Ações:</div>
                    <div className="text-[#777777]">Tempo Estimado:</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{actions.length}</div>
                    <div className="text-[#777777]">{formatDuration(estimatedSeconds)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#141414]" />
                    <CardTitle className="text-base">Destinatários</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveStep("contacts")}>
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <div className="font-semibold text-[#141414]">{selectedList.length} contatos selecionados</div>
                  <div className="text-[#777777]">De um total de {contacts.length} contatos</div>
                </div>
                {selectedList.length === 0 ? (
                  <div className="text-sm text-[#777777]">Nenhum destinatário selecionado.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {selectedList.map((c) => {
                      const initials = c.name.trim().slice(0, 1).toUpperCase();
                      return (
                        <div key={c.id} className="border border-gray-100 rounded-xl px-3 py-2 flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs font-semibold">{initials}</div>
                          <div className="text-sm font-medium text-[#141414] truncate">{c.name}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Configurações da campanha */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Configurações da Campanha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#141414]">Nome da campanha</label>
                  <Input
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Ex: Campanha de Lançamento"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#141414]">Instância WhatsApp</label>
                  <select
                    className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm bg-white"
                    value={selectedInstanceId ?? ""}
                    onChange={(e) => setSelectedInstanceId(e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">Selecione uma instância...</option>
                    {instances
                      .filter((i) => i.status === "connected")
                      .map((i) => (
                        <option key={i.id} value={i.id}>{i.display_name}</option>
                      ))}
                  </select>
                  {instances.filter((i) => i.status === "connected").length === 0 && (
                    <p className="text-xs text-red-500">
                      Nenhuma instância conectada. Conecte um WhatsApp antes de executar.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setActiveStep("actions")}>Voltar</Button>
            <Button
              onClick={handleExecutar}
              disabled={actions.length === 0 || selectedList.length === 0 || isExecuting || !selectedInstanceId}
            >
              {isExecuting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Criando...</> : "Executar"}
            </Button>
          </div>
        </div>

      ) : activeStep === "send" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-9 border border-gray-100 shadow-sm rounded-2xl">
            <CardContent className="p-0">
              <div className="p-6 border-b border-gray-100 flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#141414]">Progresso</div>
                  <div className="text-xs text-[#777777] mt-1">
                    {Math.min(100, Math.round((processedContacts / Math.max(1, selectedList.length)) * 100))}%
                  </div>
                </div>
                <div className="text-sm text-[#777777]">{processedContacts}/{Math.max(1, selectedList.length)}</div>
              </div>

              <div className="px-6 py-4 border-b border-gray-100">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-green-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (processedContacts / Math.max(1, selectedList.length)) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-100">
                <div className="p-6 text-center border-b md:border-b-0 md:border-r border-gray-100">
                  <div className="text-3xl font-semibold text-[#141414]">{processedContacts}</div>
                  <div className="text-xs text-[#777777] mt-1">CONTATOS PROCESSADOS</div>
                </div>
                <div className="p-6 text-center border-b md:border-b-0 md:border-r border-gray-100">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div className="text-3xl font-semibold text-[#141414]">{sentContacts}</div>
                  </div>
                  <div className="text-xs text-[#777777] mt-1">CONTATOS ENVIADOS</div>
                </div>
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div className="text-3xl font-semibold text-[#141414]">{failedContacts}</div>
                  </div>
                  <div className="text-xs text-[#777777] mt-1">FALHAS</div>
                </div>
              </div>

              <div className="p-6">
                <div className="text-sm font-semibold text-[#141414] mb-3">Configurações de Envio</div>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2 text-[#141414]">
                    <Clock className="h-4 w-4 text-[#2B66FF]" />
                    <span>Intervalo entre contatos</span>
                    <span className="font-semibold">{intervalSeconds}s</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#141414]">
                    <Pause className="h-4 w-4 text-[#F59E0B]" />
                    <span>Pausa automática a cada {pauseEveryContacts} Contato</span>
                    <span className="font-semibold">• {pauseSeconds}s</span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex items-center justify-center">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleTogglePause}
                  disabled={startCampaign.isPending || pauseCampaign.isPending}
                >
                  {startCampaign.isPending || pauseCampaign.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isPaused ? (
                    <Play className="h-4 w-4" />
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                  {isPaused ? "Continuar" : "Pausar"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Contatos</CardTitle>
                <div className="text-sm text-[#777777]">{selectedList.length}</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[520px] overflow-auto">
                {selectedList.map((c, idx) => {
                  const initials = c.name.trim().slice(0, 1).toUpperCase();
                  const isCurrent = idx === processedContacts && !isPaused;
                  const isDone = idx < processedContacts;
                  return (
                    <div key={c.id} className={cn("px-4 py-3 flex items-center gap-3", isCurrent ? "bg-green-50" : "")}>
                      <div className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-semibold">{initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#141414] truncate">{c.name}</div>
                      </div>
                      {isDone && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-12">
            <div className="rounded-xl bg-[#FACC15] text-[#141414] px-4 py-3 flex items-center justify-between">
              <div className="text-sm font-medium">
                {isPaused ? "Pausado" : "Em execução"} • Contato {Math.min(processedContacts + 1, selectedList.length)} de {selectedList.length} • Ação:{" "}
                {actions[0]?.kind === "text" ? "Mensagem de Texto" : "Mensagem"} (1/{Math.max(1, actions.length)})
              </div>
              <Button variant="outline" onClick={() => setActiveStep("results")}>
                Ver Resultados
              </Button>
            </div>
          </div>
        </div>

      ) : activeStep === "results" ? (
        <div className="space-y-6">
          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#141414]" />
                <CardTitle className="text-base">Resumo Geral</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-semibold text-[#2B66FF]">{campaigns.length}</div>
                  <div className="text-sm font-semibold text-[#141414] mt-1">Campanhas</div>
                  <div className="text-xs text-[#777777] mt-1">Total de campanhas criadas.</div>
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-3xl font-semibold text-[#2B66FF]">{selectedList.length}</div>
                  <div className="text-sm font-semibold text-[#141414] mt-1">Total de Contatos</div>
                  <div className="text-xs text-[#777777] mt-1">Contatos processados nesta campanha.</div>
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                    <Send className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="text-3xl font-semibold text-[#2B66FF]">{sentContacts}</div>
                  <div className="text-sm font-semibold text-[#141414] mt-1">Ações Enviadas</div>
                  <div className="text-xs text-[#777777] mt-1">Número total de ações enviadas.</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#141414]" />
                  <CardTitle className="text-base">Histórico de Campanhas</CardTitle>
                </div>
                <div className="text-sm text-[#777777]">{campaigns.length} {campaigns.length === 1 ? "Campanha" : "Campanhas"}</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-b border-gray-100 text-[#777777]">
                      <th className="text-left px-6 py-3 font-medium">Campanha</th>
                      <th className="text-left px-6 py-3 font-medium">Início</th>
                      <th className="text-left px-6 py-3 font-medium">Conclusão</th>
                      <th className="text-left px-6 py-3 font-medium">Sucessos</th>
                      <th className="text-left px-6 py-3 font-medium">Falhas</th>
                      <th className="text-left px-6 py-3 font-medium">Total Enviados</th>
                      <th className="text-left px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-[#777777]">Nenhuma campanha encontrada.</td>
                      </tr>
                    ) : (
                      campaigns.map((c) => (
                        <tr key={c.id} className="border-b border-gray-100">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-[#141414]">{c.name}</div>
                            <div className="text-xs text-[#777777]">{c.contacts_total} contatos</div>
                          </td>
                          <td className="px-6 py-4 text-[#141414]">
                            {c.started_at ? new Date(c.started_at).toLocaleString("pt-BR") : "—"}
                          </td>
                          <td className="px-6 py-4 text-[#777777]">
                            {c.completed_at ? new Date(c.completed_at).toLocaleString("pt-BR") : "—"}
                          </td>
                          <td className="px-6 py-4 text-[#141414]">{c.contacts_sent}</td>
                          <td className="px-6 py-4 text-[#141414]">{c.contacts_failed}</td>
                          <td className="px-6 py-4 font-semibold text-[#141414]">{c.contacts_sent}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              c.status === "completed" ? "bg-green-100 text-green-700"
                              : c.status === "running" ? "bg-blue-100 text-blue-700"
                              : c.status === "paused" ? "bg-yellow-100 text-yellow-700"
                              : c.status === "failed" ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                            )}>
                              {c.status === "completed" ? "Concluída"
                               : c.status === "running" ? "Em execução"
                               : c.status === "paused" ? "Pausada"
                               : c.status === "failed" ? "Falhou"
                               : "Rascunho"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end">
            <Button variant="outline" onClick={() => setActiveStep("send")}>Voltar</Button>
          </div>
        </div>
      ) : null}

      <div className="mt-8 text-center text-sm text-[#777777]">Copyright © iMoobile. Todos os direitos reservados</div>

      {/* Modal: Importar Planilha */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-[#141414]">Importar Planilhas</DialogTitle>
              <DialogDescription className="text-sm mt-2">
                <span className="block font-medium text-[#141414]">Importe ou arraste uma planilha para realizar a extração</span>
                <span className="block mt-1">
                  Você pode baixar um Modelo para tal documento e ver as regras para preenchê-lo
                  <Button type="button" size="sm" className="ml-3 h-7 px-3 rounded-full" onClick={openTemplateModal}>
                    Visualizar Modelo
                  </Button>
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 flex gap-3">
              <label className="w-28 h-24 rounded-xl border-2 border-dashed border-[#2B66FF] bg-[#F8FBFF] flex flex-col items-center justify-center cursor-pointer hover:bg-[#EEF4FF] transition-colors">
                <Upload className="w-5 h-5 text-[#2B66FF] mb-1" />
                <span className="text-[#2B66FF] font-semibold text-sm">Importar</span>
                <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleSpreadsheetFileChange} />
              </label>
              <div className="flex-1 h-24 rounded-xl border-2 border-dashed border-[#2B66FF] bg-white flex items-center justify-center text-[#777777] text-lg">
                {selectedSpreadsheetFile ? selectedSpreadsheetFile.name : "Arraste o arquivo aqui."}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#141414] mb-3">Defina as configurações de importação</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-base leading-none font-medium text-[#1f2b3d]">A planilha contém números internacionais?</p>
                  <Switch checked={isInternational} onCheckedChange={setIsInternational} />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-base leading-none font-medium text-[#1f2b3d]">Ignorar validação do 9º Dígito Brasileiro?</p>
                  <Switch checked={ignoreNinthDigit} onCheckedChange={setIgnoreNinthDigit} />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={handleConfirmImport} className="h-10 px-5 text-base" disabled={importSpreadsheet.isPending}>
                {importSpreadsheet.isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Importando...</> : "Realizar Importação"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Modelo de importação */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="max-w-4xl rounded-2xl p-0 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-[#141414]">Modelo de importação</h2>
              <Button className="h-9 px-4 gap-2" onClick={() => toast({ title: "Download em breve", description: "O download do modelo será disponibilizado em breve." })}>
                <Download className="h-4 w-4" />
                Baixar Modelo
              </Button>
            </div>
            <div className="mt-4 text-[#141414]">
              <h3 className="text-xl font-semibold mb-2">Siga as instruções abaixo</h3>
              <ol className="list-decimal pl-6 space-y-2 text-base leading-tight">
                <li>Abra um arquivo Excel em branco</li>
                <li>Posicione seus contatos na seguinte formatação</li>
              </ol>
            </div>
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-center">
              <div className="border border-gray-400 rounded-md overflow-hidden">
                <div className="grid grid-cols-2 bg-gray-50 font-semibold text-base">
                  <div className="border-r border-gray-300 px-4 py-2">Nome</div>
                  <div className="px-4 py-2">Numero</div>
                </div>
                <div className="grid grid-cols-2 text-base">
                  <div className="border-t border-r border-gray-300 px-4 py-2">John</div>
                  <div className="border-t border-gray-300 px-4 py-2">9999999999</div>
                  <div className="border-t border-r border-gray-300 px-4 py-2">***</div>
                  <div className="border-t border-gray-300 px-4 py-2">***</div>
                </div>
              </div>
              <div className="text-xl font-semibold text-center">OU</div>
              <div className="border border-gray-400 rounded-md overflow-hidden">
                <div className="grid grid-cols-4 bg-gray-50 font-semibold text-base">
                  <div className="border-r border-gray-300 px-4 py-2">Nome</div>
                  <div className="border-r border-gray-300 px-4 py-2">Numero</div>
                  <div className="border-r border-gray-300 px-4 py-2">Email</div>
                  <div className="px-4 py-2">***</div>
                </div>
                <div className="grid grid-cols-4 text-base">
                  <div className="border-t border-r border-gray-300 px-4 py-2">John</div>
                  <div className="border-t border-r border-gray-300 px-4 py-2">9999999999</div>
                  <div className="border-t border-r border-gray-300 px-4 py-2">john@gmail.com</div>
                  <div className="border-t border-gray-300 px-4 py-2">***</div>
                </div>
              </div>
            </div>
            <div className="mt-5 text-base text-[#141414]">
              <ol className="list-decimal pl-6 space-y-2">
                <li>Após concluir salve e importe para o nosso sistema</li>
                <li>É importante que os contatos tenham os DDDs respectivos</li>
                <li>
                  <button type="button" className="text-[#2B66FF] underline mr-2" onClick={() => window.open("https://contacts.google.com/", "_blank", "noopener,noreferrer")}>
                    Google Contacts
                  </button>
                  Faz o download da planilha e realizar a importação no nosso sistema
                </li>
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <input ref={mediaFileInputRef} type="file" className="hidden" onChange={handleMediaFileChange} />
    </>
  );
}
