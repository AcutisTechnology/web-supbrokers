import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";
import { Aluguel } from "../types/aluguel";

interface AluguelDocumentosProps {
  aluguel: Aluguel;
}

export function AluguelDocumentos({ aluguel }: AluguelDocumentosProps) {
  const documentos = [
    {
      nome: "RG do Inquilino",
      url: aluguel.doc_rg,
      icone: <FileText className="w-4 h-4" />
    },
    {
      nome: "CPF do Inquilino", 
      url: aluguel.doc_cpf,
      icone: <FileText className="w-4 h-4" />
    },
    {
      nome: "Comprovante de Renda",
      url: aluguel.doc_renda,
      icone: <FileText className="w-4 h-4" />
    }
  ];

  const documentosDisponiveis = documentos.filter(doc => doc.url);

  const handleVisualizarDocumento = (url: string) => {
    window.open(url, '_blank');
  };

  const handleBaixarDocumento = (url: string, nome: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = nome;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (documentosDisponiveis.length === 0) {
    return (
      <Card className="p-4 sm:p-6 shadow-sm mb-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#9747ff]" />
          <span className="font-semibold text-[#1c1b1f] text-base sm:text-lg">Documentos</span>
        </div>
        <div className="text-center py-6 sm:py-8">
          <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-[#969696] mx-auto mb-3" />
          <p className="text-sm sm:text-base text-[#969696]">Nenhum documento foi cadastrado para esta locação.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 shadow-sm mb-6">
      <div className="mb-4 sm:mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-[#9747ff]" />
        <span className="font-semibold text-[#1c1b1f] text-base sm:text-lg">Documentos</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {documentosDisponiveis.map((documento, index) => (
          <div key={index} className="border border-[#e0e0e0] rounded-lg p-3 sm:p-4 hover:bg-[#f9f9f9] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {documento.icone}
                <h3 className="font-medium text-[#1c1b1f] text-xs sm:text-sm">{documento.nome}</h3>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs w-full"
                onClick={() => documento.url && handleVisualizarDocumento(documento.url)}
              >
                <Eye className="w-3 h-3 mr-1" />
                Visualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs w-full"
                onClick={() => documento.url && handleBaixarDocumento(documento.url, documento.nome)}
              >
                <Download className="w-3 h-3 mr-1" />
                Baixar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
} 