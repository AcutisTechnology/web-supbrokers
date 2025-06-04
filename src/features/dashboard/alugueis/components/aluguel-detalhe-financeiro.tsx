import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Wrench, Building2, Home } from "lucide-react";
import { BarChart2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, PieChart, Pie, AreaChart, Area, LineChart, Line, YAxis } from "recharts";

type FinanceiroGrafico = {
  name: string;
  Recebido: number;
  Atrasado: number;
  Reparos: number;
  Condominio: number;
  IPTU: number;
};

export type Financeiro = {
  pagamentosEmDia: number;
  pagamentosAtraso: number;
  custoReparos: number;
  custoCondominio: number;
  custoIptu: number;
  grafico: FinanceiroGrafico[];
};

export function AluguelDetalheFinanceiro({ financeiro }: { financeiro: Financeiro }) {
  return (
    <Card className="p-6 shadow-sm mb-6">
      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[#9747ff]" />
        <span className="font-semibold text-[#1c1b1f] text-lg">Relatório financeiro</span>
      </div>
      {/* Cards de estatísticas financeiras */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="border-l-4 border-l-[#16ae4f]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-[#969696]">Pagamentos em dia</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">R$ {financeiro.pagamentosEmDia.toLocaleString('pt-BR')}</h3>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#16ae4f]/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#16ae4f]" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs text-[#969696]">
              <span className="text-green-600 font-medium">+5%</span> desde o último mês
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#e63946]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-[#969696]">Pagamentos em atraso</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">R$ {financeiro.pagamentosAtraso.toLocaleString('pt-BR')}</h3>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#e63946]/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#e63946]" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs text-[#969696]">
              <span className="text-red-600 font-medium">-2%</span> desde o último mês
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#fbbf24]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-[#969696]">Custo com reparos</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">R$ {financeiro.custoReparos.toLocaleString('pt-BR')}</h3>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#fbbf24]/10 rounded-full flex items-center justify-center">
                <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-[#fbbf24]" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs text-[#969696]">
              <span className="text-orange-600 font-medium">3</span> reparos este mês
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#9747ff]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-[#969696]">Condomínio</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">R$ {financeiro.custoCondominio.toLocaleString('pt-BR')}</h3>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#9747ff]/10 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#9747ff]" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs text-[#969696]">
              <span className="text-blue-600 font-medium">Mensal</span> em dia
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#2563eb]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-[#969696]">IPTU</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">R$ {financeiro.custoIptu.toLocaleString('pt-BR')}</h3>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2563eb]/10 rounded-full flex items-center justify-center">
                <Home className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563eb]" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-xs text-[#969696]">
              <span className="text-blue-600 font-medium">Anual</span> em dia
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Gráficos */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
        {/* Gráfico de Pizza - Distribuição */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#16ae4f]/5 to-transparent p-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#16ae4f]" />
              <CardTitle className="text-sm font-medium">Distribuição</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer config={{
              Recebido: { label: "Recebido", color: "#16ae4f" },
              Atrasado: { label: "Atrasado", color: "#e63946" },
              Reparos: { label: "Reparos", color: "#fbbf24" },
              Condominio: { label: "Condomínio", color: "#9747ff" },
              IPTU: { label: "IPTU", color: "#2563eb" }
            }} className="h-[120px] w-full">
              <PieChart>
                <Pie
                  data={[
                    { name: "Recebido", value: financeiro.pagamentosEmDia, fill: "#16ae4f" },
                    { name: "Atrasado", value: financeiro.pagamentosAtraso, fill: "#e63946" },
                    { name: "Reparos", value: financeiro.custoReparos, fill: "#fbbf24" },
                    { name: "Condomínio", value: financeiro.custoCondominio, fill: "#9747ff" },
                    { name: "IPTU", value: financeiro.custoIptu, fill: "#2563eb" }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        {/* Gráfico de Área - Evolução */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#9747ff]/5 to-transparent p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#9747ff]" />
              <CardTitle className="text-sm font-medium">Evolução</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer config={{
              Recebido: { label: "Recebido", color: "#16ae4f" },
              Atrasado: { label: "Atrasado", color: "#e63946" }
            }} className="h-[120px] w-full">
              <AreaChart data={financeiro.grafico} margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="Recebido"
                  stackId="1"
                  stroke="#16ae4f"
                  fill="#16ae4f"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="Atrasado"
                  stackId="1"
                  stroke="#e63946"
                  fill="#e63946"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        {/* Gráfico de Linhas - Tendências */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#fbbf24]/5 to-transparent p-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#fbbf24]" />
              <CardTitle className="text-sm font-medium">Tendências</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer config={{
              Reparos: { label: "Reparos", color: "#fbbf24" },
              Condominio: { label: "Condomínio", color: "#9747ff" },
              IPTU: { label: "IPTU", color: "#2563eb" }
            }} className="h-[120px] w-full">
              <LineChart data={financeiro.grafico} margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="Reparos"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  dot={{ fill: "#fbbf24", strokeWidth: 2, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="Condominio"
                  stroke="#9747ff"
                  strokeWidth={2}
                  dot={{ fill: "#9747ff", strokeWidth: 2, r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="IPTU"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: "#2563eb", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
} 