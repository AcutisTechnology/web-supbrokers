"use client";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { useAluguelDetalhe } from "@/features/dashboard/alugueis/hooks/use-aluguel-detalhe";
import { AluguelDetalheFinanceiro } from "@/features/dashboard/alugueis/components/aluguel-detalhe-financeiro";
import { AluguelDemonstrativoPagamentos } from "@/features/dashboard/alugueis/components/aluguel-demonstrativo-pagamentos";
import { AluguelResumo } from "@/features/dashboard/alugueis/components/aluguel-resumo";
import { AluguelReparos } from "@/features/dashboard/alugueis/components/aluguel-reparos";
import React from "react";

export default function DetalheAluguelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { aluguel, pagamentos, reparos, financeiro, formatDateBR } = useAluguelDetalhe(id);

  return (
    <div className="flex-1">
      <TopNav title_secondary="Gestão de aluguéis" />
      <main className="p-6">
        <AluguelDetalheFinanceiro financeiro={financeiro} />
        <AluguelDemonstrativoPagamentos pagamentos={pagamentos} formatDateBR={formatDateBR} />
        <AluguelResumo aluguel={aluguel} formatDateBR={formatDateBR} />
        <AluguelReparos reparos={reparos} formatDateBR={formatDateBR} />
      </main>
    </div>
  );
} 