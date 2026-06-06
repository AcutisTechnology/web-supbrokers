"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCrmLeads } from "@/features/dashboard/crm/services/crm-service";
import { useProperties } from "@/features/dashboard/imoveis/services/property-service";
import {
  COMMISSION_TYPES,
  SALE_STATUSES,
  STATUS_LABELS,
  computeTotalCommission,
  useCreateFinanceSale,
  useFinanceBrokers,
  useUpdateFinanceSale,
  type CommissionType,
  type FinanceSale,
  type SalePayload,
  type SaleStatus,
} from "../services/finance-service";

interface FinanceSaleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale?: FinanceSale | null;
}

interface BrokerRow {
  broker_id: number | "";
  participation_percentage: number;
}

interface FormState {
  property_id: number | "";
  client_id: number | "";
  sale_value: number;
  commission_type: CommissionType;
  commission_value: number;
  commission_percentage: number;
  status: SaleStatus;
  contract_date: string;
  notes: string;
  brokers: BrokerRow[];
}

const empty: FormState = {
  property_id: "",
  client_id: "",
  sale_value: 0,
  commission_type: "percentage",
  commission_value: 0,
  commission_percentage: 0,
  status: "pending",
  contract_date: "",
  notes: "",
  brokers: [{ broker_id: "", participation_percentage: 100 }],
};

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function buildInitialState(sale?: FinanceSale | null): FormState {
  if (!sale) return empty;
  return {
    property_id: sale.property?.id ?? "",
    client_id: sale.client?.id ?? "",
    sale_value: Number(sale.sale_value),
    commission_type: sale.commission_type,
    commission_value: Number(sale.commission_value ?? 0),
    commission_percentage: Number(sale.commission_percentage ?? 0),
    status: sale.status,
    contract_date: sale.contract_date ?? "",
    notes: sale.notes ?? "",
    brokers:
      sale.brokers && sale.brokers.length > 0
        ? sale.brokers.map((b) => ({
            broker_id: b.broker_id,
            participation_percentage: Number(b.participation_percentage),
          }))
        : [{ broker_id: "", participation_percentage: 100 }],
  };
}

