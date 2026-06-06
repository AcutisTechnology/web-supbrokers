"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame, ExternalLink } from "lucide-react";
import { CrmLead } from "../services/customer-service";
import { getLeadStatusLabel, getLeadStatusColor } from "../utils/cliente-utils";

interface ClienteMobileCardProps {
  lead: CrmLead;
}

export function ClienteMobileCard({ lead }: ClienteMobileCardProps) {
  const statusLabel = getLeadStatusLabel(lead.status);
  const statusColor = getLeadStatusColor(lead.status);

  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      {/* Nome + is_hot */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-medium text-[#1c1b1f] flex items-center gap-1.5">
            {lead.name}
            {lead.is_hot && <Flame className="h-3.5 w-3.5 text-orange-500" />}
          </div>
          <div className="text-sm text-[#969696]">{lead.phone}</div>
          {lead.email && <div className="text-sm text-[#969696]">{lead.email}</div>}
        </div>

        <span className="flex items-center gap-1.5 text-xs shrink-0 mt-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
          {statusLabel}
        </span>
      </div>

      {/* Etapa + responsável */}
      <div className="flex items-center justify-between text-sm border-t pt-2">
        <div className="text-[#969696]">
          {lead.pipeline_stage ? (
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: lead.pipeline_stage.color ?? "#9747FF" }}
              />
              {lead.pipeline_stage.name}
            </span>
          ) : "—"}
        </div>
        <div className="text-[#969696] text-xs">
          {lead.assigned_user?.name ?? "Sem responsável"}
        </div>
      </div>

      {/* Último contato + ação */}
      <div className="flex items-center justify-between border-t pt-2">
        <span className="text-xs text-[#969696]">
          {lead.days_without_contact != null
            ? `${lead.days_without_contact}d sem contato`
            : "Novo"}
        </span>
        <Button asChild variant="outline" size="sm" className="gap-1.5 h-7 text-xs">
          <Link href={`/dashboard/crm/leads/${lead.id}`}>
            <ExternalLink className="h-3 w-3" />
            Ver lead
          </Link>
        </Button>
      </div>
    </div>
  );
}
