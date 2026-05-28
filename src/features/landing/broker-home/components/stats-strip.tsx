'use client';

import {
  Award,
  BarChart3,
  Building2,
  Crown,
  Heart,
  Home,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { mockStats } from '../data/mock';
import type { HomeStat } from '../hooks/use-broker-home-data';
import { CountUp } from './primitives/count-up';
import { Reveal, Stagger, StaggerItem } from './primitives/reveal';

interface StatsStripProps {
  stats?: HomeStat[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  Award,
  Building2,
  Crown,
  Users,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Home,
  Star,
  Heart,
};

const FALLBACK_ICONS: LucideIcon[] = [Award, Building2, Crown, Users];

function resolveIcon(name: string | null | undefined, fallback: LucideIcon): LucideIcon {
  if (!name) return fallback;
  return ICON_MAP[name] ?? BarChart3;
}

export function StatsStrip({ stats }: StatsStripProps) {
  // Quando há stats reais (com broker conectado), usa eles. Senão, mocks pra demonstração.
  const items: HomeStat[] = stats && stats.length > 0
    ? stats
    : mockStats.map((s, i) => ({
        id: i,
        label: s.label,
        value: s.value,
        prefix: s.prefix ?? null,
        suffix: s.suffix ?? null,
        icon: null,
      }));

  if (items.length === 0) return null;

  const cols =
    items.length >= 4 ? 'md:grid-cols-4' : items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

  return (
    <section className="relative py-24 bg-[#FAFAF7]">
      <div className="container mx-auto px-4 md:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs tracking-[0.25em] uppercase text-[#9747FF] mb-3">
            Resultados que falam
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-[#0F0820] tracking-tight">
            Excelência em <span className="italic">números</span>.
          </h2>
        </Reveal>

        <Stagger className={`grid grid-cols-2 ${cols} gap-4 md:gap-6`}>
          {items.map((stat, i) => {
            const Icon = resolveIcon(stat.icon, FALLBACK_ICONS[i % FALLBACK_ICONS.length]);
            return (
              <StaggerItem key={stat.id ?? stat.label}>
                <div className="group relative bg-white border border-black/5 rounded-2xl p-6 md:p-8 hover:border-amber-300/50 hover:shadow-[0_30px_60px_-20px_rgba(151,71,255,0.15)] transition-all duration-500">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0F0820] to-[#1f1240] flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-amber-300/60 group-hover:bg-amber-300 transition-colors" />
                  </div>
                  <div className="font-display text-4xl md:text-5xl text-[#0F0820] tracking-tight">
                    <CountUp
                      to={stat.value}
                      prefix={stat.prefix ?? undefined}
                      suffix={stat.suffix ?? undefined}
                    />
                  </div>
                  <p className="mt-2 text-sm text-[#777]">{stat.label}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
