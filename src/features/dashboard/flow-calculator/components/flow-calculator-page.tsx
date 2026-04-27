"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useToast } from "@/hooks/use-toast";
import { FlowPresets, flowPresets, type FlowPresetKey } from "./flow-presets";
import { PaymentBlock, type PaymentBlockKey, type PaymentBlockState } from "./payment-block";
import { SimulationSummary } from "./simulation-summary";
import { Calculator, ChevronDown, ChevronUp, RotateCcw, Sparkles } from "lucide-react";

type SimulationData = {
  empreendimento: string;
  unidade: string;
  valorImovel: number;
  autoBalance: boolean;
};

type FlowState = Record<PaymentBlockKey, PaymentBlockState>;

const DEFAULT_INSTALLMENTS: Record<PaymentBlockKey, number> = {
  entrada: 1,
  mensais: 24,
  semestrais: 4,
  chaves: 1,
};

const DEFAULT_FLOW: FlowState = {
  entrada: { percent: 0, installments: DEFAULT_INSTALLMENTS.entrada },
  mensais: { percent: 0, installments: DEFAULT_INSTALLMENTS.mensais },
  semestrais: { percent: 0, installments: DEFAULT_INSTALLMENTS.semestrais },
  chaves: { percent: 0, installments: DEFAULT_INSTALLMENTS.chaves },
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round2 = (value: number) => Math.round(value * 100) / 100;

const FLOW_KEYS: PaymentBlockKey[] = ["entrada", "mensais", "semestrais", "chaves"];

function normalizeToHundred(flow: FlowState): FlowState {
  const sum = FLOW_KEYS.reduce((acc, k) => acc + (flow[k]?.percent ?? 0), 0);

  if (sum <= 0) {
    const equal = round2(100 / FLOW_KEYS.length);
    const next: FlowState = {
      ...flow,
      entrada: { ...flow.entrada, percent: equal },
      mensais: { ...flow.mensais, percent: equal },
      semestrais: { ...flow.semestrais, percent: equal },
      chaves: { ...flow.chaves, percent: 100 - equal * 3 },
    };
    return next;
  }

  const factor = 100 / sum;
  const next: FlowState = { ...flow } as FlowState;

  let running = 0;
  for (let i = 0; i < FLOW_KEYS.length; i++) {
    const key = FLOW_KEYS[i];
    if (i === FLOW_KEYS.length - 1) {
      next[key] = { ...flow[key], percent: round2(100 - running) };
    } else {
      const scaled = round2((flow[key].percent ?? 0) * factor);
      next[key] = { ...flow[key], percent: scaled };
      running += scaled;
    }
  }

  return next;
}

function rebalanceKeepingHundred(flow: FlowState, changedKey: PaymentBlockKey, desiredPercent: number): FlowState {
  const desired = round2(clamp(desiredPercent, 0, 100));
  const otherKeys = FLOW_KEYS.filter((k) => k !== changedKey);
  const othersSum = otherKeys.reduce((acc, k) => acc + (flow[k]?.percent ?? 0), 0);
  const targetOthersSum = round2(100 - desired);

  const next: FlowState = { ...flow } as FlowState;
  next[changedKey] = { ...flow[changedKey], percent: desired };

  if (otherKeys.length === 0) return next;

  if (othersSum <= 0) {
    const each = round2(targetOthersSum / otherKeys.length);
    let running = 0;
    for (let i = 0; i < otherKeys.length; i++) {
      const k = otherKeys[i];
      if (i === otherKeys.length - 1) {
        next[k] = { ...flow[k], percent: round2(targetOthersSum - running) };
      } else {
        next[k] = { ...flow[k], percent: each };
        running += each;
      }
    }
    return next;
  }

  const factor = targetOthersSum / othersSum;
  let running = 0;
  for (let i = 0; i < otherKeys.length; i++) {
    const k = otherKeys[i];
    if (i === otherKeys.length - 1) {
      next[k] = { ...flow[k], percent: round2(targetOthersSum - running) };
    } else {
      const scaled = round2((flow[k].percent ?? 0) * factor);
      next[k] = { ...flow[k], percent: scaled };
      running += scaled;
    }
  }

  return next;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);
}

