'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import type { MockProperty } from '../data/mock';
import { PremiumPropertyCard } from './premium-property-card';
import { Reveal } from './primitives/reveal';

interface PropertySectionProps {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  properties: MockProperty[];
  variant?: 'carousel' | 'grid';
  background?: 'light' | 'dark' | 'cream';
}

const BG = {
  light: 'bg-white',
  cream: 'bg-[#FAFAF7]',
  dark: 'bg-[#0F0820] text-white',
};

export function PropertySection({
  id,
  eyebrow,
  title,
  description,
  properties,
  variant = 'carousel',
  background = 'light',
}: PropertySectionProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const isDark = background === 'dark';

  const scrollBy = (dir: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(320, Math.floor(el.clientWidth * 0.85));
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section id={id} className={`py-20 md:py-28 ${BG[background]}`}>
      <div className="container mx-auto px-4 md:px-8">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p
                className={`text-xs tracking-[0.25em] uppercase mb-3 ${
                  isDark ? 'text-amber-300' : 'text-[#9747FF]'
                }`}
              >
                {eyebrow}
              </p>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight leading-[1.05]">
                {title}
              </h2>
              {description && (
                <p
                  className={`mt-4 text-base md:text-lg ${
                    isDark ? 'text-white/60' : 'text-[#777]'
                  } max-w-xl`}
                >
                  {description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollBy('left')}
                aria-label="Anterior"
                className={`w-11 h-11 rounded-full flex items-center justify-center border transition-colors ${
                  isDark
                    ? 'border-white/15 text-white hover:bg-white/10'
                    : 'border-black/10 text-[#0F0820] hover:bg-[#0F0820] hover:text-white hover:border-[#0F0820]'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollBy('right')}
                aria-label="Próximo"
                className={`w-11 h-11 rounded-full flex items-center justify-center border transition-colors ${
                  isDark
                    ? 'border-white/15 text-white hover:bg-white/10'
                    : 'border-black/10 text-[#0F0820] hover:bg-[#0F0820] hover:text-white hover:border-[#0F0820]'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <a
                href="#"
                className={`text-sm whitespace-nowrap underline-offset-4 hover:underline ${
                  isDark ? 'text-amber-300' : 'text-[#9747FF]'
                }`}
              >
                Ver todos →
              </a>
            </div>
          </div>
        </Reveal>

        {variant === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {properties.map(p => (
              <PremiumPropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="relative -mx-4 md:-mx-8">
            <div
              ref={scrollerRef}
              className="flex gap-5 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 md:px-8 pb-4
                         [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {properties.map(p => (
                <div
                  key={p.id}
                  className="snap-start shrink-0 w-[85%] sm:w-[55%] md:w-[42%] lg:w-[32%] xl:w-[28%]"
                >
                  <PremiumPropertyCard property={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
