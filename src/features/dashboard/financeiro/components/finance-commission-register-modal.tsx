"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
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

import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  useCreateCommissionRegister,
  useFinanceCommissions,
  type FinanceBrokerCommission,
  type PaymentMethod,
} from "../services/finance-service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedCommissionId?: number | null;
}

interface State {
  finance_broker_commission_id: number | "";
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  notes: string;
}

const empty: State = {
  finance_broker_commission_id: "",
  amount: 0,
  payment_date: new Date().toISOString().slice(0, 10),
  payment_method: "pix",
  notes: "",
};

const ACCEPTED = ".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg";
const MAX_BYTES = 10 * 1024 * 1024;

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function FinanceCommissionRegisterModal({ open, onOpenChange, preselectedCommissionId }: Props) {
  const [form, setForm] = useState<State>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: commissionsData } = useFinanceCommissions({ per_page: 100 });
  const commissions = useMemo<FinanceBrokerCommission[]>(
    () => commissionsData?.data ?? [],
    [commissionsData],
  );

  const createMutation = useCreateCommissionRegister();

  useEffect(() => {
    if (open) {
      setForm({
        ...empty,
        finance_broker_commission_id: preselectedCommissionId ?? "",
      });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [open, preselectedCommissionId]);

  const selectedCommission = useMemo<FinanceBrokerCommission | undefined>(
    () => commissions.find((c) => c.id === form.finance_broker_commission_id),
    [commissions, form.finance_broker_commission_id],
  );

  const update = <K extends keyof State>(key: K, value: State[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFile = (next: File | null) => {
    if (!next) {
      setFile(null);
      return;
    }
    if (next.size > MAX_BYTES) {
      toast.error("Arquivo maior que 10MB.");
      return;
    }
    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowed.includes(next.type)) {
      toast.error("Use PDF, PNG, JPG ou JPEG.");
      return;
    }
    setFile(next);
  };

  const handleSubmit = async () => {
    if (!form.finance_broker_commission_id) {
      toast.error("Selecione a comissão.");
      return;
    }
    if (!form.amount || form.amount <= 0) {
      toast.error("Valor inválido.");
      return;
    }
    if (selectedCommission && form.amount > Number(selectedCommission.available_amount) + 0.01) {
      toast.error(
        `Valor maior que o saldo disponível (${currency(Number(selectedCommission.available_amount))}).`,
      );
      return;
    }

    setSubmitting(true);
    try {
      await createMutation.mutateAsync({
        finance_broker_commission_id: Number(form.finance_broker_commission_id),
        amount: form.amount,
        payment_date: form.payment_date,
        payment_method: form.payment_method,
        notes: form.notes,
        receipt: file ?? undefined,
      });
      toast.success("Pagamento registrado com sucesso.");
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível registrar o pagamento.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar pagamento</DialogTitle>
          <DialogDescription>
            Registre manualmente um pagamento realizado ao corretor. Anexe o comprovante (PDF/PNG/JPG até 10MB).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Comissão (corretor)</Label>
            <Select
              value={form.finance_broker_commission_id ? String(form.finance_broker_commission_id) : ""}
              onValueChange={(v) => update("finance_broker_commission_id", v ? Number(v) : "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a comissão a ser paga" />
              </SelectTrigger>
              <SelectContent>
                {commissions.map((row) => (
                  <SelectItem key={row.id} value={String(row.id)}>
                    {row.broker_name ?? `Corretor #${row.broker_id}`} —{" "}
                    {row.sale?.property?.title ?? `Venda #${row.finance_sale_id}`}{" "}
                    (disponível: {currency(Number(row.available_amount))})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCommission && (
              <div className="text-xs text-[#777777] mt-1 space-x-3">
                <span>Total: {currency(Number(selectedCommission.total_amount))}</span>
                <span>Liberado: {currency(Number(selectedCommission.released_amount))}</span>
                <span>Registrado: {currency(Number(selectedCommission.registered_amount))}</span>
                <span>
                  <strong>Disponível: {currency(Number(selectedCommission.available_amount))}</strong>
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label>Data do pagamento</Label>
              <Input
                type="date"
                value={form.payment_date}
                onChange={(e) => update("payment_date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Método</Label>
              <Select
                value={form.payment_method}
                onValueChange={(v) => update("payment_method", v as PaymentMethod)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {PAYMENT_METHOD_LABELS[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="min-h-[60px]"
              placeholder="Referência, banco de destino, etc."
            />
          </div>

          <div className="space-y-2">
            <Label>Comprovante (opcional)</Label>
            <div className="flex items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPTED}
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} className="gap-2">
                <Upload className="h-4 w-4" /> Selecionar arquivo
              </Button>
              {file && (
                <div className="flex items-center gap-3 text-sm text-[#141414] bg-gray-50 rounded-xl px-3 py-2">
                  <FileText className="h-4 w-4 text-[#9747FF]" />
                  <div className="min-w-0">
                    <div className="truncate font-medium">{file.name}</div>
                    <div className="text-xs text-[#777777]">{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFile(null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="text-xs text-[#777777]">PDF, PNG, JPG ou JPEG (máx. 10MB).</div>
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
            {submitting ? "Registrando..." : "Registrar pagamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
