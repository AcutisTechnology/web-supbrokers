"use client";

import { useState } from "react";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { useCustomers } from "../services/customer-service";
import { LoadingState } from "@/components/ui/loading-state";
import { Pagination } from "@/components/ui/pagination";
import { ClientesTabs } from "./clientes-tabs";
import { ClientesHeader } from "./clientes-header";

export function ClientesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  
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
          <ClientesHeader />

          {/* Estado de carregamento e erro */}
          <LoadingState 
            isLoading={isLoading} 
            isError={isError} 
            error={error as Error} 
            onRetry={() => refetch()}
          />

          {!isLoading && !isError && (
            <>
              <ClientesTabs data={data} />

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