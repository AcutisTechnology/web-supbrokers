import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";

export default function ClientesPage() {
  return (
    <>
      <div className="flex-1">
        <TopNav title_secondary="Gestão de Leads (Clientes)" />

        <main className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-[#1c1b1f] mb-1">
                Gestão de Leads (Clientes)
              </h1>
              <p className="text-[#969696]">
                Veja a lista dos seus clientes que visitaram seu site e se
                interessaram por algum imóvel.
              </p>
            </div>
          </div>

          {/* Tabs para filtrar os contratos */}
          <Tabs defaultValue="todos" className="bg-white rounded-lg shadow-sm">
            <div className="border-b px-6 py-3">
              <TabsList className="flex gap-6 justify-start">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="atendidos">Já atendido</TabsTrigger>
                <TabsTrigger value="atrasados">Aprovados</TabsTrigger>
                <TabsTrigger value="finalizados">Reprovados</TabsTrigger>
              </TabsList>
            </div>

            {/* Conteúdo das Tabs */}
            <TabsContent value="todos">
              <RentalTable />
            </TabsContent>
            <TabsContent value="atendidos">
              <RentalTable status="atendidos" />
            </TabsContent>
            <TabsContent value="atrasados">
              <RentalTable status="atrasados" />
            </TabsContent>
            <TabsContent value="finalizados">
              <RentalTable status="finalizados" />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}

// Componente da Tabela de Aluguéis
function RentalTable({ status = "todos" }: { status?: string }) {
  const rentals = [
    {
      id: 1,
      endereco: "Rua Renato de Souza Maciel, 660, APT. 402",
      bairro: "Bessa - João Pessoa, PB",
      inquilino: "Lucas Santana Ramos Cartaxo",
      situacao: "Interessado",
      corSituacao: "#16ae4f",
      valor: "R$ 1.200,00",
    },
    {
      id: 2,
      endereco: "Avenida Principal, 123, Casa",
      bairro: "Tambaú - João Pessoa, PB",
      inquilino: "Ana Carolina Souza",
      situacao: "Sem interesse",
      corSituacao: "#e63946",
      valor: "R$ 2.000,00",
    },
    {
      id: 3,
      endereco: "Rua das Flores, 45, APT. 101",
      bairro: "Manaíra - João Pessoa, PB",
      inquilino: "João Pedro Ferreira",
      situacao: "Em análise",
      corSituacao: "#969696",
      valor: "R$ 1.500,00",
    },
  ];

  // Filtrando contratos conforme a aba selecionada
  const filteredRentals =
    status === "todos"
      ? rentals
      : rentals.filter((rental) =>
          rental.situacao.toLowerCase().includes(status),
        );

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left px-6 py-3 text-sm font-medium text-[#969696]">
              IMÓVEL
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-[#969696]">
              SITUAÇÃO
            </th>
            <th className="text-left px-6 py-3 text-sm font-medium text-[#969696]">
              VALOR
            </th>
            <th className="w-8 px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {filteredRentals.length > 0 ? (
            filteredRentals.map((rental) => (
              <tr key={rental.id} className="border-b last:border-0">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-[#1c1b1f]">
                      {rental.endereco}
                    </div>
                    <div className="text-sm text-[#969696]">
                      {rental.bairro}
                    </div>
                    <div className="text-sm text-[#969696] mt-1">
                      {rental.inquilino}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: rental.corSituacao }}
                      />
                      <span className="text-[#1c1b1f]">{rental.situacao}</span>
                    </div>
                    <div className="text-sm text-[#969696]">
                      O contrato vence em 12 meses
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#1c1b1f]">{rental.valor}</td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-6 text-[#969696]">
                Nenhum contrato encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="px-6 py-3 border-t flex items-center justify-between">
        <Button variant="outline" size="sm" disabled>
          Anterior
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-[#f6f6f6]">
            1
          </Button>
          <Button variant="outline" size="sm">
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
