"use client";

import { useParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { TopNav } from "@/features/dashboard/visitas/components/top-nav";
import { VisitForm } from "@/features/dashboard/visitas/components/visit-form";
import { useVisit } from "@/features/dashboard/visitas/services/visits-service";

export default function EditVisitPage() {
  const params = useParams<{ id: string }>();
  const visitId = Number(params.id);
  const { data: visit, isLoading, isError, error, refetch } = useVisit(
    Number.isFinite(visitId) ? visitId : null,
  );

  if (!Number.isFinite(visitId) || visitId <= 0) {
    return (
      <>
        <TopNav title_secondary="Editar visita" />
        <Card>
          <CardContent className="py-8 text-center text-[#777777]">Visita inválida.</CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <TopNav title_secondary="Editar visita" />

      <LoadingState
        isLoading={isLoading}
        isError={isError}
        error={error as Error | null}
        onRetry={refetch}
      />

      {!isLoading && !isError && visit ? (
        <VisitForm mode="edit" initialVisit={visit} />
      ) : null}
    </>
  );
}
