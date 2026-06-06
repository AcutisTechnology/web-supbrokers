import { CrmLead } from "../services/customer-service";
import { ClienteDesktopRow } from "./cliente-desktop-row";
import { ClienteMobileCard } from "./cliente-mobile-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientesTableProps {
  leads: CrmLead[];
  isLoading: boolean;
}

export function ClientesTable({ leads, isLoading }: ClientesTableProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="p-8 text-center text-[#969696]">
        Nenhum lead encontrado.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Tabela Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left px-6 py-3 text-xs font-medium text-[#969696] uppercase tracking-wide">Lead</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[#969696] uppercase tracking-wide">Etapa</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[#969696] uppercase tracking-wide">Responsável</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[#969696] uppercase tracking-wide">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[#969696] uppercase tracking-wide">Último contato</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[#969696] uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <ClienteDesktopRow key={lead.id} lead={lead} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Lista Mobile */}
      <div className="md:hidden space-y-3 p-3">
        {leads.map((lead) => (
          <ClienteMobileCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
