"use client";

import { useState } from "react";
import { PropertySelectionModal } from "./property-selection-modal";
import { ProposalForm } from "./proposal-form";
import { Property } from "@/features/dashboard/imoveis/services/property-service";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";

export function NewProposalPage() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  if (!selectedProperty) {
    return (
      <>
      <TopNav title_secondary="Nova proposta" />
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-[#4A316A]" />
        </div>
        <h1 className="text-2xl font-bold text-[#4A316A] mb-2">Começar Nova Proposta</h1>
        <p className="text-[#969696] max-w-md mb-8">
          Para iniciar uma proposta comercial, primeiro você precisa selecionar o imóvel desejado.
        </p>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#4A316A] hover:bg-[#3a2654] h-12 px-8"
        >
          Selecionar Imóvel
        </Button>

        <PropertySelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={(property) => {
            setSelectedProperty(property);
            setIsModalOpen(false);
          }}
        />
      </div>
      </>
    );
  }

  return (
    <>
      <TopNav title_secondary="Nova proposta" />
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <ProposalForm property={selectedProperty} />
      </div>
    </>
  );
}
