"use client";

import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  useWhatsappInstances,
  useCreateWhatsappInstance,
  useDeleteWhatsappInstance,
  useWhatsappInstanceQr,
  useWhatsappInstanceStatus,
} from "@/features/dashboard/whatsapp/services/whatsapp-service";
import Image from "next/image";
import { BarChart3, Bot, CheckCircle2, CircleHelp, Loader2, Plus, QrCode, Unplug, Wifi } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function WhatsappPage() {
  const { toast } = useToast();
  const { data: instances = [], isLoading: isBootLoading } = useWhatsappInstances();
  const createInstance = useCreateWhatsappInstance();
  const deleteInstance = useDeleteWhatsappInstance();

  // Estado do modal de conexão
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [connectingInstanceId, setConnectingInstanceId] = useState<number | null>(null);
  const [displayNameInput, setDisplayNameInput] = useState("WhatsApp Imobiliária");
  const [showNameForm, setShowNameForm] = useState(false);

  // QR Code polling (ativo enquanto modal aberto e não conectado)
  const qrEnabled = qrModalOpen && connectingInstanceId !== null;
  const { data: qrData } = useWhatsappInstanceQr(connectingInstanceId, qrEnabled);

  // Status polling — verifica a cada 3s se o QR foi escaneado
  const { data: statusData } = useWhatsappInstanceStatus(connectingInstanceId, qrEnabled);

  // Quando status mudar para 'connected' → fecha modal e notifica
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

  const connectedCount = useMemo(
    () => instances.filter((i) => i.status === "connected").length,
    [instances]
  );

  const statusLabel =
    connectedCount === 0
      ? "0 instâncias conectadas"
      : connectedCount === 1
        ? "1 instância ativa"
        : `${connectedCount} instâncias ativas`;

  const handleTutorial = () => {
    toast({ title: "Em breve", description: "O tutorial será disponibilizado em breve." });
  };

  const openQrModal = (instanceId?: number) => {
    if (instanceId) {
      setConnectingInstanceId(instanceId);
      setShowNameForm(false);
      setQrModalOpen(true);
    } else {
      // Nova instância — pede o nome primeiro
      setShowNameForm(true);
      setDisplayNameInput("WhatsApp Imobiliária");
      setConnectingInstanceId(null);
      setQrModalOpen(true);
    }
  };

  const handleCreateInstance = async () => {
    if (!displayNameInput.trim()) return;
    try {
      const instance = await createInstance.mutateAsync(displayNameInput.trim());
      setConnectingInstanceId(instance.id);
      setShowNameForm(false);
      prevStatus.current = null;
    } catch {
      toast({ title: "Erro", description: "Falha ao criar instância WhatsApp.", variant: "destructive" });
    }
  };

  const handleDisconnect = async (id: number) => {
    try {
      await deleteInstance.mutateAsync(id);
      toast({ title: "Desconectado", description: "A instância foi removida." });
    } catch {
      toast({ title: "Erro", description: "Falha ao desconectar.", variant: "destructive" });
    }
  };

  const handleCloseModal = () => {
    setQrModalOpen(false);
    // Mantém o connectingInstanceId para não perder a instância criada
  };

  const qrCode = qrData?.base64 ?? null;
  const currentStatus = statusData?.status ?? (connectingInstanceId ? "connecting" : "disconnected");

  return (
    <>
      <TopNav title_secondary="WhatsApp" />

      <WhatsappHeader
        isLoading={isBootLoading}
        statusLabel={statusLabel}
        onOpenQr={() => openQrModal()}
        onTutorial={handleTutorial}
      />

      {isBootLoading ? (
        <WhatsappSkeleton />
      ) : instances.some((i) => i.status === "connected") ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card className="border border-gray-100 shadow-sm rounded-2xl lg:col-span-2">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Instâncias</CardTitle>
              <Button className="gap-2" onClick={() => openQrModal()}>
                <Plus className="h-4 w-4" />
                Conectar novo
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {instances
                .slice()
                .sort((a, b) => a.display_name.localeCompare(b.display_name, "pt-BR"))
                .map((instance) => (
                  <WhatsappInstanceCard
                    key={instance.id}
                    instance={instance}
                    onReconnect={() => openQrModal(instance.id)}
                    onDisconnect={() => handleDisconnect(instance.id)}
                  />
                ))}
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Wifi className="h-5 w-5 text-[#141414]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#141414]">Conexões ativas</div>
                    <div className="text-xs text-[#777777]">Instâncias em operação</div>
                  </div>
                </div>
                <Badge className="bg-gray-100 text-[#777777] border border-gray-200">{connectedCount}</Badge>
              </div>
              <div className="text-sm text-[#777777]">
                A integração é feita via sessão externa (QR Code), sem uso da API oficial da Meta.
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <WhatsappEmptyState onOpenQr={() => openQrModal()} onTutorial={handleTutorial} />
      )}

      <WhatsappStatsCards />

      <WhatsappQRModal
        open={qrModalOpen}
        onOpenChange={handleCloseModal}
        showNameForm={showNameForm}
        displayNameInput={displayNameInput}
        onDisplayNameChange={setDisplayNameInput}
        onCreateInstance={handleCreateInstance}
        isCreating={createInstance.isPending}
        qrCode={qrCode}
        status={currentStatus}
      />

      <div className="mt-8 text-center text-sm text-[#777777]">Copyright © iMoobile. Todos os direitos reservados</div>
    </>
  );
}

