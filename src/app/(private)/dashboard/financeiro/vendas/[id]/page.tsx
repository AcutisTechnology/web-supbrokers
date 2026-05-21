"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Download, FileText } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TopNav } from "@/features/dashboard/financeiro/components/top-nav";
import { FinanceInstallmentFormModal } from "@/features/dashboard/financeiro/components/finance-installment-form-modal";
import { FinanceCommissionRegisterModal } from "@/features/dashboard/financeiro/components/finance-commission-register-modal";
import { FinanceInstallmentsTable } from "@/features/dashboard/financeiro/components/finance-installments-table";
import {
  COMMISSION_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  STATUS_BADGE_CLASS,
  STATUS_LABELS,
  useCommissionRegisters,
  useFinanceCommissions,
  useFinanceSale,
  useReceiveInstallment,
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

export default function FinanceSaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const saleId = Number(id);

  const [openInstallment, setOpenInstallment] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [registerCommissionId, setRegisterCommissionId] = useState<number | null>(null);

  const { data, isLoading, isError, error, refetch } = useFinanceSale(saleId);
  const sale = data?.data;

  const { data: commissionsData } = useFinanceCommissions({ sale_id: saleId, per_page: 50 });
  const commissions = commissionsData?.data ?? [];

  const { data: registersData } = useCommissionRegisters({ per_page: 50 });
  const registers = (registersData?.data ?? []).filter((r) => r.commission?.sale?.id === saleId);

  const receiveMutation = useReceiveInstallment();

  const handleReceive = async (installmentId: number) => {
    try {
      await receiveMutation.mutateAsync({ id: installmentId });
      toast.success("Parcela marcada como recebida.");
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível marcar como recebida.");
    }
  };

  return (
    <>
      <TopNav title_secondary={`Venda #${saleId}`} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <Button asChild variant="ghost" className="gap-1 -ml-2 mb-2 text-[#777777]">
            <Link href="/dashboard/financeiro/vendas">
              <ChevronLeft className="h-4 w-4" /> Voltar
            </Link>
          </Button>
          <h2 className="text-xl font-semibold text-[#141414]">
            {sale?.property?.title ?? "Carregando..."}
          </h2>
          <p className="text-sm text-[#777777]">
            Cliente: {sale?.client?.name ?? "—"} · Valor: {sale ? currency(sale.sale_value) : "—"}
          </p>
        </div>
      </div>

      <LoadingState
        isLoading={isLoading}
        isError={isError}
        error={error as Error | null}
        onRetry={refetch}
      />

      {sale && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-5">
                <div className="text-xs uppercase tracking-wide text-[#777777]">Status</div>
                <Badge className={`${STATUS_BADGE_CLASS[sale.status]} mt-2`}>{STATUS_LABELS[sale.status]}</Badge>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-5">
                <div className="text-xs uppercase tracking-wide text-[#777777]">Comissão total</div>
                <div className="text-lg font-semibold text-[#141414]">{currency(sale.commission_total)}</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-5">
                <div className="text-xs uppercase tracking-wide text-[#777777]">Tipo</div>
                <div className="text-sm text-[#141414]">
                  {sale.commission_type === "percentage"
                    ? `${sale.commission_percentage}%`
                    : currency(sale.commission_value ?? 0)}
                </div>
              </CardContent>
            </Card>
            <Card className="border border-gray-100 shadow-sm rounded-2xl">
              <CardContent className="p-5">
                <div className="text-xs uppercase tracking-wide text-[#777777]">Data do contrato</div>
                <div className="text-sm text-[#141414]">{formatDate(sale.contract_date)}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="financeiro">
            <TabsList>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              <TabsTrigger value="corretores">Corretores</TabsTrigger>
            </TabsList>

            <TabsContent value="financeiro" className="space-y-6 mt-4">
              <Card className="border border-gray-100 shadow-sm rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Parcelas / Recebimentos</CardTitle>
                  <Button onClick={() => setOpenInstallment(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Nova parcela
                  </Button>
                </CardHeader>
                <CardContent>
                  <FinanceInstallmentsTable
                    installments={(sale.installments ?? []).map((i) => ({ ...i, sale: { id: sale.id, uuid: sale.uuid, status: sale.status, sale_value: sale.sale_value, property: sale.property ?? null, client: sale.client ?? null } }))}
                    onReceive={(row) => handleReceive(row.id)}
                  />
                </CardContent>
              </Card>

              <Card className="border border-gray-100 shadow-sm rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Comissões dos corretores</CardTitle>
                  <Button onClick={() => { setRegisterCommissionId(null); setOpenRegister(true); }} className="gap-2">
                    <Plus className="h-4 w-4" /> Registrar pagamento
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-xl border border-[#E2E2E2] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-[#E2E2E2]">
                            <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">CORRETOR</th>
                            <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">TOTAL</th>
                            <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">LIBERADA</th>
                            <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">DISPONÍVEL</th>
                            <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">REGISTRADA</th>
                            <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">PENDENTE</th>
                            <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">STATUS</th>
                            <th className="text-right px-4 py-3 font-semibold text-[#4A316A]">AÇÕES</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commissions.map((c) => (
                            <tr key={c.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                              <td className="px-4 py-3 text-[#141414] font-medium">{c.broker_name ?? `Corretor #${c.broker_id}`}</td>
                              <td className="px-4 py-3 text-[#141414]">{currency(c.total_amount)}</td>
                              <td className="px-4 py-3 text-emerald-700">{currency(c.released_amount)}</td>
                              <td className="px-4 py-3 text-indigo-700">{currency(c.available_amount)}</td>
                              <td className="px-4 py-3 text-purple-700">{currency(c.registered_amount)}</td>
                              <td className="px-4 py-3 text-amber-700">{currency(c.pending_amount)}</td>
                              <td className="px-4 py-3">
                                <Badge className="bg-slate-100 text-slate-800 border border-slate-200">
                                  {COMMISSION_STATUS_LABELS[c.status]}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  disabled={c.available_amount <= 0}
                                  onClick={() => {
                                    setRegisterCommissionId(c.id);
                                    setOpenRegister(true);
                                  }}
                                >
                                  Pagar
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {commissions.length === 0 && (
                            <tr>
                              <td colSpan={8} className="px-4 py-6 text-center text-[#777777]">
                                Nenhuma comissão.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-100 shadow-sm rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-base">Histórico de pagamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-xl border border-[#E2E2E2] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b border-[#E2E2E2]">
                            <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">CORRETOR</th>
                            <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">DATA</th>
                            <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">VALOR</th>
                            <th className="text-left px-4 py-3 font-semibold text-[#4A316A]">MÉTODO</th>
                            <th className="text-right px-4 py-3 font-semibold text-[#4A316A]">COMPROVANTE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registers.map((r) => (
                            <tr key={r.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                              <td className="px-4 py-3 text-[#141414]">{r.commission?.broker_name ?? "—"}</td>
                              <td className="px-4 py-3 text-[#141414]">{formatDate(r.payment_date)}</td>
                              <td className="px-4 py-3 text-[#141414]">{currency(Number(r.amount))}</td>
                              <td className="px-4 py-3">
                                <Badge className="bg-slate-100 text-slate-800 border border-slate-200">
                                  {PAYMENT_METHOD_LABELS[r.payment_method]}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right">
                                {r.receipt_url ? (
                                  <a
                                    href={r.receipt_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[#9747FF] hover:underline"
                                  >
                                    <Download className="h-4 w-4" />
                                    {r.receipt_file_name ?? "Baixar"}
                                  </a>
                                ) : (
                                  <span className="text-[#777777] inline-flex items-center gap-1">
                                    <FileText className="h-4 w-4" /> —
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                          {registers.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-4 py-6 text-center text-[#777777]">
                                Nenhum pagamento registrado.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="corretores" className="mt-4">
              <Card className="border border-gray-100 shadow-sm rounded-2xl">
                <CardContent className="p-4 space-y-2">
                  {(sale.brokers ?? []).map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl"
                    >
                      <div>
                        <div className="text-sm font-semibold text-[#141414]">
                          {b.broker_name ?? `Corretor #${b.broker_id}`}
                        </div>
                        <div className="text-xs text-[#777777]">
                          Participação: {Number(b.participation_percentage).toFixed(2)}%
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-[#141414]">{currency(b.commission_amount)}</div>
                    </div>
                  ))}
                  {(sale.brokers ?? []).length === 0 && (
                    <div className="text-sm text-[#777777] text-center py-6">Nenhum corretor vinculado.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </>
      )}

      <FinanceInstallmentFormModal
        open={openInstallment}
        onOpenChange={setOpenInstallment}
        preselectedSaleId={saleId}
      />
      <FinanceCommissionRegisterModal
        open={openRegister}
        onOpenChange={(open) => {
          setOpenRegister(open);
          if (!open) setRegisterCommissionId(null);
        }}
        preselectedCommissionId={registerCommissionId}
      />
    </>
  );
}
