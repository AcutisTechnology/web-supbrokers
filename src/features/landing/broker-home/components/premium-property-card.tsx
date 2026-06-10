'use client';

import { motion } from 'framer-motion';
import { Bath, BedDouble, Car, Heart, Maximize2, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Badge, MockProperty } from '../data/mock';
import { brokerUrls } from '../lib/broker-urls';

const BADGE_STYLES: Record<Badge, string> = {
  destaque: 'bg-amber-400 text-[#0F0820]',
  luxo: 'bg-gradient-to-r from-amber-300 to-amber-500 text-[#0F0820]',
  oportunidade: 'bg-emerald-400 text-[#0F0820]',
  lancamento: 'bg-rose-400 text-[#0F0820]',
  exclusivo: 'bg-[#0F0820] text-amber-300 border border-amber-300/40',
};

const BADGE_LABEL: Record<Badge, string> = {
  destaque: 'Destaque',
  luxo: 'Luxo',
  oportunidade: 'Oportunidade',
  lancamento: 'Lançamento',
  exclusivo: 'Exclusivo',
};

interface Props {
  property: MockProperty;
  brokerSlug?: string | null;
}

export function PremiumPropertyCard({ property, brokerSlug }: Props) {
  const [fav, setFav] = useState(false);
  const detailHref = brokerSlug ? brokerUrls(brokerSlug).property(property.id) : null;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-black/[0.06] shadow-[0_4px_30px_-12px_rgba(15,8,32,0.12)] hover:shadow-[0_30px_60px_-20px_rgba(15,8,32,0.25)] transition-shadow duration-500"
    >
      {detailHref && (
        <Link
          href={detailHref}
          aria-label={`Ver detalhes de ${property.title}`}
          className="absolute inset-0 z-[1]"
        />
      )}
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={property.image}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0820]/70 via-transparent to-transparent opacity-90" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[70%]">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase ${
              property.type === 'sale'
                ? 'bg-white text-[#0F0820]'
                : 'bg-[#0F0820] text-white'
            }`}
          >
            {property.type === 'sale' ? 'Venda' : 'Aluguel'}
          </span>
          {property.badges.slice(0, 2).map(b => (
            <span
              key={b}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase ${BADGE_STYLES[b]}`}
            >
              {BADGE_LABEL[b]}
            </span>
          ))}
        </div>

        {/* Top right actions */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={e => {
              e.preventDefault();
              setFav(v => !v);
            }}
            aria-label="Favoritar"
            className="w-9 h-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center hover:bg-white shadow-md"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                fav ? 'fill-rose-500 text-rose-500' : 'text-[#0F0820]'
              }`}
            />
          </button>
          <button
            aria-label="Compartilhar"
            className="w-9 h-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center hover:bg-white shadow-md"
          >
            <Share2 className="w-4 h-4 text-[#0F0820]" />
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 p-4 text-white">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">
            {property.neighborhood} · {property.city}
          </p>
          <h3 className="mt-1 font-display text-lg md:text-xl leading-tight line-clamp-2">
            {property.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 md:p-6">
        {/* Specs */}
        <div className="flex items-center justify-between text-xs text-[#0F0820]/70">
          <Spec icon={<BedDouble className="w-3.5 h-3.5" />} value={`${property.bedrooms}`} label="Quartos" />
          <Spec icon={<Bath className="w-3.5 h-3.5" />} value={`${property.suites}`} label="Suítes" />
          <Spec icon={<Car className="w-3.5 h-3.5" />} value={`${property.garages}`} label="Vagas" />
          <Spec icon={<Maximize2 className="w-3.5 h-3.5" />} value={`${property.size}`} label="m²" />
        </div>

        <div className="mt-5 pt-5 border-t border-black/5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#0F0820]/50">
              {property.type === 'sale' ? 'A partir de' : 'Aluguel mensal'}
            </p>
            <p className="font-display text-xl md:text-2xl text-[#0F0820]">
              R$ {property.price}
              {property.type === 'rent' && <span className="text-sm text-[#0F0820]/50">/mês</span>}
            </p>
          </div>
          <button className="text-xs font-medium text-[#9747FF] hover:text-[#0F0820] transition-colors">
            Ver detalhes →
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function Spec({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="text-[#9747FF]">{icon}</div>
      <span className="text-sm font-medium text-[#0F0820]">{value}</span>
      <span className="text-[10px] text-[#0F0820]/45 uppercase tracking-wider">{label}</span>
    </div>
  );
}
