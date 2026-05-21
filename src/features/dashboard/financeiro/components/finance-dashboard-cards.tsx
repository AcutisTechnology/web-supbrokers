"use client";

import { TrendingUp, Receipt, CheckCircle2, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useFinanceDashboard, type FinanceDashboard } from "../services/finance-service";

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface CardItem {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

function buildItems(data?: FinanceDashboard): CardItem[] {
  const totals = data ?? { total_sold: 0, sales_count: 0, expected_commission: 0, released_commission: 0 };
  return [
    {
      label: "Total vendido",
      value: currency(totals.total_sold),
      icon: TrendingUp,
      accent: "bg-[#9747FF]/10 text-[#9747FF]",
    },
    {
      label: "Comissão prevista",
      value: currency(totals.expected_commission),
      icon: Receipt,
      accent: "bg-blue-100 text-blue-700",
    },
    {
      label: "Comissão liberada",
      value: currency(totals.released_commission),
      icon: CheckCircle2,
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Vendas registradas",
      value: String(totals.sales_count),
      icon: ShoppingBag,
      accent: "bg-amber-100 text-amber-800",
    },
  ];
}

export function FinanceDashboardCards() {
  const { data, isLoading } = useFinanceDashboard();
  const items = buildItems(data?.data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="border border-gray-100 shadow-sm rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wide text-[#777777]">{item.label}</div>
                <div className="text-lg font-semibold text-[#141414] truncate">
                  {isLoading ? "—" : item.value}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
