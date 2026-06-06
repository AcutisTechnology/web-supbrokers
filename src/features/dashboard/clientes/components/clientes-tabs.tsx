import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrmLead, CrmLeadsFilters } from "../services/customer-service";
import { ClientesTable } from "./clientes-table";
import { Badge } from "@/components/ui/badge";

interface ClientesTabsProps {
  leads: CrmLead[];
  isLoading: boolean;
  status: CrmLeadsFilters["status"];
  onStatusChange: (status: CrmLeadsFilters["status"]) => void;
}

export function ClientesTabs({ leads, isLoading, status, onStatusChange }: ClientesTabsProps) {
  const counts = {
    all:  leads.length,
    open: leads.filter((l) => l.status === "open").length,
    won:  leads.filter((l) => l.status === "won").length,
    lost: leads.filter((l) => l.status === "lost").length,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Tabs value={status ?? "all"} onValueChange={(v) => onStatusChange(v as CrmLeadsFilters["status"])}>
        <div className="border-b">
          <div className="px-2 md:px-6 py-3">
            <TabsList className="w-full h-auto flex flex-wrap md:flex-nowrap justify-start gap-1">
              <TabsTrigger value="all" className="text-sm flex-1 md:flex-none px-3 md:px-4 gap-1.5">
                Todos
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{counts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="open" className="text-sm flex-1 md:flex-none px-3 md:px-4 gap-1.5">
                Em aberto
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{counts.open}</Badge>
              </TabsTrigger>
              <TabsTrigger value="won" className="text-sm flex-1 md:flex-none px-3 md:px-4 gap-1.5">
                Ganhos
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{counts.won}</Badge>
              </TabsTrigger>
              <TabsTrigger value="lost" className="text-sm flex-1 md:flex-none px-3 md:px-4 gap-1.5">
                Perdidos
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{counts.lost}</Badge>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="p-0">
          {(["all", "open", "won", "lost"] as const).map((s) => (
            <TabsContent key={s} value={s} className="mt-0">
              <ClientesTable leads={leads} isLoading={isLoading} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
