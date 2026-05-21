"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { Pagination } from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TopNav } from "@/features/dashboard/financeiro/components/top-nav";
import {
  COMMISSION_STATUS_LABELS,
  COMMISSION_STATUSES,
  useMyCommissions,
  type CommissionStatus,
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

const STATUS_BADGE: Record<CommissionStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border border-amber-200",
  released: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  partial: "bg-blue-100 text-blue-800 border border-blue-200",
  registered: "bg-slate-100 text-slate-800 border border-slate-200",
  blocked: "bg-rose-100 text-rose-800 border border-rose-200",
};

export default function MyCommissionsPage() {
  const [status, setStatus] = useState<CommissionStatus | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useMyCommissions({
    status: status === "all" ? undefined : status,
    page,
    per_page: 15,
  });

  const rows = data?.data ?? [];
  const totalPages = data?.meta?.last_page ?? 1;
  const currentPage = data?.meta?.current_page ?? 1;
  const total = data?.meta?.total ?? 0;

  const totals = rows.reduce(
    (acc, row) => {
      acc.total += Number(row.total_amount);
      acc.released += Number(row.released_amount);
      acc.pending += Number(row.pending_amount);
      return acc;
    },
    { total: 0, released: 0, pending: 0 },
  );

  return (
    <>
      <TopNav title_secondary="Minhas Comissões" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#141414]">Suas comissões</h2>
          <p className="text-sm text-[#777777]">
            {total > 0
              ? `${total} comissã${total === 1 ? "o" : "es"} ${total === 1 ? "encontrada" : "encontradas"}.`
              : "Nenhuma comissão registrada."}
          </p>
        </div>
        <div className="w-full sm:w-60 space-y-1">
          <Label className="text-xs">Filtrar por status</Label>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as CommissionStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {COMMISSION_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {COMMISSION_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-[#777777]">Total previsto (página)</div>
            <div className="text-lg font-semibold text-[#141414]">{currency(totals.total)}</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-[#777777]">Liberado</div>
            <div className="text-lg font-semibold text-emerald-700">{currency(totals.released)}</div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-[#777777]">Pendente</div>
            <div className="text-lg font-semibold text-amber-700">{currency(totals.pending)}</div>
          </CardContent>
        </Card>
      </div>

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
                    <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">IMÓVEL</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">CLIENTE</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">VALOR VENDA</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">COMISSÃO</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">LIBERADO</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">PENDENTE</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">STATUS</th>
                    <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">DATA</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-[#141414] font-medium">
                        {row.sale?.property?.title ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-[#141414]">{row.sale?.client?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-[#141414]">{currency(Number(row.sale?.sale_value ?? 0))}</td>
                      <td className="px-4 py-3 text-[#141414]">{currency(row.total_amount)}</td>
                      <td className="px-4 py-3 text-emerald-700">{currency(row.released_amount)}</td>
                      <td className="px-4 py-3 text-amber-700">{currency(row.pending_amount)}</td>
                      <td className="px-4 py-3">
                        <Badge className={STATUS_BADGE[row.status]}>
                          {COMMISSION_STATUS_LABELS[row.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[#141414]">{formatDate(row.sale?.contract_date ?? null)}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-[#777777]">
                        Nenhuma comissão para os critérios selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
