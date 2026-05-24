'use client';

import { motion } from 'framer-motion';
import { Calendar, Hash, MapPin } from 'lucide-react';

interface DetailSummaryProps {
  title: string;
  street: string;
  neighborhood: string;
  city: string | null;
  state: string | null;
  code: string;
  type: 'sale' | 'rent';
  createdAt: string;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function DetailSummary({
  title,
  street,
  neighborhood,
  city,
  state,
  code,
  type,
  createdAt,
}: DetailSummaryProps) {
  const locationParts = [
    [street, neighborhood].filter(Boolean).join(', '),
    [city, state].filter(Boolean).join(' / '),
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold ${
            type === 'sale'
              ? 'bg-[#0F0820] text-white'
              : 'bg-amber-300 text-[#0F0820]'
          }`}
        >
          {type === 'sale' ? 'À venda' : 'Para alugar'}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-[#0F0820]/55">
          <Hash className="w-3 h-3" />
          {code}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-[#0F0820]/55">
          <Calendar className="w-3 h-3" />
          Publicado em {formatDate(createdAt)}
        </span>
      </div>

      <h1 className="font-display text-3xl md:text-5xl text-[#0F0820] tracking-tight leading-[1.05]">
        {title}
      </h1>

      <p className="inline-flex items-start gap-2 text-sm md:text-base text-[#0F0820]/65">
        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#9747FF]" />
        <span>
          {locationParts.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </span>
      </p>
    </motion.div>
  );
}
