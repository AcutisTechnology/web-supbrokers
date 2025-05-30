import { PaginatedResponse, Customer } from "../services/customer-service";
import { ClienteDesktopRow } from "./cliente-desktop-row";
import { ClienteMobileCard } from "./cliente-mobile-card";

interface ClientesTableProps {
  data: PaginatedResponse<Customer> | undefined;
  status?: string;
}

export function ClientesTable({ data, status = "todos" }: ClientesTableProps) {
  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="p-4 md:p-6 text-center text-[#969696]">
        Nenhum cliente encontrado.
      </div>
    );
  }

  const getSituacao = (cliente: Customer) => {
    if (cliente.interested_properties && cliente.interested_properties.length > 0) {
      return "Interessado";
    }
    return "Em análise";
  };

  const filteredClientes = status === "todos"
    ? data.data
    : data.data.filter((cliente) => getSituacao(cliente) === status);

  return (
    <div className="w-full overflow-hidden">
      {/* Tabela Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left px-6 py-3 text-sm font-medium text-[#969696]">
                CLIENTE
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-[#969696]">
                SITUAÇÃO
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-[#969696]">
                IMÓVEIS DE INTERESSE
              </th>
              <th className="w-8 px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.length > 0 ? (
              filteredClientes.map((cliente) => (
                <ClienteDesktopRow key={cliente.id} cliente={cliente} />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-[#969696]">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Lista Mobile */}
      <div className="md:hidden space-y-4">
        {filteredClientes.length > 0 ? (
          filteredClientes.map((cliente) => (
            <ClienteMobileCard key={cliente.id} cliente={cliente} />
          ))
        ) : (
          <div className="text-center py-6 text-[#969696]">
            Nenhum cliente encontrado.
          </div>
        )}
      </div>
    </div>
  );
} 