"use client";

import { usePublicProposal } from "../hooks/use-proposals";
import { useParams } from "next/navigation";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { proposalService } from "../services/proposal-service";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Proposal, ProposalCondition, ProposalProponent } from "../types/proposal";

export function PublicProposalPage() {
  const { token } = useParams();
  const { toast } = useToast();
  const { data, isLoading, refetch } = usePublicProposal(token as string);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <LoadingState />;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#4A316A]">Proposta não encontrada</h2>
        <p className="text-[#969696] mt-2">
          Este link pode ter expirado ou a proposta não existe mais.
        </p>
      </div>
    );
  }

  const proposal = data.data as Proposal;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val || 0);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  const handleAction = async (action: "accept" | "reject") => {
    setIsSubmitting(true);
    try {
      if (action === "accept") {
        await proposalService.accept(token as string);
        toast({ title: "Sucesso", description: "Proposta aceita com sucesso!" });
      } else {
        await proposalService.reject(token as string);
        toast({ title: "Sucesso", description: "Proposta recusada." });
      }
      refetch();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Ocorreu um erro ao processar sua solicitação." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const propertyValue = Number(proposal.property_value ?? 0);
  const totalValue = Number(proposal.total_value ?? 0);
  const differenceValue = typeof proposal.difference_value === "number" ? proposal.difference_value : totalValue - propertyValue;
  const isMatch = Math.abs(differenceValue) < 0.01;
  const totalPercentage = typeof proposal.total_percentage === "number" ? proposal.total_percentage : (propertyValue > 0 ? (totalValue / propertyValue) * 100 : 0);

  const mainProponent = proposal.proponents.find((p: ProposalProponent) => p.type === "principal") || proposal.proponents[0];
  const otherProponents = proposal.proponents.filter((p: ProposalProponent) => p !== mainProponent);
  const intermediatorName = proposal.intermediator?.name || "Corretor";
  const intermediatorEmail = proposal.intermediator?.email || "Email não informado";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center print:bg-white print:py-0 print:px-0">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg border overflow-hidden print:max-w-none print:rounded-none print:shadow-none print:border-none">
        {/* Header - User Info */}
        <div className="p-8 border-b flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-200 rounded-xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-[#4A316A] text-white font-bold text-xl">
                {intermediatorName.charAt(0) || "C"}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{intermediatorName}</h3>
              <p className="text-sm text-gray-500">{intermediatorEmail}</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500 space-y-1">
            <p>Gerado em: {formatDate(proposal.created_at)}</p>
            <p className="font-medium text-gray-700">Válida até: {formatDate(proposal.expiration_date || undefined)}</p>
          </div>
        </div>

        {/* Title Section */}
        <div className="p-8 text-center border-b">
          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-md mb-3 inline-block uppercase tracking-wider">
            #{proposal.code}
          </span>
          <h1 className="text-2xl font-black text-[#1E1E2F] uppercase tracking-tight">Análise de Proposta</h1>
        </div>

        <div className="p-8 space-y-8">
          {/* Dados do Proponente */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Dados do(s) Proponente(s)</h2>
            <div className="border rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-[#1E1E2F]">Proponente Principal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block text-xs">Nome:</span>
                  <span className="font-medium text-gray-900">{mainProponent?.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Telefone:</span>
                  <span className="font-medium text-gray-900">{mainProponent?.phone || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">CPF/CNPJ:</span>
                  <span className="font-medium text-gray-900">{mainProponent?.cpf || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">E-mail:</span>
                  <span className="font-medium text-gray-900">{mainProponent?.email || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">RG:</span>
                  <span className="font-medium text-gray-900">{mainProponent?.rg || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Profissão:</span>
                  <span className="font-medium text-gray-900">{mainProponent?.profession || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Nacionalidade:</span>
                  <span className="font-medium text-gray-900">{mainProponent?.nationality || "-"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs">Estado Civil:</span>
                  <span className="font-medium text-gray-900">{mainProponent?.marital_status || "-"}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-500 block text-xs">Endereço:</span>
                  <span className="font-medium text-gray-900">{mainProponent?.address || "-"}</span>
                </div>
              </div>

              {otherProponents.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Outros Proponentes</h4>
                  <div className="space-y-3">
                    {otherProponents.map((p) => (
                      <div key={p.id ?? `${p.name}-${p.cpf ?? ""}`} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="text-gray-500 block text-xs">Nome:</span>
                          <span className="font-medium text-gray-900">{p.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs">Tipo:</span>
                          <span className="font-medium text-gray-900">{p.type || "-"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs">Telefone:</span>
                          <span className="font-medium text-gray-900">{p.phone || "-"}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-xs">CPF:</span>
                          <span className="font-medium text-gray-900">{p.cpf || "-"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Dados do Imóvel */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Dados do Imóvel</h2>
            <div className="border rounded-xl p-5 space-y-4 text-sm">
              <div>
                <span className="text-gray-500 font-medium mr-2">Descrição:</span>
                <span className="font-medium text-gray-900">{proposal.property_description || proposal.property?.description || "-"}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium mr-2">Construtora:</span>
                <span className="font-medium text-gray-900">{proposal.property_builder_name || "-"}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium mr-2">Valor:</span>
                <span className="font-medium text-gray-900">{formatCurrency(propertyValue)}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium mr-2">Endereço:</span>
                <span className="font-medium text-gray-900">{proposal.property_address || "-"}</span>
              </div>
              {proposal.property_complement && (
                <div>
                  <span className="text-gray-500 font-medium mr-2">Complemento:</span>
                  <span className="font-medium text-gray-900">{proposal.property_complement}</span>
                </div>
              )}
            </div>
          </section>

          {/* Dados do Intermediador */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Dados do(a) Intermediador(a)</h2>
            <div className="border rounded-xl p-5 space-y-4 text-sm">
              <div>
                <span className="text-gray-500 font-medium mr-2">Imobiliária/Corretor(a):</span>
                <span className="font-medium text-gray-900">{proposal.intermediator?.name || "-"}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium mr-2">CRECI:</span>
                <span className="font-medium text-gray-900">{proposal.intermediator?.creci || "-"}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium mr-2">CPF/CNPJ:</span>
                <span className="font-medium text-gray-900">{proposal.intermediator?.document || "-"}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium mr-2">Telefone:</span>
                <span className="font-medium text-gray-900">{proposal.intermediator?.phone || "-"}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium mr-2">E-mail:</span>
                <span className="font-medium text-gray-900">{proposal.intermediator?.email || "-"}</span>
              </div>
              {proposal.intermediator?.address && (
                <div>
                  <span className="text-gray-500 font-medium mr-2">Endereço:</span>
                  <span className="font-medium text-gray-900">{proposal.intermediator.address}</span>
                </div>
              )}
            </div>
          </section>

          {/* Condições de Pagamento */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Condições de Pagamento</h2>
            <div className="border rounded-xl overflow-hidden bg-gray-50">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-100/50 border-b">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Tipo</th>
                      <th className="px-4 py-3 font-semibold">Valor</th>
                      <th className="px-4 py-3 font-semibold">Descrição</th>
                      <th className="px-4 py-3 font-semibold">Período</th>
                      <th className="px-4 py-3 font-semibold">Parcelas</th>
                      <th className="px-4 py-3 font-semibold text-right">Valor Parcela</th>
                      <th className="px-4 py-3 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {proposal.conditions?.map((cond: ProposalCondition, i: number) => {
                      const installments = cond.installments || 1;
                      const baseValue = cond.type === "percentage" ? (cond.value / 100) * propertyValue : cond.value;
                      const calculatedTotal = baseValue * installments;
                      const calculatedInstallment = baseValue;

                      return (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-4 text-gray-500">{cond.type === "percentage" ? "%" : "$"}</td>
                          <td className="px-4 py-4 font-medium">{cond.type === "percentage" ? `${cond.value}%` : formatCurrency(cond.value)}</td>
                          <td className="px-4 py-4">{cond.description}</td>
                          <td className="px-4 py-4 text-gray-500">{cond.period || "UNICA"}</td>
                          <td className="px-4 py-4 text-gray-500">{installments}x</td>
                          <td className="px-4 py-4 text-right font-medium text-gray-600">{formatCurrency(calculatedInstallment)}</td>
                          <td className="px-4 py-4 text-right font-bold text-gray-900">{formatCurrency(calculatedTotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Resumo de Totais */}
              <div className="p-6 bg-gray-50 border-t flex flex-col items-end gap-3 text-sm">
                <div className="flex justify-between w-full md:w-80">
                  <span className="text-gray-500">Valor do Imóvel:</span>
                  <span className="font-bold text-gray-900">{formatCurrency(propertyValue)}</span>
                </div>
                <div className="flex justify-between w-full md:w-80">
                  <span className="text-gray-500">Valor Líquido:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(propertyValue)}</span>
                </div>
                <div className="flex justify-between w-full md:w-80">
                  <span className="text-gray-500">Disponível para %:</span>
                  <span className="font-bold text-purple-600">{formatCurrency(propertyValue)}</span>
                </div>
                <div className="flex justify-between w-full md:w-80">
                  <span className="text-gray-500">Percentuais: <span className={isMatch ? "text-green-600" : "text-red-600"}>{Math.round(totalPercentage)}%</span></span>
                  <span className="font-bold text-gray-900">{formatCurrency(totalValue)}</span>
                </div>
                
                <div className="flex justify-between w-full md:w-80 pt-3 border-t mt-1">
                  <span className="font-bold text-gray-900 text-base">TOTAL A SER PAGO:</span>
                  <span className={isMatch ? "font-bold text-green-600 text-base" : "font-bold text-red-600 text-base"}>{formatCurrency(totalValue)}</span>
                </div>
                
                <div className="w-full md:w-80 flex justify-start">
                  {isMatch ? (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 rounded-full bg-green-600"></span> Valores conferem ✓
                    </span>
                  ) : (
                    <span className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span> Diferença: {formatCurrency(differenceValue)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Reajuste de Valores */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Reajuste de Valores - LEIA COM ATENÇÃO</h2>
            <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-5 text-sm text-amber-900 space-y-4">
              <p>Os valores das parcelas apresentados nesta proposta estão sujeitos a reajuste periódico conforme as seguintes condições:</p>
              
              <div className="space-y-3 pl-2">
                <div>
                  <p className="font-bold">→ EMPREENDIMENTO EM CONSTRUÇÃO:</p>
                  <p className="text-gray-700 mt-1">Correção monetária pelo INCC - Índice Nacional de Custo da Construção (Fundação Getúlio Vargas), aplicada durante o período de obras até a expedição do Habite-se.</p>
                </div>
                <div>
                  <p className="font-bold">→ EMPREENDIMENTO PRONTO PARA MORAR:</p>
                  <p className="text-gray-700 mt-1">Correção monetária pelo índice definido pela incorporadora (a ser especificado no contrato), aplicada conforme periodicidade estabelecida no instrumento de compra e venda.</p>
                </div>
              </div>
              
              <p className="italic text-xs text-amber-800 mt-4 border-t border-amber-200 pt-3">
                Os reajustes observarão os critérios, períodos e metodologia de cálculo estabelecidos no contrato definitivo, em conformidade com a legislação em vigor. O proponente declara ciência e concordância com estas condições.
              </p>
            </div>
          </section>

          {/* Observações Complementares */}
          {proposal.notes && (
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Observações Complementares</h2>
              <div className="border rounded-xl p-5 bg-white text-sm text-gray-700">
                {proposal.notes}
              </div>
            </section>
          )}

          {/* Action Buttons / Status */}
          <div className="pt-6 print:hidden">
            {proposal.status === "PENDING" ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 h-14 font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all"
                  onClick={() => handleAction("reject")}
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5 mr-2" /> Recusar Proposta
                </Button>
                <Button 
                  className="flex-1 h-14 font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                  onClick={() => handleAction("accept")}
                  disabled={isSubmitting}
                >
                  <Check className="w-5 h-5 mr-2" /> Aceitar Proposta
                </Button>
              </div>
            ) : (
              <div className={`p-6 rounded-xl text-center flex flex-col items-center justify-center space-y-2 border ${
                proposal.status === "ACCEPTED" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
              }`}>
                <div className="flex items-center justify-center gap-2">
                  {proposal.status === "ACCEPTED" ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                  <h3 className="text-xl font-bold">
                    Proposta {proposal.status === "ACCEPTED" ? "Aceita" : "Recusada"}
                  </h3>
                </div>
                <p className="text-sm opacity-80">
                  {proposal.status === "ACCEPTED" ? "Aceita" : "Recusada"} em {formatDate(proposal.accepted_at || proposal.rejected_at || proposal.updated_at)}
                </p>
              </div>
            )}
          </div>

          {proposal.status !== "PENDING" && (
            <div className={`p-6 rounded-xl text-center flex flex-col items-center justify-center space-y-2 border ${
              proposal.status === "ACCEPTED" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
            } print:border print:mt-6`}>
              <div className="flex items-center justify-center gap-2">
                {proposal.status === "ACCEPTED" ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                <h3 className="text-xl font-bold">
                  Proposta {proposal.status === "ACCEPTED" ? "Aceita" : "Recusada"}
                </h3>
              </div>
              <p className="text-sm opacity-80">
                {proposal.status === "ACCEPTED" ? "Aceita" : "Recusada"} em {formatDate(proposal.accepted_at || proposal.rejected_at || proposal.updated_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
