"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FlowPresets, flowPresets, type FlowPresetKey } from "./flow-presets";
import { PaymentBlock, type PaymentBlockKey, type PaymentCategory } from "./payment-block";
import { SimulationSummary } from "./simulation-summary";
import { Calculator, ChevronDown, ChevronUp, RotateCcw, Sparkles } from "lucide-react";

type OptionalFeeKey = "itbi" | "registro" | "escritura" | "banco_seguros";

type OptionalFee = {
  enabled: boolean;
  percent: number;
  paidByBuilder: boolean;
};

type FlowState = {
  nomeEmpreendimento: string;
  unidade: string;
  totalCents: number;
  categories: Record<PaymentBlockKey, PaymentCategory>;
  optionalFees: Record<OptionalFeeKey, OptionalFee>;
  autoBalance: boolean;
  chavesCompletar: boolean;
  appliedPresetId: FlowPresetKey | null;
};

const STORAGE_KEY = "calculadora_fluxo_data";

const FLOW_KEYS: PaymentBlockKey[] = ["entrada", "mensais", "semestrais", "chaves"];
const FLOW_KEYS_NO_CHAVES: PaymentBlockKey[] = ["entrada", "mensais", "semestrais"];

const DEFAULT_WEIGHTS: Record<PaymentBlockKey, number> = {
  entrada: 25,
  mensais: 25,
  semestrais: 25,
  chaves: 25,
};

