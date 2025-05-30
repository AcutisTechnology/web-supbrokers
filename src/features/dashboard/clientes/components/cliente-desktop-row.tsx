import { Customer } from "../services/customer-service";
import { getClienteSituacao, getCorSituacao } from "../utils/cliente-utils";

interface ClienteDesktopRowProps {
  cliente: Customer;
}

export function ClienteDesktopRow({ cliente }: ClienteDesktopRowProps) {
  const situacao = getClienteSituacao(cliente);
  const corSituacao = getCorSituacao(situacao);
  const imovelInteresse = cliente.interested_properties && cliente.interested_properties.length > 0
    ? cliente.interested_properties[0]
    : null;

  return (
    <tr className="border-b last:border-0">
      <td className="px-6 py-4">
        <div>
          <div className="font-medium text-[#1c1b1f]">
            {cliente.name}
          </div>
          <div className="text-sm text-[#969696]">
            {cliente.email}
          </div>
          <div className="text-sm text-[#969696] mt-1">
            {cliente.phone}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: corSituacao }}
            />
            <span className="text-[#1c1b1f]">{situacao}</span>
          </div>
          <div className="text-sm text-[#969696]">
            {cliente.interested_properties.length} imóveis de interesse
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        {imovelInteresse ? (
          <div>
            <div className="font-medium text-[#1c1b1f]">
              {imovelInteresse.title}
            </div>
            <div className="text-sm text-[#969696]">
              {imovelInteresse.neighborhood}, {imovelInteresse.street}
            </div>
            <div className="text-sm text-[#969696] mt-1">
              {imovelInteresse.rent ? "Aluguel" : "Venda"}: R$ {imovelInteresse.value}
            </div>
          </div>
        ) : (
          <span className="text-[#969696]">Nenhum imóvel de interesse</span>
        )}
      </td>
    </tr>
  );
} 