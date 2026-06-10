'use client';

import type { Property as ApiProperty } from '@/features/landing/services/broker-service';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { ListingPropertyCard } from '../../components/listing-property-card';
import { apiToCardProperty } from '../../lib/map-property';

interface DetailSimilarProps {
  currentSlug: string;
  currentNeighborhood: string;
  currentType: 'sale' | 'rent';
  allProperties: ApiProperty[];
  whatsappNumber?: string;
  brokerSlug?: string | null;
}

export function DetailSimilar({
  currentSlug,
  currentNeighborhood,
  currentType,
  allProperties,
  whatsappNumber,
  brokerSlug,
}: DetailSimilarProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => {
    const isSame = currentType === 'sale' ? 'sale' : 'rent';
    const candidates = allProperties.filter(
      p => p.slug !== currentSlug && (isSame === 'sale' ? p.sale : p.rent)
    );
    // Primeiro: mesma vizinhança. Depois: outros.
    const sameNeighborhood = candidates.filter(
      p => p.neighborhood === currentNeighborhood
    );
    const others = candidates.filter(
      p => p.neighborhood !== currentNeighborhood
    );
    return [...sameNeighborhood, ...others].slice(0, 8).map(apiToCardProperty);
  }, [currentSlug, currentNeighborhood, currentType, allProperties]);

  if (items.length === 0) return null;

  const scrollBy = (dir: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.max(320, Math.floor(el.clientWidth * 0.85));
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#9747FF] mb-2">
            Recomendados para você
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-[#0F0820] tracking-tight">
            Imóveis semelhantes
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scrollBy('left')}
            aria-label="Anterior"
            className="w-10 h-10 rounded-full flex items-center justify-center border border-black/10 text-[#0F0820]/70 hover:text-[#0F0820] hover:border-[#0F0820]/30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollBy('right')}
            aria-label="Próximo"
            className="w-10 h-10 rounded-full flex items-center justify-center border border-black/10 text-[#0F0820]/70 hover:text-[#0F0820] hover:border-[#0F0820]/30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative -mx-4 md:-mx-8">
        <div
          ref={scrollerRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 md:px-8 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {items.map(p => (
            <div
              key={p.id}
              className="snap-start shrink-0 w-[85%] sm:w-[55%] md:w-[42%] lg:w-[32%]"
            >
              <ListingPropertyCard property={p} whatsappNumber={whatsappNumber} brokerSlug={brokerSlug} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
