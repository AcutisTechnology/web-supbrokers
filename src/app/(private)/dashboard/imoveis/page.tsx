"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useLayoutEffect } from "react";
import { PropertyCard } from "@/features/dashboard/imoveis/property-card";
import Layout from "../layout";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { useProperties, useDeleteProperty } from "@/features/dashboard/imoveis/services/property-service";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function PropertiesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  
  // Buscar imóveis com React Query
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useProperties(currentPage);

  // Hook para excluir imóvel
  const deletePropertyMutation = useDeleteProperty();
  
  // Função para mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Função para criar um novo imóvel
  const handleCreateProperty = () => {
    router.push("/dashboard/imoveis/novo");
  };

  // Função para excluir um imóvel
  const handleDeleteProperty = async (slug: string) => {
    try {
      await deletePropertyMutation.mutateAsync(slug, {
        onSuccess: () => {
          toast({
            title: "Imóvel excluído com sucesso!",
          });
          
          // Invalidar a consulta para recarregar os dados
          queryClient.invalidateQueries({ queryKey: ["properties"] });
        },
        onError: (error) => {
          toast({
            title: "Erro ao excluir imóvel",
            description: "Ocorreu um erro ao excluir o imóvel. Tente novamente.",
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
    }
  };

  // Efeito para verificar se precisamos atualizar os dados ao retornar de outra página
  useLayoutEffect(() => {
    // Verificar se estamos voltando de uma página de criação ou edição
    const handleRouteChange = () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    };

    // Executar a verificação quando o componente montar
    handleRouteChange();
  }, [queryClient]);

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
                <PropertyCard 
                  key={`${property.slug}-${index}`} 
                  property={property} 
                  onDelete={() => handleDeleteProperty(property.slug)}
                />
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
        Copyright © iMoobile. Todos os direitos reservados
      </div>
    </>
  );
}
