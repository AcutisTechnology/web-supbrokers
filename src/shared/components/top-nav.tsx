"use client";

import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from "@/shared/hooks/auth/use-auth";
import { usePathname } from "next/navigation";

// Rótulos dos segmentos de rota para breadcrumbs
const SEGMENT_LABELS: Record<string, string> = {
  imoveis: "Imóveis",
  crm: "CRM",
  leads: "Leads",
  analytics: "Analytics",
  config: "Configurações",
  visitas: "Visitas",
  captacoes: "Captações",
  alugueis: "Aluguéis",
  financeiro: "Financeiro",
  vendas: "Vendas",
  parcelas: "Parcelas",
  pagamentos: "Pagamentos",
  extrato: "Extrato",
  "minhas-comissoes": "Minhas Comissões",
  configuracoes: "Configurações",
  whatsapp: "WhatsApp",
  "disparo-em-massa": "Disparo em Massa",
  "meta-ads": "Meta ADS",
  "links-uteis": "Links Úteis",
  construtoras: "Construtoras",
  clientes: "Clientes",
  "follow-up": "Follow-up",
  "canal-pro": "Canal PRO",
  calendario: "Calendário",
  "agente-ia": "Agente de IA",
  "grupos-permissao": "Grupos de Permissão",
  planos: "Planos",
  propostas: "Propostas",
  "calculadora-fluxo": "Calculadora de Fluxo",
  kit: "Kit do Corretor",
  "scripts-de-vendas": "Scripts de Vendas",
  "resgatador-de-leads": "O Resgatador de Leads",
  mcmv: "Minha Casa Minha Vida",
  "medio-padrao": "Médio Padrão",
  "alto-padrao": "Alto Padrão",
  "audios-magneticos": "Roteiro de Áudios Magnéticos",
};

// Descrições por rota exata. Para rotas dinâmicas, o algoritmo
// sobe para o pai até encontrar uma descrição.
const ROUTE_DESCRIPTIONS: Record<string, string> = {
  "/dashboard/imoveis":                        "Gerencie os seus imóveis",
  "/dashboard/imoveis/novo":                   "Cadastre um novo imóvel",
  "/dashboard/crm":                            "Gerencie seus leads e oportunidades",
  "/dashboard/crm/config":                     "Configurações do CRM",
  "/dashboard/crm/analytics":                  "Análise de desempenho do CRM",
  "/dashboard/visitas":                        "Visitas registradas",
  "/dashboard/visitas/nova":                   "Registre uma nova visita",
  "/dashboard/financeiro":                     "Visão geral das finanças",
  "/dashboard/financeiro/vendas":              "Vendas registradas",
  "/dashboard/financeiro/pagamentos":          "Pagamentos a corretores",
  "/dashboard/financeiro/minhas-comissoes":    "Suas comissões",
  "/dashboard/financeiro/extrato":             "Histórico de pagamentos",
  "/dashboard/financeiro/parcelas":            "Parcelas e recebimentos",
  "/dashboard/captacoes":                      "Empreendimentos em captação",
  "/dashboard/captacoes/nova":                 "Cadastre uma nova captação",
  "/dashboard/alugueis":                       "Gerencie contratos de aluguel",
  "/dashboard/alugueis/novo":                  "Cadastre um novo aluguel",
  "/dashboard/construtoras":                   "Gestão de construtoras e empreendimentos",
  "/dashboard/meta-ads":                       "Gerencie suas campanhas do Facebook e Instagram",
  "/dashboard/calculadora-fluxo":              "Calcule o fluxo de caixa do seu imóvel",
  "/dashboard/whatsapp":                       "Integração com WhatsApp Business",
  "/dashboard/calendario":                     "Agenda e compromissos",
  "/dashboard/configuracoes":                  "Configurações da sua conta",
  "/dashboard/clientes":                       "Gestão de clientes e leads",
  "/dashboard/links-uteis":                    "Links e recursos úteis",
  "/dashboard/propostas":                      "Gerencie suas propostas",
  "/dashboard/propostas/nova":                 "Crie uma nova proposta",
  "/dashboard/disparo-em-massa":               "Envio em massa para clientes",
  "/dashboard/disparo-em-massa/nova":          "Crie uma nova campanha",
  "/dashboard/agente-ia":                      "Assistente de IA para corretores",
  "/dashboard/follow-up":                      "Acompanhamento de negociações",
  "/dashboard/canal-pro":                      "Canal profissional de vendas",
  "/dashboard/grupos-permissao":               "Gestão de permissões de usuários",
  "/dashboard/planos":                         "Planos e assinaturas",
  "/dashboard/kit":                                      "Escolha seu módulo",
  "/dashboard/kit/scripts-de-vendas":                    "Scripts validados de alta conversão",
  "/dashboard/kit/resgatador-de-leads":                  "Escolha o segmento para reativar seus leads",
  "/dashboard/kit/resgatador-de-leads/mcmv":             "Cadência de 10 dias — segmento econômico",
  "/dashboard/kit/resgatador-de-leads/medio-padrao":     "Cadência de 10 dias — clientes em ascensão",
  "/dashboard/kit/resgatador-de-leads/alto-padrao":      "Cadência de 10 dias — segmento premium",
  "/dashboard/kit/audios-magneticos":                    "Guia de gravação + 10 roteiros prontos para converter",
};

