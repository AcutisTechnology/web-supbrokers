'use client';

import { Bath, BedDouble, Car, Maximize2, ShowerHead } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '../../components/primitives/reveal';

interface DetailHighlightsProps {
  bedrooms: number;
  suites: number;
  bathrooms: number;
  garages: number;
  size: number;
}

export function DetailHighlights({
  bedrooms,
  suites,
  bathrooms,
  garages,
  size,
}: DetailHighlightsProps) {
  const items = [
    bedrooms > 0
      ? { icon: BedDouble, label: 'Quartos', value: bedrooms }
      : null,
    suites > 0 ? { icon: ShowerHead, label: 'Suítes', value: suites } : null,
    bathrooms > 0 ? { icon: Bath, label: 'Banheiros', value: bathrooms } : null,
    garages > 0 ? { icon: Car, label: 'Vagas', value: garages } : null,
    size > 0
      ? { icon: Maximize2, label: 'Área', value: `${size} m²` }
      : null,
  ].filter((x): x is NonNullable<typeof x> => x !== null);

  if (items.length === 0) return null;

  return (
    <Reveal>
      <Stagger className={`grid gap-3 md:gap-4 grid-cols-2 sm:grid-cols-3 ${items.length >= 5 ? 'md:grid-cols-5' : items.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
        {items.map(item => {
          const Icon = item.icon;
          return (
            <StaggerItem key={item.label}>
              <div className="group relative bg-white border border-black/[0.05] rounded-2xl p-5 hover:border-amber-300/40 hover:shadow-[0_20px_40px_-15px_rgba(15,8,32,0.12)] transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0F0820] to-[#1f1240] flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-display text-2xl md:text-3xl text-[#0F0820] tracking-tight">
                  {item.value}
                </p>
                <p className="text-xs uppercase tracking-wider text-[#0F0820]/50 mt-1">
                  {item.label}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Reveal>
  );
}
