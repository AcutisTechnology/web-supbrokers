"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Receipt, ChevronLeft, ChevronRight } from "lucide-react";
import { Pagamento } from "../types/pagamento";

interface AluguelDemonstrativoPagamentosProps {
  pagamentos: Pagamento[];
  formatDateBR: (dateStr: string) => string;
}

const PAGE_SIZE = 12;

export function AluguelDemonstrativoPagamentos({ pagamentos, formatDateBR }: AluguelDemonstrativoPagamentosProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(pagamentos.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginated = pagamentos.slice(start, start + PAGE_SIZE);

  const totalPago = pagamentos.filter(p => p.status === "Pago").reduce((acc, p) => acc + p.total, 0);
  const comAtraso = pagamentos.filter(p => p.diasAtraso > 0);
  const mediaAtraso = comAtraso.length > 0
    ? Math.round(comAtraso.reduce((acc, p) => acc + p.diasAtraso, 0) / comAtraso.length)
    : 0;
  const taxaPontualidade = pagamentos.length > 0
    ? Math.round((pagamentos.filter(p => p.diasAtraso === 0).length / pagamentos.length) * 100)
    : 0;

  return (
    <Card className="p-4 sm:p-6 shadow-sm mb-6">
      <div className="mb-4 sm:mb-6 flex items-center gap-2">
        <Receipt className="w-5 h-5 text-[#9747ff]" />
        <span className="font-semibold text-[#1c1b1f] text-base sm:text-lg">Demonstrativo de pagamentos</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[#e0e0e0]">
              <th className="text-left py-3 px-2 text-xs sm:text-sm font-medium text-[#969696]">Período</th>
              <th className="text-left py-3 px-2 text-xs sm:text-sm font-medium text-[#969696]">Vencimento</th>
              <th className="text-left py-3 px-2 text-xs sm:text-sm font-medium text-[#969696]">Pagamento</th>
              <th className="text-right py-3 px-2 text-xs sm:text-sm font-medium text-[#969696]">Aluguel</th>
              <th className="text-right py-3 px-2 text-xs sm:text-sm font-medium text-[#969696]">Condomínio</th>
              <th className="text-right py-3 px-2 text-xs sm:text-sm font-medium text-[#969696]">IPTU</th>
              <th className="text-right py-3 px-2 text-xs sm:text-sm font-medium text-[#969696]">Total</th>
              <th className="text-center py-3 px-2 text-xs sm:text-sm font-medium text-[#969696]">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((pagamento) => (
              <tr key={pagamento.id} className="border-b border-[#f0f0f0] hover:bg-[#f9f9f9] transition-colors">
                <td className="py-4 px-2">
                  <div className="font-medium text-[#1c1b1f] text-xs sm:text-sm">{pagamento.mes}</div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-xs sm:text-sm text-[#969696]">{formatDateBR(pagamento.dataVencimento)}</div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-xs sm:text-sm text-[#969696]">{formatDateBR(pagamento.dataPagamento)}</div>
                  {pagamento.diasAtraso > 0 && (
                    <div className="text-xs text-[#e63946]">{pagamento.diasAtraso} dias de atraso</div>
                  )}
                </td>
                <td className="py-4 px-2 text-right">
                  <div className="text-xs sm:text-sm font-medium text-[#1c1b1f]">
                    R$ {pagamento.aluguel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <div className="text-xs sm:text-sm font-medium text-[#1c1b1f]">
                    R$ {pagamento.condominio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <div className="text-xs sm:text-sm font-medium text-[#1c1b1f]">
                    R$ {pagamento.iptu.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </td>
                <td className="py-4 px-2 text-right">
                  <div className="text-xs sm:text-sm font-semibold text-[#16ae4f]">
                    R$ {pagamento.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </td>
                <td className="py-4 px-2 text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    pagamento.status === "Pago"
                      ? "bg-[#16ae4f]/10 text-[#16ae4f]"
                      : "bg-[#fbbf24]/10 text-[#fbbf24]"
                  }`}>
                    {pagamento.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f0f0f0]">
          <span className="text-xs text-[#969696]">
            {start + 1}–{Math.min(start + PAGE_SIZE, pagamentos.length)} de {pagamentos.length} pagamentos
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md text-[#969696] hover:bg-[#f0f0f0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`min-w-[28px] h-7 px-1.5 rounded-md text-xs font-medium transition-colors ${
                  n === page
                    ? "bg-[#9747ff] text-white"
                    : "text-[#969696] hover:bg-[#f0f0f0]"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md text-[#969696] hover:bg-[#f0f0f0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Próxima página"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Resumo — sempre calculado sobre todos os pagamentos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#e0e0e0]">
        <div className="bg-[#16ae4f]/5 rounded-lg p-4">
          <div className="text-sm text-[#969696] mb-1">Total pago</div>
          <div className="text-lg font-semibold text-[#16ae4f]">
            R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-[#fbbf24]/5 rounded-lg p-4">
          <div className="text-sm text-[#969696] mb-1">Pagamentos com atraso</div>
          <div className="text-lg font-semibold text-[#fbbf24]">{comAtraso.length}</div>
        </div>
        <div className="bg-[#9747ff]/5 rounded-lg p-4">
          <div className="text-sm text-[#969696] mb-1">Média de atraso</div>
          <div className="text-lg font-semibold text-[#9747ff]">{mediaAtraso} dias</div>
        </div>
        <div className="bg-[#2563eb]/5 rounded-lg p-4">
          <div className="text-sm text-[#969696] mb-1">Taxa de pontualidade</div>
          <div className="text-lg font-semibold text-[#2563eb]">{taxaPontualidade}%</div>
        </div>
      </div>
    </Card>
  );
}