export function FlowCalculatorPage() {
  const { toast } = useToast();
  const [showPresets, setShowPresets] = useState(false);
  const [simulation, setSimulation] = useState<SimulationData>({
    empreendimento: "",
    unidade: "",
    valorImovel: 0,
    autoBalance: true,
  });
  const [flow, setFlow] = useState<FlowState>(DEFAULT_FLOW);

  const totalPercent = useMemo(() => FLOW_KEYS.reduce((acc, k) => acc + (flow[k]?.percent ?? 0), 0), [flow]);

  const blocksComputed = useMemo(() => {
    const value = simulation.valorImovel || 0;
    return FLOW_KEYS.reduce((acc, key) => {
      const percent = flow[key].percent || 0;
      const installments = Math.max(1, Math.floor(flow[key].installments || 1));
      const totalValue = (percent / 100) * value;
      const perInstallment = installments > 0 ? totalValue / installments : 0;
      acc[key] = {
        percent,
        installments,
        totalValue,
        perInstallment,
      };
      return acc;
    }, {} as Record<PaymentBlockKey, { percent: number; installments: number; totalValue: number; perInstallment: number }>);
  }, [flow, simulation.valorImovel]);

  const status = useMemo(() => {
    const rounded = Math.round(totalPercent);
    if (rounded === 100) return { variant: "ok" as const, label: "Fluxo perfeito: 100% distribuído" };
    if (rounded < 100) return { variant: "bad" as const, label: `Fluxo incompleto (${rounded}%)` };
    return { variant: "warn" as const, label: `Fluxo excedente (${rounded}%)` };
  }, [totalPercent]);

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

  const applyPreset = (presetKey: FlowPresetKey, preset: Record<PaymentBlockKey, number>) => {
    setFlow((prev) => {
      const next: FlowState = {
        entrada: { ...prev.entrada, percent: preset.entrada },
        mensais: { ...prev.mensais, percent: preset.mensais },
        semestrais: { ...prev.semestrais, percent: preset.semestrais },
        chaves: { ...prev.chaves, percent: preset.chaves },
      };
      return next;
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
    setFlow((prev) => normalizeToHundred(prev));
    toast({ title: "Ajustado", description: "Percentuais normalizados para 100%." });
  };

  const handleReset = () => {
    setSimulation({ empreendimento: "", unidade: "", valorImovel: 0, autoBalance: true });
    setFlow(DEFAULT_FLOW);
    toast({ title: "Resetado", description: "Simulação reiniciada." });
  };

  const handlePercentChange = (key: PaymentBlockKey, value: number) => {
    setFlow((prev) => {
      const clamped = clamp(value, 0, 100);
      if (!simulation.autoBalance) {
        return { ...prev, [key]: { ...prev[key], percent: clamped } };
      }
      return rebalanceKeepingHundred(prev, key, clamped);
    });
  };

  const handleInstallmentsChange = (key: PaymentBlockKey, value: number) => {
    const nextVal = Math.max(1, Math.floor(value || 1));
    setFlow((prev) => ({ ...prev, [key]: { ...prev[key], installments: nextVal } }));
  };

  useEffect(() => {
    if (!simulation.autoBalance) return;
    setFlow((prev) => {
      const sum = FLOW_KEYS.reduce((acc, k) => acc + (prev[k]?.percent ?? 0), 0);
      if (Math.round(sum) === 100) return prev;
      return normalizeToHundred(prev);
    });
  }, [simulation.autoBalance]);

  const summaryText = useMemo(() => {
    const items = [
      {
        key: "entrada" as const,
        label: "Entrada",
      },
      {
        key: "mensais" as const,
        label: "Mensais",
      },
      {
        key: "semestrais" as const,
        label: "Semestrais",
      },
      {
        key: "chaves" as const,
        label: "Chaves",
      },
    ];

    const flowLines = items
      .filter(({ key }) => Math.round(blocksComputed[key].percent) > 0)
      .map(({ key, label }) => {
        const b = blocksComputed[key];
        return `- ${label}: ${Math.round(b.percent)}% • ${formatCurrency(b.totalValue)} • ${b.installments}x de ${formatCurrency(b.perInstallment)}`;
      });

    const empreendimentoLabel = simulation.empreendimento?.trim() ? simulation.empreendimento.trim() : "Não especificado";
    const unidadeLabel = simulation.unidade?.trim() ? simulation.unidade.trim() : "Não especificada";

    const lines = [
      "📋 Simulação de Fluxo",
      `🏢 Empreendimento: ${empreendimentoLabel}`,
      `🚪 Unidade: ${unidadeLabel}`,
      `💰 Valor do imóvel: ${formatCurrency(simulation.valorImovel)}`,
      "",
      "📊 Fluxo de pagamento:",
      ...(flowLines.length > 0 ? flowLines : ["- Nenhuma etapa definida (0%)"]),
    ];
    return lines.join("\n");
  }, [blocksComputed, simulation.empreendimento, simulation.unidade, simulation.valorImovel]);

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
    const preset = flowPresets.getPreset(key);
    applyPreset(key, preset.distribution);
  };

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
          <FlowPresets onApply={(key, preset) => applyPreset(key, preset.distribution)} />
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
                value={simulation.empreendimento}
                onChange={(e) => setSimulation((prev) => ({ ...prev, empreendimento: e.target.value }))}
                placeholder="Nome do prédio"
              />
            </div>
            <div>
              <label className="text-xs uppercase text-gray-500 font-bold">Unidade</label>
              <Input
                className="bg-white border-[#E2E2E2] mt-1"
                value={simulation.unidade}
                onChange={(e) => setSimulation((prev) => ({ ...prev, unidade: e.target.value }))}
                placeholder="Ex: 101, 20º A"
              />
            </div>
            <div>
              <label className="text-xs uppercase text-gray-500 font-bold">Valor total do imóvel</label>
              <CurrencyInput
                className="bg-white border-[#E2E2E2] mt-1"
                value={simulation.valorImovel}
                onChange={(val) => setSimulation((prev) => ({ ...prev, valorImovel: val }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#E2E2E2] bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[#4A316A]">Auto-balancear percentuais</p>
              <p className="text-xs text-[#969696]">Mantém automaticamente o total em 100%</p>
            </div>
            <Switch
              checked={simulation.autoBalance}
              onCheckedChange={(checked) => setSimulation((prev) => ({ ...prev, autoBalance: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PaymentBlock
          title="Entrada"
          blockKey="entrada"
          state={flow.entrada}
          totalValue={blocksComputed.entrada.totalValue}
          perInstallment={blocksComputed.entrada.perInstallment}
          onPercentChange={(v) => handlePercentChange("entrada", v)}
          onInstallmentsChange={(v) => handleInstallmentsChange("entrada", v)}
        />
        <PaymentBlock
          title="Mensais"
          blockKey="mensais"
          state={flow.mensais}
          totalValue={blocksComputed.mensais.totalValue}
          perInstallment={blocksComputed.mensais.perInstallment}
          onPercentChange={(v) => handlePercentChange("mensais", v)}
          onInstallmentsChange={(v) => handleInstallmentsChange("mensais", v)}
        />
        <PaymentBlock
          title="Semestrais"
          blockKey="semestrais"
          state={flow.semestrais}
          totalValue={blocksComputed.semestrais.totalValue}
          perInstallment={blocksComputed.semestrais.perInstallment}
          onPercentChange={(v) => handlePercentChange("semestrais", v)}
          onInstallmentsChange={(v) => handleInstallmentsChange("semestrais", v)}
        />
        <PaymentBlock
          title="Chaves"
          blockKey="chaves"
          state={flow.chaves}
          totalValue={blocksComputed.chaves.totalValue}
          perInstallment={blocksComputed.chaves.perInstallment}
          onPercentChange={(v) => handlePercentChange("chaves", v)}
          onInstallmentsChange={(v) => handleInstallmentsChange("chaves", v)}
        />
      </div>

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
