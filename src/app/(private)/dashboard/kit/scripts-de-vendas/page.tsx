"use client";

import Link from "next/link";
import {
  ChevronRight,
  MessageSquare,
  Search,
  Monitor,
  Calendar,
  CheckSquare,
  Lock,
  Users,
} from "lucide-react";
import { TopNav } from "@/shared/components/top-nav";

const ETAPAS = [
  {
    id: 1,
    title: "Etapa 1 — Reconhecimento e Rapport",
    description:
      "5 abordagens diferentes para iniciar contato com leads. Quebre o gelo, gere confiança imediata e inicie a conversa sem parecer um vendedor chato.",
    Icon: MessageSquare,
  },
  {
    id: 2,
    title: "Etapa 2 — Sondagem",
    description:
      "Descubra o que o cliente realmente quer comprar. Regras obrigatórias e 5 scripts para qualificar o lead e dominar a conversa.",
    Icon: Search,
  },
  {
    id: 3,
    title: "Etapa 3 — Apresentação",
    description:
      "Construa autoridade, use prova social e valide o alinhamento financeiro antes de agendar a visita. Nunca envie fotos sem contexto.",
    Icon: Monitor,
  },
  {
    id: 4,
    title: "Etapa 4 — Agendamento",
    description:
      "Transforme interesse em ação. Aprenda a conduzir o cliente para a visita física usando a escolha ilusória e ancoragem de compromisso.",
    Icon: Calendar,
  },
  {
    id: 5,
    title: "Etapa 5 — Pós-Visita",
    description:
      "Transforme interesse em decisão. Saiba como conduzir até a proposta sem parecer desesperado, contornando objeções ocultas.",
    Icon: CheckSquare,
  },
  {
    id: 6,
    title: "Etapa 6 — Fechamento",
    description:
      "Forçar sem forçar. A arte da condução. O momento da verdade para levar o cliente à assinatura sem parecer ansioso pela comissão.",
    Icon: Lock,
  },
  {
    id: 7,
    title: "Etapa 7 — Adaptação por Perfil de Cliente",
    description:
      "Aprenda a ajustar sua comunicação, postura e argumentos para maximizar a conversão em clientes MCMV, Médio e Alto Padrão.",
    Icon: Users,
  },
];

export default function ScriptsDeVendasPage() {
  return (
    <>
      <TopNav title_secondary="Scripts de Vendas" />

      <p className="text-sm text-[#777777] mb-8">
        Selecione a etapa do funil em que seu cliente se encontra para acessar
        os scripts validados de alta conversão.
      </p>

      <div className="space-y-3">
        {ETAPAS.map((etapa) => (
          <Link
            key={etapa.id}
            href={`/dashboard/kit/scripts-de-vendas/${etapa.id}`}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-[#16ae4f]/40 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 bg-[#f0fdf4] rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#dcfce7] transition-colors">
              <etapa.Icon className="w-5 h-5 text-[#16ae4f]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#141414] text-sm">
                {etapa.title}
              </p>
              <p className="text-xs text-[#777777] leading-snug mt-0.5 line-clamp-2">
                {etapa.description}
              </p>
            </div>
            <div className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0 group-hover:bg-[#16ae4f] group-hover:border-[#16ae4f] transition-colors">
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
