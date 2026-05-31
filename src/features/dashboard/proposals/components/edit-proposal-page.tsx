"use client";

import { useProposal } from "../hooks/use-proposals";
import { ProposalForm } from "./proposal-form";
import { useParams } from "next/navigation";
import { LoadingState } from "@/components/ui/loading-state";
import { Property } from "@/features/dashboard/imoveis/services/property-service";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";

export function EditProposalPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useProposal(Number(id));

  if (isLoading) return <LoadingState isLoading={true} isError={false} />;

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold text-[#4A316A]">Proposta não encontrada</h2>
        <p className="text-[#969696]">Não foi possível carregar os dados desta proposta.</p>
      </div>
    );
  }

  const proposal = data.data;

  // Verificamos se a proposta pode ser editada (ex: status não aceito)
  if (proposal.status === "ACCEPTED") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <span className="text-red-500 font-bold">!</span>
        </div>
        <h2 className="text-xl font-bold text-[#4A316A]">Edição bloqueada</h2>
        <p className="text-[#969696] mt-2">
          Propostas com status Aceita não podem mais ser editadas.
        </p>
      </div>
    );
  }

  return (
    <>
      <TopNav title_secondary="Editar proposta" />
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <ProposalForm
          property={proposal.property as unknown as Property}
          initialData={proposal}
          isEditing
        />
      </div>
    </>
  );
}
