"use client";

import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from "@/shared/hooks/auth/use-auth";
import { usePathname } from "next/navigation";

// Segmentos de rota conhecidos e seus rótulos legíveis
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
};

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

  // Constrói breadcrumbs automaticamente a partir da URL atual.
  // Segmentos desconhecidos (IDs, slugs dinâmicos) são ignorados.
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

  // Remove o último item intermediário se ele aponta para a página atual
  // (evita "Imóveis > Imóveis" quando o título já representa o módulo)
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
      </div>

      <div className="mt-4 md:mt-0 flex items-center gap-3">
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium">Bem-vindo(a), {firstName}</p>
          <p className="text-xs text-[#777777]">Corretor Imobiliário</p>
        </div>
        <Avatar className="h-10 w-10 border-2 border-[#9747FF]/20">
          <AvatarFallback className="bg-[#9747FF]/10 text-[#9747FF] font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
