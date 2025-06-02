"use client";

import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { PropertyListing } from "@/features/landing/property/components/property-listing";
import { SiteHeader } from "@/features/landing/property/components/site-header";
import { usePropertyDetail, getSelectedProperty, useBrokerProperties } from "@/features/landing/services/broker-service";

export default function PropertyDetails({ params }: { params: Promise<{ corretor: string; slug: string }> }) {
  const router = useRouter();
  const { corretor, slug } = use(params);
  const { data: property, isLoading: isLoadingProperty, error: propertyError } = usePropertyDetail(corretor, slug);
  const { data: brokerData, isLoading: isLoadingBroker, error: brokerError } = useBrokerProperties(corretor);

  // Verificar se temos os dados do imóvel no localStorage
  useEffect(() => {
    // Se não estiver carregando e não tiver dados, verificamos o localStorage
    if (!isLoadingProperty && !property) {
      const storedProperty = getSelectedProperty();
      if (!storedProperty) {
        // Se não houver dados no localStorage, redirecionamos para a página do corretor
        router.push(`/${corretor}`);
      }
    }
  }, [isLoadingProperty, property, corretor, router]);

  const isLoading = isLoadingProperty || isLoadingBroker;
  const error = propertyError || brokerError;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  if (error || !property || !brokerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Não foi possível carregar o imóvel.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader corretor={corretor} />
      <main className="px-8 md:container py-6 mx-auto">
        <PropertyListing 
          propertyData={property.data.property} 
          userData={property.data.user} 
          allProperties={brokerData.data.all}
          corretor={corretor}
          primary_color={property.data.user.page_settings?.primary_color}
        />
      </main>
    </div>
  );
} 