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
    <Card className="p-8 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <div className="text-lg font-semibold text-[#9747ff]">{aluguel.imovel}</div>
          <div className="text-[#969696]">Inquilino: <span className="text-[#1c1b1f]">{aluguel.inquilino}</span></div>
          <div className="text-[#969696]">Valor: <span className="text-[#1c1b1f]">{aluguel.valor}</span></div>
          <div className="text-[#969696]">Status: <span className="text-[#16ae4f]">{aluguel.status}</span></div>
          <div className="text-[#969696]">Período: <span className="text-[#1c1b1f]">{formatDateBR(aluguel.data_inicio)} a {formatDateBR(aluguel.data_fim)}</span></div>
          <div className="text-[#969696]">Garantia: <span className="text-[#1c1b1f]">{aluguel.garantia}</span></div>
          <div className="text-[#969696]">Multa: <span className="text-[#1c1b1f]">{aluguel.multa}</span></div>
          <div className="text-[#969696]">Reajuste: <span className="text-[#1c1b1f]">{aluguel.reajuste}</span></div>
          <div className="text-[#969696]">Observações: <span className="text-[#1c1b1f]">{aluguel.observacoes}</span></div>
        </div>
        <div className="flex flex-row gap-2 justify-end items-start w-full md:w-auto mt-6 md:mt-0">
          <Button variant="outline" size="sm" className="flex items-center gap-2"><FileText className="w-4 h-4" /> Gerar contrato</Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={onNovaSolicitacaoReparo}><Wrench className="w-4 h-4" /> Nova solicitação de reparo</Button>
        </div>
      </div>
    </Card>
  );
} 