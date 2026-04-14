"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Eye, Edit, Share2 } from "lucide-react";
import { Proposal, ProposalStatus } from "../types/proposal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface ProposalMobileCardProps {
  proposal: Proposal;
}

const statusMap: Record<ProposalStatus, { label: string; color: string }> = {
  PENDING: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  ACCEPTED: { label: "Aceita", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "Recusada", color: "bg-red-100 text-red-800" },
  CANCELED: { label: "Cancelada", color: "bg-gray-100 text-gray-800" },
};

export function ProposalMobileCard({ proposal }: ProposalMobileCardProps) {
  return (
    <Card className="border-[#E2E2E2] shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col">
            <span className="text-xs text-[#969696]">#{proposal.code}</span>
            <h3 className="font-semibold text-[#4A316A] line-clamp-1">
              {proposal.property?.title || "-"}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/propostas/${proposal.id}`}>Visualizar</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild disabled={proposal.status === "ACCEPTED"}>
                <Link href={`/dashboard/propostas/${proposal.id}/editar`}>Editar</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-lg text-[#4A316A]">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(proposal.total_value)}
          </span>
          <Badge className={`${statusMap[proposal.status].color} border-none`}>
            {statusMap[proposal.status].label}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-[#969696] pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {proposal.views_count} visualizações
          </div>
          <span>Atualizado em {new Date(proposal.updated_at).toLocaleDateString("pt-BR")}</span>
        </div>
      </CardContent>
    </Card>
  );
}
