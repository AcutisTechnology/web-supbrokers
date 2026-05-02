"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { FinancingProduct, FinancingSimulationResponse, useFinancingSimulation } from "@/features/dashboard/financing-calculator/services/financing-calculator-service";

type PropertyType = "financiamento-residencial" | "financiamento-comercial";

type FormState = {
  name: string;
  email: string;
  ddi: string;
  phoneDigits: string;
  city: string;
  age: string;
  propertyType: PropertyType;
  propertyValueCents: number;
  percentageFinanced: number;
};

const INSTALLMENT_OPTIONS = [60, 90, 120, 150, 180, 240] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function onlyDigits(value: string) {
  return (value || "").replace(/\D/g, "");
}

function formatCurrencyFromCents(valueCents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((valueCents || 0) / 100);
}

function formatPhoneBR(digits: string) {
  const clean = onlyDigits(digits).slice(0, 11);
  if (clean.length <= 2) return clean;
  const ddd = clean.slice(0, 2);
  const rest = clean.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (rest.length <= 8) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

function formatPercentLabel(value: number) {
  return `${Math.round(value)}%`;
}

function normalizeMoney(value: string | number | undefined | null) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  }

  if (typeof value !== "string") return "-";

  const trimmed = value.trim();
  if (trimmed === "") return "-";
  if (trimmed.includes("R$")) return trimmed;

  const normalized = trimmed.replace(/\./g, "").replace(",", ".");
  const numeric = Number(normalized.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(numeric)) return trimmed;

  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numeric);
}

function normalizePercent(value: string | number | undefined | null) {
  if (typeof value === "number" && Number.isFinite(value)) return `${value}%`;
  if (typeof value !== "string") return "-";
  const trimmed = value.trim();
  if (trimmed === "") return "-";
  if (trimmed.includes("%")) return trimmed;
  const numeric = Number(trimmed.replace(",", "."));
  if (!Number.isFinite(numeric)) return trimmed;
  return `${numeric}%`;
}

function mapBankName(product: FinancingProduct) {
  return product.bank?.name ?? "Banco";
}

function mapBankLogo(product: FinancingProduct) {
  return product.bank?.logo ?? null;
}

function mapFollowUrl(product: FinancingProduct) {
  return product.url ?? null;
}

