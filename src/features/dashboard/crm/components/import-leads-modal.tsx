"use client";

import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/shared/configs/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { CrmPipelineStage } from "@/features/dashboard/crm/services/crm-service";
import { Upload, ArrowRight, Check, AlertCircle, Loader2 } from "lucide-react";

type Broker = { id: number; name: string; user_type?: string | null };

type PreviewData = {
  total: number;
  unique_statuses: string[];
  unique_brokers: string[];
  preview: Record<string, string>[];
  columns: string[];
};

type StatusMap = Record<string, string>; // csvStatus → stageId (string)
type BrokerMap = Record<string, string>; // csvBrokerName → userId (string)

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stages: CrmPipelineStage[];
}

const STEPS = ["Upload", "Mapeamento", "Confirmar"] as const;
type Step = 0 | 1 | 2;

export function ImportLeadsModal({ open, onOpenChange, stages }: Props) {
  const { isBroker, userId } = useCurrentUser();

  // Busca corretores frescos sempre que o modal abre
  const { data: brokersData } = useQuery({
    queryKey: ["brokers", "list"],
    queryFn: async () => {
      const response = await api.get("users").json<{ data: Broker[] }>();
      const users = Array.isArray(response.data) ? response.data : ([] as Broker[]);
      return users.filter((u) => u.user_type === "corretor" || u.user_type === "admin");
    },
    enabled: open,
    staleTime: 0, // sempre refetch quando o modal abre
  });
  const brokers = brokersData ?? [];
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const [brokerMap, setBrokerMap] = useState<BrokerMap>({});
  const [defaultStageId, setDefaultStageId] = useState<string>(String(stages[0]?.id ?? ""));
  const [assignedUserId, setAssignedUserId] = useState<string>("none");
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ─── unique broker names from CSV ────────────────────────────────────────
  const csvBrokerNames = preview
    ? [...new Set(preview.preview.map((r) => r["Corretor"]).filter(Boolean))]
    : [];

  // ─── step 1: preview ─────────────────────────────────────────────────────
  const previewMutation = useMutation({
    mutationFn: async (f: File) => {
      const form = new FormData();
      form.append("file", f);
      return api.post("crm/leads/import/preview", { body: form }).json<{ data: PreviewData }>();
    },
    onSuccess: (res) => {
      setPreview(res.data);
      const initial: StatusMap = {};
      res.data.unique_statuses.forEach((s) => (initial[s] = String(stages[0]?.id ?? "")));
      setStatusMap(initial);
      setStep(1);
    },
    onError: () =>
      toast({ title: "Erro ao ler o arquivo", description: "Verifique o formato do CSV.", variant: "destructive" }),
  });

  // ─── step 3: import ───────────────────────────────────────────────────────
  const importMutation = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      form.append("file", file!);
      form.append("default_stage_id", defaultStageId);

      // status_map
      Object.entries(statusMap).forEach(([csvStatus, stageId]) => {
        form.append(`status_map[${csvStatus}]`, stageId || defaultStageId);
      });

      // assigned_user_id (imobiliaria com responsável único)
      if (!isBroker && assignedUserId !== "none") {
        form.append("assigned_user_id", assignedUserId);
      }

      // broker_map (imobiliaria com mapeamento por nome)
      if (!isBroker) {
        Object.entries(brokerMap).forEach(([name, uid]) => {
          if (uid && uid !== "none") form.append(`broker_map[${name}]`, uid);
        });
      }

      return api.post("crm/leads/import", { body: form }).json<{
        data: { imported: number; skipped: number; errors: string[] };
        message: string;
      }>();
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["crm", "leads"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "pipeline-stages"] });
      queryClient.invalidateQueries({ queryKey: ["crm", "metrics"] });
      toast({ title: res.message });
      handleClose();
    },
    onError: () =>
      toast({ title: "Erro na importação", description: "Tente novamente.", variant: "destructive" }),
  });

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(0);
      setFile(null);
      setPreview(null);
      setStatusMap({});
      setBrokerMap({});
      setAssignedUserId("none");
    }, 300);
  };

  const handleFile = (f: File) => {
    setFile(f);
    previewMutation.mutate(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  // Vem do backend — todos os corretores únicos do CSV inteiro
  const uniqueCsvBrokers: string[] = preview?.unique_brokers ?? [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar leads via CSV</DialogTitle>
        </DialogHeader>

        {/* stepper */}
        <div className="flex items-center gap-2 mb-4">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold border transition-colors ${
                  step > i
                    ? "bg-[#9747FF] border-[#9747FF] text-white"
                    : step === i
                    ? "bg-[#9747FF]/10 border-[#9747FF] text-[#9747FF]"
                    : "bg-gray-100 border-gray-200 text-gray-400"
                }`}
              >
                {step > i ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-sm ${step === i ? "text-[#141414] font-medium" : "text-gray-400"}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && <ArrowRight className="w-4 h-4 text-gray-300" />}
            </div>
          ))}
        </div>

        {/* ── STEP 0: Upload ── */}
        {step === 0 && (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                isDragging ? "border-[#9747FF] bg-[#9747FF]/5" : "border-gray-200 hover:border-[#9747FF]/50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              {previewMutation.isPending ? (
                <Loader2 className="w-8 h-8 text-[#9747FF] animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
              <div className="text-center">
                <p className="text-sm font-medium text-[#141414]">
                  {previewMutation.isPending ? "Lendo arquivo…" : "Arraste o CSV aqui ou clique para selecionar"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Formato: CSV com colunas ID, Nome, Telefone, Produto, Corretor, Data criação, Status, notas</p>
              </div>
              {file && !previewMutation.isPending && (
                <Badge variant="secondary">{file.name}</Badge>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
          </div>
        )}

        {/* ── STEP 1: Mapeamento ── */}
        {step === 1 && preview && (
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            <div className="bg-[#9747FF]/5 rounded-lg p-3 flex items-center gap-2 text-sm text-[#9747FF]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{preview.total} leads encontrados no arquivo.</span>
            </div>

            {/* Mapeamento de status */}
            <div>
              <Label className="text-sm font-semibold text-[#141414] mb-3 block">
                Mapeamento de status → etapa do CRM
              </Label>
              <div className="space-y-3">
                {preview.unique_statuses.map((csvStatus) => (
                  <div key={csvStatus} className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-md px-3 py-2 text-sm text-[#141414] font-medium truncate">
                      {csvStatus}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <div className="flex-1">
                      <Select
                        value={statusMap[csvStatus] || String(stages[0]?.id ?? "")}
                        onValueChange={(v) => setStatusMap((prev) => ({ ...prev, [csvStatus]: v }))}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Selecione a etapa" />
                        </SelectTrigger>
                        <SelectContent>
                          {stages.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              <span className="flex items-center gap-2">
                                {s.color && (
                                  <span
                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: s.color }}
                                  />
                                )}
                                {s.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Etapa padrão */}
            <div>
              <Label className="text-sm font-semibold text-[#141414] mb-1 block">
                Etapa padrão (para status não mapeados)
              </Label>
              <Select value={defaultStageId} onValueChange={setDefaultStageId}>
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

            {/* Responsável */}
            {isBroker ? (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">
                Responsável: <span className="font-medium text-[#141414]">você mesmo</span> (todos os leads serão atribuídos a você)
              </div>
            ) : (
              <div className="space-y-4">
                {/* Responsável global */}
                <div>
                  <Label className="text-sm font-semibold text-[#141414] mb-1 block">
                    Responsável padrão
                  </Label>
                  <p className="text-xs text-gray-400 mb-2">Usado quando o corretor do CSV não for mapeado abaixo</p>
                  <Select value={assignedUserId} onValueChange={setAssignedUserId}>
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

                {/* Mapeamento de corretores do CSV → usuários do sistema */}
                {uniqueCsvBrokers.length > 0 && (
                  <div>
                    <Label className="text-sm font-semibold text-[#141414] mb-3 block">
                      Mapeamento de corretores (baseado no preview)
                    </Label>
                    <div className="space-y-3">
                      {uniqueCsvBrokers.map((csvBroker) => (
                        <div key={csvBroker} className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-100 rounded-md px-3 py-2 text-sm text-[#141414] font-medium truncate">
                            {csvBroker}
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                          <div className="flex-1">
                            <Select
                              value={brokerMap[csvBroker] || "none"}
                              onValueChange={(v) =>
                                setBrokerMap((prev) => ({ ...prev, [csvBroker]: v }))
                              }
                            >
                              <SelectTrigger className="text-sm">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Usar padrão</SelectItem>
                                {brokers.map((b) => (
                                  <SelectItem key={b.id} value={String(b.id)}>
                                    {b.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Confirmar ── */}
        {step === 2 && preview && (
          <div className="space-y-4">
            <div className="bg-[#9747FF]/5 rounded-xl p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total de leads</span>
                <span className="font-semibold text-[#141414]">{preview.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status encontrados</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {preview.unique_statuses.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Etapa padrão</span>
                <span className="font-medium text-[#141414]">
                  {stages.find((s) => String(s.id) === defaultStageId)?.name ?? "—"}
                </span>
              </div>
              {!isBroker && assignedUserId !== "none" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Responsável padrão</span>
                  <span className="font-medium text-[#141414]">
                    {brokers.find((b) => String(b.id) === assignedUserId)?.name ?? "—"}
                  </span>
                </div>
              )}
            </div>

            {importMutation.isError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Ocorreu um erro ao importar. Tente novamente.
              </div>
            )}
          </div>
        )}

        {/* ── actions ── */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            onClick={step === 0 ? handleClose : () => setStep((s) => (s - 1) as Step)}
            disabled={importMutation.isPending}
          >
            {step === 0 ? "Cancelar" : "Voltar"}
          </Button>

          <div className="flex gap-2">
            {step === 1 && (
              <Button onClick={() => setStep(2)} disabled={!preview}>
                Próximo
              </Button>
            )}
            {step === 2 && (
              <Button
                onClick={() => importMutation.mutate()}
                disabled={importMutation.isPending}
                className="gap-2"
              >
                {importMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Importar {preview?.total} leads
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
