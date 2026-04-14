"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  SelectItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Copy, Trash2, Share2 } from "lucide-react";
import { Proposal, ProposalStatus } from "../types/proposal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDeleteProposal, useDuplicateProposal } from "../hooks/use-proposals";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface ProposalDesktopRowProps {
  proposal: Proposal;
}

const statusMap: Record<ProposalStatus, { label: string; color: string }> = {
  PENDING: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  ACCEPTED: { label: "Aceita", color: "bg-green-100 text-green-800" },
  REJECTED: { label: "Recusada", color: "bg-red-100 text-red-800" },
  CANCELED: { label: "Cancelada", color: "bg-gray-100 text-gray-800" },
};

export function ProposalDesktopRow({ proposal }: ProposalDesktopRowProps) {
  const { mutate: deleteProposal } = useDeleteProposal();
  const { mutate: duplicateProposal } = useDuplicateProposal();
  const { toast } = useToast();

  const handleCopyLink = () => {
    const url = `${window.location.origin}/proposta/${proposal.token}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado!",
      description: "O link da proposta foi copiado para a área de transferência.",
    });
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium text-[#4A316A]">#{proposal.code}</span>
          <span className="text-xs text-[#969696]">
            {format(new Date(proposal.created_at), "dd/MM/yyyy", { locale: ptBR })}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium text-[#4A316A] line-clamp-1">
            {proposal.property.title}
          </span>
          <span className="text-xs text-[#969696] line-clamp-1">
            {proposal.property.street}, {proposal.property.neighborhood}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="font-semibold text-[#4A316A]">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(proposal.total_value)}
        </span>
      </td>
      <td className="px-6 py-4">
        <Badge className={`${statusMap[proposal.status].color} border-none font-medium`}>
          {statusMap[proposal.status].label}
        </Badge>
      </td>
      <td className="px-6 py-4 text-sm text-[#969696]">
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {proposal.views_count}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/propostas/${proposal.id}`}>
                <Eye className="mr-2 h-4 w-4" /> Visualizar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild disabled={proposal.status === "ACCEPTED"}>
              <Link href={`/dashboard/propostas/${proposal.id}/editar`}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => duplicateProposal(proposal.id)}>
              <Copy className="mr-2 h-4 w-4" /> Duplicar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink}>
              <Share2 className="mr-2 h-4 w-4" /> Compartilhar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600"
              onClick={() => {
                if (confirm("Deseja realmente excluir esta proposta?")) {
                  deleteProposal(proposal.id);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
