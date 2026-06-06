"use client";

import { useEffect, useRef, useState } from "react";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { useInfiniteLeads, CrmLeadsFilters } from "../services/customer-service";
import { ClientesTabs } from "./clientes-tabs";
import { ClientesTable } from "./clientes-table";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export function ClientesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CrmLeadsFilters["status"]>("all");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search, 300);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteLeads({
    search: debouncedSearch || undefined,
    status,
  });

  const leads = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.meta.total ?? 0;

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Reset scroll quando filtros mudam
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [status, debouncedSearch]);

  return (
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
          <div className="bg-white rounded-lg shadow-sm">
            <ClientesTabs
              status={status}
              onStatusChange={(s) => setStatus(s)}
              total={total}
            />

            <ClientesTable leads={leads} isLoading={isLoading} />
          </div>
        )}

        {/* Sentinel de infinite scroll */}
        <div ref={sentinelRef} className="h-1" />

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-[#9747FF]" />
          </div>
        )}
      </main>
    </div>
  );
}
