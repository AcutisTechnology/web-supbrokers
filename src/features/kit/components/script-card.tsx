import { MessageSquare, Lightbulb, Target, BrainCircuit } from "lucide-react";
import { type ScriptCard as ScriptCardType } from "@/features/kit/data/scripts-de-vendas";
import { CopyButton } from "./copy-button";

interface ScriptCardProps {
  card: ScriptCardType;
}

export function ScriptCard({ card }: ScriptCardProps) {
  const [firstMessage, ...rest] = card.messages;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col">
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        {/* Label */}
        <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase mb-4">
          {card.label}
        </h3>

        {/* Message block */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
              <span>{firstMessage}</span>
              {rest.map((msg, i) => (
                <span key={i}>
                  {"\n\n"}
                  <span className="text-sm text-muted-foreground font-semibold">
                    Depois:
                  </span>
                  {"\n"}
                  {msg}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-5 flex-1">
          {/* Explicação Estratégica */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground">Explicação Estratégica</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {card.estrategia}
            </p>
          </div>

          {/* Padrão Psicológico */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground">Padrão Psicológico</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {card.padrao}
            </p>
          </div>

          {/* Insight */}
          <div className="rounded-lg p-4 mt-auto bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-bold text-primary">Insight</h4>
            </div>
            <p className="text-sm font-medium leading-relaxed italic text-primary/80">
              {card.insight}
            </p>
          </div>
        </div>
      </div>

      {/* Copy button */}
      <div className="px-6 pb-6 md:px-8 md:pb-8">
        <CopyButton messages={card.messages} />
      </div>
    </div>
  );
}
