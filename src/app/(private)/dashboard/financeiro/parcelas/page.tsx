"use client";

import { useState } from "react";
import { Plus, Filter, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { TopNav } from "@/features/dashboard/financeiro/components/top-nav";
import { FinanceInstallmentsTable } from "@/features/dashboard/financeiro/components/finance-installments-table";
import { FinanceInstallmentFormModal } from "@/features/dashboard/financeiro/components/finance-installment-form-modal";
import {
  INSTALLMENT_STATUS_LABELS,
  useInstallments,
  useReceiveInstallment,
  type FinanceSaleInstallment,
  type InstallmentFilters,
} from "@/features/dashboard/financeiro/services/finance-service";

export default function FinanceInstallmentsPage() {
  const [filters, setFilters] = useState<InstallmentFilters>({ per_page: 20, page: 1 });
  const [showFilters, setShowFilters] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [toReceive, setToReceive] = useState<FinanceSaleInstallment | null>(null);

  const { data, isLoading, isError, error, refetch } = useInstallments(filters);
  const receiveMutation = useReceiveInstallment();

  const rows = data?.data ?? [];
  const totalPages = data?.meta?.last_page ?? 1;
  const currentPage = data?.meta?.current_page ?? 1;
  const total = data?.meta?.total ?? 0;

  const updateFilter = (key: keyof InstallmentFilters, value: string | number | undefined) =>
    setFilters((prev) => ({ ...prev, [key]: value === "" ? undefined : value, page: 1 }));

  const clearFilters = () => setFilters({ per_page: filters.per_page, page: 1 });

  const handleReceive = async () => {
    if (!toReceive) return;
    try {
      await receiveMutation.mutateAsync({ id: toReceive.id });
      toast.success("Parcela marcada como recebida. Comissões liberadas proporcionalmente.");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível marcar como recebida.");
    } finally {
      setToReceive(null);
    }
  };

  return (
    <>
      <TopNav title_secondary="Parcelas" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-[#777777]">Parcelas e recebimentos</p>
          <p className="text-sm text-[#777777]">
            {total > 0
              ? `${total} parcela${total === 1 ? "" : "s"} encontrada${total === 1 ? "" : "s"}.`
              : "Nenhuma parcela cadastrada."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters((v) => !v)} className="gap-2">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
          <Button onClick={() => setOpenModal(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Nova parcela
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="border border-gray-100 shadow-sm rounded-2xl mb-4">
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select
                value={(filters.status as string) ?? "all"}
                onValueChange={(v) =>
                  updateFilter("status", v === "all" ? undefined : (v as "pending" | "overdue" | "received"))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {(Object.keys(INSTALLMENT_STATUS_LABELS) as Array<keyof typeof INSTALLMENT_STATUS_LABELS>).map(
                    (k) => (
                      <SelectItem key={k} value={k}>
                        {INSTALLMENT_STATUS_LABELS[k]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Venda (ID)</Label>
              <Input
                type="number"
                min={0}
                value={filters.sale_id ?? ""}
                onChange={(e) => updateFilter("sale_id", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Vencimento de</Label>
              <Input
                type="date"
                value={filters.date_from ?? ""}
                onChange={(e) => updateFilter("date_from", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Vencimento até</Label>
              <Input
                type="date"
                value={filters.date_to ?? ""}
                onChange={(e) => updateFilter("date_to", e.target.value)}
              />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <Button type="button" variant="ghost" onClick={clearFilters} className="gap-1 text-[#777777]">
                <X className="h-4 w-4" /> Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <LoadingState
        isLoading={isLoading}
        isError={isError}
        error={error as Error | null}
        onRetry={refetch}
      />

      {!isLoading && !isError && (
        <>
          <FinanceInstallmentsTable
            installments={rows}
            onReceive={(row) => setToReceive(row)}
          />

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

      <FinanceInstallmentFormModal open={openModal} onOpenChange={setOpenModal} />

      <AlertDialog open={toReceive !== null} onOpenChange={(open) => !open && setToReceive(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Marcar parcela como recebida</AlertDialogTitle>
            <AlertDialogDescription>
              Ao confirmar, o sistema vai liberar automaticamente a comissão proporcional dos corretores
              participantes. Continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={receiveMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReceive}
              disabled={receiveMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Confirmar recebimento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
