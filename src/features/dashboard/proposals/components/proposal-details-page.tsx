"use client";

import { useProposal } from "../hooks/use-proposals";
import { useParams, useRouter } from "next/navigation";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Share2, Printer, MapPin, User, Calendar, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const statusMap = {
  PENDING: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  ACCEPTED: { label: "Aceita", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "Recusada", color: "bg-red-100 text-red-800" },
  CANCELED: { label: "Cancelada", color: "bg-gray-100 text-gray-800" },
};

export function ProposalDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading } = useProposal(Number(id));

  if (isLoading) return <LoadingState />;

  if (!data) return null;

  const proposal = data.data;

  const handleShare = () => {
    const token = proposal.public_token ?? proposal.token;
    const url = `${window.location.origin}/proposta/${token}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copiado!", description: "O link da proposta foi copiado para a área de transferência." });
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-[#969696]">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" /> Compartilhar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.print()}
            className="hidden md:flex"
          >
            <Printer className="w-4 h-4 mr-2" /> Imprimir
          </Button>
          <Button 
            size="sm" 
            className="bg-[#4A316A] hover:bg-[#3a2654]"
            onClick={() => router.push(`/dashboard/propostas/${proposal.id}/editar`)}
            disabled={proposal.status === "ACCEPTED"}
          >
            <Edit className="w-4 h-4 mr-2" /> Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Status e Título */}
          <Card className="border-[#E2E2E2]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-xl font-bold text-[#4A316A]">Proposta #{proposal.code}</CardTitle>
                <p className="text-sm text-[#969696] mt-1">
                  Gerada em {format(new Date(proposal.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <Badge className={`${statusMap[proposal.status].color} border-none`}>
                {statusMap[proposal.status].label}
              </Badge>
            </CardHeader>
          </Card>

          {/* Imóvel */}
          <Card className="border-[#E2E2E2]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#4A316A]">Dados do Imóvel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                  <img src={proposal.property.attachments?.[0]?.url || "/placeholder.svg"} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#4A316A]">{proposal.property.title}</h4>
                  <div className="flex items-center gap-1 text-sm text-[#969696] mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{proposal.property.street}, {proposal.property.neighborhood}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[#969696] mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>Cód: {proposal.property.code}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proponentes */}
          <Card className="border-[#E2E2E2]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#4A316A]">Proponentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {proposal.proponents.map((proponent, i) => (
                <div key={i} className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[#4A316A]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-[#4A316A]">{proponent.name}</span>
                      {(proponent.type === "principal" || proponent.is_main) && <Badge className="bg-[#4A316A]">Principal</Badge>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2 text-sm text-[#969696]">
                      <span>E-mail: {proponent.email}</span>
                      <span>CPF: {proponent.cpf}</span>
                      <span>Fone: {proponent.phone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Condições de Pagamento */}
          <Card className="border-[#E2E2E2]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#4A316A]">Condições de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">Descrição</th>
                      <th className="text-right px-4 py-3 font-semibold text-[#4A316A]">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposal.conditions.map((cond, i) => (
                      <tr key={i} className="border-b last:border-none">
                        <td className="px-4 py-3 text-[#4A316A]">{cond.description}</td>
                        <td className="px-4 py-3 text-right font-bold text-[#4A316A]">
                          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cond.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-4 py-3 font-bold text-[#4A316A]">TOTAL DA PROPOSTA</td>
                      <td className="px-4 py-3 text-right font-bold text-[#4A316A] text-lg">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(proposal.total_value)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-[#E2E2E2]">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-[#4A316A]">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#969696]">Visualizações:</span>
                <span className="text-sm font-bold flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {proposal.views_count}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#969696]">Status:</span>
                <Badge className={`${statusMap[proposal.status].color} text-[10px] border-none`}>
                  {statusMap[proposal.status].label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
