"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type PaymentBlockKey } from "./payment-block";

export type FlowPresetKey = "tradicional" | "entrada-baixa" | "semestrais-fortes" | "linear" | "chaves-forte";

export type FlowPreset = {
  key: FlowPresetKey;
  name: string;
  description: string;
  distribution: Record<PaymentBlockKey, number>;
};

const PRESETS: FlowPreset[] = [
  {
    key: "tradicional",
    name: "Tradicional",
    description: "Entrada moderada e saldo distribuído em mensais",
    distribution: { entrada: 10, mensais: 60, semestrais: 20, chaves: 10 },
  },
  {
    key: "entrada-baixa",
    name: "Entrada Baixa",
    description: "Maior parte em mensais e semestrais, entrada reduzida",
    distribution: { entrada: 5, mensais: 70, semestrais: 20, chaves: 5 },
  },
  {
    key: "semestrais-fortes",
    name: "Semestrais Fortes",
    description: "Reforços semestrais mais altos para reduzir mensais",
    distribution: { entrada: 10, mensais: 40, semestrais: 40, chaves: 10 },
  },
  {
    key: "linear",
    name: "Linear",
    description: "Distribuição equilibrada entre todas as fases",
    distribution: { entrada: 25, mensais: 25, semestrais: 25, chaves: 25 },
  },
  {
    key: "chaves-forte",
    name: "Chaves Forte",
    description: "Percentual mais elevado concentrado na entrega das chaves",
    distribution: { entrada: 10, mensais: 40, semestrais: 10, chaves: 40 },
  },
];

export const flowPresets = {
  getPreset: (key: FlowPresetKey) => {
    return PRESETS.find((p) => p.key === key) ?? PRESETS[0];
  },
};

type Props = {
  onApply: (key: FlowPresetKey, preset: FlowPreset) => void;
};

function distributionLabel(dist: Record<PaymentBlockKey, number>) {
  return [dist.entrada, dist.mensais, dist.semestrais, dist.chaves].map((v) => `${Math.round(v)}%`).join(" • ");
}

export function FlowPresets({ onApply }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#4A316A]">Modelos de Fluxo</h2>
        <span className="text-xs text-[#969696]">Clique para aplicar automaticamente</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {PRESETS.map((preset) => (
          <Card
            key={preset.key}
            className={cn(
              "border-[#E2E2E2] shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-[1px]"
            )}
            onClick={() => onApply(preset.key, preset)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onApply(preset.key, preset);
            }}
          >
            <CardContent className="p-4 space-y-2">
              <div className="text-sm font-bold text-[#141414]">{preset.name}</div>
              <div className="text-xs text-[#969696]">{preset.description}</div>
              <div className="text-xs font-semibold text-[#4A316A]">{distributionLabel(preset.distribution)}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