export default function CalculadoraFinanciamentoPage() {
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    ddi: "55",
    phoneDigits: "",
    city: "",
    age: "",
    propertyType: "financiamento-residencial",
    propertyValueCents: 0,
    percentageFinanced: 80,
  });

  const [selectedInstallments, setSelectedInstallments] = useState<(typeof INSTALLMENT_OPTIONS)[number]>(120);

  const simulationMutation = useFinancingSimulation();
  const [simulation, setSimulation] = useState<FinancingSimulationResponse | null>(null);

  const percentage = clamp(form.percentageFinanced, 20, 90);
  const financedCents = Math.round((form.propertyValueCents * percentage) / 100);
  const entryCents = Math.max(0, form.propertyValueCents - financedCents);

  const phoneFormatted = useMemo(() => formatPhoneBR(form.phoneDigits), [form.phoneDigits]);

  const payload = useMemo(() => {
    const ageNumeric = Number(onlyDigits(form.age));

    return {
      percentageFinanced: Math.round(percentage),
      amountFinanced: String(Math.round(financedCents / 100)),
      propertyValue: formatCurrencyFromCents(form.propertyValueCents),
      propertyType: form.propertyType,
      age: Number.isFinite(ageNumeric) ? ageNumeric : 0,
      city: form.city.trim(),
      email: form.email.trim(),
      phone: `${onlyDigits(form.ddi)}${onlyDigits(form.phoneDigits)}`,
      name: form.name.trim(),
    };
  }, [financedCents, form, percentage]);

  const canSubmit = useMemo(() => {
    const hasMinFinance = form.propertyValueCents > 0;
    const hasName = form.name.trim().length > 0;
    const hasEmail = form.email.trim().length > 0;
    const hasCity = form.city.trim().length > 0;
    const ageNumeric = Number(onlyDigits(form.age));
    const hasAge = Number.isFinite(ageNumeric) && ageNumeric > 0;
    const phoneDigits = onlyDigits(form.phoneDigits);
    const hasPhone = phoneDigits.length >= 10;

    return hasMinFinance && hasName && hasEmail && hasCity && hasAge && hasPhone;
  }, [form]);

  const handleSubmit = async () => {
    try {
      setSimulation(null);

      const result = await simulationMutation.mutateAsync(payload);
      setSimulation(result);

      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Falha ao consultar a simulação.";
      toast({ title: "Não foi possível consultar", description: message, variant: "destructive" });
    }
  };

  const products = useMemo(() => {
    const rows = simulation?.data?.products;
    return Array.isArray(rows) ? rows : [];
  }, [simulation]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        Array.isArray(p.installments) &&
        p.installments.some((i) => Number(i.count) === Number(selectedInstallments))
    );
  }, [products, selectedInstallments]);

  return (
    <div className="space-y-6">
      <TopNav title="Calculadora de Financiamento" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-[#E2E2E2] shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#4A316A]">Seus dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 font-bold">Nome completo</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite seu nome"
                    className="bg-white border-[#E2E2E2]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 font-bold">Email</label>
                  <Input
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Digite seu email"
                    className="bg-white border-[#E2E2E2]"
                    inputMode="email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 font-bold">Telefone</label>
                  <div className="grid grid-cols-12 gap-2">
                    <Input
                      value={`+${onlyDigits(form.ddi)}`}
                      onChange={(e) => setForm((prev) => ({ ...prev, ddi: onlyDigits(e.target.value).slice(0, 3) }))}
                      className="bg-white border-[#E2E2E2] col-span-3"
                      inputMode="numeric"
                    />
                    <Input
                      value={phoneFormatted}
                      onChange={(e) => setForm((prev) => ({ ...prev, phoneDigits: onlyDigits(e.target.value) }))}
                      placeholder="(83) 99999-9999"
                      className="bg-white border-[#E2E2E2] col-span-9"
                      inputMode="tel"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 font-bold">Cidade</label>
                  <Input
                    value={form.city}
                    onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="Digite a cidade"
                    className="bg-white border-[#E2E2E2]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 font-bold">Idade</label>
                  <Input
                    value={form.age}
                    onChange={(e) => setForm((prev) => ({ ...prev, age: onlyDigits(e.target.value).slice(0, 3) }))}
                    placeholder="Digite sua idade"
                    className="bg-white border-[#E2E2E2]"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E2E2E2] shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#4A316A]">Simulação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 font-bold">Tipo de imóvel</label>
                  <Select
                    value={form.propertyType}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, propertyType: value as PropertyType }))}
                  >
                    <SelectTrigger className="bg-white border-[#E2E2E2]">
                      <SelectValue placeholder="Selecione o tipo de imóvel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financiamento-residencial">Residencial</SelectItem>
                      <SelectItem value="financiamento-comercial">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 font-bold">Valor do imóvel</label>
                  <CurrencyInput
                    className="bg-white border-[#E2E2E2]"
                    value={form.propertyValueCents / 100}
                    onChange={(val) => setForm((prev) => ({ ...prev, propertyValueCents: Math.round(val * 100) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 font-bold">Valor de entrada</label>
                  <Input value={formatCurrencyFromCents(entryCents)} readOnly className="bg-gray-50 border-[#E2E2E2]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase text-gray-500 font-bold">Valor a financiar</label>
                  <Input value={formatCurrencyFromCents(financedCents)} readOnly className="bg-gray-50 border-[#E2E2E2]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase text-gray-500 font-bold">Percentual a financiar</label>
                  <span className="text-sm font-bold text-[#4A316A]">{formatPercentLabel(percentage)}</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={90}
                  step={1}
                  value={percentage}
                  onChange={(e) => setForm((prev) => ({ ...prev, percentageFinanced: Number(e.target.value) }))}
                  className="w-full accent-[#4A316A]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="border-[#E2E2E2] shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#4A316A]">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="text-xs uppercase text-gray-500 font-bold">Valor do imóvel</div>
                <div className="text-3xl font-extrabold text-[#4A316A] mt-1">
                  {form.propertyValueCents > 0 ? formatCurrencyFromCents(form.propertyValueCents) : "Insira o valor do imóvel"}
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden flex">
                  <div style={{ width: `${100 - percentage}%` }} className="bg-[#F2C94C]" />
                  <div style={{ width: `${percentage}%` }} className="bg-[#9747ff]" />
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-sm bg-[#F2C94C]" />
                      <span className="text-gray-700">Entrada</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {formatCurrencyFromCents(entryCents)} ({formatPercentLabel(100 - percentage)})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-sm bg-[#9747ff]" />
                      <span className="text-gray-700">Financiado</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {formatCurrencyFromCents(financedCents)} ({formatPercentLabel(percentage)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Juros</span>
                <span className="font-semibold text-gray-800">a partir de 9,17% ao ano</span>
              </div>

              <Button
                className="w-full bg-[#9747ff] hover:bg-[#7c3fe0]"
                disabled={!canSubmit || simulationMutation.isPending}
                onClick={handleSubmit}
              >
                {simulationMutation.isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Consultando...
                  </span>
                ) : (
                  "Ver parcelas"
                )}
              </Button>

              <div className="text-xs text-gray-500 leading-relaxed">
                Ao simular, os valores são estimativas sem análise de perfil. Entraremos em contato para uma avaliação mais detalhada.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div ref={resultRef} />

      {simulation ? (
        <div className="space-y-4">
          <Card className="border-[#E2E2E2] shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#4A316A]">Selecione a quantidade de parcelas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {INSTALLMENT_OPTIONS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setSelectedInstallments(count)}
                    className={cn(
                      "px-4 py-2 rounded-full border text-sm font-semibold transition-colors",
                      selectedInstallments === count
                        ? "bg-[#9747ff] text-white border-[#9747ff]"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {count}x
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E2E2E2] shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#4A316A]">Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProducts.length === 0 ? (
                <div className="text-sm text-gray-600">Nenhum resultado encontrado para {selectedInstallments}x.</div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[980px] border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-left text-xs uppercase text-gray-400 tracking-wider">
                        <th className="px-3 py-2">Banco</th>
                        <th className="px-3 py-2">Tabela</th>
                        <th className="px-3 py-2">Correção</th>
                        <th className="px-3 py-2">Juros ao ano</th>
                        <th className="px-3 py-2">CET anual</th>
                        <th className="px-3 py-2">1ª parcela</th>
                        <th className="px-3 py-2">Última parcela</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product, index) => {
                        const installment = product.installments?.find(
                          (i) => Number(i.count) === Number(selectedInstallments)
                        );
                        const bankLogo = mapBankLogo(product);
                        const bankName = mapBankName(product);

                        return (
                          <tr key={index} className="bg-white border border-gray-100 shadow-sm">
                            <td className="px-3 py-3 rounded-l-xl">
                              <div className="flex items-center gap-3">
                                {bankLogo ? (
                                  <Image src={bankLogo} alt={bankName} width={80} height={24} className="h-6 w-auto" />
                                ) : (
                                  <div className="h-6 w-10 rounded bg-gray-100" />
                                )}
                                <span className="text-sm font-semibold text-gray-800">{bankName}</span>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-700">{product.amortization ?? "-"}</td>
                            <td className="px-3 py-3 text-sm text-gray-700">{product.adjustment ?? "-"}</td>
                            <td className="px-3 py-3 text-sm text-gray-700">{normalizePercent(product.tax)}</td>
                            <td className="px-3 py-3 text-sm text-gray-700">{normalizePercent(product.cet)}</td>
                            <td className="px-3 py-3 text-sm text-gray-700">{normalizeMoney(installment?.first ?? null)}</td>
                            <td className="px-3 py-3 text-sm text-gray-700 rounded-r-xl">{normalizeMoney(installment?.last ?? null)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
