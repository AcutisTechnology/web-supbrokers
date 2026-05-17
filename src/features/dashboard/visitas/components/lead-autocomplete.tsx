"use client";

import { useCallback, useState } from "react";

import {
  AutocompleteInput,
  AutocompleteOption,
  AutocompleteValue,
} from "@/components/ui/autocomplete-input";

import { searchVisitLeads } from "../services/visits-service";
import { LeadSearchResult } from "../types/visit";
import { QuickCreateLeadModal } from "./quick-create-lead-modal";

type Props = {
  leadId: number | null;
  leadName: string;
  onSelect: (lead: LeadSearchResult | null, fallbackName?: string) => void;
};

export function LeadAutocomplete({ leadId, leadName, onSelect }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [typedQuery, setTypedQuery] = useState("");

  const handleSearch = useCallback(async (query: string): Promise<AutocompleteOption[]> => {
    const results = await searchVisitLeads(query);
    return results.map((lead) => ({
      id: String(lead.id),
      name: lead.phone ? `${lead.name} — ${lead.phone}` : lead.name,
    }));
  }, []);

  const handleChange = async (value: AutocompleteValue) => {
    if (value.id) {
      // Carrega informações completas do lead via busca
      const results = await searchVisitLeads(value.name.split(" — ")[0]);
      const found = results.find((l) => String(l.id) === value.id) ?? null;
      if (found) {
        onSelect(found);
      }
      return;
    }

    // ID null: usuário ou digitou texto livre ou clicou em "Cadastrar"
    onSelect(null, value.name);
    setTypedQuery(value.name);
  };

  const triggerCreate = () => {
    setModalOpen(true);
  };

  return (
    <>
      <AutocompleteInput
        value={{ id: leadId ? String(leadId) : null, name: leadName }}
        onChange={handleChange}
        onSearch={handleSearch}
        placeholder="Buscar por nome, telefone ou e-mail"
        createLabel={(typed) => `+ Criar novo lead: ${typed}`}
      />
      {leadName && !leadId ? (
        <div className="mt-2">
          <button
            type="button"
            onClick={triggerCreate}
            className="text-sm font-medium text-[#9747FF] hover:underline"
          >
            + Criar novo lead com &quot;{leadName}&quot;
          </button>
        </div>
      ) : null}

      <QuickCreateLeadModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialName={typedQuery || leadName}
        onCreated={(lead) => {
          onSelect(lead);
        }}
      />
    </>
  );
}
