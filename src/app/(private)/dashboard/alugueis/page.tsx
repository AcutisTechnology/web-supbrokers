"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { getAlugueis } from '@/features/dashboard/alugueis/services/aluguel-service';
import { useAlugueis } from '@/features/dashboard/alugueis/hooks/use-alugueis';

export default function AlugueisPage() {
  const router = useRouter();
  return (
    <>
      <div className="flex-1">
        <TopNav title_secondary="Gestão de aluguéis" />

        <main className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl sm:text-2xl font-semibold text-[#1c1b1f]">
                  Gestão de aluguéis
                </h1>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#9747ff] to-[#7c2ae8] text-white shadow-sm">
                  BETA
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#969696]">
                Veja a lista dos seus contratos de aluguel ou adicione uma nova
                locação para gerenciar o aluguel de um imóvel.
              </p>
            </div>
            <Button className="bg-[#9747ff] hover:bg-[#7c2ae8] w-full sm:w-auto" onClick={() => router.push('/dashboard/alugueis/novo')}>
              Nova locação
            </Button>
          </div>

          {/* Tabs para filtrar os contratos */}
          <Tabs defaultValue="todos" className="bg-white rounded-lg shadow-sm">
            <div className="border-b px-3 sm:px-6 py-3">
              <TabsList className="flex gap-2 sm:gap-6 justify-start overflow-x-auto">
                <TabsTrigger value="todos" className="whitespace-nowrap">Todos</TabsTrigger>
                <TabsTrigger value="em-dia" className="whitespace-nowrap">Em dia</TabsTrigger>
                <TabsTrigger value="atrasados" className="whitespace-nowrap">Atrasados</TabsTrigger>
                <TabsTrigger value="finalizados" className="whitespace-nowrap">Finalizados</TabsTrigger>
              </TabsList>
            </div>

            {/* Conteúdo das Tabs */}
            <TabsContent value="todos">
              <RentalTable />
            </TabsContent>
            <TabsContent value="em-dia">
              <RentalTable status="em-dia" />
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
  const router = useRouter();
  const { data: rentals = [], isLoading, error } = useAlugueis();

  const filteredRentals = status === "todos"
    ? rentals
    : rentals.filter((rental) =>
        rental.situacao?.toLowerCase().includes(status)
      );

  if (isLoading) {
    return <div className="p-6 text-center">Carregando aluguéis...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-500">Erro ao carregar aluguéis</div>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="text-left px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-[#969696]">
                IMÓVEL
              </th>
              <th className="text-left px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-[#969696]">
                SITUAÇÃO
              </th>
              <th className="text-left px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium text-[#969696]">
                VALOR
              </th>
              <th className="w-8 px-3 sm:px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRentals.length > 0 ? (
              filteredRentals.map((rental) => (
                <tr key={rental.id} className="border-b last:border-0">
                  <td className="px-3 sm:px-6 py-4">
                    <div>
                      <div className="font-medium text-[#1c1b1f] text-sm sm:text-base">
                        {rental.endereco}
                      </div>
                      <div className="text-xs sm:text-sm text-[#969696]">
                        {rental.bairro}
                      </div>
                      <div className="text-xs sm:text-sm text-[#969696] mt-1">
                        {rental.inquilino}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: rental.corSituacao }}
                        />
                        <span className="text-[#1c1b1f] text-sm sm:text-base">{rental.situacao}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-[#969696]">
                        O contrato vence em 12 meses
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-[#1c1b1f] text-sm sm:text-base font-medium">{Number(rental.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="px-3 sm:px-6 py-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/alugueis/${rental.id}`)}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-[#969696] text-sm sm:text-base">
                  Nenhum contrato encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="px-3 sm:px-6 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button variant="outline" size="sm" disabled className="w-full sm:w-auto">
          Anterior
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-[#f6f6f6]">
            1
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
