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
import { Upload, ArrowRight, Check, AlertCircle, Loader2, Building2 } from "lucide-react";

type Broker = { id: number; name: string; user_type?: string | null };

type PreviewData = {
  total: number;
  unique_prefixes: string[];
  unique_purposes: string[];
  preview: Record<string, unknown>[];
};

type BrokerMap = Record<string, string>; // codePrefix → userId (string)

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = ["Upload", "Mapeamento", "Confirmar"] as const;
type Step = 0 | 1 | 2;

export function ImportPropertiesModal({ open, onOpenChange }: Props) {
  const { isBroker, userId } = useCurrentUser();

  const { data: brokersData } = useQuery({
    queryKey: ["brokers", "list"],
    queryFn: async () => {
      const response = await api.get("users").json<{ data: Broker[] }>();
      const users = Array.isArray(response.data) ? response.data : ([] as Broker[]);
      return users.filter((u) => u.user_type === "corretor" || u.user_type === "admin");
    },
    enabled: open,
    staleTime: 0,
  });
  const brokers = brokersData ?? [];

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [brokerMap, setBrokerMap] = useState<BrokerMap>({});
  const [defaultUserId, setDefaultUserId] = useState<string>("none");
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ─── preview ─────────────────────────────────────────────────────────────
  const previewMutation = useMutation({
    mutationFn: async (f: File) => {
      const form = new FormData();
      form.append("file", f);
      return api.post("properties/import/preview", { body: form }).json<{ data: PreviewData }>();
    },
    onSuccess: (res) => {
      setPreview(res.data);
      setStep(1);
    },
    onError: () =>
      toast({ title: "Erro ao ler o arquivo", description: "Verifique se é um XLSX do Canal Pro.", variant: "destructive" }),
  });

  // ─── import ───────────────────────────────────────────────────────────────
  const importMutation = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      form.append("file", file!);

      if (defaultUserId !== "none") {
        form.append("default_user_id", defaultUserId);
      }

      Object.entries(brokerMap).forEach(([prefix, uid]) => {
        if (uid && uid !== "none") form.append(`broker_map[${prefix}]`, uid);
      });

      return api.post("properties/import", { body: form }).json<{
        data: { imported: number; skipped: number; errors: string[] };
        message: string;
      }>();
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({ title: res.message });
      if (res.data.skipped > 0) {
        toast({
          title: `${res.data.skipped} imóvel(is) ignorado(s)`,
          description: res.data.errors.slice(0, 3).join(" | "),
          variant: "destructive",
        });
      }
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
      setBrokerMap({});
      setDefaultUserId("none");
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uniquePrefixes: string[] = preview?.unique_prefixes ?? [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#9747FF]" />
            Importar imóveis do Canal Pro
          </DialogTitle>
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
                  {previewMutation.isPending ? "Lendo arquivo…" : "Arraste o XLSX aqui ou clique para selecionar"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Formato: planilha XLSX exportada do Canal Pro
                </p>
              </div>
              {file && !previewMutation.isPending && (
                <Badge variant="secondary">{file.name}</Badge>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
              <span>{preview.total} imóvel(is) encontrado(s) no arquivo.</span>
            </div>

            {isBroker ? (
              <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">
                Responsável: <span className="font-medium text-[#141414]">você mesmo</span> (todos os imóveis serão atribuídos a você)
              </div>
            ) : (
              <div className="space-y-5">
                {/* Responsável padrão */}
                <div>
                  <Label className="text-sm font-semibold text-[#141414] mb-1 block">
                    Responsável padrão
                  </Label>
                  <p className="text-xs text-gray-400 mb-2">
                    Usado quando o prefixo do código não for mapeado abaixo
                  </p>
                  <Select value={defaultUserId} onValueChange={setDefaultUserId}>
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

                {/* Mapeamento de prefixos → corretores */}
                {uniquePrefixes.length > 0 && (
                  <div>
                    <Label className="text-sm font-semibold text-[#141414] mb-1 block">
                      Mapeamento de corretores por prefixo do código
                    </Label>
                    <p className="text-xs text-gray-400 mb-3">
                      As 2 primeiras letras do código identificam o corretor (ex: &quot;SM07&quot; → prefixo &quot;SM&quot;)
                    </p>
                    <div className="space-y-3">
                      {uniquePrefixes.map((prefix) => (
                        <div key={prefix} className="flex items-center gap-3">
                          <div className="flex-shrink-0 bg-gray-100 rounded-md px-3 py-2 text-sm text-[#141414] font-mono font-bold min-w-[60px] text-center">
                            {prefix}
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                          <div className="flex-1">
                            <Select
                              value={brokerMap[prefix] || "none"}
                              onValueChange={(v) =>
                                setBrokerMap((prev) => ({ ...prev, [prefix]: v }))
                              }
                            >
                              <SelectTrigger className="text-sm">
                                <SelectValue placeholder="Selecione o corretor" />
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
                <span className="text-gray-500">Total de imóveis</span>
                <span className="font-semibold text-[#141414]">{preview.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Prefixos encontrados</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {(preview.unique_prefixes ?? []).map((p) => (
                    <Badge key={p} variant="secondary" className="text-xs font-mono">
                      {p}
                      {brokerMap[p] && brokerMap[p] !== "none" && (
                        <span className="ml-1 text-[#9747FF]">
                          → {brokers.find((b) => String(b.id) === brokerMap[p])?.name?.split(" ")[0]}
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
              {!isBroker && defaultUserId !== "none" && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Responsável padrão</span>
                  <span className="font-medium text-[#141414]">
                    {brokers.find((b) => String(b.id) === defaultUserId)?.name ?? "—"}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Arquivo</span>
                <span className="font-medium text-[#141414] truncate max-w-[200px]">{file?.name}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              <strong>Atenção:</strong> imóveis com código já existente serão criados como novos registros. Verifique duplicatas após a importação.
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
                Importar {preview?.total} imóvel(is)
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
