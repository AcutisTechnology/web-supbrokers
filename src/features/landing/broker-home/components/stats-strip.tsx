'use client';

import { Award, Building2, Crown, Users } from 'lucide-react';
import { mockStats } from '../data/mock';
import { CountUp } from './primitives/count-up';
import { Reveal, Stagger, StaggerItem } from './primitives/reveal';

const ICONS = [Award, Building2, Crown, Users];

export function StatsStrip() {
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

        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {mockStats.map((stat, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <StaggerItem key={stat.label}>
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
                      prefix={stat.prefix}
                      suffix={stat.suffix}
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
