"use client";

import { CheckCircle, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  INSTALLMENT_STATUS_BADGE,
  INSTALLMENT_STATUS_LABELS,
  type FinanceSaleInstallment,
} from "../services/finance-service";

interface Props {
  installments: FinanceSaleInstallment[];
  onReceive?: (row: FinanceSaleInstallment) => void;
  onView?: (row: FinanceSaleInstallment) => void;
  canMutate?: boolean;
}

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (date: string | null) => {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("pt-BR");
  } catch {
    return date;
  }
};

export function FinanceInstallmentsTable({ installments, onReceive, onView, canMutate = true }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E2E2] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-[#E2E2E2]">
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">VENDA</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">CLIENTE</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">PARCELA</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">VENCIMENTO</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">VALOR</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">STATUS</th>
              <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">RECEBIDO EM</th>
              <th className="text-right px-4 py-3 font-semibold text-[#4A316A]">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {installments.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                <td className="px-4 py-3 text-[#141414] font-medium">
                  {row.sale?.property?.title ?? "—"}
                  {row.sale?.property?.code && (
                    <div className="text-xs text-[#777777]">Cód: {row.sale.property.code}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-[#141414]">{row.sale?.client?.name ?? "—"}</td>
                <td className="px-4 py-3 text-[#141414]">
                  {row.installment_number ?? "—"}{" "}
                  <span className="text-xs text-[#777777]">— {row.description}</span>
                </td>
                <td className="px-4 py-3 text-[#141414]">{formatDate(row.due_date)}</td>
                <td className="px-4 py-3 text-[#141414]">{currency(row.amount)}</td>
                <td className="px-4 py-3">
                  <Badge className={INSTALLMENT_STATUS_BADGE[row.status]}>
                    {INSTALLMENT_STATUS_LABELS[row.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-[#141414]">{formatDate(row.received_at)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    {onView && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => onView(row)} title="Detalhes">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {canMutate && onReceive && row.status !== "received" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onReceive(row)}
                        title="Marcar como recebida"
                        className="text-emerald-700 hover:text-emerald-800"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {installments.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-[#777777]">
                  Nenhuma parcela encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
