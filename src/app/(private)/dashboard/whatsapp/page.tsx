"use client";

import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { BarChart3, Bot, CheckCircle2, CircleHelp, Loader2, MessageCircle, Plus, QrCode, Unplug, Wifi } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type WhatsappInstanceStatus = "connected" | "waiting" | "disconnected";

type WhatsappInstance = {
  id: number;
  name: string;
  status: WhatsappInstanceStatus;
  phone: string;
};

const createMockQrCells = (seed: number, size = 17) => {
  let value = seed;
  const next = () => {
    value = (value * 48271) % 2147483647;
    return value / 2147483647;
  };

  const cells: boolean[] = [];
  for (let i = 0; i < size * size; i += 1) {
    const isFinder =
      (i % size < 5 && Math.floor(i / size) < 5) ||
      (i % size > size - 6 && Math.floor(i / size) < 5) ||
      (i % size < 5 && Math.floor(i / size) > size - 6);
    cells.push(isFinder ? true : next() > 0.6);
  }
  return { cells, size };
};

export default function WhatsappPage() {
  const { toast } = useToast();

  const [isBootLoading, setIsBootLoading] = useState(true);
  const [instances, setInstances] = useState<WhatsappInstance[]>([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrStatus, setQrStatus] = useState<WhatsappInstanceStatus>("waiting");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBootLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const connectedCount = useMemo(
    () => instances.filter((i) => i.status === "connected").length,
    [instances]
  );

  const statusLabel =
    connectedCount === 0 ? "0 instâncias conectadas" : connectedCount === 1 ? "1 instância ativa" : `${connectedCount} instâncias ativas`;

  const openQrModal = () => {
    setQrStatus("waiting");
    setQrModalOpen(true);
  };

  const handleTutorial = () => {
    toast({
      title: "Em breve",
      description: "O tutorial será disponibilizado em breve.",
    });
  };

  const handleSimulateConnect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    setQrStatus("waiting");

    window.setTimeout(() => {
      setQrStatus("connected");
      setInstances((prev) => {
        if (prev.some((i) => i.status === "connected")) return prev;
        return [
          ...prev,
          {
            id: prev.length ? Math.max(...prev.map((i) => i.id)) + 1 : 1,
            name: "WhatsApp Imobiliária",
            status: "connected",
            phone: "(83) 99999-9999",
          },
        ];
      });

      toast({
        title: "Conectado!",
        description: "Sua instância foi conectada com sucesso.",
      });
      setIsConnecting(false);
      window.setTimeout(() => setQrModalOpen(false), 600);
    }, 1200);
  };

  const handleDisconnect = (id: number) => {
    setInstances((prev) => prev.map((i) => (i.id === id ? { ...i, status: "disconnected" } : i)));
    toast({
      title: "Desconectado",
      description: "A instância foi desconectada.",
    });
  };

  return (
    <>
      <TopNav title_secondary="WhatsApp" />

      <WhatsappHeader
        isLoading={isBootLoading}
        statusLabel={statusLabel}
        onOpenQr={openQrModal}
        onTutorial={handleTutorial}
      />

      {isBootLoading ? (
        <WhatsappSkeleton />
      ) : instances.some((i) => i.status === "connected") ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card className="border border-gray-100 shadow-sm rounded-2xl lg:col-span-2">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Instâncias</CardTitle>
              <Button className="gap-2" onClick={openQrModal}>
                <Plus className="h-4 w-4" />
                Conectar novo
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {instances
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
                .map((instance) => (
                  <WhatsappInstanceCard
                    key={instance.id}
                    instance={instance}
                    onReconnect={openQrModal}
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
        <WhatsappEmptyState onOpenQr={openQrModal} onTutorial={handleTutorial} />
      )}

      <WhatsappStatsCards />

      <WhatsappQRModal
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
        status={qrStatus}
        isConnecting={isConnecting}
        onConnect={handleSimulateConnect}
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

function WhatsappEmptyState({
  onOpenQr,
  onTutorial,
}: {
  onOpenQr: () => void;
  onTutorial: () => void;
}) {
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
  instance: WhatsappInstance;
  onReconnect: () => void;
  onDisconnect: () => void;
}) {
  const status =
    instance.status === "connected"
      ? { label: "Conectado", className: "bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]" }
      : instance.status === "waiting"
        ? { label: "Aguardando", className: "bg-gray-100 text-[#141414] border border-gray-200" }
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
              <div className="font-semibold text-[#141414] truncate">{instance.name}</div>
              <span className={`text-xs px-3 py-1 rounded-full ${status.className}`}>{status.label}</span>
            </div>
            <div className="text-sm text-[#777777] mt-1">{instance.phone}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={onReconnect}>
            <QrCode className="h-4 w-4" />
            QR Code
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={onDisconnect}>
            <Unplug className="h-4 w-4" />
            Desconectar
          </Button>
        </div>
      </div>
    </div>
  );
}

function WhatsappQRModal({
  open,
  onOpenChange,
  status,
  isConnecting,
  onConnect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: WhatsappInstanceStatus;
  isConnecting: boolean;
  onConnect: () => void;
}) {
  const qr = useMemo(() => createMockQrCells(1337, 19), []);

  const statusUi =
    status === "connected"
      ? { label: "Conectado", icon: <CheckCircle2 className="h-4 w-4" />, className: "bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]" }
      : status === "waiting"
        ? { label: "Aguardando conexão", icon: <Loader2 className="h-4 w-4 animate-spin" />, className: "bg-gray-100 text-[#141414] border border-gray-200" }
        : { label: "Desconectado", icon: <Unplug className="h-4 w-4" />, className: "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]" };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Conectar via QR Code</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-center justify-center">
            <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${qr.size}, minmax(0, 1fr))` }}>
                {qr.cells.map((cell, idx) => (
                  <div key={idx} className={`${cell ? "bg-[#141414]" : "bg-white"} h-2 w-2 rounded-[2px]`} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full ${statusUi.className}`}>
              {statusUi.icon}
              {statusUi.label}
            </div>

            <div className="text-sm text-[#777777]">
              Abra o WhatsApp no celular, vá em Dispositivos conectados e escaneie o QR Code para iniciar a sessão.
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-[#141414]">Ações</div>
              <div className="flex items-center gap-3 flex-wrap">
                <Button className="gap-2" onClick={onConnect} disabled={isConnecting}>
                  {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
                  {isConnecting ? "Conectando..." : "Simular conexão"}
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Fechar
                </Button>
              </div>
            </div>

            <div className="text-xs text-[#777777]">
              Integração via sessão externa (WhatsApp Web). Sem uso da API oficial da Meta.
            </div>
          </div>
        </div>
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

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
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
