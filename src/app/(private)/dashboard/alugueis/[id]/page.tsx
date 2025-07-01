"use client";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { useAluguelDetalhe } from "@/features/dashboard/alugueis/hooks/use-aluguel-detalhe";
import { AluguelDetalheFinanceiro } from "@/features/dashboard/alugueis/components/aluguel-detalhe-financeiro";
import { AluguelDemonstrativoPagamentos } from "@/features/dashboard/alugueis/components/aluguel-demonstrativo-pagamentos";
import { AluguelResumo } from "@/features/dashboard/alugueis/components/aluguel-resumo";
import { AluguelReparos } from "@/features/dashboard/alugueis/components/aluguel-reparos";
import { AluguelDocumentos } from "@/features/dashboard/alugueis/components/aluguel-documentos";
import React from "react";
import type { Financeiro } from "@/features/dashboard/alugueis/components/aluguel-detalhe-financeiro";
import type { Pagamento } from "@/features/dashboard/alugueis/types/pagamento";
import type { Aluguel } from "@/features/dashboard/alugueis/types/aluguel";
import type { Reparo } from "@/features/dashboard/alugueis/types/reparo";

const financeiroDefault: Financeiro = {
  pagamentosEmDia: 0,
  pagamentosAtraso: 0,
  custoReparos: 0,
  custoCondominio: 0,
  custoIptu: 0,
  grafico: [],
};

export default function DetalheAluguelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { aluguel, pagamentos, reparos, financeiro, formatDateBR, loading, error } = useAluguelDetalhe(id);

  if (loading) {
    return <div className="p-6 text-center">Carregando detalhes...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-500">{String(error)}</div>;
  }

  return (
    <div className="flex-1">
      <TopNav title_secondary="Gestão de aluguéis" />
      <main className="p-4 sm:p-6">
        <AluguelDetalheFinanceiro financeiro={financeiro ?? financeiroDefault} />
        <AluguelDemonstrativoPagamentos pagamentos={pagamentos as Pagamento[]} formatDateBR={formatDateBR} />
        <AluguelResumo aluguel={aluguel as Aluguel} formatDateBR={formatDateBR} />
        <AluguelDocumentos aluguel={aluguel as Aluguel} />
        <AluguelReparos reparos={reparos as Reparo[]} formatDateBR={formatDateBR} />
      </main>
    </div>
  );
} 