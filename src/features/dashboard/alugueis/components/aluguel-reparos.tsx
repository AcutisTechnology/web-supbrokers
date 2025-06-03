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
    <Card className="p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Wrench className="w-5 h-5 text-[#9747ff]" />
        <span className="font-semibold text-[#1c1b1f]">Solicitações de Reparo</span>
      </div>
      <div className="space-y-4">
        {reparos.map((reparo) => (
          <div key={reparo.id} className="flex items-center justify-between bg-[#f6f6f6] rounded p-4">
            <div>
              <div className="font-medium text-[#1c1b1f]">{reparo.titulo}</div>
              <div className="text-[#969696] text-sm">
                {reparo.status === "Finalizado"
                  ? `Finalizado em ${formatDateBR(reparo.dataConclusao!)}`
                  : `Aberto em ${formatDateBR(reparo.dataAbertura)}`}
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">Ver detalhes</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-[#9747ff]" />
                    {reparo.titulo}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Informações básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#969696]" />
                        <span className="text-sm text-[#969696]">Data de abertura:</span>
                        <span className="text-sm font-medium">{formatDateBR(reparo.dataAbertura)}</span>
                      </div>
                      {reparo.dataConclusao && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#969696]" />
                          <span className="text-sm text-[#969696]">Data de conclusão:</span>
                          <span className="text-sm font-medium">{formatDateBR(reparo.dataConclusao)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#969696]">Status:</span>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full text-xs ${
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
                        <User className="w-4 h-4 text-[#969696]" />
                        <span className="text-sm text-[#969696]">Responsável:</span>
                        <span className="text-sm font-medium">{reparo.responsavel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#969696]">Telefone:</span>
                        <span className="text-sm font-medium">{reparo.telefoneResponsavel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#969696]" />
                        <span className="text-sm text-[#969696]">Custo:</span>
                        <span className="text-sm font-medium text-[#16ae4f]">R$ {reparo.custo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                  {/* Descrição */}
                  <div>
                    <h4 className="text-sm font-medium text-[#1c1b1f] mb-2">Descrição</h4>
                    <p className="text-sm text-[#969696] bg-[#f6f6f6] p-3 rounded-lg">{reparo.descricao}</p>
                  </div>
                  {/* Observações */}
                  {reparo.observacoes && (
                    <div>
                      <h4 className="text-sm font-medium text-[#1c1b1f] mb-2">Observações</h4>
                      <p className="text-sm text-[#969696] bg-[#f6f6f6] p-3 rounded-lg">{reparo.observacoes}</p>
                    </div>
                  )}
                  {/* Recibo */}
                  <div>
                    <h4 className="text-sm font-medium text-[#1c1b1f] mb-3">Comprovantes</h4>
                    <div className="border border-[#e0e0e0] rounded-lg p-4 bg-[#f9f9f9]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#9747ff]/10 rounded-lg flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-[#9747ff]" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[#1c1b1f]">{reparo.recibo}</div>
                            <div className="text-xs text-[#969696]">Comprovante de pagamento</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
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