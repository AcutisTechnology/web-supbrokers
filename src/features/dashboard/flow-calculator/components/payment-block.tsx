"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type PaymentBlockKey = "entrada" | "mensais" | "semestrais" | "chaves";

export type PaymentBlockState = {
  percent: number;
  installments: number;
};

type Props = {
  title: string;
  blockKey: PaymentBlockKey;
  state: PaymentBlockState;
  totalValue: number;
  perInstallment: number;
  onPercentChange: (value: number) => void;
  onInstallmentsChange: (value: number) => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);
}

export function PaymentBlock({
  title,
  state,
  totalValue,
  perInstallment,
  onPercentChange,
  onInstallmentsChange,
}: Props) {
  const percentRounded = Math.round(state.percent);
  const installments = Math.max(1, Math.floor(state.installments || 1));

  return (
    <Card className="border-[#E2E2E2] shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-[#4A316A]">{title}</CardTitle>
          <div className="text-xs font-bold bg-[#4A316A] text-white px-3 py-1 rounded-full">
            {percentRounded}% • {formatCurrency(totalValue)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={Number.isFinite(state.percent) ? state.percent : 0}
            onChange={(e) => onPercentChange(Number(e.target.value))}
            className="w-full accent-[#4A316A]"
          />
          <div className="text-xs text-[#4A316A] font-semibold">
            {installments}x de {formatCurrency(perInstallment)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 items-end">
          <div className="col-span-1">
            <label className="text-xs uppercase text-gray-500 font-bold">Parcelas</label>
            <Input
              type="number"
              min={1}
              className="bg-white border-[#E2E2E2] mt-1"
              value={String(installments)}
              onChange={(e) => onInstallmentsChange(Number(e.target.value))}
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs uppercase text-gray-500 font-bold">Total</label>
            <Input className="bg-gray-50 border-[#E2E2E2] mt-1" value={formatCurrency(totalValue)} readOnly />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

