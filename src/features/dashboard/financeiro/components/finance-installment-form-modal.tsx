"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFinanceSales, useCreateInstallment } from "../services/finance-service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedSaleId?: number | null;
}

interface State {
  finance_sale_id: number | "";
  description: string;
  amount: number;
  due_date: string;
  payment_method: string;
  notes: string;
}

const empty: State = {
  finance_sale_id: "",
  description: "",
  amount: 0,
  due_date: "",
  payment_method: "",
  notes: "",
};

export function FinanceInstallmentFormModal({ open, onOpenChange, preselectedSaleId }: Props) {
  const [form, setForm] = useState<State>(empty);
  const [submitting, setSubmitting] = useState(false);
  const { data: salesData } = useFinanceSales({ per_page: 100 });
  const createMutation = useCreateInstallment();

  const sales = salesData?.data ?? [];

  useEffect(() => {
    if (open) {
      setForm({ ...empty, finance_sale_id: preselectedSaleId ?? "" });
    }
  }, [open, preselectedSaleId]);

  const update = <K extends keyof State>(key: K, value: State[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.finance_sale_id) {
      toast.error("Selecione a venda.");
      return;
    }
    if (!form.description) {
      toast.error("Informe a descrição da parcela.");
      return;
    }
    if (!form.amount || form.amount <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }
    if (!form.due_date) {
      toast.error("Informe a data de vencimento.");
      return;
    }

    setSubmitting(true);
    try {
      await createMutation.mutateAsync({
        finance_sale_id: Number(form.finance_sale_id),
        description: form.description,
        amount: form.amount,
        due_date: form.due_date,
        payment_method: form.payment_method || null,
        notes: form.notes || null,
      });
      toast.success("Parcela criada com sucesso.");
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível criar a parcela.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Nova parcela</DialogTitle>
          <DialogDescription>Cadastre uma parcela/recebimento da venda.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Venda</Label>
            <Select
              value={form.finance_sale_id ? String(form.finance_sale_id) : ""}
              onValueChange={(v) => update("finance_sale_id", v ? Number(v) : "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a venda" />
              </SelectTrigger>
              <SelectContent>
                {sales.map((sale) => (
                  <SelectItem key={sale.id} value={String(sale.id)}>
                    {sale.property?.title ?? `Venda #${sale.id}`} — {sale.client?.name ?? "—"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Input
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Entrada / Saldo / 1ª parcela..."
              />
            </div>

            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.amount || ""}
                onChange={(e) => update("amount", Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Vencimento</Label>
              <Input
                type="date"
                value={form.due_date}
                onChange={(e) => update("due_date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Forma de pagamento (opcional)</Label>
              <Input
                value={form.payment_method}
                onChange={(e) => update("payment_method", e.target.value)}
                placeholder="Boleto / PIX / Transferência..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-gradient-to-r from-[#9747FF] to-[#7C3AED] hover:from-[#9747FF]/90 hover:to-[#7C3AED]/90"
          >
            {submitting ? "Salvando..." : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
