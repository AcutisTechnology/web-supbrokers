"use client";

import { TopNav } from "@/features/dashboard/imoveis/top-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CrmAnalyticsPeriod,
  useCrmBrokerRanking,
  useCrmConversion,
  useCrmFunnel,
  useCrmMetrics,
  useCrmTimeline,
} from "@/features/dashboard/crm/services/crm-service";
import { Award, BarChart3, TrendingUp, Filter, Target } from "lucide-react";
import Link from "next/link";

const PERIOD_OPTIONS: { value: CrmAnalyticsPeriod; label: string }[] = [
  { value: "this_month", label: "Este mês" },
  { value: "last_7_days", label: "Últimos 7 dias" },
  { value: "last_30_days", label: "Últimos 30 dias" },
  { value: "this_year", label: "Este ano" },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number.isFinite(value) ? value : 0);

const formatDate = (iso: string) => {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
};

export default function CrmAnalyticsPage() {
  const [period, setPeriod] = useState<CrmAnalyticsPeriod>("this_month");

  const { data: metrics, isLoading: loadingMetrics } = useCrmMetrics(period === "this_year" ? "last_30_days" : period);
  const { data: funnel, isLoading: loadingFunnel } = useCrmFunnel(period);
  const { data: conversion, isLoading: loadingConversion } = useCrmConversion(period);
  const { data: ranking, isLoading: loadingRanking } = useCrmBrokerRanking(period);
  const { data: timeline, isLoading: loadingTimeline } = useCrmTimeline(period);

  const funnelChartData = useMemo(
    () =>
      (funnel?.stages ?? []).map((s) => ({
        name: s.name,
        count: s.count,
        color: s.color ?? "#9747FF",
      })),
    [funnel],
  );

  const timelineChartData = useMemo(
    () =>
      (timeline?.rows ?? []).map((r) => ({
        date: formatDate(r.date),
        Criados: r.created,
        Ganhos: r.won,
        Perdidos: r.lost,
      })),
    [timeline],
  );

  return (
    <>
      <TopNav title_secondary="CRM" />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-[#141414]">Dashboard CRM</h1>
            <p className="text-sm text-[#777777]">Visão analítica do funil, conversão e desempenho da equipe.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/crm" className="text-sm text-[#9747FF] hover:underline">
              Voltar ao kanban
            </Link>
            <Select value={period} onValueChange={(v) => setPeriod(v as CrmAnalyticsPeriod)}>
              <SelectTrigger className="w-44">
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {[
            { label: "Leads no período", value: metrics?.total_leads ?? 0 },
            { label: "Ganhos", value: metrics?.won_leads ?? 0, sub: formatCurrency(metrics?.won_value ?? 0), color: "text-emerald-600" },
            { label: "Conversão", value: `${metrics?.conversion_rate ?? 0}%` },
            { label: "Ticket médio", value: formatCurrency(metrics?.avg_ticket ?? 0) },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            >
              <Card className="border border-gray-100 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-[#777777] font-medium">{kpi.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingMetrics ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className={`text-2xl font-bold ${kpi.color ?? "text-[#141414]"}`}>{kpi.value}</div>
                      {kpi.sub && <div className="text-xs text-[#777777]">{kpi.sub}</div>}
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <Tabs defaultValue="funnel">
          <TabsList>
            <TabsTrigger value="funnel" className="gap-2">
              <Target className="h-4 w-4" />
              Funil
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Evolução
            </TabsTrigger>
            <TabsTrigger value="ranking" className="gap-2">
              <Award className="h-4 w-4" />
              Ranking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="funnel" className="mt-6 space-y-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Distribuição por etapa</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingFunnel ? (
                  <Skeleton className="h-[320px] w-full" />
                ) : funnelChartData.length === 0 ? (
                  <EmptyState
                    icon={<BarChart3 className="h-6 w-6 text-[#9747FF]" />}
                    title="Sem dados no período"
                    description="Não há leads neste recorte. Tente expandir o período no filtro acima."
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={funnelChartData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={140} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                        {funnelChartData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Conversão entre etapas</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingConversion ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-9 w-full" />
                    ))}
                  </div>
                ) : (conversion?.rows.length ?? 0) === 0 ? (
                  <EmptyState
                    icon={<Target className="h-6 w-6 text-[#9747FF]" />}
                    title="Sem movimentações"
                    description="Quando leads mudarem de etapa, a conversão entre elas aparecerá aqui."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-xs text-[#777777]">
                          <th className="py-2">Etapa</th>
                          <th className="py-2 text-right">Entradas</th>
                          <th className="py-2">Próxima</th>
                          <th className="py-2 text-right">Entradas próx.</th>
                          <th className="py-2 text-right">Conversão</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(conversion?.rows ?? []).map((r) => (
                          <tr key={r.stage_id} className="border-b last:border-0">
                            <td className="py-2 font-medium text-[#141414]">{r.name}</td>
                            <td className="py-2 text-right">{r.entries}</td>
                            <td className="py-2 text-[#777777]">{r.next_stage_name ?? "—"}</td>
                            <td className="py-2 text-right">{r.next_entries ?? "—"}</td>
                            <td className="py-2 text-right">
                              {r.conversion_rate !== null ? (
                                <Badge
                                  className={
                                    r.conversion_rate >= 50
                                      ? "bg-emerald-100 text-emerald-700"
                                      : r.conversion_rate >= 20
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-rose-100 text-rose-700"
                                  }
                                >
                                  {r.conversion_rate}%
                                </Badge>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Leads ao longo do tempo</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTimeline ? (
                  <Skeleton className="h-[320px] w-full" />
                ) : timelineChartData.length === 0 ? (
                  <EmptyState
                    icon={<TrendingUp className="h-6 w-6 text-[#9747FF]" />}
                    title="Sem dados no período"
                    description="Crie ou movimente leads para visualizar a evolução temporal."
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={timelineChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Criados" stroke="#9747FF" strokeWidth={2} />
                      <Line type="monotone" dataKey="Ganhos" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="Perdidos" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ranking" className="mt-6">
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Ranking de corretores</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingRanking ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-9 w-full" />
                    ))}
                  </div>
                ) : (ranking?.rows.length ?? 0) === 0 ? (
                  <EmptyState
                    icon={<Award className="h-6 w-6 text-[#9747FF]" />}
                    title="Sem dados no período"
                    description="Atribua leads a corretores para começar a montar o ranking."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-xs text-[#777777]">
                          <th className="py-2">#</th>
                          <th className="py-2">Corretor</th>
                          <th className="py-2 text-right">Total</th>
                          <th className="py-2 text-right">Ganhos</th>
                          <th className="py-2 text-right">Perdidos</th>
                          <th className="py-2 text-right">Valor ganho</th>
                          <th className="py-2 text-right">Conversão</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(ranking?.rows ?? []).map((r, i) => (
                          <tr key={r.user_id} className="border-b last:border-0">
                            <td className="py-2 text-[#777777]">{i + 1}</td>
                            <td className="py-2 font-medium text-[#141414]">{r.name}</td>
                            <td className="py-2 text-right">{r.total_leads}</td>
                            <td className="py-2 text-right text-emerald-600 font-medium">{r.won_leads}</td>
                            <td className="py-2 text-right text-rose-600">{r.lost_leads}</td>
                            <td className="py-2 text-right font-medium">{formatCurrency(r.won_value)}</td>
                            <td className="py-2 text-right">
                              <Badge
                                className={
                                  r.conversion_rate >= 50
                                    ? "bg-emerald-100 text-emerald-700"
                                    : r.conversion_rate >= 20
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-rose-100 text-rose-700"
                                }
                              >
                                {r.conversion_rate}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
