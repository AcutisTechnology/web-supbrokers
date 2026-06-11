"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  useWhatsappInstances,
  useCreateWhatsappInstance,
  useDeleteWhatsappInstance,
  useWhatsappInstanceQr,
  useWhatsappInstanceStatus,
} from "@/features/dashboard/whatsapp/services/whatsapp-service";
import Image from "next/image";
import { CheckCircle2, Loader2, Plus, QrCode, Unplug } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export function WhatsappInstancesManager() {
  const { toast } = useToast();
  const { data: instances = [], isLoading } = useWhatsappInstances();
  const createInstance = useCreateWhatsappInstance();
  const deleteInstance = useDeleteWhatsappInstance();

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [connectingInstanceId, setConnectingInstanceId] = useState<number | null>(null);
  const [displayNameInput, setDisplayNameInput] = useState("WhatsApp Imobiliária");
  const [showNameForm, setShowNameForm] = useState(false);

  const qrEnabled = qrModalOpen && connectingInstanceId !== null;
  const { data: qrData } = useWhatsappInstanceQr(connectingInstanceId, qrEnabled);
  const { data: statusData } = useWhatsappInstanceStatus(connectingInstanceId, qrEnabled);

  const prevStatus = useRef<string | null>(null);
  useEffect(() => {
    if (!statusData) return;
    if (statusData.status === "connected" && prevStatus.current !== "connected") {
      toast({ title: "WhatsApp conectado!", description: "Sua instância está ativa." });
      setQrModalOpen(false);
      setConnectingInstanceId(null);
    }
    prevStatus.current = statusData.status;
  }, [statusData, toast]);

  const openQrModal = (instanceId?: number) => {
    if (instanceId) {
      setConnectingInstanceId(instanceId);
      setShowNameForm(false);
    } else {
      setShowNameForm(true);
      setDisplayNameInput("WhatsApp Imobiliária");
      setConnectingInstanceId(null);
    }
    setQrModalOpen(true);
  };

  const handleCreateInstance = async () => {
    if (!displayNameInput.trim()) return;
    try {
      console.log("[WhatsApp] Criando instância...");
      const instance = await createInstance.mutateAsync(displayNameInput.trim());
      console.log("[WhatsApp] Instância criada:", { id: instance.id, status: instance.status });
      setConnectingInstanceId(instance.id);
      setShowNameForm(false);
      prevStatus.current = null;
    } catch (err) {
      console.error("[WhatsApp] Erro ao criar instância:", err);
      toast({ title: "Erro ao criar instância WhatsApp.", variant: "destructive" });
    }
  };

  const handleDisconnect = async (id: number) => {
    try {
      await deleteInstance.mutateAsync(id);
      toast({ title: "Instância removida." });
    } catch {
      toast({ title: "Erro ao desconectar.", variant: "destructive" });
    }
  };

  const qrCode = qrData?.base64 ?? null;
  const currentStatus = statusData?.status ?? (connectingInstanceId ? "connecting" : "disconnected");

  useEffect(() => {
    if (!connectingInstanceId) return;
    console.log("[WhatsApp QR] Estado atual:", {
      connectingInstanceId,
      qrEnabled,
      qrCode_is_null: qrCode === null,
      qrCode_starts_with: qrCode ? qrCode.substring(0, 30) : null,
      currentStatus,
    });
  }, [connectingInstanceId, qrEnabled, qrCode, currentStatus]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-gray-50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#777777]">
          {instances.length === 0
            ? "Nenhuma instância conectada."
            : `${instances.filter((i) => i.status === "connected").length} de ${instances.length} conectada(s).`}
        </p>
        <Button size="sm" className="gap-2" onClick={() => openQrModal()}>
          <Plus className="h-4 w-4" />
          Conectar WhatsApp
        </Button>
      </div>

      {instances.length > 0 && (
        <div className="space-y-3">
          {instances
            .slice()
            .sort((a, b) => a.display_name.localeCompare(b.display_name, "pt-BR"))
            .map((instance) => {
              const statusInfo =
                instance.status === "connected"
                  ? { label: "Conectado", className: "bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]" }
                  : instance.status === "connecting"
                    ? { label: "Conectando...", className: "bg-gray-100 text-[#141414] border border-gray-200" }
                    : { label: "Desconectado", className: "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]" };

              return (
                <div
                  key={instance.id}
                  className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-gray-100 bg-white"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#25D366] to-[#128c7e] flex-shrink-0 overflow-hidden">
                      <Image src="/whatsapp-logo.png" alt="WhatsApp" width={28} height={28} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-[#141414] truncate">{instance.display_name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="text-xs text-[#777777]">{instance.phone ?? "—"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openQrModal(instance.id)}>
                      <QrCode className="h-3.5 w-3.5" />
                      QR
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDisconnect(instance.id)}
                      disabled={deleteInstance.isPending}
                    >
                      <Unplug className="h-3.5 w-3.5" />
                      Remover
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* QR Modal */}
      <Dialog open={qrModalOpen} onOpenChange={() => setQrModalOpen(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Conectar via QR Code</DialogTitle>
          </DialogHeader>

          {showNameForm ? (
            <div className="space-y-4">
              <p className="text-sm text-[#777777]">
                Dê um nome para identificar esta instância WhatsApp.
              </p>
              <Input
                value={displayNameInput}
                onChange={(e) => setDisplayNameInput(e.target.value)}
                placeholder="Ex: WhatsApp Imobiliária"
                onKeyDown={(e) => e.key === "Enter" && handleCreateInstance()}
              />
              <div className="flex gap-3">
                <Button onClick={handleCreateInstance} disabled={createInstance.isPending || !displayNameInput.trim()}>
                  {createInstance.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Gerar QR Code
                </Button>
                <Button variant="outline" onClick={() => setQrModalOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-center justify-center">
                <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm min-w-[160px] min-h-[160px] flex items-center justify-center">
                  {currentStatus === "connected" ? (
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                  ) : qrCode ? (
                    qrCode.startsWith("data:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={qrCode} alt="QR Code WhatsApp" className="w-40 h-40" />
                    ) : (
                      <QRCodeSVG value={qrCode} size={160} />
                    )
                  ) : (
                    <Loader2 className="h-8 w-8 text-[#777777] animate-spin" />
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <Badge
                  className={
                    currentStatus === "connected"
                      ? "bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]"
                      : "bg-gray-100 text-[#141414] border border-gray-200"
                  }
                >
                  {currentStatus === "connected" ? (
                    <><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Conectado</>
                  ) : (
                    <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Aguardando conexão</>
                  )}
                </Badge>

                <p className="text-sm text-[#777777]">
                  Abra o WhatsApp no celular, vá em{" "}
                  <strong>Dispositivos conectados</strong> e escaneie o QR Code.
                </p>
                <p className="text-xs text-[#777777]">
                  Integração via sessão externa (WhatsApp Web). Sem uso da API oficial da Meta.
                </p>

                <Button variant="outline" onClick={() => setQrModalOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
