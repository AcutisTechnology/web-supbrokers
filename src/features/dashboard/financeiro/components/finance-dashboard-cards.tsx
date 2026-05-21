"use client";

import {
  TrendingUp,
  Receipt,
  CheckCircle2,
  ShoppingBag,
  PiggyBank,
  Wallet,
  AlertCircle,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinanceDashboardFull, type FinanceDashboardFull } from "../services/finance-service";

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface CardItem {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

const empty: FinanceDashboardFull = {
  total_sold: 0,
  total_received: 0,
  sales_count: 0,
  overdue_installments_count: 0,
  expected_commission: 0,
  released_commission: 0,
  available_commission: 0,
  registered_commission: 0,
  pending_commission: 0,
  broker_ranking: [],
};

function buildItems(data: FinanceDashboardFull): CardItem[] {
  return [
    {
      label: "Total vendido",
      value: currency(data.total_sold),
      icon: TrendingUp,
      accent: "bg-[#9747FF]/10 text-[#9747FF]",
    },
    {
      label: "Total recebido",
      value: currency(data.total_received),
      icon: PiggyBank,
      accent: "bg-teal-100 text-teal-700",
    },
    {
      label: "Comissão prevista",
      value: currency(data.expected_commission),
      icon: Receipt,
      accent: "bg-blue-100 text-blue-700",
    },
    {
      label: "Comissão liberada",
      value: currency(data.released_commission),
      icon: CheckCircle2,
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Disponível p/ pagar",
      value: currency(data.available_commission),
      icon: Wallet,
      accent: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "Comissão registrada",
      value: currency(data.registered_commission),
      icon: Receipt,
      accent: "bg-purple-100 text-purple-700",
    },
    {
      label: "Vendas",
      value: String(data.sales_count),
      icon: ShoppingBag,
      accent: "bg-amber-100 text-amber-800",
    },
    {
      label: "Parcelas vencidas",
      value: String(data.overdue_installments_count),
      icon: AlertCircle,
      accent: "bg-rose-100 text-rose-700",
    },
  ];
}

export function FinanceDashboardCards() {
  const { data, isLoading } = useFinanceDashboardFull();
  const payload = data?.data ?? empty;
  const items = buildItems(payload);

  return (
    <>
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

      {payload.broker_ranking.length > 0 && (
        <Card className="border border-gray-100 shadow-sm rounded-2xl mt-6">
          <CardHeader className="flex flex-row items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-base">Ranking de corretores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {payload.broker_ranking.map((row, index) => (
                <div
                  key={row.broker_id}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm font-semibold text-[#141414]">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#141414]">
                        {row.broker_name ?? `Corretor #${row.broker_id}`}
                      </div>
                      <div className="text-xs text-[#777777]">
                        {row.sales_count} venda{row.sales_count === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-[#141414]">
                    {currency(row.commission_total)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
