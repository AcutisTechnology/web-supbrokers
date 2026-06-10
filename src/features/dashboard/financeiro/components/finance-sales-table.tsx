"use client";

import { Eye, Pencil, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS_BADGE_CLASS, STATUS_LABELS, type FinanceSale } from "../services/finance-service";

interface FinanceSalesTableProps {
  sales: FinanceSale[];
  onView?: (sale: FinanceSale) => void;
  onEdit?: (sale: FinanceSale) => void;
  onDelete?: (sale: FinanceSale) => void;
  canMutate?: boolean;
}

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (date: string | null) => {
  if (!date) return "—";
  try {
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR");
  } catch {
    return date;
  }
};

export function FinanceSalesTable({
  sales,
  onView,
  onEdit,
  onDelete,
  canMutate = true,
}: FinanceSalesTableProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E2E2] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[#E2E2E2]">
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">IMÓVEL</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">CLIENTE</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">VALOR</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">COMISSÃO</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">STATUS</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">DATA</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">CORRETORES</th>
              <th className="text-right px-4 py-3 font-semibold text-[#4A316A]">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr
                key={sale.id}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50"
              >
                <td className="px-4 py-3 text-[#141414] font-medium">
                  {sale.property?.title ?? "—"}
                  {sale.property?.code ? (
                    <div className="text-xs text-[#777777]">Cód: {sale.property.code}</div>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-[#141414]">{sale.client?.name ?? "—"}</td>
                <td className="px-4 py-3 text-[#141414]">{currency(sale.sale_value)}</td>
                <td className="px-4 py-3 text-[#141414]">{currency(sale.commission_total)}</td>
                <td className="px-4 py-3">
                  <Badge className={STATUS_BADGE_CLASS[sale.status]}>{STATUS_LABELS[sale.status]}</Badge>
                </td>
                <td className="px-4 py-3 text-[#141414]">{formatDate(sale.contract_date)}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-[#141414]">
                    <Users className="h-4 w-4 text-[#9747FF]" />
                    {sale.brokers_count ?? sale.brokers?.length ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    {onView && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => onView(sale)} title="Visualizar">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {canMutate && onEdit && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(sale)} title="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {canMutate && onDelete && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(sale)}
                        className="text-red-600 hover:text-red-700"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-[#777777]">
                  Nenhuma venda registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
