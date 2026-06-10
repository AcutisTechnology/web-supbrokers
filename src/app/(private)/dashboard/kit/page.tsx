"use client";

import Link from "next/link";
import { FileText, TrendingUp, ShieldX, Mic } from "lucide-react";
import { TopNav } from "@/shared/components/top-nav";

const MODULES = [
  {
    title: "Scripts de Vendas",
    description:
      "Roteiros práticos prontos para gerar conexão e conversão instantânea.",
    href: "/dashboard/kit/scripts-de-vendas",
    bg: "bg-[#e8f5f0]",
    ctaColor: "text-[#0d7a47]",
    titleColor: "text-[#0d5c35]",
    Icon: FileText,
    iconBg: "bg-[#c3e8d5]",
    iconColor: "text-[#0d7a47]",
    available: true,
  },
  {
    title: "O Resgatador de Leads",
    description:
      "Sequência progressiva de 10 dias para reativar contatos inativos.",
    href: "/dashboard/kit/resgatador-de-leads",
    bg: "bg-[#e8f0fa]",
    ctaColor: "text-[#1a4fbf]",
    titleColor: "text-[#102f8a]",
    Icon: TrendingUp,
    iconBg: "bg-[#c3d4f5]",
    iconColor: "text-[#1a4fbf]",
    available: true,
  },
  {
    title: "O Guia Anti-Não",
    description:
      "Respostas assertivas e prontas para quebrar as maiores objeções do mercado.",
    href: "#",
    bg: "bg-[#fde8f0]",
    ctaColor: "text-[#b01a52]",
    titleColor: "text-[#7a0d35]",
    Icon: ShieldX,
    iconBg: "bg-[#f5c3d8]",
    iconColor: "text-[#b01a52]",
    available: false,
  },
  {
    title: "Roteiro de Áudio Magnético",
    description:
      "Scripts específicos para áudios de WhatsApp que prendem a atenção.",
    href: "/dashboard/kit/audios-magneticos",
    bg: "bg-[#f0e8fa]",
    ctaColor: "text-[#6b1abf]",
    titleColor: "text-[#45108a]",
    Icon: Mic,
    iconBg: "bg-[#d8c3f5]",
    iconColor: "text-[#6b1abf]",
    available: true,
  },
];

export default function KitPainelPage() {
  return (
    <>
      <TopNav title_secondary="Kit do Corretor" />

      <p className="text-sm text-[#777777] mb-8">
        Selecione abaixo a ferramenta que você precisa agora para acelerar seus
        fechamentos e contornar objeções.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {MODULES.map((mod) => {
          const content = (
            <div
              className={`${mod.bg} rounded-2xl p-6 flex flex-col justify-between min-h-[200px] transition-transform hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2
                    className={`text-lg font-bold ${mod.titleColor} mb-2 leading-snug`}
                  >
                    {mod.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {mod.description}
                  </p>
                </div>
                <div
                  className={`${mod.iconBg} w-16 h-16 rounded-xl flex items-center justify-center shrink-0`}
                >
                  <mod.Icon className={`w-8 h-8 ${mod.iconColor}`} />
                </div>
              </div>

              <div className="mt-6">
                {mod.available ? (
                  <p
                    className={`text-xs font-bold tracking-widest uppercase ${mod.ctaColor}`}
                  >
                    ACESSAR MÓDULO →
                  </p>
                ) : (
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                    Em breve
                  </p>
                )}
              </div>
            </div>
          );

          return mod.available ? (
            <Link key={mod.title} href={mod.href}>
              {content}
            </Link>
          ) : (
            <div key={mod.title} className="cursor-not-allowed opacity-80">
              {content}
            </div>
          );
        })}
      </div>
    </>
  );
}
