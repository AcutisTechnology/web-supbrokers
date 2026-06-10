"use client";

import { useState } from "react";
import { Check, Copy, Brain, Lightbulb, Info, CirclePlay } from "lucide-react";
import type { AudioCard as AudioCardType } from "@/features/kit/data/audios-magneticos";

interface AudioCardProps {
  card: AudioCardType;
}

export function AudioCard({ card }: AudioCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = card.roteiro;
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
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col h-full group">
      {/* Header: number badge + title + copy button */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border border-primary/20 group-hover:scale-110 transition-transform duration-300 tabular-nums">
            {String(card.id).padStart(2, "0")}
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
              {card.title}
            </h3>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1 block">
              Áudio Pronto
            </span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground active:scale-95"
          aria-label="Copiar roteiro de áudio"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar Roteiro
            </>
          )}
        </button>
      </div>

      {/* Roteiro block */}
      <div className="bg-muted/40 rounded-xl p-5 md:p-6 mb-8 border border-border/50 relative overflow-hidden group-hover:bg-muted/60 transition-colors">
        <div className="absolute top-4 right-4 text-muted-foreground/10 pointer-events-none transform group-hover:scale-110 transition-transform duration-500">
          <CirclePlay className="w-16 h-16" />
        </div>
        <p className="text-foreground text-lg md:text-xl leading-relaxed relative z-10 font-medium">
          &ldquo;{card.roteiro}&rdquo;
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-5 mt-auto">
        {/* Explicação Estratégica */}
        <div className="bg-background rounded-xl p-4 border border-border/50">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            Explicação Estratégica
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{card.estrategia}</p>
        </div>

        {/* Padrão Psicológico */}
        <div className="bg-secondary/50 rounded-xl p-4 md:p-5 border border-border/50">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
            <Brain className="w-4 h-4 text-primary" />
            Padrão Psicológico
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{card.padrao}</p>
        </div>

        {/* Insight */}
        <div className="bg-primary/5 rounded-xl p-4 md:p-5 border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2 relative z-10">
            <Lightbulb className="w-4 h-4" />
            Insight
          </div>
          <p className="text-sm text-primary/90 leading-relaxed relative z-10 font-medium italic">
            &ldquo;{card.insight}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
