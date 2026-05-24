'use client';

import {
  Building2,
  CheckCircle2,
  Dumbbell,
  Flame,
  Key,
  Shield,
  Snowflake,
  Sofa,
  Sparkles,
  Sun,
  TreePine,
  Tv,
  Users,
  Waves,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '../../components/primitives/reveal';

interface DetailFeaturesProps {
  characteristics: { text: string }[];
}

const KEYWORD_ICONS: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ['piscina'], icon: Waves },
  { keywords: ['academia', 'gym', 'fitness'], icon: Dumbbell },
  { keywords: ['churras', 'lareira'], icon: Flame },
  { keywords: ['ar condicionado', 'aquecimento', 'climatiz'], icon: Snowflake },
  { keywords: ['wifi', 'internet'], icon: Wifi },
  { keywords: ['tv', 'cabo'], icon: Tv },
  { keywords: ['mobiliad', 'spa'], icon: Sofa },
  { keywords: ['portaria', 'segurança', 'porteiro'], icon: Shield },
  { keywords: ['elevador'], icon: Building2 },
  { keywords: ['salão', 'festa', 'coworking'], icon: Users },
  { keywords: ['varanda', 'jardim', 'área verde', 'pet'], icon: TreePine },
  { keywords: ['sol', 'iluminação', 'janela'], icon: Sun },
  { keywords: ['automa', 'smart', 'home'], icon: Sparkles },
  { keywords: ['armário', 'quarto'], icon: Key },
];

function iconFor(text: string): LucideIcon {
  const lower = text.toLowerCase();
  for (const map of KEYWORD_ICONS) {
    if (map.keywords.some(k => lower.includes(k))) return map.icon;
  }
  return CheckCircle2;
}

export function DetailFeatures({ characteristics }: DetailFeaturesProps) {
  if (!characteristics || characteristics.length === 0) return null;

  const items = characteristics.filter(c => c.text && c.text.trim().length > 0);
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="font-display text-2xl md:text-3xl text-[#0F0820] tracking-tight mb-6">
        Comodidades <span className="text-amber-500 italic">&</span> Diferenciais
      </h2>

      <Reveal>
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((c, idx) => {
            const Icon = iconFor(c.text);
            return (
              <StaggerItem key={`${c.text}-${idx}`}>
                <div className="group bg-white border border-black/[0.06] rounded-2xl p-5 hover:border-amber-300/50 hover:shadow-[0_20px_40px_-15px_rgba(15,8,32,0.1)] transition-all duration-300">
                  <Icon className="w-6 h-6 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                  <p className="font-display text-base md:text-lg text-[#0F0820] font-semibold leading-tight">
                    {c.text}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Reveal>
    </section>
  );
}
