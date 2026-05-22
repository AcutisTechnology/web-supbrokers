"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CrmLeadProposal } from "@/features/dashboard/crm/services/crm-service";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  shared: "bg-blue-100 text-blue-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  expired: "bg-amber-100 text-amber-700",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Rascunho",
  shared: "Compartilhada",
  accepted: "Aceita",
  rejected: "Rejeitada",
  expired: "Expirada",
};

const formatCurrency = (value: string | null | undefined) => {
  const numeric = value ? Number(value) : 0;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number.isFinite(numeric) ? numeric : 0,
  );
};

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("pt-BR");
  } catch {
    return iso;
  }
};

export function LeadProposalsPanel({ proposals }: { proposals: CrmLeadProposal[] }) {
  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Propostas ({proposals.length})</CardTitle>
        <Button asChild size="sm" variant="outline" className="gap-1">
          <Link href="/dashboard/propostas/novo">
            <Plus className="h-3.5 w-3.5" />
            Nova proposta
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {proposals.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-6 w-6 text-[#9747FF]" />}
            title="Nenhuma proposta vinculada"
            description="Crie uma proposta e informe este lead para vinculá-la automaticamente."
          />
        ) : (
          <div className="space-y-3">
            {proposals.map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-3 border rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-[#9747FF] mt-1" />
                  <div>
                    <Link
                      href={`/dashboard/propostas/${p.uuid}`}
                      className="font-medium text-[#141414] hover:underline"
                    >
                      {p.code ?? `Proposta #${p.id}`}
                    </Link>
                    {p.property && (
                      <div className="text-xs text-[#777777]">
                        Imóvel: {p.property.code ? `${p.property.code} — ` : ""}
                        {p.property.title ?? "-"}
                      </div>
                    )}
                    <div className="text-xs text-[#777777] mt-1">
                      Total: {formatCurrency(p.total_value)} · Criada em {formatDate(p.created_at)}
                      {p.accepted_at && <span className="ml-2">· Aceita em {formatDate(p.accepted_at)}</span>}
                      {p.rejected_at && <span className="ml-2">· Rejeitada em {formatDate(p.rejected_at)}</span>}
                    </div>
                  </div>
                </div>
                <Badge className={STATUS_STYLES[p.status] ?? "bg-gray-100 text-gray-700"}>
                  {STATUS_LABELS[p.status] ?? p.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
