"use client";

import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Bot, CircleHelp, MessageCircle, Plus, QrCode } from "lucide-react";

export default function WhatsappPage() {
  const { toast } = useToast();

  const handleCreate = () => {
    toast({
      title: "Em breve",
      description: "A criação de instâncias do WhatsApp será conectada na próxima etapa.",
    });
  };

  const handleTutorial = () => {
    toast({
      title: "Em breve",
      description: "O tutorial será disponibilizado em breve.",
    });
  };

  return (
    <>
      <TopNav title_secondary="WhatsApp" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center mt-0.5">
            <MessageCircle className="w-5 h-5 text-[#141414]" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[#141414]">WhatsApp Business Platform</h1>
              <span className="text-xs bg-gray-100 text-[#777777] px-3 py-1 rounded-full border border-gray-200">0/1 slots</span>
            </div>
            <p className="text-[#777777]">
              Connect your WhatsApp account via QR Code to enable seamless customer engagement and automated messaging.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="gap-2" onClick={handleTutorial}>
            <CircleHelp className="h-4 w-4" />
            Tutorial
          </Button>
          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Nova Instancia
          </Button>
        </div>
      </div>

      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardContent className="p-0">
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-7 h-7 text-[#777777]" />
            </div>
            <div className="text-lg font-semibold text-[#141414] mb-2">Nenhuma instância configurada</div>
            <div className="text-sm text-[#777777] max-w-md mx-auto">
              Crie sua primeira instância do WhatsApp para começar a automatizar suas conversas.
            </div>

            <Button className="mt-6 gap-2" onClick={handleCreate}>
              <Plus className="h-4 w-4" />
              Criar Primeira Instância
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 pb-6">
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                  <Bot className="h-5 w-5 text-[#141414]" />
                </div>
                <div className="text-sm font-semibold text-[#141414] mb-1">Agentes IA</div>
                <div className="text-xs text-[#777777]">Respostas automáticas inteligentes</div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                  <QrCode className="h-5 w-5 text-[#141414]" />
                </div>
                <div className="text-sm font-semibold text-[#141414] mb-1">QR Code</div>
                <div className="text-xs text-[#777777]">Conexão rápida via WhatsApp Web</div>
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                  <BarChart3 className="h-5 w-5 text-[#141414]" />
                </div>
                <div className="text-sm font-semibold text-[#141414] mb-1">Analytics</div>
                <div className="text-xs text-[#777777]">Relatórios de performance</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-[#777777]">Copyright © iMoobile. Todos os direitos reservados</div>
    </>
  );
}
