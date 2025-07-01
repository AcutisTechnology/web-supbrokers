import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Wrench } from "lucide-react";
import { Aluguel } from "../types/aluguel";

interface AluguelResumoProps {
  aluguel: Aluguel;
  formatDateBR: (dateStr: string) => string;
  onNovaSolicitacaoReparo?: () => void;
}

export function AluguelResumo({ aluguel, formatDateBR, onNovaSolicitacaoReparo }: AluguelResumoProps) {
  return (
    <Card className="p-4 sm:p-6 lg:p-8 shadow-sm mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="space-y-2">
          <div className="text-base sm:text-lg font-semibold text-[#9747ff]">{aluguel.imovel}</div>
          <div className="text-sm sm:text-base text-[#969696]">Inquilino: <span className="text-[#1c1b1f]">{aluguel.inquilino || '--'}</span></div>
          <div className="text-sm sm:text-base text-[#969696]">Valor: <span className="text-[#1c1b1f]">{aluguel.valor ? Number(aluguel.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '--'}</span></div>
          <div className="text-sm sm:text-base text-[#969696]">Status: <span className="text-[#16ae4f]">{aluguel.status || '--'}</span></div>
          <div className="text-sm sm:text-base text-[#969696]">Período: <span className="text-[#1c1b1f]">{aluguel.data_inicio && aluguel.data_fim ? `${formatDateBR(aluguel.data_inicio)} a ${formatDateBR(aluguel.data_fim)}` : '--'}</span></div>
          <div className="text-sm sm:text-base text-[#969696]">Garantia: <span className="text-[#1c1b1f]">{aluguel.garantia || '--'}</span></div>
          <div className="text-sm sm:text-base text-[#969696]">Multa: <span className="text-[#1c1b1f]">{aluguel.multa || '--'}</span></div>
          <div className="text-sm sm:text-base text-[#969696]">Reajuste: <span className="text-[#1c1b1f]">{aluguel.reajuste || '--'}</span></div>
          <div className="text-sm sm:text-base text-[#969696]">Observações: <span className="text-[#1c1b1f]">{aluguel.observacoes || '--'}</span></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 lg:justify-end lg:items-start w-full mt-4 lg:mt-0">
          <Button variant="outline" size="sm" className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"><FileText className="w-4 h-4" /> Gerar contrato</Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm" onClick={onNovaSolicitacaoReparo}><Wrench className="w-4 h-4" /> Nova solicitação</Button>
        </div>
      </div>
    </Card>
  );
} 