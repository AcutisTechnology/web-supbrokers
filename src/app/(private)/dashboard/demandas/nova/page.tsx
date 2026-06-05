"use client";

import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { DemandaForm } from "@/features/dashboard/demandas/components/demanda-form";

export default function NovaDemandaPage() {
  return (
    <div className="flex-1">
      <main className="p-4 sm:p-6">
        <TopNav title_secondary="Demandas" />
        <h1 className="text-xl font-semibold text-gray-800 mb-6">Nova Demanda</h1>
        <DemandaForm />
      </main>
    </div>
  );
}
