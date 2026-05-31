"use client";

import { useMemo, useState } from "react";
import { Plus, Filter, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import { LoadingState } from "@/components/ui/loading-state";
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
import { FinanceSalesTable } from "@/features/dashboard/financeiro/components/finance-sales-table";
import { FinanceSaleFormModal } from "@/features/dashboard/financeiro/components/finance-sale-form-modal";
import {
  SALE_STATUSES,
  STATUS_LABELS,
  useDeleteFinanceSale,
  useFinanceSales,
  type FinanceSale,
  type SaleFilters,
  type SaleStatus,
} from "@/features/dashboard/financeiro/services/finance-service";

export default function FinanceSalesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<SaleFilters>({ page: 1, per_page: 15 });
  const [showFilters, setShowFilters] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<FinanceSale | null>(null);
  const [toDelete, setToDelete] = useState<FinanceSale | null>(null);

  const { data, isLoading, isError, error, refetch } = useFinanceSales(filters);
  const deleteMutation = useDeleteFinanceSale();

  const sales = data?.data ?? [];
  const totalPages = data?.meta?.last_page ?? 1;
  const currentPage = data?.meta?.current_page ?? 1;
  const total = data?.meta?.total ?? 0;

  const activeFilters = useMemo(
    () =>
      Object.entries(filters).filter(
        ([key, value]) =>
          key !== "page" &&
          key !== "per_page" &&
          value !== undefined &&
          value !== "" &&
          value !== null,
      ),
    [filters],
  );

  const updateFilter = (key: keyof SaleFilters, value: string | number | undefined) =>
    setFilters((prev) => ({ ...prev, [key]: value === "" ? undefined : value, page: 1 }));

  const clearFilters = () => setFilters({ page: 1, per_page: filters.per_page });

  const onEdit = (sale: FinanceSale) => {
    setEditing(sale);
    setOpenModal(true);
  };

  const onNew = () => {
    setEditing(null);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteMutation.mutateAsync(toDelete.id);
      toast.success("Venda excluída.");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível excluir a venda.");
    } finally {
      setToDelete(null);
    }
  };

  return (
    <>
      <TopNav title_secondary="Vendas" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-sm text-[#777777]">
            {total > 0
              ? `${total} venda${total === 1 ? "" : "s"} ${total === 1 ? "encontrada" : "encontradas"}.`
              : "Nenhuma venda registrada ainda."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters((v) => !v)} className="gap-2">
            <Filter className="h-4 w-4" /> Filtros
            {activeFilters.length > 0 ? (
              <span className="ml-1 inline-flex items-center justify-center text-xs bg-[#9747FF]/10 text-[#9747FF] rounded-full w-5 h-5">
                {activeFilters.length}
              </span>
            ) : null}
          </Button>
          <Button onClick={onNew} className="gap-2">
            <Plus className="h-4 w-4" /> Nova venda
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="border border-gray-100 shadow-sm rounded-2xl mb-4">
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Busca</Label>
              <Input
                placeholder="Cliente ou imóvel..."
                value={filters.search ?? ""}
                onChange={(e) => updateFilter("search", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select
                value={(filters.status as SaleStatus) ?? "all"}
                onValueChange={(v) => updateFilter("status", v === "all" ? undefined : (v as SaleStatus))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {SALE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
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
              <Label className="text-xs">Valor mínimo</Label>
              <Input
                type="number"
                min={0}
                value={filters.min_value ?? ""}
                onChange={(e) => updateFilter("min_value", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Valor máximo</Label>
              <Input
                type="number"
                min={0}
                value={filters.max_value ?? ""}
                onChange={(e) => updateFilter("max_value", e.target.value ? Number(e.target.value) : undefined)}
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
          <FinanceSalesTable
            sales={sales}
            onView={(sale) => router.push(`/dashboard/financeiro/vendas/${sale.id}`)}
            onEdit={onEdit}
            onDelete={(sale) => setToDelete(sale)}
          />

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
              />
            </div>
          )}
        </>
      )}

      <FinanceSaleFormModal open={openModal} onOpenChange={setOpenModal} sale={editing} />

      <AlertDialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir venda</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
