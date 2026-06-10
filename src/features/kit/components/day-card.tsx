"use client";

import { useState } from "react";
import { Check, ClipboardList, Target, BrainCircuit, Lightbulb, MessageSquare } from "lucide-react";
import type { DiaCard } from "@/features/kit/data/resgatador-de-leads";

interface DayCardProps {
  card: DiaCard;
}

export function DayCard({ card }: DayCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = card.message;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col">
      <div className="p-6 md:p-8 flex-1 flex flex-col gap-6">
        {/* Header: DIA badge + title */}
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg text-sm tracking-wide">
            DIA {card.dia}
          </div>
          <h3 className="text-xl font-bold text-foreground uppercase tracking-tight">
            {card.title}
          </h3>
        </div>

        {/* Message block with absolute badge */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-5 relative">
          <div className="absolute -top-3 left-4 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm border border-emerald-200 dark:border-emerald-800">
            <MessageSquare className="w-3 h-3" />
            Mensagem Principal
          </div>
          <p className="text-foreground font-medium text-[15px] mt-2 leading-relaxed whitespace-pre-wrap">
            {card.message}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-5 flex-1">
          <div className="flex gap-3">
            <Target className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-foreground mb-1">Explicação Estratégica</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.estrategia}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <BrainCircuit className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-foreground mb-1">Padrão Psicológico</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.padrao}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-foreground mb-1">Insight</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.insight}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copy button */}
      <div className="px-6 pb-6 md:px-8 md:pb-8">
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 bg-[#16ae4f] hover:bg-[#14993f] active:bg-[#0f7a33] text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 shrink-0" />
              Copiado!
            </>
          ) : (
            <>
              <ClipboardList className="w-4 h-4 shrink-0" />
              Copiar para WhatsApp
            </>
          )}
        </button>
      </div>
    </div>
  );
}