export function FinanceSaleFormModal({ open, onOpenChange, sale }: FinanceSaleFormModalProps) {
  const isEdit = !!sale;
  const [form, setForm] = useState<FormState>(() => buildInitialState(sale));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setForm(buildInitialState(sale));
  }, [open, sale]);

  const { data: brokersData } = useFinanceBrokers();
  const { data: customers = [] } = useCrmLeads();
  const { data: propertiesData } = useProperties(1);

  const brokers = brokersData?.data ?? [];
  const properties = propertiesData?.data ?? [];

  const createMutation = useCreateFinanceSale();
  const updateMutation = useUpdateFinanceSale();

  const totalCommission = useMemo(
    () =>
      computeTotalCommission(
        form.sale_value,
        form.commission_type,
        form.commission_value,
        form.commission_percentage,
      ),
    [form.sale_value, form.commission_type, form.commission_value, form.commission_percentage],
  );

  const totalParticipation = useMemo(
    () => form.brokers.reduce((acc, b) => acc + (Number(b.participation_percentage) || 0), 0),
    [form.brokers],
  );

  const brokerCommissions = useMemo(
    () =>
      form.brokers.map((b) => {
        const pct = Number(b.participation_percentage) || 0;
        return {
          ...b,
          commission_amount: Math.round(totalCommission * pct) / 100,
        };
      }),
    [form.brokers, totalCommission],
  );

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateBroker = (index: number, patch: Partial<BrokerRow>) =>
    setForm((prev) => ({
      ...prev,
      brokers: prev.brokers.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    }));

  const addBroker = () =>
    setForm((prev) => ({
      ...prev,
      brokers: [...prev.brokers, { broker_id: "", participation_percentage: 0 }],
    }));

  const removeBroker = (index: number) =>
    setForm((prev) => ({
      ...prev,
      brokers: prev.brokers.length > 1 ? prev.brokers.filter((_, i) => i !== index) : prev.brokers,
    }));

  const validate = (): string | null => {
    if (!form.property_id) return "Selecione um imóvel.";
    if (!form.client_id) return "Selecione um cliente.";
    if (!form.sale_value || form.sale_value <= 0) return "Informe o valor da venda.";
    if (form.commission_type === "percentage" && form.commission_percentage <= 0)
      return "Informe o percentual de comissão.";
    if (form.commission_type === "fixed" && form.commission_value <= 0)
      return "Informe o valor fixo de comissão.";
    if (form.brokers.length === 0) return "Adicione ao menos um corretor.";
    if (form.brokers.some((b) => !b.broker_id)) return "Todos os corretores devem ser selecionados.";
    if (Math.abs(totalParticipation - 100) > 0.01)
      return "A soma das participações deve ser exatamente 100%.";
    const ids = form.brokers.map((b) => b.broker_id);
    if (new Set(ids).size !== ids.length) return "Não repita o mesmo corretor.";
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    const payload: SalePayload = {
      property_id: Number(form.property_id),
      client_id: Number(form.client_id),
      sale_value: Number(form.sale_value),
      commission_type: form.commission_type,
      commission_value: form.commission_type === "fixed" ? Number(form.commission_value) : null,
      commission_percentage:
        form.commission_type === "percentage" ? Number(form.commission_percentage) : null,
      status: form.status,
      contract_date: form.contract_date || null,
      notes: form.notes || null,
      brokers: form.brokers.map((b) => ({
        broker_id: Number(b.broker_id),
        participation_percentage: Number(b.participation_percentage),
      })),
    };

    setSubmitting(true);
    try {
      if (isEdit && sale) {
        await updateMutation.mutateAsync({ id: sale.id, payload });
        toast.success("Venda atualizada com sucesso.");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Venda criada com sucesso.");
      }
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível salvar a venda. Verifique os dados.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar venda" : "Nova venda"}</DialogTitle>
          <DialogDescription>
            Cadastre os dados da venda, os corretores participantes e o sistema calcula a comissão automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Imóvel</Label>
              <Select
                value={form.property_id ? String(form.property_id) : ""}
                onValueChange={(v) => update("property_id", v ? Number(v) : "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.title}
                      {p.code ? ` — ${p.code}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select
                value={form.client_id ? String(form.client_id) : ""}
                onValueChange={(v) => update("client_id", v ? Number(v) : "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Valor da venda (R$)</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.sale_value || ""}
                onChange={(e) => update("sale_value", Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de comissão</Label>
              <Select
                value={form.commission_type}
                onValueChange={(v) => update("commission_type", v as CommissionType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMMISSION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t === "percentage" ? "Percentual (%)" : "Valor fixo (R$)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {form.commission_type === "percentage" ? (
              <div className="space-y-2">
                <Label>Percentual (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  value={form.commission_percentage || ""}
                  onChange={(e) => update("commission_percentage", Number(e.target.value))}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Valor fixo (R$)</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.commission_value || ""}
                  onChange={(e) => update("commission_value", Number(e.target.value))}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => update("status", v as SaleStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SALE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data do contrato</Label>
              <Input
                type="date"
                value={form.contract_date}
                onChange={(e) => update("contract_date", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="min-h-[80px]"
              placeholder="Notas internas, particularidades do contrato, etc."
            />
          </div>

          <div className="bg-[#9747FF]/5 border border-[#9747FF]/20 rounded-xl p-4 text-sm flex flex-wrap items-center gap-x-6 gap-y-2">
            <div>
              <div className="text-xs text-[#777777]">Comissão total</div>
              <div className="font-semibold text-[#141414]">{currency(totalCommission)}</div>
            </div>
            <div>
              <div className="text-xs text-[#777777]">Soma das participações</div>
              <div
                className={`font-semibold ${
                  Math.abs(totalParticipation - 100) < 0.01
                    ? "text-emerald-700"
                    : "text-rose-700"
                }`}
              >
                {totalParticipation.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Corretores participantes</Label>
                <p className="text-xs text-[#777777]">A soma dos percentuais deve ser exatamente 100%.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addBroker}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>

            <div className="space-y-2">
              {form.brokers.map((row, idx) => {
                const computed = brokerCommissions[idx]?.commission_amount ?? 0;
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end border border-gray-100 rounded-xl p-3"
                  >
                    <div className="md:col-span-6 space-y-1">
                      <Label className="text-xs">Corretor</Label>
                      <Select
                        value={row.broker_id ? String(row.broker_id) : ""}
                        onValueChange={(v) =>
                          updateBroker(idx, { broker_id: v ? Number(v) : "" })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {brokers.map((b) => (
                            <SelectItem key={b.id} value={String(b.id)}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <Label className="text-xs">Participação (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step="0.01"
                        value={row.participation_percentage || ""}
                        onChange={(e) =>
                          updateBroker(idx, { participation_percentage: Number(e.target.value) })
                        }
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <Label className="text-xs">Comissão</Label>
                      <div className="px-3 py-2 rounded-md bg-gray-50 text-[#141414] text-sm">
                        {currency(computed)}
                      </div>
                    </div>

                    <div className="md:col-span-1 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBroker(idx)}
                        className="text-red-600 hover:text-red-700"
                        disabled={form.brokers.length === 1}
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
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
            {submitting ? "Salvando..." : isEdit ? "Atualizar venda" : "Cadastrar venda"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
