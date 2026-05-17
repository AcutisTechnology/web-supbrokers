"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Pagination } from "@/components/ui/pagination";
import { TopNav } from "@/features/dashboard/visitas/components/top-nav";
import { VisitsFiltersBar } from "@/features/dashboard/visitas/components/visits-filters";
import { VisitsTable } from "@/features/dashboard/visitas/components/visits-table";
import { useDeleteVisit, useVisits } from "@/features/dashboard/visitas/services/visits-service";
import { VisitListItem, VisitsFilters } from "@/features/dashboard/visitas/types/visit";

export default function VisitsListPage() {
  const [filters, setFilters] = useState<VisitsFilters>({ page: 1, per_page: 15 });
  const { data, isLoading, isError, error, refetch } = useVisits(filters);
  const deleteMutation = useDeleteVisit();

  const handleDelete = async (visit: VisitListItem) => {
    if (!window.confirm(`Excluir a visita de ${visit.visitor_name}?`)) return;
    try {
      await deleteMutation.mutateAsync(visit.id);
      toast.success("Visita excluída.");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível excluir a visita.");
    }
  };

  const visits = data?.data ?? [];
  const totalPages = data?.meta?.last_page ?? 1;
  const currentPage = data?.meta?.current_page ?? 1;
  const total = data?.meta?.total ?? 0;

  return (
    <>
      <TopNav title_secondary="Visitas" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#141414]">Visitas registradas</h2>
          <p className="text-sm text-[#777777]">
            {total > 0
              ? `${total} visita${total === 1 ? "" : "s"} ${total === 1 ? "encontrada" : "encontradas"}.`
              : "Nenhuma visita registrada ainda."}
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/visitas/nova">
            <Plus className="h-4 w-4" /> Nova visita
          </Link>
        </Button>
      </div>

      <VisitsFiltersBar filters={filters} onChange={setFilters} />

      <LoadingState
        isLoading={isLoading}
        isError={isError}
        error={error as Error | null}
        onRetry={refetch}
      />

      {!isLoading && !isError ? (
        visits.length > 0 ? (
          <>
            <VisitsTable visits={visits} onDelete={handleDelete} />

            {totalPages > 1 ? (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
                />
              </div>
            ) : null}
          </>
        ) : (
          <EmptyState
            title="Nenhuma visita encontrada"
            description="Registre a primeira visita para começar a substituir as fichas físicas."
            action={{
              label: "Criar nova visita",
              onClick: () => {
                window.location.href = "/dashboard/visitas/nova";
              },
            }}
          />
        )
      ) : null}
    </>
  );
}
