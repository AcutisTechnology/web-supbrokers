"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { useCustomers, Customer, PaginatedResponse } from "@/features/dashboard/clientes/services/customer-service";
import { LoadingState } from "@/components/ui/loading-state";
import { Pagination } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

export default function ClientesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("todos");
  
  // Buscar clientes com React Query
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useCustomers(currentPage);
  
  // Função para mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex-1">
        <TopNav title_secondary="Gestão de Leads (Clientes)" />

        <main className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-[#1c1b1f] mb-1">
                Gestão de Leads (Clientes)
              </h1>
              <p className="text-sm md:text-base text-[#969696]">
                Veja a lista dos seus clientes que visitaram seu site e se
                interessaram por algum imóvel.
              </p>
            </div>
          </div>

          {/* Estado de carregamento e erro */}
          <LoadingState 
            isLoading={isLoading} 
            isError={isError} 
            error={error as Error} 
            onRetry={() => refetch()}
          />

          {!isLoading && !isError && (
            <>
              {/* Tabs para filtrar os clientes */}
              <div className="bg-white rounded-lg shadow-sm">
                <Tabs 
                  defaultValue="todos" 
                  className="w-full"
                  onValueChange={(value) => setCurrentTab(value)}
                >
                  <div className="border-b">
                    <div className="px-2 md:px-6 py-3">
                      <TabsList className="w-full h-auto flex flex-wrap md:flex-nowrap justify-start">
                        <TabsTrigger value="todos" className="text-sm flex-1 md:flex-none px-2 md:px-4">
                          Todos
                        </TabsTrigger>
                        <TabsTrigger value="interessados" className="text-sm flex-1 md:flex-none px-2 md:px-4">
                          Interessados
                        </TabsTrigger>
                        <TabsTrigger value="sem-interesse" className="text-sm flex-1 md:flex-none px-2 md:px-4">
                          Sem interesse
                        </TabsTrigger>
                        <TabsTrigger value="em-analise" className="text-sm flex-1 md:flex-none px-2 md:px-4">
                          Em análise
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </div>

                  <div className="p-0">
                    <TabsContent value="todos" className="mt-0">
                      <ClientesTable data={data} />
                    </TabsContent>
                    <TabsContent value="interessados" className="mt-0">
                      <ClientesTable data={data} status="Interessado" />
                    </TabsContent>
                    <TabsContent value="sem-interesse" className="mt-0">
                      <ClientesTable data={data} status="Sem interesse" />
                    </TabsContent>
                    <TabsContent value="em-analise" className="mt-0">
                      <ClientesTable data={data} status="Em análise" />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Paginação */}
              {data?.meta && data.meta.last_page > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={data.meta.last_page}
                  onPageChange={handlePageChange}
                  className="mt-6 md:mt-8"
                />
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}

// Componente da Tabela de Clientes
function ClientesTable({ 
  data, 
  status = "todos" 
}: { 
  data: PaginatedResponse<Customer> | undefined, 
  status?: string 
}) {
  const router = useRouter();
  
  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="p-4 md:p-6 text-center text-[#969696]">
        Nenhum cliente encontrado.
      </div>
    );
  }

  const getSituacao = (cliente: Customer) => {
    if (cliente.interested_properties && cliente.interested_properties.length > 0) {
      return "Interessado";
    }
    return "Em análise";
  };

  const getCorSituacao = (situacao: string) => {
    switch (situacao) {
      case "Interessado":
        return "#16ae4f";
      case "Sem interesse":
        return "#e63946";
      case "Em análise":
      default:
        return "#969696";
    }
  };

  const filteredClientes = status === "todos"
    ? data.data
    : data.data.filter((cliente) => getSituacao(cliente) === status);

  return (
    <div className="w-full overflow-hidden">
      {/* Tabela Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left px-6 py-3 text-sm font-medium text-[#969696]">
                CLIENTE
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-[#969696]">
                SITUAÇÃO
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-[#969696]">
                IMÓVEIS DE INTERESSE
              </th>
              <th className="w-8 px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.length > 0 ? (
              filteredClientes.map((cliente) => {
                const situacao = getSituacao(cliente);
                const corSituacao = getCorSituacao(situacao);
                const imovelInteresse = cliente.interested_properties && cliente.interested_properties.length > 0
                  ? cliente.interested_properties[0]
                  : null;

                return (
                  <tr key={cliente.id} className="border-b last:border-0">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-[#1c1b1f]">
                          {cliente.name}
                        </div>
                        <div className="text-sm text-[#969696]">
                          {cliente.email}
                        </div>
                        <div className="text-sm text-[#969696] mt-1">
                          {cliente.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: corSituacao }}
                          />
                          <span className="text-[#1c1b1f]">{situacao}</span>
                        </div>
                        <div className="text-sm text-[#969696]">
                          {cliente.interested_properties.length} imóveis de interesse
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {imovelInteresse ? (
                        <div>
                          <div className="font-medium text-[#1c1b1f]">
                            {imovelInteresse.title}
                          </div>
                          <div className="text-sm text-[#969696]">
                            {imovelInteresse.neighborhood}, {imovelInteresse.street}
                          </div>
                          <div className="text-sm text-[#969696] mt-1">
                            {imovelInteresse.rent ? "Aluguel" : "Venda"}: R$ {imovelInteresse.value}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[#969696]">Nenhum imóvel de interesse</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-[#969696]">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Lista Mobile */}
      <div className="md:hidden space-y-4">
        {filteredClientes.length > 0 ? (
          filteredClientes.map((cliente) => {
            const situacao = getSituacao(cliente);
            const corSituacao = getCorSituacao(situacao);
            const imovelInteresse = cliente.interested_properties && cliente.interested_properties.length > 0
              ? cliente.interested_properties[0]
              : null;

            return (
              <div key={cliente.id} className="bg-white rounded-lg border p-4">
                <div>
                  <div className="font-medium text-[#1c1b1f]">
                    {cliente.name}
                  </div>
                  <div className="text-sm text-[#969696]">
                    {cliente.email}
                  </div>
                  <div className="text-sm text-[#969696] mt-1">
                    {cliente.phone}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: corSituacao }}
                    />
                    <span className="text-[#1c1b1f]">{situacao}</span>
                  </div>
                  <div className="text-sm text-[#969696] mt-1">
                    {cliente.interested_properties.length} imóveis de interesse
                  </div>
                </div>

                {imovelInteresse && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="font-medium text-[#1c1b1f]">
                      {imovelInteresse.title}
                    </div>
                    <div className="text-sm text-[#969696]">
                      {imovelInteresse.neighborhood}, {imovelInteresse.street}
                    </div>
                    <div className="text-sm text-[#969696] mt-1">
                      {imovelInteresse.rent ? "Aluguel" : "Venda"}: R$ {imovelInteresse.value}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-[#969696]">
            Nenhum cliente encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
