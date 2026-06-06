"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, ExternalLink } from "lucide-react";
import { CrmLead } from "../services/customer-service";
import { getLeadStatusLabel, getLeadStatusColor } from "../utils/cliente-utils";

interface ClienteDesktopRowProps {
  lead: CrmLead;
}

export function ClienteDesktopRow({ lead }: ClienteDesktopRowProps) {
  const statusLabel = getLeadStatusLabel(lead.status);
  const statusColor = getLeadStatusColor(lead.status);

  return (
    <tr className="border-b last:border-0 hover:bg-gray-50 transition-colors">
      {/* Lead */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div>
            <div className="font-medium text-[#1c1b1f] flex items-center gap-1.5">
              {lead.name}
              {lead.is_hot && <Flame className="h-3.5 w-3.5 text-orange-500" />}
            </div>
            <div className="text-sm text-[#969696]">{lead.phone}</div>
            {lead.email && <div className="text-sm text-[#969696]">{lead.email}</div>}
          </div>
        </div>
      </td>

      {/* Etapa */}
      <td className="px-6 py-4">
        {lead.pipeline_stage ? (
          <span className="flex items-center gap-1.5 text-sm text-[#1c1b1f]">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: lead.pipeline_stage.color ?? "#9747FF" }}
            />
            {lead.pipeline_stage.name}
          </span>
        ) : (
          <span className="text-sm text-[#969696]">—</span>
        )}
      </td>

      {/* Responsável */}
      <td className="px-6 py-4">
        <span className="text-sm text-[#1c1b1f]">
          {lead.assigned_user?.name ?? <span className="text-[#969696]">—</span>}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span className="flex items-center gap-1.5 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
          {statusLabel}
        </span>
      </td>

      {/* Último contato */}
      <td className="px-6 py-4">
        <span className="text-sm text-[#969696]">
          {lead.days_without_contact != null
            ? `${lead.days_without_contact}d sem contato`
            : "Novo"}
        </span>
      </td>

      {/* Ações */}
      <td className="px-6 py-4">
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href={`/dashboard/crm/leads/${lead.id}`}>
            <ExternalLink className="h-3.5 w-3.5" />
            Ver lead
          </Link>
        </Button>
      </td>
    </tr>
  );
}
