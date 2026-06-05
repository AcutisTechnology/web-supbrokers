"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CurrencyInput } from "@/components/ui/currency-input";

export type PaymentBlockKey = "entrada" | "mensais" | "semestrais" | "anuais" | "chaves";

export type PaymentCategory = {
  amountCents: number;
  installments: number;
};

type Props = {
  title: string;
  blockKey: PaymentBlockKey;
  totalCents: number;
  category: PaymentCategory;
  chavesCompletar: boolean;
  onToggleChavesCompletar?: (checked: boolean) => void;
  onPercentCommit: (value: number) => void;
  onAmountCommit: (amountCents: number) => void;
  onInstallmentsChange: (value: number) => void;
};

function formatCurrencyFromCents(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((cents || 0) / 100);
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const percentToText = (percent: number) => {
  const rounded = Math.round((Number.isFinite(percent) ? percent : 0) * 10000) / 10000;
  return String(rounded);
};

export function PaymentBlock({
  title,
  blockKey,
  totalCents,
  category,
  chavesCompletar,
  onToggleChavesCompletar,
  onPercentCommit,
  onAmountCommit,
  onInstallmentsChange,
}: Props) {
  const installments = Math.max(1, Math.floor(category.installments || 1));
  const amountCents = Math.max(0, Math.floor(category.amountCents || 0));

  const percent = useMemo(() => {
    if (totalCents <= 0) return 0;
    return (amountCents / totalCents) * 100;
  }, [amountCents, totalCents]);

  const perInstallmentCents = useMemo(() => {
    if (installments <= 0) return 0;
    return Math.round(amountCents / installments);
  }, [amountCents, installments]);

  const percentRoundedLabel = Math.round(percent);
  const disableEdits = blockKey === "chaves" && chavesCompletar;

  const [percentText, setPercentText] = useState(() => percentToText(percent));
  const [isPercentFocused, setIsPercentFocused] = useState(false);

  useEffect(() => {
    if (isPercentFocused) return;
    setPercentText(percentToText(percent));
  }, [isPercentFocused, percent]);

  return (
    <Card className="border-[#E2E2E2] shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-[#4A316A]">{title}</CardTitle>
          <div className="text-xs font-bold bg-[#4A316A] text-white px-3 py-1 rounded-full">
            {percentRoundedLabel}% • {formatCurrencyFromCents(amountCents)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={100}
            step={0.01}
            value={clamp(Number.isFinite(percent) ? percent : 0, 0, 100)}
            onChange={(e) => onPercentCommit(Number(e.target.value))}
            className="w-full accent-[#4A316A]"
            disabled={disableEdits || totalCents <= 0}
          />
          <div className="text-xs text-[#4A316A] font-semibold">
            {installments}x de {formatCurrencyFromCents(perInstallmentCents)}
          </div>
        </div>

        {blockKey === "chaves" && onToggleChavesCompletar ? (
          <div className="flex items-center gap-2">
            <Checkbox
              id="chaves-completar"
              checked={chavesCompletar}
              onCheckedChange={(checked) => onToggleChavesCompletar(checked === true)}
            />
            <label htmlFor="chaves-completar" className="text-sm text-[#4A316A] font-semibold select-none">
              Completar 100%
            </label>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-gray-500 font-bold">Parcelas</label>
            <Input
              type="number"
              min={1}
              className="bg-white border-[#E2E2E2] mt-1"
              value={String(installments)}
              onChange={(e) => onInstallmentsChange(Number(e.target.value))}
            />
          </div>
          <div className="md:col-span-4">
            <label className="text-xs uppercase text-gray-500 font-bold">Percentual</label>
            <Input
              className="bg-white border-[#E2E2E2] mt-1"
              value={percentText}
              onFocus={() => setIsPercentFocused(true)}
              onBlur={() => {
                setIsPercentFocused(false);
                const parsed = Number(String(percentText).replace(",", "."));
                if (!Number.isFinite(parsed)) {
                  setPercentText(percentToText(percent));
                  return;
                }
                onPercentCommit(parsed);
              }}
              onChange={(e) => setPercentText(e.target.value)}
              inputMode="decimal"
              disabled={disableEdits || totalCents <= 0}
            />
          </div>
          <div className="md:col-span-6">
            <label className="text-xs uppercase text-gray-500 font-bold">Total</label>
            <CurrencyInput
              className="bg-white border-[#E2E2E2] mt-1"
              value={amountCents / 100}
              onChange={(val) => onAmountCommit(Math.round(val * 100))}
              disabled={disableEdits || totalCents <= 0}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
