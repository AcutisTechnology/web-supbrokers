"use client";

import { useRouter } from "next/navigation";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { PropertyForm } from "@/features/dashboard/imoveis/novo/components/property-form";
import { useProperty } from "@/features/dashboard/imoveis/services/property-service";
import { LoadingState } from "@/components/ui/loading-state";
import { PropertyFormValues } from "@/features/dashboard/imoveis/novo/schemas/property-schema";
import React, { useMemo } from "react";

// Componente cliente que recebe o slug como propriedade
function EditPropertyClient({ slug }: { slug: string }) {
  const router = useRouter();
  
  // Buscar dados do imóvel
  const { 
    data: propertyResponse, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useProperty(slug);
  
  // Extrair os dados do imóvel da resposta
  const property = propertyResponse?.data;

  // Preparar os dados para o formulário usando useMemo para evitar recálculos desnecessários
  const formValues = useMemo((): Partial<PropertyFormValues> => {
    if (!property) return {};

    // Determinar o propósito (aluguel ou venda)
    const purpose = property.rent ? "rent" : "sell" as const;

    // Função para converter valores monetários formatados para número
    const parseMoneyValue = (value: string | undefined): number => {
      if (!value) return 0;
      // Remove R$, pontos e substitui vírgula por ponto
      return parseFloat(value.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
    };

    return {
      title: property.title,
      description: property.description,
      street: property.street,
      neighborhood: property.neighborhood,
      size: property.size,
      bedrooms: property.bedrooms,
      garages: property.garages,
      rent: property.rent ? 1 : 0,
      sale: property.sale ? 1 : 0,
      value: parseMoneyValue(property.value),
      iptu_value: parseMoneyValue(property.iptu_value),
      code: property.code,
      qr_code: property.qr_code,
      active: property.active ? 1 : 0,
      characteristics: property.characteristics?.map(c => c.text) || [],
      purpose,
    };
  }, [property]); // Dependência apenas do property

  return (
    <>
      <TopNav title_secondary="Editar imóvel" />
      
      {/* Estado de carregamento e erro */}
      <LoadingState 
        isLoading={isLoading} 
        isError={isError} 
        error={error as Error} 
        onRetry={() => refetch()}
      />
      
      {!isLoading && !isError && property && (
        <div className="space-y-6">          
          {/* Formulário de edição */}
          <PropertyForm 
            initialValues={formValues} 
            isEditing={true}
            propertySlug={slug}
          />
        </div>
      )}
    </>
  );
}

// Componente de página principal (servidor)
export default async function EditPropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Renderizar o componente cliente com o slug
  return <EditPropertyClient slug={slug} />;
} 