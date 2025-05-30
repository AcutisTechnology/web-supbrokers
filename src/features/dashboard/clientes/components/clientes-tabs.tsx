import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaginatedResponse, Customer } from "../services/customer-service";
import { ClientesTable } from "./clientes-table";

interface ClientesTabsProps {
  data: PaginatedResponse<Customer> | undefined;
}

export function ClientesTabs({ data }: ClientesTabsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Tabs 
        defaultValue="todos" 
        className="w-full"
      >
        <div className="border-b">
          <div className="px-2 md:px-6 py-3">
            <TabsList className="w-full h-auto flex flex-wrap md:flex-nowrap justify-start">
              <TabsTrigger value="todos" className="text-sm flex-1 md:flex-none px-2 md:px-4">
                Todos
              </TabsTrigger>
              <TabsTrigger value="interessados" className="text-sm flex-1 md:flex-none px-2 md:px-4">
                Interessados
              </TabsTrigger>
              <TabsTrigger value="sem-interesse" className="text-sm flex-1 md:flex-none px-2 md:px-4">
                Sem interesse
              </TabsTrigger>
              <TabsTrigger value="em-analise" className="text-sm flex-1 md:flex-none px-2 md:px-4">
                Em análise
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="p-0">
          <TabsContent value="todos" className="mt-0">
            <ClientesTable data={data} />
          </TabsContent>
          <TabsContent value="interessados" className="mt-0">
            <ClientesTable data={data} status="Interessado" />
          </TabsContent>
          <TabsContent value="sem-interesse" className="mt-0">
            <ClientesTable data={data} status="Sem interesse" />
          </TabsContent>
          <TabsContent value="em-analise" className="mt-0">
            <ClientesTable data={data} status="Em análise" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
} 