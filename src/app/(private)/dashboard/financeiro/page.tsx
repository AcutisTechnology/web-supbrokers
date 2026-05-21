"use client";

import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/features/dashboard/financeiro/components/top-nav";
import { FinanceDashboardCards } from "@/features/dashboard/financeiro/components/finance-dashboard-cards";
import { FinanceSalesTable } from "@/features/dashboard/financeiro/components/finance-sales-table";
import { useFinanceSales } from "@/features/dashboard/financeiro/services/finance-service";

export default function FinanceDashboardPage() {
  const { data, isLoading } = useFinanceSales({ per_page: 5 });
  const sales = data?.data ?? [];

  return (
    <>
      <TopNav title_secondary="Visão geral" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#141414]">Indicadores</h2>
          <p className="text-sm text-[#777777]">
            Resumo financeiro da imobiliária com base nas vendas registradas.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/financeiro/vendas">
            <Plus className="h-4 w-4" /> Nova venda
          </Link>
        </Button>
      </div>

      <FinanceDashboardCards />

      <Card className="mt-8 border border-gray-100 shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Últimas vendas</CardTitle>
            <CardDescription>5 mais recentes.</CardDescription>
          </div>
          <Button asChild variant="ghost" className="gap-1 text-[#9747FF] hover:text-[#9747FF]">
            <Link href="/dashboard/financeiro/vendas">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-[#777777]">Carregando...</p>
          ) : (
            <FinanceSalesTable sales={sales} canMutate={false} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
