"use client";

import { useBrokerProperties } from "@/features/landing/services/broker-service";
import { PropertyCard } from "@/features/landing/components/property-card";
import { use } from "react";
import Link from "next/link";

export default function ImoveisDestaquesPage({ params }: { params: Promise<{ corretor: string }> }) {
  const { corretor } = use(params);
  const { data: response, isLoading, error } = useBrokerProperties(corretor);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Não foi possível carregar os imóveis.</p>
      </div>
    );
  }

  const { user, all } = response.data;
  const items = all.filter((p) => p.highlighted);

  return (
    <div className="min-h-screen bg-white">
      <div
        className="rounded-xl m-4 md:m-8 p-6 md:px-20 md:py-9"
        style={{ backgroundColor: user.page_settings?.primary_color || "#9747FF" }}
      >
        <div className="flex items-center justify-between">
          <Link href={`/${corretor}`} className="text-white hover:underline">
            Voltar
          </Link>
        </div>
        <h1 className="font-medium text-3xl md:text-5xl text-white mt-6 leading-snug">Destaques</h1>
        <p className="text-white text-lg md:text-xl mt-2">Todos os imóveis em destaque.</p>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items.map((property, i) => (
                <PropertyCard
                  key={i}
                  primary_color={user.page_settings?.primary_color}
                  title={property.title}
                  location={`${property.neighborhood}, João Pessoa`}
                  price={property.sale ? property.value.split(",")[0] : property.value}
                  type={property.sale ? "sale" : "rent"}
                  details={{
                    area: `${property.size}m²`,
                    bedrooms: `${property.bedrooms} quartos`,
                    hasElevator: property.characteristics.some((c) => c.text.toLowerCase().includes("elevador")),
                  }}
                  imageUrl={
                    property.attachments[0]?.url ||
                    "https://www.cimentoitambe.com.br/wp-content/uploads/2024/04/OAS1-1.jpg"
                  }
                  slug={property.slug}
                  propertyData={property}
                  userData={user}
                />
              ))}
            </div>
          ) : (
            <p className="text-[#777777]">Nenhum imóvel em destaque.</p>
          )}
        </div>
      </section>
    </div>
  );
}

