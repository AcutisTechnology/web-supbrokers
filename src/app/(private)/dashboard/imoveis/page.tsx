"use client";

import { Button } from "@/components/ui/button";
import Layout from "./layout";
import { PropertyCard } from "@/features/dashboard/imoveis/property-card";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { useRouter } from "next/navigation";

const properties = Array(8).fill({
  image:
    "https://www.cimentoitambe.com.br/wp-content/uploads/2024/04/OAS1-1.jpg",
  title: "Residencial Vista do Atlântico",
  location: "Intermares, Cabedelo",
  stats: {
    area: 1345,
    rooms: 12,
  },
});

export default function PropertiesPage() {
  const router = useRouter();

  return (
    <Layout>
      <TopNav title_secondary="Seus imóveis" />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#141414]">Imóveis</h1>
          <p className="text-[#777777]">Gerencie os seus imóveis</p>
        </div>
        <Button onClick={() => router.push("/dashboard/imoveis/novo")}>
          Criar novo imóvel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, i) => (
          <PropertyCard key={i} {...property} />
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-[#777777]">
        Copyright © Supbrokers. Todos os direitos reservados
      </div>
    </Layout>
  );
}
