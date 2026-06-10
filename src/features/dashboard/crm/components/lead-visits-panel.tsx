"use client";

import Link from "next/link";
import { CalendarCheck, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useVisits } from "@/features/dashboard/visitas/services/visits-service";

interface Props {
  leadId: number;
}

const STATUS_LABELS: Record<string, string> = {
  agendada: "Agendada",
  em_andamento: "Em andamento",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
};

const STATUS_CLASS: Record<string, string> = {
  agendada: "bg-blue-100 text-blue-800 border border-blue-200",
  em_andamento: "bg-amber-100 text-amber-800 border border-amber-200",
  finalizada: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  cancelada: "bg-rose-100 text-rose-800 border border-rose-200",
};

const formatDateTime = (iso?: string | null) => {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export function LeadVisitsPanel({ leadId }: Props) {
  const { data, isLoading } = useVisits({ lead_id: leadId, per_page: 50 });
  const visits = data?.data ?? [];

  return (
    <Card className="border border-gray-100 shadow-sm rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Visitas vinculadas</CardTitle>
        <span className="text-xs text-[#777777]">{visits.length} registro(s)</span>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : visits.length === 0 ? (
          <EmptyState
            icon={<CalendarCheck className="h-6 w-6 text-[#9747FF]" />}
            title="Nenhuma visita vinculada"
            description="Quando uma visita for criada para este lead, ela aparecerá aqui."
          />
        ) : (
          <div className="space-y-2">
            {visits.map((v) => (
              <Link
                key={v.id}
                href={`/dashboard/visitas/${v.id}`}
                className="block p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CalendarCheck className="h-4 w-4 text-[#9747FF]" />
                      <span className="text-sm font-semibold text-[#141414]">
                        {v.property_name ?? "Imóvel não informado"}
                      </span>
                      <Badge className={STATUS_CLASS[v.status] ?? "bg-gray-100 text-[#777777]"}>
                        {STATUS_LABELS[v.status] ?? v.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-[#777777] mt-1">{v.visitor_name}</div>
                    {v.visited_at && (
                      <div className="text-xs text-[#777777] mt-1">
                        Visita: {formatDateTime(v.visited_at)}
                      </div>
                    )}
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#777777]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
