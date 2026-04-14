"use client";

import { Proposal } from "../types/proposal";
import { PaginatedResponse } from "@/features/dashboard/clientes/services/customer-service";
import { ProposalDesktopRow } from "./proposal-desktop-row";
import { ProposalMobileCard } from "./proposal-mobile-card";

interface ProposalsTableProps {
  data: PaginatedResponse<Proposal> | undefined;
}

export function ProposalsTable({ data }: ProposalsTableProps) {
  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E2E2] p-12 text-center">
        <p className="text-[#969696] mb-2">Nenhuma proposta encontrada.</p>
        <p className="text-sm text-[#BDBDBD]">Comece criando uma nova proposta comercial.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-[#E2E2E2] overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[#E2E2E2]">
              <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">CÓDIGO</th>
              <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">IMÓVEL</th>
              <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">VALOR TOTAL</th>
              <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">STATUS</th>
              <th className="text-left px-6 py-4 font-semibold text-[#4A316A]">VIEWS</th>
              <th className="text-right px-6 py-4 font-semibold text-[#4A316A]">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((proposal) => (
              <ProposalDesktopRow key={proposal.id} proposal={proposal} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-4">
        {data.data.map((proposal) => (
          <ProposalMobileCard key={proposal.id} proposal={proposal} />
        ))}
      </div>
    </div>
  );
}
