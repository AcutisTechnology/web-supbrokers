"use client";

import { useState } from "react";
import { FileText, Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingState } from "@/components/ui/loading-state";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TopNav } from "@/features/dashboard/financeiro/components/top-nav";
import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  useCommissionRegisters,
  type CommissionRegisterFilters,
  type PaymentMethod,
} from "@/features/dashboard/financeiro/services/finance-service";

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

export default function FinanceStatementPage() {
  const [filters, setFilters] = useState<CommissionRegisterFilters>({ per_page: 20, page: 1 });
  const { data, isLoading, isError, error, refetch } = useCommissionRegisters(filters);

  const rows = data?.data ?? [];
  const totalPages = data?.meta?.last_page ?? 1;
  const currentPage = data?.meta?.current_page ?? 1;
  const total = data?.meta?.total ?? 0;

  const updateFilter = (key: keyof CommissionRegisterFilters, value: string | number | undefined) =>
    setFilters((prev) => ({ ...prev, [key]: value === "" ? undefined : value, page: 1 }));

  const totals = rows.reduce(
    (acc, row) => {
      acc.amount += Number(row.amount);
      return acc;
    },
    { amount: 0 },
  );

  return (
    <>
      <TopNav title_secondary="Extrato Financeiro" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-[#777777]">Histórico de pagamentos</p>
          <p className="text-sm text-[#777777]">
            {total > 0
              ? `${total} registro${total === 1 ? "" : "s"} encontrado${total === 1 ? "" : "s"}.`
              : "Nenhum registro de pagamento."}
          </p>
        </div>
      </div>

      <Card className="border border-gray-100 shadow-sm rounded-2xl mb-4">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Método</Label>
            <Select
              value={(filters.payment_method as string) ?? "all"}
              onValueChange={(v) => updateFilter("payment_method", v === "all" ? undefined : (v as PaymentMethod))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {PAYMENT_METHOD_LABELS[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">De</Label>
            <Input
              type="date"
              value={filters.date_from ?? ""}
              onChange={(e) => updateFilter("date_from", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Até</Label>
            <Input
              type="date"
              value={filters.date_to ?? ""}
              onChange={(e) => updateFilter("date_to", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Corretor (ID)</Label>
            <Input
              type="number"
              min={0}
              value={filters.broker_id ?? ""}
              onChange={(e) => updateFilter("broker_id", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </CardContent>
      </Card>

      <LoadingState
        isLoading={isLoading}
        isError={isError}
        error={error as Error | null}
        onRetry={refetch}
      />

      {!isLoading && !isError && (
        <>
          <div className="bg-white rounded-xl border border-[#E2E2E2] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-[#E2E2E2]">
                    <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">VENDA</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">CORRETOR</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">DATA</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">VALOR</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">MÉTODO</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">SALDO RESTANTE</th>
                    <th className="text-right px-4 py-3 font-semibold text-[#4A316A]">COMPROVANTE</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const remaining = Number(row.commission?.available_amount ?? 0);
                    return (
                      <tr key={row.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-[#141414] font-medium">
                          {row.commission?.sale?.property?.title ?? "—"}
                          {row.commission?.sale?.client?.name && (
                            <div className="text-xs text-[#777777]">{row.commission.sale.client.name}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#141414]">
                          {row.commission?.broker_name ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-[#141414]">{formatDate(row.payment_date)}</td>
                        <td className="px-4 py-3 text-[#141414]">{currency(Number(row.amount))}</td>
                        <td className="px-4 py-3">
                          <Badge className="bg-slate-100 text-slate-800 border border-slate-200">
                            {PAYMENT_METHOD_LABELS[row.payment_method]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-[#141414]">{currency(remaining)}</td>
                        <td className="px-4 py-3 text-right">
                          {row.receipt_url ? (
                            <a
                              href={row.receipt_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[#9747FF] hover:underline"
                            >
                              <Download className="h-4 w-4" />
                              {row.receipt_file_name ?? "Baixar"}
                            </a>
                          ) : (
                            <span className="text-[#777777] inline-flex items-center gap-1">
                              <FileText className="h-4 w-4" /> —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-[#777777]">
                        Nenhum pagamento registrado para os filtros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 text-sm text-[#777777]">
            Total na página: <strong className="text-[#141414]">{currency(totals.amount)}</strong>
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setFilters((p) => ({ ...p, page }))}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