function getDescription(pathname: string): string | undefined {
  // Exact match
  if (ROUTE_DESCRIPTIONS[pathname]) return ROUTE_DESCRIPTIONS[pathname];
  // Sobe para o pai removendo o último segmento
  const parent = pathname.substring(0, pathname.lastIndexOf("/"));
  if (parent && parent !== "/dashboard") return getDescription(parent);
  return undefined;
}

interface TopNavProps {
  title_secondary: string;
}

function getInitials(name: string | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function TopNav({ title_secondary }: TopNavProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const name = user?.user?.name ?? "";
  const firstName = name.split(" ")[0] || "Corretor";
  const initials = getInitials(name);
  const avatarUrl = user?.user?.avatar_url ?? null;
  const description = getDescription(pathname);

  // Breadcrumbs automáticos — segmentos desconhecidos (IDs/slugs) são ignorados
  const segments = pathname.split("/").filter(Boolean);
  const afterDashboard = segments.slice(segments.indexOf("dashboard") + 1);

  const intermediates: { label: string; href: string }[] = [];
  let cumulativePath = "/dashboard";

  for (const segment of afterDashboard) {
    cumulativePath += `/${segment}`;
    if (SEGMENT_LABELS[segment]) {
      intermediates.push({ label: SEGMENT_LABELS[segment], href: cumulativePath });
    }
  }

  const crumbs = intermediates.filter((c) => c.href !== pathname);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-[#9747FF]/10 to-white p-6 rounded-xl mb-7">
      <div>
        <div className="flex items-center gap-2 text-sm text-[#777777] mb-1">
          <Link href="/dashboard" className="hover:text-[#9747FF] transition-colors">
            Home
          </Link>
          {crumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3" />
              <Link href={crumb.href} className="hover:text-[#9747FF] transition-colors">
                {crumb.label}
              </Link>
            </span>
          ))}
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#9747FF]">{title_secondary}</span>
        </div>
        <h1 className="text-2xl font-bold text-[#141414]">{title_secondary}</h1>
        {description && (
          <p className="text-sm text-[#777777] mt-0.5">{description}</p>
        )}
      </div>

      <div className="mt-4 md:mt-0 flex items-center gap-3">
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium">Bem-vindo(a), {firstName}</p>
          <p className="text-xs text-[#777777]">Corretor Imobiliário</p>
        </div>
        <Avatar className="h-10 w-10 border-2 border-[#9747FF]/20">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} className="object-cover" />}
          <AvatarFallback className="bg-[#9747FF]/10 text-[#9747FF] font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
