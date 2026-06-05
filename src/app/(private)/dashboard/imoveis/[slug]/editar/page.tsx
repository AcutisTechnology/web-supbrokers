"use client";

import { useRouter } from "next/navigation";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { PropertyForm } from "@/features/dashboard/imoveis/novo/components/property-form";
import { useProperty } from "@/features/dashboard/imoveis/services/property-service";
import { LoadingState } from "@/components/ui/loading-state";
import {
  PROPERTY_TYPES,
  PropertyFormValues,
  type PropertyType,
} from "@/features/dashboard/imoveis/novo/schemas/property-schema";
import { resolveCharacteristicId } from "@/lib/property";
import React, { use, useMemo } from "react";

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

    const propertyType =
      property.property_type &&
      (PROPERTY_TYPES as readonly string[]).includes(property.property_type)
        ? (property.property_type as PropertyType)
        : null;

    return {
      title: property.title,
      description: property.description,
      property_type: propertyType,
      street: property.street,
      neighborhood: property.neighborhood,
      city: property.city ?? "",
      state: property.state ?? "",
      zipcode: property.zipcode ?? "",
      size: property.size,
      bedrooms: property.bedrooms,
      suites: property.suites ?? 0,
      bathrooms: property.bathrooms ?? 0,
      garages: property.garages,
      rent: property.rent ? 1 : 0,
      sale: property.sale ? 1 : 0,
      value: parseMoneyValue(property.value),
      iptu_value: parseMoneyValue(property.iptu_value),
      condominium_value: parseMoneyValue(property.condominium_value),
      code: property.code,
      qr_code: property.qr_code ?? "",
      active: property.active ? 1 : 0,
      // Normaliza para ID canônico (lida com IDs diretos, sufixo "Form" legado e labels legados)
      characteristics: property.characteristics?.map(c => resolveCharacteristicId(c.text)) || [],
      attachments: property.attachments || [],
      purpose,
    };
  }, [property]);

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

// Componente de página principal (cliente)
export default function EditPropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  // Renderizar o componente cliente com o slug
  return <EditPropertyClient slug={slug} />;
}