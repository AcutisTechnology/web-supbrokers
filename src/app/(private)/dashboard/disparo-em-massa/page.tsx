"use client";

import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Bot, Plus, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBlastCampaigns, BlastCampaignStatus } from "@/features/dashboard/disparo-em-massa/services/blast-service";

const STATUS_LABEL: Record<BlastCampaignStatus, string> = {
  draft: "Rascunho",
  running: "Enviando",
  paused: "Pausada",
  completed: "Concluída",
  failed: "Falhou",
};

const STATUS_VARIANT: Record<BlastCampaignStatus, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary",
  running: "default",
  paused: "outline",
  completed: "default",
  failed: "destructive",
};

export default function DisparoEmMassaPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

  const { data: allCampaigns = [], isLoading } = useBlastCampaigns();

  const campaigns = useMemo(
    () =>
      allCampaigns.filter((c) =>
        search.trim() === "" ? true : c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [allCampaigns, search]
  );

  const selectedCampaign = useMemo(
    () => allCampaigns.find((c) => c.id === selectedCampaignId) ?? null,
    [allCampaigns, selectedCampaignId]
  );

  const campaignsCountLabel = campaigns.length === 1 ? "1 campanha" : `${campaigns.length} campanhas`;

  const handleCreate = () => {
    router.push("/dashboard/disparo-em-massa/nova");
  };

  return (
    <>
      <TopNav title_secondary="Disparo" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#9747FF]/10 flex items-center justify-center mt-0.5">
            <Bot className="w-5 h-5 text-[#9747FF]" />
          </div>
          <div>
            <p className="text-[#777777]">Gerencie suas campanhas de disparo automatizado com agentes inteligentes</p>
          </div>
        </div>

        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Campanha
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="h-4 w-4 text-[#777777] absolute left-4 top-1/2 -translate-y-1/2" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar campanhas por nome, descrição ou agente..."
          className="pl-10 h-12 rounded-2xl"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contacts panel */}
        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <CardTitle className="text-base">Contatos da Campanha</CardTitle>
                <p className="text-xs text-[#777777]">
                  {selectedCampaign ? selectedCampaign.name : "Selecione uma campanha"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedCampaign ? (
              <div className="h-[260px] rounded-2xl border border-gray-100 bg-white overflow-auto p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-[#777777] text-xs">Total</p>
                    <p className="font-semibold text-lg">{selectedCampaign.contacts_total}</p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-3">
                    <p className="text-green-700 text-xs">Enviados</p>
                    <p className="font-semibold text-lg text-green-700">{selectedCampaign.contacts_sent}</p>
                  </div>
                  <div className="rounded-xl bg-red-50 p-3">
                    <p className="text-red-600 text-xs">Falhas</p>
                    <p className="font-semibold text-lg text-red-600">{selectedCampaign.contacts_failed}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-3">
                    <p className="text-blue-600 text-xs">Processados</p>
                    <p className="font-semibold text-lg text-blue-600">{selectedCampaign.contacts_processed}</p>
                  </div>
                </div>
                {selectedCampaign.whatsapp_instance && (
                  <p className="text-xs text-[#777777]">
                    Instância: <span className="font-medium">{selectedCampaign.whatsapp_instance.display_name}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="h-[260px] rounded-2xl border border-gray-100 bg-white flex items-center justify-center text-center px-8">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-[#777777]" />
                  </div>
                  <div className="font-medium text-[#141414] mb-1">Selecione uma campanha</div>
                  <div className="text-sm text-[#777777]">
                    Clique em uma campanha do lado direito para ver seus contatos
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaigns list */}
        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#4A316A]" />
                </div>
                <div>
                  <CardTitle className="text-base">Campanhas Recentes</CardTitle>
                  <p className="text-xs text-[#777777]">Suas últimas campanhas de disparo IA</p>
                </div>
              </div>
              <div className="text-sm text-[#777777]">{campaignsCountLabel}</div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[260px] flex items-center justify-center text-sm text-[#777777]">
                Carregando campanhas...
              </div>
            ) : campaigns.length === 0 ? (
              <div className="h-[260px] rounded-2xl border border-gray-100 bg-white flex items-center justify-center text-center px-8">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-6 h-6 text-[#777777]" />
                  </div>
                  <div className="font-medium text-[#141414] mb-1">Nenhuma campanha criada</div>
                  <div className="text-sm text-[#777777] mb-5">
                    Crie sua primeira campanha de disparo IA para começar a automatizar suas mensagens
                  </div>
                  <Button onClick={handleCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Criar Primeira Campanha
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-[260px] overflow-auto space-y-2">
                {campaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    onClick={() => setSelectedCampaignId(campaign.id === selectedCampaignId ? null : campaign.id)}
                    className={`w-full text-left rounded-2xl border p-3 transition-colors hover:bg-gray-50 ${
                      campaign.id === selectedCampaignId ? "border-[#9747FF] bg-[#9747FF]/5" : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm text-[#141414] truncate">{campaign.name}</span>
                      <Badge variant={STATUS_VARIANT[campaign.status]} className="shrink-0 text-xs">
                        {STATUS_LABEL[campaign.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#777777] mt-1">
                      {campaign.contacts_total} contatos · criada em{" "}
                      {new Date(campaign.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center text-sm text-[#777777]">Copyright © iMoobile. Todos os direitos reservados</div>
    </>
  );
}