const DEFAULT_INSTALLMENTS: Record<PaymentBlockKey, number> = {
  entrada: 1,
  mensais: 24,
  semestrais: 4,
  chaves: 1,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFlowPresetKey(value: unknown): value is FlowPresetKey {
  return (
    value === "tradicional" ||
    value === "entrada-baixa" ||
    value === "semestrais-fortes" ||
    value === "linear" ||
    value === "chaves-forte"
  );
}

function formatCurrencyFromCents(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((cents || 0) / 100);
}

function formatPercent4(value: number) {
  const rounded = Math.round((Number.isFinite(value) ? value : 0) * 10000) / 10000;
  return rounded.toLocaleString("pt-BR", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function formatPercentCompact(value: number) {
  const rounded = Math.round((Number.isFinite(value) ? value : 0) * 10000) / 10000;
  return rounded.toLocaleString("pt-BR", { maximumFractionDigits: 4 });
}

function sumCents(categories: Record<PaymentBlockKey, PaymentCategory>) {
  return FLOW_KEYS.reduce((acc, key) => acc + (categories[key]?.amountCents ?? 0), 0);
}

function distributeCents<T extends string>(total: number, keys: T[], weights: Record<T, number>): Record<T, number> {
  const safeTotal = Math.max(0, Math.floor(total || 0));
  const safeWeights = keys.map((k) => ({ key: k, weight: Math.max(0, Number(weights[k]) || 0) }));
  const sumWeights = safeWeights.reduce((acc, w) => acc + w.weight, 0);
  const baseWeights = sumWeights > 0 ? safeWeights : safeWeights.map((w) => ({ ...w, weight: 1 }));
  const baseSum = baseWeights.reduce((acc, w) => acc + w.weight, 0);

  const rows = baseWeights.map((row) => {
    const exact = baseSum > 0 ? (safeTotal * row.weight) / baseSum : 0;
    const base = Math.floor(exact);
    const residue = exact - base;
    return { key: row.key, base, residue };
  });

  const baseTotal = rows.reduce((acc, r) => acc + r.base, 0);
  let remaining = safeTotal - baseTotal;

  rows.sort((a, b) => b.residue - a.residue);

  const result = Object.fromEntries(keys.map((k) => [k, 0])) as Record<T, number>;
  for (const row of rows) {
    const add = remaining > 0 ? 1 : 0;
    result[row.key] = row.base + add;
    remaining = Math.max(0, remaining - add);
  }

  return result;
}

function createDefaultCategories(): Record<PaymentBlockKey, PaymentCategory> {
  return {
    entrada: { amountCents: 0, installments: DEFAULT_INSTALLMENTS.entrada },
    mensais: { amountCents: 0, installments: DEFAULT_INSTALLMENTS.mensais },
    semestrais: { amountCents: 0, installments: DEFAULT_INSTALLMENTS.semestrais },
    chaves: { amountCents: 0, installments: DEFAULT_INSTALLMENTS.chaves },
  };
}

function createDefaultFees(): Record<OptionalFeeKey, OptionalFee> {
  return {
    itbi: { enabled: true, percent: 3, paidByBuilder: false },
    registro: { enabled: true, percent: 1.5, paidByBuilder: false },
    escritura: { enabled: true, percent: 1, paidByBuilder: false },
    banco_seguros: { enabled: true, percent: 1.5, paidByBuilder: false },
  };
}

function computeChavesRemainder(totalCents: number, categories: Record<PaymentBlockKey, PaymentCategory>) {
  const total = Math.max(0, Math.floor(totalCents || 0));
  const sumOthers = FLOW_KEYS_NO_CHAVES.reduce((acc, key) => acc + Math.max(0, Math.floor(categories[key].amountCents || 0)), 0);

  if (sumOthers <= total) {
    return { ...categories, chaves: { ...categories.chaves, amountCents: total - sumOthers } };
  }

  const weights = FLOW_KEYS_NO_CHAVES.reduce((acc, key) => {
    acc[key] = Math.max(0, Math.floor(categories[key].amountCents || 0));
    return acc;
  }, {} as Record<PaymentBlockKey, number>);

  const sumWeights = FLOW_KEYS_NO_CHAVES.reduce((acc, k) => acc + weights[k], 0);
  const fallback = sumWeights > 0 ? weights : ({ entrada: 1, mensais: 1, semestrais: 1 } as Record<PaymentBlockKey, number>);
  const dist = distributeCents(total, FLOW_KEYS_NO_CHAVES, fallback);

  return {
    ...categories,
    entrada: { ...categories.entrada, amountCents: dist.entrada },
    mensais: { ...categories.mensais, amountCents: dist.mensais },
    semestrais: { ...categories.semestrais, amountCents: dist.semestrais },
    chaves: { ...categories.chaves, amountCents: 0 },
  };
}

function redistributeAllForTotalChange(totalCents: number, prev: Record<PaymentBlockKey, PaymentCategory>, chavesCompletar: boolean) {
  const total = Math.max(0, Math.floor(totalCents || 0));
  if (total === 0) return { ...prev, entrada: { ...prev.entrada, amountCents: 0 }, mensais: { ...prev.mensais, amountCents: 0 }, semestrais: { ...prev.semestrais, amountCents: 0 }, chaves: { ...prev.chaves, amountCents: 0 } };

  const prevSum = sumCents(prev);

  if (!chavesCompletar) {
    const weights = prevSum > 0 ? FLOW_KEYS.reduce((acc, k) => ({ ...acc, [k]: Math.max(0, Math.floor(prev[k].amountCents || 0)) }), {} as Record<PaymentBlockKey, number>) : DEFAULT_WEIGHTS;
    const dist = distributeCents(total, FLOW_KEYS, weights);
    return FLOW_KEYS.reduce((acc, k) => {
      acc[k] = { ...prev[k], amountCents: dist[k] };
      return acc;
    }, {} as Record<PaymentBlockKey, PaymentCategory>);
  }

  const shareChaves = prevSum > 0 ? clamp((prev.chaves.amountCents || 0) / prevSum, 0, 1) : 0.25;
  const targetOthers = clamp(Math.round(total * (1 - shareChaves)), 0, total);

  const weights3 = FLOW_KEYS_NO_CHAVES.reduce((acc, k) => ({ ...acc, [k]: Math.max(0, Math.floor(prev[k].amountCents || 0)) }), {} as Record<PaymentBlockKey, number>);
  const sumWeights3 = FLOW_KEYS_NO_CHAVES.reduce((acc, k) => acc + weights3[k], 0);
  const dist3 = distributeCents(targetOthers, FLOW_KEYS_NO_CHAVES, sumWeights3 > 0 ? weights3 : ({ entrada: 1, mensais: 1, semestrais: 1 } as Record<PaymentBlockKey, number>));

  const next = {
    ...prev,
    entrada: { ...prev.entrada, amountCents: dist3.entrada },
    mensais: { ...prev.mensais, amountCents: dist3.mensais },
    semestrais: { ...prev.semestrais, amountCents: dist3.semestrais },
    chaves: { ...prev.chaves, amountCents: total - (dist3.entrada + dist3.mensais + dist3.semestrais) },
  };

  return next;
}

function applyPresetToCategories(totalCents: number, preset: ReturnType<typeof flowPresets.getPreset>) {
  const total = Math.max(0, Math.floor(totalCents || 0));
  if (total === 0) {
    return { categories: createDefaultCategories(), appliedPresetId: preset.key };
  }

  const dist = distributeCents(total, FLOW_KEYS, preset.distribution);
  const nextCategories = FLOW_KEYS.reduce((acc, k) => {
    acc[k] = { amountCents: dist[k], installments: preset.installments[k] };
    return acc;
  }, {} as Record<PaymentBlockKey, PaymentCategory>);

  return { categories: nextCategories, appliedPresetId: preset.key };
}

function computeFeeCents(baseCents: number, percent: number) {
  const base = Math.max(0, Math.floor(baseCents || 0));
  const p = Number.isFinite(percent) ? percent : 0;
  return Math.round((base * p) / 100);
}

function ensureMinInstallments(categories: Record<PaymentBlockKey, PaymentCategory>) {
  return FLOW_KEYS.reduce((acc, k) => {
    const installments = Math.max(1, Math.floor(categories[k].installments || 1));
    acc[k] = { ...categories[k], installments };
    return acc;
  }, {} as Record<PaymentBlockKey, PaymentCategory>);
}

export function FlowCalculatorPage() {
  const { toast } = useToast();
  const [showPresets, setShowPresets] = useState(false);
  const [state, setState] = useState<FlowState>(() => ({
    nomeEmpreendimento: "",
    unidade: "",
    totalCents: 0,
    categories: createDefaultCategories(),
    optionalFees: createDefaultFees(),
    autoBalance: true,
    chavesCompletar: true,
    appliedPresetId: null,
  }));

  const totalCents = state.totalCents;
  const categories = state.categories;

  const sumStepsCents = useMemo(() => sumCents(categories), [categories]);
  const totalPercent = useMemo(() => {
    if (totalCents <= 0) return 0;
    return (sumStepsCents / totalCents) * 100;
  }, [sumStepsCents, totalCents]);

  const diffCents = sumStepsCents - totalCents;

  const status = useMemo(() => {
    if (totalCents <= 0) return { variant: "bad" as const, label: "Informe o valor do imóvel para iniciar" };
    if (diffCents === 0) return { variant: "ok" as const, label: `Fluxo perfeito: ${formatPercent4(totalPercent)}%` };
    if (diffCents < 0) return { variant: "bad" as const, label: `Fluxo incompleto: faltam ${formatCurrencyFromCents(Math.abs(diffCents))}` };
    return { variant: "warn" as const, label: `Fluxo excedente: excede ${formatCurrencyFromCents(diffCents)}` };
  }, [diffCents, totalCents, totalPercent]);

  const statusClasses =
    status.variant === "ok"
      ? "border-green-200 bg-green-50 text-green-700"
      : status.variant === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-red-200 bg-red-50 text-red-700";

  const applyPresetUsage = (presetKey: FlowPresetKey) => {
    try {
      const raw = localStorage.getItem("flow_calculator_preset_usage");
      const usage = raw ? (JSON.parse(raw) as Record<string, number>) : {};
      usage[presetKey] = (usage[presetKey] || 0) + 1;
      localStorage.setItem("flow_calculator_preset_usage", JSON.stringify(usage));
    } catch {}
  };

  const applyPreset = (presetKey: FlowPresetKey) => {
    const preset = flowPresets.getPreset(presetKey);
    setState((prev) => {
      const applied = applyPresetToCategories(prev.totalCents, preset);
      const categoriesWithInstallments = FLOW_KEYS.reduce((acc, k) => {
        acc[k] = {
          amountCents: applied.categories[k].amountCents,
          installments: preset.installments[k],
        };
        return acc;
      }, {} as Record<PaymentBlockKey, PaymentCategory>);

      const next = {
        ...prev,
        categories: prev.chavesCompletar ? computeChavesRemainder(prev.totalCents, categoriesWithInstallments) : categoriesWithInstallments,
        appliedPresetId: preset.key,
      };

      return {
        ...next,
        categories: ensureMinInstallments(next.categories),
      };
    });
    applyPresetUsage(presetKey);
    toast({ title: "Modelo aplicado", description: "Fluxo de pagamento atualizado." });
  };

  const applyMostUsed = () => {
    try {
      const raw = localStorage.getItem("flow_calculator_preset_usage");
      const usage = raw ? (JSON.parse(raw) as Record<string, number>) : {};
      const entries = Object.entries(usage);
      if (entries.length === 0) {
        toast({ title: "Nenhum modelo salvo", description: "Aplicando o modelo Tradicional." });
        return "tradicional" as const;
      }
      entries.sort((a, b) => (b[1] || 0) - (a[1] || 0));
      return entries[0][0] as FlowPresetKey;
    } catch {
      return "tradicional" as const;
    }
  };

  const handleAdjustHundred = () => {
    setState((prev) => {
      const nextCategories = prev.chavesCompletar
        ? computeChavesRemainder(prev.totalCents, prev.categories)
        : redistributeAllForTotalChange(prev.totalCents, prev.categories, false);

      return { ...prev, categories: ensureMinInstallments(nextCategories) };
    });
    toast({ title: "Ajustado", description: "Fluxo ajustado para fechar no valor total." });
  };

  const handleReset = () => {
    setState({
      nomeEmpreendimento: "",
      unidade: "",
      totalCents: 0,
      categories: createDefaultCategories(),
      optionalFees: createDefaultFees(),
      autoBalance: true,
      chavesCompletar: true,
      appliedPresetId: null,
    });
    toast({ title: "Resetado", description: "Simulação reiniciada." });
  };

  const setCategoryAmount = (key: PaymentBlockKey, desiredAmountCents: number) => {
    setState((prev) => {
      const total = prev.totalCents;
      if (total <= 0) return prev;
      if (prev.chavesCompletar && key === "chaves") return prev;

      let desired = Math.max(0, Math.floor(desiredAmountCents || 0));
      if (desired > total) desired = total;

      let nextCategories: Record<PaymentBlockKey, PaymentCategory> = {
        ...prev.categories,
        [key]: { ...prev.categories[key], amountCents: desired },
      };

      if (prev.chavesCompletar) {
        nextCategories = computeChavesRemainder(total, nextCategories);
        return { ...prev, categories: ensureMinInstallments(nextCategories) };
      }

      if (!prev.autoBalance) {
        return { ...prev, categories: ensureMinInstallments(nextCategories) };
      }

      const otherKeys = FLOW_KEYS.filter((k) => k !== key);
      const remaining = Math.max(0, total - desired);

      const weights = otherKeys.reduce((acc, k) => {
        acc[k] = Math.max(0, Math.floor(prev.categories[k].amountCents || 0));
        return acc;
      }, {} as Record<PaymentBlockKey, number>);

      const sumWeights = otherKeys.reduce((acc, k) => acc + weights[k], 0);
      const fallback = sumWeights > 0 ? weights : otherKeys.reduce((acc, k) => ({ ...acc, [k]: DEFAULT_WEIGHTS[k] ?? 1 }), {} as Record<PaymentBlockKey, number>);
      const dist = distributeCents(remaining, otherKeys, fallback);

      otherKeys.forEach((k) => {
        nextCategories = { ...nextCategories, [k]: { ...nextCategories[k], amountCents: dist[k] } };
      });

      return { ...prev, categories: ensureMinInstallments(nextCategories) };
    });
  };

  const setCategoryPercent = (key: PaymentBlockKey, percent: number) => {
    const p = clamp(Number.isFinite(percent) ? percent : 0, 0, 100);
    setCategoryAmount(key, Math.round((totalCents * p) / 100));
  };

  const handleInstallmentsChange = (key: PaymentBlockKey, value: number) => {
    const nextVal = Math.max(1, Math.floor(value || 1));
    setState((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [key]: { ...prev.categories[key], installments: nextVal },
      },
    }));
  };

  const handleTotalChange = (value: number) => {
    const nextTotal = Math.max(0, Math.floor(Math.round((value || 0) * 100)));
    setState((prev) => {
      const nextCategories = redistributeAllForTotalChange(nextTotal, prev.categories, prev.chavesCompletar);
      const autoAppliedPreset =
        prev.appliedPresetId && prev.totalCents === 0 && nextTotal > 0 && sumCents(prev.categories) === 0
          ? applyPresetToCategories(nextTotal, flowPresets.getPreset(prev.appliedPresetId)).categories
          : nextCategories;

      const finalCategories = prev.chavesCompletar ? computeChavesRemainder(nextTotal, autoAppliedPreset) : autoAppliedPreset;

      return {
        ...prev,
        totalCents: nextTotal,
        categories: ensureMinInstallments(finalCategories),
      };
    });
  };

  const handleToggleChavesCompletar = (checked: boolean) => {
    setState((prev) => {
      const next = { ...prev, chavesCompletar: checked };
      const updatedCategories = checked ? computeChavesRemainder(prev.totalCents, prev.categories) : prev.categories;
      return { ...next, categories: ensureMinInstallments(updatedCategories) };
    });
  };

  const feesComputed = useMemo(() => {
    const chavesCents = categories.chaves.amountCents;
    const baseTotal = totalCents;
    const feeDefs: Array<{ key: OptionalFeeKey; label: string; baseCents: number }> = [
      { key: "itbi", label: "ITBI", baseCents: baseTotal },
      { key: "registro", label: "Registro", baseCents: baseTotal },
      { key: "escritura", label: "Escritura", baseCents: baseTotal },
      { key: "banco_seguros", label: "Banco/seguros", baseCents: chavesCents },
    ];

    const items = feeDefs.map((def) => {
      const stateFee = state.optionalFees[def.key];
      const cents = stateFee.enabled ? computeFeeCents(def.baseCents, stateFee.percent) : 0;
      return {
        ...def,
        enabled: stateFee.enabled,
        percent: stateFee.percent,
        paidByBuilder: stateFee.paidByBuilder,
        cents,
      };
    });

    const builderCents = items.filter((i) => i.enabled && i.cents > 0 && i.paidByBuilder).reduce((acc, i) => acc + i.cents, 0);
    const clientCents = items.filter((i) => i.enabled && i.cents > 0 && !i.paidByBuilder).reduce((acc, i) => acc + i.cents, 0);

    return { items, builderCents, clientCents };
  }, [categories.chaves.amountCents, state.optionalFees, totalCents]);

  const summaryText = useMemo(() => {
    const items: Array<{ key: PaymentBlockKey; label: string }> = [
      { key: "entrada", label: "Entrada" },
      { key: "mensais", label: "Mensais" },
      { key: "semestrais", label: "Semestrais" },
      { key: "chaves", label: "Chaves" },
    ];

    const empreendimentoLabel = state.nomeEmpreendimento?.trim() ? state.nomeEmpreendimento.trim() : "Não especificado";
    const unidadeLabel = state.unidade?.trim() ? state.unidade.trim() : "Não especificada";

    const flowLines = items
      .filter(({ key }) => categories[key].amountCents > 0)
      .map(({ key, label }) => {
        const amount = categories[key].amountCents;
        const installments = Math.max(1, Math.floor(categories[key].installments || 1));
        const perInstallment = Math.round(amount / installments);
        const percent = totalCents > 0 ? (amount / totalCents) * 100 : 0;
        return `- ${label}: ${formatPercent4(percent)}% • ${formatCurrencyFromCents(amount)} • ${installments}x de ${formatCurrencyFromCents(perInstallment)}`;
      });

    const feeLines = feesComputed.items
      .filter((fee) => fee.enabled && fee.cents > 0)
      .map((fee) => {
        const baseLabel = fee.key === "banco_seguros" ? "sobre chaves" : "sobre o valor do imóvel";
        return `- ${fee.label} (${formatPercentCompact(fee.percent)}% ${baseLabel}): ${formatCurrencyFromCents(fee.cents)}`;
      });

    const lines = [
      `🏢 ${empreendimentoLabel}`,
      `🚪 Unidade: ${unidadeLabel}`,
      `💰 Valor do imóvel: ${formatCurrencyFromCents(totalCents)}`,
      "",
      "📊 Fluxo de pagamento:",
      ...(flowLines.length > 0 ? flowLines : ["- Nenhuma etapa definida (0)"]),
    ];

    if (feeLines.length > 0) {
      const builderLines = feesComputed.items
        .filter((fee) => fee.enabled && fee.cents > 0 && fee.paidByBuilder)
        .map((fee) => {
          const baseLabel = fee.key === "banco_seguros" ? "sobre chaves" : "sobre o valor do imóvel";
          return `- ${fee.label} (${formatPercentCompact(fee.percent)}% ${baseLabel}): ${formatCurrencyFromCents(fee.cents)}`;
        });

      const clientLines = feesComputed.items
        .filter((fee) => fee.enabled && fee.cents > 0 && !fee.paidByBuilder)
        .map((fee) => {
          const baseLabel = fee.key === "banco_seguros" ? "sobre chaves" : "sobre o valor do imóvel";
          return `- ${fee.label} (${formatPercentCompact(fee.percent)}% ${baseLabel}): ${formatCurrencyFromCents(fee.cents)}`;
        });

      const totalFees = feesComputed.builderCents + feesComputed.clientCents;

      lines.push("");
      lines.push("🧾 Taxas:");

      if (builderLines.length > 0) {
        lines.push("");
        lines.push("🏗️ Pagas pela construtora:");
        lines.push(...builderLines);
      }

      if (clientLines.length > 0) {
        lines.push("");
        lines.push("🙋 Pagas pelo cliente:");
        lines.push(...clientLines);
      }

      if (totalFees > 0) {
        lines.push("");
        lines.push(`Total de taxas (estimativa): ${formatCurrencyFromCents(totalFees)}`);
        if (feesComputed.builderCents > 0) lines.push(`Total pela construtora: ${formatCurrencyFromCents(feesComputed.builderCents)}`);
        if (feesComputed.clientCents > 0) lines.push(`Total pelo cliente: ${formatCurrencyFromCents(feesComputed.clientCents)}`);
      }
    }

    return lines.join("\n");
  }, [categories, feesComputed.builderCents, feesComputed.clientCents, feesComputed.items, state.nomeEmpreendimento, state.unidade, totalCents]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      toast({ title: "Copiado", description: "Texto da simulação copiado." });
    } catch {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível copiar o texto." });
    }
  };

  const handleMostUsed = () => {
    const key = applyMostUsed();
    applyPreset(key);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsedUnknown = JSON.parse(raw) as unknown;
      if (!isRecord(parsedUnknown)) return;
      const parsed = parsedUnknown;

      const totalCents = Math.max(0, Math.floor(typeof parsed.totalCents === "number" ? parsed.totalCents : 0));
      const legacyTotal =
        typeof parsed.valorImovel === "number" ? Math.round(parsed.valorImovel * 100) : parsed.valorImovel ? Math.round(Number(parsed.valorImovel) * 100) : 0;
      const resolvedTotal = totalCents || legacyTotal;

      const baseCategories = createDefaultCategories();
      const rawCategories = isRecord(parsed.categories) ? parsed.categories : isRecord(parsed.flow) ? parsed.flow : {};

      const nextCategories = FLOW_KEYS.reduce((acc, key) => {
        const rawCat = isRecord(rawCategories[key]) ? rawCategories[key] : {};
        const amountCents =
          typeof rawCat.amountCents === "number"
            ? Math.max(0, Math.floor(rawCat.amountCents))
            : typeof rawCat.percent === "number" && resolvedTotal > 0
              ? Math.round((resolvedTotal * rawCat.percent) / 100)
              : 0;
        const installments =
          typeof rawCat.installments === "number"
            ? Math.max(1, Math.floor(rawCat.installments))
            : baseCategories[key].installments;
        acc[key] = { amountCents, installments };
        return acc;
      }, {} as Record<PaymentBlockKey, PaymentCategory>);

      const fees = createDefaultFees();
      const rawFees = isRecord(parsed.optionalFees) ? parsed.optionalFees : isRecord(parsed.fees) ? parsed.fees : {};
      (Object.keys(fees) as OptionalFeeKey[]).forEach((feeKey) => {
        const rf = isRecord(rawFees[feeKey]) ? rawFees[feeKey] : null;
        if (!rf) return;
        const parsedPercent =
          typeof rf.percent === "number"
            ? rf.percent
            : typeof rf.percent === "string"
              ? Number(rf.percent.replace(",", "."))
              : Number.NaN;
        fees[feeKey] = {
          enabled: typeof rf.enabled === "boolean" ? rf.enabled : fees[feeKey].enabled,
          percent: Number.isFinite(parsedPercent) ? parsedPercent : fees[feeKey].percent,
          paidByBuilder: typeof rf.paidByBuilder === "boolean" ? rf.paidByBuilder : fees[feeKey].paidByBuilder,
        };
      });

      setState((prev) => {
        const appliedPresetId = isFlowPresetKey(parsed.appliedPresetId) ? parsed.appliedPresetId : null;
        const hydrated: FlowState = {
          ...prev,
          nomeEmpreendimento: String((parsed.nomeEmpreendimento ?? parsed.empreendimento ?? "") as unknown),
          unidade: String((parsed.unidade ?? "") as unknown),
          totalCents: resolvedTotal,
          categories: parsed.chavesCompletar === true ? computeChavesRemainder(resolvedTotal, nextCategories) : nextCategories,
          optionalFees: fees,
          autoBalance: typeof parsed.autoBalance === "boolean" ? parsed.autoBalance : prev.autoBalance,
          chavesCompletar: typeof parsed.chavesCompletar === "boolean" ? parsed.chavesCompletar : prev.chavesCompletar,
          appliedPresetId,
        };

        const balanced = hydrated.chavesCompletar
          ? computeChavesRemainder(hydrated.totalCents, hydrated.categories)
          : hydrated.categories;

        return { ...hydrated, categories: ensureMinInstallments(balanced) };
      });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const payload = {
        version: 2,
        nomeEmpreendimento: state.nomeEmpreendimento,
        unidade: state.unidade,
        totalCents: state.totalCents,
        categories: state.categories,
        optionalFees: state.optionalFees,
        autoBalance: state.autoBalance,
        chavesCompletar: state.chavesCompletar,
        appliedPresetId: state.appliedPresetId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [state]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#4A316A]">Calculadora de Fluxo</h1>
          <p className="text-[#969696]">Simule o fluxo de pagamento e copie o resumo para o cliente</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="bg-white border-[#E2E2E2]" onClick={handleAdjustHundred}>
            <Calculator className="w-4 h-4" />
            Ajustar 100%
          </Button>
          <Button variant="outline" className="bg-white border-[#E2E2E2]" onClick={handleMostUsed}>
            <Sparkles className="w-4 h-4" />
            Aplicar fluxo mais usado
          </Button>
          <Button variant="outline" className="bg-white border-red-200 text-red-600 hover:bg-red-50" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
            Resetar
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full bg-white border-[#E2E2E2] justify-between"
          onClick={() => setShowPresets((prev) => !prev)}
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Modelos de Fluxo
          </span>
          {showPresets ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {showPresets && (
          <FlowPresets onApply={(key) => applyPreset(key)} />
        )}
      </div>

      <Card className="border-[#E2E2E2] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-[#4A316A] flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Dados da Simulação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs uppercase text-gray-500 font-bold">Nome do empreendimento</label>
              <Input
                className="bg-white border-[#E2E2E2] mt-1"
                value={state.nomeEmpreendimento}
                onChange={(e) => setState((prev) => ({ ...prev, nomeEmpreendimento: e.target.value }))}
                placeholder="Nome do prédio"
              />
            </div>
            <div>
              <label className="text-xs uppercase text-gray-500 font-bold">Unidade</label>
              <Input
                className="bg-white border-[#E2E2E2] mt-1"
                value={state.unidade}
                onChange={(e) => setState((prev) => ({ ...prev, unidade: e.target.value }))}
                placeholder="Ex: 101, 20º A"
              />
            </div>
            <div>
              <label className="text-xs uppercase text-gray-500 font-bold">Valor total do imóvel</label>
              <CurrencyInput
                className="bg-white border-[#E2E2E2] mt-1"
                value={state.totalCents / 100}
                onChange={(val) => handleTotalChange(val)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#E2E2E2] bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[#4A316A]">Auto-balancear percentuais</p>
              <p className="text-xs text-[#969696]">Mantém automaticamente o total em 100%</p>
            </div>
            <Switch
              checked={state.autoBalance}
              onCheckedChange={(checked) => setState((prev) => ({ ...prev, autoBalance: checked }))}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#E2E2E2] bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[#4A316A]">Chaves completar 100%</p>
              <p className="text-xs text-[#969696]">Chaves vira o restante exato do fluxo</p>
            </div>
            <Checkbox
              checked={state.chavesCompletar}
              onCheckedChange={(checked) => handleToggleChavesCompletar(checked === true)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PaymentBlock
          title="Entrada"
          blockKey="entrada"
          totalCents={totalCents}
          category={categories.entrada}
          chavesCompletar={state.chavesCompletar}
          onPercentCommit={(v) => setCategoryPercent("entrada", v)}
          onAmountCommit={(c) => setCategoryAmount("entrada", c)}
          onInstallmentsChange={(v) => handleInstallmentsChange("entrada", v)}
        />
        <PaymentBlock
          title="Mensais"
          blockKey="mensais"
          totalCents={totalCents}
          category={categories.mensais}
          chavesCompletar={state.chavesCompletar}
          onPercentCommit={(v) => setCategoryPercent("mensais", v)}
          onAmountCommit={(c) => setCategoryAmount("mensais", c)}
          onInstallmentsChange={(v) => handleInstallmentsChange("mensais", v)}
        />
        <PaymentBlock
          title="Semestrais"
          blockKey="semestrais"
          totalCents={totalCents}
          category={categories.semestrais}
          chavesCompletar={state.chavesCompletar}
          onPercentCommit={(v) => setCategoryPercent("semestrais", v)}
          onAmountCommit={(c) => setCategoryAmount("semestrais", c)}
          onInstallmentsChange={(v) => handleInstallmentsChange("semestrais", v)}
        />
        <PaymentBlock
          title="Chaves"
          blockKey="chaves"
          totalCents={totalCents}
          category={categories.chaves}
          chavesCompletar={state.chavesCompletar}
          onToggleChavesCompletar={handleToggleChavesCompletar}
          onPercentCommit={(v) => setCategoryPercent("chaves", v)}
          onAmountCommit={(c) => setCategoryAmount("chaves", c)}
          onInstallmentsChange={(v) => handleInstallmentsChange("chaves", v)}
        />
      </div>

      <Card className="border-[#E2E2E2] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-[#4A316A]">Taxas opcionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {feesComputed.items.map((fee) => (
            <div key={fee.key} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end rounded-xl border border-[#E2E2E2] p-4 bg-white">
              <div className="md:col-span-3">
                <div className="text-sm font-bold text-[#141414]">{fee.label}</div>
                <div className="text-xs text-[#969696]">
                  Base: {fee.key === "banco_seguros" ? "Chaves" : "Valor do imóvel"}
                </div>
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <Switch
                  checked={fee.enabled}
                  onCheckedChange={(checked) =>
                    setState((prev) => ({
                      ...prev,
                      optionalFees: {
                        ...prev.optionalFees,
                        [fee.key]: { ...prev.optionalFees[fee.key], enabled: checked },
                      },
                    }))
                  }
                />
                <span className="text-sm text-[#4A316A] font-semibold">Ativar</span>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs uppercase text-gray-500 font-bold">Percentual</label>
                <CurrencyInput
                  className="bg-white border-[#E2E2E2] mt-1"
                  prefix=""
                  suffix="%"
                  value={fee.percent}
                  onChange={(val) =>
                    setState((prev) => ({
                      ...prev,
                      optionalFees: {
                        ...prev.optionalFees,
                        [fee.key]: { ...prev.optionalFees[fee.key], percent: Number.isFinite(val) ? val : 0 },
                      },
                    }))
                  }
                  disabled={!fee.enabled || totalCents <= 0}
                />
              </div>
              <div className="md:col-span-3 flex items-center gap-2">
                <Switch
                  checked={fee.paidByBuilder}
                  onCheckedChange={(checked) =>
                    setState((prev) => ({
                      ...prev,
                      optionalFees: {
                        ...prev.optionalFees,
                        [fee.key]: { ...prev.optionalFees[fee.key], paidByBuilder: checked },
                      },
                    }))
                  }
                  disabled={!fee.enabled}
                />
                <span className="text-sm text-[#4A316A] font-semibold">Pago pela construtora</span>
              </div>
              <div className="md:col-span-2 text-right text-sm font-bold text-[#4A316A]">
                {fee.enabled && fee.cents > 0 ? formatCurrencyFromCents(fee.cents) : "-"}
              </div>
            </div>
          ))}

          {(feesComputed.builderCents > 0 || feesComputed.clientCents > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {feesComputed.builderCents > 0 && (
                <div className="rounded-xl border border-[#E2E2E2] bg-gray-50 px-4 py-3">
                  <div className="text-xs uppercase text-gray-500 font-bold">Total (Construtora)</div>
                  <div className="text-sm font-bold text-[#4A316A]">{formatCurrencyFromCents(feesComputed.builderCents)}</div>
                </div>
              )}
              {feesComputed.clientCents > 0 && (
                <div className="rounded-xl border border-[#E2E2E2] bg-gray-50 px-4 py-3">
                  <div className="text-xs uppercase text-gray-500 font-bold">Total (Cliente)</div>
                  <div className="text-sm font-bold text-[#4A316A]">{formatCurrencyFromCents(feesComputed.clientCents)}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className={`border shadow-sm ${statusClasses}`}>
        <CardContent className="py-4 text-center font-bold">{status.label}</CardContent>
      </Card>

      <SimulationSummary
        text={summaryText}
        onCopy={handleCopy}
      />

      <p className="text-xs text-[#969696]">
        Os valores desta simulação são estimativas e podem variar conforme condições comerciais e reajustes contratuais.
      </p>
    </div>
  );
}