function WhatsappHeader({
  isLoading,
  statusLabel,
  onOpenQr,
  onTutorial,
}: {
  isLoading: boolean;
  statusLabel: string;
  onOpenQr: () => void;
  onTutorial: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#075e54] via-[#128c7e] to-[#25d366] p-8 md:p-10 shadow-2xl mb-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_70%)]" />
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-black/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur-sm border border-white/20 overflow-hidden">
              <Image src="/whatsapp-logo.png" alt="WhatsApp" width={40} height={40} />
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                Painel do WhatsApp
              </h1>
              <p className="mt-1 text-sm text-white/70 max-w-lg leading-relaxed">
                Gerencie suas conexões, automações e atendimentos via WhatsApp de forma simples e eficiente.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3">
          {isLoading ? (
            <div className="h-9 w-56 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm animate-pulse" />
          ) : (
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white/90 uppercase tracking-wider backdrop-blur-sm shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              {statusLabel}
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="ghost" className="gap-2 text-white hover:text-white hover:bg-white/10" onClick={onTutorial}>
              <CircleHelp className="h-4 w-4" />
              Ver tutorial
            </Button>
            <Button className="gap-2 bg-white text-[#075e54] hover:bg-white/90" onClick={onOpenQr}>
              <Plus className="h-4 w-4" />
              Conectar WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhatsappEmptyState({ onOpenQr, onTutorial }: { onOpenQr: () => void; onTutorial: () => void }) {
  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl mb-6">
      <CardContent className="p-0">
        <div className="p-8 md:p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128c7e] text-white shadow-xl shadow-emerald-500/20 mx-auto mb-6 overflow-hidden">
            <Image src="/whatsapp-logo.png" alt="WhatsApp" width={44} height={44} />
          </div>
          <div className="text-xl font-semibold text-[#141414] mb-2">Nenhuma instância conectada</div>
          <div className="text-sm text-[#777777] max-w-md mx-auto">
            Conecte seu WhatsApp via QR Code para começar a automatizar seus atendimentos.
          </div>
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <Button className="gap-2" onClick={onOpenQr}>
              <Plus className="h-4 w-4" />
              Conectar WhatsApp
            </Button>
            <Button variant="outline" className="gap-2" onClick={onTutorial}>
              <CircleHelp className="h-4 w-4" />
              Ver tutorial
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WhatsappInstanceCard({
  instance,
  onReconnect,
  onDisconnect,
}: {
  instance: { id: number; display_name: string; status: string; phone: string | null };
  onReconnect: () => void;
  onDisconnect: () => void;
}) {
  const status =
    instance.status === "connected"
      ? { label: "Conectado", className: "bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]" }
      : instance.status === "connecting"
        ? { label: "Conectando...", className: "bg-gray-100 text-[#141414] border border-gray-200" }
        : { label: "Desconectado", className: "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]" };

  return (
    <div className="p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128c7e] text-white shadow-xl shadow-emerald-500/20 flex-shrink-0 overflow-hidden">
            <Image src="/whatsapp-logo.png" alt="WhatsApp" width={44} height={44} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="font-semibold text-[#141414] truncate">{instance.display_name}</div>
              <span className={`text-xs px-3 py-1 rounded-full ${status.className}`}>{status.label}</span>
            </div>
            <div className="text-sm text-[#777777] mt-1">{instance.phone ?? "—"}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={onReconnect}>
            <QrCode className="h-4 w-4" />
            QR Code
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onDisconnect}
          >
            <Unplug className="h-4 w-4" />
            Remover
          </Button>
        </div>
      </div>
    </div>
  );
}

function WhatsappQRModal({
  open,
  onOpenChange,
  showNameForm,
  displayNameInput,
  onDisplayNameChange,
  onCreateInstance,
  isCreating,
  qrCode,
  status,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showNameForm: boolean;
  displayNameInput: string;
  onDisplayNameChange: (v: string) => void;
  onCreateInstance: () => void;
  isCreating: boolean;
  qrCode: string | null;
  status: string;
}) {
  const isConnected = status === "connected";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => onDisplayNameChange(e.target.value)}
              placeholder="Ex: WhatsApp Imobiliária"
              onKeyDown={(e) => e.key === "Enter" && onCreateInstance()}
            />
            <div className="flex gap-3">
              <Button onClick={onCreateInstance} disabled={isCreating || !displayNameInput.trim()}>
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Gerar QR Code
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center justify-center">
              <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm min-w-[160px] min-h-[160px] flex items-center justify-center">
                {isConnected ? (
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                ) : qrCode ? (
                  /* Se vier como data URL (imagem), renderiza como <img>;
                     se vier como string QR, usa QRCodeSVG */
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
              <div
                className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full ${
                  isConnected
                    ? "bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]"
                    : "bg-gray-100 text-[#141414] border border-gray-200"
                }`}
              >
                {isConnected ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {isConnected ? "Conectado" : "Aguardando conexão"}
              </div>

              <div className="text-sm text-[#777777]">
                Abra o WhatsApp no celular, vá em{" "}
                <strong>Dispositivos conectados</strong> e escaneie o QR Code para iniciar a sessão.
              </div>

              <div className="text-xs text-[#777777]">
                Integração via sessão externa (WhatsApp Web). Sem uso da API oficial da Meta.
              </div>

              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function WhatsappStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FeatureCard
        title="Agentes IA"
        description="Automatize respostas e qualifique leads automaticamente"
        icon={<Bot className="h-5 w-5 text-[#141414]" />}
      />
      <FeatureCard
        title="QR Code"
        description="Conecte rapidamente seu WhatsApp via QR Code"
        icon={<QrCode className="h-5 w-5 text-[#141414]" />}
      />
      <FeatureCard
        title="Analytics"
        description="Acompanhe métricas de atendimento e performance"
        icon={<BarChart3 className="h-5 w-5 text-[#141414]" />}
      />
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: ReactNode }) {
  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4">{icon}</div>
        <div className="text-sm font-semibold text-[#141414] mb-1">{title}</div>
        <div className="text-xs text-[#777777]">{description}</div>
      </CardContent>
    </Card>
  );
}

function WhatsappSkeleton() {
  return (
    <div className="space-y-6 mb-6">
      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-40 bg-gray-100 rounded" />
            <div className="h-10 w-full bg-gray-100 rounded-2xl" />
            <div className="h-10 w-full bg-gray-100 rounded-2xl" />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="border border-gray-100 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-10 w-10 bg-gray-100 rounded-xl" />
                <div className="h-4 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-full bg-gray-100 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
