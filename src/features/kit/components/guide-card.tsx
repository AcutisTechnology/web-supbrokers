import {
  Brain,
  Lightbulb,
  Clock,
  Volume2,
  Activity,
  ListOrdered,
  XCircle,
  Target,
  Crosshair,
} from "lucide-react";
import type { GuideCard as GuideCardType } from "@/features/kit/data/audios-magneticos";

interface GuideCardProps {
  card: GuideCardType;
}

const ICONS: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Clock,
  2: Volume2,
  3: Activity,
  4: ListOrdered,
  5: XCircle,
  6: Target,
  7: Crosshair,
};

export function GuideCard({ card }: GuideCardProps) {
  const Icon = ICONS[card.id] ?? Target;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col h-full group">
      {/* Header: icon + title + badge */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">
            {card.title}
          </h3>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-md">
            Guia {String(card.id).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed mb-8 flex-1">{card.description}</p>

      {/* Sections */}
      <div className="space-y-4 mt-auto">
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
