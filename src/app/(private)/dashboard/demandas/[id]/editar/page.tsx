"use client";

import { use } from "react";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { DemandaForm } from "@/features/dashboard/demandas/components/demanda-form";

export default function EditarDemandaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const demandaId = Number(id);

  if (!Number.isFinite(demandaId) || demandaId <= 0) {
    return <div className="p-6 text-red-500">ID inválido.</div>;
  }

  return (
    <div className="flex-1">
      <main className="p-4 sm:p-6">
        <TopNav title_secondary="Demandas" />
        <h1 className="text-xl font-semibold text-gray-800 mb-6">Editar Demanda</h1>
        <DemandaForm demandaId={demandaId} />
      </main>
    </div>
  );
}
