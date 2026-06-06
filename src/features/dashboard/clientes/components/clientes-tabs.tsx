import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrmLeadsFilters } from "../services/customer-service";
import { Badge } from "@/components/ui/badge";

interface ClientesTabsProps {
  status: CrmLeadsFilters["status"];
  onStatusChange: (status: CrmLeadsFilters["status"]) => void;
  total: number;
}

export function ClientesTabs({ status, onStatusChange, total }: ClientesTabsProps) {
  return (
    <div className="bg-white rounded-t-lg border-b px-2 md:px-6 py-3">
      <Tabs value={status ?? "all"} onValueChange={(v) => onStatusChange(v as CrmLeadsFilters["status"])}>
        <TabsList className="w-full h-auto flex flex-wrap md:flex-nowrap justify-start gap-1">
          <TabsTrigger value="all" className="text-sm flex-1 md:flex-none px-3 md:px-4 gap-1.5">
            Todos
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{total}</Badge>
          </TabsTrigger>
          <TabsTrigger value="open" className="text-sm flex-1 md:flex-none px-3 md:px-4">
            Em aberto
          </TabsTrigger>
          <TabsTrigger value="won" className="text-sm flex-1 md:flex-none px-3 md:px-4">
            Ganhos
          </TabsTrigger>
          <TabsTrigger value="lost" className="text-sm flex-1 md:flex-none px-3 md:px-4">
            Perdidos
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
