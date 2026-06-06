"use client";

import { useState } from "react";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { useLeads, CrmLeadsFilters } from "../services/customer-service";
import { ClientesTabs } from "./clientes-tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export function ClientesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CrmLeadsFilters["status"]>("all");

  const debouncedSearch = useDebounce(search, 300);

  const { data: leads = [], isLoading, isError } = useLeads({
    search: debouncedSearch || undefined,
    status,
  });

  return (
    <>
      <div className="flex-1">
        <TopNav title_secondary="Gestão de Leads" />

        <main className="p-4 md:p-6 space-y-4">
          {/* Busca */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#969696]" />
            <Input
              placeholder="Buscar por nome ou telefone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {isError && (
            <div className="text-center py-8 text-[#969696]">
              Erro ao carregar leads. Tente novamente.
            </div>
          )}

          {!isError && (
            <ClientesTabs
              leads={leads}
              isLoading={isLoading}
              status={status}
              onStatusChange={setStatus}
            />
          )}
        </main>
      </div>
    </>
  );
}
