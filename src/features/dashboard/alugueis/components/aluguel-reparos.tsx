import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wrench, Calendar, User, DollarSign, Receipt, Download } from "lucide-react";
import { Reparo } from "../types/reparo";

interface AluguelReparosProps {
  reparos: Reparo[];
  formatDateBR: (dateStr: string) => string;
}

export function AluguelReparos({ reparos, formatDateBR }: AluguelReparosProps) {
  return (
    <Card className="p-4 sm:p-6 lg:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Wrench className="w-5 h-5 text-[#9747ff]" />
        <span className="font-semibold text-[#1c1b1f] text-base sm:text-lg">Solicitações de Reparo</span>
      </div>
      <div className="space-y-4">
        {reparos.map((reparo) => (
          <div key={reparo.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#f6f6f6] rounded p-4 gap-3">
            <div className="flex-1">
              <div className="font-medium text-[#1c1b1f] text-sm sm:text-base">{reparo.titulo}</div>
              <div className="text-[#969696] text-xs sm:text-sm">
                {reparo.status === "Finalizado"
                  ? `Finalizado em ${formatDateBR(reparo.dataConclusao!)}`
                  : `Aberto em ${formatDateBR(reparo.dataAbertura)}`}
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="w-full sm:w-auto">Ver detalhes</Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-[#9747ff]" />
                    <span className="text-sm sm:text-base">{reparo.titulo}</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 sm:space-y-6">
                  {/* Informações básicas */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#969696] flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-[#969696]">Data de abertura:</span>
                        <span className="text-xs sm:text-sm font-medium">{formatDateBR(reparo.dataAbertura)}</span>
                      </div>
                      {reparo.dataConclusao && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#969696] flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-[#969696]">Data de conclusão:</span>
                          <span className="text-xs sm:text-sm font-medium">{formatDateBR(reparo.dataConclusao)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-[#969696]">Status:</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          reparo.status === "Finalizado"
                            ? "bg-[#16ae4f]/10 text-[#16ae4f]"
                            : "bg-[#fbbf24]/10 text-[#fbbf24]"
                        }`}>
                          {reparo.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#969696] flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-[#969696]">Responsável:</span>
                        <span className="text-xs sm:text-sm font-medium">{reparo.responsavel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-[#969696]">Telefone:</span>
                        <span className="text-xs sm:text-sm font-medium">{reparo.telefoneResponsavel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#969696] flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-[#969696]">Custo:</span>
                        <span className="text-xs sm:text-sm font-medium text-[#16ae4f]">R$ {reparo.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                  {/* Descrição */}
                  <div>
                    <h4 className="text-sm font-medium text-[#1c1b1f] mb-2">Descrição</h4>
                    <p className="text-xs sm:text-sm text-[#969696] bg-[#f6f6f6] p-3 rounded-lg">{reparo.descricao}</p>
                  </div>
                  {/* Observações */}
                  {reparo.observacoes && (
                    <div>
                      <h4 className="text-sm font-medium text-[#1c1b1f] mb-2">Observações</h4>
                      <p className="text-xs sm:text-sm text-[#969696] bg-[#f6f6f6] p-3 rounded-lg">{reparo.observacoes}</p>
                    </div>
                  )}
                  {/* Recibo */}
                  <div>
                    <h4 className="text-sm font-medium text-[#1c1b1f] mb-3">Comprovantes</h4>
                    <div className="border border-[#e0e0e0] rounded-lg p-3 sm:p-4 bg-[#f9f9f9]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#9747ff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-[#9747ff]" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-medium text-[#1c1b1f]">{reparo.recibo}</div>
                            <div className="text-xs text-[#969696]">Comprovante de pagamento</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                          <Download className="w-4 h-4" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </Card>
  );
} 