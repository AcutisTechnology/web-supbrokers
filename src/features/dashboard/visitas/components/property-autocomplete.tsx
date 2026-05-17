"use client";

import { useCallback, useState } from "react";

import {
  AutocompleteInput,
  AutocompleteOption,
  AutocompleteValue,
} from "@/components/ui/autocomplete-input";

import { searchVisitProperties } from "../services/visits-service";
import { PropertySearchResult } from "../types/visit";
import { QuickCreatePropertyModal } from "./quick-create-property-modal";

type Props = {
  propertyId: number | null;
  propertyLabel: string;
  onSelect: (property: PropertySearchResult | null, fallbackName?: string) => void;
};

export function PropertyAutocomplete({ propertyId, propertyLabel, onSelect }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [typedQuery, setTypedQuery] = useState("");

  const handleSearch = useCallback(async (query: string): Promise<AutocompleteOption[]> => {
    const results = await searchVisitProperties(query);
    return results.map((property) => ({
      id: String(property.id),
      name: buildPropertyLabel(property),
    }));
  }, []);

  const handleChange = async (value: AutocompleteValue) => {
    if (value.id) {
      const cleanQuery = value.name.split(" — ")[0];
      const results = await searchVisitProperties(cleanQuery);
      const found = results.find((p) => String(p.id) === value.id) ?? null;
      if (found) {
        onSelect(found);
      }
      return;
    }

    onSelect(null, value.name);
    setTypedQuery(value.name);
  };

  return (
    <>
      <AutocompleteInput
        value={{ id: propertyId ? String(propertyId) : null, name: propertyLabel }}
        onChange={handleChange}
        onSearch={handleSearch}
        placeholder="Buscar por código, título, empreendimento ou bairro"
        createLabel={(typed) => `+ Criar imóvel rápido: ${typed}`}
      />
      {propertyLabel && !propertyId ? (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="text-sm font-medium text-[#9747FF] hover:underline"
          >
            + Criar imóvel rápido com &quot;{propertyLabel}&quot;
          </button>
        </div>
      ) : null}

      <QuickCreatePropertyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialName={typedQuery || propertyLabel}
        onCreated={(property) => {
          onSelect(property);
        }}
      />
    </>
  );
}

function buildPropertyLabel(property: PropertySearchResult): string {
  const parts: string[] = [];
  if (property.code) parts.push(property.code);
  if (property.title) parts.push(property.title);
  const main = parts.join(" — ") || property.title || property.code || "Imóvel";
  if (property.neighborhood) return `${main} (${property.neighborhood})`;
  return main;
}
