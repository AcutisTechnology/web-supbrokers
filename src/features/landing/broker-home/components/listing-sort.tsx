'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { BrokerSearchFilters } from '@/features/landing/services/broker-service';
import { useSearchFilters } from '../hooks/use-search-filters';

const SORT_OPTIONS: { value: NonNullable<BrokerSearchFilters['sort']>; label: string }[] = [
  { value: 'newest', label: 'Mais recentes' },
  { value: 'oldest', label: 'Mais antigos' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'size_desc', label: 'Maior área' },
];

export function ListingSort() {
  const { filters, setFilter } = useSearchFilters();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const active = filters.sort ?? 'newest';
  const activeLabel = SORT_OPTIONS.find(o => o.value === active)?.label ?? 'Ordenar';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 text-sm text-[#0F0820]/80 hover:text-[#0F0820] transition-colors"
      >
        <span className="text-[#0F0820]/50">Ordenar por:</span>
        <span className="font-medium">{activeLabel}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-30 w-56 bg-white border border-black/10 rounded-xl shadow-[0_20px_40px_-15px_rgba(15,8,32,0.2)] py-1.5"
          >
            {SORT_OPTIONS.map(opt => {
              const isActive = active === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setFilter('sort', opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between text-left px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? 'text-[#9747FF] bg-[#FAFAF7]'
                      : 'text-[#0F0820]/80 hover:bg-[#FAFAF7]'
                  }`}
                >
                  <span className={isActive ? 'font-medium' : ''}>{opt.label}</span>
                  {isActive && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
