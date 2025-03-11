"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PropertyCard } from "@/features/dashboard/imoveis/property-card";
import Layout from "../layout";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { useProperties } from "@/features/dashboard/imoveis/services/property-service";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Plus } from "lucide-react";

export default function PropertiesPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Buscar imóveis com React Query
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useProperties(currentPage);
  
  // Função para mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Função para criar um novo imóvel
  const handleCreateProperty = () => {
    router.push("/dashboard/imoveis/novo");
  };

  return (
    <>
      <TopNav title_secondary="Seus imóveis" />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#141414]">Imóveis</h1>
          <p className="text-[#777777]">Gerencie os seus imóveis</p>
        </div>
        <Button onClick={handleCreateProperty}>
          <Plus className="mr-2 h-4 w-4" />
          Criar novo imóvel
        </Button>
      </div>

      {/* Estado de carregamento e erro */}
      <LoadingState 
        isLoading={isLoading} 
        isError={isError} 
        error={error as Error} 
        onRetry={() => refetch()}
      />
      
      {/* Lista de imóveis */}
      {!isLoading && !isError && (
        <>
          {data?.data && data.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((property, index) => (
                <PropertyCard key={`${property.slug}-${index}`} property={property} />
              ))}
            </div>
          ) : (
            <EmptyState 
              action={{
                label: "Criar novo imóvel",
                onClick: handleCreateProperty
              }}
            />
          )}
          
          {/* Paginação */}
          {data?.meta && data.meta.last_page > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={data.meta.last_page}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          )}
        </>
      )}

      <div className="mt-8 text-center text-sm text-[#777777]">
        Copyright © Supbrokers. Todos os direitos reservados
      </div>
    </>
  );
}
