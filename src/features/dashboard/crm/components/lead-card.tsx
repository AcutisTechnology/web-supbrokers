"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Flame, MessageCircle, Phone, User2 } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CrmLead } from "../services/crm-service";

interface LeadCardProps {
  lead: CrmLead;
  draggable?: boolean;
}

const formatCurrency = (value: string | null | undefined) => {
  const numeric = value ? Number(value) : 0;
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number.isFinite(numeric) ? numeric : 0,
  );
};

const normalizePhoneDigits = (phone: string) => phone.replace(/\D/g, "");

export function LeadCard({ lead, draggable = true }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `lead-${lead.id}`,
    data: { leadId: lead.id, fromStageId: lead.pipeline_stage_id },
    disabled: !draggable,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  const phoneDigits = normalizePhoneDigits(lead.phone);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all",
        draggable && "cursor-grab active:cursor-grabbing",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/dashboard/crm/leads/${lead.id}`}
              className="text-sm font-semibold text-[#141414] truncate hover:text-[#9747FF] cursor-pointer"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {lead.name}
            </Link>
            {lead.is_hot ? (
              <span title="Lead quente — vários dias sem contato">
                <Flame className="h-4 w-4 text-orange-500 shrink-0" />
              </span>
            ) : null}
          </div>
          <div className="text-xs text-[#777777] truncate">{lead.phone}</div>
        </div>
        {lead.assigned_user?.name && (
          <div
            className="flex items-center gap-1 text-xs text-[#777777] shrink-0"
            title={`Responsável: ${lead.assigned_user.name}`}
          >
            <User2 className="h-3.5 w-3.5" />
            <span className="truncate max-w-[80px]">{lead.assigned_user.name.split(" ")[0]}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 mt-2.5">
        <div className="text-sm font-semibold text-[#141414]">{formatCurrency(lead.value)}</div>
        {lead.lead_source?.name ? (
          <Badge
            className="text-[10px] border"
            style={{
              backgroundColor: `${lead.lead_source.color ?? "#9747FF"}1a`,
              color: lead.lead_source.color ?? "#9747FF",
              borderColor: `${lead.lead_source.color ?? "#9747FF"}40`,
            }}
          >
            {lead.lead_source.name}
          </Badge>
        ) : lead.source ? (
          <Badge className="bg-gray-100 text-[#777777] border border-gray-200 text-[10px]">
            {lead.source}
          </Badge>
        ) : null}
      </div>

      {(lead.tags ?? []).length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {(lead.tags ?? []).slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${tag.color ?? "#9747FF"}1a`,
                color: tag.color ?? "#9747FF",
              }}
            >
              {tag.name}
            </span>
          ))}
          {(lead.tags ?? []).length > 3 && (
            <span className="text-[10px] text-[#777777]">+{(lead.tags ?? []).length - 3}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <div className="text-[10px] text-[#777777]">
          {lead.days_without_contact !== null && lead.days_without_contact !== undefined
            ? `${lead.days_without_contact}d sem contato`
            : "Novo"}
        </div>
        <div className="flex items-center gap-1">
          {phoneDigits ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <a href={`tel:+55${phoneDigits}`} title="Ligar">
                  <Phone className="h-3.5 w-3.5" />
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-emerald-600 hover:text-emerald-700"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <a
                  href={`https://wa.me/55${phoneDigits}`}
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                </a>
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
