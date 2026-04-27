"use client";

import { useState } from "react";
import { ProposalsHeader } from "./proposals-header";
import { ProposalsTable } from "./proposals-table";
import { useProposals } from "../hooks/use-proposals";
import { Pagination } from "@/components/ui/pagination"; // Preciso verificar se esse componente existe no local correto

export function ProposalsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const { data, isLoading } = useProposals(page, search, status === "all" ? undefined : status);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <ProposalsHeader 
        search={search} 
        setSearch={setSearch} 
        status={status} 
        setStatus={setStatus} 
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A316A]"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <ProposalsTable data={data} />
          
          {data && data.meta && data.meta.last_page > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination 
                currentPage={page}
                totalPages={data.meta.last_page}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
